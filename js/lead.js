var leadModule = (function () {
	var config = {
		countryListApi : 'https://proptiger.com/data/v1/entity/country',
		enquirySubmitApi : 'http://qa.proptiger-ws.com/data/v1/entity/enquiry?lastEnquiryRequired=true',
		countriesList : [],
		leadForm : 'leadForm',
		successContainer: 'thankYou',
		callBackButton : 'callBackButton',
		overlay : 'overlay',
		leadFormContainer : 'lead-form-container',
		leadCookie : 'enquiry_info',
		registerBox : 'registerBox',
		isDummy : true
	}

    var setcookie = function(cname, cvalue) {
    	console.log(cname, cvalue);
        document.cookie = cname + "=" + cvalue + ";path=/";
    };

    var getCookie = function(key) {
	   var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
	   return keyValue ? keyValue[2] : null;
    };

    var defaultLeadFormData = function(){
    	var cookieData = getCookie(config.leadCookie);
    	var leadData = {};
		if(cookieData && cookieData.length){
		  	try {
		    	cookieData =  JSON.parse(cookieData);
		    	console.log(cookieData);
		  	} catch(e) {
		    	console.log("error while parsing cookie");
		  	}
		}
		leadData.name = ((cookieData && cookieData.name)?cookieData.name : "") ;
		leadData.email = ((cookieData && cookieData.email)?cookieData.email : "") ;
		leadData.phone = ((cookieData && cookieData.phone)?cookieData.phone : "");
		leadData.countryId = ((cookieData && cookieData.countryId)?cookieData.countryId : "");
		console.log(leadData);
		return leadData;
    }

	var _populateCountryList = function(){
		_ajaxRequest("GET", config.countryListApi, null, false, _setCountryList, _errorHandler);
    	var __countriesList,
    		leadForm,
    		select,
    		response;

		__countriesList = config.countriesList;
		leadForm = document.getElementById(config.leadForm);
        select = leadForm.querySelector('[data-type="lead_country"]');

        for (var key in __countriesList) {
            var opt = document.createElement('option');
            opt.value = __countriesList[key].countryId;
            opt.innerHTML = __countriesList[key].label;
            select.appendChild(opt);
        }

        if ("createEvent" in document) {
	        var evt = document.createEvent("HTMLEvents");
	        evt.initEvent("change", false, true);
	        select.dispatchEvent(evt);
	    }
	    else {
	        select.fireEvent("onchange");
	    }
	}

	var _errorHandler = function(){
	}

	var _sendDummyResponse = function(){
		var response = {
		    "statusCode": "2XX",
		    "version": "A",
		    "data": {
		        "status": "success",
		        "ppc": false,
		        "tracking": false,
		        "redirectUrl": "qa.proptiger-ws.com/",
		        "enquiryIds": [
		            1018081
		        ],
		        "userId": 1239563,
		        "isOtpVerified": false
		    }
		}
		return response;
	}

	var _ajaxRequest = function(type, url, data, isAsync , successCallback, errorCallback, isDummy){
		if(isDummy){
			successCallback(_sendDummyResponse());
			return;
		}
		isAsync = (typeof isAsync !== 'undefined') ? isAsync : true;
		var xmlHttp = new XMLHttpRequest();
	    xmlHttp.open( type, url, isAsync ); // false for synchronous request
		if(type === 'POST'){
			xmlHttp.setRequestHeader('Content-Type', "application/json");
		}
	    xmlHttp.send( data );
	    if(xmlHttp.responseText){
		    response = JSON.parse(xmlHttp.responseText);
		    successCallback(response);
	    } else {
	    	errorCallback();
	    }
	}

	var _setCountryList = function(response){
		var __countriesList;
		if(response && response.data){
			__countriesList = response.data;
		}
		config.countriesList = __countriesList;
	}

	var _getCountriesList = function(){
		return config.countriesList;
	}

	var _changePhoneCode =  function(){
		var countryCode,
			countryId,
			el,
			leadForm,
			countryiesList,
			found;

		leadForm = document.getElementById(config.leadForm);
        countryCode = leadForm.querySelector('[data-type="lead_country"]').value;
		countryCode = parseInt(countryCode,10);
        el =  leadForm.querySelector('[data-type="lead_phoneCode"]');
        countriesList = _getCountriesList();
        found = false;

		for (var key in countriesList){
			if( parseInt(countriesList[key].countryId,10) === countryCode){
                found = true;
                el.innerHTML = countriesList[key].countryCode;
             }
		}

        if(!found) {
            el.innerHTML = '';
        }
	}

	var _closeLeadForm = function(){
		document.querySelector('.' + config.registerBox).classList.remove('open');
	}

	var _openLeadForm = function(){
		console.log('opening lead form');
		var leadData,
			leadForm,
			elemName,
			elemEmail,
			elemPhone,
			elemCountry;
		document.querySelector('.registerBox .thankYou').classList.add('hide');
		document.querySelector('.' + config.registerBox).classList.add('open');
		var leadData = defaultLeadFormData();

		leadForm = document.getElementById(config.leadForm);
		leadForm.classList.remove('hide');
		elemName = leadForm.querySelector('[data-type="lead_name"]');
		elemEmail = leadForm.querySelector('[data-type="lead_email"]');
		elemPhone = leadForm.querySelector('[data-type="lead_phone"]');
		elemPhoneCode = leadForm.querySelector('[data-type="lead_phoneCode"]');
		elemCountry = leadForm.querySelector('[data-type="lead_country"]');
		if(leadData.name){
			_removeErrorMessage(elemName);
			elemName.value = leadData.name;
		}
		if(leadData.email){
			_removeErrorMessage(elemEmail);
			elemEmail.value = leadData.email;
		}
		if(leadData.phone){
			_removeErrorMessage(elemPhone);
			elemPhone.value = leadData.phone;
		}
		if(leadData.countryId){
			elemCountry.value = leadData.countryId;
			_changePhoneCode();
		}
	}

	var _bindUIActions = function () {
		//all event binding actions here
		var leadForm;
		leadForm = document.getElementById(config.leadForm);
		leadForm.querySelector('[data-type="lead_submit"]').addEventListener("click", _submitLeadForm);
        leadForm.querySelector('[data-type="lead_country"]').addEventListener("change", _changePhoneCode);
        leadForm.querySelector('[data-type="close_lead_btn"]').addEventListener("click", _closeLeadForm);
        document.querySelector('#' + config.callBackButton).addEventListener("click", _openLeadForm);
	}

	var _validateLeadData = function(){
		var name,
			email,
			phone,
			elemName,
			elemEmail,
			elemPhone,
			selectedCountry,
			country,
			countryId,
			leadForm,
			leadSuccess,
			noErrors;

		leadForm = document.getElementById(config.leadForm);
		elemName = leadForm.querySelector('[data-type="lead_name"]');
		elemEmail = leadForm.querySelector('[data-type="lead_email"]');
		elemPhone = leadForm.querySelector('[data-type="lead_phone"]');

		name = elemName.value;
        email = elemEmail.value;
        phone = elemPhone.value;
        countryId = leadForm.querySelector('[data-type="lead_country"]').value;
        selectedCountry = leadForm.querySelector('[data-type="lead_country"]');
        country = selectedCountry.options[selectedCountry.selectedIndex].text;

		leadSuccess = true;
		if(!_isName(name, elemName)){
			elemName.removeEventListener("keyup", _fadeOutError);
        	elemName.addEventListener("keyup", _fadeOutError);
	        leadSuccess = false;
		}
		if(!_isEmail(email, elemEmail)){
        	elemEmail.removeEventListener("keyup", _fadeOutError);
        	elemEmail.addEventListener("keyup", _fadeOutError);
	        leadSuccess = false;
		}
		if(!_validatePhone(phone,country,elemPhone)){
        	elemPhone.removeEventListener("keyup", _fadeOutError);
        	elemPhone.addEventListener("keyup", _fadeOutError);
	        leadSuccess = false;
		}
        
        if(leadSuccess){
        	var postData = {
        		name : name,
        		email : email,
        		phone : phone,
        		countryId : countryId,
				pageName: 'ARTHA_CAMPAIGN',
				pageUrl: window.location.href,
				applicationType: _getApplicationType(),
				jsonDump: window.navigator.userAgent
        	}
        	console.log(postData);
        	return postData;
        }
        return false;
	}

	var _getApplicationType = function(){
		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
			return 'Mobile Site';
		} else {
			return 'Desktop Site';
		}
	}

	var _submitLeadForm = function(){
		var postData = _validateLeadData();
		if(postData){
			console.log(postData);
			setcookie(config.leadCookie, JSON.stringify(postData));
			_ajaxRequest("POST", config.enquirySubmitApi, postData, true, _leadSubmitted, _errorHandler, config.isDummy);
		} else {
			console.log('invalid Data');
		}
	}

	var _showThankYouMsg = function(){
		document.getElementById(config.leadForm).classList.add('hide');
		document.querySelector('.registerBox .thankYou').classList.remove('hide');
		setTimeout(function(){
			_closeLeadForm();
		},2000);
	}

	var _leadSubmitted = function(data){
		console.log('Lead has been Submitted');
		// _closeLeadForm();
		_showThankYouMsg();
		console.log(data);
	}

	var _fadeOutError = function(){
		_removeErrorMessage(this);
	}

	var _removeErrorMessage = function(elem){
		var p = elem.parentElement;
		if(p.className.indexOf('has-error') > -1){
			p.classList.remove('has-error');
			p.removeChild(p.lastElementChild);
		}
	}

	var _addErrorMessage = function(elem, errMsg){
		var p = elem.parentElement;
		if(p.className.indexOf('has-error') > -1){
			var e = p.lastElementChild;
			e.innerHTML = errMsg;
		} else {
			p.classList.add('has-error');
			var e = document.createElement('div');
			e.className = 'errorMsg';
			e.innerHTML = errMsg;
			elem.parentElement.appendChild(e);
		}
		
	}

	var _isEmail = function(email, elemEmail) {
		_removeErrorMessage(elemEmail);
		if(!email){
			_addErrorMessage(elemEmail, 'Email is required');
        	return false;
        }
        var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (email && emailRegex.test(email.trim())) {
            return true;
        }
		_addErrorMessage(elemEmail, 'Email is invalid');
        return false;
    }

    var _isName = function(name, elemName) {
		_removeErrorMessage(elemName);
		if(!name){
			_addErrorMessage(elemName, 'Name is required');
        	return false;
        }
        var nameRegex = /[a-zA-Z ]+/; //  as we are already trimming
        if (name && nameRegex.test(name.trim())) {
            return true;
        }
		_addErrorMessage(elemName, 'Name is invalid');
        return false;
    }

	var _validatePhone = function(phno, ctry, elemPhone) {
		_removeErrorMessage(elemPhone);
		if(!phno){
			_addErrorMessage(elemPhone, 'Phone No. is required');
			return;
		}
        var phone_re = /^\+{0,1}[0-9- ]+$/;
        if (!phone_re.test(phno)) {
			_addErrorMessage(elemPhone, 'Phone No. is invalid');
            return false;
        }
        var prefix = phno[0];
        phno = phno.match(/[0-9]+?/g).join('');
        phno = phno.replace(/^[0]+/g, '');

        if (ctry.trim().toLowerCase() === 'india') {
            if (phno.substring(0, 2) === '91' && phno.length === 12) {
                return phno.substring(2, 12);
            } else if (phno.length == 10 && ['7', '8', '9'].indexOf(prefix) !== -1) {
                return phno;
            } else {
				_addErrorMessage(elemPhone, 'Phone No. is invalid');
                return false;
            }
        } else {
            if ((phno.length < 6 || phno.length > 15) && prefix == '+') {
				_addErrorMessage(elemPhone, 'Phone No. is invalid');
                return false;
            } else if (phno.length < 6 || ((phno.length > 12) && (prefix !== '+'))) {
				_addErrorMessage(elemPhone, 'Phone No. is invalid');
                return false;
            } else {
                var validPrefixes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                if (validPrefixes.indexOf(parseInt(prefix)) === -1) {
					_addErrorMessage(elemPhone, 'Phone No. is invalid');
                    return false;
                } else {
                    return phno;
                }
            }
        }
    }

	var init = function () {
		console.log('lead module initiated');
		  this.config =  config;
		_bindUIActions();
		_populateCountryList();
	}
	return {
		init : init
	};

})();