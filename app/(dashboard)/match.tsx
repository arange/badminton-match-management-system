import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import MatchesTableActionMenu from './matches-table-action-menu';
import type { MatchWithCourtAndParticipants } from '@/lib/prisma-types';

export function Match({ match }: { match: MatchWithCourtAndParticipants }) {
  return (
    <TableRow>
      <TableCell className="font-medium">
        {match.date.toLocaleString('en-GB')}
      </TableCell>
      <TableCell className="font-medium">
        {match.matchCourtBookings[0]?.court.name || 'Not Booked Yet'}
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">
          {match.state}
        </Badge>
      </TableCell>
      <TableCell>{match.participants.map((p) => p.user.name).join(', ')}</TableCell>
      <TableCell className="hidden md:table-cell">{`$${match.cost}`}</TableCell>
      <TableCell>
        <MatchesTableActionMenu match={match} />
      </TableCell>
    </TableRow>
  );
}
