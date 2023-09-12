import dbConnect from '../../utils/dbConnect';
import User from '../../models/user';
import jwt from 'jsonwebtoken';

dbConnect();

export default async (req, res) => {
  if (req.method === 'POST') {
    const {username, password} = req.body;

    try {
      const user = await User.findOne({username, password});
      if (!user) {
        return res.status(401).json({error: 'Invalid username or password'});
      }

      const token = jwt.sign(
        {id: user._id, role: user.role},
        process.env.JWT_SECRET,
        {expiresIn: '7d'}
      );

      return res.json({
        token,
        role: user.role,
        message: 'Login successful.',
        name: user.name,
        clientId: user.clientId,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({error: 'Internal server error'});
    }
  } else {
    res.status(405).json({error: 'Method not allowed'});
  }
};
