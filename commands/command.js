const divide = require('./divide.js')
const pick = require('./pick.js')

module.exports.exec = async (client, message) => {
  let commands = message.content.split(' ').filter(element => {
    return element !== ''
  })
  if (commands.length < 2) {
    return null
  }
  
  console.log(commands)
  switch (commands[1]) {
    case 'divide':
      return divide.exec(client, message, commands)
    case 'pick':
      return await pick.exec(commands)
    default: break
  }
}