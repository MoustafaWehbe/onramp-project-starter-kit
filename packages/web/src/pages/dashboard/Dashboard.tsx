import { useAuth } from "../../hooks/useAuth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import React from "react";
import { useServiceWorker } from "@/hooks/userServiceWorker";

export function Dashboard() {
  const { user } = useAuth();
  const [users, setUsers] = React.useState<any[]>([]);
  const { isOnline } = useServiceWorker();
  console.log("Dashboard online status:", isOnline);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
      </div>
      {/* print some users */}
      {users.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Users</h2>
          <ul className="list-disc pl-5">
            {users.map((user) => (
              <li key={user.id} className="text-sm text-muted-foreground">
                {user.name} ({user.email})
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Features</h2>
        <p className="text-sm text-muted-foreground">
          Explore the features of your starter kit below.
        </p>
      </div>

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
      </div>
    </div>
  );
}
