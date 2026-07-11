#!/usr/bin/env node
import { intro, outro, text, multiselect, spinner, note } from '@clack/prompts';
import color from 'picocolors';
import { generateProject } from './utils/generator.js';

async function main() {
  // 1. Display a beautiful header intro
  intro(color.bgCyan(color.black(' Create SaaS Boilerplate CLI ')));

  // 2. Ask for the project name (with safe TypeScript string validation)
const projectName = await text({
    message: 'What is the name of your new project?',
    placeholder: 'my-awesome-saas',
    validate(value: string | undefined) {
      if (value === undefined || value.trim().length === 0) {
        return 'Project name is required!';
      }
      if (/[<>:"/\\|?*]/.test(value)) {
        return 'Invalid characters in folder name.';
      }
    },
  });

  // Handle Ctrl+C / cancellation gracefully
  if (typeof projectName === 'symbol') {
    outro(color.red('Operation cancelled.'));
    process.exit(0);
  }

  // 3. Ask the user to multi-select their free-tier providers
  const providers = await multiselect({
    message: 'Select the free-tier providers you want to integrate:',
    options: [
      { value: 'supabase', label: 'Supabase (Auth & Database)' },
      { value: 'stripe', label: 'Stripe (Payments & Billing)' },
      { value: 'mongodb', label: 'MongoDB Atlas (NoSQL Database)' },
      { value: 'resend', label: 'Resend (Email Delivery)' },
    ],
    required: false, // Allows them to select none if they just want a clean template
  });

  if (typeof providers === 'symbol') {
    outro(color.red('Operation cancelled.'));
    process.exit(0);
  }

  // 4. Trigger the project generation engine
  const s = spinner();
  s.start(`Scaffolding your project in ./${projectName}...`);
  
  try {
    // Cast safe inputs straight to the file generator
    await generateProject(projectName as string, providers as string[]);
    s.stop(color.green('Project structure created successfully!'));

    // 5. Friendly onboarding instructions
    note(
      `cd ${projectName}\nnpm install\nnpm run dev`,
      'Next steps to get started:'
    );

    outro(color.cyan('Happy coding! Your SaaS stack is ready to rock. 🚀'));
  } catch (error) {
    s.stop(color.red('Scaffolding failed.'));
    console.error(error);
    outro(color.red('An error occurred during setup.'));
    process.exit(1);
  }
}

main();