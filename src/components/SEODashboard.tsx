
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import SEOFilters from './seo/SEOFilters';
import SEOTable from './seo/SEOTable';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import { getScoreColor } from './seo/seoUtils';
import { SEODashboardProps } from './seo/types';

const SEODashboard: React.FC<SEODashboardProps> = ({ categories, productsWithSEO }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();
  const { userRole } = useAuth();
  const isCEO = userRole === 'CEO';
  
  console.log("SEODashboard - userRole:", userRole, "isCEO:", isCEO);
  console.log("Categories:", categories);
  console.log("Products with SEO:", productsWithSEO);

  // Filter products based on selected category and search query
  const filteredProducts = useMemo(() => {
    let filtered = productsWithSEO || [];

    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(product =>
        product.categories?.some(cat => cat.slug === selectedCategory)
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [productsWithSEO, selectedCategory, searchQuery]);

  // Sort products based on AIOSEO score
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    sorted.sort((a, b) => {
      const aScore = Number(a.meta_data?.find(meta => meta.key === '_aioseo_seo_score')?.value || 0);
      const bScore = Number(b.meta_data?.find(meta => meta.key === '_aioseo_seo_score')?.value || 0);
      
      if (sortOrder === 'asc') {
        return aScore - bScore;
      } else {
        return bScore - aScore;
      }
    });
    return sorted;
  }, [filteredProducts, sortOrder]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  // Render pending access notice or CEO badge
  const renderAccessBanner = () => {
    if (isCEO) {
      return (
        <div className="bg-blue-50 p-4 mb-4 rounded-md flex items-center gap-3 border border-blue-200">
          <ShieldCheck className="h-5 w-5 text-blue-500" />
          <div>
            <h4 className="font-medium text-blue-800">CEO Access Granted</h4>
            <p className="text-sm text-blue-700">
              You have full access to all SEO analytics data.
            </p>
          </div>
          <Badge variant="outline" className="ml-auto bg-blue-100 text-blue-800 border-blue-200">
            CEO
          </Badge>
        </div>
      );
    }
    
    return (
      <div className="bg-amber-50 p-4 mb-4 rounded-md flex items-center gap-3 border border-amber-200">
        <AlertCircle className="h-5 w-5 text-amber-500" />
        <div>
          <h4 className="font-medium text-amber-800">Feature Access Pending</h4>
          <p className="text-sm text-amber-700">
            Full SEO analytics are available to CEO accounts. Your access is pending approval.
          </p>
        </div>
        <Badge variant="outline" className="ml-auto bg-amber-100 text-amber-800 border-amber-200">
          Pending
        </Badge>
      </div>
    );
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-6">
        <CardTitle className="text-slate-800 text-2xl font-semibold">All in One SEO Analysis</CardTitle>
        <CardDescription className="text-slate-600">
          Analyze and improve your product SEO with data from All in One SEO
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-6">
          {renderAccessBanner()}

          <SEOFilters 
            categories={categories || []}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onCategoryChange={handleCategoryChange}
            onSearchChange={handleSearchChange}
            disabled={!isCEO}
          />

          <SEOTable 
            products={sortedProducts}
            sortOrder={sortOrder}
            onToggleSortOrder={toggleSortOrder}
            getScoreColor={getScoreColor}
            isCEO={isCEO}
          />
          
          <div className="text-center text-sm text-slate-500 pt-2">
            Showing {sortedProducts?.length || 0} products with AIOSEO data
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SEODashboard;
