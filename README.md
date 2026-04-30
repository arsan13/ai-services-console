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
- OAuth2 login flow with success and error handling
- Protected chat route with auth guard
- Chat UI connected to backend AI endpoints
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

- /login: User login
- /register: User registration
- /oauth-success: OAuth callback success flow
- /oauth-error: OAuth callback error flow
- /chat: Protected chat page (requires auth)

## Build

### Build Locally

```bash
npm run build
```

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

- Chat endpoint errors:
	- Verify backend AI endpoints are available under /ai/chat.

## License

No license specified.
