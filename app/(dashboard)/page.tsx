import { getMatches } from '@/lib/db';
import MatchesTabs from './matches-tabs';

export default async function MatchesPage(props: {
  searchParams: Promise<{ s: string; offset: string }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams.s ?? '';
  const offset = searchParams.offset;
  const { matches, totalMatches } = await getMatches(
    search,
    offset ? Number(offset) : null
  );

  return (
    <MatchesTabs
      matches={matches}
      offset={Number(offset) || 0}
      totalMatches={totalMatches}
    />
  );
}
