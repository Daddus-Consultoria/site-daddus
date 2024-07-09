import { google } from "googleapis";

export default async function viewPage (res: any, req: any) {
    const auth = new google.auth.GoogleAuth({
        projectId: process.env.GOOGLE_PROJECT_ID,
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            client_id: process.env.GOOGLE_CLIENT_ID,
            private_key: process.env.GOOGLE_PRIVATE_KEY,
        },
        scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });

    try {
        const analytics = google.analytics({
            auth,
            version: 'v3',
        });

        const response = await analytics.data.ga.get({
            'start-date': '30daysAgo',
            'end-date': 'today',
            ids: `ga:${process.env.GOOGLE_SHEETS_PROJECT_ID}`,
            metrics: 'ga:pageviews',
            dimensions: 'ga:pagePath',
            'sort': '-ga:pageviews',
            'max-results': 5,
        });

        return res.status(200).json(response.data.rows);
    }catch (error:any) {
        return res.status(500).json({ error: error.message });
    }


}