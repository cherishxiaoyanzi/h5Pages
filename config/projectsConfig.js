const projectName = require('./project')
const projectA = require('../projectConfig/projectA')
const projectB = require('../projectConfig/projectB')
const config = {
  projectA: projectA,
  projectB: projectB,
}
const configObj = config[projectName.name]
module.exports = configObj