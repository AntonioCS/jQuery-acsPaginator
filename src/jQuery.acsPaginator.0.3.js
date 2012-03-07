/**
 *
 * A simple jQuery based paginator
 * 
 * @author AntonioCS
 *
 */

(function ($) {
		
	$.fn.acsPaginator = function(settings) {
		
		//Methods
		if (typeof settings == 'string') {
			var data = this.data('settings');
			if (!data)
				return;
			
			
			switch (settings) {
				
				//Use: $(element).acsPaginator('destroy');
				case 'destroy':															
					data.container.remove();						
					data.items.show();
					
					jQuery.removeData(this);																			
				break;
				
				//Use: $(element).acsPaginator('find',Child Of Element);
				case 'find': 
					if (arguments.length == 1)
						throw new Error('Missing element to find');
					
					var find = this.find(arguments[1]).index(),
						count = 0,
						page = 1;
						
					if (find == -1)
						return;

					//If not in first page go look
					if (find >= data.itensPerPage) {		
						while (count < find) {
							count += data.itensPerPage;						
							page++;
						}
					}				
                    
                    if (count > find)
                        page--;
                    
                    //console.log(page,find,count)
					
					data.currPage = data.settings.showPage(page,data.itensPerPage,data.currPage,data.items,data.tPages);
					setActiveLink(this);  
	    		
	    			if (data.settings.paginationUseCustomFormat)  			    		    		
	    				paginationUseCustomFormatReplacer(this);	 					
				break;
			}
			
			return;
		}
		
		/**
         *
         * Keywords to use: 
         *  %currPage% - Current Page 
         *  %total% - Total Pages
         *  %prev% - Previous Page
         *  %next% - Next Page
         * 
         **/
		function paginationUseCustomFormatReplacer(ele) {
			var data = $(ele).data('settings'),
				cusFormat = data.settings.paginationCustomFormat,
				replacements = {
					'%currPage%':data.currPage,			 
 					'%total%':data.tPages,
   					'%prev%':data.btns.prev.html(),
  					'%next%':data.btns.next.html()
				};
				
				for (var x in replacements) {
					cusFormat = cusFormat.replace(x,replacements[x]);					
				}
				
				data.container.html(cusFormat);
		}
		
		/**
		 * Set the correct link of the page that is active
		 * 
		 * @param int num This is optional. Default: currPage
		 */
		function setActiveLink(ele,num) {
			var data = $(ele).data('settings');
			//var data = $.data(ele,'settings');
			
						
			num = (num || data.currPage) -1;
			
			if (isNaN(num) || data.linksCache[num] == undefined)
				throw new Error('Undefined position of active link (did showPage() return anything?)');

			$.each(data.linksCache, function() { 
				this.removeClass(data.settings.pageActiveClass).addClass(data.settings.pageClass) 
			});
			                        
    		data.linksCache[num].addClass(data.settings.pageActiveClass).removeClass(data.settings.pageClass);			
    		
    		//showMaxLinks
    		if (data.settings.showMaxLinks && data.linksCache.length > data.settings.showMaxLinks) {
    			  			
				$.each(data.linksCache, function(k) { 								
					this.hide();	
				});
				
				
				var mLinks = data.settings.showMaxLinks*1,			 
					nm = num+1,
					linkLen = data.linksCache.length,
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

				show = data.linksCache.slice(a,b);
				$.each(show, function() {
    				this.show(); 
    			});	 
    			
				if (data.settings.alwaysShowFirstAndLast) {
					var first = data.linksCache[0], 
						last = data.linksCache[linkLen-1];
					
					if (!first.is(':visible')) {
						if (!data.firstPlacer) {							
							data.firstPlacer = $(data.settings.pageNumbersContainerChildren).html(data.settings.alwaysShowFirstAndLastSeperator);
							data.firstPlacer.insertAfter(first);
						}
						
						data.firstPlacer.show();
						first.show();																		
					}
					else {
						if (data.firstPlacer) {
							data.firstPlacer.hide();
						}
					}
					
					
					if (!last.is(':visible')) {
						if (!data.lastPlacer) {							
							data.lastPlacer = $(data.settings.pageNumbersContainerChildren).html(data.settings.alwaysShowFirstAndLastSeperator);
							data.lastPlacer.insertBefore(last);
						}
						
						data.lastPlacer.show();
						last.show();						
					}
					else {
						if (data.lastPlacer) {
							data.lastPlacer.hide();
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
		function createLink(containerChildren,text, href) {
			href = href || '#';
			
			var a = $('<a>').attr('href',href).html(text);
			
			return containerChildren.append(a);
		}
		
		
		//not modifying the defaults
		settings = $.extend({},$.fn.acsPaginator.settings.defaults,settings);
        //console.log(this);
        return this.each(function(){
        	        	
	        var that = this,
	        	$this = $(that),
	        	itensPerPage = settings.itemsPerPage,
	        	//Total items. Default: Count the element children
	    		items = settings.items || $this.children(),
	    		
	    		//Item per page
	    		tPages = settings.tPages || Math.ceil( (typeof items == 'object' ? items.length : items) / itensPerPage),
	    		
	    		//Where to start the pagination
	    		currPage = settings.currPage,
	    		
	    		//Where the container of the pagination links will go. Default: Element parent
	    		p = settings.placeHolder ? $(settings.placeHolder) : $this.parent(),
	    		
	    		//Container of the pagination links. Ex.: <div>
	    		container = $(settings.container).addClass(settings.containerClass),
	    		//Element the will contain the number links. Ex.: <ul>
	    		pagesContainer = $(settings.pageNumbersContainer),
	    		    		
	    		//Will hold all the generated links (except the < and >)
	    		linksCache = [],
	    		
	    		//For the alwaysShowFirstAndLast elements seperators
	    		firstPlacer = null,
	    		lastPlacer = null,
	    		
	    		//Will hold the prev and next btn
	    		btns = {},
	    		
	    		//Will contain all the data
	    		elData;								   
	    		
	       
	    	if (tPages <= 1 && !settings.continueOnOnePage) {    		
	        	return;
	       	}
	        //NOTA!!!!! 
	        //Criar o next e prev. Nao usar o pagesContainer se for custom. Trabalhar directamente so com o container
	
	
			
	
			
			//Save the prev and next btn
			btns.prev = createLink($(settings.pageNumbersContainerChildren),settings.prevBtn, '#prev').addClass(settings.prevBtnClass);
			btns.next = createLink($(settings.pageNumbersContainerChildren),settings.nextBtn, '#next').addClass(settings.nextBtnClass);
			 				
			//Create number links
			if (!settings.noPrevNextBtn)
	    		pagesContainer.append(btns.prev);			    	    	
    	
    		//Create the numeration
	    	for (var i = 1; i <= tPages; i++) {
	    		var l = createLink($(settings.pageNumbersContainerChildren),i);
	    		linksCache.push(l);		    		    		    		
	    				    		
	        	pagesContainer.append(l);
	    	}
	
    		if (!settings.noPrevNextBtn)
    			pagesContainer.append(btns.next);
    			
	    	if (!settings.paginationUseCustomFormat) {		
	    		container.append(pagesContainer);
	    	}
	    	
	    	
	    	p.append(container);
	    	
			//To allow custom format pagination	   
	    	container.delegate('a', 'click', function (e) {
	    		
	    		var data = $.data(that,'settings'),
	    			innerShowPage = function(pNum) {
	    				//currPage = settings.showPage(pNum,itensPerPage,currPage,items,tPages);
	    				return data.settings.showPage(pNum,data.itensPerPage,data.currPage,data.items,data.tPages);
	    			},
	    			//Link element
	    			l = $(this);
	    		    		
	    		data.currPage = settings.delegateFunc(e,l,l.html(),data.itensPerPage,data.currPage,data.items,data.tPages,innerShowPage);
	
	    		setActiveLink(that);  
	    		
	    		if (data.settings.paginationUseCustomFormat)  			    		    		
	    			paginationUseCustomFormatReplacer(that);
	    		
	    		if (data.settings.delegateClickPreventDefault)
	    			e.preventDefault();			
				
				if (data.settings.delegateClickStopPropagation)	    		
	    			e.stopPropagation();
			});
			
			if (settings.autoCallPageFuncOnStart) {
				settings.showPage(currPage,itensPerPage,currPage,items,tPages);
			}
			
			
			elData = {
				itensPerPage:itensPerPage,
	        	
	    		items:items,
	    			    		
	    		tPages:tPages,	    			    		
	    		currPage:currPage,	    		

	    		p:p,
	    			    		
	    		container:container,
	    		pagesContainer:pagesContainer,
	    		    		
	    		
	    		linksCache:linksCache,
	    		
	    		
	    		firstPlacer:firstPlacer,
	    		lastPlacer:lastPlacer,
	    		
	    		settings:settings,
	    		btns:btns
			};
			
			//console.log(this);
			$.data(this,'settings',elData);
			
			//Must be called here so that I can check settings.showMaxLinks		
			setActiveLink(this);
			
			//Set the custom pagination
			if (settings.paginationUseCustomFormat) {
				paginationUseCustomFormatReplacer(this);
			}			
		});			
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
        
        //Custom format
        paginationUseCustomFormat: false,
        
        /**
         *
         * Keywords to use: 
         *  %currPage% - Current Page 
         *  %total% - Total Pages
         *  %prev% - Previous Page
         *  %next% - Next Page
         * 
         **/
        paginationCustomFormat: null,
        
	
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