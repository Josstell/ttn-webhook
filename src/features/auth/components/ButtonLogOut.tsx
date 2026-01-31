"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export const ButtonLogOut = () => {
  return (
    <Button className="pointer" onClick={() => authClient.signOut()}>
      Sign out
    </Button>
  );
};
