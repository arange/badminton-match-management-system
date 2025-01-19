'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { deleteMatch } from './actions';
import { useRouter } from 'next/navigation';
import type { MatchWithCourtAndParticipants } from '@/lib/prisma-types';

export default function MatchesTableActionMenu({
  match
}: {
  match: MatchWithCourtAndParticipants;
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
          <button className='w-full text-left' onClick={handleOnView}>{['FINISHED', 'CANCELLED'].includes(match.state) ? 'View' : 'Edit'}</button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span>Add to Calendar</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button className='w-full text-left' onClick={() => deleteMatch(match.id)}>Delete</button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
