import { useState } from "react";
import SectionLabel from "../../components/common/SectionLabel";
// Replace this placeholder with your public contact email.
const CONTACT_EMAIL = "peeyoush1215@gmail.com";
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");
const initialFormData = {
  name: "",
  email: "",
  topic: "",
  message: "",
  website: "",
};

function Contact() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [formStatus, setFormStatus] = useState("idle");

  function handleChange(event) {
    const { name, value } = event.target;
    if (formStatus === "submitting") {
      return;
    }

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    // Remove the old error when the visitor edits that field.
    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));

    setFormStatus("idle");
  }

  function validateForm() {
    const nextErrors = {};

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedName) {
      nextErrors.name = "Please enter your name.";
    } else if (trimmedName.length > 80) {
      nextErrors.name = "Your name must be 80 characters or fewer.";
    }

    if (!trimmedEmail) {
      nextErrors.email = "Please enter your email address.";
    } else if (trimmedEmail.length > 254 || !emailPattern.test(trimmedEmail)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!formData.topic) {
      nextErrors.topic = "Please select a topic.";
    }

    if (!trimmedMessage) {
      nextErrors.message = "Please write a message.";
    } else if (trimmedMessage.length < 20) {
      nextErrors.message =
        "Please provide a little more detail (at least 20 characters).";
    } else if (trimmedMessage.length > 2000) {
      nextErrors.message = "Your message must be 2,000 characters or fewer.";
    }

    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (formStatus === "submitting") {
      return;
    }

    const validationErrors = validateForm();

    setErrors(validationErrors);

    if (Object.values(validationErrors).some(Boolean)) {
      setFormStatus("invalid");
      return;
    }

    setFormStatus("submitting");

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          topic: formData.topic,
          message: formData.message.trim(),
          website: formData.website,
        }),
      });

      let responseBody = null;

      try {
        responseBody = await response.json();
      } catch {
        // Treat a response without valid JSON as a failed submission.
      }

      if (!response.ok || responseBody?.status !== "accepted") {
        throw new Error("The contact request was not accepted.");
      }

      setFormData({ ...initialFormData });
      setErrors({});
      setFormStatus("success");
    } catch (error) {
      console.error("Contact form submission failed:", error);
      setFormStatus("error");
    }
  }

  const inputClassName =
    "w-full rounded-xl border border-white/10 bg-[#10100F] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/10";

  const labelClassName = "mb-2 block text-sm font-medium text-white/75";

  const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    "Portfolio contact",
  )}`;

  return (
    <section
      id="contact"
      className="relative isolate overflow-hidden bg-[#080707] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-10 lg:py-24"
    >
      {/* Subtle orange and red lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-[-160px] top-20 h-72 w-72 rounded-full bg-orange-600/[0.045] blur-[120px]" />

        <div className="absolute bottom-0 right-[-120px] h-80 w-80 rounded-full bg-red-700/[0.04] blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        {/* Section heading */}
        <div className="mb-8 text-center sm:mb-10">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45 sm:text-xs">
            HAVE SOMETHING IN MIND?
          </p>

          <SectionLabel> Lets Connect</SectionLabel>

          <div className="mx-auto mt-4 h-[3px] w-14 rounded-full bg-gradient-to-r from-orange-500 to-red-600" />

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-white/55 sm:text-base">
            Have an interesting idea, an opportunity, or a project you'd like to
            discuss? Send me a message.
          </p>
        </div>

        {/* One unified contact card */}
        <div className="overflow-hidden rounded-3xl border border-white/[0.09] bg-[#0C0B0A] shadow-[0_20px_70px_rgba(0,0,0,0.25)]">
          <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr]">
            {/* Direct contact panel */}
            <aside className="relative overflow-hidden border-b border-white/[0.08] bg-gradient-to-br from-[#17100C] via-[#100D0B] to-[#0C0B0A] p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orange-600/[0.08] blur-[65px]"
              />

              <div className="relative">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-orange-400 sm:text-xs">
                  GET IN TOUCH
                </p>

                <h3 className="mt-4 text-2xl font-light leading-snug text-white/150 sm:text-3xl">
                  Good things often start with a conversation.
                </h3>

                <div className="mt-8 border-t border-white/[0.09] pt-6">
                  <p className="mb-3 text-sm text-white/150">Prefer email?</p>

                  <a
                    href={mailtoUrl}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-orange-500/30 bg-orange-500/[0.07] px-4 py-3 text-sm font-medium text-orange-300 transition-colors hover:border-orange-400/60 hover:bg-orange-500/[0.13] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5"
                    >
                      <path
                        d="M3.75 6.75h16.5v10.5H3.75z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <path
                        d="m4.5 7.5 7.5 6 7.5-6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Email me directly
                  </a>
                </div>
              </div>
            </aside>

            {/* Contact form */}
            <div className="p-5 sm:p-8">
              <form onSubmit={handleSubmit} noValidate>
                {/* Honeypot field: real visitors should leave this empty. */}
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-10000px] h-px w-px overflow-hidden"
                />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label htmlFor="contact-name" className={labelClassName}>
                      Your name
                    </label>

                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Jane Doe"
                      maxLength={80}
                      value={formData.name}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={
                        errors.name ? "contact-name-error" : undefined
                      }
                      className={`${inputClassName} ${
                        errors.name ? "border-red-500/70" : ""
                      }`}
                    />

                    {errors.name && (
                      <p
                        id="contact-name-error"
                        className="mt-2 text-xs text-red-400"
                      >
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="contact-email" className={labelClassName}>
                      Your email
                    </label>

                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="jane@example.com"
                      maxLength={254}
                      value={formData.email}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={
                        errors.email ? "contact-email-error" : undefined
                      }
                      className={`${inputClassName} ${
                        errors.email ? "border-red-500/70" : ""
                      }`}
                    />

                    {errors.email && (
                      <p
                        id="contact-email-error"
                        className="mt-2 text-xs text-red-400"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Topic */}
                <div className="mt-5">
                  <label htmlFor="contact-topic" className={labelClassName}>
                    What would you like to discuss?
                  </label>

                  <select
                    id="contact-topic"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.topic)}
                    aria-describedby={
                      errors.topic ? "contact-topic-error" : undefined
                    }
                    className={`${inputClassName} ${
                      formData.topic ? "text-white" : "text-white/40"
                    } ${errors.topic ? "border-red-500/70" : ""}`}
                  >
                    <option value="" className="bg-[#10100F]">
                      Select a topic
                    </option>

                    <option value="Internship" className="bg-[#10100F]">
                      Internship
                    </option>

                    <option value="Job opportunity" className="bg-[#10100F]">
                      Job opportunity
                    </option>

                    <option value="Collaboration" className="bg-[#10100F]">
                      Collaboration
                    </option>

                    <option value="Project discussion" className="bg-[#10100F]">
                      Project discussion
                    </option>

                    <option value="Other" className="bg-[#10100F]">
                      Something else
                    </option>
                  </select>

                  {errors.topic && (
                    <p
                      id="contact-topic-error"
                      className="mt-2 text-xs text-red-400"
                    >
                      {errors.topic}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label
                      htmlFor="contact-message"
                      className="text-sm font-medium text-white/75"
                    >
                      Your message
                    </label>

                    <span className="text-xs tabular-nums text-white/35">
                      {formData.message.length}/2000
                    </span>
                  </div>

                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    minLength={20}
                    maxLength={2000}
                    placeholder="Tell me a little about it..."
                    value={formData.message}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={
                      errors.message
                        ? "contact-message-error"
                        : "contact-message-hint"
                    }
                    className={`${inputClassName} min-h-32 resize-y leading-6 ${
                      errors.message ? "border-red-500/70" : ""
                    }`}
                  />

                  {errors.message ? (
                    <p
                      id="contact-message-error"
                      className="mt-2 text-xs text-red-400"
                    >
                      {errors.message}
                    </p>
                  ) : (
                    <p
                      id="contact-message-hint"
                      className="mt-2 text-xs text-white/35"
                    >
                      Please provide at least 20 characters.
                    </p>
                  )}
                </div>

                {formStatus === "submitting" && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-white/75"
                  >
                    Sending your message… Please keep this page open.
                  </div>
                )}

                {formStatus === "success" && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-500/[0.06] p-4 text-sm leading-6 text-emerald-200"
                  >
                    Thank you for reaching out. Your message was submitted
                    successfully. I’ll get back to you as soon as I can.
                  </div>
                )}

                {formStatus === "error" && (
                  <div
                    role="alert"
                    className="mt-5 rounded-xl border border-red-400/20 bg-red-500/[0.06] p-4 text-sm leading-6 text-red-200"
                  >
                    We couldn’t send your message right now. Please try again,
                    or use the direct email option.
                  </div>
                )}
                {formStatus === "ready" && (
                  <div
                    role="status"
                    className="mt-5 rounded-xl border border-orange-400/20 bg-orange-500/[0.06] p-4 text-sm leading-6 text-orange-200/90"
                  >
                    Your details passed the frontend checks. Message delivery
                    hasn't been connected yet, so please use the direct email
                    option for now.
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={formStatus === "submitting"}
                  aria-busy={formStatus === "submitting"}
                  className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-3 text-sm font-semibold text-[#100905] transition-all hover:from-orange-400 hover:to-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C0B0A] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {formStatus === "submitting" ? "Sending…" : "Send message"}

                  {/* Keep your existing SVG arrow here. */}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
