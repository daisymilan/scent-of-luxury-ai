
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { WooProduct } from '@/utils/woocommerce/types';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

interface ProductDetailProps {
  products: WooProduct[];
  isLoading: boolean;
}

const ProductDetail = ({ products, isLoading }: ProductDetailProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Find product by ID
  const product = products.find(p => p.id === Number(id));
  
  // Handle back button click
  const handleBack = () => {
    navigate('/inventory');
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${product?.name} has been added to your cart.`,
    });
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-6">
          <Button variant="outline" size="sm" onClick={handleBack} className="gap-2">
            <ArrowLeft size={16} />
            Back to Products
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Skeleton className="w-full aspect-square rounded-lg" />
            <div className="grid grid-cols-4 gap-2 mt-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="w-full aspect-square rounded-md" />
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full max-w-xs" />
          </div>
        </div>
      </div>
    );
  }
  
  // Product not found
  if (!product) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-6">
          <Button variant="outline" size="sm" onClick={handleBack} className="gap-2">
            <ArrowLeft size={16} />
            Back to Products
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-semibold mb-2">Product Not Found</h2>
            <p className="text-gray-500 mb-4">The product you're looking for doesn't exist or has been removed.</p>
            <Button onClick={handleBack}>Return to Products</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Extract product images
  const images = product.images || [];
  const mainImage = images.length > 0 ? images[selectedImage] : { id: 0, src: '/placeholder.svg' };
  
  // Check if the product has variations
  const hasVariations = product.type === 'variable';
  
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <Button variant="outline" size="sm" onClick={handleBack} className="gap-2">
          <ArrowLeft size={16} />
          Back to Products
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="border rounded-lg overflow-hidden bg-white">
            <AspectRatio ratio={1 / 1}>
              <img 
                src={mainImage.src} 
                alt={product.name} 
                className="object-contain w-full h-full"
              />
            </AspectRatio>
          </div>
          
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {images.map((image, index) => (
                <div 
                  key={image.id}
                  className={`border rounded-md overflow-hidden cursor-pointer ${
                    selectedImage === index ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <AspectRatio ratio={1 / 1}>
                    <img 
                      src={image.src} 
                      alt={`${product.name} - Image ${index + 1}`} 
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold">
              {product.price_html ? (
                <div dangerouslySetInnerHTML={{ __html: product.price_html }} />
              ) : (
                <>
                  {product.on_sale && product.sale_price ? (
                    <>
                      <span className="text-gray-400 line-through mr-2">${product.regular_price}</span>
                      <span>${product.sale_price}</span>
                    </>
                  ) : (
                    <span>${product.price}</span>
                  )}
                </>
              )}
            </span>
          </div>
          
          <div 
            className="prose max-w-none" 
            dangerouslySetInnerHTML={{ __html: product.description || '' }} 
          />
          
          <div className="pt-4">
            {hasVariations ? (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">
                  This product has multiple variations. Please select options.
                </p>
                {/* Here you would render variation selectors */}
              </div>
            ) : (
              <Button onClick={handleAddToCart} className="gap-2">
                <ShoppingCart size={16} />
                Add to Cart
              </Button>
            )}
          </div>
          
          {/* Additional product metadata */}
          <div className="border-t pt-4 mt-6">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <strong>SKU:</strong> {product.sku || 'N/A'}
              </div>
              <div>
                <strong>Stock:</strong> {product.in_stock ? 'In Stock' : 'Out of Stock'}
              </div>
              <div>
                <strong>Categories:</strong> {product.categories?.map(c => c.name).join(', ') || 'None'}
              </div>
              <div>
                <strong>Tags:</strong> {product.tags?.map(t => t.name).join(', ') || 'None'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
