import { useState, useEffect } from 'react';
import './ErrorScreen.css';

/**
 * ErrorScreen.jsx - Responsive error handling
 * 
 * Displays macOS alert dialog when window
 * is below minimum size (800x600).
 * 
 * - Real-time window size detection
 * - macOS-style dark mode alert
 */

export default function ErrorScreen() {
    const [showError, setShowError] = useState(false);

    const MIN_WIDTH = 800;
    const MIN_HEIGHT = 600;

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            setShowError(width < MIN_WIDTH || height < MIN_HEIGHT);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!showError) return null;

    return (
        <div className="macos-error-overlay">
            <div className="macos-alert-dialog">
                <div className="alert-icon">
                    <div className="warning-triangle">
                        <div className="exclamation">!</div>
                    </div>
                    <div className="settings-badge">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" fill="#6e6e73"/>
                            <path d="M12 6v6M12 16h.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </div>
                </div>
                
                <h1 className="alert-title">Screen size too small</h1>
                
                <p className="alert-message">
                    This portfolio requires a larger screen to display properly. Please resize your window to at least {MIN_WIDTH}×{MIN_HEIGHT}.
                </p>
                
                <button className="alert-button">OK</button>
            </div>
        </div>
    );
}