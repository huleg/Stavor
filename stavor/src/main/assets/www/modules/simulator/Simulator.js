var Simulator = function(){
	this.enum_simulation_status = {
		STOPPED: 1,
		PAUSED: 2,
		PLAYING: 3
	}
	this.enum_simulation_sense = {
		FORWARD: 1,
		REVERSE: 2
	}
	this.controls = {
		PLAY: document.getElementById("PlayButton"),
		STOP: document.getElementById("StopButton"),
		PROGRESS: document.getElementById("TimeBar"),
		ACCEL: document.getElementById("AccelButton"),
		SLOW: document.getElementById("SlowButton"),
		FORWARD: document.getElementById("ForwardButton"),
		REVERSE: document.getElementById("ReverseButton")
	}
	this.indicators = {
		CLOCK: document.getElementById("SimTime"),
		PROGRESS: document.getElementById("TimeBar")
	}
	
	this.sim_state = {
		state: this.enum_simulation_status.STOPPED,
		sense: this.enum_simulation_sense.FORWARD
	}
	
	this.sim_interface = new AndroidInterface(this);
}
//****************************************************************************
//                         From Stavor to Simulator  --> (Control widgets callbacks)
//****************************************************************************
Simulator.prototype.changeMission = function(mission){
	this.sim_interface.changeMission(mission);
}
Simulator.prototype.playButtonClicked = function(){
	this.sim_interface.playButtonClicked();
}
Simulator.prototype.stopButtonClicked = function(){
	this.sim_interface.stopButtonClicked();
}
Simulator.prototype.reverseButtonClicked = function(){
	this.sim_interface.reverseButtonClicked();
}
Simulator.prototype.forwardButtonClicked = function(){
	this.sim_interface.forwardButtonClicked();
}
Simulator.prototype.accelerateButtonClicked = function(){
	this.sim_interface.accelerateButtonClicked();
}
Simulator.prototype.slowButtonClicked = function(){
	this.sim_interface.slowButtonClicked();
}
Simulator.prototype.progressValueChanged = function(value){
	this.sim_interface.progressValueChanged(value);
}
//****************************************************************************
//                        From Simulator to Stavor  <-- (Events thrown by simulator)
//****************************************************************************
Simulator.prototype.updateMissionState = function(json_state){
	var state = JSON.parse(json_state);
	var info_panel = global_simulation.results.info_panel;
	info_panel.time = state.time;
	info_panel.attitude.roll = state.roll;
	info_panel.attitude.pitch = state.pitch;
	info_panel.attitude.yaw = state.yaw;
	info_panel.velocity = state.velocity;
	info_panel.acceleration = state.acceleration;
	info_panel.orb_radius = state.orbit_radius;
	info_panel.mass = state.mass;
	info_panel.progress = state.progress;
	
	var spacecraft = global_simulation.results.spacecraft;
	spacecraft.attitude = new THREE.Quaternion(
		state.value_attitude.x,
		state.value_attitude.y,
		state.value_attitude.z,
		state.value_attitude.w
	);
	spacecraft.velocity = new THREE.Vector3(
		state.value_velocity[0],
		state.value_velocity[1],
		state.value_velocity[2]
	);
	spacecraft.acceleration = new THREE.Vector3(
		state.value_acceleration[0],
		state.value_acceleration[1],
		state.value_acceleration[2]
	);
	spacecraft.momentum = new THREE.Vector3(
		state.value_momentum[0],
		state.value_momentum[1],
		state.value_momentum[2]
	);
	spacecraft.sun_direction = new THREE.Vector3(
		state.value_sun[0],
		state.value_sun[1],
		state.value_sun[2]
	);
	spacecraft.earth_direction = new THREE.Vector3(
		state.value_earth[0],
		state.value_earth[1],
		state.value_earth[2]
	);
	
	var earth = global_simulation.results.earth;
	earth.earth_rotation = new THREE.Quaternion(
		state.value_earth_rotation.x,
		state.value_earth_rotation.y,
		state.value_earth_rotation.z,
		state.value_earth_rotation.w
	);
	earth.spacecraft_position = new THREE.Vector3(
		state.value_spacecraft[0],
		state.value_spacecraft[1],
		state.value_spacecraft[2]
	);
	earth.osculating_orbit.a = state.value_orbit_a;
	earth.osculating_orbit.e = state.value_orbit_e;
	earth.osculating_orbit.i = state.value_orbit_i;
	earth.osculating_orbit.w = state.value_orbit_w;
	earth.osculating_orbit.raan = state.value_orbit_raan;
	
	var map = global_simulation.results.map;
	map.sun_position.lat = state.sun_lat;
	map.sun_position.lon = state.sun_lon;
	map.station_areas = state.stations;
	map.fov.fov_type = state.fov_type;
	map.fov.closed = state.fov;
	map.fov.terminator = state.fov_terminator;
	map.solarTerminator = state.terminator;
	
	this.updateIndicators();
}

Simulator.prototype.alertEndOfSimulation = function(){
	alert("Mission ended");
}

Simulator.prototype.updateIndicators = function(){
	updateInfoPanel(false);
	this.indicators.CLOCK.innerHTML = global_simulation.results.info_panel.time;
	this.indicators.PROGRESS.value = global_simulation.results.info_panel.progress;
}

Simulator.prototype.updateSimulatorState = function(json_state){//Update GUI controls
	var state = JSON.parse(json_state);
	if(state.isConnected){
		if(state.isStopped){
			this.controls.PLAY.className = "SimControl SimPlay";
			this.controls.STOP.className = "SimControl SimStopDisabled";
			this.controls.PROGRESS.className = "SimProgressDisabled";
			this.controls.PROGRESS.value = 0;
		}else{ 
			if(state.isPlaying){
				this.controls.PLAY.className = "SimControl SimPause";
				this.controls.STOP.className = "SimControl SimStopEnabled";
				this.controls.PROGRESS.className = "SimProgressEnabled";
			}else{
				this.controls.PLAY.className = "SimControl SimPlay";
				this.controls.STOP.className = "SimControl SimStopEnabled";
				this.controls.PROGRESS.className = "SimProgressEnabled";
			}
		}
	}else{
		//TODO
	}
	if(state.isForward){
		this.controls.FORWARD.className = "SimControlRight active";
		this.controls.REVERSE.className = "SimControlLeft";
	}else{
		this.controls.REVERSE.className = "SimControlLeft active";
		this.controls.FORWARD.className = "SimControlRight";
	}
	this.controls.PROGRESS.value = state.progress;
}
