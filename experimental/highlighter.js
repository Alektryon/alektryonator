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
	
	// $("body").on("click", ".column100", function () {
		// var table1 = $(this).parent().parent().parent();
		// var table2 = $(this).parent().parent();
		// var verTable = $(table1).data('vertable') + "";
		// var column = $(this).data('column') + "";
		// $(table2).find("." + column).addClass('hov-column-' + verTable);
		// $(table1).find(".row100.head ." + column).addClass('hov-column-head-' + verTable);
	// });
	
	$("body").on("click", ".ChartChar", function () {
		$(this).toggleClass('highlightCipherTable'); 
		//$(this).hide(); 	
	});
	
	$("body").on("click", ".ChartVal", function () {
		$(this).toggleClass('highlightCipherTable'); 
		//$(this).hide(); 	
	});
	
});