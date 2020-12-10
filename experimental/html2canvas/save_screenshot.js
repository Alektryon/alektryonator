// var element = $(".ChartTable"); // global variable
var getCanvas; // global variable

function addScrInterface() {
	var ScrInt = document.getElementById("screenshotToolbar");
	o = '</td></tr></table></center>'
	o += '</td></tr></table></center>'
	
	// buttons
	o += '<input id="btn-prev-cipher-png" type="button" value="Cipher Table" />' // cipher breakdown preview
	o += '<input id="btn-prev-history-png" type="button" value="History Table" />' // history table preview
	o += '<input id="btn-save-png" type="button" value="Save Image" </>' // save image
	
	o += '<div id="previewImage">'
	o += '</div>'
	ScrInt.innerHTML = o
}

//$("#btn-Preview-Image").on('click', function () {
$("body").on("click", "#btn-prev-cipher-png", function () {
	$("#previewImage").empty(); // empty element contents
	if ( $( "#ChartTable" ).length ) { // if element exists
		html2canvas($("#ChartTable")[0]).then((canvas) => {
			console.log("done ... ");
			$("#previewImage").append(canvas);
			getCanvas = canvas;
		});
	};
	if ( $( "#ChartTableThin" ).length ) {
		html2canvas($("#ChartTableThin")[0]).then((canvas) => {
			console.log("done ... ");
			$("#previewImage").append(canvas);
			getCanvas = canvas;
		});
	}
});

$("body").on("click", "#btn-prev-history-png", function () {
	$("#previewImage").empty(); // empty element contents
	if ( $( "#ChartTable" ).length ) {
		html2canvas($("#HistoryTable_scr")[0]).then((canvas) => {
			console.log("done ... ");
			$("#previewImage").append(canvas);
			getCanvas = canvas;
		});
	};
});

$("body").on("click", "#btn-save-png", function () {
	console.log("download");
	var imageData = getCanvas.toDataURL("image/png");
	// Now browser starts downloading it instead of just showing it
	var newData = imageData.replace(/^data:image\/png/, "data:application/octet-stream");
	// $("#btn-Convert-Html2Image").attr("download", Date.now()+".png").attr("href", newData); // for <a> element
	download(Date.now()+".png", newData);
});


function download(fileName, fileData) {

	//creating an invisible element
	var element = document.createElement('a');
	
	//element.setAttribute('href', 'data:text/plain;charset=utf-8, '+encodeURIComponent(filedata));
	element.setAttribute('href', fileData);
	element.setAttribute('download', fileName);

	// Above code is equivalent to
	// <a href="path of file" download="file name">

	document.body.appendChild(element);

	//onClick property
	element.click();

	document.body.removeChild(element);
}

addScrInterface();