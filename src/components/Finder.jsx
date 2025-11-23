import { useState, useRef, useEffect } from 'react';
import './Finder.css';

export default function Finder({ setActiveApp, initialTab = 'applications' }) {
    const cardRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeDir, setResizeDir] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState(() => {
        const centerX = window.innerWidth / 2 - 800 / 2;
        const centerY = window.innerHeight / 2 - 600 / 2;
        return { top: centerY, left: centerX };
    });
    const [size, setSize] = useState({ width: 800, height: 600 });
    const [selectedSidebar, setSelectedSidebar] = useState(initialTab);
    

    const MIN_WIDTH = 500;
    const MIN_HEIGHT = 350;

    const applications = [
        { id: 'xcode', name: 'Xcode', icon: 'src/assets/xcode-dock-icon.png' },
        { id: 'chrome', name: 'Chrome', icon: 'src/assets/chrome-icon.png' },
    ];

    useEffect(() => {
        const imgs = cardRef.current?.querySelectorAll('img');
        imgs?.forEach(img => img.setAttribute('draggable', 'false'));

        const handleMouseMove = (e) => {
            if (isDragging) {
                const maxLeft = window.innerWidth - size.width;
                const maxTop = window.innerHeight - size.height;

                let newLeft = e.clientX - offset.x;
                let newTop = e.clientY - offset.y;

                newLeft = Math.max(0, Math.min(newLeft, maxLeft));
                newTop = Math.max(25, Math.min(newTop, maxTop));

                setPosition({ left: newLeft, top: newTop });
            } else if (isResizing) {
                let newWidth = size.width;
                let newHeight = size.height;
                let newLeft = position.left;
                let newTop = position.top;

                if (resizeDir.includes('right')) {
                    newWidth = Math.max(MIN_WIDTH, e.clientX - position.left);
                }
                if (resizeDir.includes('bottom')) {
                    newHeight = Math.max(MIN_HEIGHT, e.clientY - position.top);
                }
                if (resizeDir.includes('left')) {
                    const diffX = e.clientX - position.left;
                    newWidth = Math.max(MIN_WIDTH, size.width - diffX);
                    if (newWidth > MIN_WIDTH) newLeft = e.clientX;
                }
                if (resizeDir.includes('top')) {
                    const diffY = e.clientY - position.top;
                    newHeight = Math.max(MIN_HEIGHT, size.height - diffY);
                    if (newHeight > MIN_HEIGHT) newTop = e.clientY;
                }

                setSize({ width: newWidth, height: newHeight });
                setPosition({ left: newLeft, top: newTop });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(false);
            setResizeDir(null);
        };

        const handleBrowserResize = () => {
            if (!cardRef.current) return;
            const { width, height } = cardRef.current.getBoundingClientRect();
            const maxLeft = window.innerWidth - width;
            const maxTop = window.innerHeight - height;

            setPosition(pos => ({
                top: Math.max(25, Math.min(pos.top, maxTop)),
                left: Math.max(0, Math.min(pos.left, maxLeft)),
            }));
        };

        window.addEventListener('resize', handleBrowserResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('resize', handleBrowserResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing, resizeDir, offset, size, position]);

    const handleMouseDown = (e) => {
        const rect = cardRef.current.getBoundingClientRect();
        setIsDragging(true);
        setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const startResize = (e, direction) => {
        e.stopPropagation();
        setIsResizing(true);
        setResizeDir(direction);
    };

    const handleAppClick = (appId) => {
        setActiveApp(appId);
    };

    return (
        <div
            ref={cardRef}
            className="finder-window"
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                width: `${size.width}px`,
                height: `${size.height}px`,
            }}
        >
            <div className="finder-container">
                {/* Header */}
                <div className="finder-header" onMouseDown={handleMouseDown}>
                    <button
                        className="finder-button finder-button-close"
                        onClick={() => setActiveApp(null)}
                    />
                    <button className="finder-button finder-button-min" />
                    <button className="finder-button finder-button-max" />
                    <div className="finder-header-spacer" />
                </div>

                {/* Main Content */}
                <div className="finder-main">
                    {/* Sidebar */}
                    <div className="finder-sidebar">
                        <div className="finder-sidebar-section">
                            <div className="finder-sidebar-section-label">Favorites</div>
                            <button
                                className={`finder-sidebar-item ${selectedSidebar === 'applications' ? 'active' : ''}`}
                                onClick={() => setSelectedSidebar('applications')}
                            >
                                <span>📁</span>
                                Applications
                            </button>
                        </div>

                        <div className="finder-sidebar-divider"></div>

                        <div className="finder-sidebar-section">
                            <button
                                className={`finder-sidebar-item ${selectedSidebar === 'trash' ? 'active' : ''}`}
                                onClick={() => setSelectedSidebar('trash')}
                            >
                                <span>🗑️</span>
                                Trash
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="finder-content">
                        {/* Toolbar */}
                        <div className="finder-toolbar">
                            <h2 className="finder-toolbar-title">
                                {selectedSidebar === 'applications' ? 'Applications' : 'Trash'}
                            </h2>
                            <div className="finder-toolbar-buttons">
                                <button className="finder-toolbar-btn">☰</button>
                                <button className="finder-toolbar-btn">⊕</button>
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="finder-grid">
                            {selectedSidebar === 'applications' ? (
                                applications.map(app => (
                                    <div
                                        key={app.id}
                                        className="finder-grid-item"
                                        onClick={() => handleAppClick(app.id)}
                                    >
                                        <img src={app.icon} alt={app.name} className="finder-grid-icon" />
                                        <span className="finder-grid-name">{app.name}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="finder-grid-empty">Trash is empty</div>
                            )}
                        </div>

                        {/* Status bar */}
                        <div className="finder-statusbar">
                            {selectedSidebar === 'applications' ? `${applications.length} items` : 'Trash is empty'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Resize handles */}
            <div className="resize-handle top" onMouseDown={(e) => startResize(e, 'top')} />
            <div className="resize-handle bottom" onMouseDown={(e) => startResize(e, 'bottom')} />
            <div className="resize-handle left" onMouseDown={(e) => startResize(e, 'left')} />
            <div className="resize-handle right" onMouseDown={(e) => startResize(e, 'right')} />
            <div className="resize-handle top-left" onMouseDown={(e) => startResize(e, 'top left')} />
            <div className="resize-handle top-right" onMouseDown={(e) => startResize(e, 'top right')} />
            <div className="resize-handle bottom-left" onMouseDown={(e) => startResize(e, 'bottom left')} />
            <div className="resize-handle bottom-right" onMouseDown={(e) => startResize(e, 'bottom right')} />
        </div>
    );
}