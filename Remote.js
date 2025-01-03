// Initialize the app and start listening
cfg.Light, cfg.MUI, cfg.Portrait;

app.LoadPlugin( "Support" );
app.LoadPlugin( "Utils" );
var found = false;
var animations = app.CreateSupport().AnimationManager().keys;
var animLength = animations.length;

function OnStart() {
app.ExtractAssets( app.GetAppPath()+"ip.txt", "ip.txt", true );
    app.SetTitle("Roku Remote");

 

    // Create a layout with vertical orientation

     lay = app.CreateLayout("linear", "Vertical, VCenter");

 sup = app.CreateSupport();
 
 var animations = app.CreateSupport().AnimationManager().keys;
var animLength = animations.length;
utils = app.CreateUtils("LuilloSoft Inc.");
	
	rColor = utils.RandomHexColor(false);
	app.SetStatusBarColor(  rColor)
	app.SetNavBarColor( rColor )
CreateActionBar();
CreateMenuBar(rColor)
 grid = sup.CreateGridLayout();
 grid.SetColCount( 4 );
 lay.AddChild( grid );
 
 

    db = app.OpenDatabase( "/storage/emulated/0/Download/Remote.sqlite" );
    //alert(db.GetName());
        //Create a table (if it does not exist already).  
    //db.ExecuteSql( "Drop table remoteButtons;");
    db.ExecuteSql( "CREATE TABLE IF NOT EXISTS remoteButtons " +  
        "(id integer primary key AUTOINCREMENT, layout text, caption text, command text)" );
DisplayAllRows();

    // Create buttons for each command
/*CreateButton(lay, "Back", "Back");
CreateButton(lay, "Sleep", "Sleep");
CreateButton(lay, "Home", "Home");
CreateButton(lay, "Power", "Power");*/

CreateButton(lay, "", "");
CreateButton(lay, "Up", "Up");
CreateButton(lay, "", "");
CreateButton(lay, "", "");
//CreateButton(lay, "🟠 Down ", "VolumeDown");
CreateButton(lay, "Left", "Left");
CreateButton(lay, "Ok", "Select");
CreateButton(lay, "Right", "Right");
CreateButton(lay, "", "");
CreateButton(lay, "", "");
CreateButton(lay, "Down", "Down");
CreateButton(lay, "", "");
CreateButton(lay, "", "");
CreateButton(lay, "", "");
CreateButton(lay, "", "");
CreateButton(lay, "", "");
CreateButton(lay, "🟠 Up   ", "VolumeUp");
CreateButton(lay, "", "");
CreateButton(lay, "", "");
CreateButton(lay, "", "");
CreateButton(lay, "🟠 Down ", "VolumeDown");
//CreateButton(lay, "🟠 Mute ", "VolumeMute");
CreateButton(lay, "", "");
CreateButton(lay, "", "");
CreateButton(lay, "", "");
//CreateButton(lay, "🟠 Down ", "VolumeDown");
CreateButton(lay, "🟠 Mute ", "VolumeMute");
CreateButton(lay, "", "");
CreateButton(lay, "", "");
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
    alert(s);
    //txt.SetText( s )  
}  

// Function to create buttons

function CreateButton(lay, text, command) {
    db.ExecuteSql( "INSERT INTO remoteButtons (caption, command)" +   
      " VALUES (?,?)", [text, command], null, ()=>{app.ShowPopup( "Error" );});
      
    btn = app.CreateButton(text, 0.25, 0.070,"AutoShrink");
    btn.SetFontFile( "Misc/ArchitectsDaughter-Regular.ttf" );
    btn.SetTextSize( 12 );
    if(text=="🟠 Up   " || text == "🟠 Down " || text == "🟠 Mute "){
    	btn.SetTextColor( "#000000" );
    	btn.SetTextShadow( 4, 0, 0, MUI.colors.deepOrange.lighten1 );
    	
    	btn.SetBackGradient(  MUI.colors.gray.darken2, MUI.colors.gray.lighten2, MUI.colors.gray.darken1);
 btn.SetStyle(MUI.colors.gray.lighten3, MUI.colors.gray.lighten1, 5, MUI.colors.gray.darken4, 1,1);
       }
       if(text=="Up" || text == "Down" || text == "Left" || text == "Right" || text == "Ok"){
       	btn.SetTextColor( "#ffffff" );
    	btn.SetTextShadow( 7, 0, 0, MUI.colors.deepPurple.darken4);
    	
    	btn.SetBackGradient(  MUI.colors.deepPurple.darken2, MUI.colors.deepPurple.lighten2, MUI.colors.deepPurple.darken1);
 btn.SetStyle(MUI.colors.deepPurple.lighten3, MUI.colors.deepPurple.lighten1, 5, MUI.colors.deepPurple.darken4, 1,1);
  
       }
    //self = this;
    btn.data["command"]=command;
		//self.command = command;
    btn.SetOnTouch(function() {  self = this; self.Animate("RubberBand", null, 350); SendCommand(self.data["command"]) });
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

    
    
    } else {

        app.ShowPopup("Command not recognized");

    }

}

 

// Function to send a command via HTTP to Roku

function SendCommand(command) {
    var baseUrl = "http://[ROKU_IP]:8060/keypress/".replace("[ROKU_IP]", app.ReadFile( "ip.txt" ) );
    var xhr = new XMLHttpRequest();
    xhr.open("POST", baseUrl + command, true);
    xhr.send();
    xhr.onload = function() {
        if (xhr.status == 200)
            app.ShowPopup("The [" +command +"] command was executed successfully.");
        else
            app.ShowPopup("Failed to execute command. " + command);
    };
}

function ChangeToApp(appID) {
    var baseUrl = "http://[ROKU_IP]:8060/Launch/".replace("[ROKU_IP]", app.ReadFile( "ip.txt" ) );
    var xhr = new XMLHttpRequest();
    xhr.open("POST", baseUrl + command, true);
    xhr.send();
    xhr.onload = function() {
        if (xhr.status == 200)
            app.ShowPopup("The [" +appID+"] command was executed successfully.");
        else
            app.ShowPopup("Failed to execute command. " + command);
    };
}

function GetRandomAnim()
{
	gra = animations[utils.RandomIntegerRange(0, animLength)];
//	app.ShowPopup( "Animation: "+gra + tvar);
	if(gra.includes("out") || gra.includes("Out") || gra.includes("Slide")) {
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
    txtSearch.SetPadding( 0,2,0,10, "dip" );
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
	layHoriz2.SetSize( 1.0, 0.0991 );

mh = new Array();
mv = new Array();
mi = new Array();
mt = new Array();
mi = ["Back","Sleep","Voice","Menu"];
mi2 = ["arrow_back","more_time","speaker_notes","menu_book"];
for(c=0;c<4;c++){
mh[c] = app.CreateLayout( "Linear", "Vertical" );
mh[c].SetSize(0.25, 0.85);
if(c==0) mh[c].SetBackColor("#00" + col.replace("#",""));
layHoriz2.AddChild( mh[c] );
for(d=0;d<2;d++){
mv[d] = app.CreateLayout( "Linear", "Vertical,VCenter" );
//if(d==0) { mv[d].SetSize(1.0, 0.25);}else{mv[d].SetSize(1.0, 1.75);}
//if(d==0) mv[d].SetBackColor("#ef000000");
if(d==0) mt[c] = app.CreateText( mi2[c] ), mt[c].SetMargins(0.01,0.01,0.01,0.01), mt[c].index = c, mt[c].SetOnTouch(mt_OnTouch),mt[c].SetFontFile("Misc/MaterialIcons-Regular.ttf"), mv[d].AddChild(mt[c]), mt[c].SetTextSize(24), mt[c].SetTextColor("#ffffff"), mt[c].SetTextShadow(5,2,2,"#000000");
if(d==1) mt[c] = app.CreateText( mi[c] ), mv[d].AddChild(mt[c]), mt[c].index = c, mt[c].SetOnTouch(mt_OnTouch),mt[c].SetTextColor("#ffffff"),  mt[c].SetTextShadow(5,0,0,"#000000"),mt[c].SetTextSize(12);
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
    	if(utils.Confirm("We already have saved a Roku Device called: "+contents[1]+" with IP: "+contents[0]+". You want to search for a new one?")) app.DeleteFile( "roku-remote.txt" ), CheckIP();
  }else{
	await GetRokuTVIP();
	}

}

async function GetRokuTVIP() {
    ip = app.GetRouterAddress();
    parts = ip.split(".");
    size = parts.length;
    fromNum = parseInt(parts[size - 1]);
    toNum = 164;

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

 

 