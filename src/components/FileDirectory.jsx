import './FileDirectory.css'
import Folder from './Folder.jsx'
export default function FileDirectory(props) {
    return (
        <section className="directory-section">
            <div className="directory-header">
                <div className="button-container">
                    <button className="button-close" onClick={() => props.setShowStart(true)}/>
                    <button className="button-min" />
                    <button className="button-exp" />
                </div>
                <div className="directory-header-options">
                    <img src="src/assets/play.fill.svg" width="16px" />
                </div>
            </div>
            <div className="directory-tabs">
                <img src="src/assets/folder.fill.accent.svg" width="16px" />
            </div>
            <div className="directory-folders">
                <Folder
                    key={0}
                    setCodeContents={props.setCodeContents}
                    name="About"
                    files={[{
                        id: 0,
                        name: "Introduction",
                        type: "src/assets/swift.svg",
                        width: "16px",
                        img: "img",
                        description: "I’m a Master’s student in Human-Computer Interaction at Carnegie Mellon University and an Honors graduate in Computer Science-Artificial Intelligence from Colby College. My work bridges HCI research, machine learning engineering, and mobile development. I thrive at the intersection of research and production code, and I’m passionate about building AI-powered, user-centered products.\nCurrently interning as a Mobile App Framework Developer at CBA, building scalable, user-focused mobile infrastructure.",
                        icons: []
                    },
                    {
                        id: 7,
                        name: "Resume",
                        type: "src/assets/photo.on.rectangle.svg",
                        width: "16px",
                        img: "hello",
                        description: "hello",
                        icons: []
                    },
                    ]}
                />
                <Folder
                    key={1}
                    name="Publications"
                    setCodeContents={props.setCodeContents}
                    files={[{
                        id: 1,
                        name: "ACM ETRA 2025",
                        type: "src/assets/text.page.svg",
                        width: "12px",
                        img: "hello",
                        description: "hello",
                        icons: []
                    }]}
                />
                <Folder
                    key={2}
                    name="Key Projects"
                    setCodeContents={props.setCodeContents}
                    files={[{
                        id: 2,
                        name: "Dowsing",
                        type: "src/assets/swift.svg",
                        width: "16px",
                        img: "hello",
                        description: "hello",
                        icons: []
                    },
                    {
                        id: 3,
                        name: "DeepNeuralLib",
                        type: "src/assets/python.svg",
                        img: "hello",
                        description: "hello",
                        icons: []
                    },
                    {
                        id: 4,
                        name: "DevReady",
                        type: "src/assets/js.svg",
                        img: "hello",
                        description: "hello",
                        icons: []
                    },
                    {
                        id: 9,
                        name: "WordEmbeddings",
                        type: "src/assets/python.svg",
                        img: "hello",
                        description: "hello",
                        icons: []
                    },
                    {
                        id: 10,
                        name: "Transformers",
                        type: "src/assets/python.svg",
                        img: "hello",
                        description: "hello",
                        icons: []
                    },
                    {
                        id: 8,
                        name: "More...",
                        type: "img",
                        img: "hello",
                        description: "hello",
                        icons: []
                    }]}
                />
            </div>
        </section>
    )
}