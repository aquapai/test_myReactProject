import React, { useEffect, useRef, useState } from 'react';
import { Message } from '../types';
import { sendChatMessage } from '../services/geminiService';
import { audioService } from '../services/audioService';

interface ChatInterfaceProps {
  history: Message[];
  setHistory: React.Dispatch<React.SetStateAction<Message[]>>;
  onAnalyze: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ history, setHistory, onAnalyze }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 자동 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    audioService.playClick();
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setHistory(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendChatMessage(history, input);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
      };
      setHistory(prev => [...prev, aiMsg]);
      audioService.playSuccess(); // AI 응답 시 긍정적 피드백
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* 헤더 */}
      <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
        <div>
          <h2 className="font-bold text-lg">경험 발굴 인터뷰</h2>
          <p className="text-xs text-indigo-100 opacity-80">사소한 이야기도 편하게 해주세요.</p>
        </div>
        {history.length > 2 && (
          <button 
            onClick={() => { audioService.playClick(); onAnalyze(); }}
            className="bg-white text-indigo-600 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-indigo-50 transition shadow-md animate-pulse"
          >
            분석하러 가기 &rarr;
          </button>
        )}
      </div>

      {/* 채팅 영역 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 no-scrollbar">
        {history.length === 0 && (
          <div className="text-center text-gray-400 mt-10 text-sm">
            <p>👋 안녕하세요!</p>
            <p>최근에 가장 즐겁게 했던 일은 무엇인가요?</p>
          </div>
        )}
        {history.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-indigo-500 text-white rounded-tr-none'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 입력 영역 */}
      <div className="p-3 bg-white border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="예: 편의점 알바할 때 진상 손님을 달랜 적이 있어요..."
            className="flex-1 border border-gray-200 rounded-full px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 disabled:bg-gray-300 transition shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;