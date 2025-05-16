
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface SEOFiltersProps {
  categories: Category[] | null | undefined;
  selectedCategory: string;
  searchQuery: string;
  onCategoryChange: (value: string) => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const SEOFilters: React.FC<SEOFiltersProps> = ({
  categories,
  selectedCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
  disabled = false
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div className="w-full md:w-1/3">
        <Select value={selectedCategory} onValueChange={onCategoryChange} disabled={disabled}>
          <SelectTrigger className={disabled ? "bg-slate-100" : ""}>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Categories</SelectItem>
              {categories && categories.length > 0 ? (
                categories.map(category => (
                  <SelectItem key={category.id} value={category.slug}>{category.name}</SelectItem>
                ))
              ) : (
                <SelectItem value="loading" disabled>Loading categories...</SelectItem>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full md:w-2/3 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input 
          type="search" 
          placeholder="Search products..." 
          className="pl-10"
          value={searchQuery}
          onChange={onSearchChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default SEOFilters;
