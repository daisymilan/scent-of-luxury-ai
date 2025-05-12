
import { WooProduct } from '@/utils/woocommerce/types';

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface SEODashboardProps {
  categories: Category[];
  productsWithSEO: WooProduct[];
}

export interface SEOFiltersProps {
  categories: Category[];
  selectedCategory: string;
  searchQuery: string;
  onCategoryChange: (value: string) => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface SEOTableProps {
  products: WooProduct[];
  sortOrder: 'asc' | 'desc';
  onToggleSortOrder: () => void;
  getScoreColor: (score: number) => string;
}
