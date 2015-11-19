$(document).ready(function(){
	urlMain = 'http://pokeapi.co';
	urlPokedex = 'http://pokeapi.co/api/v1/pokedex/1';
	allPokemons = [];

	jQueryAjax(urlPokedex, getPokedexJson, true);

	function getPokedexJson(objJson){
		for(indice in objJson.pokemon){
			namePokemon = objJson.pokemon[indice].name;
			urlPokemon = urlMain +'/'+ objJson.pokemon[indice].resource_uri;
			//console.log('urlPokemon: ' + urlPokemon);

			allPokemons.push({name:namePokemon, url:urlPokemon});
		}
		//allPokemons.forEach(function(entry) {console.log(entry.name)});

		for (var i = 0; i < 15; i++) {
			jQueryAjax(allPokemons[i].url, getFirstSprite, true);
		}
	}


	function getCharJson(objJson){
		//attributes
		addAttributesChar(objJson);

		//add image center
		jQueryAjax(urlMain + objJson.sprites[0].resource_uri, addMainSpritePokemon, true);

		//add types
		$('#pokemon_type').text('');
		$('#pokemon_weakness').text('');
		jQueryAjax(urlMain + objJson.types[0].resource_uri, addType, true);

		//add descripition
		$('.character-description').html('');
		for(index in objJson.descriptions){
			jQueryAjax(urlMain + objJson.descriptions[index].resource_uri, addDescriptions, true);
			if(index == 10) break;
		}

		//sprites
		var urls = [];
		for(indice in objJson.sprites)
			urls.push(urlMain + objJson.sprites[indice].resource_uri);
		getAllSprites(urls);
	}

	function addAttributesChar(objJson){
		//add name
		$('.character-name').text(objJson.name);

		//add attributes
		$('#attr_hp').text(objJson.hp);
		$('#attr_attack').text(objJson.attack);
		$('#attr_defense').text(objJson.defense);
		$('#attr_sp_atk').text(objJson.sp_atk);
		$('#attr_sp_def').text(objJson.sp_def);
		$('#attr_exp').text(objJson.exp);
		$('#attr_happiness').text(objJson.happiness);
		$('#attr_speed').text(objJson.speed);

		//add characteristics
		$('#gender_ratio').text(objJson.male_female_ratio);
		$('#attr_weight_value').text(objJson.weight + ' kg');
		$('#attr_height_value').text(objJson.height + ' m');

		//add abilities
		$('#pokemon_abilities').text('');
		var abilities = '';
		var separatorAbility = ' ';
		for(i in objJson.abilities){
			abilities += separatorAbility + objJson.abilities[i].name;
			separatorAbility = ' / ';
		}
		$('#pokemon_abilities').text(abilities);

		//add egg group
		var egg_group_names = '';
		var separatorEgg = ' ';
		for(indice in objJson.egg_groups){
			egg_group_names += separatorEgg + objJson.egg_groups[indice].name;
			separatorEgg = ' / ';
		}
		$('#attr_egg_group_value').text(egg_group_names);
	}

	function addMainSpritePokemon(objJson){
		var urlImg = urlMain + objJson.image;
		$('#img_character_sprite').attr('src', urlImg);
	}

	function addDescriptions(objJson){
		var description = objJson.description;

		$('.character-description').html($('.character-description').html() + '<p>' + description + '</p><br>');
	}

	function addType(objJson){
		$('#pokemon_type').text(($('#pokemon_type').text() + ' ' + objJson.name).toUpperCase());

		var weakness = '';
		var separator = ' ';
		for(index in objJson.weakness){
			weakness += separator + objJson.weakness[index].name;
			separator = ' / ';
		}
		$('#pokemon_weakness').text(weakness);
	}


	function getFirstSprite(objJson){
		jQueryAjax(urlMain + objJson.sprites[0].resource_uri, addImgRoll, true);
	}
	function addImgRoll(objJson){
		var urlImg = urlMain + objJson.image;
		//console.log('urlImgRoll: ' + urlImg);

		$('<div/>', {
			class:'img_char',
		}).insertBefore('#roll-character > .final_scroll');
		$('<img>', {
			id: objJson.pokemon.name,
			src: urlImg,
		}).appendTo('#roll-character > .img_char:last');
	}


	function getAllSprites(urls){
		$('#img_character_sprite_other').remove();
		
		for(indice in urls)
			jQueryAjax(urls[indice], getImgChar, true);
	}
	function getImgChar(objJson){
		urlImg = urlMain + objJson.image;

		$('<img>', {
			id: 'img_character_sprite_other',
			src: urlImg,
		}).appendTo('#div_img_sprite_other');
	}


	function updateScreenPokemon(name){
		if(name == null) return false;

		$.each(allPokemons, function(i, v) {
			if (v.name.toLowerCase() == name.toLowerCase()) {
				jQueryAjax(v.url, getCharJson,true);
				return true;
			}
		});
	}


	//ajax
	function jQueryAjax(url, callBack, async){
		jQuery.ajax({
			url: url,
			success: function (result) {
				callBack(result);
			},
			error: function (result) {
				console.log('Error Ajax');
			},
			async: async
		});
	}


	//scroll
	function goToByScroll(id){
		if(($("#"+id).offset().left - $('.begin_scroll').width()) != 0)
			$('#roll-character').animate({
				scrollLeft: $("#"+id).offset().left - $('.begin_scroll').width() - $(".begin_scroll").offset().left},
				100);
	}

	//move scroll to side
	$('.move_scroll_right').click(moveBarToRight);
	$('.move_scroll_left').click(moveBarToLeft);

	function moveBarToRight(e) {
		e.preventDefault();

		id = $('.pokemon_selected + .img_char > img').attr('id');
		if(id != null){
			updateScreenPokemon(id);
			goToByScroll(id);
		}

		last_img = $('.img_char:last');
		if(!last_img.hasClass('pokemon_selected')){
			$('.pokemon_selected + .img_char').addClass('pokemon_selected');
			$('.pokemon_selected:first').removeClass('pokemon_selected');
		}

		addMoreSpritesInBar();
	}

	function moveBarToLeft(e) {
		e.preventDefault();

		id = $('.pokemon_selected').prev().children('img').attr('id');
		if(id != null){
			updateScreenPokemon(id);
			goToByScroll(id);
		}

		first_img = $('.img_char:first');
		if(!first_img.hasClass('pokemon_selected')){
			$('.pokemon_selected').prev().addClass('pokemon_selected');
			$('.pokemon_selected:last').removeClass('pokemon_selected');
		}
	}

	$("body").keydown(function(e){
		if ((e.keyCode || e.which) == 37){ //left arrow
			moveBarToLeft(e);
		}
		if ((e.keyCode || e.which) == 39){ //right arrow
			moveBarToRight(e);
		}
	});


	$('#roll-character').bind('DOMNodeInserted', function(event) {
		id = $('.img_char:first > img:first-child').attr('id');
		if(id != null){
			$('.img_char:first').addClass('pokemon_selected');
			$('#roll-character').unbind();

			updateScreenPokemon($('.pokemon_selected > img').attr('id'));
		}
	});


	function addMoreSpritesInBar(){
		var indexSelected = $('#roll-character .pokemon_selected').index() - 6;
		var numSprites = $(".img_char > img").length;

		if((numSprites - indexSelected) == 5){
			var moreSprites = numSprites+20;
			for (var i = numSprites+1; i < moreSprites; i++)
				jQueryAjax(allPokemons[i].url, getFirstSprite, true);
		}
	}

});