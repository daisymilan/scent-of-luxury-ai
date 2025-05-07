import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const InstagramAdCreator: React.FC = () => {
  const [adTitle, setAdTitle] = useState('New Spring Collection');
  const [adText, setAdText] = useState('Discover our exclusive spring fragrances. Limited edition, available now.');
  const [adImage, setAdImage] = useState('/placeholder.svg');
  const [adType, setAdType] = useState('carousel');
  const [adAudience, setAdAudience] = useState('luxury');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: 'Ad Created',
        description: 'Your Instagram ad campaign has been created successfully.',
      });
    }, 1500);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Ad Details</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ad-title">Ad Title</Label>
            <Input 
              id="ad-title" 
              value={adTitle} 
              onChange={(e) => setAdTitle(e.target.value)} 
              placeholder="Enter ad title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ad-text">Ad Text</Label>
            <Textarea 
              id="ad-text" 
              value={adText} 
              onChange={(e) => setAdText(e.target.value)} 
              placeholder="Enter ad text"
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ad-type">Ad Type</Label>
            <Select value={adType} onValueChange={setAdType}>
              <SelectTrigger>
                <SelectValue placeholder="Select ad type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="carousel">Carousel</SelectItem>
                <SelectItem value="single-image">Single Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="story">Story</SelectItem>
                <SelectItem value="collection">Collection</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="audience">Target Audience</Label>
            <Select value={adAudience} onValueChange={setAdAudience}>
              <SelectTrigger>
                <SelectValue placeholder="Select target audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="luxury">Luxury Shoppers</SelectItem>
                <SelectItem value="fragrance">Fragrance Enthusiasts</SelectItem>
                <SelectItem value="international">International Market</SelectItem>
                <SelectItem value="new">New Customers</SelectItem>
                <SelectItem value="repeat">Repeat Customers</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ad-image">Ad Image</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="ad-image"
                type="file"
                accept="image/*"
                className="w-full"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    // In a real app, you would upload this file
                    // For demo, we'll keep using the placeholder
                    setAdImage('/placeholder.svg');
                  }
                }}
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Ad...' : 'Create Ad Campaign'}
          </Button>
        </form>
      </div>
      
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Ad Preview</h3>
        
        <Card>
          <CardContent className="p-4">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-2 bg-gray-50 flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                <div className="text-sm font-medium">minyorkfragrance</div>
                <div className="ml-auto text-xs text-blue-500">Sponsored</div>
              </div>
              
              <AspectRatio ratio={1/1}>
                <img 
                  src={adImage} 
                  alt="Ad Preview" 
                  className="w-full h-full object-cover"
                />
              </AspectRatio>
              
              <div className="p-4 space-y-2">
                <div className="flex justify-between">
                  <div className="flex space-x-4">
                    <span>♥</span>
                    <span>💬</span>
                    <span>➤</span>
                  </div>
                  <span>⧠</span>
                </div>
                
                <div>
                  <p className="text-sm font-medium">minyorkfragrance</p>
                  <p className="text-sm">{adText}</p>
                </div>
                
                <Button variant="ghost" className="w-full text-xs">
                  {adType === 'carousel' ? 'Shop Now' : 'Learn More'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Estimated Performance</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Reach:</span>
              <span>15,000 - 30,000 people</span>
            </div>
            <div className="flex justify-between">
              <span>Engagement Rate:</span>
              <span>2.3% - 3.8%</span>
            </div>
            <div className="flex justify-between">
              <span>Est. Cost per Result:</span>
              <span>$1.20 - $2.40</span>
            </div>
            <div className="flex justify-between">
              <span>Recommended Budget:</span>
              <span>$500 - $1,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramAdCreator;
