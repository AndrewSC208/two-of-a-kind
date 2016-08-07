/* 
  
  Assumes basic JavaScript knowledge; jQuery knowledge helps a lot.

  ## Exercises

  1. Clicking the button should generate two random hands in memory (console.log).
  2. Clicking the button should render two random hands on the page as cards.
  3. Determine the winning hand by its number of pairs, add class="winning" to hand.
  4. Determine winning pairs and add class="pair0" (or "pair1" for 2nd pair) to cards.
  5. [Extra Credit] Ensure that 90% of hands have at least one pair.

*/

Poker = (function($) {

    var ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    var suits = ['spade', 'heart', 'diamond', 'club'];

    // *-* public methods *-*

    var init = function() {
        $(".buttons button").on("click", eventPlayAgainClicked);
    };

    // *-* utility methods *-*

    var makeHand = function() {
        var deck      = new Stack();
        var hand      = new Stack();
        var discards  = new Stack();
        var cards     = [];
        var deltCards = [];

        // card constructor:
        function Card(rank, suit) {
            this.rank = rank;
            this.suit = suit;
        }

        // stack constructor:
        function Stack() {
            this.cards    = new Array();
            this.makeDeck = stackMakeDeck;
            this.shuffle  = stackShuffle;
            this.deal     = stackDeal;
            this.combine  = stackCombine;
            this.addCard  = stackAddCard;
        }

        // Stack Methods:
        function stackMakeDeck(n) {

            var ranks = new Array('2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A');
            var suits = new Array('spade', 'heart', 'diamond', 'club');
            var i, j, k;
            var m;
            

            m = ranks.length * suits.length;

            this.cards = new Array(n * m);

            for(i = 0; i < n; i++) {
                for(j = 0; j < suits.length; j++) {
                    for(k = 0; k < ranks.length; k++) {
                        this.cards[i * m + j * ranks.length + k] = new Card(ranks[k], suits[j]);
                    }
                }
            }
        }

        function stackShuffle(n) {
            var i, j, k;
            var temp;

            for(i = 0; i < n; i++) {
                for(j = 0; j < this.cards.length; j++) {
                    k = Math.floor(Math.random() * this.cards.length);
                    temp = this.cards[j];
                    this.cards[j] = this.cards[k];
                    this.cards[k] = temp;
                }
            }
        }

        function stackDeal() {
            if(this.cards.length > 0) {
                return this.cards.shift();
            }
            else {
                return null;
            }
        }

        function stackCombine(stack) {
            this.cards = this.cards.concat(stack.cards);
            stack.cards = new Array();
        }

        function stackAddCard(card) {
            this.cards.push(card);
        }

        function discard() {
            discards.combine(hand);
        }

        function playerCount() {
            return $('.hand').length;
        }

        function deal(n) {
            var i;
            discard();
            for(i = 0; i < n; i++) {
                hand.addCard(deck.deal());    
            }
        }

        deck.makeDeck(1);
        deck.shuffle(1);
        deal(5 * playerCount());
        
        while(hand.cards.length) {
           deltCards = cards.push(hand.cards.splice(0,5));
        };

        return cards;
    };

    var sortTableCards = function(cards) {
        var sortedCards = [];
        var i;

        for(i = 0; i < cards.length; i++) {

            cards[i].sort(function(a, b) {
                if(ranks.indexOf(a.rank) > ranks.indexOf(b.rank)) {
                    return 1;
                }
                if(ranks.indexOf(a.rank) < ranks.indexOf(b.rank)) {
                    return -1;
                }
                return 0;
            });
            sortedCards.push(cards[i]);
        }
        return sortedCards;
    }

    function clearTable(){
        $('.winning').removeClass('winning');
        $('.card').remove();
    }

    /* *-* +++===%%% event methods %%%===+++ *-* */

    var eventPlayAgainClicked = function() {
        var tabelCards;
        var pairsMap;
        var sortedCards;

        clearTable();

        tabelCards = makeHand();

        writeCards(tabelCards);
        displayCards(tabelCards);

        sortedCards = sortTableCards(tabelCards);
        pairsMap = mapPairs(sortedCards);
        
        rankPairs(sortedCards, pairsMap); 
    };

    var writeCards = function(deltCards) {
        var i, e;
    	for(i = 0; i < deltCards.length; i++) {
    		var playerNum = i+1;
    		console.log('Player_' + playerNum + '_cards:' );
    		for(e = 0; e < deltCards[i].length; e++) {
    			console.log(deltCards[i][e]);
    		};
    	};
    };

    var displayCards = function(deltCards, players) {
    	var player_n = $('.hand');
    	var pos = 0;
    			
    	for(var i = 0; i < player_n.length; i++) {
    		pos = i+1;
    		pos.toString();
    		
    		for(var e = 0; e < deltCards[i].length; e++) {
    			$(".hand:nth-of-type(" + pos + ")").append("<img src='http://h3h.net/images/cards/" + deltCards[i][e].suit.toString() + "_" + deltCards[i][e].rank.toString() + ".svg' class='card'>");
    		};
    	};
    };

    // map pairs for ranking, and player pair array
    var mapPairs = function(deltCards) {
        var pairArray                    = [[], []];
        var allPlayersCardsCountMapArray = [];
        var playerCardCountMap           = {};
        var i, k, j;

        for(var i = 0; i < deltCards.length; i++) {

            var org = [], copy = [], pairs = {}, count = 0, tempArray = [];

            $.each(deltCards[i], function(key, value) {
                org.push(deltCards[i][key].rank);
            });
            
            copy = org.slice(0);
            count = 1;
            
            for ( var k = 0; k < org.length;k++ ) {

                for (var j = k+1 ; j < copy.length; j++ ){
                    if ( org[k] === copy[j] ){
                        copy[j] = '';
                        count ++;
                    }
                }

                if (!(org[k] in playerCardCountMap)){
                    playerCardCountMap[org[k]] = count;
                }
                count = 1;
            }
        
            allPlayersCardsCountMapArray.push(playerCardCountMap);
            // empty map for second player.
            playerCardCountMap = {};

        }

        return allPlayersCardsCountMapArray;
    }

    // RANK PAIRS IN EACH PLAYERS HAND
    var rankPairs = function(cards, playersMap) {
        var player              = [];
        var pairs               = [];
        var pair                = [];
        var tablePairs          = [];
        var sortedPairsByLength = [];
        var sortedPairsByLengthAndRank = [];
        var i, k;
        
        // create array of pairs for each player:
        for (i = 0; i < cards.length; i++) {
            for (var key in playersMap[i]){
                if(playersMap[i].hasOwnProperty(key)){
                    if (playersMap[i][key] > 1 ){
                        for (k = 0; k < cards[i].length; k++){
                            if (key == cards[i][k].rank){
                                pair.push(cards[i][k]);
                            }
                        }
                        pairs.push(pair);
                        pair = [];
                    }
                }
            }
            player.push(pairs);
            pairs = [];
        }

        // concat players pairs and store them in tablePairs array:
        function makeTablePairs(playerPairs) {
            var tablePairs = [];
            var i;
            // for each player:
            for(i = 0;  i < playerPairs.length; i++) {
                tablePairs = tablePairs.concat(playerPairs[i]);
            }
            return tablePairs;
        }
    
    tablePairs = makeTablePairs(player);

        // sort tablePairs by length:
        function sortTablePairsByLength (tablePairs) {
            if(tablePairs.length == 1) {
                return tablePairs;
            } else {
                
                tablePairs.sort(function(a, b) {
                    return b.length - a.length;
                });
            }
            return tablePairs;
        }
    
    sortedPairsByLength = sortTablePairsByLength(tablePairs);
    
        function sortPairsByRankInLengthSet(sortedPairsByLength) {
            sortedPairsByLength.sort(function(a, b) {
                if(a.length === b.length) {
                    return ranks.indexOf(b[0].rank) - ranks.indexOf(a[0].rank);
                }
            });
            return sortedPairsByLength;
        }
    
    sortedPairsByLengthAndRank = sortPairsByRankInLengthSet(sortedPairsByLength);

        function assignWinningClass(playerPairs, sortedPairsByLengthAndRank) {
            if(sortedPairsByLengthAndRank.length == 0) {
                // Draw: no pairs found
                console.log("Draw, no pairs were found.");
            
            } else if(playerPairs[0].length > playerPairs[1].length) {
                // player one pairs > player two pairs (player one winner)
                $('section:nth-of-type(1)').addClass('winning');
                assignRankingClass(playerPairs[0]);
    
            } else if (playerPairs[1].length > playerPairs[0].length) {
                // player one pairs > player two pairs (player one winner)
                $('section:nth-of-type(2)').addClass('winning');
                assignRankingClass(playerPairs[1]);
            } else {
    
                if(sortedPairsByLengthAndRank[0].length == sortedPairsByLengthAndRank[1].length) {                
                    if (ranks.indexOf(playerPairs[0][0][0].rank) > ranks.indexOf(playerPairs[1][0][0].rank)) {
                        // rank of player one's pair is higher (player one wins)
                        $('section:nth-of-type(1)').addClass('winning');
                        assignRankingClass(playerPairs[0]);
                    } else {
                        // rank of player two's pair is higher (player two wins)
                        $('section:nth-of-type(2)').addClass('winning');
                        assignRankingClass(playerPairs[1]);
                    }
                    
                } else if (sortedPairsByLengthAndRank[0].length > sortedPairsByLengthAndRank[1].length) {
                    // player one's pair is a greater length (player one winns)
                    $('section:nth-of-type(1)').addClass('winning');
                    assignRankingClass(playerPairs[0]);
                } else {
                    // player two's pair is a greater length (player two winns)
                    $('section:nth-of-type(2)').addClass('winning');
                    assignRankingClass(playerPairs[1]);
                }
            }
        }

        // assign class pair0, and pair1 to winning pairs
        function assignRankingClass(winningPairs) {
            var i, e;

            for(e = 0; e < winningPairs.length; e ++) {
                if(e ==0) {
                    for(i = 0; i < winningPairs[e].length; i++) {
                        $("img[src*=" + winningPairs[e][i].suit.toString() + '_' + winningPairs[e][i].rank.toString() + "]").addClass('pair' + [e]);
                    }
                }
                if( e == 1) {
                    for(i = 0; i < winningPairs[e].length; i++) {
                        $("img[src*=" + winningPairs[e][i].suit.toString() + '_' + winningPairs[e][i].rank.toString() + "]").addClass('pair' + [e]);
                    }
                }
            }
        }

    assignWinningClass(player, sortedPairsByLengthAndRank);
    }

    // expose public methods
    return {
        init: init
    };
})(jQuery);

$(document).ready(Poker.init);
/*

The MIT License

Copyright (c) 2012 Brad Fults.

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/
