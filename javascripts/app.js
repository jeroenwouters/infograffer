
/* Controllers */



function InfographicsCtrl($scope, Items, Map){

	//Default Value
	$scope.checked1 = true;
	$scope.checked2 = true;
	$scope.edit = false;
	$scope.clickmapval = false;
	
	//get data
	/*
	$http.get('data.json').success(function(data) {
		$scope.items = data;
	});
	*/
	$scope.items = Items.query();
	$scope.maps = Map.query();
	
	   $(document).mousemove(function(e){
	   		var $window = $(window);
	   		var windowsize = $window.height();
	   		var windowsize2 = $window.width();
	   		var height = windowsize/2 - 305;
	   		var width = windowsize2/2 - 320;
	    	$scope.paegex = e.pageX - width;
	    	$scope.paegey = e.pageY - height;
	    });
	
	//New Item
	$scope.addItem = function(){
	
	//$("#map").click(function(e){
		if($scope.clickmapval == true && $scope.edit == true){
	   		var newitem = ({
				"label": "New!",
				"value": 100,
				"x": $scope.paegex,
				"y": $scope.paegey,
				"back": '#222222'
				});
			$scope.items.push(Items.create(newitem));
		}
	//});
	}
	//Edit Item
	$scope.Edit = function() {

		angular.forEach($scope.maps, function(map) {
			Map.save({
				id : map._id
			},{
				center: map.center,
				zoom: map.zoom,
			});
		});
		checkWidth();
		$scope.edit = !$scope.edit;
		$scope.checked1 = !$scope.checked1;
		$scope.checked2 = !$scope.checked2;
		angular.forEach($scope.items, function(item) {
			Items.save({
				id : item._id
			},{
				label : item.label, 
				value : item.value,
				x : item.x,
				y : item.y,
				bimage : item.bimage,
				back: item.back,
			});
		})
		
		if($scope.edit == false){
			$('.edit').html('Edit On');
		}else{
			$('.edit').html('Edit Off');
		}
	}
	
	//Remove
	$scope.Remove = function(obj) {
       $scope.items.splice($scope.items.indexOf(obj), 1);
       Items.destroy({ id : obj._id});
    }
    
	$scope.ToggleClickAdd = function(){
		$scope.clickmapval = !$scope.clickmapval;
		
		if($scope.clickmapval == true){
			$('.clickadd').html('Click to Add = On');
		}else{
			$('.clickadd').html('Click to Add = Off');
		}
	}
	
}
var module = angular
.module('myApp', ['ngResource']).
    factory('Items', function($resource){
  return $resource('http://localhost\\:3000/items/:id', {
  	 id : '@id',
  }, {
     query : { method : 'GET', isArray : true},
     save : { method : 'PUT' }, //this is the update method
     create : { method : 'POST' },
     destroy : { method : 'DELETE' }
  });
}).
    factory('Map', function($resource){
  return $resource('http://localhost\\:3000/maps/:id', {
  	 id : '@id',
  }, {
     query : { method : 'GET', isArray : true},
     save : { method : 'PUT' }, //this is the update method
     create : { method : 'POST' },
     destroy : { method : 'DELETE' }
  });
}).directive('item', function () {
            return {
                restrict:'E', 
	           template: '<div class="circle" style="width:{{item.value}}px;height:{{item.value}}px;left:{{item.x}}px;top:{{item.y}}px;background-image: url({{item.back}});background-color: {{item.back}};"></br>\
	           <div class="labels" style="top: {{item.topval}}px"><h1 class="subheader"><p ng-show="checked1">{{item.label}}</p><input ng-show="edit" ng-model="item.label" class="labels type="text" value="{{item.label}}"/></h1></div>\
	           <input ng-show="edit" class="color" ng-model="item.back"/>\
	           <div class="values" style="top:{{item.topval}}px;"><h2 class="subheader"><p ng-show="checked2">{{item.value}}</p><input ng-show="edit" class="values" ng-model="item.value" type="text" value="{{item.value}}"/></h2></div>\
	           <a class="alert button" ng-show="edit && !clickmapval" ng-click="Remove(item)" href="#">x</a></div>',
	           link: function(scope){
		           if(!scope.item.back){
			           scope.item.back = '#222222';
		           }
		           scope.item.topval = scope.item.value/2 - 60;
		           $('input').change(function(){
			           scope.item.topval = scope.item.value/2 - 60;
		           });
		           
	           }
            };
});

$(document).ready(function() {
    // Optimalisation: Store the references outside the event handler:
   

    $(window).resize(checkWidth);
});

var $window = $(window);
    var $pane = $('#pane1');
    checkWidth();
    
    $('.mapcenter').change(function(){
	   checkWidth(); 
    });
    
 

    	
    function checkWidth() {
        var windowsize = $window.height();
         var height = windowsize/2 - 305;
	     $('#map').css('top', height+'px');
     }