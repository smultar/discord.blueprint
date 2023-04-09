import { readdirSync } from 'fs';

// Pulled commands from the commands folder.
const Files = readdirSync('../commands').filter(file => file.endsWith('.js'));

// Attach commands to the client.
for (const file of Files) {

    // Import the command.
    const command = (await import(`../commands/${file}`)).default;

    // Attach the command to the client.
    client.commands.set(command.data.name, command);

};

