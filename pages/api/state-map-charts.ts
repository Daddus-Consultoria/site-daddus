import fs from "fs";

import { google } from "googleapis";

export default async function handler(req: any, res: any) {
  const credentialsPath =
    process.env.NEXT_PUBLIC_GOOGLE_SHEETS_APLICATION_CREDENTIALS ?? "";
  const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));

  const auth = await google.auth.getClient({
    projectId: credentials.project_id,
    credentials: {
      type: "service_account",
      private_key: credentials.private_key,
      client_email: credentials.client_email,
      client_id: credentials.client_id,
      token_url: "https://oauth2.googleapis.com/token",
      universe_domain: "googleapis.com",
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const range = "A1:Z1000";
  const data = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_SPREADSHEET_ID,
    range: range,
  });
  res.status(200).json(data.data.values);
}
