! function(factory) {
	"function" == typeof define && define.amd ? define(["jquery"], factory) : factory(jQuery)
}(function($) {
	function encode(s) {
		return config.raw ? s : encodeURIComponent(s)
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s)
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value))
	}

	function parseCookieValue(s) {
		0 === s.indexOf('"') && (s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\"));
		try {
			s = decodeURIComponent(s.replace(pluses, " "))
		} catch (e) {
			return
		}
		try {
			return config.json ? JSON.parse(s) : s
		} catch (e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value
	}
	var pluses = /\+/g,
		config = $.cookie = function(key, value, options) {
			if (void 0 !== value && !$.isFunction(value)) {
				if (options = $.extend({}, config.defaults, options), "number" == typeof options.expires) {
					var days = options.expires,
						t = options.expires = new Date;
					t.setDate(t.getDate() + days)
				}
				return document.cookie = [encode(key), "=", stringifyCookieValue(value), options.expires ? "; expires=" + options.expires.toUTCString() : "", options.path ? "; path=" + options.path : "", options.domain ? "; domain=" + options.domain : "", options.secure ? "; secure" : ""].join("")
			}
			for (var result = key ? void 0 : {}, cookies = document.cookie ? document.cookie.split("; ") : [], i = 0, l = cookies.length; i < l; i++) {
				var parts = cookies[i].split("="),
					name = decode(parts.shift()),
					cookie = parts.join("=");
				if (key && key === name) {
					result = read(cookie, value);
					break
				}
				key || void 0 === (cookie = read(cookie)) || (result[name] = cookie)
			}
			return result
		};
	config.defaults = {}, $.removeCookie = function(key, options) {
		return void 0 !== $.cookie(key) && ($.cookie(key, "", $.extend({}, options, {
			expires: -1
		})), !0)
	}
}),
function(document, mixpanel) {
	if (!mixpanel.__SV) {
		var functions, i, lib_name = "mixpanel";
		window[lib_name] = mixpanel, mixpanel._i = [], mixpanel.init = function(token, config, name) {
			function _set_and_defer(target, fn) {
				var split = fn.split(".");
				2 == split.length && (target = target[split[0]], fn = split[1]), target[fn] = function() {
					target.push([fn].concat(Array.prototype.slice.call(arguments, 0)))
				}
			}
			var target = mixpanel;
			for ("undefined" != typeof name ? target = mixpanel[name] = [] : name = lib_name, target.people = target.people || [], target.toString = function(no_stub) {
					var str = lib_name;
					return name !== lib_name && (str += "." + name), no_stub || (str += " (stub)"), str
				}, target.people.toString = function() {
					return target.toString(1) + ".people (stub)"
				}, functions = "disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config reset people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" "), i = 0; i < functions.length; i++) _set_and_defer(target, functions[i]);
			mixpanel._i.push([token, config, name])
		}, mixpanel.__SV = 1.2
	}
}(document, window.mixpanel || []),
function() {
	"use strict";

	function init_from_snippet() {
		if (init_type = INIT_SNIPPET, mixpanel_master = window[PRIMARY_INSTANCE_NAME], _.isUndefined(mixpanel_master)) return void console.critical("'mixpanel' object not initialized. Ensure you are using the latest version of the Mixpanel JS Library along with the snippet we provide.");
		if (mixpanel_master.__loaded || mixpanel_master.config && mixpanel_master.persistence) return void console.error("Mixpanel library has already been downloaded at least once.");
		var snippet_version = mixpanel_master.__SV || 0;
		return snippet_version < 1.1 ? void console.critical("Version mismatch; please ensure you're using the latest version of the Mixpanel code snippet.") : (_.each(mixpanel_master._i, function(item) {
			item && _.isArray(item) && (instances[item[item.length - 1]] = create_mplib.apply(this, item))
		}), override_mp_init_func(), mixpanel_master.init(), _.each(instances, function(instance) {
			instance._loaded()
		}), void add_dom_loaded_handler())
	}
	var init_type, mixpanel_master, LIB_VERSION = "2.8.0",
		INIT_MODULE = 0,
		INIT_SNIPPET = 1,
		ArrayProto = Array.prototype,
		FuncProto = Function.prototype,
		ObjProto = Object.prototype,
		slice = ArrayProto.slice,
		toString = ObjProto.toString,
		hasOwnProperty = ObjProto.hasOwnProperty,
		windowConsole = window.console,
		navigator = window.navigator,
		document = window.document,
		userAgent = navigator.userAgent,
		PRIMARY_INSTANCE_NAME = "mixpanel",
		SET_QUEUE_KEY = "__mps",
		SET_ONCE_QUEUE_KEY = "__mpso",
		ADD_QUEUE_KEY = "__mpa",
		APPEND_QUEUE_KEY = "__mpap",
		UNION_QUEUE_KEY = "__mpu",
		SET_ACTION = "$set",
		SET_ONCE_ACTION = "$set_once",
		ADD_ACTION = "$add",
		APPEND_ACTION = "$append",
		UNION_ACTION = "$union",
		PEOPLE_DISTINCT_ID_KEY = "$people_distinct_id",
		ALIAS_ID_KEY = "__alias",
		CAMPAIGN_IDS_KEY = "__cmpns",
		EVENT_TIMERS_KEY = "__timers",
		RESERVED_PROPERTIES = [SET_QUEUE_KEY, SET_ONCE_QUEUE_KEY, ADD_QUEUE_KEY, APPEND_QUEUE_KEY, UNION_QUEUE_KEY, PEOPLE_DISTINCT_ID_KEY, ALIAS_ID_KEY, CAMPAIGN_IDS_KEY, EVENT_TIMERS_KEY],
		HTTP_PROTOCOL = "https:" == document.location.protocol ? "https://" : "http://",
		USE_XHR = window.XMLHttpRequest && "withCredentials" in new XMLHttpRequest,
		ENQUEUE_REQUESTS = !USE_XHR && userAgent.indexOf("MSIE") == -1 && userAgent.indexOf("Mozilla") == -1,
		_ = {},
		DEBUG = !1,
		DEFAULT_CONFIG = {
			api_host: HTTP_PROTOCOL + "api.mixpanel.com",
			cross_subdomain_cookie: !0,
			persistence: "cookie",
			persistence_name: "",
			cookie_name: "",
			loaded: function() {},
			store_google: !0,
			save_referrer: !0,
			test: !1,
			verbose: !1,
			img: !1,
			track_pageview: !0,
			debug: !1,
			track_links_timeout: 300,
			cookie_expiration: 365,
			upgrade: !1,
			disable_persistence: !1,
			disable_cookie: !1,
			secure_cookie: !1,
			ip: !0,
			property_blacklist: []
		},
		DOM_LOADED = !1;
	! function() {
		var nativeBind = FuncProto.bind,
			nativeForEach = ArrayProto.forEach,
			nativeIndexOf = ArrayProto.indexOf,
			nativeIsArray = Array.isArray,
			breaker = {};
		_.bind = function(func, context) {
			var args, bound;
			if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
			if (!_.isFunction(func)) throw new TypeError;
			return args = slice.call(arguments, 2), bound = function() {
				if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
				ctor.prototype = func.prototype;
				var self = new ctor;
				ctor.prototype = null;
				var result = func.apply(self, args.concat(slice.call(arguments)));
				return Object(result) === result ? result : self
			}
		}, _.bind_instance_methods = function(obj) {
			for (var func in obj) "function" == typeof obj[func] && (obj[func] = _.bind(obj[func], obj))
		};
		var each = _.each = function(obj, iterator, context) {
			if (null != obj)
				if (nativeForEach && obj.forEach === nativeForEach) obj.forEach(iterator, context);
				else if (obj.length === +obj.length) {
				for (var i = 0, l = obj.length; i < l; i++)
					if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return
			} else
				for (var key in obj)
					if (hasOwnProperty.call(obj, key) && iterator.call(context, obj[key], key, obj) === breaker) return
		};
		_.escapeHTML = function(s) {
			var escaped = s;
			return escaped && _.isString(escaped) && (escaped = escaped.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")), escaped
		}, _.extend = function(obj) {
			return each(slice.call(arguments, 1), function(source) {
				for (var prop in source) void 0 !== source[prop] && (obj[prop] = source[prop])
			}), obj
		}, _.isArray = nativeIsArray || function(obj) {
			return "[object Array]" === toString.call(obj)
		}, _.isFunction = function(f) {
			try {
				return /^\s*\bfunction\b/.test(f)
			} catch (x) {
				return !1
			}
		}, _.isArguments = function(obj) {
			return !(!obj || !hasOwnProperty.call(obj, "callee"))
		}, _.toArray = function(iterable) {
			return iterable ? iterable.toArray ? iterable.toArray() : _.isArray(iterable) ? slice.call(iterable) : _.isArguments(iterable) ? slice.call(iterable) : _.values(iterable) : []
		}, _.values = function(obj) {
			var results = [];
			return null == obj ? results : (each(obj, function(value) {
				results[results.length] = value
			}), results)
		}, _.identity = function(value) {
			return value
		}, _.include = function(obj, target) {
			var found = !1;
			return null == obj ? found : nativeIndexOf && obj.indexOf === nativeIndexOf ? obj.indexOf(target) != -1 : (each(obj, function(value) {
				if (found || (found = value === target)) return breaker
			}), found)
		}, _.includes = function(str, needle) {
			return str.indexOf(needle) !== -1
		}
	}(), _.inherit = function(subclass, superclass) {
		return subclass.prototype = new superclass, subclass.prototype.constructor = subclass, subclass.superclass = superclass.prototype, subclass
	}, _.isObject = function(obj) {
		return obj === Object(obj) && !_.isArray(obj)
	}, _.isEmptyObject = function(obj) {
		if (_.isObject(obj)) {
			for (var key in obj)
				if (hasOwnProperty.call(obj, key)) return !1;
			return !0
		}
		return !1
	}, _.isUndefined = function(obj) {
		return void 0 === obj
	}, _.isString = function(obj) {
		return "[object String]" == toString.call(obj)
	}, _.isDate = function(obj) {
		return "[object Date]" == toString.call(obj)
	}, _.isNumber = function(obj) {
		return "[object Number]" == toString.call(obj)
	}, _.isElement = function(obj) {
		return !(!obj || 1 !== obj.nodeType)
	}, _.encodeDates = function(obj) {
		return _.each(obj, function(v, k) {
			_.isDate(v) ? obj[k] = _.formatDate(v) : _.isObject(v) && (obj[k] = _.encodeDates(v))
		}), obj
	}, _.formatDate = function(d) {
		function pad(n) {
			return n < 10 ? "0" + n : n
		}
		return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()) + "T" + pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes()) + ":" + pad(d.getUTCSeconds())
	}, _.safewrap = function(f) {
		return function() {
			try {
				f.apply(this, arguments)
			} catch (e) {
				console.critical("Implementation error. Please contact support@mixpanel.com.")
			}
		}
	}, _.safewrap_class = function(klass, functions) {
		for (var i = 0; i < functions.length; i++) klass.prototype[functions[i]] = _.safewrap(klass.prototype[functions[i]])
	}, _.strip_empty_properties = function(p) {
		var ret = {};
		return _.each(p, function(v, k) {
			_.isString(v) && v.length > 0 && (ret[k] = v)
		}), ret
	}, _.truncate = function(obj, length) {
		var ret;
		return "string" == typeof obj ? ret = obj.slice(0, length) : _.isArray(obj) ? (ret = [], _.each(obj, function(val) {
			ret.push(_.truncate(val, length))
		})) : _.isObject(obj) ? (ret = {}, _.each(obj, function(val, key) {
			ret[key] = _.truncate(val, length)
		})) : ret = obj, ret
	}, _.JSONEncode = function() {
		return function(mixed_val) {
			var value = mixed_val,
				quote = function(string) {
					var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
						meta = {
							"\b": "\\b",
							"\t": "\\t",
							"\n": "\\n",
							"\f": "\\f",
							"\r": "\\r",
							'"': '\\"',
							"\\": "\\\\"
						};
					return escapable.lastIndex = 0, escapable.test(string) ? '"' + string.replace(escapable, function(a) {
						var c = meta[a];
						return "string" == typeof c ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
					}) + '"' : '"' + string + '"'
				},
				str = function(key, holder) {
					var gap = "",
						indent = "    ",
						i = 0,
						k = "",
						v = "",
						length = 0,
						mind = gap,
						partial = [],
						value = holder[key];
					switch (value && "object" == typeof value && "function" == typeof value.toJSON && (value = value.toJSON(key)), typeof value) {
						case "string":
							return quote(value);
						case "number":
							return isFinite(value) ? String(value) : "null";
						case "boolean":
						case "null":
							return String(value);
						case "object":
							if (!value) return "null";
							if (gap += indent, partial = [], "[object Array]" === toString.apply(value)) {
								for (length = value.length, i = 0; i < length; i += 1) partial[i] = str(i, value) || "null";
								return v = 0 === partial.length ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]", gap = mind, v
							}
							for (k in value) hasOwnProperty.call(value, k) && (v = str(k, value), v && partial.push(quote(k) + (gap ? ": " : ":") + v));
							return v = 0 === partial.length ? "{}" : gap ? "{" + partial.join(",") + mind + "}" : "{" + partial.join(",") + "}", gap = mind, v
					}
				};
			return str("", {
				"": value
			})
		}
	}(), _.JSONDecode = function() {
		var at, ch, text, value, escapee = {
				'"': '"',
				"\\": "\\",
				"/": "/",
				b: "\b",
				f: "\f",
				n: "\n",
				r: "\r",
				t: "\t"
			},
			error = function(m) {
				throw {
					name: "SyntaxError",
					message: m,
					at: at,
					text: text
				}
			},
			next = function(c) {
				return c && c !== ch && error("Expected '" + c + "' instead of '" + ch + "'"), ch = text.charAt(at), at += 1, ch
			},
			number = function() {
				var number, string = "";
				for ("-" === ch && (string = "-", next("-")); ch >= "0" && ch <= "9";) string += ch, next();
				if ("." === ch)
					for (string += "."; next() && ch >= "0" && ch <= "9";) string += ch;
				if ("e" === ch || "E" === ch)
					for (string += ch, next(), "-" !== ch && "+" !== ch || (string += ch, next()); ch >= "0" && ch <= "9";) string += ch, next();
				return number = +string, isFinite(number) ? number : void error("Bad number")
			},
			string = function() {
				var hex, i, uffff, string = "";
				if ('"' === ch)
					for (; next();) {
						if ('"' === ch) return next(), string;
						if ("\\" === ch)
							if (next(), "u" === ch) {
								for (uffff = 0, i = 0; i < 4 && (hex = parseInt(next(), 16), isFinite(hex)); i += 1) uffff = 16 * uffff + hex;
								string += String.fromCharCode(uffff)
							} else {
								if ("string" != typeof escapee[ch]) break;
								string += escapee[ch]
							}
						else string += ch
					}
				error("Bad string")
			},
			white = function() {
				for (; ch && ch <= " ";) next()
			},
			word = function() {
				switch (ch) {
					case "t":
						return next("t"), next("r"), next("u"), next("e"), !0;
					case "f":
						return next("f"), next("a"), next("l"), next("s"), next("e"), !1;
					case "n":
						return next("n"), next("u"), next("l"), next("l"), null
				}
				error("Unexpected '" + ch + "'")
			},
			array = function() {
				var array = [];
				if ("[" === ch) {
					if (next("["), white(), "]" === ch) return next("]"), array;
					for (; ch;) {
						if (array.push(value()), white(), "]" === ch) return next("]"), array;
						next(","), white()
					}
				}
				error("Bad array")
			},
			object = function() {
				var key, object = {};
				if ("{" === ch) {
					if (next("{"), white(), "}" === ch) return next("}"), object;
					for (; ch;) {
						if (key = string(), white(), next(":"), Object.hasOwnProperty.call(object, key) && error('Duplicate key "' + key + '"'), object[key] = value(), white(), "}" === ch) return next("}"), object;
						next(","), white()
					}
				}
				error("Bad object")
			};
		return value = function() {
				switch (white(), ch) {
					case "{":
						return object();
					case "[":
						return array();
					case '"':
						return string();
					case "-":
						return number();
					default:
						return ch >= "0" && ch <= "9" ? number() : word()
				}
			},
			function(source) {
				var result;
				return text = source, at = 0, ch = " ", result = value(), white(), ch && error("Syntax error"), result
			}
	}(), _.base64Encode = function(data) {
		var o1, o2, o3, h1, h2, h3, h4, bits, b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
			i = 0,
			ac = 0,
			enc = "",
			tmp_arr = [];
		if (!data) return data;
		data = _.utf8Encode(data);
		do o1 = data.charCodeAt(i++), o2 = data.charCodeAt(i++), o3 = data.charCodeAt(i++), bits = o1 << 16 | o2 << 8 | o3, h1 = bits >> 18 & 63, h2 = bits >> 12 & 63, h3 = bits >> 6 & 63, h4 = 63 & bits, tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4); while (i < data.length);
		switch (enc = tmp_arr.join(""), data.length % 3) {
			case 1:
				enc = enc.slice(0, -2) + "==";
				break;
			case 2:
				enc = enc.slice(0, -1) + "="
		}
		return enc
	}, _.utf8Encode = function(string) {
		string = (string + "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
		var start, end, n, utftext = "",
			stringl = 0;
		for (start = end = 0, stringl = string.length, n = 0; n < stringl; n++) {
			var c1 = string.charCodeAt(n),
				enc = null;
			c1 < 128 ? end++ : enc = c1 > 127 && c1 < 2048 ? String.fromCharCode(c1 >> 6 | 192, 63 & c1 | 128) : String.fromCharCode(c1 >> 12 | 224, c1 >> 6 & 63 | 128, 63 & c1 | 128), null !== enc && (end > start && (utftext += string.substring(start, end)), utftext += enc, start = end = n + 1)
		}
		return end > start && (utftext += string.substring(start, string.length)), utftext
	}, _.UUID = function() {
		var T = function() {
				for (var d = 1 * new Date, i = 0; d == 1 * new Date;) i++;
				return d.toString(16) + i.toString(16)
			},
			R = function() {
				return Math.random().toString(16).replace(".", "")
			},
			UA = function(n) {
				function xor(result, byte_array) {
					var j, tmp = 0;
					for (j = 0; j < byte_array.length; j++) tmp |= buffer[j] << 8 * j;
					return result ^ tmp
				}
				var i, ch, ua = userAgent,
					buffer = [],
					ret = 0;
				for (i = 0; i < ua.length; i++) ch = ua.charCodeAt(i), buffer.unshift(255 & ch), buffer.length >= 4 && (ret = xor(ret, buffer), buffer = []);
				return buffer.length > 0 && (ret = xor(ret, buffer)), ret.toString(16)
			};
		return function() {
			var se = (screen.height * screen.width).toString(16);
			return T() + "-" + R() + "-" + UA() + "-" + se + "-" + T()
		}
	}(), _.isBlockedUA = function(ua) {
		return !!/(google web preview|baiduspider|yandexbot|bingbot|googlebot|yahoo! slurp)/i.test(ua)
	}, _.HTTPBuildQuery = function(formdata, arg_separator) {
		var use_val, use_key, tmp_arr = [];
		return _.isUndefined(arg_separator) && (arg_separator = "&"), _.each(formdata, function(val, key) {
			use_val = encodeURIComponent(val.toString()), use_key = encodeURIComponent(key), tmp_arr[tmp_arr.length] = use_key + "=" + use_val
		}), tmp_arr.join(arg_separator)
	}, _.getQueryParam = function(url, param) {
		param = param.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regexS = "[\\?&]" + param + "=([^&#]*)",
			regex = new RegExp(regexS),
			results = regex.exec(url);
		return null === results || results && "string" != typeof results[1] && results[1].length ? "" : decodeURIComponent(results[1]).replace(/\+/g, " ")
	}, _.cookie = {
		get: function(name) {
			for (var nameEQ = name + "=", ca = document.cookie.split(";"), i = 0; i < ca.length; i++) {
				for (var c = ca[i];
					" " == c.charAt(0);) c = c.substring(1, c.length);
				if (0 == c.indexOf(nameEQ)) return decodeURIComponent(c.substring(nameEQ.length, c.length))
			}
			return null
		},
		parse: function(name) {
			var cookie;
			try {
				cookie = _.JSONDecode(_.cookie.get(name)) || {}
			} catch (err) {}
			return cookie
		},
		set: function(name, value, days, cross_subdomain, is_secure) {
			var cdomain = "",
				expires = "",
				secure = "";
			if (cross_subdomain) {
				var matches = document.location.hostname.match(/[a-z0-9][a-z0-9\-]+\.[a-z\.]{2,6}$/i),
					domain = matches ? matches[0] : "";
				cdomain = domain ? "; domain=." + domain : ""
			}
			if (days) {
				var date = new Date;
				date.setTime(date.getTime() + 24 * days * 60 * 60 * 1e3), expires = "; expires=" + date.toGMTString()
			}
			is_secure && (secure = "; secure"), document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/" + cdomain + secure
		},
		remove: function(name, cross_subdomain) {
			_.cookie.set(name, "", -1, cross_subdomain)
		}
	}, _.localStorage = {
		error: function(msg) {
			console.error("localStorage error: " + msg)
		},
		get: function(name) {
			try {
				return window.localStorage.getItem(name)
			} catch (err) {
				_.localStorage.error(err)
			}
			return null
		},
		parse: function(name) {
			try {
				return _.JSONDecode(_.localStorage.get(name)) || {}
			} catch (err) {}
			return null
		},
		set: function(name, value) {
			try {
				window.localStorage.setItem(name, value)
			} catch (err) {
				_.localStorage.error(err)
			}
		},
		remove: function(name) {
			try {
				window.localStorage.removeItem(name)
			} catch (err) {
				_.localStorage.error(err)
			}
		}
	}, _.register_event = function() {
		function makeHandler(element, new_handler, old_handlers) {
			var handler = function(event) {
				if (event = event || fixEvent(window.event)) {
					var old_result, new_result, ret = !0;
					return _.isFunction(old_handlers) && (old_result = old_handlers(event)), new_result = new_handler.call(element, event), !1 !== old_result && !1 !== new_result || (ret = !1), ret
				}
			};
			return handler
		}

		function fixEvent(event) {
			return event && (event.preventDefault = fixEvent.preventDefault, event.stopPropagation = fixEvent.stopPropagation), event
		}
		var register_event = function(element, type, handler, oldSchool) {
			if (!element) return void console.error("No valid element provided to register_event");
			if (element.addEventListener && !oldSchool) element.addEventListener(type, handler, !1);
			else {
				var ontype = "on" + type,
					old_handler = element[ontype];
				element[ontype] = makeHandler(element, handler, old_handler)
			}
		};
		return fixEvent.preventDefault = function() {
			this.returnValue = !1
		}, fixEvent.stopPropagation = function() {
			this.cancelBubble = !0
		}, register_event
	}(), _.dom_query = function() {
		function getAllChildren(e) {
			return e.all ? e.all : e.getElementsByTagName("*")
		}

		function hasClass(elem, selector) {
			var className = " " + selector + " ";
			return (" " + elem.className + " ").replace(bad_whitespace, " ").indexOf(className) >= 0
		}

		function getElementsBySelector(selector) {
			if (!document.getElementsByTagName) return new Array;
			for (var token, tokens = selector.split(" "), currentContext = new Array(document), i = 0; i < tokens.length; i++)
				if (token = tokens[i].replace(/^\s+/, "").replace(/\s+$/, ""), token.indexOf("#") > -1) {
					var bits = token.split("#"),
						tagName = bits[0],
						id = bits[1],
						element = document.getElementById(id);
					if (!element || tagName && element.nodeName.toLowerCase() != tagName) return new Array;
					currentContext = new Array(element)
				} else if (token.indexOf(".") > -1) {
				var bits = token.split("."),
					tagName = bits[0],
					className = bits[1];
				tagName || (tagName = "*");
				for (var found = new Array, foundCount = 0, h = 0; h < currentContext.length; h++) {
					var elements;
					elements = "*" == tagName ? getAllChildren(currentContext[h]) : currentContext[h].getElementsByTagName(tagName);
					for (var j = 0; j < elements.length; j++) found[foundCount++] = elements[j]
				}
				currentContext = new Array;
				for (var currentContextIndex = 0, k = 0; k < found.length; k++) found[k].className && _.isString(found[k].className) && hasClass(found[k], className) && (currentContext[currentContextIndex++] = found[k])
			} else {
				var token_match = token.match(/^(\w*)\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/);
				if (token_match) {
					var tagName = token_match[1],
						attrName = token_match[2],
						attrOperator = token_match[3],
						attrValue = token_match[4];
					tagName || (tagName = "*");
					for (var found = new Array, foundCount = 0, h = 0; h < currentContext.length; h++) {
						var elements;
						elements = "*" == tagName ? getAllChildren(currentContext[h]) : currentContext[h].getElementsByTagName(tagName);
						for (var j = 0; j < elements.length; j++) found[foundCount++] = elements[j]
					}
					currentContext = new Array;
					var checkFunction, currentContextIndex = 0;
					switch (attrOperator) {
						case "=":
							checkFunction = function(e) {
								return e.getAttribute(attrName) == attrValue
							};
							break;
						case "~":
							checkFunction = function(e) {
								return e.getAttribute(attrName).match(new RegExp("\\b" + attrValue + "\\b"))
							};
							break;
						case "|":
							checkFunction = function(e) {
								return e.getAttribute(attrName).match(new RegExp("^" + attrValue + "-?"))
							};
							break;
						case "^":
							checkFunction = function(e) {
								return 0 == e.getAttribute(attrName).indexOf(attrValue)
							};
							break;
						case "$":
							checkFunction = function(e) {
								return e.getAttribute(attrName).lastIndexOf(attrValue) == e.getAttribute(attrName).length - attrValue.length
							};
							break;
						case "*":
							checkFunction = function(e) {
								return e.getAttribute(attrName).indexOf(attrValue) > -1
							};
							break;
						default:
							checkFunction = function(e) {
								return e.getAttribute(attrName)
							}
					}
					currentContext = new Array, currentContextIndex = 0;
					for (var k = 0; k < found.length; k++) checkFunction(found[k]) && (currentContext[currentContextIndex++] = found[k])
				} else {
					tagName = token;
					for (var found = new Array, foundCount = 0, h = 0; h < currentContext.length; h++)
						for (var elements = currentContext[h].getElementsByTagName(tagName), j = 0; j < elements.length; j++) found[foundCount++] = elements[j];
					currentContext = found
				}
			}
			return currentContext
		}
		var bad_whitespace = /[\t\r\n]/g;
		return function(query) {
			return _.isElement(query) ? [query] : _.isObject(query) && !_.isUndefined(query.length) ? query : getElementsBySelector.call(this, query)
		}
	}(), _.info = {
		campaignParams: function() {
			var campaign_keywords = "utm_source utm_medium utm_campaign utm_content utm_term".split(" "),
				kw = "",
				params = {};
			return _.each(campaign_keywords, function(kwkey) {
				kw = _.getQueryParam(document.URL, kwkey), kw.length && (params[kwkey] = kw)
			}), params
		},
		searchEngine: function(referrer) {
			return 0 === referrer.search("https?://(.*)google.([^/?]*)") ? "google" : 0 === referrer.search("https?://(.*)bing.com") ? "bing" : 0 === referrer.search("https?://(.*)yahoo.com") ? "yahoo" : 0 === referrer.search("https?://(.*)duckduckgo.com") ? "duckduckgo" : null
		},
		searchInfo: function(referrer) {
			var search = _.info.searchEngine(referrer),
				param = "yahoo" != search ? "q" : "p",
				ret = {};
			if (null !== search) {
				ret.$search_engine = search;
				var keyword = _.getQueryParam(referrer, param);
				keyword.length && (ret.mp_keyword = keyword)
			}
			return ret
		},
		browser: function(user_agent, vendor, opera) {
			var vendor = vendor || "";
			return opera || _.includes(user_agent, " OPR/") ? _.includes(user_agent, "Mini") ? "Opera Mini" : "Opera" : /(BlackBerry|PlayBook|BB10)/i.test(user_agent) ? "BlackBerry" : _.includes(user_agent, "IEMobile") || _.includes(user_agent, "WPDesktop") ? "Internet Explorer Mobile" : _.includes(user_agent, "Edge") ? "Microsoft Edge" : _.includes(user_agent, "FBIOS") ? "Facebook Mobile" : _.includes(user_agent, "Chrome") ? "Chrome" : _.includes(user_agent, "CriOS") ? "Chrome iOS" : _.includes(user_agent, "FxiOS") ? "Firefox iOS" : _.includes(vendor, "Apple") ? _.includes(user_agent, "Mobile") ? "Mobile Safari" : "Safari" : _.includes(user_agent, "Android") ? "Android Mobile" : _.includes(user_agent, "Konqueror") ? "Konqueror" : _.includes(user_agent, "Firefox") ? "Firefox" : _.includes(user_agent, "MSIE") || _.includes(user_agent, "Trident/") ? "Internet Explorer" : _.includes(user_agent, "Gecko") ? "Mozilla" : ""
		},
		browserVersion: function(userAgent, vendor, opera) {
			var browser = _.info.browser(userAgent, vendor, opera),
				versionRegexs = {
					"Internet Explorer Mobile": /rv:(\d+(\.\d+)?)/,
					"Microsoft Edge": /Edge\/(\d+(\.\d+)?)/,
					Chrome: /Chrome\/(\d+(\.\d+)?)/,
					"Chrome iOS": /CriOS\/(\d+(\.\d+)?)/,
					Safari: /Version\/(\d+(\.\d+)?)/,
					"Mobile Safari": /Version\/(\d+(\.\d+)?)/,
					Opera: /(Opera|OPR)\/(\d+(\.\d+)?)/,
					Firefox: /Firefox\/(\d+(\.\d+)?)/,
					"Firefox iOS": /FxiOS\/(\d+(\.\d+)?)/,
					Konqueror: /Konqueror:(\d+(\.\d+)?)/,
					BlackBerry: /BlackBerry (\d+(\.\d+)?)/,
					"Android Mobile": /android\s(\d+(\.\d+)?)/,
					"Internet Explorer": /(rv:|MSIE )(\d+(\.\d+)?)/,
					Mozilla: /rv:(\d+(\.\d+)?)/
				},
				regex = versionRegexs[browser];
			if (void 0 == regex) return null;
			var matches = userAgent.match(regex);
			return matches ? parseFloat(matches[matches.length - 2]) : null
		},
		os: function() {
			var a = userAgent;
			return /Windows/i.test(a) ? /Phone/.test(a) || /WPDesktop/.test(a) ? "Windows Phone" : "Windows" : /(iPhone|iPad|iPod)/.test(a) ? "iOS" : /Android/.test(a) ? "Android" : /(BlackBerry|PlayBook|BB10)/i.test(a) ? "BlackBerry" : /Mac/i.test(a) ? "Mac OS X" : /Linux/.test(a) ? "Linux" : ""
		},
		device: function(user_agent) {
			return /Windows Phone/i.test(user_agent) || /WPDesktop/.test(user_agent) ? "Windows Phone" : /iPad/.test(user_agent) ? "iPad" : /iPod/.test(user_agent) ? "iPod Touch" : /iPhone/.test(user_agent) ? "iPhone" : /(BlackBerry|PlayBook|BB10)/i.test(user_agent) ? "BlackBerry" : /Android/.test(user_agent) ? "Android" : ""
		},
		referringDomain: function(referrer) {
			var split = referrer.split("/");
			return split.length >= 3 ? split[2] : ""
		},
		properties: function() {
			return _.extend(_.strip_empty_properties({
				$os: _.info.os(),
				$browser: _.info.browser(userAgent, navigator.vendor, window.opera),
				$referrer: document.referrer,
				$referring_domain: _.info.referringDomain(document.referrer),
				$device: _.info.device(userAgent)
			}), {
				$current_url: window.location.href,
				$browser_version: _.info.browserVersion(userAgent, navigator.vendor, window.opera),
				$screen_height: screen.height,
				$screen_width: screen.width,
				mp_lib: "web",
				$lib_version: LIB_VERSION
			})
		},
		people_properties: function() {
			return _.extend(_.strip_empty_properties({
				$os: _.info.os(),
				$browser: _.info.browser(userAgent, navigator.vendor, window.opera)
			}), {
				$browser_version: _.info.browserVersion(userAgent, navigator.vendor, window.opera)
			})
		},
		pageviewInfo: function(page) {
			return _.strip_empty_properties({
				mp_page: page,
				mp_referrer: document.referrer,
				mp_browser: _.info.browser(userAgent, navigator.vendor, window.opera),
				mp_platform: _.info.os()
			})
		}
	};
	var console = {
			log: function() {
				if (DEBUG && !_.isUndefined(windowConsole) && windowConsole) try {
					windowConsole.log.apply(windowConsole, arguments)
				} catch (err) {
					_.each(arguments, function(arg) {
						windowConsole.log(arg)
					})
				}
			},
			error: function() {
				if (DEBUG && !_.isUndefined(windowConsole) && windowConsole) {
					var args = ["Mixpanel error:"].concat(_.toArray(arguments));
					try {
						windowConsole.error.apply(windowConsole, args)
					} catch (err) {
						_.each(args, function(arg) {
							windowConsole.error(arg)
						})
					}
				}
			},
			critical: function() {
				if (!_.isUndefined(windowConsole) && windowConsole) {
					var args = ["Mixpanel error:"].concat(_.toArray(arguments));
					try {
						windowConsole.error.apply(windowConsole, args)
					} catch (err) {
						_.each(args, function(arg) {
							windowConsole.error(arg)
						})
					}
				}
			}
		},
		DomTracker = function() {};
	DomTracker.prototype.create_properties = function() {}, DomTracker.prototype.event_handler = function() {}, DomTracker.prototype.after_track_handler = function() {}, DomTracker.prototype.init = function(mixpanel_instance) {
		return this.mp = mixpanel_instance, this
	}, DomTracker.prototype.track = function(query, event_name, properties, user_callback) {
		var that = this,
			elements = _.dom_query(query);
		return 0 == elements.length ? void console.error("The DOM query (" + query + ") returned 0 elements") : (_.each(elements, function(element) {
			_.register_event(element, this.override_event, function(e) {
				var options = {},
					props = that.create_properties(properties, this),
					timeout = that.mp.get_config("track_links_timeout");
				that.event_handler(e, this, options), window.setTimeout(that.track_callback(user_callback, props, options, !0), timeout), that.mp.track(event_name, props, that.track_callback(user_callback, props, options))
			})
		}, this), !0)
	}, DomTracker.prototype.track_callback = function(user_callback, props, options, timeout_occured) {
		timeout_occured = timeout_occured || !1;
		var that = this;
		return function() {
			options.callback_fired || (options.callback_fired = !0, user_callback && user_callback(timeout_occured, props) === !1 || that.after_track_handler(props, options, timeout_occured))
		}
	}, DomTracker.prototype.create_properties = function(properties, element) {
		var props;
		return props = "function" == typeof properties ? properties(element) : _.extend({}, properties)
	};
	var LinkTracker = function() {
		this.override_event = "click"
	};
	_.inherit(LinkTracker, DomTracker), LinkTracker.prototype.create_properties = function(properties, element) {
		var props = LinkTracker.superclass.create_properties.apply(this, arguments);
		return element.href && (props.url = element.href), props
	}, LinkTracker.prototype.event_handler = function(evt, element, options) {
		options.new_tab = 2 === evt.which || evt.metaKey || evt.ctrlKey || "_blank" === element.target, options.href = element.href, options.new_tab || evt.preventDefault()
	}, LinkTracker.prototype.after_track_handler = function(props, options, timeout_occured) {
		options.new_tab || setTimeout(function() {
			window.location = options.href
		}, 0)
	};
	var FormTracker = function() {
		this.override_event = "submit"
	};
	_.inherit(FormTracker, DomTracker), FormTracker.prototype.event_handler = function(evt, element, options) {
		options.element = element, evt.preventDefault()
	}, FormTracker.prototype.after_track_handler = function(props, options, timeout_occured) {
		setTimeout(function() {
			options.element.submit()
		}, 0)
	};
	var MixpanelPersistence = function(config) {
		this.props = {}, this.campaign_params_saved = !1, config.persistence_name ? this.name = "mp_" + config.persistence_name : this.name = "mp_" + config.token + "_mixpanel";
		var storage_type = config.persistence;
		"cookie" !== storage_type && "localStorage" !== storage_type && (console.critical('Unknown persistence type "' + storage_type + '"; falling back to "cookie"'), storage_type = config.persistence = "cookie");
		var localStorage_supported = function() {
			var supported = !0;
			try {
				var key = "__mplssupport__",
					val = "xyz";
				_.localStorage.set(key, val), _.localStorage.get(key) !== val && (supported = !1), _.localStorage.remove(key)
			} catch (err) {
				supported = !1
			}
			return supported || console.error("localStorage unsupported; falling back to cookie store"), supported
		};
		"localStorage" === storage_type && localStorage_supported() ? this.storage = _.localStorage : this.storage = _.cookie, this.load(), this.update_config(config), this.upgrade(config), this.save()
	};
	MixpanelPersistence.prototype.properties = function() {
		var p = {};
		return _.each(this.props, function(v, k) {
			_.include(RESERVED_PROPERTIES, k) || (p[k] = v)
		}), p
	}, MixpanelPersistence.prototype.load = function() {
		if (!this.disabled) {
			var entry = this.storage.parse(this.name);
			entry && (this.props = _.extend({}, entry))
		}
	}, MixpanelPersistence.prototype.upgrade = function(config) {
		var old_cookie_name, old_cookie, upgrade_from_old_lib = config.upgrade;
		upgrade_from_old_lib && (old_cookie_name = "mp_super_properties", "string" == typeof upgrade_from_old_lib && (old_cookie_name = upgrade_from_old_lib), old_cookie = this.storage.parse(old_cookie_name), this.storage.remove(old_cookie_name), this.storage.remove(old_cookie_name, !0), old_cookie && (this.props = _.extend(this.props, old_cookie.all, old_cookie.events))), config.cookie_name || "mixpanel" === config.name || (old_cookie_name = "mp_" + config.token + "_" + config.name, old_cookie = this.storage.parse(old_cookie_name), old_cookie && (this.storage.remove(old_cookie_name), this.storage.remove(old_cookie_name, !0), this.register_once(old_cookie))), this.storage === _.localStorage && (old_cookie = _.cookie.parse(this.name), _.cookie.remove(this.name), _.cookie.remove(this.name, !0), old_cookie && this.register_once(old_cookie))
	}, MixpanelPersistence.prototype.save = function() {
		this.disabled || (this._expire_notification_campaigns(), this.storage.set(this.name, _.JSONEncode(this.props), this.expire_days, this.cross_subdomain, this.secure))
	}, MixpanelPersistence.prototype.remove = function() {
		this.storage.remove(this.name, !1), this.storage.remove(this.name, !0)
	}, MixpanelPersistence.prototype.clear = function() {
		this.remove(), this.props = {}
	}, MixpanelPersistence.prototype.register_once = function(props, default_value, days) {
		return !!_.isObject(props) && ("undefined" == typeof default_value && (default_value = "None"), this.expire_days = "undefined" == typeof days ? this.default_expiry : days, _.each(props, function(val, prop) {
			this.props[prop] && this.props[prop] !== default_value || (this.props[prop] = val)
		}, this), this.save(), !0)
	}, MixpanelPersistence.prototype.register = function(props, days) {
		return !!_.isObject(props) && (this.expire_days = "undefined" == typeof days ? this.default_expiry : days, _.extend(this.props, props), this.save(), !0)
	}, MixpanelPersistence.prototype.unregister = function(prop) {
		prop in this.props && (delete this.props[prop], this.save())
	}, MixpanelPersistence.prototype._expire_notification_campaigns = _.safewrap(function() {
		var campaigns_shown = this.props[CAMPAIGN_IDS_KEY],
			EXPIRY_TIME = DEBUG ? 6e4 : 36e5;
		if (campaigns_shown) {
			for (var campaign_id in campaigns_shown) 1 * new Date - campaigns_shown[campaign_id] > EXPIRY_TIME && delete campaigns_shown[campaign_id];
			_.isEmptyObject(campaigns_shown) && delete this.props[CAMPAIGN_IDS_KEY]
		}
	}), MixpanelPersistence.prototype.update_campaign_params = function() {
		this.campaign_params_saved || (this.register_once(_.info.campaignParams()), this.campaign_params_saved = !0)
	}, MixpanelPersistence.prototype.update_search_keyword = function(referrer) {
		this.register(_.info.searchInfo(referrer))
	}, MixpanelPersistence.prototype.update_referrer_info = function(referrer) {
		this.register_once({
			$initial_referrer: referrer || "$direct",
			$initial_referring_domain: _.info.referringDomain(referrer) || "$direct"
		}, "")
	}, MixpanelPersistence.prototype.get_referrer_info = function() {
		return _.strip_empty_properties({
			$initial_referrer: this.props.$initial_referrer,
			$initial_referring_domain: this.props.$initial_referring_domain
		})
	}, MixpanelPersistence.prototype.safe_merge = function(props) {
		return _.each(this.props, function(val, prop) {
			prop in props || (props[prop] = val)
		}), props
	}, MixpanelPersistence.prototype.update_config = function(config) {
		this.default_expiry = this.expire_days = config.cookie_expiration, this.set_disabled(config.disable_persistence), this.set_cross_subdomain(config.cross_subdomain_cookie), this.set_secure(config.secure_cookie)
	}, MixpanelPersistence.prototype.set_disabled = function(disabled) {
		this.disabled = disabled, this.disabled && this.remove()
	}, MixpanelPersistence.prototype.set_cross_subdomain = function(cross_subdomain) {
		cross_subdomain !== this.cross_subdomain && (this.cross_subdomain = cross_subdomain, this.remove(), this.save())
	}, MixpanelPersistence.prototype.get_cross_subdomain = function() {
		return this.cross_subdomain
	}, MixpanelPersistence.prototype.set_secure = function(secure) {
		secure !== this.secure && (this.secure = !!secure, this.remove(), this.save())
	}, MixpanelPersistence.prototype._add_to_people_queue = function(queue, data) {
		var q_key = this._get_queue_key(queue),
			q_data = data[queue],
			set_q = this._get_or_create_queue(SET_ACTION),
			set_once_q = this._get_or_create_queue(SET_ONCE_ACTION),
			add_q = this._get_or_create_queue(ADD_ACTION),
			union_q = this._get_or_create_queue(UNION_ACTION),
			append_q = this._get_or_create_queue(APPEND_ACTION, []);
		q_key === SET_QUEUE_KEY ? (_.extend(set_q, q_data), this._pop_from_people_queue(ADD_ACTION, q_data), this._pop_from_people_queue(UNION_ACTION, q_data)) : q_key === SET_ONCE_QUEUE_KEY ? _.each(q_data, function(v, k) {
			k in set_once_q || (set_once_q[k] = v)
		}) : q_key === ADD_QUEUE_KEY ? _.each(q_data, function(v, k) {
			k in set_q ? set_q[k] += v : (k in add_q || (add_q[k] = 0), add_q[k] += v)
		}, this) : q_key === UNION_QUEUE_KEY ? _.each(q_data, function(v, k) {
			_.isArray(v) && (k in union_q || (union_q[k] = []), union_q[k] = union_q[k].concat(v))
		}) : q_key === APPEND_QUEUE_KEY && append_q.push(q_data), console.log("MIXPANEL PEOPLE REQUEST (QUEUED, PENDING IDENTIFY):"), console.log(data), this.save()
	}, MixpanelPersistence.prototype._pop_from_people_queue = function(queue, data) {
		var q = this._get_queue(queue);
		_.isUndefined(q) || (_.each(data, function(v, k) {
			delete q[k]
		}, this), this.save())
	}, MixpanelPersistence.prototype._get_queue_key = function(queue) {
		return queue === SET_ACTION ? SET_QUEUE_KEY : queue === SET_ONCE_ACTION ? SET_ONCE_QUEUE_KEY : queue === ADD_ACTION ? ADD_QUEUE_KEY : queue === APPEND_ACTION ? APPEND_QUEUE_KEY : queue === UNION_ACTION ? UNION_QUEUE_KEY : void console.error("Invalid queue:", queue)
	}, MixpanelPersistence.prototype._get_queue = function(queue) {
		return this.props[this._get_queue_key(queue)]
	}, MixpanelPersistence.prototype._get_or_create_queue = function(queue, default_val) {
		var key = this._get_queue_key(queue),
			default_val = _.isUndefined(default_val) ? {} : default_val;
		return this.props[key] || (this.props[key] = default_val)
	}, MixpanelPersistence.prototype.set_event_timer = function(event_name, timestamp) {
		var timers = this.props[EVENT_TIMERS_KEY] || {};
		timers[event_name] = timestamp, this.props[EVENT_TIMERS_KEY] = timers, this.save()
	}, MixpanelPersistence.prototype.remove_event_timer = function(event_name) {
		var timers = this.props[EVENT_TIMERS_KEY] || {},
			timestamp = timers[event_name];
		return _.isUndefined(timestamp) || (delete this.props[EVENT_TIMERS_KEY][event_name], this.save()), timestamp
	};
	var create_mplib = function(token, config, name) {
			var instance, target = name === PRIMARY_INSTANCE_NAME ? mixpanel_master : mixpanel_master[name];
			if (target && init_type === INIT_MODULE) instance = target;
			else {
				if (target && !_.isArray(target)) return void console.error("You have already initialized " + name);
				instance = new MixpanelLib
			}
			instance._init(token, config, name), instance.people = new MixpanelPeople, instance.people._init(instance), DEBUG = DEBUG || instance.get_config("debug"), !_.isUndefined(target) && _.isArray(target) && (instance._execute_array.call(instance.people, target.people), instance._execute_array(target));
			try {
				add_dom_event_handlers(instance)
			} catch (e) {
				console.error(e)
			}
			return instance
		},
		MixpanelLib = function() {};
	MixpanelLib.prototype.init = function(token, config, name) {
		if (_.isUndefined(name)) return void console.error("You must name your new library: init(token, config, name)");
		if (name === PRIMARY_INSTANCE_NAME) return void console.error("You must initialize the main mixpanel object right after you include the Mixpanel js snippet");
		var instance = create_mplib(token, config, name);
		return mixpanel_master[name] = instance, instance._loaded(), instance
	}, MixpanelLib.prototype._init = function(token, config, name) {
		this.__loaded = !0, this.config = {}, this.set_config(_.extend({}, DEFAULT_CONFIG, config, {
			name: name,
			token: token,
			callback_fn: (name === PRIMARY_INSTANCE_NAME ? name : PRIMARY_INSTANCE_NAME + "." + name) + "._jsc"
		})), this._jsc = function() {}, this.__dom_loaded_queue = [], this.__request_queue = [], this.__disabled_events = [], this._flags = {
			disable_all_events: !1,
			identify_called: !1
		}, this.persistence = this.cookie = new MixpanelPersistence(this.config), this.register_once({
			distinct_id: _.UUID()
		}, "")
	}, MixpanelLib.prototype._loaded = function() {
		this.get_config("loaded")(this), this.get_config("track_pageview") && this.track_pageview()
	}, MixpanelLib.prototype._dom_loaded = function() {
		_.each(this.__dom_loaded_queue, function(item) {
			this._track_dom.apply(this, item)
		}, this), _.each(this.__request_queue, function(item) {
			this._send_request.apply(this, item)
		}, this), delete this.__dom_loaded_queue, delete this.__request_queue
	}, MixpanelLib.prototype._track_dom = function(DomClass, args) {
		if (this.get_config("img")) return console.error("You can't use DOM tracking functions with img = true."), !1;
		if (!DOM_LOADED) return this.__dom_loaded_queue.push([DomClass, args]), !1;
		var dt = (new DomClass).init(this);
		return dt.track.apply(dt, args)
	}, MixpanelLib.prototype._prepare_callback = function(callback, data) {
		if (_.isUndefined(callback)) return null;
		if (USE_XHR) {
			var callback_function = function(response) {
				callback(response, data)
			};
			return callback_function
		}
		var jsc = this._jsc,
			randomized_cb = "" + Math.floor(1e8 * Math.random()),
			callback_string = this.get_config("callback_fn") + '["' + randomized_cb + '"]';
		return jsc[randomized_cb] = function(response) {
			delete jsc[randomized_cb], callback(response, data)
		}, callback_string
	}, MixpanelLib.prototype._send_request = function(url, data, callback) {
		if (ENQUEUE_REQUESTS) return void this.__request_queue.push(arguments);
		var verbose_mode = this.get_config("verbose");
		if (data.verbose && (verbose_mode = !0), this.get_config("test") && (data.test = 1), verbose_mode && (data.verbose = 1), this.get_config("img") && (data.img = 1), USE_XHR || (callback ? data.callback = callback : (verbose_mode || this.get_config("test")) && (data.callback = "(function(){})")), data.ip = this.get_config("ip") ? 1 : 0, data._ = (new Date).getTime().toString(), url += "?" + _.HTTPBuildQuery(data), "img" in data) {
			var img = document.createElement("img");
			img.src = url, document.body.appendChild(img)
		} else if (USE_XHR) try {
			var req = new XMLHttpRequest;
			req.open("GET", url, !0), req.withCredentials = !0, req.onreadystatechange = function(e) {
				if (4 === req.readyState)
					if (200 === req.status) callback && callback(verbose_mode ? _.JSONDecode(req.responseText) : Number(req.responseText));
					else {
						var error = "Bad HTTP status: " + req.status + " " + req.statusText;
						console.error(error), callback && callback(verbose_mode ? {
							status: 0,
							error: error
						} : 0)
					}
			}, req.send(null)
		} catch (e) {
			console.error(e)
		} else {
			var script = document.createElement("script");
			script.type = "text/javascript", script.async = !0, script.defer = !0, script.src = url;
			var s = document.getElementsByTagName("script")[0];
			s.parentNode.insertBefore(script, s)
		}
	}, MixpanelLib.prototype._execute_array = function(array) {
		var fn_name, alias_calls = [],
			other_calls = [],
			tracking_calls = [];
		_.each(array, function(item) {
			item && (fn_name = item[0], "function" == typeof item ? item.call(this) : _.isArray(item) && "alias" === fn_name ? alias_calls.push(item) : _.isArray(item) && fn_name.indexOf("track") != -1 && "function" == typeof this[fn_name] ? tracking_calls.push(item) : other_calls.push(item))
		}, this);
		var execute = function(calls, context) {
			_.each(calls, function(item) {
				this[item[0]].apply(this, item.slice(1))
			}, context)
		};
		execute(alias_calls, this), execute(other_calls, this), execute(tracking_calls, this)
	}, MixpanelLib.prototype.push = function(item) {
		this._execute_array([item])
	}, MixpanelLib.prototype.disable = function(events) {
		"undefined" == typeof events ? this._flags.disable_all_events = !0 : this.__disabled_events = this.__disabled_events.concat(events)
	}, MixpanelLib.prototype.track = function(event_name, properties, callback) {
		if (_.isUndefined(event_name)) return void console.error("No event name provided to mixpanel.track");
		if (this._event_is_disabled(event_name)) return void("undefined" != typeof callback && callback(0));
		properties = properties || {}, properties.token = this.get_config("token");
		var start_timestamp = this.persistence.remove_event_timer(event_name);
		if (!_.isUndefined(start_timestamp)) {
			var duration_in_ms = (new Date).getTime() - start_timestamp;
			properties.$duration = parseFloat((duration_in_ms / 1e3).toFixed(3))
		}
		this.persistence.update_search_keyword(document.referrer), this.get_config("store_google") && this.persistence.update_campaign_params(), this.get_config("save_referrer") && this.persistence.update_referrer_info(document.referrer), properties = _.extend({}, _.info.properties(), this.persistence.properties(), properties);
		try {
			if (this.mp_counts && "mp_page_view" !== event_name && "$create_alias" !== event_name) {
				properties = _.extend({}, properties, this.mp_counts), this.mp_counts = {}, this.mp_counts.$__c = 0, this.mp_counts.$__c3 = 0, this.mp_counts.$__c4 = 0, this.mp_counts.$__c5 = 0;
				var name = this.get_config("name");
				_.cookie.set("mp_" + name + "__c", 0, 1, !0), _.cookie.set("mp_" + name + "__c3", 0, 1, !0), _.cookie.set("mp_" + name + "__c4", 0, 1, !0), _.cookie.set("mp_" + name + "__c5", 0, 1, !0)
			}
		} catch (e) {
			console.error(e)
		}
		var property_blacklist = this.get_config("property_blacklist");
		_.isArray(property_blacklist) ? _.each(property_blacklist, function(blacklisted_prop) {
			delete properties[blacklisted_prop]
		}) : console.error("Invalid value for property_blacklist config: " + property_blacklist);
		var data = {
				event: event_name,
				properties: properties
			},
			truncated_data = _.truncate(data, 255),
			json_data = _.JSONEncode(truncated_data),
			encoded_data = _.base64Encode(json_data);
		return console.log("MIXPANEL REQUEST:"), console.log(truncated_data), this._send_request(this.get_config("api_host") + "/track/", {
			data: encoded_data
		}, this._prepare_callback(callback, truncated_data)), truncated_data
	}, MixpanelLib.prototype.track_pageview = function(page) {
		_.isUndefined(page) && (page = document.location.href), this.track("mp_page_view", _.info.pageviewInfo(page))
	}, MixpanelLib.prototype.track_links = function() {
		return this._track_dom.call(this, LinkTracker, arguments)
	}, MixpanelLib.prototype.track_forms = function() {
		return this._track_dom.call(this, FormTracker, arguments)
	}, MixpanelLib.prototype.time_event = function(event_name) {
		return _.isUndefined(event_name) ? void console.error("No event name provided to mixpanel.time_event") : void(this._event_is_disabled(event_name) || this.persistence.set_event_timer(event_name, (new Date).getTime()))
	}, MixpanelLib.prototype.register = function(props, days) {
		this.persistence.register(props, days)
	}, MixpanelLib.prototype.register_once = function(props, default_value, days) {
		this.persistence.register_once(props, default_value, days)
	}, MixpanelLib.prototype.unregister = function(property) {
		this.persistence.unregister(property)
	}, MixpanelLib.prototype._register_single = function(prop, value) {
		var props = {};
		props[prop] = value, this.register(props)
	}, MixpanelLib.prototype.identify = function(unique_id, _set_callback, _add_callback, _append_callback, _set_once_callback, _union_callback) {
		unique_id != this.get_distinct_id() && unique_id != this.get_property(ALIAS_ID_KEY) && (this.unregister(ALIAS_ID_KEY), this._register_single("distinct_id", unique_id)), this._check_and_handle_notifications(this.get_distinct_id()), this._flags.identify_called = !0, this.people._flush(_set_callback, _add_callback, _append_callback, _set_once_callback, _union_callback)
	}, MixpanelLib.prototype.reset = function() {
		this.persistence.clear(), this.register_once({
			distinct_id: _.UUID()
		}, "")
	}, MixpanelLib.prototype.get_distinct_id = function() {
		return this.get_property("distinct_id")
	}, MixpanelLib.prototype.alias = function(alias, original) {
		if (alias === this.get_property(PEOPLE_DISTINCT_ID_KEY)) return console.critical("Attempting to create alias for existing People user - aborting."), -2;
		var _this = this;
		return _.isUndefined(original) && (original = this.get_distinct_id()), alias !== original ? (this._register_single(ALIAS_ID_KEY, alias), this.track("$create_alias", {
			alias: alias,
			distinct_id: original
		}, function(response) {
			_this.identify(alias)
		})) : (console.error("alias matches current distinct_id - skipping api call."), this.identify(alias), -1)
	}, MixpanelLib.prototype.name_tag = function(name_tag) {
		this._register_single("mp_name_tag", name_tag)
	}, MixpanelLib.prototype.set_config = function(config) {
		_.isObject(config) && (_.extend(this.config, config), this.get_config("persistence_name") || (this.config.persistence_name = this.config.cookie_name), this.get_config("disable_persistence") || (this.config.disable_persistence = this.config.disable_cookie), this.persistence && this.persistence.update_config(this.config), DEBUG = DEBUG || this.get_config("debug"))
	}, MixpanelLib.prototype.get_config = function(prop_name) {
		return this.config[prop_name]
	}, MixpanelLib.prototype.get_property = function(property_name) {
		return this.persistence.props[property_name]
	}, MixpanelLib.prototype.toString = function() {
		var name = this.get_config("name");
		return name !== PRIMARY_INSTANCE_NAME && (name = PRIMARY_INSTANCE_NAME + "." + name), name
	}, MixpanelLib.prototype._event_is_disabled = function(event_name) {
		return _.isBlockedUA(userAgent) || this._flags.disable_all_events || _.include(this.__disabled_events, event_name)
	}, MixpanelLib.prototype._check_and_handle_notifications = function(distinct_id) {
		if (distinct_id && !this._flags.identify_called && !this.get_config("disable_notifications")) {
			console.log("MIXPANEL NOTIFICATION CHECK");
			var data = {
					verbose: !0,
					version: "1",
					lib: "web",
					token: this.get_config("token"),
					distinct_id: distinct_id
				},
				self = this;
			this._send_request(this.get_config("api_host") + "/decide/", data, this._prepare_callback(function(r) {
				r.notifications && r.notifications.length > 0 && self._show_notification.call(self, r.notifications[0])
			}))
		}
	}, MixpanelLib.prototype._show_notification = function(notification_data) {
		var notification = new MPNotif(notification_data, this);
		notification.show()
	};
	var MixpanelPeople = function() {};
	MixpanelPeople.prototype._init = function(mixpanel_instance) {
		this._mixpanel = mixpanel_instance
	}, MixpanelPeople.prototype.set = function(prop, to, callback) {
		var data = {},
			$set = {};
		return _.isObject(prop) ? (_.each(prop, function(v, k) {
			this._is_reserved_property(k) || ($set[k] = v)
		}, this), callback = to) : $set[prop] = to, this._get_config("save_referrer") && this._mixpanel.persistence.update_referrer_info(document.referrer), $set = _.extend({}, _.info.people_properties(), this._mixpanel.persistence.get_referrer_info(), $set), data[SET_ACTION] = $set, this._send_request(data, callback)
	}, MixpanelPeople.prototype.set_once = function(prop, to, callback) {
		var data = {},
			$set_once = {};
		return _.isObject(prop) ? (_.each(prop, function(v, k) {
			this._is_reserved_property(k) || ($set_once[k] = v)
		}, this), callback = to) : $set_once[prop] = to, data[SET_ONCE_ACTION] = $set_once, this._send_request(data, callback)
	}, MixpanelPeople.prototype.increment = function(prop, by, callback) {
		var data = {},
			$add = {};
		return _.isObject(prop) ? (_.each(prop, function(v, k) {
			if (!this._is_reserved_property(k)) {
				if (isNaN(parseFloat(v))) return void console.error("Invalid increment value passed to mixpanel.people.increment - must be a number");
				$add[k] = v
			}
		}, this), callback = by) : (_.isUndefined(by) && (by = 1), $add[prop] = by), data[ADD_ACTION] = $add, this._send_request(data, callback)
	}, MixpanelPeople.prototype.append = function(list_name, value, callback) {
		var data = {},
			$append = {};
		return _.isObject(list_name) ? (_.each(list_name, function(v, k) {
			this._is_reserved_property(k) || ($append[k] = v)
		}, this), callback = value) : $append[list_name] = value, data[APPEND_ACTION] = $append, this._send_request(data, callback)
	}, MixpanelPeople.prototype.union = function(list_name, values, callback) {
		var data = {},
			$union = {};
		return _.isObject(list_name) ? (_.each(list_name, function(v, k) {
			this._is_reserved_property(k) || ($union[k] = _.isArray(v) ? v : [v])
		}, this), callback = values) : $union[list_name] = _.isArray(values) ? values : [values], data[UNION_ACTION] = $union, this._send_request(data, callback)
	}, MixpanelPeople.prototype.track_charge = function(amount, properties, callback) {
		return !_.isNumber(amount) && (amount = parseFloat(amount), isNaN(amount)) ? void console.error("Invalid value passed to mixpanel.people.track_charge - must be a number") : this.append("$transactions", _.extend({
			$amount: amount
		}, properties), callback)
	}, MixpanelPeople.prototype.clear_charges = function(callback) {
		return this.set("$transactions", [], callback)
	}, MixpanelPeople.prototype.delete_user = function() {
		if (!this._identify_called()) return void console.error("mixpanel.people.delete_user() requires you to call identify() first");
		var data = {
			$delete: this._mixpanel.get_distinct_id()
		};
		return this._send_request(data)
	}, MixpanelPeople.prototype.toString = function() {
		return this._mixpanel.toString() + ".people"
	}, MixpanelPeople.prototype._send_request = function(data, callback) {
		data.$token = this._get_config("token"), data.$distinct_id = this._mixpanel.get_distinct_id();
		var date_encoded_data = _.encodeDates(data),
			truncated_data = _.truncate(date_encoded_data, 255),
			json_data = _.JSONEncode(date_encoded_data),
			encoded_data = _.base64Encode(json_data);
		return this._identify_called() ? (console.log("MIXPANEL PEOPLE REQUEST:"), console.log(truncated_data), this._mixpanel._send_request(this._get_config("api_host") + "/engage/", {
			data: encoded_data
		}, this._mixpanel._prepare_callback(callback, truncated_data)), truncated_data) : (this._enqueue(data), _.isUndefined(callback) || callback(this._get_config("verbose") ? {
			status: -1,
			error: null
		} : -1), truncated_data)
	}, MixpanelPeople.prototype._get_config = function(conf_var) {
		return this._mixpanel.get_config(conf_var)
	}, MixpanelPeople.prototype._identify_called = function() {
		return this._mixpanel._flags.identify_called === !0
	}, MixpanelPeople.prototype._enqueue = function(data) {
		SET_ACTION in data ? this._mixpanel.persistence._add_to_people_queue(SET_ACTION, data) : SET_ONCE_ACTION in data ? this._mixpanel.persistence._add_to_people_queue(SET_ONCE_ACTION, data) : ADD_ACTION in data ? this._mixpanel.persistence._add_to_people_queue(ADD_ACTION, data) : APPEND_ACTION in data ? this._mixpanel.persistence._add_to_people_queue(APPEND_ACTION, data) : UNION_ACTION in data ? this._mixpanel.persistence._add_to_people_queue(UNION_ACTION, data) : console.error("Invalid call to _enqueue():", data)
	}, MixpanelPeople.prototype._flush = function(_set_callback, _add_callback, _append_callback, _set_once_callback, _union_callback) {
		var _this = this,
			$set_queue = _.extend({}, this._mixpanel.persistence._get_queue(SET_ACTION)),
			$set_once_queue = _.extend({}, this._mixpanel.persistence._get_queue(SET_ONCE_ACTION)),
			$add_queue = _.extend({}, this._mixpanel.persistence._get_queue(ADD_ACTION)),
			$append_queue = this._mixpanel.persistence._get_queue(APPEND_ACTION),
			$union_queue = _.extend({}, this._mixpanel.persistence._get_queue(UNION_ACTION));
		if (_.isUndefined($set_queue) || !_.isObject($set_queue) || _.isEmptyObject($set_queue) || (_this._mixpanel.persistence._pop_from_people_queue(SET_ACTION, $set_queue), this.set($set_queue, function(response, data) {
				0 == response && _this._mixpanel.persistence._add_to_people_queue(SET_ACTION, $set_queue), _.isUndefined(_set_callback) || _set_callback(response, data)
			})), _.isUndefined($set_once_queue) || !_.isObject($set_once_queue) || _.isEmptyObject($set_once_queue) || (_this._mixpanel.persistence._pop_from_people_queue(SET_ONCE_ACTION, $set_once_queue), this.set_once($set_once_queue, function(response, data) {
				0 == response && _this._mixpanel.persistence._add_to_people_queue(SET_ONCE_ACTION, $set_once_queue), _.isUndefined(_set_once_callback) || _set_once_callback(response, data)
			})), _.isUndefined($add_queue) || !_.isObject($add_queue) || _.isEmptyObject($add_queue) || (_this._mixpanel.persistence._pop_from_people_queue(ADD_ACTION, $add_queue), this.increment($add_queue, function(response, data) {
				0 == response && _this._mixpanel.persistence._add_to_people_queue(ADD_ACTION, $add_queue), _.isUndefined(_add_callback) || _add_callback(response, data)
			})), _.isUndefined($union_queue) || !_.isObject($union_queue) || _.isEmptyObject($union_queue) || (_this._mixpanel.persistence._pop_from_people_queue(UNION_ACTION, $union_queue), this.union($union_queue, function(response, data) {
				0 == response && _this._mixpanel.persistence._add_to_people_queue(UNION_ACTION, $union_queue), _.isUndefined(_union_callback) || _union_callback(response, data)
			})), !_.isUndefined($append_queue) && _.isArray($append_queue) && $append_queue.length) {
			for (var i = $append_queue.length - 1; i >= 0; i--) {
				var $append_item = $append_queue.pop();
				_this.append($append_item, function(response, data) {
					0 == response && _this._mixpanel.persistence._add_to_people_queue(APPEND_ACTION, $append_item), _.isUndefined(_append_callback) || _append_callback(response, data)
				})
			}
			_this._mixpanel.persistence.save()
		}
	}, MixpanelPeople.prototype._is_reserved_property = function(prop) {
		return "$distinct_id" === prop || "$token" === prop
	}, MixpanelLib._Notification = function(notif_data, mixpanel_instance) {
		_.bind_instance_methods(this), this.mixpanel = mixpanel_instance, this.persistence = this.mixpanel.persistence, this.campaign_id = _.escapeHTML(notif_data.id), this.message_id = _.escapeHTML(notif_data.message_id), this.body = (_.escapeHTML(notif_data.body) || "").replace(/\n/g, "<br/>"), this.cta = _.escapeHTML(notif_data.cta) || "Close", this.dest_url = _.escapeHTML(notif_data.cta_url) || null, this.image_url = _.escapeHTML(notif_data.image_url) || null, this.notif_type = _.escapeHTML(notif_data.type) || "takeover", this.style = _.escapeHTML(notif_data.style) || "light", this.thumb_image_url = _.escapeHTML(notif_data.thumb_image_url) || null, this.title = _.escapeHTML(notif_data.title) || "", this.video_url = _.escapeHTML(notif_data.video_url) || null, this.video_width = MPNotif.VIDEO_WIDTH, this.video_height = MPNotif.VIDEO_HEIGHT, this.clickthrough = !0, this.dest_url || (this.dest_url = "#dismiss", this.clickthrough = !1), this.mini = "mini" === this.notif_type, this.mini || (this.notif_type = "takeover"), this.notif_width = this.mini ? MPNotif.NOTIF_WIDTH_MINI : MPNotif.NOTIF_WIDTH, this._set_client_config(), this.imgs_to_preload = this._init_image_html(), this._init_video()
	};
	var MPNotif = MixpanelLib._Notification;
	MPNotif.ANIM_TIME = 200, MPNotif.MARKUP_PREFIX = "mixpanel-notification", MPNotif.BG_OPACITY = .6, MPNotif.NOTIF_TOP = 25, MPNotif.NOTIF_START_TOP = 200, MPNotif.NOTIF_WIDTH = 388, MPNotif.NOTIF_WIDTH_MINI = 420, MPNotif.NOTIF_HEIGHT_MINI = 85, MPNotif.THUMB_BORDER_SIZE = 5, MPNotif.THUMB_IMG_SIZE = 60, MPNotif.THUMB_OFFSET = Math.round(MPNotif.THUMB_IMG_SIZE / 2), MPNotif.VIDEO_WIDTH = 595, MPNotif.VIDEO_HEIGHT = 334, MPNotif.prototype.show = function() {
		var self = this;
		return this._set_client_config(), this.body_el ? (this._init_styles(), this._init_notification_el(), void this._preload_images(this._attach_and_animate)) : void setTimeout(function() {
			self.show()
		}, 300)
	}, MPNotif.prototype.dismiss = _.safewrap(function() {
		this.marked_as_shown || this._mark_delivery({
			invisible: !0
		});
		var exiting_el = this.showing_video ? this._get_el("video") : this._get_notification_display_el();
		if (this.use_transitions) this._remove_class("bg", "visible"), this._add_class(exiting_el, "exiting"), setTimeout(this._remove_notification_el, MPNotif.ANIM_TIME);
		else {
			var notif_attr, notif_start, notif_goal;
			this.mini ? (notif_attr = "right", notif_start = 20, notif_goal = -100) : (notif_attr = "top", notif_start = MPNotif.NOTIF_TOP, notif_goal = MPNotif.NOTIF_START_TOP + MPNotif.NOTIF_TOP), this._animate_els([{
				el: this._get_el("bg"),
				attr: "opacity",
				start: MPNotif.BG_OPACITY,
				goal: 0
			}, {
				el: exiting_el,
				attr: "opacity",
				start: 1,
				goal: 0
			}, {
				el: exiting_el,
				attr: notif_attr,
				start: notif_start,
				goal: notif_goal
			}], MPNotif.ANIM_TIME, this._remove_notification_el)
		}
	}), MPNotif.prototype._add_class = _.safewrap(function(el, class_name) {
		class_name = MPNotif.MARKUP_PREFIX + "-" + class_name, "string" == typeof el && (el = this._get_el(el)), el.className ? ~(" " + el.className + " ").indexOf(" " + class_name + " ") || (el.className += " " + class_name) : el.className = class_name
	}), MPNotif.prototype._remove_class = _.safewrap(function(el, class_name) {
		class_name = MPNotif.MARKUP_PREFIX + "-" + class_name, "string" == typeof el && (el = this._get_el(el)), el.className && (el.className = (" " + el.className + " ").replace(" " + class_name + " ", "").replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, ""))
	}), MPNotif.prototype._animate_els = _.safewrap(function(anims, mss, done_cb, start_time) {
		var ai, anim, time_diff, self = this,
			in_progress = !1,
			cur_time = 1 * new Date;
		for (start_time = start_time || cur_time, time_diff = cur_time - start_time, ai = 0; ai < anims.length; ai++)
			if (anim = anims[ai], "undefined" == typeof anim.val && (anim.val = anim.start), anim.val !== anim.goal) {
				in_progress = !0;
				var anim_diff = anim.goal - anim.start,
					anim_dir = anim.goal >= anim.start ? 1 : -1;
				anim.val = anim.start + anim_diff * time_diff / mss, "opacity" !== anim.attr && (anim.val = Math.round(anim.val)), (anim_dir > 0 && anim.val >= anim.goal || anim_dir < 0 && anim.val <= anim.goal) && (anim.val = anim.goal)
			}
		if (!in_progress) return void(done_cb && done_cb());
		for (ai = 0; ai < anims.length; ai++)
			if (anim = anims[ai], anim.el) {
				var suffix = "opacity" === anim.attr ? "" : "px";
				anim.el.style[anim.attr] = String(anim.val) + suffix
			}
		setTimeout(function() {
			self._animate_els(anims, mss, done_cb, start_time)
		}, 10)
	}), MPNotif.prototype._attach_and_animate = _.safewrap(function() {
		var self = this;
		if (!this.shown && !this._get_shown_campaigns()[this.campaign_id]) {
			this.shown = !0, this.body_el.appendChild(this.notification_el), setTimeout(function() {
				var notif_el = self._get_notification_display_el();
				if (self.use_transitions) self.mini || self._add_class("bg", "visible"), self._add_class(notif_el, "visible"), self._mark_as_shown();
				else {
					var notif_attr, notif_start, notif_goal;
					self.mini ? (notif_attr = "right", notif_start = -100, notif_goal = 20) : (notif_attr = "top", notif_start = MPNotif.NOTIF_START_TOP + MPNotif.NOTIF_TOP, notif_goal = MPNotif.NOTIF_TOP), self._animate_els([{
						el: self._get_el("bg"),
						attr: "opacity",
						start: 0,
						goal: MPNotif.BG_OPACITY
					}, {
						el: notif_el,
						attr: "opacity",
						start: 0,
						goal: 1
					}, {
						el: notif_el,
						attr: notif_attr,
						start: notif_start,
						goal: notif_goal
					}], MPNotif.ANIM_TIME, self._mark_as_shown)
				}
			}, 100), _.register_event(self._get_el("cancel"), "click", function(e) {
				e.preventDefault(), self.dismiss()
			});
			var click_el = self._get_el("button") || self._get_el("mini-content");
			_.register_event(click_el, "click", function(e) {
				e.preventDefault(), self.show_video ? (self._track_event("$campaign_open", {
					$resource_type: "video"
				}), self._switch_to_video()) : (self.dismiss(), self.clickthrough && self._track_event("$campaign_open", {
					$resource_type: "link"
				}, function() {
					window.location.href = self.dest_url
				}))
			})
		}
	}), MPNotif.prototype._get_el = function(id) {
		return document.getElementById(MPNotif.MARKUP_PREFIX + "-" + id)
	}, MPNotif.prototype._get_notification_display_el = function() {
		return this._get_el(this.notif_type)
	}, MPNotif.prototype._get_shown_campaigns = function() {
		return this.persistence.props[CAMPAIGN_IDS_KEY] || (this.persistence.props[CAMPAIGN_IDS_KEY] = {})
	}, MPNotif.prototype._browser_lte = function(browser, version) {
		return this.browser_versions[browser] && this.browser_versions[browser] <= version
	}, MPNotif.prototype._init_image_html = function() {
		var imgs_to_preload = [];
		return this.mini ? (this.thumb_image_url = this.thumb_image_url || "//cdn.mxpnl.com/site_media/images/icons/notifications/mini-news-dark.png", imgs_to_preload.push(this.thumb_image_url)) : (this.image_url ? (imgs_to_preload.push(this.image_url), this.img_html = '<img id="img" src="' + this.image_url + '"/>') : this.img_html = "", this.thumb_image_url ? (imgs_to_preload.push(this.thumb_image_url), this.thumb_img_html = '<div id="thumbborder-wrapper"><div id="thumbborder"></div></div><img id="thumbnail" src="' + this.thumb_image_url + '" width="' + MPNotif.THUMB_IMG_SIZE + '" height="' + MPNotif.THUMB_IMG_SIZE + '"/><div id="thumbspacer"></div>') : this.thumb_img_html = ""), imgs_to_preload
	}, MPNotif.prototype._init_notification_el = function() {
		var notification_html = "",
			video_src = "",
			video_html = "",
			cancel_html = '<div id="cancel"><div id="cancel-icon"></div></div>';
		if (this.notification_el = document.createElement("div"), this.notification_el.id = MPNotif.MARKUP_PREFIX + "-wrapper", this.mini) notification_html = '<div id="mini"><div id="mainbox">' + cancel_html + '<div id="mini-content"><div id="mini-icon"><div id="mini-icon-img"></div></div><div id="body"><div id="body-text"><div>' + this.body + '</div></div></div></div></div><div id="mini-border"></div></div>';
		else {
			var close_html = this.clickthrough || this.show_video ? "" : '<div id="button-close"></div>',
				play_html = this.show_video ? '<div id="button-play"></div>' : "";
			this._browser_lte("ie", 7) && (close_html = "", play_html = ""), notification_html = '<div id="takeover">' + this.thumb_img_html + '<div id="mainbox">' + cancel_html + '<div id="content">' + this.img_html + '<div id="title">' + this.title + '</div><div id="body">' + this.body + '</div><div id="tagline"><a href="http://mixpanel.com?from=inapp" target="_blank">POWERED BY MIXPANEL</a></div></div><div id="button">' + close_html + '<a id="button-link" href="' + this.dest_url + '">' + this.cta + "</a>" + play_html + "</div></div></div>"
		}
		this.youtube_video ? (video_src = "//www.youtube.com/embed/" + this.youtube_video + "?wmode=transparent&showinfo=0&modestbranding=0&rel=0&autoplay=1&loop=0&vq=hd1080", this.yt_custom && (video_src += "&enablejsapi=1&html5=1&controls=0", video_html = '<div id="video-controls"><div id="video-progress" class="video-progress-el"><div id="video-progress-total" class="video-progress-el"></div><div id="video-elapsed" class="video-progress-el"></div></div><div id="video-time" class="video-progress-el"></div></div>')) : this.vimeo_video && (video_src = "//player.vimeo.com/video/" + this.vimeo_video + "?autoplay=1&title=0&byline=0&portrait=0"), this.show_video && (this.video_iframe = '<iframe id="' + MPNotif.MARKUP_PREFIX + '-video-frame" width="' + this.video_width + '" height="' + this.video_height + '"  src="' + video_src + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen="1" scrolling="no"></iframe>', video_html = '<div id="video-' + (this.flip_animate ? "" : "no") + 'flip"><div id="video"><div id="video-holder"></div>' + video_html + "</div></div>");
		var main_html = video_html + notification_html;
		this.flip_animate && (main_html = (this.mini ? notification_html : "") + '<div id="flipcontainer"><div id="flipper">' + (this.mini ? video_html : main_html) + "</div></div>"), this.notification_el.innerHTML = ('<div id="overlay" class="' + this.notif_type + '"><div id="campaignid-' + this.campaign_id + '"><div id="bgwrapper"><div id="bg"></div>' + main_html + "</div></div></div>").replace(/class=\"/g, 'class="' + MPNotif.MARKUP_PREFIX + "-").replace(/id=\"/g, 'id="' + MPNotif.MARKUP_PREFIX + "-")
	}, MPNotif.prototype._init_styles = function() {
		"dark" === this.style ? this.style_vals = {
			bg: "#1d1f25",
			bg_actions: "#282b32",
			bg_hover: "#3a4147",
			bg_light: "#4a5157",
			border_gray: "#32353c",
			cancel_opacity: "0.4",
			mini_hover: "#2a3137",
			text_title: "#fff",
			text_main: "#9498a3",
			text_tagline: "#464851",
			text_hover: "#ddd"
		} : this.style_vals = {
			bg: "#fff",
			bg_actions: "#e7eaee",
			bg_hover: "#eceff3",
			bg_light: "#f5f5f5",
			border_gray: "#e4ecf2",
			cancel_opacity: "1.0",
			mini_hover: "#fafafa",
			text_title: "#5c6578",
			text_main: "#8b949b",
			text_tagline: "#ced9e6",
			text_hover: "#7c8598"
		};
		var shadow = "0px 0px 35px 0px rgba(45, 49, 56, 0.7)",
			video_shadow = shadow,
			mini_shadow = shadow,
			thumb_total_size = MPNotif.THUMB_IMG_SIZE + 2 * MPNotif.THUMB_BORDER_SIZE,
			anim_seconds = MPNotif.ANIM_TIME / 1e3 + "s";
		this.mini && (shadow = "none");
		var notif_media_queries = {},
			min_width = MPNotif.NOTIF_WIDTH_MINI + 20;
		notif_media_queries["@media only screen and (max-width: " + (min_width - 1) + "px)"] = {
			"#overlay": {
				display: "none"
			}
		};
		var notif_styles = {
			".flipped": {
				transform: "rotateY(180deg)"
			},
			"#overlay": {
				position: "fixed",
				top: "0",
				left: "0",
				width: "100%",
				height: "100%",
				overflow: "auto",
				"text-align": "center",
				"z-index": "10000",
				"font-family": '"Helvetica", "Arial", sans-serif',
				"-webkit-font-smoothing": "antialiased",
				"-moz-osx-font-smoothing": "grayscale"
			},
			"#overlay.mini": {
				height: "0",
				overflow: "visible"
			},
			"#overlay a": {
				width: "initial",
				padding: "0",
				"text-decoration": "none",
				"text-transform": "none",
				color: "inherit"
			},
			"#bgwrapper": {
				position: "relative",
				width: "100%",
				height: "100%"
			},
			"#bg": {
				position: "fixed",
				top: "0",
				left: "0",
				width: "100%",
				height: "100%",
				"min-width": 4 * this.doc_width + "px",
				"min-height": 4 * this.doc_height + "px",
				"background-color": "black",
				opacity: "0.0",
				"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=60)",
				filter: "alpha(opacity=60)",
				transition: "opacity " + anim_seconds
			},
			"#bg.visible": {
				opacity: MPNotif.BG_OPACITY
			},
			".mini #bg": {
				width: "0",
				height: "0",
				"min-width": "0"
			},
			"#flipcontainer": {
				perspective: "1000px",
				position: "absolute",
				width: "100%"
			},
			"#flipper": {
				position: "relative",
				"transform-style": "preserve-3d",
				transition: "0.3s"
			},
			"#takeover": {
				position: "absolute",
				left: "50%",
				width: MPNotif.NOTIF_WIDTH + "px",
				"margin-left": Math.round(-MPNotif.NOTIF_WIDTH / 2) + "px",
				"backface-visibility": "hidden",
				transform: "rotateY(0deg)",
				opacity: "0.0",
				top: MPNotif.NOTIF_START_TOP + "px",
				transition: "opacity " + anim_seconds + ", top " + anim_seconds
			},
			"#takeover.visible": {
				opacity: "1.0",
				top: MPNotif.NOTIF_TOP + "px"
			},
			"#takeover.exiting": {
				opacity: "0.0",
				top: MPNotif.NOTIF_START_TOP + "px"
			},
			"#thumbspacer": {
				height: MPNotif.THUMB_OFFSET + "px"
			},
			"#thumbborder-wrapper": {
				position: "absolute",
				top: -MPNotif.THUMB_BORDER_SIZE + "px",
				left: MPNotif.NOTIF_WIDTH / 2 - MPNotif.THUMB_OFFSET - MPNotif.THUMB_BORDER_SIZE + "px",
				width: thumb_total_size + "px",
				height: thumb_total_size / 2 + "px",
				overflow: "hidden"
			},
			"#thumbborder": {
				position: "absolute",
				width: thumb_total_size + "px",
				height: thumb_total_size + "px",
				"border-radius": thumb_total_size + "px",
				"background-color": this.style_vals.bg_actions,
				opacity: "0.5"
			},
			"#thumbnail": {
				position: "absolute",
				top: "0px",
				left: MPNotif.NOTIF_WIDTH / 2 - MPNotif.THUMB_OFFSET + "px",
				width: MPNotif.THUMB_IMG_SIZE + "px",
				height: MPNotif.THUMB_IMG_SIZE + "px",
				overflow: "hidden",
				"z-index": "100",
				"border-radius": MPNotif.THUMB_IMG_SIZE + "px"
			},
			"#mini": {
				position: "absolute",
				right: "20px",
				top: MPNotif.NOTIF_TOP + "px",
				width: this.notif_width + "px",
				height: 2 * MPNotif.NOTIF_HEIGHT_MINI + "px",
				"margin-top": 20 - MPNotif.NOTIF_HEIGHT_MINI + "px",
				"backface-visibility": "hidden",
				opacity: "0.0",
				transform: "rotateX(90deg)",
				transition: "opacity 0.3s, transform 0.3s, right 0.3s"
			},
			"#mini.visible": {
				opacity: "1.0",
				transform: "rotateX(0deg)"
			},
			"#mini.exiting": {
				opacity: "0.0",
				right: "-150px"
			},
			"#mainbox": {
				"border-radius": "4px",
				"box-shadow": shadow,
				"text-align": "center",
				"background-color": this.style_vals.bg,
				"font-size": "14px",
				color: this.style_vals.text_main
			},
			"#mini #mainbox": {
				height: MPNotif.NOTIF_HEIGHT_MINI + "px",
				"margin-top": MPNotif.NOTIF_HEIGHT_MINI + "px",
				"border-radius": "3px",
				transition: "background-color " + anim_seconds
			},
			"#mini-border": {
				height: MPNotif.NOTIF_HEIGHT_MINI + 6 + "px",
				width: MPNotif.NOTIF_WIDTH_MINI + 6 + "px",
				position: "absolute",
				top: "-3px",
				left: "-3px",
				"margin-top": MPNotif.NOTIF_HEIGHT_MINI + "px",
				"border-radius": "6px",
				opacity: "0.25",
				"background-color": "#fff",
				"z-index": "-1",
				"box-shadow": mini_shadow
			},
			"#mini-icon": {
				position: "relative",
				display: "inline-block",
				width: "75px",
				height: MPNotif.NOTIF_HEIGHT_MINI + "px",
				"border-radius": "3px 0 0 3px",
				"background-color": this.style_vals.bg_actions,
				background: "linear-gradient(135deg, " + this.style_vals.bg_light + " 0%, " + this.style_vals.bg_actions + " 100%)",
				transition: "background-color " + anim_seconds
			},
			"#mini:hover #mini-icon": {
				"background-color": this.style_vals.mini_hover
			},
			"#mini:hover #mainbox": {
				"background-color": this.style_vals.mini_hover
			},
			"#mini-icon-img": {
				position: "absolute",
				"background-image": "url(" + this.thumb_image_url + ")",
				width: "48px",
				height: "48px",
				top: "20px",
				left: "12px"
			},
			"#content": {
				padding: "30px 20px 0px 20px"
			},
			"#mini-content": {
				"text-align": "left",
				height: MPNotif.NOTIF_HEIGHT_MINI + "px",
				cursor: "pointer"
			},
			"#img": {
				width: "328px",
				"margin-top": "30px",
				"border-radius": "5px"
			},
			"#title": {
				"max-height": "600px",
				overflow: "hidden",
				"word-wrap": "break-word",
				padding: "25px 0px 20px 0px",
				"font-size": "19px",
				"font-weight": "bold",
				color: this.style_vals.text_title
			},
			"#body": {
				"max-height": "600px",
				"margin-bottom": "25px",
				overflow: "hidden",
				"word-wrap": "break-word",
				"line-height": "21px",
				"font-size": "15px",
				"font-weight": "normal",
				"text-align": "left"
			},
			"#mini #body": {
				display: "inline-block",
				"max-width": "250px",
				margin: "0 0 0 30px",
				height: MPNotif.NOTIF_HEIGHT_MINI + "px",
				"font-size": "16px",
				"letter-spacing": "0.8px",
				color: this.style_vals.text_title
			},
			"#mini #body-text": {
				display: "table",
				height: MPNotif.NOTIF_HEIGHT_MINI + "px"
			},
			"#mini #body-text div": {
				display: "table-cell",
				"vertical-align": "middle"
			},
			"#tagline": {
				"margin-bottom": "15px",
				"font-size": "10px",
				"font-weight": "600",
				"letter-spacing": "0.8px",
				color: "#ccd7e0",
				"text-align": "left"
			},
			"#tagline a": {
				color: this.style_vals.text_tagline,
				transition: "color " + anim_seconds
			},
			"#tagline a:hover": {
				color: this.style_vals.text_hover
			},
			"#cancel": {
				position: "absolute",
				right: "0",
				width: "8px",
				height: "8px",
				padding: "10px",
				"border-radius": "20px",
				margin: "12px 12px 0 0",
				"box-sizing": "content-box",
				cursor: "pointer",
				transition: "background-color " + anim_seconds
			},
			"#mini #cancel": {
				margin: "7px 7px 0 0"
			},
			"#cancel-icon": {
				width: "8px",
				height: "8px",
				overflow: "hidden",
				"background-image": "url(//cdn.mxpnl.com/site_media/images/icons/notifications/cancel-x.png)",
				opacity: this.style_vals.cancel_opacity
			},
			"#cancel:hover": {
				"background-color": this.style_vals.bg_hover
			},
			"#button": {
				display: "block",
				height: "60px",
				"line-height": "60px",
				"text-align": "center",
				"background-color": this.style_vals.bg_actions,
				"border-radius": "0 0 4px 4px",
				overflow: "hidden",
				cursor: "pointer",
				transition: "background-color " + anim_seconds
			},
			"#button-close": {
				display: "inline-block",
				width: "9px",
				height: "60px",
				"margin-right": "8px",
				"vertical-align": "top",
				"background-image": "url(//cdn.mxpnl.com/site_media/images/icons/notifications/close-x-" + this.style + ".png)",
				"background-repeat": "no-repeat",
				"background-position": "0px 25px"
			},
			"#button-play": {
				display: "inline-block",
				width: "30px",
				height: "60px",
				"margin-left": "15px",
				"background-image": "url(//cdn.mxpnl.com/site_media/images/icons/notifications/play-" + this.style + "-small.png)",
				"background-repeat": "no-repeat",
				"background-position": "0px 15px"
			},
			"a#button-link": {
				display: "inline-block",
				"vertical-align": "top",
				"text-align": "center",
				"font-size": "17px",
				"font-weight": "bold",
				overflow: "hidden",
				"word-wrap": "break-word",
				color: this.style_vals.text_title,
				transition: "color " + anim_seconds
			},
			"#button:hover": {
				"background-color": this.style_vals.bg_hover,
				color: this.style_vals.text_hover
			},
			"#button:hover a": {
				color: this.style_vals.text_hover
			},
			"#video-noflip": {
				position: "relative",
				top: 2 * -this.video_height + "px"
			},
			"#video-flip": {
				"backface-visibility": "hidden",
				transform: "rotateY(180deg)"
			},
			"#video": {
				position: "absolute",
				width: this.video_width - 1 + "px",
				height: this.video_height + "px",
				top: MPNotif.NOTIF_TOP + "px",
				"margin-top": "100px",
				left: "50%",
				"margin-left": Math.round(-this.video_width / 2) + "px",
				overflow: "hidden",
				"border-radius": "5px",
				"box-shadow": video_shadow,
				transform: "translateZ(1px)",
				transition: "opacity " + anim_seconds + ", top " + anim_seconds
			},
			"#video.exiting": {
				opacity: "0.0",
				top: this.video_height + "px"
			},
			"#video-holder": {
				position: "absolute",
				width: this.video_width - 1 + "px",
				height: this.video_height + "px",
				overflow: "hidden",
				"border-radius": "5px"
			},
			"#video-frame": {
				"margin-left": "-1px",
				width: this.video_width + "px"
			},
			"#video-controls": {
				opacity: "0",
				transition: "opacity 0.5s"
			},
			"#video:hover #video-controls": {
				opacity: "1.0"
			},
			"#video .video-progress-el": {
				position: "absolute",
				bottom: "0",
				height: "25px",
				"border-radius": "0 0 0 5px"
			},
			"#video-progress": {
				width: "90%"
			},
			"#video-progress-total": {
				width: "100%",
				"background-color": this.style_vals.bg,
				opacity: "0.7"
			},
			"#video-elapsed": {
				width: "0",
				"background-color": "#6cb6f5",
				opacity: "0.9"
			},
			"#video #video-time": {
				width: "10%",
				right: "0",
				"font-size": "11px",
				"line-height": "25px",
				color: this.style_vals.text_main,
				"background-color": "#666",
				"border-radius": "0 0 5px 0"
			}
		};
		this._browser_lte("ie", 8) && _.extend(notif_styles, {
			"* html #overlay": {
				position: "absolute"
			},
			"* html #bg": {
				position: "absolute"
			},
			"html, body": {
				height: "100%"
			}
		}), this._browser_lte("ie", 7) && _.extend(notif_styles, {
			"#mini #body": {
				display: "inline",
				zoom: "1",
				border: "1px solid " + this.style_vals.bg_hover
			},
			"#mini #body-text": {
				padding: "20px"
			},
			"#mini #mini-icon": {
				display: "none"
			}
		});
		var VENDOR_STYLES = ["backface-visibility", "border-radius", "box-shadow", "opacity", "perspective", "transform", "transform-style", "transition"],
			VENDOR_PREFIXES = ["khtml", "moz", "ms", "o", "webkit"];
		for (var selector in notif_styles)
			for (var si = 0; si < VENDOR_STYLES.length; si++) {
				var prop = VENDOR_STYLES[si];
				if (prop in notif_styles[selector])
					for (var val = notif_styles[selector][prop], pi = 0; pi < VENDOR_PREFIXES.length; pi++) notif_styles[selector]["-" + VENDOR_PREFIXES[pi] + "-" + prop] = val
			}
		var inject_styles = function(styles, media_queries) {
			var create_style_text = function(style_defs) {
					var st = "";
					for (var selector in style_defs) {
						var mp_selector = selector.replace(/#/g, "#" + MPNotif.MARKUP_PREFIX + "-").replace(/\./g, "." + MPNotif.MARKUP_PREFIX + "-");
						st += "\n" + mp_selector + " {";
						var props = style_defs[selector];
						for (var k in props) st += k + ":" + props[k] + ";";
						st += "}"
					}
					return st
				},
				create_media_query_text = function(mq_defs) {
					var mqt = "";
					for (var mq in mq_defs) mqt += "\n" + mq + " {" + create_style_text(mq_defs[mq]) + "\n}";
					return mqt
				},
				style_text = create_style_text(styles) + create_media_query_text(media_queries),
				head_el = document.head || document.getElementsByTagName("head")[0] || document.documentElement,
				style_el = document.createElement("style");
			head_el.appendChild(style_el), style_el.setAttribute("type", "text/css"), style_el.styleSheet ? style_el.styleSheet.cssText = style_text : style_el.textContent = style_text
		};
		inject_styles(notif_styles, notif_media_queries)
	}, MPNotif.prototype._init_video = _.safewrap(function() {
		if (this.video_url) {
			var self = this;
			self.yt_custom = "postMessage" in window;
			document.createElement("div").style;
			self.dest_url = self.video_url;
			var youtube_match = self.video_url.match(/(?:youtube(?:-nocookie)?\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i),
				vimeo_match = self.video_url.match(/vimeo\.com\/.*?(\d+)/i);
			if (youtube_match) {
				if (self.show_video = !0, self.youtube_video = youtube_match[1], self.yt_custom) {
					window.onYouTubeIframeAPIReady = function() {
						self._get_el("video-frame") && self._yt_video_ready()
					};
					var tag = document.createElement("script");
					tag.src = "//www.youtube.com/iframe_api";
					var firstScriptTag = document.getElementsByTagName("script")[0];
					firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
				}
			} else vimeo_match && (self.show_video = !0, self.vimeo_video = vimeo_match[1]);
			(self._browser_lte("ie", 7) || self._browser_lte("firefox", 3)) && (self.show_video = !1, self.clickthrough = !0)
		}
	}), MPNotif.prototype._mark_as_shown = _.safewrap(function() {
		var self = this;
		_.register_event(self._get_el("bg"), "click", function(e) {
			self.dismiss()
		});
		var get_style = function(el, style_name) {
			var styles = {};
			return document.defaultView && document.defaultView.getComputedStyle ? styles = document.defaultView.getComputedStyle(el, null) : el.currentStyle && (styles = el.currentStyle), styles[style_name]
		};
		if (this.campaign_id) {
			var notif_el = this._get_el("overlay");
			notif_el && "hidden" !== get_style(notif_el, "visibility") && "none" !== get_style(notif_el, "display") && this._mark_delivery()
		}
	}), MPNotif.prototype._mark_delivery = _.safewrap(function(extra_props) {
		this.marked_as_shown || (this.marked_as_shown = !0, this.campaign_id && (this._get_shown_campaigns()[this.campaign_id] = 1 * new Date, this.persistence.save()), this._track_event("$campaign_delivery", extra_props), this.mixpanel.people.append({
			$campaigns: this.campaign_id,
			$notifications: {
				campaign_id: this.campaign_id,
				message_id: this.message_id,
				type: "web",
				time: new Date
			}
		}))
	}), MPNotif.prototype._preload_images = function(all_loaded_cb) {
		var self = this;
		if (0 === this.imgs_to_preload.length) return void all_loaded_cb();
		for (var preloaded_imgs = 0, img_objs = [], i = 0; i < this.imgs_to_preload.length; i++) {
			var img = new Image,
				onload = function() {
					preloaded_imgs++, preloaded_imgs === self.imgs_to_preload.length && all_loaded_cb && (all_loaded_cb(), all_loaded_cb = null)
				};
			img.onload = onload, img.src = this.imgs_to_preload[i], img.complete && onload(), img_objs.push(img)
		}
		this._browser_lte("ie", 7) && setTimeout(function() {
			var imgs_loaded = !0;
			for (i = 0; i < img_objs.length; i++) img_objs[i].complete || (imgs_loaded = !1);
			imgs_loaded && all_loaded_cb && (all_loaded_cb(), all_loaded_cb = null)
		}, 500)
	}, MPNotif.prototype._remove_notification_el = _.safewrap(function() {
		window.clearInterval(this._video_progress_checker), this.notification_el.style.visibility = "hidden", this.body_el.removeChild(this.notification_el)
	}), MPNotif.prototype._set_client_config = function() {
		var get_browser_version = function(browser_ex) {
			var match = navigator.userAgent.match(browser_ex);
			return match && match[1]
		};
		this.browser_versions = {}, this.browser_versions.chrome = get_browser_version(/Chrome\/(\d+)/), this.browser_versions.firefox = get_browser_version(/Firefox\/(\d+)/), this.browser_versions.ie = get_browser_version(/MSIE (\d+).+/), !this.browser_versions.ie && !window.ActiveXObject && "ActiveXObject" in window && (this.browser_versions.ie = 11), this.body_el = document.body || document.getElementsByTagName("body")[0], this.body_el && (this.doc_width = Math.max(this.body_el.scrollWidth, document.documentElement.scrollWidth, this.body_el.offsetWidth, document.documentElement.offsetWidth, this.body_el.clientWidth, document.documentElement.clientWidth), this.doc_height = Math.max(this.body_el.scrollHeight, document.documentElement.scrollHeight, this.body_el.offsetHeight, document.documentElement.offsetHeight, this.body_el.clientHeight, document.documentElement.clientHeight));
		var ie_ver = this.browser_versions.ie,
			sample_styles = document.createElement("div").style,
			is_css_compatible = function(rule) {
				if (rule in sample_styles) return !0;
				if (!ie_ver) {
					rule = rule[0].toUpperCase() + rule.slice(1);
					for (var props = ["O" + rule, "Webkit" + rule, "Moz" + rule], i = 0; i < props.length; i++)
						if (props[i] in sample_styles) return !0
				}
				return !1
			};
		this.use_transitions = this.body_el && is_css_compatible("transition") && is_css_compatible("transform"), this.flip_animate = (this.browser_versions.chrome >= 33 || this.browser_versions.firefox >= 15) && this.body_el && is_css_compatible("backfaceVisibility") && is_css_compatible("perspective") && is_css_compatible("transform")
	}, MPNotif.prototype._switch_to_video = _.safewrap(function() {
		var self = this,
			anims = [{
				el: self._get_notification_display_el(),
				attr: "opacity",
				start: 1,
				goal: 0
			}, {
				el: self._get_notification_display_el(),
				attr: "top",
				start: MPNotif.NOTIF_TOP,
				goal: -500
			}, {
				el: self._get_el("video-noflip"),
				attr: "opacity",
				start: 0,
				goal: 1
			}, {
				el: self._get_el("video-noflip"),
				attr: "top",
				start: 2 * -self.video_height,
				goal: 0
			}];
		if (self.mini) {
			var bg = self._get_el("bg"),
				overlay = self._get_el("overlay");
			bg.style.width = "100%", bg.style.height = "100%", overlay.style.width = "100%", self._add_class(self._get_notification_display_el(), "exiting"), self._add_class(bg, "visible"), anims.push({
				el: self._get_el("bg"),
				attr: "opacity",
				start: 0,
				goal: MPNotif.BG_OPACITY
			})
		}
		var video_el = self._get_el("video-holder");
		video_el.innerHTML = self.video_iframe;
		var video_ready = function() {
			window.YT && window.YT.loaded && self._yt_video_ready(), self.showing_video = !0, self._get_notification_display_el().style.visibility = "hidden"
		};
		self.flip_animate ? (self._add_class("flipper", "flipped"), setTimeout(video_ready, MPNotif.ANIM_TIME)) : self._animate_els(anims, MPNotif.ANIM_TIME, video_ready)
	}), MPNotif.prototype._track_event = function(event_name, properties, cb) {
		this.campaign_id ? (properties = properties || {}, properties = _.extend(properties, {
			campaign_id: this.campaign_id,
			message_id: this.message_id,
			message_type: "web_inapp",
			message_subtype: this.notif_type
		}), this.mixpanel.track(event_name, properties, cb)) : cb && cb.call()
	}, MPNotif.prototype._yt_video_ready = _.safewrap(function() {
		var self = this;
		if (!self.video_inited) {
			self.video_inited = !0;
			var progress_bar = self._get_el("video-elapsed"),
				progress_time = self._get_el("video-time"),
				progress_el = self._get_el("video-progress");
			new window.YT.Player(MPNotif.MARKUP_PREFIX + "-video-frame", {
				events: {
					onReady: function(event) {
						var ytplayer = event.target,
							video_duration = ytplayer.getDuration(),
							pad = function(i) {
								return ("00" + i).slice(-2)
							},
							update_video_time = function(current_time) {
								var secs = Math.round(video_duration - current_time),
									mins = Math.floor(secs / 60),
									hours = Math.floor(mins / 60);
								secs -= 60 * mins, mins -= 60 * hours, progress_time.innerHTML = "-" + (hours ? hours + ":" : "") + pad(mins) + ":" + pad(secs)
							};
						update_video_time(0), self._video_progress_checker = window.setInterval(function() {
							var current_time = ytplayer.getCurrentTime();
							progress_bar.style.width = current_time / video_duration * 100 + "%", update_video_time(current_time)
						}, 250), _.register_event(progress_el, "click", function(e) {
							var clickx = Math.max(0, e.pageX - progress_el.getBoundingClientRect().left);
							ytplayer.seekTo(video_duration * clickx / progress_el.clientWidth, !0)
						})
					}
				}
			})
		}
	}), _.toArray = _.toArray, _.isObject = _.isObject, _.JSONEncode = _.JSONEncode, _.JSONDecode = _.JSONDecode, _.isBlockedUA = _.isBlockedUA, _.isEmptyObject = _.isEmptyObject, _.info = _.info, _.info.device = _.info.device, _.info.browser = _.info.browser, _.info.properties = _.info.properties, MixpanelLib.prototype.init = MixpanelLib.prototype.init, MixpanelLib.prototype.reset = MixpanelLib.prototype.reset, MixpanelLib.prototype.disable = MixpanelLib.prototype.disable, MixpanelLib.prototype.time_event = MixpanelLib.prototype.time_event, MixpanelLib.prototype.track = MixpanelLib.prototype.track, MixpanelLib.prototype.track_links = MixpanelLib.prototype.track_links, MixpanelLib.prototype.track_forms = MixpanelLib.prototype.track_forms, MixpanelLib.prototype.track_pageview = MixpanelLib.prototype.track_pageview, MixpanelLib.prototype.register = MixpanelLib.prototype.register, MixpanelLib.prototype.register_once = MixpanelLib.prototype.register_once, MixpanelLib.prototype.unregister = MixpanelLib.prototype.unregister, MixpanelLib.prototype.identify = MixpanelLib.prototype.identify, MixpanelLib.prototype.alias = MixpanelLib.prototype.alias, MixpanelLib.prototype.name_tag = MixpanelLib.prototype.name_tag, MixpanelLib.prototype.set_config = MixpanelLib.prototype.set_config, MixpanelLib.prototype.get_config = MixpanelLib.prototype.get_config, MixpanelLib.prototype.get_property = MixpanelLib.prototype.get_property, MixpanelLib.prototype.get_distinct_id = MixpanelLib.prototype.get_distinct_id, MixpanelLib.prototype.toString = MixpanelLib.prototype.toString, MixpanelLib.prototype._check_and_handle_notifications = MixpanelLib.prototype._check_and_handle_notifications, MixpanelLib.prototype._show_notification = MixpanelLib.prototype._show_notification, MixpanelPersistence.prototype.properties = MixpanelPersistence.prototype.properties, MixpanelPersistence.prototype.update_search_keyword = MixpanelPersistence.prototype.update_search_keyword, MixpanelPersistence.prototype.update_referrer_info = MixpanelPersistence.prototype.update_referrer_info, MixpanelPersistence.prototype.get_cross_subdomain = MixpanelPersistence.prototype.get_cross_subdomain, MixpanelPersistence.prototype.clear = MixpanelPersistence.prototype.clear, MixpanelPeople.prototype.set = MixpanelPeople.prototype.set, MixpanelPeople.prototype.set_once = MixpanelPeople.prototype.set_once, MixpanelPeople.prototype.increment = MixpanelPeople.prototype.increment, MixpanelPeople.prototype.append = MixpanelPeople.prototype.append, MixpanelPeople.prototype.union = MixpanelPeople.prototype.union, MixpanelPeople.prototype.track_charge = MixpanelPeople.prototype.track_charge, MixpanelPeople.prototype.clear_charges = MixpanelPeople.prototype.clear_charges, MixpanelPeople.prototype.delete_user = MixpanelPeople.prototype.delete_user, MixpanelPeople.prototype.toString = MixpanelPeople.prototype.toString, _.safewrap_class(MixpanelLib, ["identify", "_check_and_handle_notifications", "_show_notification"]);
	var instances = {},
		extend_mp = function() {
			_.each(instances, function(instance, name) {
				name !== PRIMARY_INSTANCE_NAME && (mixpanel_master[name] = instance)
			}), mixpanel_master._ = _
		},
		override_mp_init_func = function() {
			mixpanel_master.init = function(token, config, name) {
				if (name) return mixpanel_master[name] || (mixpanel_master[name] = instances[name] = create_mplib(token, config, name), mixpanel_master[name]._loaded()), mixpanel_master[name];
				var instance = mixpanel_master;
				instances[PRIMARY_INSTANCE_NAME] ? instance = instances[PRIMARY_INSTANCE_NAME] : token && (instance = create_mplib(token, config, PRIMARY_INSTANCE_NAME), instance._loaded(), instances[PRIMARY_INSTANCE_NAME] = instance), mixpanel_master = instance, init_type === INIT_SNIPPET && (window[PRIMARY_INSTANCE_NAME] = mixpanel_master), extend_mp()
			}
		},
		add_dom_loaded_handler = function() {
			function dom_loaded_handler() {
				dom_loaded_handler.done || (dom_loaded_handler.done = !0, DOM_LOADED = !0, ENQUEUE_REQUESTS = !1, _.each(instances, function(inst) {
					inst._dom_loaded()
				}))
			}

			function do_scroll_check() {
				try {
					document.documentElement.doScroll("left")
				} catch (e) {
					return void setTimeout(do_scroll_check, 1)
				}
				dom_loaded_handler()
			}
			if (document.addEventListener) "complete" == document.readyState ? dom_loaded_handler() : document.addEventListener("DOMContentLoaded", dom_loaded_handler, !1);
			else if (document.attachEvent) {
				document.attachEvent("onreadystatechange", dom_loaded_handler);
				var toplevel = !1;
				try {
					toplevel = null == window.frameElement
				} catch (e) {}
				document.documentElement.doScroll && toplevel && do_scroll_check()
			}
			_.register_event(window, "load", dom_loaded_handler, !0)
		},
		add_dom_event_handlers = function(instance) {
			var name = instance.get_config("name");
			instance.mp_counts = instance.mp_counts || {}, instance.mp_counts.$__c = parseInt(_.cookie.get("mp_" + name + "__c")) || 0, instance.mp_counts.$__c3 = parseInt(_.cookie.get("mp_" + name + "__c3")) || 0, instance.mp_counts.$__c4 = parseInt(_.cookie.get("mp_" + name + "__c4")) || 0, instance.mp_counts.$__c5 = parseInt(_.cookie.get("mp_" + name + "__c5")) || 0;
			var increment_count = function(els, size, filtered_size) {
					instance.mp_counts.$__c = (instance.mp_counts.$__c || 0) + 1, instance.mp_counts.$__c3 = (instance.mp_counts.$__c3 || 0) + size, instance.mp_counts.$__c4 = (instance.mp_counts.$__c4 || 0) + filtered_size, instance.mp_counts.$__c5 = (instance.mp_counts.$__c5 || 0) + els, _.cookie.set("mp_" + name + "__c", instance.mp_counts.$__c, 1, !0), _.cookie.set("mp_" + name + "__c3", instance.mp_counts.$__c3, 1, !0), _.cookie.set("mp_" + name + "__c4", instance.mp_counts.$__c4, 1, !0), _.cookie.set("mp_" + name + "__c5", instance.mp_counts.$__c5, 1, !0)
				},
				process = function(target, filter) {
					for (var processed = [], element = target; element && element !== document.body;) {
						for (var props = {
								attributes: [],
								classes: "string" == typeof element.className ? element.className.split(" ") : [],
								id: element.id,
								tagName: element.tagName,
								textContent: element === target ? element.textContent.trim().substring(0, 255) : ""
							}, i = 0; i < (element.attributes || []).length; i++) {
							var attr = element.attributes[i],
								attrsToFilter = ["id", "class"];
							filter && (attrsToFilter = attrsToFilter.concat(["href", "title", "style", "for", "value", "checked", "selected"])), attrsToFilter.indexOf(attr.name) === -1 && props.attributes.push({
								name: attr.name,
								value: attr.value
							})
						}
						for (var nthOfType = 1, nthChild = 1, curNode = element; curNode.previousElementSibling;) curNode = curNode.previousElementSibling, nthChild++, curNode.tagName === element.tagName && nthOfType++;
						props.nthChild = nthChild, props.nthOfType = nthOfType, processed.push(props), element = element.parentNode
					}
					return processed
				},
				evtCallback = function(e) {
					try {
						var processed = process(e.target),
							processed_filtered = process(e.target, !0),
							size = JSON.stringify(processed).length,
							size_filtered = JSON.stringify(processed_filtered).length;
						instance.mp_counts = instance.mp_counts || {}, increment_count(processed.length, size, size_filtered)
					} catch (e) {
						console.error(e)
					}
				};
			_.register_event(document, "submit", evtCallback), _.register_event(document, "change", evtCallback);
			var mousedownTarget = null;
			_.register_event(document, "mousedown", function(e) {
				mousedownTarget = e.target
			}), _.register_event(document, "mouseup", function(e) {
				e.target === mousedownTarget && evtCallback(e)
			})
		};
	init_from_snippet()
}(), mixpanel.init("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnROYW1lIjoiZ29mdW5kbWUtZmFzdHRyYWNrIiwiaW5wdXRMYWJlbCI6Ik1vYmlsZV9TREsiLCJpbnB1dFR5cGUiOiJKU1NESyJ9.VcK4Qu7IFdx-4eaNvFpO6-k7uLU4BnnoCaUKfLDYXBM", {
		api_host: "https://inputs.alooma.com",
		track_links_timeout: 300,
		track_pageview: !1,
		disable_notifications: !0
	}, "default"), mixpanel.init("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnROYW1lIjoiZ29mdW5kbWUtZmFzdHRyYWNrIiwiaW5wdXRMYWJlbCI6ImpzX2ltcHJlc3Npb25zIiwiaW5wdXRUeXBlIjoiSlNTREsifQ.b5cv2xeiayTkWNVbv-Hg9BGILIHwgE1nL2Tl2OaPVIA", {
		api_host: "https://inputs.alooma.com",
		track_links_timeout: 300,
		track_pageview: !1,
		disable_notifications: !0
	}, "impression"),
	function() {
		for (var arrayToClear = ["fund_id", "fund_name", "user_id", "person_id", "rcid", "donation", "experimentvariant_ids", "viewid", "viewrid", "pc_code", "rendered_at", "gfm", "flows", "flow"], arrayLength = arrayToClear.length, i = 0; i < arrayLength; i++) mixpanel["default"].unregister(arrayToClear[i]), mixpanel.impression.unregister(arrayToClear[i])
	}(), window.__insp = window.__insp || [], __insp.push(["wid", 1530493737]),
	function() {
		function ldinsp() {
			if ("undefined" == typeof window.__inspld) {
				window.__inspld = 1;
				var insp = document.createElement("script");
				insp.type = "text/javascript", insp.async = !0, insp.id = "inspsync", insp.src = ("https:" == document.location.protocol ? "https" : "http") + "://cdn.inspectlet.com/inspectlet.js";
				var x = document.getElementsByTagName("script")[0];
				x.parentNode.insertBefore(insp, x)
			}
		}
		setTimeout(ldinsp, 500), "complete" != document.readyState ? window.attachEvent ? window.attachEvent("onload", ldinsp) : window.addEventListener("load", ldinsp, !1) : ldinsp()
	}();
var GFM = GFM || {};
try {
	GFM.analytics = function(GFM, $) {
		function timeFromNow(num_seconds) {
			var date = new Date;
			return date.setTime(date.getTime() + 1e3 * num_seconds), date
		}

		function merge(dst, src, preserve) {
			"undefined" != typeof dst && null != dst || (dst = {});
			for (var key in src)
				if (src.hasOwnProperty(key)) {
					if (preserve && dst.hasOwnProperty(key)) continue;
					dst[key] = src[key]
				}
			return dst
		}

		function copy_hash(hash) {
			var res = {};
			for (var key in hash) hash.hasOwnProperty(key) && (res[key] = hash[key]);
			return res
		}

		function getXPathLike(element, with_id, with_class) {
			for (var xpath = ""; element && 1 == element.nodeType; element = element.parentNode) {
				id = element.getAttribute("id"), cl = element.getAttribute("class"), cl && (cl = cl.replace(/^\s*/, ".").replace(/\s+/g, "."));
				var pos = $(element.parentNode).children(element.tagName).index(element) + 1;
				pos = pos > 1 ? "[" + pos + "]" : "", xpath = "/" + element.tagName.toLowerCase() + pos + (with_id && id ? "#" + id : "") + (with_class && cl ? cl : "") + xpath
			}
			return xpath
		}

		function getParentPanels(element) {
			for (var panels = []; element && 1 == element.nodeType; element = element.parentNode) {
				var panel = element.getAttribute("data-tk-panel");
				panel && panels.push({
					panel: panel
				})
			}
			return panels
		}

		function matchesRule(event, view_stack) {
			var target = event.target || event.srcElement,
				rules = data.match_rules,
				tag = (target.tagName || "").toLowerCase(),
				event_type = (event.type || "").toLowerCase();
			if (tag && event_type) {
				dEvtLog("verbose", "Rules:    " + JSON.stringify(rules)), dEvtLog("verbose", "   View Stack: " + JSON.stringify(view_stack));
				for (var r = 0; r < rules.length; r++) {
					var view_match = !1;
					if ("all" == rules[r].view) view_match = !0, dEvtLog("verbose", "   ALL!");
					else
						for (var v = 0; v < view_stack.length; v++)
							if (view_stack[v].indexOf(rules[r].view) >= 0) {
								view_match = !0;
								break
							} if (view_match && (dEvtLog("verbose", "   Looking for: " + tag), rules[r].tags.hasOwnProperty(tag) && rules[r].events.hasOwnProperty(event_type))) return !0
				}
				return !1
			}
		}
		var data = {
				anonid: "",
				view_count: 0,
				user_id: "",
				person_id: "",
				fuid: "",
				fund_balance: 0,
				fund_id: "",
				fund_name: "",
				fund_url: "",
				fund_country: "",
				facebook_id: "",
				viewid: "",
				donation_count: 0,
				donation_id: "",
				donation_amount: "",
				donation_name: "",
				donation_email: "",
				donation_city: "",
				donation_zip: "",
				donation_country: "",
				donation_currencycode: "",
				experimentvariant_ids: "",
				flow: "",
				gfm: {},
				lang: "",
				out_rcid_candidates: "",
				pc_code: "",
				viewrid: "",
				rcid: "",
				rendered_at: 0,
				last_event_at: 0,
				event_at: 0,
				events: {},
				match_rules: [{
					view: "all",
					tags: {
						a: 1,
						img: 1
					},
					events: {
						click: 1
					}
				}],
				userExists: !1,
				personExists: !1,
				fundExists: !1,
				donationExists: !1,
				outRcExists: !1,
				inRcExists: !1,
				log_level: "warn",
				log_debug: !1,
				event_store: !1,
				event_store_prefix: "trk-",
				event_max_attempts: 2,
				event_max_store_len: 3
			},
			package_properties = {},
			event_properties = {},
			gfmUser = !1,
			log_levels = {
				verbose: 1,
				debug: 2,
				info: 3,
				note: 4,
				warn: 5,
				error: 6
			},
			dataMap = {
				a: "anonid",
				u: "user_id",
				p: "person_id",
				fi: "fund_id",
				fn: "fund_name",
				fu: "fund_url",
				fc: "fund_country",
				fud: "fuid",
				fbi: "facebook_id",
				flw: "flow",
				fpb: "fund_balance",
				fpc: "donation_count",
				gfm: "gfm",
				vi: "viewid",
				di: "donation_id",
				da: "donation_amount",
				dn: "donation_name",
				de: "donation_email",
				dc: "donation_city",
				dz: "donation_zip",
				dtid: "distinct_id",
				dcc: "donation_currencycode",
				dct: "donation_country",
				evi: "experimentvariant_ids",
				lang: "lang",
				orc: "out_rcid_candidates",
				pcd: "pc_code",
				ra: "rendered_at",
				vri: "viewrid",
				ir: "rcid",
				ssid1: "sessid1",
				ssid2: "sessid2"
			},
			replayMap = {
				donation_id: !0,
				facebook_id: !0,
				fund_id: !0,
				person_id: !0,
				user_id: !0,
				flow: !0,
				gfm: !0,
				experimentvariant_ids: !0,
				pc_code: !0,
				rendered_at: !0,
				out_referer_code: !0,
				rcid: !0,
				elementid: !0,
				viewid: !0,
				viewrid: !0
			};
		window.onbeforeunload = function() {};
		var isPostDonate = function() {
				return "undefined" != typeof data.viewid && "pg_postdonate_thankyou" == data.viewid
			},
			isFund = function() {
				return !!data.fund_id
			},
			gaDataLayerDef = {
				userDetails: {
					userId: "person_id"
				},
				fundDetails: {
					_include: isFund,
					fundId: "fund_id",
					fundName: "fund_name",
					fundUrl: "fund_url",
					fundCountry: "fund_country",
					fundAmountRaised: "fund_balance",
					fundDonationCount: "donation_count"
				},
				sessionDetails: {
					refId: "rcid",
					sessionId: "fuid"
				},
				pageDetails: {},
				ecommerce: {
					checkout: {
						_include: isFund,
						products: [{
							id: "fund_id",
							price: "donation_amount",
							brand: "donation_currencycode",
							currency: "donation_currencycode"
						}]
					},
					purchase: {
						_include: isPostDonate,
						actionField: {
							id: "donation_id",
							revenue: "donation_amount",
							currency: "donation_currencycode"
						},
						products: [{
							name: "fund_name",
							id: "fund_id",
							quantity: 1
						}]
					}
				}
			},
			consoleLog = function(msg) {
				window.console && window.console.log(msg)
			},
			dLog = function(msg) {
				window.console && data.log_debug && window.console.log(msg)
			},
			dEvtLog = function(level, msg) {
				log_levels[level] < log_levels[data.log_level] || window.console && window.console.log(msg)
			},
			_getGaDataLayer = function(data_layer_def) {
				if (null != data_layer_def._include && !data_layer_def._include()) return null;
				var dst_hash = {};
				for (var key in data_layer_def)
					if ("_include" != key) {
						var val_def = data_layer_def[key];
						if (val_def.constructor == Object) null != (dl = _getGaDataLayer(val_def)) && (dst_hash[key] = dl);
						else if (val_def.constructor == Array) dst_hash[key] = [_getGaDataLayer(val_def[0])];
						else {
							if (data_val = GFM.analytics.data[val_def], "undefined" == typeof data_val || "" == data_val) continue;
							dst_hash[key] = data_val
						}
					}
				return dst_hash
			},
			getGaDataLayer = function() {
				return _getGaDataLayer(gaDataLayerDef)
			},
			getAnonId = function() {
				return data.anonid
			},
			getUser = function() {
				return data.user_id || ""
			},
			getPerson = function() {
				return data.person_id || ""
			},
			getFund = function() {
				return fund = {
					fund_id: data.fund_id,
					fund_name: data.fund_name,
					fund_url: data.fund_url,
					fund_country: data.fund_country
				}, fund
			},
			getDonation = function() {
				return donation = {
					donation_id: data.donation_id,
					donation_name: data.donation_name,
					donation_email: data.donation_email,
					donation_city: data.donation_city,
					donation_zip: data.donation_zip,
					donation_amount: data.donation_amount,
					donation_country: data.donation_country,
					donation_currencycode: data.donation_currencycode
				}, donation
			},
			getLang = function() {
				try {
					return data.lang || JSON.parse(decodeURIComponent($.cookie("visitor"))).locale
				} catch (err) {
					return "en_US"
				}
			},
			getInRc = function() {
				return data.rcid || ""
			},
			userExists = function() {
				return data.userExists
			},
			setUserExists = function(bool) {
				data.userExists = bool, bool && data.user_id && (package_properties.user_id = data.user_id)
			},
			personExists = function() {
				return data.personExists
			},
			setPersonExists = function(bool) {
				data.personExists = bool, bool && data.person_id && (package_properties.person_id = data.person_id)
			},
			fundExists = function() {
				return data.fundExists
			},
			donationExists = function() {
				return data.donationExists
			},
			inRcExists = function() {
				return data.inRcExists
			},
			setInRcExists = function(bool) {
				data.inRcExists = bool, bool && (package_properties.rcid = data.rcid)
			},
			outRcExists = function() {
				return data.outRcExists
			},
			findRefCode = function(rcid_key) {
				if (data.out_rcid_candidates.hasOwnProperty(rcid_key)) return data.out_rcid_candidates[rcid_key]
			},
			cookiesMatching = function(prefix) {
				for (var matching = [], cookies = document.cookie.split(/; */), i = 0; i < cookies.length; i++)
					if (0 == cookies[i].indexOf(prefix)) {
						var parts = cookies[i].split(/=/),
							decoded = "undefined" != typeof decodeURIComponent ? decodeURIComponent(parts[1]) : decodeURIL(parts[1]);
						matching.push([parts[0], decoded])
					}
				return matching.sort(function(a, b) {
					return b.trknum - a.trknum
				}), matching
			},
			scanEventStore = function(clean_store, make_room) {
				var matching = cookiesMatching(data.event_store_prefix);
				dLog("scanEventStore");
				for (var i = 0; i < matching.length;) {
					dLog("  ..examining " + matching[i][0]);
					var msg = null,
						parts = matching[i][0].split(/-/),
						slot = parseInt(parts[1]);
					try {
						var props = JSON.parse(matching[i][1]);
						matching[i][2] = props
					} catch (err) {
						msg = "bad JSON: " + String(err)
					}
					msg || (props.trknum ? isNaN(slot) || slot >= data.event_max_store_len ? msg = "slot out of range" : clean_store && props.trknum >= data.event_max_attempts && (msg = "aged out") : msg = "missing trknum"), msg ? (dLog("  ..drop event cookie (" + msg + "): " + matching[i][0] + "=" + String(matching[i][1])), $.removeCookie(matching[i][0], {
						path: "/"
					}), matching.splice(i, 1)) : i += 1
				}
				if (make_room)
					for (; matching.length >= data.event_max_store_len;) dLog("  ..drop event cookie (make room): " + matching[0][0] + "=" + String(matching[0][1])), $.removeCookie(matching[0][0], {
						path: "/"
					}), matching.splice(0, 1);
				for (var slots = [], i = 0; i < matching.length; i++) {
					var parts = matching[i][0].split(/-/);
					slots.push(parts[1])
				}
				slots.sort();
				for (var first_avail_slot = NaN, i = 0; i < data.event_max_store_len; i++)
					if (i >= slots.length || i != slots[i]) {
						first_avail_slot = i;
						break
					}
				return [matching, first_avail_slot]
			},
			storeEvent = function(event_type, properties) {
				dLog("storeEvent " + event_type);
				var store_info = scanEventStore(!0, !0),
					first_avail_slot = (store_info[0], store_info[1]),
					props = gen_properties_to_store(replayMap, properties, package_properties),
					cookie = data.event_store_prefix + first_avail_slot;
				return props.trkevt = event_type, props.trknum = 1, props.trkid = Math.round(2e9 * Math.random()), props.distinct_id = window.mixpanel.get_distinct_id(), $.cookie(cookie, JSON.stringify(props), {
					path: "/",
					expires: timeFromNow(60)
				}), [props, cookie]
			},
			dropStoredEvent = function(cookie, props, event_max_attempts) {
				dLog("dropStoredEvent: event_max_attempts=" + event_max_attempts + " trknum=" + props.trknum), props.trknum >= event_max_attempts && (dLog("  ..dropping track event: " + cookie), $.removeCookie(cookie, {
					path: "/"
				}))
			},
			new_cleanup_cb = function(event_type, props, cookie) {
				return function(success) {
					dLog("Got " + event_type + " callback: cookie=" + cookie + " success=" + success + " trkid=" + props.trkid), dropStoredEvent(cookie, props, success ? 0 : data.event_max_attempts)
				}
			},
			storeAndForwardEvent = function(event_type, properties, cookie, library_name) {
				try {
					if (null != cookie) dLog("  ..examining event: cookie=" + cookie), dLog(properties), properties.trknum += 1, $.removeCookie(cookie, {
						path: "/"
					}), $.cookie(cookie, JSON.stringify(properties), {
						path: "/",
						expires: timeFromNow(60)
					}), dLog("  ..dispatching event: cookie=" + cookie + " trknum=" + properties.trknum), properties.tracked_at = $.now(), void 0 !== library_name && "impression" === library_name ? window.mixpanel.impression.track(event_type, properties, new_cleanup_cb(event_type, properties, cookie)) : window.mixpanel["default"].track(event_type, properties, new_cleanup_cb(event_type, properties, cookie));
					else {
						var results = storeEvent(event_type, properties),
							props = results[0],
							cookie = results[1];
						dLog("  ..tracking " + event_type + " cookie=" + cookie), properties.tracked_at = $.now(), void 0 !== library_name && "impression" === library_name ? window.mixpanel.impression.track(event_type, properties, new_cleanup_cb(event_type, props, cookie)) : window.mixpanel["default"].track(event_type, properties, new_cleanup_cb(event_type, props, cookie))
					}
				} catch (err) {
					consoleLog(err)
				}
			},
			dispatchStoredEvents = function() {
				try {
					dLog("dispatchStoredEvents");
					for (var store_info = scanEventStore(!0, !0), matching = store_info[0], i = 0; i < matching.length; i++) storeAndForwardEvent(matching[i][2].trkevt, matching[i][2], matching[i][0])
				} catch (err) {
					consoleLog(err)
				}
			},
			gen_properties_to_store = function(to_include, props_superior, props_inferior) {
				var props = {};
				for (var key in props_inferior) to_include.hasOwnProperty(key) && null != props_inferior[key] && "" != props_inferior[key] && (props[key] = props_inferior[key]);
				for (var key in props_superior) to_include.hasOwnProperty(key) && null != props_superior[key] && "" != props_superior[key] && (props[key] = props_superior[key]);
				return props
			},
			track_client_event = function(event_category, event, status, meta) {
				var gfmData = {
					event_category: event_category,
					event: event
				};
				null !== status && void 0 !== status && ("success" === status || "fail" === status || "intent" === status ? gfmData.status = status : consoleLog('Error: "status" passed into track_client_event must be either success|fail|intent')), null !== meta && void 0 !== meta && (gfmData.event_meta = meta), track_event("web_client_event", {
					gfm: gfmData
				})
			},
			track_event = function(event_type, properties, store_event, library_name) {
				store_event = "undefined" == typeof store_event || store_event;
				try {
					dLog("track_event " + event_type);
					var data_props = {};
					for (var mapkey in dataMap) "" != data[dataMap[mapkey]] && (data_props[dataMap[mapkey]] = data[dataMap[mapkey]]);
					var gfm_attrs = merge(merge(merge({}, data.gfm), event_properties.gfm), properties.gfm),
						send_props = merge(merge(data_props, event_properties), properties);
					send_props.gfm = gfm_attrs, send_props.gfm.lang = JSON.parse(decodeURIComponent($.cookie("visitor"))).locale;
					try {
						var ssid1 = $.cookie("ssid1").split(":")[0],
							ssid2 = $.cookie("ssid2").split(":")[0];
						send_props.ssid1 = ssid1, send_props.ssid2 = ssid2
					} catch (e) {
						window.console.error || (window.console.error = function(x) {
							return window.console.log(x)
						})
					}
					if (delete send_props.out_rcid_candidates, properties.hasOwnProperty("out_rcid")) {
						var rc = findRefCode(properties.out_rcid);
						rc && (send_props.out_referer_code = findRefCode(properties.out_rcid))
					}
					send_props.hasOwnProperty("viewid") || "" == data.viewid || (send_props.viewid = data.viewid), send_props.viewrid = data.viewrid + "-" + data.view_count, "mp_page_view" == event_type ? (data.view_count += 1, data.rendered_at = $.now(), data.last_event_at = data.rendered_at, data.event_at = data.rendered_at, send_props.rendered_at = data.rendered_at) : "mp_page_click" == event_type && (data.last_event_at = 0 == data.event_at ? data.rendered_at : data.event_at, data.event_at = $.now(), send_props.rendered_at = data.rendered_at, send_props.last_event_at = data.last_event_at, send_props.event_at = data.event_at);
					var debuggingEnabled = !1;
					if (allowDebug && debuggingEnabled) {
						JSON.stringify(send_props, null, 2)
					}
					data.event_store && store_event ? (dLog("storeAndForward"), storeAndForwardEvent(event_type, send_props, null)) : (dLog("sendStraightThrough"), void 0 !== library_name && "impression" === library_name ? mixpanel.impression.track(event_type, send_props) : mixpanel["default"].track(event_type, send_props))
				} catch (err) {
					consoleLog(err)
				}
			},
			track_share = function(rcid_key, properties) {
				var props = copy_hash(properties),
					cached_ref_code = findRefCode(rcid_key);
				properties.referer_code ? (props.out_rcid = rcid_key, props.out_referer_code = properties.referer_code, props.out_referer_code.rcid = rcid_key) : cached_ref_code && (props.out_rcid = rcid_key, props.out_referer_code = cached_ref_code), data.event_store ? storeAndForwardEvent("mp_referer_code", props, null) : mixpanel["default"].track("mp_referer_code", props)
			},
			track_referer_code = function(rcid_key) {
				data.event_store ? storeAndForwardEvent("mp_referer_code", {
					out_referer_code: findRefCode(rcid_key)
				}, null) : mixpanel["default"].track("mp_referer_code", {
					out_referer_code: findRefCode(rcid_key)
				})
			},
			addPackageProperty = function(key, value) {
				package_properties[key] = value
			},
			addEventProperty = function(key, value) {
				event_properties[key] = value
			},
			getPackage = function() {
				try {
					package_properties.user_agent = navigator.userAgent
				} catch (err) {
					consoleLog(err)
				}
				return package_properties
			},
			getEventProperties = function() {
				return event_properties
			},
			setData = function(key, value) {
				try {
					dataMap.hasOwnProperty(key) && ("fud" == key && (value = value || $.cookie("fuid")), "lang" == key && (value = value || JSON.parse(decodeURIComponent($.cookie("visitor"))).locale), "flw" == key && "" == value && void 0 !== $.cookie("flow") && (value = JSON.parse($.cookie("flow"))), "gfm" == key ? merge(data.gfm, value) : data[dataMap[key]] = value), "gfmuser" === key && (gfmUser = value), "u" === key && setUserExists(!0), "p" === key && setPersonExists(!0), "ir" === key && setInRcExists(!0)
				} catch (err) {
					consoleLog(err)
				}
			},
			setMatchRule = function(view, tags, events) {
				if (!("all" != view && view.length < 5 || tags.length < 1 || events.length < 1)) {
					for (var t = {}, e = {}, i = 0; i < tags.length; i++) t[tags[i].toLowerCase()] = 1;
					for (var i = 0; i < events.length; i++) e[events[i].toLowerCase()] = 1;
					dEvtLog("verbose", "data.match_rule (1) = " + JSON.stringify(data.match_rules)), data.match_rules.push({
						view: view,
						tags: t,
						events: e
					}), dEvtLog("verbose", "data.match_rule (2) = " + JSON.stringify(data.match_rules))
				}
			},
			matching_events = {
				focus: "focus",
				click: "click"
			},
			eventHandlerJS = function(ev_name, _ev) {
				if (dEvtLog("verbose", "EV TYPE: " + _ev.type), matchesRule(_ev)) {
					var id, ev = _ev || window.event,
						target = ev && (ev.target || ev.srcElement),
						context = target._gfm_analytics_event_context = target._gfm_analytics_event_context || {
							props: {},
							events: [],
							handled: !1
						};
					if (context.events.push(ev_name), !context.handled && (context.handled = !0, matching_events.hasOwnProperty(ev_name))) {
						var props = context.props = {
							event: matching_events[ev_name],
							elid_type: void 0,
							elid: void 0,
							elpath: getXPathLike(target, !1, !1)
						};
						data.xx_tag = target.tagName, data.xx_ev = target, props.viewid = data.viewid, props.panels = function(panels) {
							for (var res = "", i = 0; i < panels.length; i++) 0 != res.length && (res += ","), res += panels[i].panel;
							return res
						}(getParentPanels(target)), void 0 != target.getAttribute && (void 0 != (id = target.getAttribute("data-tk-elid")) ? (props.elid_type = "elid", props.elid = id) : void 0 != (id = target.getAttribute("data-gfm-analytics-element")) ? (props.elid_type = "elem", props.elid = id) : void 0 != (id = target.getAttribute("id")) && (props.elid_type = "id", props.elid = id)), setTimeout(function() {
							var events = context.events,
								nb_click = 0,
								nb_focus = 0;
							for (i = 0; i < events.length; i++) "mousedown" == events[i] || "click" == events[i] ? nb_click += 1 : "focus" == events[i] && (nb_focus += 1);
							context.props.event = nb_click && "click" || nb_focus && "tab_focus" || "unknown", dEvtLog("debug", context.props), track_event("clickstream", {
								gfm: context.props
							}), setTimeout(function() {
								delete target._gfm_analytics_event_context
							}, 250)
						}, 50)
					}
				}
			},
			pokeListener = function(event) {
				dEvtLog("verbose", "POKE: " + event.type)
			},
			trackView = function(elements) {
				if (dEvtLog("verbose", "TRACK VIEW"), !elements) return void dEvtLog("verbose", "Unsufficient data - skipping");
				for (var tags = ["input", "a", "textarea", "div", "span", "img"], e = 0; e < elements.length; e++)
					for (var t = 0; t < tags.length; t++)
						for (var targets = elements[e].getElementsByTagName(tags[t]), i = 0; i < targets.length; i++) $(targets[i]).on("click", pokeListener).on("focus", pokeListener)
			};
		return {
			data: data,
			getEventProperties: getEventProperties,
			getAnonId: getAnonId,
			getUser: getUser,
			getPerson: getPerson,
			getFund: getFund,
			getDonation: getDonation,
			getLang: getLang,
			getInRc: getInRc,
			setData: setData,
			userExists: userExists,
			personExists: personExists,
			fundExists: fundExists,
			donationExists: donationExists,
			inRcExists: inRcExists,
			outRcExists: outRcExists,
			track_referer_code: track_referer_code,
			track_share: track_share,
			track_client_event: track_client_event,
			track_event: track_event,
			addPackageProperty: addPackageProperty,
			addEventProperty: addEventProperty,
			getPackage: getPackage,
			getGaDataLayer: getGaDataLayer,
			dispatchStoredEvents: dispatchStoredEvents,
			eventHandlerJS: eventHandlerJS,
			trackView: trackView,
			poke: pokeListener,
			setMatchRule: setMatchRule
		}
	}(GFM, jQuery), $(document).ready(function() {
		GFM.analytics.data.event_store && GFM.analytics.dispatchStoredEvents()
	})
} catch (e) {
	window.console && window.console.log("GFM.analytics NOT loaded.")
}
GFM = window.GFM || {}, GFM.Planout = function(GFM) {
	function Experiment(name, params, log) {
		function logExposure() {
			hasLogged || "undefined" == typeof log || (GFM.analytics.track_event("client_exposure", _log), hasLogged = !0)
		}
		var _params = params || {},
			_log = log,
			hasLogged = !1;
		this.warn = function(message) {
			try {} catch (e) {}
		}, this.get = function(key, defaultValue) {
			var ret = defaultValue;
			return "undefined" == typeof defaultValue && this.warn("No default value provided to get.  Will default to undefined!"), _params.hasOwnProperty(key) && (ret = _params[key], logExposure()), ret
		}
	}

	function getExperiment(name) {
		return experiments.hasOwnProperty(name) ? experiments[name] : new Experiment(name)
	}

	function addExperiment(name, params, log) {
		experiments.hasOwnProperty(name) && this.warn("Experiment " + name + " is already defined. Definition is being overwritten!"), experiments[name] = new Experiment(name, params, log)
	}
	var experiments = {};
	return {
		getExperiment: getExperiment,
		addExperiment: addExperiment
	}
}(GFM);
var GFM = GFM || {};
GFM.gaEventTracking = function() {
		var trackDesktopCheckoutEvent = function(eventAction, eventLabel, eventValue) {
				return "undefined" == typeof eventValue && (eventValue = null), trackEvent("desktop-checkout", eventAction, eventLabel, eventValue)
			},
			trackMobileCheckoutEvent = function(eventAction, eventLabel, eventValue) {
				return "undefined" == typeof eventValue && (eventValue = null), trackEvent("mobile-checkout", eventAction, eventLabel, eventValue)
			},
			trackResponsiveCampaignEvent = function(eventAction, eventLabel) {
				return trackEvent("responsive-campaign", eventAction, eventLabel)
			},
			trackSearch = function(eventAction, eventLabel) {
				return trackEvent("search", eventAction, eventLabel)
			},
			trackThankATeacher = function(eventAction, eventLabel) {
				return trackEvent("thankateacher", eventAction, eventLabel)
			},
			trackLIFG = function(eventAction, eventLabel) {
				return trackEvent("linkedinforgood", eventAction, eventLabel)
			},
			trackMobilePostDonate = function(eventAction, eventLabel, screenOrder) {
				if ("comment-fb" === eventAction && eventLabel === GFM.postdonateCommon.actions.accept) {
					var $privateDonation = $("#private-donation-checked-before"),
						screenNumber = $privateDonation.closest(".success-steps").prevAll(".js-postdonate-screen-number").first().attr("name");
					"1" === $privateDonation.val() ? trackMobilePostDonate("comment-fb-made-private", GFM.postdonateCommon.actions.accept, screenNumber) : trackMobilePostDonate("comment-fb-made-private", GFM.postdonateCommon.actions.skip, screenNumber)
				}
				if ("more-share" === eventAction && eventLabel === GFM.postdonateCommon.actions.show) {
					var screenNumber = $(".success-step-3").prevAll(".js-postdonate-screen-number").first().attr("name");
					GFM.utils.userAgentUtils.isIOS() && trackMobilePostDonate("more-share-sms", eventLabel, screenNumber), trackMobilePostDonate("more-share-email", eventLabel, screenNumber), trackMobilePostDonate("more-share-tweet", eventLabel, screenNumber), trackMobilePostDonate("more-share-back-to-campaign", eventLabel, screenNumber), trackMobilePostDonate("more-share-another-campaign", eventLabel, screenNumber)
				}
				return screenOrder && (eventAction = eventAction + " (" + String(screenOrder) + ")"), trackEvent("mobile-postdonate", eventAction, eventLabel)
			},
			track3dsRedirection = function(eventAction, eventLabel, eventValue, eventCallback) {
				return trackEvent("3ds", eventAction, eventLabel, eventValue, eventCallback)
			},
			trackPostShareUpsell = function(eventAction, eventLabel, eventValue, eventCallback) {
				return trackEvent("post-share-upsell", eventAction, eventLabel, eventValue, eventCallback)
			},
			trackEvent = function(eventCategory, eventAction, eventLabel, eventValue, eventCallback) {
				pushRawEvent("trigger-ga-event", eventCategory, eventAction, eventLabel, eventValue, eventCallback)
			},
			trackVirtualPageView = function(pagePath) {
				window.dataLayer && window.dataLayer instanceof Array && window.dataLayer.push({
					event: "trigger-page-view",
					pagePath: pagePath
				})
			},
			pushRawEvent = function(event, eventCategory, eventAction, eventLabel, eventValue, eventCallback) {
				window.dataLayer && window.dataLayer instanceof Array ? ("customizeComplete" == event && GFM.gaEventTracking.trackVirtualPageView("customizeComplete"), window.dataLayer.push({
					event: event,
					eventCategory: eventCategory,
					eventAction: eventAction,
					eventLabel: eventLabel,
					eventValue: eventValue,
					nonInteraction: !0,
					eventCallback: eventCallback
				})) : null != eventCallback && eventCallback()
			};
		return {
			trackDesktopCheckoutEvent: trackDesktopCheckoutEvent,
			trackMobileCheckoutEvent: trackMobileCheckoutEvent,
			trackResponsiveCampaignEvent: trackResponsiveCampaignEvent,
			trackEvent: trackEvent,
			trackSearch: trackSearch,
			trackThankATeacher: trackThankATeacher,
			trackLIFG: trackLIFG,
			trackMobilePostDonate: trackMobilePostDonate,
			track3dsRedirection: track3dsRedirection,
			trackPostShareUpsell: trackPostShareUpsell,
			pushRawEvent: pushRawEvent,
			trackVirtualPageView: trackVirtualPageView
		}
	}(),
	function(root, factory) {
		"function" == typeof define && define.amd ? define([], function() {
			return factory(root)
		}) : "object" == typeof exports ? module.exports = factory(root) : root.Polyglot = factory(root)
	}(this, function(root) {
		"use strict";

		function Polyglot(options) {
			options = options || {}, this.phrases = {}, this.extend(options.phrases || {}), this.currentLocale = options.locale || "en", this.allowMissing = !!options.allowMissing, this.warn = options.warn || warn
		}

		function langToTypeMap(mapping) {
			var type, langs, l, ret = {};
			for (type in mapping)
				if (mapping.hasOwnProperty(type)) {
					langs = mapping[type];
					for (l in langs) ret[langs[l]] = type
				}
			return ret
		}

		function trim(str) {
			var trimRe = /^\s+|\s+$/g;
			return str.replace(trimRe, "")
		}

		function choosePluralForm(text, locale, count) {
			var ret, texts, chosenText;
			return null != count && text ? (texts = text.split(delimeter), chosenText = texts[pluralTypeIndex(locale, count)] || texts[0], ret = trim(chosenText)) : ret = text, ret
		}

		function pluralTypeName(locale) {
			var langToPluralType = langToTypeMap(pluralTypeToLanguages);
			return langToPluralType[locale] || langToPluralType.en
		}

		function pluralTypeIndex(locale, count) {
			return pluralTypes[pluralTypeName(locale)](count)
		}

		function interpolate(phrase, options) {
			for (var arg in options) "_" !== arg && options.hasOwnProperty(arg) && (phrase = phrase.replace(new RegExp("%\\{" + arg + "\\}", "g"), options[arg]));
			return phrase
		}

		function warn(message) {
			root.console && root.console.warn && root.console.warn("WARNING: " + message)
		}

		function clone(source) {
			var ret = {};
			for (var prop in source) ret[prop] = source[prop];
			return ret
		}
		Polyglot.VERSION = "0.4.3", Polyglot.prototype.locale = function(newLocale) {
			return newLocale && (this.currentLocale = newLocale), this.currentLocale
		}, Polyglot.prototype.extend = function(morePhrases, prefix) {
			var phrase;
			for (var key in morePhrases) morePhrases.hasOwnProperty(key) && (phrase = morePhrases[key], prefix && (key = prefix + "." + key), "object" == typeof phrase ? this.extend(phrase, key) : this.phrases[key] = phrase)
		}, Polyglot.prototype.clear = function() {
			this.phrases = {}
		}, Polyglot.prototype.replace = function(newPhrases) {
			this.clear(), this.extend(newPhrases)
		}, Polyglot.prototype.t = function(key, options) {
			var phrase, result;
			return options = null == options ? {} : options, "number" == typeof options && (options = {
				smart_count: options
			}), "string" == typeof this.phrases[key] ? phrase = this.phrases[key] : "string" == typeof options._ ? phrase = options._ : this.allowMissing ? phrase = key : (this.warn('Missing translation for key: "' + key + '"'), result = key), "string" == typeof phrase && (options = clone(options), result = choosePluralForm(phrase, this.currentLocale, options.smart_count), result = interpolate(result, options)), result
		}, Polyglot.prototype.has = function(key) {
			return key in this.phrases
		};
		var delimeter = "||||",
			pluralTypes = {
				chinese: function(n) {
					return 0
				},
				german: function(n) {
					return 1 !== n ? 1 : 0
				},
				french: function(n) {
					return n > 1 ? 1 : 0
				},
				russian: function(n) {
					return n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2
				},
				czech: function(n) {
					return 1 === n ? 0 : n >= 2 && n <= 4 ? 1 : 2
				},
				polish: function(n) {
					return 1 === n ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2
				},
				icelandic: function(n) {
					return n % 10 !== 1 || n % 100 === 11 ? 1 : 0
				}
			},
			pluralTypeToLanguages = {
				chinese: ["fa", "id", "ja", "ko", "lo", "ms", "th", "tr", "zh"],
				german: ["da", "de", "en", "es", "fi", "el", "he", "hu", "it", "nl", "no", "pt", "sv"],
				french: ["fr", "tl", "pt-br"],
				russian: ["hr", "ru"],
				czech: ["cs"],
				polish: ["pl"],
				icelandic: ["is"]
			};
		return Polyglot
	});
var getLocale = function() {
		return GFM.analytics.getLang()
	},
	getLang = function() {
		var locale = getLocale();
		return locale.split("_")[0]
	},
	escapeRegExp = function(str) {
		return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")
	},
	replaceAll = function(str, find, replace) {
		return str.replace(new RegExp(escapeRegExp(find), "g"), replace)
	},
	polyglotLocale = getLang(),
	polyglot = new Polyglot({
		locale: polyglotLocale,
		allowMissing: !0
	});
"undefined" != typeof console;
var replaceVariable = function(str, replacements) {
		for (var key in replacements) str = replaceAll(str, "{" + key + "}", replacements[key]);
		return str
	},
	_t = function(str, singularStrOrOptions, count, pluralOptions) {
		var polyglotLoaded = "undefined" != typeof polyglot,
			isSingular = "undefined" == typeof count;
		if (!polyglotLoaded && "undefined" != typeof console, isSingular) {
			var options = "undefined" != typeof singularStrOrOptions ? singularStrOrOptions[0] : {},
				polyglotTranslation = polyglotLoaded ? polyglot.t(str, options) : null;
			return polyglotTranslation && polyglotTranslation !== str ? polyglotTranslation : replaceVariable(str, options)
		}
		var options = "undefined" != typeof pluralOptions ? pluralOptions[0] : {};
		options.smart_count = count;
		var pluralizedString = singularStrOrOptions + "_pluralize",
			polyglotTranslation = polyglotLoaded ? polyglot.t(pluralizedString, options) : null;
		if (polyglotTranslation && polyglotTranslation !== pluralizedString) return polyglotTranslation;
		var finalStr = 1 === count ? singularStrOrOptions : str;
		return replaceVariable(finalStr, options)
	};
_t.getTinyMCELang = function() {
	var localeMap = {
		es_ES: "es",
		fr_FR: "fr_FR"
	};
	return localeMap[getLocale()]
};
var GFM = GFM || {};
GFM.components = GFM.components || {},
	function() {
		var VisitorCookie = function() {
			if (this.visitorJSON = {}, $.cookie("visitor")) {
				try {
					this.visitorJSON = JSON.parse(decodeURIComponent($.cookie("visitor")))
				} catch (e) {
					return void(void 0 !== NREUM && NREUM.noticeError(e))
				}
				var hostname = window.location.hostname;
				this.cookieDomain = "." + hostname.substring(hostname.indexOf(GFM_DOMAIN), hostname.length), void 0 === this.visitorJSON.cookieWarning && (this.visitorJSON.cookieWarning = "0", this.saveVisitorCookie()), $(function() {
					this.isResponsive = document.querySelectorAll(".fixed-container").length > 0;
					var shownCookieBanner = !1;
					void 0 !== this.visitorJSON.country && "0" === this.visitorJSON.cookieWarning && this.isCookieWarningCountry() && (shownCookieBanner = !0, this.showCookieWarning())
				}.bind(this))
			}
		};
		VisitorCookie.prototype.saveVisitorCookie = function() {
			$.cookie("visitor", encodeURIComponent(JSON.stringify(this.visitorJSON)), {
				path: "/",
				domain: this.cookieDomain
			})
		}, VisitorCookie.prototype.setVisitorCookie = function(key, value) {
			this.visitorJSON[key] = value, this.saveVisitorCookie()
		}, VisitorCookie.prototype.getVisitorCookie = function(key) {
			return this.visitorJSON[key]
		}, VisitorCookie.prototype.deleteVisitorCookie = function(key) {
			unset(this.visitorJSON[key]), this.saveVisitorCookie()
		}, VisitorCookie.prototype.dismissCookieWarning = function() {
			if (this.isResponsive) {
				var container = document.getElementsByClassName("fixed-container")[0];
				container.removeChild(container.children[0]);
				var content = document.querySelectorAll(".js-content-wrap")[0];
				void 0 === content && (content = document.body), content.style.cssText = "margin-top:" + document.querySelectorAll(".fixed-container")[0].offsetHeight + "px;"
			} else {
				for (var body = document.getElementsByTagName("body")[0], headerChildNumber = 0;
					"DIV" !== body.children[headerChildNumber].tagName && headerChildNumber < body.children.length;) headerChildNumber++;
				body.removeChild(body.children[headerChildNumber]), navigator.userAgent.match(/IEMobile|Android|BlackBerry|iPhone|iPod|Opera Mini/i) || (body.children[headerChildNumber].style = "top:40px", document.querySelectorAll(".topbar").length > 0 ? document.querySelectorAll(".topbar")[0].style = "" : document.querySelectorAll(".head_contain").length > 0 ? document.querySelectorAll(".head_contain")[0].style = "" : document.querySelectorAll(".head_contain_small").length > 0 ? document.querySelectorAll(".head_contain_small")[0].style = "" : document.querySelectorAll(".hpt2 .box").length > 0 ? document.querySelectorAll(".hpt2 .box")[0].style = "" : document.querySelectorAll(".a .container_wide").length > 0 && (document.querySelectorAll(".a .container_wide")[0].style = "")), body.children[headerChildNumber].style = ""
			}
		}, VisitorCookie.prototype.showWarningBanner = function(text, responsiveText, onDismiss) {
			var cookieAlert = document.createElement("div");
			cookieAlert.className = "hd_alert", responsiveText = responsiveText || text, onDismiss = onDismiss || function() {};
			var close, mobileCookieAlert = '<div class="mob-width"><div class="wrap">' + text + '</div><div class="ico-close"></div></div>',
				desktopCookieAlert = '<div class="hd_alert_contain">' + text + '<div class="close" style="cursor:pointer;"></div></div>',
				responsiveCookieAlert = '<div class="alert-notif js-cookie-banner"><div class="disp-ib">' + responsiveText + '</div><a class="close-button" data-close="" aria-label="Close modal"><i class="fa fa-times"></i></a></div>';
			if (this.isResponsive ? (cookieAlert.innerHTML = responsiveCookieAlert, close = cookieAlert.querySelectorAll(".close-button")[0]) : navigator.userAgent.match(/IEMobile|Android|BlackBerry|iPhone|iPod|Opera Mini/i) ? (cookieAlert.innerHTML = mobileCookieAlert, close = cookieAlert.querySelectorAll(".ico-close")[0]) : (cookieAlert.innerHTML = desktopCookieAlert, close = cookieAlert.querySelectorAll(".close")[0]), this.isResponsive) {
				var container = document.getElementsByClassName("fixed-container")[0];
				container.insertBefore(cookieAlert, container.children[0] || null);
				var content = document.querySelectorAll(".js-content-wrap")[0];
				void 0 === content && (content = document.body), content.style.cssText = "margin-top:" + document.querySelectorAll(".fixed-container")[0].offsetHeight + "px;"
			} else {
				for (var body = document.getElementsByTagName("body")[0], headerChildNumber = 0;
					"DIV" !== body.children[headerChildNumber].tagName && headerChildNumber < body.children.length;) headerChildNumber++;
				navigator.userAgent.match(/IEMobile|Android|BlackBerry|iPhone|iPod|Opera Mini/i) || (body.children[headerChildNumber].style = "top:40px", document.querySelectorAll(".topbar").length > 0 ? document.querySelectorAll(".topbar")[0].style = "margin-top:140px;" : document.querySelectorAll(".head_contain").length > 0 ? document.querySelectorAll(".head_contain")[0].style = "margin-top:40px;" : document.querySelectorAll(".head_contain_small").length > 0 ? document.querySelectorAll(".head_contain_small")[0].style = "margin-top:40px;" : document.querySelectorAll(".hpt2 .box").length > 0 ? document.querySelectorAll(".hpt2 .box")[0].style = "margin-top:40px;" : document.querySelectorAll(".a .container_wide").length > 0 && (document.querySelectorAll(".a .container_wide")[0].style = "margin-top:127px;")), body.insertBefore(cookieAlert, body.children[headerChildNumber] || null)
			}
			close.addEventListener("click", function(e) {
				e.preventDefault(), onDismiss()
			})
		}, VisitorCookie.prototype.showCookieWarning = function() {
			this.showWarningBanner(GFM.components.visitorCookieStrings.privacyLine, GFM.components.visitorCookieStrings.responsivePrivacyLine, function() {
				this.setVisitorCookie("cookieWarning", 1), this.dismissCookieWarning()
			}.bind(this))
		}, VisitorCookie.prototype.isCookieWarningCountry = function() {
			var country = this.visitorJSON.country,
				CookieWarningCountries = ["AT", "AU", "BE", "BG", "HR", "CH", "CY", "CZ", "DK", "EE", "ES", "FI", "FR", "DE", "GB", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "NO", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "UK", "CA"];
			return CookieWarningCountries.indexOf(country) !== -1
		}, GFM.components.VisitorCookie = new VisitorCookie
	}();