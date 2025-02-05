// Este codigo executa um comando a cada x tempo
// Exmplo: 
/* 
git add . && git commit -m "bkp dd/mm/yyyy hh:mm" && git push
*/ 

const { exec } = require('child_process');

function timedCmd() {
    // do node cmdtrigger.js the command is inside cmdtrigger.js this just triggers it
    exec("node cmdtrigger.js", (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    });
}

module.exports = timedCmd; // Export the main function