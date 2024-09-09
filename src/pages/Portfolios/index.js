import React, { useState, useEffect } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Pagination,
  Typography,
} from "@mui/material";
import AlertMessage from "src/components/Alert/AlertMessage";
import axios from "axios";
import WithAuth from "src/auth/HOCauth";
import PortfolioForm from "src/views/Form/Portfolios/PortfolioForm";
import PortfoliosCard from "src/views/cards/PortfoliosCard";
import { Plus } from "mdi-material-ui";

function Portfolios() {
  const [open, setOpen] = useState(false);
  const [showPop, setShowPop] = useState(false);
  const [getAllCounter, setGetAllCounter] = useState([]);
  const [portfolioId, setPortfolioId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [PortfolioEditId, setPortfolioEditId] = useState("");
  const [editPortfolioData, setEditPortfolioData] = useState({});
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [page, setPage] = React.useState(1);
  const [currentItems, setCurrentItems] = useState(null);

  useEffect(() => {
    const endOffset = itemOffset + 6;
    setCurrentItems(getAllCounter.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(getAllCounter.length / 6));
  }, [itemOffset, getAllCounter]);

  const handlePageClick = (event, value) => {
    setPage(value);
    const newOffset = ((value - 1) * 6) % getAllCounter.length;
    setItemOffset(newOffset);
  };

  const [Alertpop, setAlertpop] = useState({
    open: false,
    message: "",
  });

  useEffect(() => {
    fetchCounterData();
  }, []);

  const fetchCounterData = async () => {
    try {
      const response = await axios.get("/api/portfolio", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        throw new Error("Not found");
      }

      const res = response.data;
      setGetAllCounter(res.data);
      setIsLoading(false);
    } catch (error) {
      alert(error);
    }
  };

  const handleClickOpen = async (id, info) => {
    setPortfolioEditId(id);
    setEditPortfolioData(info);
    setOpen(true);
  };

  const handlePopopen = (_id) => {
    setPortfolioId(_id);
    setShowPop(true);
  };

  // function for close delete popup
  const handlePopclose = () => {
    setShowPop(false);
  };

  const handleClose = () => {
    setOpen(false);
    setPortfolioEditId("");
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/api/portfolio/${portfolioId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setAlertpop({
          open: true,
          message: "portfolio Deleted successfully.",
        });
        setShowPop(false);
        fetchCounterData();
      } else {
        setAlertpop({
          open: true,
          message: "Failed to delete blog. Please try again later.",
        });
      }
    } catch (error) {
      setAlertpop({
        open: true,
        message: "An error occurred. Please try again later.",
      });
    }
  };

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12} md={3}>
          <Typography variant="h5">Portfolio</Typography>
        </Grid>
        <Grid item xs={12} md={9} textAlign="right" sx={{ marginBottom: 4 }}>
          <Button
            variant="contained"
            onClick={() => handleClickOpen()}
            sx={{ marginRight: 1.5 }}
          >
            <Plus sx={{ marginRight: 1.5 }} /> Add New Portfolio
          </Button>
        </Grid>
        {isLoading ? (
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <CircularProgress />
          </Grid>
        ) : currentItems?.length == 0 ? (
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography variant="h6" sx={{ marginTop: 5 }}>
              Portfolio Not Found
            </Typography>
          </Grid>
        ) : (
          <>
            {currentItems?.map((value, index) => (
              <PortfoliosCard
                handleClickOpen={handleClickOpen}
                index={index}
                value={value}
                handlePopopen={handlePopopen}
              ></PortfoliosCard>
            ))}
          </>
        )}
      </Grid>

      <Box
        sx={{
          marginTop: 10,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Pagination
          count={pageCount}
          variant="outlined"
          color="primary"
          page={page}
          onChange={handlePageClick}
        />
      </Box>

      <Dialog
        open={showPop}
        onClose={handlePopclose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this Portfolios?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePopclose}>Disagree</Button>
          <Button onClick={handleDelete} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

      <AlertMessage setAlertpop={setAlertpop} Alertpop={Alertpop} />
      <PortfolioForm
        handleClose={handleClose}
        open={open}
        PortfolioEditId={PortfolioEditId}
        fetchCounterData={fetchCounterData}
        editPortfolioData={editPortfolioData}
      ></PortfolioForm>
    </>
  );
}

export default WithAuth(Portfolios);
