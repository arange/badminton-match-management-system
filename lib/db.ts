import 'server-only';
import { Match } from '@prisma/client';
import prisma from './prisma';

export async function getMatches(
  search: string,
  offset: number
): Promise<{
  matches: Match[];
  newOffset: number | null;
  totalMatches: number;
}> {
  const matches = await prisma.match.findMany();
  // Always search the full table, not per page
  if (search) {
    return {
      matches,
      newOffset: null,
      totalMatches: 0
    };
  }

  if (offset === null) {
    return { matches: [], newOffset: null, totalMatches: 0 };
  }

  let moreMatches = await prisma.match.findMany({ take: 5, skip: offset });
  let newOffset = moreMatches.length >= 5 ? offset + 5 : null;

  return {
    matches: moreMatches,
    newOffset,
    totalMatches: matches.length
  };
}

export async function deleteMatchesById(id: string) {
  await prisma.match.delete({ where: { id } });
}
