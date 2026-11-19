import { NextResponse } from "next/server";

const apiUrl = process.env.API_URL;
if (!apiUrl) {
  throw new Error("API_URL is not set");
}

export async function POST(request: Request) {
  const body = await request.json();

  const res = await fetch(`${apiUrl}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}
