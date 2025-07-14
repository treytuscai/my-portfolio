import './File.css'
export default function File(props) {
    return (
        <section className="file-section" onClick={() => props.setCodeContents(props.fileData)}>
            <img className="folder-icon" src={props.fileData.type} width={props.fileData.width}/>
            <h4 className="file-name">{props.fileData.name}</h4>
        </section>
    )
}