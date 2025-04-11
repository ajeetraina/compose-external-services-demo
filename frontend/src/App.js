import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.filter(m => m.role !== 'thinking'),
          message: input,
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let accumulatedContent = '';

      // Add a thinking message
      setMessages(prev => [...prev, { role: 'thinking', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        accumulatedContent += text;

        // Update the thinking message
        setMessages(prev => {
          const newMessages = [...prev];
          const thinkingIndex = newMessages.findIndex(m => m.role === 'thinking');
          if (thinkingIndex !== -1) {
            newMessages[thinkingIndex].content = accumulatedContent;
          }
          return newMessages;
        });
      }

      // Replace the thinking message with the assistant message
      setMessages(prev => {
        const withoutThinking = prev.filter(m => m.role !== 'thinking');
        return [...withoutThinking, { role: 'assistant', content: accumulatedContent }];
      });
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove the thinking message and add an error message
      setMessages(prev => {
        const withoutThinking = prev.filter(m => m.role !== 'thinking');
        return [...withoutThinking, { role: 'assistant', content: 'Sorry, there was an error processing your request.' }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>GenAI Chat Demo with Model Runner</h1>
      </header>
      <div className="chat-container">
        <div className="messages">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <p>Welcome to the GenAI Chat Demo with Docker Model Runner!</p>
              <p>This demo uses the new external services feature in Docker Compose v2.35.0 to connect to AI models.</p>
              <p>Type a message below to get started.</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`message ${message.role}`}>
                <strong>{message.role === 'user' ? 'You' : 
                        message.role === 'thinking' ? 'Assistant (typing...)' : 
                        'Assistant'}</strong>: {message.content}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="message-input"
            disabled={isLoading}
          />
          <button type="submit" className="send-button" disabled={isLoading || !input.trim()}>
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
