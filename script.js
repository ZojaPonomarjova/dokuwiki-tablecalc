/*var tablecalc_table;
var tablecalc_crow;
var tablecalc_ccol;
var tablecalc_labels;
var tablecalc_defer;*/

function tablecalcXY(st) {
	var r=st.match(/r\d+/);
	y=r[0].substr(1)*1;
	var c=st.match(/c\d+/);
	x=c[0].substr(1)*1;
	return new Array(x,y);
}
function tablecalcVal(x,y,table,tostring) {
	if (typeof tostring == 'undefined') {
		tostring=0;
	}
	var v='notset';
	if ((x>=0) && (y>=0)) {
		if (typeof table.rows != 'undefined') {
			if (typeof table.rows[y] != 'undefined') {
				if (typeof table.rows[y].cells[x] != 'undefined') {
					var mr=stripHTML(table.rows[y].cells[x].innerHTML);
					mr=mr.trim();
					m=parseFloat(mr);
					if (!isNaN(m)) {
						v=m;
					} else {
						if (!tostring) {
							v="notnum";
						} else {
							v=String(mr);
						}
					}
				}
			}
		}
	}
	return v;
}


function tablecalcToArray(a) {
	if (!Array.isArray(a)) {
		return [a];
	} else {
		return a;
	}
}

function tablecalcToNumArray(a) {
	if (!Array.isArray(a)) {
		a=[a];
	}
	var b=[];
	for (var i=0;i<a.length;i++) {
		if (!isNaN(a[i]*1)) {
			b.push(a[i]);
		}
	}
	return b;
}

function correctFloat(a) {
	var x=10000000000000;
	return Math.round(a*x)/x;
}

function sum(a) {
	a=tablecalcToNumArray(a);
	var s=0;
	for (var i=0;i<a.length;i++) {
		tablecalc_log(a[i]*1);
		s+=a[i]*1;
		s=correctFloat(s);
	}
	return s;
}

function average(a) {
	a=tablecalcToNumArray(a);
	return correctFloat(sum(a)/a.length);
}

function min(a) {
	a=tablecalcToNumArray(a);
	var s=1*a[0];
	for (var i=1;i<a.length;i++) {
		if (1*a[i]<s) {
			s=1*a[i];
		}
	}
	return s;
}


function max(a) {
	a=tablecalcToNumArray(a);
	var s=1*a[0];
	for (var i=1;i<a.length;i++) {
		if (1*a[i]>s) {
			s=1*a[i];
		}
	}
	return s;
}

function label(st) {
	if (typeof tablecalc_labels[st] == 'undefined') {
		tablecalc_labels[st]=tablecalc_table;
	}
	return "";
}

function col() {
	return tablecalc_ccol;
}

function row() {
	return tablecalc_crow;
}

function cell(x,y) {
	var tmp=tablecalcVal(x,y,tablecalc_table);
	if ( (tmp=='notset') || (tmp=='notnum')) {
		return '';
	} else {
		return tmp;
	}
}

function range(x1,y1,x2,y2) {
	var members=new Array();
	for (var x=x1;x<=x2;x++) {
		for (var y=y1;y<=y2;y++) {
			var tmp=cell(x,y);
			if (tmp!='') {
				members[members.length]=tmp;
			}
		}
	}
	var result="";
	if (members.length>0) {
		result="new Array(";
		for (var k=0;k<members.length;k++) {
			if (k) {
				result+=',';
			}
			result+="'"+members[k]+"'";
		}
		result+=")"
	} else if (!tablecalc_checkfinal())  {
		throw "norange";
	}
	return eval(result);	
}

function count(a) {
	a=tablecalcToArray(a);
	return a.length;
}

function calc() {
	return nop();
}

function round(num,digits) {
	var d=1;
	for (var i=0;i<digits;i++) {
		d*=10;
	}
	var n=Math.round(num*d)/d;
	return n.toFixed(digits);
}


function nop() {
	return "";
}

function check(condition,whenTrue,whenFalse) {
	if (typeof condition == 'undefined') {
		condition=0;
	}
	if (typeof whenTrue == 'undefined') {
		whenTrue="";
	}
	if (typeof whenFalse == 'undefined') {
		whenFalse="";
	}
	if (condition) {
		return whenTrue;
	} else {
		return whenFalse;
	}
}

function countif(range,check,operation) {
	a=tablecalcToArray(range);
	var cnt=0;
	for (var i=0;i<a.length;i++) {
		cnt+=compare(a[i],check,operation);
	}
	return cnt;
}

function compare(a,b,operation) {
	if (typeof operation == 'undefined') {
		operation='=';
	}
	if (typeof a == 'undefined') {
		a=0;
	}
	if (typeof b == 'undefined') {
		b=0;
	}
	switch (operation) {
		case ">":
			if (a>b) {return 1;} else {return 0;}
			break;
		case "<":
			if (a<b) {return 1;} else {return 0;}
			break;
		case ">=":
			if (a>=b) {return 1;} else {return 0;}
			break;
		case "<=":
			if (a>=b) {return 1;} else {return 0;}
			break;
		case "<>":
		case "!=":
			if (a!=b) {return 1;} else {return 0;}
			break;
		case "=":
		default:
			if (a==b) {return 1;} else {return 0;}
	}
	return 0;
}

function tablecalc_log(st) {
	if (!tablecalc_debug) {return;}
	if (tablecalc_debug==1) {
		alert(st);
	} else {
		console.log(st);
	}
}

function tablecalc_checkfinal() {
	if (typeof tablecalc_isfinal === "undefined") {
		return 0;
	} else {
		return tablecalc_isfinal;
	}
}

function tablecalc(divID, formula, final) {

	if (isNaN(final)) {final=0;}

	if (typeof tablecalc_debug === "undefined") {
    	window.tablecalc_debug=0;
	}
	if (typeof tablecalc_labels === "undefined") {
    	window.tablecalc_labels=[];
	}
	if (typeof tablecalc_defer === "undefined") {
		window.tablecalc_defer=[];
	}
	if (typeof tablecalc_crow === "undefined") {
		window.tablecalc_crow=null;
	}
	if (typeof tablecalc_ccol === "undefined") {
		window.tablecalc_ccol=null;
	}
	if (typeof tablecalc_table === "undefined") {
		window.tablecalc_table=null;
	}
	if (typeof tablecalc_isfinal === "undefined") {
		window.tablecalc_isfinal=final;
	}
	if (typeof tablecalc_setfinal === "undefined") {
	    	window.tablecalc_setfinal=1;
		setTimeout(tablecalc_final,0)
	}

	var oFormula=formula;

	tablecalc_log("Entering: "+divID+"=>"+formula+"; is final: "+final);
	var div = document.getElementById(divID);
	//getting parent TD
	var table=0;
	var cCol=0;
	var cRow=0;
	var pNode=findParentNodeByName(div,"TD");
	if (!pNode) {
		pNode=findParentNodeByName(div,"TH");
	}
	if (pNode) {
		cCol = pNode.cellIndex;
		pNode=findParentNodeByName(pNode,"TR");
		if (pNode) {
			cRow = pNode.rowIndex;
			table=findParentNodeByName(pNode,"TABLE");
		}
	}
	tablecalc_crow=cRow;
	tablecalc_ccol=cCol;
	tablecalc_table=table;

	var matchA=formula.match(/([a-z0-9_]+\.)?(r|c)\d+(r|c)\d+(\:(r|c)\d+(r|c)\d+)?(\,([a-z0-9]+\.)?(r|c)\d+(r|c)\d+(\:(r|c)\d+(r|c)\d+)?){0,99}/g);
	if (matchA != null) {
		for (var i = 0; i<matchA.length; i++) {
			var members=new Array();

			var matchL=matchA[i].split(',');
			for (var j=0;j<matchL.length;j++) {
				var tmp_table=table;
				var matchB=matchL[j].split('.',2);
				if (matchB.length<2) {
					matchB[1]=matchB[0];
				} else {
					if (typeof tablecalc_labels[matchB[0]] != 'undefined') {
						tmp_table=tablecalc_labels[matchB[0]];
					} else {
						if (final) {
							tmp_table="notable";
						} else {
							tablecalcAddDefer(divID,oFormula);
							//tablecalcProcessDefer();
							return false;
						}
					}
				}
				if (tmp_table!="notable") {
					var matchC=matchB[1].split(':',2);
					if (matchC.length<2) {
						matchC[1]=matchC[0];
					}
					from=tablecalcXY(matchC[0]);
					to=tablecalcXY(matchC[1]);
					if (from[0]>to[0]) {
						var tmp=to[0];
						to[0]=from[0];
						from[0]=tmp;
					}
					if (from[1]>to[1]) {
						var tmp=to[1];
						to[1]=from[1];
						from[1]=tmp;
					}			
					for (var fx=from[0];fx<=to[0];fx++) {
						for (var fy=from[1];fy<=to[1];fy++) {
							if ((fx==cCol) && (fy==cRow) && (tmp_table==table)) {continue;}
							var tmp=tablecalcVal(fx,fy,tmp_table);
							tablecalc_log("member["+fx+","+fy+"]="+tmp);					
							if ( (tmp == 'notnum') || (tmp == 'notset') ) {
								tablecalcAddDefer(divID,oFormula);
								if (!final) {
									//tablecalcProcessDefer();
									return false;
								} else {
									members[members.length]=tablecalcVal(fx,fy,tmp_table,1);
								}					
							} else {/*if (tmp!='notset') {*/
								members[members.length]=tmp;
							}
						}
					}
				} else {
					tablecalc_log("table not found by label: "+matchB[0]);
				}
			}
			var result="";
			if (members.length>0) {
				if (members.length==1) {
					var tmp=parseFloat(members[0]);
					if (isNaN(tmp)) {
						result="'"+members[0]+"'";
					} else {
						result=members[0]*1;
					}
				} else {
					result="new Array(";
					for (var k=0;k<members.length;k++) {
						if (k) {
							result+=',';
						}
						result+="'"+members[k]+"'";
					}
					result+=")"
				}
			}
			formula=formula.replace(matchA[i],result);
		}
	}
	
	formula=formula.replace(/;/g,",");	
	tablecalc_log("Evaluating: "+formula);
	var rc;
	try {
		eval('calcresult = '+formula);
		//if (!isNaN(calcresult)) {
		tablecalc_log("Got result: "+calcresult+" ("+(typeof calcresult)+")");
		if ((typeof calcresult === "number") && (isNaN(calcresult))) {
			tablecalcAddDefer(divID,oFormula);
			rc=false;
		} else {
			div.innerHTML=calcresult;
			rc=true;
		}
	} catch (e) {
		rc=false;
		tablecalc_log("Exception: "+e);
		tablecalcAddDefer(divID,oFormula);
	}
	if (!final) {
		tablecalcProcessDefer();
	}
	return rc;
}

function tablecalcAddDefer(divID,formula) {
	if (typeof tablecalc_defer[divID] == 'undefined') {
		tablecalc_defer[divID]=formula;
		tablecalc_log("Added defer: "+divID+"=>"+tablecalc_defer[divID]);		
	}
}

function tablecalcProcessDefer() {
	var exit;
	var steps=0;
	do {
		steps++;
		exit=1;
		for (var divID in tablecalc_defer) {
			if (tablecalc_defer[divID].length) {
				tablecalc_log("calling defer: "+divID+"=>"+tablecalc_defer[divID]);
				var tmp=tablecalc_defer[divID];
				tablecalc_defer[divID]="";
				if (!tablecalc(divID,tmp,0)) {
					tablecalc_defer[divID]=tmp;
				} else {
					exit=0;
				}
			}
		}
	} while ( (!exit) && (steps<99) );
	if (steps>=99) {
		tablecalc_log("max steps reached!");
	}
}

function tablecalc_final() {
	tablecalc_log("entering final");
	tablecalc_isfinal=1;
	tablecalcProcessDefer();
	for (var divID in tablecalc_defer) {
		if (tablecalc_defer[divID].length) {
			tablecalc_log("calling final defer: "+divID+"=>"+tablecalc_defer[divID]);
			if (tablecalc(divID,tablecalc_defer[divID],1,99)) {
				tablecalc_defer[divID]="";
			}
		}
	}
}

function findParentNodeByName(pNode,st) {
	while ( ( pNode.nodeName!=st ) && (pNode.parentNode != null) ) {
		pNode=pNode.parentNode;
	}
	if (pNode.nodeName!=st) {
		pNode=0;
	}
	return pNode;
}


function stripHTML(oldString) {
	return oldString.replace(/<[^>]*>/g, "");
}
