import { execFileSync } from 'child_process';
import path from 'path';

const backendRoot = path.resolve(process.cwd(), '../smartbox-back');

const run = (command: string, args: string[], timeout: number) => {
  execFileSync(command, args, {
    cwd: backendRoot,
    stdio: 'inherit',
    timeout,
  });
};

export default function globalSetup() {
  run('docker', ['compose', '-f', 'docker-compose.e2e.yml', 'up', '-d', '--wait'], 300_000);
  run(
    'node',
    ['-r', 'ts-node/register', '-r', 'tsconfig-paths/register', 'src/e2e/seed.ts'],
    180_000,
  );
}
