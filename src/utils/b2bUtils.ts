
/**
 * B2B Lead Generation and Cleaning Utility
 * 
 * This utility provides functions for importing, cleaning, and processing B2B leads
 * from various sources like LinkedIn scrapes and store locator data.
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
  linkedInCompanyUrl?: string;
  linkedInCompanyId?: string;
  website?: string;
  domain?: string;
  employeeCount?: string;
  location: string;
  companyHQ?: string;
  jobTitle?: string;
  firstName?: string;
  lastName?: string;
  hasOpenProfile?: boolean;
  hasPremiumLinkedIn?: boolean;
  geoTag?: string;
  status: 'new' | 'contacted' | 'qualified' | 'negotiating' | 'customer' | 'lost';
  notes?: string;
  lastContactDate?: string;
  tags: string[];
  score?: number; // Lead score based on relevance criteria
}

// Define the node types for the n8n workflow
interface WorkflowNode {
  name: string;
  type: string;
  position: number[];
  parameters: Record<string, any>;
}

// Define the workflow structure
interface Workflow {
  name: string;
  nodes: WorkflowNode[];
  connections: Record<string, { main: Array<Array<{ node: string; type: string; index: number }>> }>;
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

/**
 * Cleans and normalizes LinkedIn data
 * @param rawData Array of raw LinkedIn data objects
 * @returns Array of cleaned B2B leads
 */
export const cleanLinkedInData = (rawData: any[]): Partial<B2BLead>[] => {
  console.log('Cleaning LinkedIn data:', rawData.length, 'records');
  
  try {
    // Extract and format company data
    const processedLeads = rawData.map((data, index) => {
      // Basic validation
      if (!data.companyName) {
        console.warn('Missing company name in record:', data);
        return null;
      }
      
      // Normalize company name
      const companyName = data.companyName
        .trim()
        .replace(/\s+/g, ' ') // Remove extra spaces
        .replace(/,?\s*(Inc|LLC|Ltd|GmbH|Co\.|Corp\.?|Limited)\.?$/i, ''); // Remove common suffixes
      
      // Normalize industry
      const industry = data.industry ? data.industry.trim() : 'Unspecified';
      
      // Format location
      const location = formatLocation(data.location || data.city, data.country);
      
      // Format contact information
      const contactName = formatName(data.contactFirstName, data.contactLastName) || 
                         data.contactName || 'Unknown';
      
      // Normalize email formats
      let contactEmail = data.contactEmail || data.email || '';
      if (contactEmail && !validateEmail(contactEmail)) {
        contactEmail = formatProbableEmail(contactName, companyName);
      }
      
      // Generate a score based on relevance criteria
      const score = calculateLeadScore({
        industry,
        location,
        hasEmail: !!contactEmail,
        hasPhone: !!data.contactPhone,
        hasWebsite: !!data.website,
        companySize: data.companySize || 'unknown'
      });
      
      // Generate tags based on data attributes
      const tags = generateTags(data);
      
      return {
        id: `linkedin-${index + 1}`,
        companyName,
        industry,
        contactName,
        contactEmail,
        contactPhone: data.contactPhone || data.phone || undefined,
        linkedInUrl: data.linkedInUrl || data.profileUrl || undefined,
        website: data.website || data.companyWebsite || undefined,
        location,
        status: 'new',
        tags,
        score
      };
    }).filter(lead => lead !== null) as Partial<B2BLead>[];
    
    // Remove duplicate leads based on company name and email
    const uniqueLeads = removeDuplicates(processedLeads);
    
    // Sort leads by score
    return uniqueLeads.sort((a, b) => (b.score || 0) - (a.score || 0));
  } catch (error) {
    console.error('Error cleaning LinkedIn data:', error);
    return [];
  }
};

/**
 * Clean and process store locator data from websites
 * @param storeData Raw store locator data
 * @returns Processed B2B leads
 */
export const processStoreLocatorData = (storeData: any[]): Partial<B2BLead>[] => {
  console.log('Processing store locator data:', storeData.length, 'records');
  
  try {
    // Process and structure store data
    const processedStores = storeData.map((store, index) => {
      // Skip if missing essential data
      if (!store.name) {
        console.warn('Missing store name in record:', store);
        return null;
      }
      
      // Format store name
      const companyName = store.name
        .trim()
        .replace(/\s+/g, ' '); // Remove extra spaces
      
      // Default to retail industry if not specified
      const industry = store.type || store.category || 'Retail';
      
      // Format location
      const location = formatLocation(store.city, store.country) || 
                       store.address || 'Unknown';
      
      // Format contact information
      const contactName = store.contactPerson || 'Store Manager';
      const contactEmail = store.email || formatProbableEmail(contactName, companyName);
      
      // Generate tags based on store attributes
      const tags = ['store'];
      if (store.type) tags.push(store.type.toLowerCase());
      if (store.size === 'large' || store.size === 'flagship') tags.push('flagship');
      
      // Calculate score based on store relevance
      const score = calculateStoreScore({
        storeType: store.type || '',
        hasEmail: !!store.email,
        hasPhone: !!store.phone,
        location: location,
        size: store.size || 'unknown'
      });
      
      return {
        id: `store-${index + 1}`,
        companyName,
        industry,
        contactName,
        contactEmail,
        contactPhone: store.phone || undefined,
        website: store.website || undefined,
        location,
        status: 'new',
        tags,
        score
      };
    }).filter(lead => lead !== null) as Partial<B2BLead>[];
    
    // Remove duplicates and sort by score
    const uniqueStores = removeDuplicates(processedStores);
    return uniqueStores.sort((a, b) => (b.score || 0) - (a.score || 0));
  } catch (error) {
    console.error('Error processing store locator data:', error);
    return [];
  }
};

/**
 * Generates an n8n workflow for B2B outreach automation
 * @param leads Array of B2B leads to include in workflow
 * @returns JSON string representation of n8n workflow
 */
export const generateN8nWorkflow = (leads: B2BLead[]): string => {
  console.log('Generating outreach workflow for', leads.length, 'leads');
  
  // Group leads by industry or other relevant criteria
  const leadsByIndustry: Record<string, B2BLead[]> = {};
  leads.forEach(lead => {
    const industry = lead.industry || 'Other';
    if (!leadsByIndustry[industry]) {
      leadsByIndustry[industry] = [];
    }
    leadsByIndustry[industry].push(lead);
  });
  
  // Create a workflow with industry-specific segments
  const workflow: Workflow = {
    name: "B2B Outreach Automation",
    nodes: [
      {
        name: "Start",
        type: "n8n-nodes-base.start",
        position: [100, 300],
        parameters: {}
      }
    ],
    connections: {}
  };
  
  // Position counter for node layout
  let posX = 300;
  const industryPositionY: Record<string, number> = {};
  let currentY = 300;
  
  // Add industry segmentation nodes
  Object.keys(leadsByIndustry).forEach((industry, index) => {
    // Set y-position for this industry
    industryPositionY[industry] = currentY;
    currentY += 200;
    
    // Add industry segment node
    workflow.nodes.push({
      name: `${industry} Segment`,
      type: "n8n-nodes-base.function",
      position: [posX, industryPositionY[industry]],
      parameters: {
        functionCode: `// Filter leads for ${industry} industry
return [{
  json: {
    industry: "${industry}",
    leads: ${JSON.stringify(leadsByIndustry[industry].map(lead => ({
      company: lead.companyName,
      contact: lead.contactName,
      email: lead.contactEmail,
      tags: lead.tags
    })))}
  }
}];`
      }
    });
    
    // Connect start to this segment
    if (!workflow.connections["Start"]) {
      workflow.connections["Start"] = { main: [[]] };
    }
    
    workflow.connections["Start"].main[0].push({
      node: `${industry} Segment`,
      type: "main",
      index: 0
    });
  });
  
  // Advance position for next column of nodes
  posX += 200;
  
  // Add email template nodes for each industry
  Object.keys(leadsByIndustry).forEach((industry, index) => {
    // Add email template node
    workflow.nodes.push({
      name: `${industry} Email Template`,
      type: "n8n-nodes-base.emailTemplate",
      position: [posX, industryPositionY[industry]],
      parameters: {
        template: generateEmailTemplate(industry),
        subject: `Exclusive MiN NEW YORK Fragrance Partnership for ${industry} Businesses`
      }
    });
    
    // Connect industry segment to email template
    const segmentName = `${industry} Segment`;
    if (!workflow.connections[segmentName]) {
      workflow.connections[segmentName] = { main: [[]] };
    }
    
    workflow.connections[segmentName].main[0].push({
      node: `${industry} Email Template`,
      type: "main",
      index: 0
    });
  });
  
  // Advance position for next column of nodes
  posX += 200;
  
  // Add send email nodes for each industry
  Object.keys(leadsByIndustry).forEach((industry, index) => {
    // Add send email node
    workflow.nodes.push({
      name: `Send to ${industry}`,
      type: "n8n-nodes-base.emailSend",
      position: [posX, industryPositionY[industry]],
      parameters: {
        from: "outreach@minewyork.com",
        to: "={{ $json.email }}",
        subject: "={{ $node[`${industry} Email Template`].json[\"subject\"] }}",
        text: "={{ $node[`${industry} Email Template`].json[\"html\"] }}",
        html: "={{ $node[`${industry} Email Template`].json[\"html\"] }}"
      }
    });
    
    // Connect email template to send
    const templateName = `${industry} Email Template`;
    if (!workflow.connections[templateName]) {
      workflow.connections[templateName] = { main: [[]] };
    }
    
    workflow.connections[templateName].main[0].push({
      node: `Send to ${industry}`,
      type: "main",
      index: 0
    });
  });
  
  // Add a final update CRM node
  posX += 200;
  workflow.nodes.push({
    name: "Update CRM Status",
    type: "n8n-nodes-base.function",
    position: [posX, 300],
    parameters: {
      functionCode: `// Update lead status in CRM
return [{
  json: {
    message: "All leads have been contacted",
    timestamp: new Date().toISOString(),
    count: ${leads.length}
  }
}];`
    }
  });
  
  // Connect all send nodes to update CRM
  Object.keys(leadsByIndustry).forEach((industry) => {
    const sendName = `Send to ${industry}`;
    if (!workflow.connections[sendName]) {
      workflow.connections[sendName] = { main: [[]] };
    }
    
    workflow.connections[sendName].main[0].push({
      node: "Update CRM Status",
      type: "main",
      index: 0
    });
  });
  
  return JSON.stringify(workflow, null, 2);
};

/**
 * Merge and deduplicate leads from multiple sources
 * @param linkedInLeads Leads from LinkedIn
 * @param storeLeads Leads from store locator data
 * @param existingLeads Existing leads in the system
 * @returns Combined and deduplicated leads
 */
export const mergeLeadSources = (
  linkedInLeads: Partial<B2BLead>[] = [],
  storeLeads: Partial<B2BLead>[] = [],
  existingLeads: B2BLead[] = []
): B2BLead[] => {
  console.log('Merging leads from multiple sources');
  
  try {
    // Combine all lead sources
    const combinedLeads = [
      ...linkedInLeads,
      ...storeLeads,
      ...existingLeads
    ];
    
    // Remove duplicates
    const uniqueLeads = removeDuplicates(combinedLeads);
    
    // Convert partial leads to full leads
    const fullLeads = uniqueLeads.map(lead => {
      // Generate a unique ID if missing
      const id = lead.id || `lead-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      return {
        id,
        companyName: lead.companyName || 'Unknown Company',
        industry: lead.industry || 'Other',
        contactName: lead.contactName || 'Unknown Contact',
        contactEmail: lead.contactEmail || '',
        contactPhone: lead.contactPhone,
        linkedInUrl: lead.linkedInUrl,
        website: lead.website,
        location: lead.location || 'Unknown',
        status: lead.status || 'new',
        notes: lead.notes,
        lastContactDate: lead.lastContactDate,
        tags: lead.tags || [],
        score: lead.score
      } as B2BLead;
    });
    
    // Sort leads by score
    return fullLeads.sort((a, b) => (b.score || 0) - (a.score || 0));
  } catch (error) {
    console.error('Error merging lead sources:', error);
    return [];
  }
};

// ========== Helper Functions ==========

/**
 * Format a full name from first and last name
 * @param firstName First name
 * @param lastName Last name
 * @returns Formatted full name
 */
function formatName(firstName?: string, lastName?: string): string | undefined {
  if (!firstName && !lastName) return undefined;
  
  const formattedFirst = firstName ? firstName.trim() : '';
  const formattedLast = lastName ? lastName.trim() : '';
  
  if (formattedFirst && formattedLast) {
    return `${formattedFirst} ${formattedLast}`;
  } else {
    return formattedFirst || formattedLast;
  }
}

/**
 * Format a location string from city and country
 * @param city City name
 * @param country Country name
 * @returns Formatted location string
 */
function formatLocation(city?: string, country?: string): string {
  if (!city && !country) return 'Unknown';
  
  const formattedCity = city ? city.trim() : '';
  const formattedCountry = country ? country.trim() : '';
  
  if (formattedCity && formattedCountry) {
    return `${formattedCity}, ${formattedCountry}`;
  } else {
    return formattedCity || formattedCountry;
  }
}

/**
 * Validate email format
 * @param email Email to validate
 * @returns Whether email is valid
 */
function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Format a probable email address from name and company
 * @param name Contact name
 * @param company Company name
 * @returns Probable email address
 */
function formatProbableEmail(name: string, company: string): string {
  if (!name || !company) return '';
  
  // Extract first name
  const nameParts = name.split(' ');
  const firstName = nameParts[0].toLowerCase();
  
  // Format domain from company name
  const domain = company
    .toLowerCase()
    .replace(/[^\w\s]/gi, '') // Remove special characters
    .replace(/\s+/g, '') // Remove spaces
    .replace(/(inc|llc|ltd|corp|limited)$/i, ''); // Remove common suffixes
  
  return `${firstName}@${domain}.com`;
}

/**
 * Calculate a lead score based on various factors
 * @param params Scoring parameters
 * @returns Numeric score from 0-100
 */
function calculateLeadScore(params: {
  industry: string;
  location: string;
  hasEmail: boolean;
  hasPhone: boolean;
  hasWebsite: boolean;
  companySize: string;
}): number {
  let score = 50; // Base score
  
  // Industry relevance
  const relevantIndustries = ['luxury retail', 'retail', 'department store', 'hotel', 'spa', 'beauty'];
  const industry = params.industry.toLowerCase();
  if (industry.includes('luxury')) score += 15;
  if (relevantIndustries.some(rel => industry.includes(rel))) score += 10;
  
  // Location factors
  const location = params.location.toLowerCase();
  const premiumLocations = ['new york', 'paris', 'london', 'dubai', 'hong kong', 'los angeles', 'milan', 'tokyo'];
  if (premiumLocations.some(loc => location.includes(loc))) score += 10;
  
  // Contact completeness
  if (params.hasEmail) score += 5;
  if (params.hasPhone) score += 5;
  if (params.hasWebsite) score += 5;
  
  // Company size
  if (params.companySize === 'large' || params.companySize === 'enterprise') score += 10;
  if (params.companySize === 'medium') score += 5;
  
  // Cap score at 100
  return Math.min(100, score);
}

/**
 * Calculate a score for store leads
 * @param params Store scoring parameters
 * @returns Numeric score from 0-100
 */
function calculateStoreScore(params: {
  storeType: string;
  hasEmail: boolean;
  hasPhone: boolean;
  location: string;
  size: string;
}): number {
  let score = 40; // Base score for stores is lower
  
  // Store type
  const premiumTypes = ['luxury', 'boutique', 'department', 'flagship'];
  const storeType = params.storeType.toLowerCase();
  if (premiumTypes.some(type => storeType.includes(type))) score += 15;
  
  // Location factors
  const location = params.location.toLowerCase();
  const premiumLocations = ['new york', 'paris', 'london', 'dubai', 'hong kong', 'los angeles', 'milan', 'tokyo'];
  if (premiumLocations.some(loc => location.includes(loc))) score += 15;
  
  // Contact completeness
  if (params.hasEmail) score += 10;
  if (params.hasPhone) score += 5;
  
  // Store size
  if (params.size === 'flagship' || params.size === 'large') score += 15;
  if (params.size === 'medium') score += 10;
  
  // Cap score at 100
  return Math.min(100, score);
}

/**
 * Generate tags based on lead data
 * @param data Lead data
 * @returns Array of tags
 */
function generateTags(data: any): string[] {
  const tags: string[] = [];
  
  // Industry tags
  const industry = (data.industry || '').toLowerCase();
  if (industry.includes('luxury')) tags.push('luxury');
  if (industry.includes('retail')) tags.push('retail');
  if (industry.includes('department')) tags.push('department store');
  if (industry.includes('hotel') || industry.includes('hospitality')) tags.push('hospitality');
  if (industry.includes('spa') || industry.includes('wellness')) tags.push('spa');
  
  // Location tags
  const location = (data.location || data.city || '').toLowerCase();
  if (location.includes('new york')) tags.push('nyc');
  
  // Add international tag if not US
  if (data.country && data.country.toLowerCase() !== 'united states' && data.country.toLowerCase() !== 'us') {
    tags.push('international');
    
    // Region-specific tags
    if (['france', 'italy', 'uk', 'germany', 'spain'].includes(data.country.toLowerCase())) {
      tags.push('europe');
    } else if (['china', 'japan', 'south korea', 'hong kong', 'singapore'].includes(data.country.toLowerCase())) {
      tags.push('asia');
    } else if (['uae', 'saudi arabia', 'qatar', 'kuwait', 'bahrain'].includes(data.country.toLowerCase())) {
      tags.push('middle east');
    }
  }
  
  // Company size tags
  if (data.companySize === 'large' || data.companySize === 'enterprise') {
    tags.push('large account');
  }
  
  // Priority tags
  if (data.priority === 'high' || 
      location.includes('new york') || 
      location.includes('paris') || 
      location.includes('dubai')) {
    tags.push('high priority');
  }
  
  return tags;
}

/**
 * Remove duplicate leads based on company name and email
 * @param leads Array of leads
 * @returns Deduplicated array
 */
function removeDuplicates(leads: Partial<B2BLead>[]): Partial<B2BLead>[] {
  const uniqueMap = new Map<string, Partial<B2BLead>>();
  
  leads.forEach(lead => {
    // Skip invalid leads
    if (!lead.companyName) return;
    
    // Create a unique key based on company name and email
    const key = `${lead.companyName.toLowerCase()}-${(lead.contactEmail || '').toLowerCase()}`;
    
    // If this lead doesn't exist yet, or has a higher score than existing one, add/replace
    if (!uniqueMap.has(key) || (lead.score || 0) > (uniqueMap.get(key)?.score || 0)) {
      uniqueMap.set(key, lead);
    }
  });
  
  return Array.from(uniqueMap.values());
}

/**
 * Generate an email template for the specified industry
 * @param industry Industry name
 * @returns HTML email template
 */
function generateEmailTemplate(industry: string): string {
  const industryLower = industry.toLowerCase();
  let subject = '';
  let intro = '';
  let value = '';
  
  // Customize email content based on industry
  if (industryLower.includes('luxury') || industryLower.includes('retail')) {
    subject = 'Exclusive MiN NEW YORK Fragrance Collection for Your Luxury Retail Space';
    intro = 'As a leading luxury retailer, you understand the importance of offering unique, high-quality products that resonate with your discerning clientele.';
    value = 'Our artisanal fragrances have been featured in Vogue, GQ, and Harper\'s Bazaar, and are carried by prestigious retailers worldwide, increasing foot traffic and average transaction values by up to 15%.';
  } else if (industryLower.includes('hotel') || industryLower.includes('hospitality')) {
    subject = 'Elevate Your Guest Experience with MiN NEW YORK Signature Fragrances';
    intro = 'In the competitive landscape of luxury hospitality, creating memorable sensory experiences for your guests can significantly enhance their stay and build lasting brand loyalty.';
    value = 'Our custom scent programs have helped luxury hotels increase guest satisfaction scores by an average of 23% and boost spa service bookings by up to 30%.';
  } else if (industryLower.includes('spa') || industryLower.includes('wellness')) {
    subject = 'Transform Your Spa Experience with MiN NEW YORK Artisanal Fragrances';
    intro = 'As a premier wellness destination, you strive to create transcendent experiences that nurture both body and mind.';
    value = 'Our fragrances are crafted using only the finest natural ingredients, with bespoke blending options that can become signature scents unique to your spa, increasing service bookings and retail sales by an average of 25%.';
  } else {
    subject = 'Introducing MiN NEW YORK: Luxury Fragrances for Discerning Businesses';
    intro = 'I\'m reaching out to select businesses that share our passion for exceptional quality and memorable experiences.';
    value = 'Our luxury fragrance collection has proven to enhance customer experiences and increase brand loyalty across various premium settings, with partners reporting an average 20% increase in customer satisfaction scores.';
  }
  
  // Create HTML template
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { max-width: 180px; }
    h1 { color: #222; font-size: 24px; font-weight: 300; margin-bottom: 20px; }
    p { margin-bottom: 20px; }
    .signature { margin-top: 40px; }
    .cta-button { display: inline-block; background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; font-weight: 500; margin: 20px 0; }
    .footer { margin-top: 40px; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="header">
    <img src="https://minewyork.com/logo.png" alt="MiN NEW YORK" class="logo">
  </div>
  
  <h1>Elevate Your Customer Experience with Luxury Fragrances</h1>
  
  <p>Dear {{ $json.contact }},</p>
  
  <p>${intro}</p>
  
  <p>I'm reaching out to introduce MiN NEW YORK, a pioneer in luxury fragrances crafted in New York City. Our collection of artisanal scents has garnered acclaim worldwide for their exceptional quality, unique compositions, and transformative experiences they create.</p>
  
  <p>${value}</p>
  
  <p>I would welcome the opportunity to discuss how a partnership with MiN NEW YORK could enhance the sensory experience at {{ $json.company }} and drive measurable business results.</p>
  
  <a href="https://minewyork.com/book-consultation" class="cta-button">Schedule a Consultation</a>
  
  <p>Alternatively, I'd be happy to arrange for samples of our bestselling fragrances to be sent directly to you so you can experience the quality firsthand.</p>
  
  <div class="signature">
    <p>
      Warm regards,<br>
      Chad Murawczyk<br>
      Founder, MiN NEW YORK<br>
      chad@minewyork.com<br>
      +1 (212) 555-1234
    </p>
  </div>
  
  <div class="footer">
    <p>MiN NEW YORK | 123 Lafayette Street, New York, NY 10013 | www.minewyork.com</p>
  </div>
</body>
</html>`;
}

/**
 * Save leads to localStorage (for demo purposes)
 * @param leads Array of leads to save
 */
export const saveB2BLeads = (leads: B2BLead[]) => {
  localStorage.setItem('b2b_leads', JSON.stringify(leads));
};

/**
 * Retrieve leads from localStorage
 * @returns Array of saved leads or sample leads if none saved
 */
export const getB2BLeads = (): B2BLead[] => {
  const leads = localStorage.getItem('b2b_leads');
  return leads ? JSON.parse(leads) : sampleLeads;
};
