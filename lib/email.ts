import { Resend } from "resend";
import { env } from "@/lib/env";
import {
  foundingConfirmEmail,
  seatInviteEmail,
  contactNotificationEmail,
  welcomeEmail,
} from "@/lib/email/templates";

// The email layer.
//
// Every function returns a boolean and never throws. Callers must branch on the
// result and tell the truth: the failure this replaces was a form that showed a
// warm success state while the address went nowhere, and a silent failure is
// worse than a visible one.
//
// Two senders, on two subdomains, on purpose. When a login code is the only way
// into an account, the transactional stream IS the auth system: one spam
// complaint against a newsletter must never be able to route sign-in codes to
// the spam folder.

function getResend(): Resend | null {
  const key = env.resendKey();
  return key ? new Resend(key) : null;
}

type SendArgs = {
  to: string;
  subject: string;
  html: string;
  text: string;
  from: string;
  replyTo?: string;
};

async function send({ to, subject, html, text, from, replyTo }: SendArgs): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    // Deliberately loud in the server log and quiet to the user. The caller
    // surfaces an honest failure rather than a false success.
    console.warn(`[email] RESEND_API_KEY missing; "${subject}" was not sent.`);
    return false;
  }
  try {
    const { error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
      ...(replyTo ? { replyTo } : {}),
    });
    if (error) {
      console.error(`[email] send failed for "${subject}": ${error.message}`);
      return false;
    }
    return true;
  } catch (e) {
    console.error(`[email] threw for "${subject}": ${e instanceof Error ? e.message : "unknown"}`);
    return false;
  }
}

export async function sendFoundingConfirm({
  to,
  confirmUrl,
}: {
  to: string;
  confirmUrl: string;
}): Promise<boolean> {
  const { html, text } = foundingConfirmEmail({ confirmUrl });
  return send({
    to,
    subject: "Please confirm your place on the founding list",
    html,
    text,
    from: env.fromTransactional(),
  });
}

/** Signature is depended on by app/actions/seat.ts. Do not change it casually. */
export async function sendSeatInvite({
  to,
  inviteUrl,
  inviterName,
}: {
  to: string;
  inviteUrl: string;
  inviterName: string;
}): Promise<boolean> {
  const { html, text } = seatInviteEmail({ inviteUrl, inviterName });
  return send({
    to,
    subject: `${inviterName} has saved you a seat`,
    html,
    text,
    from: env.fromTransactional(),
  });
}

export async function sendContactNotification({
  topic,
  body,
  replyTo,
}: {
  topic: string;
  body: string;
  replyTo?: string;
}): Promise<boolean> {
  const team = env.teamEmail();
  if (!team) {
    console.warn("[email] EMAIL_TO_TEAM missing; a contact message could not be delivered.");
    return false;
  }
  const { html, text } = contactNotificationEmail({ topic, body, replyTo });
  return send({
    to: team,
    subject: `New message: ${topic}`,
    html,
    text,
    from: env.fromTransactional(),
    replyTo,
  });
}

export async function sendWelcome({ to, name }: { to: string; name?: string | null }) {
  const { html, text } = welcomeEmail({ name: name ?? null });
  return send({
    to,
    subject: "Welcome to the Inner Garden",
    html,
    text,
    from: env.fromTransactional(),
  });
}
