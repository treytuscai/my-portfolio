import './Folder.css'
import { useState } from 'react'
import File from './File'

export default function Folder(props) {
    const [showFolder, setShowFolder] = useState(false)

    return (
        <>
            <section className="folder-section" onClick={() => { setShowFolder((prevShowFolder) => !prevShowFolder) }}>
                {showFolder ? (
                    <img className="folder-arrow" src="src/assets/chevron.down.svg" width="8px" />
                    ) : (
                    <img className="folder-arrow" src="src/assets/chevron.right.svg" width="8px" />
                )
                }
                <img className="folder-icon" src="src/assets/folder.fill.svg" width="18px"/>
                <h4 className="folder-name">{props.name}</h4>
            </section>
            <section className="files-section">
                {showFolder && props.files.map(file => <File key={file.id} fileData={file} setCodeContents={props.setCodeContents} />)}
            </section>
        </>
    )
}