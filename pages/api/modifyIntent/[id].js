import dbConnect from '../../../utils/dbConnect';
import validateToken from '../../../utils/validateToken';
import Intent from '../../../models/chatIntent';

dbConnect();

export default async (req, res) => {
  validateToken(req, res, async () => {
    if (req.method !== 'PUT') {
      return res.status(405).json({error: 'Method not allowed'});
    }

    try {
      if (!['clientAdmin', 'admin', 'agent'].includes(req.user.role)) {
        return res.status(403).json({error: 'Invalid token'});
      }

      const {id} = req.query;
      const updateData = req.body;

      const intent = await Intent.findOneAndUpdate(
        {_id: id, clientId: req.user.clientId},
        updateData,
        {new: true}
      );

      if (!intent) {
        return res.status(404).json({error: 'Intent not found'});
      }

      res.status(200).json(intent);
    } catch (error) {
      console.error(error);
      res.status(500).json({error: error.message});
    }
  });
};
