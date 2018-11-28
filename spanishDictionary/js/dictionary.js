$(document).ready(function() {

  var dictionaryID = parseURLParams(location.href).dictionaryID[0];
  var URL = `http://mramir14.create.stedwards.edu/spanishDictionary/services/dictionaryService.php?dictionary=${dictionaryID}`

  var table = $('#table-dictionary').DataTable({
    "ajax": {
          url: URL,
          dataSrc: function (json) {
                var return_data = new Array();
                for(var i=0;i< json.length; i++){
                    return_data.push(["audio", json[i].entryText, json[i].entryDefinition])
                }
                return return_data;
            }
          },
      "columnDefs": [{
          "targets": 0,
          "data": null,
          "defaultContent": "<button class=\"btn btn-outline-success audio\" onclick=\"playAudio()\"><i class=\"fas fa-volume-down\"></i></button>"
      }]
  });

  $('#table-dictionary tbody').on( 'click', 'button', function () {
    var data = table.row( $(this).parents('tr') ).data();
    var definition = data[2];
    var audioPath = "";
    if(definition == "cero") {
      audioPath = "./audio/es-mx-cero.mp3";
      playAudio(audioPath)
    }
    else {
      alert("Audio not available!")
    }
  } );
});

function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") return;

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=", 2);
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) parms[n] = [];
        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}//end of parseURLParams

function playAudio(audioPath) {
  var audio = new Audio(audioPath)
  audio.play()
}
