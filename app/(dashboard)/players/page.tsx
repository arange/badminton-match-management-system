import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { getUsers } from '@/lib/db';
import UserInfoCard from '../[matchId]/components/user-info-card';

export default async function PlayersPage() {
  const users = await getUsers();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Players</CardTitle>
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
