function eventloader(path, requirePath){
    const fs = require('fs');

    let events = [];
    const eventFiles = fs.readdirSync(path).filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const event = require(`${requirePath}${file}`);
        events.push(event);
    }
    return events;
}

module.exports = eventloader;