const create = require('apisauce').create;
const _ = require("lodash");
const qs = require('querystring');

const maps_api_key = process.env.GOOGLE_MAPS_API_KEY;

const geoCodeAPI = create({
    baseURL: "https://maps.googleapis.com/maps/api",
    // headers: {
    //     'Content-Type': "application/x-www-form-urlencoded"
    // },
});


// https://maps.googleapis.com/maps/api/geocode/json?latlng=6.059427,%2080.203641&location_type=GEOMETRIC_CENTER&key=API_KEY


const getAddress = async (lat, lng) => {

    const resp = await geoCodeAPI.get(`/geocode/json?latlng=${lat},${lng}&location_type=GEOMETRIC_CENTER&key=${maps_api_key}`);

    if (!resp.ok) return null;
    const { results } = resp.data;

    const dummy_result = {
        formatted_address: 'Kalegana Bus Stop, Galle 80000, Sri Lanka',
        place_id: 'ChIJp24Q--Nz4ToRDUd2M133pVs',
        geometry: { location: { lat: 6.0589705, lng: 80.203768 } }
    }
    // return dummy_result;
    return _.pick(results[0], ["formatted_address", "place_id", "geometry.location"]);
};

module.exports = { getAddress };