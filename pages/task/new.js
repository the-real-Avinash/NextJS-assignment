import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const NewTask = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
    location: "",
  });
  const router = useRouter();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const getCoordinates = async (location) => {
    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: location,
            format: "json",
          },
        }
      );

      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return { lat, lng: lon };
      } else {
        throw new Error("Location not found");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const coords = await getCoordinates(form.location);
      if (coords) {
        const updatedForm = {
          ...form,
          location: {
            name: form.location,
            latitude: parseFloat(coords.lat),
            longitude: parseFloat(coords.lng),
          },
        };
        await fetch("/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedForm),
        });
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white shadow-xl rounded-lg">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-blue-600">
        Add New Task
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            name="title"
            placeholder="Task Title"
            value={form.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            name="description"
            placeholder="Task Description"
            value={form.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            rows="4"
          ></textarea>
        </div>
        <div>
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-gray-700"
          >
            Due Date
          </label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700"
          >
            Priority
          </label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <input
            type="text"
            name="location"
            placeholder="Location (e.g., City Name)"
            value={form.location}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-bold rounded-md shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
        >
          Add Task
        </button>
      </form>
    </div>
  );
};

export default NewTask;
