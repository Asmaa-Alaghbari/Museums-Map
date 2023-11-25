import { useEffect } from "react";
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Config from "@arcgis/core/config";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Point from "@arcgis/core/geometry/Point";
import Polyline from "@arcgis/core/geometry/Polyline";
import Polygon from "@arcgis/core/geometry/Polygon";
import Graphic from "@arcgis/core/Graphic";
import * as route from "@arcgis/core/rest/route.js";
import * as locator from "@arcgis/core/rest/locator.js";
import RouteParameters from "@arcgis/core/rest/support/RouteParameters";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet";
import "./Demo.css";

function Test() {
  useEffect(() => {
    Config.apiKey =
      "AAPK8158143e626b4691a8c4b32faf107bfe4GrAhOcdjHeYATsVyawiycLnnZGETJ9vHd47kLExwPelaM0QaaS4zabLVWEIJvyf";

    const url =
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

    const template = {
      title: "Earthquake Info",
      content: "Magnitude {mag} {type} hit {place} on {time}",
      fieldInfos: [
        {
          fieldName: "time",
          format: {
            dateFormat: "short-date-short-time",
          },
        },
      ],
    };

    const renderer = {
      type: "simple",
      field: "mag",
      symbol: {
        type: "simple-marker",
        color: "orange",
        outline: {
          color: "white",
        },
      },
      visualVariables: [
        {
          type: "size",
          field: "mag",
          stops: [
            {
              value: 2.5,
              size: "4px",
            },
            {
              value: 8,
              size: "40px",
            },
          ],
        },
      ],
    };

    const geojsonLayer = new GeoJSONLayer({
      url: url,
      copyright: "USGS Earthquakes",
      popupTemplate: template,
      renderer: renderer,
      orderBy: {
        field: "mag",
      },
    });

    const map = new Map({
      basemap: "arcgis/navigation",
      layers: [geojsonLayer],
    });

    let view = new MapView({
      map: map,
      container: "MapApp",
      center: [-118.73682450024377, 34.07817583063242], //Longitude, latitude
      zoom: 10,
    });

    view.watch("center", (newCenter) => {
      findPlaces(newCenter);
    });

    function findPlaces(newCenter) {
      const geocodingServiceUrl =
        "http://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";

      const params = {
        address: {
          address: "McDonald's",
        },
        location: newCenter,
        outFields: ["PlaceName", "Place_addr"],
      };

      locator
        .addressToLocations(geocodingServiceUrl, params)
        .then((results) => {
          view.popup.close();
          view.graphics.removeAll();
          results.forEach((result) => {
            view.graphics.add(
              new Graphic({
                attributes: result.attributes,
                geometry: result.location,
                symbol: {
                  color: "black",
                },
                popupTemplate: {
                  title: "{PlaceName}",
                  content:
                    "{Place_addr}" +
                    "<br><br>" +
                    result.location.x.toFixed(5) +
                    "," +
                    result.location.y.toFixed(5),
                },
              })
            );
          });

          if (results.length) {
            const g = view.graphics.getItemAt(0);
            view.openPopup({
              features: [g],
              location: g.geometry,
            });
          }
        });
    }

    const routeUrl =
      "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

    view.on("click", function (event) {
      if (view.graphics.length === 0) {
        addGraphic("origin", event.mapPoint);
      } else if (view.graphics.length === 1) {
        addGraphic("destination", event.mapPoint);
        getRoute(); // Call the route service
      } else {
        view.graphics.removeAll();
        addGraphic("origin", event.mapPoint);
      }
    });

    function addGraphic(type, point) {
      const graphic = new Graphic({
        symbol: {
          type: "simple-marker",
          color: type === "origin" ? "white" : "black",
          size: "8px",
        },
        geometry: point,
      });
      view.graphics.add(graphic);
    }

    function getRoute() {
      const routeParams = new RouteParameters({
        stops: new FeatureSet({
          features: view.graphics.toArray(),
        }),

        returnDirections: true,
      });

      route
        .solve(routeUrl, routeParams)
        .then((data) => {
          data.routeResults.forEach((result) => {
            result.route.symbol = {
              type: "simple-line",
              color: [5, 150, 255],
              width: 3,
            };
            view.graphics.add(result.route);
          });

          // Display directions
          if (data.routeResults.length > 0) {
            const directions = document.createElement("ol");
            directions.classList =
              "esri-widget esri-widget--panel esri-directions__scroller";
            directions.style.marginTop = "0";
            directions.style.padding = "15px 15px 15px 30px";
            const features = data.routeResults[0].directions.features;

            // Show each direction
            features.forEach(function (result, i) {
              const direction = document.createElement("li");
              direction.innerHTML =
                result.attributes.text +
                " (" +
                result.attributes.length.toFixed(2) +
                " miles)";
              directions.appendChild(direction);
            });

            view.ui.empty("top-right");
            view.ui.add(directions, "top-right");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    const graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

    let point = new Point({
      longitude: -118.80657463861,
      latitude: 34.0005930608889,
    });

    const simpleMarkerSymbol = {
      type: "simple-marker",
      color: [226, 119, 40], // Orange
      outline: {
        color: [255, 255, 255], // White
        width: 1,
      },
    };

    const pointGraphic = new Graphic({
      geometry: point,
      symbol: simpleMarkerSymbol,
    });
    graphicsLayer.add(pointGraphic);

    // Create a line geometry
    const polyline = new Polyline({
      paths: [
        [-118.821527826096, 34.0139576938577], //Longitude, latitude
        [-118.814893761649, 34.0080602407843], //Longitude, latitude
        [-118.808878330345, 34.0016642996246], //Longitude, latitude
      ],
    });
    const simpleLineSymbol = {
      type: "simple-line",
      color: [226, 119, 40], // Orange
      width: 2,
    };
    const polylineGraphic = new Graphic({
      geometry: polyline,
      symbol: simpleLineSymbol,
    });
    graphicsLayer.add(polylineGraphic);

    const polygon = new Polygon({
      rings: [
        [-118.818984489994, 34.0137559967283], //Longitude, latitude
        [-118.806796597377, 34.0215816298725], //Longitude, latitude
        [-118.791432890735, 34.0163883241613], //Longitude, latitude
        [-118.79596686535, 34.008564864635], //Longitude, latitude
        [-118.808558110679, 34.0035027131376], //Longitude, latitude
      ],
    });

    const simpleFillSymbol = {
      type: "simple-fill",
      color: [227, 139, 79, 0.8], // Orange, opacity 80%
      outline: {
        color: [255, 255, 255],
        width: 1,
      },
    };
    const popupTemplate = {
      title: "{Name}",
      content: "{Description}",
    };
    const attributes = {
      Name: "Graphic",
      Description: "I am a polygon",
    };
    const polygonGraphic = new Graphic({
      geometry: polygon,
      symbol: simpleFillSymbol,
      attributes,
      popupTemplate,
      popupEnabled: true,
    });
    graphicsLayer.add(polygonGraphic);

    const trailheadsRenderer = {
      type: "simple",
      symbol: {
        type: "picture-marker",
        url: "http://static.arcgis.com/images/Symbols/NPS/npsPictograph_0231b.png",
        width: "18px",
        height: "18px",
      },
    };

    const trailheadsLabels = {
      symbol: {
        type: "text",
        color: "#FFFFFF",
        haloColor: "#5E8D74",
        haloSize: "2px",
        font: {
          size: "12px",
          family: "Noto Sans",
          style: "italic",
          weight: "normal",
        },
      },

      labelPlacement: "above-center",
      labelExpressionInfo: {
        expression: "$feature.TRL_NAME",
      },
    };

    const popupTrailheads = {
      title: "Trailhead",
      content:
        "<b>Trail:</b> {TRL_NAME}<br><b>City:</b> {CITY_JUR}<br><b>Cross Street:</b> {X_STREET}<br><b>Parking:</b> {PARKING}<br><b>Elevation:</b> {ELEV_FT} ft",
    };

    const trailheadsLayer = new FeatureLayer({
      url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0",
      renderer: trailheadsRenderer,
      labelingInfo: [trailheadsLabels],
      outFields: ["TRL_NAME", "CITY_JUR", "X_STREET", "PARKING", "ELEV_FT"],
      popupEnabled: true,
      popupTemplate: popupTrailheads,
    });
    map.add(trailheadsLayer);

    const trailsRenderer = {
      type: "simple",
      symbol: {
        color: "#BA55D3",
        type: "simple-line",
        style: "solid",
      },
      visualVariables: [
        {
          type: "size",
          field: "ELEV_GAIN",
          minDataValue: 0,
          maxDataValue: 2300,
          minSize: "3px",
          maxSize: "7px",
        },
      ],
    };
    const popupTrails = {
      title: "Trail Information",
      content: [
        {
          type: "media",
          mediaInfos: [
            {
              type: "column-chart",
              caption: "",
              value: {
                fields: ["ELEV_MIN", "ELEV_MAX"],
                normalizeField: null,
                tooltipField: "Min and max elevation values",
              },
            },
          ],
        },
      ],
    };

    const trailsLayer = new FeatureLayer({
      url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0",
      renderer: trailsRenderer,
      opacity: 0.75,
      outFields: ["TRL_NAME", "ELEV_GAIN"],
      popupEnabled: true,
      popupTemplate: popupTrails,
    });
    map.add(trailsLayer, 0);

    const bikeTrailsRenderer = {
      type: "simple",
      symbol: {
        type: "simple-line",
        style: "short-dot",
        color: "#FF91FF",
        width: "1px",
      },
    };
    // Define popup for Parks and Open Spaces
    const popupOpenspaces = {
      title: "{PARK_NAME}",
      content: [
        {
          type: "fields",
          fieldInfos: [
            {
              fieldName: "AGNCY_NAME",
              label: "Agency",
              isEditable: true,
              tooltip: "",
              visible: true,
              format: null,
              stringFieldOption: "text-box",
            },
            {
              fieldName: "TYPE",
              label: "Type",
              isEditable: true,
              tooltip: "",
              visible: true,
              format: null,
              stringFieldOption: "text-box",
            },
            {
              fieldName: "ACCESS_TYP",
              label: "Access",
              isEditable: true,
              tooltip: "",
              visible: true,
              format: null,
              stringFieldOption: "text-box",
            },

            {
              fieldName: "GIS_ACRES",
              label: "Acres",
              isEditable: true,
              tooltip: "",
              visible: true,
              format: {
                places: 2,
                digitSeparator: true,
              },

              stringFieldOption: "text-box",
            },
          ],
        },
      ],
    };
    const parksLayer = new FeatureLayer({
      url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Parks_and_Open_Space/FeatureServer/0",
      renderer: bikeTrailsRenderer,
      definitionExpression: "USE_BIKE = 'YES'",
      outFields: [
        "TYPE",
        "PARK_NAME",
        "AGNCY_NAME",
        "ACCESS_TYP",
        "GIS_ACRES",
        "TRLS_MI",
        "TOTAL_GOOD",
        "TOTAL_FAIR",
        "TOTAL_POOR",
      ],
      popupEnabled: true,
      popupTemplate: popupOpenspaces,
    });
    map.add(parksLayer, 0);
  }, []);

  return <div id="MapApp" style={{ height: "100vh" }}></div>;
}

export default Test;
