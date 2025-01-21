import { signIn } from "next-auth/react";

const loginService = async (data: any) => {
  const result = await signIn("credentials", {
    ...data,
    redirect: false,
  });
  if (result?.error) {
    throw new Error(result.error);
  }
};

export default loginService;
