window.onload = function () {
  
  console.log(window.dfctmap)
  
  dfctmap.setMaxMinScale(4000, 100)
}

function setGpsPos(jsonstr) {
  
  if (window.dfctmap !== undefined) {
    
    let jsonvalue = JSON.parse(jsonstr)
    
    let latitude = jsonvalue.latitude

    let longitude = jsonvalue.longitude
    
    let azimuth = jsonvalue.azimuth
  
    window.dfctmap.setGpsPos(latitude, longitude, azimuth)
  }
}

function setNaviTrace() {
  
  if (window.dfctmap.isInNavi()) {
  
    window.dfctmap.setStatus(YFM.Map.STATUS_NAVIGATE)
  }
}

function enterRegion(name) {
  
  if (window.dfctmap != undefined) {
  
    window.enterRegion(name)
  }
}
