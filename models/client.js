import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  clientId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
    default: '',
  },
  nlpFile: {
    type: String, // file location
  },
  cssFile: {
    type: String, // file location
  },
});

export default mongoose.models.Client || mongoose.model('Client', clientSchema);
