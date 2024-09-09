import React from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const Expenses: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Add Expense
      </Typography>
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          gap: 3,
          p: 3,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 1,
          boxShadow: theme.shadows[3],
        }}
      >
        {/* Type Field */}
        <FormControl fullWidth>
          <InputLabel id="type-label">Type</InputLabel>
          <Select
            labelId="type-label"
            id="type"
            label="Type"
            defaultValue=""
          >
            <MenuItem value="Needs">Needs</MenuItem>
            <MenuItem value="Wants">Wants</MenuItem>
            <MenuItem value="Savings">Savings</MenuItem>
          </Select>
        </FormControl>

        {/* Category Field */}
        <FormControl fullWidth>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="category"
            label="Category"
            defaultValue=""
          >
            <MenuItem value="Food">Food</MenuItem>
            <MenuItem value="Bills">Bills</MenuItem>
            <MenuItem value="Grocery">Grocery</MenuItem>
          </Select>
        </FormControl>

        {/* Date Field */}
        <TextField
          id="date"
          label="Date"
          type="date"
          defaultValue=""
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
        />

        {/* Price Field */}
        <TextField
          id="price"
          label="Price"
          type="number"
          fullWidth
          inputProps={{ min: 0 }}
        />

        {/* Submit Button */}
        <Button variant="contained" color="primary" type="submit">
          Add Expense
        </Button>
      </Box>
    </Container>
  );
};

export default Expenses;
