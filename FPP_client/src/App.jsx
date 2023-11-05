import axios from "axios";
import './App.css';
import { useState, useEffect } from "react";
import { List, ListItem, ListItemText, ListItemIcon, Typography, Paper } from '@mui/material';

function App() {

  const [data, setData] = useState(null);

  const apiKey = process.env.API_KEY;
  const apiSecret = process.env.API_SECRET;

  const accessT = localStorage.getItem("access_token");
  const expiresIn = localStorage.getItem("expires_in");

  const searchParams = {
    originLocationCode: "DEL",
    destinationLocationCode: "BOM",
    departureDate: "2023-12-24",
    // returnDate: "2023-12-25",
    adults: 1,
    currencyCode: "INR",
    max: 20,
  };

  const currentTimeInSeconds = () => { return Math.floor(Date.now() / 1000); };


  const fetchAcessToken = async () => {

    const tokenRequestData = {
      grant_type: "client_credentials",
      client_id: apiKey,
      client_secret: apiSecret,
    };

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    try {
      const response = await axios
        .post(
          "https://test.api.amadeus.com/v1/security/oauth2/token",
          tokenRequestData,
          {
            headers: headers,
          }
        );
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("expires_in", currentTimeInSeconds() + response.data.expires_in);
    }
    catch (error) {
      console.error('Error fetching access token:', error);
    }

  };


  const fetchData = () => {
    axios
      .get("https://test.api.amadeus.com/v2/shopping/flight-offers", {
        headers: {
          Authorization: `Bearer ${accessT} `,
        },
        params: searchParams,
      }).then((response) => {
        const newData = response.data.data;
        setData(newData);
      }).
      catch((error) =>
        console.error("Error making API request:", error)
      );
  };

  useEffect(() => {
    if (!accessT || currentTimeInSeconds() > expiresIn) {
      fetchAcessToken();
    }
    else {
      console.log("Token expires at ", new Date(expiresIn * 1000).toLocaleString());
      if (!data) fetchData();
    }
  }, []);

  return (
    <>
      {data != null ? (
        <ui>
          {data.map((item, index) =>
            <li key={item.id}>
              <p>{item.id} {item.itineraries[0]["segments"][0]["departure"]["iataCode"]} {"->"}
                {item.itineraries[0]["segments"][0]["arrival"]["iataCode"]}</p>
              <p>Departure Time: {item.itineraries[0]["segments"][0]["departure"]["at"]}</p>
              <p>Arrival Time: {item.itineraries[0]["segments"][0]["arrival"]["at"]}</p>
              <p>Carrier code: {item.itineraries[0]["segments"][0]["operating"]["carrierCode"]}</p>
              <p>Total: {item["price"]["total"]}</p>
            </li>)}
        </ui>
      ) : (<>Hello world</>)}
    </>
  );
}

export default App;
