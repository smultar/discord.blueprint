import { Command } from 'discord.blueprint';
import { SlashCommandBuilder } from '@discordjs/builders';

export default new Command({
    name: 'ping',
    command: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    global: true,
    guild: false,
    execute: async (interaction) => {
        await interaction.reply('Pong!');
    }
});