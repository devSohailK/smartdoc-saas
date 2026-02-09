import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Request, Response } from 'express';


interface RegisterRequestBody {
    email: string;
    name: string;
    password: string;
}

export const register = async (req: Request, res: Response): Promise<void> => {
    const { email, name, password } = req.body as RegisterRequestBody;

    if (!email || !name || !password) {
        res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
        }


        // new User 
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            name,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        // generate JWT token
        const token = jwt.sign({ userId: savedUser._id, email: savedUser.email }, process.env.JWT_SECRET as string, { expiresIn: '3d' })

        res.status(201).json({ token, user: { email: savedUser.email, name: savedUser.name } });



    } catch (error) {
        console.error("Error in register controller:", error);
        res.status(500).json({ message: "Server error" });

    }
}



export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body as RegisterRequestBody;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user || !user.password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: "3d" }
        );

        return res.status(200).json({ token, user: { email: user.email } });
    } catch (error) {
        console.error("Error in login controller:", error);
        return res.status(500).json({ message: "Server error" });
    }

}

