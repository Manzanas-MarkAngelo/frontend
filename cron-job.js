const cron = require('node-cron');
const { exec } = require('child_process');

// Schedule the job to run at 8 PM every day
cron.schedule('0 20 * * *', () => {
  console.log('Executing scheduled job...');
  exec('php "C:\\Users\\chrystelle\\Capstone\\frontend\\controller_lis\\auto_timeout.php"', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Script error output: ${stderr}`);
      return;
    }
    console.log(`Script output: ${stdout}`);
  });
});

console.log('Cron job scheduled to run at 8 PM daily.');