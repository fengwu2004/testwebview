package com.yihai.ky.caotang;

/**
 * Created by ky on 1/11/2018.
 */

public interface RegionManagerListener {

  void onEnterRegion(int regionId, String name);

  void onLeaveRegion(int regionId, String name);
}
