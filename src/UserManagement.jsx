import React from "react";

/* component that manages the users data by leveraging state to control the form and
  table dynamically 
it's modular, reusable, and easy to extend with additional functionality like
  search and filter
users is an array of user objects
onAdd is callback to handle adding a new user
onDelete is callback to handler deleting a user by index
onEdit is callback to handle editing an existing user's data */
const UserManagement = ({ users, onAdd, onEdit, onDelete }) => {
  return (
    <div>
      {/* opens the form adding a new user when clicked by setting formOpen to true */}
      <button data-testid="addUser" onClick={onAdd}>
        Add User
      </button>
      {users.map((user, index) => (
        <div key={index} data-testid={`user-${index}`}>
          <span>{user.name}</span> - <span>{user.address}</span>
          <button
            data-testid={`editUser-${index}`}
            onClick={() => onEdit(index)}
          >
            Edit
          </button>
          {/* calls onDelete with the index of the user to be deleted */}
          <button
            data-testid={`deleteUser-${index}`}
            onClick={() => onDelete(index)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserManagement;
