import React, { useState } from "react";

/* component that renders a form for editing and adding a user's info 
user is object containing existing user data, used to populate form fields
onSubmit is a callback provided by the parent component, gets called with
  the updated user data when the form is submitted */
const UserForm = ({ user = {}, onSubmit }) => {
  /* manages form state for the user's name and address  
      if value on left side is null or undefined, provides a default value */
  const [name, setName] = useState(user.name || "");
  const [address, setAddress] = useState(user.address || "");

  const handleSubmit = (e) => {
    // prevents page reload
    e.preventDefault();
    /* stops the event from bubbling up or capturing 
        down through the DOM tree */
    // event.stopPropagation();

    /* passes the form data object (name and address) to a parent component
        via the onSubmit callback */
    onSubmit({
      name,
      address,
    });
  };

  return (
    // handleSubmit is triggered when the form is submitted
    <form onSubmit={handleSubmit}>
      <input
        data-testid="name-input"
        type="text"
        /* ensures the form fields for name and address are controlled 
            components, with their values managed by React state */
        value={name}
        // onChange updates the state when user types in the input field
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        data-testid="address-input"
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Address"
      />
      {/* submits the form, triggering onSubmit event handler */}
      <button data-testid="submit-button" type="submit">
        Submit
      </button>
    </form>
  );
};

export default UserForm;
