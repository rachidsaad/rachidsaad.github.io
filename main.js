function CarsoSlid(div, pagList, nav){
	this.div 	 = div;
	this.items 	 = $(div).find('li');
	this.itemslen= this.items.length;
	this.pagList = $(pagList);
	this.pagListItems= this.pagList.find('li');
	this.nav 	 = nav;
}
CarsoSlid.prototype.NavNP = function(dir){
	var current = parseInt(this.pagList.find('li.active-pag').text());
	console.log();
	if(dir === 'prev'){
		$(this.items[current-2]).fadeIn().siblings().hide();
		$(this.pagListItems[current-2]).addClass('active-pag').siblings().removeClass('active-pag');
		if(current==1){
			$(this.items[this.itemslen-1]).fadeIn().siblings().hide();
			$(this.pagListItems[this.itemslen-1]).addClass('active-pag').siblings().removeClass('active-pag');
	}}
	else if(dir === 'next'){
		$(this.items[current]).fadeIn().siblings().hide();
		$(this.pagListItems[current]).addClass('active-pag').siblings().removeClass('active-pag');
		if(current == this.itemslen){
			$(this.items[0]).fadeIn().siblings().hide();
			$(this.pagListItems[0]).addClass('active-pag').siblings().removeClass('active-pag');
	}}

}
CarsoSlid.prototype.Paginate = function(curPag){
	var index = curPag.text();
	curPag.addClass('active-pag').siblings().removeClass('active-pag');
	$(this.items[index-1]).show().siblings().hide();
}


function getLastNewsMin(link, ulID){
	$.ajax({
		method: 'GET',
		dataType: 'xml',
		url: link+'1.rss',
		success: function(xmlData){

			var $xmlData = $(xmlData),			
				ilist 	 = 0;

			$.map($xmlData.find('item'), function(item, index){
				
				var title    = $(item).find('title').text(),
					link     = $(item).find('link').text(),
					pubDate  = $(item).find('pubDate').text(),
					category = $(item).find('category').text(),
					img      = $(item).find('media\\:thumbnail, thumbnail').attr('url'),
					dscript  = $(item).find('description').text(),
					newDes   = dscript.split(" ", 14).join(" ")+' ...',
					fullImg  = 'http://t1.hespress.com/files/'+img.slice(54);
					
			if(ilist<16 && category !== 'صوت وصورة' && category !== 'فيديو' && category !== 'كُتّاب وآراء' && category !== 'منبر هسبريس'){
				$(ulID).append('<li><img src="'+fullImg+'"></img><a href="'+link+'"><h2>'+title+'</h2></a><p>'+newDes+'</p><span>'+category+'</span></li>');	
				if(ilist == 0){
					$('#pagina').append('<li class="active-pag"><a href="#">'+(ilist+1)+'</a></li>');
				}else{
					$('#pagina').append('<li><a href="#">'+(ilist+1)+'</a></li>');
				}
				ilist++;
			}
			});
		},
		beforeSend: function(jqXHR, settings){
			console.log('loading'+ ' / url: '+settings.url);
		},
		complete: function(){
			console.log('Mini');
			getLastNews(link, ulID, '#pagina', '#slider-nav');
		},
		error: function(xhr, status, error){
			console.log(xhr.status);
		}
	});
}

function getLastNews(link, ulID, pagList, nav){
	$.ajax({
		method: 'GET',
		dataType: 'xml',
		url: link+'2.rss',
		success: function(xmlData){

			var $xmlData 		 = $(xmlData),
				lastNewsMinItems = $(ulID).find('li').length,			
				ilist 			 = lastNewsMinItems;
			
			$.map($xmlData.find('item'), function(item, index){
				
				var title    = $(item).find('title').text(),
					link     = $(item).find('link').text(),
					pubDate  = $(item).find('pubDate').text(),
					category = $(item).find('category').text(),
					img      = $(item).find('media\\:thumbnail, thumbnail').attr('url'),
					dscript  = $(item).find('description').text(),
					newDes   = dscript.split(" ", 14).join(" ")+' ...',
					fullImg  = 'http://t1.hespress.com/files/'+img.slice(54);
					
			if( ilist<16 && category !== 'صوت وصورة' && category !== 'فيديو' && category !== 'كُتّاب وآراء' && category !== 'منبر هسبريس'){
				
				$(ulID).append('<li><img src="'+fullImg+'"></img><a href="'+link+'"><h2>'+title+'</h2></a><p>'+newDes+'</p><span>'+category+'</span></li>');	
				$('#pagina').append('<li><a href="#">'+(ilist+1)+'</a></li>');
				ilist++;
			}
			});
		},
		beforeSend: function(jqXHR, settings){
			console.log('loading'+ ' / url: '+settings.url);
		},
		complete: function(){
			var Slider = new CarsoSlid(ulID, pagList, nav);
			$(Slider.nav).find('button').on('click', function(e){
				Slider.NavNP($(this).data('dir'));
				e.preventDefault();
			});
			$(Slider.pagList).find('li').on('click', function(e){
				Slider.Paginate($(this));
				e.preventDefault();
			});
			console.log('max');
		},
		error: function(xhr, status, error){
			console.log(xhr.status);
		}
	});
}

function getNews(link, ulID){
	$('#news-catg').append('<ul id="'+ulID+'" class="news"></ul>');
	$.ajax({
		method: 'GET',
		dataType: 'xml',
		url: link,
		success: function(xmlData){

			var $xmlData 	   = $(xmlData),
				categoryHeader = $($xmlData.find('item:eq(0)').find('category')).text();

			$('#'+ulID).append('<li><h1>'+categoryHeader+'</h1></li>');

			$.map($xmlData.find('item'), function(item, index){
				
				var title    = $(item).find('title').text(),
					link     = $(item).find('link').text(),
					pubDate  = $(item).find('pubDate').text(),					
					img      = $(item).find('media\\:thumbnail, thumbnail').attr('url'),
					dscript  = $(item).find('description').text(),
					newDes   = dscript.split(" ", 10).join(" ")+' ...';					
				
				if(index<=4){
					$('#'+ulID).append('<li><img src="'+img+'"></img><a href="'+link+'"><h2>'+title+'</h2></a><p>'+newDes+'</p></li>');	
				}
				
			});
		},
		beforeSend: function(jqXHR, settings){
			console.log('loading'+ ' / url: '+settings.url);

		},
		complete: function(){
		},
		error: function(xhr, status, error){
			console.log(xhr.status);
		}
	});
}


function getVids(link, ulID){
	$.ajax({
		method: 'GET',
		dataType: 'xml',
		url: link,
		success: function(xmlData){

			var $xmlData = $(xmlData),
				categoryHeader = $($xmlData.find('item:eq(0)').find('category')).text();

			$(ulID).append('<li><img src="imgs/yt.png"></img><h1>'+categoryHeader+'</h1></li>');

			$.map($xmlData.find('item'), function(item, index){
				
				var title    = $(item).find('title').text(),
					link     = $(item).find('link').text(),
					pubDate  = $(item).find('pubDate').text(),					
					img      = $(item).find('media\\:thumbnail, thumbnail').attr('url');

				if(index<=5){
					$(ulID).append('<li><img src="'+img+'"></img><a href="'+link+'"><h2>'+title+'</h2></a></li>');	
				}
				
			});
		},
		beforeSend: function(jqXHR, settings){
			console.log('loading'+ ' / url: '+settings.url);

		},
		complete: function(){
		},
		error: function(xhr, status, error){
			console.log(xhr.status);
		}
	});
}