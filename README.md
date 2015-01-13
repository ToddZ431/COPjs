# COPjs

An HTML 5 Common Operating Picture viewer using the ArcGIS JavaScript API. This project
is to replace COP viewers built with the ArcGIS Viewer for Flex.

### [View Live Demo](http://copjs-demo.azurewebsites.com)

## Completed Features

### Application Configuration

All configuration options are stored in /Config/DefaultConfig.js. This is a Dojo AMD module that
returns an object with the configuration values.

### Custom Basemaps 

The application supports two custom basemaps that can contain multiple tiled map services. A label and
an array of map services for each basemap is configured in the Basemaps section.

### Operational Layers 

Any number of operational layers can be configured on top of the basemaps. The OperationalLayers configuration
section is an array of Layer objects defining the location and options for each map service. Currently ArcGIS
feature layers, dynamic layers and tiled layers are supported along with WMS map services. See the Layer object
documentation at the bottom of DefaultConfig.js for more information.

### Popups 

Custom popups can be configured for each operational layer. The Mobile Popup will automatically be used on small
screen devices and the normal popup will be used on larger screen devices. See DefaultConfig.js for sample popup
configurations.

### Proxy Support 

Map service requests can be proxied through the server using the included ASP.Net proxy page. In the Proxy
configuration section, the default proxy URL and the option to always use the proxy page can be set. An
array of proxy rules can be configured to only proxy specific resources rather than all requests.

### Table of Contents
The Table of Contents (TOC) shows the list of operational layers in the map along with a legend
for each layer. Checkboxes allow for turning map services and sublayers on and off.

## Planned Features
* Quick Toggle - Larger buttons above the TOC for quickly turning on/off major services like weather radar and traffic feeds.
* Live Feeds - A special type of operational layer that displays important features in feature services such as active 
incidents, vehicle locations, etc. The list of features in each Live Feed will be shown in the Feeds tab with the ability to 
click on a feature to find it on the map.
* Tools - The Tools tab will contain various widgits for working with the map such as address/feature search, measure, coordinate
conversion/locating tools, drawing, printing, etc.

## Acknowledgements

Built with the [ArcGIS JavaScript API](https://developers.arcgis.com/javascript/).

Proxy support provided by the [Esri Resource Proxy](https://github.com/Esri/resource-proxy).

Table of Contents based on [TOC/Legend Widgit by nliu](http://www.arcgis.com/home/item.html?id=9b6280a6bfb0430f8d1ebc969276b109).

"Plus" and "Minus" icons by [Arthur Shlain](http://thenounproject.com/ArtZ91/) on [The Noun Project](http://thenounproject.com).

"Checkbox" icons by [Chris](http://thenounproject.com/chrisnic/) on [The Noun Project](http://thenounproject.com).