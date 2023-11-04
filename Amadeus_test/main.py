from amadeus import Client, ResponseError

amadeus = Client(
    client_id="gMAu4UGb0PGCYmn4uzQ19OcoLcBpZkTo", client_secret="J6srrxxGzdH2OqRI"
)

kwargs_metrics = {
    "originIataCode": "BOM",
    "destinationIataCode": "DEL",
    "departureDate": "2023-12-01",
    "currencyCode": "INR",
}


def construct_metrics(metric):
    try:
        metrics = {
            "min": metric[0]["priceMetrics"][0]["amount"],
            "first": metric[0]["priceMetrics"][1]["amount"],
            "median": metric[0]["priceMetrics"][2]["amount"],
            "third": metric[0]["priceMetrics"][3]["amount"],
            "max": metric[0]["priceMetrics"][4]["amount"],
        }
        print(metrics)
    except (IndexError, TypeError, AttributeError, KeyError):
        print("error occured")


try:
    response = amadeus.analytics.itinerary_price_metrics.get(**kwargs_metrics)
    construct_metrics(response.data)
except ResponseError as error:
    print(error)

flight_data = []


def construct_flight_data(flight_obj, index):
    obj = {}
    temp = []
    flight_obj_size = len(flight_obj)
    for j, data in enumerate(flight_obj, 1):
        size = len(data["segments"])
        for num in range(0, size):
            temp.append(
                {
                    "Trip"
                    if j == 1
                    else "Return Trip": {
                        "Fight"
                        if size == 1
                        else "First fight"
                        if num == 0
                        else "Second fight": [
                            data["segments"][num]["departure"]["iataCode"],
                            data["segments"][num]["arrival"]["iataCode"],
                        ],
                        "Departure time": data["segments"][num]["departure"]["at"],
                        "Arrival time": data["segments"][num]["arrival"]["at"],
                        "Duration": data["segments"][num]["duration"],
                    }
                }
            )
    obj[index] = temp
    flight_data.append(obj)
    print(obj)


try:
    response = amadeus.shopping.flight_offers_search.get(
        originLocationCode="BOM",
        destinationLocationCode="DEL",
        departureDate="2023-12-01",
        returnDate="2023-12-01",
        adults=1,
        nonStop="false",
        currencyCode="INR",
        max=5,
    )

    for index, x in enumerate(response.data, 1):
        print(index)
        print(x["price"]["total"])
        construct_flight_data(x["itineraries"], index)
        print()

except ResponseError as error:
    print(error)
