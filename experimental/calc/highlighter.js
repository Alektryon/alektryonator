$(document).ready(function(){
	
    $("#Highlight").keyup(function(event){ // Highlight box
		if ( event.which == 46 ) { // "Delete" - clear box
			document.getElementById("Highlight").value = "";
		}
		if ( event.which == 34 ) { // "Page Down" - show only highlights
			RemoveNotMatchingPhrases();
		}
		HighlightRefresh();
    });
	
	// table row/column lit on mouse hover
	//$("body").on("click", ".column100", function () {
	//	var table1 = $(this).parent().parent().parent();
	//	var table2 = $(this).parent().parent();
	//	var verTable = $(table1).data('vertable') + "";
	//	var column = $(this).data('column') + "";
	//	$(table2).find("." + column).addClass('hov-column-' + verTable);
	//	$(table1).find(".row100.head ." + column).addClass('hov-column-head-' + verTable);
	//});
	
	// cipher table value clicked
	$("body").on("click", ".ChartChar", function () {
		$(this).toggleClass('highlightCipherTable'); 
		//$(this).hide(); 	
	});
	$("body").on("click", ".ChartVal", function () {
		$(this).toggleClass('highlightCipherTable'); 
		//$(this).hide(); 	
	});

	// history table value clicked (right)
	// disable context menu for the element so right click works
	$(".phraseValue").live('contextmenu', function() { // ".bind" for existing elements, ".live" for future
		$(this).find(".cellvalue").toggleClass('hideValue'); // <b> "style="display: none;"
		return false; // don't show menu
	})
	
	// history table value clicked (left)
	// trick is that ".cellvalue" is " 12 ", not "12", so td:contains can't match it to " 112 "
	$("body").on("click", ".phraseValue", function (e) {
		//console.log($(this).find(".cellvalue").html()); // inner html of .cellvalue found in "this"
		var val = $(this).find(".cellvalue").html();
		$( "table.HistoryTable td:contains('"+val+"')" ).toggleClass('highlightValue');
	});
	
});