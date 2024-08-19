import React, { useState, useEffect } from "react";
import {
  Routes, Route
} from "react-router-dom";
import "./App.css";
import AuthService from "./services/auth.service";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import BoardUser from "./components/BoardUser";
import BoardModerator from "./components/BoardModerator";
import BoardAdmin from "./components/BoardAdmin";
// import AuthVerify from "./common/AuthVerify";
import EventBus from "./common/EventBus";
import { Divider, Grid, } from "@mui/material";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Inventary from "./components/Inventary";

const App = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);
  const pages = ['Products', 'Pricing', 'Blog'];
  const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  useEffect(() => {
    const user = AuthService.getCurrentUser();


    if (user) {
      setCurrentUser(user);
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
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
    setShowModeratorBoard(false);
    setShowAdminBoard(false);
    setCurrentUser(undefined);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

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

      {/* <Grid
          className="left-menu" 
          display={"flex"}
          flexDirection={"column"}
          direction={"column"}
          justifyItems={"center"}
          justifyContent={"center"}
          alignContent={"center"}
          alignItems={"center"}
          container
          >
            
          
          <Grid
            display={"flex"}
            flexDirection={"column"}
            direction={"column"}
            justifyItems={"center"}
            justifyContent={"center"}
            alignContent={"center"}
            alignItems={"center"} 
            item
            >
              <Menu
              id="menu-left"
              // anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
               open={Boolean(anchorElNav)}
               onClose={handleCloseNavMenu}
              // sx={{
              //   display: { xs: 'block', md: 'none' },
              // }}
            >

            <MenuItem 
              component="a"
              href="/home"
              key="home"
              //onClick={handleClose}
            >
              Home
              </MenuItem>
              
              <MenuItem 
              component="a"
              href="/home"
              key="home"
              //onClick={handleClose}
            >
              Shop
              </MenuItem>


            </Menu>
          </Grid>

          <Grid>

          </Grid>


        </Grid>     */}

      <AppBar position="static">

        <Container 
          maxWidth="lg">

          <Toolbar 
           disableGutters>
            {/* <AdbIcon 
           src="ml-logo.png" 
          sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
            {/* <Link to={"/"} className="navbar-brand">  */}
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 6,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              {/* Magic Log */}
              <Box
                component="img"
                sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}
                width={'12rem'}
                src="ml-logo.png"
              >

              </Box>
              MarketPlace
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                // anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >

                <MenuItem
                  component="a"
                  href="/home"
                  key="home"
                //onClick={handleClose}
                >
                  Home
                </MenuItem>
                {/* {pages.map((page) => (
                <MenuItem key={page} 
                // onClick={handleCloseNavMenu}
                >
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))} */}



              </Menu>
            </Box>


            {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.2rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              <Box
                component="img"
                sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}
                width={'5rem'}
                src="ml-logo.png"
              >

              </Box>
              MarketPlace
            </Typography>

            <Box className="menu-sx-in-appbar-toolbar" sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button
                component="a"
                href="/home"
                key="home"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Home
              </Button>

              <Button
                component="a"
                href="/home"
                key="home"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Shop
              </Button>

              {showModeratorBoard && (
                <Button
                  component="a"
                  href="/mod"
                  key="mod"
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Inspector Board
                </Button>
              )}

              {showAdminBoard && (
                <Button
                  component="a"
                  href="/admin"
                  key="admin"
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Admin Board
                </Button>
              )}

              {currentUser && (
                <Button
                  component="a"
                  href="/user"
                  key="user"
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  User
                </Button>
              )}


              {currentUser ? (
                <Grid container
                  display={"flex"}
                  flexDirection={"row"}
                  direction={"row"}
                  justifyItems={"center"}
                  justifyContent={"center"}
                  orientation="row"
                  alignContent={"end"}
                  alignItems={"end"}
                >


                  <Grid item display={"flex"}
                    justifyItems={"center"}
                    justifyContent={"center"}
                    alignContent={"end"}
                    alignItems={"end"}>

                    <Button
                      component="a"
                      href="/profile"
                      key="profile"
                      sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                      {currentUser.username}
                    </Button>

                    <Button
                      component="a"
                      href="/login"
                      key="login"
                      sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                      LogOut
                    </Button>
                  </Grid>

                </Grid>
              ) : (

                <Grid container
                  isplay={"flex"}
                  flexDirection={"row"}
                  direction={"row"}
                  justifyItems={"center"}
                  justifyContent={"center"}
                  orientation="row"
                  alignContent={"end"}
                  alignItems={"end"}

                >
                  <Button
                    component="a"
                    href="/login"
                    key="login"
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    Login
                  </Button>

                  <Button
                    component="a"
                    href="/register"
                    key="register"
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    Sign Up
                  </Button>

                </Grid>
              )}

            </Box>


            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting}
                    onClick={handleCloseUserMenu}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

          </Toolbar>



        </Container>

      </AppBar>

      <Grid
        maxWidth="xl"
        container
        display={"flex"}
        flexDirection={"column"}
        direction={"column"}
        justifyItems={"center"}
        justifyContent={"center"}
        alignContent={"center"}
        alignItems={"center"}
        className="menu-left"
        sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}
        gap={2}
        xl={10}
      >

        <Grid
          container
          display={"flex"}
          flexDirection={"row"}
          direction={"row"}
          justifyItems={"center"}
          justifyContent={"left"}
          alignContent={"center"}
          alignItems={"center"}
          xl={10}
          style={{ width: '100%' }}
        >
          <Grid
            item
            xl={1}
            style={{ width: '15%', marginLeft: '2rem' }}
          >

            <Button
              component="a"
              href="/home"
              key="home"
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Home
            </Button>

            <Button
              component="a"
              href="/home"
              key="home"
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Shop
            </Button>

            {showModeratorBoard && (
              <Button
                component="a"
                href="/mod"
                key="mod"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Inspector Board
              </Button>
            )}

            {showAdminBoard && (
              <Button
                component="a"
                href="/admin"
                key="admin"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Admin Board
              </Button>
            )}

            {currentUser && (
              <Button
                component="a"
                href="/user"
                key="user"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                User
              </Button>
            )}


            {currentUser ? (
              <Grid container
                display={"flex"}
                flexDirection={"row"}
                direction={"row"}
                justifyItems={"center"}
                justifyContent={"center"}
                orientation="row"
                alignContent={"end"}
                alignItems={"end"}
              >


                <Grid item display={"flex"}
                  justifyItems={"center"}
                  justifyContent={"center"}
                  alignContent={"end"}
                  alignItems={"end"}>

                  {/* <Button
                    component="a"
                    href="/profile"
                    key="profile"
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    {currentUser.username}
                  </Button> */}

                  {/* <Button
                    component="a"
                    href="/login"
                    key="login"
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    LogOut
                  </Button> */}

                  <Button
                    component="a"
                    href="/inventary"
                    key="inventary"
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    Invetary
                  </Button>
                </Grid>

              </Grid>
            ) : (

              // <Grid container
              //   isplay={"flex"}
              //   flexDirection={"row"}
              //   direction={"row"}
              //   justifyItems={"center"}
              //   justifyContent={"center"}
              //   orientation="row"
              //   alignContent={"end"}
              //   alignItems={"end"}

              // >
              //   <Button
              //     component="a"
              //     href="/login"
              //     key="login"
              //     sx={{ my: 2, color: 'white', display: 'block' }}
              //   >
              //     Login
              //   </Button>

              //   <Button
              //     component="a"
              //     href="/register"
              //     key="register"
              //     sx={{ my: 2, color: 'white', display: 'block' }}
              //   >
              //     Sign Up
              //   </Button>

              // </Grid>

              <Button
                component="a"
                href="/inventary"
                key="inventary"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Invetary
              </Button>

            )}



          </Grid>
          <Divider
            orientation="vertical"
            flexItem
            style={{ marginLeft: '.4rem', marginRight: '.4rem' }}
            xl={1}
          />
          <Grid
            xl={8}
            item
            style={{ width: '70%', marginLeft: '2rem' }}
          >
            <Routes>
              <Route exact path={"/"} element={<Home />} />
              <Route exact path={"/home"} element={<Home />} />
              <Route exact path={"/inventary"} element={<Inventary />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/register" element={<Register />} />
              <Route exact path="/profile" element={<Profile />} />
              <Route path="/user" element={<BoardUser />} />
              <Route path="/mod" element={<BoardModerator />} />
              <Route path="/admin" element={<BoardAdmin />} />
            </Routes>
          </Grid>

        </Grid>

      </Grid>

      {/* <Divider orientation="horizontal" flexItem /> */}


      {/* <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to={"/"} className="navbar-brand">
          Magic Log marketplace
        </Link>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/home"} className="nav-link">
              Home
            </Link>
          </li>

          {showModeratorBoard && (
            <li className="nav-item">
              <Link to={"/mod"} className="nav-link">
                Moderator Board
              </Link>
            </li>
          )}

          {showAdminBoard && (
            <li className="nav-item">
              <Link to={"/admin"} className="nav-link">
                Admin Board
              </Link>
            </li>
          )}

          {currentUser && (
            <li className="nav-item">
              <Link to={"/user"} className="nav-link">
                User
              </Link>
            </li>
          )}
        </div>

        {currentUser ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/profile"} className="nav-link">
                {currentUser.username}
              </Link>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>
                LogOut
              </a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            </li>

            <li className="nav-item">
              <Link to={"/register"} className="nav-link">
                Sign Up
              </Link>
            </li>
          </div>
        )}

      </nav> */}



      {/* <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to={"/"} className="navbar-brand">
          Magic Log marketplace
        </Link>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/home"} className="nav-link">
              Home
            </Link>
          </li>

          {showModeratorBoard && (
            <li className="nav-item">
              <Link to={"/mod"} className="nav-link">
                Moderator Board
              </Link>
            </li>
          )}

          {showAdminBoard && (
            <li className="nav-item">
              <Link to={"/admin"} className="nav-link">
                Admin Board
              </Link>
            </li>
          )}

          {currentUser && (
            <li className="nav-item">
              <Link to={"/user"} className="nav-link">
                User
              </Link>
            </li>
          )}
        </div>

        {currentUser ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/profile"} className="nav-link">
                {currentUser.username}
              </Link>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>
                LogOut
              </a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            </li>

            <li className="nav-item">
              <Link to={"/register"} className="nav-link">
                Sign Up
              </Link>
            </li>
          </div>
        )}

      </nav> */}


      {/* <Grid item className="container mt-3" >
        <Routes>
          <Route exact path={"/"} element={<Home />} />
          <Route exact path={"/home"} element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route path="/user" element={<BoardUser />} />
          <Route path="/mod" element={<BoardModerator />} />
          <Route path="/admin" element={<BoardAdmin />} />
        </Routes>
      </Grid> */}

      {/* <AuthVerify logOut={logOut}/> */}
    </Grid>
  );
};

export default App;
