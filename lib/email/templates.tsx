// Email bodies. Plain, warm, and deliberately primitive.
//
// Email clients are a hostile rendering environment, so there are no images, no
// web fonts, no dark-mode trickery, and no layout that breaks if CSS is dropped.
// Georgia stands in for the brand serif because it is present nearly everywhere;
// the two brand colours appear only as flat hex on text and borders.
// Every message ships a real text alternative, which is both an accessibility
// requirement and the single biggest lever on deliverability.

const GREEN = "#0F2E22";
const GOLD = "#C9A227";
const INK = "#1E2B24";
const MUTED = "#56675C";
const CANVAS = "#F7F4EC";

type Body = { html: string; text: string };

function shell(innerHtml: string, footerNote?: string): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${CANVAS};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CANVAS};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFDF6;border:1px solid rgba(15,46,34,0.14);border-radius:16px;padding:32px;">
        <tr><td style="font-family:Georgia,'Times New Roman',serif;color:${GREEN};font-size:20px;letter-spacing:-0.01em;padding-bottom:20px;">
          blissful <em style="color:${GOLD};">gardenz</em>
        </td></tr>
        <tr><td style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:${INK};font-size:16px;line-height:1.65;">
          ${innerHtml}
        </td></tr>
      </table>
      ${
        footerNote
          ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;padding:16px 8px 0;">
        <tr><td style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:${MUTED};font-size:12px;line-height:1.6;">${footerNote}</td></tr>
      </table>`
          : ""
      }
    </td></tr>
  </table>
</body></html>`;
}

function button(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:${GREEN};color:${CANVAS};text-decoration:none;padding:14px 26px;border-radius:999px;font-size:15px;font-weight:500;">${label}</a>`;
}

export function foundingConfirmEmail({ confirmUrl }: { confirmUrl: string }): Body {
  return {
    html: shell(
      `<p style="margin:0 0 16px;">Thank you for asking to join the founding list.</p>
       <p style="margin:0 0 24px;">One confirmation and you are on it. We will write when the Garden is ready, and not before.</p>
       <p style="margin:0 0 24px;">${button(confirmUrl, "Confirm my place")}</p>
       <p style="margin:0;color:${MUTED};font-size:14px;">If the button does not work, paste this into your browser:<br>${confirmUrl}</p>`,
      "You are receiving this because someone entered this address on blissfulgardenz.com. If that was not you, ignore this message and nothing further will be sent."
    ),
    text: `Thank you for asking to join the founding list.

One confirmation and you are on it. We will write when the Garden is ready, and not before.

Confirm your place: ${confirmUrl}

If that was not you, ignore this message and nothing further will be sent.`,
  };
}

export function seatInviteEmail({
  inviteUrl,
  inviterName,
}: {
  inviteUrl: string;
  inviterName: string;
}): Body {
  return {
    html: shell(
      `<p style="margin:0 0 16px;">${inviterName} has saved you a seat in the Inner Garden.</p>
       <p style="margin:0 0 24px;">You will share the films, the guides, and the gatherings. Anything you write stays private to you, including from ${inviterName}.</p>
       <p style="margin:0 0 24px;">${button(inviteUrl, "Take my seat")}</p>
       <p style="margin:0;color:${MUTED};font-size:14px;">This invitation is good for seven days. If the button does not work, paste this into your browser:<br>${inviteUrl}</p>`,
      "If you were not expecting this, you can ignore it and no account will be created."
    ),
    text: `${inviterName} has saved you a seat in the Inner Garden.

You will share the films, the guides, and the gatherings. Anything you write stays private to you, including from ${inviterName}.

Take your seat: ${inviteUrl}

This invitation is good for seven days. If you were not expecting this, ignore it.`,
  };
}

export function contactNotificationEmail({
  topic,
  body,
  replyTo,
}: {
  topic: string;
  body: string;
  replyTo?: string;
}): Body {
  const safe = body.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return {
    html: shell(
      `<p style="margin:0 0 8px;color:${MUTED};font-size:13px;">New message</p>
       <p style="margin:0 0 16px;font-size:18px;">${topic}</p>
       <div style="border-left:2px solid ${GOLD};padding-left:14px;white-space:pre-wrap;">${safe}</div>
       ${replyTo ? `<p style="margin:20px 0 0;color:${MUTED};font-size:14px;">Reply to: ${replyTo}</p>` : ""}`
    ),
    text: `New message: ${topic}\n\n${body}${replyTo ? `\n\nReply to: ${replyTo}` : ""}`,
  };
}

export function welcomeEmail({ name }: { name: string | null }): Body {
  const greeting = name ? `Welcome, ${name}.` : "Welcome.";
  return {
    html: shell(
      `<p style="margin:0 0 16px;">${greeting}</p>
       <p style="margin:0 0 24px;">The garden is open to you. Start wherever you like: nothing here expects you to begin at the beginning.</p>
       <p style="margin:0 0 24px;">${button("https://blissfulgardenz.com/garden", "Enter the garden")}</p>
       <p style="margin:0;color:${MUTED};font-size:14px;">If you share your membership, you can save a seat for someone from your account page at any time.</p>`,
      "Harmony conversations are educational and supportive, not medical care or licensed counseling."
    ),
    text: `${greeting}

The garden is open to you. Start wherever you like: nothing here expects you to begin at the beginning.

Enter the garden: https://blissfulgardenz.com/garden

Harmony conversations are educational and supportive, not medical care or licensed counseling.`,
  };
}
