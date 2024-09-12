import {
    Box, FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material'
import ButtonComp from './ButtonComp'

export const AddExpenseForm = ({isSmallScreen, theme, handleToggleAdd}: any) => {
    return (
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
    )
}