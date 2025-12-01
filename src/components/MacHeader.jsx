import { useState } from 'react';
import './MacHeader.css';

/**
 * MacHeader.jsx - macOS-style menu bar
 * 
 * Features:
 * - Dropdown menus with humorous developer-themed items
 * - Apple menu styling
 * - Outside-click to close menus
 * - Keyboard shortcut indicators (⌘⌥⇧⌃)
 */

export default function MacHeader() {
    const [activeMenu, setActiveMenu] = useState(null);
    const now = new Date();
    const weekday = now.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    /**
     * Menu structure with me-themed items
     * Includes keyboard shortcuts using macOS symbols
     */
    const menus = {
        'Trey Tuscai': [
            'About This Guy',
            '---',
            'System Preferences... (Just Kidding)',
            'Recent Projects ▶',
            '---',
            'Hide Imposter Syndrome ⌘H',
            'Hide Others\' Success ⌥⌘H',
            'Show All (Even the Bugs)',
            '---',
            'Log Out of Life',
            'Sleep Mode ⌃⌘Q',
        ],
        'File': [
            'New Project (Another One?)',
            'Open... ⌘O',
            'Open Recent ▶',
            '---',
            'Close Tab ⌘W',
            'Close All Hopes and Dreams',
            'Save ⌘S',
            'Save As "Final_FINAL_v2" ⇧⌘S',
            '---',
            'Export Resume as PDF',
            'Export Will To Live',
            '---',
            'Print Money',
        ],
        'Edit': [
            'Undo Last Life Choice ⌘Z',
            'Redo Mistakes ⇧⌘Z',
            '---',
            'Cut Corners ⌘X',
            'Copy Paste from Stack Overflow ⌘C',
            'Paste ⌘V',
            'Paste and Match Style (Plagiarism)',
            '---',
            'Find Will to Continue ⌘F',
            'Find and Replace Sleep with Coffee',
        ],
        'View': [
            'Show Toolbar',
            'Hide My Insecurities',
            'Customize Toolbar...',
            '---',
            'Show Sidebar ⌘⌥S',
            'Hide Technical Debt',
            'Enter Full Screen Mode ⌃⌘F',
            'Exit Reality',
            '---',
            'Actual Size ⌘0',
            'Zoom In on Red Flags ⌘+',
            'Zoom Out of Responsibilities ⌘-',
            '---',
            'Developer Tools (Already Open)',
        ],
        'Window': [
            'Minimize All Expectations ⌘M',
            'Zoom Window to Fit Ego',
            '---',
            'Bring All to Front (Except Deadlines)',
            'Stack Windows Like My Unread Emails',
            'Tile Windows (Unsuccessfully)',
            '---',
            'Window 1: Terminal (5 hours idle)',
            'Window 2: "TODO.txt" (Never opening)',
            'Window 3: LinkedIn (Pretending to work)',
            'Window 4: Stack Overflow',
        ],
        'Help': [
            'Search for Motivation',
            '---',
            'Trey Tuscai Help (Good Luck)',
            'Send Feedback to the Void',
            '---',
            'Coffee Locations Near Me ☕',
            'Keyboard Shortcuts (You Won\'t Use)',
            '---',
            'Report a Bug (It\'s a Feature)',
            'Check for Updates... (Procrastinating)',
            '---',
            'Is This Working?',
            'Why Am I Like This?',
            'Stack Overflow ⌘⇧/',
        ],
    };

    const handleMenuClick = (menuName) => {
        setActiveMenu(activeMenu === menuName ? null : menuName);
    };

    const handleMenuItemClick = (e) => {
        e.stopPropagation();
        setActiveMenu(null);
    };

    // Close menu when clicking outside
    const handleOutsideClick = () => {
        if (activeMenu) setActiveMenu(null);
    };

    return (
        <>
            {activeMenu && <div className="menu-overlay" onClick={handleOutsideClick} />}
            <header className="mac-header">
                <div className="mac-header-left">
                    <span className="apple-logo"></span>
                    
                    <div className="menu-wrapper">
                        <span 
                            className={`menu-item app-name ${activeMenu === 'Trey Tuscai' ? 'active' : ''}`}
                            onClick={() => handleMenuClick('Trey Tuscai')}
                        >
                            Trey Tuscai
                        </span>
                        {activeMenu === 'Trey Tuscai' && (
                            <div className="dropdown-menu" onClick={handleMenuItemClick}>
                                {menus['Trey Tuscai'].map((item, index) => (
                                    item === '---' ? (
                                        <div key={index} className="menu-divider" />
                                    ) : (
                                        <div key={index} className="menu-option">{item}</div>
                                    )
                                ))}
                            </div>
                        )}
                    </div>

                    {['File', 'Edit', 'View', 'Window', 'Help'].map((menuName) => (
                        <div key={menuName} className="menu-wrapper">
                            <span 
                                className={`menu-item ${activeMenu === menuName ? 'active' : ''}`}
                                onClick={() => handleMenuClick(menuName)}
                            >
                                {menuName}
                            </span>
                            {activeMenu === menuName && (
                                <div className="dropdown-menu" onClick={handleMenuItemClick}>
                                    {menus[menuName].map((item, index) => (
                                        item === '---' ? (
                                            <div key={index} className="menu-divider" />
                                        ) : (
                                            <div key={index} className="menu-option">{item}</div>
                                        )
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="mac-header-right">
                    <span className="header-time">{`${weekday} ${monthDay}`}</span>
                    <span className="header-time">{`${time}`}</span>
                </div>
            </header>
        </>
    );
}