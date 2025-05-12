
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import SEOFilters from './seo/SEOFilters';
import SEOTable from './seo/SEOTable';
import { getScoreColor } from './seo/seoUtils';
import { SEODashboardProps } from './seo/types';

const SEODashboard: React.FC<SEODashboardProps> = ({ categories, productsWithSEO }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

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
          <SEOFilters 
            categories={categories}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onCategoryChange={handleCategoryChange}
            onSearchChange={handleSearchChange}
          />

          <SEOTable 
            products={sortedProducts}
            sortOrder={sortOrder}
            onToggleSortOrder={toggleSortOrder}
            getScoreColor={getScoreColor}
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
