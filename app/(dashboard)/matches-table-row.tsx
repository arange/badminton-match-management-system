import { TableCell, TableRow } from '@/components/ui/table';
import MatchesTableActionMenu from './matches-table-action-menu';
import type { MatchWithCourtAndParticipants } from '@/lib/prisma-types';
import { statusColourMap } from 'constants/color';
import { StatusPill } from '@/components/ui/status-pill';
import { formatDate } from '@/lib/utils';

export function MatchRow({ match }: { match: MatchWithCourtAndParticipants }) {
  return (
    <TableRow
      className={`${statusColourMap[match.state]} md:bg-inherit text-white md:text-black`}
    >
      <TableCell className="font-medium">{formatDate(match.date)}</TableCell>
      <TableCell className="font-medium">
        {match.matchCourtBookings[0]?.court.name || 'Not Booked Yet'}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <StatusPill variant={match.state} className={`capitalize`}>
          {match.state}
        </StatusPill>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {match.participants.map((p) => p.user.name).join(', ') ||
          'No Participants Yet'}
      </TableCell>
      <TableCell className="hidden md:table-cell">{`$${match.cost}`}</TableCell>
      <TableCell>
        <MatchesTableActionMenu match={match} />
      </TableCell>
    </TableRow>
  );
}
