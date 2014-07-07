function setLoadingProgress(progress) {// from 0 to 100 
	if (typeof Android != "undefined"){ // check the bridge 
		  if (Android.setProgressMap!= "undefined") { // check the method
			 Android.setProgressMap(progress);
		  }
   	}
}
function reloadModel(){
	//clearPath();
	setLoadingProgress(100);
}
function setLoaded() {// from 0 to 100 
	if (typeof Android != "undefined"){ // check the bridge 
		  if (Android.setProgressMap!= "undefined") { // check the method
			 Android.setProgressMap(100);
		  }
   	}
}
function updateModelState(new_state){
	var state = JSON.parse(new_state);
	addPoints(new_state);
}
function showAndroidToast(toast) {
	if (typeof Android != "undefined"){ // check the bridge 
		  if (Android.showToast!= "undefined") { // check the method
			 Android.showToast(toast);
		  }
   	}
}
