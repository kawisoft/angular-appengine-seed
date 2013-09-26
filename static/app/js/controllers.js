'use strict';

angular.module('seed.controllers', []).
  controller('ListCtrl', ['$scope', '$stateParams', 'Config', 'Model', 'list',
    function($scope, $stateParams, Config, Model, list) {
      if (list) {
        $scope.list = list;
      } else {
        $scope.list = Model.query($stateParams);
      }
      console.log($scope.list);

      //$scope.list.then(function() {
      //  if (!$scope.list.items) {
      //    $scope.list.items = [];
      //  }
      //});

      $scope.load = function() {
        $scope.list.$query();
      };

      $scope.save = function(item) {
        // Update in place or push onto the front of the array.
        var idx = $scope.indexOf(item);
        if (idx < 0) {
          $scope.list.items.unshift(item);

          // Remove extra items from the back of the array.
          var num = $scope.list.items.length - Config.list_limit;
          if (num > 0) {
            $scope.list.items.splice(-1, num)
          }

          idx = 0;
        } else {
          $scope.list.items[idx] = item;
        }

        return $scope.list.items[idx].id;
      };

      $scope.delete = function(item) {
        var idx = $scope.indexOf(item);
        if (idx >= 0) {
          $scope.list.items.splice(idx, 1);

          // Just remove an item from the list. Need to get one to replace it.
          if ($scope.list.nextPageToken) {
            var num = Config.list_limit - $scope.list.items.length;
            if (num > 0) {
              var params = $stateParams;
              params.pageToken = $scope.list.nextPageToken;
              params.limit = num;

              Model.query(params, function(data) {
                $scope.list.items.push.apply($scope.list.items, data.items);
                $scope.list.nextPageToken = data.nextPageToken;
              });
            }
          }
        }

        if (idx < 0) {
          return null;
        } else {
          return $scope.list.items[idx].id;
        }
      };

      $scope.indexOf = function(item) {
        for (var i=0; i<$scope.list.items.length; i++) {
          if (item.id === $scope.list.items[i].id) {
            return i;
          }
        }

        return -1;
      };
    }
  ]).
  controller('ModelCtrl', ['$scope', '$state', 'model',
    function($scope, $state, model) {
      $scope.model = model;

      $scope.save = function() {
        var id = $scope.model.id;
        //$scope.model.$save().
        $scope.model.put().then(function() {
          $scope.$parent.save($scope.model);
          if (id !== $scope.model.id) {
            if (!id) {
              id = $scope.model.id;
            }
            $state.go('model.detail', {id: id});
          }
        });
      };

      $scope.delete = function(data) {  
        $scope.model.remove().then(function() {
          $scope.$parent.delete($scope.model);
          $state.go('model.list');
        });
      };

      $scope.is_changed = function() {
        return $scope.form.$dirty;
      };
    }
  ]);