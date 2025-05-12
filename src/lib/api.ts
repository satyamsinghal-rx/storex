import axios from "axios";

const API_URL = "http://localhost:3000/api";

// export const getDashboardData = async () => {
//     try{
//         const response = await axios.get(`http://localhost:3000/api/dashboard`);
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching dashboard data:", error);
//         throw new Error("Could not fetch dashboard data");
//     }
// }

// lib/api.ts

export const getDashboardData = async (cookieHeader: string) => {
  try {
    const response = await axios.get(`${API_URL}/dashboard`, {
      headers: {
        Cookie: cookieHeader,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw new Error("Could not fetch dashboard data");
  }
};

export const getAssets = async () => {
  try {
    console.log("Fetching from:", `${API_URL}/assets`);

    const response = await axios.get(`${API_URL}/assets`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw new Error("Could not fetch dashboard data");
  }
};
