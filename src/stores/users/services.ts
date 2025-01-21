import { get } from "@/lib/apiUtils";
import queryKey from "@/constants/shared/queryKey";
import { User } from "@/types/login/auth";

export const getAllUserService = async () =>
  get<User[]>(queryKey.users);