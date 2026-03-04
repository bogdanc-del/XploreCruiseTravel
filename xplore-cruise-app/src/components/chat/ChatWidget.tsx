'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { useT, useLocale } from '@/i18n/context'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

/**
 * Simple markdown-to-HTML converter for chatbot messages.
 * Handles: **bold**, *italic*, [links](url), `code`, bullet lists, numbered lists, line breaks
 */
function renderMarkdown(text: string): string {
  let html = text
    // Escape HTML entities first
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Code blocks (```)
  html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-navy-100 rounded px-2 py-1 my-1 text-xs overflow-x-auto"><code>$1</code></pre>')

  // Inline code (`text`)
  html = html.replace(/`([^`]+)`/g, '<code class="bg-navy-100 rounded px-1 py-0.5 text-xs">$1</code>')

  // Bold (**text** or __text__)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
  html = html.replace(/__(.+?)__/g, '<strong class="font-semibold">$1</strong>')

  // Italic (*text* or _text_) — be careful not to match already-processed **
  html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')

  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-gold-600 underline hover:text-gold-700">$1</a>')

  // Process line by line for lists
  const lines = html.split('\n')
  const processed: string[] = []
  let inList = false
  let listType: 'ul' | 'ol' = 'ul'

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const bulletMatch = line.match(/^[\s]*[-•*]\s+(.+)/)
    const numberMatch = line.match(/^[\s]*(\d+)[.)]\s+(.+)/)

    if (bulletMatch) {
      if (!inList || listType !== 'ul') {
        if (inList) processed.push(listType === 'ul' ? '</ul>' : '</ol>')
        processed.push('<ul class="list-disc ml-4 space-y-0.5">')
        inList = true
        listType = 'ul'
      }
      processed.push(`<li>${bulletMatch[1]}</li>`)
    } else if (numberMatch) {
      if (!inList || listType !== 'ol') {
        if (inList) processed.push(listType === 'ul' ? '</ul>' : '</ol>')
        processed.push('<ol class="list-decimal ml-4 space-y-0.5">')
        inList = true
        listType = 'ol'
      }
      processed.push(`<li>${numberMatch[2]}</li>`)
    } else {
      if (inList) {
        processed.push(listType === 'ul' ? '</ul>' : '</ol>')
        inList = false
      }
      // Regular line — convert double newlines to paragraph breaks
      if (line.trim() === '') {
        processed.push('<br/>')
      } else {
        processed.push(line)
      }
    }
  }
  if (inList) {
    processed.push(listType === 'ul' ? '</ul>' : '</ol>')
  }

  return processed.join('\n')
}

/** Memoized component that renders a single chat message with markdown support */
function ChatMessage({ msg }: { msg: Message }) {
  const html = useMemo(() => {
    if (msg.role === 'user') return null
    return renderMarkdown(msg.content)
  }, [msg.content, msg.role])

  return (
    <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        msg.role === 'user'
          ? 'bg-gradient-to-br from-gold-400 to-gold-500 text-white rounded-br-md'
          : 'bg-white text-navy-800 shadow-sm border border-navy-100 rounded-bl-md'
      }`}>
        {msg.role === 'user' ? (
          <div className="whitespace-pre-wrap">{msg.content}</div>
        ) : (
          <div
            className="chat-markdown [&_strong]:font-semibold [&_em]:italic [&_a]:text-gold-600 [&_a]:underline [&_code]:bg-navy-100 [&_code]:rounded [&_code]:px-1 [&_code]:text-xs [&_pre]:my-1 [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_li]:mb-0.5 [&_br]:block"
            dangerouslySetInnerHTML={{ __html: html || msg.content }}
          />
        )}
      </div>
    </div>
  )
}

export default function ChatWidget() {
  const t = useT()
  const { locale } = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Add welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: t('chat_welcome'),
        timestamp: new Date()
      }])
    }
  }, [isOpen, messages.length, t])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          locale,
          history: messages.filter(m => m.id !== 'welcome').map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || (locale === 'ro'
          ? 'Imi pare rau, am intampinat o eroare. Va rog incercati din nou.'
          : 'Sorry, I encountered an error. Please try again.'),
        timestamp: new Date()
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: locale === 'ro'
          ? 'Conexiunea a esuat. Verificati conexiunea la internet si incercati din nou.'
          : 'Connection failed. Please check your internet and try again.',
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center group"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
          </svg>
        )}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-7rem)] rounded-2xl shadow-modal overflow-hidden flex flex-col animate-fade-in-up bg-white border border-navy-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-navy-900 to-navy-800 text-white px-5 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold-400 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/daniela-ceausu.jpg" alt="Daniela" className="w-full h-full object-cover object-top" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">{t('chat_title')}</h3>
              <p className="text-navy-300 text-xs">{t('chat_subtitle')}</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-navy-50/50">
            {messages.map(msg => (
              <ChatMessage key={msg.id} msg={msg} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-navy-500 shadow-sm border border-navy-100 rounded-2xl rounded-bl-md px-4 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs">{t('chat_sending')}</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-navy-100 bg-white">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder={t('chat_placeholder')}
                className="flex-1 px-4 py-2.5 rounded-xl bg-navy-50 border border-navy-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 transition-all"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                aria-label={locale === 'ro' ? 'Trimite mesajul' : 'Send message'}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-br from-gold-400 to-gold-500 text-white text-sm font-medium hover:from-gold-500 hover:to-gold-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
