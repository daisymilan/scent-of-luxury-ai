
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { callGrokApi, getGrokApiConfig } from '@/utils/grokApi';
import { useToast } from '@/hooks/use-toast';
import { WooProduct } from '@/utils/woocommerce/types';

interface SEOAIAnalysisProps {
  product: WooProduct | null;
  onClose: () => void;
}

type AnalysisStatus = 'idle' | 'loading' | 'success' | 'error';
type SeverityLevel = 'critical' | 'warning' | 'suggestion' | 'positive';

interface SEOSuggestion {
  message: string;
  severity: SeverityLevel;
  explanation: string;
}

const SEOAIAnalysis: React.FC<SEOAIAnalysisProps> = ({ product, onClose }) => {
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [suggestions, setSuggestions] = useState<SEOSuggestion[]>([]);
  const [overallScore, setOverallScore] = useState<number | null>(null);
  const { toast } = useToast();

  const runAnalysis = async () => {
    if (!product) return;
    
    const grokConfig = getGrokApiConfig();
    if (!grokConfig) {
      toast({
        title: "Grok API Not Configured",
        description: "Please configure the Grok API in the Integrations settings",
        variant: "destructive",
      });
      return;
    }

    setStatus('loading');
    
    try {
      // Prepare prompt for AI analysis
      const prompt = `
        Please analyze the following WooCommerce product for SEO optimization:
        
        Title: ${product.name}
        Description: ${product.description?.replace(/<[^>]*>/g, '') || ''}
        Short Description: ${product.short_description?.replace(/<[^>]*>/g, '') || ''}
        Categories: ${product.categories?.map(c => c.name).join(', ') || ''}
        
        Provide an SEO analysis with the following JSON format:
        {
          "overallScore": (number between 0-100),
          "suggestions": [
            {
              "message": "Brief suggestion title",
              "severity": "critical|warning|suggestion|positive",
              "explanation": "Detailed explanation of the issue and how to fix it"
            }
          ]
        }

        Focus on title optimization, keyword usage, meta description, content quality, and readability.
        Keep explanations concise but actionable.
      `;

      const response = await callGrokApi(prompt);
      console.log('Grok SEO Analysis Response:', response);
      
      // Parse the response
      try {
        // Extract JSON if it's within markdown code blocks or regular text
        const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || 
                         response.match(/```\n([\s\S]*?)\n```/) || 
                         response.match(/{[\s\S]*}/);
                         
        const jsonStr = jsonMatch ? jsonMatch[0].replace(/```json\n|```\n|```/g, '') : response;
        const analysisResult = JSON.parse(jsonStr);
        
        if (analysisResult.suggestions && analysisResult.overallScore) {
          setSuggestions(analysisResult.suggestions);
          setOverallScore(analysisResult.overallScore);
          setStatus('success');
        } else {
          throw new Error('Invalid response format');
        }
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        toast({
          title: "Analysis Error",
          description: "Could not parse the AI response. Please try again.",
          variant: "destructive",
        });
        setStatus('error');
      }
    } catch (error) {
      console.error('SEO Analysis Error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze product SEO",
        variant: "destructive",
      });
      setStatus('error');
    }
  };

  const getSeverityIcon = (severity: SeverityLevel) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'suggestion':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'positive':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
  };

  const getSeverityColor = (severity: SeverityLevel) => {
    switch (severity) {
      case 'critical':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-amber-200 bg-amber-50';
      case 'suggestion':
        return 'border-blue-200 bg-blue-50';
      case 'positive':
        return 'border-green-200 bg-green-50';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };
  
  // If no product is selected
  if (!product) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <AlertTitle>No Product Selected</AlertTitle>
            <AlertDescription>
              Please select a product to analyze its SEO.
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI SEO Analysis</CardTitle>
        <CardDescription>
          AI-powered SEO analysis for "{product.name}"
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === 'idle' && (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="mb-4 text-center text-gray-500">
              Run an AI-powered SEO analysis of this product to get improvement suggestions.
            </p>
            <Button onClick={runAnalysis}>
              Run SEO Analysis
            </Button>
          </div>
        )}

        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-center text-gray-500">
              Analyzing product SEO... This may take a few moments.
            </p>
          </div>
        )}

        {status === 'success' && overallScore !== null && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Overall SEO Score</h3>
                <p className="text-gray-500 text-sm">Based on title, description, keywords and content</p>
              </div>
              <div className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
                {overallScore}/100
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Improvement Suggestions</h3>
              
              {suggestions.length === 0 ? (
                <p className="text-gray-500">No suggestions found.</p>
              ) : (
                suggestions.map((suggestion, index) => (
                  <div 
                    key={index}
                    className={`border rounded-lg p-4 ${getSeverityColor(suggestion.severity)}`}
                  >
                    <div className="flex items-start gap-3">
                      {getSeverityIcon(suggestion.severity)}
                      <div>
                        <h4 className="font-medium">{suggestion.message}</h4>
                        <p className="text-sm mt-1">{suggestion.explanation}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={runAnalysis}>
                Re-analyze
              </Button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertTitle>Analysis Failed</AlertTitle>
              <AlertDescription>
                Could not complete the SEO analysis. Please check your Grok API configuration
                and try again.
              </AlertDescription>
            </Alert>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={runAnalysis}>
                Try Again
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SEOAIAnalysis;
