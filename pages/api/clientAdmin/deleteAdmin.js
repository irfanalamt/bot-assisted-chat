import dbConnect from '../../../utils/dbConnect';
import validateToken from '../../../utils/validateToken';
import User from '../../../models/user';

dbConnect();

export default async (req, res) => {
  validateToken(req, res, async () => {
    if (req.method === 'DELETE') {
      try {
        if (req.user.role !== 'clientAdmin') {
          return res.status(403).json({error: 'Invalid token'});
        }

        const {_id} = req.body;

        const user = await User.findById(_id);
        if (!user) {
          return res.status(404).json({error: 'Admin not found'});
        }

        await User.findByIdAndDelete(_id);
        res.status(200).json({message: 'Admin deleted successfully'});
      } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal server error'});
      }
    } else {
      res.status(405).json({error: 'Method not allowed'});
    }
  });
};
