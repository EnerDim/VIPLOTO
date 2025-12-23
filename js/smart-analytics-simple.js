! function() {
    let e = !1,
        t = !1;
    const o = function(e) {
            if (!e || window.ym) return;
            const t = document.createElement("script");
            t.async = !0, t.src = "https://mc.yandex.ru/metrika/tag.js", t.onload = function() {
                window.ym = window.ym || function() {
                    (window.ym.a = window.ym.a || []).push(arguments)
                }, window.ym.l = 1 * new Date, ym(e, "init", { clickmap: !0, trackLinks: !0, accurateTrackBounce: !0, webvisor: !0 })
            }, document.head.appendChild(t)
        },
        n = function(e) {
            var t, o, n, a, i, c;
            e && !window.fbq && (t = window, o = document, n = "script", t.fbq || (a = t.fbq = function() { a.callMethod ? a.callMethod.apply(a, arguments) : a.queue.push(arguments) }, t._fbq || (t._fbq = a), a.push = a, a.loaded = !0, a.version = "2.0", a.queue = [], (i = o.createElement(n)).async = !0, i.src = "https://connect.facebook.net/en_US/fbevents.js", (c = o.getElementsByTagName(n)[0]).parentNode.insertBefore(i, c)), fbq("init", e), fbq("track", "PageView"))
        },
        a = function(e) {
            if (!e || window.gtag) return;
            const t = document.createElement("script");
            t.async = !0, t.src = "https://www.googletagmanager.com/gtag/js?id=G-" + e, t.onload = function() {
                function t() { dataLayer.push(arguments) }
                window.dataLayer = window.dataLayer || [], window.gtag = t, t("js", new Date), t("config", "G-" + e)
            }, document.head.appendChild(t)
        },
        i = function(e) {
            e && !window.ttq && (! function(t, o, n) {
                t.TiktokAnalyticsObject = n;
                var a = t[n] = t[n] || [];
                a.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie"], a.setAndDefer = function(e, t) { e[t] = function() { e.push([t].concat(Array.prototype.slice.call(arguments, 0))) } };
                for (var i = 0; i < a.methods.length; i++) a.setAndDefer(a, a.methods[i]);
                a.instance = function(e) { for (var t = a._i[e] || [], o = 0; o < a.methods.length; o++) a.setAndDefer(t, a.methods[o]); return t }, a.load = function(e, t) {
                    var o = "https://analytics.tiktok.com/i18n/pixel/events.js";
                    a._i = a._i || {}, a._i[e] = [], a._i[e]._u = o, a._t = a._t || {}, a._t[e] = +new Date, a._o = a._o || {}, a._o[e] = t || {};
                    var i = document.createElement("script");
                    i.type = "text/javascript", i.async = !0, i.src = o + "?sdkid=" + e + "&lib=" + n;
                    var c = document.getElementsByTagName("script")[0];
                    c.parentNode.insertBefore(i, c)
                }, a.load(e), a.page()
            }(window, document, "ttq"))
        },
        c = function(e) {
            e && !window.kwaiq && (! function(t, o) {
                var n = t.kwaiq || (t.kwaiq = []);
                n.methods = ["init", "track", "trackCustom", "identify"], n.factory = function(e) { return function() { var t = Array.prototype.slice.call(arguments); return t.unshift(e), n.push(t), n } };
                for (var a = 0; a < n.methods.length; a++) {
                    var i = n.methods[a];
                    n[i] = n.factory(i)
                }
                n.load = function() {
                    var e = o.createElement("script");
                    e.async = !0, e.src = "https://pixelapi.kwaipros.com/pixel.js";
                    var t = o.getElementsByTagName("script")[0];
                    t.parentNode.insertBefore(e, t)
                }, n.load(), n.init(e), n.track("PageView")
            }(window, document))
        },
        r = function(e) {
            e && !window.bigo && (! function(t, o, n) {
                t.BigoAnalyticsObject = n;
                var a = t[n] = t[n] || [];
                a.methods = ["track", "identify", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie"], a.factory = function(e) { return function() { var t = Array.prototype.slice.call(arguments); return t.unshift(e), a.push(t), a } };
                for (var i = 0; i < a.methods.length; i++) {
                    var c = a.methods[i];
                    a[c] = a.factory(c)
                }
                a.load = function(e, t) {
                    var o = document.createElement("script");
                    o.type = "text/javascript", o.async = !0, o.src = "https://tracking.bigo.sg/js/track.js", (t = document.getElementsByTagName("script")[0]).parentNode.insertBefore(o, t), a._i = e
                }, a.load(e), a.track("PageView")
            }(window, document, "bigo"))
        };

    function l() {
        if (e) return;
        e = !0;
        const t = window.analyticsConfig;
        t.yandex && "null" !== t.yandex && o(t.yandex.replace(/'/g, "")), t.facebook && "null" !== t.facebook && n(t.facebook.replace(/'/g, "")), t.google && "null" !== t.google && a(t.google.replace(/'/g, "")), t.tiktok && "null" !== t.tiktok && i(t.tiktok.replace(/'/g, "")), t.kwai && "null" !== t.kwai && c(t.kwai.replace(/'/g, "")), t.bigo && "null" !== t.bigo && r(t.bigo.replace(/'/g, ""))
    }

    function s() { t || (t = !0, setTimeout(l, 100)) }["click", "scroll", "touchstart"].forEach((function(e) { document.addEventListener(e, s, { once: !0, passive: !0 }) })), setTimeout((function() { e || l() }), 5e3)
}();
//# sourceMappingURL=smart-analytics-simple.js.map