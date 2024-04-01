import React, { useContext } from "react";
import UserInput from "../components/UserInput";
import UserContext from "../UserContext";
import { NavLink } from "react-router-dom";

const Form = () => {
  const { editingUserId, formData, handleSubmit } = useContext(UserContext);
  return (
    <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
      <UserInput label="Name" name="name" value={formData.name} />
      <UserInput label="Email" name="email" value={formData.email} />
      <UserInput label="Phone" name="phone" value={formData.phone} />
      <UserInput label="Website" name="website" value={formData.website} />
      <UserInput label="Username" name="username" value={formData.username} />

      <div class="grid md:grid-cols-2 md:gap-6">
        <UserInput
          label="Street"
          name="address.street"
          value={formData.address.street}
        />
        <UserInput
          label="Suite"
          name="address.suite"
          value={formData.address.suite}
        />
      </div>
      <div class="grid md:grid-cols-2 md:gap-6">
        <UserInput
          label="City"
          name="address.city"
          value={formData.address.city}
        />
        <UserInput
          label="ZipCode"
          name="address.zipcode"
          value={formData.address.zipcode}
        />
      </div>

      <div class="grid md:grid-cols-2 md:gap-6">
        <UserInput
          label="Company"
          name="company.name"
          value={formData.company.name}
        />

        <UserInput
          label="Company Bs"
          name="company.bs"
          value={formData.company.bs}
        />
      </div>
      <UserInput
        label="About Company"
        name="company.catchPhrase"
        value={formData.company.catchPhrase}
      />
      {editingUserId && (
        <a
          class="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-10"
          href={`https://www.google.com/maps/@${formData.address.geo.lat},${formData.address.geo.lng},15z?entry=ttu`}
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
  );
};

export default Form;
