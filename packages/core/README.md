# Growly Suite Core

The library should be used for internal purposes only. Main goal of the library is to handle database operations and provide a simple interface for the server and dashboard to interact with the database.

## Installation

To install the library in a monorepo, add the dependency to the sibling packages `package.json`:

```json
{
  "dependencies": {
    "@getgrowly/core": "workspace:*"
  }
}
```

And run `pnpm install` in the sibling packages.

## Usage

### Interact with the services

```typescript
import { createSuiteCore } from '@getgrowly/core';

/**
 * SDK for interacting with the Growly Suite API.
 */
export const suiteCore = createSuiteCore(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
```

### Reset the database

Provides credentials for Postgres connection following the `.env.example`:

```bash
PGHOST=
PGPORT=
PGDATABASE=
PGUSER=
PGPASSWORD=
```

And run the following command:

```bash
pnpm db:reset
```
