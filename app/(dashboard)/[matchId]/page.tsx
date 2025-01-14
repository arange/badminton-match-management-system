import AddCourtCard from './components/add-court-card';
import { MatchState } from '@prisma/client';
import { StatusPill } from '@/components/ui/status-pill';
import { formatDate } from '@/lib/utils';
import {
  getAllCourts,
  getAllShuttles,
  getAllUsers,
  getMatchDetails
} from '../actions';
import AddParticipantCard from './components/add-participant-card';
import AddShuttleCard from './components/add-shuttle-card';
import { Button } from '@/components/ui/button';

export default async function MatchDetailsPage(props: {
  params: Promise<{ matchId: string }>;
}) {
  const params = await props.params;
  const matchId = params.matchId;
  const allUsers = await getAllUsers();
  const allShuttles = await getAllShuttles();
  const allCourts = await getAllCourts();
  const matchDetails = await getMatchDetails(matchId);
  const formattedDate = matchDetails?.date && formatDate(matchDetails?.date);

  const disabled: boolean =
    matchDetails?.state &&
    [MatchState.FINISHED.toString(), MatchState.CANCELLED.toString()].includes(
      matchDetails.state.toString()
    ) || false;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="flex flex-col gap-2 w-full py-4 text-xl justify-center items-center">
        <p className="font-bold text-3xl">
          {matchDetails?.matchCourtBookings[0]?.court.name || 'Not Booked Yet'}
        </p>
        <p>{formattedDate}</p>
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
        {matchDetails?.state === MatchState.BOOKED && <Button>Finalise</Button>}
      </h1>
      <div className="w-full">
        <h2 className="text-xl pb-2">Participants</h2>
        <div className="flex flex-wrap gap-2 justify-start">
          {allUsers?.map((user) => (
            <AddParticipantCard
              disabled={disabled}
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
              disabled={disabled}
              key={shuttle.id}
              shuttleBrand={shuttle}
              matchId={matchId}
              numUsed={
                matchDetails?.shuttleUsages.find(
                  (s) => s.brandId === shuttle.id
                )?.quantityUsed || 0
              }
            />
          ))}
        </div>
      </div>
      <div className="w-full">
        <h2 className="text-xl pb-2">Court</h2>
        <div className="flex flex-wrap gap-6 justify-between md:justify-start">
          {allCourts?.map((court) => (
            <AddCourtCard
              disabled={disabled}
              key={court.id}
              court={court}
              matchId={matchId}
              duration={
                matchDetails?.matchCourtBookings.find(
                  (m) => m.courtId === court.id
                )?.duration || 0
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
