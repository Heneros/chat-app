import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../../models/UserModel';

const updateProfileUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { automatedMessagesEnabled, firstName, lastName, email, password } =
        req.body;
    if (!id) {
        return res.status(401).json({ message: 'User no found' });
    }
    try {
        const updateData: any = {
            automatedMessagesEnabled,
            firstName,
            lastName,
            email,
        };

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).lean();

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: `Updated User`,
            updatedUser,
        });
    } catch (error) {
        console.error('Error updating user', error);
    }
};
export default updateProfileUser;
