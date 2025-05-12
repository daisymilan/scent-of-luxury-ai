
import { useState, useEffect } from 'react';
import { WooProduct } from '@/utils/woocommerce/types';

interface TopProduct {
  id: number;
  name: string;
  sales: number;
  revenue: number;
  image: string;
}

export const useFormattedProducts = (products: WooProduct[] | undefined): TopProduct[] => {
  const [topProductsList, setTopProductsList] = useState<TopProduct[]>([]);

  useEffect(() => {
    // Format top products from WooCommerce data
    if (products && products.length > 0) {
      const formattedProducts = products
        .filter(product => product.name && product.id)
        .sort((a, b) => (b.total_sales || 0) - (a.total_sales || 0))
        .slice(0, 4)
        .map(product => ({
          id: product.id,
          name: product.name,
          sales: product.total_sales || 0,
          revenue: parseFloat(product.price || '0') * (product.total_sales || 0),
          image: product.images && product.images.length > 0 ? product.images[0].src : '/placeholder.svg'
        }));
      
      setTopProductsList(formattedProducts);
    } else {
      setTopProductsList([]);
    }
  }, [products]);

  return topProductsList;
};
