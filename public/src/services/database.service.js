'use strict';

app.service('databaseService', function ($rootScope) {

  function select(sql, data = []){

    return executeQueryPromise(sql, data = [])
      .then(
        (result) => {

          if(!result){
            return [];
          }

          if(!result.rows){
            return [];
          }

          return result.rows;
        }
      );

  }

  function insert(sql, data = []){

    return executeQueryPromise(sql, data = [])
      .then(
        (result) => {

          if(!result){
            return null;
          }

          if(!result.insertId){
            return null;
          }

          return result.insertId;

        }
      );

  }

  function executeQueryPromise(sql, data = []) {

    return new Promise(
      (resolve, reject) => {
        executeQuery(sql, [],
          function(sqlTransaction, result){
            resolve(result);
          },
          function(sqlTransaction, error){
            reject(error);
          });
      }
    );

  }

  function executeQuery(sql, data = [], successFn = null, errorFn = null) {

    $rootScope.db.transaction(function(transaction) {

      executeTransactionQuery(transaction, sql, data, successFn, errorFn);

    });

  }

  function executeTransactionQuery(transaction, sql, data = [], successFn = null, errorFn = null) {

    transaction.executeSql(
      sql,
      data,
      successFn,
      errorFn
    );

  }

  function executeQueries(queriesToExecute = []) {

    if (queriesToExecute.length <= 0) {
      console.log('no queries available to execute');
      return;
    }

    $rootScope.db.transaction(function (transaction) {

      queriesToExecute.forEach(
        (query) => {

          let data = [];

          if(query.data){
            data = query.data;
          }

          executeTransactionQuery(transaction, query.sql, data,
            function (sqlTransaction, sqlResultSet) {
              // console.log('query executed: ', sqlResultSet);
            },
            function (sqlTransaction, sqlError) {
              // NOTE: remove on production
              // console.log('query error: ', sqlError);
            }
          );
          
        }
      )



    });
  }

  this.executeQueries = executeQueries;
  this.executeQuery = executeQuery;
  this.executeQueryPromise = executeQueryPromise;
  this.select = select;
  this.insert = insert;

});