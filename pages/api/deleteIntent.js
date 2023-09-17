import dbConnect from '../../utils/dbConnect';
import validateToken from '../../utils/validateToken';
import Intent from '../../models/chatIntent';

dbConnect();

export default async (req, res) => {
  validateToken(req, res, async () => {
    if (req.method === 'DELETE') {
      try {
        if (!['clientAdmin', 'admin', 'agent'].includes(req.user.role)) {
          return res.status(403).json({error: 'Invalid token'});
        }

        const {_id} = req.body;

        const intent = await Intent.findById(_id);
        if (!intent) {
          return res.status(404).json({error: 'Intent not found'});
        }

        await Intent.findByIdAndDelete(_id);
        res.status(200).json({message: 'Intent deleted successfully'});
      } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal server error'});
      }
    } else {
      res.status(405).json({error: 'Method not allowed'});
    }
  });
};
