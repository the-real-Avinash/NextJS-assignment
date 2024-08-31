import { useRouter } from "next/router";
import { useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import { fetchTaskById, deleteTask } from "@/store/tasksSlice";
import { format } from "date-fns";

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
  const dispatch = useDispatch();
  const task = useSelector((state) => state.tasks.selectedTask);
  const taskStatus = useSelector((state) => state.tasks.status);
  const error = useSelector((state) => state.tasks.error);

  useEffect(() => {
    if (id) {
      dispatch(fetchTaskById(id));
    }
  }, [id, dispatch]);

  const handleDelete = async () => {
    await dispatch(deleteTask(id));
    router.push("/");
  };

  if (taskStatus === "loading") {
    return <div className="text-center mt-20 text-gray-500">Loading...</div>;
  }

  if (taskStatus === "failed") {
    return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  }

  if (!task) {
    return <div className="text-center mt-20 text-gray-500">No task found</div>;
  }

  const { latitude, longitude } = task.location || {};

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd-MM-yyyy");
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold mb-6 text-blue-600">{task.title}</h1>
      <div className="mb-6">
        <p className="text-lg text-gray-700 mb-2">
          <span className="font-semibold">Description:</span> {task.description}
        </p>
        <p className="text-lg text-gray-500 mb-2">
          <span className="font-semibold">Due Date:</span>{" "}
          {formatDate(task.dueDate)}
        </p>
        <p className="text-lg text-gray-500">
          <span className="font-semibold">Priority:</span>{" "}
          <span
            className={`${
              task.priority === "High"
                ? "text-red-500"
                : task.priority === "Medium"
                ? "text-yellow-500"
                : "text-green-500"
            }`}
          >
            {task.priority}
          </span>
        </p>
      </div>
      <div className="my-6">
        {latitude && longitude ? (
          <MapContainer
            center={[latitude, longitude]}
            zoom={13}
            style={{ height: "300px", borderRadius: "10px" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[latitude, longitude]}>
              <Popup>{task.location.name || "Task Location"}</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <p className="text-center text-gray-500">
            Location data is not available.
          </p>
        )}
      </div>
      <div className="flex justify-between mt-6">
        <Link href={`/tasks/edit/${task._id}`}>
          <button className="bg-yellow-500 text-white px-5 py-2 rounded-md hover:bg-yellow-600 transition duration-300">
            Edit
          </button>
        </Link>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 transition duration-300"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskDetail;
