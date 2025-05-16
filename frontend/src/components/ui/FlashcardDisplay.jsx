import { useState, useEffect } from 'react';

export default function FlashcardDisplay({ flashcards }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [parsedCards, setParsedCards] = useState([]);
  
  // Parse flashcards from the markdown response
  useEffect(() => {
    if (!flashcards) return;
    
    const parseFlashcards = (content) => {
      // Log the content for debugging
      console.log("Attempting to parse flashcard content:", content.substring(0, 200) + "...");
      
      // Split by flashcard sections using regex to match the format
      let cards = [];
      
      // Try pattern: ### **Flashcard X**
      const flashcardPattern = /### \*\*Flashcard \d+\*\*([\s\S]*?)(?=### \*\*Flashcard \d+\*\*|$)/g;
      let match;
      let matches = [];
      
      while ((match = flashcardPattern.exec(content)) !== null) {
        matches.push(match[0]);
      }
      
      if (matches.length > 0) {
        console.log("Found flashcards with pattern 1:", matches.length);
        cards = matches.map(section => {
          const frontMatch = section.match(/\*\*Front:\*\*([\s\S]*?)(?=\*\*Back:\*\*)/);
          const backMatch = section.match(/\*\*Back:\*\*([\s\S]*?)(?=$|-{3})/);
          
          return {
            front: frontMatch ? frontMatch[1].trim() : 'Front content not found',
            back: backMatch ? backMatch[1].trim() : 'Back content not found'
          };
        });
      } else {
        // Alternative pattern: Split by ---
        const sections = content.split(/\n-{3,}\n/).filter(Boolean);
        console.log("Trying pattern 2, found sections:", sections.length);
        
        if (sections.length > 1) {
          cards = sections.map(section => {
            // Try to extract Front/Back or Q/A format
            const frontMatch = section.match(/\*\*Front:\*\*([\s\S]*?)(?=\*\*Back:\*\*)/s) || 
                               section.match(/\*\*Q:\*\*([\s\S]*?)(?=\*\*A:\*\*)/s);
            const backMatch = section.match(/\*\*Back:\*\*([\s\S]*?)$/s) || 
                              section.match(/\*\*A:\*\*([\s\S]*?)$/s);
            
            return {
              front: frontMatch ? frontMatch[1].trim() : 'Front content not found',
              back: backMatch ? backMatch[1].trim() : 'Back content not found'
            };
          });
        } else {
          // Last resort: Try to split by Q: and A: patterns
          const lines = content.split('\n');
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('Q:') || lines[i].startsWith('**Q:**')) {
              let front = lines[i].replace(/^Q:|^\*\*Q:\*\*/, '').trim();
              let back = '';
              
              // Look for the answer in subsequent lines
              for (let j = i + 1; j < lines.length; j++) {
                if (lines[j].startsWith('A:') || lines[j].startsWith('**A:**')) {
                  back = lines[j].replace(/^A:|^\*\*A:\*\*/, '').trim();
                  // Continue collecting multi-line answers
                  for (let k = j + 1; k < lines.length; k++) {
                    if (lines[k].startsWith('Q:') || lines[k].startsWith('**Q:**') || !lines[k].trim()) {
                      break; // Stop at the next question
                    }
                    back += '\n' + lines[k];
                  }
                  break;
                }
              }
              
              if (front && back) {
                cards.push({ front, back });
              }
            }
          }
        }
      }
      
      console.log("Final parsed cards:", cards.length);
      return cards.filter(card => 
        card.front && card.back && 
        card.front !== 'Front content not found' && 
        card.back !== 'Back content not found'
      );
    };
    
    const cards = parseFlashcards(flashcards);
    setParsedCards(cards);
  }, [flashcards]);
  
  if (!flashcards) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-lg text-gray-700">Loading flashcards...</p>
        </div>
      </div>
    );
  }
  
  if (parsedCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="text-xl font-medium text-red-600 mb-4">No flashcards found in the response</div>
        <div className="text-gray-700 max-w-md text-center">
          The AI response doesn't appear to contain properly formatted flashcards. 
          Try again with more specific content or try a different study tool.
        </div>
        <pre className="mt-6 text-xs text-gray-500 p-4 bg-gray-100 rounded-lg max-w-lg overflow-auto max-h-48">
          {flashcards.substring(0, 500)}...
        </pre>
      </div>
    );
  }
  
  const currentCard = parsedCards[currentIndex];
  
  const nextCard = () => {
    setShowAnswer(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % parsedCards.length);
  };
  
  const prevCard = () => {
    setShowAnswer(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + parsedCards.length) % parsedCards.length);
  };
  
  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };
  
  return (
    <div className="flex flex-col h-full p-6">
      <div className="mb-4 text-center">
        <h2 className="text-xl font-bold text-indigo-700">Flashcards</h2>
        <p className="text-gray-600">Card {currentIndex + 1} of {parsedCards.length}</p>
      </div>
      
      <div className="flex-1 flex flex-col justify-center">
        <div 
          onClick={toggleAnswer}
          className={`bg-white rounded-xl shadow-lg border border-indigo-100 p-6 
                    max-w-2xl w-full mx-auto cursor-pointer transition-all duration-300 transform
                    ${showAnswer ? 'bg-indigo-50' : 'hover:shadow-xl'}`}
          style={{ minHeight: '250px' }}
        >
          <div className="h-full flex flex-col">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              {showAnswer ? 'Answer:' : 'Question:'}
            </h3>
            
            <div className="flex-1 flex items-center">
              <div className="prose prose-indigo max-w-none w-full">
                {showAnswer ? (
                  <div dangerouslySetInnerHTML={{ 
                    __html: currentCard.back
                      .replace(/\n/g, '<br/>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  }} />
                ) : (
                  <div dangerouslySetInnerHTML={{ 
                    __html: currentCard.front
                      .replace(/\n/g, '<br/>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  }} />
                )}
              </div>
            </div>
            
            <div className="mt-4 text-sm text-center text-gray-500">
              (Click card to see {showAnswer ? 'question' : 'answer'})
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-6 max-w-2xl mx-auto w-full">
        <button 
          onClick={prevCard}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg"
        >
          Previous
        </button>
        <button 
          onClick={toggleAnswer}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg"
        >
          {showAnswer ? 'Show Question' : 'Show Answer'}
        </button>
        <button 
          onClick={nextCard}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
}