import './PortfolioCard.css'
import FileDirectory from './FileDirectory'
import Code from './Code'
import { useState, useRef, useEffect } from 'react'

export default function PortfolioCard(props) {
    const cardRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false)
    const [offset, setOffset] = useState({ x: 0, y: 0 })
    const [position, setPosition] = useState(() => {
        const centerX = window.innerWidth / 2 - 800 / 2
        const centerY = window.innerHeight / 2 - 600 / 2
        return { top: centerY, left: centerX }
    })
    const [size, setSize] = useState({ width: 800, height: 600 })

    const MIN_WIDTH = 400
    const MIN_HEIGHT = 300

    useEffect(() => {
        // 1. Prevent image dragging
        const imgs = cardRef.current.querySelectorAll('img');
        imgs.forEach(img => img.setAttribute('draggable', 'false'));

        // 2. Mouse event listeners
        const handleMouseMove = (e) => {
            if (!isDragging || !cardRef.current) return;

            const maxLeft = window.innerWidth - size.width
            const maxTop = window.innerHeight - size.height

            let newLeft = e.clientX - offset.x
            let newTop = e.clientY - offset.y

            newLeft = Math.max(0, Math.min(newLeft, maxLeft))
            newTop = Math.max(25, Math.min(newTop, maxTop))

            setPosition({ left: newLeft, top: newTop })
        }

        const handleMouseUp = () => {
            setIsDragging(false)
        }

        const handleResize = () => {
            if (!cardRef.current) return;
            const { width, height } = cardRef.current.getBoundingClientRect();
            const maxLeft = window.innerWidth - width;
            const maxTop = window.innerHeight - height;

            setPosition(pos => ({
                top: Math.max(25, Math.min(pos.top, maxTop)),
                left: Math.max(0, Math.min(pos.left, maxLeft)),
            }));
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleMouseUp)

        // Clean up
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging, offset])

    const handleMouseDown = (e) => {
        const rect = cardRef.current.getBoundingClientRect()
        setIsDragging(true)
        setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }

    const [codeContents, setCodeContents] = useState({})

    return (
        <div ref={cardRef} className="draggable-card" style={{ position: 'absolute', top: `${position.top}px`, left: `${position.left}px`, width: `${size.width}px`, height: `${size.height}px` }}>
            <main className="portfolio-main" onMouseDown={handleMouseDown}>
                <FileDirectory setShowStart={props.setShowStart} setCodeContents={setCodeContents} />
                <Code codeContents={codeContents} />
            </main>
        </div>
    )
}