import './PortfolioCard.css'
import FileDirectory from './FileDirectory'
import Code from './Code'
import {useState} from 'react'

export default function PortfolioCard(props) {
    const [codeContents, setCodeContents] = useState({})
    return (
        <main className="portfolio-main">
            <FileDirectory setShowStart={props.setShowStart} setCodeContents={setCodeContents} />
            <Code codeContents={codeContents}/>
        </main>
    )
}