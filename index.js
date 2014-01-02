/**
 *
 */
var extend    = hexo.extend,
    config    = hexo.config,
    src_path  = hexo.source_dir;

var relative = require('./relative');

function cmd_relative(args) {

  if (args.h)
    console.log('Usage: hexi rel [target_path]');

  if (args._.length > 0)
    relative.parse(args._[0]);
  else
    relative.parse();

}

extend.console.register('rel', 'Display configuration', cmd_relative);
