import axios from "axios";

const API_URL = "http://localhost:8080/api/";

const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const getUserBoard = () => {
  let token ={};
  if(token){
    token =JSON.parse(localStorage.getItem("user"));    
  }
  const headers = {
    "Content-Type": "text/json",
    "x-access-token":token.accessToken
};

  axios.defaults.headers=headers;
  return axios.get(API_URL + "user"  ,{} 
);
};

const getModeratorBoard = () => {
  return axios.get(API_URL + "mod");
};

const getAdminBoard = () => {
  return axios.get(API_URL + "admin");
};

const UserService = {
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
}

export default UserService;
