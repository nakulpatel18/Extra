// import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
// import React, { useEffect, useState } from 'react';
// import './App.css';
// import Dashboard from './pages/Dashboard';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Landing from './pages/Landing';

// const App = () => {
//     const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
//     const navigate = useNavigate();

//     useEffect(() => {
//         const handleStorageChange = () => {
//             setIsLoggedIn(!!localStorage.getItem('token'));
//         };
//         window.addEventListener('storage', handleStorageChange);
//         return () => window.removeEventListener('storage', handleStorageChange);
//     }, []);

//     const handleLogout = () => {
//         localStorage.removeItem('token');
//         setIsLoggedIn(false);
//         navigate('/');
//     };

//     return (
//         <div className="app-wrapper">
//             <header className="app-header">
//                 <h1>Expense Tracker</h1>
//                 <nav>
//                     <Link to="/">Home</Link>
//                     {isLoggedIn && <Link to="/dashboard">Dashboard</Link>}
//                     {!isLoggedIn && <Link to="/login">Login</Link>}
//                     {!isLoggedIn && <Link to="/register">Register</Link>}
//                     {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
//                 </nav>
//             </header>

//             <main className="app-content">
//                 <Routes>
//                     <Route path="/" element={<Landing />} />
//                     <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
//                     <Route path="/login" element={!isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/dashboard" />} />
//                     <Route path="/register" element={!isLoggedIn ? <Register setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/dashboard" />} />
//                 </Routes>
//             </main>

//             <footer className="app-footer">
//                 <p>&copy; {new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
//             </footer>
//         </div>
//     );
// };

// export default App;



// -- expense-tracker-frontend\src\App.js --

import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import ForgotPassword from './pages/ForgotPassword'; // NEW
import ResetPassword from './pages/ResetPassword';   // NEW

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const navigate = useNavigate();

    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(!!localStorage.getItem('token'));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <div className="app-wrapper">
            <header className="app-header">
                <h1>Expense Tracker</h1>
                <nav>
                    <Link to="/">Home</Link>
                    {isLoggedIn && <Link to="/dashboard">Dashboard</Link>}
                    {!isLoggedIn && <Link to="/login">Login</Link>}
                    {!isLoggedIn && <Link to="/register">Register</Link>}
                    {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
                </nav>
            </header>

            <main className="app-content">
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
                    <Route path="/login" element={!isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/dashboard" />} />
                    <Route path="/register" element={!isLoggedIn ? <Register setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/dashboard" />} />
                    {/* NEW ROUTES FOR PASSWORD RESET */}
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                </Routes>
            </main>

            <footer className="app-footer">
                <p>&copy; {new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default App;
