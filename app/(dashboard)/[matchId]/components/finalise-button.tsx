'use client';
import { Button } from '@/components/ui/button';
import { finaliseMatch } from 'app/(dashboard)/actions';

export default function FinaliseButton({ matchId }: { matchId: string }) {
  async function handleOnFinalise() {
    await finaliseMatch(matchId);
  }
  return <Button onClick={handleOnFinalise}>Finalise</Button>;
}
