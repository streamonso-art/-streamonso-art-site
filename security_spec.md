# Security Specification for StreamOn Agency Firestore

## 1. Data Invariants
- Leads can be created by unauthenticated visitors (via public contact/inquiry forms) with strict schema validation.
- Leads can only be read, updated, or deleted by authenticated administrators.
- Document IDs must not exceed 128 characters and must match alphanumeric and hyphen/underscore characters (`^[a-zA-Z0-9_\-]+$`).
- All string sizes, emails, phones, and message fields must be bounded to prevent denial of wallet and storage exhaustion.
- Site settings can be read publicly by visitors to render agency details, but modified only by authenticated admins.

## 2. The Dirty Dozen Payloads
1. **Unchecked Shadow Fields on Lead Create**: An inquiry with extra junk fields (`hackerPayload: 'xxx'`).
2. **Gigantic Message Flood**: An inquiry with a 50MB message string.
3. **Negative / Non-string Email**: An inquiry with `email: 12345` or non-standard format.
4. **Invalid Status Poisoning**: Setting status to `admin_escalated` or arbitrary non-enum status.
5. **Unauthorized Lead Reading**: Unauthenticated user attempting to list or read all client leads.
6. **Unauthorized Lead Modification**: Unauthenticated visitor attempting to alter an existing lead's status or notes.
7. **Lead Deletion Attack**: Unauthenticated visitor attempting to delete leads from the database.
8. **Settings Tampering**: Unauthenticated user trying to overwrite founder contact numbers or address.
9. **Malicious ID Injection**: Creating a document with a 2MB ID string.
10. **Admin Escalation on Public Form**: Submitting a lead that attempts to inject role claims.
11. **Blanket Query Scraping**: Attempting to scrape other client data without authentication.
12. **Malformed Timestamp Spoof**: Injecting an invalid object format in timestamp fields.

## 3. Test Runner Invariants
All operations in the dirty dozen must return `PERMISSION_DENIED` under the security rules.
