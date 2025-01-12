'use client';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { topUpBalance } from '../../actions';
import { useState } from 'react';
export default function TopUpModal({ userId }: { userId: string }) {
  const [openToast, setOpenToast] = useState(false);
  async function handleSubmitTopUp(formData: FormData) {
    try {
      await topUpBalance(
        userId,
        parseFloat(formData.get('amount') as unknown as string)
      );
      setOpenToast(false);
    } catch (error) {
      console.log('🚀 ~ handleSubmitAddMatch ~ error:', (error as any).stack);
      throw error;
    }
  }
  return (
    <Sheet open={openToast} onOpenChange={setOpenToast} modal={true}>
      <SheetTrigger asChild>
        <Button className="ml-2" variant={'secondary'}>
          Top up
        </Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetTitle className="mb-6">Top up</SheetTitle>
        <form action={handleSubmitTopUp}>
          <fieldset className="mb-4 flex flex-col justify-start">
            <label className="mb-2" htmlFor="date">
              Amount
            </label>
            <Input
              className="w-20"
              type="number"
              inputMode="decimal"
              name="amount"
              step="any"
            />
          </fieldset>
          <Button type="submit">Confirm</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
