// Initialize the app and start listening
cfg.Light, cfg.MUI, cfg.Portrait;

app.LoadPlugin( "Support" );

function OnStart() {

    app.SetOrientation("Portrait");

    app.SetTitle("Roku Remote");

 

    // Create a layout with vertical orientation

    var lay = app.CreateLayout("linear", "Vertical, VCenter");

 sup = app.CreateSupport();
 
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
CreateButton(lay, "Back", "Back");
CreateButton(lay, "Sleep", "Sleep");
CreateButton(lay, "Home", "Home");
CreateButton(lay, "Power", "Power");
CreateButton(lay, "", "");
CreateButton(lay, "", "");
CreateButton(lay, "", "");
CreateButton(lay, "🟠 Up   ", "VolumeUp");
CreateButton(lay, "", "");
CreateButton(lay, "Up", "Up");
CreateButton(lay, "", "");
CreateButton(lay, "🟠 Down ", "VolumeDown");
CreateButton(lay, "Left", "Left");
CreateButton(lay, "Ok", "Select");
CreateButton(lay, "Right", "Right");
CreateButton(lay, "🟠 Mute ", "VolumeMute");
CreateButton(lay, "", "");
CreateButton(lay, "Down", "Down");
CreateButton(lay, "", "");
CreateButton(lay, "", "");
CreateButton(lay, "Repeat", "InstantReplay");
CreateButton(lay, "Rev", "Rev");
CreateButton(lay, "Play", "Play");
CreateButton(lay, "Fwd", "Fwd");
    db.Close();
//db.ExecuteSql( "INSERT INTO test_table (data, data_num)" +   
  //      " VALUES (?,?)", ["test", 100], null, OnError )  

   // db.Close();
var layHoriz = app.CreateLayout("linear", "Horizontall, FillX");

lay.AddChild( layHoriz );
    // Create a button to start speech recognition

    var btnSpeech = app.CreateButton("Voice", 0.5, 0.1,"AutoShrink");

    btnSpeech.SetOnTouch(StartListening);

    layHoriz.AddChild(btnSpeech);

   
   
var btnInfo = app.CreateButton("Menu", 0.5, 0.1,"AutoShrink");

    btnInfo.SetOnTouch(()=>{SendCommand("Info");});

    layHoriz.AddChild(btnInfo);

    // Add the layout to the app

    app.AddLayout(lay);

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

    var speech = app.CreateSpeechRec();

    speech.SetOnResult(OnSpeechResult);

    speech.Recognize();

}

 

// Callback function for speech recognition

function OnSpeechResult(result) {

    HandleCommand(result.toLowerCase());

}

 

// Function to handle commands

function HandleCommand(command) {

    if (command.includes("Play")) {

        SendCommand("Play");

    } else if (command.includes("Pause")) {

        SendCommand("Pause");

    } else if (command.includes("Stop")) {

        SendCommand("Stop");

    } else if (command.includes("Up")) {

        SendCommand("Up");

    } else if (command.includes("Down")) {

        SendCommand("Down");

    } else if (command.includes("Left")) {

        SendCommand("Left");

    } else if (command.includes("Right")) {

        SendCommand("Right");

    } else if (command.includes("Ok")) {

        SendCommand("Select");

    } else if (command.includes("Menu")) {

        SendCommand("Home");

    } else if (command.includes("Volume Up")) {

        SendCommand("VolumeUp");

    } else if (command.includes("Volume Down")) {

        SendCommand("VolumeDown");

    } else if (command.includes("Volume Mute")) {

        SendCommand("VolumeMute");

    } else if (command.includes("Power")) {

        SendCommand("Power");

    } else if (command.includes("Netflix")) {

        SendCommand("Launch/YOUR_NETFLIX_APP_ID"); // Replace YOUR_NETFLIX_APP_ID with actual ID

    } else {

        app.ShowPopup("Command not recognized");

    }

}

 

// Function to send a command via HTTP to Roku

function SendCommand(command) {
    var baseUrl = "http://192.168.70.163:8060/keypress/";
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

 


 

 