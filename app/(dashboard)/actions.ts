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
  upsertCourtBooking
} from '@/lib/db';
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

export async function updateCourtBooking(matchId: string, courtId: string, duration: number) {
  await upsertCourtBooking(matchId, courtId, duration);
  revalidatePath(`/${matchId}`);
}
