
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { ArrowDown, ArrowUp, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { WooProduct } from '@/utils/woocommerce/types';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface SEODashboardProps {
  categories: Category[];
  productsWithSEO: WooProduct[];
}

const SEODashboard: React.FC<SEODashboardProps> = ({ categories, productsWithSEO }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  // Filter products based on selected category and search query
  const filteredProducts = React.useMemo(() => {
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
  const sortedProducts = React.useMemo(() => {
    const sorted = [...filteredProducts];
    sorted.sort((a, b) => {
      const aScore = a.meta_data?.find(meta => meta.key === '_aioseo_seo_score')?.value || 0;
      const bScore = b.meta_data?.find(meta => meta.key === '_aioseo_seo_score')?.value || 0;

      const aScoreNum = typeof aScore === 'string' ? parseInt(aScore, 10) : Number(aScore);
      const bScoreNum = typeof bScore === 'string' ? parseInt(bScore, 10) : Number(bScore);

      if (sortOrder === 'asc') {
        return aScoreNum - bScoreNum;
      } else {
        return bScoreNum - aScoreNum;
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
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
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Label htmlFor="category" className="text-sm font-medium text-slate-700 whitespace-nowrap">Filter by:</Label>
              <Select onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-[180px] border-slate-300 bg-white">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 relative flex items-center">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="search"
                placeholder="Search products..."
                className="pl-10 border-slate-300 bg-white"
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-md border border-slate-200">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="border-slate-200">
                  <TableHead className="w-[90px] font-semibold text-slate-700">
                    <Button variant="ghost" size="sm" onClick={toggleSortOrder} className="flex items-center">
                      SEO Score
                      {sortOrder === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />}
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">Product</TableHead>
                  <TableHead className="font-semibold text-slate-700">SEO Title</TableHead>
                  <TableHead className="font-semibold text-slate-700">Focus Keyword</TableHead>
                  <TableHead className="font-semibold text-slate-700">Description</TableHead>
                  <TableHead className="font-semibold text-slate-700">Category</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!productsWithSEO ? (
                  <>
                    <TableRow>
                      <TableCell>
                        <Skeleton className="h-4 w-[75px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[150px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[200px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[150px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Skeleton className="h-4 w-[75px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[150px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[200px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[150px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                    </TableRow>
                  </>
                ) : sortedProducts.map((product) => {
                  const seoScore = product.meta_data?.find(meta => meta.key === '_aioseo_seo_score')?.value || 0;
                  const seoTitle = product.meta_data?.find(meta => meta.key === '_aioseo_title')?.value || product.name;
                  const seoDescription = product.meta_data?.find(meta => meta.key === '_aioseo_description')?.value || '';
                  const focusKeyword = product.meta_data?.find(meta => meta.key === '_aioseo_focus_keyword')?.value || '';
                  
                  return (
                    <TableRow key={product.id} className="border-slate-200 hover:bg-slate-50">
                      <TableCell className="py-3">
                        <Badge className={`${getScoreColor(Number(seoScore))} font-semibold px-3 py-1 rounded-md`}>{seoScore}</Badge>
                      </TableCell>
                      <TableCell className="font-medium text-slate-700">
                        {product.name}
                      </TableCell>
                      <TableCell>
                        <div className="line-clamp-2 max-w-xs text-slate-700">
                          {seoTitle}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-700">
                        {focusKeyword || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="line-clamp-2 max-w-xs text-slate-600 text-sm">
                          {seoDescription || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-700">
                        {product.categories?.map((category) => (
                          <div key={category.id} className="text-sm">
                            {category.name}
                          </div>
                        ))}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
          <div className="text-center text-sm text-slate-500 pt-2">
            Showing {sortedProducts?.length || 0} products with AIOSEO data
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SEODashboard;
