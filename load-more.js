jQuery(function($){
        /*
         * This function allows us to load more posts when the user scrolls down
         */
	$('article').after( '<span class="load-more"></span>' );
	var button = $('.load-more');
	var page = 2;
	var loading = false;
	var scrollHandling = {
	    allow: true,
	    reallow: function() {
	        scrollHandling.allow = true;
	    },
	    delay: 400 //(milliseconds) adjust to the highest acceptable value
	};

	$(window).scroll(function(){
		if( ! loading && scrollHandling.allow ) {
			scrollHandling.allow = false;
			setTimeout(scrollHandling.reallow, scrollHandling.delay);
			var offset = $(button).offset().top - $(window).scrollTop();
			if( 300 > offset ) {
				loading = true;
				var data = {
					action: 'be_ajax_load_more',
					nonce: beloadmore.nonce,
					page: page,
					query: beloadmore.query,
				};
                                //Send our query
				$.post(beloadmore.url, data, function(res) {
					if( res.success) {
						$('article').last().after( res.data );
						$('article').last().after( button );
                                                //Retrieve the postname from a div
                                                postName = $('article .postName').last().html();
                                                
						page = page + 1;
						loading = false;
                                                var stateObj = { foo: postName };
                                                //Modify our url
                                                history.pushState(stateObj,postName,'/'+postName+'/');
                                                //Send update to google analytics
                                                ga('send', 'pageview','/'+postName+'/');
					} else {
						// console.log(res);
					}
				}).fail(function(xhr, textStatus, e) {
					// console.log(xhr.responseText);
				});

			}
		}
	});
});