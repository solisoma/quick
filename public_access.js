// const path = require('path')
// const RootDirectory = '../../'
const quickTable = require('./structure')
const init = require('./control/quick')
const set = require('./control/set')
const deploy = require('./control/deploy')
const settings = require('./settings')

module.exports = {quickTable,settings,init,set,deploy}
  