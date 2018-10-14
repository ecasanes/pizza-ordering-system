'use strict';

app.service('databaseInitService', function ($rootScope, databaseService) {

  function initDb() {

    let db;
    let version = 1.0;
    let dbName = 'pos';
    let dbDisplayName = 'pos_db';
    let dbSize = 2 * 1024 * 1024;

    $rootScope.db = openDatabase(dbName, version, dbDisplayName, dbSize, function (database) {
      console.log('database created: ');
    });

  }

  function createTables() {

    let productCategoriesSql = `
        CREATE TABLE IF NOT EXISTS product_categories (
          id int(11) NOT NULL,
          name varchar(255) NULL,
          description text NULL,
          code varchar(255) NULL,
          PRIMARY KEY (id) 
          );  
    `;

    let productSizesSql = `
      CREATE TABLE IF NOT EXISTS product_sizes (
        id int(11) NOT NULL,
        inches varchar(255) NULL,
        PRIMARY KEY (id) 
        );      
    `;

    let productsSql = `
        CREATE TABLE IF NOT EXISTS products (
          id int(11) NOT NULL,
          name varchar(255) NULL,
          description text NULL,
          product_category_id int(11) NULL,
          PRIMARY KEY (id) ,
          CONSTRAINT fk_product_category FOREIGN KEY (product_category_id) 
          REFERENCES product_categories (id) ON DELETE SET NULL
          );
      `;

    let transactionsSql = `
      CREATE TABLE IF NOT EXISTS transactions (
        id int(11) NOT NULL,
        total varchar(255) NULL,
        created_at timestamp(255) NULL,
        PRIMARY KEY (id) 
        );
    `;

    let productsWithSizesSql = `
      CREATE TABLE IF NOT EXISTS products_with_sizes (
        id int(11) NOT NULL,
        product_id int(11) NULL,
        product_size_id int(11) NULL,
        price varchar(255) NULL,
        PRIMARY KEY (id) ,
        CONSTRAINT fk_products_product_sizes_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
        CONSTRAINT fk_product_with_size_product_size FOREIGN KEY (product_size_id) REFERENCES product_sizes (id) ON DELETE CASCADE
        );
    `;

    let transactionItemsSql = `
      CREATE TABLE IF NOT EXISTS transaction_items (
        id int(11) NOT NULL,
        product_id int(11) NULL,
        transaction_id int(11) NULL,
        subtotal varchar(255) NULL,
        created_at timestamp(255) NULL,
        PRIMARY KEY (id) ,
        CONSTRAINT fk_transaction_items_transaction FOREIGN KEY (transaction_id) REFERENCES transactions (id) ON DELETE SET NULL,
        CONSTRAINT fk_transaction_items_product_with_size FOREIGN KEY (product_id) REFERENCES products_with_sizes (id) ON DELETE SET NULL
        );
    `;

    let createTableQueries = [{
        sql: productCategoriesSql
      },
      {
        sql: productSizesSql
      },
      {
        sql: productsSql
      },
      {
        sql: transactionsSql
      },
      {
        sql: productsWithSizesSql
      },
      {
        sql: transactionItemsSql
      },
    ];

    databaseService.executeQueries(createTableQueries);



  }

  function insertProductCategories() {

    let sql = `
      INSERT INTO product_categories (id, name, code) 
      VALUES 
      (1, 'Classic Pizza', 'classic'),
      (2, 'Specialty Pizza', 'specialty'),
      (3, 'More Toppings', 'toppings');
    `;

    databaseService.executeQueries([{sql}]);

  }

  function insertProductSizes() {

    let sql = `
      INSERT INTO product_sizes (id, inches) 
      VALUES 
      (1, 10),
      (2, 14),
      (3, 18);
    `;

    databaseService.executeQueries([{sql}]);

  }

  function insertProducts() {

    let sql = `
      INSERT INTO products (id, name, description, product_category_id) 
      VALUES 

      (1, 'Cheese', 'double layer of mozzarella', 1),
      (2, 'NY Classic', 'pepperoni', 1),
      (3, 'Pepp & Mushroom', 'pepperoni & button mushrooms', 1),
      (4, 'Manhattan', 'ham, pepperoni, italian sausage, ground beef, salami & bacon', 1),
      (5, 'Garden Special', 'fresh tomatoes, black olives, mushrooms, onions, red & green bell peppers', 1),
      (6, 'Hawaiian', 'ham, pineapple, bacon', 1),
      (7, 'NY Finest', 'Italian sausage, ham, pepperoni, bacon, ground beef, black olives, mushroom, onions, red & green bell peppers', 1),

      (8, 'Tribeca Mushroom', 'shiitake, button & oyster mushroom', 2),
      (9, 'Anchovy Lovers', 'black olives, anchovies, capers, roasted garlic, mushrooms & onions', 2),
      (10, '#4 Cheese', 'cheese heaven! mozzarella, cheddar, fontina & feta', 2),
      (11, 'Corona Chicken', 'tangy strips of chicken with Southwestern salsa', 2),
      (12, 'Gourmet Garden', 'zucchini, grilled eggplant, fresh tomatoes, black olives, capers, mushrooms, onions, red & green bell peppers', 2),
      (13, 'Roasted Garlic', 'shrimp, onions, roasted garlic in wine-butter sauce', 2),
      (14, 'Four Seasons', 'gourmet sampler: NY Classic, #4 Cheese, Anchovy lovers, Roasted Garlic & Shrimp', 2),

      (15, 'Cheese', '', 3),
      (16, 'Bacon', '', 3),
      (17, 'Ground Beef', '', 3),
      (18, 'Ham', '', 3),
      (19, 'Italian Sausage', '', 3),
      (20, 'Pepperoni', '', 3),
      (21, 'Salami', '', 3),
      (22, 'Capers', '', 3),
      (23, 'Roasted Garlic', '', 3),
      (24, 'Bell Pepper', '', 3),
      (25, 'Mushrooms', '', 3);
    `;

    databaseService.executeQueries([{sql}]);

  }

  function insertProductsWithDetails() {

    let productsWithSize = [
      { id: 1, pricePerSize: ['175.00', '285.00', '440.00'] },
      { id: 2, pricePerSize: ['210.00', '340.00', '530.00'] },
      { id: 3, pricePerSize: ['220.00', '250.00', '540.00'] },
      { id: 4, pricePerSize: ['250.00', '295.00', '565.00'] },
      { id: 5, pricePerSize: ['210.00', '340.00', '530.00'] },
      { id: 6, pricePerSize: ['210.00', '340.00', '530.00'] },
      { id: 7, pricePerSize: ['260.00', '420.00', '575.00'] },

      { id: 8, pricePerSize: ['245.00', '390.00', '560.00'] },
      { id: 9, pricePerSize: ['275.00', '450.00', '595.00'] },
      { id: 10, pricePerSize: ['250.00', '400.00', '560.00'] },
      { id: 11, pricePerSize: ['250.00', '420.00', '575.00'] },
      { id: 12, pricePerSize: ['250.00', '410.00', '585.00'] },
      { id: 13, pricePerSize: ['240.00', '405.00', '505.00'] },
      { id: 14, pricePerSize: ['275.00', '430.00', '590.00'] }

    ];

    let toppings = [];

    for(let i=15;i<=25;i++){
      toppings.push({id:i, pricePerSize: ['35.00', '45.00', '60.00']});
    }

    productsWithSize = productsWithSize.concat(toppings);

    console.log('whole products with sizes: ', productsWithSize);

    let idCounter = 1;
    let productSqlValues = productsWithSize.map(
      (product) => {

      

        let rowSqlValues = product.pricePerSize.map(
          (price, index) => {

            let sizeId;
            const currentCount = idCounter;

            switch(index){
              case 0:
                sizeId = 1;
                break;
              case 1:
                sizeId = 2;
                break;
              case 2:
                sizeId = 3;
                break;
            }

            idCounter++;

            console.log('price: ', price);

            return `(${currentCount}, ${product.id}, ${sizeId}, ${price})`;
          }
        );

        return rowSqlValues.join(',');

      }
    );

    let sqlValues = productSqlValues.join(',');

    const sql = `INSERT INTO products_with_sizes (id, product_id, product_size_id, price) VALUES ${sqlValues}`;

    databaseService.executeQueries([{sql}]);

  }

  initDb();
  createTables();
  insertProductCategories();
  insertProductSizes();
  insertProducts();
  insertProductsWithDetails();

});