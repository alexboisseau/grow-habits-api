import { startDocker } from './docker-manager';

const setup = async () => {
  await startDocker();
  console.log('\n🐳 Docker started\n');
};

export default setup;
