function eventHandler(clientObject, events){
    for (const event of events) {
        if(event.once) {
            clientObject.once(event.name, (...args) => event.execute(...args, clientObject));
        } else {
            clientObject.on(event.name, (...args) => event.execute(...args, clientObject));
        }
    }
}

module.exports = eventHandler;