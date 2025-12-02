import './MacDock.css';
import { useState } from 'react';

/**
 * MacDock.jsx - macOS-style application dock
 * 
 * Features:
 * - Hover magnification effect via CSS
 * - Active app indicator dots
 * - Tooltips on hover
 * - Click handling delegates to parent openApp callback
 * - Divider before Trash icon
 */
export default function MacDock({ openApps, openApp, setShowStart, setFinderTab }) {
    // Static app definitions - order determines dock layout
    const [apps] = useState([
        { id: 'finder', name: 'Finder', icon: 'src/assets/finder-icon.png' },
        { id: 'chrome', name: 'Chrome', icon: 'src/assets/chrome-icon.png' },
        { id: 'xcode', name: 'Xcode', icon: 'src/assets/xcode-dock-icon.png' },
        { id: 'maze', name: 'Maze', icon: 'src/assets/maze-icon.png' },
        { id: 'terminal', name: 'Terminal', icon: 'src/assets/terminal-icon.png' },
        // Divider
        { id: 'trash', name: 'Trash', icon: 'src/assets/trash-icon.png', afterDivider: true },
    ]);

    // Routes dock clicks to appropriate actions
    const handleIconClick = (clickedApp) => {
        if (clickedApp.id === 'xcode') {
            openApp('xcode')
            setShowStart(true)  // Reset to welcome screen when opening from dock
        }

        if (clickedApp.id === 'finder') {
            openApp('finder')
            setFinderTab('applications')
        }

        if (clickedApp.id === 'trash') {
            openApp('trash')
            setFinderTab('trash')
        }

        if (clickedApp.id === 'chrome') {
            openApp('chrome')
        }

        if (clickedApp.id === 'maze') {
            openApp('maze')
        }

        if (clickedApp.id === 'terminal') {
            openApp('terminal')
        }
    }

    // Checks if an app type is currently open (for indicator dot)
    const isAppOpen = (appId) => {
        return openApps.some(app => app.type === appId || app.type === 'trash' && appId === 'trash')
    }

    return (
        <div className="mac-dock">
            {apps.map((app) => (
                <>
                    {/* Render divider before apps marked with afterDivider */}
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