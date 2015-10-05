

function init(){
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {

      console.log('Successful login for: ' + JSON.stringify(response));
        // the user is logged in and has authenticated your
        // app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed
        // request, and the time the access token
        // and signed request each expire
        var uid = response.authResponse.userID;
        var accessToken = response.authResponse.accessToken;

        loadLikes('me/likes?fields=id,name,category,likes,talking_about_count,link,created_time&limit=100');

//         FB.api('/me', function(response) {
//                      console.log('me info: ' + JSON.stringify(response));
//        //              document.getElementById('status').innerHTML =
//        //                'Thanks for logging in, ' + response.name + '!';
//                    });
//
//         FB.api('/716169611845582/feed?limit=25', function(response) {
//                              console.log('vasilisa feed: ' + JSON.stringify(response));
//                //              document.getElementById('status').innerHTML =
//                //                'Thanks for logging in, ' + response.name + '!';
//                            });
//                    //716169611845582/feed?limit=25

      } else if (response.status === 'not_authorized') {

        console.log('not_authorized login for: ' + JSON.stringify(response));
        // the user is logged in to Facebook,
        // but has not authenticated your app
      } else {
        // the user isn't logged in to Facebook.
        console.log('not login: ' + JSON.stringify(response));
      }
     });
}

function loadLikes(path){
    FB.api(path, function(likesResponse) {
        console.log('likesResponse: ' + JSON.stringify(likesResponse));

        var data = likesResponse.data || likesResponse.likes.data;
        var paging = likesResponse.paging || likesResponse.likes.paging;

        if(data){
            Ext.getCmp('fbLikesGrid').getStore().loadData(data,true);
            if(paging && paging.cursors && paging.cursors.after){
                loadLikes('me/likes?fields=id,name,category,likes,talking_about_count,link,created_time&limit=100&after=' + paging.cursors.after);
            }
        }
    });
}