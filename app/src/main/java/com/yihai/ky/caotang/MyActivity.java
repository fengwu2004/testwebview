package com.yihai.ky.caotang;

import android.bluetooth.BluetoothAdapter;
import android.content.ComponentName;
import android.content.Context;
import android.location.Location;
import android.location.LocationManager;
import android.os.Build;
import android.provider.Settings;
import android.telephony.TelephonyManager;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.widget.Button;
import android.widget.Toast;

import com.huawei.android.app.admin.HwDevicePolicyManager;
import com.unity3d.player.UnityPlayer;
import com.unity3d.player.UnityPlayerActivity;
import com.yihai.ky.caotang.R;

import org.json.JSONObject;

import java.lang.reflect.Method;
import java.util.ConcurrentModificationException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Created by Administrator on 2018/1/29 0029.
 */

public class MyActivity implements RegionManagerListener, GPSLocationManagerListener {

  private ViewGroup rootView;

  private X5WebView mapview;

  private Context context;

  private GPSLocationManager _gpslocationmananger;//gps定位

  private RegionManager _regionManager;//区域触发

  private Set<Integer> _enteredRegions = new HashSet<>();

  private HwDevicePolicyManager _hwDevicePolicyManager = new HwDevicePolicyManager();

  public void InitNativeData(Context context) {

    _gpslocationmananger = new GPSLocationManager();

    UnityPlayer.UnitySendMessage("NativeCtrl","Receiver"," _gpslocationmananger = new GPSLocationManager();");

    _gpslocationmananger.setListener(this);

    UnityPlayer.UnitySendMessage("NativeCtrl","Receiver","_gpslocationmananger.setListener(this);");

    _regionManager = new RegionManager(context);

    UnityPlayer.UnitySendMessage("NativeCtrl","Receiver","_regionManager = new RegionManager(context);");

    _regionManager.setRegionListener(this);

    UnityPlayer.UnitySendMessage("NativeCtrl","Receiver"," _regionManager.setRegionListener(this);");

    try{

      _gpslocationmananger.initLocation(context);
    }
    catch (Exception e){

      UnityPlayer.UnitySendMessage("NativeCtrl","Receiver","03_"+"GPSFromNative接收异常");
    }

    UnityPlayer.UnitySendMessage("NativeCtrl","Receiver","_regionManager.start();开始前");

    _regionManager.start();

    UnityPlayer.UnitySendMessage("NativeCtrl","Receiver","_regionManager.start();");
  }

  @Override
  public void onEnterRegion(int regionId, String name) {

    _enteredRegions.add(regionId);

    enterRegion(regionId);

    UnityPlayer.UnitySendMessage("NativeCtrl","Receiver","00_"+ String.valueOf(regionId));
  }

  private void enterRegion(int regionId) {

    mapview.loadUrl("javascript:enterRegion('" + String.valueOf(regionId) + "')");
  }

  @Override
  public void onLeaveRegion(int regionId, String name) {
    UnityPlayer.UnitySendMessage("NativeCtrl","Receiver","01_"+ String.valueOf(regionId));
  }

  private void createMap(final Context context) {

    rootView = (ViewGroup)((UnityPlayerActivity)context).getWindow().getDecorView().getRootView();

    mapview = new X5WebView(context);

    mapview.getSettings().setJavaScriptEnabled(true);

    mapview.getSettings().setAllowFileAccessFromFileURLs(true);

    mapview.setWebViewClient(new com.tencent.smtt.sdk.WebViewClient() {

      @Override
      public boolean shouldOverrideUrlLoading(com.tencent.smtt.sdk.WebView var1, String var2) {

        mapview.loadUrl(var2);

        return true;
      }
    });

    mapview.setLayoutParams(new ViewGroup.MarginLayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

    mapview.loadUrl("file:///android_asset/webapp/index.html");

    rootView.addView(mapview);

    mapview.setVisibility(View.INVISIBLE);

    mapview.addJavascriptInterface(this, "android");
  }

  @JavascriptInterface
  public void backbuttonclick() {

    ((UnityPlayerActivity)context).runOnUiThread(new Runnable() {
      @Override
      public void run() {

        mapview.setVisibility(View.INVISIBLE);

        rootView.requestLayout();
      }
    });
  }

  public void initMap(Context context) {

    this.context = context;

    createMap(context);

    InitNativeData(context);
  }

  public void showMap(boolean show, Context context){

    if (!show) {

      if (mapview != null) {

        mapview.setVisibility(View.INVISIBLE);
      }

      return;
    }

    if (mapview != null) {

      mapview.setVisibility(View.VISIBLE);

      rootView.requestLayout();

      return;
    }

    initMap(context);
  }

  public void setMapNaviTrace() {

    mapview.loadUrl("javascript:setNaviTrace()");
  }

  @Override
  public void onReceiveLocation(Location location, float azimuth) {

    Map<String, Double> values = new HashMap<>();

    if (location != null) {

      values.put("latitude", location.getLatitude());

      values.put("longitude", location.getLongitude());
    }

    values.put("azimuth", (double) azimuth);

    JSONObject jsonObject = new JSONObject(values);

    String str = jsonObject.toString();

    mapview.loadUrl("javascript:setGpsPos('" + str + "')");

//    //传递坐标信息给unity
//    UnityPlayer.UnitySendMessage("NativeCtrl","Receiver","02_Longitude"+String.valueOf(location.getLongitude()));
//    UnityPlayer.UnitySendMessage("NativeCtrl","Receiver","02_Latitude"+String.valueOf(location.getLatitude()));
//    UnityPlayer.UnitySendMessage("NativeCtrl","Receiver","02_Altitude"+String.valueOf(location.getAltitude()));
//    //传递gps给unity，让unity来传递给uniweb
//    UnityPlayer.UnitySendMessage("NativeCtrl","Receiver","02_setGpsPos"+str);
  }

  //**************************测试******打开蓝牙*******************************************//
  //当前 Android 设备的 bluetooth 是否已经开启
  public  boolean getBluetoothState() {
    BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
    if (bluetoothAdapter != null)
    {
      return bluetoothAdapter.isEnabled();
    }
    return false;
  }
  //强制开启当前 Android 设备的 Bluetooth
  public  boolean turnOnBluetooth()
  {
    BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
    if (bluetoothAdapter != null)
    {
      return bluetoothAdapter.enable();
    }
    return false;
  }
  //***********************测试*************GPS*************************************************//

  //判断gps是否处于打开状态
  public boolean getGPSState(Context context) {
    if (Build.VERSION.SDK_INT <19) {
      LocationManager myLocationManager = (LocationManager)context.getSystemService(Context.LOCATION_SERVICE);
      return myLocationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
    }else{
      int state = Settings.Secure.getInt(context.getContentResolver(), Settings.Secure.LOCATION_MODE, Settings.Secure.LOCATION_MODE_OFF);
      if(state== Settings.Secure.LOCATION_MODE_OFF){
        return false;
      }else{
        return true;
      }
    }
  }

  //******************测试*******数据流量****************************//
  //获取当前移动数据流量状态
  public boolean getMobileDataState(Context context) {
    TelephonyManager telephonyService = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
    try {
      Method getDataEnabled = telephonyService.getClass().getDeclaredMethod("getDataEnabled");
      if (null != getDataEnabled) {
        return (Boolean) getDataEnabled.invoke(telephonyService);
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
    return false;
  }


   /* *********            平板权限                           ********/

  //显示/隐藏Home按键
  public void setHomeButtonDisabled(Context context, boolean bool){
    _hwDevicePolicyManager.setHomeButtonDisabled(new ComponentName(context,this.getClass()),bool);
  }
  //禁用/启用电源键
  public void setPowerKeyDisabled(Context context, boolean bool){
    _hwDevicePolicyManager.setPowerKeyDisabled(new ComponentName(context,this.getClass()),bool);
  }
  //禁用/启用返回键
  public void setBackButtonDisabled(Context context, boolean bool){
    _hwDevicePolicyManager.setBackButtonDisabled(new ComponentName(context,this.getClass()),bool);
  }
  //禁用/启用任务键
  public void setRecentTaskButtonDisabled(Context context, boolean bool){
    _hwDevicePolicyManager.setRecentTaskButtonDisabled(new ComponentName(context,this.getClass()),bool);
  }
  //禁用/启用恢复出厂设置（包括Recovery模式）
  public void setFactoryReset(Context context, boolean bool){
    _hwDevicePolicyManager.setFactoryReset(new ComponentName(context,this.getClass()),bool);
  }
  //设置第三方launcher为默认launcher
  public void setCustomLauncher(Context context, String packageName, String className){
    _hwDevicePolicyManager.setCustomLauncher(new ComponentName(context,this.getClass()),packageName,className);
  }
  //清除已设置的第三方默认launcher
  public void clearCustomLauncher(Context context){
    _hwDevicePolicyManager.clearCustomLauncher(new ComponentName(context,this.getClass()));
  }
  //禁用/启用蓝牙
  public void setBluetoothDisabled(Context context, boolean bool){
    _hwDevicePolicyManager.setBluetoothDisabled(new ComponentName(context,this.getClass()),bool);
  }
  //禁用/启用wifi
  public void setWifiDisabled(Context context, boolean bool){
    _hwDevicePolicyManager.setWifiDisabled(new ComponentName(context,this.getClass()),bool);
  }
  //禁用/启用GPS
  public void setGpsDisabled(Context context, boolean bool){
    _hwDevicePolicyManager.setGpsDisabled(new ComponentName(context,this.getClass()),bool);
  }
  //禁用/启用USB数据传输
  public void setUSBDataDisabled(Context context, boolean bool){
    _hwDevicePolicyManager.setUSBDataDisabled(new ComponentName(context,this.getClass()),bool);
  }
  //禁用/启用USB调试模式
  public void setAdbDisabled(Context context, boolean bool){
    _hwDevicePolicyManager.setAdbDisabled(new ComponentName(context,this.getClass()),bool);
  }
  //添加保持某应用始终运行名单
  public void addPersistentApp(Context context, List<String> list){
    _hwDevicePolicyManager.addPersistentApp(new ComponentName(context,this.getClass()),list);
  }
  //删除保持某应用始终运行名单
  public void removePersistentApp(Context context, List<String> list){
    _hwDevicePolicyManager.removePersistentApp(new ComponentName(context,this.getClass()),list);
  }
  //禁用/启用上拉/下拉菜单
  public void setStatusBarExpandPanelDisabled(Context context, boolean bool){
    _hwDevicePolicyManager.setStatusBarExpandPanelDisabled(new ComponentName(context,this.getClass()),bool);
  }
  //关机
  public void shutdownDevice(Context context){
    _hwDevicePolicyManager.shutdownDevice(new ComponentName(context,this.getClass()));
  }
  //重启
  public void rebootDevice(Context context){
    _hwDevicePolicyManager.rebootDevice(new ComponentName(context,this.getClass()));
  }
  //禁用/启用指定app通知栏显示通知
  public void setNotificationDisabled(Context context, boolean bool){
    _hwDevicePolicyManager.setNotificationDisabled(new ComponentName(context,this.getClass()),bool);
  }
  //摄像头禁用或开启
  public void setCameraDisabled(Context context, boolean bool){
    _hwDevicePolicyManager.setCameraDisabled(new ComponentName(context,this.getClass()),bool);
  }
  //开启禁用数据流量
  public void setDataConnectivityDisabled(Context context, boolean bool){
    _hwDevicePolicyManager.setDataConnectivityDisabled(new ComponentName(context,this.getClass()),bool);
  }
  //开启禁用数据流量
  public void setDataConnectivityStatus(Context context, boolean bool){
    _hwDevicePolicyManager.setDataConnectivityStatus(new ComponentName(context,this.getClass()),bool);
  }

    /* *********            测试平板权限                           ********/
}
