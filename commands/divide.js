const utils = require('../utils.js')

module.exports.exec = (client, message, commands) => {
  let channel = utils.getChannel(client, commands[2])
  if (commands[3] !== 'into') {
    return null
  }
  let number = commands[4]
  let authorId = message.author.id
  let teams = divideTeam(channel, number, authorId)
  console.log(teams)
  let response = ''
  for (let i = 0; i < number; i++) {
    response += '[チーム' + (i + 1) + ']\n'
    response += teams[i].join('\n')
    response += '\n\n'
  }
  return response
}

const divideTeam = (channel, number, authorId) => {
  let membersIterator = channel.members.keys()[Symbol.iterator]()
  var names = []
  for (const item of membersIterator) {
    let user = channel.members.get(item).user
    let isMute = channel.guild.voiceStates.cache.get(user.id).mute
    if (!isMute) {
      names.push(user.username)
    }
  }
  console.log(names)
  names = utils.shuffle(names)
  
  // チーム分割数よりもメンバーが少ない場合は無効とする
  if (names.length < number) {
    return
  }
  
  let teams = []
  let step = names.length / number
  for(let i = 0; i < number; i++) {
    teams.push(names.slice(step * i, step * (i+1)))
  }
  return teams
}