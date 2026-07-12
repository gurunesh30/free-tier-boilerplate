# jin-sakai-bpt

An interactive CLI that scaffolds a production-ready SaaS project with free-tier provider integrations pre-wired. Answer a few prompts and walk away with a working React application, environment configuration, and live connectivity checks against the services you selected.

---

## Table of Contents

- [Overview](#overview)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Supported Providers](#supported-providers)
- [Generated Project Structure](#generated-project-structure)
- [Available Scripts in Generated Projects](#available-scripts-in-generated-projects)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [Local Development Setup](#local-development-setup)
- [Project Structure](#project-structure)
- [License](#license)

---

## Overview

`jin-sakai-bpt` is a Node.js CLI tool published on npm. When executed, it walks through an interactive prompt sequence to collect a project name and a selection of backend service providers. It then copies a React + Vite template into a new directory, injects provider-specific environment variable scaffolding, and drops in a pre-flight connectivity script that validates credentials before any development server starts.

The goal is to eliminate the repetitive setup work at the start of a SaaS project — folder structure, environment files, provider wiring, and connection verification — so development can begin from a known-good state.

---

## Requirements

- Node.js 18 or higher
- npm 9 or higher

---

## Installation

**Run without installing (recommended):**

```bash
npx jin-sakai-bpt
```

**Install globally:**

```bash
npm install -g jin-sakai-bpt
```

Once installed globally, the `jin-sakai-bpt` command is available anywhere on your system.

---

## Usage

Navigate to the directory where you want to create your project, then run:

```bash
npx jin-sakai-bpt
```

or, if installed globally:

```bash
jin-sakai-bpt
```

The CLI will prompt for:

1. **Project name** — used as the output directory name and the generated `package.json` name field.
2. **Provider selection** — a multi-select list of free-tier services to integrate. Any combination is valid; selecting none produces a clean React template.
3. **Confirmation** — a summary is shown before any files are written to disk.

After scaffolding completes, follow the printed next steps:

```bash
cd <project-name>
npm install
npm run check
npm run dev
```

`npm run check` runs the pre-flight connectivity script and verifies that all configured credentials are reachable. It is safe to run at any time after populating `.env`.

---

## Supported Providers

| Provider      | Environment Variables                                                                 | Notes                                      |
|---------------|---------------------------------------------------------------------------------------|--------------------------------------------|
| Supabase      | `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`         | Auth, Postgres database, and file storage  |
| Stripe        | `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`   | Payments, subscriptions, billing portal    |
| MongoDB Atlas | `MONGODB_URI`                                                                         | Managed NoSQL, 512 MB free tier            |
| Resend        | `RESEND_API_KEY`                                                                      | Transactional email                        |

Each selected provider adds its corresponding variables to both `.env` and `.env.example` in the generated project. The values in `.env.example` are placeholder strings and must be replaced with real credentials before running `npm run check`.

---

## Generated Project Structure

```
<project-name>/
├── scripts/
│   └── check-env.js        # Pre-flight connectivity script
├── src/
│   ├── App.tsx
│   └── main.tsx
├── .env                    # Populated with provider variable stubs
├── .env.example            # Safe-to-commit copy of .env with placeholder values
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Available Scripts in Generated Projects

| Script              | Description                                                                        |
|---------------------|------------------------------------------------------------------------------------|
| `npm run check`     | Runs the pre-flight script to verify all configured provider credentials           |
| `npm run dev`       | Runs the pre-flight check then starts the Vite development server                  |
| `npm run build`     | Type-checks and builds the application for production                              |
| `npm run preview`   | Serves the production build locally for inspection                                 |

---

## Environment Variables

After scaffolding, open `.env` and replace each placeholder with a real value. The file is pre-populated based on the providers you selected during setup.

The pre-flight script (`scripts/check-env.js`) reads `.env` directly, loads the variables into the process environment, and attempts a live connection to each configured provider. A provider check is skipped if its corresponding variables still contain placeholder text.

**Supabase example:**

```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

**Important:** `.env` is listed in `.gitignore` and must never be committed. Only `.env.example` (containing placeholders, no real secrets) should be tracked in version control.

---

## Contributing

Contributions are welcome. The project follows a standard fork-and-PR workflow on GitHub.

### Reporting Issues

Open a GitHub issue and include:

- The exact command you ran
- The full terminal output
- Your Node.js version (`node --version`) and operating system

### Submitting a Pull Request

1. Fork the repository on GitHub.
2. Create a branch from `main` with a descriptive name:
   - `feat/add-planetscale-provider`
   - `fix/env-quote-stripping`
   - `docs/update-readme`
3. Make your changes following the local development setup below.
4. Verify the build passes: `npm run build`.
5. Test end-to-end by running `npm run dev` and scaffolding a project that exercises your change.
6. Open a pull request against `main` with a clear description of what changed and why.

Write focused commits — each commit should represent a single logical change. Do not commit `.env` files or any file containing real credentials.

### Adding a New Provider

1. Add an entry to the `PROVIDERS` array in `src/index.ts`.
2. Add a corresponding entry to `PROVIDER_ENV_MAP` in `src/utils/generator.ts` with the required environment variable stubs.
3. Add a connectivity check function in `src/templates/scripts/check-env.js` and call it from `runPreflightChecks`.

### Modifying the Template

Edit files under `src/templates/react-app/`. Since the template directory is copied at runtime rather than compiled, changes are reflected immediately when running `npm run dev`.

---

## Local Development Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-org/jin-sakai-bpt.git
cd jin-sakai-bpt
npm install
```

Run the CLI directly from source without a build step:

```bash
npm run dev
```

To produce a production build:

```bash
npm run build
```

The build compiles `src/` to `dist/` and marks `dist/index.js` as executable. The `src/templates/` directory is excluded from TypeScript compilation — it is copied to generated projects at runtime.

To test the built binary locally before publishing:

```bash
npm link
jin-sakai-bpt
```

---

## Project Structure

```
jin-sakai-bpt/
├── src/
│   ├── index.ts                        # CLI entry point and prompt flow
│   ├── utils/
│   │   └── generator.ts                # File generation and copy logic
│   └── templates/
│       ├── react-app/                  # Base React + Vite template
│       │   ├── src/
│       │   │   ├── App.tsx
│       │   │   └── main.tsx
│       │   ├── index.html
│       │   ├── package.json
│       │   ├── tsconfig.json
│       │   └── vite.config.ts
│       └── scripts/
│           └── check-env.js            # Pre-flight script copied into each generated project
├── dist/                               # Compiled output (git-ignored)
├── package.json
└── tsconfig.json
```

**Key source files:**

- `src/index.ts` — orchestrates the prompt flow, validates input, calls the generator, and prints next steps.
- `src/utils/generator.ts` — handles all file system operations: copying the template, writing `package.json`, generating `.env` and `.env.example` from the provider map.
- `src/templates/scripts/check-env.js` — provider connectivity checker copied verbatim into every generated project.

---

## License

ISC
