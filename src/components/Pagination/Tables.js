import { TablePagination } from "@mui/material";

const comHandleChangePage = (setState) => {
  return (valueToUpdate) => {
    setState((preState) => {
      return {
        ...preState,
        ...valueToUpdate,
      };
    });
  };
};

const CommonTablePagination = ({ paginationState }) => {
  const handleChangePage = comHandleChangePage(
    paginationState.setPaginationState
  );

  return (
    <TablePagination
      labelRowsPerPage={"Rows Per Page:"}
      rowsPerPageOptions={[1, 5, 10, 25, 100]}
      component="div"
      count={paginationState.total}
      rowsPerPage={paginationState.rowsPerPage}
      page={paginationState.pageNo}
      onPageChange={(e, newpage) => handleChangePage({ pageNo: newpage })}
      onRowsPerPageChange={(e) => {
        handleChangePage({ rowsPerPage: e.target.value });
      }}
    />
  );
};

export default CommonTablePagination;
