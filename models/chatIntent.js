import mongoose from 'mongoose';

const flowFileSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  isValidated: {
    type: Boolean,
    required: true,
  },
});

const chatIntentSchema = new mongoose.Schema({
  intentName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  utterances: {
    type: [String],
    required: true,
  },
  intentType: {
    type: String,
    enum: ['FAQ', 'Flow'],
    required: true,
  },
  answers: {
    type: [String],
    required: function () {
      return this.intentType === 'FAQ';
    },
  },
  flowFile: {
    type: flowFileSchema,
    required: function () {
      return this.intentType === 'Flow';
    },
  },
  clientId: {
    type: String,
    required: true,
    index: true,
  },
});

export default mongoose.models.ChatIntent ||
  mongoose.model('ChatIntent', chatIntentSchema);
