import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { StatusPill } from '@/components/ui/status-pill';
import Link from 'next/link';
import { getUserByUserId } from '../../actions';
import TopUpModal from './top-up-modal';
import { formatDate } from '@/lib/utils';

export default async function PlayerPage(props: {
  params: Promise<{ userId: string }>;
}) {
  const params = await props.params;
  const user = await getUserByUserId(params.userId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user?.name}</CardTitle>
        <CardDescription>
          <span>ID: {user?.id}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col flex-wrap gap-4">
          <p>
            Balance:{' '}
            <span
              className={
                user?.balance || 0 > 0 ? 'text-green-600' : 'text-red-600'
              }
            >
              ${user?.balance.toFixed(4)}
            </span>
            <TopUpModal userId={params.userId} />
          </p>
          <div>
            <p className="text-lg font-bold">Matches</p>
            <div className="flex flex-col flex-wrap gap-2">
              {user?.participants.map((p) => (
                <Link className="w-fit" key={p.id} href={`/${p.match.id}`}>
                  <div className="flex flex-wrap gap-2 border rounded border-black p-2 w-fit">
                    <p>{formatDate(p.match.date)}</p>
                    <div>
                      <StatusPill variant={p.match.state}>
                        {p.match.state}
                      </StatusPill>
                    </div>
                    <p>{p.match.matchCourtBookings[0]?.court.name}</p>
                    <p>${p.match.matchCourtBookings[0]?.bookingCost}</p>
                  </div>
                </Link>
              ))}
              {user?.participants.length === 0 &&
                'There are no matches for this player'}
            </div>
          </div>
          <div>
            <p className="text-lg font-bold">Transactions</p>
            <div className="flex flex-col flex-wrap gap-2">
              {user?.transactions
                .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
                .map((t) => (
                  <div key={t.id} className="flex flex-wrap gap-2 w-fit">
                    <p>{t.createdAt.toLocaleString()}</p>
                    <p className="font-bold">{t.type}</p>
                    <p>{t.description}</p>
                    <p
                      className={
                        t.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'
                      }
                    >
                      {t.type === 'DEPOSIT' ? '+' : '-'}${t.amount}
                    </p>
                  </div>
                ))}
              {user?.transactions.length === 0 &&
                'There are no transactions for this player'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
