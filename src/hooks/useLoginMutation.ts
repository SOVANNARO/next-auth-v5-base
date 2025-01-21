import mutationKey from "@/constants/shared/mutationKey";
import loginService from "@/stores/login/services";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const useLoginMutation = () => {
  const router = useRouter();

  const { mutateAsync: login, isPending } = useMutation({
    mutationKey: [mutationKey.login],
    mutationFn: loginService,
    onSuccess: () => {
      router.push("/dashboard");
    },
  });

  return {
    login,
    isPending,
  };
};

export default useLoginMutation;
