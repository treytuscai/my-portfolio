import './StartCard.css'
import { useRef, useEffect, useState } from 'react';

export default function StartCard(props) {
    const cardRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [hasCentered, setHasCentered] = useState(false);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        // 1. Center the card
        if (!hasCentered && card) {
            const { width, height } = card.getBoundingClientRect();
            const centerX = window.innerWidth / 2 - width / 2;
            const centerY = window.innerHeight / 2 - height / 2;
            setPosition({ top: centerY, left: centerX });
            setHasCentered(true);
        }

        // 2. Prevent image dragging
        const imgs = card.querySelectorAll('img');
        imgs.forEach(img => img.setAttribute('draggable', 'false'));

        // 3. Mouse event listeners
        const handleMouseMove = (e) => {
            if (!isDragging || !cardRef.current) return;

            const card = cardRef.current;
            const { width, height } = card.getBoundingClientRect();

            const maxLeft = window.innerWidth - width;
            const maxTop = window.innerHeight - height;

            let newLeft = e.clientX - offset.x;
            let newTop = e.clientY - offset.y;

            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(25, Math.min(newTop, maxTop));

            setPosition({ left: newLeft, top: newTop });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        const handleResize = () => {
            if (!cardRef.current) return;
            const { width, height } = cardRef.current.getBoundingClientRect();
            const maxLeft = window.innerWidth - width;
            const maxTop = window.innerHeight - height;

            setPosition(pos => ({
                top: Math.max(0, Math.min(pos.top, maxTop)),
                left: Math.max(0, Math.min(pos.left, maxLeft)),
            }));
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('resize', handleResize);
        };
    }, [isDragging, offset]);

    const handleMouseDown = (e) => {
        const rect = cardRef.current.getBoundingClientRect();
        setIsDragging(true);
        setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <div ref={cardRef} className="draggable-card" style={{ position: 'absolute', top: `${position.top}px`, left: `${position.left}px` }}>
            <main className="card-main" onMouseDown={handleMouseDown}>
                <img src="src/assets/x-circle-fill.svg" className="card-exit" />
                <section className="card-left-section">
                    <div className="xcode-container">
                        <div className="xcode-glow">
                            <img className="xcode-img" src="src/assets/xcode-icon.png" width="150px" alt="Xcode Logo" />
                        </div>
                        <h1 className="xcode-title">Trey Tuscai</h1>
                        <h5 className="xcode-version">Version 16.2</h5>
                    </div>
                    <div className="card-about">
                        <button className="about-button">
                            <img className="about-icon" src="src/assets/diff-added.svg" />
                            <h4>Houston, Texas</h4>
                        </button>
                        <button className="about-button">
                            <img className="about-icon" src="src/assets/download.svg" />
                            <h4>MHCI '26 @ CMU | CS-AI '25 @ Colby</h4>
                        </button>
                        <button className="about-button">
                            <img className="about-icon" src="src/assets/file-directory.svg" />
                            <h4>Mobile & ML Engineer | HCI Researcher</h4>
                        </button>
                    </div>
                </section>
                <section className="card-right-section">
                    <button className="button-portfolio" onClick={() => props.setShowStart(false)}>
                        <img src="src/assets/project-icon.png" width="35px" alt="Bundle Image" />
                        <div className="button-text">
                            <p className="button-title">Portfolio</p>
                            <p className="button-dir">~Desktop/Developer</p>
                        </div>
                    </button>
                </section>
            </main>
        </div>
    )
}
