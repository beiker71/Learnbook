//v.1.3 07-10-08
// this uses the module version set by "setVersn()" to choose a PageArray, redraw the navbar and go to the appropriate page
if (typeof console == "undefined" || typeof console.log == "undefined") var console = { log: function() {} }; 
//var testing = (typeof parent.testing!="undefined")?parent.testing:window.ScormContent.testing;
var testing = parent.testing;
var cookieVrsn=parent.ReadCookie('cVrsn'); 
var pageHasBeenSet;
function gCloseModalDialog(){
	var counter4=0;
		if((typeof parent.myStage.closeModalDialog()=="undefined")&&(counter4<10)){
			setTimeout('gCloseModalDialog()',1000 );
			counter++
		}
		else{ parent.myStage.closeModalDialog();  }
}

function detArrayVrsn(vrsn){
	//if  a version number IS explicitly set. Set pagearray to that version, and set the cookie and set the version variable in index.htm.
	if(typeof vrsn!="undefined" ){  		
 		if(testing){console.log('PGG PageArray'+vrsn )} 		
 		
 		//if version  is 1 or 0 then 
 		if(vrsn==1||vrsn==0){           
 			if(testing){console.log('PAC PageArray'+vrsn)}
 			//window.location = window.location;  
 			window.PageArray=window['PageArray0']; 		
 			//parent.myStage.findPageArray();
 			if((parent.justOpened)&&(parent.myStage.location.href!=PageArray[0].url)){ 
 				parent.justOpened=false;
 			 	if(testing){console.log('ERT a version number was explicitly set: ('+vrsn+'). but the current page ('+parent.myStage.location.href+') did not match first page of new array ('+PageArray[0].url+')')}
 				parent.myStage.location.href = parent.zurl?parent.zurl:(PageArray[0].url); 
 					
 			}//end if (parent.myStage.location.href!=PageArray[0].url) 	
 		} //end if(vrsn==1||vrsn==0)  			
  		
  		//else version NOT 1 or 0: it is NOT same as original pagearray 			
 		else{                   
 			if(testing){console.log('PAD PageArray'+vrsn)} 
 			window.PageArray=window['PageArray'+vrsn];
 			if(testing){console.log('PAF window.PageArray.length='+window.PageArray.length+ 'parent.justOpened='+parent.justOpened)} 
 			if((parent.justOpened)&&(parent.myStage.location.href!=PageArray[0].url)){ 
 				parent.justOpened=false; 
 				parent.myStage.location.href = parent.zurl?parent.zurl:(PageArray[0].url); 
 				if(testing){console.log('ERS a version number was explicitly set: ('+vrsn+'). but the current page ('+parent.myStage.location.href+') did not match first page of new array ('+PageArray[0].url+')')}

 					
 			}//end if (parent.myStage.location.href!=PageArray[0].url) 			 			 
 		}//end else
 	}//end if(typeof vrsn!="undefined" )
 	
 
	setupQuizzes();
	parent.myStage.wipePageNo();
	parent.myStage.wipeNavBar(); 
 	parent.myStage.printNavBar(); 
 	 
 
	
}//end function detArrayVrsn

 	
 	
 	function redirectToFirstPageOfNewVersion(){
 	if ((pageHasBeenSet!=1)&&(parent.myStage.location.href!=PageArray[0].url)){  
 				if(testing){console.log('PGG parent.zurl='+parent.zurl+ PageArray[0].url);   }
 				parent.myStage.location.href = parent.zurl?parent.zurl:PageArray[0].url;
 				pageHasBeenSet = 1; 			
 			}//end if (parent.myStage.location.href!=PageArray[0].url)
 	
 	}