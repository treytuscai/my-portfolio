import { useState } from 'react'
import './App.css'
import StartCard from './components/StartCard'
import PortfolioCard from './components/PortfolioCard'
import MacHeader from './components/MacHeader'
import MacDock from './components/MacDock'
import Finder from './components/Finder'
import Browser from './components/Browser'
import Terminal from './components/Terminal'

function App() {
    const [showStart, setShowStart] = useState(true)
    const [openApps, setOpenApps] = useState([]) // Array of open app instances
    const [finderTab, setFinderTab] = useState('applications')
    const [nextId, setNextId] = useState(0)

    const openApp = (appType) => {
        // Check if app should only have one instance
        const singleInstanceApps = ['xcode', 'terminal', 'finder', 'chrome', 'trash']

        if (singleInstanceApps.includes(appType)) {
            // Only one instance allowed
            if (!openApps.find(app => app.type === appType)) {
                setOpenApps([...openApps, { type: appType, id: nextId }])
                setNextId(nextId + 1)
            }
        } else {
            // Multiple instances allowed
            setOpenApps([...openApps, { type: appType, id: nextId }])
            setNextId(nextId + 1)
        }
    }

    const closeApp = (appId) => {
        setOpenApps(openApps.filter(app => app.id !== appId))
    }

    return (
        <>
            <MacHeader />
            <main>
                {/* Render all open apps */}
                {openApps.map(app => {
                    switch (app.type) {
                        case 'xcode':
                            return showStart ? (
                                <StartCard
                                    key={app.id}
                                    setShowStart={setShowStart}
                                    setActiveApp={() => closeApp(app.id)}
                                />
                            ) : (
                                <PortfolioCard
                                    key={app.id}
                                    setActiveApp={() => closeApp(app.id)}
                                />
                            )

                        case 'finder':
                            return (
                                <Finder
                                    key={app.id}
                                    setActiveApp={() => closeApp(app.id)}
                                    openApp={openApp}
                                    initialTab={finderTab}
                                />
                            )

                        case 'trash':
                            return (
                                <Finder
                                    key={app.id}
                                    setActiveApp={() => closeApp(app.id)}
                                    openApp={openApp}
                                    initialTab="trash"
                                />
                            )

                        case 'chrome':
                            return (
                                <Browser
                                    key={app.id}
                                    setActiveApp={() => closeApp(app.id)}
                                />
                            )

                        case 'terminal':
                            return (
                                <Terminal
                                    key={app.id}
                                    setActiveApp={() => closeApp(app.id)}
                                />
                            )

                        default:
                            return null
                    }
                })}
            </main>
            <MacDock
                openApps={openApps}
                openApp={openApp}
                setShowStart={setShowStart}
                setFinderTab={setFinderTab}
            />
        </>
    )
}

export default App