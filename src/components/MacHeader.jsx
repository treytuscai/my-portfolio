import './MacHeader.css';
export default function MacHeader() {
    const now = new Date();
    const weekday = now.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <header className="mac-header">
            <div className="mac-header-left">
                <span className="apple-logo"></span>
                <span className="app-name">Trey Tuscai</span>
                <span className="menu-item">File</span>
                <span className="menu-item">Edit</span>
                <span className="menu-item">View</span>
                <span className="menu-item">Window</span>
                <span className="menu-item">Help</span>
            </div>
            <div className="mac-header-right">
                <span className="header-time">{`${weekday} ${monthDay}`}</span>
                <span className="header-time">{`${time}`}</span>
            </div>
        </header>
    );
}