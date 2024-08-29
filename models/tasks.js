import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
  location: { type: String },
});

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);