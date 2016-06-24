  var isMenuDisplayed=true;
  $(function(){
      $('#display').click(function(){
        if(isMenuDisplayed){
          $("#info").animate({
              left:'-300px',
              opacity: 0
            },500);
            isMenuDisplayed=false;
        }else{
          $("#info").animate({
              left:'10px',
              opacity: 1
          },500);
          isMenuDisplayed=true; 
        }
      });
  });

angular.module('implicitus')
 
.controller('MainCtrl', ['$scope','MainService','savingService','$timeout','ngToast','$rootScope','$translate', function($scope, MainService, savingService, $timeout, ngToast, $rootScope, $translate) {
    $scope.vrModeEnabled=false;
    ngToast.create('Bienvenido a implicitus');
    $scope.flag="blackbritishflag.jpg";
    $scope.enterVr= function(){
      MainService.enterVr();
    }
    $scope.activateKeyboard= function(){
      $scope.vrModeEnabled=!$scope.vrModeEnabled;
    }
    $scope.multipleFigures=MainService.getMultipleFiguresValue();

    $scope.showLoading=false;
    var functionToCallIni="";
    var functionToCallEnd= ";";
    $scope.equations=[];
    $scope.showFloor=true;
    $scope.backendEnabled=false;
    $scope.algorithms=[
      'Marching Cubes',
      'Marching Tetraheda',
      'Naive Surface Nets'
    ];
    var equationDummy={
      boundingBox: [[-4.0, 4.0, 0.05],
                    [-4.0, 4.0, 0.05],
                    [-4.0, 4.0, 0.05]],
      name: "New Equation",
      selectedAlgorithm: $scope.algorithms[0],
      showFacets: true,
      showEdges: true,
      dimension:[0,0,0],
      vertexCount: 0,
      faceCount:0,
      introducedEquation:"",
      innerColor:"#aaaaaa",
      outterColor:"#aaaaaa",
      innerTexture: null,
      outterTexture:null,
      position:{
        x:0,
        y:0,
        z:0,
      },
      selectedEquation:null,
    }

    $scope.equations.push(angular.copy(equationDummy));
    $scope.currentEquation=0;
  
    $scope.showLavaMaterial=false
    $scope.showWaterMaterial=false
    $scope.selectedMaterialTurnOff=false
    $scope.matrixMaterial=false
    $scope.metalMaterial=false
    $scope.jellyMaterial=false
    $scope.selectedMaterial="None"
    $scope.displayAmibientLight=true;

    $scope.materials=[
      "None",
      "Lava",
      "Water",
      "Matrix",
      "Metal",
      "Jelly",
    ]
    $scope.selectMaterial=function(){
      switch ($scope.selectedMaterial) {
        case "Lava": 
            MainService.lavaMaterial();
            $scope.showLavaMaterial=true
            $scope.showWaterMaterial=false
            $scope.matrixMaterial=false
            $scope.metalMaterial=false
            $scope.jellyMaterial=false
          break;
        case "Water": 
            MainService.waterMaterial();
            $scope.showLavaMaterial=true
            $scope.showWaterMaterial=false
            $scope.matrixMaterial=false
            $scope.metalMaterial=false
            $scope.jellyMaterial=false
          break;
        case "Matrix": 
            MainService.matrixMaterial();
            $scope.showLavaMaterial=true
            $scope.showWaterMaterial=false
            $scope.matrixMaterial=false
            $scope.metalMaterial=false
            $scope.jellyMaterial=false
          break;
        case "Metal": 
            MainService.metalMaterial();
            $scope.showLavaMaterial=true
            $scope.showWaterMaterial=false
            $scope.matrixMaterial=false
            $scope.metalMaterial=false
            $scope.jellyMaterial=false
          break;
        case "Jelly": 
            MainService.jellyMaterial();
            $scope.showLavaMaterial=true
            $scope.showWaterMaterial=false
            $scope.matrixMaterial=false
            $scope.metalMaterial=false
            $scope.jellyMaterial=false
          break;
        case "None": 
            MainService.normalMaterial();
            $scope.showLavaMaterial=false
            $scope.showWaterMaterial=false
            $scope.matrixMaterial=false
            $scope.metalMaterial=false
            $scope.jellyMaterial=false
          break;
      }
    }

    $scope.toggleMultipleFigures=function(){
        MainService.toggleMultipleFigures();
    }

    $scope.switchLight=function(){
        MainService.shutDownAmbient(); 
    }

    $scope.showAxes=false;
    $scope.toggleAxes=function(){
        if ($scope.showAxes){
          MainService.buildAxes(300); 
        }else{
          MainService.removeAxes(); 
        }
        
    }
     
     $scope.addEquation=function(){
        console.log("Add equation")
        $scope.equations.push(angular.copy(equationDummy))

     }

     $scope.updateColor=function(pos,index){
      if(pos==0)
        MainService.updateColor(pos,$scope.equations[index].innerColor,index);
      else if(pos==1)
        MainService.updateColor(pos,$scope.equations[index].outterColor,index);
      else
        MainService.updateColor(pos,$scope.colorfloor,index);
     }

    $scope.updatePosition=function(index){
      var newPosition={
        x:$scope.equations[index].position.x,
        y:$scope.equations[index].position.y,
        z:$scope.equations[index].position.z,
      }
      MainService.moveMesh(newPosition,index);
    }

    var updateShowLoading = function(elem){
      if($scope.showLoading){
        $('#loading').show()
      }else{
        $('#loading').hide()
      }
      $scope.showLoading = !$scope.showLoading;
    };

    MainService.registerObserverCallback(updateShowLoading);

    $scope.selectEquation=function(index){
        if($scope.backendEnabled){
          var equation=$scope.equations[index].selectedEquation;
          MainService.loadGeometry(equation.id, index).then(function(response){
            $scope.equations[index].name=equation.name;
            $scope.equations[index].dimension = response.dimension;
            $scope.equations[index].vertexCount = response.vertexCount;
            $scope.equations[index].faceCount = response.faceCount;
            $scope.equations[index].boundingBox = response.boundingBox;
            $scope.equations[index].introducedEquation = response.introducedEquation;
            $scope.equations[index].position=MainService.getLastMeshPosition();
            MainService.updateCurrentMesh(index, $scope.equations[index].showFacets, $scope.equations[index].showEdges,$scope.equations[index].introducedEquation);
          });  
        }else{


        }
    }

    $scope.toggleEdges=function(index){
      console.log("EDGES")
      MainService.toggleEdges(index);
    }

    $scope.toggleFacets=function(index){
      console.log("FACETS")
      MainService.toggleFacets(index);
    }

    $scope.functionToCall="";
    var keyboardEvents={
      'moveForward' : false,
      'moveBackward' : false,
      'moveLeft' : false,
      'moveRight' : false,
      'moveUp' : false,
      'moveDown' : false,
      'light':{
        'moveX':0,
        'moveY':0,
        'moveZ':0
      }
     }

      String.prototype.replaceAll = function(search, replacement) {
          var target = this;
          return target.replace(new RegExp(search, 'g'), replacement);
      }; 
   
      function replaceOps(){
        $scope.functionToCall = $scope.functionToCall.replaceAll('abs','Math.abs');
      	$scope.functionToCall = $scope.functionToCall.replaceAll('sin','Math.sin');
      	$scope.functionToCall = $scope.functionToCall.replaceAll('sqrt','Math.sqrt');
      	$scope.functionToCall = $scope.functionToCall.replaceAll('cos','Math.cos');
      	$scope.functionToCall = $scope.functionToCall.replaceAll('tan','Math.tan');
      	$scope.functionToCall = $scope.functionToCall.replaceAll('exp','Math.exp');
        $scope.functionToCall = $scope.functionToCall.replaceAll('log','Math.log');
        $scope.functionToCall = $scope.functionToCall.replaceAll('min','Math.min');
        $scope.functionToCall = $scope.functionToCall.replaceAll('max','Math.max');

      }

    $scope.updateCompanyImage=function(p,pos,index){
      MainService.updateImage(pos,URL.createObjectURL(p),index);
      console.log(URL.createObjectURL(p));
    }

    function updateBoundingBoxValues(index){
        $scope.equations[index].boundingBox[1][0]=$scope.equations[index].boundingBox[0][0]
        $scope.equations[index].boundingBox[1][1]=$scope.equations[index].boundingBox[0][1]
        $scope.equations[index].boundingBox[1][2]=$scope.equations[index].boundingBox[0][2]
        $scope.equations[index].boundingBox[2][0]=$scope.equations[index].boundingBox[0][0]
        $scope.equations[index].boundingBox[2][1]=$scope.equations[index].boundingBox[0][1]
        $scope.equations[index].boundingBox[2][2]=$scope.equations[index].boundingBox[0][2]
    }
    $scope.changeLanguage=function(){
      $translate.use('en');
      $scope.flag="spainFlag.png";
    }

    $scope.updateEquation=function(index){
      updateBoundingBoxValues(index)
      try{
        updateShowLoading();
        $timeout(function(){
          try{
            var expr = Parser.parse($scope.equations[index].introducedEquation)
            $scope.functionToCall= functionToCallIni+ "return "+expr.toString(true)+functionToCallEnd;
            console.log($scope.functionToCall);
            replaceOps();  
            //$scope.functionToCall= functionToCallIni+ "return "+$scope.equations[index].introducedEquation+functionToCallEnd;
            var timeIni =(new Date()).getTime();
            MainService.geometryHandler($scope.functionToCall, $scope.equations[index].boundingBox, $scope.equations[index].selectedAlgorithm, $scope.equations[index].introducedEquation, index).then(function(response){
                $scope.equations[index].dimension=response.dimension
                $scope.equations[index].vertexCount=response.vertexCount
                $scope.equations[index].faceCount=response.faceCount
                $scope.equations[index].position=MainService.getLastMeshPosition();
                MainService.updateCurrentMesh(index, $scope.equations[index].showFacets, $scope.equations[index].showEdges,$scope.equations[index].introducedEquation );
                var timeEnd =(new Date()).getTime();
                console.log("time: "+(timeEnd-timeIni)/1000.0)
            });
          }catch(err){
            updateShowLoading();
            throw err;
          }    
        },10,true);
      }catch(err){
        updateShowLoading();
        throw err;
      }
    }
     

    if($scope.backendEnabled){
      savingService.getAllEquations().then(function(response){
        $scope.preloadedEquations=response;
        $scope.equations[$scope.currentEquation].selectedEquation=$scope.preloadedEquations[7]  
        MainService.initCOSARARA();
        MainService.updateKeyboardEvent(keyboardEvents);    
        if(!MainService.init()) MainService.animate();
        $scope.selectEquation(0)
      },function(error){
        console.log("No backend");
      });
    }else{
      $scope.equations[0].introducedEquation="x^2+y^2+z^2-0.2";
      $scope.equations[0].name= "Sphere";
      $scope.updateEquation(0);
      MainService.initCOSARARA();
      MainService.updateKeyboardEvent(keyboardEvents);
      if(!MainService.init()) MainService.animate();
    }


     $scope.saveEquation=function(index){
        console.log("Saving")
        updateBoundingBoxValues(index)
        MainService.saveEquation($scope.equations[index].name, $scope.equations[index].introducedEquation,$scope.equations[index].boundingBox)
     }

     //INITIALIZATION

$scope.toggleFloor=function(){
  MainService.toggleFloor()
}


function onKeyDown( event ) {
  if($scope.vrModeEnabled){
    switch ( event.keyCode ) {
      case 87: /*W*/ keyboardEvents.moveForward = true; break;

      case 65: /*A*/ keyboardEvents.moveLeft = true; break;

      case 83: /*S*/ keyboardEvents.moveBackward = true; break;

      case 68: /*D*/ keyboardEvents.moveRight = true; break;

      case 82: /*R*/ keyboardEvents.moveUp = true; break;
      case 70: /*F*/ keyboardEvents.moveDown = true; break;
      
      case 100: /*4*/ keyboardEvents.light.moveX = -1; break;
      case 102: /*6*/ keyboardEvents.light.moveX = 1; break;
      
      case 98: /*2*/ keyboardEvents.light.moveY = -1; break;
      case 104: /*8*/ keyboardEvents.light.moveY = 1; break;
      
      case 103: /*7*/ keyboardEvents.light.moveZ = -1; break;
      case 105: /*9*/ keyboardEvents.light.moveZ = 1; break;



      case 107: /*+*/ MainService.cubeEnlarge(true); break;
      case 109: /*-*/ MainService.cubeEnlarge(false); break;

      case 16: /*shift*/ MainService.selectedMaterialTurnOn();break;

    }
    MainService.updateKeyboardEvent(keyboardEvents);
  }
};


//XXX hay que pasarle el index
function zoom(index){
  try{
    if($scope.vrModeEnabled && MainService.isCubeOn()){
        updateShowLoading();
        $timeout(function(){
          try{  
            var expr = Parser.parse($scope.equations[$scope.currentEquation].introducedEquation);
            $scope.functionToCall= functionToCallIni+ "return "+expr.toString(true)+functionToCallEnd;
            replaceOps();
            updateBoundingBoxValues(index)
            MainService.calculateZoomBB($scope.functionToCall, $scope.equations[$scope.currentEquation].boundingBox, $scope.equations[$scope.currentEquation].selectedAlgorithm,$scope.equations[$scope.currentEquation].dimension, $scope.equations[$scope.currentEquation].introducedEquation).then(function(response){
                $scope.equations[$scope.currentEquation].dimension=response.dimension
                $scope.equations[$scope.currentEquation].vertexCount=response.vertexCount
                $scope.equations[$scope.currentEquation].faceCount=response.faceCount
                $scope.equations[index].position=MainService.getLastMeshPosition();
            });
          }catch(err){
            updateShowLoading();
            throw err;
          }
        },10,true);
    }
  }catch(err){
    updateShowLoading();
    throw err;
  }     
}

function onKeyUp( event ) {
  if($scope.vrModeEnabled){
    switch ( event.keyCode ) {
      case 87: /*W*/ keyboardEvents.moveForward = false; break;

      case 65: /*A*/ keyboardEvents.moveLeft = false; break;

      case 83: /*S*/ keyboardEvents.moveBackward = false; break;

      case 68: /*D*/ keyboardEvents.moveRight = false; break;

      case 49: /*1*/ MainService.updateCurrentMesh(0, $scope.equations[0].showFacets, $scope.equations[0].showEdges,$scope.equations[0].introducedEquation );
        break;
      case 50: /*2*/ MainService.updateCurrentMesh(1, $scope.equations[1].showFacets, $scope.equations[1].showEdges,$scope.equations[1].introducedEquation );
        break;
      case 51: /*3*/MainService.updateCurrentMesh(2, $scope.equations[2].showFacets, $scope.equations[2].showEdges,$scope.equations[2].introducedEquation );
        break;
      case 52: /*4*/MainService.updateCurrentMesh(3, $scope.equations[3].showFacets, $scope.equations[3].showEdges,$scope.equations[3].introducedEquation );
        break;
      case 53: /*5*/ MainService.updateCurrentMesh(4, $scope.equations[4].showFacets, $scope.equations[4].showEdges,$scope.equations[4].introducedEquation );
        break;
      case 54: /*6*/ MainService.updateCurrentMesh(5, $scope.equations[5].showFacets, $scope.equations[5].showEdges,$scope.equations[5].introducedEquation );
        break;
      case 55: /*7*/ MainService.updateCurrentMesh(6, $scope.equations[6].showFacets, $scope.equations[6].showEdges,$scope.equations[6].introducedEquation );
        break;
      case 56: /*8*/ MainService.updateCurrentMesh(7, $scope.equations[7].showFacets, $scope.equations[7].showEdges,$scope.equations[7].introducedEquation );
        break;
      case 57: /*9*/ MainService.updateCurrentMesh(8, $scope.equations[8].showFacets, $scope.equations[8].showEdges,$scope.equations[8].introducedEquation );
        break;
      case 48: /*0*/ MainService.updateCurrentMesh(9, $scope.equations[9].showFacets, $scope.equations[9].showEdges,$scope.equations[9].introducedEquation ); 
        reak; 
      
      case 82: /*R*/ keyboardEvents.moveUp = false; break;
      case 70: /*F*/ keyboardEvents.moveDown = false; break;
      
      //mover luz
      case 100: /*4*/ keyboardEvents.light.moveX = 0; break;
      case 102: /*6*/ keyboardEvents.light.moveX = 0; break;
      case 98: /*2*/ keyboardEvents.light.moveY = 0; break;
      case 104: /*8*/ keyboardEvents.light.moveY = 0; break;
      case 103: /*7*/ keyboardEvents.light.moveZ = 0; break;
      case 105: /*9*/ keyboardEvents.light.moveZ = 0; break;

      //zoom
      case 101: /*5*/ /*MainService.shutDownAmbient();*/ zoom($scope.currentEquation); break;
      //apagar ambient light
      case 97: /*1*/ 
        MainService.shutDownAmbient(); 
        $scope.displayAmibientLight=!$scope.displayAmibientLight;
      break;
      case 99: /*3*/ MainService.changeCubeMode();break;

      case 77: /*M*/ 
        $scope.toggleMultipleFigures();
        $scope.multipleFigures=!$scope.multipleFigures;
      break;
      case 9: /*TAB*/ 
        MainService.lavaMaterial();
        $scope.multipleFigures=!$scope.multipleFigures;
        $scope.selectedMaterial="Lava"
      break;
      case 20: /*CAPS LOCK*/ 
        MainService.waterMaterial();
        $scope.waterMaterial=!$scope.waterMaterial;
        $scope.selectedMaterial="Water"
      break;
      case 16: /*shift*/ 
        MainService.selectedMaterialTurnOff();
      break;
      case 78: /*N*/ 
        MainService.matrixMaterial();
        $scope.matrixMaterial=!$scope.matrixMaterial;
        $scope.selectedMaterial="Matrix"
      break;
      case 80: /*P*/ 
        MainService.metalMaterial();
        $scope.metalMaterial=!$scope.metalMaterial;
        $scope.selectedMaterial="Metal"
      break;
      case 71: /*G*/ 
        MainService.jellyMaterial();
        $scope.jellyMaterial=!$scope.jellyMaterial;
        $scope.selectedMaterial="Jelly"
      break;
    }
    MainService.updateKeyboardEvent(keyboardEvents);    
  }
};


function onFullscreenChange(e) {
  var fsElement = document.fullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement;

  if (!fsElement) {
    vrMode = false;
  } else {
    // lock screen if mobile
    window.screen.orientation.lock('landscape');
  }
}



document.addEventListener('fullscreenchange', onFullscreenChange);
document.addEventListener('mozfullscreenchange', onFullscreenChange);

  window.addEventListener( 'keydown', onKeyDown, false );
  window.addEventListener( 'keyup', onKeyUp, false );
  


}]);
