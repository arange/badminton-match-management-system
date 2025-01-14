import 'server-only';
import { MatchState, TransactionType } from '@prisma/client';
import prisma from './prisma';
import type { MatchWithCourtAndParticipants } from './prisma-types';

export async function getMatches(
  search: string,
  offset: number | null
): Promise<{
  matches: MatchWithCourtAndParticipants[];
  totalMatches: number;
}> {
  const whereClause =
    search && search !== 'all' ? { state: search as MatchState } : {};

  const [matches, totalMatches] = await prisma.$transaction([
    prisma.match.findMany({
      orderBy: { date: 'desc' },
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

  return {
    matches,
    totalMatches
  };
}

export async function deleteMatchesById(id: string) {
  await prisma.$transaction([
    prisma.matchCourtBooking.deleteMany({ where: { matchId: id } }),
    prisma.matchParticipant.deleteMany({ where: { matchId: id } }),
    prisma.shuttleUsage.deleteMany({ where: { matchId: id } }),
    prisma.match.delete({ where: { id } })
  ]);
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
              id: true,
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

export async function getUsers() {
  return await prisma.user.findMany();
}

export async function getUserById(userId: string) {
  return await prisma.user.findUnique({
    where: {
      id: userId
    },
    include: {
      participants: {
        include: {
          match: {
            select: {
              id: true,
              date: true,
              state: true,
              matchCourtBookings: {
                include: {
                  court: {
                    select: {
                      name: true
                    }
                  }
                }
              }
            }
          }
        }
      },
      transactions: {
        select: {
          id: true,
          type: true,
          amount: true,
          description: true,
          createdAt: true
        }
      }
    }
  });
}

export async function topUpUserBalance(userId: string, amount: number) {
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { balance: { increment: amount } }
    }),
    prisma.transaction.create({
      data: {
        type: 'DEPOSIT',
        amount,
        description: 'Top up balance',
        user: {
          connect: {
            id: userId
          }
        }
      }
    })
  ]);
}

export async function addParticipant(userId: string, matchId: string) {
  const match = await prisma.match.findUnique({
    where: { id: matchId }
  });
  if (!match) {
    throw new Error(`Match with id ${matchId} does not exist`);
  }
  await prisma.matchParticipant.create({
    data: {
      userId,
      matchId
    }
  });
}

export async function deleteParticipant(userId: string, matchId: string) {
  await prisma.matchParticipant.deleteMany({
    where: {
      userId: userId,
      matchId: matchId
    }
  });
}

export async function getAllShuttleCocks() {
  return await prisma.shuttleBrand.findMany();
}

export async function upsertShuttleUsed(
  shuttleBrandId: string,
  matchId: string,
  quantity: number,
  totalCost?: number
) {
  const unitPrice = await prisma.shuttleBrand.findUnique({
    where: {
      id: shuttleBrandId
    },
    select: {
      price: true
    }
  });
  const cost = totalCost || (unitPrice?.price || 0) * quantity;
  await prisma.shuttleUsage.upsert({
    create: {
      matchId,
      brandId: shuttleBrandId,
      quantityUsed: quantity,
      cost
    },
    update: {
      quantityUsed: quantity
    },
    where: {
      matchId_brandId: {
        matchId,
        brandId: shuttleBrandId
      }
    }
  });
}

export async function getAllCourtsDB() {
  return await prisma.court.findMany();
}

export async function upsertCourtBooking(
  matchId: string,
  courtId: string,
  duration: number
) {
  const court = await prisma.court.findUnique({
    where: {
      id: courtId
    },
    select: {
      basePrice: true
    }
  });
  return await prisma.$transaction([
    prisma.matchCourtBooking.upsert({
      create: {
        matchId,
        courtId,
        duration,
        bookingCost: court?.basePrice || 0
      },
      update: {
        duration
      },
      where: {
        matchId_courtId: {
          matchId,
          courtId
        }
      }
    }),
    prisma.match.update({
      where: {
        id: matchId
      },
      data: {
        state: duration === 0 ? MatchState.PLANNED : MatchState.BOOKED
      }
    })
  ]);
}

export async function addPlayerDB({
  name,
  email
}: {
  name: string;
  email: string;
}) {
  return await prisma.user.create({
    data: {
      name,
      email
    }
  });
}

export async function finaliseMatchDB(
  matchId: string,
  userIds: string[],
  cost: number
) {
  const averageCost = cost / userIds.length;
  await prisma.$transaction([
    prisma.transaction.createMany({
      data: userIds.map((userId) => ({
        userId,
        amount: averageCost,
        type: TransactionType.MATCH_FEE,
        description: 'Match participation fee'
      }))
    }),
    prisma.user.updateMany({
      where: { id: { in: userIds } },
      data: { balance: { decrement: averageCost } }
    }),
    prisma.match.update({
      where: { id: matchId },
      data: { state: MatchState.FINISHED, cost }
    })
  ]);
}
