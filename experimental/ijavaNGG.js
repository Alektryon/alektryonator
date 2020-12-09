var ciphers_per_row = 6; ChartMax = 36
var cOption = "English"
var breakCipher, miscContents
var pixelcount = 0; breakArr = []; pArr= []; mArr = []
var opt_Reduce = true; opt_Quotes = true; opt_Summ = true; opt_Breakdown = "Chart"; opt_LetterCount = true
var opt_Chart = true; opt_Shortcuts = true; opt_Headers = true; opt_InTable = false
var opt_SeamlessHistoryTable = false;

var values_arr = []; // automatically higlight all available matches
var phrase_val = [];
var avail_val = []; // matches available for auto highligher
var freq = []; // frequency of matches found with auto highlighter

function Page_Launch() {
	//Header_Load()
	Gem_Launch()
	Populate_MenuBar()
	Build_CharTable(ciphersOn[0])
	breakCipher = ciphersOn[0].Nickname
}

function Populate_MenuBar() {
	var hStr
	var mSpot = document.getElementById("MenuSpot")

	hStr = '<center><div class="MenuLink"><a href="javascript:Open_Ciphers()">Ciphers</a></div>  |  '
	hStr += '<div class="MenuLink"><a href="javascript:Open_Options()">Options</a></div>  |  '
	hStr += '<div class="MenuLink"><a href="javascript:Open_Shortcuts()">Shortcuts</a></div>'
	if (opt_InTable == true) {
		hStr += '  |  ' + '<div class="MenuLink"><a href="javascript:Load_Options(true)">Load My Settings</a></div><BR></center>'
	}
	//hStr += '<div class="MenuLink"><a href="javascript:Open_Help()">Help</a></div><P>'

	hStr += '<BR></center>'
	mSpot.innerHTML = hStr
}

function sVal() {
	var sBox = document.getElementById("SearchField")
	return sBox.value.trim()
}

function HighlightRefresh (impNum) { // keytroke in Highlight textbox

	Open_History() // update table
	
	switch (impNum) {
		case 46: // clear
			tArea = document.getElementById("Highlight")
			tArea.value = ""
			break
	}
}

function navHistory(impNum) { // run on each keystroke inside text box - onkeydown="navHistory(event.keyCode) - from index.html
	var hPlace, tBox
	var newVal = ""; thisTerm = replaceAll(sVal(), "|", "")
	tBox = document.getElementById("SearchField")

	hPlace = sHistory.indexOf(thisTerm)
	switch (impNum) {
		case 13: // Enter
			newHistory(true)
			tBox.value = "" // clear textbox
			break;
		case 38: // Up Arrow
			if (hPlace > 0) {
				newVal = sHistory[hPlace - 1]
			}
			if (newVal !== "") {tBox.value = newVal; Populate_Sums(newVal); Populate_Breakdown()}
			break;
		case 40: // Down Arrow
			if (hPlace > -1) {
				if (sHistory.length > (hPlace + 1)) {newVal = sHistory[hPlace + 1]}
			} else {
				if (sHistory.length > 0) {newVal = sHistory[0]}
			}
			if (newVal !== "") {tBox.value = newVal; Populate_Sums(newVal); Populate_Breakdown()}
			break;
		case 46: // Delete, remove entries from history
			//console.log(sHistory)
			hSpot = sHistory.indexOf(tBox.value); // find contents of textbox in history array
			if (sHistory.length == 1) {
				sHistory = [] // reinitialize array if there is only one entry
				tArea = document.getElementById("MiscSpot")
				tArea.innerHTML = '<table class="HistoryTable"></table>' // clear table
			}
			if (hSpot > -1) {
				sHistory.splice(hSpot, 1) // if a match is found, delete entry
			}
			tBox.value = "" // empty text box, so the old value us not added again
			newHistory() // update history
			Open_History() // update table
			//console.log(sHistory)
			break;
		case 36: // Home, clear all history
			sHistory = [] // reinitialize array if there is only one entry
			tArea = document.getElementById("MiscSpot")
			tArea.innerHTML = '<table class="HistoryTable"></table>' // clear table
			break;
		case 35: // End, enter sentence as separate words and phrases
			tboxvalue = tBox.value.replace(/\t/g, " ") // replace tab with spaces
			tboxvalue = tboxvalue.replace(/ +/g, " ") // remove double spaces
			// tboxvalue = tboxvalue.replace(/(\.|,|:|;|\\|)/g, "") // remove special characters, last are one is "|"
			
			wordarray = tboxvalue.split(" ")
			phr_len = 5 // max phrase length
			var phrase; // init variable outside of for cycle, memory efficient
			// for (i = 0; i < wordarray.length; i++) { // phrases in normal order
				// k = 1 // init variable
				// phrase = wordarray[i]
				// newHistoryBulk(true, phrase)
				// while (k < phr_len && i+k < wordarray.length) { // add words to a phrase, check it is within array size
					// phrase += " "+wordarray[i+k]
					// newHistoryBulk(true, phrase)
					// k++
				// }
			// }
			for (i = wordarray.length-1; i > 0; i--) { // add phrases in reverse order, so you don't have to read backwards
				k = 1 // init variable
				phrase = wordarray[i]
				
				// remove double spaces, space in the start/end
				//phrase = phrase.replace(/ +/g, " ").replace(/^ /g, "").replace(/ $/g, "")

				newHistoryBulk(true, phrase)
				while (k < phr_len && i-k > -1) { // add words to a phrase, check it is within array size
					phrase = wordarray[i-k]+" "+phrase
					newHistoryBulk(true, phrase)
					k++
				}
			}
			Open_History() // update table only once after all phrases are added
			break;
		case 45:// Insert, auto available values highlighter
			Open_HistoryAutoHlt()
			break;
		// case 34:// Page Down, remove phrases that don't match
			// RemoveNotMatchingPhrases()
			// break;
	}
}

function RemoveNotMatchingPhrases() {
	
	highlt = document.getElementById("Highlight").value.replace(/ +/g," ") // get value, remove double spaces
	highlt_num = highlt.split(" ") // create array, space delimited numbers
	highlt_num = highlt_num.map(function (x) { // parse string array as integer array to exclude quotes
		return parseInt(x, 10); 
	});
	
	var phr_values = []
	var match = false
	var x = 0
	// for (x = 0; x < sHistory.length; x++) { // for each phrase in history
	while (x < sHistory.length) { // for each phrase in history
	
		phr_values = [] // reinit
		match = false
		
		for (y = 0; y < ciphersOn.length; y++) { // for each enabled cipher
			aCipher = ciphersOn[y]
			gemVal = aCipher.Gematria(sHistory[x], 2, false, true) // value only
			phr_values.push(gemVal) // build an array of all gematria values for that phrase
		}
		//console.log(phr_values)
		for (z = 0; z < highlt_num.length; z++) { // for each chosen value to be highlighted
			if (phr_values.indexOf(highlt_num[z]) > -1 && !match) { // if value is present in any gematria cipher
				match = true // if match is found
			}
		}
		//console.log(match)
		if (!match) { // if no match is found, don't do x++ as array indices shift
			//console.log("removed: '"+sHistory[x]+"'")
			sHistory.splice(x,1) // remove phrase
		} else {
			x++ // check next item if match is found
		}
	}
	
	Open_History() // rebuild table
	
}	

function newHistoryBulk(impOpt = false, word) { // called from function navHistory(impNum) -> case 13
	var hSpot, isNew
	var x, ys
	var impVal = replaceAll(word, "|", "")

	isNew = false

	if (impVal !== "") {

		if (Number(impVal) > 0) {

		} else {
			hSpot = sHistory.indexOf(impVal);

			if (hSpot > -1) {
				sHistory.splice(hSpot, 1)
			} else {
				isNew = true
			}
			
			//if (sHistory.length > 100) { // history entry limit
			//	sHistory.pop()
			//}

			sHistory.unshift(impVal)
		}
	}
	
	//if (impOpt == true || miscContents !== "match") {Open_History()}
	if (isNew == true) {AddTerm(); UpdateUserHistory()};
	//console.log(sHistory);
}

function newHistory(impOpt = false) { // called from function navHistory(impNum) -> case 13
	var hSpot, isNew
	var x, ys
	var impVal = replaceAll(sVal(), "|", "")

	isNew = false

	if (impVal !== "") {

		if (Number(impVal) > 0) {

		} else {
			hSpot = sHistory.indexOf(impVal);

			if (hSpot > -1) {
				sHistory.splice(hSpot, 1)
			} else {
				isNew = true
			}
			
			//if (sHistory.length > 100) { // history entry limit
			//	sHistory.pop()
			//}

			sHistory.unshift(impVal)
		}
	}
		
	if (impOpt == true || miscContents !== "match") {Open_History()}
	if (isNew == true) {AddTerm(); UpdateUserHistory()};
	//console.log(sHistory);
}
function AddTerm() {
	var xhttp = new XMLHttpRequest();
	var x, z, lastSpace
	xhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
      	;
    	}
    };

    qStr = ""; lastSpace = true; sv = sVal()

    for (x = 0; x < sv.length; x++) {
    	z = sv.charCodeAt(x)
    	if (z > 64 && z < 123) {
    		qStr += String.fromCharCode(z)
    		lastSpace = false
    	} else if (z == 32) {
    		if (lastSpace == false) {qStr += "_"}
    		lastSpace = true
    	}
    }

    //xhttp.open("POST", "http://www.gematrinator.com/nextgen/addtodatabase.php?phrase=" + qStr, true);
    //xhttp.send();
}
function Open_History(weight) {
	var ms, x, y, aCipher, gemSum
	tArea = document.getElementById("MiscSpot")

	if (sHistory.length == 0) {return}
	

	ms = '<table class="HistoryTable">'
	highlt = document.getElementById("Highlight").value // value of Highlight textbox
	
	hlt = false
	if (highlt !== "") {
		highlt_num = highlt.split(" "); // create array, space delimited numbers
		hlt = true
	}
	
	for (x = 0; x < sHistory.length; x++) {

		if (x % 25 == 0 && !opt_SeamlessHistoryTable) {
			ms += '<tr><td class="MPhrase"><font style="color: orange;">Word or Phrase</font></td>'
			for (z = 0; z < ciphersOn.length; z++) {
				ms += '<td class="HistoryHead" style="color: RGB(' + ciphersOn[z].RGB.join() +')">' // color of cipher displayed in the table
				ms += ciphersOn[z].Nickname
				ms += "</td>"
			}
			ms += "</tr>"
		}

		ms += '<tr><td class="historyPhrase">' + sHistory[x] + '</td>'

		if (weight) {
			
			max_match = freq[freq.length-1][1]; // last value, array is sorted
			
			for (y = 0; y < ciphersOn.length; y++) {
			
				aCipher = ciphersOn[y]
				gemSum = '<font style="font-size: 115%"><B> ' + aCipher.Gematria(sHistory[x], 2, false, true) + ' </B></font>' // actual value displayed
				gemVal = aCipher.Gematria(sHistory[x], 2, false, true) // value only

				// r = aCipher.R;
				// g = aCipher.G;
				// b = aCipher.B;
				//col = aCipher.RGB
				col = "0,255,0"
				a = 1.0
				
				//console.log("highlt_num.includes('"+aCipher.Gematria(sHistory[x], 2, false, true)+"'))")
				//console.log(highlt_num.indexOf((aCipher.Gematria(sHistory[x], 2, false, true)).toString()))
				//console.log(highlt_num)
				
				if (hlt && !highlt_num.includes((aCipher.Gematria(sHistory[x], 2, false, true)).toString()) ) { // if highlight not empty and doesn't match value
					// r *= 0.3
					// g *= 0.3
					// b *= 0.3
					a = 0 // invisible
				}
				
				for (i = 0; i < freq.length; i++) { // weighted coloring
					if (freq[i][0] == gemVal) {
						a = freq[i][1]/max_match // if max - value 1.0
						a = a*a*a // less significant values are darker,  "gamma curve"
					}
				}
			
				// numcol = r+','+g+','+b+','+a
				numcol = col+','+a
				
				//ms += '<td><font style="color: RGB(' + aCipher.RGB.join() + '")>' + gemSum + '</font></td>'
				//ms += '<td><font style="color: RGB(' + numcol + '")>' + gemSum + '</font></td>'
				//tdToggleHighlight_new
				ms += '<td class="phraseValue" onclick="tdToggleHighlight_new('+gemVal+')"><font style="color: rgba('+numcol+')">' + gemSum + '</font></td>'
			}
		}

		if (!weight) {
			for (y = 0; y < ciphersOn.length; y++) {
			
				aCipher = ciphersOn[y]
				gemSum = '<font style="font-size: 115%"><B> ' + aCipher.Gematria(sHistory[x], 2, false, true) + ' </B></font>' // actual value displayed
				gemVal = aCipher.Gematria(sHistory[x], 2, false, true) // value only

				// r = aCipher.R;
				// g = aCipher.G;
				// b = aCipher.B;
				col = aCipher.RGB
				a = 1.0
				
				//console.log("highlt_num.includes('"+aCipher.Gematria(sHistory[x], 2, false, true)+"'))")
				//console.log(highlt_num.indexOf((aCipher.Gematria(sHistory[x], 2, false, true)).toString()))
				//console.log(highlt_num)
				
				if (hlt && !highlt_num.includes((aCipher.Gematria(sHistory[x], 2, false, true)).toString()) ) { // if highlight not empty and doesn't match value
					// r *= 0.3
					// g *= 0.3
					// b *= 0.3
					a = 0.3
				}
				// numcol = r+','+g+','+b+','+a
				numcol = col+','+a
				
				//ms += '<td><font style="color: RGB(' + aCipher.RGB.join() + '")>' + gemSum + '</font></td>'
				//ms += '<td><font style="color: RGB(' + numcol + '")>' + gemSum + '</font></td>'
				ms += '<td class="phraseValue" onclick="tdToggleHighlight_new('+gemVal+')"><font style="color: rgba('+numcol+')">' + gemSum + '</font></td>'
			}
		}
		ms += '</tr>'
	}

	ms += '</table>'
	tArea.innerHTML = ms
	miscContents = "history"
}

function tdToggleHighlight_new(val){ // click on value in history table to toggle highlighter
    //console.log('Clicked on: '+val)
	// for <td> elements inside table class HistoryTable that match a certain value
	
	console.log("clicked: "+val);
	// $( "table.HistoryTable td:contains("+val+")" ).filter(function() {
		// return $(this).text() === val;
	// }).addClass('highlightValue');
	
	// trick to match exact value is use " 42 " inside history table instead of "42"
	$( "table.HistoryTable td:contains(' "+val+" ')" ).toggleClass('highlightValue'); 
};

function tdToggleHighlight(val){ // click on value in history table to toggle highlighter
    //console.log('Clicked on: '+val)
	highlt = document.getElementById("Highlight").value.replace(/ +/g," ") // get value, remove double spaces
	lastchar = highlt.substring(highlt.length-1,highlt.length)
	
	highlt_num = highlt.split(" ") // create array, space delimited numbers
	highlt_num = highlt_num.map(function (x) { // parse string array as integer array to exclude quotes
		return parseInt(x, 10); 
	});
	
	i = highlt_num.indexOf(val)
	
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

function Open_HistoryAutoHlt() {
	var x, y, aCipher

	avail_val = [] // reinit
	values_arr = []
	
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
	
	freq = []
						
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
								freq_tmp = [cur_val, 1, 0]
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

	Open_History(true) // update table
}

function getSum(total, num) {
    return total + num;
}

function uniCharCode(impChar) {
    var char = impChar.charCodeAt(0)
    return char
}

function uniKeyCode(event) {
    var key = event.keyCode;
    document.getElementById("ResultSpot2").innerHTML = "Unicode KEY code: " + key;
}

function Populate_Breakdown(impName = breakCipher, impBool = false) {
	var x, aCipher, cSpot
	var wCount = 0; pixelCount = 0; zSpot = 0; z = 0
	var rStr, qMark, acw, acl

	if (opt_Quotes == true) {qMark = '"'} else {qMark = ""}

	if (impBool == true) {breakCipher = impName; Populate_Sums(sVal())}
	if (breakCipher == "" && impName == "") {
		document.getElementById("BreakdownSpot").innerHTML = ""
		document.getElementById("ChartSpot").innerHTML = ""
		return;
	}

	for (x = 0; x < ciphersOn.length; x++) {
		if (ciphersOn[x].Nickname == impName) {
			cSpot = x
			Build_CharTable(ciphersOn[x])
			break;
		}
	}
	aCipher = ciphersOn[cSpot]
	aCipher.Breakdown(sVal())

	if (aCipher.sumArr.length > 0) {
		BuildBreaks(aCipher)
		
		if (aCipher.LetterCount > 1) {acl = " letters, "} else {acl = " letter, "}
		if (aCipher.WordCount > 1) {acw = " words"} else {acw = " word"}

		if (opt_LetterCount == true) {
			rStr = '<div class="LetterCounts">(' + aCipher.LetterCount + acl + aCipher.WordCount + acw + ')</div>'
		} else {
			rStr = ''
		}
		if (opt_Summ == true && opt_Breakdown !== "Classic") {
			rStr += '<div id="SimpleBreak">'
			rStr += '<div class="breakPhrase">' + qMark + sVal() + qMark +' = </div><div class="breakSum">' + aCipher.sumArr.reduce(getSum) + '</div>'
			rStr += ' <div class="breakCipher"><font style="color: RGB(' + aCipher.RGB.join() + ')">(' + aCipher.Nickname + ')</font></div><div id="SimpleBreak"></div>'
		}

		if (opt_Breakdown == "Chart") {

			rStr += '<table class="BreakTable"><tr>'
			for (x = 0; x < aCipher.cp.length; x++) {

				if (aCipher.cp[x] !== " ") {
					if (String(aCipher.cp[x]).substring(0, 3) == "num") {
						rStr += '<td class="BreakChar">' + aCipher.cp[x].substring(3, aCipher.cp[x].length) + '</td>'
					} else {
						rStr += '<td class="BreakChar">' + String.fromCharCode(aCipher.cp[x]) + '</td>'
					}
				} else {
					rStr += '<td class="BreakWordSum" rowspan="2"><font style="color: RGB(' + aCipher.RGB.join() + ')">' + aCipher.sumArr[wCount] + '</font></td>'

					if (breakArr.indexOf(wCount) > -1) {
						rStr += '</tr><tr>'
						for (z; z < x; z++) {
							if (aCipher.cv[z] !== " ") {
								rStr += '<td class="BreakVal">' + aCipher.cv[z] + '</td>'
							}
						}
						rStr += '</tr></table><BR><table class="BreakTable"><tr>'
					}
					wCount++
				}
			}
			rStr += '<td class="BreakPhraseSum" rowspan="2"><font style="color: RGB(' + aCipher.RGB.join() + ')">' + aCipher.sumArr.reduce(getSum) + '</font></td>'
			rStr += '</tr><tr>'
			for (z; z < x; z++) {
				if (aCipher.cv[z] !== " ") {
					rStr += '<td class="BreakVal">' + aCipher.cv[z] + '</td>'
				}
			}
			rStr += '</tr></table>'

		} else if (opt_Breakdown == "Classic") {
			var isFirst = true

			rStr += '<div class="breakPhrase">"' + sVal() + '"</div> <div class="ClassicEq">= '
			for (x = 0; x < aCipher.cv.length; x++) {
				if (aCipher.cv[x] == " " && x + 1 !== aCipher.cv.length) {
					rStr += " + "
					isFirst = true
				} else if (x + 1 !== aCipher.cv.length || aCipher.cv[x] !== " ") {
					if (isFirst == false) {
						rStr += "+"
					}
					rStr += aCipher.cv[x]
					isFirst = false
				}
			}
			rStr += ' = </div> <div class="breakSum">' + aCipher.sumArr.reduce(getSum) + '</div> <div class="breakCipher"><font style="color: RGB(' + aCipher.RGB.join() + ')">(' + aCipher.Nickname + ')</font></div>'

		}
	} else {
		rStr = ""
	}

	document.getElementById("BreakdownSpot").innerHTML = rStr
}

function BuildBreaks(impCipher) {
	var x,  lastWord, lastCount
	var newLine = true; words = 0; y = ""; pixelOff = false
	breakArr = []
	
	for (x = 0; x < impCipher.cv.length; x++) {

		if (impCipher.cv[x] !== " ") {
			if (y == "") {y = x}
			if (impCipher.cv[x] > 99) {
				pixelCount += 1.5
			} else {
				pixelCount++
			}

			if (pixelCount > ChartMax && newLine == false) {
				breakArr.push(words - 1)
				pixelCount = 0
				x = y - 1
				newLine = true
			}

		} else {
			pixelCount += 2
			lastCount = pixelCount
			words++
			y = ""
			newLine = false
		}

	}
}

function FieldChange(impVal, skipCase = false) {
	if (opt_Shortcuts == true) {
		switch (impVal.substring(0,2).toLowerCase()) {
			case "s;":
				if (skipCase == false) {
					ToggleCipher(impVal)
				}
				break;
			case "m;":
				if (impVal == "m;u") {
					Slide_Cipher("up")
				} else if (impVal == "m;d") {
					Slide_Cipher("down")
				}
				break;
			default:
				break;
		}
	}

	Populate_Sums(sVal())
	Populate_Breakdown(breakCipher)
}

function ToggleCipher(impVal) {
	var cName, x

	switch (impVal.toLowerCase()) {
		case "s;efr":
			cName = "Full Reduction";
			break;
		case "s;efk":
			cName = "Full Reduction KV";
			break;
		case "s;esr":
			cName = "Single Reduction";
			break;
		case "s;esk":
			cName = "Single Reduction KV";
			break;
		case "s;eo":
			cName = "English Ordinal";
			break;
		case "s;ee":
			cName = "English Extended";
			break;
		case "s;eba":
			cName = "Francis Bacon";
			break;
		case "s;ebc":
			cName = "Franc Baconis";
			break;
		case "s;sat":
			cName = "Satanic";
			break;
		case "s;rfr":
			cName = "Reverse Full Reduction";
			break;
		case "s;rfe":
			cName = "Reverse Full Reduction EP";
			break;
		case "s;rsr":
			cName = "Reverse Single Reduction";
			break;
		case "s;rse":
			cName = "Reverse Single Reduction EP";
			break;
		case "s;ro":
			cName = "Reverse Ordinal";
			break;
		case "s;re":
			cName = "Reverse Extended";
			break;
		case "s;rba":
			cName = "Reverse Francis Bacon";
			break;
		case "s;rbc":
			cName = "Reverse Franc Baconis";
			break;
		case "s;rsat":
			cName = "Reverse Satanic";
			break;
		case "s;je":
			cName = "Jewish";
			break;
		case "s;jr":
			cName = "Jewish Reduction";
			break;
		case "s;jo":
			cName = "Jewish Ordinal";
			break;
		case "s;alw":
			cName = "ALW Kabbalah";
			break;
		case "s;kfw":
			cName = "KFW Kabbalah";
			break;
		case "s;lch":
			cName = "LCH Kabbalah";
			break;
		case "s;esu":
			cName = "English Sumerian";
			break;
		case "s;rsu":
			cName = "Reverse English Sumerian";
			break;
		case "s;pr":
			cName = "Primes";
			break;
		case "s;rpr":
			cName = "Reverse Primes";
			break;
		case "s;tr":
			cName = "Trigonal";
			break;
		case "s;rtr":
			cName = "Reverse Trigonal";
			break;
		case "s;sq":
			cName = "Squares";
			break;
		case "s;rsq":
			cName = "Reverse Squares";
			break;
		case "s;sep":
			cName = "Septenary";
			break;
		case "s;cha":
			cName = "Chaldean";
			break;
		case "s;all":
			Add_AllCiphers();
			RestoreField();
			cName = "Done";
			break;
		case "s;base":
			Add_BaseCiphers();
			RestoreField();
			cName = "Done";
			break;
		default:
			cName = "None";
	}
	if (cName !== "None" && cName !== "Done") {
		if (isCipherOn(cName) > -1) {
			Remove_Cipher(cName)
		} else {
			Add_Cipher(cName)
		}
		RestoreField()
	} else if (cName !== "Done") {
		FieldChange(impVal, true)
	}

}

function RestoreField() {
	if (sHistory.length > 0) {
		document.getElementById("SearchField").value = sHistory[0]
		document.getElementById("SearchField").focus()
		document.getElementById("SearchField").select()
	} else {
		document.getElementById("SearchField").value = ""
	}
}

function cipherHead_mouseOver(impName) {
	var x, aCipher
	for (x = 0; x < ciphersOn.length; x++) {
		if (ciphersOn[x].Nickname == impName) {
			aCipher = ciphersOn[x]
			Populate_Breakdown(aCipher.Nickname, false)
		}
	}
	//newHistory() // phrase is not added on mouse over
}

function cipherHead_click(impName) {
	var x, aCipher
	for (x = 0; x < ciphersOn.length; x++) {
		if (ciphersOn[x].Nickname == impName) {
			aCipher = ciphersOn[x]
			Populate_Breakdown(aCipher.Nickname, true)
		}
	}
}

function Populate_CharCodes() {
	var resSpot = document.getElementById("ResultSpot")
	var pStr = ""
	var x, z, sv

	sv = sVal()
	for (x = 0; x < sv.length; x++) {
		pStr += sv.charCodeAt(x) + ", "
	}

	resSpot.innerHTML = pStr
}

function Build_Table(impBool = true) {
	var retStr = '<center><table id="GemTable"><tr>'
	var x, y, z, aCipher

	if (impBool == true) {
		x = 0; y = 0
		while (x < ciphersOn.length) {
			aCipher = ciphersOn[x]
			retStr += '<td' + HeadClass() + HeadID(aCipher) + CipherColor(aCipher) + '>'
			retStr += HeadLink(aCipher)
			retStr += '</td>'
			if (x > 0 && (x + 1) / ciphers_per_row == Math.floor((x + 1) / ciphers_per_row)) {
				retStr += '</tr><tr>'
				for (y; y <= x; y++) {
					aCipher = ciphersOn[y]
					retStr += '<td' + ValClass() + ValID(aCipher) + CipherColor(aCipher) + '>0'
					retStr += '</td>'
				}
				retStr += '</tr><tr>'
			}
			x++
		}
		retStr += '</tr><tr>'
		for (y; y < x; y++) {
			aCipher = ciphersOn[y]
			retStr += '<td' + ValClass() + ValID(aCipher) + CipherColor(aCipher) + '>0'
			retStr += '</td>'
		}
	} else {
		retStr = '<center><table id="GemTable2"><tr>'
		x = 0
		while (x < ciphersOn.length) {
			if (x > 0 && x / ciphers_per_row == Math.floor(x / ciphers_per_row)) {
				retStr += '</tr><tr>'
			}
			aCipher = ciphersOn[x]
			retStr += '<td' + ValClass(2) + ValID(aCipher) + CipherColor(aCipher) + '>0'
			retStr += '</td>'
			x++
		}
	}

	retStr += '</tr></table></center>'
	document.getElementById("Gematria_Table").innerHTML = retStr
	Populate_Sums(sVal())
}

function Build_CharTable(impCipher) {
	var x, y, halfL
	var rStr

	if (opt_Chart == false) {
		document.getElementById("ChartSpot").innerHTML = ""
		return
	}

	if (impCipher.Nickname == "Francis Bacon" || impCipher.Nickname == "Franc Baconis" || impCipher.Nickname == "Reverse Francis Bacon" || impCipher.Nickname == "Reverse Franc Baconis") {
		rStr = '<center><table id="ChartTableThin" '
	} else {
		rStr = '<table id="ChartTable" '
	}
	// gradient table background based on cipher color
	rStr += 'style="background: rgb(16,16,16) -webkit-linear-gradient(0deg,rgba('+impCipher.RGB.join()+',0.2),#00000080); '
	rStr += 'background: rgb(16,16,16) -o-linear-gradient(0deg,rgba('+impCipher.RGB.join()+',0.2),#00000080); '
	rStr += 'background: rgb(16,16,16) -moz-linear-gradient(0deg,rgba('+impCipher.RGB.join()+',0.2),#00000080); '
	rStr += 'background: rgb(16,16,16) linear-gradient(0deg,rgba('+impCipher.RGB.join()+',0.2),#00000080);">'
	rStr += '<tr>'

	rStr += '<td colspan="' + impCipher.cArr.length + '">'
	rStr += '<button id="MoveUp" class="CipherButton" onclick="Slide_Cipher(' + "'up'" + ')" value="Move Up" style="float: left"><B>Move Up</B></button>'
	rStr += '<B><font style="font-size: 150%; color: RGB(' + impCipher.RGB.join() +')">' + impCipher.Nickname + '</font></B>'
	rStr += '<button id="MoveDown" class="CipherButton" onclick="Slide_Cipher(' + "'down'" + ')" value="Move Down" style="float: right"><B>Move Down</B></button></B>'
	rStr += '</td></tr><tr>'

	if (impCipher.cArr.length < 30 && impCipher.vArr.reduce(getSum) < 200) {
		for (x = 0; x < impCipher.cArr.length; x++) {
			rStr += '<td class="ChartChar" font style="color: rgb(' + impCipher.RGB.join() +')">' + String.fromCharCode(impCipher.cArr[x]) + '</td>'
		}
		rStr += '</tr><tr>'
		for (x = 0; x < impCipher.cArr.length; x++) {
			rStr += '<td class="ChartVal">' + impCipher.vArr[x] + '</td>'
		}
	} else {
		x = 0; y = 0; halfL = impCipher.cArr.length / 2
		for (x = 0; x < impCipher.cArr.length; x++) {
			if (x - halfL == 0 || x - halfL == 0.5) {
				rStr += '</tr><tr>'
				for (y; y < x; y++) {
					rStr += '<td class="ChartVal">' + impCipher.vArr[y] + '</td>'
				}
				rStr += '</tr><tr>'
			}
			rStr += '<td class="ChartChar" font style="color: rgb(' + impCipher.RGB.join() +')">' + String.fromCharCode(impCipher.cArr[x]) + '</td>'
		}
		if (impCipher.cArr.length % 2 == 1) { rStr += '<td class="ChartChar" font style="color: rgb(' + impCipher.RGB.join() +')"></td>' } // empty character cell to make even rows
		rStr += '</tr><tr>'
		for (y; y < x; y++) {
			rStr += '<td class="ChartVal">' + impCipher.vArr[y] + '</td>'
		}
		if (impCipher.cArr.length % 2 == 1) { rStr += '<td class="ChartVal"></td>' } // empty value cell to make even rows
	}

	document.getElementById("ChartSpot").innerHTML = rStr + '</center>'
}

function Open_Options () {
	var cSpot = document.getElementById("MenuSpot")
	var os = ""
	var oC, oR, oQ, oSC, oH, oS, oLW, oSHT

	if (opt_Chart == true) {oC = " checked"}
	if (opt_LetterCount == true) {oLW = " checked"}
	if (opt_Reduce == true) {oR = " checked"}
	if (opt_Quotes == true) {oQ = " checked"}
	if (opt_Shortcuts == true) {oSC = " checked"}
	if (opt_Headers == true) {oH = " checked"}
	if (opt_Summ == true) {oS = " checked"}
	if (opt_SeamlessHistoryTable == true) {oSHT = " checked"}

	os += '<center><table id="OptionsTable"><tr><td colspan="2"><center>'
	//os += '<button id="SaveOptions" onclick="UpdateOptions()" value="Save Options"><B>Save Settings</B></button>  '
	//os += '<div id="SaveMsg"></div>'
	os += '<div class="MenuLink" style="float: right;"><font style="font-size: 90%;"><a href="javascript:Populate_MenuBar()">Close Options</a></font></div></center></td></tr><tr><td>'
	os += 'Show Letter/Word Count <input type="checkbox" id="o_LWBox" value="Show Letter/Word Count" onclick="click_Opt()"' + oLW + '></input><BR>'
	os += 'Show Reduction <input type="checkbox" id="o_RBox" value="Show Reductions" onclick="click_Opt()"' + oR + '></input><BR>'
	os += 'Keyboard Shortcuts <input type="checkbox" id="o_SCBox" value="Keyboard Shortcuts" onclick="click_Opt()"' + oSC + '></input><BR>'
	os += 'Seamless History Table <input type="checkbox" id="o_SHTBox" value="Seamless History Table" onclick="click_Opt()"' + oSHT + '></input><P>'
	os += '<center>' + OBox_Ciphers() + '</center><p>'
	os += '<center>' + OBox_NumCalc() + '</center>'

	os += '</td><td>'

	os += '<font style="color: orange; font-size: 90%"><U>Breakdown Type:</U></font><BR>'
	os += '<center>' + OBox_Breakdown() + '</center><P>'
	os += 'Simple Result <input type="checkbox" id="o_SBox" value="Simple Result" onclick="click_Opt()"' + oS + '></input><BR>'
	os += 'Cipher Chart <input type="checkbox" id="o_CBox" value="Show Chart" onclick="click_Opt()"' + oC + '></input><BR>'
	os += 'Cipher Names <input type="checkbox" id="o_HBox" value="Show Names" onclick="click_Opt()"' + oH + '></input><BR>'
	os += 'Show Quotes <input type="checkbox" id="o_QBox" value="Show Quotes" onclick="click_Opt()"' + oQ + '></input>'

	os += '</td></tr></table></center>'
	
	cSpot.innerHTML = os
}
function click_Opt() {
	var QBox, EBox, LBox
	RBox = document.getElementById("o_RBox")
	SCBox = document.getElementById("o_SCBox")
	SBox = document.getElementById("o_SBox")
	CBox = document.getElementById("o_CBox")
	HBox = document.getElementById("o_HBox")
	QBox = document.getElementById("o_QBox")
	LWBox = document.getElementById("o_LWBox")
	SHTBox = document.getElementById("o_SHTBox")

	if (RBox.checked == true) {
		opt_Reduce = true
	} else {
		opt_Reduce = false
	}
	if (SCBox.checked == true) {
		opt_Shortcuts = true
	} else {
		opt_Shortcuts = false
	}
	if (SBox.checked == true) {
		opt_Summ = true
	} else {
		opt_Summ = false
	}
	if (CBox.checked == true) {
		opt_Chart = true
	} else {
		opt_Chart = false
	}
	if (HBox.checked == true) {
		opt_Headers = true
	} else {
		opt_Headers = false
	}
	if (QBox.checked == true) {
		opt_Quotes = true
	} else {
		opt_Quotes = false
	}
	if (LWBox.checked == true) {
		opt_LetterCount = true
	} else {
		opt_LetterCount = false
	}
	if (SHTBox.checked == true) {
		opt_SeamlessHistoryTable = true
		Open_History()
	} else {
		opt_SeamlessHistoryTable = false
		Open_History()
	}
	Set_ChartMax()
	Build_Table(opt_Headers)
	Populate_Sums(sVal())
	Populate_Breakdown()
}
function Set_ChartMax() {
	if (opt_Headers == true && ciphers_per_row > 7) {
		ChartMax = ((ciphers_per_row - 7) * 7) + 36
	} else {
		ChartMax = 36
	}
}

function OBox_Ciphers() {
	var cs = ""
	cs += '<font style="color: orange; size: 90%">Ciphers per Row:</font><BR>'
	cs += '<select style="width: 50px" id="Row_Drop" onchange="Set_Rows()">'
	for (x = 2; x < 13; x++) {
		cs += '<option value="' + x + '"'
		if (x == ciphers_per_row) {cs += ' selected="selected"'}
		cs += '>' + x + '</option>'
	}
	cs += '</select>'
	return cs
}
function OBox_NumCalc() {
	var ns = ""
	var nArr = ["Off", "Full", "Reduced"]
	var nArr2 = [" ", " (123 = 123)", " (123 = 1+2+3 = 6)"]
	ns += '<font style="color: orange; size: 90%">Number Calculation:</font><BR>'
	ns += '<select id="Num_Calc" onchange="Set_NumCalc()">'
	for (x = 0; x < nArr.length; x++) {
		if (nArr[x] == opt_NumCalculation) {
			ns += '<option value="' + nArr[x] + '" selected="selected">' +  nArr[x] + nArr2[x] + '</option>'
		} else {
			ns += '<option value="' + nArr[x] + '">' +  nArr[x] + nArr2[x] + '</option>'
		}
	}
	ns += '</select>'
	return ns
}
function OBox_Breakdown() {
	var ns = ""
	var nArr = ["Chart", "Classic", "Off"]
	ns += '<select id="Breakdown_Type" onchange="Set_Breakdown()">'
	for (x = 0; x < nArr.length; x++) {
		if (nArr[x] == opt_Breakdown) {
			ns += '<option value="' + nArr[x] + '" selected="selected">' +  nArr[x] + '</option>'
		} else {
			ns += '<option value="' + nArr[x] + '">' +  nArr[x] + '</option>'
		}
	}
	ns += '</select>'
	return ns
}
function Set_Rows() {
	var rDrop = document.getElementById("Row_Drop")
	ciphers_per_row = Number(rDrop.value)
	Set_ChartMax()
	Build_Table(opt_Headers)
	Populate_Breakdown()
}
function Set_NumCalc() {
	var nCalc = document.getElementById("Num_Calc")
	opt_NumCalculation = nCalc.value
	Build_Table(opt_Headers)
	Populate_Breakdown()
}
function Set_Breakdown() {
	var bdType = document.getElementById("Breakdown_Type")
	opt_Breakdown = bdType.value
	Build_Table(opt_Headers)
	Populate_Breakdown()
}

function Open_Shortcuts() {
	//window.open("http://www.gematrinator.com/nextgen/Shortcuts.png", 'Keyboard Shortcuts')
}

//function PromptCustomCharacters() {
//	if (customcharset.length < 1) { examplecharset = "a b c d e f g h i j k l m n o p q r s t u v w x y z"; }
//	var retVal = prompt("Enter custom set of comma delimited characters: ", customcharset)
//    console.log("You have entered : " + retVal)
//	split = retVal.split(",")
//	console.log(split)
//}

function PromptCustomValues() {
	//empty = false
	if (customvalues[0] == null) {
		examplevalues = "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26";
		empty = true // otherwise else condition becomes immediately valid
	//} else if (!empty) {
	} else {
		//string = JSON.stringify(customvalues).replace(/","/g, "\n");
		string = JSON.stringify(customvalues);
		examplevalues = string.substring(1, string.length - 1);
	}
	
	var retVal = prompt("Enter custom set of comma delimited values: ", examplevalues) // user input prompt
	console.log("You have entered : " + retVal)
	split = retVal.split(",") // string to string array, comma delimited
	console.log(split)

	result = split.map(function (x) { // parse string array as integer array to exclude quotes
		return parseInt(x, 10); 
	});
	customvalues = result
	
	console.log(customvalues)
	if (split == "") {
		customvalues = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26] // reinitialize array to Ordinal
	}
	
	pop_zero = customvalues.length // populate missing values with zeroes so there is no "undefined" if less than 26 values are specified
	if (pop_zero < 26) {
		for (i = pop_zero; i < 26; i++) {
				customvalues.push(0)
		};
	}
	
	cipherArray = [] // clear cipher array
	catArr = [] // clear categories
	allCiphers = [] // clear ciphers
	gemArr = []

	Page_Launch() // rebuild ciphers and categories
	
	Open_History() // update history table values
	Open_Ciphers() // open Cipher options
}

function Open_Ciphers(impOpt = cOption, impBool = false) {
	var mSpot = document.getElementById("MenuSpot")
	var hStr = '<center><table id="CipherChart"><tr>'
	var x, y, thisCat, key, keyOn, aCipher

	cOption = impOpt
	hStr += '<td class="CategoryList">'

	hStr += Category_Links()

	hStr += '</td><td class="CategoryList2"><a href="javascript:Toggle_All()">Toggle All</a>'

	hStr += '<div class="BottomDweller"><a href="javascript:Populate_MenuBar()">Close Ciphers</a></div><P>'

	for (key in cipherArray) {
		thisCat = cipherArray[key]
		if (thisCat == cOption && thisCat !== "Custom") { // all categories except for custom
			keyOn = "unchecked"
			for (x = 0; x < ciphersOn.length; x++) {
				if (ciphersOn[x].Nickname == key) {
					keyOn = "checked"
					break;
				}
			}
			for (y = 0; y < allCiphers.length; y++) {
				if (allCiphers[y].Nickname == key) {
					aCipher = allCiphers[y]
					break;
				}
			}
			hStr += '<input type="checkbox" id="' + replaceAll(key, " ", "") + '_Box" onclick="set_Ciphers()" value="' + key + '" '
			hStr += keyOn + '><font style="color: RGB(' + aCipher.RGB.join() + ')">' + aCipher.Nickname + '</font></input><BR>'
		}
		if (thisCat == cOption && thisCat == "Custom") { // special menu for Custom category
				keyOn = "unchecked"
				for (x = 0; x < ciphersOn.length; x++) {
					if (ciphersOn[x].Nickname == key) {
						keyOn = "checked"
						break;
					}
				}
				for (y = 0; y < allCiphers.length; y++) {
					if (allCiphers[y].Nickname == key) {
						aCipher = allCiphers[y]
						break;
					}
				}
				hStr += '<input type="checkbox" id="' + replaceAll(key, " ", "") + '_Box" onclick="set_Ciphers()" value="' + key + '" '
				hStr += keyOn + '><font style="color: RGB(' + aCipher.RGB.join() + ')">' + aCipher.Nickname + '</font></input><BR>'
		}
	}

	if (cOption == "Custom") {
		//hStr += '<div class="ButtonSection"><button class="CipherButton" onclick="PromptCustomCharacters()" value="CusotmCharacters"><B>Characters</B></button>'
		hStr += '<div class="ButtonSection"><button class="CipherButton" onclick="PromptCustomValues()" value="CustomValues"><B>Custom</B></button>'
		hStr += '<button class="CipherButton" onclick="No_Ciphers(true)" value="NoCiphers"><B>Empty</B></button>'
		hStr += '<button class="CipherButton" onclick="Add_BaseCiphers(true)" value="BaseCiphers"><B>Base Ciphers</B></button>'
		hStr += '<button class="CipherButton" onclick="Add_AllCiphers(true)" value="AllCiphers"><B>All Ciphers</B></button>'
		hStr += '<BR></td></tr></table></center>'
	}
	

	if (cOption !== "Custom") { // populate buttons for all categories except custom
		hStr += '<div class="ButtonSection"><button class="CipherButton" onclick="No_Ciphers(true)" value="NoCiphers"><B>Empty</B></button>'
		hStr += '<button class="CipherButton" onclick="Add_BaseCiphers(true)" value="BaseCiphers"><B>Base Ciphers</B></button>'
		hStr += '<button class="CipherButton" onclick="Add_AllCiphers(true)" value="AllCiphers"><B>All Ciphers</B></button>'
		hStr += '<button class="CipherButton" onclick="Add_RussianCiphers(true)" value="RussianCiphers"><B>Russian</B></button><BR>'
		hStr += '</td></tr></table></center>'
	}

	mSpot.innerHTML = ""
	mSpot.innerHTML = hStr
}
function Category_Links() {
	var x, thisCat, rStr
	rStr = ""
	for (x = 0; x < catArr.length; x++) {
		thisCat = catArr[x]
		if (thisCat == cOption) {
			rStr += '<font style="color: RGB(255, 255, 0)">' + thisCat + '</font><P>'
		} else {
			rStr += '<a href="javascript:Open_Ciphers('
			rStr += "'" + thisCat + "')"
			rStr += '" onmouseover="javascript:Open_Ciphers('
			rStr += "'" + thisCat + "')"
			rStr += '">' + thisCat + '</a><P>'
		}
	}
	return rStr
}
function set_Ciphers() {
	var cipherBox, x, y, isOn, cName

	for (x = 0; x < allCiphers.length; x++) {
		cName = allCiphers[x].Nickname
		switch (BoxStatus(cName)) {
			case "checked":
				if (isCipherOn(cName) < 0) {
					Add_Cipher(cName)
				}
				break;
			case "unchecked":
				if (isCipherOn(cName) > -1) {Remove_Cipher(cName)}
				break;
			case "na":
				break;
		}
	}
	Build_Table(opt_Headers)
}
function Toggle_All() {
	var cipherBox, x, y, allOn, cName

	allOn = true
	for (x = 0; x < allCiphers.length; x++) {
		cName = allCiphers[x].Nickname
		if (BoxStatus(cName) == "unchecked") {
			allOn = false
			break;
		}
	}

	if (allOn) {
		for (y = 0; y < allCiphers.length; y++) {
			cName = allCiphers[y].Nickname
			if (BoxStatus(cName) !== "na") {
				ToggleBox(cName, false)
				if (isCipherOn(cName) > -1) {Remove_Cipher(cName, false)}
			}
		}
	} else {
		for (y = 0; y < allCiphers.length; y++) {
			cName = allCiphers[y].Nickname
			if (BoxStatus(cName) !== "na") {
				ToggleBox(cName, true)
				if (isCipherOn(cName) < 0) {Add_Cipher(cName, false)}
			}
		}
	}
	Build_Table(opt_Headers)
}
function BoxStatus(impName) {
	var cipherBox = document.getElementById(replaceAll(impName, " ", "") + "_Box")
	if (cipherBox) {
		if (cipherBox.checked == true) {
			return "checked"
		} else {
			return "unchecked"
		}
	} else {
		return "na"
	}
}
function ToggleBox(impName, impBool) {
	var cipherBox = document.getElementById(replaceAll(impName, " ", "") + "_Box")
	if (cipherBox) {
		cipherBox.checked = impBool
	}
}
function isCipherOn(impName) {
	var x, isOn
	isOn = false
	x = openCiphers.indexOf(impName)
	return x
}
function SearchString() {
	var x, aCipher
	var ss = ""
	pArr = []

	for (x = 0; x < ciphersOn.length; x++) {
		aCipher = ciphersOn[x]
		if (ss !== "") {ss += "-"}
		ss += replaceAll(aCipher.Nickname, " ", "_") + "-"
		ss += gemArr[x]
	}

	return ss
}
function SearchNumbers() {
	var ss = "-"

	for (x = 0; x < ciphersOn.length; x++) {
		aCipher = ciphersOn[x]
		ss += replaceAll(aCipher.Nickname, " ", "_") + "-"
	}
	ss = pArr.join("-") + ss
	return ss.slice(0, ss.length - 1)
}
function NumberArray() {
	var x, isNum

	pArr = sVal().split(" ")
	isNum = true
	for (x = 0; x < pArr.length; x++) {
		if (isNaN(pArr[x])) {
			isNum = false
			break;
		} else {
			pArr[x] = Number(pArr[x])
		}
	}
	return isNum
}

function Match_Table() {
	var ms, x, y, aCipher, gemSum, cs, isBold, isSame

	ms = '<div class="MenuLink"><a href="javascript:Open_History()">Show History</a></div><BR>'
	ms += '<table class="MTable"><tr><td>'

	for (x = 0; x < mArr.length - 1 && x < 250; x++) {

		if (x % 25 == 0) {
			ms += '<tr><td class="MPhrase"><font style="color: orange;">Word or Phrase</font></td>'
			for (z = 0; z < ciphersOn.length; z++) {
				ms += '<td class="CipherHead" style="color: RGB(' + ciphersOn[z].RGB.join() +')">'
				ms += ciphersOn[z].Nickname
				ms += "</td>"
			}
			ms += "</tr>"
		}

		ms += '<tr><td class="MPhrase">' + mArr[x] + '</td>'

		for (y = 0; y < ciphersOn.length; y++) {

			aCipher = ciphersOn[y]
			gemSum = aCipher.Gematria(mArr[x], 1)
			cs = replaceAll(aCipher.Nickname, " ", "_")

			if (gemArr[y] == gemSum || pArr.indexOf(gemSum) > -1) {isSame = true} else {isSame = false}
			if (gemArr.indexOf(gemSum) > -1) {isBold = true} else {isBold = false}

			ms += '<td class="MSum'
			if (isSame == true) {
				ms += ' MSumFull'
			} else if (isBold == true) {
				ms += ' MSumPart'
			}
			ms += '">'

			if (isSame == true) {ms += '<font style="color: RGB(' + aCipher.RGB.join() + '")>'}
			ms += gemSum
			if (isSame == true) {ms += '</font>'}
			ms += '</td>'
		}
		ms += '</tr>'
	}

	ms += '</table>'
	return ms
}
function Match_Table2() {
	tArea = document.getElementById("MiscSpot")
	if (mArr.length > 0) {
		tArea.innerHTML = Match_Table()
	} else {
		tArea.innerHTML = '<font style="color: RGB(223, 0, 0)">You must first click "Match" to build this table</font>'
	}
	miscContents = "match"
}

function ValClass(impType = 1) {if (impType == 1) {return ' class="GemVal"'} else {return ' class="GemVal2"'}}
function ValID (impCipher) {return ' id="' + impCipher.Nickname + '_Sum"'}
function CipherColor(impCipher) {return ' style="color: RGB(' + impCipher.RGB.join() +'); text-shadow: 0px 0px 20px rgb('+impCipher.RGB.join()+');"'}
function HeadClass() {return ' class="GemHead"'}
function HeadID(impCipher) {return ' id="'+ impCipher.Nickname + '_Head"'}
function HeadLink(impCipher) {
	var rStr = ""
	rStr += '<a onmouseover="javascript:cipherHead_mouseOver('
	rStr += "'" + impCipher.Nickname + "', false)"
	rStr += '" onmouseout="Populate_Breakdown()" href="javascript:cipherHead_click('
	rStr += "'" + impCipher.Nickname + "', true"
	rStr += ')">' + impCipher.Nickname + '</a>'
	return rStr
}
function replaceAll(sS, fS, rS) {
  return sS.replace(new RegExp(fS, 'g'), rS);
}
function UpdateUserHistory() {
	var cString, x

	cString = sHistory[0]

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {}
    };
    //xhttp.open("POST", "http://www.gematrinator.com/usersettings/updatehistory.php?history=" + cString, true);
    //xhttp.send();
}
function UpdateOptions() {
	var oString, cString, x

	cString = ""
	for (x = 0; x < openCiphers.length; x++) {
		cString += openCiphers[x] + "|"
	}

	tempArr = [cString, opt_NumCalculation, opt_Breakdown, ciphers_per_row, opt_Reduce, opt_Quotes, opt_Summ, opt_Chart, opt_Shortcuts, opt_Headers]
	oString = tempArr.join(";")

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
    		respText = xhttp.responseText
    		document.getElementById("SaveMsg").innerHTML = respText
    	}
    };
    //xhttp.open("POST", "http://www.gematrinator.com/usersettings/updateoptions.php?options=" + oString, true);
    //xhttp.send();
}