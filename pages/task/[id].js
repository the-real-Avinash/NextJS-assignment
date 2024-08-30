import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";

const TaskDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      if (!id) return;
      const res = await fetch(`/api/tasks/${id}`);
      const data = await res.json();
      setTask(data.data);
    };
    fetchTask();
  }, [id]);

  const deleteTask = async () => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  if (!task) return <div>Loading...</div>;

  return (
    <div>
      <h1>{task.title}</h1>
      <p>{task.description}</p>
      <p>Due Date: {task.dueDate}</p>
      <p>Priority: {task.priority}</p>
      <p>Location: {task.location}</p>
      <Link href={`/tasks/edit/${task._id}`}>
        <button>Edit</button>
      </Link>
      <button onClick={deleteTask}>Delete</button>
    </div>
  );
};

export default TaskDetail;
