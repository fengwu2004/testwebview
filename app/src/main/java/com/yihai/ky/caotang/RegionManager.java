package com.yihai.ky.caotang;

import android.content.Context;
import android.os.RemoteException;
import android.provider.Settings;
import android.util.Log;

import com.aprilbrother.aprilbrothersdk.Beacon;
import com.aprilbrother.aprilbrothersdk.BeaconManager;
import com.aprilbrother.aprilbrothersdk.BeaconManager.RangingListener;
import com.aprilbrother.aprilbrothersdk.Region;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by ky on 1/11/2018.
 */

public class RegionManager {
  Context context;
  private static final Region ALL_BEACONS_REGION = new Region(
      "customRegionName", null, null, null);

  private RegionManagerListener _listener;

  private BeaconManager beaconManager;

  private MuseumLocator _locator = new MuseumLocator();

  private Map<Integer, String> _regionNames;

  private int currentArea = 0;

  private String _phoneUUID;

  RegionManager(Context context){

    this.context=context;

    String androidId = Settings.System.getString(context.getContentResolver(), Settings.System.ANDROID_ID);

    Log.i("id", androidId);

    _phoneUUID = "dfct-" + androidId;
  }

  private void initRegionNames() {

    _regionNames = new HashMap<>();

    _regionNames.put(0,"室外");
    _regionNames.put(1,"围栏报警");
    _regionNames.put(2,"北门");
    _regionNames.put(3,"唐代遗址");
    _regionNames.put(4,"唐亭台遗址");
    _regionNames.put(4,"唐亭台遗址");
    _regionNames.put(5,"茅屋故居大门");
    _regionNames.put(6,"茅屋故居小门");
    _regionNames.put(7,"茅草屋");
    _regionNames.put(8,"茅屋房间1");
    _regionNames.put(9,"茅屋房间2");
    _regionNames.put(10,"茅屋房间3");
    _regionNames.put(11,"茅屋房间4");
    _regionNames.put(12,"茅屋房间5");
    _regionNames.put(13,"少陵碑亭");
    _regionNames.put(14,"工部祠");
    _regionNames.put(15,"恰受航轩");
    _regionNames.put(16,"柴门");
    _regionNames.put(17,"诗史堂");
    _regionNames.put(18,"草堂留后世");
    _regionNames.put(19,"大廨");
    _regionNames.put(20,"诗圣著千秋");
    _regionNames.put(21,"正门");
    _regionNames.put(22,"花径");
    _regionNames.put(23,"浣花祠");
    _regionNames.put(24,"盆景园");
    _regionNames.put(25,"隐壁");
    _regionNames.put(26,"大雅堂");
    _regionNames.put(27,"情系草堂陈列室");
    _regionNames.put(28,"南门");
    _regionNames.put(29,"万佛楼");
    _regionNames.put(30,"杜甫千试碑");
    _regionNames.put(31,"杜甫千诗碑触发二维码");
  }

  public void setRegionListener(RegionManagerListener listener) {

    _listener = listener;
  }

  private void onLocateResult(int regionId) {

    if (regionId != -1) {

      if (regionId == 0) {

        _listener.onLeaveRegion(regionId, _regionNames.get(currentArea));
      }
      else if (regionId == 7) {

        _listener.onLeaveRegion(regionId, _regionNames.get(regionId));
      }
      else {

        _listener.onEnterRegion(regionId, _regionNames.get(regionId));
      }

      currentArea = regionId;
    }
  }

  private String getBeacons(List<Beacon> beacons) {

    final JSONObject jsonobj = new JSONObject();

    try {
      JSONArray jsonbeacons = new JSONArray();

      for (Beacon item: beacons) {

        JSONObject beacon = new JSONObject();

        beacon.put("mac", item.getMajor() + ":" + item.getMinor());

        beacon.put("rss", item.getRssi());

        beacon.put("distance", item.getDistance());

        jsonbeacons.put(beacon);
      }

      jsonobj.put("phoneUUID", _phoneUUID);

      jsonobj.put("regionId", "14671790606720222");

      jsonobj.put("floorId", "15154051085753186");

      jsonobj.put("seriesNumber", 1);

      jsonobj.put("deltaX", 0);

      jsonobj.put("deltaY", 0);

      jsonobj.put("beacons", jsonbeacons);
    }
    catch (JSONException e) {

      return "";
    }

    return jsonobj.toString();
  }

  public void start() {

    initRegionNames();

    beaconManager = new BeaconManager(context);

    beaconManager.setRangingExpirationMill(3);

    beaconManager.setRangingListener(new RangingListener() {

      @Override
      public void onBeaconsDiscovered(Region region, List<Beacon> beacons) {

        if (beacons.size() <= 0) {

          return;
        }

        int regionId = _locator.getPosition(beacons);

        onLocateResult(regionId);
      }
    });
    connectToService();
  }

  public void connectToService() {

    beaconManager.connect(new BeaconManager.ServiceReadyCallback() {

      @Override
      public void onServiceReady() {

        try {

          beaconManager.startRanging(ALL_BEACONS_REGION);

        } catch (RemoteException e) {

          e.printStackTrace();
        }
      }
    });
  }

  public void stop(){

    try {

      beaconManager.stopRanging(ALL_BEACONS_REGION);

      beaconManager.disconnect();

    } catch (RemoteException e) {

    }
  }
}