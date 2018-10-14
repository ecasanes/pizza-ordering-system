'use strict';

app.service('productsService', function(databaseService) {

  console.log('product service initialized');

  function getProductPricesPerSize(filters = {}){

    const { productId } = filters;
    
    let sql = `
      SELECT 

      products_with_sizes.price,
      product_sizes.inches

      FROM products_with_sizes 

      INNER JOIN product_sizes ON product_sizes.id = products_with_sizes.product_size_id

      WHERE products_with_sizes.id IS NOT NULL
    `;

    if(productId){
      sql += ` AND products_with_sizes.product_id = ${productId}`;
    }

    console.log('sql: ', sql);

    return databaseService.select(sql)
      .then(
        (result) => {

          let pricesPerSize = [];

          for(let i=0;i<result.length;i++){
            pricesPerSize.push({
              inches: result[i].inches,
              price: result[i].price
            });
          }

          return pricesPerSize;

        }
      );

  }

  function filterProductsWithSizes(filters = {}){

    const { productId, categoryId, category, searchKey, inches, priceFrom, priceTo } = filters;
    
    let sql = `
      SELECT 

      products_with_sizes.*, 
      products.name, 
      products.description,
      products.product_category_id, 
      product_sizes.inches,
      product_categories.name as 'product_category_name',
      product_categories.description as 'product_category_description',
      product_categories.code as 'product_category_code'

      FROM products_with_sizes 

      INNER JOIN product_sizes ON product_sizes.id = products_with_sizes.product_size_id
      INNER JOIN products ON products.id = products_with_sizes.product_id
      INNER JOIN product_categories ON product_categories.id = products.product_category_id

      WHERE products_with_sizes.id IS NOT NULL
    `;

    if(productId){
      sql += ` AND products.id = ${productId}`;
    }

    if(categoryId){
      sql += ` AND products.product_category_id = ${categoryId}`;
    }

    if(category){
      let categoryName = category.toLowerCase();
      sql += ` AND product_categories.name = ${categoryName}`;
    }

    if(searchKey){
      sql += ` AND products.name LIKE %${searchKey}%`;
    }

    if(inches){
      sql += ` AND product_sizes.inches = ${inches}`;
    }

    if(priceFrom){

      priceFrom = parseFloat(priceFrom);

      sql += ` AND products_with_sizes.price >= ${priceFrom}`;
    }

    if(priceTo){
      priceTo = parseFloat(priceTo);
      sql += ` AND products_with_sizes.price <= ${priceTo}`;
    }

    console.log('sql: ', sql);

    return databaseService.select(sql);

  }

  function filterProducts(filters = {}){

    const { categoryId, category, searchKey } = filters;
    
    let sql = `
      SELECT 

      products.*,
      product_categories.name as 'product_category_name',
      product_categories.description as 'product_category_description',
      product_categories.code as 'product_category_code'

      FROM products 

      INNER JOIN product_categories ON product_categories.id = products.product_category_id

      WHERE products.id IS NOT NULL
    `;

    if(categoryId){
      sql += ` AND products.product_category_id = ${categoryId}`;
    }

    if(category){
      let categoryName = category.toLowerCase();
      sql += ` AND product_categories.name = ${categoryName}`;
    }

    if(searchKey){
      sql += ` AND products.name LIKE %${searchKey}%`;
    }

    return databaseService.select(sql);

  }

  function getAllCategories() {

    let sql = `
      SELECT * FROM product_categories;
    `;

    return databaseService.select(sql);    

  }

  function getAllProductSizes() {

    let sql = `
      SELECT * FROM product_sizes;
    `;

    return databaseService.select(sql)
      .then(
        (result) => {

          let sizes = [];

          for(let i=0;i<result.length;i++){
            sizes.push(result[i].inches);
          }

          console.log('sizes: ', sizes);

          return sizes;

        }
      ); 
  }

  this.filterProductsWithSizes = filterProductsWithSizes;
  this.filterProducts = filterProducts;
  this.getAllCategories = getAllCategories;
  this.getAllProductSizes = getAllProductSizes;
  this.getProductPricesPerSize = getProductPricesPerSize;

});