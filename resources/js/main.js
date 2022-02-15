let getUsername = async () => {
	const key = NL_OS == 'Windows' ? 'USERNAME' : 'USER';
	try {
		value = await Neutralino.os.getEnv(key);
	}
	catch(err) {
		console.error(err);
	}
}
//Some global vars
let arr_planets,arr_waypoints, arr_classes = "";
let lst_planets;
let listClassAnt  = [];
prevLenght = 0;
let varDemo = "";
let value = '';
let despX, despY, reasonX, reasonY, resetCoordsY = 0;
let datafile = "Calypso";
Neutralino.init();
getUsername();

var xhr = new XMLHttpRequest();
	xhr.open("GET", './maps/planets.csv'); //Use the selected engine to process the data
	xhr.send("Sending"); //We need to say something to the server
	xhr.onreadystatechange = function()
	{
		if (xhr.readyState == 4 && xhr.status == 200)	// Handle response when the operation is complete.
		{
			arr_planets = xhr.responseText.split("\r\n");
			main();
		}
	}
function main()
{
	//Selectable list of maps
	createList("chngMap");
	createWaypoints("Calypso");
}
//************************Start viewer
let calyviewer = OpenSeadragon({
	id:            "calymap",
	prefixUrl:     "images/",
	preserveViewport: false,
	sequenceMode: false,
	panHorizontal:true,
	panVertical:true,
	constrainDuringPan:false,
	wrapHorizontal:false,
	wrapVertical:false,
	visibilityRatio:0.5,
	minPixelRatio:0.5,
	minZoomImageRatio:0.8,
	maxZoomPixelRatio:2,
	defaultZoomLevel:0,
	zoomPerClick: 1,
	minZoomLevel:0,
	maxZoomLevel:15,
	navigationControlAnchor:"TOP_RIGHT",
	showFullPageControl:false,
	showNavigator:true,
	navigatorPosition:"BOTTOM_LEFT"
//		showReferenceStrip: true
});
calyviewer.addHandler('open', function() {
	var tracker = new OpenSeadragon.MouseTracker({
	element: "calymap",
	moveHandler: function(event) {
		var webPoint = event.position;
		var xMap = (calyviewer.viewport.pointFromPixel(webPoint).x/reasonX) + despX;
		var yMap = resetCoordsY - ( (calyviewer.viewport.pointFromPixel(webPoint).y/reasonY) - despY);
		xMap = parseInt(xMap);
		yMap = parseInt(yMap);
		var pagina = calyviewer.currentPage();
		positionEl.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;Map: ' + nameMap + ' &nbsp;Position: ' + xMap.toString() + "," + yMap.toString();
		}
	});  
	tracker.setTracking(true);
});

//****************************************************************************
//************************ Functions *****************************************
//****************************************************************************
//************************ Data manipulation
//Write waypoint to map file. Param data is included for future revisions, not really needed
let writeWaypoints = async (data) =>
{
	console.log("writing Waypoints in planet: "+ document.getElementById("inputMap").value);
	let file = NL_CWD+'/data/' + document.getElementById("inputMap").value + '.csv';
	let dataWay = arr_waypoints.join("\n");//Webapp translates LF (\n) into CRLF (\r\n) windows EOL.
	Neutralino.filesystem.writeFile(file,dataWay,
		function (data){/*console.log(data);*/statusdisplay("writing Waypoints in planet: "+ document.getElementById("inputMap").value)},
		function (){console.error('error');}
		);
}
//****************************************************************************
//Edit a Waypoint
function editWaypoint(planet,op,index)
{
	let div_data = document.getElementById("dataInput");
	div_data.style.background = "#fafafa";
	div_data.style.boxShadow = "10px 20px 30px lightblue";
	div_data.style.position = "absolute";
	div_data.style.opacity = 0;
	div_data.style.border = "1px inset #0f0f0F";
	div_data.style.borderRadius = "5px 5px 5px 5px";

	div_data.style.visibility = "visible";
	document.body.appendChild(div_data);
	resizeBox(div_data.id,25,25,45,45);
	div_data.style.zIndex = 20;
	fading(div_data.id,1,0.2,1,0);
	createList("inputMap");

	let buttonOK = document.createElement("INPUT");
	buttonOK.id = "btnRecord";
	buttonOK.type = "submit";
	document.getElementById("cellActions").appendChild(buttonOK);
	if(op==="altas")//Copy text from clipboard
	{
		buttonOK.value = "Add Waypoint";		
		fading('rowClip',1,0.1,1,0);
		index = arr_waypoints +1;
		document.getElementById("rowClip").style.visibility = "visible";
		buttonOK.addEventListener("click", function(e){confirmWrite(planet,index,addWaypoint,"Do you want to add this waypoint?");}, false);
		copyClip();
	}
	else
	{
		let arrClip = arr_waypoints[index].split(",")
		document.getElementById("inputMap").value = planet;
		document.getElementById("longInput").value = arrClip[0];
		document.getElementById("latInput").value = arrClip[1];
		document.getElementById("altInput").value = arrClip[2];
		document.getElementById("namInput").value = arrClip[3];
		document.getElementById("typeInput").value = arrClip[4];
		document.getElementById("othrInput").value = arrClip[5];

		buttonOK.value = "Modify Waypoint";
		buttonOK.addEventListener("click", function(e){confirmWrite(planet,index,modifyWaypoint,"Do you want to modify this waypoint?");e.preventDefault();}, false);
	}
	window.addEventListener("resize", function(e){resizeBox(div_data.id,25,25,45,45);}, false);
}
//****************************************************************************
//Copy text from clipboard to the text field in data div
function copyClip()
{
	navigator.clipboard.readText().then(clipText => document.getElementById("clipText").value = clipText);
}
//Parse clipboard text
function parseClip()
{
	let inClip = document.getElementById("clipText").value;
	inClip = inClip.replace(/\/wp\ |\[|\]/gi, "");
	inClip = inClip.replace(/,\ /gi, ",");
	let arrClip = inClip.split(",")
	document.getElementById("inputMap").value = arrClip[0];
	document.getElementById("longInput").value = arrClip[1];
	document.getElementById("latInput").value = arrClip[2];
	document.getElementById("altInput").value = arrClip[3];
	document.getElementById("namInput").value = arrClip[4];
}
//Copy waypoint to clipboard
function copyWaypoint(planet,arrWaypoint)
{
	wpLink = "/wp ["+planet+", "+arrWaypoint[0]+", "+arrWaypoint[1]+", "+arrWaypoint[2]+", "+ arrWaypoint[3] + "]";
	navigator.clipboard.writeText(wpLink);
	flashMsg("Waypoint Copied",5);
	statusdisplay("Waypoint link copied: "+wpLink);
}
//****************************************************************************
//Add a Waypoint
function addWaypoint(planet,index)
{
	let dataWay = document.getElementById("longInput").value;
	dataWay +="," + document.getElementById("latInput").value;
	dataWay +="," + document.getElementById("altInput").value;
	dataWay +="," + document.getElementById("namInput").value;
	dataWay +="," + document.getElementById("typeInput").value;
	dataWay +="," + document.getElementById("othrInput").value;
	arr_waypoints.push(dataWay);
	writeWaypoints();
	document.getElementById("btnRecord").remove();
	changemap(planet);
	fading('dataInput',1,0.1,0,1);fading('rowClip',1,0.1,0,1);	
	statusdisplay("Waypoint "+document.getElementById("namInput").value+" added.");
}

//****************************************************************************
//Modify a Waypoint
function modifyWaypoint(planet,index)
{
	let dataWay = document.getElementById("longInput").value;
	dataWay +="," + document.getElementById("latInput").value;
	dataWay +="," + document.getElementById("altInput").value;
	dataWay +="," + document.getElementById("namInput").value;
	dataWay +="," + document.getElementById("typeInput").value;
	dataWay +="," + document.getElementById("othrInput").value;	
	arr_waypoints[index] = dataWay;
	writeWaypoints();
	document.getElementById("btnRecord").remove();
	changemap(planet);
	fading('dataInput',1,0.1,0,1);fading('rowClip',1,0.1,0,1);	
	statusdisplay("Waypoint "+document.getElementById("namInput").value+" modified.");
}
//****************************************************************************
//Delete a Waypoint
function deleteWaypoint(planet,index)
{
	document.getElementById("inputMap").value = planet;
	arr_waypoints.splice(index, 1);
	writeWaypoints();
	changemap(planet);
	statusdisplay("Waypoint deleted");
}
//****************************************************************************
//Set up a new map
function changemap(mapName)
{
	//Remove waypoints list table before loading a new map
	if(document.getElementById("ulWaypoints"))
	{
		var objToRemove = document.getElementById("ulWaypoints")
		objToRemove.remove();
	}

	calyviewer.clearOverlays();
	statusdisplay("createMapLabels listClassAnt: "+listClassAnt);
	removeWaypoints();
	listClassAnt = [];//Clear the array of types
	createWaypoints(mapName);
}
function removeWaypoints()
{
	let elem = "";
	for(var i = 0; i < listClassAnt.length; i++)//for each type of waypoint
	{
		elem = document.getElementsByClassName(listClassAnt[i]);
		while(elem.length > 0)//we remove its overlays
		{
			elem[0].remove();
		}
	}
}
//************************ Waypoints
let createWaypoints = async (datafile) => {
	let response = await Neutralino.filesystem.readFile(NL_CWD+'/data/' + datafile + '.csv'); // get users list
	let data = await response // parse JSON
		arr_waypoints = data.split("\r\n");
		if(arr_waypoints[0] == "0,0,0.1,0.1,0"){statusdisplay("Sin Mapa");openMap("noMap");}
		else{openMap(datafile);createMapLabels();}
	return data;
}
//************************ Labels
//Create a list of waypoints and the events to activate their labels
function createMapLabels()
{
	let scaleValues = arr_waypoints[0].split(",")
	let div_overlay,div_overlay_img,listWaypoints,img_eye,div_content;
	let table_waypoints;
	let table_row;
	let table_cell,table_props;
	despX = scaleValues[0];
	despY = scaleValues[1];
	reasonX = scaleValues[2];
	reasonY = scaleValues[3];
	resetCoordsY = scaleValues[4];
	prevLenght = arr_waypoints.length;
	listWaypoints = document.getElementById("listWaypoints");
	let img_cell = document.createElement("img");
	let ul_listWaypoints = document.createElement("ul");
	ul_listWaypoints.id = "ulWaypoints"
	for (let i = 1; i < arr_waypoints.length; i++)
	{
		let coords = arr_waypoints[i].split(",")
		//Select a table with a list of waypoints grouped by class.
		if (document.getElementById("table_" + coords[4]))
		{
			table_waypoints = document.getElementById("table_" + coords[4])
		}
		else //Create a li and a table for a menu with accordions.
		{
			//A global var to clear the tables before overwriting a map
			listClassAnt.push(coords[4]);
			table_waypoints = document.createElement("table");
			table_waypoints.id = "table_" + coords[4];
			let li_listWaypoints = document.createElement("li");
			let chk_listWaypoints = document.createElement("INPUT");
			chk_listWaypoints.id = "chkwp_"+coords[4];
			chk_listWaypoints.name = "checkbox-accordion";
			chk_listWaypoints.setAttribute("type", "checkbox");
			div_content = document.createElement("div");
			div_content.id = "listWaypoints_"+coords[4];
			div_content.className = "content"
			img_eye = document.createElement("img");
			img_eye.src = "icons/eye.png";
			img_eye.style.cursor = "pointer";
			img_eye.id = "eyeClass_"+coords[4];
			img_eye.className = "Noclass";
			img_eye.title =  coords[4];	
			let lbl_listWaypoints = document.createElement("label");
			lbl_listWaypoints.htmlFor = "chkwp_"+coords[4];		
			let chk_class = document.createElement("INPUT");
			chk_class.setAttribute("type", "checkbox");
			chk_class.id = "ChkVis_"+coords[4];//Is the class visible?
			listWaypoints.appendChild(ul_listWaypoints);
			ul_listWaypoints.appendChild(li_listWaypoints);
			li_listWaypoints.appendChild(chk_listWaypoints);
			li_listWaypoints.appendChild(lbl_listWaypoints);
			lbl_listWaypoints.appendChild(chk_class);
			lbl_listWaypoints.appendChild(img_eye);
			lbl_listWaypoints.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;"+coords[4];
			div_content.appendChild(table_waypoints);
			li_listWaypoints.appendChild(div_content);
			
			if (img_eye.addEventListener) {
				document.getElementById(img_eye.id).addEventListener("click", function(e){switchClass(coords[4]);e.preventDefault();}, false);
			} else {
				img_eye.attachEvent("onclick", function(e){switchClass(coords[4]);e.preventDefault();}, false);
			}			
		}
		div_overlay = document.createElement("div");
		div_overlay_img = document.createElement("img");
		img_cell = document.createElement("img");
		img_cell.src = "icons/eye.png";
		img_cell.style.cursor = "pointer";
		img_cell.id = "eye_waypoint_" + i;
		let chk_eye = document.createElement("INPUT");
		chk_eye.id="chk_waypoint_"+i//Is the waypoint visible?
		chk_eye.setAttribute("type", "checkbox");
		chk_eye.checked = true;
		img_cell.addEventListener("click", function(){switchWaypoint("waypoint_" + i,coords)}, false);
		div_overlay.className = coords[4];
		div_overlay.id = "waypoint_"+i;
		switch (coords[4])//Need to decide if an indexed array or a json objet would go here better.
		{
			case "Revival":
				div_overlay_img.src = "icons/toolbox-plus-icon.png";
			break;
			case "Estate":
				div_overlay_img.src = "icons/house-icon.png";
			break;
			case "POI":
				div_overlay_img.src = "icons/camera-icon.png";
			break;
			case "Mission Broker":
				div_overlay_img.src = "icons/user-exclamation-icon.png";
			break;
			case "Outpost":
				div_overlay_img.src = "icons/bullet_red.png";
			break;
			case "Teleport":
				div_overlay_img.src = "icons/camera_lens.png";
			break;
			case "Mission":
				div_overlay_img.src = "icons/roadworks.png";
			break;
				case "Mob":
				div_overlay_img.src = "icons/bug.png";
			break;
				case "Instance":
				div_overlay_img.src = "icons/helmet_mine.png";
			break;
				case "Resource":
				div_overlay_img.src = "icons/coins-icon.png";
		}
		table_row = table_waypoints.insertRow();		
		table_cell = table_row.insertCell();
		table_cell.appendChild(img_cell);
		table_cell.appendChild(chk_eye);
		table_cell.align = "center";
		table_cell = table_row.insertCell();
			table_props = document.createElement("span");
			table_props.style.cursor = "pointer";
			table_props.innerHTML = coords[3];
			table_props.title =  coords[3] + "\nUse Ctrl+Secondary mouse button\nto copy this waypoint link\nto the clipboard";
		table_cell.align = "center";
		table_cell.className = "menuEl";
		table_cell.appendChild(table_props);
		div_overlay_img.style.cursor = "pointer";
		div_overlay_img.title =  coords[3] + "\nUse Ctrl+Secondary mouse button\nto copy this waypoint link\nto the clipboard";
		
		div_overlay_img.addEventListener("click", function(){switchLabel("label_" + i,coords)}, false);
		div_overlay_img.addEventListener("contextmenu", function(e){callMenu(nameMap,i,e);e.preventDefault()}, false);
		table_props.addEventListener("click", function(){switchLabel("label_" + i,coords)}, false);
		table_cell.addEventListener("contextmenu", function(e){callMenu(nameMap,i,e);e.preventDefault()}, false);
		document.body.appendChild(div_overlay);
		div_overlay.appendChild(div_overlay_img);
		div_overlay.style.display = "block";
		var x1 = (coords[0] - despX) * reasonX;
		var y1 = 1 - ((coords[1] - despY) * reasonY);
		calyviewer.addOverlay({element: div_overlay,location: new OpenSeadragon.Point(x1,y1)});
	}
	checkWidth();
}
//************************ Maps
//Open a map
function openMap(mapName)
{
	calyviewer.open("./maps/" + mapName + ".dzi");
	nameMap = mapName;
}
//Switch all the markers of a type.
function switchClass(myClass)
{
	statusdisplay("switchClass("+myClass+")");
	statusdisplay("listClassAnt = "+listClassAnt);
	if(document.getElementById("ChkVis_"+myClass).checked)//Is the label visible?
	{
		document.getElementById("eyeClass_"+myClass).src = "icons/eye.png";
		document.getElementById("ChkVis_"+myClass).checked = false;
		visiClass(myClass,"visible");
	}
	else
	{
		document.getElementById("ChkVis_"+myClass).checked = true;
		document.getElementById("eyeClass_"+myClass).src = "icons/eye-close-icon.png"
		visiClass(myClass,"hidden");
	}
}
function visiClass(myClass,visi)
{
	const elem = document.getElementsByClassName(myClass);
	/*We now know how many labels are there, so we go trough their visibiliy
	recorded states in switchLabel(myLabel,myCoords)*/
	for(var i = 0; i < elem.length; i++) {
		elemchk = document.getElementById("chk_"+elem[i].id);
		elem[i].style.visibility = visi;//Turn on the waypoint
		//check the visibility of the waypoint
		if (elemchk.checked === true)
		{
			elem[i].style.visibility = visi;//Turn on the waypoint label
		}
		else
		{
			elem[i].style.visibility = "hidden";//Turn off the waypoint label
		}	
	}
}
//Switch wayppoint
function switchWaypoint(myWaypoint,myCoords)
{
//Is the class visible? If not it has no sense to change anything.
if (document.getElementById("ChkVis_" + myCoords[4]).checked === false)
	{
	let myChkLabel = myWaypoint.replace(/waypoint/i, "chk_label");//make the id for the the chk label of the wapoint.
	let myLabel = myWaypoint.replace(/waypoint/i, "label");//make the id for the the label of the wapoint.
	//We use a checkbox instead the visibility to track the state when switching the whole class.
	if (document.getElementById("chk_"+myWaypoint).checked === false)
		{
		document.getElementById(myWaypoint).style.visibility = "visible";
		document.getElementById("chk_"+myWaypoint).checked = true;
		document.getElementById("eye_"+myWaypoint).src = "icons/eye.png"
		//Was the label visible? Maybe groping all the ids and props into a method cuold do the trick.
		if(document.getElementById(myLabel))
			{
			if (document.getElementById(myChkLabel).checked === true)
				{
				document.getElementById(myLabel).style.visibility = "visible";
				}
			}
		}
	else
		{
		document.getElementById(myWaypoint).style.visibility = "hidden";
		document.getElementById("chk_"+myWaypoint).checked = false;
		document.getElementById("eye_"+myWaypoint).src = "icons/eye-close-icon.png"
		//We just hide the label if it exists, but don't alter the visibility checkbox.
		if(document.getElementById(myLabel)){document.getElementById(myLabel).style.visibility = "hidden";}
		
		}	
	}
}
//Switch label
function switchLabel(myLabel,myCoords)
{
//Is the class hidden? If it is, then it has no sense to change anything.
//Is the waypoint visible? If not it has no sense to change anything.
let myWaypoint = myLabel.replace(/label/i, "waypoint");//make the id for the waypoint of the label.
if (document.getElementById("ChkVis_" + myCoords[4]).checked === false && document.getElementById("chk_"+myWaypoint).checked === true)
	{//Is there a label? If not we need to make one first.
	if (document.getElementById(myLabel))
		{
		//We use a checkbox instead the visibility to track the state when switching the whole class.
		if (document.getElementById("chk_"+myLabel).checked === false)
			{
			document.getElementById(myLabel).style.opacity = 0;
			document.getElementById(myLabel).style.visibility = "visible";
			fading(myLabel,1,0.1,1,Number(document.getElementById(myLabel).style.opacity));
			document.getElementById("chk_"+myLabel).checked = true;
			}
		else
			{
			fading(myLabel,1,0.1,0,Number(document.getElementById(myLabel).style.opacity));
			document.getElementById("chk_"+myLabel).checked = false;
			}
		}
	else
		{
		div_overlay_ovr = document.createElement("div");
		div_overlay_ovr.className = myCoords[4];
		div_overlay_ovr.id = myLabel
		div_overlay_label = document.createElement("div");
		div_overlay_label.className = "example-obtuse";
		div_overlay_chk = document.createElement("checkbox");
		div_overlay_chk.id = "chk_"+myLabel;
		div_overlay_chk.className = "chk_"+myCoords[4];
		div_overlay_chk.checked = true;
		div_overlay_label.id = "data_"+myLabel;
		div_overlay_label.innerHTML = "<center><b>" + myCoords[4] +"</b></center><br/>";
		div_overlay_label.innerHTML += "<b>" + myCoords[3] +"</b><br>";
		div_overlay_label.innerHTML += "Lon: " + myCoords[0]+"<br/>";
		div_overlay_label.innerHTML += " Lat: " + myCoords[1] +"<br/>";
		div_overlay_label.innerHTML += "Alt: " + myCoords[2] +"<br/>";
		div_overlay_label.innerHTML += "Other: " + myCoords[5] +"<br/>";
		//callMenu(planet,arrWaypoint)
		div_overlay_label.style.border = "1px inset #0f0f0F";
		div_overlay_label.style.height = "175px";
		div_overlay_label.style.width = "105px";
		div_overlay_label.style.borderRadius = "5px 10px 5px 5px";
		div_overlay_label.style.margin = "5px";
		div_overlay_label.style.fontSize = "14px";
		document.body.appendChild(div_overlay_ovr);
		div_overlay_ovr.appendChild(div_overlay_label);
		div_overlay_ovr.appendChild(div_overlay_chk);
		div_overlay_ovr.style.display = "block";
		var x1 = ((myCoords[0] * 1) - despX) * reasonX;
		var y1 = 1 - ((myCoords[1] - despY) * reasonY);
		calyviewer.addOverlay({element: div_overlay_ovr,location: new OpenSeadragon.Point(x1,y1), placement: OpenSeadragon.Placement.BOTTOM_LEFT});
		div_overlay_ovr.style.opacity = 0;
		fading(div_overlay_ovr.id,1,0.1,1,Number(div_overlay_ovr.style.opacity));

		}
	}
}
//************************ Interface

//Fade effect
/**
 *  @brief Fadein and fadeot effects
 *  
 *  @param [in] elem element id
 *  @param [in] interval time interval
 *  @param [in] increment step interval 
 *  @param [in] goal final opacity to achieve
 *  @param [in] opacity initial opacity of the element
 *  
 *  @details This function will do a fade in if thew goal is bigger than the initial opacity,
 *			else there will be a fadeout effect. If the opacity goal is zero, the element visibility
 *			will be set to "hidden".
 */
function fading(elem,interval,increment,goal,opacity)
{
	var acum = 0;
	let diff = Math.abs(goal-opacity);
	if (goal < opacity){increment = increment *(-1);}
    var instance = window.setInterval(function() {
		if(document.getElementById(elem))//if the item exists proceed
			{
			document.getElementById(elem).style.opacity = opacity;
			opacity = opacity + increment;
			acum = acum + Math.abs(increment);
			}
			else{acum = diff + 1;}//else abort 
		if(acum > diff){
			window.clearInterval(instance);
			if(goal === 0){document.getElementById(elem).style.visibility = "hidden";}
		}
	},interval)
}
//Flashing message
/**
 *  @brief Display a text for a while
 *  
 *  @param [in] message Text that will be displayed
 *  @param [in] repeats how many fade in and out repetas before deleting the box
 *  @return Return description
 *  
 *  @details The function will create a message box and display a message that will fade in and out the required amount of times
 */
function flashMsg(message,repeats)
{
	div_mesg = document.createElement("div");
	div_mesg.id = "msgBox_"+ randomHex();//Give unique names to the boxes
	div_mesg.className = "msgFloat";
	div_mesg.style.fontSize = "24px";
	div_mesg.style.color = "#ff0000";
	div_mesg.innerHTML = message;
	div_mesg.style.textShadow = "10px 10px 1px #0000ff";
	div_mesg.style.position = "absolute";
	div_mesg.style.opacity = 0;
	div_mesg.style.visibility = "visible";
	document.body.appendChild(div_mesg);
	div_mesg.style.top = ((window.innerHeight/2) - 100)+"px";
	div_mesg.style.left = ((window.innerWidth/2) - 200)+"px";
	div_mesg.style.zIndex = 20;
	setTimeout(function() {fading(div_mesg.id,1,0.1,1,Number(div_mesg.style.opacity))}, 1);//Fade in
	setTimeout(function() {fading(div_mesg.id,1,0.1,0,Number(div_mesg.style.opacity))}, 300);//Wait and fade out
	setTimeout(function() {//Wait and delete the queued messages
		elem = document.getElementsByClassName("msgBox");
		while(elem.length > 0){elem[0].remove();}
		}, 600);
}

//Fadeout and delete
function foDel(elem)
{
	elem = document.getElementById(elem);
	fading(elem.id,1,0.1,0,Number(elem.style.opacity));
	setTimeout(function(){elem.remove();}, 300);//Wait and delete the queued messages
}
function randomHex()
{
var hex = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F" ];
var rnd = 0;
	ses = "";
	for (var j = 0; j < 8; j++) {
		rnd = Math.floor(Math.random()*16);
		ses += hex[rnd];
	}
	return ses;
}
//List of maps
function createList(elem){
let i, j;
let spacer = "";
arr_classes = arr_planets[0].split(",");
objFltrOpt = document.getElementById(elem);
	for(i=1;i < arr_planets.length;i++){
		let lst_planets = arr_planets[i].split(",");
		spacer = "";
		for(j=0;j < lst_planets.length;j++){
			if (lst_planets[j] != ""){
				opt = document.createElement("option");
				if (j>0){spacer = "--"}
				opt.text = spacer + lst_planets[j];
				opt.value = lst_planets[j];
				objFltrOpt.options.add(opt);
			}
		}
		opt = document.createElement("option");
		opt.text = "----------------------------------";
		opt.value = "----------------------------------";
		objFltrOpt.options.add(opt);
	}
	objFltrOpt.SelectedIndex = 0;
}
function resizeBox(elem,mTop,mLeft,mBottom,mRight)
{
	locateBox(elem,mTop,mLeft);
	document.getElementById(elem).style.height = (window.innerHeight - mBottom)+"px";
	document.getElementById(elem).style.width = (window.innerWidth - mRight)+"px";
}
function locateBox(elem,mTop,mLeft)
{
	document.getElementById(elem).style.top = mTop + "px";
	document.getElementById(elem).style.left = mLeft + "px";
}
function checkWidth()
{
	let myNewWidth = window.innerWidth - 238;
	document.getElementById("listWaypoints").style.left = myNewWidth + "px";
}
function checkHeight()
{
	let myNewHeight = window.innerHeight - 70;
	document.getElementById("Panel1").style.height = myNewHeight + "px";
	myNewHeight = myNewHeight - 70;
	document.getElementById("calymap").style.height = myNewHeight + "px";
	document.getElementById("listWaypoints").style.height = myNewHeight + "px";
	myNewHeight = myNewHeight - 70;	
}
//Debug helper
function statusdisplay(myVar)
{
	document.getElementById("status").innerHTML = myVar;
	console.log("status called: "+ myVar);
}
//Confirm window
function confirmWrite(planet,index,fun,message){
	let retVal = false;
	div_mesg = document.createElement("div");
	div_mesg.style.visibility = "visible";
	div_mesg.style.zIndex = 30;
	document.body.appendChild(div_mesg);
	div_mesg.id = "confirmBox";
	div_mesg.className = "msgBox";
	head_mesg = document.createElement("span");
	head_mesg.innerHTML = message+"<br>";
	head_mesg.style.fontSize = "18px";
	div_mesg.appendChild(head_mesg);
	div_mesg.style.position = "absolute";
	let buttonOK = document.createElement("INPUT");
	buttonOK.type = "button";
	buttonOK.value = "Accept";
	div_mesg.appendChild(buttonOK);
	locateBox(div_mesg.id,((window.innerHeight/2) - 100),((window.innerWidth/2) - 200))
	buttonOK.addEventListener("click", function(){fun(planet,index);retVal = true;foDel(div_mesg.id);}, false);
	let buttonKO = document.createElement("INPUT");
	buttonKO.type = "button";
	buttonKO.value = "Cancel";
	div_mesg.appendChild(buttonKO);
	buttonKO.addEventListener("click", function(){foDel(div_mesg.id);retVal = false}, false);
}
//Call our context menu
function callMenu(planet,index,event)
{
	let arrWaypoint = arr_waypoints[index].split(",");
	if (event.ctrlKey) {//ctrl+secondary button calls the copy routine
		copyWaypoint(planet,arrWaypoint)
	}
	else {
		contextMenu(planet,index,event)
	}
}
//Our Context Menu
function contextMenu(planet,index,event)
{
	
	let arrWaypoint = arr_waypoints[index].split(",");
	let divMenu = document.getElementById('contextMenu');
	let myTable = document.createElement("table");
	myTable.id = "tableMenu";
	myTable.style.visibility = "inherit";
	divMenu.appendChild(myTable);	
	table_row = myTable.insertRow();
	divMenu.style.position = "absolute";
	divMenu.style.width = "200px";
	locateBox("contextMenu",event.clientY - 5,event.clientX - 5);
	table_row = myTable.insertRow();
	table_row.className = "menuEl contextEl";
	table_cell = table_row.insertCell();
		table_cell.className = "menuEl contextEl";
		table_cell.innerHTML = "Copy to Clipboard";
		table_cell.addEventListener("click", function(e){copyWaypoint(planet,arrWaypoint);fading("contextMenu",1,0.1,0,Number(divMenu.style.opacity));e.preventDefault()}, false);
		
	table_row = myTable.insertRow();
	table_row.className = "menuEl contextEl";
	table_cell = table_row.insertCell();
		table_cell.className = "menuEl contextEl";
		table_cell.innerHTML = "Modify Waypoint";
		table_cell.addEventListener("click", function(e){editWaypoint(planet,'modi',index);fading("contextMenu",1,0.1,0,Number(divMenu.style.opacity));e.preventDefault()}, false);		
		
	table_row = myTable.insertRow();
	table_row.className = "menuEl contextEl";
	table_cell = table_row.insertCell();
		table_cell.className = "menuEl contextEl";
		table_cell.innerHTML = "Delete Waypoint";
		table_cell.addEventListener("click", function(e){confirmWrite(planet,index,deleteWaypoint,"Do you want to delete this waypoint?");fading("contextMenu",1,0.1,0,Number(divMenu.style.opacity));;e.preventDefault()}, false);		
	document.getElementById('contextMenu').style.visibility = "visible";
	fading("contextMenu",1,0.1,1,Number(divMenu.style.opacity));//Fade in
}
