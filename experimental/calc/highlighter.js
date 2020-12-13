var matchHistory = [] // a copy of sHistory used to display only matching phrases

$(document).ready(function(){
	
	$(document).keydown(function(event){
		if(event.which=="17")
		ctrlIsPressed = true;
	});
	$(document).keyup(function(){
		ctrlIsPressed = false;
	});

	var ctrlIsPressed = false; // allow Ctrl modifier key

    $("#Highlight").keyup(function(event){ // inside Highlight box
		if ( event.which == 46 ) { // "Delete" - clear box
			freq = []; // reset previously found matches, weighted auto highlighter
			document.getElementById("Highlight").value = "";
		}
		if ( event.which == 13 ) { // "Enter" - show only phrases that match
			RemoveNotMatchingPhrases();
			return // don't update history as function is different
		}
		if ( event.which == 45 ) { // "Insert" - auto highlighter, find all available matches
			Open_HistoryAutoHlt();
			return // don't update history
		}
		Open_History();
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
	
	// cipher table letter/number clicked
	$("body").on("click", ".ChartChar", function () {
		$(this).toggleClass('highlightCipherTable'); 
	});
	$("body").on("click", ".ChartVal", function () {
		$(this).toggleClass('highlightCipherTable'); 
	});

	// history table value clicked (right mouse button)
	// disable context menu for the element so right click works
	$(".phraseValue").live('contextmenu', function() { // ".bind" for existing elements, ".live" for future
		$(this).find(".cellvalue").toggleClass('hideValue'); // <b> "style="display: none;"
		return false; // don't show menu
	})
	
	// history table value clicked (left mouse button)
	// trick is that ".cellvalue" is " 12 ", not "12", so td:contains can't match it to " 112 "
	$("body").on("click", ".phraseValue", function (e) {
		//console.log($(this).find(".cellvalue").html()); // inner html of .cellvalue found in "this"
		var val = $(this).find(".cellvalue").html(); // get gematria value from element
		if(ctrlIsPressed) { // Ctrl + Left Click
			tdToggleHighlight(parseInt(val.trim())); // remove spaces, parse as integer and add (remove) to highlight box
		} else { // Left Click only
			$( "table.HistoryTable td:contains('"+val+"')" ).toggleClass('highlightValueBlink'); // add blinking effect
		}
	});
	
	// Ctrl + Click on phrase in history table
	$("body").on("click", ".historyPhrase", function (e) {
		console.log($(this).html()); // inner html of "this"
		var val = $(this).html(); // get gematria value from element
		if(ctrlIsPressed) { // Ctrl + Left Click
			document.getElementById("SearchField").value = val; // insert phrase into search box
			FieldChange(sVal()); // update breakdown for current phrase
			document.getElementById("SearchField").focus(); // focus input
		} else { // Left Click only
			return;
		}
	});
	
});

function RemoveNotMatchingPhrases() {
	// highlight box values to array
	highlt = document.getElementById("Highlight").value.replace(/ +/g," ") // get value, remove double spaces
	highlt_num = highlt.split(" ") // create array from string, space as delimiter
	highlt_num = highlt_num.map(function (x) { // parse string array as integer array to exclude quotes
		return parseInt(x, 10); 
	});
	
	matchHistory = [...sHistory] // create a copy of history, since matching is destructive
	
	var phr_values = []
	var match = false
	var x = 0
	// for (x = 0; x < matchHistory.length; x++) { // for each phrase in history
	while (x < matchHistory.length) { // for each phrase in history
	
		phr_values = [] // reinit
		match = false
		
		for (y = 0; y < ciphersOn.length; y++) { // for each enabled cipher
			aCipher = ciphersOn[y]
			gemVal = aCipher.Gematria(matchHistory[x], 2, false, true) // value only
			phr_values.push(gemVal) // build an array of all gematria values of current phrase
		}
		//console.log(phr_values)
		for (z = 0; z < highlt_num.length; z++) { // for each value to be highlighted
			if (phr_values.indexOf(highlt_num[z]) > -1 && !match) { // if value is present in any gematria cipher
				match = true // if match is found
			}
		}
		//console.log(match)
		if (!match) { // if no match is found, don't do x++ as array indices shift
			//console.log("removed: '"+matchHistory[x]+"'")
			matchHistory.splice(x,1) // remove phrase
		} else {
			x++ // check next item if match is found
		}
	}
	
	Open_History("display_only_matches") // rebuild table
}

function Open_HistoryAutoHlt() {
	var x, y, aCipher

	var rows_arr = [] // array of arrays, each array (row) has gematria values for a single phrase
	var phrase_values = [] // array of gematria values for a single phrase
	avail_match = [] // reinit (var declared in ijavaNGG.js)
	avail_match_freq = [] // var declared in ijavaNGG.js
	
	if (sHistory.length == 0) {return}
	
	for (x = 0; x < sHistory.length; x++) { // calculate gematria for all phrases
		for (y = 0; y < ciphersOn.length; y++) {
			aCipher = ciphersOn[y]
			gemVal = aCipher.Gematria(sHistory[x], 2, false, true) // value only
			phrase_values.push(gemVal) // append all values of this phrase
		}
		rows_arr.push(phrase_values) // append all values of each phrase
		phrase_values = [] // reinit	
	}
	
						
	//auto highlighter, all available values
	var this_row = [] // match this row
	var against_row = [] // against another row
	var val = 0 // value that is checked (try "")
	
	var p = 0 // position (column) in against_row
	var index = 0 // index of val in array of previously found matches
	
	var n_rows = rows_arr.length // number of phrases
	var n_cols = rows_arr[0].length // number of values (ciphers) for each phrase (same value)
	
	var steps = 0 // number of steps taken
	
	for (i = 0; i < n_rows; i++) { // loop array
		this_row = rows_arr[i] // select row with phrase values
		for (n = 0; n < n_cols; n++) {
			if (avail_match.indexOf(this_row[n]) == -1) { // take value that hasn't been checked
				val = this_row[n] // take the first value of the first phrase
				//console.log("# row:"+(i+1)+" column:"+(n+1)+" value:"+val)
				for (m = i+1; m < n_rows; m++) { // loop array again to find matches, start check from the next row
					against_row = rows_arr[m] // select another row
					p = 0 // reset position in row
					while (p < n_cols) { // loop values in that row
						steps++
						if (val == against_row[p]) { // if matching value is found in other rows (phrases)
							index = avail_match.indexOf(val) // save index
							//console.log("    matches with:"+against_row[p]+" at "+(m+1)+":"+(p+1)) // at row/column
							if (index == -1) { // if value is not in array of available matches yet
								avail_match.push(val) // push to array, so number is not selected again during the first (selection) loop of the array
								avail_match_freq.push(2) // first match means 2 values were found
								//console.log("        new value found, making a new array to count "+against_row[p])
								//console.log("            "+against_row[p]+" has position "+avail_match.indexOf(val)+" in "+JSON.stringify(avail_match))
							} else { // if value already exists in array of matches
								avail_match_freq[index] += 1 // increment number of occurrencies found at correspondent index
								//console.log("        found match at "+(m+1)+":"+(p+1)+" incrementing "+against_row[p]+" to "+avail_match_freq[index])
							}
							if (m+1 < n_rows) { // switch to next row (if possible) after match is found
								m++
								against_row = rows_arr[m] // against_row = rows_arr[m+1] - gets stuck in an infinite increment loop
								p = 0 // switch to first value in next row
							} else {
								break // break infinite loop on the last row check
							}
						} else {
							p++ // if no match is found, check next value of the same row
						}
					}
				}
			}
		}
	}
	console.log("rows:"+n_rows+" columns:"+n_cols+" values:"+(n_rows*n_cols)+" steps_taken:"+steps)
	
	freq = [] // frequency of matches found with auto highlighter (var declared in ijavaNGG.js)
	var tmp = []
	for (i = 0; i < avail_match.length; i++) { // join values and frequency
		tmp = new Array(avail_match[i],avail_match_freq[i])
		freq.push(tmp)
	}
	
	freq.sort(function(a, b) {
		return a[1] - b[1]; // sort based on index 1 values ("freq" is array of arrays), (b-a) descending order, (a-b) ascending
	});
	
	avail_match.sort(function(a, b) { // sort ascending order
		return a - b; //  b - a, for descending sort
	});
	
	console.log(JSON.stringify(avail_match).replace(/,/g, " ").slice(1, -1)) // print available matches
	console.log(JSON.stringify(freq).replace(/\],\[/g, "\n").slice(2, -2)) // print frequency of available matches
	
	// paste available values inside Highlight textbox
	str = JSON.stringify(avail_match).replace(/,/g, " ") // replace comma with space
	substr = str.substring(1, str.length - 1) // remove brackets
	document.getElementById("Highlight").value = substr

	Open_History() // update table
}

// add number to Highlight box (history table is rebuilt)
function tdToggleHighlight(val){ // click on value in history table to toggle highlighter
    //console.log('Clicked on: '+val)
	highlt = document.getElementById("Highlight").value.replace(/ +/g," ") // get value, remove double spaces
	lastchar = highlt.substring(highlt.length-1,highlt.length)
	
	highlt_num = highlt.split(" ") // create array, space delimited numbers
	highlt_num = highlt_num.map(function (x) { // parse string array as integer array to exclude quotes
		return parseInt(x, 10); 
	});
	
	var i = highlt_num.indexOf(val) // val needs to be an integer
	//console.log("val:"+val+" i:"+i+" highlt_num:"+JSON.stringify(highlt_num))
	
	// disable
	var hlt_val
	if (i > -1) { // if value is present
		highlt_num.splice(i,1) // remove value
		hlt_val = JSON.stringify(highlt_num).replace(/,/g, " ") // to string
		hlt_val = hlt_val.substring(1, hlt_val.length-1) // remove brackets
		document.getElementById("Highlight").value = hlt_val // update values inside textbox
		Open_History() // update table
		return
	}
	
	// enable
	if (lastchar !== " " && highlt.length > 0) {
		document.getElementById("Highlight").value += " " // append space if necessary
	}
	document.getElementById("Highlight").value += val // append clicked value to Highlight textbox
	Open_History() // update table
};