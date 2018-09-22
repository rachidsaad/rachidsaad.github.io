function getData(link,limit,divID){
$.ajax({
		method: 'GET',
		data:{
			limit : limit
		},
		dataType: 'json',
		url: link,
		tryCount: 0,
		retryLimit: 2,
		index: 1,
		success: function(redditData){
			if(!$.trim(redditData.data.children)){
				$('#'+divID+' ul').append('<li><h2>No results matching your search.</h2></li>');
			}else{
			var Books = [],
				etr   = 1;
			$.map(redditData.data.children,function(thread, ind){

				var bookAndChap      = thread.data.title.toLowerCase(),
					link	   		 = thread.data.url,
					Rdate 	   		 = thread.data.created,
					date       		 = new Date(1000*Rdate).toLocaleString(),
					redditLink		 = "https://www.reddit.com"+thread.data.permalink,
					score			 = thread.data.score,
					comments		 = thread.data.num_comments,
					self			 = thread.data.is_self;
				
				if(!self){
					var	book    = bookAndChap.replace(/-*\d/gi,'').replace(/\s*\-\s* | \s*\,\s*/gi,'').trim(),
					    chapter = bookAndChap.match(/\d+/gi);
					var bookX = book.match(/chapter.*\b/gi);
					if(bookX != null){
						book=book.replace(/chapter.*\b/gi,'').replace(/\s*\ \s* | \s*\,\s*/gi,'').trim();
					}
					if(chapter != null){
						if(chapter.length>1){
							chapter = chapter[0]+" - "+chapter[1];
						}
						else if(chapter.length=1){
							chapter = chapter[0];
						}
					}else(chapter = 'XXX');

					var novel = {title:book,chapter:chapter,link:link,date:date,redditLink:redditLink,score:score,comments:comments};
					Books.push(novel);	
				}		
			});
			newA=[];
			$.map(Books,function(data,indes){
				if(newA.indexOf(data.title) === -1){
        			newA.push(data.title);
        			$('#'+divID+' ul').append(
        				
        				"<li><span class='numbers'>"
        				+etr+
        				"</span ><span class='bookups icones icon-th'></span><h2>"
        				+data.title+
        				"</h2><a class='icones icon-link' href='"
        				+data.link+
        				"'><h3>Chapter: "
        				+data.chapter+
        				"</h3></a><p><a href='"
        				+data.redditLink+
        				"' class='sublinks'><span class='icones icon-reddit'>Reddit Thread</span><span class='icones icon-thermo'>Score: "
        				+data.score+
        				"</span><span class='icones icon-commento'>Comments: "
        				+data.comments+
        				"</span></a></p><p id='date'>"
        				+data.date+"</p></li>"
					);
					etr++;
    			}
			});

			var updates 	= $('#updates'),
				novelsearsh = $('#novelsearsh'),
				hideSearch  = $('#confiozesearsh');

			$('.bookups').on('click',function(){
				window.currentPlace = $(this).parent().offset().top;

				query = $(this).siblings('h2').text();
				updates.hide();
				novelsearsh.show();
				hideSearch.hide();
				$('img#spin').show();
				$('#novelsearsh ul li h1').text(query);
				getLatest(query, 30,'novelsearsh');
				$('body,html').animate({scrollTop:0},500);
			});

			$('.icon-cancel').on('click',function(){
				updates.show();
				novelsearsh.hide();
				hideSearch.show();
				$('#novelsearsh ul li:gt(0)').remove();
				$('body,html').animate({scrollTop:window.currentPlace},500);
			});

		}
		},
		beforeSend: function(jqXHR, settings){
			console.log('loading'+ ' / url: '+settings.url);
		},
		complete: function(){
			console.log('complete '+ divID );
			$('img#spin').hide();
		},
		error: function(xhr, status, error){
			if (status == 'timeout' || xhr.status == 503) {
				console.log(xhr.status);
            this.tryCount++;
            if (this.tryCount <= this.retryLimit) {
                //try again
                $.ajax(this);
                return;
            }         
            return;
        	}
		}
	});
};

function getLatest(query, limit,divID){
	$.ajax({
		method: 'GET',
		data:{
			q: query,
			sort : 'new',
			restrict_sr : 'on',
			limit : limit,
			t:      'all'
		},
		dataType: 'json',
		url: 'https://www.reddit.com/r/QidianUnderground/search.json?',
		tryCount: 0,
		retryLimit: 2,
		index: 1,
		success: function(redditData){
			if(!$.trim(redditData.data.children)){
				$('#'+divID+' ul').append('<li><h2>No results matching your search.</h2></li>');
			}else{
			var Books = [],
				etr   = 1;
			$.map(redditData.data.children,function(thread, ind){

				var bookAndChap      = thread.data.title.toLowerCase(),
					link	   		 = thread.data.url,
					Rdate 	   		 = thread.data.created,
					date       		 = new Date(1000*Rdate).toLocaleString(),
					redditLink		 = "https://www.reddit.com"+thread.data.permalink,
					score			 = thread.data.score,
					self			 = thread.data.is_self;

				if(!self){
				var	book    = bookAndChap.replace(/-*\d/gi,'').replace(/\s*\-\s* | \s*\,\s*/gi,'').trim(),
				    chapter = bookAndChap.match(/\d+/gi);

				var bookX = book.match(/chapter.*\b/gi);
				if(bookX != null){
					book=book.replace(/chapter.*\b/gi,'').replace(/\s*\ \s* | \s*\,\s*/gi,'').trim();
				}

				if(chapter != null){
					if(chapter.length>1){
						chapter = chapter[0]+" - "+chapter[1];
					}
					else if(chapter.length=1){
						chapter = chapter[0];
					}
				}else(chapter = 'XXX');
				
				bookAndChap = book+" - "+chapter;
				var novel = {bookAndChap:bookAndChap,title:book,chapter:chapter,link:link,score:score};
				Books.push(novel);	
				}
			});

			newA=[];
			num = 0;
			$.map(Books,function(data,indes){
				if(newA.indexOf(data.bookAndChap) === -1){
        			newA.push(data.bookAndChap);
        			$('#'+divID+' ul').append("<li><h2>"+data.title+"</h2><a class='icones icon-link' href='"+data.link+"'><h3>Chapter: "+data.chapter+"</h3></a></li>");
        			num+=data.score;
					etr++;					
    			}
			});
			globoscore = Math.ceil(num/(newA.length-1));
			$('#'+divID+' ul li span.globoscorescore').text("Novel Score: "+globoscore);
			}
		},
		beforeSend: function(jqXHR, settings){
			console.log('loading'+ ' / url: '+settings.url);
		},
		complete: function(){
			console.log('complete '+ divID );
			$('img#spin').hide();
		},
		error: function(xhr, status, error){
			if (status == 'timeout' || xhr.status == 503) {
				console.log(xhr.status);
            this.tryCount++;
            if (this.tryCount <= this.retryLimit) {
                //try again
                $.ajax(this);
                return;
            }         
            return;
        	}
		}
	});
};

function novelList(link,limit,divID){
$.ajax({
		method: 'GET',
		data:{
			limit : limit
		},
		dataType: 'json',
		url: link,
		tryCount: 0,
		retryLimit: 2,
		index: 1,
		success: function(redditData){
			if(!$.trim(redditData.data.children)){
				$('#'+divID+' ul').append('<li><h2>No results matching your search.</h2></li>');
			}else{
			var Books = [];
			$.map(redditData.data.children,function(thread, ind){

				var bookAndChap      = thread.data.title.toLowerCase(),
					self			 = thread.data.is_self;
				
				if(!self){
					var	book    = bookAndChap.replace(/-*\d/gi,'').replace(/\s*\-\s* | \s*\,\s*/gi,'').trim(),
						bookX = book.match(/chapter.*\b/gi);
					if(bookX != null){
						book=book.replace(/chapter.*\b/gi,'').replace(/\s*\ \s* | \s*\,\s*/gi,'').trim();
					}

					var novel = {title:book};
					Books.push(novel);	
				}		
			});
			newA=[];
			$.map(Books,function(data,indes){
				if(newA.indexOf(data.title) === -1){
        			newA.push(data.title);
        			$('#'+divID+' ul').append(
        				"<li><h5>"+data.title+"</h5></li>"
					);
    			}
			});
			$('#novellist ul li').on('click',function(){
				name = $(this).children('h5').text();
				localStorage.setItem("novelName",name);
				window.open('novel.html?q='+name,'_self');

			});
		}
		},
		beforeSend: function(jqXHR, settings){
			console.log('loading'+ ' / url: '+settings.url);
		},
		complete: function(){
			console.log('complete '+ divID );
		},
		error: function(xhr, status, error){
			if (status == 'timeout' || xhr.status == 503) {
				console.log(xhr.status);
            this.tryCount++;
            if (this.tryCount <= this.retryLimit) {
                //try again
                $.ajax(this);
                return;
            }         
            return;
        	}
		}
	});
};

function novelInfo(divID){
$.ajax({
		method: 'GET',
		dataType: 'json',
		url: 'novel.json',
		tryCount: 0,
		retryLimit: 2,
		index: 1,
		success: function(novelData){
			if(!$.trim(novelData.novel)){
				$('#'+divID+' ul').append('<li><h2>No results.</h2></li>');
			}else{
			$.each(novelData.novel,function(index, novel){
				var title 		  = novel.title,
					synopsis 	  = novel.synopsis,
				    selectedNovel = localStorage.getItem("novelName");
				    if(title = selectedNovel){
				    	c=synopsis.split(" #exp# ");
				    	newSyn='';
				    	$.each(c, function(ind,item){
				    		newSyn+='<p>'+item+'</p>';
				    	});
				    	$('#'+divID+' ul').append('<li>Synopsis:'+newSyn+'</li>')
				    	return false;
				    }
			});
			}
		},
		beforeSend: function(jqXHR, settings){
			console.log('loading'+ ' / url: '+settings.url);
		},
		complete: function(){
			console.log('complete '+ divID );
		},
		error: function(xhr, status, error){
			if (status == 'timeout' || xhr.status == 503) {
				console.log(xhr.status);
            this.tryCount++;
            if (this.tryCount <= this.retryLimit) {
                //try again
                $.ajax(this);
                return;
            }         
            return;
        	}
		}
	});
};