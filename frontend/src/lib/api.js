const BASE_URL = "https://mechanicfind.onrender.com/api";

const API = {

  // AUTH
  login: async (data) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  register: async (data) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // MECHANICS
  getNearbyMechanics: async (location) => {
    const res = await fetch(`${BASE_URL}/mechanics/nearby`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(location),
    });
    return res.json();
  },

  // SERVICE REQUESTS
  createRequest: async (data) => {
    const res = await fetch(`${BASE_URL}/service-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  getUserRequests: async (userId) => {
    const res = await fetch(`${BASE_URL}/service-requests/user/${userId}`);
    return res.json();
  },

  getMechanicRequests: async (mechanicId) => {
  const res = await fetch(
    `${BASE_URL}/service-requests/mechanic/${mechanicId}`
  );
  return res.json();
},


};

export default API;
