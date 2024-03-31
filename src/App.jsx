import React from "react";
import "./App.css";
import Form from "./pages/Form";
import Users from "./pages/Users";
import { UserProvider } from "./UserContext";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/create" element={<Form />} />
          <Route path="/" element={<Users />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
