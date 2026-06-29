import { redirect } from "next/navigation";

type AuthPageProps = {
  searchParams?: Promise<{
    next?: string;
    error?: string;
  }>;
};

function getSafeNextPath(next?: string) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : undefined;
}

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const query = (await searchParams) ?? {};
  const loginParams = new URLSearchParams();
  const next = getSafeNextPath(query.next);

  if (next) {
    loginParams.set("next", next);
  }

  if (query.error) {
    loginParams.set("error", query.error);
  }

  const queryString = loginParams.toString();
  redirect(queryString ? `/login?${queryString}` : "/login");
}
