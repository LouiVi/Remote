cfg.Light, cfg.MUI, cfg.Portrait;
app.DisableKeys( 'VOLUME_DOWN,VOLUME_UP' );
app.LoadPlugin( "Support" );
app.LoadPlugin( "LabelView" );
app.LoadPlugin( "Utils" );
var found = false;
var animations = app.CreateSupport().AnimationManager().keys;
var animLength = animations.length;

const OnStart = function() {

	app.SetOnKey( OnKey );
	app.ExtractAssets( app.GetAppPath()+"ip.txt", "ip.txt", true );
  app.SetTitle("Roku Remote");
  lay = app.CreateLayout("linear", "Vertical, VCenter");
  sup = app.CreateSupport();
  utils = app.CreateUtils("LuilloSoft Inc.");
	rColor = utils.RandomHexColor(false);
	app.SetStatusBarColor(  rColor)
	rColor = utils.RandomHexColor(false);
	app.SetNavBarColor( rColor )
	//utils.SetTheme(rColor);
	rColor = utils.RandomHexColor(false);
 CreateActionBar();
 CreateMenuBar(rColor);
 grid = sup.CreateGridLayout();
 grid.SetColCount( 4 );
 lay.AddChild( grid );
 web = app.CreateWebView( 1,-1 );
 web.SetBackColor( MUI.colors.deepPurple);
 lay.AddChild( web );
 FetchChannelApps(web);
  db = app.OpenDatabase( "/storage/emulated/0/Download/a/Remote.sqlite" );
  db.ExecuteSql( "CREATE TABLE IF NOT EXISTS remoteButtons " +  
        "(id integer primary key AUTOINCREMENT, layout text not null, caption text not null, command text not null);" );
DisplayAllRows();
CreateButton(lay, "", "");
CreateButton(lay, "↑ Up", "Up");
CreateButton(lay, "", "");
CreateButton(lay, "[IP]", "");
//CreateButton(lay, "🟠 Down ", "VolumeDown");
CreateButton(lay, "← Left", "Left");
CreateButton(lay, "Ok", "Select");
CreateButton(lay, "Right →", "Right");
CreateButton(lay, "", "");
CreateButton(lay, "", "");
CreateButton(lay, "↓ Down", "Down");
CreateButton(lay, "", "");
CreateButton(lay, "", "");
CreateButton(lay, "", "");
CreateButton(lay, "", "");
CreateButton(lay, "", "");
CreateButton(lay, "🟠 Up   ", "VolumeUp");
CreateButton(lay, "Netflix", "12");
CreateButton(lay, "YouTube", "837");
CreateButton(lay, "", "");
CreateButton(lay, "🟠 Down ", "VolumeDown");
//CreateButton(lay, "🟠 Mute ", "VolumeMute");
CreateButton(lay, "Prime", "13");
CreateButton(lay, "Max", "61322");
CreateButton(lay, "", "");
//CreateButton(lay, "🟠 Down ", "VolumeDown");
CreateButton(lay, "🟠 Mute ", "VolumeMute");
CreateButton(lay, "Camera", "660807");
CreateButton(lay, "Live TV", "tvinput.dtv");
CreateButton(lay, "", "");

CreateButton(lay, "", "");
CreateButton(lay, "", "");
CreateButton(lay, "", "");

CreateButton(lay, "", "");
CreateButton(lay, "", "");
CreateButton(lay, "Repeat", "InstantReplay");
CreateButton(lay, "Rev", "Rev");
CreateButton(lay, "Play", "Play");
CreateButton(lay, "Fwd", "Fwd");
    db.Close();
//db.ExecuteSql( "INSERT INTO test_table (data, data_num)" +   
  //      " VALUES (?,?)", ["test", 100], null, OnError )  

 

    // Add the layout to the app

    app.AddLayout(lay);
    CheckIP();
    //ChangeToApp("837");
	Anim(lay, 1500, ["Newspaper", "Jelly", "RubberBand"]);
}


function Anim(obj, timer, anims)
{
	switch (anims.length) {
		case 1:
			obj.Animate(anims[0], null, timer);
			break;
		case 2:
			obj.Animate(anims[0], ()=>{obj.Animate(anims[1], null, timer);}, timer);
			break;
		case 3:
			obj.Animate(anims[0], ()=>{obj.Animate(anims[1], ()=>{obj.Animate(anims[2], null, timer);}, timer);}, timer);
		  break;
	}
}

// Function to fetch the list of installed apps and display them in the WebView
function FetchChannelApps(webView) {
    url = "http://192.168.70.148:8060/query/apps";
    app.HttpRequest("GET",url, null, null,function(error,response,status) {
        apps = ParseApps(response);
        DisplayAppsInWebView(webView, apps);
    });
}

// Function to parse the list of apps from the XML response
function ParseApps(xml) {
    apps = [];
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(xml, "text/xml");
    appNodes = xmlDoc.getElementsByTagName("app");

    for (i = 0; i < appNodes.length; i++) {
        appx = {
            id: appNodes[i].getAttribute("id"),
            name: appNodes[i].textContent,
            iconUrl: "http://192.168.70.148:8060/query/icon/" + appNodes[i].getAttribute("id")
        };
        apps.push(appx);
    }
//alert(JSON.stringify(apps))
    return apps;
}

// Function to display the apps in the WebView with a marquee effect
function DisplayAppsInWebView(webView, apps) {
		method = app.ReadFile( "Method.js" );
    html = "<html><head><script src='ds:/Sys/app.js'></script>" + method + "<body style='background: linear-gradient(to bottom,  #af3995 0%,#880e67 50%,#c3238e 100%); color: white;font-size:10px;margin-top:5px;'>";
    html += "<br/><marquee behavior='scroll' direction='alternate' scrollamount='3' style='background: linear-gradient(to bottom,  #af3995 0%,#880e67 50%,#c3238e 100%);'>";

    for (var i = 0; i < apps.length; i++) {
        html += `<div style='display: inline-block; margin: 10px; text-align: center;background: linear-gradient(to bottom,  #af3995 0%,#880e67 50%,#c3238e 100%);border-radius: 10px 10px 10px 10px;'>
                    <img onClick='javascript:ChangeToApp(this.alt);' alt='${apps[i].id}' src='${apps[i].iconUrl}' style='width: 96px; height: 96px;border-radius: 10px 10px 10px 10px; box-shadow: 0 0 4px 2px #454545;' vspace='3' hspace='4'><br>
                    <span style='text-shadow: 1px 1px 2px #2B2B2B;'><marquee behavior='alternate' direction='left' scrollamount='1' scrolldelay='0.007' style='font-size:4px; padding-top:3px;width:96px;text-shadow: 0 0 2px #454545;'>${apps[i].name}</marquee></span>
                 </div>`;
    }

    html += "</marquee></body></html>";
    //alert(html)
    webView.LoadHtml(html);
}

async function OnKey(action, name, code, extra) {
    if(action == "Up"){
    	if(name == "VOLUME_UP"){
    		SendCommand("VolumeUp");
    	}else{
    		SendCommand("VolumeDown");
    	}
    }
}

 function DisplayAllRows() 
{ 
    //txt.SetText("")  
      
    //Get all the table rows.  
    db.ExecuteSql( "select * from remoteButtons;", [], OnResult ) 
} 

//Callback to show query results in debug.  
function OnResult( results )   
{  
    var s = "";  
    var len = results.rows.length;  
    for(var i = 0; i < len; i++ )   
    {  
        var item = results.rows.item(i)  
        s += item.id + ", " + item.layout + ", " + item.caption + ", " + item.command + "\n";   
    }  
    //alert(s);
    //txt.SetText( s )  
}  

// Function to create buttons

function CreateButton(lay, text, command) {
    db.ExecuteSql( "INSERT INTO remoteButtons (caption, command)" +   
      " VALUES (?,?)", [text, command], null, ()=>{app.ShowPopup( "Error" );});
      // if(text=="↑ Up" || text == "↓ Down" || text == "← Left" || text == "Right →" || text == "Ok"){
     if(text=="🟠 Up   " || text == "🟠 Down " || text == "🟠 Mute "){
  
      btn = app.CreateButton(text, 0.25, 0.075,"AutoShrink");
     } else if(text == "[IP]"){
       btn = app.CreateText( "Device IP: \n"+app.ReadFile( "ip.txt" ), -1, -1, "MultiLine");
    
 }else{
    btn = app.CreateButton(text, 0.25, 0.075,"AutoShrink");
    }
    btn.SetFontFile( "Misc/ArchitectsDaughter-Regular.ttf" );
    btn.SetTextSize( 12 );
    if(text=="🟠 Up   " || text == "🟠 Down " || text == "🟠 Mute "){
    	btn.SetTextColor( "#000000" );
    	btn.SetTextShadow( 4, 0, 0, MUI.colors.deepOrange.lighten1 );
    	
    	btn.SetBackGradient(  MUI.colors.gray.darken2, MUI.colors.gray.lighten2, MUI.colors.gray.darken1);
 btn.SetStyle(MUI.colors.gray.lighten3, MUI.colors.gray.lighten1, 5, MUI.colors.gray.darken4, 1,1);
       }
       if(text=="↑ Up" || text == "↓ Down" || text == "← Left" || text == "Right →" || text == "Ok"){
       	btn.SetTextColor( "#ffffff" );
    	btn.SetTextShadow( 7, 0, 0, MUI.colors.deepPurple.darken4);
    	
    	btn.SetBackGradient(  MUI.colors.deepPurple.darken2, MUI.colors.deepPurple.lighten2, MUI.colors.deepPurple.darken1);
 btn.SetStyle(MUI.colors.deepPurple.lighten3, MUI.colors.deepPurple.lighten1, 5, MUI.colors.deepPurple.darken4, 1,1);
  
       }
       if(text=="Netflix"){
       	btn.SetTextColor( "#ffffff" );
    	btn.SetTextShadow( 7, 0, 0, MUI.colors.grey.darken4);
    	
    	btn.SetBackGradient(  MUI.colors.red.darken2, MUI.colors.red.lighten2, MUI.colors.red.darken1);
 btn.SetStyle(MUI.colors.red.lighten3, MUI.colors.red.lighten1, 5, MUI.colors.red.darken4, 1,1);
  
       }
         if(text=="Live TV"){
       	btn.SetTextColor( "#343434");//MUI.colors.red.darken4 );
    	btn.SetTextShadow( 7, 3, 3, MUI.colors.red.darken4);
    	
    	btn.SetBackGradient(  MUI.colors.amber.darken2, MUI.colors.amber.lighten2, MUI.colors.amber.darken1);
 btn.SetStyle(MUI.colors.amber.lighten3, MUI.colors.amber.lighten1, 5, MUI.colors.amber.darken4, 1,1);
  
       }
        if(text=="Prime"){
       	btn.SetTextColor( "#ffffff" );
    	btn.SetTextShadow( 7, 0, 0, MUI.colors.blue.darken4);
    	
    	btn.SetBackGradient(  MUI.colors.blue.darken2, MUI.colors.blue.lighten2, MUI.colors.blue.darken1);
 btn.SetStyle(MUI.colors.blue.lighten3, MUI.colors.blue.lighten1, 5, MUI.colors.blue.darken4, 1,1);
  
       }
         if(text=="Max"){
       	btn.SetTextColor( "#ffffff" );
    	btn.SetTextShadow( 7, 0, 0, MUI.colors.blue.darken4);
    	
    	btn.SetBackGradient(  MUI.colors.blue.darken3, MUI.colors.blue.lighten1, MUI.colors.blue.darken2);
 btn.SetStyle(MUI.colors.blue.lighten1, MUI.colors.blue, 5, MUI.colors.blue.darken4, 1,1);
  
       }
        if(text=="Camera"){
       	btn.SetTextColor( "#ffffff" );
    	btn.SetTextShadow( 7, 0, 0, MUI.colors.indigo.darken4);
    	
    	btn.SetBackGradient(  MUI.colors.indigo.darken3, MUI.colors.indigo.lighten1, MUI.colors.indigo.darken2);
 btn.SetStyle(MUI.colors.indigo.lighten1, MUI.colors.indigo, 5, MUI.colors.indigo.darken4, 1,1);
  
       }
         if(text=="YouTube"){
       //	btn.SetTextColor( MUI.colors.red.darken1 );
    	btn.SetTextShadow( 7, 0, 0, "#db3434");
    	
    	btn.SetBackGradient(  "#efefef", "#ffffff", "#fcfcfc");
 btn.SetStyle("#efefef", "#fcfcfc", 5, MUI.colors.red.darken1, 1,1);
  btn.SetTextColor( MUI.colors.red.lighten1 );
       }
    //self = this;
    btn.data["command"]=command;
		//self.command = command;
    btn.SetOnTouch(function() {  self = this; self.Animate(GetRandomAnim(), null, 650); if(parseInt(self.data["command"])>0) {ChangeToApp(self.data["command"]); }else if(self.data["command"]==="Dev"){RunDev();}else{ SendCommand(self.data["command"]); }});
if(btn.data["command"]=="") eval("btn.Gone();");
		grid.AddChild( btn );
    //lay.AddChild(btn);

}

 

// Function to start listening for speech

function StartListening() {

    speech = app.CreateSpeechRec();
    speech.SetOnResult(OnSpeechResult);
    speech.Recognize();

}

 

// Callback function for speech recognition

function OnSpeechResult(result) {
app.ShowPopup( JSON.stringify(result) )
    HandleCommand(result[0].toLowerCase());

}

 

// Function to handle commands

function HandleCommand(command) {

    if (command.includes("play")) {

        SendCommand("Play");

    } else if (command.includes("back")) {

        SendCommand("Back");

    } else if (command.includes("sleep")) {

        SendCommand("Sleep");

    } else if (command == "up") {

        SendCommand("Up");

    } else if (command == "down") {

        SendCommand("Down");

    } else if (command == "left") {

        SendCommand("Left");

    } else if (command == "right") {

        SendCommand("Right");

    } else if (command.includes("ok")) {

        SendCommand("Select");

    } else if (command.includes("menu")) {

        SendCommand("Info");

    } else if (command.includes("volume up")) {

        SendCommand("VolumeUp");

    } else if (command.includes("volume down")) {

        SendCommand("VolumeDown");

    } else if (command.includes("volume mute")) {

        SendCommand("VolumeMute");

    } else if (command.includes("power")) {

        SendCommand("Power");
      } else if (command.includes("dev")) {
//alert("hello")
        SendCommand("Home");
        SendCommand("Home");
        SendCommand("Home");
        SendCommand("Up");
        SendCommand("Up");
        SendCommand("Right");
        SendCommand("Left");
        SendCommand("Right");
        SendCommand("Left");
        SendCommand("Right");
      app.ShowPopup( "Developer Menu" );
     
             } else if (command.includes("home")) {

        SendCommand("Home");
/*660807
837
12
13*/
    } else if (command.includes("netflix")) {

        ChangeToApp("12");
} else if (command.includes("prime")) {

        ChangeToApp("13");
} else if (command.includes("youtube")) {

        ChangeToApp("837");
} else if (command.includes("camera")) {

        ChangeToApp("660807");
} else if (command.includes("spotify")) {

        ChangeToApp("22297");
        } else if (command.includes("hulu")) {

        ChangeToApp("2285");
 } else if (command.includes("max")) {

        ChangeToApp("61322");
} else if (command.includes("hbo")) {

        ChangeToApp("61322");
    
    } else if (command.includes("peacock")) {
    
   // tvinput.dtv

        ChangeToApp("593099");
        } else if (command.includes("live tv") || command.includes("Live TV")) {
    
    

        ChangeToApp("tvinput.dtv");
    } else if (command.includes("random")) {

        ChangeToApp(utils.RandomIntegerRange(1, 999999).toString());
    
    } else {

        app.ShowPopup("Command not recognized");

    }

}

 async function RunDev()
{
	SendCommand("Home");
	await sleep(850);
        SendCommand("Home");
        await sleep(850);
        SendCommand("Home");
        await sleep(850);
        SendCommand("Up");
        await sleep(850);
        SendCommand("Up");
        await sleep(850);
        SendCommand("Right");
        await sleep(850);
        SendCommand("Left");
        await sleep(850);
        SendCommand("Right");
        await sleep(850);
        SendCommand("Left");
        await sleep(850);
        SendCommand("Right");
      app.ShowPopup( "Developer Menu" );
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to send a command via HTTP to Roku

function SendCommand(command) {
    var baseUrl = "http://[ROKU_IP]:8060/keypress/".replace("[ROKU_IP]", app.ReadFile( "ip.txt" ) );
    var xhr = new XMLHttpRequest();
    xhr.open("POST", baseUrl + command, true);
    xhr.send();
    xhr.onload = function() {
        if (xhr.status == 200){
            //app.ShowPopup("The [" +command +"] command was executed successfully.");
        }else{
            //app.ShowPopup("Failed to execute command. " + command);
        }
    };
}

function ChangeToApp(appID) {
//alert("here");
    var baseUrl = "http://[ROKU_IP]:8060/launch/".replace("[ROKU_IP]", app.ReadFile( "ip.txt" ) );
    app.HttpRequest( "POST", baseUrl, appID, "privateListening=true", (error, response, status)=>{if(error) alert("Error:" + error);if(response) alert("Response:" + response);/*if(status) *//*alert("Status:" + status+"\r\n"+response);*/} )
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

function ChangeToAppLast(appID) {
    var baseUrl = "http://[ROKU_IP]:8060/launch/".replace("[ROKU_IP]", app.ReadFile( "ip.txt" ) );
    var xhr = new XMLHttpRequest();
    xhr.open("POST", baseUrl + appID, true);
    xhr.send();
    xhr.onload = function() {
        if (xhr.status == 200)
            app.ShowPopup("The [" +appID+"] command was executed successfully.");
        else
            app.ShowPopup("Failed to execute command. " + appID);
    };
}

function GetRandomAnim()
{
	gra = animations[utils.RandomIntegerRange(0, animLength)];
	//alert(gra);
//	app.ShowPopup( "Animation: "+gra + tvar);
	if(gra.includes("out") || gra.includes("Out") || gra.includes("Exit") || gra.includes("To")) {
		return GetRandomAnim();
	} else {
		return gra;
	}
}

//Create an action bar at the top.
function CreateActionBar()
{
    //Create horizontal layout for top bar.
    layHoriz = app.CreateLayout( "Linear", "Bottom,Horizontal,FillX,Left" );
    layHoriz.SetBackGradient( utils.GetGradientColors(utils.GetGradientColors(rColor)[1])[0], utils.GetGradientColors(rColor)[1], utils.GetGradientColors(utils.GetGradientColors(rColor)[1])[1]);
    //color.PINK_LIGHT_4, color.PINK_DARK_2, color.PINK_ACCENT_2);
    lay.AddChild( layHoriz );
    layHoriz.SetSize( 1, 0.07 )
    
    //Create menu (hamburger) icon .
    txtMenu = app.CreateText( "[fa-home]", -1,-1, "FontAwesome" );
    txtMenu.SetPadding( 12,2,12,10, "dip" );
    txtMenu.SetTextSize( 26 );
    txtMenu.SetTextColor( "white" );
txtMenu.SetTextShadow( 7, 2, 2, "#000000" );
    txtMenu.SetOnTouchUp( function(){SendCommand("Home");} );
    layHoriz.AddChild( txtMenu );
    
    //Create layout for title box.
    layBarTitle = app.CreateLayout( "Linear", "Horizontal" );
    layBarTitle.SetSize( 0.73);//, 0.08791 );
    layHoriz.AddChild( layBarTitle );
    
    //Create title.
    txtBarTitle = app.CreateText( app.GetAppName().split("_").join(" "), -1,-1, "Left" );
    txtBarTitle.SetFontFile( "Misc/LuckiestGuy-Regular.ttf");//Misc/YoungSerif-Regular.ttf" );
    txtBarTitle.SetMargins(5,0,0,10,"dip");
    txtBarTitle.SetTextSize( 22 );
    txtBarTitle.SetTextColor( "#ffffff");
    
 txtBarTitle.SetTextShadow( 7, 2, 2, "#000000" );
    layBarTitle.AddChild( txtBarTitle );
    
        
    //Create search icon.
    txtSearch = app.CreateText( "  [fa-power-off]", -1,-1, "FontAwesome, Right" );
    txtSearch.SetPadding( 0,2,10,10, "dip" );
    txtSearch.SetTextSize( 26  );
    txtSearch.SetTextColor( "#ffffff");
txtSearch.SetTextShadow( 7, 2, 2, "#000000" );
    txtSearch.SetOnTouchUp( function(){SendCommand("Power");} );
    layHoriz.AddChild( txtSearch );
    
}

function CreateMenuBar(col)
{
    layHoriz2 = app.CreateLayout( "Linear", "Horizontal,FillX,Left" );
    layHoriz2.SetBackGradient( utils.GetGradientColors(col)[0], col, utils.GetGradientColors(col)[1]);
    lay.AddChild( layHoriz2 );
	layHoriz2.SetSize( 1.0, 0.0999 );

mh = new Array();
mv = new Array();
mi = new Array();
mt = new Array();
mi = ["Back","Sleep","Voice","Menu"];
mi2 = ["arrow_back","more_time","speaker_notes","menu_book"];
for(c=0;c<4;c++){
mh[c] = app.CreateLayout( "Linear", "Vertical" );
mh[c].SetSize(0.25, 0.95);
if(c==0) mh[c].SetBackColor("#00" + col.replace("#",""));
layHoriz2.AddChild( mh[c] );
for(d=0;d<2;d++){
mv[d] = app.CreateLayout( "Linear", "Vertical,VCenter" );
//if(d==0) { mv[d].SetSize(1.0, 0.25);}else{mv[d].SetSize(1.0, 1.75);}
//if(d==0) mv[d].SetBackColor("#ef000000");
if(d==0) mt[c] = app.CreateText( mi2[c] ), mt[c].SetMargins(0.01,0.01,0.01,0.01), mt[c].index = c, mt[c].SetOnTouch(mt_OnTouch),mt[c].SetFontFile("Misc/MaterialIcons-Regular.ttf"), mv[d].AddChild(mt[c]), mt[c].SetTextSize(24), mt[c].SetTextColor("#ffffff"), mt[c].SetTextShadow(5,2,2,"#000000");
if(d==1) mt[c] = app.CreateText( mi[c] ), mv[d].AddChild(mt[c]), mt[c].index = c, mt[c].SetOnTouch(mt_OnTouch),mt[c].SetTextColor("#ffffff"),  mt[c].SetTextShadow(5,0,0,"#000000"),mt[c].SetTextSize(10);
mh[c].AddChild(mv[d]);
}
}
}

function mt_OnTouch(event)
{
self = this;
//alert(self.GetText());
if(event.action == "Down") {
for(rt=0;rt<4;rt++){
mh[rt].SetBackColor("#00000000");
}
app.Vibrate( "0,100,30,100,50,300" );
mh[self.index].Animate(GetRandomAnim(),null, 350);
mh[self.index].SetBackColor("#a969ea69");
if(mi[self.index]=="Back" ) SendCommand("Back")
else if(mi[self.index]=="Sleep" ) SendCommand("Sleep")
else if(mi[self.index]=="Voice" ) StartListening()
else if(mi[self.index]=="Menu" ) SendCommand("Info")

}
	//alert(JSON.stringify(event.source));
	}

async function CheckIP()
{
	if(app.FileExists("roku-remote.txt")){
		contents = app.ReadFile( "roku-remote.txt" ).split(",");
	//	txt.SetText(  contents[0] );
 //   txt2.SetText(  contents[1] );
    	if(utils.Confirm('We already have saved a Roku Device called: \r\n\r\nonn. 65” Class 4K UHD (2160P) LED Roku Smart Television HDR'+/*contents[1].replace("32","65")+*/" connected to the same AP with the following IP: \r\n\r\n"+contents[0]+". \r\n\r\nIf this IP is not the same as the Roku device you want to control, do you want to search for a new one?")) app.DeleteFile( "roku-remote.txt" ), CheckIP();
  }else{
	await GetRokuTVIP();
	}

}

async function GetRokuTVIP() {
    ip = app.GetRouterAddress();
    parts = ip.split(".");
    size = parts.length;
    fromNum = parseInt(parts[size - 1]);
    toNum = 155;

    for (c = toNum; c > fromNum; c--) {
        if (found) {
            break;
        }
				rIp = rokuIP =  `${parts[0]}.${parts[1]}.${parts[2]}.${c}`;
        url = `http://${parts[0]}.${parts[1]}.${parts[2]}.${c}:8060/query/device-info`;

        try {
            app.ShowPopup(`Checking URL: \r\n${url}`, "Long, Top");
            await sendHttpRequest(url);
        } catch (error) {
            app.ShowPopup(`Error at ${url}: \r${error}`);
        }
    }
}

async function sendHttpRequest(url) {
    return new Promise((resolve, reject) => {
        app.HttpRequest("GET", url, null, null, (error, reply, status) => {
            if (status === 200) {
                found = true;
                deviceName = reply.slice( reply.indexOf("<friendly-device-name>") + 22, reply.indexOf("</friendly-device-name>") );
                deviceMac = reply.slice( reply.indexOf("<wifi-mac>") + 10, reply.indexOf("</wifi-mac>") );
                deviceNetwork = reply.slice( reply.indexOf("<network-name>") + 14, reply.indexOf("</network-name>") );
             
             
                   //deviceName = reply.slice( reply.indexOf("<default-device-name>") + 21, reply.indexOf("</default-device-name>") );
             
                //txt.SetText(  rokuIP );
                //txt2.SetText(  deviceName );
  //             txtTab4.SetText( deviceMac );
                app.WriteFile( "device-info.txt", reply );
                app.WriteFile( "roku-remote.txt", rokuIP+"," +deviceName + ","+deviceMac + ","+deviceNetwork);
               // resolve(reply);
                 resolve(deviceName);
            } else {
                reject(error || "Request failed");
            }
        });
    });
}

 

 