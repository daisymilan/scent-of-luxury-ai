
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { extractSEOData } from './seoUtils';

interface Product {
  id: number;
  name: string;
  categories?: Array<{id: number; name: string; slug: string}>;
  meta_data?: Array<{key: string; value: string}>;
}

interface SEOTableProps {
  products: Product[];
  sortOrder: 'asc' | 'desc';
  onToggleSortOrder: () => void;
  getScoreColor: (score: number) => string;
  isCEO?: boolean;
}

const SEOTable: React.FC<SEOTableProps> = ({
  products,
  sortOrder,
  onToggleSortOrder,
  getScoreColor,
  isCEO = true
}) => {
  // If no products, show message
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No products with SEO data found.
      </div>
    );
  }

  // For non-CEO users, show limited data
  if (!isCEO) {
    return (
      <div className="overflow-x-auto bg-white rounded-md border border-slate-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24 font-semibold">SEO Score</TableHead>
              <TableHead className="font-semibold">Product</TableHead>
              <TableHead className="hidden md:table-cell font-semibold">Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.slice(0, 3).map((product) => {
              const { seoScore } = extractSEOData(product);
              const categoryNames = product.categories?.map(c => c.name).join(', ') || '';
              
              return (
                <TableRow key={product.id} className="border-slate-200 hover:bg-slate-50">
                  <TableCell>
                    <Badge className={`${getScoreColor(Number(seoScore))} blur-sm hover:blur-none transition-all`}>
                      {Math.floor(Number(seoScore))}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {product.name}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-slate-600">
                    {categoryNames}
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4 text-sm text-gray-500 italic">
                Additional data requires CEO access
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  // Full table for CEO users
  return (
    <div className="overflow-x-auto bg-white rounded-md border border-slate-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24 font-semibold">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-transparent p-0 font-semibold"
                onClick={onToggleSortOrder}
              >
                SEO Score
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="font-semibold">Product</TableHead>
            <TableHead className="hidden md:table-cell font-semibold">SEO Title</TableHead>
            <TableHead className="hidden md:table-cell font-semibold">Focus Keyword</TableHead>
            <TableHead className="hidden lg:table-cell font-semibold">Description</TableHead>
            <TableHead className="hidden md:table-cell font-semibold">Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const { seoScore, seoTitle, seoDescription, focusKeyword } = extractSEOData(product);
            const categoryNames = product.categories?.map(c => c.name).join(', ') || '';
            
            return (
              <TableRow key={product.id} className="border-slate-200 hover:bg-slate-50">
                <TableCell>
                  <Badge className={getScoreColor(Number(seoScore))}>
                    {Math.floor(Number(seoScore))}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {product.name}
                </TableCell>
                <TableCell className="hidden md:table-cell text-slate-600">
                  {seoTitle || '-'}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {focusKeyword ? (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
                      {focusKeyword}
                    </Badge>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-slate-600 max-w-xs truncate">
                  {seoDescription || '-'}
                </TableCell>
                <TableCell className="hidden md:table-cell text-slate-600">
                  {categoryNames}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default SEOTable;
