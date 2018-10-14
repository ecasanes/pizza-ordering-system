'use strict';

app.service('databaseService', function ($rootScope) {

  function executeQuery(transaction, sql, data = [], successFn = null, errorFn = null) {

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

          executeQuery(transaction, query.sql, data,
            function (sqlTransaction, sqlResultSet) {
              // console.log('query executed: ', sqlResultSet);
            },
            function (sqlTransaction, sqlError) {
              console.log('query error: ', sqlError);
            }
          );
          
        }
      )



    });
  }

  this.executeQueries = executeQueries;
  this.executeQuery = executeQuery;

});