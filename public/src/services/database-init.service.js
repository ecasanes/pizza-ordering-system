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
        total decimal(10,2) NULL,
        created_at timestamp(255) NULL,
        PRIMARY KEY (id) 
        );
    `;

    let productsWithSizesSql = `
      CREATE TABLE IF NOT EXISTS products_with_sizes (
        id int(11) NOT NULL,
        product_id int(11) NULL,
        product_size_id int(11) NULL,
        price decimal(10,2) NULL,
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
        subtotal decimal(10,2) NULL,
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

  initDb();
  createTables();

});