# AI Services Console

![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)
![Development](https://img.shields.io/badge/Status-Under%20Development-yellow)

Frontend application for authentication and AI chat interactions, built with Angular 21.
The backend API for this frontend is built with Spring Boot.

This project is currently under development and is maintained as a hobby/learning project. Features are being actively built and refined.

## Overview

AI Services Console provides:

- Email/password authentication (login and register using email as the identifier)
- Real-time email availability check during registration
- Email verification flow with token-based confirmation and resend support
- Forgot password, reset password (token-based), and change password (authenticated) flows
- OAuth2 login/registration flow with success and error handling
- Public-only guard for auth pages and protected route guard for authenticated pages
- Email verification required to access app features — unverified users can log in but cannot use the application until their email is confirmed
- Verification banner shown to unverified users with inline resend functionality
- Permission-aware multi-chat type support (`/ai/chat/types`)
- Chat UI with chat type selector, access-aware empty states, stop/clear actions, and markdown responses
- Light/Dark theme toggle with persisted user preference
- Responsive auth and chat screens (mobile-first behavior for auth side panel)
- Lazy-loaded route components for improved initial load performance
- Angular SSR-compatible build output

## Tech Stack

- Angular 21
- Angular Material and CDK
- RxJS
- Express (SSR runtime)
- Backend API: Spring Boot (separate service)

## Prerequisites

- Node.js 20+ (Node 24 is used in Render build settings)
- npm 10+

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start local development server:

```bash
ng serve
```

3. Open the app:

http://localhost:4200

## Environment Configuration

Environment values are defined in:

- src/environments/environment.ts
- src/environments/environment.prod.ts

The API endpoint can be configured in the environment files. By default:

- Development: http://localhost:8080/api

If your backend URL changes, update the environment files as needed.

## Available Scripts

- npm start: Run Angular dev server
- npm run build: Build the application
- npm run watch: Development build in watch mode
- npm run serve:ssr:ai-services-console: Serve SSR output from dist

## Project Structure

- src/app/core: Shared models, services, guards, interceptors
- src/app/features/auth: Login, register, forgot/reset/change password, email verification, OAuth success/error pages
- src/app/features/chat: Chat feature and message model
- src/app/shared/components: Reusable UI components (tabs, theme toggle, user menu, verification banner, password visibility toggle)

## Routing Summary

| Path | Access | Description |
|---|---|---|
| `/login` | Public only | Email/password login |
| `/register` | Public only | User registration with email availability check |
| `/forgot-password` | Public | Request a password reset link via email |
| `/reset-password?token=` | Public | Set a new password using a reset token |
| `/verify-email?token=` | Public | Confirm email address using a verification token |
| `/oauth-success` | Public | OAuth2 callback success handler |
| `/oauth-error` | Public | OAuth2 callback error handler |
| `/change-password` | Authenticated | Change password while logged in |
| `/chat` | Authenticated | AI chat interface |

## Auth Flows

### Registration
Users register with full name, email, and password. Email availability is checked in real time. After successful registration, a verification email is sent. Unverified users can log in but are restricted from using app features until their email is verified. A persistent verification banner is shown with an option to resend the verification link.

### Email Verification
Clicking the link in the verification email navigates to `/verify-email?token=...`. The token is validated automatically on page load. If the account is already verified, the flow proceeds without an error.

### Forgot / Reset Password
1. User submits their email at `/forgot-password`.
2. A password reset link is emailed to the user.
3. User follows the link to `/reset-password?token=...` and sets a new password.

### Change Password
Authenticated users can change their password at `/change-password` by providing their current password and a new password (with confirmation).

### OAuth2
Google (and other configured providers) are supported. After the provider callback, the app lands on `/oauth-success` to complete the session, or `/oauth-error` if the flow fails.

## Build

### Build Locally

Before pushing code for deployment, always run a local production build:

```bash
ng build --configuration production
```

Only push after this command succeeds.

Build output is generated under:

dist/ai-services-console/browser

### Deploy on Render

To deploy this application on Render:

1. Create a new Render service as a Web Service.
2. Connect your repository.
3. Set Build Command:

```bash
npm install && npm run build
```

4. Set Start Command:

```bash
node dist/ai-services-console/server/server.mjs
```

5. Deploy the service.

## Troubleshooting

- Auth requests fail locally:
	- Ensure backend is running and accessible at the configured API endpoint

- Redirects to login unexpectedly:
	- Verify `/me` returns a valid user for your token
	- Verify token is present in browser localStorage

- Email verification link not received:
	- Check spam/junk folder
	- Use the "Send verification link" option in the verification banner

- Reset/verify token rejected:
	- Tokens are single-use and time-limited; request a new one if expired

- Chat types not visible:
	- Verify backend endpoint `/ai/chat/types` is reachable
	- Verify logged-in user has required chat permissions (for example `chat:aviation:use`, `chat:generic:use`)

- Chat endpoint errors:
	- Verify backend AI endpoints are available under `/ai/chat/{type}` and `/ai/chat/{type}/conversation`

- Theme does not persist:
	- Verify browser localStorage is enabled (theme key: `app-theme`)

## License

No license specified.
