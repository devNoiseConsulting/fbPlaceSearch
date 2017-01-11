let {
  FB,
  FacebookApiException
} = require('fb');

const app_id = process.env.APP_ID;
const app_secret = process.env.APP_SECRET;

const postBotApp = FB.extend({
  appId: app_id,
  appSecret: app_secret
});



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

  testFbId(146880345357966);
  makePost();
});

//146880345357966
function makePost() {
  FB.setAccessToken('access_token');

  var body = 'My first post using facebook-node-sdk';
  FB.api('146880345357966/feed', 'post', {
    message: body
  }, function(res) {
    if (!res || res.error) {
      console.log(!res ? 'error occurred' : res.error);
      return;
    }
    console.log('Post Id: ' + res.id);
  });
}

const fields = 'id,name,website,single_line_address,location,current_location,store_location_descriptor,parent_page,category,hours';

function testFbId(fbid) {
  let request = fbid + '/feed?metadata=0&' + fields;
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
