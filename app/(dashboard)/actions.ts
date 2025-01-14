'use server';

import {
  addMatchByDate,
  addParticipant,
  upsertShuttleUsed,
  deleteMatchesById,
  deleteParticipant,
  getAllShuttleCocks,
  getMatchDetailsById,
  getUserById,
  getUsers,
  topUpUserBalance,
  getAllCourtsDB,
  upsertCourtBooking,
  addPlayerDB,
  finaliseMatchDB
} from '@/lib/db';
import { MatchState } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function addMatch(formData: FormData) {
  const date = String(formData.get('date'));
  const time = String(formData.get('time'));
  const dateTime = new Date(`${date} ${time}`).toISOString();

  try {
    await addMatchByDate(dateTime);
    revalidatePath('/');
  } catch (error) {
    console.log('🚀 ~ addMatch ~ error:', (error as any).stack);
    throw error;
  }
}

export async function getMatchDetails(id: string) {
  return await getMatchDetailsById(id);
}

export async function deleteMatch(id: string) {
  try {
    await deleteMatchesById(id);
    revalidatePath('/');
  } catch (error) {
    console.log('🚀 ~ deleteMatches ~ error:', (error as any).stack);
    throw error;
  }
}

export async function getUserByUserId(id: string) {
  return await getUserById(id);
}

export async function getAllUsers() {
  return await getUsers();
}

export async function topUpBalance(id: string, amount: number) {
  try {
    await topUpUserBalance(id, amount);
    revalidatePath(`/players/${id}`);
  } catch (error) {
    console.log('🚀 ~ topUpBalance ~ error:', (error as any).stack);
    throw error;
  }
}

export async function toggleParticipantToMatch(
  userId: string,
  matchId: string
) {
  const matchDetails = await getMatchDetailsById(matchId);
  const isParticipantAlready =
    matchDetails?.participants.some(
      (participant) => participant.userId === userId
    ) || false;

  if (isParticipantAlready) {
    await deleteParticipant(userId, matchId);
    revalidatePath(`/${matchId}`);
    return;
  }
  await addParticipant(userId, matchId);
  revalidatePath(`/${matchId}`);
}

export async function getAllShuttles() {
  return await getAllShuttleCocks();
}

export async function updateShuttleUsed(
  shuttleBrandId: string,
  matchId: string,
  quantity: number
) {
  await upsertShuttleUsed(shuttleBrandId, matchId, quantity);
  revalidatePath(`/${matchId}`);
}

export async function getAllCourts() {
  return await getAllCourtsDB();
}

export async function updateCourtBooking(
  matchId: string,
  courtId: string,
  duration: number
) {
  await upsertCourtBooking(matchId, courtId, duration);
  revalidatePath(`/${matchId}`);
}

export async function addPlayer(formData: FormData) {
  const name = String(formData.get('name'));
  const email = String(formData.get('email'));
  await addPlayerDB({ name, email });
  revalidatePath('/players');
}

export async function finaliseMatch(matchId: string) {
  const match = await getMatchDetailsById(matchId);
  if (!match) throw new Error('Match not found');
  if (match.state === MatchState.FINISHED) {
    throw new Error('Match is already finished');
  }
  // 1. Fetch all shuttle usage for the match
  const shuttleUsages = match.shuttleUsages;
  // 2. Calculate total shuttle cost
  const totalShuttleCost = shuttleUsages.reduce(
    (acc, curr) => acc + curr.cost,
    0
  );
  // 3. Fetch the court booking
  const courtBooking = match.matchCourtBookings[0];
  if (!courtBooking) {
    throw new Error('Court booking not found');
  }
  const { bookingCost, duration } = courtBooking;
  // 4. Calculate total court cost
  const totalCourtCost = (bookingCost || 0) * (duration || 0);
  // 5. Calculate total cost
  const totalCost = totalShuttleCost + totalCourtCost;
  console.log('🚀 ~ finaliseMatch ~ totalCost:', totalCost);
  // 6. Fetch all participants
  const participantIds = match.participants.map(
    (participant) => participant.userId
  );
  console.log('🚀 ~ finaliseMatch ~ participantIds:', participantIds);
  // 7. Create transactions, deduct the cost from the participants' balance, and update the  match state and cost
  console.log('🚀 ~ finaliseMatch ~ matchId:', matchId);
  await finaliseMatchDB(matchId, participantIds, totalCost);
  revalidatePath(`/${matchId}`);
}
