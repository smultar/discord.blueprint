export default class Commands {

    constructor(object) {
        this.name = object.name;
        this.command = object.command;
        this.global = object.global || false;
        this.guild = object.guild || false;
        this.execute = object.execute;
    }
}