import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import MatchesTableActionMenu from './matches-table-action-menu';
import type { MatchWithCourtAndParticipants } from '@/lib/prisma-types';
import { MatchState } from '@prisma/client';

export function Match({ match }: { match: MatchWithCourtAndParticipants }) {
  const statusColourMap: { [key in MatchState]: string } = {
    PLANNED: 'bg-blue-300',
    BOOKED: 'bg-orange-300',
    FINISHED: 'bg-green-300',
    CANCELLED: 'bg-red-300'
  };
  return (
    <TableRow className={`${statusColourMap[match.state]} md:bg-inherit`}>
      <TableCell className="font-medium">
        {match.date.toLocaleString('en-GB')}
      </TableCell>
      <TableCell className="font-medium">
        {match.matchCourtBookings[0]?.court.name || 'Not Booked Yet'}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Badge
          variant="outline"
          className={`capitalize ${statusColourMap[match.state]}`}
        >
          {match.state}
        </Badge>
      </TableCell>
      <TableCell>
        {match.participants.map((p) => p.user.name).join(', ') || 'No Participants Yet'}
      </TableCell>
      <TableCell className="hidden md:table-cell">{`$${match.cost}`}</TableCell>
      <TableCell>
        <MatchesTableActionMenu match={match} />
      </TableCell>
    </TableRow>
  );
}
