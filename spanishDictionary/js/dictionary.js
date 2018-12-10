$(document).ready(function() {
    // var email = parseURLParams(location.href).email[0];
    var dictionaryID = parseURLParams(location.href).dictionaryID[0];
    var URL = `http://mramir14.create.stedwards.edu/spanishDictionary/services/dictionaryService.php?dictionary=${dictionaryID}`

    var table = $('#table-dictionary').DataTable({
    "ajax": {
          url: URL,
          dataSrc: function (json) {
                var return_data = new Array();
                for(var i=0;i< json.length; i++){
                    return_data.push([json[i].entryAudioPath, json[i].entryText, json[i].entryDefinition])
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
    var audioPath = data[0];
    playAudio(audioPath)
    });
});

function playAudio(audioPath) {
  var audio = new Audio(audioPath)
  audio.play()
}
