import './MacDock.css';
import { useState } from 'react';

export default function MacDock({ openApps, openApp, setShowStart, setFinderTab }) {
    const [apps] = useState([
        { id: 'finder', name: 'Finder', icon: 'src/assets/finder-icon.png' },
        { id: 'chrome', name: 'Chrome', icon: 'src/assets/chrome-icon.png' },
        { id: 'xcode', name: 'Xcode', icon: 'src/assets/xcode-dock-icon.png' },
        { id: 'terminal', name: 'Terminal', icon: 'src/assets/terminal-icon.png' },
        // Divider
        { id: 'trash', name: 'Trash', icon: 'src/assets/trash-icon.png', afterDivider: true },
    ]);

    const handleIconClick = (clickedApp) => {
        // Handle Xcode
        if (clickedApp.id === 'xcode') {
            openApp('xcode')
            setShowStart(true)
        }

        // Handle Finder
        if (clickedApp.id === 'finder') {
            openApp('finder')
            setFinderTab('applications')
        }

        // Handle Trash
        if (clickedApp.id === 'trash') {
            openApp('trash')
            setFinderTab('trash')
        }

        // Handle Chrome
        if (clickedApp.id === 'chrome') {
            openApp('chrome')
        }

        // Handle Terminal
        if (clickedApp.id === 'terminal') {
            openApp('terminal')
        }
    }

    // Check if app type is currently open
    const isAppOpen = (appId) => {
        return openApps.some(app => app.type === appId || app.type === 'trash' && appId === 'trash')
    }

    return (
        <div className="mac-dock">
            {apps.map((app) => (
                <>
                    {app.afterDivider && <div key={`divider-${app.id}`} className="dock-divider" />}
                    <div key={app.id} className="dock-icon-wrapper">
                        <div
                            className={`dock-icon ${isAppOpen(app.id) ? 'active' : ''}`}
                            data-app-id={app.id}
                            onClick={() => handleIconClick(app)}
                        >
                            <img src={app.icon} alt={app.name} draggable="false" />
                        </div>
                        <div className="dock-tooltip">{app.name}</div>
                    </div>
                </>
            ))}
        </div>
    )
}