import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const mock_api = "https://6608e76ea2a5dd477b14dbe1.mockapi.io/users";
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [editMode, setEditMode] = useState(false);
  const [users, setUsers] = useState([]);
  // setting default strucuture
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    username: "",
    address: {
      street: "",
      suite: "",
      city: "",
      zipcode: "",
      geo: {
        lat: "",
        lng: "",
      },
    },
    company: {
      name: "",
      catchPhrase: "",
      bs: "",
    },
  });
  const [editingUserId, setEditingUserId] = useState(null);
  // fetching data while the component is loaded first time
  useEffect(() => {
    fetchUsers();
  }, []); // Fetch users every time the users state changes
  // async function to fetch users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(mock_api);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  // function to handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        address: {
          ...prevFormData.address,
          [name.split(".")[1]]: value,
        },
      }));
    } else if (name.startsWith("company.")) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        company: {
          ...prevFormData.company,
          [name.split(".")[1]]: value,
        },
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  // function to add data to api

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUserId) {
        // Update the user data in the API
        await axios.put(`${mock_api}/${editingUserId}`, formData);

        // Update the local users state
        const updatedUsers = users.map((user) =>
          user.id === editingUserId ? { ...user, ...formData } : user
        );
        setUsers(updatedUsers);
      } else {
        // Add new user data to the API
        const response = await axios.post(mock_api, formData);

        // Update the local users state
        setUsers([...users, response.data]);
      }
      resetFormData();
      setEditingUserId(null);
    } catch (error) {
      console.error("Error adding/editing user:", error);
    }
  };
  // clearing form after adding or editing
  const resetFormData = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      website: "",
      username: "",
      address: {
        street: "",
        suite: "",
        city: "",
        zipcode: "",
        geo: {
          lat: "",
          lng: "",
        },
      },
      company: {
        name: "",
        catchPhrase: "",
        bs: "",
      },
    });
  };
  // function to handle form editing
  const handleEdit = (id) => {
    const userToEdit = users.find((user) => user.id === id);
    // Ensure user data matches form data structure
    const formDataForEdit = {
      ...userToEdit,
      address: { ...userToEdit.address },
      company: { ...userToEdit.company },
    };
    setFormData(formDataForEdit);
    setEditingUserId(id);
    setEditMode(true);
  };
  // function to handle deleting
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${mock_api}/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        editingUserId,
        handleChange,
        formData,
        handleSubmit,
        editMode,
        users,
        handleEdit,
        handleDelete,
        resetFormData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
