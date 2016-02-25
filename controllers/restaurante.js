angular.module("restaurante")
.constant("usersUrl", "http://localhost:5500/usuario")
.constant("productosUrl", "http://localhost:5500/producto")
.constant("authUrl", "http://localhost:5500/usuario/login")
.constant("userUrl", "http://localhost:5500/usuario/me")
.constant("logOutUrl", "http://localhost:5500/usuario/logout")
.controller("restauranteCtrl", 
    function ($scope,$window, $http, $location,usersUrl,productosUrl,authUrl,userUrl,logOutUrl) {
// declaramaos la variable data
$scope.data = {};
// funcion para navegar de forma que nos interesa resetear a veces
$scope.navigateTo = function (url){
	if($location.path() ===url) 
				$route.reload();
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
		else if (error.patern) {
		return "Por favor, indica un telefono válido";
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
// añadir el nuevo usuario a la base de datos
// inicializar las variables
		 /*    $scope.data.exitoCorreccionPerfil = false;
		     $scope.data.exitoRegistro=false;
			 $scope.data.errorRegistro = false;*/
         				 
$scope.addUser = function (userDetails) {
//if(userDetails.password == userDetails.c_password){
$http
.post(usersUrl,userDetails)
.success(function (data) {
		
		$scope.data.exitoRegistro=true;
		    
})
.error(function (error) {
		$scope.data.errorRegistro = error;
// $window.location.reload();
});



};// final de addUser

})
.controller("recordarCtrl",function($scope,$http,usersUrl){
 $scope.recordarClave  = function(email){
	 $http.get(usersUrl+"?username=" + email)
    .success(function(data){
	if(data[0]){
		$scope.data.exitoRecordar = true;
		$scope.data.clave = data[0].password;
		$scope.data.nombre = data[0].nombre;
		
	}else{
	$scope.data.errorRecordar = true;
	$scope.mensaje  = "No existe un usuario registrado con este email!";
	//$scope.data.email = email;
	}
	
	})
	.error(function(error){
	$scope.data.errorRecordar = true;
	$scope.mensaje  = "No ha sido posible enviar el email!";

	});
 };

//$scope.enviarEmail();
})
.controller("correccionPerfilCtrl", function($scope,$http,usersUrl){
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
		
		$scope.data.exitoCorreccionPerfil = true;
		    
})
.error(function (error) {
		$scope.data.errorRegistro = true;
// $window.location.reload();
});
};
});