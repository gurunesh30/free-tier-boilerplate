import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), '.env');
    const content = readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim();
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env file not found or unreadable
  }
}

loadEnv();

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function isValidCredential(value) {
  if (!value) return false;
  const placeholders = [
    'your-supabase-url-here',
    'your-anon-key-here',
    'your-service-role-key-here',
    'your-stripe-secret-key-here',
    'your-stripe-pub-key-here',
    'your-webhook-secret-here',
    '<username>',
    're_your_api_key_here'
  ];
  return !placeholders.some(placeholder => value.includes(placeholder));
}

async function checkSupabase(url, anonKey) {
  try {
    const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    const response = await fetch(`${cleanUrl}/rest/v1/`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    });
    if (response.ok || response.status === 401) {
      console.log(`${colors.green}✅ Supabase:${colors.reset} Reachable and running.`);
    } else {
      throw new Error();
    }
  } catch {
    console.log(`${colors.red}❌ Supabase Error:${colors.reset} Could not connect to API. Verify configuration.`);
  }
}

async function checkStripe(secretKey) {
  try {
    const response = await fetch('https://api.stripe.com/v1/customers?limit=1', {
      headers: { Authorization: `Bearer ${secretKey}` },
    });
    if (response.ok) {
      console.log(`${colors.green}✅ Stripe:${colors.reset} Authentication successful.`);
    } else {
      console.log(`${colors.red}❌ Stripe Error:${colors.reset} API Key rejected.`);
    }
  } catch {
    console.log(`${colors.red}❌ Stripe Error:${colors.reset} Network connection failed.`);
  }
}

async function checkMongoDB(uri) {
  try {
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 3000 });
    await client.connect();
    await client.db().admin().ping();
    console.log(`${colors.green}✅ MongoDB Atlas:${colors.reset} Connected successfully.`);
    await client.close();
  } catch (err) {
    if (err.code === 'ERR_MODULE_NOT_FOUND' || err.message?.includes('Cannot find module')) {
      console.log(`${colors.yellow}⚠️  MongoDB Error:${colors.reset} 'mongodb' driver not installed yet. Run npm install first.`);
    } else {
      console.log(`${colors.red}❌ MongoDB Error:${colors.reset} Connection timed out or credentials invalid.`);
    }
  }
}

async function runPreflightChecks() {
  console.log(`\n${colors.bold}${colors.cyan}🔄 Running SaaS Pre-flight Connectivity Checks...${colors.reset}\n`);

  const { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_ANON_KEY, STRIPE_SECRET_KEY, MONGODB_URI } = process.env;
  let checksRun = 0;

  if (isValidCredential(NEXT_PUBLIC_SUPABASE_URL) && isValidCredential(SUPABASE_ANON_KEY)) {
    await checkSupabase(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_ANON_KEY);
    checksRun++;
  }
  if (isValidCredential(STRIPE_SECRET_KEY)) {
    await checkStripe(STRIPE_SECRET_KEY);
    checksRun++;
  }
  if (isValidCredential(MONGODB_URI)) {
    await checkMongoDB(MONGODB_URI);
    checksRun++;
  }

  if (checksRun === 0) {
    console.log(`${colors.yellow}ℹ️  No active provider configurations detected. Populate your .env file to run connectivity checks.${colors.reset}`);
  }
  console.log(`\n${colors.cyan}--- Pre-flight complete ---\n${colors.reset}`);
}

runPreflightChecks();