import React, { useState } from "react";
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
import ButtonComp from "../components/ButtonComp";

const Expenses: React.FC = () => {
  const [toggleAdd, setToggleAdd] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  
  const handleToggleAdd = ()=>{
    setToggleAdd(!toggleAdd);
  }
  return (
    <Container sx={{}}>
      <Typography variant="h4" gutterBottom>
        Add Expense
      </Typography>
      <Box sx={{display:"flex", justifyContent:"end", mb:2}}>
        <ButtonComp title="Add Expense" variant="contained" color="primary" size="medium" event={handleToggleAdd} />
      </Box> 
      {toggleAdd &&
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

      {/* Item */}
      <TextField
        id="item"
        label="Item"
        type="item"
        defaultValue=""
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

      {/* Submit Button */}
      <ButtonComp title="Submit" variant="contained" color="primary" size="small" event={handleToggleAdd}/>
    </Box>}
      
    </Container>
  );
};

export default Expenses;
