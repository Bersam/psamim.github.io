var wikiApp = angular.module('wiki',['ngRoute','ngAnimate','ngSanitize']);
//
var waitTemplate = '<div ng-show="wait" class="loading"><div id="movingBallG"><div class="movingBallLineG"></div>' +
					'<div id="movingBallG_1" class="movingBallG"></div></div></div>';

var homeTemplate =
	'<span class="search"><input id="search" type="search" placeholder="Search" ng-model="search" />' +
	'<span ng-show="clearButton()" ng-click="clearSearch()"><i class="icon-cancel"></i></span>' +
	'<span ng-show="!clearButton()" ng-click="clearSearch()"><i class="icon-search"></i></span>' +
	'</span>' +
	waitTemplate +
	'<ul class="tags">' +
	'<li ng-repeat="tag in tags | orderBy:\'weight\':true" class="tag" style="font-size:{{tag.weight}}%" >' +
	'<a ng-href="#/tag/{{tag.name}}" ng-click="tagFilter()">{{ tag.name }}</a>' +
	'</ili>' +
	'</ul>' +
	'<ul class="posts" > <li class="repeat-item" ng-repeat="post in posts | filter:search"> » ' +
	'<a href="/#/post{{ post.url }}">{{ post.title }}</a> </li> </ul>';

var postTemplate = '<div class="view" ng-animate ng-bind-html="content"></div>';

var notFoundTemplate = '<div class="not-found">404</div>';

//

 /*wikiApp.value('$anchorScroll', angular.noop);*/
 wikiApp.config( function($routeProvider) {
	$routeProvider.when('/tag/:name', {
		controller: HomeCtrl,
		template: homeTemplate
     }).when('/post/:url*', {
		controller: PostCtrl,
		template: postTemplate
     }).otherwise( {
		controller: HomeCtrl,
		template: homeTemplate
     });
 });

function HomeCtrl($scope, $routeParams, $http) {
	$http.get('/js/posts.json?7', {cache:true}).success( function(data) {
		data.tags.splice(0,1);
		data.posts.splice(0,1);
		$scope.tags = data.tags;
		$scope.posts = data.posts;
		$scope.wait = false;
	});

	$scope.search = $routeParams.name;
	$scope.tagFilter = function() {
		$scope.search = $routeParams.name;
	};

	$scope.clearButton = function () {
		return !( $scope.search == null || $scope.search == '');
	};

	$scope.clearSearch = function() {
		$scope.search = '';
	};
}

function PostCtrl($scope, $routeParams, $http, $sce) {
	$scope.url = $routeParams.url;
	$scope.content = waitTemplate;
	$http.get( '/' +  $scope.url + '.html', {cache:true}).success( function(data) {
		$scope.content = $sce.trustAsHtml(data);
	}).error(function() {
		console.log("jo");
		$scope.content = notFoundTemplate;
	});
}
