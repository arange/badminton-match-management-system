'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { MatchRow } from './matches-table-row';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MatchWithCourtAndParticipants } from '@/lib/prisma-types';

export function MatchesTable({
  matches,
  offset,
  totalMatches
}: {
  matches: MatchWithCourtAndParticipants[];
  offset: number;
  totalMatches: number;
}) {
  let router = useRouter();
  let matchesPerPage = 5;

  function prevPage() {
    router.back();
  }

  function nextPage() {
    router.push(`/?offset=${offset}`, { scroll: false });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Matches</CardTitle>
        <CardDescription>Manage your matches.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Court</TableHead>
              <TableHead className='hidden md:table-cell'>Status</TableHead>
              <TableHead className='hidden md:table-cell'>Participants</TableHead>
              <TableHead className="hidden md:table-cell">Cost</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.map((match) => (
              <MatchRow key={match.id} match={match} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <form className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            {totalMatches > 0 ? (
              <>
                Showing{' '}
                <strong>
                  {offset + 1}-{Math.min(offset + matchesPerPage, totalMatches)}
                </strong>{' '}
                of <strong>{totalMatches}</strong> matches
              </>
            ) : (
              <>No matches to display</>
            )}
          </div>
          <div className="flex">
            <Button
              formAction={prevPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={offset === matchesPerPage}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Prev
            </Button>
            <Button
              formAction={nextPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={offset + matchesPerPage > totalMatches}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
}
