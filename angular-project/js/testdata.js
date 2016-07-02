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