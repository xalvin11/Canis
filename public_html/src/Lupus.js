var CANIS = (function (self) {
    
    self.debounce = function (fn, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) fn.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) fn.apply(context, args);
        };
    };
    
    self.poll = function (fn, timeout, interval) {
        var endTime = Number(new Date()) + (timeout || 2000);
        interval = interval || 100;

        var checkCondition = function(resolve, reject) {
            
            var result = fn();
            if(result) {
                resolve(result);
            } else if (Number(new Date()) < endTime) {
                setTimeout(checkCondition, interval, resolve, reject);
            } else {
                reject(new Error('timed out for ' + fn + ': ' + arguments));
            }
        };

        return new Promise(checkCondition);
    };
    
    self.once = function (fn, context) { 
        var result;

        return function() { 
            if(fn) {
                result = fn.apply(context || this, arguments);
                fn = null;
            }

            return result;
        };
    };
    
    self.getAbsoluteUrl = (function() {
        var a;

        return function(url) {
            if(!a) a = document.createElement('a');
            a.href = url;

            return a.href;
        };
    })();
    
    self.sheet = (function() {
        var style = document.createElement('style');
        style.type = 'text/css';
        

        style.appendChild(document.createTextNode(''));

        document.head.appendChild(style);

        return style.sheet;
    })();
    
    self.insertStyle = function (style) {
        self.sheet.insertRule(style, 0);
    };
    
    self.matchesSelector = function (el, selector) {
        var p = Element.prototype;
        var f = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || function(s) {
            return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
        };
        return f.call(el, selector);
    };
    
    self.serialize = function(data) {
        data = data || {};
        var str = [];
        for(var p in data)
            if (data.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(data[p]));
            }
        return str.join("&");
    };
    
    function handleResponse(response, type) {
        var value;
        switch (type) {
            case 'json':
                value = response.json();
                break;
            case 'xml':
                value = response.text();
                break;
            // Add more resposeType 
            default:
                value = response;
        }
        return value;
    }
    
    self.get = function (url, data, responseType) {
        return new Promise(function (resolve, reject) {
            fetch(url, {
                method: 'GET'
            }).then(function (response) {
                return handleResponse(response, responseType || 'json');
            }).then(function (e) {
                console.log('SDSDSD', e);
                resolve(e);
            }).catch(function (err) {
                console.log('ERROR', err);
                reject(Error("Network Error"));
            });
        });
    };
    
    self.post = function (url, data, responseType) {
        return new Promise(function (resolve, reject) {
            var req = new XMLHttpRequest();
            req.open('POST', url, true);
            req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            
            req.onreadystatechange = function () {
                if(req.readyState == 4) {
                    resolve(self.strTo(req.responseText, responseType || 'json'));
                }
            };
            
            req.onerror = function() {
                reject(Error("Network Error"));
            };
            
            req.send(self.serialize(data));
        });
    };
    
    self.put = function (url, data, responseType) {
        return new Promise(function (resolve, reject) {
            var req = new XMLHttpRequest();
            req.open('PUT', url, true);
            req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            
            req.onreadystatechange = function () {
                if(req.readyState == 4) {
                    resolve(self.strTo(req.responseText, responseType || 'json'));
                }
            };
            
            req.onerror = function() {
                reject(Error("Network Error"));
            };
            
            req.send(self.serialize(data));
        });
    };
    
    self.delete = function (url, data, responseType) {
        return new Promise(function(resolve, reject) {
            var req = new XMLHttpRequest();
            req.open('DELETE', url, true);
            req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            
            req.onreadystatechange = function () {
                if (req.readyState == 4) {
                    resolve(self.strTo(req.responseText, responseType || 'json'));
                }
            };
            
            req.onerror = function() {
                reject(Error("Network Error"));
            };
            
            req.send(self.serialize(data));
        });
    };
    
    self.strTo = function (str, type) {
        var value = str;
        switch (type) {
            case 'json':
                value = JSON.parse(str);
                break;
            case 'xml':
                value = self.parseXml(str);
                break;
            // Add more resposeType 
            default:
                value = str;
        }
        return value;
    };
    
    self.parseXml = function (str) {
        var parseXml;

        if (typeof window.DOMParser != "undefined") {
            parseXml = function(xmlStr) {
                return ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
            };
        } else if (typeof window.ActiveXObject != "undefined" &&
               new window.ActiveXObject("Microsoft.XMLDOM")) {
            parseXml = function(xmlStr) {
                var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = "false";
                xmlDoc.loadXML(xmlStr);
                return xmlDoc;
            };
        } else {
            throw new Error("No XML parser found");
        }
        
        return parseXml(str);
    };
    
    return self;
    
} (CANIS || {}));

