import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import Leaflet components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

const TaskDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [task, setTask] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchTask = async () => {
      try {
        const res = await fetch(`/api/${id}`);
        if (res.ok) {
          const data = await res.json();
          setTask(data.data);
        } else {
          console.error("Error fetching task:", res.statusText);
        }
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };

    fetchTask();
  }, [id]);

  const deleteTask = async () => {
    try {
      await fetch(`/api/${id}`, {
        method: "DELETE",
      });
      router.push("/");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  if (!task) return <div>Loading...</div>;

  const { latitude, longitude } = task.location || {};

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{task.title}</h1>
      <p className="text-gray-700">{task.description}</p>
      <p className="text-gray-500">Due Date: {task.dueDate}</p>
      <p className="text-gray-500">Priority: {task.priority}</p>
      <div className="my-4">
        {latitude && longitude ? (
          <MapContainer
            center={[latitude, longitude]}
            zoom={13}
            style={{ height: "300px" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[latitude, longitude]}>
              <Popup>{task.location.name || "Task Location"}</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <p>Location data is not available.</p>
        )}
      </div>
      <Link href={`/tasks/edit/${task._id}`}>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded mr-2">
          Edit
        </button>
      </Link>
      <button
        onClick={deleteTask}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Delete
      </button>
    </div>
  );
};

export default TaskDetail;
