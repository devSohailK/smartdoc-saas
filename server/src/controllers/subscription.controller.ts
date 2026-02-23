import { Request, Response } from 'express';
import { User } from '../models/User.js';



const PRO_CREDITS = 999999;

export const upgradeToPro = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        const user = await User.findByIdAndUpdate(
            userId,
            { plan: "pro", credits: PRO_CREDITS },
            { new: true }
        ).select("-password");

        if(!user){
            res.status(401).json({message : 'User not found'})
        }


    } catch (error) {

    }

}