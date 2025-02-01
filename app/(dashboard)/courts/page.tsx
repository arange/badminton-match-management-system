import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { getAllCourtsDB } from '@/lib/db';
import CourtInfoCard from './components/court-info-card';
import AddPlayerButton from './components/add-player';

export default async function CourtsPage() {
  const courts = await getAllCourtsDB();
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between">
            <span>Players</span>
            <AddPlayerButton />
          </div>
        </CardTitle>
        <CardDescription>
          View all players and their information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          {courts.map((court) => (
            <CourtInfoCard key={court.id} court={court} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
