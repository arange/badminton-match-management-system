'use client';
import { debounce } from '@mui/material';
import { ShuttleBrand } from '@prisma/client';
import { updateShuttleUsed } from 'app/(dashboard)/actions';
import { useCallback, useRef, useState } from 'react';

export default function AddShuttleCard({
  shuttleBrand,
  numUsed,
  matchId,
  disabled
}: {
  shuttleBrand: ShuttleBrand;
  numUsed: number;
  matchId: string;
  disabled: boolean;
}) {
  const [optNumUsed, setOptNumUsed] = useState(numUsed);
  const changeRef = useRef(0); // Tracks the accumulated change

  // Debounced function for making the API call
  const debouncedUpdate = useCallback(
    debounce(
      async (
        shuttleBrandId: string,
        matchId: string,
        accumulatedChange: number
      ) => {
        // TODO: ensure the quantity never goes negative
        if (accumulatedChange !== 0) {
          await updateShuttleUsed(
            shuttleBrandId,
            matchId,
            numUsed + accumulatedChange
          );
          changeRef.current = 0; // Reset accumulated change after successful API call
        }
      },
      300
    ),
    []
  );

  async function handleOnClickShuttle(shuttleBrandId: string) {
    setOptNumUsed((num) => num + 1);
    changeRef.current += 1;
    debouncedUpdate(shuttleBrandId, matchId, changeRef.current);
  }

  async function handleOnClickNum(shuttleBrandId: string) {
    setOptNumUsed((num) => num - 1);
    changeRef.current -= 1;
    debouncedUpdate(shuttleBrandId, matchId, changeRef.current);
  }

  return (
    <div className=" relative">
      <button
        disabled={disabled}
        className={`flex flex-col justify-start gap-2 p-2 border rounded ${optNumUsed > 0 ? 'bg-green-500 text-white border-green-500' : 'border-black'}`}
        key={shuttleBrand.id}
        onClick={handleOnClickShuttle.bind(null, shuttleBrand.id)}
      >
        <p>{shuttleBrand.name}</p>
        <p>
          ${shuttleBrand.price.toFixed(2)}
          {optNumUsed > 0 &&
            ` x ${optNumUsed} = $${(shuttleBrand.price * optNumUsed).toFixed(2)}`}
        </p>
      </button>
      <button
        disabled={disabled}
        className={`top-0 right-0 -mt-4 -mr-4 absolute  w-8 h-8 rounded-full flex items-center justify-center ${optNumUsed > 0 ? 'bg-white text-black border border-black' : 'hidden'}`}
        onClick={handleOnClickNum.bind(null, shuttleBrand.id)}
      >
        {optNumUsed}
      </button>
    </div>
  );
}
