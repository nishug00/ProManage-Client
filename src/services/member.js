import axios from "axios";
import { addTokenToHeader } from "../helper/index";

export const addMemberToBoard = async (data) => {
  const headers = addTokenToHeader({ headers: {} }); // Ensure this function adds the Bearer token
  const res = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/api/v1/board/add-people`,
    data,
    {
      headers,
    }
  );
  return res.data;
};

export async function getAllMember() {
  const headers = addTokenToHeader({ headers: {} });
  const res = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/api/v1/board/add-people`,
    {
      headers,
    }
  );
  if (res.status === 401) {
    localStorage.removeItem("token");
    alert("You're logged out");
    window.location.href = "/login";
  }
  return res;
}
