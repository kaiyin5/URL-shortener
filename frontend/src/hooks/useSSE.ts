import { useEffect, useRef, useState } from 'react'

export interface SSEData {
  type: string
  data?: any
  message?: string
}

export const useSSE = (url: string, onMessage: (data: SSEData) => void, enabled: boolean = true) => {
  const eventSourceRef = useRef<EventSource | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!enabled || !url) return

    const token = localStorage.getItem('token')
    if (!token) return

    const eventSource = new EventSource(`${url}?token=${token}`)
    eventSourceRef.current = eventSource

    eventSource.onopen = () => {
      setIsConnected(true)
    }

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        onMessage(data)
      } catch (error) {
        console.error('Failed to parse SSE data:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.log('❌ SSE Error:', error)
      setIsConnected(false)
      eventSource.close()
      
      // 🔄 Reconnect after 3 seconds
      setTimeout(() => {
        if (enabled && localStorage.getItem('token')) {
          const newToken = localStorage.getItem('token')
          const newEventSource = new EventSource(`${url}?token=${newToken}`)
          eventSourceRef.current = newEventSource
        }
      }, 3000)
    }

    return () => {
      eventSource.close()
      setIsConnected(false)
    }
  }, [url, enabled, onMessage])

  const close = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      setIsConnected(false)
    }
  }

  return { isConnected, close }
}