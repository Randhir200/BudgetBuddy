import { memo, useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
  useMediaQuery,
  Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { LinearProgress } from '@mui/material';
import { RootState, AppDispatch } from "../../ReduxToolkit/store";
import { useSelector, useDispatch } from 'react-redux';
import { fetchExpense } from '../../ReduxToolkit/slices/expenseSlice';

// Define the columns
const columns = [
  { id: 'slNo', label: 'Sl.No.', },
  { id: 'date', label: 'Date', },
  { id: 'type', label: 'Type', },
  { id: 'category', label: 'Category', },
  { id: 'item', label: 'Item', },
  { id: 'price', label: 'Price', },
  { id: 'payBack', label: 'Payback', },
  { id: 'action', label: 'Action', },
];

// Define the CustomTable component
const CustomTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const dispatch: AppDispatch = useDispatch();
  const { fetchLoading, expenses } = useSelector((state: RootState) => state.expenseReducer);

  // Check if screen width is less than 600px
  const isMobile = useMediaQuery('(max-width:600px)');

  // Format createdAt date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const userId = localStorage.getItem('userId');
  useEffect(() => {
    dispatch(fetchExpense(userId));
  }, [])

  return (
    <Paper style={{ width: '99%', overflowX: 'auto' }}>
      <TableContainer style={{ maxHeight: 440 }}>
        {fetchLoading && <LinearProgress />}
        <Table
          stickyHeader
          aria-label="customized table"
          sx={{
            '& .MuiTableCell-root': {
              fontSize: isMobile ? '8px' : '12px',
              padding: isMobile ? '3px' : '9px',
            },
          }}
        >
          <TableHead>
            <TableRow>
              {columns.map((column) => {
                // Hide "category" and "item" columns on small screens
                // if (isMobile && ['category', 'item'].includes(column.id)) {
                //   return null;
                // }
                return (
                  <TableCell
                    key={column.id}
                    align={"left"} // 
                    style={{}} // we can put minwidth
                  >
                    {column.label}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((expense: any, index: number) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={expense._id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{formatDate(expense.createdAt)}</TableCell>
                  <TableCell>{expense.type}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.item}</TableCell>
                  <TableCell align="left">₹{expense.price}</TableCell>
                  <TableCell align="left">
                    <Box sx={{display:"flex", flexWrap:"wrap" , justifyContent:"center", alignItems:"center"}}>
                      <IconButton sx={{ cursor: "default" }} >
                        {expense.payBack.isPayback ? <ThumbUpOffAltIcon color="success" fontSize={isMobile ? 'small' : 'medium'} />
                          : <ThumbDownOffAltIcon color="info" fontSize={isMobile ? 'small' : 'medium'} />}
                      </IconButton>
                      ₹{expense.payBack.amount}
                    </Box>
                  </TableCell>
                  <TableCell align="left">
                    <IconButton aria-label="edit" size={isMobile ? 'small' : 'medium'}>
                      <EditIcon color="info" fontSize={isMobile ? 'small' : 'medium'} />
                    </IconButton>
                    <IconButton aria-label="delete" size={isMobile ? 'small' : 'medium'}>
                      <DeleteIcon color="warning" fontSize={isMobile ? 'small' : 'medium'} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={expenses.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontSize: isMobile ? '10px' : '14px',
          },
          '& .MuiTablePagination-input': {
            fontSize: isMobile ? '10px' : '14px',
          },
        }}
      />
    </Paper>
  );
};

export default memo(CustomTable);
