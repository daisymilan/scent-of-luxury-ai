
import { useState } from 'react';
import { CollapsedAssistant } from './CollapsedAssistant';
import { ExpandedAssistant } from './ExpandedAssistant';

const AiAssistant = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return isExpanded ? (
    <ExpandedAssistant setIsExpanded={setIsExpanded} />
  ) : (
    <CollapsedAssistant setIsExpanded={setIsExpanded} />
  );
};

export default AiAssistant;
