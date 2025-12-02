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
 * App.jsx - Root component managing the macOS-style window system
 * 
 * Architecture: Single source of truth for all open windows.
 * Each window tracks its own position/size, but App controls:
 * - Which windows exist (openApps array)
 * - Z-index layering (topZ counter)
 * - Window lifecycle (open/close/focus)
 */
function App() {
    const [showStart, setShowStart] = useState(true)      // Toggle between Xcode welcome/portfolio views
    const [openApps, setOpenApps] = useState([])          // Active windows: { type, id, zIndex }
    const [finderTab, setFinderTab] = useState('applications')
    const [nextId, setNextId] = useState(0)               // Unique ID generator for windows
    const [topZ, setTopZ] = useState(1000)                // Z-index counter for window stacking

    /**
     * Opens an app window. Single-instance apps (xcode, finder, etc.) 
     * will focus existing window instead of creating duplicates.
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
                // Already open - just bring to front
                const existingApp = openApps.find(app => app.type === appType)
                bringToFront(existingApp.id)
            }
        } else {
            // Multi-instance apps always create new window
            const newApp = { type: appType, id: nextId, zIndex: topZ + 1 }
            setOpenApps([...openApps, newApp])
            setNextId(nextId + 1)
            setTopZ(topZ + 1)
        }
    }

    const closeApp = (appId) => {
        setOpenApps(openApps.filter(app => app.id !== appId))
    }

    // Updates target window's zIndex to current topZ, bringing it to front
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
                {/* Render each open app based on its type */}
                {openApps.map(app => {
                    switch (app.type) {
                        case 'xcode':
                            // Xcode has two views: welcome screen and main portfolio
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
                            // Trash is just Finder with a different initial tab
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