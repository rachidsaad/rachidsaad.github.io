
function SortChapter(obj){
  obj.sort(function(a, b){return b.chapter - a.chapter});
  // obj.sort(function(a,b){
  //   return -(a.chapter.localeCompare(b.chapter));
  // })
};

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
var ChapFilter = ["Living With a Temperamental Adonis","The Legend of Chu Qiao","The Adonis Next Door"];

function getData(query,link,limit,divID){

  $('#'+divID+ ' ul li:eq(0)').append("<img id='spin' src='imgs/spin.gif' alt='spinner'>");
  var updates = $("#"+divID);
  clenQ = query.replace(/the /gi,'');
$.ajax({
    method: 'GET',
    data:{
      q: clenQ,
      sort : 'new',
      restrict_sr : 'on',
      t: 'all',
      limit : limit
    },
    dataType: 'json',
    url: link,
    tryCount: 0,
    retryLimit: 2,
    index: 1,
    success: function(redditData){
      if(!$.trim(redditData.data.children)){
        $('#'+divID + ' ul').append('<li><h2>No results matching your search.</h2></li>');
        $('#textfield').val('');
      }else{
      var Books = [], etr   = 1;
      $.map(redditData.data.children,function(thread, ind){

        var bookAndChap = thread.data.title.toLowerCase(),
            link        = thread.data.url,
            Rdate       = thread.data.created_utc,
            date        = timeSince(Rdate),
            redditLink  = "https://www.reddit.com"+thread.data.permalink,
            score       = thread.data.score,
            comments    = thread.data.num_comments,
            self        = thread.data.is_self,
            thumbnail_height =  thread.data.thumbnail_height;

        if(!self && thumbnail_height == null){

          var book = bookAndChap.replace(/ *\{[^)]*\} */g, "");
          book = book.replace(/ \- |\- | \-/gi,' ').replace(/[&\/\\#+()!$~%."*?<>]/g, '').replace(/’/gi,'\'');

          if(book.match(/:/gi)!=null && book.length>10){
            var dpoin = book.match(/:/gi)[0];
            var matchLen = book.substring(0,book.indexOf(dpoin)).length;
            if(matchLen>10){
              book = book.substring(0,book.indexOf(dpoin));
            }
          }
          if(book.match(/ *\d+/gi,'')!==null){
            var num  = book.match(/ *\d+/gi,'')[0];
            book = book.substring(0,book.indexOf(num));
          }
          
          if(book.match(/chapter.*\b/gi) != null){
            book=book.replace(/chapter.*\b/gi,'').trim();
          }
          if(book.match(/ ch *\b/gi) != null){
            book=book.replace(/ ch*\b/gi,'').trim();
          }

          var bookComp = book.toLowerCase().replace(/the /gi,'').trim();
          bookComp = bookComp.replace(/ +/g, "").substring(0,10);

          var chapter = bookAndChap.match(/\d+/gi);

          if(chapter != null){
            if(chapter.length>1){
              $.each(ChapFilter, function(i,chap){
                var chapComp = chap.toLowerCase().replace(/the /gi,'').trim();
                chapComp = chapComp.replace(/ +/g, "").substring(0,10);
                if(chapComp == bookComp){
                  chapter.shift();
                }
              });
              var chapterNum = chapter[chapter.length-1] - chapter[0]+1;
              chapter = chapter.join(' - ')+" ("+chapterNum+")";
            }
            else if(chapter.length=1){
              chapter = chapter[0];
            }
          }else(chapter = 'XXX');

          if(bookComp.length>=7 && chapter !== "XXX"){
            var bookAndChap = book+" - "+chapter,
                novel       = {title:book,bookAndChap:bookAndChap,bookComp:bookComp,chapter:chapter,link:link,date:date,redditLink:redditLink,score:score,comments:comments};
            Books.push(novel);  
          }
        }
      });

      
      if(divID == 'updates'){
        var newA=[];
        $.map(Books,function(data,i){
          if(newA.indexOf(data.bookComp) === -1){
            newA.push(data.bookComp);
            var url = cleanUrl("novel.html?q=",data.title);
            updates.children('ul').append(
              "<li><span class='numbers'>"
              +etr+
              "</span><span class='bookups icones icon-plus-square' title='Table Of Contents'></span><span class='read icones icon-book-open' title='Read Chapter'></span><a href='"
              +url+
              "' class='link' title='Novel'><h2>"
              +data.title+
              "</h2></a><a class='icones icon-external-link' href='"
              +data.link+
              "' target='_blank' title='Original Paste'><h3>Chapter: "
              +data.chapter+
              "</h3></a><p><a href='"
              +data.redditLink+
              "' class='sublinks' target='_blank' title='Reddit Thread'><span class='icones icon-reddit1'>Reddit Thread</span><span class='icones icon-thermometer'>Score: "
              +data.score+
              "</span><span class='icones icon-chat_bubble_outline'>Comments: "
              +data.comments+
              "</span></a></p><p id='date'>"
              +data.date+"</p></li>"
        );
        etr++;
            }
        });
        var miniToc = $(updates.find('span.icon-plus-square')),
            read    = $(updates.find('span.read')),
            header  = $(updates.find('h2'));

        header.on('click',function(e){
          $('body,html').animate({scrollTop:0},300);
          header = $(this).text();
          scroll = $(this).parents('li').offset().top;
          novelInfo('#'+divID,header);
          localStorage.setItem('scroll',scroll);
          e.preventDefault();
        });

        miniToc.on('click',function(){
          if($(this).hasClass('icon-plus-square')){
            $(this).siblings().not('a.link').hide();
            $(this).next('span').after("<img id='load' src='imgs/spiny.gif'>");
            selectedNovel = $(this).siblings('a.link').children('h2').text();
            momy  = $(this).parents('li');
            toc(momy,selectedNovel,20,divID);
            $(this).removeClass('icon-plus-square').addClass('icon-th-menu');
            $(momy).find('.icon-th-menu').on('click',function(){
              $(this).parent('li').next('li#toc').slideToggle(150);
              $(this).siblings().not('a.link').toggle();
            });
          }
        });

        read.on('click', function(){
          var read = $(this);
          read.hide();
          read.after("<img id='load' src='imgs/spiny.gif'>");
          url=read.siblings('a.icon-external-link').attr('href');

          ttl=read.siblings('a.link').children('h2').text();
          mom=read.parent();
          redearScroll=read.parent().offset().top;
          Reader(url,ttl,mom);

          localStorage.setItem("redearScroll",redearScroll);
          setTimeout(function() {
            read.show();
          }, 3000);

        });

      }else if(divID=="search_results"){

        var bookLen = Books.length, newA=[], bestMatch = [], num = 0;
        if(bookLen>1){
          $('#'+divID+' ul').append("<li class='bestmatch'></li>");

          $.map(Books,function(data,ind){
            if(bestMatch.indexOf(data.bookComp) === -1){
              bestMatch.push(data.bookComp);
              url = cleanUrl("novel.html?q=", data.title);
              $('#'+divID+' ul li.bestmatch').append("<a href='"+url+"'><h2 class='icones icon-book1' title='Novel'>"+data.title+"</h2></a>");
            }
          });

          $.map(Books,function(data,i){
          if(newA.indexOf(data.bookAndChap) === -1){
            newA.push(data.bookAndChap);
            $('#'+divID+' ul').append("<li><span class='numbers'>"+etr+"</span><span class='read icones icon-book-open' title='Read Chapter'></span><h2>"+data.title+"</h2><a class='icones icon-external-link' href='"+data.link+"' target='_blank' title='Original Paste'><h3>Chapter: "+data.chapter+"</h3></a><p id='date'>"+data.date+"</p></li>");
            num+=data.score;
            etr++;          
            }
          });

          $('#'+divID+" .read").on('click', function(){
            var searshRead = $(this);
            searshRead.hide();
            searshRead.after("<img id='load' src='imgs/spiny.gif'>");
            url=searshRead.siblings('a.icon-external-link').attr('href');
            ttl=searshRead.siblings('h2').text();
            mom=searshRead.parent();
            redearScroll=searshRead.parent().offset().top;
            Reader(url,ttl,mom);
            localStorage.setItem("redearScroll",redearScroll);
            setTimeout(function() {
              searshRead.show();
            }, 3000);
          });

          $('#search_results li a h2').on('click',function(e){
            $(' img#spin').show();
            header = $(this).text();
            window.novelInfoittSearch = true;
            $('body,html').animate({scrollTop:0},300);
            novelInfo('#search_results',header);
            e.preventDefault();
          });
        }else{
          $('#'+divID+' ul').append('<li><h2>No results matching your query.</h2></li>');
          $('#textfield').val('');
        }
      }
    }
    },
    beforeSend: function(jqXHR, settings){
      console.log('loading'+ ' / url: '+settings.url);
    },
    complete: function(){
      console.log('complete '+ divID );
      $("#"+divID + ' img#spin').remove();
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

function toc(momy,query,limit,divID){
  clenQ = query.replace(/the /i,'');
  $.ajax({
    method: 'GET',
    data:{
      q: clenQ,
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
      var after = redditData.data.after;
      localStorage.setItem("after",after);
      if(!$.trim(redditData.data.children)){
        $('#'+divID+' ul').append('<li><h2>try later.</h2></li>');
      }else{
      
      var Books = [],
          etr   = 1;
        $.map(redditData.data.children,function(thread, ind){

          var bookAndChap  = thread.data.title.toLowerCase(),
          link             = thread.data.url,
          Rdate            = thread.data.created_utc,
          date             = timeSince(Rdate),
          score            = thread.data.score,
          self             = thread.data.is_self;

          if(!self){

            var book = bookAndChap.replace(/ *\{[^)]*\} */g, "");
            book = book.replace(/ \- |\- | \-/gi,' ').replace(/[&\/\\#+()!$~%."*?<>]/g, '').replace(/’/gi,'\'');

            if(book.match(/:/gi)!=null && book.length>10){
            var dpoin = book.match(/:/gi)[0];
            var matchLen = book.substring(0,book.indexOf(dpoin)).length;
            if(matchLen>10){
              book = book.substring(0,book.indexOf(dpoin));
            }
            }
            if(book.match(/ *\d+/gi,'')!==null){
              var num  = book.match(/ *\d+/gi,'')[0];
              book = book.substring(0,book.indexOf(num));
            }

            if(book.match(/chapter.*\b/gi) != null){
              book=book.replace(/chapter.*\b/gi,'').trim();
            }
            if(book.match(/ ch *\b/gi) != null){
              book=book.replace(/ ch*\b/gi,'').trim();
            }

            var bookComp = book.toLowerCase().replace(/the /gi,'').trim();
            bookComp = bookComp.replace(/'s |i'm /gi,' ');
            bookComp = bookComp.replace(/ +/g, "").substring(0,10);

            var chapter = bookAndChap.match(/\d+/gi);

            if(chapter != null){
              if(chapter.length>1){
                $.each(ChapFilter, function(i,chap){
                  var chapComp = chap.toLowerCase().replace(/the /gi,'').trim();
                  chapComp = chapComp.replace(/ +/g, "").substring(0,10);
                  if(chapComp == bookComp){
                    chapter.shift();
                  }
                });
                var chapterNum = chapter[chapter.length-1] - chapter[0]+1;
                chapter = chapter.join(' - ')+" ("+chapterNum+")";
              }
              else if(chapter.length=1){
                chapter = chapter[0];
              }
            }else(chapter = 'XXX');
            if(bookComp.length>=7 && chapter !== "XXX"){
              if(divID!=="search_results"){
                var queryFilter = query.toLowerCase().replace(/the /gi,'').trim();
                queryFilter = queryFilter.replace(/'s |i'm /gi,' ');
                queryFilter = queryFilter.replace(/ +/g, "").substring(0,10);
                if(bookComp == queryFilter){
                  var bookAndChap = book+" - "+chapter,
                      novel = {bookComp:bookComp,bookAndChap:bookAndChap,title:book,chapter:chapter,link:link,score:score,date:date};
                  Books.push(novel);
                }
              }else{
                var bookAndChap = book+" - "+chapter,
                    novel = {bookComp:bookComp,bookAndChap:bookAndChap,title:book,chapter:chapter,link:link,score:score,date:date};
                Books.push(novel);
              }
            }
          }
        });

      SortChapter(Books);

      var bookLen = Books.length, newA=[], num = 0;

      if(bookLen>1){
        if(divID == 'novelinfo'){
          $('#'+divID+' ul').append("<li id='toc'><ol id='tocorder'></ol></li>");
          var lastchap = "<span>Chapter: "+Books[0]['chapter']+"<span id='date'> "+Books[0]['date']+"</span></span>";
          $('#'+divID+' ul li span.noveldata').append("<p><b class='icones icon-schedule'>Last Release: </b><br>"+lastchap+"</p>");
        }else{
          $(momy).after("<li id='toc'><ol id='tocorder'></ol></li>");
          $(momy).next('li').find('ol#tocorder').append("<li><h3>Table of Contents:</h3></li>");
        }

        var toc = $(momy).next('li').find('ol#tocorder');

        $.map(Books,function(data,indes){
        if(newA.indexOf(data.chapter) === -1){
              newA.push(data.chapter);
              toc.append("<li data-link='"+data.link+"'><h4><span id='num'>"+etr+"</span>Chapter: "+data.chapter+"</h4><span id='date'>"+data.date+"</span></li>");
          etr++;          
          }
        });
        localStorage.setItem('etr',etr);
        if (divID == 'novelinfo' && after !== null && bookLen>14) {
          $('#'+divID+' ul').append("<li id='loadnext'><b class='icones icon-plus-square'>Load More</b></li>");
        }
        toc.find('li[data-link]').on('click', function(){
          var mom = $(this),
              url = mom.data('link');

          mom.css("pointer-events", "none");
          mom.append("<img id='load' src='imgs/spiny.gif'>");

          if(divID == 'novelinfo'){
            var ttl = $('#novelinfo ul li:eq(0) h1').text();
            redearScroll = $('li#showtoc').offset().top;
          }else{
            var ttl = $(momy).find('h2').text();
            redearScroll = $(momy).offset().top;
          }
          Reader(url,ttl,mom);
          localStorage.setItem("redearScroll",redearScroll);
          setTimeout(function() {
            mom.css("pointer-events", "auto");
          }, 3000);
        });

        $("#loadnext").on('click', function(){
          var loadnext = $(this);
          loadnext.css("pointer-events", "none");
          $(this).append("<img id='load' src='imgs/spiny.gif'>");
          tocMore(query,10);
          setTimeout(function() {
            loadnext.css("pointer-events", "auto");
          }, 2000);
        });
      }else{
        $(momy).remove();
      }
    }
  },
    beforeSend: function(jqXHR, settings){
      console.log('loading'+ ' / url: '+settings.url);
    },
    complete: function(){
      console.log('complete toc');
      $('img#load').remove();
      $('img#spin').remove();
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

function tocMore(query,limit){
  var after = localStorage.getItem("after");
  clenQ = query.replace(/the /i,'');
  $.ajax({
    method: 'GET',
    data:{
      q: clenQ,
      sort : 'new',
      restrict_sr : 'on',
      t: 'all',
      limit : limit,
      after: after
    },
    dataType: 'json',
    url: 'https://www.reddit.com/r/QidianUnderground/search.json?',
    tryCount: 0,
    retryLimit: 2,
    index: 1,
    success: function(redditData){
      var after = redditData.data.after;
      localStorage.setItem("after",after);
      if(after == null){
            $('#loadnext').html("<b>End Of Results</b>");
            $('#loadnext').unbind();
            $('#loadnext').css('cursor','not-allowed');
          }
      if(!$.trim(redditData.data.children)){
        $('#'+divID+' ul').append('<li><h2>try later.</h2></li>');
      }else{
      
      var Books = [],
          etr   = localStorage.getItem('etr');
        $.map(redditData.data.children,function(thread, ind){

          var bookAndChap  = thread.data.title.toLowerCase(),
          link             = thread.data.url,
          Rdate            = thread.data.created_utc,
          date             = timeSince(Rdate),
          score            = thread.data.score,
          self             = thread.data.is_self;

          if(!self){

            var book = bookAndChap.replace(/ *\{[^)]*\} */g, "");
            book = book.replace(/ \- |\- | \-/gi,' ').replace(/[&\/\\#+()!$~%."*?<>]/g, '').replace(/’/gi,'\'');

            if(book.match(/:/gi)!=null && book.length>10){
            var dpoin = book.match(/:/gi)[0];
            var matchLen = book.substring(0,book.indexOf(dpoin)).length;
            if(matchLen>10){
              book = book.substring(0,book.indexOf(dpoin));
            }
            }
            if(book.match(/ *\d+/gi,'')!==null){
              var num  = book.match(/ *\d+/gi,'')[0];
              book = book.substring(0,book.indexOf(num));
            }

            if(book.match(/chapter.*\b/gi) != null){
              book=book.replace(/chapter.*\b/gi,'').trim();
            }
            if(book.match(/ ch *\b/gi) != null){
              book=book.replace(/ ch*\b/gi,'').trim();
            }

            var bookComp = book.toLowerCase().replace(/the /gi,'').trim();
            bookComp = bookComp.replace(/'s |i'm /gi,' ');
            bookComp = bookComp.replace(/ +/g, "").substring(0,10);

            var chapter = bookAndChap.match(/\d+/gi);

            if(chapter != null){
              if(chapter.length>1){
                $.each(ChapFilter, function(i,chap){
                  var chapComp = chap.toLowerCase().replace(/the /gi,'').trim();
                  chapComp = chapComp.replace(/ +/g, "").substring(0,10);
                  if(chapComp == bookComp){
                    chapter.shift();
                  }
                });
                var chapterNum = chapter[chapter.length-1] - chapter[0]+1;
                chapter = chapter.join(' - ')+" ("+chapterNum+")";
              }
              else if(chapter.length=1){
                chapter = chapter[0];
              }
            }else(chapter = 'XXX');

            if(bookComp.length>=7 && chapter !== "XXX"){
                var queryFilter = query.toLowerCase().replace(/the /gi,'').trim();
                queryFilter = queryFilter.replace(/'s |i'm /gi,' ');
                queryFilter = queryFilter.replace(/ +/g, "").substring(0,10);
                if(bookComp == queryFilter){
                  var bookAndChap = book+" - "+chapter,
                      novel = {bookComp:bookComp,bookAndChap:bookAndChap,title:book,chapter:chapter,link:link,score:score,date:date};
                  Books.push(novel);
                }
            }
          }else{
            $('#loadnext').html("<b>End Of Results</b>");
            $('#loadnext').unbind();
            $('#loadnext').css('cursor','not-allowed');
          }
        });

        SortChapter(Books);

        var bookLen = Books.length, newA=[], num = 0;
        var toc = $('#tocorder');
        if(bookLen>1){
          $.map(Books,function(data,indes){
          if(newA.indexOf(data.chapter) === -1){
                newA.push(data.chapter);
                toc.append("<li data-link='"+data.link+"'><h4><span id='num'>"+etr+"</span>Chapter: "+data.chapter+"</h4><span id='date'>"+data.date+"</span></li>");
            etr++;          
            }
          localStorage.setItem('etr',etr);
          });
        }
        toc.find('li').unbind().on('click', function(){
          var mom = $(this),
              url = mom.data('link');

          mom.css("pointer-events", "none");
          mom.append("<img id='load' src='imgs/spiny.gif'>");
          
          var ttl = $('#novelinfo ul li:eq(0) h1').text();
          redearScroll = $('li#showtoc').offset().top;
          localStorage.setItem("redearScroll",redearScroll);
          Reader(url,ttl,mom);
          setTimeout(function() {
              mom.css("pointer-events", "auto");
          }, 3000);
        });
      }
    },
    beforeSend: function(jqXHR, settings){
      console.log('loading'+ ' / url: '+settings.url);
    },
    complete: function(){
      console.log('complete tocMore');
      $('img#load').remove();
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
  var infoDiv = '#novelinfo';
  $(infoDiv + ' ul li:eq(0)').append("<img id='spin' src='imgs/spin.gif' alt='spinner'>");
$.ajax({
    method: 'GET',
    dataType: 'json',
    url: 'novels_i.json',
    tryCount: 0,
    retryLimit: 2,
    index: 1,
    success: function(novelData){
      
      $(infoDiv).show();
      $(tohide).hide();

      if(!$.trim(novelData.novel)){
        $(infoDiv+' ul').append('<li><h2>No results.</h2></li>');
      }else{
        var Books       = [],
            selectedNovel = title;
        selectedNovel = selectedNovel.replace(/’/gi,'\'');
        $(infoDiv+ 'img#spin').show();

        localStorage.setItem("clickedTit",name);
        var itt = false;

        selectedComp = selectedNovel.toLowerCase().replace(/the /gi,'').trim();
        selectedComp = selectedComp.replace(/[&\/\\#()+'’–!$~%. "*:?<>{}-\d]/gi, '').substring(0,12);
        $.map(novelData.novel, function(novel,i){
          bookComp=novel.title.toLowerCase().replace(/the /g,'').trim();
          bookComp=bookComp.replace(/[&\/\\#()+'’–!$~%. "*:?<>{}-\d]/gi, '').substring(0,12);
          if (bookComp == selectedComp) {
            synopsis = novel.synopsis.split(" #exp# ");
            
            var paraSynop="";
            $.each(synopsis, function(k, line){
              
              paraSynop+="<p>"+line+"</p>";
            });
            itt = true;
            $(infoDiv+' ul li:eq(0)').append("<h1>"+novel.title+"</h1>");
            $(infoDiv+' ul').append("<li><span class='noveldata'><p><b class='icones icon-edit-3'>Author:</b></br> "
              +novel.author+
              "</p><p><b class='icones icon-translate'>Type:</b></br> "
              +novel.type+
              "</p><p><b class='icones icon-bar-chart-2'>Status in COO: </b></br>"
              +novel.status+
              "</p><p><b class='icones icon-flag2'>Genre:</b></br> "
              +novel.genre+
              "</p></span><img src='"
              +novel.cover+
              "' id='cover'></li>");
            $(infoDiv+' ul').append("<li id='showsynop' class=''><b class='icones icon-subject'>Synopsis</b></li><li id='synop'>"+paraSynop+"</li><li id='showtoc' class=''><b class='icones icon-th-menu'>Table of Contents:</b></li>");
            var momy = $('li#showtoc');
            selectedNovel = selectedNovel.replace(/'s |i'm /gi,' ');
            toc(momy,selectedNovel,30,'novelinfo');
          }
        });
        if(itt==false){
          $(infoDiv+' ul li:eq(0)').append("<h1>"+selectedNovel+"</h1>");
          $(infoDiv+' ul').append("<li><h2>Coming soon</h2></li>");
          $(infoDiv + ' img#spin').remove();
        }
        $('#showsynop').on('click',function(){
          $('#synop').slideToggle(150);
        });
        $('#showtoc').on('click',function(){
          $('#toc, #loadnext').slideToggle(150);
        });


      }
    },
    beforeSend: function(jqXHR, settings){
      console.log('loading'+ ' / url: '+settings.url);
    },
    complete: function(){
      console.log('complete info' );
      // $(infoDiv + ' img#spin').remove();
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

function Reader(url,ttl,mom){
  var txtContents = localStorage.getItem(url)
if (txtContents===null) {
  $.ajax({
      method: 'GET',
      dataType: 'json',
      url: url,
      tryCount: 0,
      retryLimit: 2,
      index: 1,
      success: function(CryptoText){
        if(CryptoText.status==1){
          $(mom).children('span.read').remove();
          $(mom).append("<span class='error'>Error</span>");
          $(mom).unbind();
        }else{
          var pass        = this.url.split('#'),
            pass          = pass[1],
            finalText     = "",
            decreptedText = sjcl.decrypt(pass, CryptoText.data),
            readerTxt     = $('#reader .text');

          decreptedText = Base64.btou(RawDeflate.inflate(Base64.fromBase64(decreptedText))).replace(/<\/?\w+[^>]*\/?>/g, "");
          decreptedText = decreptedText.replace(/[<>]/g, '#').replace(/[\\]/g, "");
          decreptedText = decreptedText.split("\n").filter(c => c.trim() != '');

          var menu = [];
          $.each(decreptedText, function(k, line){
            if(k==0 && !line.match(/ *\d+/gi,'')){
              finalText+='';
            }else if(k==0 && line.match(/ *\d+/gi) && !line.match(/chapter*\b/gi)){
              var title = line.toLowerCase().replace(/[&\/\\#+!$~%."*?<>{}]/g, '').trim(),
                  num   = line.match(/ *\d+/gi)[0];
              title = title.replace(/\d+/,'');
              title = "Chapter "+num+": " +title;
              finalText+= "<h3 id='to_"+k+"'>"+title+"</h3>";
              var dta = {title:title,id:k};
              menu.push(dta);
            }else if(line.match(/ *\d+/gi) && !line.match(/chapter*\b/gi) && decreptedText[k+1] != undefined && decreptedText[k+1].match(/ranslator:|ranslated by*\b/gi)){
              var title = line.toLowerCase().replace(/[&\/\\#+!$~%."*?<>{}]/g, '').trim(),
                  num   = line.match(/ *\d+/gi)[0];

              title = title.replace(/\d+/,'');

              title = "Chapter "+num+": " +title;
              finalText+= "<h3 id='to_"+k+"'>"+title+"</h3>";
              var dta = {title:title,id:k};
              menu.push(dta);
            }else{
              if(line.match(/chapter*\b/gi) && line.match(/ *\d+/gi) && line.length<90){
                
                var chaps = line.match(/chapter*\b/gi);

                if(chaps.length>1){
                  var chap = chaps[1];
                  line = line.substring(line.lastIndexOf(chap));
                }

                line = line.replace(/[&\/\\#+$~%"*<>{}]/g, '');

                var dTo  = line.toLowerCase().replace(/[&\/\\#()+'’–!$~%. "*:?<>{}-\d]/gi, '').substring(0,15),
                    dTT  = decreptedText[k+2].toLowerCase().replace(/[&\/\\#()+'’–!$~%. "*:?<>{}-\d]/gi, '').substring(0,15);
                // decreptedText[k+2] tl&ed same line
                // decreptedText[k+4] tl&ed in separate line
                if(dTo==dTT || line==decreptedText[k+1] || line==decreptedText[k+4]){
                  finalText+='';
                }else{
                  finalText+="<h3 id='to_"+k+"'>"+line+"</h3>";
                  var dta = {title:line,id:k};
                  menu.push(dta);
                }
                               
              }else if(line.match(/ranslator:|ranslated by*\b/gi) || line.match(/ditor:|dited by*\b/gi)){
                finalText+='';
              }else{
                finalText+="<p>"+line+"</p>";}
              }
          });

          readerTxt.append("<h2>"+ttl+"</h2>");

          if(menu.length>1){
            readerTxt.children('h2').before("<span class='icones  icon-th-menu'></span>");
            readerTxt.append("<ul><li><a>Table of Contents:</a></li></ul>");
            // readerTxt.append("<span class='icones  icon-th-menu'></span><ul><li><a>Table of Contents:</a></li></ul>");
            $.each(menu, function(i, chap){
              readerTxt.children('ul').append("<li><a href='#to_"+chap.id+"'><h4><span>"+(i+1)+"</span>"+chap.title+"</h4></a></li>");
            });
          }

          readerTxt.append(finalText);

          var textContents = $('.text').html();
          localStorage.setItem(url,textContents);
          readerInitCom();
        }

      },
      beforeSend: function(jqXHR, settings){
        console.log('loading'+ ' / url: '+settings.url);
      },
      complete: function(){
        console.log('complete reader');
        $('img#load').remove();
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
        else if(status == 'error'){
          $(mom).children('span.read').remove();
          $(mom).append("<span class='error'>Error</span>");
          $(mom).unbind();
        }
      }     
  });
}else{
  $('.text').html(txtContents);
  readerInitCom();
}
};

function readerInitCom(){
  $('img#load').remove();
  var reader = $('#reader'),
      text   = $('.text');
  $('body,html').animate({scrollTop:0},300);
  reader.show();
  $('#wrap').hide();

  $('span.icon-th-menu').on('click', function(){
    $('#reader ul').slideToggle(150);
  });

  $('#reader a[href]').on('click', function(e){
    var id = $(this).attr('href');
    id = $(id);
    $('body,html').animate({scrollTop:id.offset().top},300);
    e.preventDefault();
  });

  reader.append("<span class='icones icon-close'></span>");

  $('#reader .icon-close').on('click', function(){
    var redearScroll = localStorage.getItem("redearScroll");
    reader.hide();
    $('body,html').animate({scrollTop:redearScroll},300);
    $('#wrap').show();
    $(this).remove();
    text.empty();
  });
};







function init(){
  
  var updates = 'updates';
      var url  = 'https://www.reddit.com/r/QidianUnderground/new.json?',
        limit = 100;

  getData('',url,limit,updates);
  
  $('.icon-rotate-cw').on('click', function(){
    $('img#spin').show();
    $('#'+updates+ ' ul li:gt(0)').remove()
    getData('',url,limit,updates);              
  });

  $('#novelinfo .icon-close, #search_results .icon-close').on('click',function(){

    toHide    = $(this).parents('.updates').attr('id');
    ittSearch = window.novelInfoittSearch;

    if(toHide == 'search_results'){
      divToShow = localStorage.getItem('divTohide');
      $('#'+toHide+' ul li:gt(0)').remove();
      $('#'+toHide).hide();
      $('#'+divToShow).show();
      $('#showsearch ,#search').show();
    }else if(toHide == 'novelinfo' && ittSearch){
      $('#'+toHide+' ul li:eq(0) h1').remove();
      $('#'+toHide+' ul li:gt(0)').remove();
      window.novelInfoittSearch = false;
      $('#search_results').show();
      $('#'+toHide).hide();
    }
    else{
      scroll = localStorage.getItem("scroll");        
      $('#'+toHide+' ul li:eq(0) h1').remove();
      $('#'+toHide+' ul li:gt(0)').remove();
      $('#'+updates).show();
      $('#'+toHide).hide();
      $('body,html').animate({scrollTop:scroll},300);
    }

  });
  // novelList(link,'60','novellist');

  $('#showsearch').on('click', function(){
    $('#search').toggle();
    $(this).toggleClass('icon-close');
    $('#textfield').val('').css('border-bottom-color','');
    $('#textfield').focus();
  });
  $('#reddit_search').on('click', function(){
    var textfield    = $('#textfield'),
      textfieldVal = $(textfield).val().replace(/[^\w'’\s]/gi, '').trim();

    if(textfieldVal && textfieldVal.length>2 && !$.isNumeric(textfieldVal)){
      textfield.css('border-bottom-color','initial');

      divTohide = $('.updates:visible:eq(0)').attr('id');

      $('#'+divTohide).hide();
      $('#search_results ul li:gt(0)').remove();
      $('#search_results, #search_results li:eq(0) img').show();
      $('#showsearch ,#search').hide();
      link = "https://www.reddit.com/r/QidianUnderground/search.json?";
      getData(textfieldVal,link,30,'search_results');
      $('body,html').animate({scrollTop:0},300);

      if(divTohide == 'novelinfo'){
        $('#'+divTohide+' ul li:eq(0) h1').remove();
        $('#'+divTohide+' ul li:gt(0)').remove();
        localStorage.setItem("divTohide",'updates');
      }
      else{
        localStorage.setItem("divTohide",divTohide);
      }

    }else{
      textfield.css('border-bottom-color','#ff0a0a');
      textfield.val('').focus();
    }
  });

  $('#textfield').keypress(function(e) {
    if(e.which == 13) {
      $('#reddit_search').click();
    }
  });

  $('.icon-moon').on('click', function(){
    $('body').addClass('night');
    $(".icon-sun").css('display','inline-block');
    $(this).hide();
    $('header').css("background","url('imgs/bluediamonds.png') 50% 0");
    localStorage.setItem('nightMode','moon');
  });

  $('.icon-sun').on('click', function(){
    $('body').removeClass('night');
    $(".icon-moon").show();
    $(this).hide();
    $('header').css("background","url('imgs/whitediamond.png') 50% 0");
    localStorage.setItem('nightMode','sun');
  });

  $('#top,#readertop').on('click', function(){
    $('body,html').animate({scrollTop:0},300);
  });
  $(window).on('scroll',function(){
    $(window).scrollTop()>=400?$('#top,#readertop').css('display','initial'):$('#top,#readertop').hide();
  });

  var nightMode = localStorage.getItem('nightMode');
  if(nightMode == 'moon'){    
    $('.icon-moon').click();
  }




  // fix iphone position fixed on focus
  // $("#textfield").on("focus", function() {window.scrollBy(0, 1)});
  // if ('ontouchstart' in window) {
  //   $(document).on('focus', 'input', function() {
  //       $('#switsh').css({'position': 'fixed','bottom':'0'});
  //   }).on('blur', 'input', function() {
  //       $('#switsh').css('position', '');
  //   });
  // }

}