export default class Event {

    constructor(object) {
        this.name = object.name;
        this.once = object.once || false;
        this.execute = object.execute;
    }
}