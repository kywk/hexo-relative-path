/**
 *
 */
var extend    = hexo.extend,
    util      = hexo.util,
    file      = util.file2,
    config    = hexo.config,
    src_path  = hexo.source_dir;

var glob = require("glob"),
    async = require("async");

/**
 *
 */
module.exports.parse = parse;
module.exports.updatePath = updatePath;


/**
 * [_isEndWith description]
 * @param  {[type]}  str  [description]
 * @param  {[type]}  last [description]
 * @return {Boolean}      [description]
 */
function _isEndWith (str, last) {
  return str[str.length - 1] === last;
}


/**
 * [parse description]
 * @param  {[type]} dest_dir [description]
 * @return {[type]}          [description]
 */
function parse (dest_dir) {

  dest_dir = dest_dir || 'public';
  dest_dir = dest_dir + (_isEndWith(dest_dir, '/') ? '' : '/');
  var filelist = glob.sync('public/**/*.html');

  async.waterfall([

    function (next) {
      if (dest_dir != 'public/') {
        file.mkdirs(dest_dir, function (err, data) {
          file.copyDir('public/', dest_dir, next);
        });
      }
      next();
    },

    function (next) {
      async.forEach(filelist, function (item) {
        var htmldata = file.readFileSync(item);
        var content = updatePath(htmldata, item);

        target_path = item.replace(/^public\//, dest_dir);
        file.writeFile(target_path, content, next);
      });
    },

    function (data, next) {}
  ], function (err) {

  });

}


/**
 * [updatePath description]
 * @param  {[type]} htmldata  [description]
 * @param  {[type]} file_path [description]
 * @param  {[type]} root_path [description]
 * @return {[type]}           [description]
 */
function updatePath (htmldata, file_path, root_path) {

  var re, orig_root;

  root = file_path.replace(/^public\//, '')
                  .replace(/([\w|\-]+\/)/g, '../')
                  .replace(/([\w|\-]+)\.htm[l]?/, '');

  orig_root = root_path || config.root;
  orig_root = orig_root.replace(/\//g, '\\\/');

  re = new RegExp(' href="' + orig_root, 'g');
  htmldata = htmldata.replace(re, ' href="/')
                     .replace(/ href="\/\//, ' href="http://')
                     .replace(/ href="\/([^\/].*)"/g, ' href="' + root + '$1"')
                     .replace(/ href="(.*)\/"/g, ' href="$1/index.html"');

  re = new RegExp(" href='" + orig_root, 'g');
  htmldata = htmldata.replace(re, " href='/")
                     .replace(/ href='\/\//, " href='http://")
                     .replace(/ href='\/([^\/].*)'/g, " href='" + root + "$1'")
                     .replace(/ href='(.*)\/'/g, " href='$1/index.html'");

  re = new RegExp(' src="' + orig_root, 'g');
  htmldata = htmldata.replace(re, ' src="/')
                     .replace(/ src="\/\//, ' src="http://')
                     .replace(/ src="\/([^\/].*)"/g, ' src="' + root + '$1"')
                     .replace(/ src="(.*)\/"/g, ' src="$1/index.html"');

  re = new RegExp(" src='" + orig_root, 'g');
  htmldata = htmldata.replace(re, " src='/")
                     .replace(/ src='\/\//, " src='http://")
                     .replace(/ src='\/([^\/].*)'/g, " src='" + root + "$1'")
                     .replace(/ src='(.*)\/'/g, " src='$1/index.html'");

  return htmldata;
}
