const create = require('apisauce').create;
const _ = require("lodash");
const qs = require('querystring');

const maps_api_key = process.env.GOOGLE_MAPS_API_KEY;

const geoCodeAPI = create({
    baseURL: "https://maps.googleapis.com/maps/api",
});


// https://maps.googleapis.com/maps/api/geocode/json?latlng=6.059427,%2080.203641&location_type=GEOMETRIC_CENTER&key=API_KEY
const getAddress = async (lat, lng) => {

    const resp = await geoCodeAPI.get(`/geocode/json?latlng=${lat},${lng}&location_type=GEOMETRIC_CENTER&key=${maps_api_key}`);

    if (!resp.ok) return null;
    const { results } = resp.data;

    const location = {
        place_name: results[0].address_components[0].long_name,
        formatted_address: results[0].formatted_address,
        cordes: results[0].geometry.location
    }

    return location;
};

// https://maps.googleapis.com/maps/api/distancematrix/json?mode=transit&origins=6.066527,80.2240319&destinations=6.063387,%2080.215142&key=API_KEY
const getDistance = async (start, end) => {
    const resp = await geoCodeAPI.get(`/distancematrix/json?mode=transit&origins=${start.lat},${start.lng}&destinations=${end.lat},${end.lng}&key=${maps_api_key}`);
    if (!resp.ok) return null;
    const data = {
        start: resp.data.origin_addresses[0],
        end: resp.data.destination_addresses[0],
        distance: resp.data.rows[0].elements[0].distance,
        time: resp.data.rows[0].elements[0].duration
    }
    return data;
}

module.exports = { getAddress, getDistance };