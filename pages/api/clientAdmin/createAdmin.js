import dbConnect from '../../../utils/dbConnect';
import validateToken from '../../../utils/validateToken';
import User from '../../../models/user';

dbConnect();

export default async (req, res) => {
  validateToken(req, res, async () => {
    if (req.method === 'POST') {
      try {
        if (req.user.role !== 'clientAdmin') {
          return res.status(403).json({error: 'Invalid token'});
        }

        if (req.body.clientId !== req.user.clientId) {
          return res.status(403).json({error: 'Invalid client ID'});
        }

        const newAdmin = await User.create(req.body);

        res.status(201).json(newAdmin);
      } catch (error) {
        console.error(error);

        if (error.code === 11000) {
          const field = Object.keys(error.keyValue)[0];
          const code = 400;
          const error_message = `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } already exists`;
          res.status(code).json({error: error_message});
        } else res.status(500).json({error: 'Internal server error'});
      }
    } else {
      res.status(405).json({error: 'Method not allowed'});
    }
  });
};
