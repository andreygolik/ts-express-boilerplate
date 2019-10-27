import mongoose from 'mongoose';

const playgroundItem = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters']
  },
  email: {
    type: String,
    required: false,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  groups: {
    type: [String],
    required: true,
    enum: [
      'root',
      'admin',
      'sudo',
      'ssh',
      'users',
    ]
  },
  rate: {
    type: Number,
    min: [1, 'Rate must be at least 1'],
    max: [10, 'Rate must not be more than 10'],
  },
  text: {
    type: String,
    default: 'default',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('PlaygroundItem', playgroundItem);
