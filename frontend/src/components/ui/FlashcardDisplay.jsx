import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function FlashcardDisplay({ flashcards }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [parsedCards, setParsedCards] = useState([]);
  
  // Parse flashcards from the markdown response
  useEffect(() => {
    if (!flashcards) return;
    
    const parseFlashcards = (content) => {
      console.log("Attempting to parse flashcard content");
      
      // Split by flashcard sections using various patterns
      let cards = [];
      
      // Pattern 1: **Front:** / **Back:** format with --- separators
      const frontBackPattern = /\*\*Front:\*\*([\s\S]*?)\*\*Back:\*\*([\s\S]*?)(?=\*\*Front:\*\*|$|---)/g;
      let matches = [...content.matchAll(frontBackPattern)];
      
      if (matches.length > 0) {
        console.log("Found Front/Back format flashcards:", matches.length);
        cards = matches.map(match => ({
          front: match[1].trim(),
          back: match[2].trim()
        }));
      } else {
        // Pattern 2: Split by --- and then look for Front/Back
        const sections = content.split(/\n*---\n*/).filter(Boolean);
        console.log("Trying pattern with --- separators, found sections:", sections.length);
        
        if (sections.length > 1) {
          cards = sections.map(section => {
            const frontMatch = section.match(/\*\*Front:\*\*([\s\S]*?)(?=\*\*Back:\*\*|$)/i);
            const backMatch = section.match(/\*\*Back:\*\*([\s\S]*?)$/i);
            
            return {
              front: frontMatch ? frontMatch[1].trim() : 'Front content not found',
              back: backMatch ? backMatch[1].trim() : 'Back content not found'
            };
          });
        } else {
          // Pattern 3: Q/A format
          const qaPattern = /\*\*Q:[\s\*]*([\s\S]*?)\*\*A:[\s\*]*([\s\S]*?)(?=\*\*Q:|$)/gi;
          matches = [...content.matchAll(qaPattern)];
          
          if (matches.length > 0) {
            console.log("Found Q/A format flashcards:", matches.length);
            cards = matches.map(match => ({
              front: match[1].trim(),
              back: match[2].trim()
            }));
          } else {
            // Pattern 4: Custom parser for lines that have Q: A: format
            const lines = content.split('\n');
            let currentFront = null;
            
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i].trim();
              
              if (line.startsWith('**Front:') || line.startsWith('Front:')) {
                currentFront = line.replace(/^\*\*Front:|\*\*|^Front:/, '').trim();
                
                // Look for matching Back: in next lines
                for (let j = i + 1; j < lines.length; j++) {
                  if (lines[j].startsWith('**Back:') || lines[j].startsWith('Back:')) {
                    const back = lines[j].replace(/^\*\*Back:|\*\*|^Back:/, '').trim();
                    
                    // Add complete card
                    if (currentFront) {
                      cards.push({
                        front: currentFront,
                        back: back
                      });
                      
                      currentFront = null;
                    }
                    break;
                  }
                }
              }
            }
          }
        }
      }
      
      // Final fallback: simple "Q: A:" format without markdown
      if (cards.length === 0) {
        const plainQAPattern = /(?:^|\n)Q:[ \t]*(.*?)(?:\n|$)(?:A:[ \t]*)(.*?)(?=(?:\n|$)Q:|$)/gs;
        matches = [...content.matchAll(plainQAPattern)];
        
        if (matches.length > 0) {
          console.log("Found plain Q/A format:", matches.length);
          cards = matches.map(match => ({
            front: match[1].trim(),
            back: match[2].trim()
          }));
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
        <div className="mt-6 p-4 bg-gray-100 rounded-lg max-w-lg w-full overflow-auto max-h-64">
          <pre className="text-xs text-gray-500 whitespace-pre-wrap">
            {flashcards.substring(0, 500)}...
          </pre>
        </div>
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

  // Custom components for markdown rendering
  const markdownComponents = {
    p: ({children}) => <p className="mb-2">{children}</p>,
    ul: ({children}) => <ul className="list-disc pl-5 mb-3">{children}</ul>,
    ol: ({children}) => <ol className="list-decimal pl-5 mb-3">{children}</ol>,
    li: ({children}) => <li className="mb-1">{children}</li>,
    strong: ({children}) => <strong className="font-bold text-indigo-900">{children}</strong>,
    em: ({children}) => <em className="italic text-indigo-700">{children}</em>,
    h3: ({children}) => <h3 className="text-lg font-bold mb-2 text-indigo-800">{children}</h3>,
    h4: ({children}) => <h4 className="text-md font-bold mb-1 text-indigo-700">{children}</h4>,
  };
  
  return (
    <div className="flex flex-col h-full p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="mb-4 text-center">
        <h2 className="text-xl font-bold text-indigo-700">Study Flashcards</h2>
        <p className="text-gray-600">Card {currentIndex + 1} of {parsedCards.length}</p>
      </div>
      
      <div className="flex-1 flex flex-col justify-center">
        <div 
          onClick={toggleAnswer}
          className={`bg-white rounded-xl shadow-lg border border-indigo-100 p-6 
                    max-w-2xl w-full mx-auto cursor-pointer transition-all duration-300 transform
                    ${showAnswer ? 'bg-indigo-50 border-indigo-200' : 'hover:shadow-xl'}`}
          style={{ minHeight: '280px' }}
        >
          <div className="h-full flex flex-col">
            <h3 className="text-xl font-semibold mb-3 text-gray-800 flex items-center">
              <span className={`${showAnswer ? "text-purple-500" : "text-indigo-500"} mr-2`}>
                {showAnswer ? "💡" : "❓"}
              </span>
              {showAnswer ? 'Answer:' : 'Question:'}
            </h3>
            
            <div className="flex-1 flex items-center">
              <div className="prose prose-indigo max-w-none w-full">
                {showAnswer ? (
                  <ReactMarkdown components={markdownComponents}>
                    {currentCard.back}
                  </ReactMarkdown>
                ) : (
                  <ReactMarkdown components={markdownComponents}>
                    {currentCard.front}
                  </ReactMarkdown>
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
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg flex items-center"
        >
          <span className="mr-1">←</span> Previous
        </button>
        <button 
          onClick={toggleAnswer}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg"
        >
          {showAnswer ? 'Show Question' : 'Show Answer'}
        </button>
        <button 
          onClick={nextCard}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg flex items-center"
        >
          Next <span className="ml-1">→</span>
        </button>
      </div>
    </div>
  );
}