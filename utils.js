module.exports.getChannel = (client, guildId, channelName) => {
  return client.channels.cache.find(element => {
    return element.guild.id === guildId && element.type === 'voice' && element.name === channelName
  })
}

// https://www.nxworld.net/js-array-shuffle.html
module.exports.shuffle = (array) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // ここの;がないとエラー発生なので注意.
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array
}