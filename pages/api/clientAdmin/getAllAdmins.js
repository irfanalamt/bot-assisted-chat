import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/user';

dbConnect();

export default async (req, res) => {
  if (req.method === 'GET') {
    try {
      const admins = await User.find({role: 'admin'});
      res.status(200).json(admins);
    } catch (error) {
      console.error(error);
      res.status(500).json({error: error.message});
    }
  } else {
    res.status(405).json({error: 'Method not allowed'});
  }
};
