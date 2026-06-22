import { useAuth } from "../../hooks/useAuth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import React from "react";
import { useServiceWorker } from "@/hooks/userServiceWorker";
import UserList from "./UserList";

export function Dashboard() {
  const { user } = useAuth();
  const [users, setUsers] = React.useState<any[]>([]);
  const { isOnline } = useServiceWorker();
  console.log("Dashboard online status:", isOnline);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched users:", data);
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const filteredUsers = React.useMemo(
    () => users.filter((user) => user.name.toLowerCase().includes("c")),
    [users],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
      </div>
      <button
        onClick={() => setCount((count) => count + 1)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Increment Count: {count}
      </button>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your starter kit is ready. Start building your features here.
            </p>
          </CardContent>
        </Card>
        <UserList users={filteredUsers} />
      </div>
    </div>
  );
}
