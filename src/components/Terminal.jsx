import { useState, useRef, useEffect } from 'react';
import './Terminal.css';

/**
 * Terminal.jsx - Interactive command-line interface
 * 
 * - Custom commands (help, about, skills, etc.)
 * - Command history (arrow keys to navigate)
 * - Tab completion
 * - Custom ASCII art outputs
 * - Integration with app opening system
 */

export default function Terminal({ setActiveApp, zIndex, onFocus }) {
    const cardRef = useRef(null);
    const inputRef = useRef(null);
    const outputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeDir, setResizeDir] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState(() => ({
        top: window.innerHeight / 2 - 250,
        left: window.innerWidth / 2 - 350
    }));
    const [size, setSize] = useState({ width: 700, height: 450 });
    const [history, setHistory] = useState([
        { type: 'output', text: 'Welcome to Trey\'s Terminal v1.0.0' },
        { type: 'output', text: 'Type "help" for available commands.\n' },
    ]);
    const [currentInput, setCurrentInput] = useState('');
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    const MIN_WIDTH = 400;
    const MIN_HEIGHT = 250;

    /**
     * Available terminal commands
     * Each command returns formatted string output or executes an action
     */
    const commands = {
        help: () => `
Available commands:
  help          - Show this help message
  about         - Learn about Trey
  skills        - List technical skills
  projects      - View projects
  contact       - Get contact info
  education     - View education
  experience    - View work experience
  clear         - Clear the terminal
  open <app>    - Open an app (xcode, finder, chrome)
  sudo hire     - You know what to do
  neofetch      - System information
  ls            - List directory contents
  pwd           - Print working directory
  whoami        - Display current user
  date          - Show current date/time
  cowsay <msg>  - Have a cow say something
  matrix        - Enter the matrix
  fortune       - Get a fortune
`,
        about: () => `
╔══════════════════════════════════════════════════════════════════╗
║                        TREY TUSCAI                                ║
╠══════════════════════════════════════════════════════════════════╣
║  Master's student in Human-Computer Interaction at CMU           ║
║  Honors graduate in CS-AI from Colby College                     ║
║                                                                  ║
║  I bridge HCI research, ML engineering, and mobile development.  ║
║  Passionate about building AI-powered, user-centered products.   ║
║                                                                  ║
║  Currently: Mobile App Framework Developer @ CBA                 ║
╚══════════════════════════════════════════════════════════════════╝
`,
        skills: () => `
┌─────────────────────────────────────────────────────────────┐
│                    TECHNICAL SKILLS                         │
├─────────────────────────────────────────────────────────────┤
│  Languages:     Python, Swift, JavaScript, TypeScript, C++  │
│  Mobile:        iOS (SwiftUI, UIKit), React Native          │
│  ML/AI:         PyTorch, TensorFlow, Transformers, NLP      │
│  Web:           React, Node.js, HTML/CSS                    │
│  Tools:         Git, Docker, Xcode, VS Code                 │
│  Research:      Eye Tracking, HCI, ML, User Studies         │
└─────────────────────────────────────────────────────────────┘
`,
        projects: () => `
📁 Projects/
├── 📱 Dowsing
│   └── iOS app for drinking fountain rating and hydration
├── 🧠 DeepNeuralLib
│   └── Custom neural network library from scratch
├── 💻 DevReady
│   └── Developer interview prep platform
├── 📊 WordEmbeddings
│   └── NLP word embedding implementations
└── 🤖 Transformers
    └── Transformer architecture implementation
    
Type "open xcode" to explore projects in detail!
`,
        contact: () => `
┌─────────────────────────────────────────┐
│           CONTACT INFORMATION           │
├─────────────────────────────────────────┤
│  Email:    ttuscai22@icloud.com         │
│  LinkedIn: linkedin.com/in/trey-tuscai  │
│  GitHub:   github.com/treytuscai        │
│  Phone:    (713) 969-8402               │
│  Location: Houston, TX → Pittsburgh     │
└─────────────────────────────────────────┘
`,
        education: () => `
🎓 Education:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Carnegie Mellon University
  └── Master's Human-Computer Interaction (2026)

  Colby College  
  └── B.A. Computer Science - AI (2025)
      Honors Graduate
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`,
        experience: () => `
💼 Experience:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  CBA - Mobile App Framework Developer (Current)
  └── Building scalable, user-focused mobile infrastructure

  Dowsing - Founder & iOS Engineer
  └── Published on App Store, 250+ users

  STREM HQ - Coding & Robotics Instructor
  └── Teaching robotics and programming fundamentals
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`,
        clear: () => {
            setHistory([]);
            return null;
        },
        neofetch: () => `
                    'c.          trey@portfolio
                 ,xNMM.         ---------------
               .OMMMMo          OS: macOS Sonoma 14.0
               OMMM0,           Host: MacBook Pro
     .;loddo:' loolloddol;.     Kernel: Darwin 23.0.0
   cKMMMMMMMMMMNWMMMMMMMMMM0:   Uptime: Always online
 .KMMMMMMMMMMMMMMMMMMMMMMMWd.   Packages: Infinite skills
 XMMMMMMMMMMMMMMMMMMMMMMMX.     Shell: zsh 5.9
;MMMMMMMMMMMMMMMMMMMMMMMM:      Terminal: Portfolio v1.0
:MMMMMMMMMMMMMMMMMMMMMMMM:      CPU: Brain @ 3.14GHz
.MMMMMMMMMMMMMMMMMMMMMMMMX.     Memory: Unlimited potential
 kMMMMMMMMMMMMMMMMMMMMMMMMWd.   
 .XMMMMMMMMMMMMMMMMMMMMMMMMMMk  
  .XMMMMMMMMMMMMMMMMMMMMMMMMK.  
    kMMMMMMMMMMMMMMMMMMMMMMd    
     ;KMMMMMMMWXXWMMMMMMMk.     
       .coeli:, .:ldoc.        
`,
        pwd: () => '/Users/trey/Portfolio',
        ls: () => `
about.txt    projects/    skills.json    contact.md
education/   experience/  resume.pdf     README.md
`,
        whoami: () => 'trey - aspiring world-changer',
        date: () => new Date().toString(),
        fortune: () => {
            const fortunes = [
                '"The best time to hire Trey was yesterday. The second best time is now."',
                '"In a world of 10x developers, be a 100x human."',
                '"Your code is only as good as your coffee." ☕',
                '"Bugs are just features in disguise... sometimes."',
                '"Ship it and iterate. But also test it first."',
                '"The only constant in tech is change. And Trey\'s dedication."',
            ];
            return '🥠 ' + fortunes[Math.floor(Math.random() * fortunes.length)];
        },
        matrix: () => {
            return `
⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣤⣤⣤⣤⣤⣤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⠀⠀⠀⠀
⠀⠀⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀
Wake up, Neo... The Matrix has you.
Follow the white rabbit to my LinkedIn.
🐇 linkedin.com/in/trey-tuscai
`;
        },
        'sudo hire': () => `
🎉 CONGRATULATIONS! 🎉

You have successfully initiated the hiring process!
Redirecting to: excellent_decision.exe

Loading enthusiasm............ ████████████ 100%
Loading skills................. ████████████ 100%
Loading dedication............. ████████████ 100%

✓ All systems go!
Contact ttuscai22@icloud.com to complete your excellent decision.
`,
    };

    const cowsay = (message) => {
        const msg = message || 'Moo! Hire Trey!';
        const line = '─'.repeat(msg.length + 2);
        return `
 ┌${line}┐
 │ ${msg} │
 └${line}┘
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
`;
    };

    useEffect(() => {
        outputRef.current?.scrollTo(0, outputRef.current.scrollHeight);
    }, [history]);

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
        const rect = cardRef.current.getBoundingClientRect();
        setIsDragging(true);
        setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        onFocus?.()
    };

    const handleClose = (e) => {
        e.stopPropagation(); // Prevent triggering onFocus
        setActiveApp();
    };

    const startResize = (e, direction) => {
        e.stopPropagation();
        setIsResizing(true);
        setResizeDir(direction);
    };

    const handleCommand = (cmd) => {
        const trimmed = cmd.trim().toLowerCase();
        const parts = trimmed.split(' ');
        const command = parts[0];
        const args = parts.slice(1).join(' ');

        let output;

        if (command === 'open') {
            const app = args;
            if (['xcode', 'finder', 'chrome', 'terminal'].includes(app)) {
                setActiveApp(app);
                output = `Opening ${app}...`;
            } else {
                output = `Unknown app: ${app}. Try: xcode, finder, chrome`;
            }
        } else if (command === 'cowsay') {
            output = cowsay(args);
        } else if (command === 'sudo' && args === 'hire') {
            output = commands['sudo hire']();
        } else if (commands[command]) {
            output = typeof commands[command] === 'function' ? commands[command]() : commands[command];
        } else if (trimmed === '') {
            output = null;
        } else {
            output = `zsh: command not found: ${command}\nType "help" for available commands.`;
        }

        setHistory(prev => [
            ...prev,
            { type: 'input', text: cmd },
            ...(output ? [{ type: 'output', text: output }] : [])
        ]);
        setCommandHistory(prev => [cmd, ...prev]);
        setHistoryIndex(-1);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCommand(currentInput);
            setCurrentInput('');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setCurrentInput(commandHistory[newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setCurrentInput(commandHistory[newIndex]);
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setCurrentInput('');
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const matches = Object.keys(commands).filter(c => c.startsWith(currentInput));
            if (matches.length === 1) {
                setCurrentInput(matches[0]);
            }
        }
    };

    return (
        <div
            ref={cardRef}
            className="terminal-window"
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                width: `${size.width}px`,
                height: `${size.height}px`,
                zIndex: zIndex,
            }}
            onClick={() => {
                onFocus?.()
                inputRef.current?.focus()
            }}
        >
            <div className="terminal-container">
                {/* Header */}
                <div className="terminal-header" onMouseDown={handleMouseDown}>
                    <div className="button-container">
                        <button className="button-close" onClick={handleClose} />
                        <button className="button-min" />
                        <button className="button-exp" />
                    </div>
                    <div className="terminal-title">trey@portfolio — zsh</div>
                    <div className="terminal-header-spacer" />
                </div>

                {/* Terminal Content */}
                <div className="terminal-content" ref={outputRef}>
                    {history.map((item, index) => (
                        <div key={index} className={`terminal-line ${item.type}`}>
                            {item.type === 'input' && (
                                <span className="terminal-prompt">
                                    <span className="prompt-user">trey@portfolio</span>
                                    <span className="prompt-separator">:</span>
                                    <span className="prompt-path">~</span>
                                    <span className="prompt-symbol">$</span>
                                </span>
                            )}
                            <span className="terminal-text">{item.text}</span>
                        </div>
                    ))}
                    <div className="terminal-input-line">
                        <span className="terminal-prompt">
                            <span className="prompt-user">trey@portfolio</span>
                            <span className="prompt-separator">:</span>
                            <span className="prompt-path">~</span>
                            <span className="prompt-symbol">$</span>
                        </span>
                        <input
                            ref={inputRef}
                            type="text"
                            className="terminal-input"
                            value={currentInput}
                            onChange={(e) => setCurrentInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            spellCheck={false}
                        />
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