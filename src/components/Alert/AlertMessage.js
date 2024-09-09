import { Alert, Snackbar } from "@mui/material";
import React from "react";

const AlertMessage = (props) => {
  const { Alertpop, setAlertpop } = props;
  return (
    <Snackbar
      // style={{ zIndex: 10000000000000 }}
      autoHideDuration={4000}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={Alertpop.open}
      onClose={() =>
        setAlertpop({
          open: false,
        })
      }
    >
      <Alert severity={Alertpop.color}>{Alertpop.message}</Alert>
    </Snackbar>
  );
};

export default AlertMessage;
