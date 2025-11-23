import { useEffect, useRef, useState } from 'react';
import './Browser.css';

export default function Browser({ setActiveApp }) {
    const canvasRef = useRef(null);
    const wsRef = useRef(null);
    const [connected, setConnected] = useState(false);
    const [url, setUrl] = useState('https://google.com');
    const [inputUrl, setInputUrl] = useState('https://google.com');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Connect to WebSocket server
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

        // Scale coordinates if canvas is displayed at different size
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

        // Handle special keys
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

        setUrl(url);
        setLoading(true);
        wsRef.current.send(JSON.stringify({
            type: 'navigate',
            url: url
        }));
    };

    return (
        <div className="browser-window" style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            height: '90%',
            maxWidth: '1200px',
            maxHeight: '800px',
            zIndex: 999,
            userSelect: 'none',
        }}>
            <div className="browser-container">
                {/* Header */}
                <div className="browser-header">
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
        </div>
    );
}