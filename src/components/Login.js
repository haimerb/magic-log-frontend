import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import AuthService from "../services/auth.service";
import { Button, Card, Grid, TextField  } from "@mui/material";


const required = (value) => {
  if (!value) {
    return (
      <div className="invalid-feedback d-block">
        This field is required!
      </div>
    );
  }
};

const Login = () => {
  const form = useRef();
  const checkBtn = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

  return (
  
  
  <Grid 
        container 
        spacing={2}
        display={"flex"}
        flexDirection={"row"}
        direction={"row"}
        className="card card-container"
        elevation={5}
        justifyItems={"center"}
        justifyContent={"center"}
        alignContent={"center"}
        alignItems={"center"}
        style={{marginTop:"8rem"}}
        >

    {/* <div className="col-md-12"> */}
      {/* <div className="card card-container"> */}
      
      

      <Grid 
      item
      className="card card-container"
      elevation={5}
      justifyItems={"center"}
      justifyContent={"center"}
      alignContent={"center"}
      alignItems={"center"}
      style={{marginTop:"8rem"}}    
      flexDirection={"row"}      
      >

      <Grid 
        container 
        // maxWidth="xl"
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
            // className="form-group"
            >
              {/* <label htmlFor="username">Username</label>
              <Input
                type="text"
                className="form-control"
                name="username"
                value={username}
                onChange={onChangeUsername}
                validations={[required]}
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
            </Grid>


            <Grid 
              item 
              justifyItems={"center"}
              justifyContent={"center"}
              alignContent={"center"}
              alignItems={"center"}
              flexDirection={"row"}  
            // className="form-group"
            >
              

              {/* <div className="form-group"> */}
              {/* <label htmlFor="password">Password</label>
              <Input
                type="password"
                className="form-control"
                name="password"
                value={password}
                onChange={onChangePassword}
                validations={[required]}
              /> */}

  |            <TextField 
                  id="outlined-basic" 
                  label="Password" variant="outlined" 
                  type="password"
                  className="form-control"
                        name="password"
                        value={password}
                        onChange={onChangePassword}
                        validations={[required]}
                />

              {/* </div> */}
            </Grid>

            {/* <div className="form-group"> */}
              {/* <label htmlFor="password">Password</label>
              <Input
                type="password"
                className="form-control"
                name="password"
                value={password}
                onChange={onChangePassword}
                validations={[required]}
              /> */}

  {/* |            <TextField 
                  id="outlined-basic" 
                  label="Password" variant="outlined" 
                  type="password"
                  className="form-control"
                        name="password"
                        value={password}
                        onChange={onChangePassword}
                        validations={[required]}
                /> */}

            {/* </div> */}


            <Grid 
              item 
              justifyItems={"center"}
              justifyContent={"center"}
              alignContent={"center"}
              alignItems={"center"}
              flexDirection={"row"}  
            // className="form-group"
            >


              <Button 
              type="submit"
              variant="contained"
              // className="btn btn-primary btn-block" 
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

            {/* <div className="form-group">
              <button className="btn btn-primary btn-block" disabled={loading}>
                {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Login</span>
              </button>
            </div> */}

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
          {/* </div> */}
        {/* </div> */}


    </Grid>
  );
};

export default Login;
