import Sidebar from '../components/layout/Sidebar';
import TimelineGrid from '../components/timeline/TimelineGrid';

function Home() {
  return (
    <div className='app'>
      <Sidebar />

      <TimelineGrid />
    </div>

  )
}

export default Home;