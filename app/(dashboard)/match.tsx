import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { deleteMatches } from './actions';
import { Match as MatchType } from '@prisma/client';

export function Match({ match }: { match: MatchType }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{match.date.toLocaleString()}</TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">
          {match.state}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">{`$${match.cost}`}</TableCell>
      {/* <TableCell className="hidden md:table-cell">{match.par}</TableCell> */}
      <TableCell className="hidden md:table-cell">
        {match.createdAt.toLocaleDateString('en-GB')}
      </TableCell>
      {/* <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>
              <form action={deleteMatches}>
                <button type="submit">Delete</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell> */}
    </TableRow>
  );
}
