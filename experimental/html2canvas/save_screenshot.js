// var element = $(".ChartTable"); // global variable
var getCanvas; // global variable

function addScrInterface() {
	var ScrInt = document.getElementById("screenshotToolbar");
	o = '</td></tr></table></center>'
	o += '</td></tr></table></center>'
	o += '<input id="btn-Preview-Image" type="button" value="Preview" />'
	o += '<input id="btn-Convert-Html2Image" type="button" value="Save Image" </>'
	o += '<h3>Preview :</h3>'
	o += '<div id="previewImage">'
	o += '</div>'
	ScrInt.innerHTML = o
}

//$("#btn-Preview-Image").on('click', function () {
$("body").on("click", "#btn-Preview-Image", function () {
	$("#previewImage").empty(); // empty element contents
	html2canvas($("#ChartTable")[0]).then((canvas) => {
		console.log("done ... ");
		$("#previewImage").append(canvas);
		getCanvas = canvas;
	});
});

$("body").on("click", "#btn-Convert-Html2Image", function () {
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