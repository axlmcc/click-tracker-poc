class Logger {
  constructor(options) {
    const {
      monitor_selector = '.track-clicks',
      print_target = '#console',
      report_method = 'print',
      axios_config = {
        baseURL: this.getBaseURL(),
        timeout: 1000
      },
      api_path = '/',
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
    this.print_target = print_target;
    this.report_method = report_method;
    this.axios_config = axios_config;
    this.api_path = api_path;
    this.gather_list = gather_list;
  }
  addEventListeners() {
    let watchList = document.querySelectorAll(this.monitor_selector);
    watchList.forEach(element => {
      element.addEventListener('click', event => {
        this.handleClick(event, element);
      });
      element.addEventListener('auxclick', event => {
        this.handleClick(event, element);
      })
    });
  }
  handleClick(event, element) {
    event.preventDefault();
    // this.log_data(element, this.gather_list);
    let click_data = this.getData(element);

    if (this.report_method === 'print') {
      this.print(click_data);
    } else if (this.report_method === 'post') {
      this.postData(click_data);
    }

    if (event.which === 2) {
      let win = window.open(element.href, '_blank');
      win.focus();
    } else {
      window.location.href = element.href;
    }
  }
  getData(element) {
    const data = this.gather_list.map((gatherable) => {
      switch (gatherable) {
        case 'timestamp':
          let timestring = new Date();
          return timestring.toUTCString();
        case 'platform':
          return platform.description;
        case 'page_url':
          return window.location.href;
        case 'referrer':
          return (document.referrer) ? document.referrer : 'Referrer Unavailable';
        case 'href':
          return element.hasAttribute('href') ? element.getAttribute('href') : 'Href Unavailable';
        case 'contents':
          return element.innerText;
        default:
          return "";
      }
    });
    const data_package = _.zipObject(this.gather_list, data);
    return data_package;
  }
  getBaseURL() {
    var loc = window.location;
    return `${loc.protocol}//${loc.hostname}${loc.port ? ':' + loc.port : ''}/`;
  }
  print(data) {
    let dom_console = document.querySelector(this.print_target);
    dom_console.innerHTML = JSON.stringify(data, null, 2);
    Prism.highlightElement(dom_console);
  }
  postData(data) {
    var instance = axios.create(this.axios_config);
    instance.post(this.api_path, data);
  }
}