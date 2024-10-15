import { memo, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import useMediaQuery from '@mui/material/useMediaQuery';
import { LinearProgress } from '@mui/material';

// Define the columns
const columns = [
  { id: 'slNo', label: 'Sl.No.', },
  { id: 'date', label: 'Date', },
  { id: 'type', label: 'Type', },
  { id: 'category', label: 'Category', },
  { id: 'item', label: 'Item', },
  { id: 'price', label: 'Price', },
  { id: 'action', label: 'Action', },
];

// Define the CustomTable component
const CustomTable = ({ expenses, loading }: any) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  console.log('re-renders')

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

  return (
    <Paper style={{ width: '100%', overflowX: 'auto' }}>
      <TableContainer style={{ maxHeight: 440 }}>
        {loading && <LinearProgress/>}
        <Table
          stickyHeader
          aria-label="customized table"
          sx={{
            '& .MuiTableCell-root': {
              fontSize: isMobile ? '10px' : '14px',
              padding: isMobile ? '4px' : '10px',
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
                  <TableCell align="left">{expense.price}</TableCell>
                  <TableCell align="left">
                    <IconButton aria-label="edit" size={isMobile ? 'small' : 'medium'}>
                      <EditIcon fontSize={isMobile ? 'small' : 'medium'} />
                    </IconButton>
                    <IconButton aria-label="delete" size={isMobile ? 'small' : 'medium'}>
                      <DeleteIcon fontSize={isMobile ? 'small' : 'medium'} />
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
