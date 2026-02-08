"use client";

import { BadgeCheck, Bell, CreditCard, LogOut, Sparkles } from "lucide-react";
import { authClient } from "@/lib/auth-client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NavUser() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <Button variant="ghost" size="icon">
        <Avatar className="size-8 rounded-md">
          <AvatarFallback className="rounded-lg">...</AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  if (!session) {
    return null;
  }

  const user = session.user;
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email?.slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Avatar className="size-8 rounded-md">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback className="rounded-lg">
              {initials ?? "CN"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.image ?? undefined} alt={user.name} />
              <AvatarFallback className="rounded-lg">
                {initials ?? "CN"}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="text-muted-foreground truncate text-xs">
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Sparkles />
            Actualizar a Pro
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheck />
            Cuenta
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard />
            Facturación
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell />
            Notificaciones
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => authClient.signOut()}>
          <LogOut />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
