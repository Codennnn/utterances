// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"deparam.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deparam = deparam;
exports.param = param;

function deparam(query) {
  var match;
  var plus = /\+/g;
  var search = /([^&=]+)=?([^&]*)/g;

  var decode = function decode(s) {
    return decodeURIComponent(s.replace(plus, ' '));
  };

  var params = {};

  while (match = search.exec(query)) {
    params[decode(match[1])] = decode(match[2]);
  }

  return params;
}

function param(obj) {
  var parts = [];

  for (var name in obj) {
    if (obj.hasOwnProperty(name)) {
      parts.push(encodeURIComponent(name) + "=" + encodeURIComponent(obj[name]));
    }
  }

  return parts.join('&');
}
},{}],"repo-regex.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = /^([\w-_]+)\/([\w-_.]+)$/i;
exports.default = _default;
},{}],"page-attributes.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pageAttributes = void 0;

var _deparam = require("./deparam");

var _repoRegex = _interopRequireDefault(require("./repo-regex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function readPageAttributes() {
  var params = (0, _deparam.deparam)(location.search.substr(1));
  var issueTerm = null;
  var issueNumber = null;

  if ('issue-term' in params) {
    issueTerm = params['issue-term'];

    if (issueTerm !== undefined) {
      if (issueTerm === '') {
        throw new Error('When issue-term is specified, it cannot be blank.');
      }

      if (['title', 'url', 'pathname', 'og:title'].indexOf(issueTerm) !== -1) {
        if (!params[issueTerm]) {
          throw new Error("Unable to find \"" + issueTerm + "\" metadata.");
        }

        issueTerm = params[issueTerm];
      }
    }
  } else if ('issue-number' in params) {
    issueNumber = +params['issue-number'];

    if (issueNumber.toString(10) !== params['issue-number']) {
      throw new Error("issue-number is invalid. \"" + params['issue-number']);
    }
  } else {
    throw new Error('"issue-term" or "issue-number" must be specified.');
  }

  if (!('repo' in params)) {
    throw new Error('"repo" is required.');
  }

  if (!('origin' in params)) {
    throw new Error('"origin" is required.');
  }

  var matches = _repoRegex.default.exec(params.repo);

  if (matches === null) {
    throw new Error("Invalid repo: \"" + params.repo + "\"");
  }

  return {
    owner: matches[1],
    repo: matches[2],
    issueTerm: issueTerm,
    issueNumber: issueNumber,
    origin: params.origin,
    url: params.url,
    title: params.title,
    description: params.description,
    theme: params.theme || 'github-light'
  };
}

var pageAttributes = readPageAttributes();
exports.pageAttributes = pageAttributes;
},{"./deparam":"deparam.ts","./repo-regex":"repo-regex.ts"}],"utterances-api.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UTTERANCES_API = void 0;
var UTTERANCES_API = 'https://api.utteranc.es';
exports.UTTERANCES_API = UTTERANCES_API;
},{}],"oauth.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.login = login;
exports.token = void 0;

var _utterancesApi = require("./utterances-api");

var _deparam = require("./deparam");

var authorizeUrl = _utterancesApi.UTTERANCES_API + "/authorize";
var tokenUrl = _utterancesApi.UTTERANCES_API + "/token";
var redirect_uri = location.origin + "/authorized.html";

var Token = function () {
  function Token() {
    this.storageKey = 'OAUTH_TOKEN2';
    this.token = null;

    try {
      this.token = localStorage.getItem(this.storageKey);
    } catch (e) {}
  }

  Object.defineProperty(Token.prototype, "value", {
    get: function get() {
      return this.token;
    },
    set: function set(newValue) {
      this.token = newValue;

      try {
        if (newValue === null) {
          localStorage.removeItem(this.storageKey);
        } else {
          localStorage.setItem(this.storageKey, newValue);
        }
      } catch (e) {}
    },
    enumerable: true,
    configurable: true
  });
  return Token;
}();

var token = new Token();
exports.token = token;

function login() {
  window.open(authorizeUrl + "?" + (0, _deparam.param)({
    redirect_uri: redirect_uri
  }));
  return new Promise(function (resolve) {
    return window.notifyAuthorized = resolve;
  }).then(function (search) {
    return fetch(tokenUrl + search, {
      mode: 'cors'
    });
  }).then(function (response) {
    if (response.ok) {
      return response.json();
    }

    return response.text().then(function (text) {
      return Promise.reject("Error retrieving token:\n" + text);
    });
  }).then(function (t) {
    token.value = t;
  }, function (reason) {
    token.value = null;
    throw reason;
  });
}
},{"./utterances-api":"utterances-api.ts","./deparam":"deparam.ts"}],"encoding.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodeBase64UTF8 = decodeBase64UTF8;

function decodeBase64UTF8(encoded) {
  encoded = encoded.replace(/\s/g, '');
  return decodeURIComponent(escape(atob(encoded)));
}
},{}],"github.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setRepoContext = setRepoContext;
exports.loadJsonFile = loadJsonFile;
exports.loadIssueByTerm = loadIssueByTerm;
exports.loadIssueByNumber = loadIssueByNumber;
exports.loadCommentsPage = loadCommentsPage;
exports.loadUser = loadUser;
exports.createIssue = createIssue;
exports.postComment = postComment;
exports.renderMarkdown = renderMarkdown;

var _oauth = require("./oauth");

var _encoding = require("./encoding");

var _utterancesApi = require("./utterances-api");

var GITHUB_API = 'https://api.github.com/';
var GITHUB_ENCODING__HTML_JSON = 'application/vnd.github.VERSION.html+json';
var GITHUB_ENCODING__HTML = 'application/vnd.github.VERSION.html';
var GITHUB_ENCODING__REACTIONS_PREVIEW = 'application/vnd.github.squirrel-girl-preview';
var PAGE_SIZE = 100;
var owner;
var repo;
var branch = 'master';

function setRepoContext(context) {
  owner = context.owner;
  repo = context.repo;
}

function githubRequest(relativeUrl, init) {
  init = init || {};
  init.mode = 'cors';
  init.cache = 'no-cache';
  var request = new Request(GITHUB_API + relativeUrl, init);
  request.headers.set('Accept', GITHUB_ENCODING__REACTIONS_PREVIEW);

  if (!/^search\//.test(relativeUrl) && _oauth.token.value !== null) {
    request.headers.set('Authorization', "token " + _oauth.token.value);
  }

  return request;
}

var rateLimit = {
  standard: {
    limit: Number.MAX_VALUE,
    remaining: Number.MAX_VALUE,
    reset: 0
  },
  search: {
    limit: Number.MAX_VALUE,
    remaining: Number.MAX_VALUE,
    reset: 0
  }
};

function processRateLimit(response) {
  var limit = response.headers.get('X-RateLimit-Limit');
  var remaining = response.headers.get('X-RateLimit-Remaining');
  var reset = response.headers.get('X-RateLimit-Reset');
  var isSearch = /\/search\//.test(response.url);
  var rate = isSearch ? rateLimit.search : rateLimit.standard;
  rate.limit = +limit;
  rate.remaining = +remaining;
  rate.reset = +reset;

  if (response.status === 403 && rate.remaining === 0) {
    var resetDate = new Date(0);
    resetDate.setUTCSeconds(rate.reset);
    var mins = Math.round((resetDate.getTime() - new Date().getTime()) / 1000 / 60);
    var apiType = isSearch ? 'search API' : 'non-search APIs';
    console.warn("Rate limit exceeded for " + apiType + ". Resets in " + mins + " minute" + (mins === 1 ? '' : 's') + ".");
  }
}

function readRelNext(response) {
  var link = response.headers.get('link');

  if (link === null) {
    return 0;
  }

  var match = /\?page=([2-9][0-9]*)>; rel="next"/.exec(link);

  if (match === null) {
    return 0;
  }

  return +match[1];
}

function githubFetch(request) {
  return fetch(request).then(function (response) {
    if (response.status === 401) {
      _oauth.token.value = null;
    }

    if (response.status === 403) {
      response.json().then(function (data) {
        if (data.message === 'Resource not accessible by integration') {
          window.dispatchEvent(new CustomEvent('not-installed'));
        }
      });
    }

    processRateLimit(response);

    if (request.method === 'GET' && [401, 403].indexOf(response.status) !== -1 && request.headers.has('Authorization')) {
      request.headers.delete('Authorization');
      return githubFetch(request);
    }

    return response;
  });
}

function loadJsonFile(path, html) {
  if (html === void 0) {
    html = false;
  }

  var request = githubRequest("repos/" + owner + "/" + repo + "/contents/" + path + "?ref=" + branch);

  if (html) {
    request.headers.set('accept', GITHUB_ENCODING__HTML);
  }

  return githubFetch(request).then(function (response) {
    if (response.status === 404) {
      throw new Error("Repo \"" + owner + "/" + repo + "\" does not have a file named \"" + path + "\" in the \"" + branch + "\" branch.");
    }

    if (!response.ok) {
      throw new Error("Error fetching " + path + ".");
    }

    return html ? response.text() : response.json();
  }).then(function (file) {
    if (html) {
      return file;
    }

    var content = file.content;
    var decoded = (0, _encoding.decodeBase64UTF8)(content);
    return JSON.parse(decoded);
  });
}

function loadIssueByTerm(term) {
  var q = "\"" + term + "\" type:issue in:title repo:" + owner + "/" + repo;
  var request = githubRequest("search/issues?q=" + encodeURIComponent(q) + "&sort=created&order=asc");
  return githubFetch(request).then(function (response) {
    if (!response.ok) {
      throw new Error('Error fetching issue via search.');
    }

    return response.json();
  }).then(function (results) {
    if (results.total_count === 0) {
      return null;
    }

    if (results.total_count > 1) {
      console.warn("Multiple issues match \"" + q + "\". Using earliest created.");
    }

    return results.items[0];
  });
}

function loadIssueByNumber(issueNumber) {
  var request = githubRequest("repos/" + owner + "/" + repo + "/issues/" + issueNumber);
  return githubFetch(request).then(function (response) {
    if (!response.ok) {
      throw new Error('Error fetching issue via issue number.');
    }

    return response.json();
  });
}

function commentsRequest(issueNumber, page) {
  var url = "repos/" + owner + "/" + repo + "/issues/" + issueNumber + "/comments?page=" + page + "&per_page=" + PAGE_SIZE;
  var request = githubRequest(url);
  var accept = GITHUB_ENCODING__HTML_JSON + "," + GITHUB_ENCODING__REACTIONS_PREVIEW;
  request.headers.set('Accept', accept);
  return request;
}

function loadCommentsPage(issueNumber, page) {
  var request = commentsRequest(issueNumber, page);
  return githubFetch(request).then(function (response) {
    if (!response.ok) {
      throw new Error('Error fetching comments.');
    }

    var nextPage = readRelNext(response);
    return response.json().then(function (items) {
      return {
        items: items,
        nextPage: nextPage
      };
    });
  });
}

function loadUser() {
  if (_oauth.token.value === null) {
    return Promise.resolve(null);
  }

  return githubFetch(githubRequest('user')).then(function (response) {
    if (response.ok) {
      return response.json();
    }

    return null;
  });
}

function createIssue(issueTerm, documentUrl, title, description) {
  var request = new Request(_utterancesApi.UTTERANCES_API + "/repos/" + owner + "/" + repo + "/issues", {
    method: 'POST',
    body: JSON.stringify({
      title: issueTerm,
      body: "# " + title + "\n\n" + description + "\n\n[" + documentUrl + "](" + documentUrl + ")"
    })
  });
  request.headers.set('Accept', GITHUB_ENCODING__REACTIONS_PREVIEW);
  request.headers.set('Authorization', "token " + _oauth.token.value);
  return fetch(request).then(function (response) {
    if (!response.ok) {
      throw new Error('Error creating comments container issue');
    }

    return response.json();
  });
}

function postComment(issueNumber, markdown) {
  var url = "repos/" + owner + "/" + repo + "/issues/" + issueNumber + "/comments";
  var body = JSON.stringify({
    body: markdown
  });
  var request = githubRequest(url, {
    method: 'POST',
    body: body
  });
  var accept = GITHUB_ENCODING__HTML_JSON + "," + GITHUB_ENCODING__REACTIONS_PREVIEW;
  request.headers.set('Accept', accept);
  return githubFetch(request).then(function (response) {
    if (!response.ok) {
      throw new Error('Error posting comment.');
    }

    return response.json();
  });
}

function renderMarkdown(text) {
  var body = JSON.stringify({
    text: text,
    mode: 'gfm',
    context: owner + "/" + repo
  });
  return githubFetch(githubRequest('markdown', {
    method: 'POST',
    body: body
  })).then(function (response) {
    return response.text();
  });
}
},{"./oauth":"oauth.ts","./encoding":"encoding.ts","./utterances-api":"utterances-api.ts"}],"time-ago.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timeAgo = timeAgo;
var thresholds = [1000, 'second', 1000 * 60, 'minute', 1000 * 60 * 60, 'hour', 1000 * 60 * 60 * 24, 'day', 1000 * 60 * 60 * 24 * 7, 'week', 1000 * 60 * 60 * 24 * 27, 'month'];
var formatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
};

function timeAgo(current, value) {
  var elapsed = current - value.getTime();

  if (elapsed < 5000) {
    return 'just now';
  }

  var i = 0;

  while (i + 2 < thresholds.length && elapsed * 1.1 > thresholds[i + 2]) {
    i += 2;
  }

  var divisor = thresholds[i];
  var text = thresholds[i + 1];
  var units = Math.round(elapsed / divisor);

  if (units > 3 && i === thresholds.length - 2) {
    return "on " + value.toLocaleDateString(undefined, formatOptions);
  }

  return units === 1 ? (text === 'hour' ? 'an' : 'a') + " " + text + " ago" : units + " " + text + "s ago";
}
},{}],"measure.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startMeasuring = startMeasuring;
exports.scheduleMeasure = scheduleMeasure;
var hostOrigin;

function startMeasuring(origin) {
  hostOrigin = origin;
  addEventListener('resize', scheduleMeasure);
  addEventListener('load', scheduleMeasure);
}

var lastHeight = -1;

function measure() {
  var height = document.body.scrollHeight;

  if (height === lastHeight) {
    return;
  }

  lastHeight = height;
  var message = {
    type: 'resize',
    height: height
  };
  parent.postMessage(message, hostOrigin);
}

var lastMeasure = 0;

function scheduleMeasure() {
  var now = Date.now();

  if (now - lastMeasure > 50) {
    lastMeasure = now;
    setTimeout(measure, 50);
  }
}
},{}],"comment-component.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processRenderedMarkdown = processRenderedMarkdown;
exports.CommentComponent = void 0;

var _timeAgo = require("./time-ago");

var _measure = require("./measure");

var avatarArgs = '?v=3&s=88';
var displayAssociations = {
  COLLABORATOR: 'Collaborator',
  CONTRIBUTOR: 'Contributor',
  MEMBER: 'Member',
  OWNER: 'Owner'
};

var CommentComponent = function () {
  function CommentComponent(comment, currentUser) {
    this.comment = comment;
    this.currentUser = currentUser;
    var user = comment.user,
        html_url = comment.html_url,
        created_at = comment.created_at,
        body_html = comment.body_html,
        author_association = comment.author_association;
    this.element = document.createElement('article');
    this.element.classList.add('timeline-comment');

    if (user.login === currentUser) {
      this.element.classList.add('current-user');
    }

    var association = displayAssociations[author_association];
    this.element.innerHTML = "\n      <a class=\"avatar\" href=\"" + user.html_url + "\" target=\"_blank\" tabindex=\"-1\">\n        <img alt=\"@" + user.login + "\" height=\"44\" width=\"44\"\n              src=\"" + user.avatar_url + avatarArgs + "\">\n      </a>\n      <div class=\"comment\">\n        <header class=\"comment-header\">\n          <span class=\"comment-meta\">\n            <a class=\"text-link\" href=\"" + user.html_url + "\" target=\"_blank\"><strong>" + user.login + "</strong></a>\n            commented\n            <a class=\"text-link\" href=\"" + html_url + "\" target=\"_blank\">" + (0, _timeAgo.timeAgo)(Date.now(), new Date(created_at)) + "</a>\n          </span>\n          " + (association ? "<span class=\"author-association-badge\">" + association + "</span>" : '') + "\n        </header>\n        <div class=\"markdown-body markdown-body-scrollable\">\n          " + body_html + "\n        </div>\n      </div>";
    var markdownBody = this.element.lastElementChild.lastElementChild;
    var emailToggle = markdownBody.querySelector('.email-hidden-toggle a');

    if (emailToggle) {
      var emailReply_1 = markdownBody.querySelector('.email-hidden-reply');

      emailToggle.onclick = function (event) {
        event.preventDefault();
        emailReply_1.classList.toggle('expanded');
      };
    }

    processRenderedMarkdown(markdownBody);
  }

  CommentComponent.prototype.setCurrentUser = function (currentUser) {
    if (this.currentUser === currentUser) {
      return;
    }

    this.currentUser = currentUser;

    if (this.comment.user.login === this.currentUser) {
      this.element.classList.add('current-user');
    } else {
      this.element.classList.remove('current-user');
    }
  };

  return CommentComponent;
}();

exports.CommentComponent = CommentComponent;

function processRenderedMarkdown(markdownBody) {
  Array.from(markdownBody.querySelectorAll(':not(.email-hidden-toggle) > a')).forEach(function (a) {
    a.target = '_top';
    a.rel = 'noopener noreferrer';
  });
  Array.from(markdownBody.querySelectorAll('img')).forEach(function (img) {
    return img.onload = _measure.scheduleMeasure;
  });
  Array.from(markdownBody.querySelectorAll('a.commit-tease-sha')).forEach(function (a) {
    return a.href = 'https://github.com' + a.pathname;
  });
}
},{"./time-ago":"time-ago.ts","./measure":"measure.ts"}],"timeline-component.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimelineComponent = void 0;

var _commentComponent = require("./comment-component");

var _measure = require("./measure");

var TimelineComponent = function () {
  function TimelineComponent(user, issue) {
    this.user = user;
    this.issue = issue;
    this.timeline = [];
    this.count = 0;
    this.element = document.createElement('main');
    this.element.classList.add('timeline');
    this.element.innerHTML = "\n      <h1 class=\"timeline-header\">\n        <a class=\"text-link\" target=\"_blank\"></a>\n        <em>\n          - powered by\n          <a class=\"text-link\" href=\"https://utteranc.es\" target=\"_blank\">utteranc.es</a>\n        </em>\n      </h1>";
    this.countAnchor = this.element.firstElementChild.firstElementChild;
    this.marker = document.createComment('marker');
    this.element.appendChild(this.marker);
    this.setIssue(this.issue);
    this.renderCount();
  }

  TimelineComponent.prototype.setUser = function (user) {
    this.user = user;
    var login = user ? user.login : null;

    for (var i = 0; i < this.timeline.length; i++) {
      this.timeline[i].setCurrentUser(login);
    }

    (0, _measure.scheduleMeasure)();
  };

  TimelineComponent.prototype.setIssue = function (issue) {
    this.issue = issue;

    if (issue) {
      this.countAnchor.href = issue.html_url;
    } else {
      this.countAnchor.removeAttribute('href');
    }
  };

  TimelineComponent.prototype.appendComment = function (comment) {
    var component = new _commentComponent.CommentComponent(comment, this.user ? this.user.login : null);
    this.timeline.push(component);
    this.element.insertBefore(component.element, this.marker);
    this.count++;
    this.renderCount();
    (0, _measure.scheduleMeasure)();
  };

  TimelineComponent.prototype.renderCount = function () {
    this.countAnchor.textContent = this.count + " Comment" + (this.count === 1 ? '' : 's');
  };

  return TimelineComponent;
}();

exports.TimelineComponent = TimelineComponent;
},{"./comment-component":"comment-component.ts","./measure":"measure.ts"}],"repo-config.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRepoConfig = getRepoConfig;

var _github = require("./github");

var _pageAttributes = require("./page-attributes");

var promise;

function getRepoConfig() {
  if (!promise) {
    promise = (0, _github.loadJsonFile)('utterances.json').then(function (data) {
      if (!Array.isArray(data.origins)) {
        data.origins = [];
      }

      return data;
    }, function () {
      return {
        origins: [_pageAttributes.pageAttributes.origin]
      };
    });
  }

  return promise;
}
},{"./github":"github.ts","./page-attributes":"page-attributes.ts"}],"new-comment-component.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NewCommentComponent = void 0;

var _github = require("./github");

var _measure = require("./measure");

var _commentComponent = require("./comment-component");

var _repoConfig = require("./repo-config");

var anonymousAvatar = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 14 16\" version=\"1.1\"><path fill=\"rgb(179,179,179)\" fill-rule=\"evenodd\" d=\"M8 10.5L9 14H5l1-3.5L5.25 9h3.5L8 10.5zM10 6H4L2 7h10l-2-1zM9 2L7 3 5 2 4 5h6L9 2zm4.03 7.75L10 9l1 2-2 3h3.22c.45 0 .86-.31.97-.75l.56-2.28c.14-.53-.19-1.08-.72-1.22zM4 9l-3.03.75c-.53.14-.86.69-.72 1.22l.56 2.28c.11.44.52.75.97.75H5l-2-3 1-2z\"></path></svg>";
var anonymousAvatarUrl = "data:image/svg+xml;base64," + btoa(anonymousAvatar);
var nothingToPreview = 'Nothing to preview';

var NewCommentComponent = function () {
  function NewCommentComponent(user, submit) {
    var _this = this;

    this.user = user;
    this.submit = submit;
    this.submitting = false;
    this.renderTimeout = 0;

    this.handleInput = function () {
      (0, _repoConfig.getRepoConfig)();
      var text = _this.textarea.value;
      var isWhitespace = /^\s*$/.test(text);
      _this.submitButton.disabled = isWhitespace;

      if (_this.textarea.scrollHeight < 450 && _this.textarea.offsetHeight < _this.textarea.scrollHeight) {
        _this.textarea.style.height = _this.textarea.scrollHeight + "px";
        (0, _measure.scheduleMeasure)();
      }

      clearTimeout(_this.renderTimeout);

      if (isWhitespace) {
        _this.preview.textContent = nothingToPreview;
      } else {
        _this.preview.textContent = 'Loading preview...';
        _this.renderTimeout = setTimeout(function () {
          return (0, _github.renderMarkdown)(text).then(function (html) {
            return _this.preview.innerHTML = html;
          }).then(function () {
            return (0, _commentComponent.processRenderedMarkdown)(_this.preview);
          }).then(_measure.scheduleMeasure);
        }, 500);
      }
    };

    this.handleSubmit = function (event) {
      event.preventDefault();

      if (_this.submitting) {
        return;
      }

      _this.submitting = true;

      if (_this.user) {
        _this.textarea.disabled = true;
        _this.submitButton.disabled = true;
      }

      _this.submit(_this.textarea.value).catch(function () {
        return 0;
      }).then(function () {
        _this.submitting = false;
        _this.textarea.disabled = !_this.user;
        _this.textarea.value = '';
        _this.submitButton.disabled = false;

        _this.handleClick({
          target: _this.form.querySelector('.tabnav-tab.tab-write')
        });

        _this.preview.textContent = nothingToPreview;
      });
    };

    this.handleClick = function (_a) {
      var target = _a.target;

      if (!(target instanceof HTMLButtonElement) || !target.classList.contains('tabnav-tab')) {
        return;
      }

      if (target.classList.contains('selected')) {
        return;
      }

      _this.form.querySelector('.tabnav-tab.selected').classList.remove('selected');

      target.classList.add('selected');
      var isPreview = target.classList.contains('tab-preview');
      _this.textarea.style.display = isPreview ? 'none' : '';
      _this.preview.style.display = isPreview ? '' : 'none';
      (0, _measure.scheduleMeasure)();
    };

    this.handleKeyDown = function (_a) {
      var which = _a.which,
          ctrlKey = _a.ctrlKey;

      if (which === 13 && ctrlKey && !_this.submitButton.disabled) {
        _this.form.dispatchEvent(new CustomEvent('submit'));
      }
    };

    this.element = document.createElement('article');
    this.element.classList.add('timeline-comment');
    this.element.innerHTML = "\n      <a class=\"avatar\" target=\"_blank\" tabindex=\"-1\">\n        <img height=\"44\" width=\"44\">\n      </a>\n      <form class=\"comment\" accept-charset=\"UTF-8\" action=\"javascript:\">\n        <header class=\"new-comment-header\">\n          <nav class=\"tabnav-tabs\" role=\"tablist\">\n            <button type=\"button\" class=\"tabnav-tab tab-write selected\"\n                    role=\"tab\" aria-selected=\"true\">\n              Write\n            </button>\n            <button type=\"button\" class=\"tabnav-tab tab-preview\"\n                    role=\"tab\">\n              Preview\n            </button>\n          </nav>\n        </header>\n        <div class=\"comment-body\">\n          <textarea class=\"form-control\" placeholder=\"Leave a comment\" aria-label=\"comment\"></textarea>\n          <div class=\"markdown-body\" style=\"display: none\">\n            " + nothingToPreview + "\n          </div>\n        </div>\n        <footer class=\"comment-footer\">\n          <a class=\"text-link markdown-info\" tabindex=\"-1\" target=\"_blank\"\n             href=\"https://guides.github.com/features/mastering-markdown/\">\n            <svg class=\"octicon v-align-bottom\" viewBox=\"0 0 16 16\" version=\"1.1\"\n              width=\"16\" height=\"16\" aria-hidden=\"true\">\n              <path fill-rule=\"evenodd\" d=\"M14.85 3H1.15C.52 3 0 3.52 0 4.15v7.69C0 12.48.52 13 1.15\n                13h13.69c.64 0 1.15-.52 1.15-1.15v-7.7C16 3.52 15.48 3 14.85 3zM9 11H7V8L5.5 9.92 4\n                8v3H2V5h2l1.5 2L7 5h2v6zm2.99.5L9.5 8H11V5h2v3h1.5l-2.51 3.5z\">\n              </path>\n            </svg>\n            Styling with Markdown is supported\n          </a>\n          <button class=\"btn btn-primary\" type=\"submit\">Comment</button>\n        </footer>\n      </form>";
    this.avatarAnchor = this.element.firstElementChild;
    this.avatar = this.avatarAnchor.firstElementChild;
    this.form = this.avatarAnchor.nextElementSibling;
    this.textarea = this.form.firstElementChild.nextElementSibling.firstElementChild;
    this.preview = this.form.firstElementChild.nextElementSibling.lastElementChild;
    this.submitButton = this.form.lastElementChild.lastElementChild;
    this.setUser(user);
    this.textarea.addEventListener('input', this.handleInput);
    this.form.addEventListener('submit', this.handleSubmit);
    this.form.addEventListener('click', this.handleClick);
    this.form.addEventListener('keydown', this.handleKeyDown);
    handleTextAreaResize(this.textarea);
  }

  NewCommentComponent.prototype.setUser = function (user) {
    this.user = user;
    this.submitButton.textContent = user ? 'Comment' : 'Sign in to comment';
    this.submitButton.disabled = !!user;

    if (user) {
      this.avatarAnchor.href = user.html_url;
      this.avatar.alt = '@' + user.login;
      this.avatar.src = user.avatar_url + '?v=3&s=88';
    } else {
      this.avatarAnchor.removeAttribute('href');
      this.avatar.alt = '@anonymous';
      this.avatar.src = anonymousAvatarUrl;
      this.textarea.disabled = true;
    }
  };

  NewCommentComponent.prototype.clear = function () {
    this.textarea.value = '';
  };

  return NewCommentComponent;
}();

exports.NewCommentComponent = NewCommentComponent;

function handleTextAreaResize(textarea) {
  var stopTracking = function stopTracking() {
    removeEventListener('mousemove', _measure.scheduleMeasure);
    removeEventListener('mouseup', stopTracking);
  };

  var track = function track() {
    addEventListener('mousemove', _measure.scheduleMeasure);
    addEventListener('mouseup', stopTracking);
  };

  textarea.addEventListener('mousedown', track);
}
},{"./github":"github.ts","./measure":"measure.ts","./comment-component":"comment-component.ts","./repo-config":"repo-config.ts"}],"theme.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadTheme = loadTheme;

function loadTheme(theme, origin) {
  return new Promise(function (resolve) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.setAttribute('crossorigin', 'anonymous');
    link.onload = resolve;
    link.href = "/stylesheets/themes/" + theme + "/utterances.css";
    document.head.appendChild(link);
    addEventListener('message', function (event) {
      if (event.origin === origin && event.data.type === 'set-theme') {
        link.href = "/stylesheets/themes/" + event.data.theme + "/utterances.css";
      }
    });
  });
}
},{}],"utterances.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assertOrigin = assertOrigin;

var _pageAttributes = require("./page-attributes");

var _github = require("./github");

var _oauth = require("./oauth");

var _timelineComponent = require("./timeline-component");

var _newCommentComponent = require("./new-comment-component");

var _measure = require("./measure");

var _theme = require("./theme");

var _repoConfig = require("./repo-config");

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

(0, _github.setRepoContext)(_pageAttributes.pageAttributes);

function loadIssue() {
  if (_pageAttributes.pageAttributes.issueNumber !== null) {
    return (0, _github.loadIssueByNumber)(_pageAttributes.pageAttributes.issueNumber);
  }

  return (0, _github.loadIssueByTerm)(_pageAttributes.pageAttributes.issueTerm);
}

Promise.all([loadIssue(), (0, _github.loadUser)(), (0, _theme.loadTheme)(_pageAttributes.pageAttributes.theme, _pageAttributes.pageAttributes.origin)]).then(function (_a) {
  var issue = _a[0],
      user = _a[1];
  return bootstrap(issue, user);
});

function bootstrap(issue, user) {
  var _this = this;

  (0, _measure.startMeasuring)(_pageAttributes.pageAttributes.origin);
  var timeline = new _timelineComponent.TimelineComponent(user, issue);
  document.body.appendChild(timeline.element);

  if (issue && issue.comments > 0) {
    (0, _github.loadCommentsPage)(issue.number, 1).then(function (_a) {
      var items = _a.items;
      return items.forEach(function (comment) {
        return timeline.appendComment(comment);
      });
    });
  }

  if (issue && issue.locked) {
    return;
  }

  var submit = function submit(markdown) {
    return __awaiter(_this, void 0, void 0, function () {
      var comment;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!user) return [3, 5];
            return [4, assertOrigin()];

          case 1:
            _a.sent();

            if (!!issue) return [3, 3];
            return [4, (0, _github.createIssue)(_pageAttributes.pageAttributes.issueTerm, _pageAttributes.pageAttributes.url, _pageAttributes.pageAttributes.title, _pageAttributes.pageAttributes.description)];

          case 2:
            issue = _a.sent();
            timeline.setIssue(issue);
            _a.label = 3;

          case 3:
            return [4, (0, _github.postComment)(issue.number, markdown)];

          case 4:
            comment = _a.sent();
            timeline.appendComment(comment);
            newCommentComponent.clear();
            return [2];

          case 5:
            return [4, (0, _oauth.login)()];

          case 6:
            _a.sent();

            return [4, (0, _github.loadUser)()];

          case 7:
            user = _a.sent();
            timeline.setUser(user);
            newCommentComponent.setUser(user);
            return [2];
        }
      });
    });
  };

  var newCommentComponent = new _newCommentComponent.NewCommentComponent(user, submit);
  timeline.element.appendChild(newCommentComponent.element);
  (0, _measure.scheduleMeasure)();
}

addEventListener('not-installed', function handleNotInstalled() {
  removeEventListener('not-installed', handleNotInstalled);
  document.querySelector('.timeline').insertAdjacentHTML('afterbegin', "\n  <div class=\"flash flash-error\">\n    Error: utterances is not installed on <code>" + _pageAttributes.pageAttributes.owner + "/" + _pageAttributes.pageAttributes.repo + "</code>.\n    If you own this repo,\n    <a href=\"https://github.com/apps/utterances\" target=\"_top\"><strong>install the app</strong></a>.\n    Read more about this change in\n    <a href=\"https://github.com/utterance/utterances/pull/25\" target=\"_top\">the PR</a>.\n  </div>");
  (0, _measure.scheduleMeasure)();
});

function assertOrigin() {
  return __awaiter(this, void 0, void 0, function () {
    var origins, origin, owner, repo, url;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4, (0, _repoConfig.getRepoConfig)()];

        case 1:
          origins = _a.sent().origins;
          origin = _pageAttributes.pageAttributes.origin, owner = _pageAttributes.pageAttributes.owner, repo = _pageAttributes.pageAttributes.repo, url = _pageAttributes.pageAttributes.url;

          if (origins.indexOf(origin) !== -1) {
            return [2];
          }

          document.querySelector('.timeline').lastElementChild.insertAdjacentHTML('beforebegin', "\n  <div class=\"flash flash-error flash-not-installed\">\n    Error: <code>" + origin + "</code> is not permitted to post to <code>" + owner + "/" + repo + "</code>.\n    Confirm this is the correct repo for this site's comments. If you own this repo,\n    <a href=\"https://github.com/" + owner + "/" + repo + "/edit/master/utterances.json\" target=\"_top\">\n      <strong>update the utterances.json</strong>\n    </a>\n    to include <code>" + origin + "</code> in the list of origins.<br/><br/>\n    Suggested configuration:<br/>\n    <pre><code>" + JSON.stringify({
            origins: [origin]
          }, null, 2) + "</code></pre>\n  </div>");
          (0, _measure.scheduleMeasure)();
          throw new Error('Origin not permitted.');
      }
    });
  });
}
},{"./page-attributes":"page-attributes.ts","./github":"github.ts","./oauth":"oauth.ts","./timeline-component":"timeline-component.ts","./new-comment-component":"new-comment-component.ts","./measure":"measure.ts","./theme":"theme.ts","./repo-config":"repo-config.ts"}]},{},["utterances.ts"], null)
//# sourceMappingURL=/utterances.74a2fd99.map