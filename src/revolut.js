// this code is forked from https://github.com/tducret/revolut-python
import Rp from 'request-promise';

// api host
const host = 'https://api.revolut.com'

// default token used when token has not been received yet
const tokenDefault = 'QXBwOlM5V1VuU0ZCeTY3Z1dhbjc';

// create header based on the token
const getHeaders = token => {
  const device_id = 'revolut_cli';

  return {
    'Host': 'api.revolut.com',
    'X-Api-Version': '1',
    'X-Device-Id': device_id,
    'X-Client-Version': '6.6.2',
    'User-Agent': 'Revolut/5.5 500500250 (CLI; Android 4.4.2)',
    'Authorization': 'Basic ' + token,
  }
}


/**
 * wrapper around Rp to make requests easier
 */
const makeRequest = async (uri, token, body = undefined) => {
  const method = body ? 'POST' : 'GET';
  const json = true;

  const url = host + uri;

  const headers = getHeaders(token);

  const options = {
    url, headers, method, json, body
  }

  try {
    const r = await Rp(options);
    return r;
  } catch (err) {
    console.log('err')
    console.log(err.response.body);
    return null;
  }
}

/**
 * first step of the login
 * @param  body: {phone, password}
 * @return {phone} (not important)
 * note the request is done with the default token here
 */
const login = async (phone, password) => {  
  const body = { phone, password}
  
  const r = await makeRequest('/signin', tokenDefault, body);

  if (r === null) {
    return null;
  }

  return {phone};
}

/**
 * second step of the login
 * @param phone 
 * @param inputcode: SMS code received
 * @return { token }
 */
const loginSms = async (phone, inputcode) => {
  // very quick cleaning of the input code
  const code = inputcode.replace('-', '');

  const body = {
    phone,
    code
  };

  try {
    const r = await makeRequest('/signin/confirm', tokenDefault, body);
    // extract params of interest from the response
    const { accessToken, user } = r;

    // get the user id
    const userId = user.id;

    // create the non base 64 token
    const preToken = userId + ':' + accessToken;
    // turn into base 64
    const token = Buffer.from(preToken).toString('base64');

    return { phone, token };
  } catch (err) {
    console.error('something went wrong while retrieving token')
    return false;
  }
}

/**
 * retrieves the list of account
 * @param token 
 * @return array with the list of accounts
 */
const getAccounts = async (token) => {
  const url = host + '/user/current/wallet';

  return makeRequest('/user/current/wallet', token);
}

// did not test
const exchange = async (fromCcy, fromAmount, toCcy, token) => {
  const toAmount = null;
  const body = {fromCcy, fromAmount, toCcy, toAmount};

  return await makeRequest('/exchange', token, body);
}

/**
 * execute payment to a phone
 * @param phone: recipient phone number
 * @param amount: amount to be transferred (x 100: 2.34USD => 234)
 * @param currency: three letter code of the currency
 */
const payment = async (phone, amount, currency, token) => {
  if(typeof currency === 'undefined') {
    currency = 'USD';
  }

  const recipient = `{"phone": "${phone}"}`;

  const body = {
    amount,
    currency,
    recipient
  };

  return await makeRequest('/transfer', token, body);
}

export default { getAccounts, exchange, payment, loginSms, login }
