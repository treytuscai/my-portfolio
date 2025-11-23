// src/components/Browser.jsx
import { useEffect, useRef, useState } from 'react';
import './Browser.css';

export default function Browser({ setActiveApp }) {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const wsRef = useRef(null);
    const [connected, setConnected] = useState(false);
    const [inputUrl, setInputUrl] = useState('https://google.com');
    const [loading, setLoading] = useState(false);
    
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeDir, setResizeDir] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState(() => {
        const centerX = window.innerWidth / 2 - 720 / 2;
        const centerY = window.innerHeight / 2 - 490 / 2;
        return { top: centerY, left: centerX };
    });
    const [size, setSize] = useState({ width: 720, height: 490 });

    const MIN_WIDTH = 600;
    const MIN_HEIGHT = 400;

    // WebSocket connection
    useEffect(() => {
        wsRef.current = new WebSocket('ws://localhost:8080');

        wsRef.current.onopen = () => {
            console.log('Connected to browser server');
            setConnected(true);
        };

        wsRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'screenshot') {
                displayScreenshot(data.data);
                setLoading(false);
            } else if (data.type === 'error') {
                console.error('Server error:', data.message);
                setLoading(false);
            }
        };

        wsRef.current.onerror = (error) => {
            console.error('WebSocket error:', error);
            setConnected(false);
        };

        wsRef.current.onclose = () => {
            console.log('Disconnected from browser server');
            setConnected(false);
        };

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    // Drag and resize handlers
    useEffect(() => {
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

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing, resizeDir, offset, size, position]);

    const handleHeaderMouseDown = (e) => {
        const rect = containerRef.current.getBoundingClientRect();
        setIsDragging(true);
        setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const startResize = (e, direction) => {
        e.stopPropagation();
        setIsResizing(true);
        setResizeDir(direction);
    };

    const displayScreenshot = (base64) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };

        img.src = `data:image/png;base64,${base64}`;
    };

    const handleCanvasClick = (e) => {
        if (!connected) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        setLoading(true);
        wsRef.current.send(JSON.stringify({
            type: 'click',
            x: Math.round(x * scaleX),
            y: Math.round(y * scaleY)
        }));
    };

    const handleKeyDown = (e) => {
        if (!connected) return;

        const specialKeys = {
            'Enter': 'Enter',
            'Backspace': 'Backspace',
            'Tab': 'Tab',
            'ArrowUp': 'ArrowUp',
            'ArrowDown': 'ArrowDown',
            'ArrowLeft': 'ArrowLeft',
            'ArrowRight': 'ArrowRight',
            'Escape': 'Escape',
        };

        if (e.key in specialKeys) {
            e.preventDefault();
            setLoading(true);
            wsRef.current.send(JSON.stringify({
                type: 'key',
                key: specialKeys[e.key]
            }));
        }
    };

    const handleKeyPress = (e) => {
        if (!connected) return;

        if (e.key.length === 1) {
            setLoading(true);
            wsRef.current.send(JSON.stringify({
                type: 'type',
                text: e.key
            }));
        }
    };

    const handleScroll = (e) => {
        if (!connected) return;

        const delta = e.deltaY > 0 ? 50 : -50;
        wsRef.current.send(JSON.stringify({
            type: 'scroll',
            delta: delta
        }));
    };

    const handleNavigate = () => {
        if (!connected) return;

        let url = inputUrl;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        setLoading(true);
        wsRef.current.send(JSON.stringify({
            type: 'navigate',
            url: url
        }));
    };

    return (
        <div
            ref={containerRef}
            className="browser-window"
            style={{
                position: 'absolute',
                top: `${position.top}px`,
                left: `${position.left}px`,
                width: `${size.width}px`,
                height: `${size.height}px`,
            }}
        >
            <div className="browser-container">
                {/* Header */}
                <div className="browser-header" onMouseDown={handleHeaderMouseDown}>
                    <button
                        className="browser-button browser-button-close"
                        onClick={() => setActiveApp(null)}
                    />
                    <button className="browser-button browser-button-min" />
                    <button className="browser-button browser-button-max" />
                    <div className="browser-header-spacer" />
                    <span className="browser-header-title">Chrome</span>
                </div>

                {/* Toolbar */}
                <div className="browser-toolbar">
                    <div className="browser-address-bar">
                        <input
                            type="text"
                            value={inputUrl}
                            onChange={(e) => setInputUrl(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleNavigate()}
                            placeholder="Enter URL..."
                            className="browser-url-input"
                        />
                        <button onClick={handleNavigate} className="browser-go-btn">Go</button>
                    </div>
                </div>

                {/* Browser Canvas */}
                <div className="browser-content">
                    {!connected ? (
                        <div className="browser-error">
                            <p>Unable to connect to browser server</p>
                            <p style={{ fontSize: '12px', color: '#999' }}>
                                Make sure the server is running on port 8080
                            </p>
                        </div>
                    ) : (
                        <>
                            <canvas
                                ref={canvasRef}
                                className="browser-canvas"
                                onClick={handleCanvasClick}
                                onKeyDown={handleKeyDown}
                                onKeyPress={handleKeyPress}
                                onWheel={handleScroll}
                                tabIndex={0}
                            />
                            {loading && <div className="browser-loading">Loading...</div>}
                        </>
                    )}
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