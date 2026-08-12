module.exports =

  async function (filename, where) {

    if (process.env.DEV) {
        console.log(`Skipping upload for ${filename} (reason: DEV)`);
        return;
    }

    var event = new Date();

    await client.channels.cache.get(where).send({
      files: [filename]
    })
      .then()
      .catch(console.error);
  }
