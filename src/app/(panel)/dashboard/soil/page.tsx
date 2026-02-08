import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import { DashboardSoil } from "../components/dashboard-soil";

type Props = {};

const soilPage = async (props: Props) => {
  await requireAuth();
  const initialSoil = await caller.statsSoil({ hours: 24 });

  return (
    <div className="@container/page flex flex-1 flex-col gap-8 p-6">
      <DashboardSoil initialSoil={initialSoil as any} />
    </div>
  );
};

export default soilPage;
