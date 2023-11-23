import * as path from 'path';
import {
  DockerComposeEnvironment,
  StartedDockerComposeEnvironment,
} from 'testcontainers';
import * as ChildProcess from 'child_process';

let instance: StartedDockerComposeEnvironment | null = null;

export const startDocker = async () => {
  const composeFilePath = path.resolve(__dirname);

  const composeFile = 'docker-compose.yml';

  instance = await new DockerComposeEnvironment(
    composeFilePath,
    composeFile,
  ).up();

  console.log('\n🚀 running prisma migrate dev ...');
  ChildProcess.execSync('npm run prisma:migrate:dev');
};

export const stopDocker = async () => {
  if (!instance) return;

  try {
    await instance.down();
    instance = null;
  } catch (error) {
    console.error('failed to stop docker : ', error);
  }
};

export const getDockerEnvironment = () => {
  if (!instance) throw new Error('Instance is not available');

  return instance;
};
