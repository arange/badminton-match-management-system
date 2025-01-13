'use client';
import { ShuttleBrand } from '@prisma/client';
import {
  decrementShuttleUsed,
  incrementShuttleUsed
} from 'app/(dashboard)/actions';
import { useState } from 'react';

export default function AddShuttleCard({
  shuttleBrand,
  numUsed,
  matchId
}: {
  shuttleBrand: ShuttleBrand;
  numUsed: number;
  matchId: string;
}) {
  const [optNumUsed, setOptNumUsed] = useState(() => numUsed);

  // TODO: add debounce to avoid multiple calls
  async function handleOnClickShuttle(shuttleBrandId: string) {
    setOptNumUsed((num) => num + 1);
    await incrementShuttleUsed(shuttleBrandId, matchId, numUsed);
  }

  async function handleOnClickNum(shuttleBrandId: string) {
    setOptNumUsed((num) => num - 1);
    await decrementShuttleUsed(shuttleBrandId, matchId, numUsed);
  }

  return (
    <div className=" relative">
      <button
        className={`flex flex-col justify-start gap-2 p-2 border rounded ${optNumUsed > 0 ? 'bg-green-500 text-white border-green-500' : 'border-black'}`}
        key={shuttleBrand.id}
        onClick={handleOnClickShuttle.bind(null, shuttleBrand.id)}
      >
        <p>{shuttleBrand.name}</p>
        <p>${(shuttleBrand.price * optNumUsed).toFixed(2)}</p>
      </button>
      <button
        className={`top-0 right-0 -mt-4 -mr-4 absolute  w-8 h-8 rounded-full flex items-center justify-center ${optNumUsed > 0 ? 'bg-white text-black border border-black' : 'hidden'}`}
        onClick={handleOnClickNum.bind(null, shuttleBrand.id)}
      >
        {optNumUsed}
      </button>
    </div>
  );
}
