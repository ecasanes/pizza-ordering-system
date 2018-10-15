'use strict';

app.controller('customerCtrl', ['$scope', '$rootScope', 'productsService', '$timeout', 'transactionsService', '$location', function ($scope, $rootScope, productsService, $timeout, transactionsService, $location) {

  $scope.pizzaList = [];
  $scope.pizzas = [];
  $scope.grandTotal = 0;
  $scope.canSaveTransaction = false;

  $scope.formData = {
    fullName: '',
    mobileNumber: null
  };

  $scope.$watch('grandTotal', function(newValue, oldValue){

    console.log('grand total old: ', oldValue);
    console.log('grand total new: ', newValue);

    if(newValue > 0){
      $scope.canSaveTransaction = true;
    }else{
      $scope.canSaveTransaction = false;
    }

  })

  let isValidInput = () => {

    console.log('fullname: ', $scope.formData.fullName);
    console.log('mobile: ', $scope.formData.mobileNumber);

    if($scope.formData.fullName.trim() === '' || !$scope.formData.mobileNumber){
      alert('please provide both fullname and mobile number');
      return false;
    }

    return true;

  }

  let combineAllCategoryPizzas = () => {

    let pizzas = [];

    $scope.pizzaList.forEach(
      (pizzaCategory) => {
        pizzas = pizzas.concat(pizzaCategory.pizzas);
      }
    );

    $scope.pizzas = pizzas;

  }

  let calculateSubTotal = (price, qty) => {
    console.log('price: ', price);
    console.log('qty: ', qty);
    return price * qty;
  }

  let calculateGrandTotal = () => {

    let grandTotal = 0;

    combineAllCategoryPizzas();

    $scope.pizzas.forEach(
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

  let setOldPizzaValues = (pizza) => {

    pizza.oldPrice = pizza.currentPrice;
    pizza.oldQty = pizza.qty;
    pizza.oldSelectedId = pizza.selectedId;
    pizza.oldSelectedSize = pizza.selectedSize;
    pizza.oldSubTotal = pizza.subTotal;
    pizza.updated = false;

  }

  let normalizeQty = (pizza) => {

    if(pizza.qty <= 0){
      pizza.qty = 1;
    }

  }

  $scope.radioSelected = (pizza, sizeDetails) => {

    const { price, id } = sizeDetails;

    setOldPizzaValues(pizza);
    normalizeQty(pizza);

    const subTotal = calculateSubTotal(price, pizza.qty);

    if(pizza.subTotal <= 0){
      pizza.updated = true;
    }

    pizza.currentPrice = price;
    pizza.subTotal = subTotal;
    pizza.selectedId = id;

  };

  $scope.qtyChanged = (pizza) => {

    setOldPizzaValues(pizza);
    normalizeQty(pizza);

    const subTotal = calculateSubTotal(pizza.currentPrice, pizza.qty);
    pizza.subTotal = subTotal;

    console.log('pizza subtotal: ', pizza.subTotal);

  };

  $scope.add = (pizza) => {

    pizza.added = true;

    calculateGrandTotal();

  };

  $scope.update = (pizza) => {

    pizza.updated = true;

    calculateGrandTotal();

  };

  $scope.remove = (pizza) => {

    pizza.added = false;
    pizza.updated = false;

    pizza.qty = 0;
    pizza.oldQty = 0;

    pizza.selectedSize = null;
    pizza.oldSelectedSize = null;

    pizza.selectedId = null;
    pizza.oldSelectedId = null;

    pizza.currentPrice = 0;
    pizza.oldPrice = 0;

    pizza.subTotal = 0;
    pizza.oldSubTotal = 0;

    calculateGrandTotal();

  };

  $scope.submitTransaction = () => {

    let isValid = isValidInput();

    if(!isValid){
      return;
    }

    let addedPizzas = $scope.pizzas.filter(
      (pizza) => {
        return pizza.added;
      }
    );

    let transactionItems = addedPizzas.map(
      (pizza) => {

        if(pizza.updated){
          const { selectedId, subTotal, qty } = pizza;
          return {
            product_id: selectedId,
            subtotal: subTotal,
            qty
          }
        }

        const { oldSelectedId, oldSubTotal, oldQty } = pizza;
        return {
          product_id: oldSelectedId,
          subtotal: oldSubTotal,
          qty: oldQty
        }

      }
    );

    transactionsService.saveTransaction(transactionItems, $scope.grandTotal, $scope.formData)
      .then(
        () => {
          $location.path('staff');
          $scope.$apply();
        }
      )

  }

  // init
  getAllProductsByCategory();

}]);