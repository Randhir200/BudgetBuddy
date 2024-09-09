import React, { useState } from "react";
import {
  Box,
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
import ExpenseTable from "../components/ExpenseTable";
import ButtonComp from "../components/ButtonComp";

const Expenses: React.FC = () => {
  const [toggleAdd, setToggleAdd] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleToggleAdd = () => {
    setToggleAdd(!toggleAdd);
  };

  return (
    <Container>
      <Typography
        variant={isSmallScreen ? "h5" : "h4"} // Adjust the heading size based on screen size
        gutterBottom
        sx={{ fontSize: isSmallScreen ? "1.2rem" : "2rem" }} // Smaller font for small screens
      >
        Add Expense
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "end", mb: 2 }}>
        <ButtonComp
          title="Add Expense"
          variant="contained"
          color="primary"
          size={isSmallScreen ? "small" : "medium"} // Adjust button size
          event={handleToggleAdd}
        />
      </Box>
      {toggleAdd && (
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            gap: isSmallScreen ? 2 : 3, // Smaller gaps for small screens
            p: isSmallScreen ? 2 : 3, // Smaller padding for small screens
            backgroundColor: theme.palette.background.paper,
            borderRadius: 1,
            boxShadow: theme.shadows[3],
          }}
        >
          {/* Type Field */}
          <FormControl fullWidth>
            <InputLabel
              id="type-label"
              sx={{ fontSize: isSmallScreen ? "0.8rem" : "1rem" }} // Smaller label font size
            >
              Type
            </InputLabel>
            <Select
              labelId="type-label"
              id="type"
              label="Type"
              defaultValue=""
              sx={{ fontSize: isSmallScreen ? "0.8rem" : "1rem" }} // Smaller input font size
            >
              <MenuItem value="Needs">Needs</MenuItem>
              <MenuItem value="Wants">Wants</MenuItem>
              <MenuItem value="Savings">Savings</MenuItem>
            </Select>
          </FormControl>

          {/* Category Field */}
          <FormControl fullWidth>
            <InputLabel
              id="category-label"
              sx={{ fontSize: isSmallScreen ? "0.8rem" : "1rem" }}
            >
              Category
            </InputLabel>
            <Select
              labelId="category-label"
              id="category"
              label="Category"
              defaultValue=""
              sx={{ fontSize: isSmallScreen ? "0.8rem" : "1rem" }}
            >
              <MenuItem value="Food">Food</MenuItem>
              <MenuItem value="Bills">Bills</MenuItem>
              <MenuItem value="Grocery">Grocery</MenuItem>
            </Select>
          </FormControl>

          {/* Item */}
          <TextField
            id="item"
            label="Item"
            type="item"
            defaultValue=""
            fullWidth
            InputLabelProps={{
              sx: { fontSize: isSmallScreen ? "0.8rem" : "1rem" }, // Smaller label font size
            }}
            inputProps={{ style: { fontSize: isSmallScreen ? "0.8rem" : "1rem" } }} // Smaller input font
          />

          {/* Price Field */}
          <TextField
            id="price"
            label="Price"
            type="number"
            fullWidth
            inputProps={{ min: 0, style: { fontSize: isSmallScreen ? "0.8rem" : "1rem" } }} // Smaller input font size
            InputLabelProps={{
              sx: { fontSize: isSmallScreen ? "0.8rem" : "1rem" }, // Smaller label font size
            }}
          />

          {/* Date Field */}
          <TextField
            id="date"
            label="Date"
            type="date"
            defaultValue=""
            InputLabelProps={{
              shrink: true,
              sx: { fontSize: isSmallScreen ? "0.8rem" : "1rem" }, // Smaller label font size
            }}
            fullWidth
            inputProps={{ style: { fontSize: isSmallScreen ? "0.8rem" : "1rem" } }} // Smaller input font size
          />

          {/* Submit Button */}
          <ButtonComp
            title="Submit"
            variant="contained"
            color="primary"
            size={isSmallScreen ? "small" : "medium"} // Adjust button size for small screens
            event={handleToggleAdd}
          />
        </Box>
      )}

      <Box sx={{ mt: 2 }}>
        <ExpenseTable />
      </Box>
    </Container>
  );
};

export default Expenses;
