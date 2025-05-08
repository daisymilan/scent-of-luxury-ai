
import Papa from 'papaparse';
import { B2BColumnMapping } from '@/pages/B2BPage';
import { B2BLead } from '@/utils/b2bUtils';

// Find matching column in CSV based on our mapping
export const findMatchingField = (header: string, columnMapping: Record<string, string[]>): string | null => {
  const normalizedHeader = header.toLowerCase().trim();
  
  for (const [field, possibleNames] of Object.entries(columnMapping)) {
    if (possibleNames.some(name => name.toLowerCase() === normalizedHeader)) {
      return field;
    }
  }
  
  return null;
};

export const parseCSVFile = (file: File, options: {
  onComplete: (results: any) => void;
  onError: (error: any) => void;
}) => {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: options.onComplete,
    error: options.onError
  });
};

export const mapCSVDataToLeads = (results: any): Partial<B2BLead>[] => {
  try {
    // Create a mapping from CSV headers to our data model
    const headerMap: Record<string, string> = {};
    const headers = Object.keys(results.data[0] || {});
    
    headers.forEach(header => {
      const match = findMatchingField(header, B2BColumnMapping);
      if (match) {
        headerMap[header] = match;
      }
    });
    
    // Map CSV data to B2B lead structure
    const mappedLeads = results.data.map((row: any, index: number) => {
      // Extract values based on header mapping
      const getValue = (field: string): string => {
        for (const [header, mappedField] of Object.entries(headerMap)) {
          if (mappedField === field && row[header] !== undefined) {
            return row[header];
          }
        }
        
        // Fallback to direct column matching if no mapping found
        return row[field] || '';
      };

      // Build contact name from parts if available
      const firstName = getValue('firstName') || '';
      const lastName = getValue('lastName') || '';
      const fullName = getValue('fullName') || `${firstName} ${lastName}`.trim();
      
      const lead: Partial<B2BLead> = {
        id: `import-${Date.now()}-${index}`,
        companyName: getValue('companyName') || 'Unknown Company',
        industry: getValue('industry') || 'Other',
        contactName: fullName || 'Unknown Contact',
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        contactEmail: getValue('email') || '',
        contactPhone: getValue('phone') || undefined,
        linkedInUrl: getValue('linkedInProfileUrl') || undefined,
        linkedInCompanyUrl: getValue('linkedInCompanyUrl') || undefined,
        linkedInCompanyId: getValue('linkedInCompanyId') || undefined,
        website: getValue('website') || undefined,
        domain: getValue('domain') || undefined,
        employeeCount: getValue('employeeCount') || undefined,
        location: getValue('location') || getValue('companyHQ') || 'Unknown',
        companyHQ: getValue('companyHQ') || undefined,
        jobTitle: getValue('jobTitle') || undefined,
        hasOpenProfile: getValue('openProfile') === 'Yes' || getValue('openProfile') === 'TRUE',
        hasPremiumLinkedIn: getValue('premiumLinkedIn') === 'Yes' || getValue('premiumLinkedIn') === 'TRUE',
        geoTag: getValue('geoTag') || undefined,
        status: 'new',
        notes: '',
        tags: [getValue('brand') || 'imported'].filter(Boolean),
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

    return mappedLeads;
  } catch (error) {
    console.error('Error mapping CSV data to leads:', error);
    return [];
  }
};
