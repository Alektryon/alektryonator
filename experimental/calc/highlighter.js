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

	var phrase_val = [] // gematria values for a single phrase
	avail_val = [] // reinit
	values_arr = []
	freq = []
	
	if (sHistory.length == 0) {return}
	
	for (x = 0; x < sHistory.length; x++) { // calculate gematria for all phrases
		for (y = 0; y < ciphersOn.length; y++) {
			aCipher = ciphersOn[y]
			gemVal = aCipher.Gematria(sHistory[x], 2, false, true) // value only
			phrase_val.push(gemVal) // append all values of this phrase
		}
		values_arr.push(phrase_val) // append all values of each phrase
		phrase_val = [] // reinit	
	}
	
						
	//auto highlighter, all available values
	var cur_phrase_arr = []
	var cur_phrase_arr2 = []
	var cur_val // current word value
	
	var pos = 0 // save position to mark value as finished searching
	var once_in_row // match can't be counted in the same row twice
	var freq_tmp = []
	
	for (i = 0; i < values_arr.length; i++){ // loop array
		cur_phrase_arr = values_arr[i] // select row with phrase values
		for (n = 0; n < cur_phrase_arr.length; n++){
			cur_val = cur_phrase_arr[n] // took the first value of the first phrase
			for (m = 0; m < values_arr.length; m++){ // loop array again to find matches
				if (m!=i){ // can't be same row
					//console.log("m:"+m+" i:"+i)
					cur_phrase_arr2 = values_arr[m] // select another row
					once_in_row = 0 // match can't be counted in the same row twice
					for (p = 0; p < cur_phrase_arr2.length; p++){ // loop values in that row
						if (cur_val == cur_phrase_arr2[p]) { // if matching value is found in other rows (phrases)
							if (avail_val.indexOf(cur_val) == -1) { // avoid duplicate matches
								avail_val.push(cur_val) // push to array
								freq_tmp = [cur_val, 2, 0] // first match means 2 values were found
								freq.push(freq_tmp) // new Array [current value, nummber of occurrences, finished search]
								pos = 0 // set to the first element
								once_in_row = 1
							}
							// when next value is checked we can't do increments for the previously numbered matches
							for (z = 0; z < freq.length; z++) { // for each value available in frequency array
								if (freq[z][0] == cur_val && freq[z][2] == 0 && once_in_row == 0 ) { // for corresponding value if search for that value is not finished and not same row
									freq[z][1] += 1 // increment number of occurrencies found
									pos = z // save position
								}
							}
						}
					}
				}
			}
			//console.log("freq.length:"+freq.length+" pos:"+pos)
			if (freq.length !== 0) freq[pos][2] = 1 // after search is done inside each row of phrase values, mark that value as "finished"
		}
	}
	cur_phrase_arr = [] // reinit
	cur_phrase_arr2 = []
	cur_val = ""
	
	avail_val.sort(function(a, b) { // sort ascending order
		return a - b; //  b - a, for descending sort
	});
	
	freq.sort(function(a, b) {
		return a[1] - b[1]; // sort based on index 1 values ("freq" is array of arrays), (b-a) descending order, (a-b) ascending
	});

	//console.log(values_arr) // print all phrase values 2d array
	console.log(JSON.stringify(avail_val).replace(/,/g, " ").slice(1, -1)) // print available matches
	console.log(JSON.stringify(freq).replace(/\],\[/g, "\n").slice(2, -2)) // print frequency of available matches
	
	// paste available values inside Highlight textbox
	str = JSON.stringify(avail_val).replace(/,/g, " ") // replace comma with space
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