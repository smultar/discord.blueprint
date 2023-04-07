import 'dotenv/config'; // Imports .env file
import 'colors'; // Imports colors for console logs

import { Client, GatewayIntentBits, Collection, Partials, ActivityType, Status } from 'discord.js';

// Create a new client instance
global.client = Object.assign(
    
    new Client({
    
            intents: [
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
    
            partials: [
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
                        name: 'with the code',
                        type: ActivityType.Listening
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
const token = process.env.TOKEN;

// Check if token is provided
if (!token) {
    console.warn('No token provided. Please add a token to the .env file.'.orange);
    process.exit();
}

//