import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [childName, setChildName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("new"); // 'new' for new user creation
  const [editingUserId, setEditingUserId] = useState(null); // To track parent user edits
  const [editingChildId, setEditingChildId] = useState(null); // To track child edits

  // Load users from localStorage on component mount
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
  }, []);

  // Save users to localStorage whenever users array changes
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  // Function to generate sequential user ID based on the number of users
  const generateSequentialId = () => {
    return users.length ? users[users.length - 1].id + 1 : 1;
  };

  // Function to generate sequential child ID
  const generateChildId = (children) => {
    return children.length ? children[children.length - 1].id + 1 : 1;
  };

  // Add new parent user or update an existing one
  const handleUserSubmit = (e) => {
    e.preventDefault();

    if (editingUserId) {
      // Update existing user
      const updatedUsers = users.map((user) =>
        user.id === editingUserId ? { ...user, name, email } : user
      );
      setUsers(updatedUsers);
      setEditingUserId(null);
    } else {
      // Create new user
      const newUser = {
        id: generateSequentialId(),
        name,
        email,
        children: [], // Initialize with no children
      };
      setUsers([...users, newUser]);
    }

    setName("");
    setEmail("");
    setSelectedUserId("new"); // Reset to 'new' after submission
  };

  // Add new child or update an existing child
  const handleChildSubmit = (e) => {
    e.preventDefault();

    if (editingChildId) {
      // Update existing child
      const updatedUsers = users.map((user) => {
        if (user.id === Number(selectedUserId)) {
          const updatedChildren = user.children.map((child) =>
            child.id === editingChildId ? { ...child, name: childName } : child
          );
          return { ...user, children: updatedChildren };
        }
        return user;
      });
      setUsers(updatedUsers);
      setEditingChildId(null);
    } else {
      // Add new child to existing user
      const updatedUsers = users.map((user) => {
        if (user.id === Number(selectedUserId)) {
          const newChild = {
            id: generateChildId(user.children),
            name: childName,
          };
          return { ...user, children: [...user.children, newChild] };
        }
        return user;
      });
      setUsers(updatedUsers);
    }

    setChildName("");
  };

  // Handle parent user edit
  const handleEditUser = (id) => {
    const userToEdit = users.find((user) => user.id === id);
    setName(userToEdit.name);
    setEmail(userToEdit.email);
    setEditingUserId(id);
    setSelectedUserId(id); // Automatically select user in dropdown
  };

  // Handle child edit
  const handleEditChild = (parentId, childId) => {
    const user = users.find((user) => user.id === parentId);
    const childToEdit = user.children.find((child) => child.id === childId);
    setChildName(childToEdit.name);
    setEditingChildId(childId);
    setSelectedUserId(parentId); // Ensure parent user is selected
  };

  // Handle parent user delete
  const handleDeleteUser = (id) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
  };

  // Handle child delete
  const handleDeleteChild = (parentId, childId) => {
    const updatedUsers = users.map((user) => {
      if (user.id === parentId) {
        const updatedChildren = user.children.filter(
          (child) => child.id !== childId
        );
        return { ...user, children: updatedChildren };
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  return (
    <div className="app-container">
      <h1>User and Children CRUD with LocalStorage</h1>

      {/* Dropdown to select existing user or create new one */}
      <div className="dropdown-container">
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          <option value="new">Create New User</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.id}. {user.name}
            </option>
          ))}
        </select>
      </div>

      {/* Form to add or update a user */}
      <form className="form-container" onSubmit={handleUserSubmit}>
        <div>
          <input
            type="text"
            placeholder="User Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="User Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          {editingUserId ? "Update User" : "Add User"}
        </button>
      </form>

      {/* Form to add or update a child if a user is selected */}
      {selectedUserId !== "new" && (
        <form className="form-container" onSubmit={handleChildSubmit}>
          <div>
            <input
              type="text"
              placeholder="Child Name"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btn">
            {editingChildId ? "Update Child" : "Add Child"}
          </button>
        </form>
      )}

      <h2>User List with Children</h2>
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id} className="user-item">
            <span className="user-info">
              {user.id}. {user.name} - {user.email}
            </span>
            <div className="user-actions">
              <button
                className="edit-btn"
                onClick={() => handleEditUser(user.id)}
              >
                Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDeleteUser(user.id)}
              >
                Delete
              </button>
            </div>

            {/* Display children if they exist */}
            {user.children.length > 0 && (
              <ul className="children-list">
                {user.children.map((child) => (
                  <li key={child.id} className="child-item">
                    Child: {child.name}
                    <div className="child-actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEditChild(user.id, child.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteChild(user.id, child.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
