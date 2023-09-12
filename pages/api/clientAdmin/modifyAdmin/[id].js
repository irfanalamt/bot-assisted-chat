import dbConnect from '../../../../utils/dbConnect';
import User from '../../../../models/user';

dbConnect();

export default async (req, res) => {
  if (req.method === 'PUT') {
    try {
      const {id} = req.query;
      const updateData = req.body;

      const updatedAdmin = await User.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      res.status(200).json(updatedAdmin);
    } catch (error) {
      console.error(error);
      res.status(500).json({error});
      // if (error.code == 11000) {
      //   res.status(400).json({error: 'Invalid input'});
      // } else res.status(500).json({error: 'Internal server error'});
    }
  } else {
    res.status(405).json({error: 'Method not allowed'});
  }
};
