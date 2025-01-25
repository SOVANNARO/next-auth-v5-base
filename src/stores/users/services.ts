import { del, get, post, put } from "@/lib/apiUtils";
import { ICreateUser, User } from "@/types/login/auth";
import apiPath from "@/constants/shared/apiPath";

export const getAllUserService = async () => get<User[]>(apiPath.user.get);

export const createUserService = async (data: ICreateUser) =>
  post<ICreateUser>(apiPath.user.create, data);

export const updateUserService = async (data: ICreateUser & { id: number }) => {
  const path = apiPath.user.update.replace("{id}", data.id.toString());
  return put<User>(path, data);
};

export const deleteUserService = async (id: number) => {
  const path = apiPath.user.delete.replace("{id}", id.toString());
  return await del(path);
};
