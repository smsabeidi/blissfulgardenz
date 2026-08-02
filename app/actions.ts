"use server";

import { createHash, randomBytes } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendFoundingConfirm, sendContactNotification } from "@/lib/email";
import { env } from "@/lib/env";

// SUPERSEDES the phase-1 "persist nothing" ruling (design review D11, PRD §12.3).
//
// That ruling was correct for a brochure site with no accounts, and it became
// harmful the moment the forms went live: an address was validated, a warm
// success state was shown, and the address was thrown away. Real people asked to
// be told when the Garden opened and were silently dropped, and the monthly
// letter promised on the same screen had no list to send to.
//
// The replacement principle is narrower than "log nothing" and stronger than
// "store everything": STORE THE MINIMUM NEEDED TO KEEP THE PROMISE THAT WAS MADE
// ON THE SCREEN, AND NOTHING ELSE.
//   - Founding list: the address is the promise, so it is stored, with double
//     opt-in and a consent timestamp. It is still never written to a log line.
//   - Contact: the promise is "a person will read this", so the message is
//     emailed to the team and never persisted to the database at all.
// If a dependency is unconfigured we return failed. A false success is the one
// outcome this file exists to prevent.

export type FormResult =
  | { status: "ok" }
  | { status: "invalid"; errors: Record<string, string> }
  | { status: "failed" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function joinFoundingList(
  _prev: FormResult | null,
  formData: FormData
): Promise<FormResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const context = String(formData.get("context") ?? "general").slice(0, 40);

  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return {
      status: "invalid",
      errors: { email: "That address does not look complete. One more look?" },
    };
  }

  const admin = createAdminClient();
  if (!admin) {
    console.error("[founding-list] Supabase is not configured; the address was NOT stored.");
    return { status: "failed" };
  }

  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");

  // Upsert, so a second signup from the same person is not an error and does not
  // disclose that the address is already known.
  const { error } = await admin.from("founding_list").upsert(
    {
      email,
      source: context,
      confirm_token_hash: tokenHash,
    },
    { onConflict: "email" }
  );

  if (error) {
    console.error(`[founding-list] write failed: ${error.message}`);
    return { status: "failed" };
  }

  const confirmUrl = `${env.siteUrl()}/api/founding/confirm?token=${token}&email=${encodeURIComponent(email)}`;
  const sent = await sendFoundingConfirm({ to: email, confirmUrl });

  // The row exists either way, so the list is never lost. But if the
  // confirmation could not go out, the person will never see it arrive, and
  // saying "check your email" would be a lie.
  if (!sent) return { status: "failed" };

  console.info(`[founding-list] stored + confirmation sent, source=${context}`);
  return { status: "ok" };
}

export async function sendContactMessage(
  _prev: FormResult | null,
  formData: FormData
): Promise<FormResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const topic = String(formData.get("topic") ?? "general").slice(0, 40);
  const message = String(formData.get("message") ?? "").trim();

  const errors: Record<string, string> = {};
  if (!name) errors.name = "We would love to know what to call you.";
  if (!email || !EMAIL_RE.test(email) || email.length > 254)
    errors.email = "That address does not look complete. One more look?";
  if (!message) errors.message = "The message box is still empty.";
  if (message.length > 4000)
    errors.message =
      "That is a little long for this box. A shorter note is perfect; there is room for everything else in the conversation itself.";

  if (Object.keys(errors).length > 0) {
    return { status: "invalid", errors };
  }

  // Delivered to a human, never written to the database. Someone describing a
  // marriage in difficulty did not consent to a permanent record of it.
  const delivered = await sendContactNotification({
    topic,
    body: `From: ${name} <${email}>\n\n${message}`,
    replyTo: email,
  });

  if (!delivered) {
    console.error("[contact] delivery failed; the sender was told honestly.");
    return { status: "failed" };
  }

  console.info(`[contact] delivered topic=${topic}`);
  return { status: "ok" };
}

// ── Conversation requests ────────────────────────────────────────────────────
//
// The same principle as above, applied to booking: the promise on the screen is
// "we will write back and arrange a time", so what is stored is exactly what
// keeping that promise needs — a name, a way to reply, which path, whether they
// are coming alone, and when they are free.
//
// There is deliberately NO field for what they are going through. The contact
// form's rule still holds: nobody describing a marriage in difficulty gets a
// permanent row about it. This is a diary entry, not a case file.
//
// Written through the service role rather than a public insert policy, so the
// table has exactly one door and validation happens before anything reaches it.

const PATHS = ["premarital", "marital", "rebuilding", "unsure"] as const;
const ATTENDING = ["together", "alone"] as const;

export async function requestConversation(
  _prev: FormResult | null,
  formData: FormData
): Promise<FormResult> {
  const name = String(formData.get("name") ?? "").trim().slice(0, 120);
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const path = String(formData.get("path") ?? "unsure");
  const attending = String(formData.get("attending") ?? "alone");
  const availability = String(formData.get("availability") ?? "").trim().slice(0, 400);
  const timezone = String(formData.get("timezone") ?? "").trim().slice(0, 80);

  const errors: Record<string, string> = {};
  if (!name) errors.name = "We would love to know what to call you.";
  if (!email || !EMAIL_RE.test(email) || email.length > 254)
    errors.email = "That address does not look complete. One more look?";
  if (!(PATHS as readonly string[]).includes(path)) errors.path = "Please choose one.";
  if (!(ATTENDING as readonly string[]).includes(attending))
    errors.attending = "Please choose one.";
  if (Object.keys(errors).length > 0) return { status: "invalid", errors };

  const admin = createAdminClient();
  if (!admin) {
    // Never a warm success on a dropped request. This is the failure the whole
    // file exists to prevent.
    console.error("[conversation-request] Supabase unconfigured; the request was NOT stored.");
    return { status: "failed" };
  }

  const { error } = await admin.from("conversation_requests").insert({
    name,
    email,
    path,
    attending,
    availability: availability || null,
    timezone: timezone || null,
  });

  if (error) {
    console.error(`[conversation-request] write failed: ${error.message}`);
    return { status: "failed" };
  }

  // Best effort only. The request is already safely stored, so a missing email
  // provider must not turn a saved request into a reported failure.
  void sendContactNotification({
    topic: "conversation-request",
    body: `New conversation request.\n\nName: ${name}\nEmail: ${email}\nPath: ${path}\nAttending: ${attending}\nAvailability: ${availability || "not given"}\nTime zone: ${timezone || "not given"}`,
    replyTo: email,
  });

  console.info(`[conversation-request] stored path=${path}`);
  return { status: "ok" };
}
