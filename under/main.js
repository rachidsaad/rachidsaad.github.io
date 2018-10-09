function timeSince(date) {

  var secs = Math.floor(((new Date().getTime()/1000) - date));

  var intVal = Math.floor(secs / 31536000);
  if (intVal >= 1) {
  	if(intVal > 1){
  		return intVal + " years ago";
  	}
  	else if(intVal = 1){
  		return "a year ago";
  	}
  }

  intVal = Math.floor(secs / 2592000);
  if (intVal >= 1) {
  	if(intVal > 1){
  		return intVal + " months ago";
  	}
  	else if(intVal = 1){
  		return "a month ago";
  	}
  }

  intVal = Math.floor(secs / 86400);
  if (intVal >= 1) {
  	if(intVal > 1){
  		return intVal + " days ago";
  	}
  	else if(intVal = 1){
  		return "a day ago";
  	}
  }

  intVal = Math.floor(secs / 3600);
  if (intVal >= 1) {
  	if(intVal > 1){
  		return intVal + " hours ago";
  	}
  	else if(intVal = 1){
  		return "an hour ago";
  	}
  }

  intVal = Math.floor(secs / 60);
  if (intVal >= 1) {
  	if(intVal > 1){
  		return intVal + " minutes ago";
  	}
  	else if(intVal = 1){
  		return "a minutes ago";
  	}
  }

  return Math.floor(secs) + " seconds ago";
};

function cleanUrl(qfs,toClean){
	return qfs+toClean.replace(/[':,."]/g, "%27").replace(/ /g, "+");
};

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
				$('#'+divID+' ul li:eq(1)').append('<h2>No results matching your search.</h2>');
			}else{
			var Books = [],
				etr   = 1;
			$.map(redditData.data.children,function(thread, ind){

				var bookAndChap      = thread.data.title.toLowerCase(),
					link	   		 = thread.data.url,
					Rdate 	   		 = thread.data.created_utc,
					date       		 = timeSince(Rdate),
					redditLink		 = "https://www.reddit.com"+thread.data.permalink,
					score			 = thread.data.score,
					comments		 = thread.data.num_comments,
					self			 = thread.data.is_self;

				if(!self){

					var book 	= bookAndChap.replace(/-*\-/gi,' ').replace(/[&\/\\#+()!$~%."*?<>{}]/g, ''),
					chapter = bookAndChap.match(/\d+/gi);

					if(book.match(/ *\d+/gi,'')!==null){
						num  = book.match(/ *\d+/gi,'')[0];
						book = book.substring(0,book.indexOf(num));
					}

					var bookX = book.match(/chapter.*\b/gi);
					if(bookX != null){
						book=book.replace(/chapter.*\b/gi,'').trim();
					}

					bookComp = book.toLowerCase().replace(/the /g,'').trim();
					bookComp = bookComp.replace(/ +/g, "").substring(0,16);

					if(chapter != null){
						if(chapter.length>1){
							// chapter = chapter[0]+" - "+chapter[1];
							chapter = chapter.join(' - ');
						}
						else if(chapter.length=1){
							chapter = chapter[0];
						}
					}else(chapter = 'XXX');

					if(bookComp.length>=7){
						bookAndChap = book+" - "+chapter;
						var novel = {title:book,bookComp:bookComp,chapter:chapter,link:link,date:date,redditLink:redditLink,score:score,comments:comments};
						Books.push(novel);	
					}	
				}		
			});
			newA=[];
			$.map(Books,function(data,indes){
				if(newA.indexOf(data.bookComp) === -1){
        			newA.push(data.bookComp);
        			url = cleanUrl("novel.html?q=",data.title);
        			$('#'+divID+' ul').append(
        				
        				"<li><span class='numbers'>"
        				+etr+
        				"</span><span class='bookups icones icon-more'></span><span class='read icones icon-book-open'></span><a href='"
        				+url+
        				"' class='link'><h2>"
        				+data.title+
        				"</h2></a><a class='icones icon-link' href='"
        				+data.link+
        				"' target='_blank'><h3>Chapter: "
        				+data.chapter+
        				"</h3></a><p><a href='"
        				+data.redditLink+
        				"' class='sublinks' target='_blank'><span class='icones icon-fire'>Reddit Thread</span><span class='icones icon-thermo'>Score: "
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

				query = $(this).siblings('a.link').children('h2').text();
				updates.hide();
				novelsearsh.show();
				hideSearch.hide();
				$('img#spin').show();
				$('#novelsearsh ul li:eq(0)').append("<h1>"+query+"</h1>");
				getLatest(query, 30,'novelsearsh');
				$('body,html').animate({scrollTop:0},500);

				visiDiv = $('.updates:visible:eq(0)').attr('id');
				localStorage.setItem("visiDiv",visiDiv);
			});

			$('#novelsearsh .icon-cancel').on('click',function(){
				updates.show();
				novelsearsh.hide();
				hideSearch.show();
				$('span.globoscorescore').empty();
				$('#novelsearsh ul li:eq(0) h1 ,#novelsearsh ul li:gt(1)').remove();
				$('body,html').animate({scrollTop:window.currentPlace},300);

				visiDiv = $('.updates:visible:eq(0)').attr('id');
				localStorage.setItem("visiDiv",visiDiv);
			});

			$("#updates .read").on('click', function(){
				$(this).after("<span class='spinner'><img id='spin' src='imgs/spiny.gif'></span>");
				url=$(this).siblings('a.icon-link').attr('href');
				window.currentPlace = $(this).parent().offset().top;
				Reader(url);
			});

			$('#reader .icon-cancel').on('click', function(){
				$('.spinner').remove();
				$('#reader .text').empty();
				$('#reader').hide();
				$('#wrap').show();
				if(typeof window.currentPlaceSearsh == 'undefined'){
					$('body,html').animate({scrollTop:window.currentPlace},300);
				}else if(typeof window.currentPlaceSearsh !== 'undefined') {
					$('body,html').animate({scrollTop:window.currentPlaceSearsh},300);
					window.currentPlaceSearsh = undefined;
				}
			});

			$('#updates ul li a h2').on('click',function(e){
				name = $(this).text();
				visiDiv = localStorage.getItem("visiDiv");
				$('body,html').animate({scrollTop:0},300);
				novelInfo('#'+visiDiv,name);				
				e.preventDefault();
			});
		}
		},
		beforeSend: function(jqXHR, settings){
			console.log('loading'+ ' / url: '+settings.url);
		},
		complete: function(){
			console.log('complete '+ divID );
			$('img#spin').hide();
			visiDiv = $('.updates:visible:eq(0)').attr('id');
			localStorage.setItem("visiDiv",visiDiv);
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

function getLatest(query,limit,divID){
	$.ajax({
		method: 'GET',
		data:{
			q: query,
			sort : 'new',
			restrict_sr : 'on',
			t: 'all',
			limit : limit
		},
		dataType: 'json',
		url: 'https://www.reddit.com/r/QidianUnderground/search.json?',
		tryCount: 0,
		retryLimit: 2,
		index: 1,
		success: function(redditData){
			if(!$.trim(redditData.data.children)){
				$('#'+divID+' ul li:eq(1)').empty().append('<h2>No results matching your search.</h2>');
			}else{
			var Books = [],
				etr   = 1;
				$.map(redditData.data.children,function(thread, ind){

					var bookAndChap  = thread.data.title.toLowerCase(),
					link	   		 = thread.data.url,
					Rdate 	   		 = thread.data.created_utc,
					date       		 = timeSince(Rdate),
					redditLink		 = "https://www.reddit.com"+thread.data.permalink,
					score			 = thread.data.score,
					self			 = thread.data.is_self;

					if(!self){

						var book 	= bookAndChap.replace(/-*\-/gi,' ').replace(/[&\/\\#+()!$~%."*?<>{}]/g, ''),
							chapter = bookAndChap.match(/\d+/gi);

						if(book.match(/ *\d+/gi,'')!==null){
							num  = book.match(/ *\d+/gi,'')[0];
							book = book.substring(0,book.indexOf(num));
						}


						var bookX = book.match(/chapter.*\b/gi);
						if(bookX != null){
							book=book.replace(/chapter.*\b/gi,'').trim();
						}

						bookComp = book.toLowerCase().replace(/the /g,'').trim();
						bookComp = bookComp.replace(/ +/g, "").substring(0,16);

						if(chapter != null){
							if(chapter.length>1){
								// chapter = chapter[0]+" - "+chapter[1];
								chapter = chapter.join(' - ');
							}
							else if(chapter.length=1){
								chapter = chapter[0];
							}
						}else(chapter = 'XXX');

						if(bookComp.length>=7){
							bookAndChap = book+" - "+chapter;
							var novel = {bookComp:bookComp,bookAndChap:bookAndChap,title:book,chapter:chapter,link:link,score:score,date:date};
							Books.push(novel);	
						}
					}
				});

			newA=[]; bestMatch = [];
			num = 0;

			if(divID=="search_results"){
				$('#'+divID+' ul').append("<li class='bestmatch'><h1>Novels:</h1></li>")
				$.map(Books,function(data,ind){
					if(bestMatch.indexOf(data.bookComp) === -1){
						bestMatch.push(data.bookComp);
						url = cleanUrl("novel.html?q=", data.title);
						$('#'+divID+' ul li.bestmatch').append("<a href='"+url+"' class='icones icon-link'><h2>"+data.title+"</h2></a>");
					}
				});
			}

			$.map(Books,function(data,indes){
				if(newA.indexOf(data.bookAndChap) === -1){
        			newA.push(data.bookAndChap);
        			$('#'+divID+' ul').append("<li><span class='read icones icon-book-open'></span><h2>"+data.title+"</h2><a class='icones icon-link' href='"+data.link+"' target='_blank'><h3>Chapter: "+data.chapter+"</h3></a><p id='date'>"+data.date+"</p></li>");
        			num+=data.score;
					etr++;					
    			}
			});

			if(divID=="novelsearsh"){
				globoscore = Math.ceil(num/(newA.length-1));
				$('#'+divID+' ul li:eq(1)').empty().append("<span class='globoscorescore'></span>");
				$('#'+divID+' ul li span.globoscorescore').text("Novel Score: "+globoscore);
			}

			$("#novelsearsh .read, #search_results .read").on('click', function(){
				url=$(this).siblings('a.icon-link').attr('href');
				$(this).after("<span class='spinner'><img id='spin' src='imgs/spiny.gif'></span>");
				window.currentPlaceSearsh = $(this).parent().offset().top;
				Reader(url);
			});

			$('#search_results li a h2').on('click',function(){
				// name = $(this).text();
				// localStorage.setItem("novelName",name);
				// window.open('novel.html?q='+name,'_self');
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

						var book 	= bookAndChap.replace(/-*\-/gi,' ').replace(/[&\/\\#+()!$~%."*?<>{}]/g, '');

						if(book.match(/ *\d+/gi,'')!==null){
							num  = book.match(/ *\d+/gi,'')[0];
							book = book.substring(0,book.indexOf(num));
						}

						var bookX = book.match(/chapter.*\b/gi);
						if(bookX != null){
							book=book.replace(/chapter.*\b/gi,'').trim();
						}

						bookComp = book.toLowerCase().replace(/the /g,'').trim();
						bookComp = bookComp.replace(/ +/g, "").substring(0,16);
						
						if(bookComp.length>=7){
							var novel = {title:book,bookComp:bookComp};
							Books.push(novel);	
						}
					}		
			});
			newA=[];
			$.map(Books,function(data,indes){
				if(newA.indexOf(data.bookComp) === -1){
        			newA.push(data.bookComp);
        			url = cleanUrl("novel.html?q=",data.title);
        			$('#'+divID+' ul').append(
        				"<li><a href='"+url+"'><h5>"+data.title+"</h5></a></li>"
					);
    			}
			});

			$('#novellist ul li:gt(0) a').on('click',function(e){
				name = $(this).children('h5').text();
				visiDiv = localStorage.getItem("visiDiv");

				clickedTit = localStorage.getItem("clickedTit");
				if(clickedTit==undefined || clickedTit!=name){
					novelInfo('#'+visiDiv,name);
				}
				$('body,html').animate({scrollTop:0},300);
				e.preventDefault();
			});
			$('#novelinfo  .icon-cancel').on('click', function(){
				$('#novelinfo').hide();
				$('#novelinfo ul li h1').text('');
				$('#novelinfo ul li:gt(0)').remove();
				$('#'+visiDiv).show();
				localStorage.setItem("clickedTit",undefined);
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

function novelInfo(tohide,title){
$.ajax({
		method: 'GET',
		dataType: 'json',
		url: 'novels.json',
		tryCount: 0,
		retryLimit: 2,
		index: 1,
		success: function(novelData){
			var infoDiv = '#novelinfo';
			$(infoDiv).show();
			$(tohide).hide();

			if(!$.trim(novelData.novel)){
				$(infoDiv+' ul').append('<li><h2>No results.</h2></li>');
			}else{
				var Books 		  = [],
					selectedNovel = title;

				$(infoDiv+' ul li:gt(0)').remove();
				$(infoDiv+' ul li h1').text(selectedNovel);

				localStorage.setItem("clickedTit",name);
				var itt = false;

				selectedComp = selectedNovel.toLowerCase().replace(/the /g,'').trim();
				selectedComp = selectedComp.replace(/ +/g, "").substring(0,16);

				$.map(novelData.novel, function(novel,i){
					bookComp=novel.title.toLowerCase().replace(/the /g,'').trim();
					bookComp=bookComp.replace(/ +/g, "").substring(0,16);
					if (bookComp == selectedComp) {
						synopsis = novel.synopsis.split(" #exp# ");
						paraSynop="";
						$.each(synopsis, function(k, line){
							paraSynop+="<p>"+line+"</p>";
						});
						itt = true;
						$(infoDiv+' ul').append("<li><span class='noveldata'><p><b>Author:</b></br> "
							+novel.author+
							"</p><p><b>Type:</b></br> "
							+novel.type+
							"</p><p><b>Status in COO: </b></br>"
							+novel.status+
							"</p><p><b>Genre:</b></br> "
							+novel.genre+
							"</p></span><img src='"
							+novel.cover+
							"'></li>");
						$(infoDiv+' ul').append("<li><p><b>Synopsis:</b></br>"+paraSynop+"</p></li>");
						// getLatest(selectedNovel,30,'novelinfo');
					}
				});
				if(itt==false){
					$(infoDiv+' ul').append("<li><h2>Coming soon</h2></li>");
				}
			}
		},
		beforeSend: function(jqXHR, settings){
			console.log('loading'+ ' / url: '+settings.url);
		},
		complete: function(){
			console.log('complete info' );
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

function Reader(url){
	$.ajax({
			method: 'GET',
			dataType: 'json',
			url: url,
			tryCount: 0,
			retryLimit: 2,
			index: 1,
			success: function(CryptoText){
				var pass 		  = this.url.split('#'),
					pass 		  = pass[1],
					finalText	  = "",
					decreptedText = sjcl.decrypt(pass, CryptoText.data);

				decreptedText = Base64.btou(RawDeflate.inflate(Base64.fromBase64(decreptedText))).replace(/<\/?[^>]+(>|$)/g, "");
				decreptedText = decreptedText.split("\n").filter(function(e){return e}); 				
				$.each(decreptedText, function(k, line){
					finalText+="<p>"+line+"</p>";
				});
				
				$('#reader .text').append(finalText);
			},
			beforeSend: function(jqXHR, settings){
				console.log('loading'+ ' / url: '+settings.url);
			},
			complete: function(){
				console.log('complete reader');
				$('#reader').show();
				$('#wrap').hide();				
				$('body,html').animate({scrollTop:0},300);
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