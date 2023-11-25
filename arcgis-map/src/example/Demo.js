import { useEffect } from "react";
import Config from "@arcgis/core/config";
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView";
import Graphic from "@arcgis/core/Graphic";
import PopupTemplate from "@arcgis/core/PopupTemplate.js";
import * as locator from "@arcgis/core/rest/locator.js";
import "./Demo.css";

function Demo() {
  const time = 5;
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
        center: [18.9553, 69.6492], //Longitude, latitude
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

      const places = [
        "Choose a place type...",
        "Parks and Outdoors",
        "Coffee shop",
        "Gas station",
        "Food",
        "Hotel",
      ];

      const select = document.createElement("select");
      select.setAttribute("class", "esri-widget esri-select");
      select.setAttribute(
        "style",
        "width: 175px; font-family: 'Avenir Next W00'; font-size: 1em"
      );

      places.forEach((p) => {
        const option = document.createElement("option");
        option.value = p;
        option.innerHTML = p;
        select.appendChild(option);
      });

      view.ui.add(select, "top-right");

      const locatorUrl =
        "http://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";

      // Find places and add them to the map
      function findPlaces(category, pt) {
        locator
          .addressToLocations(locatorUrl, {
            location: pt,
            categories: category,
            maxLocations: 25,
            outFields: ["Place_addr", "PlaceName"],
          })
          .then((results) => {
            view.graphics.removeAll();
            results.forEach((result) => {
              console.log(result);
              view.graphics.add(
                new Graphic({
                  attributes: result.attributes, // Data attributes returned
                  geometry: result.location, // Point returned
                  symbol: {
                    type: "simple-marker",
                    color: "#000000",
                    size: "12px",
                    outline: {
                      color: "#ffffff",
                      width: "2px",
                    },
                  },
                  popupEnable: false,
                  popupTemplate: new PopupTemplate({
                    title: "{PlaceName}",
                    content: "{Place_addr}",
                  }),
                })
              );
            });
          });
      }

      // Listen for category changes and find places
      select.addEventListener("change", (event) => {
        findPlaces(event.target.value, view.center);
      });
    }
    check();
  }, []);

  return <div id="viewDiv" style={{ height: "100vh" }}></div>;
}

export default Demo;
