const create = require('apisauce').create;

const auth_code = process.env.PAYHERE_AUTHORIZATION_CODE;

const authAPI = create({
    baseURL: "https://sandbox.payhere.lk/merchant/v1/oauth/token",
    headers: {
        'Authorization': `Basic ${auth_code}`,
        'Content-Type': "application/x-www-form-urlencoded"
    },
});


const chargeAPI = create({
    baseURL: "https://sandbox.payhere.lk/merchant/v1/payment/charge",
    headers: {
        'Content-Type': "application/json"
    },
});

chargeAPI.addAsyncRequestTransform(async (request) => {
    const { data } = await authAPI.post('', 'grant_type=client_credentials');
    request.headers['Authorization'] = `Bearer ${data.access_token}`
});

const charge = async (info = { order_id, items, amount, customer_token }) => {
    const result = await chargeAPI.post('', { ...info, currency: "LKR" });
    if (!result.ok) return null;
    return result.data;
}

module.exports = { authAPI, charge }

