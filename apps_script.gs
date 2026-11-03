/**
 * @OnlyCurrentDoc
 * Limits this script's permission to the one Google Sheet it's attached to:
 * it can't open your other Sheets, Docs, Drive files, or email.
 */

/**
 * Backend for the movie review study: receives records from index.html and
 * appends them to tabs of this Google Sheet ("trials" and "feedback").
 * Columns are created automatically from the record fields.
 *
 * Setup: see README.md ("Backend setup").
 */
const SHEET_FOR_KIND = { trial: "trials", feedback: "feedback" };

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000); // several participants can submit at the same moment
  try {
    const body = JSON.parse(e.postData.contents);
    const records = Array.isArray(body.records) ? body.records : [body];
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const byTab = {};
    let saved = 0;
    records.forEach(function (r) {
      const tab = r && SHEET_FOR_KIND[r.record_type || r.kind];
      if (!tab) return; // ignore anything that isn't a study record
      (byTab[tab] = byTab[tab] || []).push(r);
      saved++;
    });
    Object.keys(byTab).forEach(function (tab) { appendRecords_(ss, tab, byTab[tab]); });
    // The website checks this count, so rows that weren't saved get retried instead of lost.
    return json_({ ok: true, saved: saved });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Open the /exec URL in a browser to check the deployment is live.
function doGet() {
  return json_({ ok: true, message: "Review study backend is running." });
}

function appendRecords_(ss, tabName, recs) {
  const sh = ss.getSheetByName(tabName) || ss.insertSheet(tabName);
  const lastCol = sh.getLastColumn();
  let headers = lastCol > 0 ? sh.getRange(1, 1, 1, lastCol).getValues()[0].filter(String) : [];
  if (headers.length === 0) headers = ["saved_time"];
  recs.forEach(function (r) {
    Object.keys(r).forEach(function (k) {
      // record_type only says which tab a row goes in, so it doesn't get a column
      if (k !== "record_type" && headers.indexOf(k) === -1) headers.push(k);
    });
  });
  const firstEmptyRow = Math.max(sh.getLastRow(), 1) + 1;
  const now = new Date();
  const rows = recs.map(function (r) {
    return headers.map(function (h) { return h === "saved_time" ? now : cell_(r[h]); });
  });
  sh.getRange(1, 1, 1, headers.length).setValues([headers]);
  sh.getRange(firstEmptyRow, 1, rows.length, headers.length).setValues(rows);
}

function cell_(v) {
  if (v === null || v === undefined) return "";
  if (typeof v === "object") v = JSON.stringify(v);
  // Stop typed text (names, comments) from being read as a spreadsheet formula.
  if (typeof v === "string" && /^[=+\-@]/.test(v)) return "'" + v;
  return v;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}