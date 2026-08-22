// Google Drive & Google Sheets API Integration Service for StreamOn Agency

import { Lead } from '../types';

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  webContentLink?: string;
  iconLink?: string;
  thumbnailLink?: string;
  size?: string;
  modifiedTime?: string;
  createdTime?: string;
  owners?: { displayName: string; emailAddress: string; photoLink?: string }[];
}

export interface SheetsSyncResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
  updatedRows: number;
  sheetTitle: string;
}

/**
 * Fetch files and client assets from Google Drive
 */
export async function listDriveFiles(accessToken: string, folderId?: string, queryText?: string): Promise<DriveFileItem[]> {
  try {
    let q = "trashed = false";
    if (folderId) {
      q += ` and '${folderId}' in parents`;
    }
    if (queryText) {
      q += ` and name contains '${queryText.replace(/'/g, "\\'")}'`;
    }

    const params = new URLSearchParams({
      q,
      fields: 'files(id, name, mimeType, webViewLink, webContentLink, iconLink, thumbnailLink, size, modifiedTime, createdTime, owners)',
      orderBy: 'modifiedTime desc',
      pageSize: '30'
    });

    const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Google Drive API error (${res.status})`);
    }

    const data = await res.json();
    return data.files || [];
  } catch (error) {
    console.error('Error listing Drive files:', error);
    throw error;
  }
}

/**
 * Create a new folder in Google Drive (e.g. for a client or campaign)
 */
export async function createDriveFolder(accessToken: string, folderName: string, parentId?: string): Promise<DriveFileItem> {
  try {
    const metadata: { name: string; mimeType: string; parents?: string[] } = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    };

    if (parentId) {
      metadata.parents = [parentId];
    }

    const res = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Failed to create folder (${res.status})`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error creating Drive folder:', error);
    throw error;
  }
}

/**
 * Upload a text or JSON file (e.g., Marketing Proposal, Leads Summary, SEO Audit) to Google Drive
 */
export async function uploadDriveTextFile(
  accessToken: string,
  fileName: string,
  content: string,
  mimeType: string = 'text/plain',
  parentId?: string
): Promise<DriveFileItem> {
  try {
    const metadata: { name: string; mimeType: string; parents?: string[] } = {
      name: fileName,
      mimeType,
    };
    if (parentId) {
      metadata.parents = [parentId];
    }

    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      `Content-Type: ${mimeType}\r\n\r\n` +
      content +
      closeDelimiter;

    const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Failed to upload file (${res.status})`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error uploading to Drive:', error);
    throw error;
  }
}

/**
 * Delete a file in Google Drive (Destructive: requires user confirmation)
 */
export async function deleteDriveFile(accessToken: string, fileId: string): Promise<boolean> {
  try {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok && res.status !== 204) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Failed to delete file (${res.status})`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting Drive file:', error);
    throw error;
  }
}

/**
 * Sync leads from StreamOn CRM to a Google Spreadsheet
 * If spreadsheetId is provided, updates it; otherwise creates a new "StreamOn - Agency Inquiries & Leads" spreadsheet
 */
export async function syncLeadsToGoogleSheet(
  accessToken: string,
  leads: Lead[],
  existingSpreadsheetId?: string
): Promise<SheetsSyncResult> {
  try {
    let spreadsheetId = existingSpreadsheetId;
    let spreadsheetUrl = '';
    const sheetTitle = 'StreamOn Leads CRM';

    // 1. If no existing spreadsheet, create a new one
    if (!spreadsheetId) {
      const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: {
            title: `StreamOn Agency - Leads & Inquiries CRM (${new Date().toLocaleDateString('en-GB')})`,
          },
          sheets: [
            {
              properties: {
                title: sheetTitle,
                gridProperties: {
                  rowCount: Math.max(100, leads.length + 20),
                  columnCount: 10,
                  frozenRowCount: 1,
                },
              },
            },
          ],
        }),
      });

      if (!createRes.ok) {
        const err = await createRes.json().catch(() => ({}));
        throw new Error(err.error?.message || `Failed to create Google Spreadsheet (${createRes.status})`);
      }

      const createData = await createRes.json();
      spreadsheetId = createData.spreadsheetId;
      spreadsheetUrl = createData.spreadsheetUrl;
    } else {
      spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
    }

    // 2. Prepare Header and Data rows
    const headerRow = [
      'Lead Name',
      'Email Address',
      'Phone / WhatsApp',
      'Company / Brand',
      'Service Interested',
      'Budget Tier',
      'Inquiry Message',
      'CRM Status',
      'Received At',
      'Agency Notes',
    ];

    const dataRows = leads.map((lead) => [
      lead.name || 'Anonymous',
      lead.email || 'N/A',
      lead.phone || 'N/A',
      lead.company || 'N/A',
      lead.serviceInterested || 'General Inquiry',
      lead.budgetRange || 'Flexible',
      lead.message || '',
      lead.status || 'New',
      lead.createdAt ? new Date(lead.createdAt).toLocaleString('en-IN') : new Date().toLocaleString('en-IN'),
      lead.internalNotes || '',
    ]);

    const allRows = [headerRow, ...dataRows];

    // 3. Write data to the spreadsheet
    const range = `${sheetTitle}!A1:J${allRows.length}`;
    const writeRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          range,
          majorDimension: 'ROWS',
          values: allRows,
        }),
      }
    );

    if (!writeRes.ok) {
      const err = await writeRes.json().catch(() => ({}));
      throw new Error(err.error?.message || `Failed to populate spreadsheet data (${writeRes.status})`);
    }

    // 4. Format header row (Dark theme + Electric lime StreamOn styling)
    try {
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId: 0,
                  startRowIndex: 0,
                  endRowIndex: 1,
                  startColumnIndex: 0,
                  endColumnIndex: 10,
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 0.05, green: 0.05, blue: 0.05 },
                    textFormat: {
                      foregroundColor: { red: 0.7, green: 1.0, blue: 0.22 },
                      bold: true,
                      fontSize: 11,
                    },
                    horizontalAlignment: 'LEFT',
                  },
                },
                fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)',
              },
            },
            {
              autoResizeDimensions: {
                dimensions: {
                  sheetId: 0,
                  dimension: 'COLUMNS',
                  startIndex: 0,
                  endIndex: 10,
                },
              },
            },
          ],
        }),
      });
    } catch {
      // Formatting failure is non-blocking
    }

    return {
      spreadsheetId: spreadsheetId!,
      spreadsheetUrl,
      updatedRows: dataRows.length,
      sheetTitle,
    };
  } catch (error) {
    console.error('Error syncing leads to Google Sheets:', error);
    throw error;
  }
}

/**
 * Create a new Client Campaign Tracking Sheet
 */
export async function createCampaignTrackerSheet(
  accessToken: string,
  clientName: string,
  serviceType: string,
  monthlyBudget: string
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  try {
    const title = `StreamOn - ${clientName} (${serviceType}) Campaign Tracker`;
    const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title,
        },
        sheets: [
          {
            properties: {
              title: 'Monthly KPIs & Ad Spend',
              gridProperties: { rowCount: 40, columnCount: 8, frozenRowCount: 1 },
            },
            data: [
              {
                startRow: 0,
                startColumn: 0,
                rowData: [
                  {
                    values: [
                      { userEnteredValue: { stringValue: 'Week / Date' } },
                      { userEnteredValue: { stringValue: 'Campaign Name' } },
                      { userEnteredValue: { stringValue: 'Ad Spend (INR)' } },
                      { userEnteredValue: { stringValue: 'Impressions' } },
                      { userEnteredValue: { stringValue: 'Clicks / Traffic' } },
                      { userEnteredValue: { stringValue: 'Conversions / Orders' } },
                      { userEnteredValue: { stringValue: 'Revenue Generated' } },
                      { userEnteredValue: { stringValue: 'ROAS' } },
                    ],
                  },
                  {
                    values: [
                      { userEnteredValue: { stringValue: 'Week 1 Kickoff' } },
                      { userEnteredValue: { stringValue: `${serviceType} - Funnel A` } },
                      { userEnteredValue: { stringValue: monthlyBudget } },
                      { userEnteredValue: { numberValue: 45000 } },
                      { userEnteredValue: { numberValue: 1850 } },
                      { userEnteredValue: { numberValue: 92 } },
                      { userEnteredValue: { stringValue: '₹ 1,84,000' } },
                      { userEnteredValue: { stringValue: '4.8x' } },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Failed to create campaign spreadsheet (${res.status})`);
    }

    const data = await res.json();
    return {
      spreadsheetId: data.spreadsheetId,
      spreadsheetUrl: data.spreadsheetUrl,
    };
  } catch (error) {
    console.error('Error creating campaign tracker sheet:', error);
    throw error;
  }
}
