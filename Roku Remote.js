// Initialize the app and start listening
cfg.Light, cfg.MUI, cfg.Portrait;
app.DisableKeys( 'VOLUME_DOWN,VOLUME_UP' );

app.LoadPlugin( "Utils" );
app.LoadPlugin( "Support" );
var found = false;
var animations = ["NewsPaper","Jelly","Flash","RubberBand","ShakeHorizontal","ShakeVertical","Swing","TaDa","Bounce","BounceLeft","BounceTop","BounceRight","BounceBottom","Fadein","FadeOut","Fall","FallRotate","FlipFromVerticalSwing","FlipFromHorizontal","FlipFromBottom","FlipFromVertical","FlipFromHorizontalSwing","FlipFromTop","FlipFromRight","FlipFromLeft","FlipToHorizontal","FlipToVertical","SlideFromLeft","SlideFromTop","SlideFromRight","SlideFromBottom","SlideToLeft","SlideToTop","SlideToRight","SlideToBottom","ZoominEnter","ZoominExit","ZoominLeft","ZoominTop","ZoominRight","ZoominBottom","ZoomOutExit","ZoomOutLeft","ZoomOutTop","ZoomOutRight","ZoomOutBottom"];
//app.CreateSupport().AnimationManager().keys;
var animLength = animations.length;


function headerfooterAnim(){
rColorTemp= utils.RandomHexColor(false);
utils.SetTheme(rColorTemp);
setTimeout("headerfooterAnim", 4500);
}

function OnStart() {
app.SetOnKey( OnKey );
//app.ExtractAssets( app.GetAppPath()+"ip.txt", "ip.txt", true );
    app.SetTitle("Roku Remote");

 

    // Create a layout with vertical orientation

     lay = app.CreateLayout("linear", "Vertical, VCenter");

sup = app.CreateSupport();
 
 /*var animations = app.CreateSupport().AnimationManager().keys;
var animLength = animations.length;*/
utils = app.CreateUtils("LuilloSoft Inc.");
	
	rColor = utils.RandomHexColor(false);
	app.WriteFile( "log.txt", rColor+"\n", "Append" )
	//app.SetStatusBarColor(  rColor)
	//app.SetNavBarColor( rColor )
	utils.SetTheme(rColor);
CreateActionBar();
CreateMenuBar(rColor)
 grid = sup.CreateGridLayout();
 grid.SetColCount( 4);
 lay.AddChild( grid );
 web = app.CreateWebView( 1,-1 )
 web.SetBackColor( MUI.colors.deepPurple )
 //web.LoadHtml( app.ReadFile("marquee.html") );
 lay.AddChild( web )
 // Fetch the list of installed apps and display them in the WebView
    FetchChannelApps(web);
    
 

    db = app.OpenDatabase( "/storage/emulated/0/Download/rr/buttons.sqlite" );
   // app.GetPermission(  )
    //alert(db.GetName());
        //Create a table (if it does not exist already).  
    //db.ExecuteSql( "Drop table remoteButtons;");
    sql = "CREATE TABLE IF NOT EXISTS remoteBtns1(id integer primary key AUTOINCREMENT not null, layout text, caption text, command text);";
    db.ExecuteSql( sql);
    

    // Create buttons for each command
/*CreateButton(lay, "Back", "Back");
CreateButton(lay, "Sleep", "Sleep");
CreateButton(lay, "Home", "Home");
CreateButton(lay, "Power", "Power");*/

CreateButton(lay, "", "");
CreateButton(lay, "↑ Up", "Up");
CreateButton(lay, "", "");
CreateButton(lay, "", "");
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
CreateButton(lay, "Prime", "13");
CreateButton(lay, "Max", "61322");
CreateButton(lay, "", "");
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
    
//db.ExecuteSql( "INSERT INTO test_table (data, data_num)" +   
  //      " VALUES (?,?)", ["test", 100], null, OnError )  

 

    // Add the layout to the app

    app.AddLayout(lay);
    //headerfooterAnim();
    CheckIP();
    headerfooterAnim();
    DisplayAllRows();
    //db.Close();
    //ChangeToApp("837");

}

// Function to fetch the list of installed apps and display them in the WebView
function FetchChannelApps(webView) {
    url = "http://192.168.70.148:8060/query/apps";
    app.HttpRequest("GET",url, null, null,function(error,response,status) {
        apps = ParseApps(response);
        DisplayAppsInWebView(webView, apps);
    });
}

function CreateGridLayout( w, h, rc, met )
{
	var laym = app.CreateLayout( "Linear", met||"VCenter" );
	laym.GetType = function() { return "GridLayout"; };
	laym.SetSize( w, h );
	laym.row = rc||1;
	laym.childCount = 0;
	laym.parents = [];
	laym.childs = [];
	laym.index = 0;
	laym.Add = laym.AddChild;
	
	laym.rowLayout = app.CreateLayout( "Linear", "Horizontal" );
	laym.Add( laym.rowLayout );
	
	laym.SetRowCount = function( cnt ) { laym.row = cnt; };
	laym.RemoveAll = function() {
	  //md_isdebug = app.IsDebugEnabled();
	  //if( md_isdebug ) app.SetDebugEnabled( false );
		for( var i in laym.parents ) {
			var parent = laym.parents[i];
			laym.RemoveChild( parent );
			}
			laym.parents = laym.childs = [];
			laym.index = 0;
			//if( md_isdebug ) app.SetDebugEnabled( true );
	};
	laym.AddChild = function( child ) { 
	  
		if( laym.childCount%laym.row == 0 ) { 
			laym.rowLayout = app.CreateLayout( "Linear", "Horizontal" ); 
			laym.Add( laym.rowLayout ); 
		}
		laym.childs.push( child );
		laym.parents.push( laym.rowLayout );
		child.index = laym.index++;
		laym.rowLayout.AddChild( child ); 
		laym.childCount++; 
};
	
	return laym;
}

// Function to parse the list of apps from the XML response
function ParseApps(xml) {
    apps = [];
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(xml, "text/xml");
    appNodes = xmlDoc.getElementsByTagName("app");

    for (i = 0; i < appNodes.length; i++) {
        appArray= {
            id: appNodes[i].getAttribute("id"),
            name: appNodes[i].textContent,
            iconUrl: "http://192.168.70.148:8060/query/icon/" + appNodes[i].getAttribute("id")
        };
        apps.push(appArray);
    }
    app.WriteFile( "appArray.json", utils.Stringify(apps) );
    return apps;
}

// Function to display the apps in the WebView with a marquee effect
function DisplayAppsInWebView(webView, apps) {
		method = app.ReadFile( "Method.js" );
    html = "<html><head><script src='ds:/Sys/app.js'></script>" + method + "<body style='background: linear-gradient(to bottom,  #af3995 0%,#880e67 50%,#c3238e 100%); color: white;font-size:10px;margin-top:5px;'>";
    html += "<br/><marquee behavior='scroll' direction='alternate' scrollamount='3' style='background: linear-gradient(to bottom,  #af3995 0%,#880e67 50%,#c3238e 100%);'>";

    for (var i = 0; i < apps.length; i++) {
        html += `<div style='display: inline-block; margin: 5px; text-align: center;background: linear-gradient(to bottom,  #af3995 0%,#880e67 50%,#c3238e 100%);border-radius: 10px 10px 10px 10px;'>
                    <img onClick='javascript:ChangeToApp(this.alt);' alt='${apps[i].id}' src='${apps[i].iconUrl}' style='width: 50px; height: 50px;border-radius: 10px 10px 10px 10px; box-shadow: 0 0 4px 2px #454545;' vspace='3' hspace='4'><br>
                    <span style='text-shadow: 1px 1px 2px #2B2B2B;'><marquee behavior='alternate' direction='left' scrollamount='1' scrolldelay='0.007' style='font-size:4px; padding-top:3px;width:52px;text-shadow: 0 0 2px #454545;'>${apps[i].name}</marquee></span>
                 </div>`;
    }

    html += "</marquee></body></html>";
    //alert(html)
    webView.LoadHtml(html);
    app.WriteFile( "marquee.html", html );
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
    db.ExecuteSql( "select * from remoteBtns1;", [], OnResult ) 
} 

//Callback to show query results in debug.  
function OnResult( results )   
{  
    var s = "";  
    var len = results.rows.length;  
    for(var i = 0; i < len; i++ )   
    {
        var item = results.rows.item(i);
        //CreateButton(eval(item.layout), item.caption,item.command);
        s += item.id + ", " + item.layout + ", " + item.caption + ", " + item.command + "\n";   
    }  
 //   alert(s);
    //txt.SetText( s )  
}  

// Function to create buttons

function CreateButton(lay, text, command) {
var values = ['lay',text, command];
//alert(JSON.stringify(values));
    db.ExecuteSql( "INSERT INTO remoteBtns1(layout, caption, command)" +   
      " VALUES (?,?,?)", values/*[values[0], values[1], values[2]]*/, null, ()=>{alert( "Error" );});
     // if(text=="↑ Up" || text == "↓ Down" || text == "← Left" || text == "Right →" || text == "Ok"){
     if(text=="🟠 Up   " || text == "🟠 Down " || text == "🟠 Mute "){
      btn = app.CreateButton(text, 0.20, 0.065,"AutoShrink");
      //btn.SetOnTouch( btn_OnTouch )
 }else{
    btn = app.CreateButton(text, 0.20, 0.075,"AutoShrink");
    }
    btn.SetFontFile( "Misc/ArchitectsDaughter-Regular.ttf" );
    btn.SetTextSize( 12 );
    if(text=="🟠 Up   " || text == "🟠 Down " || text == "🟠 Mute "){
    	btn.SetTextColor( "#000000" );
    	btn.SetTextShadow( 4, 0, 0, MUI.colors.deepOrange.lighten1 );
    	
    	btn.SetBackGradient(  MUI.colors.gray.darken2, MUI.colors.gray.lighten2, MUI.colors.gray.darken1);
 btn.SetStyle(MUI.colors.gray.lighten3, MUI.colors.gray.lighten1, 5, MUI.colors.gray.darken4, 1,1);
       }
        if(text=="↑ Up"){
       btn = app.CreateImage(  "Img/top.png", -1, -1, "Button")

       }else{
        if(text=="↓ Down" ){
       btn = app.CreateImage(  "Img/bottom.png", -1, -1, "Button")

       }else{
         if(text=="← Left" ){
       btn = app.CreateImage(  "Img/left.png", -1, -1, "Button")

       }else{
        if(text=="Right →"  ){
       btn = app.CreateImage(  "Img/right.png", -1, -1, "Button,HCenter,VCenter")

       }else{
       
       if( text == "Ok"){
       btn.SetSize( 0.165, 0.1095 );
       btn.SetMargins( 0.01, 0.01, 0.01, 0.01 )
       btn.SetPadding( 0.2, 0.7)
       //btn.set
       //btn.SetPosition(  )
       	btn.SetTextColor( "#ffffff" );
    	btn.SetTextShadow( 7, 0, 0, MUI.colors.deepPurple.darken4);
    	
    	//btn.SetBackGradient(  MUI.colors.deepPurple.lighten4, MUI.colors.deepPurple.lighten2, MUI.colors.deepPurple.darken1);
 btn.SetStyle(MUI.colors.purple.lighten2, MUI.colors.purple.darken1,45, MUI.colors.purple.lighten4 ,1,0.375);
  }
       }
       }
       }
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
    btn.SetOnTouch(function() {  self = this; self.Animate(GetRandomAnim(), null, 650); if(parseInt(self.data["command"])>0) {ChangeToApp(self.data["command"]); }else{ SendCommand(self.data["command"]); }});
btn.Hide();
if(btn.data["command"]=="") eval("btn.Gone();");
		grid.AddChild( btn );
		if(btn.data["command"]!="") btn.Animate( "Rubberband", null, 3000 );
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
    var baseUrl = "http://[ROKU_IP]:8060/launch/".replace("[ROKU_IP]", app.ReadFile( "ip.txt" ) );
    app.HttpRequest( "POST", baseUrl, appID, "privateListening=true|private_Listening=true", (error, response, status)=>{if(error) alert("Error:" + error);if(response) alert("Response:" + response);/*if(status) *//*alert("Status:" + status+"\r\n"+response);*/} )
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

 

 