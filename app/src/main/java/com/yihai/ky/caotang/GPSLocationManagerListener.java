package com.yihai.ky.caotang;

import android.location.Location;

/**
 * Created by ky on 1/11/2018.
 */

public interface GPSLocationManagerListener {

  void onReceiveLocation(Location location, float azimuth);
}
