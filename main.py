from amadeus import Client, ResponseError

amadeus = Client(
    client_id='gMAu4UGb0PGCYmn4uzQ19OcoLcBpZkTo',
    client_secret='J6srrxxGzdH2OqRI'
)

kwargs_metrics = {'originIataCode': 'BOM',
                  'destinationIataCode': "DEL",
                  'departureDate': '2023-12-01',
                  'currencyCode': 'INR'
                  }


def construct_metrics(metric):
    try:
        metrics = {'min': metric[0]['priceMetrics'][0]['amount'],
                   'first': metric[0]['priceMetrics'][1]['amount'],
                   'median': metric[0]['priceMetrics'][2]['amount'],
                   'third': metric[0]['priceMetrics'][3]['amount'],
                   'max': metric[0]['priceMetrics'][4]['amount']}
        print(metrics)
    except (IndexError, TypeError, AttributeError, KeyError):
        print('error occured')


try:
    response = amadeus.analytics.itinerary_price_metrics.get(**kwargs_metrics)
    construct_metrics(response.data)
except ResponseError as error:
    print(error)


flight_data = []
try:
    response = amadeus.shopping.flight_offers_search.get(
        originLocationCode='BOM',
        destinationLocationCode='DEL',
        departureDate='2023-12-01',
        adults=1,
        currencyCode='INR',
    )
    for num, x in enumerate(response.data, 1):
        print(num)
        print(x['price']['total'])
        if (len(x['itineraries'][0]['segments']) == 2):
            f1 = {'First fight':
                  [
                      x['itineraries'][0]['segments'][0]['departure']['iataCode'],
                      x['itineraries'][0]['segments'][0]['arrival']['iataCode']
                  ],
                  "Departure time": x['itineraries'][0]['segments'][0]['departure']['at'],
                  "Arrival time": x['itineraries'][0]['segments'][0]['arrival']['at'],
                  "Duration": x['itineraries'][0]['segments'][0]['duration']
                  }
            f2 = {'Second fight':
                  [
                      x['itineraries'][0]['segments'][1]['departure']['iataCode'],
                      x['itineraries'][0]['segments'][1]['arrival']['iataCode']
                  ],
                  "Departure time": x['itineraries'][0]['segments'][1]['departure']['at'],
                  "Arrival time": x['itineraries'][0]['segments'][1]['arrival']['at'],
                  "Duration": x['itineraries'][0]['segments'][1]['duration']
                  }
            print(f1, f2)
        else:
            f1 = {'Single fight':
                  [x['itineraries'][0]['segments'][0]['departure']['iataCode'],
                   x['itineraries'][0]['segments'][0]['arrival']['iataCode']
                   ]}
            print(f1)
        print()

except ResponseError as error:
    print(error)
