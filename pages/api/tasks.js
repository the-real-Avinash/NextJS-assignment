// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// import dbConnect from '../../../lib/dbConnect';
// import Task from '../../../models/task';
import dbConnect from '@/lib/dbConnect';
import Task from '@/models/tasks';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const tasks = await Task.find({});
        res.status(200).json({ success: true, data: tasks });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const task = await Task.create(req.body);
        res.status(201).json({ success: true, data: task });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
