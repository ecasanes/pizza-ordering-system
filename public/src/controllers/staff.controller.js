'use strict';

app.controller('staffCtrl', ['$scope', '$rootScope', 'transactionsService', function ($scope, $rootScope, transactionsService) {

  $scope.transactions = [];

  let getAllTransactionItems = async () => {

    let transactions = await transactionsService.filterTransactions();

    let newTransactions = [];

    for(let i = 0; i<transactions.length; i++){
      const transaction = transactions[i];
      transaction.items = await transactionsService.filterTransactionItems({transactionId: transaction.id});
      newTransactions.push(transaction);
    }

    console.log('new transactions: ', newTransactions);

    $scope.transactions = newTransactions;
    $scope.$apply();

    // transactionsService.filterTransactions()
    //   .then(
    //     (transactions) => {

    //       transactions = transactions.map(
    //         (transaction) => {
    //           transaction.items = transactionsService.filterTransactionItems({transactionId: transaction.id});
    //           return transaction;
    //         }
    //       );

    //       console.log('transactions: ', transactions);

    //       $scope.transactions = transactions;
    //       $scope.$apply()
    //     }
    //   )

  }

  getAllTransactionItems();

}]);