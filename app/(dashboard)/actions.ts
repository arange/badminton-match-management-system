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
  finaliseMatchDB,
  getCourtByIdDB
} from '@/lib/db';
import { MatchState } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { DEFAULT_TIME_ZONE } from 'constants/time';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

export async function addMatch(formData: FormData) {
  const date = String(formData.get('date')); // e.g., "01/19/2025"
  const time = String(formData.get('time')); // e.g., "06:30 PM"

  const dateTime = `${date} ${time}`; // Combine date and time

  try {
    // Specify the format explicitly: MM/DD/YYYY hh:mm A
    const localDateTime = dayjs(dateTime, 'MM/DD/YYYY hh:mm A');

    if (!localDateTime.isValid()) {
      throw new Error(`Invalid date/time: ${dateTime}`);
    }

    // Convert Melbourne time to UTC
    const utcDateTime = localDateTime
      .tz(DEFAULT_TIME_ZONE, true)
      .utc()
      .format();

    console.debug('🚀 ~ addMatch ~ dateTime(local):', dateTime);
    console.debug('🚀 ~ addMatch ~ utcDateTime:', utcDateTime);

    // Pass the UTC date-time to the database
    await addMatchByDate(utcDateTime);
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

export async function getCourtById(id: string) {
  return await getCourtByIdDB(id);
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
