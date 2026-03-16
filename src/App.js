import { BrowserRouter,Routes,Route } from "react-router-dom"
import DashboardLayout from "./layout/dashboardLayout"
import Dashboard from "./pages/Dashboard"
import MyTicket from "./pages/MyTicket"
import CreateTicket from "./pages/CreateTicket"
import Login from "./Login/Login"
import Signup from "./Login/Singup"
import Protechted from "./protectedroute/Protechted"
import { AuthProvider } from "./context/AuthContext"
import Profile from "./component/Profile"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import Dashboard from "./pages/Dashboard";


function App(){

return(
  <AuthProvider >
<BrowserRouter>
<ToastContainer position="top-right" autoClose={3000} />

      <Routes>

        {/* Login page (no sidebar) */}
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Signup />} />

        {/* Dashboard Layout */}
        {/* <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="tickets" element={<MyTicket />} />
          <Route path="create-ticket" element={<CreateTicket />} />
        </Route> */}


         <Route
          path="/dashboard"
          element={
            <Protechted>
              <DashboardLayout />
            </Protechted>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="tickets" element={<MyTicket />} />
          <Route path="create-ticket" element={<CreateTicket />} />
          <Route path="profile" element={<Profile />} />
        </Route>

      </Routes>

    </BrowserRouter>
    </AuthProvider>

)

}

export default App