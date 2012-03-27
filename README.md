

Acs Paginator!
==============

A Simple paginator powered by jQuery.

How to use
----------


- Simplest use:
    

		$('#element_id').acsPaginator();
	
	Where #element_id has N elements inside.
		

Options:

	- items: Total items. If not set to null the plugin will count the children. Default = null.
	
	- tPages: Total pages. If not set to null the pluging will calculate. Default = null.
	
	- itemsPerPage: Show N items per page. Default = 4
	
	- autoCallPageFuncOnStart: Call the pagination function when started. Default = true.		
	
	- showMaxLinks: If not null only this amount of links will be shown. Default = 5.
	
	- alwaysShowFirstAndLast: Always show the first and last page links (will only work if showMaxLinks is not null). Default = true.
	- alwaysShowFirstAndLastSeperator: Default = '..'.
		 		
	- placeHolder: By default the pagination will be added to the parent. 
				Set here where to place it if you want to change this behaviour. Default = null.
				
	- currPage: Page to start with. Default 1
				
	- container:Container for the pagination elements. Default = <div>.
	- containerClass: Default = 'acsPaginator'.	
	
	- pageNumbersContainer:'<ul>'
	- pageNumbersContainerChildren:'<li>'
	
	- noPrevNextBtn: No < or > button. Default = false.
	- prevBtn: Default = '&lt;' (<).
	- prevBtnClass: Default = ''.		
	- nextBtn: Default = '&gt;' (>).
	- nextBtnClass: Default = ''.
		
	- continueOnOnePage: Create pagination elements if there are not enough elements. Default = false,
		
	- pageActiveClass:Class for the element in the pagination container that represents the active page. Default = 'acsPageActive'.
	- pageClass:'acsPage' 
		
	- delegateFunc:function (e,link,pPage,itensPerPage,currPage,items,tPages,showPage) { ... } Delegate function for the pagination links

	- showPage:function (pPage,itensPerPage,currPage,items,tPages) { ... } Function that will show/hide the items. Must return the current page 
		
	- delegateClickPreventDefault: true
	- delegateClickStopPropagation: true		
	
	- paginationUseCustomFormat Set to true to use custom format: Default: false        
	
	- paginationCustomFormat Custom format 
							Keywords to use: 
							   %currPage% - Current Page 
							   %total% - Total Pages
							   %prev% - Previous Page
							   %next% - Next Page
	 