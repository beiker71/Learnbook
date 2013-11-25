 
	//if (typeof console == "undefined" || typeof console.log == "undefined") var console = { log: function() {} };  
//	var testing = true;
function IE(v) {
  var r = RegExp('msie' + (!isNaN(v) ? ('\\s' + v) : ''), 'i');
  return r.test(navigator.userAgent);
}

if(IE())   {
//alert('Internet Explorer!');
 }

if(IE(10)) { 
//alert('Internet Explorer 10!');
}

$(document).ready(function() {

	initTracking(); //doesn't require document.ready
		$('body').append('<div id="dialog-modal" style="display:none; z-index: 1000;"></div>');
	 
       	 	
	/*module version stuff - this opens a "loading" dialog if there is a version param set*/
	if(   (lmsVrsn!=null)&&!isNaN(lmsVrsn)   ){
  	  
  	  	//$('body').append('<div id="searchModal" style="display:none;"></div>');
   		if(justOpened){
   			//if(testing){console.log('parent.lmsVrsn='+lmsVrsn);}
    		
    		$( "#dialog-modal" ).dialog({
    			close:true,
            	height: 140,
           		//autoOpen:false,
           		modal: true
       	 	});//$( "#dialog-modal" )      	 	
       	 	
    	}//if(parent.justOpen
    	
    	
    }//if(zLmsVrsn)
    $("#dialog-modal").html("<div id='modal-header'></div><div id='modal-body'><img src='images/ajax-loader.gif' /></div>");
     
				  
	printNavBar();	
		var params = {
			itm:znThisPage
		}	
	getContent(params);
	
	//assign getcontent to onclick of all the nav links
	$("#sidebar-left li a[id^='itm']").click(function() {
		//salert('hi');
		var itmno = this.id.substring(3);
		var params = {
			itm:itmno
		}	
		getContent(params);
	});
	
//assign functions to previous/next buttons	 
	$(".prevbtn").click(function(){ prevPage(znThisPage); });
	$(".nextbtn").click(function(){ nextPage(znThisPage); });
//assign functions to expander buttons	
	$(".expander").click(function(){ toggleByChapter() });
//search button functionality	
	$('#headerSearch').click(function(e) {
			//openModalDialog('#dialog-modal');
	  	$('#myModal').html('<div id="searchDiv"></div><div id="searchResults"></div> <a class="close-reveal-modal"><span class="closeText">CLOSE</span> &#215;</a>');
		$('.close-reveal-modal').click(function(e) {
 		turnOffMsg();
 		}); 
     	$('#myModal>#searchDiv').load('includes/search/googleResults.htm');
     	//openModalDialog("#myModal");
     	turnOnMsg();
     		//turnOnMsg()	
       	e.preventDefault();
     });//end $('#headerSearch')
 	
});//end ready

 
function openModalDialog(id){ $(id).dialog(open); }
function closeModalDialog(id){
	if(testing){console.log('BBf in function closeModalDialog');}
	$(id).dialog('close');
}

function checkSubmit(e){
	//alert('in checkSubmit');
	//http://www.mindfiresolutions.com/Using-jQuery-AJAX-Calls-to-send-parameters-securely-1235.php
	//http://stackoverflow.com/questions/29943/how-to-submit-a-form-when-the-return-key-is-pressed
	//http://stackoverflow.com/a/29966
	//var param = {q:('#q').val(),access: 'p', client: 'mlearning', proxystylesheet:'mlearning',sort:'date%253AD%253AL%253Ad1',oe:'UTF-8',ie:'UTF-8',filter:'0',proxyreload:'1',q:'criteria'}; 
	//$("#searchResults").load("http://10.30.15.145/search?client=mlearning&proxystylesheet=mlearning&sort=date%253AD%253AL%253Ad1&oe=UTF-8&ie=UTF-8&filter=0&proxyreload=1&q=criteria");
	var q = encodeURIComponent( $("#q").val() );
	$("#searchResults").load("includes/search/proxy3.asp?q="+q);
		//document.forms[0].submit();	
		//show styled xml results in #searchResults div (at bottom of header.htm)
	//$("#searchResults").load("search/proxy3.asp?q="+q);
	
}

//*********	 		
 
function setupQuizzes(){
	interactionsQuizzes=false;//set it to false each time this runs. It will be set to true again if there are any in this version.
  //  console.log('in setupQuizzes GPB ps='+ps);
   	for(var m=0; m< ps.length; m++){ 
  
        var q =  ps[m];
	    if (typeof q.quiz!="undefined"){ 
	        quizCount++;
	        	console.log('in setupQuizzes GPC quizCount='+quizCount);
		    qType=(typeof q.type!="undefined")?q.type:"Q";
		    if(qType=="I"){
		    	interactionsQuizzes=true;
		    	if(testing){console.log('in setupQuizzes GPD interactionsQuizzes='+interactionsQuizzes)}		    
		    }
		    var objectiveID= (qType+q.quiz);
		    if (testing){ console.log('in setupQuizzes GPE objectiveID='+objectiveID) }
			var obj_count = parseInt(SCOGetValue('cmi.objectives._count'), 10);
			 
			 if( SCOGetObjectiveData(objectiveID, "status") ){ console.log('there was an objective for id '+objectiveID)  }
    		else{	SCOSetObjectiveData(objectiveID, 'status', '')}
 			//sets up the maximum score for each objective
           	var objStatus =  (SCOGetObjectiveData(objectiveID, "status"   ))?(SCOGetObjectiveData( objectiveID, "status"   )):'';
	      	var objMax =     (SCOGetObjectiveData(objectiveID, "score.max"))?(SCOGetObjectiveData( objectiveID, "score.max")):q.qMax;
		   	var objScore =   (SCOGetObjectiveData(objectiveID, "score.raw"))?(SCOGetObjectiveData( objectiveID, "score.raw")):q.qScore;
		  	
		  	//if there's a score in mlearning, use it, otherwise leave it
		   	if (typeof objScore!="undefined"){ q.qScore=parseInt(objScore,10);}
		   	qScore=q.qScore; 
		 	
		if ((objMax!="")&&(typeof objMax!="undefined")&&!isNaN(objMax) ){q.qMax=parseInt(objMax,10);}
		                                     
			qMax=q.qMax;
 			 
			if (testing){
				console.log('from quizFunctions.js: setupQuizzes');
				console.log(('itm'+m)+': '+objectiveID+', objMax= '+objMax+', objScore= '+objScore);
				console.log('qMax='+qMax+', qScore='+qScore+'qType'+qType);	
			}//end  if (testing 
		}// end if (typeof q.quiz!="undefined"){
      } //end for (var...
    if(interactionsQuizzes){loadInteractions();}
    //quizSetupDone = true;
   ms["quizSetupDone"] = true
   	ns.localStorage.set("modulevars",ms);
 } //end setupQuizzes function
 
 

function setVrsn(){
   	
   	//set some variables
	zVrsn = 	qsParm['vrsn'] ? qsParm['vrsn'] : null;
	zLmsVrsn = 	(parent.lmsVrsn && !isNaN(parent.lmsVrsn) ) ? parent.lmsVrsn : null;
	zCookieVrsn = ReadCookie('cVrsn');
	if(testing){console.log('EEE zVrsn='+zVrsn+' zLmsVrsn='+zLmsVrsn+ ' zCookieVrsn='+zCookieVrsn)}		 

//Was it just opened AND there an lmsVersion set? (means a version was read in from the LMS)
 	if((justOpened)&&(zLmsVrsn)){
 		openModalDialog("#dialog-modal");	
 	    if(testing){console.log('BBb zLmsVrsn='+zLmsVrsn);}
 		//if so, set the cookie if it is not set already, 
 		if(testing){console.log('FFF ReadCookie(cVrsn)='+ReadCookie('cVrsn')+' zLmsVrsn='+zLmsVrsn)}  
 		if(ReadCookie('cVrsn')!=zLmsVrsn){ 
				if(testing){console.log('BBd about to set cookie');}	
				SetCookie('cVrsn',zLmsVrsn,1);
				zCookieVrsn = ReadCookie('cVrsn');
				if(testing){console.log('BBa zCookieVrsn is now '+zCookieVrsn);}				 				
			}//	end if(ReadCookie(cVrsn)!=zLmsVrsn
 		 setTimeout('detArrayVrsn('+zLmsVrsn+')',1000);
 		
 	}//	end if(zLmsVrsn)


//If not, is there a version parameter in the request?	
 	else if(zVrsn!=null){
 		 
		  if(testing){console.log('BBC');}
 		if(zCookieVrsn!=zVrsn) {//does the version param match the currently set cookie, if any?
 		//	if not, set the cookie, if it needs it
 			if(testing){console.log('BBe about to set cookie');}	
 			SetCookie('cVrsn',zVrsn,1);
 			SCOSetObjectiveData("version","score.raw",zVrsn);
 			zCookieVrsn = ReadCookie('cVrsn');
 			lmsVrsn = zVrsn;
 			zLmsVrsn = zVrsn;
 			if(testing){console.log('BBe zCookieVrsn is now'+zCookieVrsn);}
 		//	change the page Array
 			 setTimeout('data.detArrayVrsn('+zVrsn+')',1000);		
 		}//end if(zCookieVrsn!=zVrsn) 
 		 
 	}//end 	else if(zVrsn!=null)
	
	//if there is no version set, just close the loading message.
	else{  
	if(testing){console.log('no version was set');}
	 SetCookie('cVrsn',"",-1);  
	}
}//end function setVrsn() 
 
//setVrsn(); UNCOMMENT change
//add search result display functions from headcontent CHANGE

//if localstorage has been cleared, nav buttons should work, using either retrieved data from lms or original pagearray as fallback.