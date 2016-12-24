angular.module('fims.auth')

    .controller("LoginCtrl", ['$rootScope', '$scope', '$state', 'AuthFactory', 'UserFactory',
        function ($rootScope, $scope, $state, AuthFactory, UserFactory) {
            var vm = this;
            vm.credentials = {
                username: '',
                password: ''
            };
            vm.submit = submit;

            function submit() {
                AuthFactory.login(vm.credentials.username, vm.credentials.password)
                    .success(function (data, status, headers, config) {
                        UserFactory.fetchUser()
                            .success(function (data) {
                                if (data.hasSetPassword == false) {
                                    $state.go("profile", {error: "Please update your password."});
                                }
                            });
                        if ($rootScope.savedState) {
                            if ($rootScope.savedState != "login")
                                $state.go($rootScope.savedState, $rootScope.savedStateParams);
                            else
                                $state.go("home");
                            delete $rootScope.savedState;
                            delete $rootScope.savedStateParams;
                        } else {
                            $state.go('home');
                        }
                    })
                    .error(function (data, status, headers, config) {
                        if (data.usrMessage)
                            $scope.error = data.usrMessage;
                        else
                            $scope.error = "Server Error! Status code: " + status;
                    });
            }
        }]);