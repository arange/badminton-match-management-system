import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function AddPlayerButton() {
  return (
    <Button size="sm" className="h-8 gap-1">
      <PlusCircle className="h-3.5 w-3.5" /> Add Player
    </Button>
  );
}
