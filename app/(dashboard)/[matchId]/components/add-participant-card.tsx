'use client';
import { User } from '@prisma/client';
import { toggleParticipantToMatch } from 'app/(dashboard)/actions';
import { useState } from 'react';

export default function AddParticipantCard({
  user,
  isParticipant,
  matchId
}: {
  user: User;
  isParticipant: boolean;
  matchId: string;
}) {
  const [isOptParticipant, setIsOptParticipant] = useState(() => isParticipant);
  async function handleOnClickUser(userId: string) {
    setIsOptParticipant(!isOptParticipant);
    await toggleParticipantToMatch(userId, matchId);
  }

  return (
    <button
      className={`flex flex-col justify-start gap-2 p-2 border rounded ${isOptParticipant ? 'bg-green-500 text-white border-green-500' : 'border-black'}`}
      key={user.id}
      onClick={handleOnClickUser.bind(null, user.id)}
    >
      <p>{user.name}</p>
      <p>${user.balance.toFixed(2)}</p>
    </button>
  );
}
