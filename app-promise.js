const yargs = require('yargs')
const axios = require('axios')
const argv = yargs
    .options({
        a: {
            demand: true,
            alias: 'address',
            describe: 'Address to fetch weather',
            string: true
        }
    })
    .help().alias('help', 'h')
    .argv;
const encodedAddress = encodeURIComponent(argv.address);
const geocodeUrl = `http://www.mapquestapi.com/geocoding/v1/address?key=AENjGKZAOMmhEK2G5RaZcOwjvxu87kdL&location=${encodedAddress}`;
axios.get(geocodeUrl)
    .then((response) => {
        const lat = response.data.results[0].locations[0].latLng.lat;
        const lng = response.data.results[0].locations[0].latLng.lng;
        const street = response.data.results[0].locations[0].street;
        const address = street + ' ' + response.data.results[0].locations[0].adminArea5 + ' ' + response.data.results[0].locations[0].adminArea3 + ' ' + response.data.results[0].locations[0].adminArea1 + ' ' + response.data.results[0].locations[0].postalCode;
        const weatherUrl = `https://api.darksky.net/forecast/34aae13d473a32773e73d8203110b7b4/${lat},${lng}`;
        console.log(`Please wait .....\nRetriving current temp for ${address}`);
        console.log(weatherUrl)
        return axios.get(weatherUrl);
    }).then((response) => {
        // console.log(JSON.stringify(response.data))
        const summary = response.data.currently.summary;
        const currentTemp = response.data.currently.temperature;
        const feelsLike = response.data.currently.apparentTemperature;
        const timeZone = response.data.timezone;
        const _date = response.data.currently.time
        console.log(`Current Condition  : ${summary}`)
        console.log(`Current Temp       : ${currentTemp}'F & Feels like  ${feelsLike}'F`);
        console.log(`Timezone           : ${timeZone}`);
        console.log(`Current date time  : ${getDate(_date)}`)
    })
    .catch((errorMessage) => {
        if (errorMessage.code === 'ENOTFOUND') {
            console.log('unable to connect to the server.')
        } else {
            console.log(errorMessage.message)
        }
    })


    // convert epoch date to local date & time.
function getDate(epochDate){
    const date = new Date(epochDate * 1000); // multiply by 1000 for milliseconds
    return date_string = date.toLocaleString('en-GB', { hour12:true });  // 24 hour format
}

//const weatherUrl = `https://api.darksky.net/forecast/34aae13d473a32773e73d8203110b7b4/${lat},${lng}`
//Current Temp  :  49.7'F & Feels like 47.3'F
//Time zone: America / Los_Angeles


// forecast.io (darksky.com)
//34aae13d473a32773e73d8203110b7b4
//https://api.darksky.net/forecast/34aae13d473a32773e73d8203110b7b4/37.773336,-121.551523