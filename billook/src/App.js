import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Layout from './Components/Layout';
import Homepage from './Pages/Homepage/Homepage';
import Login from './Pages/Authentication/Login';
import SignUp from './Pages/Authentication/SignUp';
import BooksList from './Pages/UserBook/BooksList';
import AuthContext from './Store/AuthContext';
function App() {
    const [auth, setAuth] = useState({
        isLoggedIn: false,
        token: null,
        userId: null
    });

    const login = (token, userId) => {
        setAuth({
            isLoggedIn: true,
            token: token,
            userId: userId
        });
    }
    const logout = () => {
        setAuth({
            isLoggedIn: false,
            token: null,
            userId: null
        });
    }

    return (
        <BrowserRouter>
        <AuthContext.Provider value={{
            isLoggedIn: auth.isLoggedIn, 
            token: auth.token, 
            userId: auth.userId, 
            login: login, 
            logout: logout
        }}>
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route index element={<Homepage/>}/>
                <Route path='login' element={<Login/>}/>
                <Route path='mybook' element={<BooksList/>}/>
                <Route path='signup' element={<SignUp/>}/>
            </Route>
        </Routes>      
        </AuthContext.Provider>
        </BrowserRouter>
    );
}
export default App;