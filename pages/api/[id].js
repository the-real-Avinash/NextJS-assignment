import dbConnect from "@/lib/dbConnect";
import Task from "@/models/tasks";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query; // Extract the task ID from the query parameters

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const task = await Task.findById(id);
        if (!task) {
          return res
            .status(404)
            .json({ success: false, message: "Task not found" });
        }
        res.status(200).json({ success: true, data: task });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "PUT":
      try {
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

    case "PATCH":
      try {
        const { status } = req.body;

        if (!status) {
          return res.status(400).json({ message: "Task status is required" });
        }

        const updatedTask = await Task.findByIdAndUpdate(
          id,
          { status },
          { new: true }
        );

        if (!updatedTask) {
          return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ success: true, data: updatedTask });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
      break;

    case "DELETE":
      try {
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
