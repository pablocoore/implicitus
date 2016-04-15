meshers = {
    'Marching Cubes': MarchingCubes,
    'Marching Tetraheda' : MarchingTetrahedra,
    'Naive Surface Nets': SurfaceNets
};

function memoize(f) {
  var cached = null;
  return function() {
    if(cached === null) { 
      cached = f();
    }
    return cached;
  }
}

function makeVolume(dims, f) {//XXX this generate the mesh coordinates given, the dimenssion and the function
  return memoize(function() {//XXX memoize seems to return a function to execute 
    var res = new Array(3);
    for(var i=0; i<3; ++i) {
      res[i] = 2 + Math.ceil((dims[i][1] - dims[i][0]) / dims[i][2]);
    }
    var volume = new Float32Array(res[0] * res[1] * res[2])
      , n = 0;
    for(var k=0, z=dims[2][0]-dims[2][2]; k<res[2]; ++k, z+=dims[2][2])
    for(var j=0, y=dims[1][0]-dims[1][2]; j<res[1]; ++j, y+=dims[1][2])
    for(var i=0, x=dims[0][0]-dims[0][2]; i<res[0]; ++i, x+=dims[0][2], ++n) {
      volume[n] = f(x,y,z);
    }
    return {data: volume, dims:res};
  });
}

function createTestData() {
  var result = {};

  result['Sphere'] = makeVolume(
    [[-1.0, 1.0, 0.25],
     [-1.0, 1.0, 0.25],
     [-1.0, 1.0, 0.25]],
    function(x,y,z) {
      return x*x + y*y + z*z - 1.0;
    }
  );
  
  result['Torus'] = makeVolume(
    [[-2.0, 2.0, 0.2],
     [-2.0, 2.0, 0.2],
     [-1.0, 1.0, 0.2]],
    function(x,y,z) {
      return Math.pow(1.0 - Math.sqrt(x*x + y*y), 2) + z*z - 0.25;
    }
  );

  result['Big Sphere'] = makeVolume(
    [[-1.0, 1.0, 0.05],
     [-1.0, 1.0, 0.05],
     [-1.0, 1.0, 0.05]],
    function(x,y,z) {
      return x*x + y*y + z*z - 1.0;
    }
  );
  
  result['Hyperelliptic'] = makeVolume(
    [[-1.0, 1.0, 0.05],
     [-1.0, 1.0, 0.05],
     [-1.0, 1.0, 0.05]],
    function(x,y,z) {
      return Math.pow( Math.pow(x, 6) + Math.pow(y, 6) + Math.pow(z, 6), 1.0/6.0 ) - 1.0;
    }  
  );
  
  result['Nodal Cubic'] = makeVolume(
    [[-2.0, 2.0, 0.05],
     [-2.0, 2.0, 0.05],
     [-2.0, 2.0, 0.05]],
    function(x,y,z) {
      return x*y + y*z + z*x + x*y*z;
    }
  );
  
  result["Goursat's Surface"] = makeVolume(
    [[-2.0, 2.0, 0.05],
     [-2.0, 2.0, 0.05],
     [-2.0, 2.0, 0.05]],
    function(x,y,z) {
      return Math.pow(x,4) + Math.pow(y,4) + Math.pow(z,4) - 1.5 * (x*x  + y*y + z*z) + 1;
    }
  );
  
  result["Heart"] = makeVolume(
    [[-2.0, 2.0, 0.05],
     [-2.0, 2.0, 0.05],
     [-2.0, 2.0, 0.05]],
    function(x,y,z) {
      y *= 1.5;
      z *= 1.5;
      return Math.pow(2*x*x+y*y+2*z*z-1, 3) - 0.1 * z*z*y*y*y - y*y*y*x*x;
    }
  );
  
  result["Nordstrand's Weird Surface"] = makeVolume(
    [[-0.8, 0.8, 0.01],
     [-0.8, 0.8, 0.01],
     [-0.8, 0.8, 0.01]],
    function(x,y,z) {
      return 25 * (Math.pow(x,3)*(y+z) + Math.pow(y,3)*(x+z) + Math.pow(z,3)*(x+y)) +
        50 * (x*x*y*y + x*x*z*z + y*y*z*z) -
        125 * (x*x*y*z + y*y*x*z+z*z*x*y) +
        60*x*y*z -
        4*(x*y+x*z+y*z);
    }
  );
  
  result['Sine Waves'] = makeVolume(
    [[-Math.PI*2, Math.PI*2, Math.PI/8],
     [-Math.PI*2, Math.PI*2, Math.PI/8],
     [-Math.PI*2, Math.PI*2, Math.PI/8]],
    function(x,y,z) {
      return Math.sin(x) + Math.sin(y) + Math.sin(z);
    }
  );
  
  result['Perlin Noise'] = makeVolume(
    [[-5, 5, 0.25],
     [-5, 5, 0.25],
     [-5, 5, 0.25]],
    function(x,y,z) {
      return PerlinNoise.noise(x,y,z) - 0.5;
    }
  );
    
  result['Asteroid'] = makeVolume(
    [[-1, 1, 0.08],
     [-1, 1, 0.08],
     [-1, 1, 0.08]],
    function(x,y,z) {
      return (x*x + y*y + z*z) - PerlinNoise.noise(x*2,y*2,z*2);
    }
  );
  
  result['Terrain'] = makeVolume(
    [[-1, 1, 0.05],
     [-1, 1, 0.05],
     [-1, 1, 0.05]],
    function(x,y,z) {
      return  y + PerlinNoise.noise(x*2+5,y*2+3,z*2+0.6);
    }
  );

  result['Ecuacion-jsurfer'] = makeVolume(
    [[-10, 10, 0.05],
     [-10, 10, 0.05],
     [-10, 10, 0.05]],
    function(x,y,z) {
      var a = 0.23;
      var const1=-2*a/125;
      var term1 = Math.pow(x,8)+Math.pow(y,8)+Math.pow(z,8)
      var term2 = -2*Math.pow(x,6)-2*Math.pow(y,6)-2*Math.pow(z,6)
      var term3 = 1.25*Math.pow(x,4)+1.25*Math.pow(y,4)+1.25*Math.pow(z,4)
      var term4 = -0.25*x*x+-0.25*y*y-0.25*z*z
      return const1 + term1 + term2 + term3 + term4 + 0.03125
    }
  );
  result['Ecuacion-eduardo'] = makeVolume(
    [[-10, 10, 0.05],
     [-10, 10, 0.05],
     [-10, 10, 0.05]],
    function(x,y,z) {
		var term1 = ((Math.pow(x,6)+Math.pow(y,6)+Math.pow(z,6)-1)+(Math.pow(x,2)+Math.pow(y,2)+Math.pow(z,2)-0.71)+Math.abs(-(Math.pow(x,6)+Math.pow(y,6)+Math.pow(z,6)-1)+ (Math.pow(x,2)+Math.pow(y,2)+Math.pow(z,2)-0.71)));
		var term2 = -((Math.pow(y,2)+Math.pow(z,2)-.5)+(Math.pow(x,2)+Math.pow(z,2)-.5)-Math.abs((Math.pow(y,2)+Math.pow(z,2)-.5)- (Math.pow(x,2)+Math.pow(z,2)-.5))+ (Math.pow(x,2)+Math.pow(y,2)-.5)- Math.abs((Math.pow(y,2)+Math.pow(z,2)-.5)+ (Math.pow(x,2)+Math.pow(z,2)-.5)-Math.abs((Math.pow(y,2)+Math.pow(z,2)-.5)- (Math.pow(x,2)+Math.pow(z,2)-.5))- (Math.pow(x,2)+Math.pow(y,2)-.5)));
		var term3 = Math.abs(-term1 - term2);
		return term1 + term2 + term3-2;
    }
  );
  result['Doble-cono'] = makeVolume(
    [[-10, 10, 0.25],
     [-10, 10, 0.25],
     [-10, 10, 0.25]],
    function(x,y,z) {
		return Math.pow(y,2)+Math.pow(x,2)-Math.pow(z,2)-0.5;
		}
  );
  result['no se helice o algo'] = makeVolume(
    [[-10, 10, 0.05],
     [-10, 10, 0.05],
     [-10, 10, 0.05]],
    function(x,y,z) {
		return 6*Math.pow(x,2)-2*Math.pow(x,4)-Math.pow(y,2)*Math.pow(z,2);
		}
  );
  
  result['Empty'] = function(){ return { data: new Float32Array(32*32*32), dims:[32,32,32] } };
  
  return result;
}
