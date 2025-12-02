import './File.css'

/**
 * File.jsx - Clickable file item in Folder
 * 
 * Displays file icon and name. On click, passes file data
 * up to FileDirectory which updates CodeView content.
 */
export default function File(props) {
    return (
        <section 
            className={`file-section ${props.isSelected ? 'selected' : ''}`}
            onClick={() => props.setCodeContents(props.fileData)}
        >
            <img className="folder-icon" src={props.fileData.type} width={props.fileData.width}/>
            <h4 className="file-name">{props.fileData.name}</h4>
        </section>
    )
}