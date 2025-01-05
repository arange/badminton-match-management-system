'use server';

import { deleteMatchesById } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function deleteMatches(formData: FormData) {
  // let id = Number(formData.get('id'));
  // await deleteMatchesById(id);
  // revalidatePath('/');
}
