// Proxy Netlify Function : le navigateur appelle cette function,
// qui forward la requête vers l'API Airtable côté serveur (pas de CORS).

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, X-Airtable-Token",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
  };

  // Preflight CORS
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  // Récupérer le token depuis le header custom
  const token = event.headers["x-airtable-token"];
  if (!token) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: "Token manquant" }),
    };
  }

  // Récupérer le chemin Airtable depuis le query param "path"
  const params = event.queryStringParameters || {};
  const airtablePath = params.path || "";

  if (!airtablePath) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Paramètre 'path' manquant" }),
    };
  }

  // Construire l'URL Airtable
  const url = `https://api.airtable.com/v0/${airtablePath}`;

  try {
    // Forward la requête vers Airtable
    const fetchOptions = {
      method: event.httpMethod,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Ajouter Content-Type et body pour les requêtes non-GET
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
