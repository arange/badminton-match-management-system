import { getMatchDetailsById } from '@/lib/db';

export default async function MatchDetailsPage(props: {
  params: Promise<{ matchId: string }>;
}) {
  const params = await props.params;
  const matchId = params.matchId;
  const matchDetails = await getMatchDetailsById(matchId);
  return <div>{JSON.stringify(matchDetails)}</div>;
}
