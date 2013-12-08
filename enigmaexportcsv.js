$(document).ready(function(){
 
  $(".tableselect").hide();
  $(".querywrite").hide();
  $("#export").hide();
  $("#export").prop("disabled", true);
 
});


var mypath;
var myapi;

function setAPI() {
myapi = $("#myapi").val();
}

$("form#api").submit(function() {
event.preventDefault();
setAPI();

$("form#api").prop("disabled", true);
$(".tableselect").show();
$("#next").hide();
$("#list").hide();
$("select#table").prop("disabled", false);
});

var mytable;
var results;

function setTable() { mytable = $("select#table option:selected").val(); }

$( "select#table" ).change( function() {
	event.preventDefault();
	setTable();
	metapath = 'https://api.enigma.io/v2/meta/'+ myapi + '/' + mytable;
	var output = '';
	var results = $.get( metapath, function(data) {
	    $.each(data.result.columns, function () {
	    	output += '<b>'+this.id+'</b> ('+this.description+')<br/>';  });
	    $('#list').html(output);
	    $("#next").prop("disabled", false); 
	});

	$("#next").show();
	$("#list").show();

	
	$(".querywrite").show();
	$("#submitquery").prop("disabled", false); 

});



function setString() { myquery = $("form#query").find('input').not('[value=""]').serialize(); }

function JSON2CSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;

    var str = '';
    var line = '';
    
    var head = array[0];
       
    for (var index in array[0]) {
                var value = index + "";
                line += '"' + value.replace(/"/g, '""') + '",';
            }      

    line = line.slice(0, -1);
    str += line + '\r\n';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        
        for (var index in array[i]) {
            var value = array[i][index] + "";
            line += '"' + value.replace(/"/g, '""') + '",';
        }

  		line = line.slice(0, -1);
        str += line + '\r\n';
    }

    return str;
}


//press preview, make the API call and return the results
$("form#query").submit(function() {
	event.preventDefault();
	setTable();
	setString();
	setAPI();
	var myurl = 'https://api.enigma.io/v2/data/'+ myapi+"/"+mytable+"/?"+myquery+"'";

	//get results
	$.get(myurl,function(data){

	    var response = data.result;
	    var csv = JSON2CSV(response);

	    $("#preview").text(csv);


		

		$("#export").on("click", function() {
			event.preventDefault();
			window.open("data:text/csv;charset=utf-8," + escape(csv));
		});


	},'json');

	$("button#export").show();
	$("button#export").prop("disabled", false); 



});


	var colors = ["red", "orange", "yellow", "green", "blue"];
	var i = 0;

	$("#export").css("background-color","red");

	function changeColor()
	{
	    i++;
	    i=i%5;
	    $("#export").animate({backgroundColor: colors[i]},1000);
	    setTimeout(changeColor,2500);
	}

	changeColor();


