// this file includes function to deliver commands for each and every package id


export async function sendCommand(username: string, packageId: string) {
    const packageCommands = {
        "6941826": `lp user ${username} parent set knight`
    }
    const command: string | undefined = packageCommands[packageId as keyof typeof packageCommands];
    return command ? command : `No command found for package ID: ${packageId}`;
}