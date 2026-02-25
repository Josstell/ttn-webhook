import { LoginForm } from "@/features/auth/components/login-form";
import { requireUnauth } from "@/lib/auth-utils";
import React from "react";

type Props = object;

const loginPage = async (props: Props) => {
  await requireUnauth();
  return <LoginForm />;
};

export default loginPage;
