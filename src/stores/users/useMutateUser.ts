import { useMutation, useQueryClient } from "@tanstack/react-query";
import queryKey from "@/constants/shared/queryKey";
import mutationKey from "@/constants/shared/mutationKey";
import { createUserService } from "@/stores/users/services";

const useMutateUser = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: createUser } = useMutation({
    mutationKey: [mutationKey.user.create],
    mutationFn: createUserService,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKey.users],
      });
    },
  });

  return {
    createUser,
  };
};

export default useMutateUser;
