import React from "react";
import "./App.css";
import Form from "./pages/Form";
import Users from "./pages/Users";
import { UserProvider } from "./UserContext";

const App = () => {
  return (
    <UserProvider>
      <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl text-center">
        User Management
      </h1>
      <Form />
      <Users />
    </UserProvider>
  );
};

export default App;
