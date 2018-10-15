'use strict';

app.service('transactionsService', function(databaseService) {

  // TODO: filter transactions
  function filterTransactions(filter = {}){

    const {transactionId} = filter;

    let sql = `
      SELECT * FROM transactions WHERE transactions.id IS NOT NULL
    `;

    if(transactionId){
      sql += ` AND transactions.id = ${transactionId}`;
    }

    return databaseService.select(sql)
      .then(
        (rows) => {

          let newRows = [];

          for(let i=0;i<rows.length;i++){
            const row = rows[i];
            newRows.push({
              id: row.id,
              subtotal: row.subtotal,
              full_name: row.full_name,
              total: row.total,
              created_at: row.created_at
            });
          }

          return newRows;

        }
      )

  }

  // TODO: filter transaction items
  function filterTransactionItems(filter = {}){

    const {transactionId} = filter;

    let sql = `
      SELECT 
      transaction_items.*,
      product_sizes.inches,
      products_with_sizes.price,
      products.name,
      product_categories.name as product_category_name
      FROM transaction_items
      INNER JOIN products_with_sizes ON products_with_sizes.id = transaction_items.product_id
      INNER JOIN products ON products.id = products_with_sizes.product_id
      INNER JOIN product_sizes ON product_sizes.id = products_with_sizes.product_size_id
      INNER JOIN product_categories ON product_categories.id = products.product_category_id
      WHERE transaction_items.id IS NOT NULL
    `;

    if(transactionId){
      sql += ` AND transaction_items.transaction_id = ${transactionId}`;
    }

    return databaseService.select(sql)
    .then(
      (rows) => {

        let newRows = [];

        for(let i=0;i<rows.length;i++){
          const row = rows[i];
          newRows.push({
            transaction_id: row.id,
            subtotal: row.subtotal,
            price: row.price,
            name: row.name,
            product_category_name: row.product_category_name,
            inches: row.inches,
            qty: row.qty
          });
        }

        return newRows;

      }
    )

  }

  function saveTransaction(items, grandTotal, formData) {

    const { fullName, mobileNumber } = formData;

    return createTransaction(grandTotal, fullName, mobileNumber)
      .then(
        (insertId) => {
          return insertTransactionItems(insertId, items);
        }
      )

  }

  function createTransaction(grandTotal, fullName, mobileNumber){

    // const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    let sql = `
      INSERT INTO transactions (total, full_name, mobile_number) VALUES (${grandTotal}, '${fullName}', '${mobileNumber}')
    `;

    console.log('sql: ', sql);

    return databaseService.insert(sql);



  }

  function insertTransactionItems(transactionId, transactionItems) {

    let sqlValuesArr = transactionItems.map(
      (item) => {
        return `(${transactionId}, ${item.product_id}, ${item.qty}, ${item.subtotal})`
      }
    );

    let sqlValuesString = sqlValuesArr.join(',');

    let sql = `
      INSERT INTO transaction_items (transaction_id, product_id, qty, subtotal) VALUES ${sqlValuesString}
    `;

    console.log('sql: ', sql);

    return databaseService.insert(sql);


  }

  this.saveTransaction = saveTransaction;
  this.filterTransactionItems = filterTransactionItems;
  this.filterTransactions = filterTransactions;

});