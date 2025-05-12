
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
    <Card>
      <CardHeader>
        <CardTitle>AIOSEO Dashboard</CardTitle>
        <CardDescription>Analyze and improve your product SEO with data from All in One SEO</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center space-x-4">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[180px]">
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

            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                id="search"
                placeholder="Search products..."
                className="pl-8"
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Button variant="ghost" size="sm" onClick={toggleSortOrder}>
                      SEO Score
                      {sortOrder === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />}
                    </Button>
                  </TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>SEO Title</TableHead>
                  <TableHead>Focus Keyword</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
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
                    <TableRow key={product.id}>
                      <TableCell>
                        <Badge className={getScoreColor(Number(seoScore))}>{seoScore}</Badge>
                      </TableCell>
                      <TableCell>
                        {product.name}
                      </TableCell>
                      <TableCell>
                        <div className="line-clamp-2 max-w-xs">
                          {seoTitle}
                        </div>
                      </TableCell>
                      <TableCell>
                        {focusKeyword || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="line-clamp-2 max-w-xs">
                          {seoDescription || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.categories?.map((category) => (
                          <div key={category.id}>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default SEODashboard;
