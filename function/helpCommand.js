module.exports = async function (args, msg) {
    const command = args[0]?.toLowerCase();
    await ougi.commandList.executeHelp(command, args, msg);
};
