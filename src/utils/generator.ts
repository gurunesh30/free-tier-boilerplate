import fs from 'fs-extra';
import path from 'path';

const PROVIDER_ENV_MAP: Record<string, string> = {
  supabase: `# Supabase Credentials\nNEXT_PUBLIC_SUPABASE_URL=your-supabase-url-here\nSUPABASE_ANON_KEY=your-anon-key-here\nSUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here\n\n`,
  stripe: `# Stripe Credentials\nSTRIPE_SECRET_KEY=your-stripe-secret-key-here\nNEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-pub-key-here\nSTRIPE_WEBHOOK_SECRET=your-webhook-secret-here\n\n`,
  mongodb: `# MongoDB Atlas Credentials\nMONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/myFirstDatabase\n\n`,
  resend: `# Resend Email Credentials\nRESEND_API_KEY=re_your_api_key_here\n\n`,
};

export async function generateProject(projectName: string, providers: string[]) {
  const targetDir = path.resolve(process.cwd(), projectName);
  await fs.ensureDir(targetDir);

  // Fallback to standard process directory mapping to resolve template paths cleanly in any build module target
  const baseReactTemplate = path.resolve(process.cwd(), 'src/templates/react-app');
  const connectivityScriptSrc = path.resolve(process.cwd(), 'src/templates/scripts/check-env.js');

  // Copy template framework or build bare fallback boilerplate
  if (await fs.pathExists(baseReactTemplate)) {
    await fs.copy(baseReactTemplate, targetDir);
  } else {
    await fs.ensureDir(path.join(targetDir, 'src'));
    await fs.writeJson(path.join(targetDir, 'package.json'), {
      name: projectName,
      version: "0.1.0",
      private: true,
      type: "module",
      scripts: {
        "dev": "node scripts/check-env.js && vite",
        "check": "node scripts/check-env.js"
      },
      dependencies: {
        "mongodb": "^6.13.0"
      }
    }, { spaces: 2 });
  }

  // Inject connectivity script targets
  const scriptDestDir = path.join(targetDir, 'scripts');
  await fs.ensureDir(scriptDestDir);
  
  if (await fs.pathExists(connectivityScriptSrc)) {
    await fs.copy(connectivityScriptSrc, path.join(scriptDestDir, 'check-env.js'));
  } else {
    const fallbackScript = await fs.readFile(path.resolve(process.cwd(), 'src/templates/scripts/check-env.js'), 'utf-8').catch(() => '');
    await fs.writeFile(path.join(scriptDestDir, 'check-env.js'), fallbackScript);
  }

  // Construct customized .env matching selected provider choices
  let envContent = `# Environment configuration generated for ${projectName}\n\n`;
  providers.forEach((provider) => {
    if (PROVIDER_ENV_MAP[provider]) {
      envContent += PROVIDER_ENV_MAP[provider];
    }
  });

  await fs.writeFile(path.join(targetDir, '.env'), envContent);
  await fs.writeFile(path.join(targetDir, '.env.example'), envContent);
}