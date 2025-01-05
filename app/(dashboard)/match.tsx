import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { Match as MatchType } from '@prisma/client';
import MatchesTableActionMenu from './matches-table-action-menu';

export function Match({ match }: { match: MatchType }) {
  return (
    <TableRow>
      <TableCell className="font-medium">
        {match.date.toLocaleString('en-GB')}
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">
          {match.state}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">{`$${match.cost}`}</TableCell>
      <TableCell className="hidden md:table-cell">
        {match.createdAt.toLocaleDateString('en-GB')}
      </TableCell>
      <TableCell>
        <MatchesTableActionMenu match={match} />
      </TableCell>
    </TableRow>
  );
}
