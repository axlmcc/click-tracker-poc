function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var o=0;o<t.length;o++){var r=t[o];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function _createClass(e,t,o){return t&&_defineProperties(e.prototype,t),o&&_defineProperties(e,o),e}var Logger=function(){function a(e){_classCallCheck(this,a);var t=e||{},o=t.monitor_selector,r=void 0===o?".track-clicks":o,n=t.gather_list,i=void 0===n?["timestamp","platform","page_url","referrer","href","contents"]:n;this.monitor_selector=r,this.gather_list=i,this.addEventListeners()}return _createClass(a,[{key:"addEventListeners",value:function(){document.querySelectorAll(this.monitor_selector).forEach(function(t){t.addEventListener("click",function(e){e.preventDefault(),window.location.href=t.href})})}},{key:"print",value:function(){}}]),a}(),directions="\nOpen ~/.config/google-chrome/Local State in a text editor.\nSearch for protocol_handler.\nTo make Chrome ask you how to handle a specific protocol again, remove the line corresponding to that protocol in the list of excluded schemes.\nSave and exit.\nUpdate: protocol_handler has been moved to the file Preferences in the subdirectory Default. If you are using multiple profiles, the file is also located in the folders Profile 2, Profile 3 etc.\n";