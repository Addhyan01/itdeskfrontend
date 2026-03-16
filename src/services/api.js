const API_BASE = "http://localhost:8000/api"
const token = localStorage.getItem("token");

export const analyzeIssue = async (description) => {

const res = await fetch(`${API_BASE}/ai/analyze`, {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({ description })
})

return res.json()

}

export const createTicket = async (formData) => {

const res = await fetch(`${API_BASE}/tickets/create`, {
method: "POST",
body: formData
})

return res.json()

}


export const signUp = async (data) => {

 const res = await fetch(`${API_BASE}/auth/signup`, {
  method: "POST",
  headers: {
   "Content-Type": "application/json"
  },
  body: JSON.stringify(data)
 })

 return res.json()

}


export const loginUser = async (data) => {

 const res = await fetch(`${API_BASE}/auth/login`, {
  method: "POST",
  headers: {
   "Content-Type": "application/json"
  },
  body: JSON.stringify(data)
 })

 return res.json()

}



export const fetchUserProfile = async () => {
  try {

     // login ke time save hua hoga

    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();


    return data;

  } catch (error) {
    console.log("Profile fetch error", error);
  }
};




export const updateProfile = async (formData) => {

  const res = await fetch(`${API_BASE}/auth/update-profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  return res.json();
};