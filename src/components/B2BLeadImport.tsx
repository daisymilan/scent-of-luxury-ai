
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';
import { B2BLead } from '@/utils/b2bUtils';
import CSVFileUploader from './b2b/CSVFileUploader';
import CSVDataPreview from './b2b/CSVDataPreview';
import { parseCSVFile, mapCSVDataToLeads } from './b2b/csvParsingUtils';

interface B2BLeadImportProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (leads: Partial<B2BLead>[]) => void;
}

const B2BLeadImport = ({ isOpen, onClose, onImportSuccess }: B2BLeadImportProps) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [hasPreviewedData, setHasPreviewedData] = useState(false);

  const previewCSV = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file first",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    parseCSVFile(file, {
      onComplete: (results) => {
        if (results.errors.length > 0) {
          toast({
            title: "Error parsing CSV",
            description: results.errors[0].message,
            variant: "destructive"
          });
          setIsUploading(false);
          return;
        }
        
        // Show preview of first 5 rows
        setPreviewData(results.data.slice(0, 5));
        setHasPreviewedData(true);
        setIsUploading(false);
      },
      onError: (error) => {
        toast({
          title: "Error parsing CSV",
          description: error.message,
          variant: "destructive"
        });
        setIsUploading(false);
      }
    });
  };

  const processImport = () => {
    if (!file || !hasPreviewedData) {
      toast({
        title: "Preview required",
        description: "Please preview your data before importing",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    parseCSVFile(file, {
      onComplete: (results) => {
        if (results.errors.length > 0) {
          toast({
            title: "Error parsing CSV",
            description: results.errors[0].message,
            variant: "destructive"
          });
          setIsUploading(false);
          return;
        }

        try {
          // Map CSV data to B2B lead structure
          const mappedLeads = mapCSVDataToLeads(results);
          
          // Filter out any leads without a companyName
          const validLeads = mappedLeads.filter(lead => lead.companyName && lead.companyName !== 'Unknown Company');
          
          if (validLeads.length === 0) {
            toast({
              title: "No valid leads found",
              description: "Ensure your CSV contains company name data",
              variant: "destructive"
            });
            setIsUploading(false);
            return;
          }
          
          onImportSuccess(validLeads);
          
          toast({
            title: "Import successful",
            description: `Imported ${validLeads.length} leads from CSV`,
          });
          
          setFile(null);
          setPreviewData([]);
          setHasPreviewedData(false);
          setIsUploading(false);
          onClose();
          
        } catch (error) {
          console.error('Error processing CSV import:', error);
          toast({
            title: "Import failed",
            description: "Error processing the CSV data. Please check the format.",
            variant: "destructive"
          });
          setIsUploading(false);
        }
      },
      onError: (error) => {
        toast({
          title: "Error parsing CSV",
          description: error.message,
          variant: "destructive"
        });
        setIsUploading(false);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import B2B Leads from CSV</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="csv-file">Upload CSV File</Label>
            <CSVFileUploader file={file} setFile={setFile} />
          </div>
          
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <p className="text-xs text-gray-500">
              Your CSV should include columns like Company Name, Full Name, Email, Industry, and other LinkedIn data.
            </p>
          </div>
          
          {file && (
            <Button 
              variant="outline" 
              onClick={previewCSV}
              disabled={isUploading}
            >
              Preview Data
            </Button>
          )}
          
          {previewData.length > 0 && (
            <CSVDataPreview previewData={previewData} fileName={file ? file.name : ''} />
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={processImport} 
            disabled={!hasPreviewedData || isUploading}
          >
            {isUploading ? "Processing..." : "Import Leads"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default B2BLeadImport;
