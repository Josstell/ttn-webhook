import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import { DashboardComponent } from "./(panel)/dashboard/components/dashboard-component";

export default async function Page() {
  await requireAuth();
  const initial = await caller.stats({ hours: 8 * 24 });

  //console.log("initial: ", initial);

  return (
    <main className="p-8 space-y-6">
      <DashboardComponent initial={initial as any} />
    </main>
  );
}
