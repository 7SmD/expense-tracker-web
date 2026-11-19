"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type FormState =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "error"; message: string; details?: string[] };

type RegisterErrorResponse = {
  error?: string;
  details?: { path: string | (string | number)[]; message: string }[];
};

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [form, setForm] = useState<FormState>({ state: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setForm({ state: "loading" });
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/login");
        return;
      }

      const data: RegisterErrorResponse = await res
        .json()
        .catch((): RegisterErrorResponse => ({}));
      setForm({
        state: "error",
        message: data.error ?? "Something went wrong",
        ...(res.status === 400 && Array.isArray(data.details)
          ? {
              details: data.details.map(
                ({ path, message }) =>
                  `${Array.isArray(path) ? path.join(".") : path}: ${message}`,
              ),
            }
          : {}),
      });
    } catch (error: unknown) {
      console.error("Register request failed:", error);
      setForm({
        state: "error",
        message: "Could not reach the server, try again",
      });
    }
  }

  return (
    <main>
      <h1>Create account</h1>
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
          autoComplete="new-password"
          id="password"
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          minLength={8}
          maxLength={72}
          required
          type="password"
          value={password}
        />
        <button disabled={form.state === "loading"} type="submit">
          {form.state === "loading" ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p>
        Already have an account? <Link href="/login">Log in</Link>
      </p>
      {form.state === "error" && (
        <div role="alert">
          <p>{form.message}</p>
          {form.details && (
            <ul>
              {form.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </main>
  );
}
