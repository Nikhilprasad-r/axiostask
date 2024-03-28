import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com/users";

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

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
    setFormData({ ...formData, [name]: value });
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
      setFormData({ name: "", email: "", phone: "" });
    } catch (error) {
      console.error("Error adding/editing user:", error);
    }
  };

  const handleEdit = (id) => {
    const userToEdit = users.find((user) => user.id === id);
    setFormData({ ...userToEdit });
    setEditingUserId(id);
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
    <div>
      <h1>User Management</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder=""
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        />
        <label
          for="name"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Name
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder=""
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        />
        <label
          for="email"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Email
        </label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
        />
        <button type="submit">
          {editingUserId ? "Update User" : "Add User"}
        </button>
      </form>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email} - {user.phone}
            <button onClick={() => handleEdit(user.id)}>Edit</button>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
