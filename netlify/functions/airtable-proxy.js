const BASE_ID = "appNML7rJEKiWkuVg";
const TABLE_ID = "tblgCdNITlPy74Z5G";
const API = "https://api.airtable.com/v0";

exports.handler = async (event) => {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: cors, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers: cors, body: '{"error":"POST only"}' };

  const token = process.env.AIRTABLE_PAT;
  if (!token) return { statusCode: 500, headers: cors, body: '{"error":"AIRTABLE_PAT missing"}' };

  let req;
  try { req = JSON.parse(event.body); } catch(e) { return { statusCode: 400, headers: cors, body: '{"error":"Invalid JSON"}' }; }

  const auth = { Authorization: "Bearer " + token };

  try {
    if (req.action === "list") {
      // Lister les prospects avec pagination
      var listUrl = API + "/" + BASE_ID + "/" + TABLE_ID
        + "?pageSize=100&returnFieldsByFieldId=true"
        + "&sort%5B0%5D%5Bfield%5D=" + encodeURIComponent(req.sortField || "fldFnBm8d9JHCZ4Z1")
        + "&sort%5B0%5D%5Bdirection%5D=" + (req.sortDirection || "desc");
      if (req.offset) listUrl += "&offset=" + encodeURIComponent(req.offset);
      var r = await fetch(listUrl, { headers: auth });
      var t = await r.text();
      return { statusCode: r.status, headers: cors, body: t };
    }

    if (req.action === "update") {
      // Mettre à jour un prospect
      var updateUrl = API + "/" + BASE_ID + "/" + TABLE_ID + "/" + req.recordId + "?returnFieldsByFieldId=true";
      var r = await fetch(updateUrl, {
        method: "PATCH",
        headers: { ...auth, "Content-Type": "application/json" },
        body: JSON.stringify({ fields: req.fields, typecast: true }),
      });
      var t = await r.text();
      return { statusCode: r.status, headers: cors, body: t };
    }

    return { statusCode: 400, headers: cors, body: '{"error":"Unknown action: ' + req.action + '"}' };

  } catch(e) {
    return { statusCode: 502, headers: cors, body: JSON.stringify({ error: e.message }) };
  }
};
