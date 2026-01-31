import { ButtonLogOut } from "@/features/auth/components/ButtonLogOut";
import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";

export default async function Home() {
  await requireAuth();

  const users = await caller.getUsers();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1>Home</h1>
      <pre>{JSON.stringify(users, null, 2)}</pre>
      {users && <ButtonLogOut />}
    </div>
  );
}
