import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import { Box, Button, Divider, Grid, IconButton, ImageList, ImageListItem, ImageListItemBar } from "@mui/material";
import LastPageIcon from '@mui/icons-material/LastPage';
import { useTheme } from '@mui/material/styles';
import { KeyboardArrowRight } from "@mui/icons-material";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import PropTypes from 'prop-types';
import AuthService from "../services/auth.service";
import ProductService from "../services/product.service";
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Nombre', width: 130 },

  { field: 'sku', headerName: 'SKU', width: 130 },
  { field: 'price', headerName: 'Precio', width: 130 },
  { field: 'quantity', headerName: 'Cantidad', width: 130 },
  { field: 'description', headerName: 'Descripción', width: 130 },

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
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

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
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
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

const BoardAdmin = () => {
  const [content, setContent] = useState("");
  const [currentUser, setCurrentUser] = useState(undefined);
  const [showAdminBoard, setShowAdminBoard] = useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [products, setProducts] = useState([]);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };


  useEffect(() => {
    UserService.getAdminBoard().then(
      (response) => {
        setContent(response.data);
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
  }, []);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
      console.log(showAdminBoard, "admin");
      if (//currentUser&&
        showAdminBoard) {
        ProductService.getAllProducts().then(
          (response) => {
            console.log("Products: ", response?.data)
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

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
  };

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
      marginTop={'0.3rem'}
      width={'80%'}
    >
      {/* {content} */}
      <Grid
        className="btn-create"
        display={'flex'}
        flexDirection={'row'}
        flexWrap={'noWrap'}
        justifyContent="right"
        alignItems={"right"}
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
          alignItems={"right"}
          width={'auto'}
          justifySelf={'center'}
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
      <Grid
        color={'inherit'}
        item
        width={'100%'}
      >
        <Divider orientation="horizontal" flexItem style={{ borderTop: '0.2rem solid gray', height: '2px' }} />
      </Grid>

      <Grid
        color={'inherit'}
        item
        width={'100%'}
      //marginTop={'.2rem'}
      >

        {/* <DataGrid
        rows={products}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />         */}


        <ImageList
          cols={3}
          gap={8}
          scrollable={false}
          // xl={{ width: 1000, height: 1000}}
          // lg={{ width: 1000, height: 1000}}
          sx={{ width: 720, height: 275 }}
        >
          {products.map((item) => (
            <ImageListItem key={item.img}>
              <img
                srcSet={`${item.urlimage}?w=248&fit=crop&auto=format&dpr=2 2x`}
                src={`${item.urlimage}?w=248&fit=crop&auto=format`}
                alt={item.title}
                loading="lazy"
              />
              <ImageListItemBar
                title={item.name}
                subtitle={<span>Descripción: {item.description}</span>}
                position="below"
              />
              <ImageListItemBar
                title={'$ '+item.price}
                subtitle={<span>En Stock: {item.quantity}</span>}
                position="below"
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Grid>
    </Grid>
  );
};

export default BoardAdmin;
