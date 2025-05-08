
import { BarChart2, CheckCircle, Circle, Info, Search, Settings, TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { seoPerformance } from '../lib/mockData';
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define the props interface for SEODashboard
interface SEODashboardProps {
  categories?: any[];
  productsWithSEO?: any[];
}

const SEODashboard = ({ categories, productsWithSEO }: SEODashboardProps) => {
  // We can use the passed data for enhanced functionality later
  // For now, we'll log it to verify we're receiving it correctly
  console.log('Categories received:', categories?.length);
  console.log('Products with SEO received:', productsWithSEO?.length);

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
      <Card className="col-span-full lg:col-span-1">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div className="flex items-center">
            <CardTitle className="text-lg font-medium">Keyword Rankings</CardTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 ml-1">
                  <Info size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">Rankings are updated daily from Google Search Console data</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Button className="h-8 text-xs" size="sm" variant="outline">
            <Settings size={14} className="mr-1" /> Configure
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {seoPerformance.keywords.map((keyword, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-100">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-medium text-sm">{keyword.keyword}</span>
                    {keyword.position <= 3 && (
                      <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200 text-xs">
                        Top 3
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <span className="mr-4">Position: {keyword.position}</span>
                    <span>Volume: {keyword.volume.toLocaleString()}/mo</span>
                  </div>
                </div>
                <div className={`flex items-center ${
                  keyword.change > 0 ? 'text-green-600' : 
                  keyword.change < 0 ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {keyword.change > 0 ? (
                    <TrendingUp size={16} className="mr-1" />
                  ) : keyword.change < 0 ? (
                    <TrendingDown size={16} className="mr-1" />
                  ) : (
                    <Circle size={16} className="mr-1" />
                  )}
                  <span className="text-sm">
                    {keyword.change > 0 ? `+${keyword.change}` : keyword.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-full lg:col-span-1">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">Top Pages</CardTitle>
          <Button className="h-8 text-xs" size="sm" variant="outline">
            <BarChart2 size={14} className="mr-1" /> Full Report
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {seoPerformance.pages.map((page, index) => (
              <div key={index} className="p-3 rounded-lg bg-white border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center overflow-hidden">
                    <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary mr-3 flex-shrink-0">
                      <Search size={16} />
                    </div>
                    <div className="truncate">
                      <p className="font-medium text-sm truncate">{page.url}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-500 mr-3">
                          {page.traffic.toLocaleString()} visits/mo
                        </span>
                        <span className="text-xs text-gray-500">
                          {page.conversion}% conversion
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="col-span-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">SEO Optimization Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="h-8 w-8 rounded bg-green-100 flex items-center justify-center text-green-600 mr-3">
                  <CheckCircle size={18} />
                </div>
                <h3 className="font-medium">Meta Tags</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">All product pages have optimized meta tags.</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '92%' }}></div>
                </div>
                <p className="text-xs text-gray-500">92% complete</p>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="h-8 w-8 rounded bg-yellow-100 flex items-center justify-center text-yellow-600 mr-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="font-medium">Content Optimization</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Some product descriptions need improvement.</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <p className="text-xs text-gray-500">65% complete</p>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="h-8 w-8 rounded bg-green-100 flex items-center justify-center text-green-600 mr-3">
                  <CheckCircle size={18} />
                </div>
                <h3 className="font-medium">Schema Markup</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Rich snippets implemented on all pages.</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
                <p className="text-xs text-gray-500">100% complete</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button className="mr-2" variant="outline">Run SEO Audit</Button>
            <Button>Fix Issues</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SEODashboard;
