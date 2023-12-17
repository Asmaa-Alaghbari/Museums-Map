import "../css/Select.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../security/AuthContext";
import { useNavigate } from "react-router-dom";

function Select() {
  const authContext = useAuth();
  const navigate = useNavigate();
  const [favoritePoint, setFavoritePoint] = useState([]);
  const [notFavoritePoint, setNotFavoritePoint] = useState([]);
  const [pointToRemove, setPointToRemove] = useState([]);
  const [allPoints, setAllPoints] = useState([]);

  useEffect(() => {
    async function getFavoriteMuseum() {
      try {
        const response_01 = await axios.get(
          `http://localhost:8080/api/favoritePoint/${authContext.name}`
        );
        setNotFavoritePoint(response_01.data);
        console.log(notFavoritePoint);

        const response_02 = await axios.get(
          `http://localhost:8080/api/allPoints`
        );
        setAllPoints(response_02.data);
      } catch (error) {
        console.log(error);
      }
    }
    getFavoriteMuseum();
  }, []);

  const handleSelectFavorite = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      //Add checked item into checkList
      setFavoritePoint([...favoritePoint, value]);
      console.log(favoritePoint);
    } else {
      //Remove unchecked item from checkList
      const filteredList = favoritePoint.filter((item) => item !== value);
      setFavoritePoint(filteredList);
      console.log(favoritePoint);
    }
  };

  const handleSelectNotFavorite = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      //Add checked item into checkList
      setPointToRemove([...pointToRemove, value]);
      console.log(pointToRemove);
    } else {
      //Remove unchecked item from checkList
      const filteredList = pointToRemove.filter((item) => item !== value);
      setPointToRemove(filteredList);
      console.log(pointToRemove);
    }
  };

  async function handleUpdate() {
    try {
      console.log(favoritePoint);
      const response_01 = await axios.post(
        `http://localhost:8080/api/addFavoritePoint/${authContext.name}`,
        {
          favorPoints: favoritePoint,
        }
      );

      console.log(pointToRemove);
      const response_02 = await axios.post(
        `http://localhost:8080/api/removeFavoritePoint/${authContext.name}`,
        {
          notFavorPoints: pointToRemove,
        }
      );

      if (response_01.data === "success" && response_02.data === "success") {
        navigate("/museum");
      }
    } catch (error) {}
  }

  return (
    <div className="container pt-5">
      <div className="row">
        <div className="col-md-4 order-md-1 col-lg-3 sidebar-filter">
          <h6 className="text-uppercase mt-3 mb-3 font-weight-bold">
            All museums
          </h6>
          {allPoints.map((item, index) => {
            return (
              <div className="mt-2 mb-2 pl-2">
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="filter-size-1"
                    value={item.name}
                    onChange={handleSelectFavorite}
                  />
                  <label
                    className="custom-control-label"
                    for="filter-size-1"
                    style={{ marginLeft: "5px" }}
                  >
                    {item.name}
                  </label>
                </div>
              </div>
            );
          })}
          <div className="divider mt-3 mb-3 border-bottom border-secondary"></div>
          <h6 className="text-uppercase mt-3 mb-3 font-weight-bold">
            My museums
          </h6>
          {notFavoritePoint.map((item, index) => {
            return (
              <div className="mt-2 mb-2 pl-2">
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="filter-size-1"
                    value={item.name}
                    onChange={handleSelectNotFavorite}
                  />
                  <label
                    className="custom-control-label"
                    for="filter-size-1"
                    style={{ marginLeft: "5px" }}
                  >
                    {item.name}
                  </label>
                </div>
              </div>
            );
          })}
          <div className="divider mt-3 mb-3 border-bottom border-secondary"></div>
          <btn
            className="btn btn-lg btn-block btn-primary mt-5"
            onClick={handleUpdate}
          >
            Update Results
          </btn>
        </div>
      </div>
    </div>
  );
}

export default Select;
