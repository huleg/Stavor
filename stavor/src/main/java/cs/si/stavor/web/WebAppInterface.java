package cs.si.stavor.web;

import cs.si.stavor.R;
import cs.si.stavor.StavorApplication;
import cs.si.stavor.MainActivity;
import cs.si.stavor.fragments.HudFragment;
import cs.si.stavor.fragments.OrbitFragment;
import cs.si.stavor.model.ModelSimulation;
import android.app.Activity;
import android.widget.Toast;







//import org.chromium.content.browser.JavascriptInterface;
import org.xwalk.core.JavascriptInterface;

/**
 * JavaScript-to-Android bridge functions
 * @author Xavier Gibert
 *
 */
public final class WebAppInterface {
    Activity activity;
    private ModelSimulation sim;

    /** Instantiate the interface and set the context */
    public WebAppInterface(Activity a, ModelSimulation s) {
        activity = a;
        sim = s;
    }


    /** store new map zoom */
    @JavascriptInterface
    public void storeNewZoom(int zoom) {
        ((StavorApplication)activity.getApplication()).zoom = zoom;
    }
    
    @JavascriptInterface
    public void updateMapCenter(float lon, float lat) {
        ((StavorApplication)activity.getApplication()).lon = lon;
        ((StavorApplication)activity.getApplication()).lat = lat;
    }

    /** Show a toast from the web page */
    @JavascriptInterface
    public void showToast(String toast) {
        Toast.makeText(activity.getApplicationContext(), toast, Toast.LENGTH_LONG).show();
    }
    
    /** Set loading progress (0-100) from the web page */
    @JavascriptInterface
    public void setProgress(final int progress) {
    	if(progress==100)
    		((MainActivity)activity).getSimulator().setBrowserLoaded(true);
    	activity.runOnUiThread( new Runnable() {
	        public void run() {
	        	((MainActivity)activity).setBrowserProgressValue(progress * 100);
            	//activity.setProgress(progress * 100);
	        }
	    });
    }
    
    /** Set loading progress (0-100) from the web page */
    @JavascriptInterface
    public void setProgressOrbit(final int progress) {
    	if(progress==100)
    		((MainActivity)activity).getSimulator().setBrowserLoaded(true);
    	activity.runOnUiThread( new Runnable() {
	        public void run() {
	        	((MainActivity)activity).setBrowserProgressValueOrbit(progress * 100);
            	//activity.setProgress(progress * 100);
	        }
	    });
    }

    /** Set loading progress (0-100) from the web page */
    @JavascriptInterface
    public void setProgressMap(final int progress) {
    	if(progress==100)
    		((MainActivity)activity).getSimulator().setBrowserLoaded(true);
    	activity.runOnUiThread( new Runnable() {
	        public void run() {
	        	((MainActivity)activity).setBrowserProgressValueMap(progress * 100);
            	//activity.setProgress(progress * 100);
	        }
	    });
    }
    
    /** Update the stats of the web page */
    @JavascriptInterface
    public void updateFPS(final String stats) {
    	activity.runOnUiThread( new Runnable() {
	        public void run() {
	        	try{
	        		((HudFragment)activity.getFragmentManager().findFragmentById(R.id.container)).updateFPS(stats);
	        	}catch(Exception e){
	        		
	        	}
	        	try{
	        		((OrbitFragment)activity.getFragmentManager().findFragmentById(R.id.container)).updateFPS(stats);
	        	}catch(Exception e){
	        		
	        	}
	        }
	    });
    }
    
    /** get orbit model initialization */
    @JavascriptInterface
    public String getInitializationOrbitJSON() {
        return sim.getInitializationOrbitJSON();
    }

    /** get orbit model initialization */
    @JavascriptInterface
    public String getInitializationMapJSON() {
        return sim.getInitializationMapJSON();
    }
    
    /** get model initialization */
    @JavascriptInterface
    public String getInitializationJSON() {
        return sim.getInitializationJSON();
    }
    
    /** get model state */
    /*@JavascriptInterface
    public String getStateJSON() {
        return sim.getStateJSON();
    }*/

	public void reconstruct(Activity act,
			ModelSimulation s) {
		activity = act;
        sim = s;
	}
    
    
}