angular.module('isosurface')
 
.service('savingService', ['$http','$q', function($http, $q) {


	//var jsonName = "ecuacionJsurfer2.json";
	var serverUrl="http://192.168.0.104:8000"
	return {
		'saveMesh':saveMesh,
		'loadMesh': loadMesh,
		'getAllEquations': getAllEquations,
	};

	function getAllEquations(){
    	var deferred = $q.defer();
		$http.get(serverUrl+"/equations/equation/").success(function(response){
			deferred.resolve(response);
		}).error(function(response){
			deferred.reject(response);
			console.log("Error loading equation",response);
		});
        return deferred.promise;
	}

	function saveMesh(jsonName, surfaceToSave, dimension, vertexCount, faceCount, equation, boundingBox){
		var data={
			"name": jsonName,
			"data" : surfaceToSave,
			"dimension": dimension,
			"vertexCount":vertexCount,
			"faceCount":faceCount,
			"equation":equation,
			"boundingBox": boundingBox
		}
    	var deferred = $q.defer();
		$http.post(serverUrl+"/equations/equation/", data).success(function(response){
			deferred.resolve(response);
			console.log("Equation saved!");
		}).error(function(response){
			deferred.reject(response);
			console.log("Error saving equation",response);
		});
        return deferred.promise;
	}


	function loadMesh(equationId){
    	var deferred = $q.defer();
		$http.get(serverUrl+"/equations/equation/"+equationId).success(function(response){
			deferred.resolve(response);
			console.log("Equation loaded!");
		}).error(function(response){
			deferred.reject(response);
			console.log("Error loading equation",response);
		});
        return deferred.promise;
	}

}]);
