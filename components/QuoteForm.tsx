"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronDown,
  Copy,
  Mail,
} from "lucide-react";
import {
  equipmentOptions,
  frequencyOptions,
  serviceOptions,
  type QuotePreset,
} from "@/lib/fleet";
import { site } from "@/lib/site";

type Status = "idle" | "sending" | "draft" | "sent" | "error";
type Details = Record<string, string>;
const initialFreight: Details = {
  equipment: "",
  origin: "",
  destination: "",
  service: "",
  frequency: "To be discussed",
  date: "",
  details: "",
};

export function QuoteForm({ preset }: { preset: QuotePreset | null }) {
  const panel = useRef<HTMLDivElement>(null);
  const shouldFocus = useRef(false);
  const [step, setStep] = useState(1);
  const [freight, setFreight] = useState<Details>(initialFreight);
  const [contact, setContact] = useState<Details>({});
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [draft, setDraft] = useState({ url: "", text: "" });
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!shouldFocus.current) return;
    shouldFocus.current = false;
    panel.current?.focus({ preventScroll: true });
    panel.current?.scrollIntoView({
      block: "start",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, [step, status]);
  useEffect(() => {
    if (!preset) return;
    setFreight((previous) => ({
      ...previous,
      ...(preset.equipment ? { equipment: preset.equipment } : {}),
      ...(preset.origin ? { origin: preset.origin } : {}),
      ...(preset.service ? { service: preset.service } : {}),
    }));
    setStep(1);
    setStatus("idle");
  }, [preset]);

  function next(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFreight(
      Object.fromEntries(new FormData(event.currentTarget)) as Details,
    );
    shouldFocus.current = true;
    setStep(2);
  }
  function back(form: HTMLFormElement | null) {
    if (form) setContact(Object.fromEntries(new FormData(form)) as Details);
    shouldFocus.current = true;
    setStep(1);
    setStatus("idle");
  }
  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const details = Object.fromEntries(
      new FormData(event.currentTarget),
    ) as Details;
    if (details.website) return;
    setContact(details);
    const payload = { ...freight, ...details };
    const text = [
      "PRIME PATH — FREIGHT INQUIRY",
      "",
      "Equipment: " + payload.equipment,
      "Origin: " + payload.origin,
      "Destination: " + payload.destination,
      "Service: " + payload.service,
      "Frequency: " + payload.frequency,
      "Target pickup: " + (payload.date || "To be discussed"),
      "Freight details: " + (payload.details || "To be discussed"),
      "",
      "Name: " + payload.name,
      "Company: " + payload.company,
      "Email: " + payload.email,
      "Phone: " + (payload.phone || "Not provided"),
    ].join("\n");
    setDraft({
      text,
      url:
        "mailto:" +
        site.email +
        "?subject=" +
        encodeURIComponent(
          "Freight inquiry: " + payload.origin + " to " + payload.destination,
        ) +
        "&body=" +
        encodeURIComponent(text),
    });
    setStatus("sending");
    setError("");
    setCopied(false);
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(18000),
      });
      const result = await response.json();
      shouldFocus.current = true;
      if (!response.ok)
        throw new Error(
          result.error ||
            "Automatic delivery is unavailable. Your email draft is ready below.",
        );
      if (result.sent === true) setStatus("sent");
      else if (result.mode === "email-draft") setStatus("draft");
      else throw new Error("Your email draft is ready below.");
    } catch (cause) {
      shouldFocus.current = true;
      setStatus("error");
      setError(
        cause instanceof Error && cause.name !== "TimeoutError"
          ? cause.message
          : "Automatic delivery took too long. Use the prepared email below.",
      );
    }
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(draft.text);
      setCopied(true);
    } catch {
      setError(
        "Copy is unavailable in this browser. Open the email draft or call us directly.",
      );
    }
  }
  const finished =
    status === "draft" || status === "sent" || status === "error";

  return (
    <div
      className="quote-panel"
      ref={panel}
      tabIndex={-1}
      aria-label="Freight request"
    >
      <div className="form-progress" aria-label={"Step " + step + " of 2"}>
        <span className={step === 1 ? "current" : "complete"}>
          <i>{step === 2 ? <Check size={12} /> : "1"}</i>Your freight
        </span>
        <div />
        <span className={step === 2 ? "current" : ""}>
          <i>2</i>Your details
        </span>
      </div>
      {finished ? (
        <div className="quote-result" role="status">
          <span className="result-icon">
            {status === "sent" ? <Check size={28} /> : <Mail size={28} />}
          </span>
          <h3>
            {status === "sent"
              ? "Your next move is in motion."
              : "Your freight request is ready."}
          </h3>
          <p>
            {status === "sent"
              ? "Your inquiry was sent. We’ll follow up using the contact details you provided."
              : status === "error"
                ? error
                : "Open the prepared email and send it to our team. Your inquiry has not been sent yet."}
          </p>
          <div className="request-summary">
            <span>{freight.equipment}</span>
            <strong>
              {freight.origin} <span>→</span> {freight.destination}
            </strong>
            <p>{freight.service}</p>
          </div>
          {status !== "sent" && (
            <>
              <a href={draft.url} className="button blue full-width">
                Open email draft
                <ArrowUpRight size={19} />
              </a>
              <button type="button" className="copy-link" onClick={copy}>
                <Copy size={15} />
                {copied ? "Details copied" : "Copy freight details"}
              </button>
              <p className="draft-recipient">
                Send to <a href={"mailto:" + site.email}>{site.email}</a>
              </p>
              {error && status !== "error" && (
                <p className="form-error">{error}</p>
              )}
            </>
          )}
          <button
            type="button"
            className="text-link"
            onClick={() => {
              shouldFocus.current = true;
              if (status === "sent") {
                setFreight(initialFreight);
                setContact({});
              }
              setStatus("idle");
              setStep(1);
            }}
          >
            {status === "sent" ? "Start another inquiry" : "Edit request"}
            <ArrowUpRight size={17} />
          </button>
        </div>
      ) : step === 1 ? (
        <form key="freight" className="freight-form" onSubmit={next}>
          <div className="form-title">
            <h3>What are we moving?</h3>
            <p>Start with the equipment and the lane.</p>
          </div>
          <fieldset className="equipment-fieldset">
            <legend>Choose your equipment *</legend>
            <div className="equipment-picks">
              {equipmentOptions.slice(0, 3).map((name, index) => (
                <label
                  key={name}
                  className={
                    freight.equipment === name
                      ? "equipment-pick selected"
                      : "equipment-pick"
                  }
                >
                  <input
                    type="radio"
                    name="equipment"
                    value={name}
                    checked={freight.equipment === name}
                    onChange={() =>
                      setFreight((f) => ({ ...f, equipment: name }))
                    }
                    required
                  />
                  <span className="equipment-number">0{index + 1}</span>
                  <strong>{name}</strong>
                  <span className="radio-dot" aria-hidden="true" />
                </label>
              ))}
            </div>
            <label className="help-pick">
              <input
                type="radio"
                name="equipment"
                value="Help me choose"
                checked={freight.equipment === "Help me choose"}
                onChange={() =>
                  setFreight((f) => ({ ...f, equipment: "Help me choose" }))
                }
              />
              Help me choose the right equipment
            </label>
          </fieldset>
          <div className="form-row">
            <label>
              Pickup city or ZIP *
              <input
                name="origin"
                autoComplete="off"
                value={freight.origin}
                onChange={(e) =>
                  setFreight((f) => ({ ...f, origin: e.target.value }))
                }
                required
                maxLength={120}
                placeholder="Dallas, TX"
              />
            </label>
            <label>
              Delivery city or ZIP *
              <input
                name="destination"
                autoComplete="off"
                defaultValue={freight.destination}
                required
                maxLength={120}
                placeholder="Houston, TX"
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              Service *
              <span className="select-wrap">
                <select
                  name="service"
                  required
                  value={freight.service}
                  onChange={(e) =>
                    setFreight((f) => ({ ...f, service: e.target.value }))
                  }
                >
                  <option value="" disabled>
                    Select a service
                  </option>
                  {serviceOptions.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown size={16} />
              </span>
            </label>
            <label>
              Frequency
              <span className="select-wrap">
                <select name="frequency" defaultValue={freight.frequency}>
                  {frequencyOptions.map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
                <ChevronDown size={16} />
              </span>
            </label>
          </div>
          <label>
            Target pickup date
            <input type="date" name="date" defaultValue={freight.date} />
          </label>
          <label>
            Freight details
            <textarea
              name="details"
              defaultValue={freight.details}
              placeholder="What’s shipping? Include approximate weight, dimensions, pallet count, and any loading or delivery requirements."
              rows={3}
              maxLength={3000}
            />
          </label>
          <button type="submit" className="button blue full-width">
            Continue to contact details
            <ArrowUpRight size={19} />
          </button>
          <p className="form-note">
            A quote request starts a conversation. It is not a booking.
          </p>
        </form>
      ) : (
        <form key="contact" className="freight-form" onSubmit={send}>
          <div className="form-title">
            <h3>Let’s make the connection.</h3>
            <p>Tell us who to contact about your freight.</p>
          </div>
          <div className="request-summary">
            <span>{freight.equipment}</span>
            <strong>
              {freight.origin} <span>→</span> {freight.destination}
            </strong>
            <p>{freight.service}</p>
          </div>
          <div className="honeypot" aria-hidden="true">
            <label>
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <div className="form-row">
            <label>
              Your name *
              <input
                name="name"
                defaultValue={contact.name}
                autoComplete="name"
                required
                maxLength={120}
                placeholder="First and last name"
              />
            </label>
            <label>
              Company *
              <input
                name="company"
                defaultValue={contact.company}
                autoComplete="organization"
                required
                maxLength={160}
                placeholder="Company name"
              />
            </label>
          </div>
          <label>
            Work email *
            <input
              type="email"
              name="email"
              defaultValue={contact.email}
              autoComplete="email"
              required
              maxLength={254}
              placeholder="you@company.com"
            />
          </label>
          <label>
            Phone
            <input
              type="tel"
              name="phone"
              defaultValue={contact.phone}
              autoComplete="tel"
              maxLength={40}
              placeholder="(555) 000-0000"
            />
          </label>
          <label className="consent">
            <input
              type="checkbox"
              name="consent"
              required
              defaultChecked={contact.consent === "on"}
            />
            <span>
              I agree to be contacted about this inquiry and have read the{" "}
              <a href="/privacy">privacy notice</a>.
            </span>
          </label>
          <button
            type="submit"
            disabled={status === "sending"}
            className="button blue full-width"
          >
            {status === "sending"
              ? "Preparing your request…"
              : "Prepare freight request"}
            <ArrowUpRight size={19} />
          </button>
          <button
            type="button"
            className="back-link"
            disabled={status === "sending"}
            onClick={(e) => back(e.currentTarget.form)}
          >
            <ArrowLeft size={15} />
            Back to freight details
          </button>
          <p className="form-note">
            Equipment, scheduling, and availability are confirmed with your
            quote.
          </p>
        </form>
      )}
    </div>
  );
}
