import { get, post } from "@/lib/apiUtils";
import { ICreateUser, User } from "@/types/login/auth";
import apiPath from "@/constants/shared/apiPath";

export const getAllUserService = async () => get<User[]>(apiPath.user.get);

export const createUserService = async (data: ICreateUser) =>
  post<ICreateUser>(apiPath.user.create, data);
