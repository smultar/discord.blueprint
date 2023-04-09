import { Events } from 'discord.js';
import Event from '../templates/Event.js';

export default new Event({
        name: Events.ClientReady,
        once: true,
        execute: async () => {
            console.log(`Logged into Discord successfully as ${client.user.tag}.`.green);
        }
    }
);