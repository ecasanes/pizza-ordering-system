'use strict';

app.directive('products', function(){
  return {
    restrict: 'E',
    templateUrl:'src/templates/directives/products.html',
    replace: true,
    scope: {
      products: '='
    },
    controller: function($scope, productsService) {
      console.log($scope.products);
    }
  }
});