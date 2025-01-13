import AddNewCard from './components/add-new-card';
import { MatchState } from '@prisma/client';
import { StatusPill } from '@/components/ui/status-pill';
import { formatDate } from '@/lib/utils';
import { getAllShuttles, getAllUsers, getMatchDetails } from '../actions';
import AddParticipantCard from './components/add-participant-card';
import AddShuttleCard from './components/add-shuttle-card';

export default async function MatchDetailsPage(props: {
  params: Promise<{ matchId: string }>;
}) {
  const params = await props.params;
  const matchId = params.matchId;
  const allUsers = await getAllUsers();
  const allShuttles = await getAllShuttles();
  const matchDetails = await getMatchDetails(matchId);
  const formattedDate = matchDetails?.date && formatDate(matchDetails?.date);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="flex flex-col gap-2 w-full py-4 text-xl justify-center items-center">
        <p className="font-bold text-3xl">
          {matchDetails?.matchCourtBookings[0]?.court.name || 'Not Booked Yet'}
        </p>
        <p>{formattedDate}</p>
        {matchDetails?.matchCourtBookings[0]?.duration && (
          <p>Duration: {matchDetails?.matchCourtBookings[0]?.duration} h</p>
        )}
        {matchDetails?.matchCourtBookings[0]?.court.name && (
          <p>
            ${matchDetails?.cost || 0} ($
            {(
              (matchDetails?.cost || 0) /
              (matchDetails?.participants.length || 1)
            ).toFixed(2)}{' '}
            pp)
          </p>
        )}
        <StatusPill variant={matchDetails?.state || MatchState.PLANNED}>
          {matchDetails?.state}
        </StatusPill>
      </h1>
      <div className="w-full">
        <h2 className="text-xl pb-2">Participants</h2>
        <div className="flex flex-wrap gap-2 justify-start">
          {allUsers?.map((user) => (
            <AddParticipantCard
              user={user}
              matchId={matchId}
              key={user.id}
              isParticipant={
                matchDetails?.participants.some((p) => p.userId === user.id) ||
                false
              }
            />
          ))}
        </div>
      </div>
      <div className="w-full">
        <h2 className="text-xl pb-2">Shuttlecock Used</h2>
        <div className="flex flex-wrap gap-2 justify-between md:justify-start">
          {allShuttles?.map((shuttle) => (
            <AddShuttleCard
              key={shuttle.id}
              shuttleBrand={shuttle}
              matchId={matchId}
              numUsed={
                matchDetails?.shuttleUsages.find((s) => s.brandId === shuttle.id)
                  ?.quantityUsed || 0
              }
            />
          ))}
        </div>
      </div>
      <div className="w-full">
        <h2 className="text-xl pb-2">Court</h2>
        <div className="flex flex-wrap gap-2 justify-between md:justify-start">
          {(matchDetails?.matchCourtBookings.length || 0) > 0 ? (
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
            <AddNewCard title="Add Court Booking" />
          )}
        </div>
      </div>
    </div>
  );
}
