import { MatchState } from "@prisma/client";

export const statusColourMap: { [key in MatchState]: string } = {
  PLANNED: 'bg-blue-500',
  BOOKED: 'bg-orange-500',
  FINISHED: 'bg-green-500',
  CANCELLED: 'bg-red-500'
};