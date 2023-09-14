import dbConnect from '../../../utils/dbConnect';
import validateToken from '../../../utils/validateToken';
import User from '../../../models/user';

dbConnect();

export default async (req, res) => {
  validateToken(req, res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).json({error: 'Method not allowed'});
    }

    try {
      if (req.user.role !== 'clientAdmin') {
        return res.status(403).json({error: 'Invalid token'});
      }

      const agents = await User.find({
        role: 'agent',
        clientId: req.user.clientId,
      });

      res.status(200).json(agents);
    } catch (error) {
      console.error(error);
      res.status(500).json({error: error.message});
    }
  });
};
