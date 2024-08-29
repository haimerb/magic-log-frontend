import axios from "axios";

//const API_URL = "http://localhost:8080/api/"; //--DEV
//const API_URL = "http://ec2-18-116-0-96.us-east-2.compute.amazonaws.com:8080/api/";
const API_URL = "http://18.116.0.96:8080/api/"; //--PROD

const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const getUserBoard = () => {
  let token = {};
  if (token) {
    token = JSON.parse(localStorage.getItem("user"));
  }
  const headers = {
    "Content-Type": "text/json",
    "x-access-token": token.accessToken
  };

  axios.defaults.headers = headers;
  return axios.get(API_URL + "user", {}
  );
};

const getModeratorBoard = () => {
  return axios.get(API_URL + "mod");
};

const getAdminBoard = () => {
  return axios.get(API_URL + "admin");
};

const getAllProducts = () => {
  let token = {};
  if (token) {
    token = JSON.parse(localStorage.getItem("user"));
  }
  const headers = {
    "Content-Type": "text/json",
    "x-access-token": token.accessToken
  };

  axios.defaults.headers = headers;
  return axios.get(API_URL + "products", {}
  );
}

const setProduct = (nameProduct,descriptionProduct,quantity,price) => {
  let token = {};
  if (token) {
    token = JSON.parse(localStorage.getItem("user"));
  }
  const headers = {
    "Content-Type": "text/json",
    "x-access-token": token.accessToken
  };

  axios.defaults.headers = headers;
  return axios.post(API_URL + "products", {
    nameProduct,
    descriptionProduct,
    quantity,
    price
  });
}




const ProductService = {
  getAllProducts,
  setProduct,
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
}

export default ProductService;
