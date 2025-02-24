import { execSync } from 'child_process';
import readline from 'readline-sync';

console.log('Pre-commit hook started.');

const choice = readline.question('Do you want to change the version number? (yes/no) ');

if (choice.toLowerCase() === 'yes') {
  const newVersion = readline.question('Enter the new version number (e.g., 1.0.1): ');
  execSync(`npm version ${newVersion} --no-git-tag-version`, { stdio: 'inherit' });
  console.log(`Version number updated to ${newVersion}.`);

  // Automatically stage the version change
  execSync('git add package.json package-lock.json', { stdio: 'inherit' });
  console.log('Version change staged.');
} else {
  console.log('Version number remains unchanged.');
}

console.log('Pre-commit hook finished.');
