import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById, getProductVariation } from '@/utils/woocommerce/productApi';
import { WooProduct, WooProductVariation } from '@/utils/woocommerce/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<WooProduct | null>(null);
  const [variation, setVariation] = useState<WooProductVariation | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (productId) {
          const id = parseInt(productId, 10);
          const fetchedProduct = await getProductById(id);
          setProduct(fetchedProduct);
        } else {
          setError('Product ID is missing.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch product.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const fetchVariation = async () => {
      if (product && selectedVariation) {
        try {
          const fetchedVariation = await getProductVariation(product.id, selectedVariation);
          setVariation(fetchedVariation);
        } catch (err: any) {
          console.error('Error fetching variation:', err);
          setError(err.message || 'Failed to fetch product variation.');
        }
      } else {
        setVariation(null);
      }
    };

    fetchVariation();
  }, [product, selectedVariation]);

  const handleAddToCart = () => {
    if (!product) {
      toast.error('Product not loaded.');
      return;
    }

    // Basic validation
    if (quantity <= 0) {
      toast.error('Quantity must be greater than 0.');
      return;
    }

    // Add to cart logic here
    toast.success(`${quantity} ${product.name} added to cart!`);
  };

  if (isLoading) {
    return <div>Loading product details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{product.name}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {product.images && product.images[0] && (
              <img 
                src={product.images[0].src} 
                alt={product.name} 
                className="w-full h-48 object-cover rounded-md"
              />
            )}
            {variation && variation.image && (
              <img 
                src={variation.image.src} 
                alt="Product variation" 
                className="w-full h-48 object-cover rounded-md"
              />
            )}
          </div>
          <div>
            <div className="mb-4">
              <Badge variant="secondary">
                {product.stock_status}
              </Badge>
            </div>
            <p className="text-gray-600">{product.description}</p>
            <Separator className="my-4" />
            <div className="flex items-center justify-between mb-2">
              <div className="text-xl font-semibold">
                Price: ${variation ? variation.price : product.price}
              </div>
            </div>
            {product.variations && product.variations.length > 0 && (
              <div className="mb-4">
                <Select onValueChange={(value) => setSelectedVariation(parseInt(value, 10))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a variation" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.variations.map((variationId) => (
                      <SelectItem key={variationId} value={variationId.toString()}>
                        Variation #{variationId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex items-center space-x-4">
              <div>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                  className="w-24"
                />
              </div>
              <div>
                <Button onClick={handleAddToCart}>Add to Cart</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetail;
