import { IUser, UserModel } from "../models";

export const returnUserPictures = (user: IUser) => {
  return { token: user.token, pictures: user.pictures };
};
