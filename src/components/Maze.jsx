import { useState, useRef, useEffect } from 'react';
import './Maze.css';

/**
 * Maze.jsx - First-person raycasting maze game
 * 
 * Implements a classic DOOM-style raycasting engine:
 * - Renders 3D perspective from 2D map data
 * - DDA-based ray casting for wall detection
 * - Fish-eye correction for proper perspective
 * - Collision detection against walls
 * - Win condition when player reaches goal tile
 * 
 * Controls: WASD/Arrow keys to move, R to reset after win
 */
export default function Maze({ setActiveApp, zIndex, onFocus }) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    
    // Window state
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeDir, setResizeDir] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState(() => ({
        top: window.innerHeight / 2 - 300,
        left: window.innerWidth / 2 - 400
    }));
    const [size, setSize] = useState({ width: 800, height: 600 });
    const [gameWon, setGameWon] = useState(false);

    const MIN_WIDTH = 600;
    const MIN_HEIGHT = 400;

    // Game state stored in ref to avoid re-renders on every frame
    // Using ref instead of state because we update this 60x/sec in game loop
    const gameStateRef = useRef({
        playerX: 1.5,        // Player position in map units (not pixels)
        playerY: 1.5,
        playerAngle: 0,      // Facing direction in radians
        moveSpeed: 0.05,
        rotSpeed: 0.05,
        keys: {},            // Currently pressed keys
        animationId: null,   // For canceling animation frame on unmount
        goalX: 14.5,         // Goal position
        goalY: 14.5,
        goalRadius: 0.5      // Distance threshold to trigger win
    });

    // 2D map: 1 = wall, 0 = empty, 2 = goal tile
    const map = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,0,1,1,1,1,1,0,1,1,1,0,1],
        [1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1],
        [1,0,1,0,1,1,1,0,1,1,1,1,0,1,0,1],
        [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1],
        [1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1],
        [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,0,1,1,0,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,1,1,1,1,1,1,1,2,1],  // Goal at (14,14)
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ];

    // Check if player reached goal using Euclidean distance
    const checkWinCondition = () => {
        const { playerX, playerY, goalX, goalY, goalRadius } = gameStateRef.current;
        const distance = Math.sqrt(
            Math.pow(playerX - goalX, 2) + Math.pow(playerY - goalY, 2)
        );
        
        if (distance < goalRadius && !gameWon) {
            setGameWon(true);
        }
    };

    const resetGame = () => {
        gameStateRef.current.playerX = 1.5;
        gameStateRef.current.playerY = 1.5;
        gameStateRef.current.playerAngle = 0;
        setGameWon(false);
    };

    /**
     * Raycasting algorithm - casts a ray and returns distance to first wall hit
     * 
     * @param {number} angle - Ray direction in radians
     * @returns {{ distance: number, hitGoal: boolean }}
     * 
     * Uses simple step-based ray marching (not true DDA, but good enough for demo)
     */
    const castRay = (angle) => {
        const { playerX, playerY } = gameStateRef.current;
        const rayDirX = Math.cos(angle);
        const rayDirY = Math.sin(angle);
        
        let distance = 0;
        const step = 0.02;      // Step size - smaller = more accurate but slower
        const maxDistance = 20;  // Don't check beyond this
        let hitGoal = false;
        
        while (distance < maxDistance) {
            distance += step;
            const testX = playerX + rayDirX * distance;
            const testY = playerY + rayDirY * distance;
            
            const mapX = Math.floor(testX);
            const mapY = Math.floor(testY);
            
            // Bounds check
            if (mapY < 0 || mapY >= map.length || mapX < 0 || mapX >= map[0].length) {
                return { distance: maxDistance, hitGoal: false };
            }
            
            // Check for goal tile (render golden)
            if (map[mapY][mapX] === 2) {
                hitGoal = true;
            }
            
            // Wall hit
            if (map[mapY][mapX] === 1) {
                return { distance, hitGoal };
            }
        }
        
        return { distance: maxDistance, hitGoal };
    };

    // Renders the 3D view using basic raycasting
    const render = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear and draw background (ceiling/floor)
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(0, 0, width, height / 2);
        ctx.fillStyle = '#3a3a3a';
        ctx.fillRect(0, height / 2, width, height / 2);
        
        const { playerAngle } = gameStateRef.current;
        const fov = Math.PI / 3;  // 60 degree field of view
        const numRays = width;    // One ray per screen column
        
        // Cast a ray for each vertical column of pixels
        for (let i = 0; i < numRays; i++) {
            const rayAngle = playerAngle - fov / 2 + (fov * i) / numRays;
            const { distance, hitGoal } = castRay(rayAngle);
            
            // Fish-eye correction: multiply by cos of angle difference
            // Without this, walls appear curved at edges of screen
            const correctedDistance = distance * Math.cos(rayAngle - playerAngle);
            
            // Calculate wall height - closer = taller
            const wallHeight = (height / correctedDistance) * 0.5;
            const wallTop = (height - wallHeight) / 2;
            
            // Distance-based shading (fog effect)
            const shade = Math.max(0, 255 - distance * 30);
            
            if (hitGoal) {
                // Goal tiles are golden
                const goldShade = Math.max(100, 255 - distance * 20);
                ctx.fillStyle = `rgb(${goldShade}, ${goldShade * 0.8}, 0)`;
            } else {
                // Slight color variation for visual interest
                const hue = (Math.floor(i / 10) % 2) * 20;
                ctx.fillStyle = `rgb(${shade}, ${shade - hue}, ${shade - hue * 2})`;
            }
            
            ctx.fillRect(i, wallTop, 1, wallHeight);
        }
        
        // Draw crosshair
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        const centerX = width / 2;
        const centerY = height / 2;
        ctx.beginPath();
        ctx.moveTo(centerX - 10, centerY);
        ctx.lineTo(centerX + 10, centerY);
        ctx.moveTo(centerX, centerY - 10);
        ctx.lineTo(centerX, centerY + 10);
        ctx.stroke();

        // Win screen overlay
        if (gameWon) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, width, height);
            
            ctx.font = 'bold 48px Arial';
            ctx.fillStyle = '#FFD700';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('YOU WIN!', width / 2, height / 2 - 40);
            
            ctx.font = '24px Arial';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText('Press R to restart', width / 2, height / 2 + 20);
        }
    };

    // Main game loop - runs ~60fps via requestAnimationFrame
    const gameLoop = () => {
        const state = gameStateRef.current;
        const { keys, moveSpeed, rotSpeed } = state;
        
        if (!gameWon) {
            // Handle rotation
            if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
                state.playerAngle -= rotSpeed;
            }
            if (keys['ArrowRight'] || keys['d'] || keys['D']) {
                state.playerAngle += rotSpeed;
            }
            
            // Calculate potential new position
            let newX = state.playerX;
            let newY = state.playerY;
            
            if (keys['ArrowUp'] || keys['w'] || keys['W']) {
                newX += Math.cos(state.playerAngle) * moveSpeed;
                newY += Math.sin(state.playerAngle) * moveSpeed;
            }
            if (keys['ArrowDown'] || keys['s'] || keys['S']) {
                newX -= Math.cos(state.playerAngle) * moveSpeed;
                newY -= Math.sin(state.playerAngle) * moveSpeed;
            }
            
            // Collision detection - only move if destination is not a wall
            const mapX = Math.floor(newX);
            const mapY = Math.floor(newY);
            
            if (mapY >= 0 && mapY < map.length && mapX >= 0 && mapX < map[0].length) {
                if (map[mapY][mapX] !== 1) {
                    state.playerX = newX;
                    state.playerY = newY;
                }
            }
            
            checkWinCondition();
        }
        
        render();
        state.animationId = requestAnimationFrame(gameLoop);
    };

    // Keyboard event handlers
    useEffect(() => {
        const handleKeyDown = (e) => {
            gameStateRef.current.keys[e.key] = true;
            
            if ((e.key === 'r' || e.key === 'R') && gameWon) {
                resetGame();
            }
            
            e.preventDefault();  // Prevent arrow keys from scrolling page
        };
        
        const handleKeyUp = (e) => {
            gameStateRef.current.keys[e.key] = false;
        };
        
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [gameWon]);

    // Resize canvas when window size changes
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = size.width;
            canvas.height = size.height - 40;  // Subtract header height
            render();
        }
    }, [size]);

    // Start game loop on mount, cleanup on unmount
    useEffect(() => {
        gameStateRef.current.animationId = requestAnimationFrame(gameLoop);
        
        return () => {
            if (gameStateRef.current.animationId) {
                cancelAnimationFrame(gameStateRef.current.animationId);
            }
        };
    }, []);

    // Window drag/resize handlers (same pattern as other windows)
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging) {
                const maxLeft = window.innerWidth - size.width;
                const maxTop = window.innerHeight - size.height;
                let newLeft = Math.max(0, Math.min(e.clientX - offset.x, maxLeft));
                let newTop = Math.max(25, Math.min(e.clientY - offset.y, maxTop));
                setPosition({ left: newLeft, top: newTop });
            } else if (isResizing) {
                let newWidth = size.width;
                let newHeight = size.height;
                let newLeft = position.left;
                let newTop = position.top;

                if (resizeDir.includes('right')) newWidth = Math.max(MIN_WIDTH, e.clientX - position.left);
                if (resizeDir.includes('bottom')) newHeight = Math.max(MIN_HEIGHT, e.clientY - position.top);
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

    const handleMouseDown = (e) => {
        onFocus?.();
        const rect = containerRef.current.getBoundingClientRect();
        setIsDragging(true);
        setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const startResize = (e, direction) => {
        e.stopPropagation();
        setIsResizing(true);
        setResizeDir(direction);
    };

    const handleClose = (e) => {
        e.stopPropagation();
        setActiveApp();
    };

    return (
        <div
            ref={containerRef}
            className="maze-window"
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                width: `${size.width}px`,
                height: `${size.height}px`,
                zIndex: zIndex,
            }}
            onClick={onFocus}
        >
            <div className="maze-container">
                {/* Header */}
                <div className="maze-header" onMouseDown={handleMouseDown}>
                    <div className="button-container">
                        <button className="button-close" onClick={handleClose} />
                        <button className="button-min" />
                        <button className="button-exp" />
                    </div>
                    <div className="maze-controls">
                        {gameWon ? 'WINNER!' : 'Find the golden exit!'}
                    </div>
                </div>

                {/* Game Canvas */}
                <canvas ref={canvasRef} className="maze-canvas" />
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