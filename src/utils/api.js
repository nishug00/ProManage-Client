// utils/api.js
export const checkUserExists = async (username, email) => {
    console.log('object',username,email)
    try {
      const response = await fetch("/api/check-user", {
        
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        
        body: JSON.stringify({ username, email }),
      });
      console.log('response',response)
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  console.log('data',data)
      const data = await response.json();
      console.log('data.exists',data.exists)
      return data.exists; 
    } catch (error) {
      console.error("Error checking user existence:", error);
      throw error; // You might want to handle errors differently
    }
  };
  