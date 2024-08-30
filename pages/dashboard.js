import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";

const Dashboard = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      const taskData = data.data;

      const priorities = taskData.reduce(
        (acc, task) => {
          acc[task.priority] += 1;
          return acc;
        },
        { High: 0, Medium: 0, Low: 0 }
      );

      setChartData({
        labels: ["High", "Medium", "Low"],
        datasets: [
          {
            label: "Task Priority",
            data: [priorities.High, priorities.Medium, priorities.Low],
            backgroundColor: ["red", "yellow", "green"],
          },
        ],
      });
    };
    fetchTasks();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <Pie data={chartData} />
    </div>
  );
};

export default Dashboard;
