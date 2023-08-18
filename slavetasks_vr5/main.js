printResults = (obj, loadToDivName) => {
	let markthis = '',
		divId 	 = document.getElementById(loadToDivName);

	obj.forEach(Task =>{
		let index = markedTitles.indexOf(Task.title);
		index === -1 ? markthis = '' : markthis = 'markthis';
		let section = `
		<section class="task">
			<span class="index ${markthis}">${Task.index+1}</span>
			<div class="infolinks">
				<a href="${Task.url}" target="_blank" rel="noreferrer">bid</a>
				<a href="${Task.pmBoss}" target="_blank" rel="noreferrer">pm</a>
			</div>
			${Task.expnd}
			<h3>
				<a href="${Task.bossProfile}" target="_blank" rel="noreferrer">u/${Task.boss}</a>
			</h3>
			${Task.price}
			<h2>${Task.title}</h2>
			${Task.text}
			<span class="date">${Task.date}</span>
			<span class="cmnts">${Task.cmnts}</span>
		</section>`;

		divId.insertAdjacentHTML('beforeend', section);
	});

	// compnts ops

	// show text
	document.querySelectorAll('span.icon-expand').forEach(icon => icon.onclick = function(){
		this.classList.toggle('icon-collapse');
		this.parentNode.querySelector('.text').classList.toggle('showblock');
	});
	// mark on/off
	document.querySelectorAll('span.index').forEach(icon => icon.onclick = function(){
		this.classList.toggle('markthis');
		let title = this.parentNode.querySelector('h2').innerHTML;
		toggleMarkedItem(markedTitles,title);
	});
	// clean href @ text
	document.querySelectorAll('.text a').forEach(link => {
		link.classList.add('textlink');
		link.setAttribute('target','_blank');
		link.setAttribute('rel','noreferrer');
		let href = link.href,
			text = link.innerHTML;
		href == text ? link.innerHTML = 'link' : false;
	});
};

arrayTasks = (data,taskNum) =>{
	let Tasks = [],
		task  = [];
	data.map(task => {

		let title   = task.data.title,
			boss	= task.data.author,
			date 	= task.data.created_utc,
			text	= task.data.selftext,
			url		= task.data.url,
			cmnts	= task.data.num_comments,
			regex 	= /\$\s*[0-9,]+(?:\s*\.\s*\d{2})?/g,
			price	= '',
			dollah	= '';

		// remove [TASK] from title
		title = title.replace(/\[.*?\]/g,"");

		// convert date
		date  = timeSince(date);

		// get price from title & text
		dollah =  title.match(regex);
		dollah ? price = dollah[0].replace(/\s/g,"") : dollah = text.match(regex);
		if( dollah) {
		    price = dollah[0].replace(/\s/g,"");
		}

		// convert > markdown
		text = marked.parse(text);

		// boss profile
		var bossProfile = 'https://www.reddit.com/user/'+boss;

		// pm boss
		var pmBoss = 'https://ps.reddit.com/message/compose/?to='+boss+'&subject=slavelabour%20task';

		// text not empty
		text.length ? text  = "<div class='text'>"+ text +"</div>" : text = '';

		// expnd if text
		text.length ? expnd = "<span class='icon-expand'></span>" : expnd = '';

		// price not empty
		price.length ? price = "<span class='price'>"+ price +"</span>" : price = '';

		// comments not empty
		cmnts = cmnts-1;
		cmnts ? cmnts = 'comments: '+cmnts : cmnts = 'no comment';

		Task = {index:taskNum++, url:url, expnd:expnd, boss:boss, pmBoss:pmBoss, bossProfile:bossProfile, price:price, title:title, text:text, date:date, cmnts:cmnts};
		Tasks.push(Task);
		});

	localStorage.setItem("taskNum",taskNum);

	return Tasks;
};

getData = (url,taskNum,after,divId) => {
	let heading 	= document.getElementById(divId).children[0],
		spinner		= "<img id='spin' src='imgs/spin.gif' alt='spinner'>",
		loadmore	= document.getElementById('loadmore');

	after == '' ? heading.insertAdjacentHTML('beforeend', spinner) : (url += `&after=${after}` , loadmore.insertAdjacentHTML('afterend', spinner));

	fetch(url).then(response => {
	    return response.json();
	})
	.then(json =>{				
		let Tasks = [];
		let after_q = json.data.after;
			localStorage.setItem("after",after_q);

			Tasks = arrayTasks(json.data.children,taskNum);
			printResults(Tasks, divId);
			// remove spinner;
			document.getElementById('spin').remove();
			// show more icon
			loadmore.classList.add('show');
	})
	.catch(function(err) {
	  console.log("Error:"+err);
	});
};

setColor = (cssVar, colorName) => {
	let colorItem = document.getElementById(colorName),
		rgba 	  = colorItem.getAttribute('data-rgba');

	document.documentElement.style.setProperty(cssVar, rgba);
	localStorage.setItem('color', colorName);
	setTimeout(function() {
        colorItem.classList.add('hide');
        colorItem.parentNode.querySelectorAll(`li:not(#${colorName})`).forEach(node => node.classList.remove('hide'));
    }, 500);
};

toggleMarkedItem = (list, title) => {
    var index = list.indexOf(title);
    index === -1 ? list.push(title) : list.splice(index,1);
    localStorage.setItem('marked', JSON.stringify(list));
};

render = (url) => {
	let secs 		= ['','tasks','about','contact','offers','donate'],
		expandAll 	= document.querySelector('li.icon-expand-all'),
		sec 		= url.slice(1),
		index 		= secs.indexOf(sec);

	index === -1 ? sec = 'error' : sec == '' ? sec = 'tasks' : false;

	// show/hide icon expand-all
	sec == 'tasks' || sec == '' ? expandAll.classList.add('show') : expandAll.classList.remove('show');

	
	let allSecs = document.querySelectorAll('section.sec');
	allSecs.forEach(sec => sec.classList.remove('render'));

	document.getElementById(sec).classList.add('render');
};

// add render from another fx // onchange prb.
renderNow = () => render(decodeURI(window.location.hash));

function init(){

	// current secs
	render(decodeURI(window.location.hash));

	// watch hash
	window.onhashchange = renderNow;

	// data vr
	let query = 'flair:task',
		limit = 10,
		after = '',
	    url	  = `https://www.reddit.com/r/slavelabour/search.json?&q=${query}&limit=${limit}&sort=new`,
		divId = 'taskswraper',
		storedTitles = JSON.parse(localStorage.getItem("marked"));

	// scope this
	markedTitles = [];

	storedTitles === undefined || storedTitles == null ? markedTitles = [] : markedTitles = storedTitles.slice();

	// fetch
	getData(url,0,after,divId);

	// reload
	document.querySelector('span.icon-reload').onclick = function(){
		document.querySelectorAll('.task').forEach(task => task.remove());
		getData(url,0,after,divId);
		document.querySelector('li.icon-expand-all').classList.remove('icon-collapse-all');
	}

	// nav ops

	// on/off
	document.getElementById('lightswitch').onclick = function(){
		this.classList.contains('icon-light') ? localStorage.setItem('night', 'off') : localStorage.setItem('night', 'on');
		this.classList.toggle('icon-light');
		document.getElementsByTagName('body')[0].classList.toggle('night');
		document.querySelector('li.icon-paint').classList.toggle('hide');
	}

	let night = localStorage.getItem('night');
	night == 'on' ? document.querySelector('li.icon-off').click() : false;

	// collapse & expand
	document.querySelector('li.icon-expand-all').onclick = function(){
		if(this.classList.contains('icon-collapse-all')){
			document.querySelectorAll('.icon-expand.icon-collapse').forEach(icon => icon.click());
			this.classList.remove('icon-collapse-all');
		}else{
			document.querySelectorAll('span.icon-expand:not(.icon-collapse)').forEach(icon => icon.click());
			this.classList.add('icon-collapse-all');
		}
	}

	// top
	document.querySelector('li.icon-up').onclick = () => window.scrollTo({top: 0, behavior: 'smooth'});

	// icon-paint
	document.querySelector('li.icon-paint').onclick = function(){
		this.childNodes[1].classList.toggle('showpalete');
	}

	// theme
	let color = localStorage.getItem('color');
	color !== null ? setColor('--theme-color', color) : setColor('--theme-color', 'grey');

	document.querySelectorAll('ol#pallete li').forEach(li => li.onclick = function(){
		let colorName = this.getAttribute('id');
		setColor('--theme-color', colorName);
	});

	// load more
	document.getElementById('loadmore').onclick = function(){
		let loadmore = this;
		loadmore.style.pointerEvents = "none";
		let after	= localStorage.getItem("after"),
			taskNum = localStorage.getItem("taskNum");
		document.querySelector('li.icon-expand-all').classList.contains('icon-collapse-all') ? document.getElementsByClassName('icon-collapse-all')[0].classList.remove('icon-collapse-all') : false;
		getData(url,taskNum,after,divId);
		setTimeout(function() {
			loadmore.style.pointerEvents = "auto";
        }, 1000);
	}
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