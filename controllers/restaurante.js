angular.module("restaurante")
.constant("usersUrl", "http://localhost:5500/usuario")
.constant("productosUrl", "http://localhost:5500/producto")
.constant("authUrl", "http://localhost:5500/usuario/login")
.constant("userUrl", "http://localhost:5500/usuario/me")
.constant("logOutUrl", "http://localhost:5500/usuario/logout")
.controller("restauranteCtrl", function ($scope, $http, $location,usersUrl,productosUrl,authUrl,userUrl,logOutUrl) {
// declaramaos la variable data
$scope.data = {
};

// añadir el nuevo usuario a la base de datos
$scope.addUser = function (userDetails) {

/*$http.get(productosUrl)
.success(function (data) {
$scope.data.productos = data;
$scope.message += $scope.data.productos[0].nombre;
})
.error(function (error) {
$scope.data.error = error;
});
*/
userDetails.tipo = "cliente";
//if (registerForm.$valid) {
$http.post(usersUrl,userDetails).success(function (data) {
$scope.message = "El usuario se ha dado de alta con exito";

})
.error(function (error) {
$scope.message = "Error en la insercion";
});

/*} else {
$scope.message = "";
$scope.showValidation = true;
}*/
};
$scope.mensajeLog="Ready";
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
//$location.path("/home");
}).error(function (error) {
$scope.authenticationError = error;
$scope.mensajeLog  = "Error login";
});
$http.get(userUrl, {
withCredentials: true
}).success(function(data){
$scope.data.usuarioActual = data;

}).error(function(error){$scope.data.usuarioActual = "Error";});
};
$scope.existsUser=function(userName){
  
};
// comprueba que existe el usuario y con esta contraseña


$scope.message = "Ready";

// funcion de error del formulario de entrada datos de nuevo usuario
$scope.getError = function (error) {
if (angular.isDefined(error)) {
if (error.required) {
return "Please enter a value";
} else if (error.email) {
return "Please enter a valid email address";
}
}
};
$scope.logOut=function(){
$http.post(logOutUrl).success(function(data){
                   $scope.data.usuarioRegistrado = false;
				   $scope.user={};
                               });
};
});