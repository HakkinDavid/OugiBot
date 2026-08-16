module.exports =

  async function (filename, where) {

    if (process.env.DEV == 1) {
        const skipMsg = await ougi.text({ lang: 'en', stringID: "console_backupDevSkip", values: { filename } });
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
