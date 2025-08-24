module.exports =

  async function (filename, where) {
    var event = new Date();

    await client.channels.cache.get(where).send({
      files: [filename]
    })
      .then()
      .catch(console.error);
  }
