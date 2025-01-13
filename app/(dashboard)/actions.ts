'use server';

import {
  addMatchByDate,
  addParticipant,
  addShuttleUsed,
  deleteMatchesById,
  deleteParticipant,
  getAllShuttleCocks,
  getMatchDetailsById,
  getUserById,
  getUsers,
  topUpUserBalance
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

export async function incrementShuttleUsed(
  shuttleBrandId: string,
  matchId: string,
  quantity: number
) {
  // const matchDetails = await getMatchDetailsById(matchId);
  // const shuttleUsed =
    // matchDetails?.shuttleUsages.find(
    //   (usage) => usage.brandId === shuttleBrandId
    // )?.quantityUsed || 0;
  await addShuttleUsed(shuttleBrandId, matchId, quantity + 1);
  revalidatePath(`/${matchId}`);
}

export async function decrementShuttleUsed(
  shuttleBrandId: string,
  matchId: string,
  quantity: number
) {
  // const matchDetails = await getMatchDetailsById(matchId);
  // const shuttleUsed =
    // matchDetails?.shuttleUsages.find(
    //   (usage) => usage.brandId === shuttleBrandId
    // )?.quantityUsed || 0;
  await addShuttleUsed(shuttleBrandId, matchId, quantity - 1);
  revalidatePath(`/${matchId}`);
}
