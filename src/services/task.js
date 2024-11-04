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

export const getTask = async () => {
  const headers = addTokenToHeader({ headers: {} });
  console.log('headers',headers);
  const res = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/api/v1/task/task-details`,
    {
      headers,
    }
  );
  console.log('res',res);
  console.log('res.data',res.data);
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