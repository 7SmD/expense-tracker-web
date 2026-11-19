"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type FormState =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "error"; message: string };

type LoginErrorResponse = {
  error?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [form, setForm] = useState<FormState>({ state: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setForm({ state: "loading" });
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/expenses");
        return;
      }

      const data: LoginErrorResponse = await res
        .json()
        .catch((): LoginErrorResponse => ({}));
      setForm({
        state: "error",
        message: data.error ?? "Something went wrong",
      });
    } catch (error: unknown) {
      console.error("Login request failed:", error);
      setForm({
        state: "error",
        message: "Could not reach the server, try again",
      });
    }
  }

  return (
    <main>
      <h1>Log in</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="email">Email</label>
        <input
          autoComplete="email"
          id="email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
        <label htmlFor="password">Password</label>
        <input
          autoComplete="current-password"
          id="password"
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
        <button disabled={form.state === "loading"} type="submit">
          {form.state === "loading" ? "Logging in..." : "Log in"}
        </button>
      </form>
      <p>
        Don&apos;t have an account? <Link href="/register">Create account</Link>
      </p>
      {form.state === "error" && <p role="alert">{form.message}</p>}
    </main>
  );
}
