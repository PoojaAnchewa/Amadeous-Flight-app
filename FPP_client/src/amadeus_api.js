import axios from "axios";

const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;

const searchParams = {
    originLocationCode: "DEL",
    destinationLocationCode: "BOM",
    departureDate: "2023-12-24",
    returnDate: "2023-12-25",
    adults: 1,
    currencyCode: "INR",
    max: 5,
};

var accessToken;

const tokenRequestData = {
    grant_type: "client_credentials",
    client_id: apiKey,
    client_secret: apiSecret,
};

const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
};

export function printData() {
    axios
        .post(
            "https://test.api.amadeus.com/v1/security/oauth2/token",
            tokenRequestData,
            {
                headers: headers,
            }
        )
        .then((response) => {
            accessToken = response.data.access_token;
            console.log("Access Token:", accessToken);
            axios
                .get("https://test.api.amadeus.com/v2/shopping/flight-offers", {
                    headers: {
                        Authorization: `Bearer ${accessToken} `,
                    },
                    params: searchParams,
                })
                .then((response) => console.log(response.data.data)).catch((error) => {
                    console.error("Error:", error);
                });
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}