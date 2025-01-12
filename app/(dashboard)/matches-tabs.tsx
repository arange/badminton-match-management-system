'use client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MatchesTable } from './matches-table';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { TimePicker } from '@mui/x-date-pickers';
import { Toast } from '@/components/ui/toast';
import { Viewport } from '@radix-ui/react-toast';
import { addMatch } from './actions';
import type { MatchWithCourtAndParticipants } from '@/lib/prisma-types';

export default function MatchesTabs({
  matches,
  offset,
  totalMatches
}: {
  matches: MatchWithCourtAndParticipants[];
  offset: number;
  totalMatches: number;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [openToast, setOpenToast] = useState(false);

  function handleOnValueChange(value: string) {
    setActiveTab(value);
    router.push(`?s=${value}&offset=0`);
  }

  async function handleSubmitAddMatch(formData: FormData) {
    try {
      await addMatch(formData);
      setOpenToast(true);
      console.log('🚀 ~ handleSubmitAddMatch ~ setOpenToast(true)');
    } catch (error) {
      console.log('🚀 ~ handleSubmitAddMatch ~ error:', (error as any).stack);
      throw error;
    }
  }

  const tabs = [
    { value: 'all', label: 'All' },
    { value: 'PLANNED', label: 'Planned' },
    { value: 'BOOKED', label: 'Booked' },
    { value: 'FINISHED', label: 'Finished' },
    { value: 'CANCELLED', label: 'Cancelled', hidden: true } // Mark tabs as hidden if needed
  ];

  return (
    <>
      <Sheet modal={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Tabs onValueChange={handleOnValueChange} defaultValue="all">
            <div className="flex items-center">
              <TabsList>
                {tabs.map(({ value, label, hidden }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className={hidden ? 'hidden sm:flex' : ''}
                  >
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <SheetTrigger asChild>
                  <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Add Match
                    </span>
                  </Button>
                </SheetTrigger>
              </div>
            </div>
            {tabs.map(({ value }) => (
              <TabsContent key={value} value={value}>
                {activeTab === value && (
                  <MatchesTable
                    matches={matches}
                    offset={offset ?? 0}
                    totalMatches={totalMatches}
                  />
                )}
              </TabsContent>
            ))}
          </Tabs>
          <SheetContent className="h-full" side="top">
            <SheetTitle className="mb-6">Add Match</SheetTitle>
            <form action={handleSubmitAddMatch}>
              <fieldset className="mb-4 w-full flex flex-col justify-start">
                <label className="mb-2" htmlFor="date">
                  Date
                </label>
                <DatePicker label="Date" name="date" />
              </fieldset>
              <fieldset className="mb-4 w-full flex flex-col justify-start">
                <label className="mb-2" htmlFor="time">
                  Time
                </label>
                <TimePicker label="Time" name="time" />
              </fieldset>
              <Button type="submit">Create Match</Button>
            </form>
          </SheetContent>
        </LocalizationProvider>
      </Sheet>
      <Toast
        title="🎉 Match Created"
        content="A match has been successfully created!"
        className="bg-green-600 text-white p-4 rounded-md"
        open={openToast}
        onOpenChange={setOpenToast}
      />
      <Viewport className="fixed bottom-0 right-0 z-[60] flex max-h-screen flex-col p-4" />
    </>
  );
}
