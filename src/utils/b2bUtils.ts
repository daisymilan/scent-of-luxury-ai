
/**
 * B2B Utilities for lead generation and cleaning
 */

// Types for B2B leads data
export interface B2BLead {
  id: string;
  companyName: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  linkedInUrl?: string;
  website?: string;
  location: string;
  status: 'new' | 'contacted' | 'qualified' | 'negotiating' | 'customer' | 'lost';
  notes?: string;
  lastContactDate?: string;
  tags: string[];
  score?: number; // Lead score based on relevance criteria
}

// Sample data for B2B leads
export const sampleLeads: B2BLead[] = [
  {
    id: '1',
    companyName: 'Saks Fifth Avenue',
    industry: 'Luxury Retail',
    contactName: 'Alexandra Morgan',
    contactEmail: 'alexandra.morgan@saksfifthavenue.com',
    contactPhone: '+1-212-555-1234',
    linkedInUrl: 'https://linkedin.com/in/alexandra-morgan-saks',
    website: 'https://www.saksfifthavenue.com',
    location: 'New York, NY',
    status: 'qualified',
    notes: 'Interested in our luxury fragrances line for their spring collection',
    lastContactDate: '2025-04-28',
    tags: ['luxury retailer', 'department store', 'high priority'],
    score: 85
  },
  {
    id: '2',
    companyName: 'Neiman Marcus',
    industry: 'Luxury Retail',
    contactName: 'James Wilson',
    contactEmail: 'jwilson@neimanmarcus.com',
    contactPhone: '+1-214-555-6789',
    linkedInUrl: 'https://linkedin.com/in/james-wilson-nm',
    website: 'https://www.neimanmarcus.com',
    location: 'Dallas, TX',
    status: 'contacted',
    lastContactDate: '2025-05-01',
    tags: ['luxury retailer', 'department store'],
    score: 78
  },
  {
    id: '3',
    companyName: 'Galeries Lafayette',
    industry: 'Luxury Retail',
    contactName: 'Marie Dubois',
    contactEmail: 'mdubois@galerieslafayette.com',
    contactPhone: '+33-1-42-82-3456',
    linkedInUrl: 'https://linkedin.com/in/marie-dubois-gl',
    website: 'https://www.galerieslafayette.com',
    location: 'Paris, France',
    status: 'new',
    tags: ['luxury retailer', 'department store', 'international'],
    score: 72
  },
  {
    id: '4',
    companyName: 'Harrods',
    industry: 'Luxury Retail',
    contactName: 'Oliver Bennett',
    contactEmail: 'oliver.bennett@harrods.com',
    contactPhone: '+44-20-7730-1234',
    linkedInUrl: 'https://linkedin.com/in/oliver-bennett-hr',
    website: 'https://www.harrods.com',
    location: 'London, UK',
    status: 'negotiating',
    lastContactDate: '2025-04-15',
    tags: ['luxury retailer', 'department store', 'international', 'high priority'],
    score: 90
  },
  {
    id: '5',
    companyName: 'Lane Crawford',
    industry: 'Luxury Retail',
    contactName: 'Lin Wei',
    contactEmail: 'lin.wei@lanecrawford.com',
    contactPhone: '+852-2118-2288',
    linkedInUrl: 'https://linkedin.com/in/lin-wei-lc',
    website: 'https://www.lanecrawford.com',
    location: 'Hong Kong',
    status: 'contacted',
    lastContactDate: '2025-04-22',
    tags: ['luxury retailer', 'department store', 'international', 'asia'],
    score: 75
  }
];

// Function to clean and normalize LinkedIn data
export const cleanLinkedInData = (rawData: any[]): Partial<B2BLead>[] => {
  // This is a placeholder function that would typically:
  // 1. Remove duplicates
  // 2. Format/standardize company names
  // 3. Extract relevant contact information
  // 4. Match against existing leads
  // 5. Score leads based on relevance criteria
  
  console.log('Cleaning LinkedIn data:', rawData.length, 'records');
  
  // In a real implementation, this would process actual scraped data
  // For now, we'll return our sample data
  return sampleLeads;
};

// Function to generate a B2B outreach workflow
export const generateN8nWorkflow = (leads: B2BLead[]): string => {
  // This would generate a JSON representation of an n8n workflow
  // to automate outreach to these leads
  
  console.log('Generating outreach workflow for', leads.length, 'leads');
  
  // In a real implementation, this would generate n8n workflow JSON
  return JSON.stringify({
    "nodes": [
      {
        "name": "Start",
        "type": "n8n-nodes-base.start",
        "position": [100, 300],
        "parameters": {}
      },
      {
        "name": "Segment Leads",
        "type": "n8n-nodes-base.function",
        "position": [300, 300],
        "parameters": {
          "functionCode": "// Code to segment leads by criteria"
        }
      },
      {
        "name": "Send Personalized Email",
        "type": "n8n-nodes-base.emailSend",
        "position": [500, 300],
        "parameters": {
          "from": "outreach@minewyork.com",
          "to": "={{ $json.contactEmail }}",
          "subject": "Exclusive Partnership Opportunity with MiN NEW YORK",
          "text": "={{ 'Dear ' + $json.contactName + ',\\n\\nI hope this email finds you well...'}}"
        }
      }
    ],
    "connections": {
      "Start": {
        "main": [[{ "node": "Segment Leads", "type": "main", "index": 0 }]]
      },
      "Segment Leads": {
        "main": [[{ "node": "Send Personalized Email", "type": "main", "index": 0 }]]
      }
    }
  }, null, 2);
};

// Save and retrieve B2B leads from localStorage
export const saveB2BLeads = (leads: B2BLead[]) => {
  localStorage.setItem('b2b_leads', JSON.stringify(leads));
};

export const getB2BLeads = (): B2BLead[] => {
  const leads = localStorage.getItem('b2b_leads');
  return leads ? JSON.parse(leads) : sampleLeads;
};
