// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import dbConnect from "@/lib/dbConnect";
import Task from "@/models/tasks";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const tasks = await Task.find({});
        res.status(200).json({ success: true, data: tasks });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "POST":
      try {
        const task = await Task.create(req.body);
        res.status(201).json({ success: true, data: task });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "PUT":
      try {
        const { id } = req.query; // Extract the task ID from the query parameters
        const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!updatedTask) {
          return res
            .status(404)
            .json({ success: false, message: "Task not found" });
        }
        res.status(200).json({ success: true, data: updatedTask });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "DELETE":
      try {
        const { id } = req.query; // Extract the task ID from the query parameters
        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) {
          return res
            .status(404)
            .json({ success: false, message: "Task not found" });
        }
        res.status(200).json({ success: true, data: deletedTask });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, message: "Method not allowed" });
      break;
  }
}
