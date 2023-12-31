import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css';
import Navbar from './components/common/Navbar';
import Home from './components/webpages/General/Home';
import Register from './components/webpages/General/Register';
import Login from './components/webpages/General/Login';
import Orders from './components/webpages/General/Orders';
import Profile from './components/webpages/General/Profile';
import VendorStatistics from "./components/webpages/Vendor/VendorStatistics";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />                                      {/*Present across entire app*/}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/statistics" element={<VendorStatistics />} />
          <Route path="*" element={<div><h1>404 URL NOT FOUND</h1></div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
