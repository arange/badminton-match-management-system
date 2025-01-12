import { MatchState } from "@prisma/client";

export const statusColourMap: { [key in MatchState]: string } = {
  PLANNED: 'bg-blue-300',
  BOOKED: 'bg-orange-300',
  FINISHED: 'bg-green-300',
  CANCELLED: 'bg-red-300'
};