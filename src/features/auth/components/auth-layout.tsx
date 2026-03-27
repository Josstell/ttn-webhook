import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = object;

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-muted flex min-h-svh flex-col justify-center items-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href={"/"}
          className="flex flex-col items-center self-center font-medium"
        >
          <Image alt="Logo" src="/logos/Logo.svg" width={550} height={550} className="w-auto h-48 dark:hidden" priority />
          <Image alt="Logo" src="/logos/Logo-dark.svg" width={550} height={550} className="w-auto h-48 hidden dark:block" priority />
          <p className="text-4xl font-bold">MILPA</p>
          {/* <p className="text-2xl font-bold">Smart Systems</p> */}
        </Link>
        {children}
      </div>
    </div>
  );
};
