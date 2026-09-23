import TimelineGrid from '../components/timeline/TimelineGrid';

interface TimelinePageProps {
  universeId: number;
}

export default function TimelinePage({
  universeId
}: TimelinePageProps) {
  return <TimelineGrid universeId={universeId} />;
}