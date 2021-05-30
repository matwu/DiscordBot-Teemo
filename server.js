const http = require('http')
const querystring = require('querystring')
const discord = require('discord.js')
const command = require('./commands/command.js')

const client = new discord.Client()

http.createServer(function(req, res) {
  if (req.method == 'POST') {
    var data = ""
    req.on('data', function(chunk) {
      data += chunk
    })
    req.on('end', function() {
      if (!data) {
        res.end('No post data')
        return
      }
      var dataObject = querystring.parse(data)
      console.log('post:' + JSON.stringify(dataObject))
      // GASで定期的にPOSTリクエストを送信してGlitchを起動し続けている.
      // https://script.google.com/home/projects/1oywwzdNhd77vAt0rVJ_ztTeUZS16PjCbNMc8fkj98SENYeE4igFVkViK/edit
      if(dataObject.type == 'wakeup') {
        console.log('Woke up in post')
        res.end()
        return
      }
      res.end()
    })
  } else if (req.method == 'GET') {
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end('Discord Bot is active now.\n')
  }
}).listen(3000)

client.on('ready', message => {
  console.log('Bot is ready.')
})

client.on('message', async message => {
  // BOT自身の発言は無効
  if (message.author.id == client.user.id || message.author.bot) {
    return
  }
  // BOTのメンション付き発言でなかった場合は無効
  if (!message.mentions.has(client.user.id)) {
    return
  }
  // コマンドの実行
  let response = await command.exec(client, message)
  sendMessage(message.channel.id, response)
})

if (process.env.DISCORD_BOT_TOKEN == undefined) {
 console.log('DISCORD_BOT_TOKEN has not been set.')
 process.exit(0)
}

client.login( process.env.DISCORD_BOT_TOKEN )

const sendMessage = (channelId, text, option={}) => {
  client.channels.cache.get(channelId).send(text, option)
    .then(console.log("メッセージ送信: " + text + JSON.stringify(option)))
    .catch(console.error)
}
