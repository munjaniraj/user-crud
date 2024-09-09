import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import { Plus } from "mdi-material-ui";
import AlertMessage from "../../components/Alert/AlertMessage";
import axios from "axios";
import UserForm from "src/views/Form/User/UserForm";
import EditPasswordForm from "src/views/Form/EditPassword/EditPasswordForm";
import UserTable from "src/views/tables/UserTable";

function User() {
  // Define state variables using the useState hook
  const [open, setOpen] = useState(false);
  const [editPassWordOpen, setEditPassWordOpen] = useState(false);
  const [UserEditId, setUserEditId] = useState("");
  const [userEditData, setUserEditData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [userId, setUserId] = useState("");
  const [showPop, setShowPop] = useState(false);

  const [Alertpop, setAlertpop] = useState({
    open: false,
    message: "",
  });

  // Function to open the user form for adding/editing users
  const handleClickOpen = (id, info) => {
    setUserEditId(id);
    setOpen(true);
  };

  // Function to close the user form
  const handleClose = () => {
    setOpen(false);
    setUserEditId("");
  };

  // fetch user data
  const fetchUserData = async () => {
    try {
      const response = await axios.get("/api/users");
      if (response.status !== 200) {
        throw new Error("Request failed with status code " + response.status);
      }
      const res = response.data;
      setUserData(res.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setAlertpop({
        open: true,
        message: "Failed to fetch user data",
      });
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Delete User
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/api/users/${userId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        setAlertpop({
          open: true,
          message: "User deleted successfully.",
        });
        fetchUserData();
        setShowPop(false);
      } else {
        setAlertpop({
          open: true,
          message: "Failed to delete User. Please try again later.",
        });
      }
    } catch (error) {
      setAlertpop({
        open: true,
        message: "An error occurred. Please try again later.",
      });
    }
  };

  // function for opne delete popup
  const handlePopopen = (_id) => {
    setUserId(_id);
    setShowPop(true);
  };

  // function for close delete popup
  const handlePopclose = () => {
    setShowPop(false);
  };

  //edit password function
  const handleEditPassword = (_id, info) => {
    setUserEditId(_id);
    setUserEditData(info);
    setEditPassWordOpen(true);
  };

  const handleEditPasswordClose = () => {
    setEditPassWordOpen(false);
    setUserEditId("");
  };

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12} md={3}>
          <Typography variant="h5">{"Users"}</Typography>
        </Grid>
        <Grid item xs={12} md={9} textAlign="right" sx={{ marginBottom: 4 }}>
          <Button
            variant="contained"
            onClick={() => {
              handleClickOpen();
            }}
          >
            <Plus sx={{ marginRight: 1.5 }} /> {"Add New User"}
          </Button>
        </Grid>

        <UserForm
          handleClose={handleClose}
          fetchUserData={fetchUserData}
          open={open}
          UserEditId={UserEditId}
        ></UserForm>

        <AlertMessage setAlertpop={setAlertpop} Alertpop={Alertpop} />
      </Grid>

      <UserTable
        userData={userData}
        isLoading={isLoading}
        page={page}
        rowsPerPage={rowsPerPage}
        handlePageChange={handleChangePage}
        handleRowsPerPageChange={handleChangeRowsPerPage}
        handleEditUser={handleClickOpen}
        handleDeleteUser={handlePopopen}
        handleEditPassword={handleEditPassword}
      ></UserTable>

      <Dialog
        open={showPop}
        onClose={handlePopclose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this User?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePopclose}>Disagree</Button>
          <Button onClick={handleDelete} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

      <EditPasswordForm
        handleEditPasswordClose={handleEditPasswordClose}
        fetchUserData={fetchUserData}
        editPassWordOpen={editPassWordOpen}
        UserEditId={UserEditId}
        userEditData={userEditData}
      ></EditPasswordForm>
    </>
  );
}

export default User;
