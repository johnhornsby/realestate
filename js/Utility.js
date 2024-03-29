(function () {
var g;
  if (typeof exports !== "undefined") {
    g = exports
  } else {
    g = this.Spine = {}
  }
  g.version = "0.0.3";
  var e = g.$ = this.jQuery || this.Zepto;
  var b = g.makeArray = function (k) {
      return Array.prototype.slice.call(k, 0)
      };
  if (typeof Array.prototype.indexOf === "undefined") {
    Array.prototype.indexOf = function (l) {
      for (var k = 0; k < this.length; k++) {
        if (this[k] === l) {
          return k
        }
      }
      return -1
    }
  }
  var j = g.Events = {
    bind: function (n, o) {
      var k = n.split(" ");
      var m = this._callbacks || (this._callbacks = {});
      for (var l = 0; l < k.length; l++) {
        (this._callbacks[k[l]] || (this._callbacks[k[l]] = [])).push(o)
      }
      return this
    },
    trigger: function () {
      var m = b(arguments);
      var p = m.shift();
      var q, o, n, k;
      if (!(o = this._callbacks)) {
        return false
      }
      if (!(q = this._callbacks[p])) {
        return false
      }
      for (n = 0, k = q.length; n < k; n++) {
        if (q[n].apply(this, m) === false) {
          break
        }
      }
      return true
    },
    unbind: function (o, q) {
      if (!o) {
        this._callbacks = {};
        return this
      }
      var p, n, m, k;
      if (!(n = this._callbacks)) {
        return this
      }
      if (!(p = this._callbacks[o])) {
        return this
      }
      if (!q) {
        delete this._callbacks[o];
        return this
      }
      for (m = 0, k = p.length; m < k; m++) {
        if (q === p[m]) {
          p.splice(m, 1);
          break
        }
      }
      return this
    }
  };
  var f = g.Log = {
    trace: true,
    logPrefix: "(App)",
    log: function () {
      if (!this.trace) {
        return
      }
      if (typeof console == "undefined") {
        return
      }
      var k = b(arguments);
      if (this.logPrefix) {
        k.unshift(this.logPrefix)
      }
      console.log.apply(console, k);
      return this
    }
  };
  if (typeof Object.create !== "function") {
    Object.create = function (l) {
      function k() {}
      k.prototype = l;
      return new k()
    }
  }
  var h = ["included", "extended"];
  var a = g.Class = {
    inherited: function () {},
    created: function () {},
    prototype: {
      initializer: function () {},
      init: function () {}
    },
    create: function (k, m) {
      var l = Object.create(this);
      l.parent = this;
      l.prototype = l.fn = Object.create(this.prototype);
      if (k) {
        l.include(k)
      }
      if (m) {
        l.extend(m)
      }
      l.created();
      this.inherited(l);
      return l
    },
    init: function () {
      var k = Object.create(this.prototype);
      k.parent = this;
      k.initializer.apply(k, arguments);
      k.init.apply(k, arguments);
      return k
    },
    proxy: function (l) {
      var k = this;
      return (function () {
        return l.apply(k, arguments)
      })
    },
    proxyAll: function () {
      var l = b(arguments);
      for (var k = 0; k < l.length; k++) {
        this[l[k]] = this.proxy(this[l[k]])
      }
    },
    include: function (m) {
      for (var k in m) {
        if (h.indexOf(k) == -1) {
          this.fn[k] = m[k]
        }
      }
      var l = m.included;
      if (l) {
        l.apply(this)
      }
      return this
    },
    extend: function (m) {
      for (var l in m) {
        if (h.indexOf(l) == -1) {
          this[l] = m[l]
        }
      }
      var k = m.extended;
      if (k) {
        k.apply(this)
      }
      return this
    }
  };
  a.prototype.proxy = a.proxy;
  a.prototype.proxyAll = a.proxyAll;
  a.inst = a.init;
  a.sub = a.create;
  g.guid = function () {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (m) {
      var l = Math.random() * 16 | 0,
          k = m == "x" ? l : (l & 3 | 8);
      return k.toString(16)
    }).toUpperCase()
  };
  var c = g.Model = a.create();
  c.extend(j);
  c.extend({
    setup: function (l, m) {
      var k = c.sub();
      if (l) {
        k.name = l
      }
      if (m) {
        k.attributes = m
      }
      return k
    },
    created: function (k) {
      this.records = {};
      this.attributes = [];
      this.bind("create", this.proxy(function (l) {
        this.trigger("change", "create", l)
      }));
      this.bind("update", this.proxy(function (l) {
        this.trigger("change", "update", l)
      }));
      this.bind("destroy", this.proxy(function (l) {
        this.trigger("change", "destroy", l)
      }))
    },
    find: function (l) {
      var k = this.records[l];
      if (!k) {
        throw ("Unknown record")
      }
      return k.clone()
    },
    exists: function (l) {
      try {
        return this.find(l)
      } catch (k) {
        return false
      }
    },
    refresh: function (m) {
      this.records = {};
      for (var n = 0, l = m.length; n < l; n++) {
        var k = this.init(m[n]);
        k.newRecord = false;
        this.records[k.id] = k
      }
      this.trigger("refresh")
    },
    select: function (m) {
      var k = [];
      for (var l in this.records) {
        if (m(this.records[l])) {
          k.push(this.records[l])
        }
      }
      return this.cloneArray(k)
    },
    findByAttribute: function (k, m) {
      for (var l in this.records) {
        if (this.records[l][k] == m) {
          return this.records[l].clone()
        }
      }
    },
    findAllByAttribute: function (k, l) {
      return (this.select(function (m) {
        return (m[k] == l)
      }))
    },
    each: function (l) {
      for (var k in this.records) {
        l(this.records[k])
      }
    },
    all: function () {
      return this.cloneArray(this.recordsValues())
    },
    first: function () {
      var k = this.recordsValues()[0];
      return (k && k.clone())
    },
    last: function () {
      var l = this.recordsValues();
      var k = l[l.length - 1];
      return (k && k.clone())
    },
    count: function () {
      return this.recordsValues().length
    },
    deleteAll: function () {
      for (var k in this.records) {
        delete this.records[k]
      }
    },
    destroyAll: function () {
      for (var k in this.records) {
        this.records[k].destroy()
      }
    },
    update: function (l, k) {
      this.find(l).updateAttributes(k)
    },
    create: function (l) {
      var k = this.init(l);
      k.save();
      return k
    },
    destroy: function (k) {
      this.find(k).destroy()
    },
    sync: function (k) {
      this.bind("change", k)
    },
    fetch: function (k) {
      k ? this.bind("fetch", k) : this.trigger("fetch")
    },
    toJSON: function () {
      return this.recordsValues()
    },
    fromJSON: function (l) {
      var k = this;
      if (typeof l == "string") {
        l = JSON.parse(l)
      }
      if (typeof l == "array") {
        return (e.map(l, function () {
          return k.init(this)
        }))
      } else {
        return this.init(l)
      }
    },
    recordsValues: function () {
      var k = [];
      for (var l in this.records) {
        k.push(this.records[l])
      }
      return k
    },
    cloneArray: function (m) {
      var k = [];
      for (var l = 0; l < m.length; l++) {
        k.push(m[l].dup())
      }
      return k
    }
  });
  c.include({
    model: true,
    newRecord: true,
    init: function (k) {
      if (k) {
        this.load(k)
      }
    },
    isNew: function () {
      return this.newRecord
    },
    isValid: function () {
      return (!this.validate())
    },
    validate: function () {},
    load: function (l) {
      for (var k in l) {
        this[k] = l[k]
      }
    },
    attributes: function () {
      var l = {};
      for (var m = 0; m < this.parent.attributes.length; m++) {
        var k = this.parent.attributes[m];
        l[k] = this[k]
      }
      l.id = this.id;
      return l
    },
    eql: function (k) {
      return (k && k.id === this.id && k.parent === this.parent)
    },
    save: function () {
      var k = this.validate();
      if (k) {
        if (!this.trigger("error", this, k)) {
          throw ("Validation failed: " + k)
        }
      }
      this.trigger("beforeSave", this);
      this.newRecord ? this.create() : this.update();
      this.trigger("save", this);
      return this
    },
    updateAttribute: function (k, l) {
      this[k] = l;
      return this.save()
    },
    updateAttributes: function (k) {
      this.load(k);
      return this.save()
    },
    destroy: function () {
      this.trigger("beforeDestroy", this);
      delete this.parent.records[this.id];
      this.trigger("destroy", this)
    },
    dup: function () {
      var k = this.parent.init(this.attributes());
      k.newRecord = this.newRecord;
      return k
    },
    clone: function () {
      return Object.create(this)
    },
    reload: function () {
      if (this.newRecord) {
        return this
      }
      var k = this.parent.find(this.id);
      this.load(k.attributes());
      return k
    },
    toJSON: function () {
      return (this.attributes())
    },
    exists: function () {
      return (this.id && this.id in this.parent.records)
    },
    update: function () {
      this.trigger("beforeUpdate", this);
      var k = this.parent.records;
      k[this.id].load(this.attributes());
      this.trigger("update", k[this.id].clone())
    },
    create: function () {
      this.trigger("beforeCreate", this);
      if (!this.id) {
        this.id = g.guid()
      }
      this.newRecord = false;
      var k = this.parent.records;
      k[this.id] = this.dup();
      this.trigger("create", k[this.id].clone())
    },
    bind: function (k, l) {
      return this.parent.bind(k, this.proxy(function (m) {
        if (m && this.eql(m)) {
          l.apply(this, arguments)
        }
      }))
    },
    trigger: function () {
      return this.parent.trigger.apply(this.parent, arguments)
    }
  });
  
  var i = /^(\w+)\s*(.*)$/;
  var d = g.Controller = a.create({
    tag: "div",
    initializer: function (k) {
      this.options = k;
      for (var l in this.options) {
        this[l] = this.options[l]
      }
      if (!this.el) {
        this.el = document.createElement(this.tag)
      }
      this.el = e(this.el);
      if (!this.events) {
        this.events = this.parent.events
      }
      if (!this.elements) {
        this.elements = this.parent.elements
      }
      if (this.events) {
        this.delegateEvents()
      }
      if (this.elements) {
        this.refreshElements()
      }
      if (this.proxied) {
        this.proxyAll.apply(this, this.proxied)
      }
    },
    $: function (k) {
      return e(k, this.el)
    },
    delegateEvents: function () {
      for (var o in this.events) {
        var m = this.events[o];
        var p = this.proxy(this[m]);
        var n = o.match(i);
        var l = n[1],
            k = n[2];
        if (k === "") {
          this.el.bind(l, p)
        } else {
          this.el.delegate(k, l, p)
        }
      }
    },
    refreshElements: function () {
      for (var k in this.elements) {
        this[this.elements[k]] = this.$(k)
      }
    },
    delay: function (k, l) {
      setTimeout(this.proxy(k), l || 0)
    }
  });
  d.include(j);
  d.include(f);
  g.App = a.create();
  g.App.extend(j);
  d.fn.App = g.App
})();




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
  
})();
  

  