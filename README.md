# AI Services Console

![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)
![Development](https://img.shields.io/badge/Status-Under%20Development-yellow)

Frontend application for authentication and AI chat interactions, built with Angular 21.
The backend API for this frontend is built with Spring Boot.

This project is currently under development and is maintained as a hobby/learning project. Features are being actively built and refined.

## Overview

AI Services Console provides:

- Email/password authentication (login and register)
- OAuth2 login/registration flow with success and error handling
- Public-only guard for auth pages and protected chat route guard
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
- src/app/features/auth: Login, register, OAuth success/error pages
- src/app/features/chat: Chat feature and message model
- src/app/shared/components: Reusable UI components

## Routing Summary

- /login: User login (blocked for authenticated users)
- /register: User registration (blocked for authenticated users)
- /oauth-success: OAuth callback success flow
- /oauth-error: OAuth callback error flow
- /chat: Protected chat page (requires authenticated session)

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

- Chat types not visible:
	- Verify backend endpoint `/ai/chat/types` is reachable
	- Verify logged-in user has required chat permissions (for example `chat:aviation:use`, `chat:generic:use`)

- Chat endpoint errors:
	- Verify backend AI endpoints are available under `/ai/chat/{type}` and `/ai/chat/{type}/conversation`

- Theme does not persist:
	- Verify browser localStorage is enabled (theme key: `app-theme`)

## License

No license specified.
