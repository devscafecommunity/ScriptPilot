// Show the system information
const os = require('os');

function osinfoMsg(){
    let msg = `
———————————————————————————————————————————————
¦**OS Information**
———————————————————————————————————————————————
¦ Hostname: ${os.hostname()}
¦ Platform: ${os.platform()}
¦ Arch: ${os.arch()}
———————————————————————————————————————————————
¦ Plataform: ${os.platform()}
¦ OS: ${os.type()}
¦ CPU: ${os.cpus().length > 0 ? os.cpus()[0].model : 'N/A'}
¦ Cores: ${os.cpus().length}
¦ Total Memory: ${os.totalmem() / 1024 / 1024 / 1024} GB
¦ Free Memory: ${os.freemem() / 1024 / 1024 / 1024} GB
¦ Uptime: ${os.uptime() / 60 / 60} hours
———————————————————————————————————————————————
`
    return msg
}


module.exports = {
    osinfoMsg: osinfoMsg
}