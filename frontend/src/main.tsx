import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./ReduxToolkit/store";
import { SnackbarProvider } from "notistack";
createRoot(document.getElementById("root")!).render(
    <>
        <SnackbarProvider maxSnack={3} autoHideDuration={2000}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Provider store={store}>
                <App />
            </Provider>
        </SnackbarProvider>
    </>
);
