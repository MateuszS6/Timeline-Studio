export default function Sidebar(){
    return(
        <aside className="sidebar">
            <div className="sidebar-brand">
                <span className="sidebar-logo">M</span>
                <span>Timelines</span>
            </div>

            <nav className="sidebar-nav">
                <button className="sidebar-item active">
                    Timeline
                </button>

                <button className="sidebar-item">
                    Characters
                </button>

                <button className="sidebar-item">
                    Projects
                </button>
            </nav>
        </aside>
    )
}