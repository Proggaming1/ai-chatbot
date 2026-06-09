import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import MessageBubble from '../components/MessageBubble';
import ModelSelector from '../components/ModelSelector';
import '../styles/globals.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState('');
  const [selectedModel, setSelectedModel] = useState('llama-70b');
  const [models, setModels] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/models`);
        setModels(res.data.models);
      } catch (error) {
        console.error('Error loading models:', error);
      }
    };
    loadModels();

    const newConvId = localStorage.getItem('conversationId') || uuidv4();
    setConversationId(newConvId);
    localStorage.setItem('conversationId', newConvId);

    loadHistory(newConvId);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadHistory = async (convId) => {
    try {
      const res = await axios.get(`${API_URL}/api/history/${convId}`);
      if (res.data.messages.length > 0) {
        setMessages(res.data.messages);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setInputValue('');
    setLoading(true);

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await axios.post(`${API_URL}/api/chat`, {
        message: userMessage,
        conversation_id: conversationId,
        model: selectedModel,
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Error sending message';
      setMessages(prev => [...prev, { role: 'error', content: errorMsg }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    if (confirm('Clear all messages?')) {
      setMessages([]);
      axios.delete(`${API_URL}/api/history/${conversationId}`).catch(console.error);
      localStorage.removeItem('conversationId');
      const newConvId = uuidv4();
      setConversationId(newConvId);
      localStorage.setItem('conversationId', newConvId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white flex flex-col">
      <header className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">🤖 AI Chatbot</h1>
              <p className="text-gray-400 text-sm">Multi-model LLM powered by Together AI</p>
            </div>
            <button
              onClick={clearChat}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition text-sm font-medium"
            >
              Clear Chat
            </button>
          </div>
          <ModelSelector
            models={models}
            selected={selectedModel}
            onSelect={setSelectedModel}
            disabled={loading}
          />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto max-w-4xl w-full mx-auto px-4 py-6">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <div className="text-6xl mb-4">🚀</div>
              <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
              <p className="text-gray-400">Start chatting with AI. Ask questions, code help, or just have fun!</p>
              <div className="mt-6 space-y-2 text-left max-w-xs">
                <p className="text-sm font-semibold">Try:</p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• "Explain quantum computing"</li>
                  <li>• "Write a Python function for fibonacci"</li>
                  <li>• "Tell me a funny joke"</li>
                  <li>• "Help me debug this code"</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <MessageBubble key={idx} message={msg} />
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 rounded-lg p-4 max-w-2xl">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <footer className="border-t border-gray-700 bg-gray-900/50 backdrop-blur-sm sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
              className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold disabled:opacity-50 transition"
            >
              Send
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2">Conversation ID: {conversationId.slice(0, 8)}...</p>
        </div>
      </footer>
    </div>
  );
}
