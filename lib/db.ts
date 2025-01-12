import 'server-only';
import { MatchState } from '@prisma/client';
import prisma from './prisma';
import type { MatchWithCourtAndParticipants } from './prisma-types';

export async function getMatches(
  search: string,
  offset: number
): Promise<{
  matches: MatchWithCourtAndParticipants[];
  newOffset: number | null;
  totalMatches: number;
}> {
  const whereClause =
    search && search !== 'all' ? { state: search as MatchState } : {};

  const [matches, totalMatches] = await prisma.$transaction([
    prisma.match.findMany({
      where: whereClause,
      skip: offset || 0,
      take: 5,
      include: {
        matchCourtBookings: {
          include: {
            court: {
              select: {
                name: true
              }
            }
          }
        },
        participants: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        }
      }
    }),
    prisma.match.count({ where: whereClause })
  ]);

  const newOffset = matches.length === 5 ? (offset || 0) + 5 : null;

  return {
    matches,
    newOffset,
    totalMatches
  };
}

export async function deleteMatchesById(id: string) {
  await prisma.match.delete({ where: { id } });
}

export async function addMatchByDate(date: string) {
  const newMatch = await prisma.match.create({
    data: { date }
  });
  return newMatch;
}

export async function getMatchDetailsById(matchId: string) {
  return await prisma.match.findUnique({
    where: {
      id: matchId
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              name: true,
              balance: true
            }
          }
        }
      },
      matchCourtBookings: {
        include: {
          court: {
            select: {
              name: true,
              basePrice: true,
              membershipFee: true
            }
          }
        }
      },
      shuttleUsages: {
        include: {
          brand: {
            select: {
              name: true,
              price: true
            }
          }
        }
      }
    }
  });
}
