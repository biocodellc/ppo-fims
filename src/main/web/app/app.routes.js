angular.module('ppoApp')

.config(['$stateProvider', '$urlRouterProvider', '$urlMatcherFactoryProvider', '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider, $locationProvider) {

        // make trailing / optional
        $urlMatcherFactoryProvider.strictMode(false);

        $stateProvider
            .state('home', {
                url: "/",
                templateUrl: "app/components/home/home.html",
            })
            .state('login', {
                url: "/login",
                templateUrl: "app/components/auth/login.html",
                controller: "LoginCtrl as vm",
            })
            .state('validate', {
                url: "/validate",
                templateUrl: "app/components/validation/validation.html",
                controller: "ValidationCtrl as vm"
            })
            .state('resetPass', {
                url: "/resetPass",
                templateUrl: "app/components/users/resetPass.jsp",
                controller: "ResetPassCtrl as vm"
            })
            .state('reset', {
                url: "/reset",
                templateUrl: "app/components/users/reset.html",
            })
            .state('template', {
                url: "/template?projectId",
                templateUrl: "app/components/templates/templates.html",
                controller: "TemplateCtrl as vm"
            })
            .state('query', {
                url: "/query",
                templateUrl: "app/components/query/query.html",
                controller: "QueryCtrl as queryVm",
            })
            .state('profile', {
                url: "/secure/profile?error",
                templateUrl: "app/components/users/profile.html",
                controller: "UserCtrl as vm",
                loginRequired: true
            })
            .state('projects', {
                url: "/secure/projects",
                templateUrl: "app/components/projects/projects.html",
                controller: "ProjectCtrl as vm",
                loginRequired: true
            })
            .state('expeditionManager', {
                url: "/secure/expeditions",
                templateUrl: "app/components/expeditions/expeditions.html",
                controller: "ExpeditionCtrl as vm",
                loginRequired: true
            });

        $locationProvider.html5Mode(true);

        // For any unmatched url, redirect to /
        $urlRouterProvider.otherwise("/");
    }]);