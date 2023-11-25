import { useEffect } from "react";
import Config from "@arcgis/core/config";
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView";
import Graphic from "@arcgis/core/Graphic";
import PopupTemplate from "@arcgis/core/PopupTemplate.js";
import * as locator from "@arcgis/core/rest/locator.js";
import * as route from "@arcgis/core/rest/route.js";
import RouteParameters from "@arcgis/core/rest/support/RouteParameters";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet";
import "../css/Mapper.css";

function Mapper() {
  useEffect(() => {
    function check() {
      Config.apiKey =
        "AAPK8158143e626b4691a8c4b32faf107bfe4GrAhOcdjHeYATsVyawiycLnnZGETJ9vHd47kLExwPelaM0QaaS4zabLVWEIJvyf";

      const map = new Map({
        basemap: "arcgis/navigation",
      });

      let view = new MapView({
        container: "viewDiv",
        map: map,
        center: [26.096306, 44.439663], //Longitude, latitude
        zoom: 13,
        popup: {
          actions: [],
          dockEnabled: true,
          dockOptions: {
            buttonEnabled: true,
            breakpoint: false,
          },
        },
      });

      const routeUrl =
        "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

      view.on("click", function (event) {
        if (view.graphics.length === 0) {
          addGraphic("origin", event.mapPoint);
        } else if (view.graphics.length === 1) {
          addGraphic("destination", event.mapPoint);
          getRoute();
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
          .then(function (data) {
            data.routeResults.forEach(function (result) {
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
    }
    check();
  }, []);

  return <div id="viewDiv" style={{ height: "100vh" }}></div>;
}

export default Mapper;
