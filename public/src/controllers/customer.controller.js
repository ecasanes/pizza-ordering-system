'use strict';

app.controller('customerCtrl', ['$scope', '$rootScope', 'productsService', '$timeout', function ($scope, $rootScope, productsService, $timeout) {

  console.log('customer controller init', $rootScope);
  console.log('product service from customer ctrl: ', productsService);

  $scope.pizzaList = [];

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

  let getProductSizes = () => {
    return productsService.getAllProductSizes();
  }

  let getCategoriesWithSizes = (categories, sizes) => {

    console.log('product categories: ', categories[0]);
    let categoriesWithSizes = [];

    for(let i=0;i<categories.length;i++){
      let category = categories[i];
      category.sizes = sizes;
      categoriesWithSizes.push(category);
    }

    console.log('categories with sizes: ', categoriesWithSizes);

    return categoriesWithSizes;
    

  }

  let getProductsByCategory = async (categoryId) => {

    let products = await productsService.filterProducts({categoryId});
    let productsWithPrices = [];

    for(let i = 0; i<products.length; i++){

      const product = products[i];
      const productId = product.id;

      product.qty = 0;
      product.subTotal = 0;
      product.currentPrice = 0;
      product.selectedSize = null;
      product.added = false;
      product.pricesPerSize = await productsService.getProductPricesPerSize({productId});

      productsWithPrices.push(product);

    }

    return productsWithPrices;

  }

  // let getProductsPerCategory = async (categories) => {

  //   let categoriesWithProducts = [];

  //   for(let i=0;i<categories.length;i++){
  //     let category = categories[i];
  //     category.pizzas = await productsService.filterProducts({categoryId: categories.id});
  //     categoriesWithProducts.push(category);
  //   }

  //   return categoriesWithProducts;

  // }

  let getCategoriesWithProducts = async (categories) => {

    let categoriesWithProducts = [];

    for(let i=0;i<categories.length;i++){
      let category = categories[i];
      category.pizzas = await getProductsByCategory(category.id);
      categoriesWithProducts.push(category);
    }

    return categoriesWithProducts;

  }

  let getAllProductsByCategory = async () => {

    let categories = await productsService.getAllCategories();
    const productSizes = await getProductSizes();
    
    categories = getCategoriesWithSizes(categories, productSizes);

    let categoriesWithProducts = await getCategoriesWithProducts(categories);

    $scope.pizzaList = categoriesWithProducts;

    console.log('categoriesWithProducts: ', categoriesWithProducts);

    $timeout(function(){
      $scope.pizzaList = categoriesWithProducts;
    }, 1000);

    jQuery('[data-toggle="tooltip"]').tooltip()

  }

  $scope.grandTotal = 0;

  $scope.radioSelected = (pizza, price) => {

    if(pizza.qty === 0){
      pizza.qty = 1;
    }

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

  // init
  getAllProductsByCategory();

}]);