import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/user';

dbConnect();

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const newAdmin = await User.create(req.body);
      res.status(201).json(newAdmin);
    } catch (error) {
      console.error(error);

      if (error.code == 11000) {
        res.status(400).json({error: 'Invalid input'});
      } else res.status(500).json({error: 'Internal server error'});
    }
  } else {
    res.status(405).json({error: 'Method not allowed'});
  }
};
