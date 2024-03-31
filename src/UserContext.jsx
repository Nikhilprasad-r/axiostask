import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
const API_URL = "https://jsonplaceholder.typicode.com/users";
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [editMode, setEditMode] = useState(false);
  const [users, setUsers] = useState([]);
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

  useEffect(() => {
    fetchUsers();
  }, []); // Fetch users every time the users state changes

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUserId) {
        await axios.put(`${API_URL}/${editingUserId}`, formData);
        const updatedUsers = users.map((user) =>
          user.id === editingUserId ? { ...user, ...formData } : user
        );
        setUsers(updatedUsers);
        setEditingUserId(null);
      } else {
        const response = await axios.post(API_URL, formData);
        setUsers([...users, response.data]);
      }
      resetFormData();
    } catch (error) {
      console.error("Error adding/editing user:", error);
    }
  };

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

  const handleEdit = (id) => {
    const userToEdit = users.find((user) => user.id === id);
    setFormData({ ...userToEdit });
    setEditingUserId(id);
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
