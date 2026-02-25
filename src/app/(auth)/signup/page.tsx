import { RegisterForm } from "@/features/auth/components/register-form";
import { requireUnauth } from "@/lib/auth-utils";
import React from "react";

type Props = object;

const registerPage = async () => {
  await requireUnauth();

  return <RegisterForm />;
};

export default registerPage;
