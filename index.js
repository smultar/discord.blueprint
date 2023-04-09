import colors from 'colors'; // Imports colors for console logs
import Event from './templates/Event.js'; // Imports Events template
import Command from './templates/Command.js'; // Imports Commands template
import SyncCommands from './modules/SyncCommands.js';
import { readdirSync } from 'fs'; // Imports fs for reading files
// Discord.js imports
import { Client as discordjsClient, GatewayIntentBits, Collection, Partials, ActivityType, Status } from 'discord.js';

/**
 * Creates a new Discord client instance, based on the provided configuration.
 * 
 * @param {*} config - Configuration object for the client.
 * @param {string} events - Events folder path.
 * @param {string} commands - Commands folder path.
 * @returns {Client} - Returns a new client instance.
 */

const Client = async (config, events, commands) => {

    if (config == undefined) console.log(`No configuration provided, using default configuration.`.yellow);
    if (events == undefined) {
        console.log(`No events folder provided, using default events folder.`.yellow);
        events = './events';
    }

    if (commands == undefined) {
        console.log(`No commands folder provided, using default commands folder.`.yellow);
        commands = './commands';
    }

    // Create a new client instance
    const Client = Object.assign(

        new discordjsClient({

            intents: config.intents || [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.DirectMessageTyping,
                GatewayIntentBits.MessageContent
            ],

            partials: config.partials || [
                Partials.Channel,
                Partials.Message,
                Partials.User,
                Partials.GuildMember,
                Partials.Reaction
            ],

            allowedMentions: {
                parse: ['users', 'roles'],
                repliedUser: true
            },

            presence: {
                activities: [
                    {
                        name: 'Discord.blueprint',
                        type: ActivityType.Playing
                    }
                ],
                status: Status.Online
            },

        },
            // Collections
            {
                aliases: new Collection(),
                blocked: new Collection(),
                cooldowns: new Collection(),
                commands: new Collection(),
            }
        )

    );

    // Pull token from .env file
    const token = config.token

    // Check if token is provided
    if (token == undefined) {
        console.warn(`Exiting process, ${'No token'.bgBlack} provided. Please add a token to config property`.red);
        process.exit();
    }

    // Sync commands with Discord's API
    SyncCommands(token, config.id, commands);
    
    global.client = Client;

    // Login to Discord
    await Client.login(token);


    // Import event handlers
    const Files = readdirSync(events).filter(file => file.endsWith('.js'));

    // Attach events to the client.
    for (const file of Files) {

        // Import the event.
        const event = (await import(`${events}/${file}`)).default;

        // IF the event is once, then execute it once.
        if (event.once) Client.once(event.name, event.execute);

        // ELSE attach the event to the client handler.
        else Client.on(event.name, event.execute);

    }
    

    return Client;
};


export { Client, Event, Command };
