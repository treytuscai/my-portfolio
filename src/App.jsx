import { useState } from 'react'
import './App.css'
import StartCard from './components/StartCard'
import PortfolioCard from './components/PortfolioCard'
import MacHeader from './components/MacHeader'


function App() {

    const [showStart, setShowStart] = useState(true)

    return (
        <>
            <MacHeader />
            <main>
                {showStart ? (
                    <StartCard setShowStart={setShowStart} />
                ) : (
                    <PortfolioCard setShowStart={setShowStart} />
                )}
            </main>
        </>
    )
}

export default App
