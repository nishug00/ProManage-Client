import axios from "axios";
import { addTokenToHeader } from "../helper/index";

export const addTask = async (data) => {
  const headers = addTokenToHeader({ headers: {} });
  const res = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/api/v1/task/add-task`,
    data,
    {
      headers,
    }
  );
  return res.data;
};


export const assignTask = async (taskId, assigneeId) => {
  const headers = addTokenToHeader({ headers: {} });
  
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_BASE_URL}/api/v1/task/${taskId}/assign`,
      { assignee: assigneeId },
      { headers }
    );

    return response.data; // Return the updated task
  } catch (error) {
    console.error('Error assigning task:', error);
    throw error; // Rethrow the error to handle it in the component
  }
};

export const updateTaskStatus = async (taskId, newStatus) => {
  const headers = addTokenToHeader({ headers: {} });
  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_BASE_URL}/api/v1/task/update-status`,
      {
        taskId,
        status: newStatus,
      },
      {
        headers,
      }
    );
    return res.data; // Assuming the backend sends back updated task data
  } catch (error) {
    console.error("Error updating task status:", error);
    throw new Error("Error updating task status: " + error.message);
  }
};
export const getTask = async () => {
  const headers = addTokenToHeader({ headers: {} });
  const res = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/api/v1/task/task-details`,
    {
      headers,
    }
  );
  return res.data;
};

export const deleteTask = async (taskId) => { 
  try {
    const headers = addTokenToHeader({ headers: {} });
    const url = `${import.meta.env.VITE_BASE_URL}/api/v1/task/delete-task/${taskId}`;
    const res = await axios.delete(url, { headers });
    return res.data;
  } catch (error) {
    console.error("Error in deleteTask API call:", error.response || error); // Log the error
    if (error.response) {
      console.error("Error details:", error.response.data); 
      console.error("Error status code:", error.response.status); 
    }
    throw error;
  }
};

export const fetchAssignedTasks = async (userId) => {
  console.log("Fetching tasks for userId:", userId); // Log the userId
  const headers = addTokenToHeader({ headers: {} });
  try {
      const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/task/${userId}`,
          {
              headers,
          }
      );
      const data = res.data;
      if (data.success) {
          return data.tasks;
      } else {
          console.error("Failed to fetch tasks:", data.message);
      }
  } catch (error) {
      console.error("Error fetching tasks:", error);
  }
};

export const getTaskById = async (taskId) => {
  const headers = addTokenToHeader({ headers: {} });
  try {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/task/${taskId}`,
      {
        headers,
    }
    ); 
    return response.data;
  } catch (error) {
    console.error("Error fetching task by ID:", error);
    throw error; // Re-throw error for handling in component
  }
};
