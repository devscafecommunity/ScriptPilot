// Este codigo executa um comando a cada x tempo
// Exmplo: 
/* 
git add . && git commit -m "bkp dd/mm/yyyy hh:mm" && git push
*/ 

let interval = 1000 * 60 * 60 * 24; // 24 horas
let cmd = [
    'cd .. && git add . && git commit -m "bkp dd/mm/yyyy hh:mm" && git push'
]

function timedCmd() {
    cmd.forEach(command => {
        setTimeout(() => {
            exec(command, (err, stdout, stderr) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(stdout);
            });
        }, interval);
    });
}

module.exports = timedCmd; // Export the main function