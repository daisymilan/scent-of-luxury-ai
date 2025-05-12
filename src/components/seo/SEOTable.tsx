
import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { SEOTableProps } from './types';
import { extractSEOData } from './seoUtils';

const SEOTable: React.FC<SEOTableProps> = ({ 
  products, 
  sortOrder, 
  onToggleSortOrder,
  getScoreColor
}) => {
  return (
    <div className="overflow-x-auto bg-white rounded-md border border-slate-200">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="border-slate-200">
            <TableHead className="w-[90px] font-semibold text-slate-700">
              <Button variant="ghost" size="sm" onClick={onToggleSortOrder} className="flex items-center">
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
          {!products ? (
            <>
              <TableRow>
                <TableCell><Skeleton className="h-4 w-[75px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Skeleton className="h-4 w-[75px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
              </TableRow>
            </>
          ) : products.map((product) => {
            const { seoScore, seoTitle, seoDescription, focusKeyword } = extractSEOData(product);
            
            return (
              <TableRow key={product.id} className="border-slate-200 hover:bg-slate-50">
                <TableCell className="py-3">
                  <Badge className={`${getScoreColor(Number(seoScore))} font-semibold px-3 py-1 rounded-md`}>
                    {seoScore}
                  </Badge>
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
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default SEOTable;
