var fs = require('fs');

var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

exports.post_delete = function(req, res){
  deleteFolderRecursive(req.body.path);
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end("DELETED");
}
