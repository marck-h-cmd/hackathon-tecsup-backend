import { Document, Types } from "mongoose";
export interface IUserRequest{
    userId: string;
}
export interface IUser extends Document{
    userId: string;
}