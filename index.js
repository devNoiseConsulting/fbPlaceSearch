let {
  FB,
  FacebookApiException
} = require('fb');

const app_id = process.env.APP_ID;
const app_secret = process.env.APP_SECRET;

const breweryApp = FB.extend({
  appId: app_id,
  appSecret: app_secret
});

/*
fields:
id
name
website
category
hours
location
current_location
store_location_descriptor
parent_page
single_line_address
*/

const latLng = '39.95,-75.16';
const distance = 161000;
const fields = 'id,name,website,single_line_address,location,current_location,store_location_descriptor,parent_page,category,hours';
const limit = 25;

//let brewerySearch = `/search?q=brewery|brewing&type=place&center=${latLng}&distance=${distance}&fields=${fields}`;
let brewerySearch = `/search?q=brewery&type=place&center=${latLng}&distance=${distance}&fields=${fields}&limit=${limit}`;
let brewingSearch = `/search?q=brewing&type=place&center=${latLng}&distance=${distance}&fields=${fields}&limit=${limit}`;

let places = [];
let searchCount = 0;

FB.api('oauth/access_token', {
  client_id: app_id,
  client_secret: app_secret,
  grant_type: 'client_credentials'
}, function(res) {
  if (!res || res.error) {
    console.log(!res ? 'error occurred' : res.error);
    return;
  }

  var accessToken = res.access_token;
  FB.setAccessToken(accessToken);

  searchCount++;
  searchGet(brewerySearch);
  searchCount++;
  searchGet(brewingSearch);
  //testFbId('42338591948');
});

/*
GET graph.facebook.com
  /search?
    q={your-query}&
    type={object-type}
*/
function testFbId(fbid) {
  let request = fbid + '?metadata=0&' + fields;
  FB.api(request, function(res) {
    if (!res || res.error) {
      console.log(!res ? 'error occurred' : res.error);
      return;
    }
    console.log(res);
    /*
      metadata:
       { fields:
    */
  });
}

/*
GET graph.facebook.com
  /search?
    q=coffee&
    type=place&
    center=37.76,-122.427&
    distance=1000
*/
function searchGet(search) {
  console.log(search);
  FB.api(search, function(res) {
    if (!res || res.error) {
      console.log(!res ? 'error occurred' : res.error);
      return;
    }
    //console.log(res);
    const newPlace = res.data.filter(place => place.website && place.location.street);
    places = places.concat(newPlace);
    //console.log(places);
    if (res.paging.next) {
      setTimeout(function() {
        console.log('Calling next');
        searchGet(res.paging.next.substr(32));
      }, 1000);
    } else {
      places = places.filter((thing, index, self) => self.findIndex((t) => {return t.id === thing.id; }) === index);
      placesToFeatureCollection(places);
    }
  });
}

function dedupPlaces(places) {
    places.sort();
}

function placesToFeatureCollection(places) {
  searchCount--;
  if (searchCount === 0){
    let featureCollection = {
      "type": "FeatureCollection",
      "features": []
    };
    featureCollection.features = places.map(placeToFeature);
    console.log('features count = ' + featureCollection.features.length);
    console.log(JSON.stringify(featureCollection, null, 2));
  } else {
    console.log('A search is still active.');
  }
}

function placeToFeature(place) {
  let feature =     {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            place.location.longitude,
            place.location.latitude
          ]
        },
        "properties": {
          "marker-symbol": "beer",
          "marker-color": "#607D8B",
          "marker-size": "small",
          "name": place.name,
          "address": place.single_line_address,
          "url": place.website
        }
      };
      return feature;
}
