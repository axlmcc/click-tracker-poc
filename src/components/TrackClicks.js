(() => {

  var myLogger = new Logger({
    monitor_selector: 'a[href*="tel"], a[href*="mailto"]'
  });

  myLogger.addEventListeners();

})()

