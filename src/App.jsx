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
    const [openApps, setOpenApps] = useState([])
    const [finderTab, setFinderTab] = useState('applications')
    const [nextId, setNextId] = useState(0)
    const [topZ, setTopZ] = useState(1000) // Track highest z-index

    const openApp = (appType) => {
        const singleInstanceApps = ['xcode', 'finder', 'trash', 'terminal', 'chrome']
        
        if (singleInstanceApps.includes(appType)) {
            if (!openApps.find(app => app.type === appType)) {
                const newApp = { type: appType, id: nextId, zIndex: topZ + 1 }
                setOpenApps([...openApps, newApp])
                setNextId(nextId + 1)
                setTopZ(topZ + 1)
            } else {
                // Bring existing instance to front
                const existingApp = openApps.find(app => app.type === appType)
                bringToFront(existingApp.id)
            }
        } else {
            const newApp = { type: appType, id: nextId, zIndex: topZ + 1 }
            setOpenApps([...openApps, newApp])
            setNextId(nextId + 1)
            setTopZ(topZ + 1)
        }
    }

    const closeApp = (appId) => {
        setOpenApps(openApps.filter(app => app.id !== appId))
    }

    const bringToFront = (appId) => {
        setOpenApps(openApps.map(app => 
            app.id === appId 
                ? { ...app, zIndex: topZ + 1 }
                : app
        ))
        setTopZ(topZ + 1)
    }

    return (
        <>
            <MacHeader />
            <main>
                {openApps.map(app => {
                    switch(app.type) {
                        case 'xcode':
                            return showStart ? (
                                <StartCard 
                                    key={app.id}
                                    setShowStart={setShowStart} 
                                    setActiveApp={() => closeApp(app.id)}
                                    zIndex={app.zIndex}
                                    onFocus={() => bringToFront(app.id)}
                                />
                            ) : (
                                <PortfolioCard 
                                    key={app.id}
                                    setActiveApp={() => closeApp(app.id)}
                                    zIndex={app.zIndex}
                                    onFocus={() => bringToFront(app.id)}
                                />
                            )
                        
                        case 'finder':
                            return (
                                <Finder 
                                    key={app.id}
                                    setActiveApp={() => closeApp(app.id)}
                                    openApp={openApp}
                                    initialTab={finderTab}
                                    zIndex={app.zIndex}
                                    onFocus={() => bringToFront(app.id)}
                                />
                            )
                        
                        case 'trash':
                            return (
                                <Finder 
                                    key={app.id}
                                    setActiveApp={() => closeApp(app.id)}
                                    openApp={openApp}
                                    initialTab="trash"
                                    zIndex={app.zIndex}
                                    onFocus={() => bringToFront(app.id)}
                                />
                            )
                        
                        case 'chrome':
                            return (
                                <Browser 
                                    key={app.id}
                                    setActiveApp={() => closeApp(app.id)}
                                    zIndex={app.zIndex}
                                    onFocus={() => bringToFront(app.id)}
                                />
                            )
                        
                        case 'terminal':
                            return (
                                <Terminal 
                                    key={app.id}
                                    setActiveApp={() => closeApp(app.id)}
                                    zIndex={app.zIndex}
                                    onFocus={() => bringToFront(app.id)}
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