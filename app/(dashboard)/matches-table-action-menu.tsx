'use client';
import { Match as MatchType } from '@prisma/client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { deleteMatch, getMatchDetails } from './actions';
import { useRouter } from 'next/navigation';

export default function MatchesTableActionMenu({
  match
}: {
  match: MatchType;
}) {
  const router = useRouter();

  const handleOnView = () => {
    router.push(`/${match.id}`);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup="true" size="icon" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem>
          <button onClick={handleOnView}>View</button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button onClick={() => deleteMatch(match.id)}>Delete</button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
