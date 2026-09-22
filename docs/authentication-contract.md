# Role-aware authentication contract

All account creation and sign-in requests identify one of three roles: `officer`, `manufacturer`, or `consumer`. The backend is authoritative: clients cannot use a different selected role to authenticate an existing account.

## Email registration

`POST /api/auth/send-otp`

```json
{ "email": "person@example.com" }
```

`POST /api/auth/verify-otp`

```json
{ "email": "person@example.com", "otp": "123456" }
```

After a successful OTP verification, call `POST /api/auth/register`.

Officer:

```json
{ "name": "Alice", "email": "alice@gov.in", "password": "StrongPassword", "role": "officer", "government_id": "GOV123456" }
```

Manufacturer:

```json
{ "name": "ABC Manufacturing", "email": "admin@abc.com", "password": "StrongPassword", "role": "manufacturer", "company_id": "COMP123456" }
```

Consumer:

```json
{ "name": "John", "email": "john@example.com", "password": "StrongPassword", "role": "consumer" }
```

The registration response sets the existing HttpOnly `access_token` cookie and returns a safe user object with `id`, `name`, `email`, and `role`.

## Sign-in

`POST /api/auth/login`

```json
{ "email": "person@example.com", "password": "StrongPassword", "role": "officer" }
```

The selected role must exactly match the stored role. A mismatch returns `401` without creating a session.

## Google OAuth

The frontend starts OAuth with `GET /api/auth/google?role=<role>&mode=login` for existing accounts or `mode=signup` for new accounts. Signup additionally includes the required `government_id` or `company_id` when applicable. The route validates the fields, stores the sensitive context server-side in MongoDB, and puts only a short-lived opaque reference in the signed session cookie. The callback consumes that context after Authlib validates its own OAuth state. Callback query parameters are never used as authority for a role.

## Current user

`GET /api/auth/me` returns:

```json
{ "id": "…", "name": "Alice", "email": "alice@gov.in", "role": "officer", "auth_provider": "email", "email_verified": true }
```

User records now contain `role`, `government_id`, `company_id`, and a nullable, flexible `document` field. Existing records are preserved; records without a valid role cannot authenticate until safely migrated with a role established from trusted source data. The main backend can later set `document` to verification-file metadata (for example `file_name`, `file_url`, `document_type`, and `uploaded_at`) without changing this authentication API.

## Development demo accounts

The development-only seed script is `backend/scripts/seed_demo_users.py`. It creates normal email/password users and refuses to run when `ENVIRONMENT=production`:

| Role | Email | Required ID |
| --- | --- | --- |
| Officer | `demo.officer@demo-company.in` | `DEMO-GOV-001` |
| Manufacturer | `demo.manufacturer@demo-company.in` | `DEMO-COMP-001` |

Set `DEMO_OFFICER_PASSWORD` and `DEMO_MANUFACTURER_PASSWORD` in `backend/.env`, then run `python scripts/seed_demo_users.py` from `backend/`. The script skips existing email addresses, so it is safe to rerun and does not alter the login endpoint.
