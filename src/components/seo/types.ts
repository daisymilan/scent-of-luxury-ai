
export interface SEODashboardProps {
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  productsWithSEO: Array<{
    id: number;
    name: string;
    categories?: Array<{
      id: number;
      name: string;
      slug: string;
    }>;
    meta_data?: Array<{
      key: string;
      value: string;
    }>;
  }>;
}
