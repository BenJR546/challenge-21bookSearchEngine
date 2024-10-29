// client/src/main.jsx
import ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import App from "./App.jsx";
import SearchBooks from "./pages/SearchBooks";
import SavedBooks from "./pages/SavedBooks";
import Auth from "./utils/auth";

// Create a private route component to protect the '/saved' route
const PrivateRoute = ({ element }) => {
    return Auth.loggedIn() ? element : <Navigate to="/" />;
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <h1 className="display-2">Wrong page!</h1>,
        children: [
            {
                index: true,
                element: <SearchBooks />,
            },
            {
                path: "/saved",
                element: <PrivateRoute element={<SavedBooks />} />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
);
