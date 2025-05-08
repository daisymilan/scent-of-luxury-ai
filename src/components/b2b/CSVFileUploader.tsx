
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CSVFileUploaderProps {
  file: File | null;
  setFile: (file: File | null) => void;
}

const CSVFileUploader = ({ file, setFile }: CSVFileUploaderProps) => {
  const { toast } = useToast();

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
    }
  };

  return (
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
  );
};

export default CSVFileUploader;
