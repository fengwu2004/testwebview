package com.yihai.ky.caotang;

/**
 * Created by Administrator on 2017/12/26 0026.
 */

public class POI {
    private int area;
    private int rssi;
    private String mac;
    POI(){}
    POI(int area, int rssi,String mac){
        this.area=area;
        this.rssi=rssi;
        this.mac=mac;
    }

    public int getArea() {
        return area;
    }

    public void setArea(int area) {
        this.area = area;
    }

    public int getRssi() {
        return rssi;
    }

    public void setRssi(int rssi) {
        this.rssi = rssi;
    }

    public String getMac() {
        return mac;
    }

    public void setMac(String mac) {
        this.mac = mac;
    }
}
