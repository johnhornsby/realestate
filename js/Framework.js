(function () {	
	Object.keys || (Object.keys = function (a) {
    if (!x(a)) throw _typeError(a + " is not an object");
    var b = [];
    for (var c in a) {
      a.hasOwnProperty(c) && b.push(c)
    }
    return b
  });
  if (!Object.getPrototypeOf) {
    if ("".__proto__) {
      Object.getPrototypeOf = function (a) {
        if (!x(a)) throw _typeError(a + " is not an object");
        return a.__proto__
      }
    } else {
      Object.getPrototypeOf = function (a) {
        if (!x(a)) throw _typeError(a + " is not an object");
        return a.constructor ? a.constructor.prototype : null
      }
    }
  }
  Object.create || (Object.create = function (a, b) {
    var F = function () {};
    F.prototype = a;
    F.prototype.constructor = F;
    return new F()
  });
  if (String.prototype.trim === undefined) {
    String.prototype.trim = function () {
      return this.replace(/^\s+/, "").replace(/\s+$/, "")
    }
  }
  if (Array.prototype.reduce === undefined) {
    Array.prototype.reduce = function (b) {
      if (this === void 0 || this === null) {
        throw new TypeError()
      }
      var e = Object(this),
          a = e.length >>> 0,
          d = 0,
          c;
      if (typeof b !== "function") {
        throw new TypeError()
      }
      if (a == 0 && arguments.length == 1) {
        throw new TypeError()
      }
      if (arguments.length >= 2) {
        c = arguments[1]
      } else {
        do {
          if (d in e) {
            c = e[d++];
            break
          }
          if (++d >= a) {
            throw new TypeError()
          }
        } while (true)
      }
      while (d < a) {
        if (d in e) {
          c = b.call(undefined, c, e[d], d, e)
        }
        d++
      }
      return c
    }
  }
  var v = (function () {
    var m = [].slice,
        n, h, p, f, c, l = window.document,
        e;

    function o(q) {
      return new RegExp("(^|\\s)" + q + "(\\s|$)")
    }
    function k(q) {
      return q.filter(function (r) {
        return r !== e && r !== null
      })
    }
    function a(q) {
      return q.reduce(function (s, r) {
        return s.concat(r)
      }, [])
    }
    function d(q) {
      return q.replace(/-+(.)?/g, function (r, s) {
        return s ? s.toUpperCase() : ""
      })
    }
    f = /^\s*<.+>/;
    c = l.createElement("div");

    function j(r) {
      c.innerHTML = ("" + r).trim();
      var q = m.call(c.childNodes);
      c.innerHTML = "";
      return q
    }
    function b(r, q) {
      this.dom = r || [];
      this.length = this.dom.length;
      this.selector = q || ""
    }
    function g(q, r) {
      if (q == l) {
        return new b
      } else {
        if (r !== e) {
          return g(r).find(q)
        } else {
          if (typeof q === "function") {
            return g(l).ready(q)
          } else {
            var s;
            if (q instanceof b) {
              s = q.dom
            } else {
              if (q instanceof Array) {
                s = k(q)
              } else {
                if (q instanceof Element || q === window) {
                  s = [q]
                } else {
                  if (f.test(q)) {
                    s = j(q)
                  } else {
                    s = p(l, q)
                  }
                }
              }
            }
            return new b(s, q)
          }
        }
      }
    }
    g.extend = function (r, q) {
      for (n in q) {
        r[n] = q[n]
      }
      return r
    };
    g.qsa = p = function (r, q) {
      return m.call(r.querySelectorAll(q))
    };
    g.fn = {
      ready: function (q) {
        l.addEventListener("DOMContentLoaded", q, false);
        return this
      },
      get: function (q) {
        return q === e ? this.dom : this.dom[q]
      },
      size: function () {
        return this.length
      },
      remove: function () {
        return this.each(function () {
          this.parentNode.removeChild(this)
        })
      },
      each: function (q) {
        this.dom.forEach(function (s, r) {
          q.call(s, r, s)
        });
        return this
      },
      filter: function (q) {
        return g(this.dom.filter(function (r) {
          return p(r.parentNode, q).indexOf(r) >= 0
        }))
      },
      is: function (q) {
        return this.length > 0 && g(this.dom[0]).filter(q).length > 0
      },
      eq: function (q) {
        return g(this.get(q))
      },
      first: function () {
        return g(this.get(0))
      },
      last: function () {
        return g(this.get(this.length - 1))
      },
      find: function (r) {
        var q;
        if (this.length == 1) {
          q = p(this.get(0), r)
        } else {
          q = a(this.dom.map(function (s) {
            return p(s, r)
          }))
        }
        return g(q)
      },
      closest: function (q, s) {
        var t = this.dom[0],
            r = p(s !== e ? s : l, q);
        if (r.length === 0) {
          t = null
        }
        while (t && t !== l && r.indexOf(t) < 0) {
          t = t.parentNode
        }
        return g(t)
      },
      parents: function (q) {
        var s = [],
            r = this.get();
        while (r.length > 0) {
          r = k(r.map(function (t) {
            if ((t = t.parentNode) && t !== l && s.indexOf(t) < 0) {
              s.push(t);
              return t
            }
          }))
        }
        s = g(s);
        return q === e ? s : s.filter(q)
      },
      parent: function (q) {
        var s, r = [];
        this.each(function () {
          if ((s = this.parentNode) && r.indexOf(s) < 0) {
            r.push(s)
          }
        });
        r = g(r);
        return q === e ? r : r.filter(q)
      },
      pluck: function (q) {
        return this.dom.map(function (r) {
          return r[q]
        })
      },
      show: function () {
        return this.css("display", "block")
      },
      hide: function () {
        return this.css("display", "none")
      },
      prev: function () {
        return g(this.pluck("previousElementSibling"))
      },
      next: function () {
        return g(this.pluck("nextElementSibling"))
      },
      html: function (q) {
        return q === e ? (this.length > 0 ? this.dom[0].innerHTML : null) : this.each(function (r) {
          this.innerHTML = typeof q == "function" ? q(r, this.innerHTML) : q
        })
      },
      text: function (q) {
        return q === e ? (this.length > 0 ? this.dom[0].innerText : null) : this.each(function () {
          this.innerText = q
        })
      },
      attr: function (q, r) {
        return (typeof q == "string" && r === e) ? (this.length > 0 && this.dom[0].nodeName === "INPUT" && this.dom[0].type === "text" && q === "value") ? (this.val()) : (this.length > 0 ? this.dom[0].getAttribute(q) || e : null) : this.each(function (s) {
          if (typeof q == "object") {
            for (n in q) {
              this.setAttribute(n, q[n])
            }
          } else {
            this.setAttribute(q, typeof r == "function" ? r(s, this.getAttribute(q)) : r)
          }
        })
      },
      removeAttr: function (q) {
        return this.each(function () {
          this.removeAttribute(q)
        })
      },
      val: function (q) {
        return (q === e) ? (this.length > 0 ? this.dom[0].value : null) : this.each(function () {
          this.value = q
        })
      },
      offset: function () {
        var q = this.dom[0].getBoundingClientRect();
        return {
          left: q.left + l.body.scrollLeft,
          top: q.top + l.body.scrollTop,
          width: q.width,
          height: q.height
        }
      },
      css: function (r, q) {
        if (q === e && typeof r == "string") {
          return this.dom[0].style[d(r)]
        }
        h = "";
        for (n in r) {
          h += n + ":" + r[n] + ";"
        }
        if (typeof r == "string") {
          h = r + ":" + q
        }
        return this.each(function () {
          this.style.cssText += ";" + h
        })
      },
      index: function (q) {
        return this.dom.indexOf(g(q).get(0))
      },
      hasClass: function (q) {
        return o(q).test(this.dom[0].className)
      },
      addClass: function (q) {
        return this.each(function () {
          !g(this).hasClass(q) && (this.className += (this.className ? " " : "") + q)
        })
      },
      removeClass: function (q) {
        return this.each(function () {
          this.className = this.className.replace(o(q), " ").trim()
        })
      },
      toggleClass: function (r, q) {
        return this.each(function () {
          ((q !== e && !q) || g(this).hasClass(r)) ? g(this).removeClass(r) : g(this).addClass(r)
        })
      }
    };
    ["width", "height"].forEach(function (q) {
      g.fn[q] = function () {
        return this.offset()[q]
      }
    });
    var i = {
      append: "beforeEnd",
      prepend: "afterBegin",
      before: "beforeBegin",
      after: "afterEnd"
    };
    for (n in i) {
      g.fn[n] = (function (q) {
        return function (r) {
          return this.each(function (s, u) {
            if (r instanceof b) {
              dom = r.dom;
              if (q == "afterBegin" || q == "afterEnd") {
                for (var t = 0; t < dom.length; t++) {
                  u.insertAdjacentElement(q, dom[dom.length - t - 1])
                }
              } else {
                for (var t = 0; t < dom.length; t++) {
                  u.insertAdjacentElement(q, dom[t])
                }
              }
            } else {
              u["insertAdjacent" + (r instanceof Element ? "Element" : "HTML")](q, r)
            }
          })
        }
      })(i[n])
    }
    b.prototype = g.fn;
    return g
  })();
  "$" in window || (window.$ = v);
  (function (e) {
    var k = e.qsa,
        a = {},
        j = 1;

    function i(m) {
      return m._zid || (m._zid = j++)
    }
    function b(n, p, o, m) {
      p = c(p);
      if (p.ns) {
        var q = h(p.ns)
      }
      return (a[i(n)] || []).filter(function (r) {
        return r && (!p.e || r.e == p.e) && (!p.ns || q.test(r.ns)) && (!o || r.fn == o) && (!m || r.sel == m)
      })
    }
    function c(m) {
      var n = ("" + m).split(".");
      return {
        e: n[0],
        ns: n.slice(1).sort().join(" ")
      }
    }
    function h(m) {
      return new RegExp("(?:^| )" + m.replace(" ", " .* ?") + "(?: |$)")
    }
    function l(o, n, q, m, p) {
      var s = i(o),
          r = (a[s] || (a[s] = []));
      n.split(/\s/).forEach(function (u) {
        var t = e.extend(c(u), {
          fn: q,
          sel: m,
          del: p,
          i: r.length
        });
        r.push(t);
        o.addEventListener(t.e, p || q, false)
      })
    }
    function d(o, n, p, m) {
      var q = i(o);
      (n || "").split(/\s/).forEach(function (r) {
        b(o, r, p, m).forEach(function (s) {
          delete a[q][s.i];
          o.removeEventListener(s.e, s.del || s.fn, false)
        })
      })
    }
    e.event = {
      add: function (n, m, o) {
        l(n, m, o)
      },
      remove: function (n, m, o) {
        d(n, m, o)
      }
    };
    e.fn.bind = function (m, n) {
      return this.each(function () {
        l(this, m, n)
      })
    };
    e.fn.unbind = function (m, n) {
      return this.each(function () {
        d(this, m, n)
      })
    };
    var g = ["preventDefault", "stopImmediatePropagation", "stopPropagation"];

    function f(n) {
      var m = e.extend({
        originalEvent: n
      }, n);
      g.forEach(function (o) {
        m[o] = function () {
          return n[o].apply(n, arguments)
        }
      });
      return m
    }
    e.fn.delegate = function (m, n, o) {
      return this.each(function (q, p) {
        l(p, n, o, m, function (t) {
          var s = t.target,
              r = k(p, m);
          while (s && r.indexOf(s) < 0) {
            s = s.parentNode
          }
          if (s && !(s === p) && !(s === document)) {
            o.call(s, e.extend(f(t), {
              currentTarget: s,
              liveFired: p
            }))
          }
        })
      })
    };
    e.fn.undelegate = function (m, n, o) {
      return this.each(function () {
        d(this, n, o, m)
      })
    };
    e.fn.live = function (m, n) {
      e(document.body).delegate(this.selector, m, n);
      return this
    };
    e.fn.die = function (m, n) {
      e(document.body).undelegate(this.selector, m, n);
      return this
    };
    e.fn.trigger = function (m) {
      return this.each(function () {
        var n = document.createEvent("Events");
        this.dispatchEvent(n, n.initEvent(m, true, false))
      })
    }
  })(v);
  (function (c) {
    function b(h) {
      var h = h,
          i = {},
          e = h.match(/(Android)\s+([\d.]+)/),
          j = h.match(/(iPhone\sOS)\s([\d_]+)/),
          d = h.match(/(iPad).*OS\s([\d_]+)/),
          g = h.match(/(webOS)\/([\d.]+)/),
          f = h.match(/(BlackBerry).*Version\/([\d.]+)/);
      if (e) {
        i.android = true, i.version = e[2]
      }
      if (j) {
        i.ios = true, i.version = j[2].replace(/_/g, "."), i.iphone = true
      }
      if (d) {
        i.ios = true, i.version = d[2].replace(/_/g, "."), i.ipad = true
      }
      if (g) {
        i.webos = true, i.version = g[2]
      }
      if (f) {
        i.blackberry = true, i.version = f[2]
      }
      return i
    }
    c.os = b(navigator.userAgent);
    c.__detect = b;
    var a = navigator.userAgent.match(/WebKit\/([\d.]+)/);
    c.browser = a ? {
      webkit: true,
      version: a[1]
    } : {
      webkit: false
    }
  })(v);
  (function (a) {
    a.fn.anim = function (d, f, g) {
      var e = [],
          b, c;
      for (c in d) {
        if (c === "opacity") {
          b = d[c]
        } else {
          e.push(c + "(" + d[c] + ")")
        }
      }
      return this.css({
        "-webkit-transition": "all " + (f !== undefined ? f : 0.5) + "s " + (g || ""),
        "-webkit-transform": e.join(" "),
        opacity: b
      })
    }
  })(v);
  (function (c) {
    var d = {},
        b;

    function a(e) {
      return "tagName" in e ? e : e.parentNode
    }
    c(document).ready(function () {
      c(document.body).bind("touchstart", function (g) {
        var f = Date.now(),
            h = f - (d.last || f);
        d.target = a(g.touches[0].target);
        b && clearTimeout(b);
        d.x1 = g.touches[0].pageX;
        if (h > 0 && h <= 250) {
          d.isDoubleTap = true
        }
        d.last = f
      }).bind("touchmove", function (f) {
        d.x2 = f.touches[0].pageX
      }).bind("touchend", function (f) {
        if (d.isDoubleTap) {
          c(d.target).trigger("doubleTap");
          d = {}
        } else {
          if (d.x2 > 0) {
            Math.abs(d.x1 - d.x2) > 30 && c(d.target).trigger("swipe") && c(d.target).trigger("swipe" + (d.x1 - d.x2 > 0 ? "Left" : "Right"));
            d.x1 = d.x2 = d.last = 0
          } else {
            if ("last" in d) {
              b = setTimeout(function () {
                b = null;
                c(d.target).trigger("tap");
                d = {}
              }, 250)
            }
          }
        }
      }).bind("touchcancel", function () {
        d = {}
      })
    });
    ["swipe", "swipeLeft", "swipeRight", "doubleTap", "tap"].forEach(function (e) {
      c.fn[e] = function (f) {
        return this.bind(e, f)
      }
    })
  })(v);
  (function (c) {
    var d = 0;

    function b() {}
    c.ajaxJSONP = function (f) {
      var g;
      g = "jsonp" + ++d;
      window[g] = function () {
        f.success();
        delete window.jsonpString
      };
      var e = document.createElement("script");
      c(e).attr({
        src: f.url.replace(/=\?/, "=" + g)
      });
      c("head").append(e)
    };
    c.ajax = function (f) {
      f = f || {};
      if (f.url && /=\?/.test(f.url)) {
        return c.ajaxJSONP(f)
      }
      var i = f.data,
          k = f.success || b,
          e = f.error || b,
          h = a[f.dataType],
          g = f.contentType,
          j = new XMLHttpRequest();
      j.onreadystatechange = function () {
        if (j.readyState == 4) {
          if ((j.status >= 200 && j.status < 300) || j.status == 0) {
            if (h == "application/json") {
              var l, m = false;
              try {
                l = JSON.parse(j.responseText)
              } catch (n) {
                m = n
              }
              if (m) {
                e(j, "parsererror", m)
              } else {
                k(l, "success", j)
              }
            } else {
              k(j.responseText, "success", j)
            }
          } else {
            e(j, "error")
          }
        }
      };
      j.open(f.type || "GET", f.url || window.location, true);
      if (h) {
        j.setRequestHeader("Accept", h)
      }
      if (i instanceof Object) {
        i = JSON.stringify(i), g = g || "application/json"
      }
      if (g) {
        j.setRequestHeader("Content-Type", g)
      }
      j.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      j.send(i)
    };
    var a = c.ajax.mimeTypes = {
      json: "application/json",
      xml: "application/xml",
      html: "text/html",
      text: "text/plain"
    };
    c.get = function (e, f) {
      c.ajax({
        url: e,
        success: f
      })
    };
    c.post = function (f, g, h, e) {
      if (g instanceof Function) {
        e = e || h, h = g, g = null
      }
      c.ajax({
        type: "POST",
        url: f,
        data: g,
        success: h,
        dataType: e
      })
    };
    c.getJSON = function (e, f) {
      c.ajax({
        url: e,
        success: f,
        dataType: "json"
      })
    };
    c.fn.load = function (g, i) {
      if (!this.dom.length) {
        return this
      }
      var f = this,
          h = g.split(/\s/),
          e;
      if (h.length > 1) {
        g = h[0], e = h[1]
      }
      c.get(g, function (j) {
        f.html(e ? c(document.createElement("div")).html(j).find(e).html() : j);
        i && i()
      });
      return this
    }
  })(v);
  (function (c) {
    var a = [],
        b;
    c.fn.remove = function () {
      return this.each(function () {
        if (this.tagName == "IMG") {
          a.push(this);
          this.src = "data:image/gif;base64,R0lGODlhAQABAAAAADs=";
          if (b) {
            clearTimeout(b)
          }
          b = setTimeout(function () {
            a = []
          }, 60000)
        }
        this.parentNode.removeChild(this)
      })
    }
  })(v);
})();