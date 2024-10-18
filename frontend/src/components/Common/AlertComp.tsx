 import {Alert, Snackbar, AlertTitle} from '@mui/material';
 

 interface AlertCompProps {
  vertical:any;
  horizontal:any;
  open:any;
  alertState:any;
 }

 export const AlertComp = ({vertical, horizontal, open, alertState}:AlertCompProps)=>{
    return(
      <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      autoHideDuration={2000}
      onClose={()=>{}}
      message=""
      key={vertical + horizontal}
    >
      <Alert  severity={alertState.severity} sx={{textAlign:"left"}}>
        <AlertTitle>{alertState.severity}</AlertTitle>
        {alertState.message}
      </Alert>

      </Snackbar>
    );
  }
