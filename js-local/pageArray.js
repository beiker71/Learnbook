/***IMPORTANT***
	The page array generator (http://mlearning.med.umich.edu/quiz/cbtlib/modules/common/js/pa/) should be used to 
	create your page array. */
var PageArray = new Array(  
{buttonTitle:'Competency Criteria', title:' ', url:'page01.htm', chapter:0,level:1 },
{buttonTitle:'Content Pages', title:' ', url:'page02.htm', chapter:1,level:1 },
{buttonTitle:'Attestation Statement', title:'', url:'attestation.htm', chapter:2, level:1, type:'I', quiz:'409666286641', rm:'', countscore:'1'},
{buttonTitle:'Score &amp; Status Page', title:'',url:'scorePage.htm',chapter:6,level:1 }
//IMPORTANT!!! the last item does NOT get a comma at the end.
); 	
	
var moduletype=8;

var docTitle=('MLearning SCORM-compatible HTML template');
var headerTitle=('MLearning SCORM-compatible HTML template');


var recommendedMsg = 'Recommended';
var requiredMsg = 'Must be completed to finish module';
var completedMsg   = 'Completed';

var IntArray = new Object();
IntArray['p01_000'] =  {id:'p01_000', tries:0, ascore:0, amax:1, req:1, msg:'', status:0, quiz:'469585915910'},
IntArray['p01_001'] =  {id:'p01_001', tries:0, ascore:0, amax:1, req:2, msg:'', status:0, quiz:'469585915910'},
IntArray['p03_001'] =  {id:'p03_001', tries:0, ascore:0, amax:1, req:1, msg:'', status:0, quiz:'409666286641'},
IntArray['p05_000'] =  {id:'p05_000', tries:0, ascore:0, amax:1, req:1, msg:'', status:0, quiz:'5679585915911'},
IntArray['p05_001'] =  {id:'p05_001', tries:0, ascore:0, amax:1, req:2, msg:'', status:0, quiz:'5679585915911'}


//IMPORTANT!!! the last item does NOT get a comma at the end.
); 

var docTitle=('MLearning SCORM-compatible HTML template');
var headerTitle=('MLearning SCORM-compatible HTML template');