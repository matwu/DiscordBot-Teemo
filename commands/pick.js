const got = require('got')
const utils = require('../utils.js')

const types = [
  'Fighter', 'Tank', 'Mage', 'Assassin', 'Marksman', 'Support'
]

module.exports.exec = async (commands) => {
  let number = commands[2]
  if (commands[3] !== 'champions') {
    return null
  }
  try {
    const apiResponse = await got('http://ddragon.leagueoflegends.com/cdn/11.11.1/data/ja_JP/champion.json')
    const obj = JSON.parse(apiResponse.body)
    let keys = Object.keys(obj.data)
    keys = utils.shuffle(keys)
    if (commands[4] + commands[5] + commands[6] === 'ineachtypes') {
      return picksChampionsInEachTypes(obj, keys, number)
    } else {
      return picksChampions(obj, keys, number)
    }
  } catch (error) {
    console.log(error)
  }
}

const picksChampions = (obj, keys, number) => {
  let picks = []
  for (let i = 0; i < number; i++) {
    let champion = obj.data[keys[i]]
    picks.push(champion.name)
  }
  console.log(picks)
  return picks.join('\n')
}

const picksChampionsInEachTypes = (obj, keys, number) => {
  let picks = []
  types.forEach((type) => {
    picks[type] = []
  })
  let completedTypes = []
  for (const key of keys) {
    if (completedTypes.length >= Object.keys(picks).length) { break }
    let champion = obj.data[key]
    let tags = utils.shuffle(champion.tags)
    if (tags.length <= 0) { return } 
    for (const tag of tags) {
      if (picks[tag].length >= number) {
        if (!completedTypes.includes(tag)) {
          completedTypes.push(tag)
        }
        continue
      }
      picks[tag].push(champion.name)
      break
    }
  }
  console.log(picks)
  let response = ''
  for (const key of Object.keys(picks)) {
    response += '[' + key + ']\n'
    response += picks[key].join('\n')
    response += '\n\n'
  }
  return response
}