// Proxy Netlify Function : le navigateur appelle cette function,
// qui forward la requête vers l'API Airtable côté serveur.
// Le token Airtable est stocké dans les variables d'environnement Netlify (sécurisé).

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  // Le token est dans les variables d'environnement Netlify (jamais exposé au navigateur)
  const token = process.env.AIRTABLE_PAT;
  if (!token) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Variable AIRTABLE_PAT non configurée dans Netlify" }),
    };
  }

  const params = event.queryStringParameters || {};
  const airtablePath = params.path || "";

  if (!airtablePath) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Paramètre path manquant" }),
    };
  }

  const url = `https://api.airtable.com/v0/${airtablePath}`;

  try {
    const fetchOptions = {
      method: event.httpMethod,
      headers: { Authorization: `Bearer ${token}` },
    };

    if (event.httpMethod !== "GET" && event.body) {
      fetchOptions.headers["Content-Type"] = "application/json";
      fetchOptions.body = event.body;
    }

    const response = await fetch(url, fetchOptions);
    const body = await response.text();

    return {
      statusCode: response.status,
      headers: { ...headers, "Content-Type": "application/json" },
      body,
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({ error: `Proxy error: ${error.message}` }),
    };
  }
};
