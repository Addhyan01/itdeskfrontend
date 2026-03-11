import { BrowserRouter,Routes,Route } from "react-router-dom"
import DashboardLayout from "./layout/dashboardLayout"
import Dashboard from "./pages/Dashboard"
import MyTicket from "./pages/MyTicket"
import CreateTicket from "./pages/CreateTicket"
import Login from "./Login/Login"

// import Dashboard from "./pages/Dashboard";


function App(){

return(
<BrowserRouter>

      <Routes>

        {/* Login page (no sidebar) */}
        <Route path="/" element={<Login />} />

        {/* Dashboard Layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="tickets" element={<MyTicket />} />
          <Route path="create-ticket" element={<CreateTicket />} />
        </Route>

      </Routes>

    </BrowserRouter>

)

}

export default App