
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const WhatsAppAdCreator: React.FC = () => {
  const [businessName, setBusinessName] = useState('MiN NEW YORK');
  const [welcomeMessage, setWelcomeMessage] = useState('Welcome to MiN NEW YORK. How can we help you with our luxury fragrances today?');
  const [categoryType, setCategoryType] = useState('retail');
  const [ctaType, setCtaType] = useState('shop_now');
  const [phoneNumber, setPhoneNumber] = useState('+1 (212) 123-4567');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: 'WhatsApp CTWA Created',
        description: 'Your Click-to-WhatsApp ad has been created successfully.',
      });
    }, 1500);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h3 className="text-lg font-medium">WhatsApp Ad Details</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="business-name">Business Name</Label>
            <Input 
              id="business-name" 
              value={businessName} 
              onChange={(e) => setBusinessName(e.target.value)} 
              placeholder="Enter business name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="welcome-message">Welcome Message</Label>
            <Textarea 
              id="welcome-message" 
              value={welcomeMessage} 
              onChange={(e) => setWelcomeMessage(e.target.value)} 
              placeholder="Enter welcome message"
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone-number">WhatsApp Business Phone Number</Label>
            <Input 
              id="phone-number" 
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)} 
              placeholder="+1 (###) ###-####"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Business Category</Label>
            <Select value={categoryType} onValueChange={setCategoryType}>
              <SelectTrigger>
                <SelectValue placeholder="Select business category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="luxury">Luxury Goods</SelectItem>
                <SelectItem value="beauty">Beauty & Cosmetics</SelectItem>
                <SelectItem value="ecommerce">E-Commerce</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cta-type">Call to Action Button</Label>
            <Select value={ctaType} onValueChange={setCtaType}>
              <SelectTrigger>
                <SelectValue placeholder="Select CTA type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shop_now">Shop Now</SelectItem>
                <SelectItem value="learn_more">Learn More</SelectItem>
                <SelectItem value="contact_us">Contact Us</SelectItem>
                <SelectItem value="message_us">Message Us</SelectItem>
                <SelectItem value="book_now">Book Appointment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Ad...' : 'Create WhatsApp Campaign'}
          </Button>
        </form>
      </div>
      
      <div className="space-y-6">
        <h3 className="text-lg font-medium">WhatsApp Ad Preview</h3>
        
        <Card>
          <CardContent className="p-4">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border">
              <div className="p-3 bg-[#075E54] text-white text-center font-medium">
                WhatsApp Business
              </div>
              
              <div className="p-4 border-b">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-lg">M</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{businessName}</h4>
                    <p className="text-xs text-gray-500">Typically replies instantly</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 max-h-48 overflow-y-auto bg-[#ECE5DD]">
                <div className="ml-auto max-w-[70%] bg-[#DCF8C6] rounded-lg p-2 mb-2">
                  <p className="text-sm">Hello, I'm interested in your fragrances.</p>
                  <p className="text-[10px] text-gray-500 text-right">11:32</p>
                </div>
                
                <div className="max-w-[70%] bg-white rounded-lg p-2">
                  <p className="text-sm">{welcomeMessage}</p>
                  <p className="text-[10px] text-gray-500 text-right">11:33</p>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50">
                <Button className="w-full bg-[#25D366] hover:bg-[#128C7E]">
                  {ctaType === 'shop_now' ? 'Shop Now' : 
                   ctaType === 'learn_more' ? 'Learn More' :
                   ctaType === 'contact_us' ? 'Contact Us' :
                   ctaType === 'message_us' ? 'Message Us' : 'Book Appointment'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Estimated Performance</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Click-through Rate:</span>
              <span>4.2% - 5.8%</span>
            </div>
            <div className="flex justify-between">
              <span>Conversation Rate:</span>
              <span>18% - 25%</span>
            </div>
            <div className="flex justify-between">
              <span>Est. Cost per Message:</span>
              <span>$2.10 - $3.50</span>
            </div>
            <div className="flex justify-between">
              <span>Recommended Budget:</span>
              <span>$300 - $600</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppAdCreator;
