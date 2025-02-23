import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Menu from "./pages/Menu";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ForgotPassword />} />
          <Route path='/menu' element={<ProtectedMenu />} />
          <Route path='/profile' element={<ProtectedDashboard />} />
          {/* <Route path='/' element={< />} /> */}
          {/* <Route path='/' element={< />} /> */}
          {/* <Route path='/' element={< />} /> */}
          {/* <Route path='/' element={< />} /> */}
          {/* <Route path='/' element={< />} /> */}
          {/* <Route path='/' element={< />} /> */}
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

const ProtectedDashboard = () =>{
    const token = sessionStorage.getItem('token');
    if(token){
        return <Dashboard/>
    }
    else{
        return <Navigate to='/' />
    }
}

const ProtectedMenu = () =>{
  const token = sessionStorage.getItem('token');
  if(token){
      return <Menu/>
  }
  else{
      return <Navigate to='/' />
  }
}

export default App;