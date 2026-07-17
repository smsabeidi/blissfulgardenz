"use server";

// Phase-1 form stubs with their final signatures (CEO review S10-3): schema-
// validated input, discriminated Result, body-swap wiring at the platform phase.
//
// PRIVACY RULING (design review D11, PRD §12.3): these actions never log or
// persist message bodies, names, or emails. Receipt metadata only. Submissions
// are acknowledged honestly as "received for the founding period" and the
// wiring status is documented in the handoff notes.

export type FormResult =
  | { status: "ok" }
  | { status: "invalid"; errors: Record<string, string> }
  | { status: "failed" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function joinFoundingList(
  _prev: FormResult | null,
  formData: FormData
): Promise<FormResult> {
  const email = String(formData.get("email") ?? "").trim();
  const context = String(formData.get("context") ?? "general").slice(0, 40);

  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return {
      status: "invalid",
      errors: { email: "That address does not look complete. One more look?" },
    };
  }

  // Receipt metadata only. Never the address itself.
  console.info(`[founding-list] received context=${context} at=${new Date().toISOString()}`);
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
    errors.message = "That is a little long for this box. A shorter note is perfect; there is room for everything else in the conversation itself.";

  if (Object.keys(errors).length > 0) {
    return { status: "invalid", errors };
  }

  // Receipt metadata only (topic + timestamp). Never the body, name, or email.
  console.info(`[contact] received topic=${topic} at=${new Date().toISOString()}`);
  return { status: "ok" };
}
