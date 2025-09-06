import { useState, useEffect } from 'react'
import Title from '../components/Title/Title'
import UrlBar from '../components/UrlBar/UrlBar'
import DonationModal from '../components/DonationModal/DonationModal'
import GameModal from '../components/GameModal/GameModal'
import { useSSE } from '../hooks/useSSE'
import './ClientPage.css'

function ClientPage() {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false)
  const [isGameModalOpen, setIsGameModalOpen] = useState(false)
  
  const [serviceOnline, setServiceOnline] = useState(true)
  
  // Check service health every 30 seconds
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8828'}/health`)
        setServiceOnline(response.ok)
      } catch {
        setServiceOnline(false)
      }
    }
    
    checkHealth()
    const interval = setInterval(checkHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="client-page">
      <div className="status-bar">
        <div className={`connection-status ${serviceOnline ? 'connected' : 'disconnected'}`}>
          <span className="status-dot"></span>
          <span className="status-text">Service {serviceOnline ? 'Online' : 'Offline'}</span>
        </div>
      </div>
      <Title />
      <UrlBar />
      
      <div className="action-buttons">
        <button 
          className="game-btn"
          onClick={() => setIsGameModalOpen(true)}
        >
          Play Snake Game
        </button>
        
        <button 
          className="support-btn"
          onClick={() => setIsDonationModalOpen(true)}
        >
          Support Us
        </button>
      </div>
      
      <DonationModal 
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
      />
      
      <GameModal 
        isOpen={isGameModalOpen}
        onClose={() => setIsGameModalOpen(false)}
      />
    </div>
  )
}

export default ClientPage