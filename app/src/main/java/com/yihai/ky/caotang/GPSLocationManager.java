package com.yihai.ky.caotang;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;

import java.util.Timer;
import java.util.TimerTask;

/**
 * Created by ky on 1/11/2018.
 */

public class GPSLocationManager implements LocationListener, SensorEventListener {

  private SensorManager mSensorManager;

  private Sensor mAccelerometer;

  private Sensor mMagneticField;

  private float mCurrentDegree = 0.0f;

  private Timer mTimer = new Timer();

  private Location mLocation = null;

  private float[] mAccelerometerValues = new float[3];

  private float[] mMagneticFieldValues = new float[3];

  private float[] mValues = new float[3];

  private float[] mMatrix = new float[9];

  private LocationManager _locationManager;

  private GPSLocationManagerListener _listener;

  private String _provider = LocationManager.GPS_PROVIDER;

  public void setListener(GPSLocationManagerListener listener) {

    _listener = listener;
  }

  public void initLocation(Context context) {

    if (ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {

      _locationManager = (LocationManager)context.getSystemService(Context.LOCATION_SERVICE);

      mLocation = _locationManager.getLastKnownLocation(_provider);

      _locationManager.requestLocationUpdates(_provider, 0, 0, this);

      mSensorManager = (SensorManager)context.getSystemService(Context.SENSOR_SERVICE);

      mAccelerometer = mSensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);

      mMagneticField = mSensorManager.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD);

      mSensorManager.registerListener(this, mAccelerometer, SensorManager.SENSOR_DELAY_NORMAL);

      mSensorManager.registerListener(this, mMagneticField, SensorManager.SENSOR_DELAY_NORMAL);
    }

    TimerTask task = new TimerTask() {
      @Override
      public void run() {

        _listener.onReceiveLocation(mLocation, mCurrentDegree);
      }
    };

    mTimer.schedule(task, 1000, 100);
  }

  @Override
  public void onLocationChanged(Location location) {

    mLocation = location;
  }

  @Override
  public void onStatusChanged(String s, int i, Bundle bundle) {

  }

  @Override
  public void onProviderEnabled(String s) {

  }

  @Override
  public void onProviderDisabled(String s) {

  }

  @Override
  public void onAccuracyChanged(Sensor sensor, int accuracy) {

  }

  @Override
  public void onSensorChanged(SensorEvent event) {

    if (event.sensor.getType() == Sensor.TYPE_ACCELEROMETER) {

      mAccelerometerValues = event.values;
    }

    if (event.sensor.getType() == Sensor.TYPE_MAGNETIC_FIELD) {

      mMagneticFieldValues = event.values;
    }

    SensorManager.getRotationMatrix(mMatrix, null, mAccelerometerValues, mMagneticFieldValues);

    SensorManager.getOrientation(mMatrix, mValues);

    float degree = (float) Math.toDegrees(mValues[0]);

    if (degree >= 0) {

      mCurrentDegree = degree;
    }
    else {

      mCurrentDegree = degree + 360;
    }
  }
}
