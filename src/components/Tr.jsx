import React from "react";

const Tr = ({ user, handleEdit, handleDelete }) => {
  return (
    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
      <th
        scope="row"
        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {user.name}
      </th>
      <td class="px-6 py-4">{user.username}</td>
      <td class="px-6 py-4">{user.phone}</td>
      <td class="px-6 py-4">{user.email}</td>
      <td class="px-6 py-4 text-right">
        <button
          class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
          onClick={() => handleEdit(user.id)}
        >
          View/Edit
        </button>
      </td>
      <td class="px-6 py-4 text-right">
        <button
          class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
          onClick={() => handleDelete(user.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default Tr;
