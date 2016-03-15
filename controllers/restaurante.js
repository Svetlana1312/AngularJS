angular.module("restaurante")
.constant("usersUrl", "http://localhost:5500/usuario")
.constant("productosUrl", "http://localhost:5500/producto")
.constant("authUrl", "http://localhost:5500/usuario/login")
.constant("userUrl", "http://localhost:5500/usuario/me")
.constant("logOutUrl", "http://localhost:5500/usuario/logout")
.constant("mesasUrl", "http://localhost:5500/mesa")
.constant("reservasUrl", "http://localhost:5500/reserva")
.constant("menusUrl","http://localhost:5500/menu")
.constant("platosUrl","http://localhost:5500/plato")
.constant("platosMenuUrl","http://localhost:5500/platosmenu")
.controller("restauranteCtrl", 
    function ($scope,$window, $http, $location,usersUrl,productosUrl,authUrl,userUrl,logOutUrl) {
// declaramaos la variable data
$scope.data = {reserva :{fecha: new Date()}};
		//var Date fecha ;
		//$scope.data.reserva.fecha = fecha;
// funcion para navegar de forma que nos interesa resetear a veces
$scope.navigateTo = function (url){
	if($location.path() === url) 
				$window.location.reload();
				//$route.path(url);
		else 
				$location.path(url);
}; // final navigateTo

$scope.data.noLogin=true;



// metodo para cargar los datos del usuario logeado

$scope.cargarUsuario = function(){
$http.get(userUrl, {
withCredentials: true
})
.success(function(data){
$scope.data.usuarioActual = data;

})
.error(function(error){
$scope.data.cargarUsuarioError = "El usuario no se ha podido cargar de la base de datos";
});
}; // final de cargarUsuario



// funcion de feedback de error del formulario de entrada datos de nuevo usuario
$scope.getError = function (error) {
	if (angular.isDefined(error)) {
		if (error.required) {
				return "Por favor, rellena este campo";
		} else if (error.email) {
		return "Por favor, indica un correo electrónico válido";
		}
		else if (error.pattern) {
		return "Por favor, indica un teléfono válido";
		}
	}
};

})//final del controler principal
.controller("loginCtrl",function($scope, $http, $location,usersUrl,authUrl,userUrl,logOutUrl){
//autenticacion de usuarios
$scope.authenticate = function (user, pass) {
$http.post(authUrl, {
username: user,
password: pass
}, {
withCredentials: true
})
.success(function (data) {
$scope.mensajeLog  = "Exito de login";
$scope.data.noLogin=false;
$scope.cargarUsuario();
$scope.navigateTo("/home");
})
.error(function (error) {
$scope.data.authenticationError = error;
$("#userNameLogin").focus().select();
});
};// final de authenticate
})
.controller("userCtrl",function($scope, $http,logOutUrl,$window){
// funcion de cerrar sesion
$scope.logOut=function(){
$http.post(logOutUrl, {
withCredentials: true
})
.success(function(data){
                   $scope.navigateTo("/home");
                   $window.location.reload();
				   
                        })
.error(function(error){
$scope.data.logOutError = "Error del logout";
});
}; // final de logOut
})
.controller("registroCtrl", function($scope,$http,usersUrl){
// a�adir el nuevo usuario a la base de datos
// inicializar las variables
		 /*    $scope.data.exitoCorreccionPerfil = false;
		     $scope.data.exitoRegistro=false;
			 $scope.data.errorRegistro = false;*/
$scope.control={};        				 
$scope.addUser = function (userDetails) {
//if(userDetails.password == userDetails.c_password){
$http
.post(usersUrl,userDetails)
.success(function (data) {
		$scope.control.exitoRegistro=true;
})
.error(function (error) {
		$scope.control.errorRegistro = error;
// $window.location.reload();
});



};// final de addUser

})
.controller("recordarCtrl",function($scope,$http,usersUrl){
$scope.control = {};
 $scope.recordarClave  = function(email){
	 $http.get(usersUrl+"?username=" + email)
    .success(function(data){
	if(data[0]){
		$scope.control.exitoRecordar = true;
		
		
	}else{
	$scope.control.errorRecordar = true;
	$scope.mensaje  = "No existe un usuario registrado con este email!";
	
	}
	
	})
	.error(function(error){
	$scope.control.errorRecordar = true;
	$scope.mensaje  = "No ha sido posible enviar el email!";

	});
 };// final de recordarClave

//$scope.enviarEmail();
})
.controller("correccionPerfilCtrl", function($scope,$http,usersUrl){
// inicializar datos de control
 $scope.control = {};
 $scope.data.cambiarClave = false;
 // cargar los datos del usuario logeado al formulario
 $scope.newUser = $scope.data.usuarioActual;
 $scope.newUser.password = "1";
 $scope.newUser.c_password = "1";
  $scope.addUser = function (userDetails) {
 if(!$scope.data.cambiarClave){
   // userDetails.password = null;
   // userDetails.c_password = null; 
   var userLocal = {};
   userLocal.id = userDetails.id;
   userLocal.nombre = userDetails.nombre;
   userLocal.apellidos = userDetails.apellidos;
   userLocal.telefono = userDetails.telefono;
   userDetails = userLocal;
   }
 $http
.put(usersUrl,userDetails)
.success(function (data) {
		
		$scope.control.exitoCorreccionPerfil = true;
		    
})
.error(function (error) {
		$scope.control.errorRegistro = true;
// $window.location.reload();
});
};
}) // final de correccionPerfilCtrl
.controller("reservaCtrl",function($scope,$filter,$http,mesasUrl,reservasUrl){
$scope.control={};
$scope.control.noHayMesa = false;
$http.get(mesasUrl)
.success(function(data){
$scope.data.mesas = data;
})
.error(function(error){
 $scope.control.errorMesas = true;
});
var fecha = $scope.data.reserva.fecha;
$scope.fecha_filtrada = $filter('date')(fecha,"yyyy-MM-dd");
$http.get(reservasUrl + "?fecha="+ $scope.fecha_filtrada + "&hora=12:30")
.success(function(data){
$scope.data.reservas = data;
})
.error(function(error){
 $scope.control.errorReservas = true;
});
})
.controller("menusCtrl",function($scope,$http,$filter,menusUrl,platosUrl,platosMenuUrl){
$scope.control = {};
$scope.precio_menu = 9;
$scope.mensaje="";
$scope.hayMenus =false;
$scope.cargarPlatos = function(){
$http.get(platosUrl + "?tipo=primero").success(function(data){
$scope.primeros = data;
}).error(function(error){
$scope.mensaje = "Los primeros no se han podido cargar!";
});
$http.get(platosUrl + "?tipo=segundo").success(function(data){
$scope.segundos = data;
}).error(function(error){
$scope.mensaje = "Los segundos no se han podido cargar!";
});
$http.get(platosUrl + "?tipo=postre").success(function(data){
$scope.postres = data;
}).error(function(error){
$scope.mensaje = "Los postres no se han podido cargar!";
});
};



$scope.hayMenu = function(fecha){
// cargamos los platos en los combos

// formateamos la fecha con el formato en la base de datos
$scope.fecha_corta = $filter('date')(fecha,"yyyy-MM-dd");
$http.get(menusUrl +  "?fecha=" + $scope.fecha_corta)
.success(function(data){
if(data.length > 0){
$scope.mensaje = "El id del menu es " + data[0].id;
// pedimos los id de los platos que estan en este menu
$http.get(platosMenuUrl + "?idMenu=" + data[0].id)
.success(function(data){
	
	for(i=0;i<15;i++)
	{
		$http.get(platosUrl + "?id="+data[i].idPlato)
		.success(function(data){
			switch(data.tipo){
				case 'primero':
					$scope.agregarPrimero(data);
				break;
				case 'segundo':
					$scope.agregarSegundo(data);
				break;
				case 'postre':
					$scope.agregarPostre(data);
				break;
			}
			
		});
	}
	$scope.hayMenus = true;
	$scope.cargarPlatos();
});
}else{
$scope.nuevoMenu = true;
}


})
.error(function(error){
$scope.mensaje="Error en la consulta de menu por fecha";
});
};

$scope.agregadosPrimeros = [];
$scope.agregadosSegundos = [];
$scope.agregadosPostres = [];
$scope.agregarPrimero = function(plato){
$scope.agregadosPrimeros.push(plato);
};
$scope.agregarSegundo = function(plato){
$scope.agregadosSegundos.push(plato);
};
$scope.agregarPostre = function(plato){
$scope.agregadosPostres.push(plato);
};
// funciona que graba el menu en memoria
$scope.grabarMenu = function(){
var errorAlGuardar = false;
$http.post(menusUrl,{"fecha":$scope.fecha_corta, "precio":$scope.precio_menu})
.success(function(data){
$scope.idMenu = data.id;
//$scope.mensaje = "el id del menu es : " + $scope.idMenu + "<br>";
var j;
for(j=0;j<5;j++){
    var idPrimero=$scope.agregadosPrimeros[j].id;
	var idSegundo=$scope.agregadosSegundos[j].id;
    var idPostre=$scope.agregadosPostres[j].id;

    $http.post(platosMenuUrl,{"idMenu":$scope.idMenu,"idPlato":idPrimero})
	.success(function(data){
	  
	})
	.error(function(error){
    $scope.mensaje += error ;
	errorAlGuardar = true;
	});
	$http.post(platosMenuUrl,{"idMenu":$scope.idMenu,"idPlato":idSegundo})
	.success(function(data){
	  
	})
	.error(function(error){
	//$scope.mensaje += j + " " ;
	errorAlGuardar = true;
	});
	$http.post(platosMenuUrl,{"idMenu":$scope.idMenu,"idPlato":idPostre})
	.success(function(data){
	  
	})
	.error(function(error){
	//$scope.mensaje += j  + " " ;
	errorAlGuardar = true;
	});
	
}
if(!errorAlGuardar){
	
	$scope.nuevoMenu = false;
	$scope.exitoMenu = true;
}
})
.error(function(error){
$scope.mensaje = "Error al grabar el menu.";
});

};
$scope.salirMenu = function(){
	$scope.nuevoMenu = false;
	$scope.exitoMenu = false;
	$scope.mensaje="Se ha dado de alta correctamente el menu!";
	
};
});