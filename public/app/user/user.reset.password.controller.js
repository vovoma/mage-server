angular
  .module('mage')
  .controller('UserResetPasswordController', UserResetPasswordController);

UserResetPasswordController.$inject =  ['$scope', '$timeout', '$location', 'Api', 'UserService', 'user'];

function UserResetPasswordController($scope, $timeout, $location, Api, UserService, user) {
  if (!user) {
    $location.path('/signin');
  }

  $scope.user = user;
  $scope.account = {
    username: user.username
  };
  $scope.passwordStatus = {};

  Api.get(function(api) {
    var authenticationStrategies = api.authenticationStrategies || {};
    if (authenticationStrategies.local && authenticationStrategies.local.passwordMinLength) {
      $scope.passwordPlaceholder = authenticationStrategies.local.passwordMinLength + ' characters, alphanumeric';
    }
  });

  $scope.resetPassword = function() {
    if ($scope.account.newPassword !== $scope.account.newPasswordconfirm) {
      $scope.showStatus = true;
      $scope.statusTitle = 'New passwords do not match';
      $scope.statusLevel = 'alert-danger';
      return;
    }

    UserService.resetMyPassword($scope.account).success(function() {
      $scope.user.password = "";
      $scope.user.passwordconfirm = "";
      $scope.showStatus = true;
      $scope.statusTitle = 'Password Successfully Reset';
      $scope.statusMessage = 'Please wait while you are redirected to the login page';
      $scope.statusLevel = 'alert-success';

      $timeout(function() {
        $location.path('/signin');
      }, 3000);
    })
    .error(function() {
      $scope.showStatus = true;
      $scope.statusTitle = 'Password Reset Failed';
      $scope.statusMessage = 'Please ensure your password is correct and that your new password meets the minimum requirements';
      $scope.statusLevel = 'alert-danger';
    });
  };
}
