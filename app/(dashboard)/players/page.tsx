import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { getUsers } from '@/lib/db';
import UserInfoCard from '../[matchId]/components/user-info-card';
import AddPlayerButton from './components/add-player';

export default async function PlayersPage() {
  const users = await getUsers();
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
          {users.map((user) => (
            <UserInfoCard key={user.id} user={user} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
