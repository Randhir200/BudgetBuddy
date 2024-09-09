import * as React from 'react';
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

interface Column {
  id: 'slNo' | 'date' | 'type' | 'category' | 'item' | 'price' | 'action';
  label: string;
  minWidth?: number;
  align?: 'center';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'slNo', label: 'Sl.No.', minWidth: 50 },
  { id: 'date', label: 'Date', minWidth: 100 },
  { id: 'type', label: 'Type', minWidth: 100 },
  { id: 'category', label: 'Category', minWidth: 100 },
  { id: 'item', label: 'Item', minWidth: 100 },
  { id: 'price', label: 'Price', minWidth: 100, align: 'center' },
  { id: 'action', label: 'Action', minWidth: 150, align: 'center' },
];

interface Data {
  slNo: number;
  date: string;
  type: string;
  category: string;
  item: string;
  price: number;
  action?: any;
}

function createData(
  slNo: number,
  date: string,
  type: string,
  category: string,
  item: string,
  price: number
): Data {
  return { slNo, date, type, category, item, price };
}

// Sample rows
const rows = [
  createData(1, '2024-09-01', 'Need', 'Food', 'Milk', 27),
  createData(2, '2024-09-02', 'Want', 'Electronics', 'Headphones', 99),
  createData(3, '2024-09-03', 'Need', 'Transport', 'Bus Ticket', 3),
  // Add more rows as needed
];

export default function CustomTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Check if screen width is less than 600px
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper style={{ width: '100%', overflowX: 'auto' }}>
      <TableContainer style={{ maxHeight: 440 }}>
        <Table
          stickyHeader
          aria-label="customized table"
          sx={{
            '& .MuiTableCell-root': {
              fontSize: isMobile ? '10px' : '14px',  // Smaller font for mobile
              padding: isMobile ? '4px' : '10px',  // Smaller padding for mobile
            },
          }}
        >
          <TableHead>
            <TableRow>
              {columns.map((column) => {
                if (isMobile && ['category', 'item'].includes(column.id)) {
                  // Hide "category" and "item" columns on small screens
                  return null;
                }
                return (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.slNo}>
                  {columns.map((column) => {
                    if (isMobile && ['category', 'item'].includes(column.id)) {
                      return null;
                    }
                    const value = row[column.id];
                    if (column.id === 'action') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <IconButton
                            aria-label="edit"
                            size={isMobile ? 'small' : 'medium'} // Smaller icon size for mobile
                          >
                            <EditIcon fontSize={isMobile ? 'small' : 'medium'} />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            size={isMobile ? 'small' : 'medium'} // Smaller icon size for mobile
                          >
                            <DeleteIcon fontSize={isMobile ? 'small' : 'medium'} />
                          </IconButton>
                        </TableCell>
                      );
                    } else {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    }
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontSize: isMobile ? '10px' : '14px',  // Smaller pagination font for mobile
          },
          '& .MuiTablePagination-input': {
            fontSize: isMobile ? '10px' : '14px',
          },
        }}
      />
    </Paper>
  );
}
