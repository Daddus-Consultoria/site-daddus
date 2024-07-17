import { google } from "googleapis";
export default async function handler(req: any, res: any) {

  const auth = await google.auth.getClient({
    projectId: process.env.GOOGLE_SHEETS_PROJECT_ID,
    credentials: {
      type: "service_account",
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY,
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_SHEETS_CLIENT_ID,
      token_url: "https://oauth2.googleapis.com/token",
      universe_domain: "googleapis.com",
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const range = "A1:Z1000";
  const data = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_MAP_CHART_SPREADSHEET_ID,
    range: range,
  });
  res.status(200).json(data.data.values);
}


/* coisas do gpt

import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log("Starting API request...");

    const auth = await google.auth.getClient({
      projectId: process.env.GOOGLE_SHEETS_PROJECT_ID,
      credentials: {
        type: "service_account",
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_SHEETS_CLIENT_ID,
        token_url: "https://oauth2.googleapis.com/token",
        universe_domain: "googleapis.com",
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    console.log("Auth client created successfully");

    const sheets = google.sheets({ version: "v4", auth });
    const range = "C2:D28";
    console.log("Attempting to fetch data from spreadsheet...");
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_MAP_CHART_SPREADSHEET_ID,
      range: range,
    });

    const data = response.data.values;

    if (!data || data.length === 0) {
      console.log("No data found in the spreadsheet");
      throw new Error('No data found in the spreadsheet');
    }

    console.log("Data fetched successfully:", JSON.stringify(data, null, 2));

    res.status(200).json(data);
  } catch (error) {
    console.error("Detailed error:", error);
    res.status(500).json({ error: "Failed to fetch spreadsheet data", details: error.message });
  }
} */