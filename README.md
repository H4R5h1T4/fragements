# Lab 1 – Express API Setup

## 1. Purpose of This Lab

This lab forms the **foundation** of everything that i am going to build later and will depend on this setup.

- A properly configured Node.js project
- A private GitHub repository
- A running Express API
- Structured logging
- Linting and formatting
- Debugging support in VSCode

## 2. Development Environment Requirements

The following tools are installed and working fine:

- **Node.js (LTS version)** – Backend runtime
- **npm** – Package manager (comes with Node.js)
- **Git (CLI)** – Version control
- **VSCode** – Code editor
- **curl** – HTTP testing tool
- **jq** – JSON formatting tool

### VSCode Extensions

- ESLint
- Prettier – Code Formatter

## 3. GitHub Repository Setup

### Create the Repository

- Repository name: `fragements`
- Visibility: **Private**
- Include:
  - README.md
  - Node `.gitignore`

### Clone the Repo

```bash
cd fragements
```

---

## 4. npm Project Initialization

Initializing the npm:

```bash
npm init -y
```

### Modify `package.json`

Updated the following:

- `version`: `0.0.1`
- `private`: `true`
- `license`: `UNLICENSED`
- `author`: H4R5h1T4
- `repository.url`: [Github repo URL](https://github.com/H4R5h1T4/fragements#)

### Installed Dependencies

```bash
npm install
```

### Commited Changes

```bash
git add package.json package-lock.json
git commit -m "Initial npm setup"
```

## 5. Code Formatting with Prettier

### Installed Prettier

```bash
npm install --save-dev --save-exact prettier
```

### Configuration Files

#### `.prettierrc`

Defined formatting rules:

- Single quotes
- 2‑space indentation
- 100 character line width

#### `.prettierignore`

```txt
node_modules/
package.json
package-lock.json
```

### VSCode Project Settings

`.vscode/settings.json` ensured:

- Auto‑format on save
- Prettier is the default formatter
- Unix line endings

### Commit

```bash
git add .prettierrc .prettierignore .vscode/settings.json
git commit -m "Add prettier"
```

## 6. Linting with ESLint

### Initialize ESLint

```bash
npm init @eslint/config@latest
```

Choose:

- Problems
- CommonJS
- Node.js
- JavaScript

### ESLint Config

Created `eslint.config.mjs` using modern ESLint standards.

### Add npm Script

```json
"lint": "eslint \"./src/**/*.js\""
```

### Commit

```bash
git add eslint.config.mjs package.json package-lock.json
git commit -m "Add eslint"
```

## 7. Structured Logging with Pino

### Installed Pino

```bash
npm install pino pino-pretty pino-http
```

### Logger Setup (`src/logger.js`)

- Used `info` level by default
- Switched to pretty logs in `debug` mode

### Commit

```bash
git add src/logger.js
git commit -m "Add pino logger"
```

## 8. Express Application Setup

### Installing Express & Middleware

```bash
npm install express cors helmet
```

### App Responsibilities (`src/app.js`)

- Initialize Express
- Attaching middleware
- Add logging
- Defining routes
- Handling 404s
- Handling server errors

### Health Check Route

`GET /` returns:

- Status
- Description
- Author
- GitHub URL
- Version
- Timestamp

### Commit

```bash
git add src/app.js
git commit -m "Initial express app"
```

## 9. Server Startup & Graceful Shutdown

### Install Stoppable

```bash
npm install stoppable
```

### Server File (`src/server.js`)

- Reading `PORT` from environment
- Defaults to port `8080`
- Logs server startup
- Supporting a graceful shutdown

### Commit

```bash
git add src/server.js
git commit -m "Add express server"
```

## 10. Running and Testing the Server

### Start Server

```bash
node src/server.js
```

### Test with Browser

```
http://localhost:8080
```

### Test with curl

```bash
curl localhost:8080
```

### Pretty Print with jq

```bash
curl -s localhost:8080 | jq
```

### Verify Headers

```bash
curl -i localhost:8080
```

---

## 11. npm Scripts & Environment Files

### `.env.debug`

```ini
FRAGMENTS_LOG_LEVEL=debug
```

### Scripts

- `start` – Production style run
- `dev` – Auto restart on changes
- `debug` – Debug mode with inspector

```json
"start": "node src/server.js",
"dev": "node --env-file=.env.debug --watch ./src/server.js",
"debug": "node --env-file=.env.debug --inspect=0.0.0.0:9229 --watch ./src/server.js"
```

# Lab 3

## Features

- REST API built with Express
- Centralized error handling (404 & 500)
- Logging using `pino-http`
- Security headers via `helmet`
- Response compression
- Passport.js initialized (authentication placeholder)
- CORS enabled
- Unit tests and coverage reports with Jest

---

## Installation

```bash
git clone https://github.com/yourusername/fragments.git
cd fragments
npm install
```

## Running the App

Start the server:
npm start
The app runs on http://localhost:3000 by default.

## Environment Variables

Created a .env file for environment-specific variables:
NODE_ENV=development
PORT=3000
FRAGMENTS_LOG_LEVEL=debug

For testing, an env.jest file is used to load test-specific variables.

## Testing

Run tests:
npm test

Run tests with coverage:
npm run coverage

Coverage thresholds:
Statements: 80%
Branches: 80%
Functions: 80%
Lines: 80%

Coverage HTML report is generated in coverage/lcov-report/index.html.

## API Endpoints

Method Route Description
GET / Health check & version info
GET /error-test Throws a test error (for testing)

- - 404 handler for unknown routes

## Error response format:

{
"status": "error",
"error": {
"message": "Error message",
"code": 500
}
}
