(() => {

  var myLogger = new Logger({
    monitor_selector: 'a[href*="tel"], a[href*="mailto"]',
    report_method: 'post',
    api_path: '/api/logger'
  });

  myLogger.addEventListeners();

})()

