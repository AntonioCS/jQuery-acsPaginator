

(function ($) {
		
	$.fn.acsPaginator = function(settings) {
		
		//not modifying the defaults
		settings = $.extend({},$.fn.acsPaginator.settings.defaults,settings);
		
		/**
		 * Set the correct link of the page that is active
		 * 
		 * @param int num This is optional. Default: currPage
		 */
		function setActiveLink(num) {			
			num = (num || currPage) -1;
			
			if (isNaN(num))
				throw new Error('Undefined position of active link (did showPage() return anything?)');

			$.each(linksCache, function() { 
				this.removeClass(settings.pageActiveClass).addClass(settings.pageClass) 
			});
			
    		linksCache[num].addClass(settings.pageActiveClass).removeClass(settings.pageClass);			
    		
    		//showMaxLinks
    		if (settings.showMaxLinks && linksCache.length > settings.showMaxLinks) {
    			  			
				$.each(linksCache, function(k) { 								
					this.hide();	
				});
				
				
				var mLinks = settings.showMaxLinks*1,			 
					nm = num+1,
					linkLen = linksCache.length,
					show = [],
					fetch,
					a,b;
					
				switch (true) {
					//we have the first or the last selected
					case nm == 1 || nm == linkLen:								
						a = (nm == 1) ? 0 : linkLen-mLinks;
						b = (nm == 1) ? mLinks: linkLen;													
					break;
					//second and before last
					case nm == 2 || nm == linkLen-1:
						a = (nm == 2) ? 0 : linkLen-mLinks;
						b = (nm == 2) ? mLinks : linkLen; 																																						
					break;
					//other
					default:
						if (mLinks & 1) {							
							fetch = (mLinks-1)/2;
							a = num-fetch;
							b = num+fetch+1; //+1 because does not include the final								
						}
						else {							
							fetch = mLinks/2;							
							a = num-(fetch-1);
							b = num+fetch+1; //+1 because does not include the final
						}													
				}

				show = linksCache.slice(a,b);
				$.each(show, function() {
    				this.show(); 
    			});	 
    			
				if (settings.alwaysShowFirstAndLast) {
					var first = linksCache[0], 
						last = linksCache[linkLen-1];
					
					if (!first.is(':visible')) {
						if (!firstPlacer) {							
							firstPlacer = $(settings.pageNumbersContainerChildren).html(settings.alwaysShowFirstAndLastSeperator);
							firstPlacer.insertAfter(first);
						}
						
						firstPlacer.show();
						first.show();																		
					}
					else {
						if (firstPlacer) {
							firstPlacer.hide();
						}
					}
					
					
					if (!last.is(':visible')) {
						if (!lastPlacer) {							
							lastPlacer = $(settings.pageNumbersContainerChildren).html(settings.alwaysShowFirstAndLastSeperator);
							lastPlacer.insertBefore(last);
						}
						
						lastPlacer.show();
						last.show();						
					}
					else {
						if (lastPlacer) {
							lastPlacer.hide();
						}
					}
				}
    							
    		}    		
		}
		
		/**
		 * Create the links
		 * 
		 * @param string text
		 * @param string href (default: #)
		 */
		function createLink(text, href) {
			href = href || '#';
			
			var l = $(settings.pageNumbersContainerChildren),
				a = $('<a>').attr('href',href).html(text);
			
			return l.append(a);
		}				
		
		var itensPerPage = settings.itemsPerPage,
    		items = settings.items || this.children(),
    		tPages = settings.tPages || Math.ceil( (typeof items == 'object' ? items.length : items) / itensPerPage),
    		currPage = settings.currPage,
    		p = settings.placeHolder ? $(settings.placeHolder) : this.parent(),
    		container = $(settings.container).addClass(settings.containerClass),
    		pagesContainer = $(settings.pageNumbersContainer),    		
    		//Will hold all the generated links (except the < and >)
    		linksCache = [],
    		//For the alwaysShowFirstAndLast elements seperators
    		firstPlacer = null,
    		lastPlacer = null;    
    		

    	if (tPages == 1 && !settings.continueOnOnePage) {    		
        	return;
       	}

		//Create number links
		if (!settings.noPrevNextBtn)
    		pagesContainer.append(createLink(settings.prevBtn, '#prev').addClass(settings.prevBtnClass));	
    	    	
    	for (var i = 1; i <= tPages; i++) {
    		var l = createLink(i);
    		linksCache.push(l);
    		    		    		
    		//l.addClass((i == currPage ? settings.pageActiveClass : settings.pageClass));
    		
        	pagesContainer.append(l);
    	}
    	
    	if (!settings.noPrevNextBtn)
    		pagesContainer.append(createLink(settings.nextBtn, '#next').addClass(settings.nextBtnClass));
    	
    	p.append(container.append(pagesContainer));

    	pagesContainer.delegate('a', 'click', function (e) {
    		
    		var innerShowPage = function(pNum) {
    				//currPage = settings.showPage(pNum,itensPerPage,currPage,items,tPages);
    				return settings.showPage(pNum,itensPerPage,currPage,items,tPages);
    			},
    			//Link element
    			l = $(this);
    		    		
    		currPage = settings.delegateFunc(e,l,l.html(),itensPerPage,currPage,items,tPages,innerShowPage);

    		setActiveLink();    		
    		    		
    		    		
    		if (settings.delegateClickPreventDefault)
    			e.preventDefault();			
			
			if (settings.delegateClickStopPropagation)	    		
    			e.stopPropagation();
		});
		
		if (settings.autoCallPageFuncOnStart) {
			settings.showPage(currPage,itensPerPage,currPage,items,tPages);
		}
		
		//Must be called here so that I can check settings.showMaxLinks		
		setActiveLink();
	}
		
	$.fn.acsPaginator.settings = {};

	
	$.fn.acsPaginator.settings.defaults = {
		items: null, //If not set to null the plugin will count the children
		tPages: null, //If not set to null the pluging will calculate 
		itemsPerPage: 4,
		autoCallPageFuncOnStart: true,
		
		showMaxLinks: 5, //if not null only this amount of links will be shown
		alwaysShowFirstAndLast: true, //will only work if showMaxLinks is not null
		alwaysShowFirstAndLastSeperator: '..',
		 
		//By default the pagination will be added to the parent. Set here where to place it if you want to change this behaviour
		placeHolder: null,
		currPage: 1,
				
		container:'<div>',
		containerClass:'acsPaginator',
	
		pageNumbersContainer:'<ul>',
		pageNumbersContainerChildren:'<li>',
	
		//No < or > button
		noPrevNextBtn: false,
		prevBtn:'&lt;',
		prevBtnClass:'',
		
		nextBtn:'&gt;',
		nextBtnClass:'',
		
		continueOnOnePage: false,
		
		pageActiveClass:'acsPageActive',
		pageClass:'acsPage',
		
		/**
		 * Delegate function for the pagination links
		 * 
		 * @param event e
		 * @param jQuery link
		 * @param int pPage - Page to go
		 * @param int itemsPerPage
		 * @param int currPage
		 * @param mixed items
		 * @param int tPages
		 * @param function showPage A simpler version of $.fn.acsPaginator.showPage where only the page to go is required
		 * 
		 * @return int current page 
		 */
		delegateFunc:function (e,link,pPage,itensPerPage,currPage,items,tPages,showPage) {   
			var newCurrPage = currPage;
			     
	        if (pPage.match(/\d+/) && pPage > 0) {
	            newCurrPage = showPage(pPage);
	        }
	        else {
	        	//Force number
	        	currPage *=1;
	            //ie6 hack. Must split on the #                    
	            switch (link.attr('href').split('#')[1]) {
	                case 'prev':
	                    if (currPage > 1)
	                        newCurrPage = showPage(--currPage);
	                    break;
	                case 'next':
	                    if (currPage < tPages) {
	                        newCurrPage = showPage(++currPage);
	                    }
	                break;
	        	}        
			}
			
			return newCurrPage;
		},
		
		/**	 
		 * Function that will show/hide the items. Must return the current page 
		 *
		 * @param int pPage
		 * @param int itemsPerPage
		 * @param int currPage
		 * @param mixed items
		 * @param int tPages
		 * 
		 * @return int current page 
		 */
		showPage:function (pPage,itensPerPage,currPage,items,tPages) {
	    	currPage = pPage * 1; //Convert to number
	
	    	var end = itensPerPage * currPage,
				start = end - itensPerPage;
	
	    	items.filter(':visible').hide();
	    	items.slice(start, end).show();
	    	
	    	return currPage;
		},
		
		delegateClickPreventDefault: true,			
		delegateClickStopPropagation: true			
	};
	    	
})(jQuery);