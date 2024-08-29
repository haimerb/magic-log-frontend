import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/"; //--DEV
//const API_URL = "http://ec2-18-116-0-96.us-east-2.compute.amazonaws.com:8080/api/auth/";
//const API_URL = "http://18.116.0.96:8080/api/auth/"; //--PROD

const register = (username, email, password) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
  });
};

const login = (username, password) => {
  return axios
    .post(API_URL + "signin", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.username) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  // localStorage.removeItem("user");
  localStorage.clear();
  // return axios.post(API_URL + "signout").then((response) => {
  //   return response.data;
  // });
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const getInCreateProduct = () => {
  return JSON.parse(localStorage.getItem("inCreateProduct"));
};

const setInCreateProduct = (val) => {
  localStorage.setItem("inCreateProduct", JSON.stringify(val));
};

const AuthService = {
  getInCreateProduct,
  setInCreateProduct,
  register,
  login,
  logout,
  getCurrentUser,
}

export default AuthService;
