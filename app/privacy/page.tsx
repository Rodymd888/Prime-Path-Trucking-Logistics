import type { Metadata } from "next";
import { site } from "@/lib/site";
export const metadata: Metadata = {
  title: "Privacy | Prime Path Trucking & Logistics",
};
export default function Privacy() {
  return (
    <div className="legal-page">
      <header className="legal-header">
        <div className="container">
          <a href="/">PRIME PATH</a>
          <a href="/">← Back to the website</a>
        </div>
      </header>
      <main className="container legal-content">
        <p className="eyebrow">PRIME PATH TRUCKING &amp; LOGISTICS</p>
        <h1>Privacy notice</h1>
        <p>
          This notice describes information collected through this website when
          you contact Prime Path about freight services.
        </p>
        <h2>Information you provide</h2>
        <p>
          The inquiry form asks for your name, company, email, contact number,
          and shipment requirements. We use the information you provide to
          review your request, prepare a response, and communicate about
          potential services. Please do not submit payment details or sensitive
          personal information.
        </p>
        <h2>How inquiries are sent</h2>
        <p>
          The site may deliver inquiries through an email provider or prepare a
          draft for you to send through your own email application. When a draft
          is prepared, the page explains that your inquiry has not been sent.
          You must send it from your email application to complete the request.
        </p>
        <h2>Hosting and service providers</h2>
        <p>
          The website host may process technical information such as IP
          addresses, request logs, and browser details to operate and protect
          the website. Hosting and email providers process information as needed
          to provide their services.
        </p>
        <h2>Cookies and tracking</h2>
        <p>
          This site does not include advertising trackers, marketing pixels, or
          analytics cookies. Freight form entries are not saved in browser
          storage.
        </p>
        <h2>Your choices</h2>
        <p>
          You may contact us directly instead of using the form. You may request
          access to, correction of, or deletion of the information you provided,
          subject to applicable recordkeeping requirements.
        </p>
        <h2>Contact</h2>
        <p>
          Email <a href={`mailto:${site.email}`}>{site.email}</a> or call{" "}
          <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a> with questions
          about this notice or information you submitted.
        </p>
      </main>
    </div>
  );
}
