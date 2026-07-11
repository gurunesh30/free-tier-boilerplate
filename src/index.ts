#!/usr/bin/env node
import {
  intro,
  outro,
  text,
  multiselect,
  confirm,
  spinner,
  note,
  log,
  isCancel,
  cancel,
} from '@clack/prompts';
import color from 'picocolors';
import gradient from 'gradient-string';
import { setTimeout as sleep } from 'node:timers/promises';
import { generateProject } from './utils/generator.js';

// ---------------------------------------------------------------------------
// Visual helpers
// ---------------------------------------------------------------------------

// Crimson red -> deep blue, edged like a katana catching two lights.
const brand = gradient(['#dc2626', '#7f1d1d', '#1e3a8a', '#1d4ed8']);
const okGradient = gradient(['#dc2626', '#1d4ed8']);

const BANNER = `
     ██╗██╗███╗   ██╗    ███████╗ █████╗ ██╗  ██╗ █████╗ ██╗
     ██║██║████╗  ██║    ██╔════╝██╔══██╗██║ ██╔╝██╔══██╗██║
     ██║██║██╔██╗ ██║    ███████╗███████║█████╔╝ ███████║██║
██   ██║██║██║╚██╗██║    ╚════██║██╔══██║██╔═██╗ ██╔══██║██║
╚█████╔╝██║██║ ╚████║    ███████║██║  ██║██║  ██╗██║  ██║██║
 ╚════╝ ╚═╝╚═╝  ╚═══╝    ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝
              S a a S   B o i l e r p l a t e`;

/** Simple typewriter effect for flavor text. */
async function typewriter(msg: string, delayMs = 12) {
  for (const char of msg) {
    process.stdout.write(char);
    await sleep(delayMs);
  }
  process.stdout.write('\n');
}

/** Rotating "thinking" style loader with custom status messages, Claude-Code style. */
async function rotatingLoader(messages: string[], totalMs = 1400) {
  const frames = ['◐', '◓', '◑', '◒'];
  const perMessage = Math.max(totalMs / messages.length, 260);
  let frameIdx = 0;

  for (const msg of messages) {
    const start = Date.now();
    while (Date.now() - start < perMessage) {
      const frame = frames[frameIdx % frames.length];
      process.stdout.write(`\r${color.red(frame)} ${color.dim(msg)}${' '.repeat(10)}`);
      frameIdx++;
      await sleep(80);
    }
  }
  process.stdout.write(`\r${' '.repeat(60)}\r`);
}

function checkCancel<T>(value: T | symbol, message = 'Operation cancelled.'): T {
  if (isCancel(value)) {
    cancel(color.red(message));
    process.exit(0);
  }
  return value as T;
}

// ---------------------------------------------------------------------------
// Provider metadata (icons + short descriptions for a richer selection UI)
// ---------------------------------------------------------------------------

const PROVIDERS = [
  {
    value: 'supabase',
    label: '◆ Supabase',
    hint: 'Auth, Postgres DB & storage — generous free tier',
  },
  {
    value: 'stripe',
    label: '◆ Stripe',
    hint: 'Payments, subscriptions & billing portal',
  },
  {
    value: 'mongodb',
    label: '◆ MongoDB Atlas',
    hint: 'Managed NoSQL cluster, 512MB free forever',
  },
  {
    value: 'resend',
    label: '◆ Resend',
    hint: 'Transactional email with a clean React email API',
  },
] as const;

// ---------------------------------------------------------------------------
// Main flow
// ---------------------------------------------------------------------------

async function main() {
  console.clear();
  console.log(brand(BANNER));
  console.log();
  await typewriter(color.dim('  The fastest way to scaffold a production-ready SaaS.'), 8);
  console.log();

  intro(color.bgRed(color.white(' ▸ create-saas-boilerplate ')));

  // 1. Project name -----------------------------------------------------
  const projectName = checkCancel(
    await text({
      message: 'What should we call your project?',
      placeholder: 'my-awesome-saas',
      validate(value) {
        if (!value || value.trim().length === 0) return 'Project name is required!';
        if (/[<>:"/\\|?*]/.test(value)) return 'Invalid characters in folder name.';
      },
    }),
  );

  // 2. Provider selection -------------------------------------------------
  const providers = checkCancel(
    await multiselect({
      message: 'Select the free-tier providers to wire up:',
      options: PROVIDERS.map((p) => ({ value: p.value, label: p.label, hint: p.hint })),
      required: false,
    }),
  ) as string[];

  // 3. Confirm summary before touching disk -------------------------------
  const summaryLines = [
    `${color.dim('Project:')}   ${color.bold(projectName)}`,
    `${color.dim('Providers:')} ${
      providers.length
        ? providers
            .map((v) => PROVIDERS.find((p) => p.value === v)?.label ?? v)
            .join('  ')
        : color.dim('none (clean template)')
    }`,
  ].join('\n');

  note(summaryLines, '▸ Summary');

  const proceed = checkCancel(
    await confirm({ message: 'Scaffold the project with these settings?' }),
  );

  if (!proceed) {
    outro(color.yellow('No changes made. Run again anytime.'));
    return;
  }

  // 4. Generate -------------------------------------------------------------
  console.log();
  await rotatingLoader(
    [
      'Sharpening the blade...',
      'Cooking up the boilerplate...',
      'Scaffolding your stack...',
    ],
    1500,
  );

  const s = spinner();
  s.start(`Scaffolding ${color.cyan(`./${projectName}`)}`);

  const steps: Array<[string, () => Promise<void>]> = [
    ['◇ Creating folder structure', async () => sleep(250)],
    ['◇ Writing configuration files', async () => sleep(250)],
    [
      '◇ Wiring up providers',
      async () => {
        if (providers.length === 0) return;
        for (const p of providers) {
          const meta = PROVIDERS.find((x) => x.value === p);
          s.message(`◇ Wiring up ${meta?.label.replace('◆ ', '') ?? p}...`);
          await sleep(200);
        }
      },
    ],
  ];

  try {
    for (const [label, run] of steps) {
      s.message(label);
      await run();
    }

    // Delegate the actual file generation to the existing generator util.
    s.message('◇ Finalizing project files...');
    await generateProject(projectName, providers);

    s.stop(okGradient('✓ Project forged successfully!'));
  } catch (error) {
    s.stop(color.red('✗ Scaffolding failed.'));
    log.error(error instanceof Error ? error.message : String(error));
    outro(color.red('An error occurred during setup. Please check the logs above.'));
    process.exit(1);
  }

  // 5. Friendly onboarding instructions -------------------------------------
  const nextSteps = [
    `${color.dim('$')} cd ${projectName}`,
    `${color.dim('$')} npm install`,
    `${color.dim('$')} npm run dev`,
  ].join('\n');

  note(nextSteps, '▸ Next steps');

  if (providers.includes('supabase') || providers.includes('mongodb')) {
    note(
      `Don't forget to copy ${color.cyan('.env.example')} to ${color.cyan(
        '.env',
      )} and add your database credentials.`,
      '▸ Environment setup',
    );
  }

  console.log();
  console.log(brand('  Your stack is forged. Time to make the cut. ▸▸▸'));
  console.log();

  outro(color.dim('Star the repo if this saved you time ★'));
}

main().catch((error) => {
  log.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});