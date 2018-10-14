'use strict';

app.config(function ($routeProvider) {

  console.log('first config');

  $routeProvider
    .when("/", {
      templateUrl: "src/templates/customer.html",
      controller: 'customerCtrl'
    })
    .when("/customer", {
      templateUrl: "src/templates/customer.html",
      controller: 'customerCtrl'
    })
    .when("/staff", {
      templateUrl: "src/templates/staff.html",
      controller: 'staffCtrl'
    })
});