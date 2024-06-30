import { google } from "googleapis";
export default async function handler(req: any, res: any) {

  const auth = await google.auth.getClient({
    projectId: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_PROJECT_ID,
    credentials: {
      type: "service_account",
      private_key: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_PRIVATE_KEY,
      client_email: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_CLIENT_EMAIL,
      client_id: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_CLIENT_ID,
      token_url: "https://oauth2.googleapis.com/token",
      universe_domain: "googleapis.com",
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const range = "A1:Z1000";
  const data = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_MAP_CHART_SPREADSHEET_ID,
    range: range,
  });
  res.status(200).json(data.data.values);
}
