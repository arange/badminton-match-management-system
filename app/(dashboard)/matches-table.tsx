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
import { Match } from './match';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Match as MatchType } from '@prisma/client';

export function MatchesTable({
  matches,
  offset,
  totalMatches
}: {
  matches: MatchType[];
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
        <CardDescription>
          Manage your matches.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead> */}
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Cost</TableHead>
              {/* <TableHead className="hidden md:table-cell">
                Total Sales
              </TableHead> */}
              <TableHead className="hidden md:table-cell">Created at</TableHead>
              {/* <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.map((match) => (
              <Match key={match.id} match={match} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <form className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            Showing{' '}
            <strong>
              {Math.max(0, Math.min(offset - matchesPerPage, totalMatches) + 1)}
              -{offset}
            </strong>{' '}
            of <strong>{totalMatches}</strong> matches
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
