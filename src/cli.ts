require('core-js/stable')
require('regenerator-runtime/runtime')

require('@babel/register')({
  extensions: ['.js', '.ts']
})

const { build, filesystem } = require('gluegun')

const BRAND = 'kits'

/**
 * Create the cli and kick it off
 */
async function run(argv) {
  // create a CLI runtime
  let cli = build()
    .brand(BRAND)
    .src(__dirname)
    .plugins('./node_modules', { matching: 'kits-*', hidden: true })
    .help() // provides default for help, h, --help, -h
    .version() // provides default for version, v, --version, -v

  const kits = filesystem.find({
    matching: [`.${BRAND}`, '!node_modules/**'],
    directories: true,
    files: false
  })
  cli = kits.reduce((cli, kit) => {
    return cli.plugin(kit, {
      name: BRAND
    })
  }, cli)

  cli = cli.create()
  // enable the following method if you'd like to skip loading one of these core extensions
  // this can improve performance if they're not necessary for your project:
  // .exclude(['meta', 'strings', 'print', 'filesystem', 'semver', 'system', 'prompt', 'http', 'template', 'patching'])
  // and run it
  const toolbox = await cli.run(argv)

  // send it back (for testing, mostly)
  return toolbox
}

module.exports = { run }
