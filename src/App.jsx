import React, { useState, useEffect } from "react";
import axios from "axios";
import Tr from "./components/Tr";
import UserInput from "./components/UserInput";

const API_URL = "https://jsonplaceholder.typicode.com/users";

function App() {
  const [editmode, seteditmode] = useState(false);
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
    if (name.startsWith("address.")) {
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [name.split(".")[1]]: value,
        },
      });
    } else if (name.startsWith("company.")) {
      setFormData({
        ...formData,
        company: {
          ...formData.company,
          [name.split(".")[1]]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
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
    } catch (error) {
      console.error("Error adding/editing user:", error);
    }
  };

  const handleEdit = (id) => {
    const userToEdit = users.find((user) => user.id === id);
    setFormData({ ...userToEdit });
    setEditingUserId(id);
    seteditmode(true);
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
      <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl text-center">
        User Management
      </h1>
      <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
        <UserInput
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <UserInput
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <UserInput
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <UserInput
          label="Website"
          name="website"
          value={formData.website}
          onChange={handleChange}
        />
        <UserInput
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />

        <div class="grid md:grid-cols-2 md:gap-6">
          <UserInput
            label="Street"
            name="address.street"
            value={formData.address.street}
            onChange={handleChange}
          />
          <UserInput
            label="Suite"
            name="address.suite"
            value={formData.address.suite}
            onChange={handleChange}
          />
        </div>
        <div class="grid md:grid-cols-2 md:gap-6">
          <UserInput
            label="City"
            name="address.city"
            value={formData.address.city}
            onChange={handleChange}
          />
          <UserInput
            label="ZipCode"
            name="address.zipcode"
            value={formData.address.zipcode}
            onChange={handleChange}
          />
        </div>

        <div class="grid md:grid-cols-2 md:gap-6">
          <UserInput
            label="Company"
            name="company.name"
            value={formData.company.name}
            onChange={handleChange}
          />
          <UserInput
            label="About Company"
            name="company.catchPhrase"
            value={formData.company.catchPhrase}
            onChange={handleChange}
          />
        </div>
        {editmode && (
          <a
            class="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-10"
            href={`https://www.google.com/maps/@${formData.address.geo.lat},${formData.address.geo.lng},3z?entry=ttu`}
          >
            Location
          </a>
        )}

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {editingUserId ? "Update User" : "Add User"}
        </button>
      </form>
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-20">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">
                Full Name
              </th>
              <th scope="col" class="px-6 py-3">
                User Name
              </th>
              <th scope="col" class="px-6 py-3">
                Phone
              </th>
              <th scope="col" class="px-6 py-3">
                E-mail
              </th>
              <th scope="col" class="px-6 py-3">
                <span class="sr-only">Edit</span>
              </th>
              <th scope="col" class="px-6 py-3">
                <span class="sr-only">Delete</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <Tr
                key={user.id}
                user={user}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
