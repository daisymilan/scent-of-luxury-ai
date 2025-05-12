import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { ArrowDown, ArrowUp, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { WooProduct } from '@/utils/woocommerce';

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
  const [selectedCategory, setSelectedCategory] = React.useState<string>("");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');

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

  // Sort products based on SEO score
  const sortedProducts = React.useMemo(() => {
    const sorted = [...filteredProducts];
    sorted.sort((a, b) => {
      const aScore = a.meta_data?.find(meta => meta.key === 'rank_math_seo_score')?.value || 0;
      const bScore = b.meta_data?.find(meta => meta.key === 'rank_math_seo_score')?.value || 0;

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
    <Card>
      <CardHeader>
        <CardTitle>SEO Dashboard</CardTitle>
        <CardDescription>Analyze and improve your product SEO</CardDescription>
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
                    </TableRow>
                  </>
                ) : sortedProducts.map((product) => {
                  const seoScore = product.meta_data?.find(meta => meta.key === 'rank_math_seo_score')?.value || 0;
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Badge variant="secondary">{seoScore}</Badge>
                      </TableCell>
                      <TableCell>
                        {product.name}
                      </TableCell>
                      <TableCell>
                        {product.short_description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2" 
                             dangerouslySetInnerHTML={{ __html: product.short_description }} />
                        )}
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
