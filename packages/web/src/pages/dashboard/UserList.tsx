import React from "react";

const UserList = ({ users }: { users: any[] }) => {
  console.log("Rendering UserList with users:", users); // Debug log to check the users prop
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">User List</h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="p-4 border rounded shadow-sm">
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default React.memo(UserList);
