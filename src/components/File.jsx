import './File.css'

// Basic File within Xcode
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