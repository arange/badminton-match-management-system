import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import MatchesTableActionMenu from './matches-table-action-menu';
import type { MatchWithCourtAndParticipants } from '@/lib/prisma-types';
import { statusColourMap } from 'constants/color';

export function MatchRow({ match }: { match: MatchWithCourtAndParticipants }) {
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
