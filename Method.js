<script>
function LoadStreamingApp(channelId) {
    url = "http://192.168.70.148:8060/launch/" + channelId;
    app.HttpRequest("POST", url, null, null, function(error,response, status) {
        app.ShowPopup("The channel was changed to channel id: " + channelId);
    });
}
function ChangeToApp(appID) {
    var baseUrl = "http://192.168.70.148:8060/launch/";
    app.HttpRequest( "POST", baseUrl, appID, "private_Listening=true", (error, response, status)=>{if(error) alert("Error:" + error);if(response) alert("Response:" + response);/*if(status) *//*alert("Status:" + status+"\r\n"+response);*/} )
    /*var xhr = new XMLHttpRequest();
    xhr.open("POST", baseUrl + appID, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            app.ShowPopup("Private listening activated");
        } else if (xhr.readyState === 4) {
            app.ShowPopup("Failed to activate private listening");
        }
    };

    // Send the request (the payload may vary based on the channel)
    var payload = {
        "privateListening": true
    };

    xhr.send(JSON.stringify(payload));
    */
}
</script>
</head>