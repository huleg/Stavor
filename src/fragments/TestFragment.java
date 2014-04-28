package fragments;

import java.io.Serializable;

import org.xwalk.core.XWalkSettings;
import org.xwalk.core.XWalkView;

import web.WebAppInterface;
import model.ModelSimulation;
import cs.si.satatt.MainActivity;
import cs.si.satatt.Parameters;
import cs.si.satatt.R;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.Toast;

/**
 * A test fragment containing a web view.
 */
public final class TestFragment extends Fragment {
	/**
	 * The fragment argument representing the section number for this
	 * fragment.
	 */
	private static final String ARG_SECTION_NUMBER = "section_number";

	/**
	 * Returns a new instance of this fragment for the given section number.
	 * @param simulation 
	 */
	public static TestFragment newInstance(int sectionNumber) {	
		TestFragment fragment = new TestFragment();
		Bundle args = new Bundle();
		args.putInt(ARG_SECTION_NUMBER, sectionNumber);
		fragment.setArguments(args);
		return fragment;
	}

	public TestFragment() {
	}
	
	XWalkView browser;

	@SuppressLint({ "JavascriptInterface", "SetJavaScriptEnabled", "NewApi" })
	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {
		View rootView = inflater.inflate(R.layout.test, container,
				false);
		
		Button button1 = ((Button) rootView.findViewById(R.id.buttonTest1));
		button1.setOnClickListener(new View.OnClickListener() {
		   @Override
		   public void onClick(View v) {
			   // button 1 was clicked!
			   browser.loadUrl(Parameters.Web.TEST_PAGE_1);
		   }
		  });
		Button button2 = ((Button) rootView.findViewById(R.id.buttonTest2));
		button2.setOnClickListener(new View.OnClickListener() {
		   @Override
		   public void onClick(View v) {
			   // button 1 was clicked!
			   browser.loadUrl(Parameters.Web.TEST_PAGE_2);
		   }
		  });
		Button button3 = ((Button) rootView.findViewById(R.id.buttonTest3));
		button3.setOnClickListener(new View.OnClickListener() {
		   @Override
		   public void onClick(View v) {
			   // button 1 was clicked!
			   browser.loadUrl(Parameters.Web.TEST_PAGE_3);
		   }
		  });
		
		
		
		//XWalkView browser = (XWalkView) rootView.findViewById(R.id.xbrowser);
		browser = new XWalkView(this.getActivity().getApplicationContext(), this.getActivity());
		
    	XWalkSettings browserSettings = browser.getSettings();
    	
    	browserSettings.setJavaScriptEnabled(true);
    	browserSettings.setUseWideViewPort(false);
    	//browserSettings.setLoadWithOverviewMode(true);
    	browserSettings.setAllowFileAccessFromFileURLs(true); //Maybe you don't need this rule
    	browserSettings.setAllowUniversalAccessFromFileURLs(true);
    	//browserSettings.setBuiltInZoomControls(true);
    	//browserSettings.setDisplayZoomControls(true);
    	//browserSettings.setSupportZoom(true);
    	
    	browser.clearCache(true);
    	
      	/*browser.setXWalkWebChromeClient(new org.xwalk.core.client.XWalkDefaultWebChromeClient(rootView.getContext(), browser) {
      		public void onProgressChanged(WebView view, int progress) {
      			// Activities and WebViews measure progress with different scales.
      			// The progress meter will automatically disappear when we reach 100%
      			getActivity().setProgress(progress * 100);
      		}
      	});
      	browser.setXWalkClient(new org.xwalk.core.client.XWalkDefaultClient(rootView.getContext(), browser) {
      		public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
      			Toast.makeText(getActivity(), "Oh no! " + description, Toast.LENGTH_LONG).show();
      		}
      	});
    	
    	browser.addJavascriptInterface(new webclient.UAJscriptHandler(null), "unlockingandroid");
    	browser.addJavascriptInterface(new UANOOP() {}, "unlockingandroid");
    	browser.addJavascriptInterface(null, "unlockingandroid");
    	*/
    	//browser.addJavascriptInterface(new WebAppInterface(getActivity(), sim), "Android");
    	LinearLayout commentsLayout=(LinearLayout)rootView.findViewById(R.id.commentsLayout);
    	commentsLayout.addView(browser);
    	
    	browser.loadUrl(Parameters.Web.TEST_PAGE_1);
		
		/*TextView textView = (TextView) rootView
				.findViewById(R.id.section_label);
		textView.setText(Integer.toString(getArguments().getInt(
				ARG_SECTION_NUMBER)));*/
		return rootView;
	}
    
    private class UANOOP {
    }

	@Override
	public void onAttach(Activity activity) {
		super.onAttach(activity);
		((MainActivity) activity).onSectionAttached(getArguments().getInt(
				ARG_SECTION_NUMBER));
	}
}