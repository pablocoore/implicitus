angular.module('isosurface', ['ngFileUpload', 'ngSanitize', 'ngToast'])
.config(function($provide) {
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
});
