import './FileDirectory.css'
import Folder from './Folder.jsx'
import { useState } from 'react'
import { asset } from '../utils/assetPath';

/**
 * FileDirectory.jsx - Xcode-style file browser sidebar
 * 
 * Left panel of the PortfolioCard containing:
 * - Collapsible folder structure
 * - File selection with highlighting
 * - Play button with simulated build output
 * - Traffic light window controls
 * 
 * Portfolio content is organized into folders:
 * About, Education, Experience, Publications, Key Projects
 */
export default function FileDirectory(props) {
    const [selectedItem, setSelectedItem] = useState(null);
    const [isBuilding, setIsBuilding] = useState(false);
    const [buildOutput, setBuildOutput] = useState('');

    // Updates selection and passes file data to parent for display
    const handleSelectFile = (fileData) => {
        setSelectedItem(fileData.id);
        props.setCodeContents(fileData);
    };

    const handleClose = (e) => {
        e.stopPropagation();
        props.setActiveApp();
    };

    /**
     * Simulates Xcode build process with output messages
     * Shows progressive loading over ~3 seconds
     */
    const handlePlayButton = (e) => {
        e.stopPropagation();

        if (isBuilding) return;  // Prevent multiple simultaneous builds

        setIsBuilding(true);
        setBuildOutput('');

        // Staggered build messages for animation effect
        const buildSteps = [
            { delay: 300, text: '▸ Compiling TreyTuscai.swift...' },
            { delay: 600, text: '▸ Building TreyTuscai.framework...' },
            { delay: 900, text: '▸ Linking...' },
            { delay: 1200, text: '▸ Code signing with Developer Certificate...' },
            { delay: 1500, text: '⚠️  Warning: Impostor Syndrome detected but ignored' },
            { delay: 2100, text: '▸ Running on Simulator...' },
            { delay: 2400, text: '✓ Build Succeeded!' },
            { delay: 2700, text: '' },
        ];

        buildSteps.forEach(({ delay, text }) => {
            setTimeout(() => {
                setBuildOutput(prev => prev ? `${prev}\n${text}` : text);
            }, delay);
        });

        setTimeout(() => {
            setIsBuilding(false);
        }, 4000);
    };

    return (
        <section className="directory-section">
            {/* Header with window controls and play button */}
            <div className="directory-header">
                <div className="button-container">
                    <button className="button-close" onClick={handleClose} />
                    <button className="button-min" />
                    <button className="button-exp" />
                </div>
                <div className="directory-header-options">
                    <img
                        src={asset("assets/play.fill.svg")}
                        width="16px"
                        className={`play-button ${isBuilding ? 'building' : ''}`}
                        onClick={handlePlayButton}
                        style={{ cursor: 'pointer', opacity: isBuilding ? 0.5 : 1 }}
                    />
                </div>
            </div>

            {/* Folder icon tab bar */}
            <div className="directory-tabs">
                <img src={asset("assets/folder.fill.accent.svg")} width="16px" />
            </div>

            {/* Build output console (only visible when there's output) */}
            {buildOutput && (
                <div className="build-output">
                    <div className="build-output-header">
                        <span>Build Output</span>
                        <button
                            className="build-close"
                            onClick={() => setBuildOutput('')}
                        >×</button>
                    </div>
                    <pre className="build-log">{buildOutput}</pre>
                </div>
            )}

            {/* Folder tree structure - each Folder contains File components */}
            <div className="directory-folders">
                <Folder
                    key={0}
                    setCodeContents={handleSelectFile}
                    selectedItem={selectedItem}
                    name="About"
                    files={[{
                        id: 0,
                        name: "Introduction",
                        type: asset("assets/swift.svg"),
                        width: "16px",
                        img: "",
                        description: "Honors graduate from Colby College in Computer Science (AI concentration) and a Master’s student in Human-Computer Interaction at Carnegie Mellon University.\n\nMy work bridges HCI research, machine learning engineering, and mobile development. I thrive at the intersection of research and production code, and I'm passionate about building AI-powered, user-centered products.\n\nCurrently a researcher at the Augmented Perception Lab at CMU, exploring novel interaction paradigms and generative interfaces.",
                        icons: []
                    },
                    {
                        id: 1,
                        name: "Contact",
                        type: asset("assets/text.page.svg"),
                        width: "12px",
                        img: "",
                        description: "Location: Houston, TX\nEmail: ttuscai22@icloud.com\nPhone: (713) 969-8402\nLinkedIn: linkedin.com/in/trey-tuscai\nGitHub: github.com/treytuscai",
                        icons: []
                    }]}
                />
                <Folder
                    key={1}
                    name="Education"
                    setCodeContents={handleSelectFile}
                    selectedItem={selectedItem}
                    files={[{
                        id: 3,
                        name: "Carnegie Mellon",
                        type: asset("assets/text.page.svg"),
                        width: "16px",
                        img: "",
                        description: "Carnegie Mellon University\nPittsburgh, PA | Aug 2025 - Aug 2026\n\nMaster of Human-Computer Interaction\nResearcher, Augmented Perception Lab\n\nRelevant Coursework:\n• Software Structures for User Interfaces\n• DevSecOps\n• System Design\n• Interaction Design\n• Design of AI Products\n• User-Centered Research and Evaluation\n• Independent Study",
                        icons: []
                    },
                    {
                        id: 4,
                        name: "Colby College",
                        type: asset("assets/text.page.svg"),
                        width: "16px",
                        img: "",
                        description: "Colby College\nWaterville, ME | Sept 2021 - May 2025\n\nBachelor of Arts, Honors Computer Science\nConcentration in Artificial Intelligence\n\nRelevant Coursework:\n• Data Structures and Algorithms\n• Analysis of Algorithms\n• Programming Languages\n• Computer Organization\n• Software Engineering\n• Neural Networks\n• Deep Learning\n• Generative AI\n• Honors Thesis",
                        icons: []
                    }]}
                />
                <Folder
                    key={2}
                    name="Experience"
                    setCodeContents={handleSelectFile}
                    selectedItem={selectedItem}
                    files={[{
                        id: 5,
                        name: "CBA Mobile Intern",
                        type: asset("assets/swift.svg"),
                        width: "16px",
                        img: "",
                        description: "Software Engineer Intern – Mobile Platform\nChristian Brothers Automotive, Houston, TX\nJune 2025 - Aug 2025\n\nDesigned and built the My CBAuto mobile app and its underlying cross-platform React Native framework from the ground up, enabling vehicle history tracking, service scheduling, and user profile management for hundreds of thousands of customers.\n\nImplemented robust authentication workflows, developed reusable UI components, and integrated backend APIs to ensure secure, seamless user experiences.\n\nBuilt and maintained end-to-end CI/CD pipelines using Azure DevOps to automate app builds, testing, and deployment to stores; authored detailed system design documentation and onboarding materials.",
                        icons: []
                    },
                    {
                        id: 6,
                        name: "Dowsing Founder",
                        type: asset("assets/swift.svg"),
                        width: "16px",
                        img: "",
                        description: "Founder & iOS Engineer\nDowsing, Houston, TX\nJan 2023 - Mar 2024\n\nEngineered Dowsing, an innovative drinking fountain rating app, as the sole creator and developer.\n\nSecured acceptance as a Carnegie Mellon University startup, recognizing innovative design and potential impact.\n\nDeveloped complete app architecture, user interface, and functionality using primarily Swift, Javascript, UIKit, and MapKit.\n\nDesigned systems for account configuration, user ratings, user reviews, and photo-sharing within Dowsing app.\n\nPublished app on the Apple App Store, achieving over 250 users.",
                        icons: []
                    }]}
                />
                <Folder
                    key={3}
                    name="Publications"
                    setCodeContents={handleSelectFile}
                    selectedItem={selectedItem}
                    files={[{
                        id: 8,
                        name: "ACM ETRA 2025",
                        type: asset("assets/text.page.svg"),
                        width: "12px",
                        img: "",
                        description: "What is the Optimal Radial Interface for Eye-Movement Authentication on a Smartphone?\n\nTrey Tuscai and Naser Al Madi\nACM ETRA '25, May 26–29, 2025, Tokyo, Japan\n\nDeveloped a novel eye-movement authentication system using radial interfaces for iOS. This research explores optimal interface designs for secure, user-friendly authentication on mobile devices.\n\nDOI: https://doi.org/10.1145/3715669.3726820",
                        icons: []
                    }]}
                />
                <Folder
                    key={4}
                    name="Key Projects"
                    setCodeContents={handleSelectFile}
                    selectedItem={selectedItem}
                    files={[{
                        id: 9,
                        name: "Eye-Movement Auth",
                        type: asset("assets/swift.svg"),
                        width: "16px",
                        img: "",
                        description: "Eye-Movement Authentication System\n\nDeveloped a novel eye-movement authentication system using radial interfaces for iOS.\n\nThis project explores authentication through eye-tracking technology, creating a secure and intuitive method for device access. The system leverages SceneKit and ARKit to track eye movements and validate user identity through gaze patterns.",
                        icons: []
                    },
                    {
                        id: 10,
                        name: "GenLoD",
                        type: asset("assets/python.svg"),
                        width: "16px",
                        img: "",
                        description: "GenLoD\n\nBuilt a pipeline for automatically generating multi-level Level-of-Detail representations of web UI widgets. Uses Gemini for screenshot-to-HTML conversion and element importance scoring, Gurobi ILP optimization for guaranteed-monotonic operation selection, and Playwright for browser automation.\n\nTargeting adaptive interfaces where widgets need to gracefully degrade across varying display constraints.",
                        icons: []
                    },
                    {
                        id: 11,
                        name: "DevReady",
                        type: asset("assets/js.svg"),
                        width: "16px",
                        img: "",
                        description: "DevReady\n\nEngineered an AI-powered coding interview preparation platform that offers personalized coding challenges tailored to individual skill levels and learning patterns.\n\nBuilt with React, Node.js, and integrates machine learning to adapt difficulty and provide real-time feedback on coding solutions.",
                        icons: []
                    },
                    {
                        id: 12,
                        name: "DeepNeuralLib",
                        type: asset("assets/python.svg"),
                        width: "16px",
                        img: "",
                        description: "DeepNeuralLib\n\nBuilt a modular deep learning library from scratch that powers:\n• GPT-style transformers\n• CBOW word embeddings with t-SNE visualizations\n• CNNs including VGG, ResNet, and InceptionNet architectures\n• Trained and tested on CIFAR benchmarks.",
                        icons: []
                    },
                    {
                        id: 13,
                        name: "Dowsing",
                        type: asset("assets/swift.svg"),
                        width: "16px",
                        img: "",
                        description: "Dowsing\n\nFull-stack iOS application for rating and discovering drinking fountains.\n\nFeatures:\n• User authentication and profile management\n• Interactive map with MapKit integration\n• Photo sharing and reviews\n• Real-time ratings and community feedback\n• Firebase backend for data persistence\n\nPublished on the Apple App Store with 250+ active users.\nAccepted as a CMU startup.",
                        icons: []
                    }]}
                />
            </div>
        </section>
    )
}