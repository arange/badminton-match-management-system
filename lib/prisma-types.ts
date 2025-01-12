import { Match, MatchCourtBooking, Court } from '@prisma/client';

export type MatchWithCourtAndParticipants = Match & {
  matchCourtBookings: (MatchCourtBooking & {
    court: Pick<Court, 'name'>;
  })[];
} & { participants: { user: { name: string } }[] };
