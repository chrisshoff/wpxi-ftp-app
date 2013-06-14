var ftp_client = require('ftp'),
    fs = require('fs');

var updateStatusFile = function(statusFile, new_value, callback) {
  fs.writeFile(statusFile, new_value, function(err) {
    callback();
  });
}

var createAndFTPXmlFile = function(ftp, xmlFile, filename, callback) {
  var fileContents = "";
  fileContents += '<?xml version="1.0" encoding="utf-8"?>\n';
  fileContents += '<publisher-upload-manifest publisher-id="342952096001" preparer="StatEasy" report-success="true">\n';
  fileContents += '<notify email="cshoff@ressq.com" />\n';
  fileContents += '<asset filename="' + filename  + '" refid="' + filename + '" type="VIDEO_FULL" encode-to="MP4" />\n';
  fileContents += '<title name="' + filename + '" refid="' + filename + '" active="TRUE" video-full-refid="' + filename + '">\n';
  fileContents += '<short-description>' + filename + ' created and uploaded via StatEasy.</short-description>\n';
  fileContents += '<tag>stateasy wpxi highschoolsports</tag>\n';
  fileContents += '</title>\n';
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
      ftp.put(req.body.fullpath, req.body.shortname + ".mp4", function(err) {

        if (err) throw err;
        createAndFTPXmlFile(ftp, req.body.xmlFile, req.body.shortname + ".mp4", function() {
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
