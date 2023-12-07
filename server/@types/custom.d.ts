import { IUser } from "../Models/User.Model";
import { Request } from "express";


declare global{
    namespace Express{
        interface Request{
            user?: IUser
        }
    }
}