import {
    Box, FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material'
import ButtonComp from './ButtonComp';

export const ConfigForm = ({ CateForm,
    isSmallScreen,
    theme,
    handleAddType,
    formData,
    handleSubmit }: any) => {
    return (
        <>
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

                {CateForm ?
                  <>
                    <FormControl fullWidth>
                        <InputLabel
                            id="type-label"
                            sx={{ fontSize: isSmallScreen ? "0.8rem" : "1rem" }} // Smaller label font size
                        >
                            Type
                        </InputLabel> <Select
                            labelId="type-label"
                            id="type"
                            label="Type"
                            defaultValue=""
                            name="type"
                            value={""}
                            onChange={handleAddType}
                            sx={{ fontSize: isSmallScreen ? "0.8rem" : "1rem" }} // Smaller input font size
                        >
                            <MenuItem value="Needs">Needs</MenuItem>
                            <MenuItem value="Wants">Wants</MenuItem>
                            <MenuItem value="Savings">Savings</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
   id="category"
   label="Category"
   type="category"
   name="category"
   value={formData.item}
   onChange={handleAddType}
   defaultValue=""
   fullWidth
   InputLabelProps={{
       sx: { fontSize: isSmallScreen ? "0.8rem" : "1rem" }, // Smaller label font size
   }}
   inputProps={{ style: { fontSize: isSmallScreen ? "0.8rem" : "1rem" } }} // Smaller input font
/>

            </>
:
<>
   {/* Item */}
   <TextField
   id="item"
   label="Item"
   type="item"
   name="item"
   value={formData.item}
   onChange={handleAddType}
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
   name="price"
   value={formData.price}
   onChange={handleAddType}
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
   name="createdAt"
   value={formData.createdAt}
   onChange={handleAddType}
   InputLabelProps={{
       shrink: true,
       sx: { fontSize: isSmallScreen ? "0.8rem" : "1rem" }, // Smaller label font size
   }}
   fullWidth
   inputProps={{ style: { fontSize: isSmallScreen ? "0.8rem" : "1rem" } }} // Smaller input font size
/>
</>
}

   
             
                {/* Submit Button */}
                <ButtonComp
                    title="Submit"
                    variant="contained"
                    color="primary"
                    size={isSmallScreen ? "small" : "medium"} // Adjust button size for small screens
                    event={handleSubmit}
                />
            </Box>
        </>
    )
}