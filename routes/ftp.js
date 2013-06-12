var ftp_client = require('ftp'),
    fs = require('fs');

var updateStatusFile = function(statusFile, new_value, callback) {
  fs.writeFile(statusFile, new_value, function(err) {
    callback();
  });
}

var createAndFTPXmlFile = function(ftp, xmlFile, filename, callback) {
  var fileContents = "";
  fileContents += '<?xml version="1.0" encoding="utf-8"?>';
  fileContents += '<publisher-upload-manifest publisher-id="" preparer=" " report-success="true">';
  fileContents += '<notify email="" />';
  fileContents += '<asset filename="' + filename  + '" refid="" type="VIDEO_FULL" />';
  fileContents += '<title name="' + filename + '" refid=" " active="TRUE" video-full-refid="">';
  fileContents += '<short-description>' + filename + ' created and uploaded via StatEasy.</short-description>';
  fileContents += '<tag>stateasy wpxi highschoolsports</tag>';
  fileContents += '</title>';
  fileContents += '</publisher-upload-manifest>';

  fs.writeFile(xmlFile, fileContents, function(err) {
    ftp.put(xmlFile, "manifest.xml", function(err) {
      callback();
    });
  });
}

/*
 * POST to /ftp
 */

exports.post_ftp = function(req, res){
  var ftp = new ftp_client();

  updateStatusFile(req.body.statusFile, "FTP_IN_PROGRESS", function() {
    ftp.on("ready", function() {
      ftp.put(req.body.fullpath, req.body.name, function(err) {

        if (err) throw err;
        createAndFTPXmlFile(ftp, req.body.xmlFile, req.body.name, function() {
          ftp.end();
          updateStatusFile(req.body.statusFile, "FTP_COMPLETE", function() {
            res.writeHead(200, {"Content-Type": "text/plain"});
            res.end("FTP_COMPLETE");

          });
        });
      })
    });

    ftp.connect({
      host : "",
      user : "",
      password : ""
    });
  });
}
