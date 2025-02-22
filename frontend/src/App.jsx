import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react';
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
    return (
        <ChakraProvider>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Login/>} />
                    <Route path='/signup' element={<Signup/>} />
                    <Route path='/reset-password' element={<ForgotPassword/>} />
                    {/* <Route path='/' element={< />} /> */}
                    {/* <Route path='/' element={< />} /> */}
                    {/* <Route path='/' element={< />} /> */}
                    {/* <Route path='/' element={< />} /> */}
                    {/* <Route path='/' element={< />} /> */}
                    {/* <Route path='/' element={< />} /> */}
                    {/* <Route path='/' element={< />} /> */}
                    {/* <Route path='/' element={< />} /> */}
                </Routes>
            </BrowserRouter>
        </ChakraProvider>
    )
}

// const ProtectedComponent = () =>{
//     const token = sessionStorage.getItem('token');
//     if(token){
//         return < />
//     }
//     else{
//         return <Navigate to='/' />
//     }
// }

export default App;