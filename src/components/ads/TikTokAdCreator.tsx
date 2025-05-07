
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

const TikTokAdCreator: React.FC = () => {
  const [adCaption, setAdCaption] = useState('#perfume #fragrances #luxury New spring collection has dropped! 🌸✨');
  const [adType, setAdType] = useState('in_feed');
  const [audienceAge, setAudienceAge] = useState([18, 35]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleAudienceAgeChange = (value: number[]) => {
    setAudienceAge(value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: 'TikTok Ad Created',
        description: 'Your TikTok ad campaign has been created successfully.',
      });
    }, 1500);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h3 className="text-lg font-medium">TikTok Ad Details</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ad-caption">Ad Caption</Label>
            <Textarea 
              id="ad-caption" 
              value={adCaption} 
              onChange={(e) => setAdCaption(e.target.value)} 
              placeholder="Enter ad caption with hashtags"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ad-type">Ad Format</Label>
            <Select value={adType} onValueChange={setAdType}>
              <SelectTrigger>
                <SelectValue placeholder="Select ad format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in_feed">In-Feed Ads</SelectItem>
                <SelectItem value="topview">TopView</SelectItem>
                <SelectItem value="branded_hashtag">Branded Hashtag Challenge</SelectItem>
                <SelectItem value="branded_effect">Branded Effects</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <Label>Target Age Range</Label>
                <span className="text-sm text-gray-500">{audienceAge[0]} - {audienceAge[1]}</span>
              </div>
              <Slider 
                defaultValue={audienceAge}
                min={13} 
                max={65} 
                step={1} 
                value={audienceAge}
                onValueChange={handleAudienceAgeChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="video-upload">Upload Video (15-60 seconds)</Label>
            <Input
              id="video-upload"
              type="file"
              accept="video/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setVideoFile(e.target.files[0]);
                }
              }}
            />
            <p className="text-xs text-gray-500">
              Recommended: 9:16 aspect ratio, under 500MB
            </p>
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Ad...' : 'Create TikTok Campaign'}
          </Button>
        </form>
      </div>
      
      <div className="space-y-6">
        <h3 className="text-lg font-medium">TikTok Ad Preview</h3>
        
        <Card>
          <CardContent className="p-0 overflow-hidden">
            <div className="relative bg-black min-h-[500px] flex items-center justify-center rounded-lg">
              {videoFile ? (
                <video 
                  className="max-h-[500px] mx-auto" 
                  controls
                  src={URL.createObjectURL(videoFile)}
                />
              ) : (
                <div className="text-white text-center p-6">
                  <p className="mb-4">Video Preview</p>
                  <p className="text-sm opacity-70">Upload a video to see preview</p>
                </div>
              )}
              
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <p className="text-sm font-medium mb-1">@minyorkfragrance</p>
                <p className="text-sm mb-2">{adCaption}</p>
                
                <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-4">
                  <div className="bg-black bg-opacity-50 w-10 h-10 rounded-full flex items-center justify-center">
                    ❤️
                  </div>
                  <div className="bg-black bg-opacity-50 w-10 h-10 rounded-full flex items-center justify-center">
                    💬
                  </div>
                  <div className="bg-black bg-opacity-50 w-10 h-10 rounded-full flex items-center justify-center">
                    🔗
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Estimated Performance</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Views:</span>
              <span>50,000 - 100,000</span>
            </div>
            <div className="flex justify-between">
              <span>Engagement Rate:</span>
              <span>9.5% - 15.2%</span>
            </div>
            <div className="flex justify-between">
              <span>Est. Cost per View:</span>
              <span>$0.02 - $0.04</span>
            </div>
            <div className="flex justify-between">
              <span>Recommended Budget:</span>
              <span>$800 - $1,500</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TikTokAdCreator;
