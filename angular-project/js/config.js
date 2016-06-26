angular.module('implicitus', ['ngFileUpload', 'ngSanitize', 'ngToast', 'pascalprecht.translate'])
.config(function($provide, $translateProvider) {
    $provide.decorator("$exceptionHandler", ['$delegate','ngToast', function($delegate,ngToast) {
        return function(exception, cause) {
            $delegate(exception, cause);
            //alert(exception.message);
			ngToast.create({
			  className: 'danger',
			  content: exception.message
			});
        };
    }]);
    $translateProvider.translations('en', {
        CONFIGURATION: 'Configuration',
        ALGORITHM: 'Algorithm',
        SHOW_FACETS: 'Show facets',
        SHOW_EDGES: 'Show edges',
        VERTEX_COUNT: 'Vertex count',
        FACE_COUNT: 'Face count',
        EQUATION: 'Equation',
        RESOLUTION: 'Resolution',
        UPDATE: 'Update',
        OUTER_TEXTURE: 'Outer texture',
        INNER_TEXTURE: 'Inner texture',
        FLOOR_TEXTURE: 'Floor texture',
        ADD_EQUATION: 'Add equation',
        SHOW_FLOOR: 'Show floor',
        SELECT_MATERIAL: 'Select material',
        MULTIPLE_FIGURES: 'Multiple figures',
        SWITCH_AMBIENT_LIGHT: 'Switch ambient light',
        SHOW_AXES: 'Show axes',
        WELCOME_MESSAGE: 'Welcome to implicitus',
        TOOGLE_KEYBOARD:'Toogle keyboard',
        LOADING:'LOADING',
        LOAD:'Load',
        SAVE:'Save',    
    }).translations('es', {
        CONFIGURATION: 'Configuración',
        ALGORITHM: 'Algoritmo',
        SHOW_FACETS: 'Mostrar caras',
        SHOW_EDGES: 'Mostrar aristas',
        VERTEX_COUNT: 'Cantidad de vertices',
        FACE_COUNT: 'Cantidad de caras',
        EQUATION: 'Ecuación',
        RESOLUTION: 'Resolución',
        UPDATE: 'Actualizar',
        OUTER_TEXTURE: 'Textura exterior',
        INNER_TEXTURE: 'Textura interior',
        FLOOR_TEXTURE: 'Textura del piso',
        ADD_EQUATION: 'Agregar ecuación',
        SHOW_FLOOR: 'Mostrar piso',
        SELECT_MATERIAL: 'Selecccionar material',
        MULTIPLE_FIGURES: 'Múltiples figuras',
        SWITCH_AMBIENT_LIGHT: 'Prender/Apagar luz',
        SHOW_AXES: 'Mostrar ejes',
        WELCOME_MESSAGE: 'Bienvenido a implicitus',
        TOOGLE_KEYBOARD:'Activar teclado',
        LOADING:'CARGANDO',
        LOAD:'Cargar',  
        SAVE:'Guardar',                      
    });
    $translateProvider.preferredLanguage('es');
});
