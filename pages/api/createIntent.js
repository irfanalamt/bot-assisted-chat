import dbConnect from '../../utils/dbConnect';
import validateToken from '../../utils/validateToken';
import Intent from '../../models/chatIntent';

dbConnect();

export default async (req, res) => {
  validateToken(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({error: 'Method not allowed'});
    }

    try {
      if (!['clientAdmin', 'admin', 'agent'].includes(req.user.role)) {
        return res.status(403).json({error: 'Invalid token'});
      }

      const newIntentData = {
        ...req.body,
        clientId: req.user.clientId,
      };

      const newIntent = await Intent.create(newIntentData);

      res.status(201).json(newIntent);
    } catch (error) {
      console.error(error);
      res.status(500).json({error: error.message});
    }
  });
};
