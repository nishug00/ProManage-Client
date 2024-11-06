import axios from "axios";

export const registerUser = async (data) => {
  console.log('data', data);
  console.log('Base URL:', import.meta.env.VITE_BASE_URL);

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/v1/user/register`,
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error in registerUser:', error);
    throw error; // re-throw error to handle it further up if needed
  }
};


export const fetchRegisteredUsers = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/api/v1/user/registered-users`, // Use GET instead of POST
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res;
};

export const login = async (data) => {

  const res = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/api/v1/user/login`,
    data,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return res;
};

export const fetchUserDetails = async (token) => {
    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/v1/user/user-details`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
};

export const updateUser = async (userData) => {
  const { userid } = userData;
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const response = await axios.put(
      `${import.meta.env.VITE_BASE_URL}/api/v1/user/update-details/${userid}`,
      userData,
      config
    );
    return response.data;
};
