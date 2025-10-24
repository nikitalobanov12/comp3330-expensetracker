# Lab 10 - Private File Uploads with AWS S3

## Implementation Summary

- **Cloud Provider**: AWS S3 (us-west-2 region)
- **Bucket Name**: expense-tracker-comp-3330
- **Authentication**: Kinde (already integrated in Lab 9)

## Key Takeaways

- **Presigned URLs**: The backend generates time-limited presigned PUT URLs so the browser can upload directly to S3 without exposing AWS credentials. This is more secure and reduces server load.

- **Storage Strategy**: The database stores only the S3 object key (e.g., `uploads/1234567890-receipt.pdf`), not the full URL. When retrieving expenses, the backend signs download URLs on-the-fly with a 1-hour expiry using `getSignedUrl`.

- **CORS Configuration**: Setting up CORS on the S3 bucket was critical to allow the frontend (localhost:5173) to PUT files directly. The bucket policy includes `AllowedOrigins`, `AllowedMethods` (PUT, GET), and `AllowedHeaders` (Content-Type, etc.).

- **Schema Design**: The `file_url` column is nullable (`varchar(500)`), allowing expenses to exist with or without receipts. The frontend gracefully handles both cases.

- **TanStack Query Integration**: After a successful upload, the `UploadExpenseForm` invalidates both the list and detail queries to refetch with the new signed download URL.

## Challenges Encountered

- **Environment Variable Naming**: Initially had `S3_BUCKET_NAME` in `.env` but the code expected `S3_BUCKET`. Fixed by renaming the variable.

- **Understanding Presigned URLs**: It took time to understand that presigned URLs expire and must be regenerated on each API call. This is why `withSignedDownloadUrl` runs for every GET request.

- **File Type Handling**: The upload form uses `accept="image/*,application/pdf"` to guide users, and defaults to `application/octet-stream` if the browser doesn't report a MIME type.

## Testing Checklist

- [x] Backend configured with AWS credentials
- [x] Database schema includes `file_url` column
- [x] POST `/api/upload/sign` returns presigned URL and key
- [x] Frontend uploads file to S3 via presigned URL
- [x] Frontend updates expense with `fileKey` via PATCH `/api/expenses/:id`
- [x] GET `/api/expenses` returns signed download URLs
- [x] UI shows "Download Receipt" link when `fileUrl` is present
- [ ] Verify files appear in S3 bucket console (screenshot needed)
- [ ] Test full flow end-to-end (screenshots needed)
- [ ] Confirm signed URLs expire after 1 hour (or reduced `expiresIn` for testing)
