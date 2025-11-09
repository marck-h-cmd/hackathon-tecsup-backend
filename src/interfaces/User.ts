export interface IUserRequest {
    userId: string;
}

export interface IUser {
    id?: number;
    userId: string;
    createdAt?: Date;
    updatedAt?: Date;
}