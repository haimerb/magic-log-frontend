import React, { useState, useEffect, useRef } from "react";
import UserService from "../services/user.service";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  TextField,
  Typography,
  IconButton
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import EventBus from "../common/EventBus";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LastPageIcon from "@mui/icons-material/LastPage";
import { useTheme } from "@mui/material/styles";
import { KeyboardArrowRight } from "@mui/icons-material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import ProductService from "../services/product.service";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Nombre", width: 130 },

  { field: "sku", headerName: "SKU", width: 130 },
  { field: "price", headerName: "Precio", width: 130 },
  { field: "quantity", headerName: "Cantidad", width: 130 },
  { field: "description", headerName: "Descripción", width: 130 },
  { field: "urlimage", headerName: "URL", width: 130 },

  //{ field: 'firstName', headerName: 'First name', width: 130 },
  //{ field: 'lastName', headerName: 'Last name', width: 130 },
  // {
  //   field: 'age',
  //   headerName: 'Age',
  //   type: 'number',
  //   width: 90,
  // },
  // {
  //   field: 'fullName',
  //   headerName: 'Full name',
  //   description: 'This column has a value getter and is not sortable.',
  //   sortable: false,
  //   width: 160,
  //   valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  // },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

const required = (value) => {
  if (!value) {
    return (
      <div className="invalid-feedback d-block">This field is required!</div>
    );
  }
};

const validEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="invalid-feedback d-block">This is not a valid email.</div>
    );
  }
};

const vusername = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="invalid-feedback d-block">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};

const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="invalid-feedback d-block">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const Inventary = () => {
  const form = useRef();
  const checkBtn = useRef();
  const [content, setContent] = useState("");
  const [open, setOpen] = React.useState(false);
  const [openCreaAccount, setOpenCreaAccount] = React.useState(false);
  const [openPre, setOpenPre] = React.useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [nameProduct, setNameProduct] = useState("");
  const [descriptionProduct, setDescriptionProduct] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [email, setEmail] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [inCreateProduct, setInCreateProduct] = React.useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [back, setBack] = useState(false);

  const [products, setProducts] = useState(undefined);

  const navigate = useNavigate();

  const onChangeNameProduct = (e) => {
    const nameProduct = e.target.value;
    setNameProduct(nameProduct);
  };

  const onChangeDescriptionProduct = (e) => {
    const descriptionProduct = e.target.value;
    setDescriptionProduct(descriptionProduct);
  };

  const onChangeQuantity = (e) => {
    const quantity = e.target.value;
    setQuantity(quantity);
  };

  const onChangePrice = (e) => {
    const price = e.target.value;
    setPrice(price);
  };

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.login(username, password).then(
        () => {
          //navigate("/profile");
          //setInCreateProduct(true);
          console.log("Login inCreateProduct", inCreateProduct);
          if (inCreateProduct === true) {
            AuthService.setInCreateProduct(true);
          } else {
            setInCreateProduct(true);
            AuthService.setInCreateProduct(true);
          }
          navigate("/inventory");
          //window.location.reload();
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setLoading(false);
          setMessage(resMessage);
        }
      );
    } else {
      setLoading(false);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();

    setMessage("");
    setSuccessful(false);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.register(username, email, password).then(
        (response) => {
          setMessage(response.data.message);
          setSuccessful(true);
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setMessage(resMessage);
          setSuccessful(false);
        }
      );
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickBack = () => {
    setBack(true);
    setInCreateProduct(false);
    AuthService.setInCreateProduct(false);
  };

  const handleClickOpenCreaAccount = () => {
    setOpenPre(false);
    setOpenCreaAccount(true);
  };

  const handleClickOpenSession = () => {
    setInCreateProduct(true);
    setOpenPre(false);
    setOpen(true);
  };

  const handleClickOpenPre = () => {
    setOpenPre(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseCreaAccount = () => {
    setOpenCreaAccount(false);
  };

  const handleClosePre = () => {
    setOpenPre(false);
  };

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  useEffect(() => {
    setInCreateProduct(AuthService.getInCreateProduct() || false);
    UserService.getPublicContent().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setContent(_content);
      }
    );
  }, []);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    console.log(AuthService.getInCreateProduct(), "useEffect");
    setInCreateProduct(AuthService.getInCreateProduct() || false);

    if (user) {
      setCurrentUser(user);
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
      console.log("ADMIN", showAdminBoard);
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, [showAdminBoard]);

  const logOut = () => {
    AuthService.logout();
    //setShowModeratorBoard(false);
    setShowAdminBoard(false);
    setCurrentUser(undefined);
  };

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
      console.log(showAdminBoard, "admin");
      if (
        //currentUser&&
        showAdminBoard
      ) {
        ProductService.getAllProducts().then(
          (response) => {
            console.log("Products: ", response?.data);
            //setContent(response.data);
            setProducts(response.data);
          },
          (error) => {
            const _content =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();

            setContent(_content);

            if (error.response && error.response.status === 401) {
              EventBus.dispatch("logout");
            }
          }
        );
      }
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, [showAdminBoard]);

  return (
    <Grid
      container
      display={"flex"}
      flexDirection={"row"}
      direction={"row"}
      justifyItems={"center"}
      justifyContent={"center"}
      alignContent={"center"}
      alignItems={"center"}
    >
      {/* {console.log(inCreateProduct)} */}

      {/* Crear producto o presentacion incial inventario*/}
      {currentUser && inCreateProduct ? (
        <Grid
          container
          display={"flex"}
          flexDirection={"row"}
          direction={"row"}
          justifyItems={"center"}
          justifyContent={"center"}
          alignContent={"center"}
          alignItems={"center"}
        >
          <Grid
            className="back"
            display={"flex"}
            flexDirection={"row"}
            flexWrap={"noWrap"}
            justifyContent="left"
            alignItems="left"
            style={{ width: "100%" }}
            item
          >
            <Grid
              container
              display={"flex"}
              flexDirection={"row"}
              direction={"row"}
              justifyItems={"center"}
              justifyContent={"center"}
              alignContent={"center"}
              alignItems={"center"}
              width={"auto"}
              justifySelf={"center"}
            >
              <Grid
                item
                display={"flex"}
                flexDirection={"row"}
                direction={"row"}
                justifyItems={"center"}
                justifyContent={"center"}
                alignContent={"center"}
                alignItems={"left"}
                marginBottom={"3rem"}
                justifySelf={"center"}
              >
                <Typography
                  marginTop={"1rem"}
                  variant="h6"
                  onClick={handleClickBack}
                  component="a"
                  sx={{
                    mr: 1,
                    display: { xs: "none", md: "flex" },
                    fontFamily: "monospace",
                    fontWeight: 400,
                    letterSpacing: "0rem",
                    color: "inherit",
                    textDecoration: "none",
                  }}
                  style={{ color: "#000 !importan" }}
                >
                  <ArrowBackIcon
                    color="primary"
                    style={{ marginRight: ".2rem", color: "#000" }}
                  />
                  Regresar
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            className="back-content"
            display={"flex"}
            flexDirection={"column"}
            flexWrap={"noWrap"}
            justifyContent="center"
            alignItems="center"
            style={{ width: "100%" }}
          >
            <Grid
              container
              display={"flex"}
              flexDirection={"column"}
              direction={"column"}
              justifyItems={"center"}
              justifyContent={"center"}
              alignContent={"center"}
              alignItems={"center"}
            >
              <Grid
                item
                display={"flex"}
                flexDirection={"column"}
                direction={"column"}
                justifyItems={"center"}
                justifyContent={"center"}
                alignContent={"center"}
                alignItems={"center"}
                justifySelf={"center"}
                marginBottom={"2rem"}
              >
                <Typography
                  marginTop={"2rem"}
                  variant="h5"
                  onClick={handleClickOpen}
                  sx={{
                    mr: 2,
                    display: { xs: "none", md: "flex" },
                    fontFamily: "monospace",
                    fontWeight: 400,
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  Crear Producto
                </Typography>
              </Grid>
              <Grid
                item
                display={"flex"}
                flexDirection={"column"}
                direction={"column"}
                justifyItems={"center"}
                justifyContent={"center"}
                alignContent={"center"}
                alignItems={"center"}
              >
                <Form onSubmit={handleLogin} ref={form}>
                  <Grid
                    container
                    display={"flex"}
                    flexDirection={"column"}
                    direction={"column"}
                    justifyItems={"center"}
                    justifyContent={"center"}
                    alignContent={"center"}
                    alignItems={"center"}
                    spacing={2}
                  >
                    <Grid
                      item
                      display={"flex"}
                      flexDirection={"column"}
                      direction={"column"}
                      justifyItems={"center"}
                      justifyContent={"center"}
                      alignContent={"center"}
                      alignItems={"center"}
                    >
                      <TextField
                        component="item"
                        type="text"
                        id="outlined-basic"
                        // className="form-control"
                        label="Nombre Producto"
                        variant="outlined"
                        name="nameProduct"
                        value={nameProduct}
                        onChange={onChangeNameProduct}
                        validations={[required]}
                      />
                    </Grid>
                    <Grid
                      item
                      display={"flex"}
                      flexDirection={"column"}
                      direction={"column"}
                      justifyItems={"center"}
                      justifyContent={"center"}
                      alignContent={"center"}
                      alignItems={"center"}
                    >
                      <TextField
                        component="item"
                        type="text"
                        id="outlined-basic"
                        // className="form-control"
                        label="Descripción"
                        variant="outlined"
                        name="descriptionProduct"
                        value={descriptionProduct}
                        onChange={onChangeDescriptionProduct}
                        validations={[required]}
                      />
                    </Grid>

                    <Grid
                      item
                      display={"flex"}
                      flexDirection={"column"}
                      direction={"column"}
                      justifyItems={"center"}
                      justifyContent={"center"}
                      alignContent={"center"}
                      alignItems={"center"}
                    >
                      <TextField
                        component="item"
                        type="number"
                        id="outlined-basic"
                        label="Cantidad"
                        variant="outlined"
                        name="quantity"
                        value={quantity}
                        onChange={onChangeQuantity}
                        validations={[required]}
                      />
                    </Grid>
                    <Grid
                      item
                      display={"flex"}
                      flexDirection={"column"}
                      direction={"column"}
                      justifyItems={"center"}
                      justifyContent={"center"}
                      alignContent={"center"}
                      alignItems={"center"}
                    >
                      <TextField
                        component="item"
                        type="number"
                        id="outlined-basic"
                        label="Precio"
                        variant="outlined"
                        name="price"
                        value={price}
                        onChange={onChangePrice}
                        validations={[required]}
                      />
                    </Grid>
                    <Grid
                      item
                      direction={"column"}
                    // justifyItems={"left"}
                    // justifyContent={"left"}
                    // alignContent={"left"}
                    // alignItems={"left"}
                    >
                      <Chip label="Clickable" onClick={""} />
                    </Grid>

                    <Grid
                      item
                      direction={"column"}
                      justifyItems={"left"}
                      justifyContent={"left"}
                      alignContent={"left"}
                      alignItems={"left"}
                    >
                      <Button type="submit" variant="contained">
                        Crear
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid container>
          {(() => {
            if (showAdminBoard) {
              //return (<BoardAdmin></BoardAdmin>);;
              return (
                <Grid
                  className="container-inventory-in"
                  container
                  display={"flex"}
                  flexDirection={"row"}
                  direction={"row"}
                  justifyItems={"center"}
                  alignContent={"center"}
                  justifyContent="center"
                  alignItems={"center"}
                  spacing={1}
                  gap={2}
                  marginTop={"0.3rem"}
                  width={"75%"}
                >
                  <Grid
                    className="btn-create"
                    display={"flex"}
                    flexDirection={"row"}
                    flexWrap={"noWrap"}
                    justifyContent="right"
                    alignItems={"right"}
                    style={{ width: "100%" }}
                    item
                  >
                    <Grid
                      container
                      display={"flex"}
                      flexDirection={"row"}
                      direction={"row"}
                      justifyItems={"center"}
                      justifyContent={"center"}
                      alignContent={"center"}
                      alignItems={"right"}
                      width={"auto"}
                      justifySelf={"center"}
                    >
                      <Grid
                        item
                        display={"flex"}
                      // flexDirection={"row"}
                      // direction={"row"}
                      // justifyItems={"center"}
                      // justifyContent={"center"}
                      // alignContent={"center"}
                      // alignItems={"right"}
                      // marginBottom={'.2rem'}
                      // justifySelf={'center'}
                      >
                        <Button variant="contained"> Crear </Button>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid color={"inherit"} item width={"100%"}>
                    <Divider orientation="horizontal" flexItem />
                  </Grid>

                  <Grid
                    color={"inherit"}
                    item
                    width={"100%"}
                    marginTop={".2rem"}
                  >

                    <DataGrid
                      rows={products}
                      columns={columns}
                      initialState={{
                        pagination: {
                          paginationModel: { page: 0, pageSize: 5 },
                        },
                      }}
                      pageSizeOptions={[5, 10]}
                      checkboxSelection
                    />
                  </Grid>
                </Grid>
              );
            }
          })()}

          {(() => {
            if (!showAdminBoard) {
              return (
                <Grid
                  container
                  className="container-ini-inventory"
                  display={"flex"}
                  flexDirection={"row"}
                  direction={"row"}
                  justifyItems={"center"}
                  justifyContent={"center"}
                  alignContent={"center"}
                  alignItems={"center"}
                  xl={12}
                  lg={12}
                  spacing={2}
                  gap={2}
                  border={".1rem solid rgba(0, 2, 2, 0.1)"}
                  marginTop={"12%"}
                  backgroundColor="hsla(213, 100%, 50%, 0.1)"
                  borderRadius={".23rem"}
                >
                  <Grid
                    item
                    display={"flex"}
                    flexDirection={"row"}
                    direction={"row"}
                    justifyItems={"center"}
                    justifyContent={"center"}
                    alignContent={"center"}
                    alignItems={"center"}
                    xl={7}
                    lg={7}
                    marginTop={"2rem"}
                    spacing={2}
                    // width={'60%'}
                    height={"12rem"}
                    sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
                    marginBottom={"2rem"}
                  >
                    <Box
                      component="img"
                      sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
                      width={"70%"}
                      height={"70%"}
                      src="tenesi-producto001.jpeg"
                    ></Box>

                    {/* <h3>{content}</h3> */}
                  </Grid>

                  <Grid
                    item
                    lx={4}
                    lg={4}
                    display={"flex"}
                    flexDirection={"row"}
                    direction={"row"}
                    justifyItems={"center"}
                    justifyContent={"center"}
                    alignContent={"center"}
                    alignItems={"center"}
                  >
                    <Grid
                      container
                      display={"flex"}
                      flexDirection={"row"}
                      direction={"row"}
                      justifyItems={"center"}
                      justifyContent={"center"}
                      alignContent={"center"}
                      alignItems={"center"}
                    >
                      <Grid item>
                        <Typography
                          variant="h6"
                          noWrap
                          component="text"
                          href="/"
                        >
                          Crea tu propio producto
                        </Typography>
                      </Grid>

                      <Grid item>
                        <Grid
                          item
                          // lx={4}
                          // lg={4}
                          display={"flex"}
                          flexDirection={"row"}
                          direction={"row"}
                          justifyItems={"center"}
                          justifyContent={"center"}
                          alignContent={"center"}
                          alignItems={"center"}
                        >
                          <Grid item>
                            <Typography
                              type="a"
                              variant="h7"
                              noWrap
                              component="text"
                              href="/"
                              sx={{
                                mr: 1,
                                display: { xs: "none", md: "flex" },
                                fontFamily: "monospace",
                                fontWeight: 400,
                                letterSpacing: "0rem",
                                color: "inherit",
                                textDecoration: "none",
                              }}
                            >
                              Conoce mas
                            </Typography>
                          </Grid>

                          <Grid item>
                            <Button
                              size="small"
                              type="button"
                              variant="outlined"
                              onClick={handleClickOpenPre}
                            >
                              Crear Producto
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              );
            }
          })()}

          {(() => {
            if (!showAdminBoard) {
              return (
                <Typography
                  marginTop={"1rem"}
                  variant="h6"
                  onClick={handleClickOpen}
                  component="a"
                  sx={{
                    mr: 1,
                    display: { xs: "none", md: "flex" },
                    fontFamily: "monospace",
                    fontWeight: 400,
                    letterSpacing: "0rem",
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  Inicia sesion para poder ver tu inventario.
                </Typography>
              );
            }
          })()}
        </Grid>
      )}

      {/* Inicio de sesion*/}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Iniciar sesión</DialogTitle>
        <Divider orientation="horizontal" flexItem />
        <DialogContent>
          <DialogContentText></DialogContentText>

          <Grid
            item
            className="card card-container"
            elevation={5}
            justifyItems={"center"}
            justifyContent={"center"}
            alignContent={"center"}
            alignItems={"center"}
            style={{ marginTop: "8rem" }}
            flexDirection={"row"}
          >
            <Grid
              container
              spacing={4}
              display={"flex"}
              flexDirection={"row"}
              direction={"row"}
              justifyItems={"center"}
              justifyContent={"center"}
              alignContent={"center"}
              alignItems={"center"}
            >
              <Grid
                item
                justifyItems={"center"}
                justifyContent={"center"}
                alignContent={"center"}
                alignItems={"center"}
                flexDirection={"row"}
              >
                <img
                  src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                  alt="profile-img"
                  className="profile-img-card"
                />
              </Grid>

              <Grid
                container
                justifyItems={"center"}
                justifyContent={"center"}
                alignContent={"center"}
                alignItems={"center"}
                flexDirection={"row"}
                direction={"row"}
              >
                <Form onSubmit={handleLogin} ref={form}>
                  <Grid
                    item
                    justifyItems={"center"}
                    justifyContent={"center"}
                    alignContent={"center"}
                    alignItems={"center"}
                    flexDirection={"row"}
                  >
                    <TextField
                      type="text"
                      id="outlined-basic"
                      className="form-control"
                      label="Username"
                      variant="outlined"
                      name="username"
                      value={username}
                      onChange={onChangeUsername}
                      validations={[required]}
                    />
                  </Grid>

                  <Grid
                    item
                    justifyItems={"center"}
                    justifyContent={"center"}
                    alignContent={"center"}
                    alignItems={"center"}
                    flexDirection={"row"}
                  >
                    <TextField
                      id="outlined-basic"
                      label="Password"
                      variant="outlined"
                      type="password"
                      className="form-control"
                      name="password"
                      value={password}
                      onChange={onChangePassword}
                      validations={[required]}
                    />
                  </Grid>

                  <Grid
                    item
                    justifyItems={"center"}
                    justifyContent={"center"}
                    alignContent={"center"}
                    alignItems={"center"}
                    flexDirection={"row"}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                    >
                      {loading && (
                        <span className="spinner-border spinner-border-sm"></span>
                      )}
                      {/* <span>Login</span> */}
                      Login
                    </Button>
                  </Grid>

                  {message && (
                    <div className="form-group">
                      <div className="alert alert-danger" role="alert">
                        {message}
                      </div>
                    </div>
                  )}
                  <CheckButton style={{ display: "none" }} ref={checkBtn} />
                </Form>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          {/* <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Subscribe</Button> */}
        </DialogActions>
      </Dialog>

      {/* Crear Cuenta*/}
      <Dialog open={openCreaAccount} onClose={handleCloseCreaAccount}>
        <DialogTitle>Iniciar sesión</DialogTitle>
        <Divider orientation="horizontal" flexItem />
        <DialogContent>
          <DialogContentText></DialogContentText>
          <div className="col-md-12">
            <div className="card card-container">
              <img
                src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                alt="profile-img"
                className="profile-img-card"
              />

              <Form onSubmit={handleRegister} ref={form}>
                {!successful && (
                  <div>
                    <div className="form-group">
                      <label htmlFor="username">Username</label>
                      {/* <Input
                  type="text"
                  className="form-control"
                  name="username"
                  value={username}
                  onChange={onChangeUsername}
                  validations={[required, vusername]}

                /> */}

                      <TextField
                        type="text"
                        id="outlined-basic"
                        className="form-control"
                        label="Username"
                        variant="outlined"
                        name="username"
                        value={username}
                        onChange={onChangeUsername}
                        validations={[required]}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      {/* <Input
                  type="text"
                  className="form-control"
                  name="email"
                  value={email}
                  onChange={onChangeEmail}
                  validations={[required, validEmail]}
                /> */}

                      <TextField
                        type="text"
                        id="outlined-basic"
                        className="form-control"
                        label="Username"
                        variant="outlined"
                        name="email"
                        value={email}
                        onChange={onChangeEmail}
                        validations={[required]}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      {/* <Input
                  type="password"
                  className="form-control"
                  name="password"
                  value={password}
                  onChange={onChangePassword}
                  validations={[required, vpassword]}
                /> */}
                      <TextField
                        id="outlined-basic"
                        label="Password"
                        variant="outlined"
                        type="password"
                        className="form-control"
                        name="password"
                        value={password}
                        onChange={onChangePassword}
                        validations={[required]}
                      />
                    </div>

                    <div className="form-group">
                      <button className="btn btn-primary btn-block">
                        Sign Up
                      </button>
                    </div>
                  </div>
                )}

                {message && (
                  <div className="form-group">
                    <div
                      className={
                        successful
                          ? "alert alert-success"
                          : "alert alert-danger"
                      }
                      role="alert"
                    >
                      {message}
                    </div>
                  </div>
                )}
                <CheckButton style={{ display: "none" }} ref={checkBtn} />
              </Form>
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          {/* <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Subscribe</Button> */}
        </DialogActions>
      </Dialog>

      {/* Modal Previo al inicio de sesion o creacion de cuenta*/}
      <Dialog open={openPre} onClose={handleClosePre}>
        <DialogTitle>Crea una cuenta</DialogTitle>
        <Divider orientation="horizontal" flexItem />
        <DialogContent justifyContent="center">
          <DialogContentText>
            Registrate o inicia sesióm para mepezar a agregar productos a tu
            inventario.
          </DialogContentText>
          <Button onClick={handleClickOpenSession}>Iniciar Sesión</Button>
          <Button variant="contained" onClick={handleClickOpenCreaAccount}>
            Crear cuenta
          </Button>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Subscribe</Button> */}
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Inventary;
