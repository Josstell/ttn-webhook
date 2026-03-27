import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import { DashboardSoil } from "../components/dashboard-soil";

const soilPage = async () => {
  await requireAuth();
  const initialSoil = await caller.statsSoil({ hours: 7 * 24 });

  return (
    <div className="@container/page flex flex-1 flex-col gap-8 p-6">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <DashboardSoil initialSoil={initialSoil as any} />
    </div>
  );
};

export default soilPage;
