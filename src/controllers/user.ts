import { Request, Response } from "express";
import { validationResult } from "express-validator/check";
import { IUserModel } from "../database/models/Users";
import { statusCodes } from "../config/statusCodes";
import { userDBInteractions } from "../database/interactions/user";
import { errorMessage } from "../config/errorFormatter";
import { IUser } from "../interfaces/IUser";
import { v1 as uuidv1 } from "uuid";

const userController = {
    getall: async (req: Request, res: Response) => {
        try {
            const users = await userDBInteractions.all();
            res.status(statusCodes.SUCCESS).json(users);
        } catch (err) {
            res.status(statusCodes.SERVER_ERROR).json(err);
        }
    },

    show: async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(statusCodes.MISSING_PARAMS).json(
                {
                    status: 422,
                    message: `Error: there are missing parameters.`
                }
            );
        } else {
            try {
                const { userId } = req.params;

                const user: IUserModel = await userDBInteractions.find(
                    userId
                );

                user
                    ? res.status(statusCodes.SUCCESS).json(user)
                    : res.status(statusCodes.NOT_FOUND).json({
                          status: statusCodes.NOT_FOUND,
                          message: "Problem not found"
                      });

            } catch (error) {
                res.status(statusCodes.SERVER_ERROR).json(error);
            }
        }
    },

    create: async (req: Request, res: Response) => {
        global.console.log('req: ',JSON.stringify(req.body));

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(statusCodes.MISSING_PARAMS).json(
                {
                    status: 422,
                    message: errors.mapped()
                }
            );
        } else {
            try {
                const user = req.body;

               // HERE IS WHERE WE PROCESS INPUT AND CONVERT INTO OBJECT
                const userData: IUser = {
                    ...user
                };

                const newUser: IUserModel = await userDBInteractions.create(
                    userData
                );
                res.status(statusCodes.SUCCESS).json(newUser);
            } catch (error) {
                res.status(statusCodes.SERVER_ERROR).json(error);
            }
        }
    },

    update: async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(statusCodes.MISSING_PARAMS).json(
                {
                    status: 422,
                    message: `Error: updating was done incorrectly.`
                }
            );
        } else {
            try {
                const { userId } = req.params;
                const user: IUserModel = await userDBInteractions.find(userId);

                if(!user)
                    res.status(statusCodes.NOT_FOUND).json({
                        status: statusCodes.NOT_FOUND,
                        message: "User not found"
                    });
                else{
                    const updatedUserBody: IUser = {
                        ...req.body,
                    };

                    const updatedUser: IUserModel = await userDBInteractions.update(
                        userId,
                        updatedUserBody
                    );

                    res.status(statusCodes.SUCCESS).json(updatedUser);

                }
            } catch (error) {
                res.status(statusCodes.SERVER_ERROR).json(error);
            }
        }
    },

    delete: async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(statusCodes.MISSING_PARAMS).json(
                {
                    status: 422,
                    message: `Error: there are missing parameters.`
                }
            );
        } else {
            try {
                const user = await userDBInteractions.find(req.params.userId);
                if (!user) {
                    res.status(statusCodes.NOT_FOUND).json(
                        {
                            status: statusCodes.NOT_FOUND,
                            message: "User not found"
                        }
                    );
                }
                user.delete();
                res.status(statusCodes.SUCCESS).send();
            } catch(err) {
                res.status(statusCodes.SERVER_ERROR).send(err);
            }

        }
    }
};
export { userController };