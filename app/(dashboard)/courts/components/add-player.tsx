'use client'
import { Button } from '@/components/ui/button';
import {
  SheetContent,
  SheetTitle,
  SheetTrigger,
  Sheet
} from '@/components/ui/sheet';
import { addPlayer } from 'app/(dashboard)/actions';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';

export default function AddPlayerButton() {
  const [openDialog, setOpenDialog] = useState(false);

  async function handleSubmitAddPlayer(formData: FormData) {
    try {
      await addPlayer(formData);
      setOpenDialog(false);
    } catch (error) {
      console.log('🚀 ~ handleSubmitAddPlayer ~ error:', (error as any).stack);
      throw error;
    }
  }

  return (
    <Sheet open={openDialog} onOpenChange={setOpenDialog}>
      <SheetTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" /> Add Player
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetTitle>Add Player</SheetTitle>
        <form action={handleSubmitAddPlayer}>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <label className="text-right">Name</label>
              <input name='name' className='p-2 min-w-40' placeholder="Enter player name" />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-right">Email</label>
              <input name='email' className='p-2 min-w-40' placeholder="Enter email" />
            </div>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
