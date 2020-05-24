import { IUser, UserModel } from "../models";

export const removeUserPasswordInfo = (user: IUser) => {
  const {
    email,
    username,
    creationDate,
    token,
    validated,
    online,
    lastConnexion,
    gender,
    pictures,
  } = user;
  const newUser: any = {
    email,
    username,
    creationDate,
    token,
    validated,
    online,
    lastConnexion,
    gender,
    pictures,
  };
  return newUser;
};
