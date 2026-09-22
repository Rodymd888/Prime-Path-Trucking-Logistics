import { NextResponse } from "next/server";
import { site } from "@/lib/site";
export const runtime = "nodejs";
const services = new Set([
  "Dedicated trucking",
  "Regional truckload",
  "Power-only",
  "Let’s discuss my needs",
]);
const frequencies = new Set([
  "To be discussed",
  "One-time shipment",
  "Daily",
  "Weekly",
  "Recurring / contract",
]);
const limits: Record<string, number> = {
  name: 120,
  company: 160,
  email: 254,
  phone: 40,
  origin: 120,
  destination: 120,
  service: 80,
  frequency: 80,
  date: 20,
  details: 3000,
  consent: 10,
  website: 200,
};

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  // Use the incoming Host so the same check works behind Vercel's reverse proxy.
  if (origin) {
    try {
      const source = new URL(origin);
      const host = request.headers.get("host") || new URL(request.url).host;
      if (
        source.host !== host ||
        !["https:", "http:"].includes(source.protocol)
      )
        throw new Error();
    } catch {
      return NextResponse.json(
        { error: "Please submit from the Prime Path website." },
        { status: 403 },
      );
    }
  }
  if (!request.headers.get("content-type")?.includes("application/json"))
    return NextResponse.json(
      { error: "Please use the freight request form." },
      { status: 415 },
    );
  if (Number(request.headers.get("content-length") || 0) > 16000)
    return NextResponse.json(
      { error: "Please shorten your freight details." },
      { status: 413 },
    );
  let input: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > 16000)
      return NextResponse.json(
        { error: "Please shorten your freight details." },
        { status: 413 },
      );
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value))
      throw new Error();
    input = value as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { error: "We couldn’t read your request. Please try again." },
      { status: 400 },
    );
  }
  const data: Record<string, string> = {};
  for (const [key, max] of Object.entries(limits)) {
    const value = input[key];
    if (value !== undefined && typeof value !== "string")
      return NextResponse.json(
        { error: "Please check the form details." },
        { status: 400 },
      );
    data[key] = typeof value === "string" ? value.trim() : "";
    if (data[key].length > max)
      return NextResponse.json(
        { error: "One of your entries is too long." },
        { status: 400 },
      );
  }
  if (data.website) return NextResponse.json({ mode: "email-draft" });
  if (
    !data.name ||
    !data.company ||
    !data.origin ||
    !data.destination ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ||
    !services.has(data.service) ||
    !frequencies.has(data.frequency) ||
    data.consent !== "on"
  )
    return NextResponse.json(
      { error: "Please complete the required fields and contact consent." },
      { status: 400 },
    );
  if (data.date && !/^\d{4}-\d{2}-\d{2}$/.test(data.date))
    return NextResponse.json(
      { error: "Please check the pickup date." },
      { status: 400 },
    );
  if (!process.env.RESEND_API_KEY || !process.env.QUOTE_FROM_EMAIL)
    return NextResponse.json({ mode: "email-draft" });
  const text = [
    "PRIME PATH — FREIGHT INQUIRY",
    "",
    `Name: ${data.name}`,
    `Company: ${data.company}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "Not provided"}`,
    "",
    `Origin: ${data.origin}`,
    `Destination: ${data.destination}`,
    `Service: ${data.service}`,
    `Frequency: ${data.frequency}`,
    `Target pickup: ${data.date || "To be discussed"}`,
    "",
    `Freight details: ${data.details || "To be discussed"}`,
    "",
    "The sender consented to be contacted about this inquiry.",
  ].join("\n");
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.QUOTE_FROM_EMAIL,
        to: [process.env.QUOTE_TO_EMAIL || site.email],
        reply_to: data.email,
        subject: `Freight inquiry: ${data.origin.replace(/[\r\n]/g, " ")} to ${data.destination.replace(/[\r\n]/g, " ")}`,
        text,
      }),
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) throw new Error();
    return NextResponse.json({ sent: true });
  } catch {
    return NextResponse.json(
      {
        error:
          "We couldn’t send automatically. Use the prepared email or call us directly.",
      },
      { status: 502 },
    );
  }
}
