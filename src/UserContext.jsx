import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const mock_api = "https://6608e76ea2a5dd477b14dbe1.mockapi.io/users";
const UserContext = createContext();

export const UserProvider = ({ children }) => {
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
        resetFormData();
      } else {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              const updatedFormData = {
                ...formData,
                address: {
                  ...formData.address,
                  geo: {
                    lat: latitude,
                    lng: longitude,
                  },
                },
              };
              setFormData(updatedFormData);
              // Update the local users state
              axios
                .post(mock_api, updatedFormData)
                .then((response) => {
                  setUsers([
                    ...users,
                    {
                      ...response.data,
                      address: {
                        ...response.data.address,
                        geo: { lat: latitude, lng: longitude },
                      },
                    },
                  ]);
                  resetFormData();
                })
                .catch((error) => {
                  console.error("Error adding user:", error);
                });
            },
            (error) => {
              console.error("Error getting location:", error);
              // If location access is denied or Geolocation API is not supported, set lat and lng to 0
              const updatedFormData = {
                ...formData,
                address: {
                  ...formData.address,
                  geo: {
                    lat: 0,
                    lng: 0,
                  },
                },
              };
              setFormData(updatedFormData);
              // Update the local users state with lat and lng as 0
              axios
                .post(mock_api, updatedFormData)
                .then((response) => {
                  setUsers([
                    ...users,
                    {
                      ...response.data,
                      address: {
                        ...response.data.address,
                        geo: { lat: 0, lng: 0 },
                      },
                    },
                  ]);
                  resetFormData();
                })
                .catch((error) => {
                  console.error("Error adding user:", error);
                });
            }
          );
        } else {
          console.error("Geolocation is not supported by this browser.");
          // If Geolocation API is not supported, set lat and lng to 0
          const updatedFormData = {
            ...formData,
            address: {
              ...formData.address,
              geo: {
                lat: 0,
                lng: 0,
              },
            },
          };
          setFormData(updatedFormData);
          // Update the local users state with lat and lng as 0
          axios
            .post(mock_api, updatedFormData)
            .then((response) => {
              setUsers([
                ...users,
                {
                  ...response.data,
                  address: {
                    ...response.data.address,
                    geo: { lat: 0, lng: 0 },
                  },
                },
              ]);
              resetFormData();
            })
            .catch((error) => {
              console.error("Error adding user:", error);
            });
        }
      }
    } catch (error) {
      console.error("Error adding/editing user:", error);
    }
  };

  // clearing form after adding or editing
  const resetFormData = () => {
    setEditingUserId(null);
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
