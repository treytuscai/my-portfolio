import { useState } from 'react'
import './App.css'
import StartCard from './components/StartCard'
import PortfolioCard from './components/PortfolioCard'


function App() {

    const [showStart, setShowStart] = useState(true)

    return (
        <main>
            {showStart ? (
                <StartCard setShowStart={setShowStart} />
            ) : (
                <PortfolioCard setShowStart={setShowStart}/>
            )}
        </main>
    )
}

export default App
