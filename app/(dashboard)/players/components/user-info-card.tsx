import { User } from '@prisma/client';
import Link from 'next/link';

export default function UserInfoCard({
  user
}: {
  user: Pick<User, 'name' | 'balance' | 'id'>;
}) {
  return (
    <Link
      href={`/players/${user.id}`}
      className="flex flex-col bg-gray-50 shadow-md justify-center items-start gap-2 border rounded border-black w-fit p-3 min-w-40 hover:scale-105"
    >
      <p>{user.name}</p>
      <p>
        Balance:{' '}
        <span className={user.balance > 0 ? 'text-green-600' : 'text-red-600'}>
          ${user.balance.toFixed(2)}
        </span>
      </p>
    </Link>
  );
}
