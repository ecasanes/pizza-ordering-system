'use strict';

app.controller('customerCtrl', function ($scope, $rootScope) {

  console.log('customer controller init', $rootScope);

  let calculateSubTotal = (price, qty) => {
    console.log('price: ', price);
    console.log('qty: ', qty);
    return price * qty;
  }

  let calculateGrandTotal = () => {

    let grandTotal = 0;
    let pizzas = [];

    $scope.pizzaList.forEach(
      (pizzaCategory) => {
        pizzas = pizzas.concat(pizzaCategory.pizzas);
      }
    );

    console.log('pizzas: ', pizzas);

    pizzas.forEach(
      (pizza) => {
        if (pizza.added) {
          grandTotal += pizza.subTotal;
        }
      }
    );

    $scope.grandTotal = grandTotal;

  }

  $scope.pizzaList = [{
    name: 'Category 1',
    sizes: [10, 14, 18],
    pizzas: [{
        name: 'pizza 1',
        qty: 0,
        subTotal: 0,
        selectedSize: null,
        currentPrice: 0,
        added: false,
        sizes: [{
            inches: 10,
            price: 100
          },
          {
            inches: 14,
            price: 200
          },
          {
            inches: 18,
            price: 300
          }
        ]
      },
      {
        name: 'pizza 2',
        qty: 0,
        subTotal: 0,
        selectedSize: null,
        currentPrice: 0,
        added: false,
        sizes: [{
            inches: 10,
            price: 150
          },
          {
            inches: 14,
            price: 250
          },
          {
            inches: 18,
            price: 350
          }
        ]
      }
    ]
  }]

  $scope.grandTotal = 0;

  $scope.radioSelected = (pizza, price) => {

    pizza.currentPrice = price;
    // console.log('pizza from radio: ', pizza);
    const subTotal = calculateSubTotal(price, pizza.qty);
    pizza.subTotal = subTotal;

    console.log('pizza subtotal: ', pizza.subTotal);

  };

  $scope.qtyChanged = (pizza) => {
    // console.log('pizza from qty: ', pizza);

    const subTotal = calculateSubTotal(pizza.currentPrice, pizza.qty);
    pizza.subTotal = subTotal;

    console.log('pizza subtotal: ', pizza.subTotal);

  };

  $scope.add = (pizza) => {

    pizza.added = true;
    calculateGrandTotal();

  };

  $scope.update = (pizza) => {

    calculateGrandTotal();

  };

  $scope.remove = (pizza) => {

    pizza.added = false;
    pizza.qty = 0;
    pizza.selectedSize = null;
    pizza.currentPrice = 0;
    pizza.subTotal = 0;

    calculateGrandTotal();

  };

});