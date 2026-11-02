
import { useState, useRef, useEffect } from "react"
import { IoSend, IoSparkles, IoPerson } from "react-icons/io5"

const API_URL = "http://127.0.0.1:8000/api/ai/chat"

function AIAssistant() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm the Bishwas Pharmacy AI Assistant. I can help you explore our products, understand pharmacy services, and answer general medicine-information questions. How can I help you today?",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const sendMessage = async (event) => {
    event.preventDefault()

    const trimmedMessage = message.trim()

    if (!trimmedMessage || isLoading) return

    setMessages((current) => [
      ...current,
      { role: "user", content: trimmedMessage },
    ])

    setMessage("")
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedMessage,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || "Unable to get an AI response.")
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.response },
      ])
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the AI assistant. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const suggestedQuestions = [
    "What services does Bishwas Pharmacy provide?",
    "How can I upload a prescription?",
    "Can you help me find a product?",
  ]

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
            <IoSparkles size={24} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Pharmacy AI Assistant
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Pharmacy information and product assistance
            </p>
          </div>
        </div>

        {/* Chat messages */}
        <div className="flex min-h-[420px] flex-1 flex-col gap-5 p-4 sm:p-6">
          {messages.map((chat, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                chat.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {chat.role === "assistant" && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                  <IoSparkles size={18} />
                </div>
              )}

              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${
                  chat.role === "user"
                    ? "rounded-br-sm bg-teal-700 text-white"
                    : "rounded-bl-sm bg-slate-100 text-slate-800"
                }`}
              >
                {chat.content}
              </div>

              {chat.role === "user" && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                  <IoPerson size={18} />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                <IoSparkles size={18} />
              </div>

              <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-500">
                Thinking...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested questions */}
        {messages.length === 1 && (
          <div className="px-4 pb-4 sm:px-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Try asking
            </p>

            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => setMessage(question)}
                  className="rounded-full border border-slate-200 px-3 py-2 text-left text-xs text-slate-600 transition hover:border-teal-600 hover:bg-teal-50 hover:text-teal-700"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message input */}
        <form
          onSubmit={sendMessage}
          className="border-t border-slate-200 bg-white p-4 sm:p-6"
        >
          {error && (
            <p role="alert" className="mb-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex items-end gap-3 rounded-xl border border-slate-300 bg-white p-2 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100">
            <textarea
              rows="1"
              maxLength="1000"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault()
                  sendMessage(event)
                }
              }}
              placeholder="Ask the pharmacy assistant..."
              className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none"
            />

            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-700 text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Send message"
            >
              <IoSend size={18} />
            </button>
          </div>

          <p className="mt-3 text-center text-xs leading-5 text-slate-500">
            AI responses may be inaccurate. This assistant does not diagnose
            conditions or replace advice from a qualified healthcare
            professional.
          </p>
        </form>
      </div>
    </div>
  )
}

export default AIAssistant
