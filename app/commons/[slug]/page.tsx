import { notFound } from "next/navigation";
import { commonsPrinciples, fires, getFire } from "../../../lib/commons";
import FireRoomClient from "./FireRoomClient";

type FireRoomPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function FireRoomPage({ params }: FireRoomPageProps) {
  const { slug } = await params;
  const fire = getFire(slug);

  if (!fire) {
    notFound();
  }

  return (
    <div className="fc-page-stack fc-workspace-page">
      <FireRoomClient fire={fire} allFires={fires} principles={commonsPrinciples} />
    </div>
  );
}
