'use client';

import React, { useState, useRef, useEffect, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, User, Bot, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { portfolioChatbot, PortfolioChatbotInput, ChatMessage } from '@/ai/flows/portfolio-chatbot-flow';
import { useToast } from '@/hooks/use-toast';

interface ChatbotProps {
  context: {
    resumeText: string;
    githubUsername?: string;
    linkedinProfileUrl?: string;
  };
}

const Chatbot: React.FC<ChatbotProps> = ({ context }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null); // Ref for the viewport div
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
   useEffect(() => {
      if (viewportRef.current) {
        viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
      }
    }, [messages]);

  // Focus input on initial load or when chat opens
    useEffect(() => {
      // Assuming the sheet/popover triggers focus when opened
      // If not, might need a prop to signal when it becomes visible
      inputRef.current?.focus();
    }, []);


  const handleSendMessage = () => {
    const userQuestion = inputValue.trim();
    if (!userQuestion || isPending) return;

    const newUserMessage: ChatMessage = { role: 'user', text: userQuestion };
    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue('');

    startTransition(async () => {
      try {
        const input: PortfolioChatbotInput = {
          context: context, // Pass the context provided via props
          history: messages, // Pass the current message history
          question: userQuestion,
        };
        const result = await portfolioChatbot(input);
        const aiResponse: ChatMessage = { role: 'model', text: result.answer };
        setMessages((prev) => [...prev, aiResponse]);
      } catch (error) {
        console.error('Chatbot error:', error);
        const errorMessage: ChatMessage = { role: 'model', text: 'Sorry, I encountered an error. Please try again.' };
        setMessages((prev) => [...prev, errorMessage]);
        toast({
          title: 'Chatbot Error',
          description: 'Could not get a response from the AI.',
          variant: 'destructive',
        });
      }
    });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent new line on enter
      handleSendMessage();
    }
  };

   const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
   };

  return (
     // Changed container: remove fixed height, use flex-grow and min-height
    <div className="flex flex-col h-full bg-background overflow-hidden">
       {/* Apply flex-grow and overflow-y-auto to ScrollArea */}
      <ScrollArea className="flex-grow" viewportRef={viewportRef}>
        <div className="p-4 space-y-4"> {/* Add padding inside scroll area */}
           {/* Initial Welcome Message */}
           {messages.length === 0 && (
               <motion.div
                  key="welcome"
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-start gap-3"
               >
                  <div className="flex-shrink-0 p-1.5 rounded-full bg-accent text-accent-foreground">
                     <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                     <p className="text-sm font-semibold text-primary mb-1">Portfolio Assistant</p>
                     <p className="text-sm text-foreground">
                        Hello! Ask me anything about Harshith's skills, experience, or projects. How can I help you?
                     </p>
                  </div>
               </motion.div>
           )}
          <AnimatePresence initial={false}>
             {messages.map((message, index) => (
               <motion.div
                 key={index}
                 variants={messageVariants}
                 initial="hidden"
                 animate="visible"
                 className={cn(
                   "flex items-start gap-3",
                   message.role === 'user' ? 'justify-end' : 'justify-start'
                 )}
               >
                 {message.role === 'model' && (
                   <div className="flex-shrink-0 p-1.5 rounded-full bg-accent text-accent-foreground">
                     <Bot className="h-5 w-5" />
                   </div>
                 )}
                 <div
                   className={cn(
                     "rounded-lg p-3 max-w-[80%]",
                     message.role === 'user'
                       ? 'bg-primary text-primary-foreground'
                       : 'bg-muted text-foreground'
                   )}
                 >
                    {message.role === 'model' && <p className="text-xs font-semibold text-primary mb-1">AI Assistant</p>}
                    {/* Render newlines correctly */}
                   <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                 </div>
                 {message.role === 'user' && (
                   <div className="flex-shrink-0 p-1.5 rounded-full bg-secondary text-secondary-foreground">
                     <User className="h-5 w-5" />
                   </div>
                 )}
               </motion.div>
             ))}
          </AnimatePresence>
          {isPending && (
            <motion.div
              key="loading"
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              className="flex items-start gap-3 justify-start"
            >
               <div className="flex-shrink-0 p-1.5 rounded-full bg-accent text-accent-foreground">
                 <Bot className="h-5 w-5" />
               </div>
              <div className="bg-muted rounded-lg p-3 max-w-[80%] flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                 <span className="text-sm text-muted-foreground italic">Thinking...</span>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>
       {/* Input area remains at the bottom */}
      <div className="p-4 border-t border-border bg-muted/50">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Ask about Harshith..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isPending}
            className="flex-grow bg-background"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isPending || !inputValue.trim()}
            size="icon"
            aria-label="Send message"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
