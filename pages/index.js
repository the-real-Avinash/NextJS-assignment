import { useState, useEffect } from 'react';

const Home = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      console.log("Data", data);
      
      setTasks(data.data);
    };
    fetchTasks();
  }, []);

  return (
    <div>
      <h1>Task List</h1>
      {tasks.map((task) => (
        <div key={task._id}>
          <h2>{task.title}</h2>
          <p>{task.description}</p>
          <p>{task.dueDate}</p>
          <p>{task.priority}</p>
          <p>{task.location}</p>
        </div>
      ))}
    </div>
  );
};

export default Home;
