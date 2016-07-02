angular.module('implicitus')
 
.service('equationList', [function() {
	return [
      {
        name:"Esfera",
        equation:"x^2+y^2+z^2-1"
      },
      {
        name:"Toro",
        equation:"(1-(x^2+y^2)^(1/2))^2+z^2-0.25"
      },
      {
        name:"Hipereliptica",
        equation:"(x^6 + y^6 + z^6)^(1.0/6.0) - 1.0"
      },
      {
        name:"Corazon",
        equation:"(2*x*x+y*y+2*z*z-1)^3 - 0.1 * z*z*y*y*y - y*y*y*x*x"
      },
      {
        name:"Cubo",
        equation:"((((x+y+abs(x-y))+(z)+ abs((x+y+abs(x-y))-(z)))+(-z-2)+abs(((x+y+abs(x-y))+(z)+ abs((x+y+abs(x-y))-(z)))-(-z-2)))+(-x-2)+abs((((x+y+abs(x-y))+(z)+ abs((x+y+abs(x-y))-(z)))+(-z-2)+abs(((x+y+abs(x-y))+(z)+ abs((x+y+abs(x-y))-(z)))-(-z-2)))-(-x-2))) + (-y-2)+abs(((((x+y+abs(x-y))+(z)+ abs((x+y+abs(x-y))-(z)))+(-z-2)+abs(((x+y+abs(x-y))+(z)+ abs((x+y+abs(x-y))-(z)))-(-z-2)))+(-x-2)+abs((((x+y+abs(x-y))+(z)+ abs((x+y+abs(x-y))-(z)))+(-z-2)+abs(((x+y+abs(x-y))+(z)+ abs((x+y+abs(x-y))-(z)))-(-z-2)))-(-x-2)))-(-y-2))"
      },
      {
        name:"Tetera",
        equation:"min(((4*(x+y+0.55)^2+4*z^2+200*y^6-0.1)*((2.5*x^2+2.5*z^2+y^2)^2-(2.5*x^2+2.5*z^2))*((40*(x-0.65)^2+ 40*(z)^2+30*(y)^2+2)^2-9*(30*(y)^2+40*(x-0.65)^2)-8*(0.7*x-0.65))-0.4 ),((0.45*x^2+0.45*z^2+2*(1.6*y-1.39)^3*(1+(1.35*y-1.37)))*(x^2+z^2+(y-0.85)^2-0.015)-0.000001))"
      },
      {
        name:"Copa de vino",
        equation:"x^2+z^2-(log(y+3.5))^2-0.02"
      },
      {
        name:"Tornillo",
        equation:"max((x^2 + y^2 - 1),-((x-sin(z*10))^2+(y-cos(z*10))^2-0.8))"
      },
      {
        name:"Water",
        equation:"((0.7*x^2+y^2+0.07*(z-2)^2+0.9)^2-4*(0.7*x^2+y^2)) *((0.7*x^2+y^2+4*(z-0.58)^2+0.9)^2-4*(0.7*x^2+y^2)) *(100*(x+1.52)^2+0.9*y^2+0.55*(z+0.86)^2-1)"
      },
      {
        name:"CSG",
        equation:"(((((x+y+abs(x-y))+(z)+ abs((x+y+abs(x-y))-(z)))+(-z-2)+abs(((x+y+abs(x-y))+(z)+ abs((x+y+abs(x-y))-(z)))-(-z-2)))+(-x-2)+abs((((x+y+abs(x-y))+(z)+ abs((x+y+abs(x-y))-(z)))+(-z-2)+abs(((x+y+abs(x-y))+(z)+ abs((x+y+abs(x-y))-(z)))-(-z-2)))-(-x-2))) + (-y-2)+abs(((((x+y+abs(x-y))+(z)+ abs((x+y+abs(x-y))-(z)))+(-z-2)+abs(((x+y+abs(x-y))+(z)+ abs((x+y+abs(x-y))-(z)))-(-z-2)))+(-x-2)+abs((((x+y+abs(x-y))+(z)+ abs((x+y+abs(x-y))-(z)))+(-z-2)+abs(((x+y+abs(x-y))+(z)+ abs((x+y+abs(x-y))-(z)))-(-z-2)))-(-x-2)))-(-y-2))) - ((x+1)^2+(y+1)^2+(z+1)^2-1.5) + abs((((((x+y+abs(x-y))+(z)+ abs((x+y+abs(x-y))-(z)))+(-z-2)+abs(((x+y+abs(x-y))+(z)+ abs((x+y+abs(x-y))-(z)))-(-z-2)))+(-x-2)+abs((((x+y+abs(x-y))+(z)+ abs((x+y+abs(x-y))-(z)))+(-z-2)+abs(((x+y+abs(x-y))+(z)+ abs((x+y+abs(x-y))-(z)))-(-z-2)))-(-x-2))) + (-y-2)+abs(((((x+y+abs(x-y))+(z)+ abs((x+y+abs(x-y))-(z)))+(-z-2)+abs(((x+y+abs(x-y))+(z)+ abs((x+y+abs(x-y))-(z)))-(-z-2)))+(-x-2)+abs((((x+y+abs(x-y))+(z)+ abs((x+y+abs(x-y))-(z)))+(-z-2)+abs(((x+y+abs(x-y))+(z)+ abs((x+y+abs(x-y))-(z)))-(-z-2)))-(-x-2)))-(-y-2))) + ((x+1)^2+(y+1)^2+(z+1)^2-1.5))"
      },
      {
        name:"CSG2",
        equation:"((x^6+y^6+z^6-1)+(x^2+y^2+z^2-1.3)+abs((x^6+y^6+z^6-1)-(x^2+y^2+z^2-1.3)))-(((y^2+z^2-.5)+(x^2+z^2-.5)-abs((y^2+z^2-.5)-(x^2+z^2-.5)))+(x^2+y^2-.5)-abs(((y^2+z^2-.5)+(x^2+z^2-.5)-abs((y^2+z^2-.5)-(x^2+z^2-.5)))-(x^2+y^2-.5)))+abs(((x^6+y^6+z^6-1)+(x^2+y^2+z^2-1.3)+abs((x^6+y^6+z^6-1)-(x^2+y^2+z^2-1.3)))+(((y^2+z^2-.5)+(x^2+z^2-.5)-abs((y^2+z^2-.5)-(x^2+z^2-.5)))+(x^2+y^2-.5)-abs(((y^2+z^2-.5)+(x^2+z^2-.5)-abs((y^2+z^2-.5)-(x^2+z^2-.5)))-(x^2+y^2-.5))))"
      },
    ];
}]);
