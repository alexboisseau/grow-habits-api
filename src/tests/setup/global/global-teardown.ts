import { stopDocker } from './docker-manager';

const teardown = async () => {
  await stopDocker();
  console.log('\n🐳 Docker stopped\n');
};

export default teardown;
