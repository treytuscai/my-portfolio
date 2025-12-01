import { useState } from 'react'
import './App.css'
import StartCard from './components/StartCard'
import PortfolioCard from './components/PortfolioCard'
import MacHeader from './components/MacHeader'
import MacDock from './components/MacDock'
import Finder from './components/Finder'
import Browser from './components/Browser'
import Terminal from './components/Terminal'
import Maze from './components/Maze'
import ErrorScreen from './components/ErrorScreen';

/**
 * App.jsx - Main application component
 * 
 * Manages the multi-window system for the macOS-style portfolio.
 * Handles window state, z-index layering, and app lifecycle.
 */

function App() {
    const [showStart, setShowStart] = useState(true)
    const [openApps, setOpenApps] = useState([])
    const [finderTab, setFinderTab] = useState('applications')
    const [nextId, setNextId] = useState(0)
    const [topZ, setTopZ] = useState(1000)

    /**
     * Opens a new app window or brings existing instance to front
     * @param {string} appType - Type of app to open (xcode, finder, terminal, etc.)
     * 
     * Single-instance apps (xcode, finder, terminal, chrome, maze) will focus
     * if already open rather than creating duplicate windows.
     */
    const openApp = (appType) => {
        const singleInstanceApps = ['xcode', 'finder', 'trash', 'terminal', 'chrome', 'maze']

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

    /**
     * Brings specified window to the top of the z-index stack
     * @param {number} appId - Unique ID of the app to bring forward
     */
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
            <ErrorScreen />
            <MacHeader />
            <main>
                {openApps.map(app => {
                    switch (app.type) {
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

                        case 'maze':
                            return (
                                <Maze
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