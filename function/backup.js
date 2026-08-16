module.exports =

  async function (filename, where) {

    if (process.env.DEV == 1) {
        const skipMsg = (await ougi.text('en', "console_backupDevSkip")).replace(/{filename}/g, filename);
        console.log(skipMsg);
        return;
    }

    var event = new Date();

    await client.channels.cache.get(where).send({
      files: [filename]
    })
      .then()
      .catch(console.error);
  }
