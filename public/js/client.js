$(function() {
  $(".ftp").click(function() {
    var id = $(this).attr('id');
    var fullpath = $("#" + id + "_fullpath").val();
    var statusFile = $("#" + id + "_status").val();
    var xmlFile = $("#" + id + "_xml").val();
    var shortname = $("#" + id + "_shortname").val();
    var path = $("#" + id + "_path").val();
    $("#" + id + "_actions").html("<span class='progress'>Uploading</span>");
    $.post('/ftp', { fullpath : fullpath, name : id + ".ogv", statusFile : statusFile, xmlFile : xmlFile, shortname : shortname, path : path }, function(data) {
      $("#" + id + "_actions").html("<span class='progress'>Upload Complete</span><a id='" + id + "' class='ftp' href='#'>FTP to Brightcove</a>&nbsp;&nbsp;&nbsp;<a href='#'>Delete</a>");
    });
  });

  $(".delete").click(function() {
    var id = $(this).attr('id');
    var path = $("#" + id + "_path").val();
    $.post('/delete', { path : path }, function(data) {
      $("#" + id).parents("li").remove();
    });
  })
});
