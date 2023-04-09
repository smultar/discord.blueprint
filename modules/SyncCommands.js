import { REST, Routes, Collection } from 'discord.js';
import { readdirSync } from 'fs';

/**
 * Syncs application commands with Discord's API.
 * 
 * @param {*} Token - Discord bot token.
 * @param {*} ClientID - Discord bot client ID.
 * @param {*} Commands - Commands folder path.
 */

const SyncCommands = async (Token, ClientID, Commands) => {

    const ApplicationCommands = [];
    const GuildCommands = new Collection();
    const Files = readdirSync(Commands).filter(file => file.endsWith('.js'));


    let access;

    // Check if file is accessible.
    try {
            
        access = await fs.access(Commands, fs.constants.R_OK);
        access = true;

    } catch (error) {

        access = false;
    }

    // IF the file is not accessible, then return.
    if (!access) return console.log(`No commands folder provided, the bot will not be able to use slash commands.`.yellow);

    // Get all commands from the commands folder.
    for (const file of Files) {

        const command = (await import(`${Commands}/${file}`)).default;

        // IF the command is a guild command, then push it to the guild commands array.
        if (command.guild) {
            let guild = GuildCommands.get(command.guild);

            if (!guild) return GuildCommands.set(command.guild, [command.command.data.toJSON()]);
            else return guild.push(command.data.toJSON());
        } 

        // ELSE push the command to the global commands array.
        ApplicationCommands.push(command.data.toJSON());
        
    }

    // Create a new REST instance.
    const rest = new REST({ version: '10' }).setToken(Token);

    // Sync global (/) commands with discord's API.
    try {

        await rest.put( Routes.applicationCommands(ClientID),
            { body: ApplicationCommands },
        );

        console.log(`Successfully synced ${ApplicationCommands.length} global (/) commands.`.green);
        
    } catch (error) {
        
        console.log(`Unable to synced ${ApplicationCommands.length} global (/) commands.`.red);
        console.error(error);
    }


    // Sync guild (/) commands with discord's API.
    try {
            
        for (const [guildId, commands] of GuildCommands) {
    
            await rest.put( Routes.applicationGuildCommands(ClientID, guildId),
                { body: commands },
            );
    
            console.log(`Successfully synced ${commands.length} guild (/) commands.`.green);
        }
            
    }
    catch (error) {
     
        console.log(`Unable to synced ${ApplicationCommands.length} guild (/) commands.`.red);
        console.error(error);
    }
                
}

export default SyncCommands;