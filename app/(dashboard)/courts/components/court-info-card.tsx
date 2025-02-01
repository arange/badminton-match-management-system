import { Court } from '@prisma/client';
import Link from 'next/link';

export default function CourtInfoCard({
  court
}: {
  court: Pick<Court, 'name' | 'basePrice' | 'id' | 'membershipFee'>;
}) {
  return (
    <Link
      href={`/courts/${court.id}`}
      className="flex flex-col bg-gray-50 shadow-md justify-center items-start gap-2 border rounded border-black w-fit p-3 min-w-40 hover:scale-105"
    >
      <p>{court.name}</p>
      <p>
        BasePrice: <span>${court.basePrice.toFixed(2)}</span>
      </p>
      <p>
        Membership Fee:{' '}
        <span
          className={
            court.membershipFee === 0 ? 'text-green-600' : 'text-red-600'
          }
        >
          ${(court.membershipFee || 0).toFixed(2)}
        </span>
      </p>
    </Link>
  );
}
