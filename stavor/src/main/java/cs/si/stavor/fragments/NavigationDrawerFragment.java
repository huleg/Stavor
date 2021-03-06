package cs.si.stavor.fragments;

import cs.si.stavor.R;
import cs.si.stavor.app.Parameters;
import android.support.v7.app.ActionBarActivity;
import android.app.Activity;
import android.support.v7.app.ActionBar;
import android.support.v4.app.Fragment;
import android.support.v4.app.ActionBarDrawerToggle;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.RelativeLayout;
import android.widget.TextView;

/**
 * Fragment to show the navigation menu
 * @author Xavier Gibert
 *
 */
public class NavigationDrawerFragment extends Fragment {

    /**
     * Remember the position of the selected item.
     */
    private static final String STATE_SELECTED_POSITION = "selected_navigation_drawer_position";

    /**
     * Per the design guidelines, you should show the drawer on launch until the user manually
     * expands it. This shared preference tracks this.
     */
    private static final String PREF_USER_LEARNED_DRAWER = "navigation_drawer_learned";

    /**
     * A pointer to the current callbacks instance (the Activity).
     */
    private NavigationDrawerCallbacks mCallbacks;

    /**
     * Helper component that ties the action bar to the navigation drawer.
     */
    private ActionBarDrawerToggle mDrawerToggle;

    private DrawerLayout mDrawerLayout;
    private ListView mDrawerListView;
    private View mFragmentContainerView;

    private int mCurrentSelectedPosition = 0;
    private boolean mFromSavedInstanceState;
    private boolean mUserLearnedDrawer;

    public NavigationDrawerFragment() {
    }
    
    public int getSelectedPosition(){
    	return mCurrentSelectedPosition;
    }
	

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setRetainInstance(true);
        // Read in the flag indicating whether or not the user has demonstrated awareness of the
        // drawer. See PREF_USER_LEARNED_DRAWER for details.
        SharedPreferences sp = PreferenceManager.getDefaultSharedPreferences(getActivity());
        mUserLearnedDrawer = sp.getBoolean(PREF_USER_LEARNED_DRAWER, Parameters.App.first_start_app_closed_section_menu);

        if (savedInstanceState != null) {
            mCurrentSelectedPosition = savedInstanceState.getInt(STATE_SELECTED_POSITION);
            mFromSavedInstanceState = true;
        }

        // Select either the default item (0) or the last selected item.
        selectItem(mCurrentSelectedPosition);
        
    }

    @Override
    public void onActivityCreated (Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        // Indicate that this fragment would like to influence the set of actions in the action bar.
        setHasOptionsMenu(true);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
            Bundle savedInstanceState) {
        mDrawerListView = (ListView) inflater.inflate(
                R.layout.fragment_navigation_drawer, container, false);
        mDrawerListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                selectItem(position);
            }
        });
        final String[] sections;
        if(Parameters.App.show_tests_section){
        	sections = new String[]{
                    getString(R.string.title_section1),
                    getString(R.string.title_section2),
                    getString(R.string.title_section3),
                    getString(R.string.title_section4),
                    getString(R.string.title_section5),
                    getString(R.string.title_section6),
                    getString(R.string.title_section7),
                    getString(R.string.title_section8),
                    getString(R.string.title_section9),
                    getString(R.string.title_section10),
                    getString(R.string.title_section11),
                    getString(R.string.title_section12),
                    getString(R.string.title_section13),
                    getString(R.string.title_section14),
                };
        }else{
        	sections = new String[]{
                    getString(R.string.title_section1),
                    getString(R.string.title_section2),
                    getString(R.string.title_section3),
                    getString(R.string.title_section4),
                    getString(R.string.title_section5),
                    getString(R.string.title_section6),
                    getString(R.string.title_section7),
                    getString(R.string.title_section8),
                    getString(R.string.title_section9),
                    getString(R.string.title_section10),
                    getString(R.string.title_section11),
                    getString(R.string.title_section12),
                    getString(R.string.title_section13),
                };
        }
        
        mDrawerListView.setAdapter(new ArrayAdapter<String>(
                getActionBar().getThemedContext(),
                R.layout.nav_item,
                R.id.nav_item_text,
                sections){
        	@Override
        	public View getView(int position, View convertView, ViewGroup parent)
        	{
        		LayoutInflater inflater = (LayoutInflater) getContext().getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        		View rowView;
        		boolean first_level = (position==0 ||
        				position==1 ||
        				position==6 ||
        				position==8 ||
        				position==12 ||
        				position==13);
        		if(first_level){
        			rowView = inflater.inflate(R.layout.nav_item, parent, false);
        		}else{
        			rowView = inflater.inflate(R.layout.nav_item2, parent, false);
        		}
        	    
        	    RelativeLayout layout = (RelativeLayout) rowView.findViewById(R.id.nav_item_layout);
        	    TextView textView = (TextView) rowView.findViewById(R.id.nav_item_text);
        	    ImageView iconView = (ImageView) rowView.findViewById(R.id.nav_item_icon);
        	    textView.setText(sections[position]);
        	    
        	    if (position == mCurrentSelectedPosition) 
        	    { 
        	    	switch(position){
		        	    case 0:
		        	    	iconView.setImageResource(R.drawable.simulator_s);
		        	    	break;
		        	    case 1:
		        	    	iconView.setImageResource(R.drawable.attitude_s);
		        	    	break;
		        	    case 2:
		        	    	iconView.setImageResource(R.drawable.indicators_s);
		        	    	break;
		        	    case 3:
		        	    	iconView.setImageResource(R.drawable.indicators_s);
		        	    	break;
		        	    case 4:
		        	    	iconView.setImageResource(R.drawable.measures_s);
		        	    	break;
		        	    case 5:
		        	    	iconView.setImageResource(R.drawable.model_s);
		        	    	break;
		        	    case 6:
		        	    	iconView.setImageResource(R.drawable.orbit_s);
		        	    	break;
		        	    case 7:
		        	    	iconView.setImageResource(R.drawable.model_s);
		        	    	break;
		        	    case 8:
		        	    	iconView.setImageResource(R.drawable.map_s);
		        	    	break;
		        	    case 9:
		        	    	iconView.setImageResource(R.drawable.fov_s);
		        	    	break;
		        	    case 10:
		        	    	iconView.setImageResource(R.drawable.station_s);
		        	    	break;
		        	    case 11:
		        	    	iconView.setImageResource(R.drawable.model_s);
		        	    	break;
		        	    case 12:
		        	    	iconView.setImageResource(R.drawable.preferences_s);
		        	    	break;
		        	    case 13:
		        	    	iconView.setImageResource(R.drawable.test_s);
		        	    	break;
	        	    }
        	    	if(first_level){
        	    		layout.setBackgroundResource(R.drawable.navigation_selector);
            		}else{
            			layout.setBackgroundResource(R.drawable.navigation_selector2);
            		}
        	    }else{
        	    	switch(position){
		        	    case 0:
		        	    	iconView.setImageResource(R.drawable.simulator);
		        	    	break;
		        	    case 1:
		        	    	iconView.setImageResource(R.drawable.attitude);
		        	    	break;
		        	    case 2:
		        	    	iconView.setImageResource(R.drawable.indicators);
		        	    	break;
		        	    case 3:
		        	    	iconView.setImageResource(R.drawable.indicators);
		        	    	break;
		        	    case 4:
		        	    	iconView.setImageResource(R.drawable.measures);
		        	    	break;
		        	    case 5:
		        	    	iconView.setImageResource(R.drawable.model);
		        	    	break;
		        	    case 6:
		        	    	iconView.setImageResource(R.drawable.orbit);
		        	    	break;
		        	    case 7:
		        	    	iconView.setImageResource(R.drawable.model);
		        	    	break;
		        	    case 8:
		        	    	iconView.setImageResource(R.drawable.map);
		        	    	break;
		        	    case 9:
		        	    	iconView.setImageResource(R.drawable.fov);
		        	    	break;
		        	    case 10:
		        	    	iconView.setImageResource(R.drawable.station);
		        	    	break;
		        	    case 11:
		        	    	iconView.setImageResource(R.drawable.model);
		        	    	break;
		        	    case 12:
		        	    	iconView.setImageResource(R.drawable.preferences);
		        	    	break;
		        	    case 13:
		        	    	iconView.setImageResource(R.drawable.test);
		        	    	break;
	        	    }
        	    	if(first_level){
        	    		layout.setBackgroundResource(R.drawable.navigation_section);
            		}else{
            			layout.setBackgroundResource(R.drawable.navigation_section2);
            		}
        	    }
        	    return rowView;
        	}
        });
        mDrawerListView.setItemChecked(mCurrentSelectedPosition, true);
        return mDrawerListView;
    }
    
    
    public boolean isDrawerOpen() {
        return mDrawerLayout != null && mDrawerLayout.isDrawerOpen(mFragmentContainerView);
    }

    /**
     * Users of this fragment must call this method to set up the navigation drawer interactions.
     *
     * @param fragmentId   The android:id of this fragment in its activity's layout.
     * @param drawerLayout The DrawerLayout containing this fragment's UI.
     */
    public void setUp(int fragmentId, DrawerLayout drawerLayout) {
        mFragmentContainerView = getActivity().findViewById(fragmentId);
        mDrawerLayout = drawerLayout;

        // set a custom shadow that overlays the main content when the drawer opens
        mDrawerLayout.setDrawerShadow(R.drawable.drawer_shadow, GravityCompat.START);
        // set up the drawer's list view with items and click listener

        ActionBar actionBar = getActionBar();
        actionBar.setDisplayHomeAsUpEnabled(true);
        actionBar.setHomeButtonEnabled(true);

        // ActionBarDrawerToggle ties together the the proper interactions
        // between the navigation drawer and the action bar app icon.
        mDrawerToggle = new ActionBarDrawerToggle(
                getActivity(),                    /* host Activity */
                mDrawerLayout,                    /* DrawerLayout object */
                R.drawable.ic_drawer,             /* nav drawer image to replace 'Up' caret */
                R.string.navigation_drawer_open,  /* "open drawer" description for accessibility */
                R.string.navigation_drawer_close  /* "close drawer" description for accessibility */
        ) {
            @Override
            public void onDrawerClosed(View drawerView) {
                super.onDrawerClosed(drawerView);
                if (!isAdded()) {
                    return;
                }

                getActivity().supportInvalidateOptionsMenu(); // calls onPrepareOptionsMenu()
            }

            @Override
            public void onDrawerOpened(View drawerView) {
                super.onDrawerOpened(drawerView);
                if (!isAdded()) {
                    return;
                }

                if (!mUserLearnedDrawer) {
                    // The user manually opened the drawer; store this flag to prevent auto-showing
                    // the navigation drawer automatically in the future.
                    mUserLearnedDrawer = true;
                    SharedPreferences sp = PreferenceManager
                            .getDefaultSharedPreferences(getActivity());
                    sp.edit().putBoolean(PREF_USER_LEARNED_DRAWER, true).apply();
                }

                getActivity().supportInvalidateOptionsMenu(); // calls onPrepareOptionsMenu()
            }
        };

        // If the user hasn't 'learned' about the drawer, open it to introduce them to the drawer,
        // per the navigation drawer design guidelines.
        if (!mUserLearnedDrawer && !mFromSavedInstanceState) {
            mDrawerLayout.openDrawer(mFragmentContainerView);
        }

        // Defer code dependent on restoration of previous instance state.
        mDrawerLayout.post(new Runnable() {
            @Override
            public void run() {
                mDrawerToggle.syncState();
            }
        });

        mDrawerLayout.setDrawerListener(mDrawerToggle);
    }
    
    /**
     * Select a different section
     * @param position
     */
    public void select(int position){
    	selectItem(position);
    }

    private void selectItem(int position) {
        mCurrentSelectedPosition = position;
        if (mDrawerListView != null) {
            mDrawerListView.setItemChecked(position, true);
        }            
        if (mDrawerLayout != null) {
            mDrawerLayout.closeDrawer(mFragmentContainerView);
        }
        if (mCallbacks != null) {
            mCallbacks.onNavigationDrawerItemSelected(position);
        }
    }

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);
        try {
            mCallbacks = (NavigationDrawerCallbacks) activity;
        } catch (ClassCastException e) {
            throw new ClassCastException("Activity must implement NavigationDrawerCallbacks.");
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mCallbacks = null;
    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        outState.putInt(STATE_SELECTED_POSITION, mCurrentSelectedPosition);
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        // Forward the new configuration the drawer toggle component.
        mDrawerToggle.onConfigurationChanged(newConfig);
    }

    @Override
    public void onCreateOptionsMenu(Menu menu, MenuInflater inflater) {
        // If the drawer is open, show the global app actions in the action bar. See also
        // showGlobalContextActionBar, which controls the top-left area of the action bar.
        if (mDrawerLayout != null && isDrawerOpen()) {
            inflater.inflate(R.menu.global, menu);
            showGlobalContextActionBar();
        }
        super.onCreateOptionsMenu(menu, inflater);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (mDrawerToggle.onOptionsItemSelected(item)) {
            return true;
        }
        /*if (item.getItemId() == R.id.action_screenshot) {
        	((MainActivity)getActivity()).showAbout();
        }*/
        return super.onOptionsItemSelected(item);
    }

    /**
     * Per the navigation drawer design guidelines, updates the action bar to show the global app
     * 'context', rather than just what's in the current screen.
     */
    private void showGlobalContextActionBar() {
        ActionBar actionBar = getActionBar();
        actionBar.setDisplayShowTitleEnabled(true);
        actionBar.setNavigationMode(ActionBar.NAVIGATION_MODE_STANDARD);
        actionBar.setTitle(R.string.app_name);
    }

    private ActionBar getActionBar() {
        return ((ActionBarActivity) getActivity()).getSupportActionBar();
    }

    /**
     * Callbacks interface that all activities using this fragment must implement.
     */
    public static interface NavigationDrawerCallbacks {
        /**
         * Called when an item in the navigation drawer is selected.
         */
        void onNavigationDrawerItemSelected(int position);
    }

}
