
/**
 * Returns the CSS class for a given SEO score
 */
export const getScoreColor = (score: number): string => {
  if (score >= 80) return 'bg-green-100 text-green-800';
  if (score >= 60) return 'bg-amber-100 text-amber-800';
  return 'bg-red-100 text-red-800';
};

/**
 * Extracts AIOSEO metadata from a product
 */
export const extractSEOData = (product: any) => {
  // Handle cases where meta_data might be missing
  if (!product.meta_data || !Array.isArray(product.meta_data)) {
    return {
      seoScore: 0,
      seoTitle: product.name || '',
      seoDescription: '',
      focusKeyword: '',
    };
  }
  
  // Extract SEO data with proper type conversion
  const seoScore = product.meta_data.find(meta => meta.key === '_aioseo_seo_score')?.value;
  
  return {
    seoScore: seoScore !== undefined ? Number(seoScore) : 0,
    seoTitle: product.meta_data.find(meta => meta.key === '_aioseo_title')?.value || product.name,
    seoDescription: product.meta_data.find(meta => meta.key === '_aioseo_description')?.value || '',
    focusKeyword: product.meta_data.find(meta => meta.key === '_aioseo_focus_keyword')?.value || '',
  };
};
