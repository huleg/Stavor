var global_missions = {
	active: -1,
	selected: -1
}

function areMissionsInstalled(){
	var serialized = localStorage.getItem('missionsInstalled'); 
	if(serialized){
		var localData = JSON.parse(serialized);
		return localData;
	}
}
function setMissionsInstalled(bool){
	var dataToStore = JSON.stringify(bool);
	localStorage.setItem('missionsInstalled', dataToStore);
}

function loadMissionsStoredVariables(){
	var serialized = localStorage.getItem('missionsConfig'); 
	if(serialized){
		var localData = JSON.parse(serialized);
		global_missions = localData;
		//global_missions.selected = -1;
	}
}
function saveMissionsStoredVariables(){
	var dataToStore = JSON.stringify(global_missions);
	localStorage.setItem('missionsConfig', dataToStore);
}

function selectActiveMission(){
	if(global_missions.selected != -1){
		db.transaction(function (tx) {
			tx.executeSql('SELECT * FROM missions WHERE id = '+global_missions.selected+';', [], function (tx, results) {	
				if(results.rows.length == 1){
					styleMissionRows();
					global_simulator.changeMission(results.rows.item(0).json);
				}else{
					global_missions.selected = -1;
					saveMissionsStoredVariables();
				}
			}, errorDatabaseHandler);
		});
	}else{
		global_missions.selected = 1;
		selectActiveMission();
	}
}

function onDeleteMissionButtonClicked(){
	if(global_missions.active == -1){
		Dialog.showDialog($.localize.data.strings.dialog_click_mission_first_title, $.localize.data.strings.dialog_click_mission_first_message, function(){});
	}else{
		if(global_missions.active == global_missions.selected){
			Dialog.showDialog($.localize.data.strings.dialog_cannot_delete_mission_title, $.localize.data.strings.dialog_cannot_delete_mission_message, function(){});
		}else{
			db.transaction(function (tx) {
				tx.executeSql('SELECT name FROM missions WHERE id = '+global_missions.active+';', [], function (tx, results) {	
					Dialog.showConfirmDialog($.localize.data.strings.dialog_confirm_delete_mission_title,$.localize.data.strings.dialog_confirm_delete_mission_message_1+results.rows.item(0).name+$.localize.data.strings.dialog_confirm_delete_mission_message_2,function(){
						db.transaction(function (tx) {
							tx.executeSql('DELETE FROM missions WHERE id = '+global_missions.active+';', [], function (tx, results) {	
								global_missions.active = -1;
								drawMissionsList();
							}, errorDatabaseHandler);
						});
					},function(){});
				}, errorDatabaseHandler);
			});
		}
	}
}
function onSelectMissionButtonClicked(){
	if(global_missions.active == -1){
		Dialog.showDialog($.localize.data.strings.dialog_click_mission_first_title, $.localize.data.strings.dialog_click_mission_first_message, function(){});
	}else{
		if(global_missions.active != global_missions.selected){
			db.transaction(function (tx) {
				tx.executeSql('SELECT * FROM missions WHERE id = '+global_missions.active+';', [], function (tx, results) {	
					Dialog.showConfirmDialog($.localize.data.strings.dialog_confirm_select_mission_title,$.localize.data.strings.dialog_confirm_select_mission_message_1+results.rows.item(0).name+$.localize.data.strings.dialog_confirm_select_mission_message_2, function(){
						global_missions.selected = global_missions.active;
						styleMissionRows();
						saveMissionsStoredVariables();
						global_simulator.changeMission(results.rows.item(0).json);
					},function(){});
				}, errorDatabaseHandler);
			});
		}
	}
}

function onCopyMissionButtonClicked(){
	if(global_missions.active == -1){
		Dialog.showDialog($.localize.data.strings.dialog_click_mission_first_title, $.localize.data.strings.dialog_click_mission_first_message, function(){});
	}else{
		db.transaction(function (tx) {
			tx.executeSql('SELECT * FROM missions WHERE id = '+global_missions.active+';', [], function (tx, results) {	
				Dialog.showConfirmDialog($.localize.data.strings.dialog_confirm_copy_mission_title,$.localize.data.strings.dialog_confirm_copy_mission_message_1+results.rows.item(0).name+$.localize.data.strings.dialog_confirm_copy_mission_message_2, function(){
					db.transaction(function (tx) {
						tx.executeSql('INSERT INTO missions (isDefault, name, json) VALUES (?, ?, ?)', [false, results.rows.item(0).name+"_c", results.rows.item(0).json], drawMissionsList);
					});
				},function(){});
			}, errorDatabaseHandler);
		});
	}
}


function onMissionClicked(id){
	var num_id = Number(id.substr(4,id.length));
	global_missions.active = num_id;
	styleMissionRows();
}

function styleMissionRows(){
	var list = document.getElementById("olListMissions");
	var listItems = list.getElementsByTagName("li");
	var active_found = false;
	var selected_found = false;
	for (var i=0; i < listItems.length; i++) {
		var num_id = Number(listItems[i].id.substr(4,listItems[i].id.length));
	
		if(num_id == global_missions.active && num_id == global_missions.selected){
			listItems[i].className = "MissionActiveSelected";
			selected_found = true;
			active_found = true;
		}else if (num_id == global_missions.active){
			listItems[i].className = "MissionActive";
			active_found = true;
		}else if(num_id == global_missions.selected){
			listItems[i].className = "MissionSelected";
			selected_found = true;
		}else{
			listItems[i].className = "MissionNormal";
		}
	}
	
	var recursive = false;
	if(!active_found){
		if(listItems.length > 0){
			global_missions.active = Number(listItems[0].id.substr(4,listItems[0].id.length));
			recursive = true;
		}else{
			global_missions.active = -1;
		}
	}
	
	/*if(!selected_found){
		if(listItems.length > 0){
			global_missions.selected = Number(listItems[0].id.substr(4,listItems[0].id.length));
		}else{
			global_missions.selected = -1;
		}
	}*/
	
	if(recursive){
		styleMissionRows();
	}
}

function drawMissionsList(){
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM missions ORDER BY name COLLATE NOCASE;', [], function (tx, results) {
			var mission_rows = results.rows;
			var div_list = document.getElementById("olListMissions"); 
			var content = "";
			var len = mission_rows.length, i;
			for (i = 0; i < len; i++) {
				var row = mission_rows.item(i); 
				content += "<li id='mis_"+row.id+"' class='MissionNormal' onclick='onMissionClicked(this.id)'>"+row.name+"</li>";
			}
			div_list.innerHTML = content;
			styleMissionRows();
			if(!global_delayed_loading.database.missions){				
				selectActiveMission();
				global_delayed_loading.database.missions = true;
				setLoadingText("Missions loaded!");
				hideSplash();
			}
		}, errorDatabaseHandler);
	});
}

function resetMissionsDb(){
	Dialog.showConfirmDialog($.localize.data.strings.dialog_reset_missions_db_title,$.localize.data.strings.dialog_reset_missions_db_message,function(){
		db.transaction(function (tx) {
			tx.executeSql('DROP TABLE missions', [], function (tx, results) {
				setMissionsInstalled(false);
				window.location.reload();
			}, errorDatabaseHandler);
		});
	},function(){});
}

function initializeMissionsDb(){
	var installed = areMissionsInstalled();
	if(!installed){
		db.transaction(function (tx) {
			tx.executeSql('CREATE TABLE missions (id INTEGER PRIMARY KEY, isDefault BOOLEAN, name VARCHAR(255), json BLOB)', [], function (tx, results) {
				var default_missions = new Array();
				var mission;
				
				//Example 0- GTO
				mission = new Mission();
				mission.name = "GTO";
				mission.description = "Geostationary Transfer Orbit";
				mission.duration = 100000.0;
				mission.step = 10.0;
				mission.initial_orbit.a = 2.4396159E7;
				mission.initial_orbit.e = 0.72831215;
				//mission.initial_orbit.i = 0.0;
				//mission.initial_orbit.omega = ;
				//mission.initial_orbit.raan = 0.0;
				//mission.initial_orbit.lM = ;
				default_missions[default_missions.length] = mission;
				
				//Example 1- LEO
				mission = new Mission();
				mission.name = "LEO";
				mission.description = "Example of Low Earth Orbit";
				mission.duration = 100000.0;
				mission.step = 10.0;
				mission.initial_orbit.a = 7.0E6;
				mission.initial_orbit.e = 0.0;
				mission.initial_orbit.i = 0;
				//mission.initial_orbit.omega = ;
				mission.initial_orbit.raan = 0.0;
				//mission.initial_orbit.lM = ;
				default_missions[default_missions.length] = mission;
				
				//Example 2- LEO Polar
				mission = new Mission();
				mission.name = "LEO - Polar";
				mission.description = "Example of Polar Low Earth Orbit";
				mission.duration = 100000.0;
				mission.step = 10.0;
				mission.initial_orbit.a = 7.0E6;
				mission.initial_orbit.e = 0.0;
				mission.initial_orbit.i = 1.57;
				//mission.initial_orbit.omega = ;
				mission.initial_orbit.raan = 0.0;
				//mission.initial_orbit.lM = ;
				default_missions[default_missions.length] = mission;
				
				//Example 3- MEO
				mission = new Mission();
				mission.name = "MEO";
				mission.description = "Example of Medium Earth Orbit";
				mission.duration = 100000.0;
				mission.step = 10.0;
				mission.initial_orbit.a = 2.9E7;
				mission.initial_orbit.e = 0.0;
				mission.initial_orbit.i = 0.90;
				//mission.initial_orbit.omega = ;
				mission.initial_orbit.raan = 0.0;
				//mission.initial_orbit.lM = ;
				default_missions[default_missions.length] = mission;
				
				//Example 4- GEO
				mission = new Mission();
				mission.name = "GEO";
				mission.description = "Example of Geostationary Orbit";
				mission.duration = 100000.0;
				mission.step = 10.0;
				mission.initial_orbit.a = 4.2164E7;
				mission.initial_orbit.e = 0.0;
				mission.initial_orbit.i = 0.90;
				//mission.initial_orbit.omega = ;
				mission.initial_orbit.raan = 0.0;
				//mission.initial_orbit.lM = ;
				default_missions[default_missions.length] = mission;
				
				//Example 5- GEO
				mission = new Mission();
				mission.name = "GEO - Equatorial";
				mission.description = "Example of Equatorial Geostationary Orbit";
				mission.duration = 100000.0;
				mission.step = 10.0;
				mission.initial_orbit.a = 4.2164E7;
				mission.initial_orbit.e = 0.0;
				mission.initial_orbit.i = 0.0;
				//mission.initial_orbit.omega = ;
				mission.initial_orbit.raan = 0.0;
				//mission.initial_orbit.lM = ;
				default_missions[default_missions.length] = mission;
				
				
				for(var i = 0; i < default_missions.length; i++)
					tx.executeSql('INSERT INTO missions (isDefault, name, json) VALUES (?, ?, ?)', [true, default_missions[i].name, JSON.stringify(default_missions[i])], successDatabaseHandler, errorDatabaseHandler);
				});
				
				setMissionsInstalled(true);
				loadMissionsStoredVariables();
				drawMissionsList();
			});
	}else{
		loadMissionsStoredVariables();
		drawMissionsList();
	}
}

function addMissionToDb(mission){
	var json = JSON.stringify(mission);
	db.transaction(function (tx) {
		tx.executeSql('INSERT INTO missions (isDefault, name, json) VALUES (?, ?, ?)', [false, mission.name, json], onMissionEditorConfirm);
	});
}
function onMissionEditorConfirm(){
	closeMissionEditor();
	drawMissionsList();
}

function editMissionToDb(id,mission){
	var json = JSON.stringify(mission);
	db.transaction(function (tx) {
		tx.executeSql('UPDATE missions SET name=?, json=? WHERE id=?', [mission.name, json, id], onMissionEditorConfirm);
	});
}

function updateMissionEditor(mission,mission_id){
	if(global_angle_in_rads){
		document.getElementById("AngleUnitsSelectionRads").className = "AngleUnitsSelected";
		document.getElementById("AngleUnitsSelectionDegs").className = "AngleUnitsUnselected";
		var div;
		div = document.getElementById("MissionEditor-Inclination");
		div.innerHTML = div.innerHTML.replace("(deg)","(rad)");
		div = document.getElementById("MissionEditor-Omega");
		div.innerHTML = div.innerHTML.replace("(deg)","(rad)");
		div = document.getElementById("MissionEditor-Raan");
		div.innerHTML = div.innerHTML.replace("(deg)","(rad)");
		div = document.getElementById("MissionEditor-lM");
		div.innerHTML = div.innerHTML.replace("(deg)","(rad)");
	}else{
		document.getElementById("AngleUnitsSelectionRads").className = "AngleUnitsUnselected";
		document.getElementById("AngleUnitsSelectionDegs").className = "AngleUnitsSelected";
		var div;
		div = document.getElementById("MissionEditor-Inclination");
		div.innerHTML = div.innerHTML.replace("(rad)","(deg)");
		div = document.getElementById("MissionEditor-Omega");
		div.innerHTML = div.innerHTML.replace("(rad)","(deg)");
		div = document.getElementById("MissionEditor-Raan");
		div.innerHTML = div.innerHTML.replace("(rad)","(deg)");
		div = document.getElementById("MissionEditor-lM");
		div.innerHTML = div.innerHTML.replace("(rad)","(deg)");
	}

	var field;
	field = document.getElementById("mis-Id");
	field.value = mission_id;
	
	if(mission_id == -1){
		document.getElementById("mis-TitleCreate").style.display = "block";
		document.getElementById("mis-TitleEdit").style.display = "none";
	}else{
		document.getElementById("mis-TitleCreate").style.display = "none";
		document.getElementById("mis-TitleEdit").style.display = "block";
	}
	field = document.getElementById("mis-Name");
	field.value = mission.name;
	field = document.getElementById("mis-Description");
	field.value = mission.description;
	field = document.getElementById("mis-Mass");
	field.value = mission.initial_mass;
	
	
	field = document.getElementById("mis-AttitudeProvider");
	field.value = mission.attitude_provider;
	
	$('.datepicker').pickadate({
		clear: '',
		format: 'yyyy/mm/dd',
		formatSubmit: 'yyyy/m/d'
	});
	$('.timepicker').pickatime({
		clear: '',
		format: 'HH:i',
		formatLabel: 'HH:i',
		formatSubmit: 'H:i'
	});
	
	field = document.getElementById("mis-Date");
	field.className="MissionField";
	field.value = mission.initial_date.year+"/"+mission.initial_date.month+"/"+mission.initial_date.day;
	field = document.getElementById("mis-Time");
	field.className="MissionField";
	field.value = mission.initial_date.hour+":"+mission.initial_date.minute;
	
	
	
	field = document.getElementById("mis-Duration");
	field.value = mission.duration;
	field = document.getElementById("mis-Speed");
	field.value = mission.step*parameters.simulator_target_fps;
	field = document.getElementById("mis-a");
	field.value = mission.initial_orbit.a;
	field = document.getElementById("mis-e");
	field.value = mission.initial_orbit.e;
	field = document.getElementById("mis-i");
	field.value = mission.initial_orbit.i;
	if(!global_angle_in_rads){
		field.value = field.value * 180.0 / Math.PI;
	}
	field = document.getElementById("mis-omega");
	field.value = mission.initial_orbit.omega;
	if(!global_angle_in_rads){
		field.value = field.value * 180.0 / Math.PI;
	}
	field = document.getElementById("mis-raan");
	field.value = mission.initial_orbit.raan;
	if(!global_angle_in_rads){
		field.value = field.value * 180.0 / Math.PI;
	}
	field = document.getElementById("mis-lm");
	field.value = mission.initial_orbit.lM;
	if(!global_angle_in_rads){
		field.value = field.value * 180.0 / Math.PI;
	}
}

function saveMissionEditor(){
	try{
		var field;
		
		var mission = new Mission();
		
		field = document.getElementById("mis-Name");
		mission.name = field.value;
		field = document.getElementById("mis-Description");
		mission.description = field.value;
		field = document.getElementById("mis-Mass");
		mission.initial_mass = field.value;
		
		
		field = document.getElementById("mis-AttitudeProvider");
		mission.attitude_provider = Number(field.value);
		
		field = document.getElementById("mis-Date");
		var dates = field.value.split('/');
		mission.initial_date.year = Number(dates[0]);
		mission.initial_date.month = Number(dates[1]);
		mission.initial_date.day = Number(dates[2]);
		field = document.getElementById("mis-Time");
		var times = field.value.split(':');
		mission.initial_date.hour = Number(times[0]);
		mission.initial_date.minute = Number(times[1]);
		
		field = document.getElementById("mis-Duration");
		mission.duration = Number(field.value);
		field = document.getElementById("mis-Speed");
		mission.step = Number(field.value)/parameters.simulator_target_fps;
		
		
		field = document.getElementById("mis-a");
		mission.initial_orbit.a = Number(field.value);
		field = document.getElementById("mis-e");
		mission.initial_orbit.e = Number(field.value);
		field = document.getElementById("mis-i");
		mission.initial_orbit.i = Number(field.value);
		if(!global_angle_in_rads){
			mission.initial_orbit.i = mission.initial_orbit.i * Math.PI / 180.0;
		}
		field = document.getElementById("mis-omega");
		mission.initial_orbit.omega = Number(field.value);
		if(!global_angle_in_rads){
			mission.initial_orbit.omega = mission.initial_orbit.omega * Math.PI / 180.0;
		}
		field = document.getElementById("mis-raan");
		mission.initial_orbit.raan = Number(field.value);
		if(!global_angle_in_rads){
			mission.initial_orbit.raan = mission.initial_orbit.raan * Math.PI / 180.0;
		}
		field = document.getElementById("mis-lm");
		mission.initial_orbit.lM = Number(field.value);
		if(!global_angle_in_rads){
			mission.initial_orbit.lM = mission.initial_orbit.lM * Math.PI / 180.0;
		}
		
		field = document.getElementById("mis-Id");
		var id = Number(field.value);
		if(id == -1){//Create mode
			addMissionToDb(mission);
		}else{//Edit mode
			editMissionToDb(id,mission);
		}
		
	}catch(err){
		alert("Format error");
	}
}

function closeMissionEditor(){
	if(global_menus.mission.isOpen){
		var id = lastMissionEditorId;
		if(id == global_missions.selected){
			Dialog.showConfirmDialog($.localize.data.strings.dialog_restart_simulator_title, $.localize.data.strings.dialog_restart_simulator_message, function(){selectActiveMission();},function(){});
		}
		$( "#MissionEditorBackground" ).fadeOut( "fast", function() {
			// Animation complete.
		  });
		global_menus.mission.isOpen = !global_menus.mission.isOpen;
	}
}

function reopenMissionEditor(){
	var id = lastMissionEditorId;
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM missions WHERE id = '+global_missions.active+';', [], function (tx, results) {	
			if(global_menus.mission.isOpen){
				if(id == -1){//Create mode
					var mission = new Mission();
					updateMissionEditor(mission,id);
				}else{//Edit Mode
					var mission = JSON.parse(results.rows.item(0).json);
					updateMissionEditor(mission,id);
				}
			}
		}, errorDatabaseHandler);
	});
}

var lastMissionEditorId = -1;
function openMissionEditor(id){
	lastMissionEditorId = id;
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM missions WHERE id = '+global_missions.active+';', [], function (tx, results) {	
			if(!global_menus.mission.isOpen){
				if(id == -1){//Create mode
					var mission = new Mission();
					updateMissionEditor(mission,id);
					$( "#MissionEditorBackground" ).fadeIn( "fast", function() {
						// Animation complete.
					  });
					global_menus.mission.isOpen = !global_menus.mission.isOpen;
				}else{//Edit Mode
					var mission = JSON.parse(results.rows.item(0).json);
					updateMissionEditor(mission,id);
					$( "#MissionEditorBackground" ).fadeIn( "fast", function() {
						// Animation complete.
					  });
					global_menus.mission.isOpen = !global_menus.mission.isOpen;
				}
			}
		}, errorDatabaseHandler);
	});
}