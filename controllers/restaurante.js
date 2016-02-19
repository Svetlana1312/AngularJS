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

// añadir el nuevo usuario a la base de datos
$scope.addUser = function (userDetails) {

$http
.post(usersUrl,userDetails)
.success(function (data) {
		$scope.message = "El usuario se ha dado de alta con exito";
})
.error(function (error) {
		$scope.data.errorInsercion = error;
		$window.location.reload();
});


};// final de addUser

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

$scope.message = "Ready";

// funcion de feedback de error del formulario de entrada datos de nuevo usuario
$scope.getError = function (error) {
	if (angular.isDefined(error)) {
		if (error.required) {
				return "Please enter a value";
		} else if (error.email) {
		return "Please enter a valid email address";
		}
	}
};

})
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
$scope.authenticationError = error;
$scope.mensajeLog  = "Error login";
});
};// final de authenticate



})
.controller("userCtrl",function($scope, $http, $location,usersUrl,authUrl,userUrl,logOutUrl,$window){

// funcion de cerrar sesion
$scope.logOut=function(){

$http.post(logOutUrl, {
withCredentials: true
})
.success(function(data){
                   $window.location.reload();
				   
                        })
.error(function(error){
data.logOutError = "Error del logout";
});

}; // final de logOut

});