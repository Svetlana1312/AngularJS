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
$scope.navigateTo = function (url){
if($location.path() ===url) 
       $route.reload();
    else 
	   $location.path(url);
};
$scope.data.usuarioRegistrado=true;

// añadir el nuevo usuario a la base de datos
$scope.addUser = function (userDetails) {


$http.post(usersUrl,userDetails)
.success(function (data) {
$scope.message = "El usuario se ha dado de alta con exito";
})
.error(function (error) {
$scope.message = "Error en la insercion";
});


};
$scope.mensajeLog="Ready";
// autenticacion de usuario

$http.get(userUrl, {
withCredentials: true
}).success(function(data){
$scope.data.usuarioActual = data;
})
.error(function(error){
$scope.data.usuarioActual = "Error";
});

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
})
.controller("loginCtrl",function($scope, $http, $location,usersUrl,authUrl,userUrl,logOutUrl){
$scope.logOut=function(){
$http.post(logOutUrl, {
withCredentials: true
})
.success(function(data){
                   navigateTo();
				   
                        });

};
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
$scope.data.usuarioRegistrado=true;

})
.error(function (error) {
$scope.authenticationError = error;
$scope.mensajeLog  = "Error login";
});
};
});