import { NextResponse } from "next/server";

interface ContactData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

function validate(data: unknown): ContactData | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;

  const name = typeof d.name === "string" ? d.name.trim() : "";
  const email = typeof d.email === "string" ? d.email.trim() : "";
  const phone = typeof d.phone === "string" ? d.phone.trim() : "";
  const subject = typeof d.subject === "string" ? d.subject.trim() : "";
  const message = typeof d.message === "string" ? d.message.trim() : "";

  if (!name || !email || !subject || !message) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  if (name.length > 200 || email.length > 200 || subject.length > 500 || message.length > 5000) return null;

  return { name, email, phone, subject, message };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const data = validate(body);

  if (!data) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL || "contact@happysalary.ch";

  if (!apiKey) {
    console.error("RESEND_API_KEY not configured");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: `HappySalary Contact <noreply@happysalary.ch>`,
        to: [contactEmail],
        reply_to: data.email,
        subject: `[Contact] ${data.subject}`,
        html: `
          <h2>Nouveau message de contact</h2>
          <p><strong>Nom :</strong> ${data.name}</p>
          <p><strong>Email :</strong> ${data.email}</p>
          ${data.phone ? `<p><strong>Téléphone :</strong> ${data.phone}</p>` : ""}
          <p><strong>Sujet :</strong> ${data.subject}</p>
          <hr />
          <p>${data.message.replace(/\n/g, "<br />")}</p>
        `,
      }),
    });

    if (!res.ok) {
      console.error("Resend API error:", await res.text());
      return NextResponse.json({ error: "Email sending failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err instanceof Error ? err.message : "Unknown");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
