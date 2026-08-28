import Sidebar from '../components/layout/Sidebar';
import TimelineGrid from '../components/timeline/TimelineGrid';

export default function TimelinePage() {
  return (
    <div className='app-layout'>
      <Sidebar />

      <main className='main-content'>
        <header className='page-header'>
          <h1>MCU Timeline</h1>
          <p>Character appearances across projects</p>
        </header>

        <TimelineGrid />
      </main>
    </div>

  )
}