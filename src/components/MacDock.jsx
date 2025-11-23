import './MacDock.css';
import { useState } from 'react';

export default function MacDock({ activeApp, setActiveApp, setShowStart, setFinderTab }) {
    const [apps] = useState([
        { id: 'finder', name: 'Finder', icon: 'src/assets/finder-icon.png', active: false },
        { id: 'chrome', name: 'Chrome', icon: 'src/assets/chrome-icon.png', active: false },
        { id: 'xcode', name: 'Xcode', icon: 'src/assets/xcode-dock-icon.png', active: false },
        // Divider
        { id: 'trash', name: 'Trash', icon: 'src/assets/trash-icon.png', active: false, afterDivider: true },
    ]);

    const handleIconClick = (clickedApp) => {
        // Handle Xcode
        if (clickedApp.id === 'xcode') {
            setActiveApp('xcode');
            setShowStart(true); // Show the StartCard when clicking Xcode
        }

        // Handle Finder
        if (clickedApp.id === 'finder') {
            setActiveApp('finder');
            setFinderTab('applications');
        }

        // Handle Trash
        if (clickedApp.id === 'trash') {
            setActiveApp('trash');
            setFinderTab('trash');
        }

        // Handle Chrome
        if (clickedApp.id === 'chrome') {
            setActiveApp('chrome');
        }
    };

    return (
        <div className="mac-dock">
            {apps.map((app) => (
                <>
                    {app.afterDivider && <div key={`divider-${app.id}`} className="dock-divider" />}
                    <div key={app.id} className="dock-icon-wrapper">
                        <div
                            className={`dock-icon ${activeApp === app.id ? 'active' : ''}`}
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
    );
}