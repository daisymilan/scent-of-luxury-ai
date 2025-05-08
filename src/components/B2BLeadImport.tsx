
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileUp, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import { B2BLead } from '@/utils/b2bUtils';

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        toast({
          title: "Invalid file format",
          description: "Please upload a CSV file",
          variant: "destructive"
        });
        return;
      }
      setFile(selectedFile);
      setHasPreviewedData(false);
    }
  };

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
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
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
      error: (error) => {
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
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
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
          const mappedLeads = results.data.map((row: any, index: number) => {
            // Map fields with some intelligent field matching
            const lead: Partial<B2BLead> = {
              id: `import-${Date.now()}-${index}`,
              companyName: row.companyName || row.company || row.Company || row['Company Name'] || row.business || 'Unknown Company',
              industry: row.industry || row.Industry || row.sector || row.Sector || row.category || row.Category || 'Other',
              contactName: row.contactName || row.contact || row.Contact || row.name || row.Name || 
                           `${row.firstName || row.FirstName || ''} ${row.lastName || row.LastName || ''}`.trim() || 'Unknown Contact',
              contactEmail: row.email || row.Email || row.contactEmail || row['Contact Email'] || '',
              contactPhone: row.phone || row.Phone || row.contactPhone || row['Contact Phone'] || '',
              website: row.website || row.Website || row.url || row.URL || '',
              location: row.location || row.Location || row.address || row.Address || 
                        `${row.city || row.City || ''}, ${row.country || row.Country || ''}`.trim() || 'Unknown',
              status: 'new',
              notes: row.notes || row.Notes || row.comments || row.Comments || '',
              tags: [row.tags || row.Tags || 'imported'].filter(Boolean),
              score: 50 // Default score for imported leads
            };
            
            // Clean up any empty strings
            Object.keys(lead).forEach(key => {
              if (lead[key as keyof typeof lead] === '') {
                delete lead[key as keyof typeof lead];
              }
            });
            
            return lead;
          });

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
      error: (error) => {
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
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
              {file ? (
                <div className="flex flex-col items-center">
                  <FileUp className="h-8 w-8 text-green-500 mb-2" />
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setFile(null)}
                  >
                    Change File
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Drag and drop or click to upload</p>
                  <Button variant="outline" size="sm" asChild>
                    <label htmlFor="csv-file" className="cursor-pointer">
                      Select CSV File
                      <input 
                        id="csv-file" 
                        type="file" 
                        className="sr-only" 
                        accept=".csv" 
                        onChange={handleFileChange}
                      />
                    </label>
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <p className="text-xs text-gray-500">
              Your CSV should include headers for company name, contact name, email, and other fields.
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
            <div className="border rounded-md overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(previewData[0]).slice(0, 5).map((header) => (
                      <th 
                        key={header} 
                        className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {previewData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.keys(row).slice(0, 5).map((key, cellIndex) => (
                        <td key={cellIndex} className="px-3 py-2 whitespace-nowrap truncate max-w-[150px]">
                          {row[key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="py-2 px-4 bg-gray-50 text-xs text-gray-500">
                Showing 5 of {file ? file.name : ''} rows. {Object.keys(previewData[0]).length} columns found.
              </div>
            </div>
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
