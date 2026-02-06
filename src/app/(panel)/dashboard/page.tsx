
import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import { DashboardComponent } from "./components/dashboard-component";

// export const metadata: Metadata = {
//   title: "Dashboard",
//   description: "An example dashboard to test the new components.",
// };


// Load from database.

export default async function DashboardPage() {
  await requireAuth();
  const initial = await caller.stats({ hours: 24 });

  return (
    <div className="@container/page flex flex-1 flex-col gap-8 p-6">
      <DashboardComponent initial={initial} />
    </div>
  );
}
