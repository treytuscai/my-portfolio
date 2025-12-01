import './Code.css'

// Central area of Xcode 
// Includes descriptions of files
export default function Code(props) {
    return (
        <section className="code-section">
            <div className="code-header">
                <div className="run-container">
                    <img src="src/assets/git-branch.svg" />
                    <div className="run-info">
                        <h4 className="run-project">Portfolio</h4>
                        <h5 className="run-branch">main</h5>
                    </div>
                </div>
                <div className="build-container">
                    <div className="build-info">
                        <img className="build-icon" src="src/assets/app.fill.svg" width="12px"/>
                        <p className="build-project">Portfolio</p>
                        <img className="build-icon" src="src/assets/chevron.compact.right.svg" width="3px"/>
                        <img className="build-icon" src="src/assets/hammer.svg" width="16px"/>
                        <p className="build-device">Any iOS Device (arm64)</p>
                    </div>
                </div>
            </div>
            <div className="code-tabs">
                
            </div>
            <div className="code-contents">
                {props.codeContents.name ? (
                    <>
                        <h1>{props.codeContents.name}</h1>
                        {props.codeContents.description && (
                            <p className="code-description">{props.codeContents.description}</p>
                        )}
                        {props.codeContents.img && props.codeContents.img !== "hello" && (
                            <img src={props.codeContents.img} alt={props.codeContents.name} />
                        )}
                    </>
                ) : (
                    <p className="code-placeholder">Select a file to view</p>
                )}
            </div>
        </section>
    )
}