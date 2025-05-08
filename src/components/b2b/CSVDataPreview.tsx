
interface CSVDataPreviewProps {
  previewData: any[];
  fileName: string;
}

const CSVDataPreview = ({ previewData, fileName }: CSVDataPreviewProps) => {
  if (previewData.length === 0) return null;

  // Get all headers from the preview data
  const headers = Object.keys(previewData[0]);

  return (
    <div className="border rounded-md overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header) => (
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
              {headers.map((key, cellIndex) => (
                <td key={cellIndex} className="px-3 py-2 whitespace-nowrap truncate max-w-[150px]">
                  {row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="py-2 px-4 bg-gray-50 text-xs text-gray-500">
        Showing preview of {fileName} with {previewData.length} rows and {headers.length} columns.
      </div>
    </div>
  );
};

export default CSVDataPreview;
