import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/user';

dbConnect();

export default async (req, res) => {
  if (req.method === 'DELETE') {
    try {
      const {_id} = req.body;
      await User.findByIdAndDelete(_id);
      res.status(200).json({message: 'Admin deleted successfully'});
    } catch (error) {
      console.error(error);
      res.status(500).json({error: error.message});
    }
  } else {
    res.status(405).json({error: 'Method not allowed'});
  }
};
