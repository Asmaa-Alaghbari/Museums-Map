// Mapper.js

import "../css/Mapper.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../security/AuthContext";
import Config from "@arcgis/core/config";
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView";
import Graphic from "@arcgis/core/Graphic";
import PopupTemplate from "@arcgis/core/PopupTemplate.js";
import * as locator from "@arcgis/core/rest/locator.js";
import * as route from "@arcgis/core/rest/route.js";
import RouteParameters from "@arcgis/core/rest/support/RouteParameters";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import axios from "axios";

export default function Mapper() {
  const [listPoint, setListPoint] = useState([]);
  const [favorPoint, setFavorPoint] = useState([]);
  const navigate = useNavigate();
  const authContext = useAuth();

  function handleLogout() {
    authContext.logout();
    navigate("/login");
  }

  function handleAddMuseumList() {
    navigate("/select");
  }

  useEffect(() => {
    async function check() {
      let click = 0;
      let point_direction = [];
      let route_direction = [];

      const response_01 = await axios.get("http://localhost:8080/api/points");
      setListPoint(response_01.data);
      const response_02 = await axios.get(
        `http://localhost:8080/api/favoritePoint/${authContext.name}`
      );
      setFavorPoint(response_02.data);

      const graphicsLayer = new GraphicsLayer();

      Config.apiKey =
        "AAPK8158143e626b4691a8c4b32faf107bfe4GrAhOcdjHeYATsVyawiycLnnZGETJ9vHd47kLExwPelaM0QaaS4zabLVWEIJvyf";

      const map = new Map({
        basemap: "arcgis/topographic",
      });

      let view = new MapView({
        container: "viewDiv",
        map: map,
        center: [26.096306, 44.439663], //Longitude, latitude
        // center: [-118.80543, 34.027],
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

      const trailheadsLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/yb2kDFtWEFCsGrIK/arcgis/rest/services/Bucharest/FeatureServer/0",
      });
      map.add(trailheadsLayer);

      const routeUrl =
        "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

      view.on("click", function (event) {
        if (click === 0) {
          click = 1;
          addGraphic("origin", event.mapPoint);
        } else if (click === 1) {
          addGraphic("destination", event.mapPoint);
          getRoute();
          click = 2;
        } else {
          view.graphics.remove(point_direction[0]);
          view.graphics.remove(point_direction[1]);
          view.graphics.remove(route_direction[0]);
          point_direction = [];
          route_direction = [];
          click = 1;
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
        point_direction.push(graphic);
        view.graphics.add(graphic);
      }

      function getRoute() {
        const routeParams = new RouteParameters({
          stops: new FeatureSet({
            features: point_direction,
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
              route_direction.push(result.route);
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

              view.ui.empty("bottom-left");
              view.ui.add(directions, "bottom-left");
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }

      const places = [
        "Select your mode",
        "Normal mode",
        "Favorite museums",
        "Top 5 museum",
      ];

      const select = document.createElement("select");
      select.setAttribute("class", "esri-widget esri-select");
      select.setAttribute(
        "style",
        "width: 175px; font-family: 'Avenir Next W00'; font-size: 1em"
      );
      select.classList.add("custom-select");

      places.forEach((p) => {
        const option = document.createElement("option");
        option.value = p;
        option.innerHTML = p;
        select.appendChild(option);
      });

      view.ui.add(select, "top-right");

      select.addEventListener("change", async (event) => {
        if (event.target.value === "Normal mode") {
          console.log("Normal mode");
          view.graphics.removeAll();
          view.ui.empty("bottom-left");
          map.remove(graphicsLayer);

          const locatorUrl =
            "http://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";
          locator
            .addressToLocations(locatorUrl, {
              location: view.center,
              categories: "museum",
              maxLocations: 25,
              outFields: ["Place_addr", "PlaceName"],
            })
            .then((results) => {
              results.forEach((result) => {
                console.log("----");
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
          const trailheadsLayer = new FeatureLayer({
            url: "https://services5.arcgis.com/yb2kDFtWEFCsGrIK/arcgis/rest/services/Bucharest/FeatureServer/0",
          });
          map.add(trailheadsLayer);
        } else if (event.target.value === "Top 5 museum") {
          const res_01 = await axios.get("http://localhost:8080/api/points");

          console.log("Top 5 museum");
          view.graphics.removeAll();
          view.ui.empty("bottom-left");
          graphicsLayer.removeAll();
          map.remove(graphicsLayer);
          map.removeAll();

          // listPoint.forEach((p) => {
          res_01.data.forEach((p) => {
            console.log(p);
            console.log(p);
            map.add(graphicsLayer);

            const point = {
              type: "point",
              longitude: p.longitude,
              latitude: p.latitude,
            };
            const simpleMarkerSymbol = {
              type: "simple-marker",
              color: "#000000", // White
              size: "12px",
              outline: {
                color: "#ffffff",
                width: "2px",
              },
            };

            const pointGraphic = new Graphic({
              geometry: point,
              symbol: simpleMarkerSymbol,
            });
            graphicsLayer.add(pointGraphic);
          });
          const trailheadsLayer = new FeatureLayer({
            url: "https://services5.arcgis.com/yb2kDFtWEFCsGrIK/arcgis/rest/services/Bucharest/FeatureServer/0",
          });
          map.add(trailheadsLayer);
        } else if (event.target.value === "Favorite museums") {
          console.log("Favorite museums");
          const res_02 = await axios.get(
            `http://localhost:8080/api/favoritePoint/${authContext.name}`
          );
          view.graphics.removeAll();
          view.ui.empty("bottom-left");
          graphicsLayer.removeAll();
          map.remove(graphicsLayer);
          map.removeAll();

          // favorPoint.forEach((p) => {
          res_02.data.forEach((p) => {
            map.add(graphicsLayer);
            console.log(p);
            console.log(p);
            const point = {
              type: "point",
              longitude: p.longitude,
              latitude: p.latitude,
            };
            const simpleMarkerSymbol = {
              type: "simple-marker",
              color: "#000000", // White
              size: "12px",
              outline: {
                color: "#ffffff",
                width: "2px",
              },
            };

            const pointGraphic = new Graphic({
              geometry: point,
              symbol: simpleMarkerSymbol,
            });
            graphicsLayer.add(pointGraphic);
          });

          const trailheadsLayer = new FeatureLayer({
            url: "https://services5.arcgis.com/yb2kDFtWEFCsGrIK/arcgis/rest/services/Bucharest/FeatureServer/0",
          });
          map.add(trailheadsLayer);
        }
      });
    }
    check();
  }, []);

  return (
    <div id="viewDiv" style={{ height: "100vh", width: "100vw" }}>
      <div className="mapper-controls">
        <button
          type="button"
          className="btn btn-primary btn-logout"
          onClick={handleLogout}
        >
          Logout
        </button>
        <button
          type="button"
          className="btn btn-add-museum"
          onClick={handleAddMuseumList}
        >
          Add Museums to Favorite List
        </button>
      </div>
      <div className="mapper-table">
        <table className="table">
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
          ></link>
          <tr>
            <td>
              <i
                className="fas fa-circle"
                style={{ color: "black", backgroundColor: "transparent" }}
              ></i>
            </td>
            <td>Museum</td>
          </tr>
          <tr>
            <td>
              <i
                className="fas fa-circle"
                style={{ color: "red", backgroundColor: "transparent" }}
              ></i>
            </td>
            <td>Bus or Subway</td>
          </tr>
        </table>
      </div>
    </div>
  );
}
