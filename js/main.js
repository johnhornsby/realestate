/*
 
Eversheds iPad Application
@author Owain Lewis | John Hornsby
@description iPad application for Eversheds LLC
@version 1.0


 
*/
/*
 
 @description Used in Nodelist for each itterations later in the application
 @returns (Array) => Original Nodelist
 
*/
NodeList.prototype.toArray = function () {
    var ary = [];
    for (var i = 0, len = this.length; i < len; i++) {
        ary.push(this[i]);
    }
    return ary;
};

(function () {
    "use strict";
    window.log = function () {
        if (window.log) {
            var a, i, max;
            for (i = 0, max = arguments.length; i < max; i++) {
                console.log(arguments[i])
            }
        }
    };

    function showLoading() {
        var a = document.getElementById('loader');
        a.style.display = 'block'
    }

    function hideLoading() {
        var a = document.getElementById('loader');
        a.style.display = 'none'
    }
	/*
   
   API
   
  */
    var API = {
        is_iPad: navigator.userAgent.indexOf("iPad") != -1,
        catHash: {},
        noCategories: 0,
        noSubCategories: 0,
        template: {},
		jsonDataLoadedIncrement:0,
        init: function () {
            var w = window.innerWidth;
            var h = window.innerHeight;
            var a = document.getElementById('loader');
            a.style.left = w / 2 - 26 + 'px';
            a.style.top = '160px';
            A.buildCountries();
            B.buildCategories();
            E.setup.call(this);
        },
/*
	 
	  Paths to the JSON files required for this application
	  @private
	 
	*/
	/*
        _countries: 'http://pitch.sequence.co.uk/eversheds/realestate/ipad/2/data/country.json',
        _items: 'http://pitch.sequence.co.uk/eversheds/realestate/ipad/2/data/item.json',
        _categories: 'http://pitch.sequence.co.uk/eversheds/realestate/ipad/2/data/category.json',
		*/
		_countries: 'http://osdtdes01/eversheds/realestate/ipad/7/data/country.json',
        _items: 'http://osdtdes01/eversheds/realestate/ipad/7/data/item.json',
        _categories: 'http://osdtdes01/eversheds/realestate/ipad/7/data/category.json',
		
		
        get: function (url, callback, e) {
            $.ajax({
                url: url,
                success: function (a, b) {
                    if (a.length) {
                        callback.call(this, a, e)
                    }
                },
                error: function (a, b) {
                    throw ("Error" + b);
                }
            })
        },
        returnCurrentCountry: function () {
            if (document.querySelectorAll('#countriesList .active').length) {
                var a = document.querySelectorAll('#countriesList .active');
                var b = a[0].getAttribute('data-country-id');
                return b
            } else {
                return false
            }
        },
        filterJSON: function () {
            var a = [];
            for (var b in results) {
                if (Object.prototype.hasOwnProperty.call(results, b)) {
                    a.push(results[b].Name);
                }
            }
            return a
        },
        query: function (url, callback) {
            if (arguments) {
                this.get(url, callback);
            }
            return
        },
        showQueryResults: function (a) {
            var b = JSON.parse(a);
            var c = [];
            for (var d in b) {
                if (Object.prototype.hasOwnProperty.call(b, d)) {
                    log(b[d]);
                }
            }
            D.updateResults(c.join());
        },
        buildTemplate: function (a) {
            var b = JSON.parse(a);
            var c = [];
            var e = document.createDocumentFragment();
            var panel_template = document.createDocumentFragment();
            for (var f in b) {
                if (Object.prototype.hasOwnProperty.call(b, f)) {
                    var g = b[f].CategoryId;
                    var h = b[f].Name;
                    var j = b[f].SubCategories;
                    var d = document.createElement('div');
                    d.className = 'category';
                    d.setAttribute('data-category-id', g);
                    var k = document.createElement('h2');
                    k.innerHTML = h;
                    k.setAttribute('data-category-id', g);
                    k.setAttribute('data-category-name', h);
                    d.appendChild(k);
                    for (var i = 0; i < j.length; i++) {
                        var l = j[i];
                        if (g === l.CategoryId) {
                            var s = document.createElement('div');
                            s.className = 'subcategory';
                            s.setAttribute('data-sub-category-id', l.SubCategoryId);
                            var m = document.createElement('h3');
                            var n = document.createElement('div');
                            n.className = 'details';
                            n.setAttribute('data-sub-category', l.SubCategoryId);
                            m.setAttribute('data-parent-category-id', l.CategoryId);
                            m.setAttribute('data-sub-category-id', l.SubCategoryId);
                            m.innerHTML = l.Name;
                            s.appendChild(m);
                            s.appendChild(n);
                            d.appendChild(s);
                        }
                    }
                    e.appendChild(d);
                }
            }
            D.addTemplate(e);
        },
        getAllDetailsByCountryId: function (i) {
            try {
                var a = document.querySelectorAll('[data-div-country-id="' + (i) + '"]')
            } catch (e) {
                log(e.message);
            }
            return a;
        },
        getDetailsAndUpdateById: function (subCategoryID, subCategoryDetails) { //search template for correct subCategory and insert details 
            var e = $('#template .details'); //object of template and all the nodes
            var subCategoryNodeList = e.dom; //node list of tempate subcategories
            for (var i = 0; i < subCategoryNodeList.length; i++) {
                if (parseInt(subCategoryNodeList[i].getAttribute('data-sub-category'), 10) === subCategoryID) {
                    subCategoryNodeList[i].innerHTML = subCategoryDetails;
                }
            }
        },
        justCountryClicked: function (countryID, title) {
            var r = API.getAllDetailsByCountryId(countryID); //node list of all sub categories for that country id in hiddenResults
            for (var i = 0; i < r.length; i++) { //iterate through all of the countries subcategory nodes
                var subCategoryNode = r[i]; //node
                var subCategoryID = parseInt(subCategoryNode.getAttribute('data-subcategory-id'), 10); //get subCategory id from node
                var subCategoryDetails = subCategoryNode.innerHTML; //get html details from node 
                API.getDetailsAndUpdateById(subCategoryID, subCategoryDetails) //insert details into template
            }
        },
        filterBy: function (a, b) {
            return null;
        },
        buildAllHTML: function (a, b) {
            var c = Array.prototype.slice.call(arguments);
            var d = JSON.parse(a);
            var e = document.createDocumentFragment();
            var listView = document.createDocumentFragment();
            for (var f in d) {
                if (Object.prototype.hasOwnProperty.call(d, f)) {
                    var g = d[f].CountryId;
                    var h = A.getCountryNameById(g);
                    var i = B.getSubCategoryNameById(d[f].SubCategoryId);
                    var j = d[f].Details;
                    var k = document.createElement('div');
                    k.className = 'subcategory';
                    k.setAttribute('data-div-country-id', g);
                    k.setAttribute('data-subcategory-id', d[f].SubCategoryId);
                    k.innerHTML = j;
                    e.appendChild(k);
                }
            }
            D.inject(document.getElementById('hiddenresults'), e);
			//JH added to check to see if all is loaded, then hide loader and mask.
			API.jsonDataLoadedIncrement++;
			API.checkJsonDataLoaded();
        },
		/**
		* @description check is called after incrementing the jsonDataLoadedIncrement, when all 3 JSON files have loaded then the loader can dissappear,
		* we also need to ensure that the mask is removed as this is initially present even though invisible, as it captures initial mouse events
		*/
		checkJsonDataLoaded: function(){
			if(this.jsonDataLoadedIncrement === 3){
				hideLoading();
				E.onMaskClickHandler();
			}
		}
    };
    var A = Object.create(API);
    A.hash = {};
    A.contacts = {};
    A.selectedCountries = [];
    A.addCountryToSelection = function (id) {};
    A.buildCountries = function () {
        this.get(this._countries, A.getAllCountries);
    };
    A.getCountryNameById = function (a) {
        return A.hash[a];
    }
    A.getAllCountries = function (a) {
        var b = JSON.parse(a);
        var c = [];
        for (var d in b) {
            if (Object.prototype.hasOwnProperty.call(b, d)) {
                A.hash[b[d].CountryId] = b[d].Name;
                A.contacts[b[d].CountryId] = b[d].Contact;
                var e = b[d].CountryId;
                var f = b[d].Name;
                var g = document.createElement('li');
                g.setAttribute('data-country-id', e);
                g.setAttribute('data-country-name', f);
                g.innerHTML = f;
                c.push(g);
            }
        }
        D.buildCountries(c);
		//JH added to check to see if all is loaded, then hide loader and mask.
		API.jsonDataLoadedIncrement++;
		API.checkJsonDataLoaded();
    };
    A.showContactDetails = function (b) {
        if (arguments && b !== false) {
            var c = A.contacts[b];
            var d = c.Address1 || '';
            var e = c.Address2 || '';
            var f = c.City || '';
            var g = c.ContactId || '';
            var h = c.Email || '';
            var i = c.Forename || '';
            var j = c.Mobile || '';
            var k = c.Postcode || '';
            var l = c.Surname || '';
            var m = c.Telephone || '';
            var n = c.WebUrl || '';
            var a = [d, e, f, g.toString(10), h, i, j, k, l, m, n];
            D.updateContact(a);
        } else {
            var a = [" ", " ", " ", " ", "amymurtagh@eversheds.com", "Amy", " ", " ", "Murtagh", "0845 497 0912", " "]; //JH insert default details
            D.updateContact(a);
        }
    };
    A.getContactDetail = function (a, b) {
        var c = A.contacts[arguments[0]];
    };
    A.showContacts = function () {
        var a = document.getElementById('window');
        a.style.opacity = 1;
        a.style.display = 'block'
    }
    A.returnAllData = function (a) {
        var b = JSON.parse(a);
        var c = document.createDocumentFragment();
        for (var d in b) {
            if (Object.prototype.hasOwnProperty.call(b, d)) {
                c.appendChild(b[d].Details)
            }
        }
        D.updateResults(c.innerHTML)
    };
/*
   
   Object B
   Category Functionality
   @inherits API
   
  */
    var B = Object.create(API);
    B.subCategoryHash = {};
    B.CategoryHash = {};
    B.selectedSubCategories = [];
    B.buildCategories = function () {
        this.get(this._categories, B.getAllCategories);
    };
    B.getCategoryNameById = function (a) {
        return B.CategoryHash[a];
    };
    B.getSubCategoryNameById = function (a) {
        return B.subCategoryHash[a];
    };
    B.getAllCategories = function (a) {
        var jsonData = JSON.parse(a);
        var c = [];
        var d = document.createDocumentFragment();
        for (var index in jsonData) {
            if (Object.prototype.hasOwnProperty.call(jsonData, index)) {
                var f = jsonData[index].CategoryId;
                var g = jsonData[index].Name;
                var h = jsonData[index].SubCategories;
                var j = document.createElement('li');
                j.innerHTML = "<span class='closed'></span><a href='#'>" + g + "</a>";
                j.className = 'parent';
                j.setAttribute('data-category-id', f);
                j.setAttribute('data-category-name', g);
                var k = document.createElement('ul');
                k.className = 'subCategories';
                for (var i = 0; i < h.length; i++) {
                    var l = h[i];
                    if (f === l.CategoryId) {
                        B.subCategoryHash[l.SubCategoryId] = l.Name;
                        var m = document.createElement('li');
                        m.setAttribute('data-parent-category-id', l.CategoryId);
                        m.setAttribute('data-sub-category-id', l.SubCategoryId);
                        m.innerHTML = l.Name;
                        k.appendChild(m);
                    }
                }
                j.appendChild(k);
                d.appendChild(j);
            }
        }
        D.buildCategories(d);
		//JH added to check to see if all is loaded, then hide loader and mask.
		API.jsonDataLoadedIncrement++;
		API.checkJsonDataLoaded();
    };
/*
   
   Object C
   Used to control the up and down arrow buttons
   
  */
    var C = {
        down: function (a, b) {
            var a = document.getElementById(a);
            var h = parseInt(document.defaultView.getComputedStyle(a, null).getPropertyValue('height'));
            var d = b || 240;
            var c = parseInt(document.defaultView.getComputedStyle(a, null).getPropertyValue('top'));
            var e = c - d;
            if ((c * -1) < h - 300) {
                a.style.top = (e) + 'px';
            }
        },
        up: function (a, b) {
            var a = document.getElementById(a);
            var d = b || 240;
            var c = parseInt(document.defaultView.getComputedStyle(a, null).getPropertyValue('top'));
            if (c < 0) {
                var e = c + d;
                a.style.top = (e) + 'px'
            } else {
                a.style.top = 0 + 'px'
            }
        }
    }
/*
ojpaosjd o
   
   Object D
   Manages the application display logic
   
  */
    var D = {
        inject: function (a, b) {
            a.appendChild(b.cloneNode(true));
        },
        addTemplate: function (f) {
            var a = document.getElementById('template');
            a.appendChild(f);
        },
        updateLoader: function () {
            var w = window.innerWidth;
            var h = window.innerHeight;
            var loader = document.getElementById('loader');
            loader.style.left = w / 2 - 26 + 'px';
            loader.style.top = h / 2 - 32 + 'px';
        },
        growl: function (a) {
            if (typeof a === 'string') {
                var b = document.getElementById('notice');
                b.innerHTML = a;
            }
        },
        updateContact: function (a) {
            var elements = ['_address1', '_address2', '_city', '_contactid', '_email', '_forename', '_mobile', '_postcode', '_surname', '_telephone', '_url'];
            var el;
            for (var i = 0; i < elements.length; i++) {
                if (document.getElementById(elements[i])) {
                    el = document.getElementById(elements[i]);
					switch(elements[i]){
						//case '_email':
						//	el.innerHTML = '<a href="mailTo:'+a[i]+'">' + a[i] + '</a>';
							//break;
						case '_telephone':
							el.innerHTML = '<a href="tel:+'+a[i]+'">' + a[i] + '</a>';
							break;
						default:
							el.innerHTML = a[i];
					}
                }
            }
        },
        resetCountryFilter: function () {
            $('#countriesList li').removeClass('active');
            D.resetCategoryFilter();
            $('#template').hide(); //show single view container
            $('#panelView').hide();
            $('#countryTitle').html('');
            $('#subcategoryTitle').html('');
            $('#panels li').removeClass('active');
            document.getElementById('introText').innerHTML = '<strong>Using the country and category lists above, select options to filter results</strong>';
			E.filterCountriesTouchPanelViewController.setScrollY(E.filterCountriesTouchPanelViewController.getScrollMinY());	//scroll to top, do via the controller so css property and controller values don't become out of sync
			E.filterCountriesTouchPanelViewController.updateThumb(); //thumb will need to be redrawn if there is a change size of container
        },
        resetCategoryFilter: function () {
            $('#template .category').css('display', 'block');
            $('#template .subcategory').css('display', 'block');
            $('#panelView .category').css('display', 'block');
            $('#panelView .subcategory').css('display', 'block');
            $('#categoriesList li').removeClass('active');
            $('#categoriesList li ul').css('display', 'none');
            $('#filterCat .parent span').removeClass('open');
            $('#filterCat .parent span').addClass('closed');
			E.filterCategoriesTouchPanelViewController.setScrollY(E.filterCategoriesTouchPanelViewController.getScrollMinY());	//scroll to top, do via the controller so css property and controller values don't become out of sync
			E.filterCategoriesTouchPanelViewController.updateThumb(); //thumb will need to be redrawn if there is a change size of container
        },
        add: function (f) {
            var a = document.getElementById('results');
            a.appendChild(f);
        },
        showMask: function () {
            var w = window.innerWidth;
            var h = window.document.body.clientHeight + 220;
            $('#mask').css('width', w + 'px');
            $('#mask').css('height', (h) + 'px');
            $('#mask').show();
            $('#mask').css('opacity', '0.5');
            return window.scroll(0, 0);
        },
        hideMask: function () {
            $('#mask').css('opacity', '0');
            $('#mask').hide();
        },
        showWindow: function () {
            var w = window.innerWidth;
            var h = window.document.body.clientHeight + 40;
            $('#window').css('left', (w / 2 - 200) + 'px');
            $('#window').css('top', (40) + 'px');
            $('#window').show();
            $('#window').css('opacity', '0.98');
        },
        hideWindow: function () {
            $('#window').css('opacity', '0');
            $('#window').hide();
        },
        buildCountries: function (a) {
            var i = 0,
                max, frag, list;
            frag = document.createDocumentFragment();
            for (i = 0, max = a.length; i < max; i += 1) {
                frag.appendChild(a[i]);
            }
            list = frag.cloneNode(true);
            var items = list.querySelectorAll('li');
            var new_list = document.createDocumentFragment();
            for (var i = 0; i < items.length; i++) {
                var _div = document.createElement('span');
                _div.setAttribute('class', 'contentDiv')
                var lambda = items[i].appendChild(_div);
                new_list.appendChild(items[i]);
            }
            //Countries
            var b = document.getElementById('countriesList');
            D.inject.call(this, b, frag);
            //Panels
            var targ = document.getElementById('panels');
            targ.appendChild(new_list);
			//JH add touch view controller
			E.onReadyToSetUpCountriesTouchViewController();
			
			
        },
        buildCategories: function (a) {
            var b = document.getElementById('categoriesList');
            D.inject.call(this, b, a);
			//
			E.onReadyToSetUpCategoriesTouchViewController();
			
        },
        updateResultsFromQueryString: function (f) {
            var a = document.getElementById('results');
            var b = document.createDocumentFragment();
            var c = [];
            for (var i = 0; i < f.length; i++) {
                b.appendChild(f[i].cloneNode(true));
            }
            a.innerHTML = '';
            a.appendChild(b);
        },
        updateResults: function (a) {
            var b = document.getElementById('hiddenresults');
            b.innerHTML = a;
        },
        updateTitle: function (a) {
            if (typeof a === 'string') {
                var t = document.getElementById('countryTitle');
                t.innerHTML = a;
            }
        },
        updateSubCategory: function (a) {
            if (typeof a === 'string') {
                var t = document.getElementById('subcategoryTitle');
                t.innerHTML = a;
            }
        },
/**
	@description function to update the template category and subcategory display styles, based on whether the category filter active class attribute.
	*/
        updateResultsDisplayPropertiesFromFilterMenu: function () {
            //Update the template display property by anaylising the filter menu
            var templateCategoryElementsArray = document.querySelectorAll('#template .category');
            var templateSubCategoryElementsArray = document.querySelectorAll('#template .subcategory');
            var numberOfActiveSubCategories = 0;
            var subCategoryID;
            var categoryID;
            $('.subCategories li').each(function (index, element) { //iterate through all subcategories and set appropriate display style
                subCategoryID = $(this).attr('data-sub-category-id');
                if ($(this).hasClass('active')) {
                    numberOfActiveSubCategories++;
                    $('#article div[data-sub-category-id=' + '"' + subCategoryID + '"]').css('display', 'block');
                } else {
                    $('#article div[data-sub-category-id=' + '"' + subCategoryID + '"]').css('display', 'none');
                }
            });
            if (numberOfActiveSubCategories > 0) {
                if (numberOfActiveSubCategories === 1) {
                    var subCategoryName = $('.subCategories li.active').html();
                    $('#subcategoryTitle').html(subCategoryName);
                } else {
                    $('#subcategoryTitle').html('multiple sub categories');
                }
                var menuCategoryLIElementsZepto = $('#categoriesList > li');
                $('#categoriesList > li').each(function (categoryIndex) { //iterate through all categories, to check if any subCategories are active and so set to block
                    var id = $(this).attr('data-category-id');
                    var specificSubCateogiesZepto = $('#categoriesList > li[data-category-id=' + '"' + id + '"] li');
                    var hasActiveSubCategory = false;
                    specificSubCateogiesZepto.each(function (subCategoryIndex) {
                        if ($(this).hasClass('active') === true) {
                            hasActiveSubCategory = true;
                            return false;
                        }
                    });
                    if (hasActiveSubCategory === true) {
                        $('#article div[data-category-id=' + '"' + id + '"]').css('display', 'block');
                    } else {
                        $('#article div[data-category-id=' + '"' + id + '"]').css('display', 'none');
                    }
                });
            } else { //no subCategories are specifically active hence all show be active.
                $('#template .category').css('display', 'block');
                $('#template .subcategory').css('display', 'block');
                $('#panelView .category').css('display', 'block');
                $('#panelView .subcategory').css('display', 'block');
            }
        }
    };
/**
	@description Function for sending emails. Needs error checking and conditional logic adding (i.e multiple countries don't work)
	@public
	@returns window.location.href
  */

    //This needs abstracting into a class/module for handling emails rather than this stupid massive function

	/*
	* JH I've changed this funciton to iterate either over the template or the panels and gleen all the data and push into an un formated array,
	* The script then runns over the unformated data and formats it into a string, the reason for doing this in two steps is to future proof the 
	* functions for use in any PDF generator which may need to style the content differently
	*/ 
    function sendEmail(a) {
        var template, d, f, element;
		var countriesArray = [];
		var countryDataObject;
		
        element = document.getElementById('template');
        if (document.defaultView.getComputedStyle(element, null).getPropertyValue('display') === 'block') {
            template = '#template';
			countryDataObject = gleenCategoriesData(element);
			countryDataObject.name = document.getElementById('countryTitle').innerText;
			countriesArray.push(countryDataObject);
        } else {
            template = '#panels .active';
			var countryPanelsLiArray = document.querySelectorAll(template);
			var countryLi;
			for(var countryIndex=0;countryIndex < countryPanelsLiArray.length; countryIndex++){
				countryLi = countryPanelsLiArray[countryIndex];
				countryDataObject = gleenCategoriesData(countryLi.lastChild);
				countryDataObject.name = countryLi.firstChild.textContent;
				countriesArray.push(countryDataObject);
			}
        }

        //Fuck sake this is getting silly. Must refactor!!!
		/*
	  @description Return an array of content as a document fragment. This needs to then be parsed in to a string for sending to email client 
	  @returns (Array) DocumentFragment
		*/
		d = formatCountriesDataArray(countriesArray);
		
		//d = d.replace(/&nbsp;/g, " ");
		d = encodeURIComponent(d);	//this seems to do everything right, encodeURL faltered when it came across &amp; and &nbsp;.

		/*
        //Dummy array to hold all our data
        var dummy = [];

        //ECMA5 for each loop
        var data = contents.toArray();
        data.forEach(function (node) {
            dummy.push(escape(node.innerHTML + "****************************************<br/><br/>"));
        });

        d = dummy.join('');
		*/

		d += '<p>For more information please contact Amy Murtagh at <a href="mailTo:amymurtagh@eversheds.com">AmyMurtagh@eversheds.com</a><p>';

        f = "mailto:?body=" + d;
        window.location.href = f;
    }


	/**
	* @description function uses imput of div containing all categories and iterates through them building an object that contains only the visible data
	*/
	function gleenCategoriesData(categoriesContainerDiv){
		var categoryDiv;
		var categoryH2;
		var subCategoryDiv;
		var subCategoryH3;
		var subCateogryDetails;
		var countryDataObject = {categories:[]}; // {categories:[{name:CATEGORY_NAME,subCategories:[{name:SUB_CATEGORY_NAME,details:DETAILS_HTML}]}]}
		var categoryDataObject;
		var subCategoryDataObject;
		
		for(var categoryIndex=0; categoryIndex < categoriesContainerDiv.children.length; categoryIndex++){
			categoryDiv = categoriesContainerDiv.children[categoryIndex];
			if(categoryDiv.style.display !== "none"){
				categoryH2 = categoryDiv.children[0].innerText;
				categoryDataObject = {name:categoryH2, subCategories:[]};
				for(var subCategoriesIndex = 1; subCategoriesIndex < categoryDiv.children.length; subCategoriesIndex++){
					subCategoryDiv = categoryDiv.children[subCategoriesIndex];
					if(subCategoryDiv.style.display !== "none"){
						subCategoryH3 = subCategoryDiv.children[0].innerText;
						subCateogryDetails = subCategoryDiv.children[1].innerHTML;
						subCategoryDataObject = {name:subCategoryH3, details:subCateogryDetails};
						categoryDataObject.subCategories.push(subCategoryDataObject);
					}
				}
				if(categoryDataObject.subCategories.length > 0){
					countryDataObject.categories.push(categoryDataObject);
				}
			}
		}
		
		return countryDataObject;
	}
	
	/**
	* @description function interates over an array of countries / categories and subcategories data and formats it into a str
	*/
	function formatCountriesDataArray(countriesDataArray){
		var str = "";
		var country;
		var category;
		var subCategory;
		for(var countryIndex=0; countryIndex < countriesDataArray.length; countryIndex++){
			country = countriesDataArray[countryIndex];
			str += "<h1>" + country.name + "</h1>";
			for(var categoryIndex = 0; categoryIndex < country.categories.length; categoryIndex++){
				category = country.categories[categoryIndex];
				str += "<h2>" + category.name + "</h2>";
				for(var subCategoryIndex = 0; subCategoryIndex < category.subCategories.length; subCategoryIndex++){
					subCategory = category.subCategories[subCategoryIndex];
					str += "<h3>" + subCategory.name + "</h3>";
					str += "" + subCategory.details + "";
				}
			}
			str += "<br />";
		}
		return str;
	}
	


/**
	@description Handles interaction between elements
	
  */
    var E = {
        setup: function () {
            $('#countriesList li').live('click', E.onCountryClickHandler);
            $('#scrollNav li').live('tap', E.onCountryScrollNavArrowClickHandler);
            $('#scrollNav li').live('click', E.onCountryScrollNavArrowClickHandler);
            $('#filterScrollNav li').live('tap', E.onCategoryScrollNavArrowClickHandler);
            $('#filterScrollNav li').live('click', E.onCategoryScrollNavArrowClickHandler);
           // $('#filterCat .parent span').live('tap', E.onCategoryDisclosureClickHandler);
            $('#filterCat .parent span').live('click', E.onCategoryDisclosureClickHandler);
            $('#filterCat .parent a').live('tap, click', E.onCategoryClickHandler);
            $('#filterCat .subCategories li').live('click', E.onSubCategoryClickHandler);
            $('#email').bind('click', E.onEmailThisClickHandler);
            $('a').tap(function (e) {
                e.preventDefault();
                return false;
            });
            $('#getintouch').bind('tap, click', function (e) {
                e.preventDefault();
                if (API.returnCurrentCountry()) {
                    D.showMask();
                    D.showWindow();
                } else {
                    alert("Please select a country first");
                }
                return false;
            });
            $('#countryFilter .reset').live('click', function (e) {
                D.resetCountryFilter();
                return false;
            });
            $('#categoryFilter .reset').live('click', function (e) {
                D.resetCategoryFilter();

                return false;
            });
            $('#mask').live('tap', E.onMaskClickHandler);
            $('#mask').live('click', E.onMaskClickHandler);
            $('#panels li').live('tap, click', function (e) {
                var item = $('#panels li').index(this);
                var obj = $('#panels li').eq(item);
                //Panel Open?
                if (obj.hasClass('open') === false) {
                    obj.css('background', 'url("images/open.png") no-repeat scroll 5px 5px #FFFFFF');
                    obj.find('.contentDiv').show();
                    obj.addClass('open');
                } else {
                    obj.css('background', 'url("images/closed.png") no-repeat scroll 5px 5px #FFFFFF');
                    obj.find('.contentDiv').hide();
                    obj.removeClass('open');
                }
            });
			
			
			
        },
        onCountryClickHandler: function () {
			if(E.filterCountriesTouchPanelViewController.isStopChildMouseUp() === false){		//check if touchPanelViewController is advising stopPropagation
				//Update country and category menus
				var countryListLiIndex = $('#countriesList li').index(this); //get index of tapped li
				var countryListLiObject = $('#countriesList li:nth-child(' + (countryListLiIndex + 1) + ')'); //get zepto object of li for index
				var panel_items = $('#panels li:nth-child(' + (countryListLiIndex + 1) + ')'); //get zepto object of panel li with index 
				if ($('#countriesList li').eq(countryListLiIndex).hasClass('active')) {
					countryListLiObject.removeClass('active');
					panel_items.removeClass('active');
				} else {
					countryListLiObject.addClass('active');
					panel_items.addClass('active');
				}
	
				//Find out how many currently active items. If there is more than one use the list view.
				//JH moved this line to after above so we get the right value for currentItems
				var currentItems = $('#countriesList li.active').length;
				if (currentItems === 0) {
					$('#template').hide(); //reset all
					$('#panelView').hide();
					$('#countryTitle').html('');
					$('#subcategoryTitle').html('');
					document.getElementById('introText').innerHTML = '<strong>Using the country and category lists above, select options to filter results</strong>';
				} else if (currentItems === 1) { //Only one item
					$('#template').show(); //show single view container
					$('#panelView').hide(); //hide multi view container
					//$('#template .subcategory').show();											//not sure why these need to be shown
					//$('#template .category').show();
					document.getElementById('introText').innerHTML = '';
					var activeCountryID = $('#countriesList li.active').eq(0).attr('data-country-id'); //get active country id as int, this may not be the country the user clicked on as they may have deselected it.
					API.justCountryClicked(activeCountryID);
					A.showContactDetails("" + activeCountryID + ""); //sets the contact details
					D.updateTitle(A.getCountryNameById(activeCountryID));
					//Or do the panel view here  
				} else {
					//Multiple items so do the panel view
					$('#template').hide();
					$('#panelView').show();
					var collection = [];
					//Find all the active links
					$('#countriesList li.active').each(function () { //iterate though each actived menu country li
						var id = $(this).attr('data-country-id');
						collection.push(id);
						API.justCountryClicked(id); //copy all countries sub categories into template
						Utilities.updatePanels(id, $('#template').html()); //copy the html from the template into the panel, sub category selection styles are set into template, so when the html is copied so are the styles.
					});
					A.showContactDetails(false); //sets the contact details, no params uses default
					$('#countryTitle').html('multiple countries');
				}
			}
        },
        onCountryScrollNavArrowClickHandler: function () {
            var i = $('#scrollNav li').index(this);
            if (i === 0) C.up('countriesList');
            else C.down('countriesList');
            return false
        },
        onCategoryScrollNavArrowClickHandler: function () {
            var i = $('#filterScrollNav li').index(this);
            if (i === 0) C.up('categoriesList');
            else C.down('categoriesList');
            return false
        },
        onEmailThisClickHandler: function (e) {
            e.preventDefault();
            sendEmail();
            return false;
        },
        onCategoryDisclosureClickHandler: function (e) {
			if(E.filterCategoriesTouchPanelViewController.isStopChildMouseUp() === false){		//check if touchPanelViewController is advising stopPropagation
				var categoryIndex = $('#filterCat .parent span').index(this);
				var subCategoriesULElement = document.querySelectorAll('.subCategories')[categoryIndex]; //subCategories ul element
				var disclosureIcon = this; //document.querySelectorAll('#filterCat .parent span')[categoryIndex];
				if (document.defaultView.getComputedStyle(subCategoriesULElement, null).getPropertyValue('display') === 'block') { //swtich to get if menu is open, if so then close, if not then open
					subCategoriesULElement.style.display = 'none';
					disclosureIcon.className = 'closed';
				} else {
					subCategoriesULElement.style.display = 'block';
					disclosureIcon.className = 'open';
				}
				E.filterCategoriesTouchPanelViewController.updateThumb(); //thumb will need to be redrawn if there is a change size of container
			}
            return false;
        },
        onCategoryClickHandler: function (e) {
			if(E.filterCategoriesTouchPanelViewController.isStopChildMouseUp() === false){		//check if touchPanelViewController is advising stopPropagation
				if (API.returnCurrentCountry() === false) {
					//alert("please select a country");
					Utilities.showAlert();
					return;
				}
				var categoryIndex = $('#filterCat .parent a').index(this);
				var subCategoriesULElement = document.querySelectorAll('.subCategories')[categoryIndex]; //subCategories ul element
				//JH toggle category li to be active
				var categoryLIObject = $('#filterCat .parent').eq(categoryIndex);
				if (categoryLIObject.hasClass("active") === false) {
					categoryLIObject.addClass("active"); //activate all children
					$(subCategoriesULElement).find("li").addClass("active");
				} else {
					categoryLIObject.removeClass("active"); //deactivate all children
					$(subCategoriesULElement).find("li").removeClass("active");
				}
				//if Category is closed then open
				var disclosureIcon = $('#filterCat .parent span').dom[categoryIndex];
				if( $(disclosureIcon).hasClass('closed') === true){
					subCategoriesULElement.style.display = 'block';
					disclosureIcon.className = 'open';	
				}
				
				//JH--
				D.updateResultsDisplayPropertiesFromFilterMenu(); //displayProperties of template and panels are upaded to reflect the category filter menu activate subCategories
				E.filterCategoriesTouchPanelViewController.updateThumb(); //thumb will need to be redrawn if there is a change size of container
			}
            return false;
        },
        onSubCategoryClickHandler: function (e) {
            e.preventDefault();
			if(E.filterCategoriesTouchPanelViewController.isStopChildMouseUp() === false){		//check if touchPanelViewController is advising stopPropagation
				var subCategoryLIIndex = $('.subCategories li').index(this);
				var subCategoryLIElement = $('.subCategories li').get(subCategoryLIIndex);
				var subCategoryID = parseInt(subCategoryLIElement.getAttribute('data-sub-category-id'));
				//JH toggle filter menu subCategory li
				if ($(subCategoryLIElement).hasClass('active') === false) {
					$(subCategoryLIElement).addClass('active');
				} else {
					$(subCategoryLIElement).removeClass('active'); //deactivate parent li
					$(subCategoryLIElement).parent().parent().removeClass('active'); //remove active class from category if any sub category is non active from category
				}
				D.updateResultsDisplayPropertiesFromFilterMenu(); //displayProperties of template and panels are upaded to reflect the category filter menu activate subCategories
				//var categoryName = B.getSubCategoryNameById(subCategoryID);									//acomplished in the above function
				//D.updateSubCategory(categoryName);
			}
            return false;
        },
        onMaskClickHandler: function (e) {
            D.hideMask();
            D.hideWindow();
            Utilities.hideInformationWindow();
			Utilities.hideAlert();
        },
		onReadyToSetUpCountriesTouchViewController:function(){
			E.filterCountriesTouchPanelViewController = new TouchScrollPanel({scrollDirection:TouchScrollPanel.SCROLL_DIRECTION_VERTICAL, frameElement:document.getElementById('filterCountry'), contentElement:document.getElementById('countriesList')});
		},
		onReadyToSetUpCategoriesTouchViewController:function(){
			E.filterCategoriesTouchPanelViewController = new TouchScrollPanel({scrollDirection:TouchScrollPanel.SCROLL_DIRECTION_VERTICAL, frameElement:document.getElementById('filterCat'), contentElement:document.getElementById('categoriesList')});
			
		}
    };
	
    var Utilities = {
        //Basically we want to get all the html needed for the id and inject it into the panel
        updatePanels: function (id, html) {
            var content = html;
            var thePanel = document.querySelectorAll('#panels li[data-country-id=' + '"' + id + '"]');
            var p = $(thePanel[0]).find('.contentDiv');
            p.html(content);
        },
	/*
	  @description Shows a modal overlay and information window.
	  Partially refactoring stuff that has already been done but abstracting into more generic
	  functions
	  
	*/

        centerInformationWindow: function () {
            var el, w, distance;
            el = $('#guide');
            w = window.innerWidth;
            distance = (w / 2 - 250 ) + 'px'
            el.css('left', distance)
        },
		centerAlert: function () {
            var el, w, distance;
            el = $('#alert');
            w = window.innerWidth;
            distance  = (w / 2 - 150 ) + 'px'
            el.css('left', distance)
        },
        hideInformationWindow: function () {
            D.hideMask();
            return $('#guide').hide();
        },
        showInformationWindow: function () {
            D.showMask();
            Utilities.centerInformationWindow();
            return $('#guide').show();
        },
		hideAlert: function() {
			 D.hideMask();
			 return $('#alert').hide();
		},
		showAlert: function() {
			Utilities.centerAlert();
			D.showMask();
			return $('#alert').show();
		}
    }

    function bindEvents() {
        $('#info_icon').bind('click', function () {
            Utilities.showInformationWindow();
            return false;
        });
        $('#close_guide').bind('click', function () {
            Utilities.hideInformationWindow();
            return false;
        });
		 $('#close_alert').bind('click', function () {
            Utilities.hideAlert();
            return false;
        });
        $('#window_close').bind('click', function () {
            E.onMaskClickHandler();
            return false;
        });
    }

    window.onload = function () {
        API.init();
        API.query(API._categories, API.buildTemplate);
        API.query(API._items, API.buildAllHTML);
        showLoading();
        //setTimeout(hideLoading, 1000, false);	//JH now hides when all of the JSON is loaded in API
        bindEvents();
        window.onorientationchange = function () {
            setTimeout(D.updateLoader, 1000, false);
        }
    }
}).call(this);