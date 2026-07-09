import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Home from "./Pages/Home";
import ServicesPage from "./Pages/ServicesPage";
import Stylists from "./Pages/Stylists";
import Contact from "./Pages/Contact";
import BookAppointment from "./Pages/BookAppointment";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import DashboardUser from "./Pages/DashboardUser";
import DashboardProfessional from "./Pages/DashboardProfessional";
import DashboardAdmin from "./Pages/DashboardAdmin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/services",
    element: <ServicesPage />,
  },
  {
    path: "/stylists",
    element: <Stylists />,
  },
  {
    path: "/book-appointment",
    element: <BookAppointment />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard-user",
    element: <DashboardUser />,
  },
  {
    path: "/dashboard-professional",
    element: <DashboardProfessional />,
  },
  {
    path: "/dashboard-admin",
    element: <DashboardAdmin />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;