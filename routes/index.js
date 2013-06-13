var fs = require("fs");

var checkStatus = function(playlist_file, callback) {
  fs.readFile(playlist_file, "utf8", function(err, data) {
    callback(err, data.trim());
  });
}

var renderIndex = function(finished_files, inprogress_files, ftpd_files, res) {
  res.render("index", {
    finished : finished_files,
    inprogress : inprogress_files,
    ftpd : ftpd_files
  });
}

/*
 * GET home page.
 */

exports.index = function(req, res){
  var playlist_dir = "/mnt/playlists";
  var finished_files = [];
  var inprogress_files = [];
  var ftpd_files = [];
  fs.readdir(playlist_dir, function(err, files) {
    var playlists_processed = 0;
    var total_playlists = files.length;

    files.forEach(function(file) {
      fs.readdir(playlist_dir + "/" + file, function(err, playlist_files) {
	if (playlist_files != undefined) {        
	playlist_files.forEach(function(playlist_file) {
          if (playlist_file == "status.txt") {
            checkStatus(playlist_dir + "/" + file + "/" + playlist_file, function(err, status) {
              var obj = {
                  shortname: file,
                  fullpath: playlist_dir + "/" + file + "/" + file + ".ogv",
                  statusFile: playlist_dir + "/" + file + "/" + playlist_file,
                  xmlFile: playlist_dir + "/" + file + "/manifest.xml",
                  path: playlist_dir + "/" + file,
                  status: status
                };
              if (status == "COMPLETE" || status == "FTP_IN_PROGRESS") {
                finished_files.push(obj);
              } else if (status == "IN_PROGRESS") {
                inprogress_files.push(obj);
              } else if (status == "FTP_COMPLETE") {
                ftpd_files.push(obj);
              }
              playlists_processed++;

              if (playlists_processed == total_playlists) {
                renderIndex(finished_files, inprogress_files, ftpd_files, res);
              }
            })
          }
        });
	} else {
	    playlists_processed++;
            if (playlists_processed == total_playlists) {
                renderIndex(finished_files, inprogress_files, ftpd_files, res);
            }
	}
      });
    })
  })
};
