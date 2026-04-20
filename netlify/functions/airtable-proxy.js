exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "POST only" }) };
  }

  const token = process.env.AIRTABLE_PAT;
  if (!token) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "AIRTABLE_PAT non configuree" }) };
  }

  try {
    const req = JSON.parse(event.body);
    const method = req.method || "GET";
    const url = "https://api.airtable.com/v0/" + req.url;

    const opts = { method: method, headers: { Authorization: "Bearer " + token } };

    if (req.body) {
      opts.headers["Content-Type"] = "application/json";
      opts.body = JSON.stringify(req.body);
    }

    const resp = await fetch(url, opts);
    const text = await resp.text();

    return {
      statusCode: resp.status,
      headers: { ...headers, "Content-Type": "application/json" },
      body: text,
    };
  } catch (e) {
    return { statusCode: 502, headers, body: JSON.stringify({ error: e.message }) };
  }
};
