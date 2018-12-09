$(document).ready(function() {
    var email = parseURLParams(location.href).email[0];
    var dictionaryName = parseURLParams(location.href).dictionaryName[0];
    //i'm not sending an ID, so this call won't work. query in dictionary service needs to be reworked
    var URL = `http://mramir14.create.stedwards.edu/spanishDictionary/services/dictionaryService.php?dictionary=${dictionaryName}`

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

function playAudio(audioPath) {
  var audio = new Audio(audioPath)
  audio.play()
}
