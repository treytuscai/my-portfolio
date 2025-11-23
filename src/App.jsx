import { useState } from 'react'
import './App.css'
import StartCard from './components/StartCard'
import PortfolioCard from './components/PortfolioCard'
import MacHeader from './components/MacHeader'
import MacDock from './components/MacDock'
import Finder from './components/Finder'
import Browser from './components/Browser'

function App() {
    const [showStart, setShowStart] = useState(true)
    const [activeApp, setActiveApp] = useState(null) // Start with no app open
    const [finderTab, setFinderTab] = useState('applications');

    return (
        <>
            <MacHeader />
            <main>
                {/* Xcode app */}
                {activeApp === 'xcode' && showStart && (
                    <StartCard setShowStart={setShowStart} setActiveApp={setActiveApp} />
                )}
                {activeApp === 'xcode' && !showStart && (
                    <PortfolioCard setActiveApp={setActiveApp} />
                )}

                {/* Finder */}
                {activeApp === 'finder' && (
                    <Finder setActiveApp={setActiveApp} initialTab={finderTab} />
                )}

                {/* Trash */}
                {activeApp === 'trash' && (
                    <Finder setActiveApp={setActiveApp} initialTab={finderTab} />
                )}

                {/* Browser */}
                {activeApp === 'chrome' && (
                    <Browser setActiveApp={setActiveApp} />
                )}

                {/* Add more apps here as needed */}
            </main>
            <MacDock
                activeApp={activeApp}
                setActiveApp={setActiveApp}
                setShowStart={setShowStart}
                setFinderTab={setFinderTab}
            />
        </>
    )
}

export default App