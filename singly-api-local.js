var baseUrl = '';

var APIClient = function(config) {
  if(!config) config = {};
  config.host = config.host || 'singly.com';
  var apiHost = 'https://api.' + config.host + '/';
  var message = 'Please enter your API key from https://me.' + config.host + '/dashboard/settings#Settings-APIKey';
  var client = {};
  
  function promptForAPIKey() {
    if(window.location.protocol === 'file:' && baseUrl === '') {
      var apiKey = getApiKey();
      if(!apiKey) apiKey = setApiKey(prompt(message, ''));
      baseUrl = apiHost + apiKey;
    }
  }

  function setApiKey(apiKey) {
    // changed from sessionStorage; see http://stackoverflow.com/questions/4383494/error-using-sessionstorage
    localStorage.setItem("apiKey_" + config.host, apiKey);
    return apiKey;
  }

  function getApiKey() {
    // changed from sessionStorage (same as above)
    var apiKey = localStorage.getItem("apiKey_" + config.host);
    // things get converted to strings in some browsers, so check those, just to be safe
    if(apiKey == 'null') return null;
    if(apiKey == 'undefined') return undefined;
    return apiKey;
  }

  client.getJSON = function(path, params, callback, retry) {
    if(path.indexOf('/') !== 0) path = '/' + path;
    if(!callback && typeof params === 'function') {
      callback = params;
      params = {};
    }
    $.getJSON(baseUrl + path, params, function(data, success) {
      callback(data, success);
    });
  }
  
  promptForAPIKey();
  return client;
}