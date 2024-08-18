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
  Typography } from "@mui/material";
import {  useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import Form from "react-validation/build/form";

import CheckButton from "react-validation/build/button";


const required = (value) => {
  if (!value) {
    return (
      <div className="invalid-feedback d-block">
        This field is required!
      </div>
    );
  }
};

const Product = () => {
  const form = useRef();
  const checkBtn = useRef();
  const [content, setContent] = useState("");
  const [open, setOpen] = React.useState(false);
  const [openPre, setOpenPre] = React.useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [creaProdNotLoging, setCreaProdNotLoging] = useState("");

  const navigate = useNavigate();

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
          navigate("/profile");
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickOpenSession = () => {
    setOpenPre(false);
    setOpen(true);
  };

  const handleClickOpenPre = () => {
    setOpenPre(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClosePre = () => {
    setOpenPre(false);
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

  return (
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
        container
        display={"flex"}
        flexDirection={"row"}
        direction={"row"}
        justifyItems={"center"}
        justifyContent={"center"}
        alignContent={"center"}
        alignItems={"center"}
        xl={2}
        spacing={2}
        gap={2}
        border={'.1rem solid rgba(0, 2, 2, 0.1)'}
        marginTop={5}
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
          xl={1}
          marginTop={'2rem'}
          spacing={2}
          width={'50%'}
          height={'12rem'}
          sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}
          marginBottom={'2rem'}
        >

          <Box
            component="img"
            sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}
            width={'70%'}
            height={'100%'}
            src="tenesi-producto001.jpeg"
          >

          </Box>

          {/* <h3>{content}</h3> */}

        </Grid>

        <Grid
          item
          display={"flex"}
          flexDirection={"row"}
          direction={"row"}
          justifyItems={"center"}
          justifyContent={"center"}
          alignContent={"center"}
          alignItems={"center"}
        >

          <Typography
            variant="h5"
            noWrap
            component="text"
            href="/"
            xl={1}
          >
            Crea tu propio producto
          </Typography>

          <Button type="button" variant="outlined" onClick={handleClickOpenPre}>Crear Producto</Button>
        </Grid>



        {/* <Paper 
        elevation={5} 
        style={{backgroundColor:'#1976d2', width:'20rem',height:'20rem' }}
      />
        
      <Paper /> */}

        {/* <h3>{content}</h3> */}


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
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        Inicia sesion para poder ver tu inventario.
      </Typography>

      {/* Inicio de sesion*/}
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Iniciar sesión</DialogTitle>
        <Divider orientation="horizontal" flexItem/>
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
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Iniciar sesión</DialogTitle>
        <Divider orientation="horizontal" flexItem/>
        <DialogContent>
          <DialogContentText>
          </DialogContentText>
          
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
        <Divider orientation="horizontal" flexItem/>
        <DialogContent justifyContent="center">
          <DialogContentText>
            Registrate o inicia sesióm para mepezar a agregar productos a tu inventario.
          </DialogContentText>
          
      
          <Button onClick={handleClickOpenSession}>Iniciar Sesión</Button>
          <Button variant="contained" onClick={handleClose}>Crear cuenta</Button>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Subscribe</Button> */}
        </DialogActions>
      </Dialog>
      
    </Grid>
  );
};

export default Product;
