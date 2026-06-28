import MessagesClient from "./MessagesClient";

export default async function MessagesPage({
  searchParams
}: {
  searchParams?: Promise<{ targetUserId?: string; targetName?: string; candidateId?: string; candidateName?: string; intent?: string }>;
}) {
  const query = (await searchParams) ?? {};
  return <MessagesClient initialQuery={query} />;
}
