(function(){
	
const backgroundPoster = document.body.style; 
const title = document.getElementById('title');
const tagline = document.getElementById('tagline');
const overview = document.getElementById('plot');
const dateOfRelease = document.getElementById('releaseDate');
const runtime = document.getElementById('runtime');
const revenue = document.getElementById('revenue');
const votes =document.getElementById('voteAverage');
const poster = document.getElementById("imageid");

const elem = document.getElementById('list');
const searchText = document.querySelector('input');
let ran = Math.floor(Math.random()*4000);

fetch("https://api.themoviedb.org/3/movie/"+ran+"?api_key=405256f4258d9d6f631ee8eaffee6335").then(updateMovieInfo).catch(function(error){console.log(error);});

let timeout = null;

searchText.addEventListener("keyup", function(e) {
	elem.innerHTML = "";
	clearTimeout(timeout);
	timeout = setTimeout(function () {
   
		if(e.target.value.length > 2){
			fetch("https://api.themoviedb.org/3/search/multi?api_key=405256f4258d9d6f631ee8eaffee6335&language=en-US&query="+searchText.value+"&page=1&include_adult=false").then(function(response){
			    return response.json().then(function(data){
			        let movies = data.results;
			        let res = movies.map((val,i)=>{
			        	return [val.id, val.title];
			        });

				    for(let i=0; i<4; i++){
					    if(data.results[i].title !== undefined){
						    const node = document.createElement("Li");
						    const text = res[i][1];
						    const id = res[i][0]; 
						    const textnode=document.createTextNode(text);
						    node.appendChild(textnode);
						    node.id = id;
						    document.getElementById("list").appendChild(node);

					    	node.addEventListener('click', function(e){
					    		fetch("https://api.themoviedb.org/3/movie/"+e.target.id+"?api_key=405256f4258d9d6f631ee8eaffee6335").then(updateMovieInfo).catch(function(error){console.log(error);});
					    		elem.innerHTML = "";
					    		searchText.value = ""; 
					    	});
					    }
				    }

				});
			}).then(updateMovieInfo).catch(function(error){ console.log(error); }); 
		}

		document.body.addEventListener('click',function(){
			elem.innerHTML = "";
		});

	}, 550);
});

searchText.addEventListener('keypress', function(e){
	let key = e.which || e.keyCode;
    if (key === 13) { // 13 is enter
		fetch("https://api.themoviedb.org/3/search/movie?api_key=405256f4258d9d6f631ee8eaffee6335&query="+searchText.value+"&page=1").then(function(response){
		    return response.json().then(function(data){
		        const id = data.results[0].id;
		        return fetch("https://api.themoviedb.org/3/movie/"+id+"?api_key=405256f4258d9d6f631ee8eaffee6335");
		    });
		}).then(updateMovieInfo).catch(function(error) {
		    console.log(error);
		  }); 
	    searchText.value = ""; 
    }
});

function updateMovieInfo(response){
    return response.json().then(function(data){
    	if(data.original_title === undefined || data.original_title === null){
    		ran = Math.floor(Math.random()*4000);
    		fetch("https://api.themoviedb.org/3/movie/"+ran+"?api_key=405256f4258d9d6f631ee8eaffee6335").then(updateMovieInfo).catch(function(error){console.log(error);});
    	}else{
			 backgroundPoster.backgroundImage = 'url(https://image.tmdb.org/t/p/w1280'+data.backdrop_path+')';
			 title.innerText = data.original_title;
			 tagline.innerText = data.tagline;
			 overview.innerText = data.overview;
			 dateOfRelease.innerText = data.release_date;
			 runtime.innerText = data.runtime + " mins";
			 revenue.innerText = "$" + data.revenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			 votes.innerText = data.vote_average + " / 10"; 
			 poster.src="https://image.tmdb.org/t/p/w500"+data.poster_path+"";
    	}
    });
}

}());