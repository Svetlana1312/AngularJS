angular.module("restaurante")
.constant("usersUrl", "http://localhost:5500/usuario")
.constant("productosUrl", "http://localhost:5500/producto")
.constant("authUrl", "http://localhost:5500/usuario/login")
.constant("userUrl", "http://localhost:5500/usuario/me")
.constant("logOutUrl", "http://localhost:5500/usuario/logout")
.controller("restauranteCtrl", function ($scope,$window, $http, $location,usersUrl,productosUrl,authUrl,userUrl,logOutUrl) {
// declaramaos la variable data
$scope.data = {
};

// añadir el nuevo usuario a la base de datos
$scope.addUser = function (userDetails) {
$http.post(usersUrl,userDetails)
.success(function (data) {
$scope.message = "El usuario se ha dado de alta con exito";
})
.error(function (error) {
$scope.data.errorInsercion = error;
$window.location.reload();
});

};

// autenticacion de usuario
$scope.authenticate = function (user, pass) {
$scope.mensajeLog="Ready Ya";
$http.post(authUrl, {
username: user,
password: pass
}, {
withCredentials: true
}).success(function (data) {
$scope.mensajeLog  = "Exito de login";
$scope.data.usuarioRegistrado=true;
})
.error(function (error) {
$scope.authenticationError = error;
$scope.mensajeLog  = "Error login";
})
.get(userUrl, {withCredentials: true})
.success(function(data){
$scope.data.usuarioActual = data;
})
.error(function(error){
	$scope.data.errorAutorizacion = "Error";
});
};




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
// funcion de cerrar sesion
$scope.logOut=function(){
$http.post(logOutUrl).success(function(data){
                  $scope.data.usuarioRegistrado = false;
				  $window.location.reload();
                               });

};
});