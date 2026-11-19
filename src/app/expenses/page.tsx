import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LogoutButton from "./logout-button";

const apiUrl = process.env.API_URL;
if (!apiUrl) {
  throw new Error("API_URL is not set");
}

export default async function ExpensesPage() {
  const jar = await cookies();
  const token = jar.get("token")?.value;
  if (!token) {
    redirect("/login");
  }

  const res = await fetch(`${apiUrl}/expenses`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (res.status === 401) {
    redirect("/login");
  }
  if (!res.ok) {
    throw new Error("Could not load expenses");
  }
  const data: { total: number } = await res.json();

  return (
    <main>
      <h1>Your expenses</h1>
      <p>You have {data.total} expenses.</p>
      <LogoutButton />
    </main>
  );
}