import { getMatchDetailsById } from '@/lib/db';
import UserInfoCard from './components/user-info-card';
import dayjs from 'dayjs';
import AddParticipantCard from './components/add-participant-card';
import { cn } from '@/lib/utils';
import { statusColourMap } from 'constants/color';
import { MatchState } from '@prisma/client';

export default async function MatchDetailsPage(props: {
  params: Promise<{ matchId: string }>;
}) {
  const params = await props.params;
  const matchId = params.matchId;
  const matchDetails = await getMatchDetailsById(matchId);
  const formatWithYear = 'dddd YYYY MMM DD HH:mm';
  const formatWithoutYear = 'dddd MMM DD HH:mm';
  const day = dayjs(matchDetails?.date);
  const formattedDay = day.format(
    day.isSame(dayjs(), 'year') ? formatWithoutYear : formatWithYear
  );
  return (
    <div className="flex flex-col gap-4">
      <h1 className="flex flex-col gap-2 w-full py-4 text-xl justify-center items-center">
        <p className="font-bold text-3xl">
          {matchDetails?.matchCourtBookings[0]?.court.name}s
        </p>
        <p>{formattedDay.toString()}</p>
        <p>Duration: {matchDetails?.matchCourtBookings[0]?.duration} h</p>
        <p>
          ${matchDetails?.cost || 0} ($
          {(matchDetails?.cost || 0) /
            (matchDetails?.participants.length || 1)}{' '}
          pp)
        </p>
        <p
          className={cn(
            'mx-auto w-fit text-sm rounded border p-1 border-transparent shadow-sm',
            statusColourMap[matchDetails?.state || MatchState.PLANNED]
          )}
        >
          {matchDetails?.state}
        </p>
      </h1>
      <div className="w-full">
        <h2 className="text-xl pb-2">Participants</h2>
        <div className="flex flex-wrap gap-2 justify-between md:justify-start">
          {matchDetails?.participants ? (
            <>
              {matchDetails?.participants.map((p) => (
                <UserInfoCard
                  key={p.id}
                  cost={
                    matchDetails.cost / matchDetails.participants.length || 0
                  }
                  user={p.user}
                />
              ))}
            </>
          ) : (
            <AddParticipantCard />
          )}
        </div>
      </div>
      <div className="w-full">
        <h2 className="text-xl pb-2">Shuttlecock Used</h2>
        <div className="flex flex-wrap gap-2 justify-between md:justify-start">
          {matchDetails?.shuttleUsages ? (
            <>
              {matchDetails?.shuttleUsages.map((s) => (
                <div key={s.id} className="flex gap-2 items-center">
                  <p className="border rounded-xl p-1">
                    {s.brand.name} ${s.brand.price} each
                  </p>
                  <p>x{s.quantityUsed}</p>
                  <p>=</p>
                  <p>${s.cost.toFixed(2)}</p>
                </div>
              ))}
            </>
          ) : (
            <AddParticipantCard />
          )}
        </div>
      </div>
      <div className="w-full">
        <h2 className="text-xl pb-2">Court</h2>
        <div className="flex flex-wrap gap-2 justify-between md:justify-start">
          {matchDetails?.matchCourtBookings ? (
            <>
              {matchDetails?.matchCourtBookings.map((c) => (
                <div key={c.id}>
                  <p>{c.court.name}</p>
                  <p>Duration: {c.duration} h</p>
                  <p>
                    ${c.court.basePrice} x ${c.duration} = $
                    {(c.bookingCost || 0).toFixed(2)}
                  </p>
                </div>
              ))}
            </>
          ) : (
            <AddParticipantCard />
          )}
        </div>
      </div>
    </div>
  );
}
