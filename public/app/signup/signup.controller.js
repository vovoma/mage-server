angular
  .module('mage')
  .controller('SignupController', SignupController);

SignupController.$inject = ['$scope', '$location', 'UserService', 'api' /* injected resource promise */];

function SignupController($scope, $location, UserService, api) {
  $scope.user = {};
  $scope.showStatus = false;
  $scope.statusTitle = '';
  $scope.statusMessage = '';

  Api.get(function(api) {
    $scope.thirdPartyStrategies = _.map(_.omit(api.authenticationStrategies, localStrategyFilter), function(strategy, name) {
      strategy.name = name;
      return strategy;
    });

    $scope.localAuthenticationStrategy = api.authenticationStrategies.local;
    if ($scope.localAuthenticationStrategy && $scope.localAuthenticationStrategy.passwordMinLength) {
      $scope.passwordPlaceholder = $scope.localAuthenticationStrategy.passwordMinLength + ' characters, alphanumeric';
    }
  });

  $scope.$on('userAvatar', function(event, userAvatar) {
    $scope.user.avatar = userAvatar;

    if (!userAvatar) {
      $scope.user.avatarData = null;
      return;
    }

    if (window.FileReader) {
      var reader = new FileReader();
      reader.onload = (function() {
        return function(e) {
          $scope.user.avatarData = e.target.result;
          $scope.$apply();
        };
      })(userAvatar);

      reader.readAsDataURL(userAvatar);
    }
  });

  $scope.showStatusMessage = function (title, message, statusLevel) {
    $scope.statusTitle = title;
    $scope.statusMessage = message;
    $scope.statusLevel = statusLevel;
    $scope.showStatus = true;
  };

  $scope.signup = function(strategy) {
    strategy === 'local' ? localSignup() : oauthSignup(strategy);
  };

  function oauthSignup(strategy) {
    UserService.oauthSignup(strategy).then(function() {
      $scope.showStatus = true;
      $scope.statusTitle = 'Account successfully created';
      $scope.statusMessage = 'Your account has been created.  You will be able to login once and administrator approves your account';
      $scope.statusLevel = 'alert-success';
    }, function(data) {
      $scope.showStatus = true;
      $scope.statusTitle = 'Error signing up';
      $scope.statusMessage = data.errorMessage;
      $scope.statusLevel = 'alert-danger';
    });
  }

  function localSignup() {
    var user = {
      username: $scope.user.username,
      displayName: $scope.user.displayName,
      email: $scope.user.email,
      phone: $scope.user.phone,
      password: $scope.user.password,
      passwordconfirm: $scope.user.passwordconfirm,
      avatar: $scope.user.avatar
    };

    // TODO throw in progress
    var progress = function(e) {
      if(e.lengthComputable){
        $scope.$apply(function() {
          $scope.uploading = true;
          $scope.uploadProgress = (e.loaded/e.total) * 100;
        });
      }
    };

    var complete = function() {
      $scope.$apply(function() {
        $scope.user = {};
        $scope.showStatusMessage("Success", "Account created, contact an administrator to activate your account.", "alert-success");
      });
    };

    var failed = function(data) {
      $scope.$apply(function() {
        $scope.showStatusMessage("There was a problem creating your account", data.responseText, "alert-danger");
      });
    };

    UserService.signup(user, complete, failed, progress);
  }

  function localStrategyFilter(strategy, name) {
    return name === 'local';
  }
}
