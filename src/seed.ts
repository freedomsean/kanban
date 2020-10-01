import { TestingLib } from './test/testing.lib';

const args = process.argv.slice(2);

if (args[0] === 'up') {
  (async () => {
    await TestingLib.connectToDB();
    await TestingLib.createTestTask();
    await TestingLib.closeDBConnection();
  })();
} else {
  (async () => {
    await TestingLib.connectToDB();
    await TestingLib.deleteTestUser();
    await TestingLib.closeDBConnection();
  })();
}
