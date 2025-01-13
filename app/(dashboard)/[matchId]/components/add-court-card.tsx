'use client';
import { debounce } from '@mui/material';
import { Court } from '@prisma/client';
// import { updateCourtBooking } from 'app/(dashboard)/actions';
import { useCallback, useRef, useState } from 'react';

export default function AddCourtCard({
  court,
  duration,
  matchId
}: {
  court: Court;
  duration: number;
  matchId: string;
}) {
  const [optDuration, setOptDuration] = useState(duration);
  const changeRef = useRef(0); // Tracks the accumulated change

  // Debounced function for making the API call
  const debouncedUpdate = useCallback(
    debounce(
      async (courtId: string, matchId: string, accumulatedChange: number) => {
        // TODO: ensure the quantity never goes negative
        if (accumulatedChange !== 0) {
          // await updateCourtBooking(
          //   courtId,
          //   matchId,
          //   duration + accumulatedChange * 0.5
          // );
          changeRef.current = 0; // Reset accumulated change after successful API call
        }
      },
      300
    ),
    []
  );

  async function handleOnClickCourt(courtId: string) {
    setOptDuration((num) => num + 0.5);
    changeRef.current += 0.5;
    debouncedUpdate(courtId, matchId, changeRef.current);
  }

  async function handleOnClickNum(courtId: string) {
    setOptDuration((num) => num - 0.5);
    changeRef.current -= 0.5;
    debouncedUpdate(courtId, matchId, changeRef.current);
  }

  return (
    <div className=" relative">
      <button
        className={`flex flex-col justify-start gap-2 p-2 border rounded ${optDuration > 0 ? 'bg-green-500 text-white border-green-500' : 'border-black'}`}
        key={court.id}
        onClick={handleOnClickCourt.bind(null, court.id)}
      >
        <p>{court.name}</p>
        <p>
          ${court.basePrice.toFixed(2)}
          {optDuration > 0 &&
            ` x ${optDuration} = $${(court.basePrice * optDuration).toFixed(2)}`}
        </p>
      </button>
      <button
        className={`top-0 right-0 -mt-6 -mr-6 absolute  w-10 h-10 rounded-full flex items-center justify-center ${optDuration > 0 ? 'bg-white text-black border border-black' : 'hidden'}`}
        onClick={handleOnClickNum.bind(null, court.id)}
      >
        {optDuration}h
      </button>
    </div>
  );
}
