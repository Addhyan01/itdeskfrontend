import { BrowserRouter,Routes,Route } from "react-router-dom"

// import Dashboard from "./pages/Dashboard";
import MyTickets from "./pages/MyTicket"
import CreateTicket from "./pages/CreateTicket"
import CreateTickets from "./pages/CreateTickets";
import Navbar from "./component/Navbar";

function App(){

return(

<BrowserRouter>

<Routes>

<Route path="/" element={<Navbar/>}/>
<Route path="/tickets" element={<MyTickets/>}/>
<Route path="/create-ticket" element={<CreateTicket/>}/>

</Routes>

</BrowserRouter>

)

}

export default App