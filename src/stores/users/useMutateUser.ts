import { useMutation, useQueryClient } from "@tanstack/react-query";
import queryKey from "@/constants/shared/queryKey";
import mutationKey from "@/constants/shared/mutationKey";
import {
  createUserService,
  deleteUserService,
  updateUserService,
} from "@/stores/users/services";

const useMutateUser = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: createUser, isPending: isPendingCreateUser } =
    useMutation({
      mutationKey: [mutationKey.user.create],
      mutationFn: createUserService,
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [queryKey.users],
        });
      },
    });

  const { mutateAsync: updateUser, isPending: isPendingUpdateUser } =
    useMutation({
      mutationKey: [mutationKey.user.update],
      mutationFn: updateUserService,
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [queryKey.users],
        });
      },
    });

  const { mutateAsync: deleteUser } = useMutation({
    mutationKey: [mutationKey.user.delete],
    mutationFn: (id: number) => deleteUserService(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKey.users],
      });
    },
  });

  return {
    createUser,
    updateUser,
    deleteUser,
    isPendingCreateUser,
    isPendingUpdateUser,
  };
};

export default useMutateUser;
