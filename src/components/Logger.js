class Logger {
  constructor(options) {
    const {
      monitor_selector = '.track-clicks',
      gather_list = [
        'timestamp',
        'platform',
        'page_url',
        'referrer',
        'href',
        'contents'
      ]
    } = options || {};
    this.monitor_selector = monitor_selector;
    this.gather_list = gather_list;
    this.addEventListeners();
  }
  addEventListeners() {
    let watchList = document.querySelectorAll(this.monitor_selector);
    watchList.forEach(element => {
      element.addEventListener('click', event => {
        event.preventDefault();
        // this.log_data(element, this.gather_list);
        window.location.href = element.href;
      });
    });
  }
  print() {

  }
}