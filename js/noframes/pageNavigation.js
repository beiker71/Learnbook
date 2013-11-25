 	
	//if (typeof console == "undefined" || typeof console.log == "undefined") var console = { log: function() {} };  
	var testing=false;
	$(".crumb1 .icn-menu").click(function(){})
 	$(".crumb2 .icn-print").click(function(){window.print();});//assign print function to button, once, on loading index.htm.  
 	$(".crumb3 .icn-pdf").click(function(){document.pdfForm.submit(); })
 	$(".crumb4 .icn-search").click(function(){ })
	var pItem = 	qsParm['itm'] ? qsParm['itm'] : null;
	var saveStorage = qsParm['ls']?true:false;
	var deepLink = 	qsParm['dl']   ? qsParm['dl'] : null; //not used yet, but allows you to put an encoded filename as a param to deeplink when you don't know what page number it is.
	var pScore, pMax; 
	var isScorm = true;
	var sName  =((SCOGetValue("cmi.core.student_id"))+'');
	var sDetails = ((SCOGetValue("cmi.core.student_name"))+'');
	if(testing){console.log('sName='+sName +'sDetails='+sDetails);}
	var quizStats = qsParm['zg'] ?qsParm['zg'] : null;
		if(quizStats) { 
			if(testing){console.log('XET decode64(quizSt)= '+decode64(quizSt))}
			pScore = decode64(quizStats).split('&')[0];
			pScore = pScore.split('=')[1];
			pMax = 	decode64(quizStats).split('&')[1];//check this index in other versions
			pMax = pMax.split('=')[1];
			//debugger;
			if(testing){console.log('AAG pScore='+pScore+',pMax='+pMax);}
		}
		//znThisPage is a number, the index of a page in the Array
		//pageNo is the actual number that shows up as the page number - this should be znThisPage+1
		//currentPage is the page object containing all the data from the page array
	var pageNo,currentPage,znThisPage,znNextPage,znPrevPage,znPages; ;
	var thispage = (document.location.href); 
	var lastslash = (window.location.pathname.lastIndexOf("/")+1);	
	var thispathUnEnc =  window.location.protocol+"//"+window.location.hostname+window.location.pathname.substring("/",lastslash-1);
	var thispath = encodeURIComponent(window.location.pathname.substring("/",lastslash-1));//strips out final slash
		thispath = thispath.substring(3);//strips out initial slash from path: ct2%2Fcbtlib%2Fmodules%2Ftest%2Fbootstrap_metro 
	//if( ( $.localStorage.isSet(thispath) )&&(!saveStorage) ){
		//	$.localStorage.keys(thispath).removeAll();
			//if(testing){'saveStorage = '+saveStorage+ ', just removed existing storage'}
		//}
	
	var ns = $.initNamespaceStorage(thispath);
	if((ns.localStorage)&&(!saveStorage)&&(!quizStats)){
		ns.localStorage.removeAll();
		if(testing){'saveStorage = '+saveStorage+ ', just removed existing storage'}
		}	
	//debugger;//stops execution in firebug
	var cleanURL;
	var pcounter  = 0, pcounter2 = 0, pcounter3 = 0;
	var thePageArray = typeof PageArray!="undefined"?PageArray:'';//this is for the original page array 
	var znModuleType,znDocTitle,znHeaderTitle,znRecommendedMsg,znCompletedMsg,znRequiredMsg,modulevars,showExpander;	 
	var ps, ms, ints;		//ps = page storage: page array as stored in local storage
						//ms= module storage: other variables that span the entire module stored in local storage
						//ints: interactions storage: interactions array in local storage ("is" appeared to be a reserved word or keyword, so it is inconsistent with other names)
	
	znQuizSetupDone	 =		(typeof quizSetupDone!= "undefined")		? quizSetupDone	: true;
	znVrsnDone	 	 =		(typeof	vrsnDone!= "undefined")				? vrsnDone	: true;
	znJustOpened 	 =		(typeof justOpened!= "undefined")			? justOpened	: false;
	znModuleType 	 = 		(typeof moduletype!= "undefined")	  		? moduletype	: 2; 	
	znRecommendedMsg = 		(typeof recommendedMsg!= "undefined") 		? recommendedMsg: 'Recommended'; 	
	znRequiredMsg 	 =  	(typeof requiredMsg!= "undefined")	 		? requiredMsg	: 'Required';
	znCompletedMsg   =  	(typeof completedMsg!= "undefined")	 		? completedMsg	: 'Completed';	 
	znDocTitle 		 = 	 	(typeof docTitle!= "undefined")	 	 		? docTitle		: '';
	znHeaderTitle 	 = 	 	(typeof headerTitle!= "undefined")	 		? headerTitle	: '';
	znContentAuthEmail = 	(typeof contentAuthEmail!= "undefined")		? contentAuthEmail	: ''; //CHANGE = load in from navbar if possible
	//set pagearray into localstorage and retrieve
 	if(ns.localStorage.isSet('pageArray') ){ ps = ns.localStorage.get('pageArray');}
	else{
			ns.localStorage.set('pageArray',thePageArray);	//now that we've read in the pageArray file, load it into local storage. CHANGE need to add what to do if pagearray is not found
			ps=ns.localStorage.get('pageArray');
	}
	
	//set global module variables into localstorage
	if(ns.localStorage.isSet('moduleVars') ){ ms = ns.localStorage.get('moduleVars');}
	
	else{
		 modulevars = {
							quizSetupDone:znQuizSetupDone,
							vrsnDone:znVrsnDone,
							justOpened:znJustOpened,
							docTitle:znDocTitle, 
							headerTitle:znHeaderTitle, 
							moduletype:znModuleType,
							recommendedMsg:znRecommendedMsg,
							requiredMsg:znRequiredMsg,
							completedMsg:znCompletedMsg,
							contentAuthEmail:znContentAuthEmail
							};
		ns.localStorage.set('modulevars',modulevars);
		ms = ns.localStorage.get('modulevars');
	}//end else	
	
	//if(testing){console.log('JJKE ms[doctitle]='+ms['docTitle'])}
	
	
function printNavBar(){
	var urls='',urlStr='', str1; 	 
	ps = ns.localStorage.get('pageArray');//pulls current state of page array from local storage
	// console.log('SWE ls ='+ ps); 
	znPages = ps.length;
	str1= ('<div class="nav-collapse sidebar-nav">\n<ul class="nav nav-tabs nav-stacked main-menu">');	
	if(testing){console.log('in printNavBar APB ns.localStorage.isEmpty()='+ns.localStorage.isEmpty('pageArray') )}         
	getCurrentPage();	//this returns znThisPage integer and currentPage object	
 	str1+=printNavToggle();
 	str1+=printExpander(1);
	determineParents(); // processes parent child relationships for use with navbar

	 for(var i=0; i< ps.length; i++) {		 
		var x=znThisPage-1;	
	 	//console.log('in printNavBar APD '+ns.localStorage.get('pageArray')[0]);
		var p = ps[i];
		var j = (i+1);
		var k = (i-1);
		var nextItem = ps[j];
		var prevItem = ps[k];				
		var level =   		p.level;
		if(level > 1){showExpander ='block'}
		var isquiz = 	   (p.quiz)?'quiz':'notquiz';
		var isScorePage='';
		var chapter = 		p.chapter;
		var isParent= 		p.isParent!="undefined"?p.isParent:'';
		var branch=   		p.branch;
		var urlclean = 		p.url;
		var url =     		p.url+'&itm='+i;
		var buttonTitle = 	p.buttonTitle;
		var pageTitle =    	p.pageTitle;
		var expand = 'closed';
		var current = '';  
		if(urlclean=="scorePage.htm"){ isScorePage = 'isScorePage';buttonTitle='Submit Score & Complete'; }
		//if (i==x){ current = 'current';expand='open2'; }
		if(typeof znThisPage=="undefined"){znThisPage=ps[0]}
		if (i==znThisPage){ current = 'active';expand='open'; }
		//console.log('i='+i+', znThisPage= '+znThisPage+', level= '+level+'ps[znThisPage].level= '+ps[znThisPage].level+', chapter= '+chapter+', branch= ' +branch);
		if (level==1){expand='open';}
		else if (ps[znThisPage].level>level&&ps[znThisPage].chapter==chapter &&ps[znThisPage].branch==branch){expand='open';console.log('case1')} 	  //if currentPage is a direct child of i
		else if (ps[znThisPage].branch==branch && (ps[znThisPage].level==level||level==parseFloat(ps[znThisPage].level+1))){expand='open';console.log('case2')} 	  //current page on same level And in same branch
		else if (ps[znThisPage].chapter==chapter && level==2){expand='open';console.log('case3')} 
		else {expand='closed';}
		//if(testing){console.log('<a href="#" id="itm'+i+'" class="navlevel' + level +' ' +current + '  chapter' + chapter + ' ' + expand  +' ' + isParent  + ' '+isquiz+' ' + isScorePage+'">' + buttonTitle + '</a>');  }			
		str1+=('<li>');
		str1+=('<a id="itm'+i+'" class="navlevel' + level +' ' +current + '  chapter' + chapter + ' ' + expand  +' ' + isParent  + ' '+isquiz+' ' + isScorePage+'" title="'+ url +'">');
		//if(isquiz=='quiz'){str1+= ('<i class="icon-edit"></i>');}
		str1+=('<span class="hidden-tablet">');
		str1+= buttonTitle; 
		str1+=('</span></a></li>');		 
	} //end of for(var i=0 loop	
	//str1+=('</ul><!--end collapse in-->');
	str1+=printExpander(2);
	str1+=printScormButtons();
	str1+=printFeedbackLink()
	str1+=printContactInfo();
 		str1+=('</ul></div>');     	
	 
  
	if ( (trackingmode == "scorm") && APIOK() && (ms['quizSetupDone']!=true) ){  setupQuizzes();  } 
	
	//urls +=( urlStr+'" />');//new 8-12-07
	//if(document.getElementById('pdfForm')){ document.getElementById('pdfForm').innerHTML+=urls;	 }
	//setHdrBtns();//new 8-8-07
	
	$('#sidebar-left').append(str1);//this is where sidebar buttons all get written to page
	 
	//assign getcontent to onclick of all the nav links
	$("#sidebar-left li a[id^='itm']").click(function() {
		//salert('hi');
		var itmno = this.id.substring(3);
		var params = {
			itm:itmno
		}	
		getContent(params);
	});
	
	//assign expander function to expand all links
	$(".expander").click(function(){ toggleByChapter() });
	$(".expander").css('display',showExpander);//shows expander if any pageArray entry has level greater than 1
	//assign handlers to no-scorm-warning div
	if((trackingmode == "scorm") && !APIOK()){
  		$("#apiIndicator").mousedown(function(){$("#modeExplanationContainer").toggle();});		
		$("#apiIndicator").mouseout(function(){$("#modeExplanationContainer").hide();});  	
  	}//end if((trackingmode == "scorm") && !APIOK()
	
	writeNewPageNo();  
	writeHeaderTitle();
	SCOBookmark(); 
	writeDocTitle();
	
	
		 		    	  
} //end printNavBar()  

 
//figure out what page you are on now. 
function getCurrentPage(){ 	 
		//if pItem is not undefined, use it to determine which page number of the array to go to. It means you are using a deep link or perhaps coming back from a quiz.
		if ((typeof pItem != "undefined")&&(pItem != null)) {
			     //if(testing){console.log('UUV pItem ='+ pItem+ 'typeof pItem = '+typeof pItem +' znThisPage='+znThisPage)}	
			 znThisPage = pItem;
		 }
		 //check for deep link to filename also  - to document
		else if ((typeof dl != "undefined")&&(dl!=null)){ 
		//CHANGE: check for a match with the deep link to filename in the array if all else fails.
		}
 
		//if there is no pItem parameter, so now check if znThisPage exists, if so, use it. if not, set it to 0.
		else {znThisPage = typeof znThisPage!="undefined"? znThisPage:0;}
		
		//no matter what it is, set the previous and next page values now.
		znPrevPage =  parseFloat(znThisPage)-1;
		znNextPage =  parseFloat(znThisPage)+1;
		 
		//are we at the last page? hide the next button
		znThisPage == ps.length-1 ? $('.navbar .nextbtn').hide():$('.navbar .nextbtn').show();
		
		//are we at the first page? hide the previous button
		znThisPage == 0 ? $('.navbar .prevbtn').hide():$('.navbar .prevbtn').show();		 		
		pageNo = parseFloat(znThisPage)+1; //page number 		
		currentPage =  ns.localStorage.isSet(znThisPage)? ns.localStorage.isSet(znThisPage):thePageArray[znThisPage]; /// is there a local storage for this item or not? If so use it
		
	 if(testing){console.log('in getCurrentPage YYY I am finally done with getCurrent Page znThisPage ='+znThisPage)}
	return znThisPage, currentPage;  
}//end getCurrentPage
        	
 
function getIndexOfDeepLink(dl){
		var arr = ns.localStorage.get('pageArray');
		var result;
		for( var i = 0, len = arr.length; i < len; i++ ) {
    		if( arr[i].url === dl ) {
       			//result = arr[i];
       			result = i;
       			 break;
    		}//end if
    	
    	}//end for
    		return result;
}//end function getIndexOfDeepLink


//http://stackoverflow.com/questions/8809425/search-multi-dimensional-array-javascript
//http://stackoverflow.com/questions/5181493/how-to-find-a-value-in-a-multidimensional-object-array-in-javascript		

function getContent(params){	
	//set currentPage to the new page and store it in local storage
	var itm = (typeof params.itm!="undefined")? params.itm:null;
	var dl	= (typeof params.dl!="undefined")?  params.dl:null;	      
 
	
	if((dl)&&(!itm)){
		if(typeof dl!="undefined" && dl!=null ){ 
			if(dl=="index.htm"){itm = 0}
			else{
				itm = getIndexOfDeepLink(dl);

				console.log('SEW in getContent dl= '+dl+', itm=getIndexOfDeepLink(dl)= '+getIndexOfDeepLink(dl));
			} //end else
		}//end if if(dl=="index.htm")
	}//end if(!itm)
	//console.log('itm='+itm);
 
	
	znThisPage =itm;
	
	var pi = ns.localStorage.get('pageArray')[itm];	
	var itmurl 			= 	pi.url;
	var itmquiz 		=	pi.quiz; 
	var itmtype 		=	pi.type;
	var itmscore 		=	pi.score;
	var itmmax 			=	pi.max; 
	var itmcountscore 	=	pi.countscore;
	 
	if(testing){console.log("in getContent:BAA typeof itmquiz=="+typeof itmquiz+' '+itmquiz+ ' itmtype='+itmtype+', itmquiz= '+itmquiz)}
 	customFunction01();
 	//determine "is it a quiz" then is it a remote quiz or not and what to do with it. 
		if(typeof itmquiz!="undefined"){ 		  	
		  //	if(testing){console.log("in getContent:BBB typeof itmquiz=="+typeof itmquiz+' '+itmquiz+ ' itmtype='+itmtype);}		  	
		  	 		  	
		  	//if it is a questionmark quiz that has not yet been taken
		  	 if((itmtype=="Q")||(typeof itmtype=="undefined")){
		  		//if(testing){console.log("in getContent:DDD")} 
				 
				params={	
						quiz:itmquiz,
						type: (typeof itmtype=="undefined"? "Q": itmtype),
						qindex:itm
			  			}//end p
				quizStart(params); 
				}//end  if((itmtype=="Q")||(itmtype=="undefined")
			else if (itmtype=="U"){}//to be filled in later	
			else if(itmtype=="I"){				
				var ts = Math.round(new Date().getTime() / 1000);
				 $('#content div#div6').load(itmurl+'?ts='+ts+' #content > *', function() {	
					 if(testing){console.log("in getContent:DDD")} 				 	
					znThisPage = parseFloat(itm);
					$("#sidebar-left li a[id^='itm']").css("background-color","");
					$("#sidebar-left li a#itm"+itm).css("background-color","orange");
					znNextPage = parseFloat(itm)+1;
					znPrevPage = parseFloat(itm)-1;	
					wipePageNo();
					wipeNavBar();
					printNavBar()
					changeLinks(setUpInteractions);//setUpInteractions is the callback function after changeLinks is finished
 					scormDivToggle();
 					writeFlash();
					writeKalturaPlayer();
				});  //end anon function
			}//end else if(itmtype=="I")
			else if(itmtype=="C"){}//to be filled in later
			else if(itmtype=="C6"){}//to be filled in later
			
		}//end if(typeof itmquiz!="undefined" 	
 	
 	
 		//OR its not a quiz, so load the content into this page 		
			else { 	
			 		var ts = Math.round(new Date().getTime() / 1000);//add timestamp to create a sort of random number to prevent caching	 
					$('#content div#div6').load(itmurl+'?ts='+ts+' #content > *', function() { //what follows is the callback after loading content					 				 	
							$("#sidebar-left li a[id^='itm']").css("background-color","");
							$("#sidebar-left li a#itm"+itm).css("background-color","orange");
							znThisPage = parseFloat(itm);
							znNextPage = parseFloat(itm)+1;
							znPrevPage = parseFloat(itm)-1;	
							wipePageNo();
							  
							//if(testing){console.log('GFG clicked '+itm+', itm='+itm+', itmquiz= '+itmquiz+', itmtype='+itmtype+',loaded itmurl='+itmurl+', znThisPage= '+znThisPage+', znNextPage='+znNextPage+', znPrevPage='+znPrevPage);}	
							
							if(itmurl == "scorePage.htm"){ 		
								scoreQuizzes();
								$(".gothereLink,.tryagainLink").click(function(){	//bind the correctly setup getContent to each of the go there now buttons
									var itmno = this.id.substring(4); 
									var params = {
										itm:itmno
									}//end var params
									getContent(params);
								});//end $(".gothereLink
							}//if(itmurl == "scorePage.
							
							writeFlash();
							writeKalturaPlayer();
							 scormDivToggle();
						/*	if($("div[id^='kaltura_player_']").length>0){
							 	$.each( $("div[id^='kaltura_player_']"), function(){							 		 
							 	var playernum =  this.id.substring(15);
							 	$(this).append('<h2>Please wait a moment while player loads</h2><img src="images/img/ajax-loader.gif"/>'); //loading image
							 	$(this).append('<script src="https://cdnapisec.kaltura.com/p/1038472/sp/103847200/embedIframeJs/uiconf_id/20100682/partner_id/1038472?autoembed=true&playerId=kaltura_player_'+playernum+'&cache_st='+playernum+'&width=400&height=680&flashvars[playlistAPI.kpl0Id]=1_hodzk5v2"></script>');
							 	});							 	
							} */
						
							
							
							customFunction03();	
							customFunction04();								 
							wipeNavBar();
							printNavBar();
							changeLinks(function(){ 
								if(testing){console.log('links changed')}
							
							});//note that this happens only after content is loaded: it is part of the callback
							 
				}); //$('#content div#div6').load(itmur
			customFunction02();
				//end $('#content').load
	 		}//end else	  	
	
}	//end function getContent	

function writeFlash(){
	if( $('#content div#div6 noscript').length ){ //check it for flash. 
	//debugger;
	
		//alert($('#content div#div6 noscript').text() );
		
		
		
		//$(html).replace('/&lt;/g', '<');
		//$(html).replace('/&gt;/g', '>');
		if(IE(8)){ $('#content div#div6 noscript').before( $('#content div#div6 noscript').html() );}
		else{
			//http://code.google.com/p/chromium/issues/detail?id=232410#makechanges
			//safari and chrome render contents of noscript as a string
			var html = $.parseHTML(  $('#content div#div6 noscript').text() );
			$('#content div#div6 noscript').before( html ); 
		}//end else
		
		//$('#content div#div6 noscript').before( $('#content div#div6 noscript').html() ); 
		//if(IE(10)){ $('#content div#div6 noscript').before( $('#content div#div6 noscript').text() ); }
		//else{$('#content div#div6 noscript').before( $('#content div#div6 noscript').html() ); }//add back in the object and embed tags.
	
	}	//end  if							
}
function writeKalturaPlayer(){
	if($("div[id^='kaltura_player_']").length>0){
		$.each( $("div[id^='kaltura_player_']"), function(){							 		 
			var playernum =  this.id.substring(15);
			$(this).append('<h2>Please wait a moment while player loads</h2><img src="images/img/ajax-loader.gif"/>'); //loading image
			$(this).append('<script src="https://cdnapisec.kaltura.com/p/1038472/sp/103847200/embedIframeJs/uiconf_id/20100682/partner_id/1038472?autoembed=true&playerId=kaltura_player_'+playernum+'&cache_st='+playernum+'&width=400&height=680&flashvars[playlistAPI.kpl0Id]=1_hodzk5v2"></script>');
		});							 	
	} //end if
}//end function writeKalturaPlayer

function scormDivToggle(){
	if(trackingmode == "scorm" && APIOK()){
		if( $('yesAPI').length ){$('yesAPI').show();}
		if( $('noAPI').length ){$('noAPI').hide();}
	}
	
	if(trackingmode == "scorm" && !APIOK()){
		if( $('yesAPI').length ){$('yesAPI').hide();}
		if( $('noAPI').length ){$('noAPI').show();}
	}//function scormDivToggle()
}

//*****************navigation functions*************//
function customFunction01(){}
function customFunction02(){}//functions that can be redefined in userScripts.js
function customFunction03(){}
function customFunction04(){}

function changeLinks(callback){
	//change all local links to "itm=" ajax links
	 
	var nodes = $("a").not( $("#sidebar-left .main-menu a") ).not($("navbar-inner ul.nav .pull-right a.btn")).not($("#sidebar-left a.expander")).not($("a[target='_blank']")).not($('a[target="_blank"]')), i = nodes.length;
	//.not($("a[target='_blank']")) hold out resources that open in a new window
	//var regExp = new RegExp("//" + location.host + "($|/)");
	//var regExp = new RegExp("//" + thispathUnEnc + "($|/)");
	//var regExp = new RegExp(thispathUnEnc);
	
	while(i--){
    	var oldhref = nodes[i].href;
    	var isLocal = new RegExp(thispathUnEnc).test(oldhref); 
    	// console.log('oldhref='+oldhref+', isLocal='+isLocal);
    	
    	if(isLocal==true){
    	  nodes[i].style.background = "#FFCC00"; //use this for debugging: local links are colored bright yellow
    		 
    	 
    		$(nodes[i]).click(function(event){
    			//alert('oldhref='+oldhref);
    			 	event.preventDefault();
    				var params = {
    					itm:null,
    					dl:  $( this ).attr("href")	   	
    				}//end params    					 
    				getContent(params) 
    			});//end $(nodes[i
    		//console.log("i="+i+" " +oldhref + " is " + (isLocal ? "local" : "not local")+" "+nodes[i].innerHTML);
		}//end if
	}//end while
	 if(callback) {callback();}
}//end changeLinks()


function determineParents(){ //determines what pages are parents and children for use with the the navbar styles
	 var branch;
	 for(var w=0; w< ps.length; w++) { 
	  if (!branch){ branch=0;}		
         var p = ps[w];
		 var j = (w+1);
		 var k = (w-1);
		 p.branch=branch; 
		 var nextItem = ps[j];
		 var prevItem = ps[k];
		 var level =   p.level;
	     var chapter =  p.chapter;
		 var isParent = p.isParent;
	     if (nextItem){  //if there is a next item...
		       if (nextItem.chapter==chapter && nextItem.level>level){  p.branch=w;branch=w;  p.isParent='parent'; }	 //if next item in same chapter but greater level, this is a parent. set value of branch to i	
	           else {p.isParent='notParent'; 
			          if (prevItem&&level<prevItem.level){p.branch=w;branch=w;} //branches don't revert to the parent branch when level increases so this is needed
			   }//else
		     }//if(nextItem)...
         else{p.isParent='notParent'; break;}
     } //for(var...
     
 
	ns.localStorage.set('pageArray', ps); 
 }  
function writeDocTitle(){  parent.document.title=ms['docTitle']; } 
function writeBreadCrumbs(){
	var bc = '<li class="crumb1"><i class="icon-home"></i><a href="index.htm?itm=0">Home</a><i class="icon-angle-right"></i></li><li class="crumb2"><a class="itm2">'+ps[znThisPage].title+'</a></li>';
	return bc;
}
function printNavToggle(){
	//var nt = ("<li class='navtoggle'><a><img src='images/menu.png'/></a></li>");
	var nt = "";
	 return nt;
}
function printFeedbackLink(){ 
   // document.getElementById('sidebar-left').innerHTML+=("<a href='http://umichumhs.qualtrics.com/SE?SID=SV_1KUWIOAlDJwhgGw&SVID=Prod&URL="+encodeURI(window.location.href)+"&TITLE="+encodeURI(ms['headerTitle'])+"&EMAIL="+encodeURI(ms['contentAuthEmail'])+"' target='_blank' class='feedbackBtn'>Submit Comments or Questions</a>");
	var fl=("<li><a href='http://umichumhs.qualtrics.com/SE?SID=SV_1KUWIOAlDJwhgGw&SVID=Prod&URL="+encodeURI(window.location.href)+"&TITLE="+encodeURI(ms['headerTitle'])+"&EMAIL="+encodeURI(ms['contentAuthEmail'])+"' target='_blank' class='feedbackBtn'>Submit Comments or Questions</a></li>");
	return fl;
}//end printFeedbackLink 

function printContactInfo(){
   // document.getElementById('sidebar-left').innerHTML+=("<div class=\"navContact\" title=\"mlearning@umich.edu 734-615-5146\"><b>Contact Us</b><br>mlearninginfo@umich.edu<br>734-615-5146<br>Fax: 734-615-6021<br>North Campus Research Complex<br>2800 Plymouth Road, Building 200<br>Ann Arbor, MI 48109-2800</div>");
	var ci=("<li><div class=\"navContact\" title=\"mlearning@umich.edu 734-615-5146\"><b>Contact Us</b><br>mlearninginfo@umich.edu<br>734-615-5146<br>Fax: 734-615-6021<br>North Campus Research Complex<br>2800 Plymouth Road, Building 200<br>Ann Arbor, MI 48109-2800</div></li>");
	return ci;
}

function printHelpBtn(){
   // document.getElementById('sidebar-left').innerHTML+=('<a href=\"#\"  onClick=\"MM_openBrWindow(\'includes/help.htm\',\'\',\'scrollbars=yes,resizable=yes,width=908,height=625\')"  id=\"helpButton\" alt=\"How to use this module\"  title=\"How to use this module\">INSTRUCTIONS<\/a>');
    var hb=('<a href=\"#\"  onClick=\"MM_openBrWindow(\'includes/help.htm\',\'\',\'scrollbars=yes,resizable=yes,width=908,height=625\')"  id=\"helpButton\" alt=\"How to use this module\"  title=\"How to use this module\">INSTRUCTIONS<\/a>');
  	return hb;
    }

function printExpander(n){
  if(testing){console.log('in print expander')}
  var exp=('<li><a href=\"#\"  id=\"expander'+n+'\" class=\"expander btn-navbar\" style="display:none">expand all<\/a></li>');
  return exp;
   // document.getElementById('sidebar-left').innerHTML+=('<a href=\"#\" onmousedown=\"toggleByChapter();\" id=\"expander'+n+'\" class=\"expander\">expand all<\/a>');	
    }

function nextPage(pageIndex){
	if(testing){console.log('JJK znThisPage='+pageIndex+', znNextPage'+pageIndex)}
	pageIndex = (parseFloat(pageIndex) +1);
	if(pageIndex==ps.length){ alert('You are on the last page! Use the navigation buttons on the left to complete the module.');return;  }
	//note - we are going to hide the unneeded button in the top nav, but in case someone uses these functions elsewhere, the message is still needed.
	if(testing){console.log('GFF np='+pageIndex+', pageIndex='+pageIndex)}
	var params ={ itm:pageIndex  }
	getContent(params);
}


function prevPage(pageIndex){	
	var pageIndex = (parseFloat(pageIndex) -1);
	if(pageIndex<0){ alert('You are on the first page!');return;  }
	if(testing){console.log('GDD pageIndex='+pageIndex+', znThisPage='+znThisPage)}
	var params ={ itm:pageIndex  }
	getContent(params);
}


function findPageArray(){                           
	if(typeof PageArray!='undefined'){ 
		thePageArray=PageArray;
        if(testing){console.log('CCF thePageArray='+thePageArray+', thePageArray.length='+ thePageArray.length)}
        return thePageArray;   	 
	}
                                                                 
	else if (pcounter<10){ //try again 9 times
		pcounter++;
		if(testing){console.log('CDC pcounter='+pcounter)}
		setTimeout("findPageArray()",250)  
	} //end else if(counter<10)
	
	else{ 
		alert(counter+ ": I couldn't find the list of pages. (\"pageArray\"). Please reload the window. If you continue to see this message, please let the MLearning team know: mlearning@umich.edu");
	}//end else
	
	return;
} //end findPageArray
//*********	 
function writeNewPageNo(){
	 
	//var chapter =  thePageArray[window.parent.data.znThisPage-1].chapter;
	//var realChapterNo = (chapter + 1);
	var percentOfPagesBrowsed = (parseFloat(znThisPage)+1) / znPages;
	
	var zWidth = Math.round(percentOfPagesBrowsed * 75);
	if(testing){console.log('percentOfPagesBrowsed='+percentOfPagesBrowsed+' znThisPage='+znThisPage+', znPages'+znPages+', zWidth='+zWidth)}
	var lastPageNo = parseFloat(znPages);
	if (document.getElementById('pageNumberHolder')){
		document.getElementById('pageNumberHolder').innerHTML += ('<table width="75" ><tr><td align=\"left\" id="progressBarCell"><img src=\"images/progressBarBG.jpg\" width=\"' + zWidth + '\" height=\"13\" /> </td></tr><tr><td class="pageNoHolder">PAGE ' +  parseFloat(znThisPage +1) + ' of ' + lastPageNo +'</td></tr></table>');											
	} 
	else { };
  }	
  
function wipePageNo(){
	if(document.getElementById('pageNumberHolder')){
		document.getElementById('pageNumberHolder').innerHTML=("");
	} 
}

function wipeNavBar(){
	$('#sidebar-left').children().remove();//wipenavbar
}
function chooseButtonSet(){  
var	ms = ns.localStorage.get('modulevars');
var moduletype = ms.moduletype;
if(testing){console.log('in chooseButtonSet moduletype=' + moduletype);}
    if  ( typeof customBtnArray=="undefined"){
        switch (moduletype){
            case 0: //show NO buttons at all
            	btnArray = new Array( { hideSuspendBtn:true, suspendTxt:"-", showNxtBtn:false, nxtTxt:"-", hideEndBtn:true, endTxt:"-" }); break;     
            case 1: //1-sco module, unscored: Show Finish Later and End Lesson buttons
           		btnArray = new Array( { hideSuspendBtn:false, suspendTxt:"Finish Later", showNxtBtn:false, nxtTxt:"Next Section", hideEndBtn:false, endTxt:"Mark Complete" }); break;                                                
            case 2: //1-sco module, Scored (contains embedded quiz)
				btnArray = new Array( { hideSuspendBtn:false, suspendTxt:"Finish Later", showNxtBtn:false, nxtTxt:"-", hideEndBtn:true, endTxt:"-"  }); break;
			case 3: //multi-sco module intermediate (not final sco) Unscored SCO, not just before standalone quiz
				btnArray = new Array( { hideSuspendBtn:false, suspendTxt:"Finish Later", showNxtBtn:true, nxtTxt:"Next Section", hideEndBtn:true, endTxt:"-"  }); break;
			case 4: //multi-sco module intermediate (not final sco) Unscored SCO, just before Quiz 
				btnArray = new Array( { hideSuspendBtn:false, suspendTxt:"Finish Later", showNxtBtn:true, nxtTxt:"Go to Quiz", hideEndBtn:true, endTxt:"-"  }); break;
			case 5: //multi-sco module final sco, Scored, contains embedded quiz
				btnArray = new Array( { hideSuspendBtn:false, suspendTxt:"Finish Later", showNxtBtn:false, nxtTxt:"-", hideEndBtn:true, endTxt:"-"  }); break;                       
			case 6: //multi-sco module final sco, Unscored, does NOT contain any quiz
				btnArray = new Array( { hideSuspendBtn:true, suspendTxt:"-", showNxtBtn:false, nxtTxt:"-", hideEndBtn:false, endTxt:"Mark Section Complete"  }); break;
			case 7: //show only end this lesson button with mark complete label
				btnArray = new Array( { hideSuspendBtn:true, suspendTxt:"-",  showNxtBtn:false,  nxtTxt:"-",  hideEndBtn:false, endTxt:"Mark Complete"  }); break; 
			case 8: //all 3 buttons just in case 
				btnArray = new Array( { hideSuspendBtn:false, suspendTxt:"Finish Later", showNxtBtn:true, nxtTxt:"Next Section", hideEndBtn:false, endTxt:"Mark Complete" }); break; 
			case 9: //just show next section button, just in case
				btnArray = new Array( { hideSuspendBtn:true, suspendTxt:"-", showNxtBtn:true, nxtTxt:"Next Section", hideEndBtn:true, endTxt:"-"  }); break;
			default : //assuming it is a 1-sco, scored with embedded quiz
				btnArray = new Array( { hideSuspendBtn:true, suspendTxt:"Finish Later", showNxtBtn:false, nxtTxt:"Next Section", hideEndBtn:true, endTxt:"Mark Complete"  }); break;
		}//end switch
		
	}//end if((customBtnArray...
    else{ 
        var customBtns = customBtnArray;
        for(var b=0; b< customBtns.length; b++){
        	var bhr= customBtns[b].href, bttl= customBtns[b].title, btxt=customBtns[b].txt, bclk=customBtns[b].clk, bcls=customBtns[b].cls, bid=customBtns[b].id;
        	//document.getElementById('NavBar').innerHTML+=('<a href=\"'+bhr+' \" onclick=\"'+bclk+'\" id=\"'+bid+'\" class=\"'+bcls+'\" title=\"'+bttl+'\">'+btxt+'<\/a>');
        	//NEED TO FIX THIS SECTION
        	}//end for
        
    }//end else
    return btnArray;
 }//end chooseButtonSet()                               

function printScormButtons(){
	var scormbuttonStr ='';
	var nnb, ssb, eeb;
    if(APIOK()){		 											
		chooseButtonSet();
		if(testing){ console.log('pageNavigation AAA writing buttons, btnArray[0].suspendTxt='+btnArray[0].suspendTxt) }
		if(btnArray[0].showNxtBtn) { 	 scormbuttonStr+= writeNextButton(btnArray[0].nxtTxt)}
		if(!btnArray[0].hideSuspendBtn){ scormbuttonStr+= writeSuspendButton(btnArray[0].suspendTxt) }										
		if(!btnArray[0].hideEndBtn) {	 scormbuttonStr+=	 writeEndButton(btnArray[0].endTxt)}	
		return scormbuttonStr;
	}//end if(APIOK()
	else{
		var indicatorString='<div id="apiIndicator">';
	    indicatorString+='<div id="modeExplanationContainer" style="display:none;">You are in Unscored Mode because you did not enroll in this module through MLearning.</br>No score will be recorded in your MLearning Transcript but you may use these materials for reference. <\/div><\/div>';
	    indicatorString+='<li><a href="images/img/searchToEnrollInstructions.pdf" target="_blank" id="showUnscoredExample"  onMouseDown="event.cancelBubble=true;">see Example</a></li>';
		return indicatorString;
	}
	
}//end printScormButtons			  

function bookmarkAlert() {
	//if this is the first page, and there is a stored bookmark show alert if module is long
//	if(testing){console.log('XDE typeof thePageArray='+typeof thePageArray) }
		if ((typeof thePageArray[0].askedbookmark=="undefined")&&(znPages>15)){ 	
			if( ((znThisPage) == 1 ) && (SCOGetValue('cmi.core.lesson_location')!='')){
				thePageArray[0].askedbookmark = true;
				var answer = confirm('You have a saved bookmark. Would you like to return to that location now?')
				if (answer){ getContent(SCOGetValue('cmi.core.lesson_location'));  }
				else{}
			}//  if( ((window.parent.data.znT
		}//end iftypeof thePageArray[0].askedbookmark)
}//end bookmarkAlert

function writeEndButton(txt){
    var endText = (endText?endText:txt);
   // document.getElementById('sidebar-left').innerHTML+=("<a href='#'  class='endLesson' id='endLesson' title='Mark this lesson complete' onclick='closingActions();return false;'>"+endText+"</a>");   
	var eb=("<li><a href='#'  class='endLesson' id='endLesson' title='Mark this lesson complete' onclick='closingActions(this.id);return false;'>"+endText+"</a></li>");   
	return eb;
}//end writeEndButton

function writeNextButton(txt){
    var nextText = (nextText?nextText:txt);
  //  document.getElementById('sidebar-left').innerHTML+=("<a href='#'  class='nextLesson'  id='nextLesson' title='Mark this lesson complete' onclick='nextActions();return false;'>"+nextText+"</a>");    
    var nb=("<li><a href='#'  class='nextLesson'  id='nextLesson' title='Mark this lesson complete' onclick='nextActions(this.id);return false;'>"+nextText+"</a></li>");    
	return nb;
}//end writeNextButton

function writeSuspendButton(txt){
    var suspendText = (suspendText?suspendText:txt);
   // document.getElementById('sidebar-left').innerHTML+=("<li><a href='#' class='suspendLesson' id='suspendLesson'  title='Stop for now and come back later to finish' onclick='suspendActions();return false;'></li>"+suspendText+"</a>");                       
   var sb=("<li><a href='#' class='suspendLesson' id='suspendLesson'  title='Stop for now and come back later to finish' onclick='suspendActions(this.id);return false;'>"+suspendText+"</a></li>");                       
	return sb;
}//end writeSuspendButton

function nextActions(id){   
   if(typeof id !="undefined"){showSpinner(id)}  
   	g_gbGoingToNextSco = true;
   	ns.localStorage.removeAll(); 
  	SCOSetValue("cmi.core.lesson_status","completed");
   	SCOSetValue("cmi.core.exit","");
    SCOSaveData();                      
    SCOFinish();//sets gbfinishdone                      
}

function closingActions(id){
    if (APIOK()){	    	
    	if(typeof id !="undefined"){showSpinner(id)}  		
	   	SCOSetValue("cmi.core.lesson_status","completed");
		SCOSetValue("cmi.core.exit","");
		SCOSaveData();
		if(cookieVrsn){SetCookie('cVrsn',"",-1);}
		ns.localStorage.removeAll(); 
		SCOFinish();//sets gbfinishdone			
	}//end  if (parent.APIOK())
}//end closingActions

function suspendActions(id){
 	if (APIOK()){
 		if(typeof id !="undefined"){showSpinner(id)} 
 		ns.localStorage.removeAll();
		SCOSetValue("cmi.core.lesson_status","incomplete");
		SCOSetValue("cmi.core.exit","suspend");
		g_bIsSuspended = true;
		SCOCommit(); 
        SCOFinish();	    
	}//if (parent.APIOK(
}//end suspendActions

function showSpinner(id){
	$('#'+id).html('<img src="images/img/ajax-loader-1.gif" class="spinnerImg">');
}
function quizStart(params){		
		var quiztype = params.type;
		var quiz = params.quiz;
		var qindex = params.qindex;
		
		
		switch(quiztype)
			{
			case "Q":
			  if(testing){console.log('ABA quiztype='+quiztype+' quiz='+quiz+' qindex='+ qindex+', document.location.href='+document.location.href)}
				//currentloc = document.location.href.slice(0,-1); //this slices off the /# from the end of the url
				if( trackingmode=="scorm" && APIOK() ){
					currentloc = document.location.href;
					if(testing){console.log('ABA currentloc= '+currentloc)}
					var n = currentloc.lastIndexOf("/");
					currentloc = currentloc.slice(0,n);
					currentloc = currentloc+"/perceptionQuizWrap.htm"
					console.log('GPE currentloc= '+currentloc);
					console.log("GPF documentlocation=  http://uhqmarkappspr1.med.umich.edu/perception5/session.php?session="+quiz+"&call=onepagewrap&name="+sName+"&details="+sDetails+"&home="+currentloc+"&itm="+qindex);
					document.location = "http://uhqmarkappspr1.med.umich.edu/perception5/session.php?session="+quiz+"&call=onepagewrap&name="+sName+"&details="+sDetails+"&home="+currentloc+"&itm="+qindex;		
			 		}
			 		
			 		else {
			 			 //var aznthispage = parseInt(qindex,10)
			 			alert('SCORM is not active so quiz will not start. Now redirecting to next page. ');
			 			nextPage(qindex);
			 			}
			 break;
			case "U":
			 // execute code block 2
			  break;
			case "I":
			 // execute code block 2
			  break;
			case "C":
			 // execute code block 2
			  break;
			default:
			 // code to be executed if n is different from case 1 and 2
			}//end switch quiztype
		
}//end quizStart

function turnOnMsg(){   $('#myModal').modal('show');} 
function turnOffMsg(){ $('#myModal').modal('hide');}

function writeHeaderTitle(){ $("#hdrTitle>h1").html( ms.headerTitle );}
//https://github.com/julien-maurel/jQuery-Storage-API