import { getMatches } from '@/lib/db';
import MatchesTabs from './matches-tabs';

export default async function MatchesPage(props: {
  searchParams: Promise<{ s: string; offset: string }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams.s ?? '';
  const offset = searchParams.offset ?? 0;
  const { matches, newOffset, totalMatches } = await getMatches(
    search,
    Number(offset)
  );

  return (
    <MatchesTabs
      matches={matches}
      offset={newOffset || 0}
      totalMatches={totalMatches}
    />
  );
}
