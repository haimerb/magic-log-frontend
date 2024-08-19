import React, { useState, useEffect, useRef } from "react";
import UserService from "../services/user.service";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  TextField,
  Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import Form from "react-validation/build/form";

import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import EventBus from "../common/EventBus";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const required = (value) => {
  if (!value) {
    return (
      <div className="invalid-feedback d-block">
        This field is required!
      </div>
    );
  }
};

const validEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="invalid-feedback d-block">
        This is not a valid email.
      </div>
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
  const [creaProdNotLoging, setCreaProdNotLoging] = useState("");
  const [email, setEmail] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [inCreateProduct, setInCreateProduct] = React.useState(false);

  const navigate = useNavigate();

  const onChangeNameProduct= (e) => {
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
            AuthService.setInCreateProduct();
          }
          navigate("/inventory");
          window.location.reload();
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
      //setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      //setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    //setShowModeratorBoard(false);
    //setShowAdminBoard(false);
    setCurrentUser(undefined);
  };

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
      {console.log(inCreateProduct)}
      {/* Crear producto o presentacion incial inventario*/}
      {(currentUser && inCreateProduct) ? (

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
            display={'flex'}
            flexDirection={'row'}
            flexWrap={'noWrap'}
            justifyContent="left"
            alignItems="left"
            style={{ width: '100%' }}
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
              width={'auto'}
              justifySelf={'center'}
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
                marginBottom={'3rem'}
                justifySelf={'center'}
              >

                <Typography
                  marginTop={'1rem'}
                  variant="h6"
                  onClick={handleClickOpen}
                  component="a"
                  sx={{
                    mr: 1,
                    display: { xs: 'none', md: 'flex' },
                    fontFamily: 'monospace',
                    fontWeight: 400,
                    letterSpacing: '0rem',
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                  style={{ color: '#000 !importan' }}
                >
                  <ArrowBackIcon color="primary" style={{ marginRight: '.2rem', color: '#000' }} />
                  Regresar
                </Typography>
              </Grid>

            </Grid>
          </Grid>
          <Grid
            item
            className="back-content"
            display={'flex'}
            flexDirection={'column'}
            flexWrap={'noWrap'}
            justifyContent="center"
            alignItems="center"
            style={{ width: '100%' }}
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
                justifySelf={'center'}
                marginBottom={'2rem'}
              >
                <Typography
                  marginTop={'2rem'}
                  variant="h5"
                  onClick={handleClickOpen}
                  sx={{
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    fontFamily: 'monospace',
                    fontWeight: 400,
                    color: 'inherit',
                    textDecoration: 'none',
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
                        label="Nombre Producto" variant="outlined"
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
                        label="Descripción" variant="outlined"
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
                        label="Cantidad" variant="outlined"
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
                        // className="form-control"
                        label="Precio" variant="outlined"
                        name="price"
                        value={price}
                        onChange={onChangePrice}
                        validations={[required]}
                      />
                    </Grid>
                  </Grid>
                </Form>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid
          container
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
            xl={12}
            lg={12}
            spacing={2}
            gap={2}
            border={'.1rem solid rgba(0, 2, 2, 0.1)'}
            marginTop={'12%'}
            backgroundColor="hsla(213, 100%, 50%, 0.1)"
            borderRadius={'.23rem'}
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
              xl={8}
              lg={8}
              marginTop={'2rem'}
              spacing={2}
              // width={'60%'}
              height={'12rem'}
              sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}
              marginBottom={'2rem'}
            >

              <Box
                component="img"
                sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}
                width={'70%'}
                height={'70%'}
                src="tenesi-producto001.jpeg"
              >

              </Box>

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

                  <Button size="medium" type="button" variant="outlined" onClick={handleClickOpenPre}>Crear Producto</Button>
                </Grid>

              </Grid>

            </Grid>

          </Grid>

          <Typography
            marginTop={'1rem'}
            variant="h6"
            onClick={handleClickOpen}
            component="a"
            sx={{
              mr: 1,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 400,
              letterSpacing: '0rem',
              color: 'hsla(213, 100%, 1.1%, 0.8)',
              textDecoration: 'none',
            }}
          >
            Inicia sesion para poder ver tu inventario.
          </Typography>


        </Grid>
      )
      }


      {/* Inicio de sesion*/}
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Iniciar sesión</DialogTitle>
        <Divider orientation="horizontal" flexItem />
        <DialogContent>
          <DialogContentText>
          </DialogContentText>

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
                      label="Username" variant="outlined"
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
                      label="Password" variant="outlined"
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
                        <span
                          className="spinner-border spinner-border-sm"
                        ></span>
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
      <Dialog
        open={openCreaAccount}
        onClose={handleCloseCreaAccount}
      >
        <DialogTitle>Iniciar sesión</DialogTitle>
        <Divider orientation="horizontal" flexItem />
        <DialogContent>
          <DialogContentText>
          </DialogContentText>
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
                        label="Username" variant="outlined"
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
                        label="Username" variant="outlined"
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
                        label="Password" variant="outlined"
                        type="password"
                        className="form-control"
                        name="password"
                        value={password}
                        onChange={onChangePassword}
                        validations={[required]}
                      />
                    </div>

                    <div className="form-group">
                      <button className="btn btn-primary btn-block">Sign Up</button>
                    </div>
                  </div>
                )}

                {message && (
                  <div className="form-group">
                    <div
                      className={
                        successful ? "alert alert-success" : "alert alert-danger"
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
      <Dialog
        open={openPre}
        onClose={handleClosePre}
      >
        <DialogTitle>Crea una cuenta</DialogTitle>
        <Divider orientation="horizontal" flexItem />
        <DialogContent justifyContent="center">
          <DialogContentText>
            Registrate o inicia sesióm para mepezar a agregar productos a tu inventario.
          </DialogContentText>
          <Button onClick={handleClickOpenSession}>Iniciar Sesión</Button>
          <Button variant="contained" onClick={handleClickOpenCreaAccount}>Crear cuenta</Button>
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
