import { useState } from 'react'
import './App.css'
import StartCard from './components/StartCard'
import PortfolioCard from './components/PortfolioCard'
import MacHeader from './components/MacHeader'
import MacDock from './components/MacDock'
//import DoomGame from './components/DoomGame'

function App() {
    const [showStart, setShowStart] = useState(true)
    const [activeApp, setActiveApp] = useState(null) // Start with no app open

    return (
        <>
            <MacHeader />
            <main>
                {/* Xcode app */}
                {activeApp === 'xcode' && showStart && (
                    <StartCard setShowStart={setShowStart} setActiveApp={setActiveApp}/>
                )}
                {activeApp === 'xcode' && !showStart && (
                    <PortfolioCard setActiveApp={setActiveApp}/>
                )}
                
                {/* Doom game 
                {activeApp === 'doom' && (
                    <DoomGame setActiveApp={setActiveApp} />
                )} */}
                
                {/* Add more apps here as needed */}
            </main>
            <MacDock 
                activeApp={activeApp} 
                setActiveApp={setActiveApp} 
                setShowStart={setShowStart} 
            />
        </>
    )
}

export default App