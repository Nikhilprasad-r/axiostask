import React, { useContext } from "react";
import UserContext from "../UserContext";
import { Link } from "react-router-dom";

const Tr = ({ user }) => {
  const { handleEdit, handleDelete } = useContext(UserContext);
  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {user.name}
      </th>
      <td className="px-6 py-4">{user.username}</td>
      <td className="px-6 py-4">{user.phone}</td>
      <td className="px-6 py-4">{user.email}</td>
      <td className="px-6 py-4 text-right">
        <Link
          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
          onClick={() => handleEdit(user.id)}
          to="create"
        >
          View/Edit
        </Link>
      </td>
      <td className="px-6 py-4 text-right">
        <button
          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
          onClick={() => handleDelete(user.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default Tr;
