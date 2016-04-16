angular.module('isosurface')
 
.service('MainService', ['$q','savingService', function($q, savingService) {
	var cuboL = 10;
	var cube = null;
	var visibleCube = false;
	var dynamicTexture;
	var multipleFigures = true;
	var customUniforms;
	var selectedMaterialOn = false;
	var customUniforms2;
	var customUniforms3;
	var uniforms;
	var clock = new THREE.Clock(1);
	var outlineMesh;
	var lastTimestampCube;
	var lastMeshPosition=null;
	var testdata = {};
	var cambioFigura = true;
	var texture=null;
	var texture2=null;
	var texturefloor=null;
	var objectToSave={//prueba de si mejora la performance
    	"nameEquationToSave": null,
    	"equationGeometryData": null,
    	"dims": null,
    	"verticesLength": null,
    	"facesLength": null,
    	"introducedEquation": null,
    	"boundingBox": null,//FIX_ME agregar input de las defaults dims
	};

	window.addEventListener('resize', changeCameraOnWindowResize, false );//FIX_ME USE ANGULAR


	var object = new THREE.Object3D();
	object.position.set(0,0,40);
	var angleQuaternion = new THREE.Quaternion();
	var sensor;
	var floor;//FIX_ME poner en view
	var showFloor=true;
	var enabled = true;
	var verticalMovement = true;
	var movementSpeed = 40.0;
	var angle = 0;
	var keyboardEvent=null;
	var lastTimestamp = 0; 

	var ZAXIS = new THREE.Vector3(0, 0, 1);
	var YAXIS = new THREE.Vector3(0, 1, 0);  
	
	var view={
		'surfacemeshes' : [10],
		'wiremeshes' : [10],
		'currentMesh' : 0,
		'spotLight' : null,
		'light' : null,
		'scene' : null,
		'camera' :null,
		'cameraControl': null,
	}

	var oculus={
		'effect' :null,
		'vrControls': null,
		'vrMode': false
	}

	var stats= null;
	var renderer =null;

var observerCallbacks=[]

	return {
		'render':render,
		'animate': animate,
		'init': init,
		'initCOSARARA':initCOSARARA,
		'enterVr':enterVr,
		'updateKeyboardEvent':updateKeyboardEvent,
		'shutDownAmbient':shutDownAmbient,
		'updateMesh':updateMesh,
		'updateCurrentMesh':updateCurrentMesh,
		'generateGeometry': generateGeometry,
		'updateImage': updateImage,
		'geometryHandler': geometryHandler,
		'saveEquation': saveEquation,
		'loadGeometry': loadGeometry,
		'updateColor':updateColor,
		'registerObserverCallback': registerObserverCallback,
		'notifyObservers':notifyObservers,
		'calculateZoomBB':calculateZoomBB,
		'cubeEnlarge':cubeEnlarge,
		'changeCubeMode':changeCubeMode,
		'lavaMaterial':lavaMaterial,
		'moveMesh':moveMesh,
		'toggleFacets':toggleFacets,
		'toggleEdges': toggleEdges,
		'toggleFloor': toggleFloor,
		'waterMaterial':waterMaterial,
		'selectedMaterialTurnOn':selectedMaterialTurnOn,
		'selectedMaterialTurnOff':selectedMaterialTurnOff,
		'matrixMaterial':matrixMaterial,
		'metalMaterial':metalMaterial,
		'jellyMaterial':jellyMaterial,
		'getLastMeshPosition': getLastMeshPosition,
		
		'toggleMultipleFigures': toggleMultipleFigures,
		'getMultipleFiguresValue': getMultipleFiguresValue,

		'isCubeOn':isCubeOn,
	};
	function isCubeOn(){
		return visibleCube;
	}
	function getMultipleFiguresValue(){
		return multipleFigures;
	}
	function toggleMultipleFigures(){
		multipleFigures=!multipleFigures;
	}

	function getLastMeshPosition(){
		return lastMeshPosition;
	}

	function jellyMaterial(){
		var noiseTexture = new THREE.ImageUtils.loadTexture( 'images/cloud.png' );
		noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping; 
		
	
		var jellyTexture = new THREE.ImageUtils.loadTexture( 'images/jelly.jpg' );
		jellyTexture.wrapS = jellyTexture.wrapT = THREE.RepeatWrapping; 

		// use "this." to create global object
		customUniforms3 = {
			baseTexture: 	{ type: "t", value: jellyTexture },
			baseSpeed: 		{ type: "f", value: 0.001 },
			noiseTexture: 	{ type: "t", value: noiseTexture },
			noiseScale:		{ type: "f", value: 0.2 },
			alpha: 			{ type: "f", value: 0.5 },//0.8d
			time: 			{ type: "f", value: 1.0 }
		};

		// create custom material from the shader code above
		//   that is within specially labeled script tags
		var customMaterial2 = new THREE.ShaderMaterial( 
		{
		    uniforms: customUniforms3,
			vertexShader:   document.getElementById( 'vertexShaderJelly'   ).textContent,
			fragmentShader: document.getElementById( 'fragmentShader2' ).textContent
		}   );
	 
		// other material properties
		customMaterial2.side = THREE.DoubleSide;
		customMaterial2.transparent = true;
		view.surfacemeshes[view.currentMesh].children[0].material = customMaterial2;
		view.surfacemeshes[view.currentMesh].children[0].material.needsUpdate = true;
		view.surfacemeshes[view.currentMesh].children[1].material = customMaterial2;
		view.surfacemeshes[view.currentMesh].children[1].material.needsUpdate = true;
	}

	function metalMaterial(){
		var material = new THREE.MeshPhongMaterial( { color: 0xdddddd, specular: 0xaaaaaa, shininess: 30, shading: THREE.SmoothShading,metal:true});
		var material2 = new THREE.MeshPhongMaterial( { color: 0xdddddd, specular: 0xaaaaaa, shininess: 30, shading: THREE.SmoothShading,metal:true,side: THREE.BackSide});
		view.surfacemeshes[view.currentMesh].children[0].material = material;
		view.surfacemeshes[view.currentMesh].children[0].material.needsUpdate = true;
		view.surfacemeshes[view.currentMesh].children[1].material = material2;
		view.surfacemeshes[view.currentMesh].children[1].material.needsUpdate = true;
		
	}

	function matrixMaterial(){
		uniforms = {
	        colour: { type: "c", value: new THREE.Color(0x89ff89) },
	        rows: { type: "f", value: 15},
	        glow: { type: "f", value: 1.0},
	        glowRadius: { type: "f", value: 1.0},
	        charDetail: { type: "f", value: 3.0},
	        speed: { type: "f", value: 10.0},
	        iGlobalTime: { type: "f", value: clock.getDelta(), hidden: 1}
	    };
	    var vertexShader = document.getElementById('vertexShaderMatrix').text;
	    var fragmentShader = document.getElementById('fragmentShaderMatrix').text;
	    material = new THREE.ShaderMaterial(
	        {
	          uniforms : uniforms,
	          vertexShader : vertexShader,
	          fragmentShader : fragmentShader,
	          side : THREE.DoubleSide
	        });
	    view.surfacemeshes[view.currentMesh].children[0].material = material;
		view.surfacemeshes[view.currentMesh].children[0].material.needsUpdate = true;
		view.surfacemeshes[view.currentMesh].children[1].material = material;
		view.surfacemeshes[view.currentMesh].children[1].material.needsUpdate = true;
	}

	function selectedMaterialTurnOn(){
		if(selectedMaterialOn) return;
		selectedMaterialOn = true;
		view.scene.remove(outlineMesh);
		var outlineMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.BackSide } );
		outlineMesh = new THREE.Mesh( view.surfacemeshes[view.currentMesh].children[0].geometry, outlineMaterial );
		outlineMesh.scale.multiplyScalar(1.05);
		outlineMesh.position.x = (view.surfacemeshes[view.currentMesh].position.x)*1.05;
		outlineMesh.position.y = (view.surfacemeshes[view.currentMesh].position.y)*1.05;
		outlineMesh.position.z = (view.surfacemeshes[view.currentMesh].position.z)*1.05;
		view.scene.add( outlineMesh );
	}

	function selectedMaterialTurnOff(){
		selectedMaterialOn = false;
		view.scene.remove(outlineMesh);
	}

	function waterMaterial(){
		var noiseTexture = new THREE.ImageUtils.loadTexture( 'images/cloud.png' );
		noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping; 
		
	
		var waterTexture = new THREE.ImageUtils.loadTexture( 'images/water.jpg' );
		waterTexture.wrapS = waterTexture.wrapT = THREE.RepeatWrapping; 

		// use "this." to create global object
		customUniforms2 = {
			baseTexture: 	{ type: "t", value: waterTexture },
			baseSpeed: 		{ type: "f", value: 1.15 },
			noiseTexture: 	{ type: "t", value: noiseTexture },
			noiseScale:		{ type: "f", value: 0.2 },
			alpha: 			{ type: "f", value: 0.4 },//0.8d
			time: 			{ type: "f", value: 1.0 }
		};

		// create custom material from the shader code above
		//   that is within specially labeled script tags
		var customMaterial2 = new THREE.ShaderMaterial( 
		{
		    uniforms: customUniforms2,
			vertexShader:   document.getElementById( 'vertexShader2'   ).textContent,
			fragmentShader: document.getElementById( 'fragmentShader2' ).textContent
		}   );
	 
		// other material properties
		customMaterial2.side = THREE.DoubleSide;
		customMaterial2.transparent = true;
		view.surfacemeshes[view.currentMesh].children[0].material = customMaterial2;
		view.surfacemeshes[view.currentMesh].children[0].material.needsUpdate = true;
		view.surfacemeshes[view.currentMesh].children[1].material = customMaterial2;
		view.surfacemeshes[view.currentMesh].children[1].material.needsUpdate = true;
	}


	function toggleFloor(){
        if (view.scene.getObjectByName('floor')!=undefined){
        	showFloor=!showFloor
            view.scene.getObjectByName('floor').visible=showFloor;        	
        }
	}

	function toggleEdges(index){
        if (view.scene.getObjectByName(""+index+"-wiremesh")!=undefined){
            view.scene.getObjectByName(""+index+"-wiremesh").visible=!view.scene.getObjectByName(""+index+"-wiremesh").visible;        	
        }
	}

	function toggleFacets(index){
		console.log(index);
        if (view.scene.getObjectByName(""+index)!=undefined){
            view.scene.getObjectByName(""+index).visible=!view.scene.getObjectByName(""+index).visible;        	
            console.log(view.scene.getObjectByName(""+index))
        }
	}

	function moveMesh(position,index){
        if (view.scene.getObjectByName(""+index)!=undefined){
            view.scene.getObjectByName(""+index).position.x=position.x;
            view.scene.getObjectByName(""+index).position.y=position.y;
            view.scene.getObjectByName(""+index).position.z=position.z;        	
        }
	    if (view.scene.getObjectByName(""+index+"-wiremesh")!=undefined){
            view.scene.getObjectByName(""+index+"-wiremesh").position.x=position.x;
            view.scene.getObjectByName(""+index+"-wiremesh").position.y=position.y;
            view.scene.getObjectByName(""+index+"-wiremesh").position.z=position.z;        	
        }

	}

	function lavaMaterial(){
			// base image texture for mesh
		var lavaTexture = new THREE.ImageUtils.loadTexture( 'images/lava.jpg');
		lavaTexture.wrapS = lavaTexture.wrapT = THREE.RepeatWrapping; 
		// multiplier for distortion speed 		
		var baseSpeed = 0.02;
		// number of times to repeat texture in each direction
		var repeatS = repeatT = 4.0;
		
		// texture used to generate "randomness", distort all other textures
		var noiseTexture = new THREE.ImageUtils.loadTexture( 'images/cloud.png' );
		noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping; 
		// magnitude of noise effect
		var noiseScale = 0.5;
		
		// texture to additively blend with base image texture
		var blendTexture = new THREE.ImageUtils.loadTexture( 'images/lava.jpg' );
		blendTexture.wrapS = blendTexture.wrapT = THREE.RepeatWrapping; 
		// multiplier for distortion speed 
		var blendSpeed = 0.01;
		// adjust lightness/darkness of blended texture
		var blendOffset = 0.25;

		// texture to determine normal displacement
		var bumpTexture = noiseTexture;
		bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping; 
		// multiplier for distortion speed 		
		var bumpSpeed   = 0.15;
		// magnitude of normal displacement
		var bumpScale   = 10.0;//40.0;
		
		// use "this." to create global object
		customUniforms = {
			baseTexture: 	{ type: "t", value: lavaTexture },
			baseSpeed:		{ type: "f", value: baseSpeed },
			repeatS:		{ type: "f", value: repeatS },
			repeatT:		{ type: "f", value: repeatT },
			noiseTexture:	{ type: "t", value: noiseTexture },
			noiseScale:		{ type: "f", value: noiseScale },
			blendTexture:	{ type: "t", value: blendTexture },
			blendSpeed: 	{ type: "f", value: blendSpeed },
			blendOffset: 	{ type: "f", value: blendOffset },
			bumpTexture:	{ type: "t", value: bumpTexture },
			bumpSpeed: 		{ type: "f", value: bumpSpeed },
			bumpScale: 		{ type: "f", value: bumpScale },
			alpha: 			{ type: "f", value: 1.0 },
			time: 			{ type: "f", value: 1.0 }
		};
		
		// create custom material from the shader code above
		//   that is within specially labeled script tags
		var customMaterial = new THREE.ShaderMaterial( 
		{
		    uniforms: customUniforms,
		    side:THREE.DoubleSide,
			vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
			fragmentShader: document.getElementById( 'fragmentShader' ).textContent
		}   );
		//fin raro	
		view.surfacemeshes[view.currentMesh].children[0].material = customMaterial;
		view.surfacemeshes[view.currentMesh].children[0].material.needsUpdate = true;
		view.surfacemeshes[view.currentMesh].children[1].material = customMaterial;
		view.surfacemeshes[view.currentMesh].children[1].material.needsUpdate = true;

	}

	function updateText(equation){
		dynamicTexture  = new THREEx.DynamicTexture(3072,1024);
		dynamicTexture.clear();
		dynamicTexture.context.font	= "bolder 90px Verdana";
		//dynamicTexture.drawText('ecuacion aca', 32, 256, 'red');
		dynamicTexture.texture.needsUpdate  = true;
		var geometryt    = new THREE.CubeGeometry( 900, 300, 1);
		var materialt    = new THREE.MeshBasicMaterial({
		    map : dynamicTexture.texture
		})
		mesht    = new THREE.Mesh( geometryt, materialt );
		
		mesht.position.z=-1000;
		view.scene.add( mesht );
		
		//dynamicTexture.drawText(equation, undefined, 256, 'red');
		dynamicTexture.drawTextCooked(equation,{
			lineHeight	: 0.1,
			fillStyle	:'white'
		});
		dynamicTexture.texture.needsUpdate  = true;

	}
	function changeCubeMode(){
		visibleCube = !visibleCube;
	}

	function cubeEnlarge(enlarge){
		if(enlarge)
			cuboL+=1;
		else
			cuboL-=1;

		createZoomCube(false);
	}

//clipping
	function calculateZoomBB(ftc,bb,sa,dim,ie){
		//para probar cree bb sa y ftc (cuando ande mas lo cambio a mas prolijo pablo...)
			if(!visibleCube) return;
			var bounding = view.surfacemeshes[view.currentMesh].children[0].geometry.boundingBox;

			var dipsx = view.surfacemeshes[view.currentMesh].position.x +(bounding.max.x + bounding.min.x) / 2.0;
			var dipsy = view.surfacemeshes[view.currentMesh].position.y +(bounding.max.y + bounding.min.y) / 2.0;
			var dipsz = view.surfacemeshes[view.currentMesh].position.z +(bounding.max.z + bounding.min.z) / 2.0;
			console.log(dipsx);

			var lx= bb[0][1]-bb[0][0];//largo en unidades "matematicas"
			var ex=dim[0]/lx;//cuantas unidades de escena son una matematica
			var mX=((cube.position.x-(cuboL/2))+(bounding.max.x + bounding.min.x) / 2.0 -dipsx)/ex;//diferencia entre el minimo en x y el x del cubo en unidades matematicas
			bb[0][0]+=mX;
			var MX = ((dim[0] -(cube.position.x+(cuboL/2))) -(bounding.max.x + bounding.min.x) / 2.0 +dipsx)/ex;
			bb[0][1]-=MX;


			var ly= bb[1][1]-bb[1][0];//largo en unidades "matematicas"
			var ey=dim[1]/ly;//cuantas unidades de escena son una matematica
			var mY=((cube.position.y-(cuboL/2)) +(bounding.max.y + bounding.min.y) / 2.0 -dipsy)/ey;//diferencia entre el minimo en x y el x del cubo en unidades matematicas
			bb[1][0]+=mY;
			var MY = ((dim[1] -(cube.position.y+(cuboL/2)))-(bounding.max.y + bounding.min.y) / 2.0 +dipsy)/ey;
			bb[1][1]-=MY;


			var lz= bb[2][1]-bb[2][0];//largo en unidades "matematicas"		
			var ez=dim[2]/lz;//cuantas unidades de escena son una matematica
			var mZ=((cube.position.z-(cuboL/2))+(bounding.max.z + bounding.min.z) / 2.0 -dipsz)/ez;//diferencia entre el minimo en x y el x del cubo en unidades matematicas
			bb[2][0]+=mZ;
			var MZ = ((dim[2] -(cube.position.z+(cuboL/2)))-(bounding.max.z + bounding.min.z) / 2.0 +dipsz)/ez;
			bb[2][1]-=MZ;

			visibleCube=false;	
			return geometryHandler(ftc, bb, sa,ie,view.currentMesh);
		
	}

//mover el cubo para pruebas
	function updateZoomCubeAndLights(timestamp){
		var delta = (timestamp - lastTimestampCube) / 1000;
		lastTimestampCube = timestamp;
		var actualMoveSpeed = delta * movementSpeed;
		if(keyboardEvent.moveLeft && visibleCube){
	 		cube.position.x-=actualMoveSpeed;
		}
		if(keyboardEvent.moveRight && visibleCube){
	 		cube.position.x+=actualMoveSpeed;
		}
		if(keyboardEvent.moveForward && visibleCube){
	 		cube.position.z-=actualMoveSpeed;
		}
		if(keyboardEvent.moveBackward && visibleCube){
	 		cube.position.z+=actualMoveSpeed;
		}
		if(keyboardEvent.moveUp && visibleCube){
	 		cube.position.y+=actualMoveSpeed;
		}
		if(keyboardEvent.moveDown && visibleCube){
	 		cube.position.y-=actualMoveSpeed;
		}
		updateLightPosition(actualMoveSpeed);
	}
//prueba del cubo de zoom
	function createZoomCube(changePos){
		if(!changePos)
			var prevpos= cube.position;
		view.scene.remove(cube);
		var material = new THREE.MeshBasicMaterial({color: 0xfffff/*, wireframe: true*/});
		var material2 = new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true});
		var geometry = new THREE.BoxGeometry(cuboL, cuboL, cuboL, 1, 1, 1);
		cube = new THREE.SceneUtils.createMultiMaterialObject(geometry, [material,material2]);
		if(changePos){
			cube.position.x=view.surfacemeshes[view.currentMesh].position.x;
			cube.position.y=view.surfacemeshes[view.currentMesh].position.y;
			cube.position.z=view.surfacemeshes[view.currentMesh].position.z;
		}else{
			cube.position.x = prevpos.x;
			cube.position.y = prevpos.y;
			cube.position.z = prevpos.z;
		}
		cube.name="zoom-cube"
		view.scene.add(cube);
	}


	 //register an observer

	  function registerObserverCallback(callback){
	    observerCallbacks.push(callback);
	  };

	  //call this when you know 'foo' has been changed
	  function notifyObservers(){
	    angular.forEach(observerCallbacks, function(callback){
	      callback();
	    });
	  };

	function updateColor(pos,color,index){
		color=color.replace("#","0x");
		if(pos!=2){
			view.surfacemeshes[index].children[pos].material.map = null;
			view.surfacemeshes[index].children[pos].material.color.setHex(color);
			view.surfacemeshes[index].children[pos].material.needsUpdate = true;
		}else{
			floor.material.map = null;
			floor.material.color.setHex(color);
			floor.material.needsUpdate = true;
		}

	}

	function saveEquation(nameEquationToSave, introducedEquation,boundingBox){
        savingService.saveMesh(
        	nameEquationToSave,
        	objectToSave.equationGeometryData,
        	objectToSave.dims,
        	objectToSave.verticesLength,
        	objectToSave.facesLength,
        	introducedEquation,
        	boundingBox);//FIX_ME agregar input de las defaults dims
	}

	function loadGeometry(geometryId, index){
	    notifyObservers();
    	var deferred = $q.defer();
		var objectToReturn={
			"dimension":null,
			"vertexCount":null,
			"faceCount":null,
			"boundingBox":null,
			"introducedEquation":null
		}
		savingService.loadMesh(geometryId).then(function(response){
			objectToReturn.dimension = response.dimension;
			objectToReturn.vertexCount = response.vertexCount;
			objectToReturn.faceCount = response.faceCount;
			objectToReturn.boundingBox = response.boundingBox;
			objectToReturn.introducedEquation = response.equation;		
			view.currentMesh=index;
			updateMesh(response.data);
			createZoomCube(true);
			updateText(response.equation);
			deferred.resolve(objectToReturn);
		});
        return deferred.promise;
	}

	function geometryHandler(functionToCall, boundingBox, selectedAlgorithm,introducedEquation,index){
	   	var deferred = $q.defer();
		var objectToReturn={
			"dimension":null,
			"vertexCount":null,
			"faceCount":null
		}
		try{
			var equationToRender = new Function("x","y","z",functionToCall);			
			var volume=makeVolume(boundingBox,equationToRender)();
			view.currentMesh=index;						
			var geometry=meshers[selectedAlgorithm](volume.data, volume.dims)
			updateMesh(geometry).then(function(response){
				objectToReturn.dimension= volume.dims
				objectToReturn.vertexCount=geometry.vertices.length
				objectToReturn.faceCount=geometry.faces.length

				objectToSave.dims=volume.dims;
				objectToSave.verticesLength=geometry.vertices.length
				objectToSave.facesLength=geometry.faces.length
				
				updateText(introducedEquation);
				deferred.resolve(objectToReturn);

			});
		}catch(err){
		  console.log("ERROR",err);
		}
        return deferred.promise;
	}

	function updateImage(pos,src,index){		
		if(pos==0){
			texture = THREE.ImageUtils.loadTexture( src );
			view.surfacemeshes[index].children[pos].material.map = texture;
			view.surfacemeshes[index].children[pos].material.needsUpdate = true;
		}else if(pos==1){
			texture2 = THREE.ImageUtils.loadTexture( src );
			view.surfacemeshes[index].children[pos].material.map = texture2;
			view.surfacemeshes[index].children[pos].material.needsUpdate = true;
		}else{
			texturefloor = THREE.ImageUtils.loadTexture( src );
			floor.material.map = texturefloor;
			floor.material.needsUpdate = true;
		}
	}

	function updateCurrentMesh(arrayPos, showedFaces, showedEdges, equation){
		if(!multipleFigures){
			for (var i = view.surfacemeshes.length - 1; i >= 0; i--) {
				if(i!=arrayPos){
			       if (view.scene.getObjectByName(""+i)!=undefined){
            			view.scene.getObjectByName(""+i).visible=false;        	
        			}
			       if (view.scene.getObjectByName(""+i+"-wiremesh")!=undefined){
            			view.scene.getObjectByName(""+i).visible=false;        	
        			}
					view.scene.remove(view.surfacemeshes[i]);
					view.scene.remove(view.wiremeshes[i]);
				}
			};
			
		}
		var previous = view.currentMesh;
		view.currentMesh = arrayPos;		
		if (view.surfacemeshes[view.currentMesh] == null){
			view.surfacemeshes[view.currentMesh] = view.surfacemeshes[previous].clone();
			view.wiremeshes[view.currentMesh] = view.wiremeshes[previous].clone();
		}
		view.surfacemeshes[view.currentMesh].name=""+view.currentMesh
		view.wiremeshes[view.currentMesh].name=""+view.currentMesh+"-wiremesh"
		view.scene.add(view.surfacemeshes[view.currentMesh]);
		view.scene.add(view.wiremeshes[view.currentMesh]);
		view.scene.getObjectByName(""+arrayPos).visible=showedFaces;
		view.scene.getObjectByName(""+arrayPos+"-wiremesh").visible=showedEdges;        	
		updateText(equation);
	}

	function updateKeyboardEvent(keyboard){
		keyboardEvent=keyboard;
	}
	// render the scene
	function render() {
		if(cube!=null)
			cube.visible = visibleCube;
		// update camera controls
		//sacar no va aca
		updateZoomCubeAndLights(Date.now());
		if(customUniforms!=null)
			customUniforms.time.value = clock.getElapsedTime();
		if(customUniforms2!=null)
			customUniforms2.time.value = clock.getElapsedTime();
		if(customUniforms3!=null)
			customUniforms3.time.value = clock.getElapsedTime();
		if (uniforms!=null)
			uniforms.iGlobalTime.value = clock.getElapsedTime();
		
		if (!oculus.vrMode){
			view.cameraControls.update();//sin VR orbita??
			renderer.render(view.scene, view.camera);
		}else{
			oculus.vrControls.update();
			updateGamepad();
			updateFPS(Date.now());
			oculus.effect.render(view.scene, view.camera);
		}
		if(cambioFigura){
			cambioFigura=false;
		    notifyObservers();

		}
	}

	// animation loop
	function animate() {
		// loop on request animation loop
		// - it has to be at the begining of the function
		// - see details at http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
		requestAnimationFrame(animate);
		// do the render
		render();
		// update stats
		stats.update();
	}
  
  	function createSpotLight(){

		var spotLight = new THREE.SpotLight( 0xaaaaaa );
		//var spotLight = new THREE.SpotLight( 0xffffff );
		spotLight.position.set( -100, -200, 10 );

		spotLight.castShadow = true;
		//XXX the quality of the shades are suppose to be increased as I increase the following values
		spotLight.shadowMapWidth = 4096;//1024;
		spotLight.shadowMapHeight = 4096;//1024;

		spotLight.shadowCameraNear = 500;
		spotLight.shadowCameraFar = 4000;
		spotLight.shadowCameraFov = 30;
		view.spotLight=spotLight;
		view.scene.add( spotLight );

  	}

  	function generateGeometry(result){
		var	geometry  = new THREE.Geometry();

		geometry.vertices.length = 0;
		geometry.faces.length = 0;

		for(var i=0; i<result.vertices.length; ++i) {
			var v = result.vertices[i];
			geometry.vertices.push(new THREE.Vector3(v[0], v[1], v[2]));
		}

		for(var i=0; i<result.faces.length; ++i) {
			var f = result.faces[i];
			if(f.length === 3) {
			  	geometry.faces.push(new THREE.Face3(f[0], f[1], f[2]));
			} else if(f.length === 4) {
				geometry.faces.push(new THREE.Face4(f[0], f[1], f[2], f[3]));
			} else {
			  //Polygon needs to be subdivided
			}
		}

		var cb = new THREE.Vector3(), ab = new THREE.Vector3();
		for (var i=0; i<geometry.faces.length; ++i) {
			var f = geometry.faces[i];
			var vA = geometry.vertices[f.a];
			var vB = geometry.vertices[f.b];
			var vC = geometry.vertices[f.c];
			cb.subVectors(vC, vB);
			ab.subVectors(vA, vB);
			cb.cross(ab);
			cb.normalize();
			if (result.faces[i].length == 3) {
				f.normal.copy(cb)
				continue;
			}

			// quad
			if (cb.isZero()) {
			  // broken normal in the first triangle, let's use the second triangle
				var vA = geometry.vertices[f.a];
				var vB = geometry.vertices[f.c];
				var vC = geometry.vertices[f.d];
				cb.subVectors(vC, vB);
				ab.subVectors(vA, vB);
				cb.crossSelf(ab);
				cb.normalize();
			}
			f.normal.copy(cb);
		}

		geometry.verticesNeedUpdate = true;
		geometry.elementsNeedUpdate = true;
		geometry.normalsNeedUpdate = true;

		geometry.computeBoundingBox();
		geometry.computeBoundingSphere();
		geometry.mergeVertices();
		geometry.computeVertexNormals();
		return geometry;
  	}

	function init(){
		//XXX 
		renderer = new THREE.WebGLRenderer({
			antialias: true
		});
		//XXX esto para la sombra no se que puede llegar a romper
//GGG triple G of guillermo

renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = true;

renderer.shadowCameraNear = 3;
//renderer.shadowCameraFar = camera.far;
renderer.shadowCameraFov = 50;

renderer.shadowMapBias = 0.0039;
renderer.shadowMapDarkness = 0.5;
renderer.shadowMapWidth = 2*4096;
renderer.shadowMapHeight = 2*4096;

		//hasta aca la sombra (mal identado intencionalmente)
		renderer.autoClear = false;
		//renderer.setClearColor(0x404040);

		renderer.setSize(window.innerWidth, window.innerHeight);
		document.getElementById('container').appendChild(renderer.domElement);

		// (FPS monitor)- https://github.com/mrdoob/stats.js 
		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.bottom = '0px';
		document.body.appendChild(stats.domElement);

		// create a scene
		view.scene = new THREE.Scene();

		// put a camera in the scene
		view.camera  = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000);
		view.camera.position.set(0, 0, 40);
		view.scene.add(view.camera);

		// XXX create a camera contol
		//cameraControls  = new THREE.TrackballControls(camera, document.getElementById('container'))
		view.cameraControls  = new THREE.OrbitControls(view.camera, document.getElementById('container'))

		// here you add your objects
		// - you will most likely replace this part by your own
		//var light = new THREE.AmbientLight(Math.random()*0xffffff);
		view.light = new THREE.AmbientLight(0xaaaaaa);
		//view.light = new THREE.AmbientLight(0xffffff);
		view.scene.add(view.light);
		
		createSpotLight();

		//Initialize dom elements
		testdata = createTestData();//XXX here we get all preloaded equations and we load them in datasource

		var result=(meshers['Marching Cubes'](testdata["Empty"]().data,testdata["Empty"]().dims))
		updateMesh(result);
		//XXX effect and controls for VR
		oculus.effect = new THREE.VREffect(renderer);
		oculus.vrControls = new THREE.VRControls(view.camera);


		return false;
	}

	function updateMesh(precalculatedGeometry) {//XXX it generates the mesh
		objectToSave.equationGeometryData=precalculatedGeometry;

		
    	var deferred = $q.defer();
		
		view.scene.remove(view.surfacemeshes[view.currentMesh]);
		view.scene.remove(view.wiremeshes[view.currentMesh]);	
		//delete(view.surfacemeshes[view.currentMesh]);
		//delete(view.wiremeshes[view.currentMesh]);
		/*if(view.surfacemeshes[view.currentMesh]!= null&&view.surfacemeshes[view.currentMesh].geometry!=null){
	    	view.surfacemeshes[view.currentMesh].children[0].geometry.dispose();
	    	view.surfacemeshes[view.currentMesh].children[0].material.texture.dispose();
	    	view.surfacemeshes[view.currentMesh].children[0].material.dispose();
	    	view.surfacemeshes[view.currentMesh].children[1].geometry.dispose();
	    	view.surfacemeshes[view.currentMesh].children[1].material.texture.dispose();
	    	view.surfacemeshes[view.currentMesh].children[1].material.dispose();
	    	view.wiremeshes[view.currentMesh].geometry.dispose();
	    	view.wiremeshes[view.currentMesh].material.dispose();
    	}*/


		view.scene.remove(floor);
		/*if(floor!=null){
			floor.geometry.dispose();
			//floor.material.texture.dispose();
	    	floor.material.dispose();

		}*/

		var geometry = generateGeometry(precalculatedGeometry);
	
		if(texture==null){
			texture = THREE.ImageUtils.loadTexture('ejercicio12.jpg', {}, function() {//FIX_ME
				                  renderer.render(view.scene);
				            });
		}
		if(texture2==null){
			texture2 = THREE.ImageUtils.loadTexture('ejercicio13.jpg', {}, function() {
			                  renderer.render(view.scene);
			            });
		}
		assignUVs(geometry);
		//XXX This makes the multicolor mesh
		//var material  = new THREE.MeshNormalMaterial();
		//var material  = new THREE.MeshPhongMaterial(
		var material = new THREE.MeshLambertMaterial({
			//color: 0x2194CE,
			/*shading: THREE.SmoothShading,
			specular: 0x111111,
			shininess: 33,*/
			map:texture,
		 });
		var material2 = new THREE.MeshLambertMaterial({
			//color: 0x2194CE,
			/*shading: THREE.SmoothShading,
			specular: 0x111111,
			shininess: 33,*/
			map:texture2,
		 });
		 
		//XXX this will make the mesh visible in both sides
		//material.side = THREE.DoubleSide;


		material2.side = THREE.BackSide;
		
		//surfacemesh = new THREE.Mesh(geometry, material);
		view.surfacemeshes[view.currentMesh] = THREE.SceneUtils.createMultiMaterialObject(geometry, [material,material2]);
		view.surfacemeshes[view.currentMesh].doubleSided = true;
		view.surfacemeshes[view.currentMesh].name=""+view.currentMesh;

		var wirematerial = new THREE.MeshBasicMaterial({
			color: 0xffffff
			, wireframe : true
		});
		
		view.wiremeshes[view.currentMesh] = new THREE.Mesh(geometry, wirematerial);
		view.wiremeshes[view.currentMesh].doubleSided = true;
		view.wiremeshes[view.currentMesh].name=""+view.currentMesh+"-wiremesh"
		view.scene.add(view.surfacemeshes[view.currentMesh]);
		view.scene.add(view.wiremeshes[view.currentMesh]);
		//PPP
		if (view.scene.getObjectByName(""+view.currentMesh)!=undefined){
            lastMeshPosition=view.scene.getObjectByName(""+view.currentMesh).position;
        }
		
		//geometry.computeBoundingBox();
		var bb = geometry.boundingBox;

		view.wiremeshes[view.currentMesh].position.x = view.surfacemeshes[view.currentMesh].position.x = -(bb.max.x + bb.min.x) / 2.0;
		view.wiremeshes[view.currentMesh].position.y = view.surfacemeshes[view.currentMesh].position.y = -(bb.max.y + bb.min.y) / 2.0;
		view.wiremeshes[view.currentMesh].position.z = view.surfacemeshes[view.currentMesh].position.z = -(bb.max.z + bb.min.z) / 2.0;

		//floor
		var geometryf = new THREE.PlaneGeometry( 1000, 1000, 1, 1 );
		//var materialf = new THREE.MeshLambertMaterial( { color: 0x0000ff } );
		if(texturefloor==null){
			texturefloor = THREE.ImageUtils.loadTexture('ejercicio12.jpg', {}, function() {//FIX_ME
				                  renderer.render(view.scene);
				            });
		}
		var materialfloor = new THREE.MeshLambertMaterial({
			//color: 0x2194CE,
			//shading: THREE.SmoothShading,
			//specular: 0x111111,
			//shininess: 33,
			map:texturefloor,
		 });
		floor = new THREE.Mesh( geometryf, materialfloor);
		floor.name="floor"
		floor.material.side = THREE.DoubleSide;
		floor.rotation.x = 90*(Math.PI/180);
		floor.position.y = view.surfacemeshes[view.currentMesh].position.y -bb.min.y ;
		view.scene.add(floor);


		//shades
		view.surfacemeshes[view.currentMesh].children[0].castShadow = true;
		view.surfacemeshes[view.currentMesh].children[0].receiveShadow = true;
		view.surfacemeshes[view.currentMesh].children[1].castShadow = true;
		view.surfacemeshes[view.currentMesh].children[1].receiveShadow = true;
		floor.receiveShadow = true;
		deferred.resolve(precalculatedGeometry);
		cambioFigura=true;


        return deferred.promise;
	}

	//XXX moving light
	
	function updateLightPosition(actualMoveSpeed){
		actualMoveSpeed = 20;
		view.spotLight.position.x+=actualMoveSpeed*keyboardEvent.light.moveX;
		view.spotLight.position.y+=actualMoveSpeed*keyboardEvent.light.moveY;
		view.spotLight.position.z+=actualMoveSpeed*keyboardEvent.light.moveZ;	
	}
	
	//end moving light
	//XXX switch off the ambient light
	function shutDownAmbient(){
		view.light.visible = !view.light.visible;
	}
	//end switching off

	//XXX texture mapping - stackoverflow
	 function assignUVs( geometry ){

	    geometry.computeBoundingBox();

	    var max     = geometry.boundingBox.max;
	    var min     = geometry.boundingBox.min;

	    var offset  = new THREE.Vector2(0 - min.x, 0 - min.y);
	    var range   = new THREE.Vector2(max.x - min.x, max.y - min.y);

	    geometry.faceVertexUvs[0] = [];
	    var faces = geometry.faces;

	    for (i = 0; i < geometry.faces.length ; i++) {
			var v1 = geometry.vertices[faces[i].a];
			var v2 = geometry.vertices[faces[i].b];
			var v3 = geometry.vertices[faces[i].c];
			geometry.faceVertexUvs[0].push([
				new THREE.Vector2( ( v1.x + offset.x ) / range.x , ( v1.y + offset.y ) / range.y ),
				new THREE.Vector2( ( v2.x + offset.x ) / range.x , ( v2.y + offset.y ) / range.y ),
				new THREE.Vector2( ( v3.x + offset.x ) / range.x , ( v3.y + offset.y ) / range.y )
			]);
	    }
	    geometry.uvsNeedUpdate = true;
	}

	function changeCameraOnWindowResize() {
		if(view.camera!=null){
			view.camera.aspect = window.innerWidth / window.innerHeight;
			view.camera.updateProjectionMatrix();
			if (oculus.vrMode) {
				oculus.effect.setSize(window.innerWidth, window.innerHeight);
			} else {
				renderer.setSize(window.innerWidth, window.innerHeight);
			}			
		}
	}

var selectPressed = false;
var startPressed = false;
	function updateGamepad() {//FIX_ME capazque va en el controller, no estoy seguro
	  	scangamepads();
		for (j in controllers) {
		    var controller = controllers[j];
		    //lights
		    if(Math.abs(controller.axes[2])>0.1)keyboardEvent.light.moveX =controller.axes[2]; else keyboardEvent.light.moveX =0;
		    if(Math.abs(controller.axes[3])>0.1)keyboardEvent.light.moveZ =controller.axes[3]; else keyboardEvent.light.moveZ =0;
		    //wiremesh or not
		    var prevSelect = selectPressed;
		    var prevStart = startPressed;
		    if(controller.buttons[8].pressed/*select*/) selectPressed = true; else selectPressed = false;
		    if(prevSelect && !selectPressed) document.getElementById("showedges").click();//FIX_ME pablo queria usar angular
		    if(controller.buttons[9].pressed/*select*/) startPressed = true; else startPressed = false;
		    if(prevStart && !startPressed) document.getElementById("showfacets").click();//FIX_ME pablo queria usar angular
		    
		    //movement
		    if(controller.buttons[6].pressed/*LT*/) keyboardEvent.moveDown =true; else keyboardEvent.moveDown =false;
		    if(controller.buttons[7].pressed/*RT*/) keyboardEvent.moveUp =true; else keyboardEvent.moveUp =false;
			if(controller.axes[0]<-0.1)keyboardEvent.moveLeft =true; else keyboardEvent.moveLeft =false;
			if(controller.axes[0]>0.1)keyboardEvent.moveRight =true; else keyboardEvent.moveRight =false;
			if(controller.axes[1]<-0.1)keyboardEvent.moveForward =true; else keyboardEvent.moveForward =false;   
			if(controller.axes[1]>0.1)keyboardEvent.moveBackward =true; else keyboardEvent.moveBackward =false;   
		}
	    
	}

	function updateFPS( timestamp ) {

		if ( !enabled ) return;
		if(visibleCube) return;

		view.camera.quaternion.multiplyQuaternions(angleQuaternion, view.camera.quaternion);    
		setFromQuaternionYComponent(object.quaternion, view.camera.quaternion);

		var delta = (timestamp - lastTimestamp) / 1000;
		lastTimestamp = timestamp;
		var actualMoveSpeed = delta * movementSpeed;

		if ( keyboardEvent.moveForward ) object.translateZ( - actualMoveSpeed );
		if ( keyboardEvent.moveBackward ) object.translateZ( actualMoveSpeed );

		if ( keyboardEvent.moveLeft ) object.translateX( - actualMoveSpeed );
		if ( keyboardEvent.moveRight ) object.translateX( actualMoveSpeed );

		if ( verticalMovement && keyboardEvent.moveUp ) object.translateY( actualMoveSpeed );
		if ( verticalMovement && keyboardEvent.moveDown ) object.translateY( - actualMoveSpeed );

		var hasPosition = sensor && sensor.getState().hasPosition;
		var vrCameraPosition;
		if (hasPosition) {
			vrCameraPosition = view.camera.position.clone();
			vrCameraPosition.applyQuaternion(angleQuaternion);
		}
		view.camera.position.copy(object.position);
		if (hasPosition) {
			view.camera.position.add(vrCameraPosition);
		}
	};  

	function setFromQuaternionYComponent (dest, source) {
		var direction = ZAXIS.clone();
		direction.applyQuaternion(source);
		direction.sub(YAXIS.clone().multiplyScalar(direction.dot(YAXIS)));
		direction.normalize();
		dest.setFromUnitVectors(ZAXIS, direction);
	};

	function initCOSARARA(){
	  	if (navigator.getVRDevices) {
			navigator.getVRDevices().then(function (devices){
				// Note: Getting the first device by default.
				// Ideally we should use whatever THREE.VRControls is using.
				var sensor = devices.find(function (device) { 
					return device instanceof PositionSensorVRDevice; 
				});
		  	}.bind(this));
	  	}
	}  	

	function isMobile() {
	  var check = false;
	  (function (a) {
	    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
	      check = true;
	    }
	  })(navigator.userAgent || navigator.vendor || window.opera);
	  return check;
	};




	function enterVr(){
		oculus.vrMode = oculus.vrMode ? false : true;
		//eso intenta arreglar que cuando cambia de modo no se mueva, pero no funca del todo bien
		//object.position.copy(camera.position);
		var el = renderer.domElement;

		if (!isMobile()) {
			oculus.effect.setFullScreen(true);
			return;
		}

		if (el.requestFullscreen) {
			el.requestFullscreen();
		} else if (el.mozRequestFullScreen) {
			el.mozRequestFullScreen();
		} else if (el.webkitRequestFullscreen) {
			el.webkitRequestFullscreen();
		}
		changeCameraOnWindowResize();
	};
	//fimxxxxxxx


}]);
