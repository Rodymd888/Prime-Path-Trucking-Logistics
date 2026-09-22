import test from "node:test";
import assert from "node:assert/strict";
import { POST } from "../app/api/quote/route";

const inquiry = {
  name: "Website QA",
  company: "Example company",
  email: "qa@example.com",
  origin: "Dallas, TX",
  destination: "Houston, TX",
  service: "Dedicated routes",
  equipment: "Day Cab",
  frequency: "Weekly",
  consent: "on",
  website: "",
};
function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request("https://freight.example/api/quote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://freight.example",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

test("freight inquiry boundaries and delivery states", async (t) => {
  const previous = {
    key: process.env.RESEND_API_KEY,
    from: process.env.QUOTE_FROM_EMAIL,
  };
  const originalFetch = globalThis.fetch;
  delete process.env.RESEND_API_KEY;
  delete process.env.QUOTE_FROM_EMAIL;
  // No test can send a real email, including when credentials exist in the shell.
  globalThis.fetch = async () => {
    throw new Error("Unexpected network request in test");
  };
  try {
    await t.test(
      "unconfigured delivery prepares a draft without claiming it was sent",
      async () => {
        const result = await POST(request(inquiry));
        assert.equal(result.status, 200);
        assert.deepEqual(await result.json(), { mode: "email-draft" });
      },
    );
    await t.test("same public host works behind a reverse proxy", async () => {
      const result = await POST(
        new Request("http://localhost:3000/api/quote", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Host: "freight.example",
            Origin: "https://freight.example",
          },
          body: JSON.stringify(inquiry),
        }),
      );
      assert.equal(result.status, 200);
    });
    await t.test("rejects another website origin", async () => {
      assert.equal(
        (await POST(request(inquiry, { Origin: "https://other.example" })))
          .status,
        403,
      );
    });
    await t.test("requires usable contact details and consent", async () => {
      assert.equal(
        (await POST(request({ ...inquiry, email: "not-an-email" }))).status,
        400,
      );
      assert.equal(
        (await POST(request({ ...inquiry, consent: "" }))).status,
        400,
      );
    });
    await t.test("rejects malformed and oversized payloads", async () => {
      assert.equal((await POST(request([]))).status, 400);
      assert.equal(
        (await POST(request({ ...inquiry, details: "x".repeat(17000) })))
          .status,
        413,
      );
      assert.equal(
        (await POST(request(inquiry, { "Content-Type": "text/plain" }))).status,
        415,
      );
    });
    await t.test(
      "configured delivery only confirms after provider acceptance",
      async () => {
        process.env.RESEND_API_KEY = "test-key-no-network";
        process.env.QUOTE_FROM_EMAIL = "Freight <test@example.com>";
        let calls = 0;
        globalThis.fetch = async (url, init) => {
          calls++;
          assert.equal(url, "https://api.resend.com/emails");
          const payload = JSON.parse(String(init?.body));
          assert.equal(payload.reply_to, inquiry.email);
          assert.match(payload.text, /Dallas, TX/);
          assert.match(payload.text, /Houston, TX/);
          assert.match(payload.text, /Equipment: Day Cab/);
          return new Response(JSON.stringify({ id: "test-message" }), {
            status: 200,
          });
        };
        const result = await POST(request(inquiry));
        assert.equal(calls, 1);
        assert.equal(result.status, 200);
        assert.deepEqual(await result.json(), { sent: true });
      },
    );
    await t.test(
      "forwards box-truck and cargo-van selections in the inquiry",
      async () => {
        for (const choice of ["Box Truck", "Cargo Van"]) {
          globalThis.fetch = async (_url, init) => {
            const body = JSON.parse(String(init?.body));
            assert.ok(body.text.includes("Equipment: " + choice));
            return new Response(JSON.stringify({ id: "test-message" }), {
              status: 200,
            });
          };
          assert.equal(
            (await POST(request({ ...inquiry, equipment: choice }))).status,
            200,
          );
        }
      },
    );
    await t.test("requires a supported equipment choice", async () => {
      assert.equal(
        (await POST(request({ ...inquiry, equipment: "" }))).status,
        400,
      );
      assert.equal(
        (await POST(request({ ...inquiry, equipment: "Passenger bus" })))
          .status,
        400,
      );
    });
    await t.test(
      "provider failure returns a recoverable error, never a success",
      async () => {
        globalThis.fetch = async () =>
          new Response("Unavailable", { status: 503 });
        const result = await POST(request(inquiry));
        assert.equal(result.status, 502);
        const data = await result.json();
        assert.equal(data.sent, undefined);
        assert.match(data.error, /prepared email/);
      },
    );
  } finally {
    globalThis.fetch = originalFetch;
    if (previous.key === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = previous.key;
    if (previous.from === undefined) delete process.env.QUOTE_FROM_EMAIL;
    else process.env.QUOTE_FROM_EMAIL = previous.from;
  }
});
