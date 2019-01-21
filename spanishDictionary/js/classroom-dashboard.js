function displayClassroomTable(classroomArray) {
    let tableDataSet = []
    $.each(classroomArray, function(i, classroom) {
        let tableDataRow = [classroom]
        tableDataSet.push(tableDataRow)
    })

    let columnSet = [
        {title: "Classroom Name"}
    ]

    //display table data using DataTable
    var table = $('#table-classrooms').DataTable( {
        data: tableDataSet,
        columns: columnSet
    })

    return table
}//end of displayClassroomTable

$(function () {
    let table = ''
    const errorMsgId = 'table-classrooms'
    let urlParams = parseURLParams(location.href)
    if(urlParams.length == 0) {
        try {
            document.getElementById(errorMsgId).innerHTML = `Error, no email received!`
        }
        catch(e) {    //if can't display error in div, do it in console
            if (e instanceof TypeError) {
                console.log("Not running html! Are you Testing?")
            }
            else {
                console.log("Error!! " + location.href)
            }
        }
    }

    let email;
    let role;
    if(urlParams.hasOwnProperty("email")){
        email = urlParams.email[0];
        role = "instructor";

    }

    else if (urlParams.hasOwnProperty("studentemail")){
        email = urlParams.studentemail[0]
        role = "student"
    }

    
    const URL = `./services/classroom.php`
    const userData = {
        email: email,
        role: role
    }
    if(role == "instructor"){
        //using AJAX, recieves JSON from URL in the form of the data var
        $.get(URL, userData, function(data) {

                let array = stringToNameArray(data)
                table = displayClassroomTable(array)
            

            $('#table-classrooms tbody').on('click', 'tr', function () {
                var classroomName = table.row( this ).data();
                window.location.replace(`./student-classroom.html?classroomName=${classroomName}`)
            } );
        })
        .fail(function() {
            document.getElementById(errorMsgId).innerHTML = `Error, could not connect! URL: ${URL}`
        })
    }
    else{
        let classIDs = [];
        let vocabListIDs = []
        let studentClassRoomsTable = $('#table-classrooms').DataTable( {
            ajax: {
                url: URL + "?email=" + email + "&role=" + role,
                dataSrc: function (json) {
                            var return_data = new Array();
                            for(var i=0;i< json.length; i++){

                                    return_data.push({
                                        'Class Name' : json[i].className,
                                    })

                                    classIDs.push(
                                        json[i].classID
                                    );

                                    vocabListIDs.push(json[i].personalVocabID);
                                
                            }
                            return return_data;
                        }
            },
            columns: [
                { data: "Class Name" },
            ],
            'createdRow': function( row, data, dataIndex ) {
                //console.log(data);
                $(row).attr('data-class-ID', classIDs[dataIndex]);
                $(row).attr("data-vocab-ID", vocabListIDs[dataIndex]);

              },

        } );

         $('#table-classrooms tbody').on('click', 'tr', function () {
            var classID = $(this).attr("data-class-ID");

            window.location.replace('./dictionaries.html?email=' + email + "&classroom=" + classID);            


        } );

    }
}) //end of doc ready