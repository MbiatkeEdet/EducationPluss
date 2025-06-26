export const cleanMessageForDisplay = (message) => {
  // Remove system prompts and formatting instructions
  let cleaned = message;
  
  // More comprehensive patterns to remove
  const patterns = [
    // Study tool prefixes - more comprehensive
    /^Please (help me |create |generate |write |organize |summarize |explain |analyze |review |check |debug |translate |convert |extract |format |structure |plan |outline |brainstorm )[^:]*:\s*/i,
    /^(Create |Generate |Write |Organize |Summarize |Explain |Analyze |Review |Check |Debug |Translate |Convert |Extract |Format |Structure |Plan |Outline |Brainstorm )[^:]*:\s*/i,
    
    // Common AI instruction prefixes
    /^(I need help with|Help me|Can you|Could you|Please)[^:]*:\s*/i,
    
    // Formatting instructions - more comprehensive
    /\n\n(Return your response in markdown format|Format them exactly|Use proper formatting|Please format|Make sure to format|Ensure proper formatting)[^\n]*$/gi,
    /\n\n(Use markdown|Format as|Structure as|Present as|Display as)[^\n]*$/gi,
    
    // Output format instructions
    /\n\n(Output format|Response format|Expected format)[^\n]*$/gi,
    
    // System context remnants
    /^You are [^.]*\.\s*/i,
    /^As an? [^,]*, /i,
    
    // Multiple newlines
    /\n{3,}/g,
    
    // Tool-specific prefixes
    /^(Flashcards|Notes|Summary|Mind map|Explanation) for:?\s*/i,
    
    // Remove any remaining instructional text at the end
    /\n\n[A-Z][^.]*format[^.]*\.$/gi,
    /\n\n[A-Z][^.]*structure[^.]*\.$/gi,
  ];
  
  patterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });
  
  // Trim and provide fallback
  cleaned = cleaned.trim();
  
  // If the message is too short or seems like instructions, return a generic message
  if (cleaned.length < 10 || /^(please|help|create|generate|write)/i.test(cleaned)) {
    return "Processing your request...";
  }
  
  return cleaned || "Processing your request...";
};

// Additional function to extract only user content
export const extractUserContent = (message) => {
  // Look for patterns that indicate where user content starts
  const userContentMarkers = [
    /:\s*(.+)$/s, // Everything after a colon
    /\n\n(.+)$/s, // Everything after double newline
    /following:\s*(.+)$/s, // Everything after "following:"
    /text:\s*(.+)$/s, // Everything after "text:"
    /content:\s*(.+)$/s, // Everything after "content:"
  ];
  
  for (const marker of userContentMarkers) {
    const match = message.match(marker);
    if (match && match[1].trim().length > 10) {
      return match[1].trim();
    }
  }
  
  // Fallback to cleanMessageForDisplay
  return cleanMessageForDisplay(message);
};
