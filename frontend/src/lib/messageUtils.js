export const cleanMessageForDisplay = (message) => {
  // Remove system prompts and formatting instructions
  let cleaned = message;
  
  // Common patterns to remove
  const patterns = [
    // Study tool prefixes
    /^Please (help me |create |generate |write |organize |summarize |explain )[^:]*:\s*/i,
    // Formatting instructions
    /\n\n(Return your response in markdown format|Format them exactly|Use proper formatting)[^\n]*$/gi,
    // System context remnants
    /^You are [^.]*\.\s*/i,
    // Multiple newlines
    /\n{3,}/g
  ];
  
  patterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });
  
  return cleaned.trim() || "Processing your request...";
};

// Usage in components
