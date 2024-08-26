import React from 'react';
// import { useTheme } from '@mui/material/styles';
// import useMediaQuery from '@mui/material/useMediaQuery';

export const Expenses:React.FC = ()=>{
    // const theme = useTheme();
    // const matches = useMediaQuery(theme.breakpoints.up('lg'));

return(<>
        <div style={{width: "100%"}}>
            <button>Add +</button>
            <form>
                <label htmlFor="type">Type</label>
                <input type="text" name="type" />
                <br/>
                <label htmlFor="category">Category</label>
                <input type="text" name="category" />
            </form>
        {/* <span>{`theme.breakpoints.up('sm') matches: ${matches}`}</span>; */}
        </div>
</>)
}