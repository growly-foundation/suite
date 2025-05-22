import { execSync } from 'child_process';
import process from 'process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { stripVTControlCharacters } from 'util';

const packageName = '@getgrowly/suite';
const widgetsPath = 'packages/widgets';

function getNextVersion() {
  const currentFilePath = fileURLToPath(import.meta.url);
  const currentDir = path.dirname(currentFilePath);

  // Move to monorepo root
  const monorepoRoot = path.resolve(currentDir, '../../..');
  process.chdir(monorepoRoot);

  let nextVersion = '';

  try {
    // This throws an error if there are no changes in any packages
    const output = execSync('pnpm changeset status --verbose', {
      encoding: 'utf-8',
    });

    const lines = output.split('\n');
    const widgetsVersionLine = lines.find(line => line.includes(packageName));

    if (!widgetsVersionLine) throw new Error('No widgets version line found');

    nextVersion = widgetsVersionLine.split(packageName)[1].trim();

    console.log('Version bump detected: ', nextVersion);

    if (!nextVersion) throw new Error('No widgets version found');
  } catch (error) {
    console.error('Error checking changeset status:\n', error.message);
  }

  if (!nextVersion) {
    try {
      // If changeset check fails, fall back to current version from package.json
      const packageJsonPath = path.join(widgetsPath, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      nextVersion = packageJson.version;
      console.log('Falling back to package.json version: ', nextVersion);
    } catch (error) {
      console.error('Error falling back to package.json:\n', error.message);

      process.exit(1);
    }
  }

  // Write version to dist/version.txt, adjusting for the directory change
  const versionPath = path.join(widgetsPath, 'dist/version.txt');
  fs.writeFileSync(versionPath, stripVTControlCharacters(nextVersion));
}

getNextVersion();
