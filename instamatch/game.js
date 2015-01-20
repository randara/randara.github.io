var app = angular.module('game', ['ngFx']);

app.factory('cards',['$http',function($http){
	return{
		getBase: function(){
		// 8 cards
			cardsSeed = ['road','headphones','plus','home','star','th','film','qrcode'];
			// duplicate cards
			cards = cardsSeed.concat(cardsSeed);

			deckSize = cardsSeed.length*2;
			
			deck = []; // Creates deck

			for (i = 0; i < deckSize; i++){
				card = {
					src: cards[i],
					show: 'unchecked',
					cleared: false,
					position: i,
					flipped: false,
				}
				deck[i] = card;
			}

			return deck;
		},

		fetchImages: function(tag, callback){
            
            if(tag == 'popular'){
				apiEndPoint = "https://api.instagram.com/v1/media/popular";
            }
            else{
            	tag = tag.trim();
            	apiEndPoint = "https://api.instagram.com/v1/tags/"+tag+"/media/recent";
            }

            query = apiEndPoint+"?client_id=642176ece1e7445e99244cec26f4de1f&callback=JSON_CALLBACK";
            
            $http.jsonp(query).success(function(response){
                callback(response.data);

            });
		}

		};
}]);

app.controller('Controller', ['$scope', 'cards', function($scope, cards) {

	$scope.word = /^\s*\w*\s*$/;

	$scope.gameStarted = false;

	$scope.startGame = function(){

		if (typeof $scope.tag == 'undefined'){
			$scope.tag = 'popular';
		}

		console.log($scope.tag);

		deck = [];
		$scope.deck = [];

		cards.fetchImages($scope.tag,function(data){
			$scope.feed = data;
			for (i = 0; i < 8; i++){
				console.log($scope.feed[i].images.thumbnail);
				deck[i] = $scope.feed[i].images.thumbnail.url;
			}

			deck = deck.concat(deck);
			deck = shuffle(deck);

			for (i = 0; i < 16; i++){
				card = {
					src: deck[i],
					show: 'images/back.jpg',
					cleared: false,
					flipped: false,
				}
				$scope.deck[i] = card;
			}
		});

		
		$scope.total = 8;
		$scope.plays = 0;
		$scope.points = 0;
		$scope.matches = 0;
		$scope.message = '';

		$scope.slot1 = null;
		$scope.slot2 = null;

		$scope.gameStarted = true;

	};

	$scope.endGame = function(){
		location.reload();
	}

	function shuffle(array) {
  		var currentIndex = array.length, temporaryValue, randomIndex ;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	};

	// Gamelogic
	$scope.flip = function(c) {

		if(!c.cleared){

			if(!c.flipped){
				$scope.plays++;
				$scope.message = '';

				if($scope.slot1 == null){
					c.flipped = !c.flipped;
					c.show = c.src
					$scope.slot1 = c;
				}
				else{
					if($scope.slot2 == null){
						c.flipped = !c.flipped;
						$scope.slot2 = c;
						c.show = c.src
						if($scope.slot2.src == $scope.slot1.src){
							$scope.matches++;
							$scope.points = $scope.points + 100;
							$scope.message = 'Match!!!';
							if($scope.matches == 8){
								$scope.message = 'You Win';
							}
						}

					}
					else{
						c.show = c.src
						c.flipped = !c.flipped;

						if($scope.slot2.src == $scope.slot1.src){
							$scope.slot1.cleared = true;
							$scope.slot2.cleared = true;
						}
						else{
							$scope.slot1.flipped = false;
							$scope.slot2.flipped = false;
							$scope.slot1.show = 'images/back.jpg';
							$scope.slot2.show = 'images/back.jpg';

						}
						
						$scope.slot2 = null;
						$scope.slot1 = c;
					}

				}

			}

		}
		
    };
	
}]);

app.directive('card', function(){
	return {
		restrict: 'AE',
		templateUrl: 'card.html'
	};
});


app.directive('deck', function(){
	return {
		restrict: 'E',
		templateUrl: 'deck.html'
	}

});

