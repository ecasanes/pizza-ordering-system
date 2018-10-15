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

    return databaseService.select(sql);

  }

  // TODO: filter transaction items
  function filterTransactionItems(filter = {}){

    const {transactionId} = filter;

    let sql = `
      SELECT * FROM transaction_items
      INNER JOIN transactions on transactions.id = transaction_items.transaction_id
      WHERE transaction_items.id IS NOT NULL
    `;

    if(transactionId){
      sql += ` AND transaction_items.transaction_id = ${transactionId}`;
    }

    return databaseService.select(sql);

  }

  function saveTransaction(items, grandTotal) {

    return createTransaction(grandTotal)
      .then(
        (insertId) => {
          return insertTransactionItems(insertId, items);
        }
      )

  }

  function createTransaction(grandTotal){

    // const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    let sql = `
      INSERT INTO transactions (total) VALUES (${grandTotal})
    `;

    return databaseService.insert(sql);



  }

  function insertTransactionItems(transactionId, transactionItems) {

    let sqlValuesArr = transactionItems.map(
      (item) => {
        return `(${transactionId}, ${item.product_id}, ${item.subtotal})`
      }
    );

    let sqlValuesString = sqlValuesArr.join(',');

    let sql = `
      INSERT INTO transaction_items (transaction_id, product_id, subtotal) VALUES ${sqlValuesString}
    `;

    return databaseService.insert(sql);


  }

  this.saveTransaction = saveTransaction;

});