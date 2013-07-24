String.prototype.contains = function(str) {
    return (this.toLowerCase().indexOf(str.toLowerCase()) != -1);
};

var model = function (books) {
  				var _self =this;		
  				var searchArray = [];
  				_.each(bible.books, function (book) {
  				    _.each(book.chapters, function (chapter) {
  				        _.each(chapter.verses, function (verse) {
  				            searchArray.push({ book: book.name, chapter: chapter.number, verse: verse.number, text: verse.text });
  				        });
  				    });
  				});
  				this.bibles = ["ASV", "KJV"];
  				this.currentBible = ko.observable();
  				this.startingVerse = ko.observable(0);
  				this.endingVerse = ko.observable(0);
  				this.searchTerm = ko.observable();
				this.searchResults =ko.observableArray([]);
	  			this.books =ko.observableArray(books);
	  			this.chapters = ko.observableArray([]);
	  			this.verses = ko.observableArray([]);
	  			this.currentBook = ko.observable();
	  			this.currentChapter = ko.observable();
	  			this.currentBookNumber = ko.observable();
	  			this.currentChapterNumber = ko.observable();
	  			this.tweets = ko.observableArray([]);
				this.queryString = ko.observable();
				
	  			this.random = false;
				this.backAChapter = false;
				
				this.searchResultsVisible =ko.observable(false);
				this.searchVisible =ko.observable(false);
				this.mainVisible =ko.observable(true);
				this.searchTerm = ko.observable();
				this.searchClickChapter = ko.observable();
				this.searchResults =ko.observableArray([]);

				this.searchResultLength = ko.computed(function(){
						return _self.searchResults().length;
				});
				this.getSearchData = function () {
				    
				    var searchTerm = _self.searchTerm();
				    if (!searchTerm) return;
					var verses = _.filter(searchArray, function (verse) {
						var chVerse = verse.chapter + ":" + verse.verse;
						return verse.text.contains(searchTerm) || (searchTerm.contains(verse.book) && searchTerm.contains(chVerse));
					});
					var searchResult = _.map(verses, function (verse) {
					    verse.click = function() {
					        var book = _.find(_self.books(), function(b) { return b.Book == verse.book; });
					        _self.currentBook(book);
					        _self.searchResultsVisible(false);
					        _self.searchClickChapter(verse.chapter);
					        _self.homeClick();
					    };
					    
					    return verse;
					});
					_self.searchResults(searchResult);
					_self.searchResultsVisible(true);
					
					_self.searchCheck = _self.searchTerm();
				};

	  			this.currentBible.subscribe(function (newValue) {
	  				if (newValue && _self.currentBook()) {
	  					getBookFromBible();
	  				}
	  			});
	  		
	  			this.currentBook.subscribe(function(newValue){
	  				if(newValue)
	  				{
	  					getBookFromBible();
	  					_self.currentBookNumber(newValue.Number-1);	  						
	  				}
  					
	  			});

	  			this.currentChapter.subscribe(function(newValue){
	  				if(newValue){
						if(_self.searchClickChapter()){
							newValue.number = _self.searchClickChapter();
							_self.searchClickChapter(null);														
						}
						else{
							_self.searchResultsVisible(false);
						}
	  					_self.currentChapterNumber(newValue.number-1);
						_self.verses(_.map(newValue.verses, function(verse){ 
							var isVisible = parseInt(verse.number) >= parseInt(_self.startingVerse()) && parseInt(verse.number) <= parseInt(_self.endingVerse())
							verse.visible = ko.observable(isVisible); 
							return verse;
						}));
						
						
						_self.startingVerse(1);
	  				    _self.endingVerse(newValue.verses.length);
						
	  				}
	  			});
				
				this.startingVerse.subscribe(function(){
					_.each(_self.verses(),function(verse){
						var isVisible = parseInt(verse.number) >=  parseInt(_self.startingVerse()) && parseInt(verse.number) <= parseInt(_self.endingVerse());
						verse.visible(isVisible); 
					});
				});
				this.endingVerse.subscribe(function(){
					_.each(_self.verses(),function(verse){
						var isVisible = parseInt(verse.number) >=parseInt(_self.startingVerse()) && parseInt(verse.number) <= parseInt(_self.endingVerse());
						verse.visible(isVisible); 
					});
				});
								
				this.nextChapter = function(){
					if(_self.currentChapterNumber()+1<_self.chapters().length){
						_self.currentChapter(_self.chapters()[_self.currentChapterNumber()+1])
					}
					else{
						if(_self.currentBookNumber()+1<66){
							_self.currentBook(_self.books()[_self.currentBookNumber()+1]);
							_self.currentChapter(_self.chapters()[0]);
						}
					}
				};
                this.previousChapter = function() {
                    if (_self.currentChapterNumber() > 0) {
                        _self.currentChapter(_self.chapters()[_self.currentChapterNumber() - 1])
                    } else {
                        if (_self.currentBookNumber() > 0) {
                            _self.backAChapter = true;
                            _self.currentBook(_self.books()[_self.currentBookNumber() - 1]);

                        }
                    }
                };

	  			var getRandomNumber = function(maxNumber){

	  			return Math.floor(Math.random() * (maxNumber)) +1;
	  		};

	  		this.getRandomChapter = function(){
	  			var randombooknumber = getRandomNumber(_self.books().length);
	  			var book = _.find(_self.books(), function(book){return book.Number == randombooknumber;});
	  			_self.random=true;
	  			_self.currentBook(book);
	  			
	  		};
			
  			var getBookFromBible = function(){
  			    var currentBook = _.find(bible.books, function (book) { return book.name == _self.currentBook().Book; });
  			    _self.chapters(currentBook.chapters);

  			    if (_self.currentChapterNumber()) {
  			        _self.currentChapter(currentBook.chapters[_self.currentChapterNumber()]);
  			    }

  			    else {
  			        _self.currentChapter(currentBook.chapters[0]);
  			    }


  			    if (_self.currentChapterNumber()) {
  			        _self.currentChapter(currentBook.chapters[_self.currentChapterNumber()]);
  			    }


  			    if (_self.random) {
  			        var randomchapternumber = getRandomNumber(_self.chapters().length);
  			        var chapter = _.find(_self.chapters(), function (ch) { return ch.number == randomchapternumber; });
  			        _self.currentChapter(chapter);
  			        _self.random = false;
  			    }
  			    if (_self.backAChapter) {
  			        _self.currentChapter(currentBook.chapters[currentBook.chapters.length - 1]);
  			        _self.backAChapter = false;
  			    }
  			};  			

  		};