// https://maps.googleapis.com/maps/api/geocode/json?latlng=6.059427,%2080.203641&location_type=GEOMETRIC_CENTER&key=API_KEY

var result = {
    "plus_code": {
        "compound_code": "3653+QF Galle, Sri Lanka",
        "global_code": "6MR23653+QF"
    },
    "results": [{
        "address_components":
            [
                {
                    "long_name": "Kalegana Bus Stop",
                    "short_name": "Kalegana Bus Stop",
                    "types": ["establishment", "point_of_interest", "transit_station"]
                },
                {
                    "long_name": "Kalegana",
                    "short_name": "Kalegana",
                    "types": ["political", "sublocality", "sublocality_level_1"]
                },
                {
                    "long_name": "Galle",
                    "short_name": "Galle",
                    "types": ["locality", "political"]
                },
                {
                    "long_name": "Galle",
                    "short_name": "Galle",
                    "types": ["administrative_area_level_2", "political"]
                },
                {
                    "long_name": "Southern Province",
                    "short_name": "SP",
                    "types": ["administrative_area_level_1", "political"]
                },
                {
                    "long_name": "Sri Lanka",
                    "short_name": "LK",
                    "types": ["country", "political"]
                },
                {
                    "long_name": "80000",
                    "short_name": "80000",
                    "types": ["postal_code"]
                }
            ],
        "formatted_address": "Kalegana Bus Stop, Galle 80000, Sri Lanka",
        "geometry": {
            "location": {
                "lat": 6.0589705,
                "lng": 80.203768
            },
            "location_type": "GEOMETRIC_CENTER",
            "viewport": {
                "northeast": {
                    "lat": 6.060319480291502,
                    "lng": 80.20511698029151
                },
                "southwest": {
                    "lat": 6.057621519708499,
                    "lng": 80.2024190197085
                }
            }
        },
        "place_id": "ChIJp24Q--Nz4ToRDUd2M133pVs",
        "plus_code": {
            "compound_code": "3653+HG Galle, Sri Lanka",
            "global_code": "6MR23653+HG"
        },
        "types": ["establishment", "point_of_interest", "transit_station"]
    },
    {
        "address_components": [{
            "long_name": "Kitulampitiya Road",
            "short_name": "Kitulampitiya Rd",
            "types": ["route"]
        },
        {
            "long_name": "Kalegana",
            "short_name": "Kalegana",
            "types": ["political", "sublocality", "sublocality_level_1"]
        },
        {
            "long_name": "Galle",
            "short_name": "Galle",
            "types": ["locality", "political"]
        },
        {
            "long_name": "Galle",
            "short_name": "Galle",
            "types": ["administrative_area_level_2", "political"]
        },
        {
            "long_name": "Southern Province",
            "short_name": "SP",
            "types": ["administrative_area_level_1", "political"]
        },
        {
            "long_name": "Sri Lanka",
            "short_name": "LK",
            "types": ["country", "political"]
        },
        {
            "long_name": "80000",
            "short_name": "80000",
            "types": ["postal_code"]
        }
        ],
        "formatted_address": "Kitulampitiya Rd, Galle 80000, Sri Lanka",
        "geometry": {
            "bounds": {
                "northeast": {
                    "lat": 6.059671,
                    "lng": 80.2038063
                },
                "southwest": {
                    "lat": 6.0593349,
                    "lng": 80.203626
                }
            },
            "location": {
                "lat": 6.059501399999999,
                "lng": 80.20371919999999
            },
            "location_type": "GEOMETRIC_CENTER",
            "viewport": {
                "northeast": {
                    "lat": 6.060851930291502,
                    "lng": 80.20506513029152
                },
                "southwest": {
                    "lat": 6.058153969708497,
                    "lng": 80.20236716970849
                }
            }
        },
        "place_id": "ChIJ8cyL5uNz4ToR2hQ-y9kH48k",
        "types": ["route"]
    }
    ],
    "status": "OK"
}