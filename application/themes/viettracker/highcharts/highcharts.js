/*
 Highcharts JS v2.3.5 (2012-12-19)

 (c) 2009-2012 Torstein Hønsi

 License: www.highcharts.com/license
*/
(function () {
    function x(a, b) {
        var c;
        a || (a = {});
        for (c in b) a[c] = b[c];
        return a
    }
    function ia() {
        for (var a = 0, b = arguments, c = b.length, d = {}; a < c; a++) d[b[a++]] = b[a];
        return d
    }
    function z(a, b) {
        return parseInt(a, b || 10)
    }
    function ja(a) {
        return typeof a === "string"
    }
    function Y(a) {
        return typeof a === "object"
    }
    function Ia(a) {
        return Object.prototype.toString.call(a) === "[object Array]"
    }
    function Da(a) {
        return typeof a === "number"
    }
    function ka(a) {
        return K.log(a) / K.LN10
    }
    function aa(a) {
        return K.pow(10, a)
    }
    function ta(a, b) {
        for (var c = a.length; c--;) if (a[c] === b) {
            a.splice(c, 1);
            break
        }
    }
    function r(a) {
        return a !== A && a !== null
    }
    function w(a, b, c) {
        var d, e;
        if (ja(b)) r(c) ? a.setAttribute(b, c) : a && a.getAttribute && (e = a.getAttribute(b));
        else if (r(b) && Y(b)) for (d in b) a.setAttribute(d, b[d]);
        return e
    }
    function la(a) {
        return Ia(a) ? a : [a]
    }
    function n() {
        var a = arguments,
            b, c, d = a.length;
        for (b = 0; b < d; b++) if (c = a[b], typeof c !== "undefined" && c !== null) return c
    }
    function I(a, b) {
        if (Ea && b && b.opacity !== A) b.filter = "alpha(opacity=" + b.opacity * 100 + ")";
        x(a.style, b)
    }
    function T(a, b, c, d, e) {
        a = C.createElement(a);
        b && x(a, b);
        e && I(a, {
            padding: 0,
            border: Q,
            margin: 0
        });
        c && I(a, c);
        d && d.appendChild(a);
        return a
    }
    function ba(a, b) {
        var c = function () {};
        c.prototype = new a;
        x(c.prototype, b);
        return c
    }
    function Ja(a, b, c, d) {
        var e = N.lang,
            f = a;
        b === -1 ? (b = (a || 0).toString(), a = b.indexOf(".") > -1 ? b.split(".")[1].length : 0) : a = isNaN(b = M(b)) ? 2 : b;
        var b = a,
            c = c === void 0 ? e.decimalPoint : c,
            d = d === void 0 ? e.thousandsSep : d,
            e = f < 0 ? "-" : "",
            a = String(z(f = M(+f || 0).toFixed(b))),
            g = a.length > 3 ? a.length % 3 : 0;
        return e + (g ? a.substr(0, g) + d : "") + a.substr(g).replace(/(\d{3})(?=\d)/g,
            "$1" + d) + (b ? c + M(f - a).toFixed(b).slice(2) : "")
    }
    function ua(a, b) {
        return Array((b || 2) + 1 - String(a).length).join(0) + a
    }
    function hb(a, b, c, d) {
        var e, c = n(c, 1);
        e = a / c;
        b || (b = [1, 2, 2.5, 5, 10], d && d.allowDecimals === !1 && (c === 1 ? b = [1, 2, 5, 10] : c <= 0.1 && (b = [1 / c])));
        for (d = 0; d < b.length; d++) if (a = b[d], e <= (b[d] + (b[d + 1] || b[d])) / 2) break;
        a *= c;
        return a
    }
    function Ab(a, b) {
        var c = b || [
            [Bb, [1, 2, 5, 10, 20, 25, 50, 100, 200, 500]],
            [ib, [1, 2, 5, 10, 15, 30]],
            [Va, [1, 2, 5, 10, 15, 30]],
            [Ka, [1, 2, 3, 4, 6, 8, 12]],
            [ma, [1, 2]],
            [Wa, [1, 2]],
            [La, [1, 2, 3, 4, 6]],
            [va, null]
        ],
            d = c[c.length - 1],
            e = D[d[0]],
            f = d[1],
            g;
        for (g = 0; g < c.length; g++) if (d = c[g], e = D[d[0]], f = d[1], c[g + 1] && a <= (e * f[f.length - 1] + D[c[g + 1][0]]) / 2) break;
        e === D[va] && a < 5 * e && (f = [1, 2, 5]);
        e === D[va] && a < 5 * e && (f = [1, 2, 5]);
        c = hb(a / e, f);
        return {
            unitRange: e,
            count: c,
            unitName: d[0]
        }
    }
    function Cb(a, b, c, d) {
        var e = [],
            f = {}, g = N.global.useUTC,
            h, i = new Date(b),
            j = a.unitRange,
            k = a.count;
        if (r(b)) {
            j >= D[ib] && (i.setMilliseconds(0), i.setSeconds(j >= D[Va] ? 0 : k * U(i.getSeconds() / k)));
            if (j >= D[Va]) i[Db](j >= D[Ka] ? 0 : k * U(i[jb]() / k));
            if (j >= D[Ka]) i[Eb](j >= D[ma] ? 0 : k * U(i[kb]() / k));
            if (j >= D[ma]) i[lb](j >= D[La] ? 1 : k * U(i[Ma]() / k));
            j >= D[La] && (i[Fb](j >= D[va] ? 0 : k * U(i[Xa]() / k)), h = i[Ya]());
            j >= D[va] && (h -= h % k, i[Gb](h));
            if (j === D[Wa]) i[lb](i[Ma]() - i[mb]() + n(d, 1));
            b = 1;
            h = i[Ya]();
            for (var d = i.getTime(), l = i[Xa](), m = i[Ma](), i = g ? 0 : (864E5 + i.getTimezoneOffset() * 6E4) % 864E5; d < c;) e.push(d), j === D[va] ? d = Za(h + b * k, 0) : j === D[La] ? d = Za(h, l + b * k) : !g && (j === D[ma] || j === D[Wa]) ? d = Za(h, l, m + b * k * (j === D[ma] ? 1 : 7)) : (d += j * k, j <= D[Ka] && d % D[ma] === i && (f[d] = ma)), b++;
            e.push(d)
        }
        e.info = x(a, {
            higherRanks: f,
            totalRange: j * k
        });
        return e
    }
    function Hb() {
        this.symbol = this.color = 0
    }
    function Ib(a, b) {
        var c = a.length,
            d, e;
        for (e = 0; e < c; e++) a[e].ss_i = e;
        a.sort(function (a, c) {
            d = b(a, c);
            return d === 0 ? a.ss_i - c.ss_i : d
        });
        for (e = 0; e < c; e++) delete a[e].ss_i
    }
    function Fa(a) {
        for (var b = a.length, c = a[0]; b--;) a[b] < c && (c = a[b]);
        return c
    }
    function wa(a) {
        for (var b = a.length, c = a[0]; b--;) a[b] > c && (c = a[b]);
        return c
    }
    function Ga(a, b) {
        for (var c in a) a[c] && a[c] !== b && a[c].destroy && a[c].destroy(), delete a[c]
    }
    function Na(a) {
        $a || ($a = T(ga));
        a && $a.appendChild(a);
        $a.innerHTML =
            ""
    }
    function Oa(a, b) {
        var c = "Highcharts error #" + a + ": www.highcharts.com/errors/" + a;
        if (b) throw c;
        else L.console && console.log(c)
    }
    function da(a) {
        return parseFloat(a.toPrecision(14))
    }
    function xa(a, b) {
        Pa = n(a, b.animation)
    }
    function Jb() {
        var a = N.global.useUTC,
            b = a ? "getUTC" : "get",
            c = a ? "setUTC" : "set";
        Za = a ? Date.UTC : function (a, b, c, g, h, i) {
            return (new Date(a, b, n(c, 1), n(g, 0), n(h, 0), n(i, 0))).getTime()
        };
        jb = b + "Minutes";
        kb = b + "Hours";
        mb = b + "Day";
        Ma = b + "Date";
        Xa = b + "Month";
        Ya = b + "FullYear";
        Db = c + "Minutes";
        Eb = c + "Hours";
        lb = c + "Date";
        Fb = c + "Month";
        Gb = c + "FullYear"
    }
    function ya() {}
    function Qa(a, b, c) {
        this.axis = a;
        this.pos = b;
        this.type = c || "";
        this.isNew = !0;
        c || this.addLabel()
    }
    function nb(a, b) {
        this.axis = a;
        if (b) this.options = b, this.id = b.id;
        return this
    }
    function Kb(a, b, c, d, e, f) {
        var g = a.chart.inverted;
        this.axis = a;
        this.isNegative = c;
        this.options = b;
        this.x = d;
        this.stack = e;
        this.percent = f === "percent";
        this.alignOptions = {
            align: b.align || (g ? c ? "left" : "right" : "center"),
            verticalAlign: b.verticalAlign || (g ? "middle" : c ? "bottom" : "top"),
            y: n(b.y, g ? 4 : c ? 14 : -6),
            x: n(b.x,
            g ? c ? -6 : 6 : 0)
        };
        this.textAlign = b.textAlign || (g ? c ? "right" : "left" : "center")
    }
    function ob() {
        this.init.apply(this, arguments)
    }
    function pb(a, b) {
        var c = b.borderWidth,
            d = b.style,
            e = z(d.padding);
        this.chart = a;
        this.options = b;
        this.crosshairs = [];
        this.now = {
            x: 0,
            y: 0
        };
        this.isHidden = !0;
        this.label = a.renderer.label("", 0, 0, b.shape, null, null, b.useHTML, null, "tooltip").attr({
            padding: e,
            fill: b.backgroundColor,
            "stroke-width": c,
            r: b.borderRadius,
            zIndex: 8
        }).css(d).css({
            padding: 0
        }).hide().add();
        V || this.label.shadow(b.shadow);
        this.shared = b.shared
    }
    function qb(a, b) {
        var c = V ? "" : b.chart.zoomType;
        this.zoomX = /x/.test(c);
        this.zoomY = /y/.test(c);
        this.options = b;
        this.chart = a;
        this.init(a, b.tooltip)
    }
    function rb(a) {
        this.init(a)
    }
    function sb() {
        this.init.apply(this, arguments)
    }
    var A, C = document,
        L = window,
        K = Math,
        u = K.round,
        U = K.floor,
        za = K.ceil,
        s = K.max,
        O = K.min,
        M = K.abs,
        W = K.cos,
        Z = K.sin,
        Aa = K.PI,
        ab = Aa * 2 / 360,
        na = navigator.userAgent,
        Lb = L.opera,
        Ea = /msie/i.test(na) && !Lb,
        Ra = C.documentMode === 8,
        bb = /AppleWebKit/.test(na),
        cb = /Firefox/.test(na),
        Mb = /(Mobile|Android|Windows Phone)/.test(na),
        oa = "http://www.w3.org/2000/svg",
        ca = !! C.createElementNS && !! C.createElementNS(oa, "svg").createSVGRect,
        Sb = cb && parseInt(na.split("Firefox/")[1], 10) < 4,
        V = !ca && !Ea && !! C.createElement("canvas").getContext,
        Sa, Ba = C.documentElement.ontouchstart !== A,
        Nb = {}, tb = 0,
        $a, N, db, Pa, ub, D, pa = function () {}, Ha = [],
        ga = "div",
        Q = "none",
        vb = "rgba(192,192,192," + (ca ? 1.0E-4 : 0.002) + ")",
        Bb = "millisecond",
        ib = "second",
        Va = "minute",
        Ka = "hour",
        ma = "day",
        Wa = "week",
        La = "month",
        va = "year",
        wb = "stroke-width",
        Za, jb, kb, mb, Ma, Xa, Ya, Db, Eb, lb, Fb, Gb, $ = {};
    L.Highcharts = {};
    db = function (a, b, c) {
        if (!r(b) || isNaN(b)) return "Invalid date";
        var a = n(a, "%Y-%m-%d %H:%M:%S"),
            d = new Date(b),
            e, f = d[kb](),
            g = d[mb](),
            h = d[Ma](),
            i = d[Xa](),
            j = d[Ya](),
            k = N.lang,
            l = k.weekdays,
            b = {
                a: l[g].substr(0, 3),
                A: l[g],
                d: ua(h),
                e: h,
                b: k.shortMonths[i],
                B: k.months[i],
                m: ua(i + 1),
                y: j.toString().substr(2, 2),
                Y: j,
                H: ua(f),
                I: ua(f % 12 || 12),
                l: f % 12 || 12,
                M: ua(d[jb]()),
                p: f < 12 ? "AM" : "PM",
                P: f < 12 ? "am" : "pm",
                S: ua(d.getSeconds()),
                L: ua(u(b % 1E3), 3)
            };
        for (e in b) for (; a.indexOf("%" + e) !== -1;) a = a.replace("%" + e, b[e]);
        return c ? a.substr(0, 1).toUpperCase() + a.substr(1) : a
    };
    Hb.prototype = {
        wrapColor: function (a) {
            if (this.color >= a) this.color = 0
        },
        wrapSymbol: function (a) {
            if (this.symbol >= a) this.symbol = 0
        }
    };
    D = ia(Bb, 1, ib, 1E3, Va, 6E4, Ka, 36E5, ma, 864E5, Wa, 6048E5, La, 26784E5, va, 31556952E3);
    ub = {
        init: function (a, b, c) {
            var b = b || "",
                d = a.shift,
                e = b.indexOf("C") > -1,
                f = e ? 7 : 3,
                g, b = b.split(" "),
                c = [].concat(c),
                h, i, j = function (a) {
                    for (g = a.length; g--;) a[g] === "M" && a.splice(g + 1, 0, a[g + 1], a[g + 2], a[g + 1], a[g + 2])
                };
            e && (j(b), j(c));
            a.isArea && (h = b.splice(b.length - 6, 6), i = c.splice(c.length - 6, 6));
            if (d <= c.length / f) for (; d--;) c = [].concat(c).splice(0, f).concat(c);
            a.shift = 0;
            if (b.length) for (a = c.length; b.length < a;) d = [].concat(b).splice(b.length - f, f), e && (d[f - 6] = d[f - 2], d[f - 5] = d[f - 1]), b = b.concat(d);
            h && (b = b.concat(h), c = c.concat(i));
            return [b, c]
        },
        step: function (a, b, c, d) {
            var e = [],
                f = a.length;
            if (c === 1) e = d;
            else if (f === b.length && c < 1) for (; f--;) d = parseFloat(a[f]), e[f] = isNaN(d) ? a[f] : c * parseFloat(b[f] - d) + d;
            else e = b;
            return e
        }
    };
    (function (a) {
        L.HighchartsAdapter = L.HighchartsAdapter || a && {
            init: function (b) {
                var c = a.fx,
                    d = c.step,
                    e, f = a.Tween,
                    g = f && f.propHooks;
                a.extend(a.easing, {
                    easeOutQuad: function (a, b, c, d, e) {
                        return -d * (b /= e) * (b - 2) + c
                    }
                });
                a.each(["cur", "_default", "width", "height"], function (a, b) {
                    var e = d,
                        k, l;
                    b === "cur" ? e = c.prototype : b === "_default" && f && (e = g[b], b = "set");
                    (k = e[b]) && (e[b] = function (c) {
                        c = a ? c : this;
                        l = c.elem;
                        return l.attr ? l.attr(c.prop, b === "cur" ? A : c.now) : k.apply(this, arguments)
                    })
                });
                e = function (a) {
                    var c = a.elem,
                        d;
                    if (!a.started) d = b.init(c, c.d, c.toD), a.start = d[0], a.end = d[1], a.started = !0;
                    c.attr("d", b.step(a.start, a.end, a.pos, c.toD))
                };
                f ? g.d = {
                    set: e
                } : d.d = e;
                this.each = Array.prototype.forEach ? function (a, b) {
                    return Array.prototype.forEach.call(a, b)
                } : function (a, b) {
                    for (var c = 0, d = a.length; c < d; c++) if (b.call(a[c], a[c], c, a) === !1) return c
                }
            },
            getScript: a.getScript,
            inArray: a.inArray,
            adapterRun: function (b, c) {
                return a(b)[c]()
            },
            grep: a.grep,
            map: function (a, c) {
                for (var d = [], e = 0, f = a.length; e < f; e++) d[e] = c.call(a[e], a[e], e, a);
                return d
            },
            merge: function () {
                var b = arguments;
                return a.extend(!0, null, b[0], b[1], b[2], b[3])
            },
            offset: function (b) {
                return a(b).offset()
            },
            addEvent: function (b, c, d) {
                a(b).bind(c, d)
            },
            removeEvent: function (b, c, d) {
                var e = C.removeEventListener ? "removeEventListener" : "detachEvent";
                C[e] && !b[e] && (b[e] = function () {});
                a(b).unbind(c, d)
            },
            fireEvent: function (b, c, d, e) {
                var f = a.Event(c),
                    g = "detached" + c,
                    h;
                !Ea && d && (delete d.layerX, delete d.layerY);
                x(f, d);
                b[c] && (b[g] = b[c], b[c] = null);
                a.each(["preventDefault", "stopPropagation"], function (a, b) {
                    var c = f[b];
                    f[b] = function () {
                        try {
                            c.call(f)
                        } catch (a) {
                            b === "preventDefault" && (h = !0)
                        }
                    }
                });
                a(b).trigger(f);
                b[g] && (b[c] = b[g], b[g] = null);
                e && !f.isDefaultPrevented() && !h && e(f)
            },
            washMouseEvent: function (a) {
                var c = a.originalEvent || a;
                if (c.pageX === A) c.pageX = a.pageX, c.pageY = a.pageY;
                return c
            },
            animate: function (b, c, d) {
                var e = a(b);
                if (c.d) b.toD = c.d, c.d = 1;
                e.stop();
                e.animate(c, d)
            },
            stop: function (b) {
                a(b).stop()
            }
        }
    })(L.jQuery);
    var ea = L.HighchartsAdapter,
        G = ea || {};
    ea && ea.init.call(ea, ub);
    var eb = G.adapterRun,
        Tb = G.getScript,
        Ub = G.inArray,
        o = G.each,
        Ob = G.grep,
        Vb = G.offset,
        Ta = G.map,
        B = G.merge,
        J = G.addEvent,
        R = G.removeEvent,
        F = G.fireEvent,
        Pb = G.washMouseEvent,
        xb = G.animate,
        fb = G.stop,
        G = {
            enabled: !0,
            align: "center",
            x: 0,
            y: 15,
            style: {
                color: "#666",
                fontSize: "11px",
                lineHeight: "14px"
            }
        };
    N = {
        colors: "#4572A7,#AA4643,#89A54E,#80699B,#3D96AE,#DB843D,#92A8CD,#A47D7C,#B5CA92".split(","),
        symbols: ["circle", "diamond", "square", "triangle", "triangle-down"],
        lang: {
            loading: "Loading...",
            months: "January,February,March,April,May,June,July,August,September,October,November,December".split(","),
            shortMonths: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
            weekdays: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),
            decimalPoint: ".",
            numericSymbols: "k,M,G,T,P,E".split(","),
            resetZoom: "Reset zoom",
            resetZoomTitle: "Reset zoom level 1:1",
            thousandsSep: ","
        },
        global: {
            useUTC: !0,
            canvasToolsURL: "http://code.highcharts.com/2.3.5/modules/canvas-tools.js",
            VMLRadialGradientURL: "http://code.highcharts.com/2.3.5/gfx/vml-radial-gradient.png"
        },
        chart: {
            borderColor: "#4572A7",
            borderRadius: 5,
            defaultSeriesType: "line",
            ignoreHiddenSeries: !0,
            spacingTop: 10,
            spacingRight: 10,
            spacingBottom: 15,
            spacingLeft: 10,
            style: {
                fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif',
                fontSize: "12px"
            },
            backgroundColor: "#FFFFFF",
            plotBorderColor: "#C0C0C0",
            resetZoomButton: {
                theme: {
                    zIndex: 20
                },
                position: {
                    align: "right",
                    x: -10,
                    y: 10
                }
            }
        },
        title: {
            text: "Chart title",
            align: "center",
            y: 15,
            style: {
                color: "#3E576F",
                fontSize: "16px"
            }
        },
        subtitle: {
            text: "",
            align: "center",
            y: 30,
            style: {
                color: "#6D869F"
            }
        },
        plotOptions: {
            line: {
                allowPointSelect: !1,
                showCheckbox: !1,
                animation: {
                    duration: 1E3
                },
                events: {},
                lineWidth: 2,
                shadow: !0,
                marker: {
                    enabled: !0,
                    lineWidth: 0,
                    radius: 4,
                    lineColor: "#FFFFFF",
                    states: {
                        hover: {
                            enabled: !0
                        },
                        select: {
                            fillColor: "#FFFFFF",
                            lineColor: "#000000",
                            lineWidth: 2
                        }
                    }
                },
                point: {
                    events: {}
                },
                dataLabels: B(G, {
                    enabled: !1,
                    formatter: function () {
                        return this.y
                    },
                    verticalAlign: "bottom",
                    y: 0
                }),
                cropThreshold: 300,
                pointRange: 0,
                showInLegend: !0,
                states: {
                    hover: {
                        marker: {}
                    },
                    select: {
                        marker: {}
                    }
                },
                stickyTracking: !0
            }
        },
        labels: {
            style: {
                position: "absolute",
                color: "#3E576F"
            }
        },
        legend: {
            enabled: !0,
            align: "center",
            layout: "horizontal",
            labelFormatter: function () {
                return this.name
            },
            borderWidth: 1,
            borderColor: "#909090",
            borderRadius: 5,
            navigation: {
                activeColor: "#3E576F",
                inactiveColor: "#CCC"
            },
            shadow: !1,
            itemStyle: {
                cursor: "pointer",
                color: "#3E576F",
                fontSize: "12px"
            },
            itemHoverStyle: {
                color: "#000"
            },
            itemHiddenStyle: {
                color: "#CCC"
            },
            itemCheckboxStyle: {
                position: "absolute",
                width: "13px",
                height: "13px"
            },
            symbolWidth: 16,
            symbolPadding: 5,
            verticalAlign: "bottom",
            x: 0,
            y: 0
        },
        loading: {
            labelStyle: {
                fontWeight: "bold",
                position: "relative",
                top: "1em"
            },
            style: {
                position: "absolute",
                backgroundColor: "white",
                opacity: 0.5,
                textAlign: "center"
            }
        },
        tooltip: {
            enabled: !0,
            backgroundColor: "rgba(255, 255, 255, .85)",
            borderWidth: 2,
            borderRadius: 5,
            dateTimeLabelFormats: {
                millisecond: "%A, %b %e, %H:%M:%S.%L",
                second: "%A, %b %e, %H:%M:%S",
                minute: "%A, %b %e, %H:%M",
                hour: "%A, %b %e, %H:%M",
                day: "%A, %b %e, %Y",
                week: "Week from %A, %b %e, %Y",
                month: "%B %Y",
                year: "%Y"
            },
            headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
            shadow: !0,
            shared: V,
            snap: Mb ? 25 : 10,
            style: {
                color: "#333333",
                fontSize: "12px",
                padding: "5px",
                whiteSpace: "nowrap"
            }
        },
        credits: {
            enabled: 0,
            text: "Highcharts.com",
            href: "http://www.highcharts.com",
            position: {
                align: "right",
                x: -10,
                verticalAlign: "bottom",
                y: -5
            },
            style: {
                cursor: "pointer",
                color: "#909090",
                fontSize: "10px"
            }
        }
    };
    var X = N.plotOptions,
        ea = X.line;
    Jb();
    var qa = function (a) {
        var b = [],
            c;
        (function (a) {
            (c = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/.exec(a)) ? b = [z(c[1]), z(c[2]), z(c[3]), parseFloat(c[4], 10)] : (c = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(a)) && (b = [z(c[1], 16), z(c[2], 16), z(c[3],
            16), 1])
        })(a);
        return {
            get: function (c) {
                return b && !isNaN(b[0]) ? c === "rgb" ? "rgb(" + b[0] + "," + b[1] + "," + b[2] + ")" : c === "a" ? b[3] : "rgba(" + b.join(",") + ")" : a
            },
            brighten: function (a) {
                if (Da(a) && a !== 0) {
                    var c;
                    for (c = 0; c < 3; c++) b[c] += z(a * 255), b[c] < 0 && (b[c] = 0), b[c] > 255 && (b[c] = 255)
                }
                return this
            },
            setOpacity: function (a) {
                b[3] = a;
                return this
            }
        }
    };
    ya.prototype = {
        init: function (a, b) {
            this.element = b === "span" ? T(b) : C.createElementNS(oa, b);
            this.renderer = a;
            this.attrSetters = {}
        },
        animate: function (a, b, c) {
            b = n(b, Pa, !0);
            fb(this);
            if (b) {
                b = B(b);
                if (c) b.complete = c;
                xb(this, a, b)
            } else this.attr(a), c && c()
        },
        attr: function (a, b) {
            var c, d, e, f, g = this.element,
                h = g.nodeName.toLowerCase(),
                i = this.renderer,
                j, k = this.attrSetters,
                l = this.shadows,
                m, q, p = this;
            ja(a) && r(b) && (c = a, a = {}, a[c] = b);
            if (ja(a)) c = a, h === "circle" ? c = {
                x: "cx",
                y: "cy"
            }[c] || c : c === "strokeWidth" && (c = "stroke-width"), p = w(g, c) || this[c] || 0, c !== "d" && c !== "visibility" && (p = parseFloat(p));
            else for (c in a) if (j = !1, d = a[c], e = k[c] && k[c].call(this, d, c), e !== !1) {
                e !== A && (d = e);
                if (c === "d") d && d.join && (d = d.join(" ")), /(NaN| {2}|^$)/.test(d) && (d = "M 0 0");
                else if (c === "x" && h === "text") {
                    for (e = 0; e < g.childNodes.length; e++) f = g.childNodes[e], w(f, "x") === w(g, "x") && w(f, "x", d);
                    this.rotation && w(g, "transform", "rotate(" + this.rotation + " " + d + " " + z(a.y || w(g, "y")) + ")")
                } else if (c === "fill") d = i.color(d, g, c);
                else if (h === "circle" && (c === "x" || c === "y")) c = {
                    x: "cx",
                    y: "cy"
                }[c] || c;
                else if (h === "rect" && c === "r") w(g, {
                    rx: d,
                    ry: d
                }), j = !0;
                else if (c === "translateX" || c === "translateY" || c === "rotation" || c === "verticalAlign") j = q = !0;
                else if (c === "stroke") d = i.color(d, g, c);
                else if (c === "dashstyle") if (c =
                    "stroke-dasharray", d = d && d.toLowerCase(), d === "solid") d = Q;
                else {
                    if (d) {
                        d = d.replace("shortdashdotdot", "3,1,1,1,1,1,").replace("shortdashdot", "3,1,1,1").replace("shortdot", "1,1,").replace("shortdash", "3,1,").replace("longdash", "8,3,").replace(/dot/g, "1,3,").replace("dash", "4,3,").replace(/,$/, "").split(",");
                        for (e = d.length; e--;) d[e] = z(d[e]) * a["stroke-width"];
                        d = d.join(",")
                    }
                } else if (c === "isTracker") this[c] = d;
                else if (c === "width") d = z(d);
                else if (c === "align") c = "text-anchor", d = {
                    left: "start",
                    center: "middle",
                    right: "end"
                }[d];
                else if (c === "title") e = g.getElementsByTagName("title")[0], e || (e = C.createElementNS(oa, "title"), g.appendChild(e)), e.textContent = d;
                c === "strokeWidth" && (c = "stroke-width");
                if (c === "stroke-width" && d === 0 && (bb || i.forExport)) d = 1.0E-6;
                this.symbolName && /^(x|y|width|height|r|start|end|innerR|anchorX|anchorY)/.test(c) && (m || (this.symbolAttr(a), m = !0), j = !0);
                if (l && /^(width|height|visibility|x|y|d|transform)$/.test(c)) for (e = l.length; e--;) w(l[e], c, c === "height" ? s(d - (l[e].cutHeight || 0), 0) : d);
                if ((c === "width" || c === "height") && h === "rect" && d < 0) d = 0;
                this[c] = d;
                q && this.updateTransform();
                c === "text" ? (d !== this.textStr && delete this.bBox, this.textStr = d, this.added && i.buildText(this)) : j || w(g, c, d)
            }
            return p
        },
        symbolAttr: function (a) {
            var b = this;
            o("x,y,r,start,end,width,height,innerR,anchorX,anchorY".split(","), function (c) {
                b[c] = n(a[c], b[c])
            });
            b.attr({
                d: b.renderer.symbols[b.symbolName](b.x, b.y, b.width, b.height, b)
            })
        },
        clip: function (a) {
            return this.attr("clip-path", a ? "url(" + this.renderer.url + "#" + a.id + ")" : Q)
        },
        crisp: function (a, b, c, d, e) {
            var f, g = {}, h = {}, i, a = a || this.strokeWidth || this.attr && this.attr("stroke-width") || 0;
            i = u(a) % 2 / 2;
            h.x = U(b || this.x || 0) + i;
            h.y = U(c || this.y || 0) + i;
            h.width = U((d || this.width || 0) - 2 * i);
            h.height = U((e || this.height || 0) - 2 * i);
            h.strokeWidth = a;
            for (f in h) this[f] !== h[f] && (this[f] = g[f] = h[f]);
            return g
        },
        css: function (a) {
            var b = this.element,
                b = a && a.width && b.nodeName.toLowerCase() === "text",
                c, d = "",
                e = function (a, b) {
                    return "-" + b.toLowerCase()
                };
            if (a && a.color) a.fill = a.color;
            this.styles = a = x(this.styles, a);
            V && b && delete a.width;
            if (Ea && !ca) b && delete a.width,
            I(this.element, a);
            else {
                for (c in a) d += c.replace(/([A-Z])/g, e) + ":" + a[c] + ";";
                this.attr({
                    style: d
                })
            }
            b && this.added && this.renderer.buildText(this);
            return this
        },
        on: function (a, b) {
            if (Ba && a === "click") this.element.ontouchstart = function (a) {
                a.preventDefault();
                b()
            };
            this.element["on" + a] = b;
            return this
        },
        setRadialReference: function (a) {
            this.element.radialReference = a;
            return this
        },
        translate: function (a, b) {
            return this.attr({
                translateX: a,
                translateY: b
            })
        },
        invert: function () {
            this.inverted = !0;
            this.updateTransform();
            return this
        },
        htmlCss: function (a) {
            var b = this.element;
            if (b = a && b.tagName === "SPAN" && a.width) delete a.width, this.textWidth = b, this.updateTransform();
            this.styles = x(this.styles, a);
            I(this.element, a);
            return this
        },
        htmlGetBBox: function () {
            var a = this.element,
                b = this.bBox;
            if (!b) {
                if (a.nodeName === "text") a.style.position = "absolute";
                b = this.bBox = {
                    x: a.offsetLeft,
                    y: a.offsetTop,
                    width: a.offsetWidth,
                    height: a.offsetHeight
                }
            }
            return b
        },
        htmlUpdateTransform: function () {
            if (this.added) {
                var a = this.renderer,
                    b = this.element,
                    c = this.translateX || 0,
                    d = this.translateY || 0,
                    e = this.x || 0,
                    f = this.y || 0,
                    g = this.textAlign || "left",
                    h = {
                        left: 0,
                        center: 0.5,
                        right: 1
                    }[g],
                    i = g && g !== "left",
                    j = this.shadows;
                if (c || d) I(b, {
                    marginLeft: c,
                    marginTop: d
                }), j && o(j, function (a) {
                    I(a, {
                        marginLeft: c + 1,
                        marginTop: d + 1
                    })
                });
                this.inverted && o(b.childNodes, function (c) {
                    a.invertChild(c, b)
                });
                if (b.tagName === "SPAN") {
                    var k, l, j = this.rotation,
                        m, q = 0,
                        p = 1,
                        q = 0,
                        y;
                    m = z(this.textWidth);
                    var t = this.xCorr || 0,
                        H = this.yCorr || 0,
                        ra = [j, g, b.innerHTML, this.textWidth].join(",");
                    k = {};
                    if (ra !== this.cTT) {
                        if (r(j)) a.isSVG ? (t = Ea ?
                            "-ms-transform" : bb ? "-webkit-transform" : cb ? "MozTransform" : Lb ? "-o-transform" : "", k[t] = k.transform = "rotate(" + j + "deg)") : (q = j * ab, p = W(q), q = Z(q), k.filter = j ? ["progid:DXImageTransform.Microsoft.Matrix(M11=", p, ", M12=", -q, ", M21=", q, ", M22=", p, ", sizingMethod='auto expand')"].join("") : Q), I(b, k);
                        k = n(this.elemWidth, b.offsetWidth);
                        l = n(this.elemHeight, b.offsetHeight);
                        if (k > m && /[ \-]/.test(b.textContent || b.innerText)) I(b, {
                            width: m + "px",
                            display: "block",
                            whiteSpace: "normal"
                        }), k = m;
                        m = a.fontMetrics(b.style.fontSize).b;
                        t = p < 0 && -k;
                        H = q < 0 && -l;
                        y = p * q < 0;
                        t += q * m * (y ? 1 - h : h);
                        H -= p * m * (j ? y ? h : 1 - h : 1);
                        i && (t -= k * h * (p < 0 ? -1 : 1), j && (H -= l * h * (q < 0 ? -1 : 1)), I(b, {
                            textAlign: g
                        }));
                        this.xCorr = t;
                        this.yCorr = H
                    }
                    I(b, {
                        left: e + t + "px",
                        top: f + H + "px"
                    });
                    if (bb) l = b.offsetHeight;
                    this.cTT = ra
                }
            } else this.alignOnAdd = !0
        },
        updateTransform: function () {
            var a = this.translateX || 0,
                b = this.translateY || 0,
                c = this.inverted,
                d = this.rotation,
                e = [];
            c && (a += this.attr("width"), b += this.attr("height"));
            (a || b) && e.push("translate(" + a + "," + b + ")");
            c ? e.push("rotate(90) scale(-1,1)") : d && e.push("rotate(" + d + " " + (this.x || 0) + " " + (this.y || 0) + ")");
            e.length && w(this.element, "transform", e.join(" "))
        },
        toFront: function () {
            var a = this.element;
            a.parentNode.appendChild(a);
            return this
        },
        align: function (a, b, c) {
            a ? (this.alignOptions = a, this.alignByTranslate = b, c || this.renderer.alignedObjects.push(this)) : (a = this.alignOptions, b = this.alignByTranslate);
            var c = n(c, this.renderer),
                d = a.align,
                e = a.verticalAlign,
                f = (c.x || 0) + (a.x || 0),
                g = (c.y || 0) + (a.y || 0),
                h = {};
            if (d === "right" || d === "center") f += (c.width - (a.width || 0)) / {
                right: 1,
                center: 2
            }[d];
            h[b ? "translateX" : "x"] = u(f);
            if (e === "bottom" || e === "middle") g += (c.height - (a.height || 0)) / ({
                bottom: 1,
                middle: 2
            }[e] || 1);
            h[b ? "translateY" : "y"] = u(g);
            this[this.placed ? "animate" : "attr"](h);
            this.placed = !0;
            this.alignAttr = h;
            return this
        },
        getBBox: function () {
            var a = this.bBox,
                b = this.renderer,
                c, d = this.rotation;
            c = this.element;
            var e = this.styles,
                f = d * ab;
            if (!a) {
                if (c.namespaceURI === oa || b.forExport) {
                    try {
                        a = c.getBBox ? x({}, c.getBBox()) : {
                            width: c.offsetWidth,
                            height: c.offsetHeight
                        }
                    } catch (g) {}
                    if (!a || a.width < 0) a = {
                        width: 0,
                        height: 0
                    }
                } else a = this.htmlGetBBox();
                if (b.isSVG) {
                    b = a.width;
                    c = a.height;
                    if (Ea && e && e.fontSize === "11px" && c === 22.700000762939453) a.height = c = 14;
                    if (d) a.width = M(c * Z(f)) + M(b * W(f)), a.height = M(c * W(f)) + M(b * Z(f))
                }
                this.bBox = a
            }
            return a
        },
        show: function () {
            return this.attr({
                visibility: "visible"
            })
        },
        hide: function () {
            return this.attr({
                visibility: "hidden"
            })
        },
        add: function (a) {
            var b = this.renderer,
                c = a || b,
                d = c.element || b.box,
                e = d.childNodes,
                f = this.element,
                g = w(f, "zIndex"),
                h;
            if (a) this.parentGroup = a;
            this.parentInverted = a && a.inverted;
            this.textStr !== void 0 && b.buildText(this);
            if (g) c.handleZ = !0, g = z(g);
            if (c.handleZ) for (c = 0; c < e.length; c++) if (a = e[c], b = w(a, "zIndex"), a !== f && (z(b) > g || !r(g) && r(b))) {
                d.insertBefore(f, a);
                h = !0;
                break
            }
            h || d.appendChild(f);
            this.added = !0;
            F(this, "add");
            return this
        },
        safeRemoveChild: function (a) {
            var b = a.parentNode;
            b && b.removeChild(a)
        },
        destroy: function () {
            var a = this,
                b = a.element || {}, c = a.shadows,
                d, e;
            b.onclick = b.onmouseout = b.onmouseover = b.onmousemove = null;
            fb(a);
            if (a.clipPath) a.clipPath = a.clipPath.destroy();
            if (a.stops) {
                for (e = 0; e < a.stops.length; e++) a.stops[e] = a.stops[e].destroy();
                a.stops = null
            }
            a.safeRemoveChild(b);
            c && o(c, function (b) {
                a.safeRemoveChild(b)
            });
            ta(a.renderer.alignedObjects, a);
            for (d in a) delete a[d];
            return null
        },
        empty: function () {
            for (var a = this.element, b = a.childNodes, c = b.length; c--;) a.removeChild(b[c])
        },
        shadow: function (a, b, c) {
            var d = [],
                e, f, g = this.element,
                h, i, j, k;
            if (a) {
                i = n(a.width, 3);
                j = (a.opacity || 0.15) / i;
                k = this.parentInverted ? "(-1,-1)" : "(" + n(a.offsetX, 1) + ", " + n(a.offsetY, 1) + ")";
                for (e = 1; e <= i; e++) {
                    f = g.cloneNode(0);
                    h = i * 2 + 1 - 2 * e;
                    w(f, {
                        isShadow: "true",
                        stroke: a.color || "black",
                        "stroke-opacity": j * e,
                        "stroke-width": h,
                        transform: "translate" + k,
                        fill: Q
                    });
                    if (c) w(f, "height", s(w(f, "height") - h, 0)), f.cutHeight = h;
                    b ? b.element.appendChild(f) : g.parentNode.insertBefore(f, g);
                    d.push(f)
                }
                this.shadows = d
            }
            return this
        }
    };
    var sa = function () {
        this.init.apply(this, arguments)
    };
    sa.prototype = {
        Element: ya,
        init: function (a, b, c, d) {
            var e = location,
                f;
            f = this.createElement("svg").attr({
                xmlns: oa,
                version: "1.1"
            });
            a.appendChild(f.element);
            this.isSVG = !0;
            this.box = f.element;
            this.boxWrapper = f;
            this.alignedObjects = [];
            this.url = (cb || bb) && C.getElementsByTagName("base").length ? e.href.replace(/#.*?$/, "").replace(/([\('\)])/g, "\\$1").replace(/ /g, "%20") : "";
            this.defs = this.createElement("defs").add();
            this.forExport = d;
            this.gradients = {};
            this.setSize(b, c, !1);
            var g;
            if (cb && a.getBoundingClientRect) this.subPixelFix = b = function () {
                I(a, {
                    left: 0,
                    top: 0
                });
                g = a.getBoundingClientRect();
                I(a, {
                    left: za(g.left) - g.left + "px",
                    top: za(g.top) - g.top + "px"
                })
            }, b(), J(L, "resize", b)
        },
        isHidden: function () {
            return !this.boxWrapper.getBBox().width
        },
        destroy: function () {
            var a = this.defs;
            this.box = null;
            this.boxWrapper = this.boxWrapper.destroy();
            Ga(this.gradients || {});
            this.gradients = null;
            if (a) this.defs = a.destroy();
            this.subPixelFix && R(L, "resize", this.subPixelFix);
            return this.alignedObjects = null
        },
        createElement: function (a) {
            var b = new this.Element;
            b.init(this, a);
            return b
        },
        draw: function () {},
        buildText: function (a) {
            for (var b = a.element, c = n(a.textStr, "").toString().replace(/<(b|strong)>/g, '<span style="font-weight:bold">').replace(/<(i|em)>/g, '<span style="font-style:italic">').replace(/<a/g,
                "<span").replace(/<\/(b|strong|i|em|a)>/g, "</span>").split(/<br.*?>/g), d = b.childNodes, e = /style="([^"]+)"/, f = /href="([^"]+)"/, g = w(b, "x"), h = a.styles, i = h && h.width && z(h.width), j = h && h.lineHeight, k, h = d.length, l = []; h--;) b.removeChild(d[h]);
            i && !a.added && this.box.appendChild(b);
            c[c.length - 1] === "" && c.pop();
            o(c, function (c, d) {
                var h, y = 0,
                    t, c = c.replace(/<span/g, "|||<span").replace(/<\/span>/g, "</span>|||");
                h = c.split("|||");
                o(h, function (c) {
                    if (c !== "" || h.length === 1) {
                        var m = {}, n = C.createElementNS(oa, "tspan"),
                            o;
                        e.test(c) && (o = c.match(e)[1].replace(/(;| |^)color([ :])/, "$1fill$2"), w(n, "style", o));
                        f.test(c) && (w(n, "onclick", 'location.href="' + c.match(f)[1] + '"'), I(n, {
                            cursor: "pointer"
                        }));
                        c = (c.replace(/<(.|\n)*?>/g, "") || " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
                        n.appendChild(C.createTextNode(c));
                        y ? m.dx = 3 : m.x = g;
                        if (!y) {
                            if (d) {
                                !ca && a.renderer.forExport && I(n, {
                                    display: "block"
                                });
                                t = L.getComputedStyle && z(L.getComputedStyle(k, null).getPropertyValue("line-height"));
                                if (!t || isNaN(t)) {
                                    var r;
                                    if (!(r = j)) if (!(r = k.offsetHeight)) l[d] = b.getBBox ? b.getBBox().height : a.renderer.fontMetrics(b.style.fontSize).h, r = u(l[d] - (l[d - 1] || 0)) || 18;
                                    t = r
                                }
                                w(n, "dy", t)
                            }
                            k = n
                        }
                        w(n, m);
                        b.appendChild(n);
                        y++;
                        if (i) for (var c = c.replace(/([^\^])-/g, "$1- ").split(" "), E = []; c.length || E.length;) delete a.bBox, r = a.getBBox().width, m = r > i, !m || c.length === 1 ? (c = E, E = [], c.length && (n = C.createElementNS(oa, "tspan"), w(n, {
                            dy: j || 16,
                            x: g
                        }), o && w(n, "style", o), b.appendChild(n), r > i && (i = r))) : (n.removeChild(n.firstChild), E.unshift(c.pop())), c.length && n.appendChild(C.createTextNode(c.join(" ").replace(/- /g,
                            "-")))
                    }
                })
            })
        },
        button: function (a, b, c, d, e, f, g) {
            var h = this.label(a, b, c),
                i = 0,
                j, k, l, m, q, a = {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                }, e = B(ia(wb, 1, "stroke", "#999", "fill", ia("linearGradient", a, "stops", [
                    [0, "#FFF"],
                    [1, "#DDD"]
                ]), "r", 3, "padding", 3, "style", ia("color", "black")), e);
            l = e.style;
            delete e.style;
            f = B(e, ia("stroke", "#68A", "fill", ia("linearGradient", a, "stops", [
                [0, "#FFF"],
                [1, "#ACF"]
            ])), f);
            m = f.style;
            delete f.style;
            g = B(e, ia("stroke", "#68A", "fill", ia("linearGradient", a, "stops", [
                [0, "#9BD"],
                [1, "#CDF"]
            ])), g);
            q = g.style;
            delete g.style;
            J(h.element, "mouseenter", function () {
                h.attr(f).css(m)
            });
            J(h.element, "mouseleave", function () {
                j = [e, f, g][i];
                k = [l, m, q][i];
                h.attr(j).css(k)
            });
            h.setState = function (a) {
                (i = a) ? a === 2 && h.attr(g).css(q) : h.attr(e).css(l)
            };
            return h.on("click", function () {
                d.call(h)
            }).attr(e).css(x({
                cursor: "default"
            }, l))
        },
        crispLine: function (a, b) {
            a[1] === a[4] && (a[1] = a[4] = u(a[1]) - b % 2 / 2);
            a[2] === a[5] && (a[2] = a[5] = u(a[2]) + b % 2 / 2);
            return a
        },
        path: function (a) {
            var b = {
                fill: Q
            };
            Ia(a) ? b.d = a : Y(a) && x(b, a);
            return this.createElement("path").attr(b)
        },
        circle: function (a,
        b, c) {
            a = Y(a) ? a : {
                x: a,
                y: b,
                r: c
            };
            return this.createElement("circle").attr(a)
        },
        arc: function (a, b, c, d, e, f) {
            if (Y(a)) b = a.y, c = a.r, d = a.innerR, e = a.start, f = a.end, a = a.x;
            return this.symbol("arc", a || 0, b || 0, c || 0, c || 0, {
                innerR: d || 0,
                start: e || 0,
                end: f || 0
            })
        },
        rect: function (a, b, c, d, e, f) {
            e = Y(a) ? a.r : e;
            e = this.createElement("rect").attr({
                rx: e,
                ry: e,
                fill: Q
            });
            return e.attr(Y(a) ? a : e.crisp(f, a, b, s(c, 0), s(d, 0)))
        },
        setSize: function (a, b, c) {
            var d = this.alignedObjects,
                e = d.length;
            this.width = a;
            this.height = b;
            for (this.boxWrapper[n(c, !0) ? "animate" :
                "attr"]({
                width: a,
                height: b
            }); e--;) d[e].align()
        },
        g: function (a) {
            var b = this.createElement("g");
            return r(a) ? b.attr({
                "class": "highcharts-" + a
            }) : b
        },
        image: function (a, b, c, d, e) {
            var f = {
                preserveAspectRatio: Q
            };
            arguments.length > 1 && x(f, {
                x: b,
                y: c,
                width: d,
                height: e
            });
            f = this.createElement("image").attr(f);
            f.element.setAttributeNS ? f.element.setAttributeNS("http://www.w3.org/1999/xlink", "href", a) : f.element.setAttribute("hc-svg-href", a);
            return f
        },
        symbol: function (a, b, c, d, e, f) {
            var g, h = this.symbols[a],
                h = h && h(u(b), u(c), d, e,
                f),
                i = /^url\((.*?)\)$/,
                j, k;
            h ? (g = this.path(h), x(g, {
                symbolName: a,
                x: b,
                y: c,
                width: d,
                height: e
            }), f && x(g, f)) : i.test(a) && (k = function (a, b) {
                a.element && (a.attr({
                    width: b[0],
                    height: b[1]
                }), a.alignByTranslate || a.translate(u((d - b[0]) / 2), u((e - b[1]) / 2)))
            }, j = a.match(i)[1], a = Nb[j], g = this.image(j).attr({
                x: b,
                y: c
            }), a ? k(g, a) : (g.attr({
                width: 0,
                height: 0
            }), T("img", {
                onload: function () {
                    k(g, Nb[j] = [this.width, this.height])
                },
                src: j
            })));
            return g
        },
        symbols: {
            circle: function (a, b, c, d) {
                var e = 0.166 * c;
                return ["M", a + c / 2, b, "C", a + c + e, b, a + c + e, b + d,
                a + c / 2, b + d, "C", a - e, b + d, a - e, b, a + c / 2, b, "Z"]
            },
            square: function (a, b, c, d) {
                return ["M", a, b, "L", a + c, b, a + c, b + d, a, b + d, "Z"]
            },
            triangle: function (a, b, c, d) {
                return ["M", a + c / 2, b, "L", a + c, b + d, a, b + d, "Z"]
            },
            "triangle-down": function (a, b, c, d) {
                return ["M", a, b, "L", a + c, b, a + c / 2, b + d, "Z"]
            },
            diamond: function (a, b, c, d) {
                return ["M", a + c / 2, b, "L", a + c, b + d / 2, a + c / 2, b + d, a, b + d / 2, "Z"]
            },
            arc: function (a, b, c, d, e) {
                var f = e.start,
                    c = e.r || c || d,
                    g = e.end - 1.0E-6,
                    d = e.innerR,
                    h = e.open,
                    i = W(f),
                    j = Z(f),
                    k = W(g),
                    g = Z(g),
                    e = e.end - f < Aa ? 0 : 1;
                return ["M", a + c * i, b + c * j, "A", c, c,
                0, e, 1, a + c * k, b + c * g, h ? "M" : "L", a + d * k, b + d * g, "A", d, d, 0, e, 0, a + d * i, b + d * j, h ? "" : "Z"]
            }
        },
        clipRect: function (a, b, c, d) {
            var e = "highcharts-" + tb++,
                f = this.createElement("clipPath").attr({
                    id: e
                }).add(this.defs),
                a = this.rect(a, b, c, d, 0).add(f);
            a.id = e;
            a.clipPath = f;
            return a
        },
        color: function (a, b, c) {
            var d = this,
                e, f = /^rgba/,
                g, h, i, j, k, l, m, q = [];
            a && a.linearGradient ? g = "linearGradient" : a && a.radialGradient && (g = "radialGradient");
            if (g) {
                c = a[g];
                h = d.gradients;
                j = a.stops;
                b = b.radialReference;
                Ia(c) && (a[g] = c = {
                    x1: c[0],
                    y1: c[1],
                    x2: c[2],
                    y2: c[3],
                    gradientUnits: "userSpaceOnUse"
                });
                g === "radialGradient" && b && !r(c.gradientUnits) && x(c, {
                    cx: b[0] - b[2] / 2 + c.cx * b[2],
                    cy: b[1] - b[2] / 2 + c.cy * b[2],
                    r: c.r * b[2],
                    gradientUnits: "userSpaceOnUse"
                });
                for (m in c) m !== "id" && q.push(m, c[m]);
                for (m in j) q.push(j[m]);
                q = q.join(",");
                h[q] ? a = h[q].id : (c.id = a = "highcharts-" + tb++, h[q] = i = d.createElement(g).attr(c).add(d.defs), i.stops = [], o(j, function (a) {
                    f.test(a[1]) ? (e = qa(a[1]), k = e.get("rgb"), l = e.get("a")) : (k = a[1], l = 1);
                    a = d.createElement("stop").attr({
                        offset: a[0],
                        "stop-color": k,
                        "stop-opacity": l
                    }).add(i);
                    i.stops.push(a)
                }));
                return "url(" + d.url + "#" + a + ")"
            } else return f.test(a) ? (e = qa(a), w(b, c + "-opacity", e.get("a")), e.get("rgb")) : (b.removeAttribute(c + "-opacity"), a)
        },
        text: function (a, b, c, d) {
            var e = N.chart.style,
                f = V || !ca && this.forExport;
            if (d && !this.forExport) return this.html(a, b, c);
            b = u(n(b, 0));
            c = u(n(c, 0));
            a = this.createElement("text").attr({
                x: b,
                y: c,
                text: a
            }).css({
                fontFamily: e.fontFamily,
                fontSize: e.fontSize
            });
            f && a.css({
                position: "absolute"
            });
            a.x = b;
            a.y = c;
            return a
        },
        html: function (a, b, c) {
            var d = N.chart.style,
                e = this.createElement("span"),
                f = e.attrSetters,
                g = e.element,
                h = e.renderer;
            f.text = function (a) {
                a !== g.innerHTML && delete this.bBox;
                g.innerHTML = a;
                return !1
            };
            f.x = f.y = f.align = function (a, b) {
                b === "align" && (b = "textAlign");
                e[b] = a;
                e.htmlUpdateTransform();
                return !1
            };
            e.attr({
                text: a,
                x: u(b),
                y: u(c)
            }).css({
                position: "absolute",
                whiteSpace: "nowrap",
                fontFamily: d.fontFamily,
                fontSize: d.fontSize
            });
            e.css = e.htmlCss;
            if (h.isSVG) e.add = function (a) {
                var b, c = h.box.parentNode,
                    d = [];
                if (a) {
                    if (b = a.div, !b) {
                        for (; a;) d.push(a), a = a.parentGroup;
                        o(d.reverse(), function (a) {
                            var d;
                            b = a.div = a.div || T(ga, {
                                className: w(a.element, "class")
                            }, {
                                position: "absolute",
                                left: (a.translateX || 0) + "px",
                                top: (a.translateY || 0) + "px"
                            }, b || c);
                            d = b.style;
                            x(a.attrSetters, {
                                translateX: function (a) {
                                    d.left = a + "px"
                                },
                                translateY: function (a) {
                                    d.top = a + "px"
                                },
                                visibility: function (a, b) {
                                    d[b] = a
                                }
                            })
                        })
                    }
                } else b = c;
                b.appendChild(g);
                e.added = !0;
                e.alignOnAdd && e.htmlUpdateTransform();
                return e
            };
            return e
        },
        fontMetrics: function (a) {
            var a = z(a || 11),
                a = a < 24 ? a + 4 : u(a * 1.2),
                b = u(a * 0.8);
            return {
                h: a,
                b: b
            }
        },
        label: function (a, b, c, d, e, f, g, h, i) {
            function j() {
                var a;
                a = y.element.style;
                H = (s === void 0 || yb === void 0 || p.styles.textAlign) && y.getBBox();
                p.width = (s || H.width || 0) + 2 * v;
                p.height = (yb || H.height || 0) + 2 * v;
                zb = v + q.fontMetrics(a && a.fontSize).b;
                if (z) {
                    if (!n) a = h ? -zb : 0, p.box = n = d ? q.symbol(d, -ra * v, a, p.width, p.height) : q.rect(-ra * v, a, p.width, p.height, 0, w[wb]), n.add(p);
                    n.attr(B({
                        width: p.width,
                        height: p.height
                    }, w));
                    w = null
                }
            }
            function k() {
                var a = p.styles,
                    a = a && a.textAlign,
                    b = v * (1 - ra),
                    c;
                c = h ? 0 : zb;
                if (r(s) && (a === "center" || a === "right")) b += {
                    center: 0.5,
                    right: 1
                }[a] * (s - H.width);
                (b !== y.x || c !== y.y) && y.attr({
                    x: b,
                    y: c
                });
                y.x = b;
                y.y = c
            }
            function l(a, b) {
                n ? n.attr(a, b) : w[a] = b
            }
            function m() {
                y.add(p);
                p.attr({
                    text: a,
                    x: b,
                    y: c
                });
                n && r(e) && p.attr({
                    anchorX: e,
                    anchorY: f
                })
            }
            var q = this,
                p = q.g(i),
                y = q.text("", 0, 0, g).attr({
                    zIndex: 1
                }),
                n, H, ra = 0,
                v = 3,
                s, yb, E, S, Qb = 0,
                w = {}, zb, g = p.attrSetters,
                z;
            J(p, "add", m);
            g.width = function (a) {
                s = a;
                return !1
            };
            g.height = function (a) {
                yb = a;
                return !1
            };
            g.padding = function (a) {
                r(a) && a !== v && (v = a, k());
                return !1
            };
            g.align = function (a) {
                ra = {
                    left: 0,
                    center: 0.5,
                    right: 1
                }[a];
                return !1
            };
            g.text = function (a, b) {
                y.attr(b, a);
                j();
                k();
                return !1
            };
            g[wb] = function (a, b) {
                z = !0;
                Qb = a % 2 / 2;
                l(b, a);
                return !1
            };
            g.stroke = g.fill = g.r = function (a, b) {
                b === "fill" && (z = !0);
                l(b, a);
                return !1
            };
            g.anchorX = function (a, b) {
                e = a;
                l(b, a + Qb - E);
                return !1
            };
            g.anchorY = function (a, b) {
                f = a;
                l(b, a - S);
                return !1
            };
            g.x = function (a) {
                p.x = a;
                a -= ra * ((s || H.width) + v);
                E = u(a);
                p.attr("translateX", E);
                return !1
            };
            g.y = function (a) {
                S = p.y = u(a);
                p.attr("translateY", a);
                return !1
            };
            var C = p.css;
            return x(p, {
                css: function (a) {
                    if (a) {
                        var b = {}, a = B({}, a);
                        o("fontSize,fontWeight,fontFamily,color,lineHeight,width".split(","),

                        function (c) {
                            a[c] !== A && (b[c] = a[c], delete a[c])
                        });
                        y.css(b)
                    }
                    return C.call(p, a)
                },
                getBBox: function () {
                    return {
                        width: H.width + 2 * v,
                        height: H.height + 2 * v,
                        x: H.x - v,
                        y: H.y - v
                    }
                },
                shadow: function (a) {
                    n && n.shadow(a);
                    return p
                },
                destroy: function () {
                    R(p, "add", m);
                    R(p.element, "mouseenter");
                    R(p.element, "mouseleave");
                    y && (y = y.destroy());
                    n && (n = n.destroy());
                    ya.prototype.destroy.call(p);
                    p = q = j = k = l = m = null
                }
            })
        }
    };
    Sa = sa;
    var ha;
    if (!ca && !V) {
        ha = {
            init: function (a, b) {
                var c = ["<", b, ' filled="f" stroked="f"'],
                    d = ["position: ", "absolute", ";"];
                (b ===
                    "shape" || b === ga) && d.push("left:0;top:0;width:1px;height:1px;");
                Ra && d.push("visibility: ", b === ga ? "hidden" : "visible");
                c.push(' style="', d.join(""), '"/>');
                if (b) c = b === ga || b === "span" || b === "img" ? c.join("") : a.prepVML(c), this.element = T(c);
                this.renderer = a;
                this.attrSetters = {}
            },
            add: function (a) {
                var b = this.renderer,
                    c = this.element,
                    d = b.box,
                    d = a ? a.element || a : d;
                a && a.inverted && b.invertChild(c, d);
                d.appendChild(c);
                this.added = !0;
                this.alignOnAdd && !this.deferUpdateTransform && this.updateTransform();
                F(this, "add");
                return this
            },
            updateTransform: ya.prototype.htmlUpdateTransform,
            attr: function (a, b) {
                var c, d, e, f = this.element || {}, g = f.style,
                    h = f.nodeName,
                    i = this.renderer,
                    j = this.symbolName,
                    k, l = this.shadows,
                    m, q = this.attrSetters,
                    p = this;
                ja(a) && r(b) && (c = a, a = {}, a[c] = b);
                if (ja(a)) c = a, p = c === "strokeWidth" || c === "stroke-width" ? this.strokeweight : this[c];
                else for (c in a) if (d = a[c], m = !1, e = q[c] && q[c].call(this, d, c), e !== !1 && d !== null) {
                    e !== A && (d = e);
                    if (j && /^(x|y|r|start|end|width|height|innerR|anchorX|anchorY)/.test(c)) k || (this.symbolAttr(a), k = !0), m = !0;
                    else if (c === "d") {
                        d = d || [];
                        this.d = d.join(" ");
                        e = d.length;
                        for (m = []; e--;) m[e] = Da(d[e]) ? u(d[e] * 10) - 5 : d[e] === "Z" ? "x" : d[e];
                        d = m.join(" ") || "x";
                        f.path = d;
                        if (l) for (e = l.length; e--;) l[e].path = l[e].cutOff ? this.cutOffPath(d, l[e].cutOff) : d;
                        m = !0
                    } else if (c === "visibility") {
                        if (l) for (e = l.length; e--;) l[e].style[c] = d;
                        h === "DIV" && (d = d === "hidden" ? "-999em" : 0, c = "top");
                        g[c] = d;
                        m = !0
                    } else if (c === "zIndex") d && (g[c] = d), m = !0;
                    else if (c === "width" || c === "height") d = s(0, d), this[c] = d, this.updateClipping ? (this[c] = d, this.updateClipping()) : g[c] = d, m = !0;
                    else if (c === "x" || c === "y") this[c] = d, g[{
                        x: "left",
                        y: "top"
                    }[c]] = d;
                    else if (c === "class") f.className = d;
                    else if (c === "stroke") d = i.color(d, f, c), c = "strokecolor";
                    else if (c === "stroke-width" || c === "strokeWidth") f.stroked = d ? !0 : !1, c = "strokeweight", this[c] = d, Da(d) && (d += "px");
                    else if (c === "dashstyle")(f.getElementsByTagName("stroke")[0] || T(i.prepVML(["<stroke/>"]), null, null, f))[c] = d || "solid", this.dashstyle = d, m = !0;
                    else if (c === "fill") if (h === "SPAN") g.color = d;
                    else {
                        if (h !== "IMG") f.filled = d !== Q ? !0 : !1, d = i.color(d,
                        f, c, this), c = "fillcolor"
                    } else if (h === "shape" && c === "rotation") this[c] = d, f.style.left = -u(Z(d * ab) + 1) + "px", f.style.top = u(W(d * ab)) + "px";
                    else if (c === "translateX" || c === "translateY" || c === "rotation") this[c] = d, this.updateTransform(), m = !0;
                    else if (c === "text") this.bBox = null, f.innerHTML = d, m = !0;
                    m || (Ra ? f[c] = d : w(f, c, d))
                }
                return p
            },
            clip: function (a) {
                var b = this,
                    c, d = b.element,
                    e = d.parentNode;
                a ? (c = a.members, ta(c, b), c.push(b), b.destroyClip = function () {
                    ta(c, b)
                }, e && e.className === "highcharts-tracker" && !Ra && I(d, {
                    visibility: "hidden"
                }),
                a = a.getCSS(b)) : (b.destroyClip && b.destroyClip(), a = {
                    clip: Ra ? "inherit" : "rect(auto)"
                });
                return b.css(a)
            },
            css: ya.prototype.htmlCss,
            safeRemoveChild: function (a) {
                a.parentNode && Na(a)
            },
            destroy: function () {
                this.destroyClip && this.destroyClip();
                return ya.prototype.destroy.apply(this)
            },
            empty: function () {
                for (var a = this.element.childNodes, b = a.length, c; b--;) c = a[b], c.parentNode.removeChild(c)
            },
            on: function (a, b) {
                this.element["on" + a] = function () {
                    var a = L.event;
                    a.target = a.srcElement;
                    b(a)
                };
                return this
            },
            cutOffPath: function (a,
            b) {
                var c, a = a.split(/[ ,]/);
                c = a.length;
                if (c === 9 || c === 11) a[c - 4] = a[c - 2] = z(a[c - 2]) - 10 * b;
                return a.join(" ")
            },
            shadow: function (a, b, c) {
                var d = [],
                    e, f = this.element,
                    g = this.renderer,
                    h, i = f.style,
                    j, k = f.path,
                    l, m, q, p;
                k && typeof k.value !== "string" && (k = "x");
                m = k;
                if (a) {
                    q = n(a.width, 3);
                    p = (a.opacity || 0.15) / q;
                    for (e = 1; e <= 3; e++) {
                        l = q * 2 + 1 - 2 * e;
                        c && (m = this.cutOffPath(k.value, l + 0.5));
                        j = ['<shape isShadow="true" strokeweight="', l, '" filled="false" path="', m, '" coordsize="10 10" style="', f.style.cssText, '" />'];
                        h = T(g.prepVML(j), null, {
                            left: z(i.left) + n(a.offsetX, 1),
                            top: z(i.top) + n(a.offsetY, 1)
                        });
                        if (c) h.cutOff = l + 1;
                        j = ['<stroke color="', a.color || "black", '" opacity="', p * e, '"/>'];
                        T(g.prepVML(j), null, null, h);
                        b ? b.element.appendChild(h) : f.parentNode.insertBefore(h, f);
                        d.push(h)
                    }
                    this.shadows = d
                }
                return this
            }
        };
        ha = ba(ya, ha);
        var fa = {
            Element: ha,
            isIE8: na.indexOf("MSIE 8.0") > -1,
            init: function (a, b, c) {
                var d, e;
                this.alignedObjects = [];
                d = this.createElement(ga);
                e = d.element;
                e.style.position = "relative";
                a.appendChild(d.element);
                this.box = e;
                this.boxWrapper = d;
                this.setSize(b, c, !1);
                if (!C.namespaces.hcv) C.namespaces.add("hcv", "urn:schemas-microsoft-com:vml"), C.createStyleSheet().cssText = "hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke{ behavior:url(#default#VML); display: inline-block; } "
            },
            isHidden: function () {
                return !this.box.offsetWidth
            },
            clipRect: function (a, b, c, d) {
                var e = this.createElement(),
                    f = Y(a);
                return x(e, {
                    members: [],
                    left: f ? a.x : a,
                    top: f ? a.y : b,
                    width: f ? a.width : c,
                    height: f ? a.height : d,
                    getCSS: function (a) {
                        var b = a.inverted,
                            c = this.top,
                            d = this.left,
                            e = d + this.width,
                            f = c + this.height,
                            c = {
                                clip: "rect(" + u(b ? d : c) + "px," + u(b ? f : e) + "px," + u(b ? e : f) + "px," + u(b ? c : d) + "px)"
                            };
                        !b && Ra && a.element.nodeName !== "IMG" && x(c, {
                            width: e + "px",
                            height: f + "px"
                        });
                        return c
                    },
                    updateClipping: function () {
                        o(e.members, function (a) {
                            a.css(e.getCSS(a))
                        })
                    }
                })
            },
            color: function (a, b, c, d) {
                var e = this,
                    f, g = /^rgba/,
                    h, i, j = Q;
                a && a.linearGradient ? i = "gradient" : a && a.radialGradient && (i = "pattern");
                if (i) {
                    var k, l, m = a.linearGradient || a.radialGradient,
                        q, p, n, t, H, r = "",
                        a = a.stops,
                        v, s = [],
                        u = function () {
                            h = ['<fill colors="' + s.join(",") + '" opacity="',
                            n, '" o:opacity2="', p, '" type="', i, '" ', r, 'focus="100%" method="any" />'];
                            T(e.prepVML(h), null, null, b)
                        };
                    q = a[0];
                    v = a[a.length - 1];
                    q[0] > 0 && a.unshift([0, q[1]]);
                    v[0] < 1 && a.push([1, v[1]]);
                    o(a, function (a, b) {
                        g.test(a[1]) ? (f = qa(a[1]), k = f.get("rgb"), l = f.get("a")) : (k = a[1], l = 1);
                        s.push(a[0] * 100 + "% " + k);
                        b ? (n = l, t = k) : (p = l, H = k)
                    });
                    if (c === "fill") if (i === "gradient") c = m.x1 || m[0] || 0, a = m.y1 || m[1] || 0, q = m.x2 || m[2] || 0, m = m.y2 || m[3] || 0, r = 'angle="' + (90 - K.atan((m - a) / (q - c)) * 180 / Aa) + '"', u();
                    else {
                        var j = m.r,
                            E = j * 2,
                            S = j * 2,
                            x = m.cx,
                            A = m.cy,
                            w = b.radialReference,
                            z, j = function () {
                                w && (z = d.getBBox(), x += (w[0] - z.x) / z.width - 0.5, A += (w[1] - z.y) / z.height - 0.5, E *= w[2] / z.width, S *= w[2] / z.height);
                                r = 'src="' + N.global.VMLRadialGradientURL + '" size="' + E + "," + S + '" origin="0.5,0.5" position="' + x + "," + A + '" color2="' + H + '" ';
                                u()
                            };
                        d.added ? j() : J(d, "add", j);
                        j = t
                    } else j = k
                } else if (g.test(a) && b.tagName !== "IMG") f = qa(a), h = ["<", c, ' opacity="', f.get("a"), '"/>'], T(this.prepVML(h), null, null, b), j = f.get("rgb");
                else {
                    j = b.getElementsByTagName(c);
                    if (j.length) j[0].opacity = 1;
                    j = a
                }
                return j
            },
            prepVML: function (a) {
                var b = this.isIE8,
                    a = a.join("");
                b ? (a = a.replace("/>", ' xmlns="urn:schemas-microsoft-com:vml" />'), a = a.indexOf('style="') === -1 ? a.replace("/>", ' style="display:inline-block;behavior:url(#default#VML);" />') : a.replace('style="', 'style="display:inline-block;behavior:url(#default#VML);')) : a = a.replace("<", "<hcv:");
                return a
            },
            text: sa.prototype.html,
            path: function (a) {
                var b = {
                    coordsize: "10 10"
                };
                Ia(a) ? b.d = a : Y(a) && x(b, a);
                return this.createElement("shape").attr(b)
            },
            circle: function (a, b, c) {
                return this.symbol("circle").attr({
                    x: a - c,
                    y: b - c,
                    width: 2 * c,
                    height: 2 * c
                })
            },
            g: function (a) {
                var b;
                a && (b = {
                    className: "highcharts-" + a,
                    "class": "highcharts-" + a
                });
                return this.createElement(ga).attr(b)
            },
            image: function (a, b, c, d, e) {
                var f = this.createElement("img").attr({
                    src: a
                });
                arguments.length > 1 && f.attr({
                    x: b,
                    y: c,
                    width: d,
                    height: e
                });
                return f
            },
            rect: function (a, b, c, d, e, f) {
                if (Y(a)) b = a.y, c = a.width, d = a.height, f = a.strokeWidth, a = a.x;
                var g = this.symbol("rect");
                g.r = e;
                return g.attr(g.crisp(f, a, b, s(c, 0), s(d, 0)))
            },
            invertChild: function (a, b) {
                var c = b.style;
                I(a, {
                    flip: "x",
                    left: z(c.width) - 1,
                    top: z(c.height) - 1,
                    rotation: -90
                })
            },
            symbols: {
                arc: function (a, b, c, d, e) {
                    var f = e.start,
                        g = e.end,
                        h = e.r || c || d,
                        c = W(f),
                        d = Z(f),
                        i = W(g),
                        j = Z(g),
                        k = e.innerR,
                        l = 0.08 / h,
                        m = k && 0.1 / k || 0;
                    if (g - f === 0) return ["x"];
                    else 2 * Aa - g + f < l ? i = -l : g - f < m && (i = W(f + m));
                    f = ["wa", a - h, b - h, a + h, b + h, a + h * c, b + h * d, a + h * i, b + h * j];
                    e.open && !k && f.push("e", "M", a, b);
                    f.push("at", a - k, b - k, a + k, b + k, a + k * i, b + k * j, a + k * c, b + k * d, "x", "e");
                    return f
                },
                circle: function (a, b, c, d) {
                    return ["wa", a, b, a + c, b + d, a + c, b + d / 2, a + c, b + d / 2, "e"]
                },
                rect: function (a, b, c, d, e) {
                    var f = a + c,
                        g = b + d,
                        h;
                    !r(e) || !e.r ? f = sa.prototype.symbols.square.apply(0, arguments) : (h = O(e.r, c, d), f = ["M", a + h, b, "L", f - h, b, "wa", f - 2 * h, b, f, b + 2 * h, f - h, b, f, b + h, "L", f, g - h, "wa", f - 2 * h, g - 2 * h, f, g, f, g - h, f - h, g, "L", a + h, g, "wa", a, g - 2 * h, a + 2 * h, g, a + h, g, a, g - h, "L", a, b + h, "wa", a, b, a + 2 * h, b + 2 * h, a, b + h, a + h, b, "x", "e"]);
                    return f
                }
            }
        };
        ha = function () {
            this.init.apply(this, arguments)
        };
        ha.prototype = B(sa.prototype, fa);
        Sa = ha
    }
    var gb, Rb;
    if (V) gb = function () {
        oa = "http://www.w3.org/1999/xhtml"
    }, gb.prototype.symbols = {}, Rb = function () {
        function a() {
            var a = b.length,
                d;
            for (d = 0; d < a; d++) b[d]();
            b = []
        }
        var b = [];
        return {
            push: function (c, d) {
                b.length === 0 && Tb(d, a);
                b.push(c)
            }
        }
    }();
    Sa = ha || gb || sa;
    Qa.prototype = {
        addLabel: function () {
            var a = this.axis,
                b = a.options,
                c = a.chart,
                d = a.horiz,
                e = a.categories,
                f = this.pos,
                g = b.labels,
                h = a.tickPositions,
                d = e && d && e.length && !g.step && !g.staggerLines && !g.rotation && c.plotWidth / h.length || !d && c.plotWidth / 2,
                i = f === h[0],
                j = f === h[h.length - 1],
                k = e && r(e[f]) ? e[f] : f,
                e = this.label,
                h = h.info,
                l;
            a.isDatetimeAxis && h && (l = b.dateTimeLabelFormats[h.higherRanks[f] || h.unitName]);
            this.isFirst = i;
            this.isLast = j;
            b = a.labelFormatter.call({
                axis: a,
                chart: c,
                isFirst: i,
                isLast: j,
                dateTimeLabelFormat: l,
                value: a.isLog ? da(aa(k)) : k
            });
            f = d && {
                width: s(1, u(d - 2 * (g.padding || 10))) + "px"
            };
            f = x(f, g.style);
            if (r(e)) e && e.attr({
                text: b
            }).css(f);
            else {
                d = {
                    align: g.align
                };
                if (Da(g.rotation)) d.rotation = g.rotation;
                this.label = r(b) && g.enabled ? c.renderer.text(b, 0, 0, g.useHTML).attr(d).css(f).add(a.labelGroup) : null
            }
        },
        getLabelSize: function () {
            var a = this.label,
                b = this.axis;
            return a ? (this.labelBBox = a.getBBox())[b.horiz ? "height" :
                "width"] : 0
        },
        getLabelSides: function () {
            var a = this.axis.options.labels,
                b = this.labelBBox.width,
                a = b * {
                    left: 0,
                    center: 0.5,
                    right: 1
                }[a.align] - a.x;
            return [-a, b - a]
        },
        handleOverflow: function (a, b) {
            var c = !0,
                d = this.axis,
                e = d.chart,
                f = this.isFirst,
                g = this.isLast,
                h = b.x,
                i = d.reversed,
                j = d.tickPositions;
            if (f || g) {
                var k = this.getLabelSides(),
                    l = k[0],
                    k = k[1],
                    e = e.plotLeft,
                    m = e + d.len,
                    j = (d = d.ticks[j[a + (f ? 1 : -1)]]) && d.label.xy && d.label.xy.x + d.getLabelSides()[f ? 0 : 1];
                f && !i || g && i ? h + l < e && (h = e - l, d && h + k > j && (c = !1)) : h + k > m && (h = m - k, d && h + l < j && (c = !1));
                b.x = h
            }
            return c
        },
        getPosition: function (a, b, c, d) {
            var e = this.axis,
                f = e.chart,
                g = d && f.oldChartHeight || f.chartHeight;
            return {
                x: a ? e.translate(b + c, null, null, d) + e.transB : e.left + e.offset + (e.opposite ? (d && f.oldChartWidth || f.chartWidth) - e.right - e.left : 0),
                y: a ? g - e.bottom + e.offset - (e.opposite ? e.height : 0) : g - e.translate(b + c, null, null, d) - e.transB
            }
        },
        getLabelPosition: function (a, b, c, d, e, f, g, h) {
            var i = this.axis,
                j = i.transA,
                k = i.reversed,
                i = i.staggerLines,
                a = a + e.x - (f && d ? f * j * (k ? -1 : 1) : 0),
                b = b + e.y - (f && !d ? f * j * (k ? 1 : -1) : 0);
            r(e.y) || (b += z(c.styles.lineHeight) * 0.9 - c.getBBox().height / 2);
            i && (b += g / (h || 1) % i * 16);
            return {
                x: a,
                y: b
            }
        },
        getMarkPath: function (a, b, c, d, e, f) {
            return f.crispLine(["M", a, b, "L", a + (e ? 0 : -c), b + (e ? c : 0)], d)
        },
        render: function (a, b) {
            var c = this.axis,
                d = c.options,
                e = c.chart.renderer,
                f = c.horiz,
                g = this.type,
                h = this.label,
                i = this.pos,
                j = d.labels,
                k = this.gridLine,
                l = g ? g + "Grid" : "grid",
                m = g ? g + "Tick" : "tick",
                q = d[l + "LineWidth"],
                p = d[l + "LineColor"],
                y = d[l + "LineDashStyle"],
                t = d[m + "Length"],
                l = d[m + "Width"] || 0,
                o = d[m + "Color"],
                r = d[m + "Position"],
                m = this.mark,
                v = j.step,
                s = !0,
                u = c.tickmarkOffset,
                E = this.getPosition(f, i, u, b),
                S = E.x,
                E = E.y,
                x = c.staggerLines;
            if (q) {
                i = c.getPlotLinePath(i + u, q, b);
                if (k === A) {
                    k = {
                        stroke: p,
                        "stroke-width": q
                    };
                    if (y) k.dashstyle = y;
                    if (!g) k.zIndex = 1;
                    this.gridLine = k = q ? e.path(i).attr(k).add(c.gridGroup) : null
                }
                if (!b && k && i) k[this.isNew ? "attr" : "animate"]({
                    d: i
                })
            }
            if (l && t) r === "inside" && (t = -t), c.opposite && (t = -t), g = this.getMarkPath(S, E, t, l, f, e), m ? m.animate({
                d: g
            }) : this.mark = e.path(g).attr({
                stroke: o,
                "stroke-width": l
            }).add(c.axisGroup);
            if (h && !isNaN(S)) h.xy = E = this.getLabelPosition(S, E, h, f, j, u, a, v), this.isFirst && !n(d.showFirstLabel, 1) || this.isLast && !n(d.showLastLabel, 1) ? s = !1 : !x && f && j.overflow === "justify" && !this.handleOverflow(a, E) && (s = !1), v && a % v && (s = !1), s ? (h[this.isNew ? "attr" : "animate"](E), this.isNew = !1) : h.attr("y", -9999)
        },
        destroy: function () {
            Ga(this, this.axis)
        }
    };
    nb.prototype = {
        render: function () {
            var a = this,
                b = a.axis,
                c = b.horiz,
                d = (b.pointRange || 0) / 2,
                e = a.options,
                f = e.label,
                g = a.label,
                h = e.width,
                i = e.to,
                j = e.from,
                k = r(j) && r(i),
                l = e.value,
                m = e.dashStyle,
                q = a.svgElem,
                p = [],
                y, t = e.color,
                o = e.zIndex,
                u = e.events,
                v = b.chart.renderer;
            b.isLog && (j = ka(j), i = ka(i), l = ka(l));
            if (h) {
                if (p = b.getPlotLinePath(l, h), d = {
                    stroke: t,
                    "stroke-width": h
                }, m) d.dashstyle = m
            } else if (k) {
                if (j = s(j, b.min - d), i = O(i, b.max + d), p = b.getPlotBandPath(j, i, e), d = {
                    fill: t
                }, e.borderWidth) d.stroke = e.borderColor, d["stroke-width"] = e.borderWidth
            } else return;
            if (r(o)) d.zIndex = o;
            if (q) p ? q.animate({
                d: p
            }, null, q.onGetPath) : (q.hide(), q.onGetPath = function () {
                q.show()
            });
            else if (p && p.length && (a.svgElem = q = v.path(p).attr(d).add(), u)) for (y in e = function (b) {
                q.on(b, function (c) {
                    u[b].apply(a, [c])
                })
            }, u) e(y);
            if (f && r(f.text) && p && p.length && b.width > 0 && b.height > 0) {
                f = B({
                    align: c && k && "center",
                    x: c ? !k && 4 : 10,
                    verticalAlign: !c && k && "middle",
                    y: c ? k ? 16 : 10 : k ? 6 : -4,
                    rotation: c && !k && 90
                }, f);
                if (!g) a.label = g = v.text(f.text, 0, 0).attr({
                    align: f.textAlign || f.align,
                    rotation: f.rotation,
                    zIndex: o
                }).css(f.style).add();
                b = [p[1], p[4], n(p[6], p[1])];
                p = [p[2], p[5], n(p[7], p[2])];
                c = Fa(b);
                k = Fa(p);
                g.align(f, !1, {
                    x: c,
                    y: k,
                    width: wa(b) - c,
                    height: wa(p) - k
                });
                g.show()
            } else g && g.hide();
            return a
        },
        destroy: function () {
            ta(this.axis.plotLinesAndBands,
            this);
            Ga(this, this.axis)
        }
    };
    Kb.prototype = {
        destroy: function () {
            Ga(this, this.axis)
        },
        setTotal: function (a) {
            this.cum = this.total = a
        },
        render: function (a) {
            var b = this.options.formatter.call(this);
            this.label ? this.label.attr({
                text: b,
                visibility: "hidden"
            }) : this.label = this.axis.chart.renderer.text(b, 0, 0).css(this.options.style).attr({
                align: this.textAlign,
                rotation: this.options.rotation,
                visibility: "hidden"
            }).add(a)
        },
        setOffset: function (a, b) {
            var c = this.axis,
                d = c.chart,
                e = d.inverted,
                f = this.isNegative,
                g = c.translate(this.percent ? 100 : this.total, 0, 0, 0, 1),
                c = c.translate(0),
                c = M(g - c),
                h = d.xAxis[0].translate(this.x) + a,
                i = d.plotHeight,
                f = {
                    x: e ? f ? g : g - c : h,
                    y: e ? i - h - b : f ? i - g - c : i - g,
                    width: e ? c : b,
                    height: e ? b : c
                };
            if (e = this.label) e.align(this.alignOptions, null, f), f = e.alignAttr, e.attr({
                visibility: this.options.crop === !1 || d.isInsidePlot(f.x, f.y) ? ca ? "inherit" : "visible" : "hidden"
            })
        }
    };
    ob.prototype = {
        defaultOptions: {
            dateTimeLabelFormats: {
                millisecond: "%H:%M:%S.%L",
                second: "%H:%M:%S",
                minute: "%H:%M",
                hour: "%H:%M",
                day: "%e. %b",
                week: "%e. %b",
                month: "%b '%y",
                year: "%Y"
            },
            endOnTick: !1,
            gridLineColor: "#C0C0C0",
            labels: G,
            lineColor: "#C0D0E0",
            lineWidth: 1,
            minPadding: 0.01,
            maxPadding: 0.01,
            minorGridLineColor: "#E0E0E0",
            minorGridLineWidth: 1,
            minorTickColor: "#A0A0A0",
            minorTickLength: 2,
            minorTickPosition: "outside",
            startOfWeek: 1,
            startOnTick: !1,
            tickColor: "#C0D0E0",
            tickLength: 5,
            tickmarkPlacement: "between",
            tickPixelInterval: 100,
            tickPosition: "outside",
            tickWidth: 1,
            title: {
                align: "middle",
                style: {
                    color: "#6D869F",
                    fontWeight: "bold"
                }
            },
            type: "linear"
        },
        defaultYAxisOptions: {
            endOnTick: !0,
            gridLineWidth: 1,
            tickPixelInterval: 72,
            showLastLabel: !0,
            labels: {
                align: "right",
                x: -8,
                y: 3
            },
            lineWidth: 0,
            maxPadding: 0.05,
            minPadding: 0.05,
            startOnTick: !0,
            tickWidth: 0,
            title: {
                rotation: 270,
                text: "Y-values"
            },
            stackLabels: {
                enabled: !1,
                formatter: function () {
                    return this.total
                },
                style: G.style
            }
        },
        defaultLeftAxisOptions: {
            labels: {
                align: "right",
                x: -8,
                y: null
            },
            title: {
                rotation: 270
            }
        },
        defaultRightAxisOptions: {
            labels: {
                align: "left",
                x: 8,
                y: null
            },
            title: {
                rotation: 90
            }
        },
        defaultBottomAxisOptions: {
            labels: {
                align: "center",
                x: 0,
                y: 14
            },
            title: {
                rotation: 0
            }
        },
        defaultTopAxisOptions: {
            labels: {
                align: "center",
                x: 0,
                y: -5
            },
            title: {
                rotation: 0
            }
        },
        init: function (a, b) {
            var c = b.isX;
            this.horiz = a.inverted ? !c : c;
            this.xOrY = (this.isXAxis = c) ? "x" : "y";
            this.opposite = b.opposite;
            this.side = this.horiz ? this.opposite ? 0 : 2 : this.opposite ? 1 : 3;
            this.setOptions(b);
            var d = this.options,
                e = d.type,
                f = e === "datetime";
            this.labelFormatter = d.labels.formatter || this.defaultLabelFormatter;
            this.staggerLines = this.horiz && d.labels.staggerLines;
            this.userOptions = b;
            this.minPixelPadding = 0;
            this.chart = a;
            this.reversed = d.reversed;
            this.categories = d.categories;
            this.isLog = e === "logarithmic";
            this.isLinked = r(d.linkedTo);
            this.isDatetimeAxis = f;
            this.tickmarkOffset = d.categories && d.tickmarkPlacement === "between" ? 0.5 : 0;
            this.ticks = {};
            this.minorTicks = {};
            this.plotLinesAndBands = [];
            this.alternateBands = {};
            this.len = 0;
            this.minRange = this.userMinRange = d.minRange || d.maxZoom;
            this.range = d.range;
            this.offset = d.offset || 0;
            this.stacks = {};
            this.min = this.max = null;
            var g, d = this.options.events;
            a.axes.push(this);
            a[c ? "xAxis" : "yAxis"].push(this);
            this.series = [];
            if (a.inverted && c && this.reversed === A) this.reversed = !0;
            this.removePlotLine = this.removePlotBand = this.removePlotBandOrLine;
            this.addPlotLine = this.addPlotBand = this.addPlotBandOrLine;
            for (g in d) J(this, g, d[g]);
            if (this.isLog) this.val2lin = ka, this.lin2val = aa
        },
        setOptions: function (a) {
            this.options = B(this.defaultOptions, this.isXAxis ? {} : this.defaultYAxisOptions, [this.defaultTopAxisOptions, this.defaultRightAxisOptions, this.defaultBottomAxisOptions, this.defaultLeftAxisOptions][this.side], B(N[this.isXAxis ? "xAxis" : "yAxis"], a))
        },
        defaultLabelFormatter: function () {
            var a = this.axis,
                b = this.value,
                c = this.dateTimeLabelFormat,
                d = N.lang.numericSymbols,
                e = d && d.length,
                f, g = a.isLog ? b : a.tickInterval;
            if (a.categories) f = b;
            else if (c) f = db(c, b);
            else if (e && g >= 1E3) for (; e-- && f === A;) a = Math.pow(1E3, e + 1), g >= a && d[e] !== null && (f = Ja(b / a, -1) + d[e]);
            f === A && (f = b >= 1E3 ? Ja(b, 0) : Ja(b, -1));
            return f
        },
        getSeriesExtremes: function () {
            var a = this,
                b = a.chart,
                c = a.stacks,
                d = [],
                e = [],
                f;
            a.hasVisibleSeries = !1;
            a.dataMin = a.dataMax = null;
            o(a.series, function (g) {
                if (g.visible || !b.options.chart.ignoreHiddenSeries) {
                    var h = g.options,
                        i, j, k, l, m, q, p, y, t, o = h.threshold,
                        u, v = [],
                        x = 0;
                    a.hasVisibleSeries = !0;
                    if (a.isLog && o <= 0) o = h.threshold = null;
                    if (a.isXAxis) {
                        if (h = g.xData, h.length) a.dataMin = O(n(a.dataMin, h[0]), Fa(h)), a.dataMax = s(n(a.dataMax, h[0]), wa(h))
                    } else {
                        var z, E, S, w = g.cropped,
                            B = g.xAxis.getExtremes(),
                            C = !! g.modifyValue;
                        i = h.stacking;
                        a.usePercentage = i === "percent";
                        if (i) m = h.stack, l = g.type + n(m, ""), q = "-" + l, g.stackKey = l, j = d[l] || [], d[l] = j, k = e[q] || [], e[q] = k;
                        if (a.usePercentage) a.dataMin = 0, a.dataMax = 99;
                        h = g.processedXData;
                        p = g.processedYData;
                        u = p.length;
                        for (f = 0; f < u; f++) if (y = h[f], t = p[f], i && (E = (z = t < o) ? k : j, S = z ? q : l, r(E[y]) ? (E[y] = da(E[y] + t), t = [t, E[y]]) : E[y] = t, c[S] || (c[S] = {}), c[S][y] || (c[S][y] = new Kb(a, a.options.stackLabels, z, y, m, i)), c[S][y].setTotal(E[y])), t !== null && t !== A && (C && (t = g.modifyValue(t)), w || (h[f + 1] || y) >= B.min && (h[f - 1] || y) <= B.max)) if (y = t.length) for (; y--;) t[y] !== null && (v[x++] = t[y]);
                        else v[x++] = t;
                        if (!a.usePercentage && v.length) a.dataMin = O(n(a.dataMin, v[0]), Fa(v)), a.dataMax = s(n(a.dataMax, v[0]), wa(v));
                        if (r(o)) if (a.dataMin >= o) a.dataMin = o, a.ignoreMinPadding = !0;
                        else if (a.dataMax < o) a.dataMax = o, a.ignoreMaxPadding = !0
                    }
                }
            })
        },
        translate: function (a, b, c, d, e, f) {
            var g = this.len,
                h = 1,
                i = 0,
                j = d ? this.oldTransA : this.transA,
                d = d ? this.oldMin : this.min,
                e = this.options.ordinal || this.isLog && e;
            if (!j) j = this.transA;
            c && (h *= -1, i = g);
            this.reversed && (h *= -1, i -= h * g);
            b ? (this.reversed && (a = g - a), a = a / j + d, e && (a = this.lin2val(a))) : (e && (a = this.val2lin(a)), a = h * (a - d) * j + i + h * this.minPixelPadding + (f ? j * this.pointRange / 2 : 0));
            return a
        },
        getPlotLinePath: function (a, b, c) {
            var d = this.chart,
                e = this.left,
                f = this.top,
                g, h, i, a = this.translate(a, null, null, c),
                j = c && d.oldChartHeight || d.chartHeight,
                k = c && d.oldChartWidth || d.chartWidth,
                l;
            g = this.transB;
            c = h = u(a + g);
            g = i = u(j - a - g);
            if (isNaN(a)) l = !0;
            else if (this.horiz) {
                if (g = f, i = j - this.bottom, c < e || c > e + this.width) l = !0
            } else if (c = e, h = k - this.right, g < f || g > f + this.height) l = !0;
            return l ? null : d.renderer.crispLine(["M", c, g, "L", h, i], b || 0)
        },
        getPlotBandPath: function (a, b) {
            var c = this.getPlotLinePath(b),
                d = this.getPlotLinePath(a);
            d && c ? d.push(c[4], c[5], c[1], c[2]) : d = null;
            return d
        },
        getLinearTickPositions: function (a,
        b, c) {
            for (var d, b = da(U(b / a) * a), c = da(za(c / a) * a), e = []; b <= c;) {
                e.push(b);
                b = da(b + a);
                if (b === d) break;
                d = b
            }
            return e
        },
        getLogTickPositions: function (a, b, c, d) {
            var e = this.options,
                f = this.len,
                g = [];
            if (!d) this._minorAutoInterval = null;
            if (a >= 0.5) a = u(a), g = this.getLinearTickPositions(a, b, c);
            else if (a >= 0.08) for (var f = U(b), h, i, j, k, l, e = a > 0.3 ? [1, 2, 4] : a > 0.15 ? [1, 2, 4, 6, 8] : [1, 2, 3, 4, 5, 6, 7, 8, 9]; f < c + 1 && !l; f++) {
                i = e.length;
                for (h = 0; h < i && !l; h++) j = ka(aa(f) * e[h]), j > b && g.push(k), k > c && (l = !0), k = j
            } else if (b = aa(b), c = aa(c), a = e[d ? "minorTickInterval" :
                "tickInterval"], a = n(a === "auto" ? null : a, this._minorAutoInterval, (c - b) * (e.tickPixelInterval / (d ? 5 : 1)) / ((d ? f / this.tickPositions.length : f) || 1)), a = hb(a, null, K.pow(10, U(K.log(a) / K.LN10))), g = Ta(this.getLinearTickPositions(a, b, c), ka), !d) this._minorAutoInterval = a / 5;
            if (!d) this.tickInterval = a;
            return g
        },
        getMinorTickPositions: function () {
            var a = this.options,
                b = this.tickPositions,
                c = this.minorTickInterval,
                d = [],
                e;
            if (this.isLog) {
                e = b.length;
                for (a = 1; a < e; a++) d = d.concat(this.getLogTickPositions(c, b[a - 1], b[a], !0))
            } else if (this.isDatetimeAxis && a.minorTickInterval === "auto") d = d.concat(Cb(Ab(c), this.min, this.max, a.startOfWeek));
            else for (b = this.min + (b[0] - this.min) % c; b <= this.max; b += c) d.push(b);
            return d
        },
        adjustForMinRange: function () {
            var a = this.options,
                b = this.min,
                c = this.max,
                d, e = this.dataMax - this.dataMin >= this.minRange,
                f, g, h, i, j;
            if (this.isXAxis && this.minRange === A && !this.isLog) r(a.min) || r(a.max) ? this.minRange = null : (o(this.series, function (a) {
                i = a.xData;
                for (g = j = a.xIncrement ? 1 : i.length - 1; g > 0; g--) if (h = i[g] - i[g - 1], f === A || h < f) f = h
            }), this.minRange = O(f * 5,
            this.dataMax - this.dataMin));
            if (c - b < this.minRange) {
                var k = this.minRange;
                d = (k - c + b) / 2;
                d = [b - d, n(a.min, b - d)];
                if (e) d[2] = this.dataMin;
                b = wa(d);
                c = [b + k, n(a.max, b + k)];
                if (e) c[2] = this.dataMax;
                c = Fa(c);
                c - b < k && (d[0] = c - k, d[1] = n(a.min, c - k), b = wa(d))
            }
            this.min = b;
            this.max = c
        },
        setAxisTranslation: function () {
            var a = this.max - this.min,
                b = 0,
                c, d = 0,
                e = 0,
                f = this.linkedParent,
                g = this.transA;
            if (this.isXAxis) f ? (d = f.minPointOffset, e = f.pointRangePadding) : o(this.series, function (a) {
                var f = a.pointRange,
                    g = a.options.pointPlacement,
                    k = a.closestPointRange;
                b = s(b, f);
                d = s(d, g ? 0 : f / 2);
                e = s(e, g === "on" ? 0 : f);
                !a.noSharedTooltip && r(k) && (c = r(c) ? O(c, k) : k)
            }), this.minPointOffset = d, this.pointRangePadding = e, this.pointRange = b, this.closestPointRange = c;
            this.oldTransA = g;
            this.translationSlope = this.transA = g = this.len / (a + e || 1);
            this.transB = this.horiz ? this.left : this.bottom;
            this.minPixelPadding = g * d
        },
        setTickPositions: function (a) {
            var b = this,
                c = b.chart,
                d = b.options,
                e = b.isLog,
                f = b.isDatetimeAxis,
                g = b.isXAxis,
                h = b.isLinked,
                i = b.options.tickPositioner,
                j = d.maxPadding,
                k = d.minPadding,
                l = d.tickInterval,
                m = d.minTickInterval,
                q = d.tickPixelInterval,
                p = b.categories;
            h ? (b.linkedParent = c[g ? "xAxis" : "yAxis"][d.linkedTo], c = b.linkedParent.getExtremes(), b.min = n(c.min, c.dataMin), b.max = n(c.max, c.dataMax), d.type !== b.linkedParent.options.type && Oa(11, 1)) : (b.min = n(b.userMin, d.min, b.dataMin), b.max = n(b.userMax, d.max, b.dataMax));
            if (e)!a && O(b.min, n(b.dataMin, b.min)) <= 0 && Oa(10, 1), b.min = da(ka(b.min)), b.max = da(ka(b.max));
            if (b.range && (b.userMin = b.min = s(b.min, b.max - b.range), b.userMax = b.max, a)) b.range = null;
            b.adjustForMinRange();
            if (!p && !b.usePercentage && !h && r(b.min) && r(b.max) && (c = b.max - b.min)) {
                if (!r(d.min) && !r(b.userMin) && k && (b.dataMin < 0 || !b.ignoreMinPadding)) b.min -= c * k;
                if (!r(d.max) && !r(b.userMax) && j && (b.dataMax > 0 || !b.ignoreMaxPadding)) b.max += c * j
            }
            b.tickInterval = b.min === b.max || b.min === void 0 || b.max === void 0 ? 1 : h && !l && q === b.linkedParent.options.tickPixelInterval ? b.linkedParent.tickInterval : n(l, p ? 1 : (b.max - b.min) * q / (b.len || 1));
            g && !a && o(b.series, function (a) {
                a.processData(b.min !== b.oldMin || b.max !== b.oldMax)
            });
            b.setAxisTranslation(a);
            b.beforeSetTickPositions && b.beforeSetTickPositions();
            if (b.postProcessTickInterval) b.tickInterval = b.postProcessTickInterval(b.tickInterval);
            if (!l && b.tickInterval < m) b.tickInterval = m;
            if (!f && !e && (a = K.pow(10, U(K.log(b.tickInterval) / K.LN10)), !l)) b.tickInterval = hb(b.tickInterval, null, a, d);
            b.minorTickInterval = d.minorTickInterval === "auto" && b.tickInterval ? b.tickInterval / 5 : d.minorTickInterval;
            b.tickPositions = i = d.tickPositions || i && i.apply(b, [b.min, b.max]);
            if (!i) i = f ? (b.getNonLinearTimeTicks || Cb)(Ab(b.tickInterval,
            d.units), b.min, b.max, d.startOfWeek, b.ordinalPositions, b.closestPointRange, !0) : e ? b.getLogTickPositions(b.tickInterval, b.min, b.max) : b.getLinearTickPositions(b.tickInterval, b.min, b.max), b.tickPositions = i;
            if (!h) e = i[0], f = i[i.length - 1], h = b.minPointOffset || 0, d.startOnTick ? b.min = e : b.min - h > e && i.shift(), d.endOnTick ? b.max = f : b.max + h < f && i.pop(), i.length === 1 && (b.min -= 1.0E-9, b.max += 1.0E-9)
        },
        setMaxTicks: function () {
            var a = this.chart,
                b = a.maxTicks,
                c = this.tickPositions,
                d = this.xOrY;
            b || (b = {
                x: 0,
                y: 0
            });
            if (!this.isLinked && !this.isDatetimeAxis && c.length > b[d] && this.options.alignTicks !== !1) b[d] = c.length;
            a.maxTicks = b
        },
        adjustTickAmount: function () {
            var a = this.xOrY,
                b = this.tickPositions,
                c = this.chart.maxTicks;
            if (c && c[a] && !this.isDatetimeAxis && !this.categories && !this.isLinked && this.options.alignTicks !== !1) {
                var d = this.tickAmount,
                    e = b.length;
                this.tickAmount = a = c[a];
                if (e < a) {
                    for (; b.length < a;) b.push(da(b[b.length - 1] + this.tickInterval));
                    this.transA *= (e - 1) / (a - 1);
                    this.max = b[b.length - 1]
                }
                if (r(d) && a !== d) this.isDirty = !0
            }
        },
        setScale: function () {
            var a = this.stacks,
                b, c, d, e;
            this.oldMin = this.min;
            this.oldMax = this.max;
            this.oldAxisLength = this.len;
            this.setAxisSize();
            e = this.len !== this.oldAxisLength;
            o(this.series, function (a) {
                if (a.isDirtyData || a.isDirty || a.xAxis.isDirty) d = !0
            });
            if (e || d || this.isLinked || this.userMin !== this.oldUserMin || this.userMax !== this.oldUserMax) if (this.getSeriesExtremes(), this.setTickPositions(), this.oldUserMin = this.userMin, this.oldUserMax = this.userMax, !this.isDirty) this.isDirty = e || this.min !== this.oldMin || this.max !== this.oldMax;
            if (!this.isXAxis) for (b in a) for (c in a[b]) a[b][c].cum = a[b][c].total;
            this.setMaxTicks()
        },
        setExtremes: function (a, b, c, d, e) {
            var f = this,
                g = f.chart,
                c = n(c, !0),
                e = x(e, {
                    min: a,
                    max: b
                });
            F(f, "setExtremes", e, function () {
                f.userMin = a;
                f.userMax = b;
                f.isDirtyExtremes = !0;
                c && g.redraw(d)
            })
        },
        zoom: function (a, b) {
            this.setExtremes(a, b, !1, A, {
                trigger: "zoom"
            });
            return !0
        },
        setAxisSize: function () {
            var a = this.chart,
                b = this.options,
                c = b.offsetLeft || 0,
                d = b.offsetRight || 0;
            this.left = n(b.left, a.plotLeft + c);
            this.top = n(b.top, a.plotTop);
            this.width = n(b.width, a.plotWidth - c + d);
            this.height = n(b.height, a.plotHeight);
            this.bottom = a.chartHeight - this.height - this.top;
            this.right = a.chartWidth - this.width - this.left;
            this.len = s(this.horiz ? this.width : this.height, 0)
        },
        getExtremes: function () {
            var a = this.isLog;
            return {
                min: a ? da(aa(this.min)) : this.min,
                max: a ? da(aa(this.max)) : this.max,
                dataMin: this.dataMin,
                dataMax: this.dataMax,
                userMin: this.userMin,
                userMax: this.userMax
            }
        },
        getThreshold: function (a) {
            var b = this.isLog,
                c = b ? aa(this.min) : this.min,
                b = b ? aa(this.max) : this.max;
            c > a || a === null ? a = c : b < a && (a = b);
            return this.translate(a, 0, 1, 0, 1)
        },
        addPlotBandOrLine: function (a) {
            a = (new nb(this, a)).render();
            this.plotLinesAndBands.push(a);
            return a
        },
        getOffset: function () {
            var a = this,
                b = a.chart,
                c = b.renderer,
                d = a.options,
                e = a.tickPositions,
                f = a.ticks,
                g = a.horiz,
                h = a.side,
                i, j = 0,
                k, l = 0,
                m = d.title,
                q = d.labels,
                p = 0,
                y = b.axisOffset,
                t = [-1, 1, 1, -1][h],
                H;
            a.hasData = b = a.hasVisibleSeries || r(a.min) && r(a.max) && !! e;
            a.showAxis = i = b || n(d.showEmpty, !0);
            if (!a.axisGroup) a.gridGroup = c.g("grid").attr({
                zIndex: d.gridZIndex || 1
            }).add(), a.axisGroup = c.g("axis").attr({
                zIndex: d.zIndex || 2
            }).add(), a.labelGroup = c.g("axis-labels").attr({
                zIndex: q.zIndex || 7
            }).add();
            if (b || a.isLinked) o(e, function (b) {
                f[b] ? f[b].addLabel() : f[b] = new Qa(a, b)
            }), o(e, function (a) {
                if (h === 0 || h === 2 || {
                    1: "left",
                    3: "right"
                }[h] === q.align) p = s(f[a].getLabelSize(), p)
            }), a.staggerLines && (p += (a.staggerLines - 1) * 16);
            else for (H in f) f[H].destroy(), delete f[H];
            if (m && m.text) {
                if (!a.axisTitle) a.axisTitle = c.text(m.text, 0, 0, m.useHTML).attr({
                    zIndex: 7,
                    rotation: m.rotation || 0,
                    align: m.textAlign || {
                        low: "left",
                        middle: "center",
                        high: "right"
                    }[m.align]
                }).css(m.style).add(a.axisGroup), a.axisTitle.isNew = !0;
                if (i) j = a.axisTitle.getBBox()[g ? "height" : "width"], l = n(m.margin, g ? 5 : 10), k = m.offset;
                a.axisTitle[i ? "show" : "hide"]()
            }
            a.offset = t * n(d.offset, y[h]);
            a.axisTitleMargin = n(k, p + l + (h !== 2 && p && t * d.labels[g ? "y" : "x"]));
            y[h] = s(y[h], a.axisTitleMargin + j + t * a.offset)
        },
        getLinePath: function (a) {
            var b = this.chart,
                c = this.opposite,
                d = this.offset,
                e = this.horiz,
                f = this.left + (c ? this.width : 0) + d;
            this.lineTop = c = b.chartHeight - this.bottom - (c ? this.height : 0) + d;
            return b.renderer.crispLine(["M", e ? this.left : f, e ? c : this.top, "L", e ? b.chartWidth - this.right : f, e ? c : b.chartHeight - this.bottom], a)
        },
        getTitlePosition: function () {
            var a = this.horiz,
                b = this.left,
                c = this.top,
                d = this.len,
                e = this.options.title,
                f = a ? b : c,
                g = this.opposite,
                h = this.offset,
                i = z(e.style.fontSize || 12),
                d = {
                    low: f + (a ? 0 : d),
                    middle: f + d / 2,
                    high: f + (a ? d : 0)
                }[e.align],
                b = (a ? c + this.height : b) + (a ? 1 : -1) * (g ? -1 : 1) * this.axisTitleMargin + (this.side === 2 ? i : 0);
            return {
                x: a ? d : b + (g ? this.width : 0) + h + (e.x || 0),
                y: a ? b - (g ? this.height : 0) + h : d + (e.y || 0)
            }
        },
        render: function () {
            var a = this,
                b = a.chart,
                c = b.renderer,
                d = a.options,
                e = a.isLog,
                f = a.isLinked,
                g = a.tickPositions,
                h = a.axisTitle,
                i = a.stacks,
                j = a.ticks,
                k = a.minorTicks,
                l = a.alternateBands,
                m = d.stackLabels,
                q = d.alternateGridColor,
                p = a.tickmarkOffset,
                n = d.lineWidth,
                t, H = b.hasRendered && r(a.oldMin) && !isNaN(a.oldMin),
                u = a.showAxis,
                v, s;
            if (a.hasData || f) if (a.minorTickInterval && !a.categories && o(a.getMinorTickPositions(), function (b) {
                k[b] || (k[b] = new Qa(a, b, "minor"));
                H && k[b].isNew && k[b].render(null, !0);
                k[b].isActive = !0;
                k[b].render()
            }), g.length && o(g.slice(1).concat([g[0]]), function (b, c) {
                c = c === g.length - 1 ? 0 : c + 1;
                if (!f || b >= a.min && b <= a.max) j[b] || (j[b] = new Qa(a, b)), H && j[b].isNew && j[b].render(c, !0), j[b].isActive = !0, j[b].render(c)
            }), q && o(g, function (b, c) {
                if (c % 2 === 0 && b < a.max) l[b] || (l[b] = new nb(a)), v = b + p, s = g[c + 1] !== A ? g[c + 1] + p : a.max, l[b].options = {
                    from: e ? aa(v) : v,
                    to: e ? aa(s) : s,
                    color: q
                }, l[b].render(), l[b].isActive = !0
            }), !a._addedPlotLB) o((d.plotLines || []).concat(d.plotBands || []), function (b) {
                a.addPlotBandOrLine(b)
            }), a._addedPlotLB = !0;
            o([j, k, l], function (a) {
                for (var b in a) a[b].isActive ? a[b].isActive = !1 : (a[b].destroy(), delete a[b])
            });
            if (n) t = a.getLinePath(n), a.axisLine ? a.axisLine.animate({
                d: t
            }) : a.axisLine = c.path(t).attr({
                stroke: d.lineColor,
                "stroke-width": n,
                zIndex: 7
            }).add(a.axisGroup), a.axisLine[u ? "show" : "hide"]();
            if (h && u) h[h.isNew ? "attr" : "animate"](a.getTitlePosition()), h.isNew = !1;
            if (m && m.enabled) {
                var x, E, d = a.stackTotalGroup;
                if (!d) a.stackTotalGroup = d = c.g("stack-labels").attr({
                    visibility: "visible",
                    zIndex: 6
                }).add();
                d.translate(b.plotLeft, b.plotTop);
                for (x in i) for (E in b = i[x], b) b[E].render(d)
            }
            a.isDirty = !1
        },
        removePlotBandOrLine: function (a) {
            for (var b = this.plotLinesAndBands, c = b.length; c--;) b[c].id === a && b[c].destroy()
        },
        setTitle: function (a, b) {
            var c = this.chart,
                d = this.options,
                e = this.axisTitle;
            d.title = B(d.title, a);
            this.axisTitle = e && e.destroy();
            this.isDirty = !0;
            n(b, !0) && c.redraw()
        },
        redraw: function () {
            var a = this.chart;
            a.tracker.resetTracker && a.tracker.resetTracker(!0);
            this.render();
            o(this.plotLinesAndBands, function (a) {
                a.render()
            });
            o(this.series, function (a) {
                a.isDirty = !0
            })
        },
        setCategories: function (a, b) {
            var c = this.chart;
            this.categories = this.userOptions.categories = a;
            o(this.series, function (a) {
                a.translate();
                a.setTooltipPoints(!0)
            });
            this.isDirty = !0;
            n(b, !0) && c.redraw()
        },
        destroy: function () {
            var a = this,
                b = a.stacks,
                c;
            R(a);
            for (c in b) Ga(b[c]), b[c] = null;
            o([a.ticks, a.minorTicks, a.alternateBands, a.plotLinesAndBands], function (a) {
                Ga(a)
            });
            o("stackTotalGroup,axisLine,axisGroup,gridGroup,labelGroup,axisTitle".split(","), function (b) {
                a[b] && (a[b] = a[b].destroy())
            })
        }
    };
    pb.prototype = {
        destroy: function () {
            o(this.crosshairs, function (a) {
                a && a.destroy()
            });
            if (this.label) this.label = this.label.destroy()
        },
        move: function (a, b, c, d) {
            var e = this,
                f = e.now,
                g = e.options.animation !== !1 && !e.isHidden;
            x(f, {
                x: g ? (2 * f.x + a) / 3 : a,
                y: g ? (f.y + b) / 2 : b,
                anchorX: g ? (2 * f.anchorX + c) / 3 : c,
                anchorY: g ? (f.anchorY + d) / 2 : d
            });
            e.label.attr(f);
            if (g && (M(a - f.x) > 1 || M(b - f.y) > 1)) clearTimeout(this.tooltipTimeout), this.tooltipTimeout = setTimeout(function () {
                e && e.move(a, b, c, d)
            }, 32)
        },
        hide: function () {
            if (!this.isHidden) {
                var a = this.chart.hoverPoints;
                this.label.hide();
                a && o(a, function (a) {
                    a.setState()
                });
                this.chart.hoverPoints = null;
                this.isHidden = !0
            }
        },
        hideCrosshairs: function () {
            o(this.crosshairs,

            function (a) {
                a && a.hide()
            })
        },
        getAnchor: function (a, b) {
            var c, d = this.chart,
                e = d.inverted,
                f = 0,
                g = 0,
                h, a = la(a);
            c = a[0].tooltipPos;
            c || (o(a, function (a) {
                h = a.series.yAxis;
                f += a.plotX;
                g += (a.plotLow ? (a.plotLow + a.plotHigh) / 2 : a.plotY) + (!e && h ? h.top - d.plotTop : 0)
            }), f /= a.length, g /= a.length, c = [e ? d.plotWidth - g : f, this.shared && !e && a.length > 1 && b ? b.chartY - d.plotTop : e ? d.plotHeight - f : g]);
            return Ta(c, u)
        },
        getPosition: function (a, b, c) {
            var d = this.chart,
                e = d.plotLeft,
                f = d.plotTop,
                g = d.plotWidth,
                h = d.plotHeight,
                i = n(this.options.distance, 12),
                j = c.plotX,
                c = c.plotY,
                d = j + e + (d.inverted ? i : -a - i),
                k = c - b + f + 15,
                l;
            d < 7 && (d = e + s(j, 0) + i);
            d + a > e + g && (d -= d + a - (e + g), k = c - b + f - i, l = !0);
            k < f + 5 && (k = f + 5, l && c >= k && c <= k + b && (k = c + f + i));
            k + b > f + h && (k = s(f, f + h - b - i));
            return {
                x: d,
                y: k
            }
        },
        refresh: function (a, b) {
            function c() {
                var a = this.points || la(this),
                    b = a[0].series,
                    c;
                c = [b.tooltipHeaderFormatter(a[0].key)];
                o(a, function (a) {
                    b = a.series;
                    c.push(b.tooltipFormatter && b.tooltipFormatter(a) || a.point.tooltipFormatter(b.tooltipOptions.pointFormat))
                });
                c.push(f.footerFormat || "");
                return c.join("")
            }
            var d = this.chart,
                e = this.label,
                f = this.options,
                g, h, i, j = {}, k, l = [];
            k = f.formatter || c;
            var j = d.hoverPoints,
                m, q = f.crosshairs;
            i = this.shared;
            h = this.getAnchor(a, b);
            g = h[0];
            h = h[1];
            i && (!a.series || !a.series.noSharedTooltip) ? (d.hoverPoints = a, j && o(j, function (a) {
                a.setState()
            }), o(a, function (a) {
                a.setState("hover");
                l.push(a.getLabelConfig())
            }), j = {
                x: a[0].category,
                y: a[0].y
            }, j.points = l, a = a[0]) : j = a.getLabelConfig();
            k = k.call(j);
            j = a.series;
            i = i || !j.isCartesian || j.tooltipOutsidePlot || d.isInsidePlot(g, h);
            k === !1 || !i ? this.hide() : (this.isHidden && e.show(), e.attr({
                text: k
            }), m = f.borderColor || a.color || j.color || "#606060", e.attr({
                stroke: m
            }), e = (f.positioner || this.getPosition).call(this, e.width, e.height, {
                plotX: g,
                plotY: h
            }), this.move(u(e.x), u(e.y), g + d.plotLeft, h + d.plotTop), this.isHidden = !1);
            if (q) {
                q = la(q);
                for (e = q.length; e--;) if (i = a.series[e ? "yAxis" : "xAxis"], q[e] && i) if (i = i.getPlotLinePath(e ? n(a.stackY, a.y) : a.x, 1), this.crosshairs[e]) this.crosshairs[e].attr({
                    d: i,
                    visibility: "visible"
                });
                else {
                    j = {
                        "stroke-width": q[e].width || 1,
                        stroke: q[e].color || "#C0C0C0",
                        zIndex: q[e].zIndex || 2
                    };
                    if (q[e].dashStyle) j.dashstyle = q[e].dashStyle;
                    this.crosshairs[e] = d.renderer.path(i).attr(j).add()
                }
            }
            F(d, "tooltipRefresh", {
                text: k,
                x: g + d.plotLeft,
                y: h + d.plotTop,
                borderColor: m
            })
        }
    };
    qb.prototype = {
        normalizeMouseEvent: function (a) {
            var b, c, d, a = a || L.event;
            if (!a.target) a.target = a.srcElement;
            a = Pb(a);
            d = a.touches ? a.touches.item(0) : a;
            this.chartPosition = b = Vb(this.chart.container);
            d.pageX === A ? (c = a.x, b = a.y) : (c = d.pageX - b.left, b = d.pageY - b.top);
            return x(a, {
                chartX: u(c),
                chartY: u(b)
            })
        },
        getMouseCoordinates: function (a) {
            var b = {
                xAxis: [],
                yAxis: []
            }, c = this.chart;
            o(c.axes, function (d) {
                var e = d.isXAxis;
                b[e ? "xAxis" : "yAxis"].push({
                    axis: d,
                    value: d.translate(((c.inverted ? !e : e) ? a.chartX - c.plotLeft : d.top + d.len - a.chartY) - d.minPixelPadding, !0)
                })
            });
            return b
        },
        getIndex: function (a) {
            var b = this.chart;
            return b.inverted ? b.plotHeight + b.plotTop - a.chartY : a.chartX - b.plotLeft
        },
        onmousemove: function (a) {
            var b = this.chart,
                c = b.series,
                d = b.tooltip,
                e, f = b.hoverPoint,
                g = b.hoverSeries,
                h, i, j = b.chartWidth,
                k = this.getIndex(a);
            if (d && this.options.tooltip.shared && (!g || !g.noSharedTooltip)) {
                e = [];
                h = c.length;
                for (i = 0; i < h; i++) if (c[i].visible && c[i].options.enableMouseTracking !== !1 && !c[i].noSharedTooltip && c[i].tooltipPoints && c[i].tooltipPoints.length) b = c[i].tooltipPoints[k], b._dist = M(k - b[c[i].xAxis.tooltipPosName || "plotX"]), j = O(j, b._dist), e.push(b);
                for (h = e.length; h--;) e[h]._dist > j && e.splice(h, 1);
                if (e.length && e[0].plotX !== this.hoverX) d.refresh(e, a), this.hoverX = e[0].plotX
            }
            if (g && g.tracker && (b = g.tooltipPoints[k]) && b !== f) b.onMouseOver()
        },
        resetTracker: function (a) {
            var b = this.chart,
                c = b.hoverSeries,
                d = b.hoverPoint,
                e = b.tooltip,
                b = e && e.shared ? b.hoverPoints : d;
            (a = a && e && b) && la(b)[0].plotX === A && (a = !1);
            if (a) e.refresh(b);
            else {
                if (d) d.onMouseOut();
                if (c) c.onMouseOut();
                e && (e.hide(), e.hideCrosshairs());
                this.hoverX = null
            }
        },
        setDOMEvents: function () {
            function a() {
                if (b.selectionMarker) {
                    var f = {
                        xAxis: [],
                        yAxis: []
                    }, g = b.selectionMarker.getBBox(),
                        h = g.x - c.plotLeft,
                        l = g.y - c.plotTop,
                        m;
                    e && (o(c.axes, function (a) {
                        if (a.options.zoomEnabled !== !1) {
                            var b = a.isXAxis,
                                d = c.inverted ? !b : b,
                                e = a.translate(d ? h : c.plotHeight - l - g.height, !0, 0, 0, 1),
                                d = a.translate((d ? h + g.width : c.plotHeight - l) - 2 * a.minPixelPadding, !0, 0, 0, 1);
                            !isNaN(e) && !isNaN(d) && (f[b ? "xAxis" : "yAxis"].push({
                                axis: a,
                                min: O(e, d),
                                max: s(e, d)
                            }), m = !0)
                        }
                    }), m && F(c, "selection", f, function (a) {
                        c.zoom(a)
                    }));
                    b.selectionMarker = b.selectionMarker.destroy()
                }
                if (c) I(d, {
                    cursor: "auto"
                }), c.cancelClick = e, c.mouseIsDown = e = !1;
                R(C, "mouseup", a);
                Ba && R(C, "touchend", a)
            }
            var b = this,
                c = b.chart,
                d = c.container,
                e, f = b.zoomX && !c.inverted || b.zoomY && c.inverted,
                g = b.zoomY && !c.inverted || b.zoomX && c.inverted;
            b.hideTooltipOnMouseMove = function (a) {
                a = Pb(a);
                b.chartPosition && c.hoverSeries && c.hoverSeries.isCartesian && !c.isInsidePlot(a.pageX - b.chartPosition.left - c.plotLeft, a.pageY - b.chartPosition.top - c.plotTop) && b.resetTracker()
            };
            b.hideTooltipOnMouseLeave = function () {
                b.resetTracker();
                b.chartPosition = null
            };
            d.onmousedown = function (d) {
                d = b.normalizeMouseEvent(d);
                d.type.indexOf("touch") === -1 && d.preventDefault && d.preventDefault();
                c.mouseIsDown = !0;
                c.cancelClick = !1;
                c.mouseDownX = b.mouseDownX = d.chartX;
                b.mouseDownY = d.chartY;
                J(C, "mouseup", a);
                Ba && J(C, "touchend", a)
            };
            var h = function (a) {
                if (!a || !(a.touches && a.touches.length > 1)) {
                    var a = b.normalizeMouseEvent(a),
                        d = a.type,
                        h = a.chartX,
                        l = a.chartY,
                        m = !c.isInsidePlot(h - c.plotLeft, l - c.plotTop);
                    if (d.indexOf("touch") === -1) a.returnValue = !1;
                    d === "touchstart" && (w(a.target, "isTracker") ? c.runTrackerClick || a.preventDefault() : !c.runChartClick && !m && a.preventDefault());
                    if (m) h < c.plotLeft ? h = c.plotLeft : h > c.plotLeft + c.plotWidth && (h = c.plotLeft + c.plotWidth), l < c.plotTop ? l = c.plotTop : l > c.plotTop + c.plotHeight && (l = c.plotTop + c.plotHeight);
                    if (c.mouseIsDown && d !== "touchstart" && (e = Math.sqrt(Math.pow(b.mouseDownX - h, 2) + Math.pow(b.mouseDownY - l, 2)), e > 10)) {
                        d = c.isInsidePlot(b.mouseDownX - c.plotLeft, b.mouseDownY - c.plotTop);
                        if (c.hasCartesianSeries && (b.zoomX || b.zoomY) && d && !b.selectionMarker) b.selectionMarker = c.renderer.rect(c.plotLeft, c.plotTop, f ? 1 : c.plotWidth, g ? 1 : c.plotHeight, 0).attr({
                            fill: b.options.chart.selectionMarkerFill || "rgba(69,114,167,0.25)",
                            zIndex: 7
                        }).add();
                        if (b.selectionMarker && f) {
                            var q = h - b.mouseDownX;
                            b.selectionMarker.attr({
                                width: M(q),
                                x: (q > 0 ? 0 : q) + b.mouseDownX
                            })
                        }
                        b.selectionMarker && g && (l -= b.mouseDownY, b.selectionMarker.attr({
                            height: M(l),
                            y: (l > 0 ? 0 : l) + b.mouseDownY
                        }));
                        d && !b.selectionMarker && b.options.chart.panning && c.pan(h)
                    }
                    if (!m) b.onmousemove(a);
                    return m || !c.hasCartesianSeries
                }
            };
            if (!/Android 4\.0/.test(na)) d.onmousemove = h;
            J(d, "mouseleave", b.hideTooltipOnMouseLeave);
            Ba || J(C, "mousemove", b.hideTooltipOnMouseMove);
            d.ontouchstart = function (a) {
                if (b.zoomX || b.zoomY) d.onmousedown(a);
                h(a)
            };
            d.ontouchmove = h;
            d.ontouchend = function () {
                e && b.resetTracker()
            };
            d.onclick = function (a) {
                var d = c.hoverPoint,
                    e, f, a = b.normalizeMouseEvent(a);
                a.cancelBubble = !0;
                if (!c.cancelClick) d && (w(a.target, "isTracker") || w(a.target.parentNode, "isTracker")) ? (e = d.plotX, f = d.plotY, x(d, {
                    pageX: b.chartPosition.left + c.plotLeft + (c.inverted ? c.plotWidth - f : e),
                    pageY: b.chartPosition.top + c.plotTop + (c.inverted ? c.plotHeight - e : f)
                }), F(d.series, "click", x(a, {
                    point: d
                })), d.firePointEvent("click", a)) : (x(a, b.getMouseCoordinates(a)), c.isInsidePlot(a.chartX - c.plotLeft, a.chartY - c.plotTop) && F(c, "click", a))
            }
        },
        destroy: function () {
            var a = this.chart,
                b = a.container;
            if (a.trackerGroup) a.trackerGroup = a.trackerGroup.destroy();
            R(b, "mouseleave", this.hideTooltipOnMouseLeave);
            R(C, "mousemove", this.hideTooltipOnMouseMove);
            b.onclick = b.onmousedown = b.onmousemove = b.ontouchstart = b.ontouchend = b.ontouchmove = null;
            clearInterval(this.tooltipTimeout)
        },
        init: function (a, b) {
            if (!a.trackerGroup) a.trackerGroup = a.renderer.g("tracker").attr({
                zIndex: 9
            }).add();
            if (b.enabled) a.tooltip = new pb(a, b);
            this.setDOMEvents()
        }
    };
    rb.prototype = {
        init: function (a) {
            var b = this,
                c = b.options = a.options.legend;
            if (c.enabled) {
                var d = c.itemStyle,
                    e = n(c.padding, 8),
                    f = c.itemMarginTop || 0;
                b.baseline = z(d.fontSize) + 3 + f;
                b.itemStyle = d;
                b.itemHiddenStyle = B(d, c.itemHiddenStyle);
                b.itemMarginTop = f;
                b.padding = e;
                b.initialItemX = e;
                b.initialItemY = e - 5;
                b.maxItemWidth = 0;
                b.chart = a;
                b.itemHeight = 0;
                b.lastLineHeight = 0;
                b.render();
                J(b.chart, "endResize", function () {
                    b.positionCheckboxes()
                })
            }
        },
        colorizeItem: function (a, b) {
            var c = this.options,
                d = a.legendItem,
                e = a.legendLine,
                f = a.legendSymbol,
                g = this.itemHiddenStyle.color,
                c = b ? c.itemStyle.color : g,
                h = b ? a.color : g,
                g = a.options && a.options.marker,
                i = {
                    stroke: h,
                    fill: h
                }, j;
            d && d.css({
                fill: c
            });
            e && e.attr({
                stroke: h
            });
            if (f) {
                if (g) for (j in g = a.convertAttribs(g), g) d = g[j], d !== A && (i[j] = d);
                f.attr(i)
            }
        },
        positionItem: function (a) {
            var b = this.options,
                c = b.symbolPadding,
                b = !b.rtl,
                d = a._legendItemPos,
                e = d[0],
                d = d[1],
                f = a.checkbox;
            a.legendGroup && a.legendGroup.translate(b ? e : this.legendWidth - e - 2 * c - 4, d);
            if (f) f.x = e, f.y = d
        },
        destroyItem: function (a) {
            var b = a.checkbox;
            o(["legendItem", "legendLine", "legendSymbol",
                "legendGroup"], function (b) {
                a[b] && a[b].destroy()
            });
            b && Na(a.checkbox)
        },
        destroy: function () {
            var a = this.group,
                b = this.box;
            if (b) this.box = b.destroy();
            if (a) this.group = a.destroy()
        },
        positionCheckboxes: function (a) {
            var b = this.group.alignAttr,
                c, d = this.clipHeight || this.legendHeight;
            if (b) c = b.translateY, o(this.allItems, function (e) {
                var f = e.checkbox,
                    g;
                f && (g = c + f.y + (a || 0) + 3, I(f, {
                    left: b.translateX + e.legendItemWidth + f.x - 20 + "px",
                    top: g + "px",
                    display: g > c - 6 && g < c + d - 6 ? "" : Q
                }))
            })
        },
        renderItem: function (a) {
            var p;
            var b = this,
                c = b.chart,
                d = c.renderer,
                e = b.options,
                f = e.layout === "horizontal",
                g = e.symbolWidth,
                h = e.symbolPadding,
                i = b.itemStyle,
                j = b.itemHiddenStyle,
                k = b.padding,
                l = !e.rtl,
                m = e.width,
                q = e.itemMarginBottom || 0,
                n = b.itemMarginTop,
                o = b.initialItemX,
                t = a.legendItem,
                r = a.series || a,
                u = r.options,
                v = u.showCheckbox,
                x = e.useHTML;
            if (!t && (a.legendGroup = d.g("legend-item").attr({
                zIndex: 1
            }).add(b.scrollGroup), r.drawLegendSymbol(b, a), a.legendItem = t = d.text(e.labelFormatter.call(a), l ? g + h : -h, b.baseline, x).css(B(a.visible ? i : j)).attr({
                align: l ? "left" : "right",
                zIndex: 2
            }).add(a.legendGroup), (x ? t : a.legendGroup).on("mouseover", function () {
                a.setState("hover");
                t.css(b.options.itemHoverStyle)
            }).on("mouseout", function () {
                t.css(a.visible ? i : j);
                a.setState()
            }).on("click", function (b) {
                var c = function () {
                    a.setVisible()
                }, b = {
                    browserEvent: b
                };
                a.firePointEvent ? a.firePointEvent("legendItemClick", b, c) : F(a, "legendItemClick", b, c)
            }), b.colorizeItem(a, a.visible), u && v)) a.checkbox = T("input", {
                type: "checkbox",
                checked: a.selected,
                defaultChecked: a.selected
            }, e.itemCheckboxStyle, c.container),
            J(a.checkbox, "click", function (b) {
                F(a, "checkboxClick", {
                    checked: b.target.checked
                }, function () {
                    a.select()
                })
            });
            d = t.getBBox();
            p = a.legendItemWidth = e.itemWidth || g + h + d.width + k + (v ? 20 : 0), e = p;
            b.itemHeight = g = d.height;
            if (f && b.itemX - o + e > (m || c.chartWidth - 2 * k - o)) b.itemX = o, b.itemY += n + b.lastLineHeight + q, b.lastLineHeight = 0;
            b.maxItemWidth = s(b.maxItemWidth, e);
            b.lastItemY = n + b.itemY + q;
            b.lastLineHeight = s(g, b.lastLineHeight);
            a._legendItemPos = [b.itemX, b.itemY];
            f ? b.itemX += e : (b.itemY += n + g + q, b.lastLineHeight = g);
            b.offsetWidth = m || s(f ? b.itemX - o : e, b.offsetWidth)
        },
        render: function () {
            var a = this,
                b = a.chart,
                c = b.renderer,
                d = a.group,
                e, f, g, h, i = a.box,
                j = a.options,
                k = a.padding,
                l = j.borderWidth,
                m = j.backgroundColor;
            a.itemX = a.initialItemX;
            a.itemY = a.initialItemY;
            a.offsetWidth = 0;
            a.lastItemY = 0;
            if (!d) a.group = d = c.g("legend").attr({
                zIndex: 7
            }).add(), a.contentGroup = c.g().attr({
                zIndex: 1
            }).add(d), a.scrollGroup = c.g().add(a.contentGroup), a.clipRect = c.clipRect(0, 0, 9999, b.chartHeight), a.contentGroup.clip(a.clipRect);
            e = [];
            o(b.series, function (a) {
                var b = a.options;
                b.showInLegend && (e = e.concat(a.legendItems || (b.legendType === "point" ? a.data : a)))
            });
            Ib(e, function (a, b) {
                return (a.options && a.options.legendIndex || 0) - (b.options && b.options.legendIndex || 0)
            });
            j.reversed && e.reverse();
            a.allItems = e;
            a.display = f = !! e.length;
            o(e, function (b) {
                a.renderItem(b)
            });
            g = j.width || a.offsetWidth;
            h = a.lastItemY + a.lastLineHeight;
            h = a.handleOverflow(h);
            if (l || m) {
                g += k;
                h += k;
                if (i) {
                    if (g > 0 && h > 0) i[i.isNew ? "attr" : "animate"](i.crisp(null, null, null, g, h)), i.isNew = !1
                } else a.box = i = c.rect(0, 0, g, h, j.borderRadius,
                l || 0).attr({
                    stroke: j.borderColor,
                    "stroke-width": l || 0,
                    fill: m || Q
                }).add(d).shadow(j.shadow), i.isNew = !0;
                i[f ? "show" : "hide"]()
            }
            a.legendWidth = g;
            a.legendHeight = h;
            o(e, function (b) {
                a.positionItem(b)
            });
            f && d.align(x({
                width: g,
                height: h
            }, j), !0, b.spacingBox);
            b.isResizing || this.positionCheckboxes()
        },
        handleOverflow: function (a) {
            var b = this,
                c = this.chart,
                d = c.renderer,
                e = this.options,
                f = e.y,
                f = c.spacingBox.height + (e.verticalAlign === "top" ? -f : f) - this.padding,
                g = e.maxHeight,
                h = this.clipRect,
                i = e.navigation,
                j = n(i.animation, !0),
                k = i.arrowSize || 12,
                l = this.nav;
            e.layout === "horizontal" && (f /= 2);
            g && (f = O(f, g));
            if (a > f) {
                this.clipHeight = c = f - 20;
                this.pageCount = za(a / c);
                this.currentPage = n(this.currentPage, 1);
                this.fullHeight = a;
                h.attr({
                    height: c
                });
                if (!l) this.nav = l = d.g().attr({
                    zIndex: 1
                }).add(this.group), this.up = d.symbol("triangle", 0, 0, k, k).on("click", function () {
                    b.scroll(-1, j)
                }).add(l), this.pager = d.text("", 15, 10).css(i.style).add(l), this.down = d.symbol("triangle-down", 0, 0, k, k).on("click", function () {
                    b.scroll(1, j)
                }).add(l);
                b.scroll(0);
                a = f
            } else if (l) h.attr({
                height: c.chartHeight
            }),
            l.hide(), this.scrollGroup.attr({
                translateY: 1
            }), this.clipHeight = 0;
            return a
        },
        scroll: function (a, b) {
            var c = this.pageCount,
                d = this.currentPage + a,
                e = this.clipHeight,
                f = this.options.navigation,
                g = f.activeColor,
                h = f.inactiveColor,
                f = this.pager,
                i = this.padding;
            d > c && (d = c);
            if (d > 0) b !== A && xa(b, this.chart), this.nav.attr({
                translateX: i,
                translateY: e + 7,
                visibility: "visible"
            }), this.up.attr({
                fill: d === 1 ? h : g
            }).css({
                cursor: d === 1 ? "default" : "pointer"
            }), f.attr({
                text: d + "/" + this.pageCount
            }), this.down.attr({
                x: 18 + this.pager.getBBox().width,
                fill: d === c ? h : g
            }).css({
                cursor: d === c ? "default" : "pointer"
            }), e = -O(e * (d - 1), this.fullHeight - e + i) + 1, this.scrollGroup.animate({
                translateY: e
            }), f.attr({
                text: d + "/" + c
            }), this.currentPage = d, this.positionCheckboxes(e)
        }
    };
    sb.prototype = {
        init: function (a, b) {
            var c, d = a.series;
            a.series = null;
            c = B(N, a);
            c.series = a.series = d;
            var d = c.chart,
                e = d.margin,
                e = Y(e) ? e : [e, e, e, e];
            this.optionsMarginTop = n(d.marginTop, e[0]);
            this.optionsMarginRight = n(d.marginRight, e[1]);
            this.optionsMarginBottom = n(d.marginBottom, e[2]);
            this.optionsMarginLeft = n(d.marginLeft, e[3]);
            this.runChartClick = (e = d.events) && !! e.click;
            this.callback = b;
            this.isResizing = 0;
            this.options = c;
            this.axes = [];
            this.series = [];
            this.hasCartesianSeries = d.showAxes;
            var f;
            this.index = Ha.length;
            Ha.push(this);
            d.reflow !== !1 && J(this, "load", this.initReflow);
            if (e) for (f in e) J(this, f, e[f]);
            this.xAxis = [];
            this.yAxis = [];
            this.animation = V ? !1 : n(d.animation, !0);
            this.pointCount = 0;
            this.counters = new Hb;
            this.firstRender()
        },
        initSeries: function (a) {
            var b = this.options.chart,
                b = new $[a.type || b.type || b.defaultSeriesType];
            b.init(this, a);
            return b
        },
        addSeries: function (a, b, c) {
            var d, e = this;
            a && (xa(c, e), b = n(b, !0), F(e, "addSeries", {
                options: a
            }, function () {
                d = e.initSeries(a);
                e.isDirtyLegend = !0;
                b && e.redraw()
            }));
            return d
        },
        isInsidePlot: function (a, b, c) {
            var d = c ? b : a,
                a = c ? a : b;
            return d >= 0 && d <= this.plotWidth && a >= 0 && a <= this.plotHeight
        },
        adjustTickAmounts: function () {
            this.options.chart.alignTicks !== !1 && o(this.axes, function (a) {
                a.adjustTickAmount()
            });
            this.maxTicks = null
        },
        redraw: function (a) {
            var b = this.axes,
                c = this.series,
                d = this.tracker,
                e = this.legend,
                f = this.isDirtyLegend,
                g, h = this.isDirtyBox,
                i = c.length,
                j = i,
                k = this.renderer,
                l = k.isHidden(),
                m = [];
            xa(a, this);
            for (l && this.cloneRenderTo(); j--;) if (a = c[j], a.isDirty && a.options.stacking) {
                g = !0;
                break
            }
            if (g) for (j = i; j--;) if (a = c[j], a.options.stacking) a.isDirty = !0;
            o(c, function (a) {
                a.isDirty && a.options.legendType === "point" && (f = !0)
            });
            if (f && e.options.enabled) e.render(), this.isDirtyLegend = !1;
            if (this.hasCartesianSeries) {
                if (!this.isResizing) this.maxTicks = null, o(b, function (a) {
                    a.setScale()
                });
                this.adjustTickAmounts();
                this.getMargins();
                o(b, function (a) {
                    if (a.isDirtyExtremes) a.isDirtyExtremes = !1, m.push(function () {
                        F(a, "afterSetExtremes", a.getExtremes())
                    });
                    if (a.isDirty || h || g) a.redraw(), h = !0
                })
            }
            h && this.drawChartBox();
            o(c, function (a) {
                a.isDirty && a.visible && (!a.isCartesian || a.xAxis) && a.redraw()
            });
            d && d.resetTracker && d.resetTracker(!0);
            k.draw();
            F(this, "redraw");
            l && this.cloneRenderTo(!0);
            o(m, function (a) {
                a.call()
            })
        },
        showLoading: function (a) {
            var b = this.options,
                c = this.loadingDiv,
                d = b.loading;
            if (!c) this.loadingDiv = c = T(ga, {
                className: "highcharts-loading"
            },
            x(d.style, {
                left: this.plotLeft + "px",
                top: this.plotTop + "px",
                width: this.plotWidth + "px",
                height: this.plotHeight + "px",
                zIndex: 10,
                display: Q
            }), this.container), this.loadingSpan = T("span", null, d.labelStyle, c);
            this.loadingSpan.innerHTML = a || b.lang.loading;
            if (!this.loadingShown) I(c, {
                opacity: 0,
                display: ""
            }), xb(c, {
                opacity: d.style.opacity
            }, {
                duration: d.showDuration || 0
            }), this.loadingShown = !0
        },
        hideLoading: function () {
            var a = this.options,
                b = this.loadingDiv;
            b && xb(b, {
                opacity: 0
            }, {
                duration: a.loading.hideDuration || 100,
                complete: function () {
                    I(b, {
                        display: Q
                    })
                }
            });
            this.loadingShown = !1
        },
        get: function (a) {
            var b = this.axes,
                c = this.series,
                d, e;
            for (d = 0; d < b.length; d++) if (b[d].options.id === a) return b[d];
            for (d = 0; d < c.length; d++) if (c[d].options.id === a) return c[d];
            for (d = 0; d < c.length; d++) {
                e = c[d].points || [];
                for (b = 0; b < e.length; b++) if (e[b].id === a) return e[b]
            }
            return null
        },
        getAxes: function () {
            var a = this,
                b = this.options,
                c = b.xAxis || {}, b = b.yAxis || {}, c = la(c);
            o(c, function (a, b) {
                a.index = b;
                a.isX = !0
            });
            b = la(b);
            o(b, function (a, b) {
                a.index = b
            });
            c = c.concat(b);
            o(c, function (b) {
                new ob(a,
                b)
            });
            a.adjustTickAmounts()
        },
        getSelectedPoints: function () {
            var a = [];
            o(this.series, function (b) {
                a = a.concat(Ob(b.points, function (a) {
                    return a.selected
                }))
            });
            return a
        },
        getSelectedSeries: function () {
            return Ob(this.series, function (a) {
                return a.selected
            })
        },
        showResetZoom: function () {
            var a = this,
                b = N.lang,
                c = a.options.chart.resetZoomButton,
                d = c.theme,
                e = d.states,
                f = c.relativeTo === "chart" ? null : "plotBox";
            this.resetZoomButton = a.renderer.button(b.resetZoom, null, null, function () {
                a.zoomOut()
            }, d, e && e.hover).attr({
                align: c.position.align,
                title: b.resetZoomTitle
            }).add().align(c.position, !1, a[f]);
            this.resetZoomButton.alignTo = f
        },
        zoomOut: function () {
            var a = this,
                b = a.resetZoomButton;
            F(a, "selection", {
                resetSelection: !0
            }, function () {
                a.zoom()
            });
            if (b) a.resetZoomButton = b.destroy()
        },
        zoom: function (a) {
            var b = this,
                c;
            !a || a.resetSelection ? o(b.axes, function (a) {
                c = a.zoom()
            }) : o(a.xAxis.concat(a.yAxis), function (a) {
                var e = a.axis;
                if (b.tracker[e.isXAxis ? "zoomX" : "zoomY"]) c = e.zoom(a.min, a.max)
            });
            b.resetZoomButton || b.showResetZoom();
            c && b.redraw(n(b.options.chart.animation,
            b.pointCount < 100))
        },
        pan: function (a) {
            var b = this.xAxis[0],
                c = this.mouseDownX,
                d = b.pointRange / 2,
                e = b.getExtremes(),
                f = b.translate(c - a, !0) + d,
                c = b.translate(c + this.plotWidth - a, !0) - d;
            (d = this.hoverPoints) && o(d, function (a) {
                a.setState()
            });
            b.series.length && f > O(e.dataMin, e.min) && c < s(e.dataMax, e.max) && b.setExtremes(f, c, !0, !1, {
                trigger: "pan"
            });
            this.mouseDownX = a;
            I(this.container, {
                cursor: "move"
            })
        },
        setTitle: function (a, b) {
            var c = this,
                d = c.options,
                e;
            c.chartTitleOptions = e = B(d.title, a);
            c.chartSubtitleOptions = d = B(d.subtitle,
            b);
            o([
                ["title", a, e],
                ["subtitle", b, d]
            ], function (a) {
                var b = a[0],
                    d = c[b],
                    e = a[1],
                    a = a[2];
                d && e && (c[b] = d = d.destroy());
                a && a.text && !d && (c[b] = c.renderer.text(a.text, 0, 0, a.useHTML).attr({
                    align: a.align,
                    "class": "highcharts-" + b,
                    zIndex: a.zIndex || 4
                }).css(a.style).add().align(a, !1, c.spacingBox))
            })
        },
        getChartSize: function () {
            var a = this.options.chart,
                b = this.renderToClone || this.renderTo;
            this.containerWidth = eb(b, "width");
            this.containerHeight = eb(b, "height");
            this.chartWidth = s(0, n(a.width, this.containerWidth, 600));
            this.chartHeight = s(0, n(a.height, this.containerHeight > 19 ? this.containerHeight : 400))
        },
        cloneRenderTo: function (a) {
            var b = this.renderToClone,
                c = this.container;
            a ? b && (this.renderTo.appendChild(c), Na(b), delete this.renderToClone) : (c && this.renderTo.removeChild(c), this.renderToClone = b = this.renderTo.cloneNode(0), I(b, {
                position: "absolute",
                top: "-9999px",
                display: "block"
            }), C.body.appendChild(b), c && b.appendChild(c))
        },
        getContainer: function () {
            var a, b = this.options.chart,
                c, d, e;
            this.renderTo = a = b.renderTo;
            e = "highcharts-" + tb++;
            if (ja(a)) this.renderTo = a = C.getElementById(a);
            a || Oa(13, !0);
            c = z(w(a, "data-highcharts-chart"));
            !isNaN(c) && Ha[c] && Ha[c].destroy();
            w(a, "data-highcharts-chart", this.index);
            a.innerHTML = "";
            a.offsetWidth || this.cloneRenderTo();
            this.getChartSize();
            c = this.chartWidth;
            d = this.chartHeight;
            this.container = a = T(ga, {
                className: "highcharts-container" + (b.className ? " " + b.className : ""),
                id: e
            }, x({
                position: "relative",
                overflow: "hidden",
                width: c + "px",
                height: d + "px",
                textAlign: "left",
                lineHeight: "normal",
                zIndex: 0
            }, b.style), this.renderToClone || a);
            this.renderer = b.forExport ? new sa(a, c, d, !0) : new Sa(a, c, d);
            V && this.renderer.create(this, a, c, d)
        },
        getMargins: function () {
            var a = this.options.chart,
                b = a.spacingTop,
                c = a.spacingRight,
                d = a.spacingBottom,
                a = a.spacingLeft,
                e, f = this.legend,
                g = this.optionsMarginTop,
                h = this.optionsMarginLeft,
                i = this.optionsMarginRight,
                j = this.optionsMarginBottom,
                k = this.chartTitleOptions,
                l = this.chartSubtitleOptions,
                m = this.options.legend,
                q = n(m.margin, 10),
                p = m.x,
                y = m.y,
                t = m.align,
                u = m.verticalAlign;
            this.resetMargins();
            e = this.axisOffset;
            if ((this.title || this.subtitle) && !r(this.optionsMarginTop)) if (l = s(this.title && !k.floating && !k.verticalAlign && k.y || 0, this.subtitle && !l.floating && !l.verticalAlign && l.y || 0)) this.plotTop = s(this.plotTop, l + n(k.margin, 15) + b);
            if (f.display && !m.floating) if (t === "right") {
                if (!r(i)) this.marginRight = s(this.marginRight, f.legendWidth - p + q + c)
            } else if (t === "left") {
                if (!r(h)) this.plotLeft = s(this.plotLeft, f.legendWidth + p + q + a)
            } else if (u === "top") {
                if (!r(g)) this.plotTop = s(this.plotTop, f.legendHeight + y + q + b)
            } else if (u === "bottom" && !r(j)) this.marginBottom = s(this.marginBottom,
            f.legendHeight - y + q + d);
            this.extraBottomMargin && (this.marginBottom += this.extraBottomMargin);
            this.extraTopMargin && (this.plotTop += this.extraTopMargin);
            this.hasCartesianSeries && o(this.axes, function (a) {
                a.getOffset()
            });
            r(h) || (this.plotLeft += e[3]);
            r(g) || (this.plotTop += e[0]);
            r(j) || (this.marginBottom += e[2]);
            r(i) || (this.marginRight += e[1]);
            this.setChartSize()
        },
        initReflow: function () {
            function a(a) {
                var g = c.width || eb(d, "width"),
                    h = c.height || eb(d, "height"),
                    a = a ? a.target : L;
                if (!b.hasUserSize && g && h && (a === L || a === C)) {
                    if (g !== b.containerWidth || h !== b.containerHeight) clearTimeout(e), b.reflowTimeout = e = setTimeout(function () {
                        if (b.container) b.setSize(g, h, !1), b.hasUserSize = null
                    }, 100);
                    b.containerWidth = g;
                    b.containerHeight = h
                }
            }
            var b = this,
                c = b.options.chart,
                d = b.renderTo,
                e;
            J(L, "resize", a);
            J(b, "destroy", function () {
                R(L, "resize", a)
            })
        },
        setSize: function (a, b, c) {
            var d = this,
                e, f, g = d.resetZoomButton,
                h = d.title,
                i = d.subtitle,
                j;
            d.isResizing += 1;
            j = function () {
                d && F(d, "endResize", null, function () {
                    d.isResizing -= 1
                })
            };
            xa(c, d);
            d.oldChartHeight = d.chartHeight;
            d.oldChartWidth = d.chartWidth;
            if (r(a)) d.chartWidth = e = s(0, u(a)), d.hasUserSize = !! e;
            if (r(b)) d.chartHeight = f = s(0, u(b));
            I(d.container, {
                width: e + "px",
                height: f + "px"
            });
            d.renderer.setSize(e, f, c);
            d.plotWidth = e - d.plotLeft - d.marginRight;
            d.plotHeight = f - d.plotTop - d.marginBottom;
            d.maxTicks = null;
            o(d.axes, function (a) {
                a.isDirty = !0;
                a.setScale()
            });
            o(d.series, function (a) {
                a.isDirty = !0
            });
            d.isDirtyLegend = !0;
            d.isDirtyBox = !0;
            d.getMargins();
            a = d.spacingBox;
            h && h.align(null, null, a);
            i && i.align(null, null, a);
            g && g.align && g.align(null,
            null, d[g.alignTo]);
            d.redraw(c);
            d.oldChartHeight = null;
            F(d, "resize");
            Pa === !1 ? j() : setTimeout(j, Pa && Pa.duration || 500)
        },
        setChartSize: function () {
            var a = this.inverted,
                b = this.chartWidth,
                c = this.chartHeight,
                d = this.options.chart,
                e = d.spacingTop,
                f = d.spacingRight,
                g = d.spacingBottom,
                h = d.spacingLeft,
                i, j, k, l;
            this.plotLeft = i = u(this.plotLeft);
            this.plotTop = j = u(this.plotTop);
            this.plotWidth = k = s(0, u(b - i - this.marginRight));
            this.plotHeight = l = s(0, u(c - j - this.marginBottom));
            this.plotSizeX = a ? l : k;
            this.plotSizeY = a ? k : l;
            this.plotBorderWidth = a = d.plotBorderWidth || 0;
            this.spacingBox = {
                x: h,
                y: e,
                width: b - h - f,
                height: c - e - g
            };
            this.plotBox = {
                x: i,
                y: j,
                width: k,
                height: l
            };
            this.clipBox = {
                x: a / 2,
                y: a / 2,
                width: this.plotSizeX - a,
                height: this.plotSizeY - a
            };
            o(this.axes, function (a) {
                a.setAxisSize();
                a.setAxisTranslation()
            })
        },
        resetMargins: function () {
            var a = this.options.chart,
                b = a.spacingRight,
                c = a.spacingBottom,
                d = a.spacingLeft;
            this.plotTop = n(this.optionsMarginTop, a.spacingTop);
            this.marginRight = n(this.optionsMarginRight, b);
            this.marginBottom = n(this.optionsMarginBottom, c);
            this.plotLeft = n(this.optionsMarginLeft, d);
            this.axisOffset = [0, 0, 0, 0]
        },
        drawChartBox: function () {
            var a = this.options.chart,
                b = this.renderer,
                c = this.chartWidth,
                d = this.chartHeight,
                e = this.chartBackground,
                f = this.plotBackground,
                g = this.plotBorder,
                h = this.plotBGImage,
                i = a.borderWidth || 0,
                j = a.backgroundColor,
                k = a.plotBackgroundColor,
                l = a.plotBackgroundImage,
                m = a.plotBorderWidth || 0,
                n, p = this.plotLeft,
                o = this.plotTop,
                t = this.plotWidth,
                r = this.plotHeight,
                u = this.plotBox,
                v = this.clipRect,
                s = this.clipBox;
            n = i + (a.shadow ? 8 : 0);
            if (i || j) if (e) e.animate(e.crisp(null,
            null, null, c - n, d - n));
            else {
                e = {
                    fill: j || Q
                };
                if (i) e.stroke = a.borderColor, e["stroke-width"] = i;
                this.chartBackground = b.rect(n / 2, n / 2, c - n, d - n, a.borderRadius, i).attr(e).add().shadow(a.shadow)
            }
            if (k) f ? f.animate(u) : this.plotBackground = b.rect(p, o, t, r, 0).attr({
                fill: k
            }).add().shadow(a.plotShadow);
            if (l) h ? h.animate(u) : this.plotBGImage = b.image(l, p, o, t, r).add();
            v ? v.animate({
                width: s.width,
                height: s.height
            }) : this.clipRect = b.clipRect(s);
            if (m) g ? g.animate(g.crisp(null, p, o, t, r)) : this.plotBorder = b.rect(p, o, t, r, 0, m).attr({
                stroke: a.plotBorderColor,
                "stroke-width": m,
                zIndex: 1
            }).add();
            this.isDirtyBox = !1
        },
        propFromSeries: function () {
            var a = this,
                b = a.options.chart,
                c, d = a.options.series,
                e, f;
            o(["inverted", "angular", "polar"], function (g) {
                c = $[b.type || b.defaultSeriesType];
                f = a[g] || b[g] || c && c.prototype[g];
                for (e = d && d.length; !f && e--;)(c = $[d[e].type]) && c.prototype[g] && (f = !0);
                a[g] = f
            })
        },
        render: function () {
            var a = this,
                b = a.axes,
                c = a.renderer,
                d = a.options,
                e = d.labels,
                d = d.credits,
                f;
            a.setTitle();
            a.legend = new rb(a);
            o(b, function (a) {
                a.setScale()
            });
            a.getMargins();
            a.maxTicks = null;
            o(b, function (a) {
                a.setTickPositions(!0);
                a.setMaxTicks()
            });
            a.adjustTickAmounts();
            a.getMargins();
            a.drawChartBox();
            a.hasCartesianSeries && o(b, function (a) {
                a.render()
            });
            if (!a.seriesGroup) a.seriesGroup = c.g("series-group").attr({
                zIndex: 3
            }).add();
            o(a.series, function (a) {
                a.translate();
                a.setTooltipPoints();
                a.render()
            });
            e.items && o(e.items, function (b) {
                var d = x(e.style, b.style),
                    f = z(d.left) + a.plotLeft,
                    j = z(d.top) + a.plotTop + 12;
                delete d.left;
                delete d.top;
                c.text(b.html, f, j).attr({
                    zIndex: 2
                }).css(d).add()
            });
            if (d.enabled && !a.credits) f = d.href, a.credits = c.text(d.text, 0, 0).on("click", function () {
                if (f) location.href = f
            }).attr({
                align: d.position.align,
                zIndex: 8
            }).css(d.style).add().align(d.position);
            a.hasRendered = !0
        },
        destroy: function () {
            var a = this,
                b = a.axes,
                c = a.series,
                d = a.container,
                e, f = d && d.parentNode;
            F(a, "destroy");
            Ha[a.index] = A;
            a.renderTo.removeAttribute("data-highcharts-chart");
            R(a);
            for (e = b.length; e--;) b[e] = b[e].destroy();
            for (e = c.length; e--;) c[e] = c[e].destroy();
            o("title,subtitle,chartBackground,plotBackground,plotBGImage,plotBorder,seriesGroup,clipRect,credits,tracker,scroller,rangeSelector,legend,resetZoomButton,tooltip,renderer".split(","),

            function (b) {
                var c = a[b];
                c && c.destroy && (a[b] = c.destroy())
            });
            if (d) d.innerHTML = "", R(d), f && Na(d);
            for (e in a) delete a[e]
        },
        isReadyToRender: function () {
            var a = this;
            return !ca && L == L.top && C.readyState !== "complete" || V && !L.canvg ? (V ? Rb.push(function () {
                a.firstRender()
            }, a.options.global.canvasToolsURL) : C.attachEvent("onreadystatechange", function () {
                C.detachEvent("onreadystatechange", a.firstRender);
                C.readyState === "complete" && a.firstRender()
            }), !1) : !0
        },
        firstRender: function () {
            var a = this,
                b = a.options,
                c = a.callback;
            if (a.isReadyToRender()) {
                a.getContainer();
                F(a, "init");
                if (Highcharts.RangeSelector && b.rangeSelector.enabled) a.rangeSelector = new Highcharts.RangeSelector(a);
                a.resetMargins();
                a.setChartSize();
                a.propFromSeries();
                a.getAxes();
                o(b.series || [], function (b) {
                    a.initSeries(b)
                });
                if (Highcharts.Scroller && (b.navigator.enabled || b.scrollbar.enabled)) a.scroller = new Highcharts.Scroller(a);
                a.tracker = new qb(a, b);
                a.render();
                a.renderer.draw();
                c && c.apply(a, [a]);
                o(a.callbacks, function (b) {
                    b.apply(a, [a])
                });
                a.cloneRenderTo(!0);
                F(a, "load")
            }
        }
    };
    sb.prototype.callbacks = [];
    var Ua = function () {};
    Ua.prototype = {
        init: function (a, b, c) {
            var d = a.chart.counters;
            this.series = a;
            this.applyOptions(b, c);
            this.pointAttr = {};
            if (a.options.colorByPoint) b = a.chart.options.colors, this.color = this.color || b[d.color++], d.wrapColor(b.length);
            a.chart.pointCount++;
            return this
        },
        applyOptions: function (a, b) {
            var c = this.series,
                d = typeof a;
            this.config = a;
            if (d === "number" || a === null) this.y = a;
            else if (typeof a[0] === "number") this.x = a[0], this.y = a[1];
            else if (d === "object" && typeof a.length !== "number") {
                x(this, a);
                this.options = a;
                if (a.dataLabels) c._hasPointLabels = !0;
                if (a.marker) c._hasPointMarkers = !0
            } else if (typeof a[0] === "string") this.name = a[0], this.y = a[1];
            if (this.x === A) this.x = b === A ? c.autoIncrement() : b
        },
        destroy: function () {
            var a = this.series.chart,
                b = a.hoverPoints,
                c;
            a.pointCount--;
            if (b && (this.setState(), ta(b, this), !b.length)) a.hoverPoints = null;
            if (this === a.hoverPoint) this.onMouseOut();
            if (this.graphic || this.dataLabel) R(this), this.destroyElements();
            this.legendItem && a.legend.destroyItem(this);
            for (c in this) this[c] = null
        },
        destroyElements: function () {
            for (var a =
                "graphic,tracker,dataLabel,dataLabelUpper,group,connector,shadowGroup".split(","), b, c = 6; c--;) b = a[c], this[b] && (this[b] = this[b].destroy())
        },
        getLabelConfig: function () {
            return {
                x: this.category,
                y: this.y,
                key: this.name || this.category,
                series: this.series,
                point: this,
                percentage: this.percentage,
                total: this.total || this.stackTotal
            }
        },
        select: function (a, b) {
            var c = this,
                d = c.series.chart,
                a = n(a, !c.selected);
            c.firePointEvent(a ? "select" : "unselect", {
                accumulate: b
            }, function () {
                c.selected = a;
                c.setState(a && "select");
                b || o(d.getSelectedPoints(),

                function (a) {
                    if (a.selected && a !== c) a.selected = !1, a.setState(""), a.firePointEvent("unselect")
                })
            })
        },
        onMouseOver: function () {
            var a = this.series,
                b = a.chart,
                c = b.tooltip,
                d = b.hoverPoint;
            if (d && d !== this) d.onMouseOut();
            this.firePointEvent("mouseOver");
            c && (!c.shared || a.noSharedTooltip) && c.refresh(this);
            this.setState("hover");
            b.hoverPoint = this
        },
        onMouseOut: function () {
            var a = this.series.chart,
                b = a.hoverPoints;
            if (!b || Ub(this, b) === -1) this.firePointEvent("mouseOut"), this.setState(), a.hoverPoint = null
        },
        tooltipFormatter: function (a) {
            var b = this.series,
                c = b.tooltipOptions,
                d = a.match(/\{(series|point)\.[a-zA-Z]+\}/g),
                e = /[{\.}]/,
                f, g, h, i, j = {
                    y: 0,
                    open: 0,
                    high: 0,
                    low: 0,
                    close: 0,
                    percentage: 1,
                    total: 1
                };
            c.valuePrefix = c.valuePrefix || c.yPrefix;
            c.valueDecimals = n(c.valueDecimals, c.yDecimals);
            c.valueSuffix = c.valueSuffix || c.ySuffix;
            for (i in d) g = d[i], ja(g) && g !== a && (h = (" " + g).split(e), f = {
                point: this,
                series: b
            }[h[1]], h = h[2], f === this && j.hasOwnProperty(h) ? (f = j[h] ? h : "value", f = (c[f + "Prefix"] || "") + Ja(this[h], n(c[f + "Decimals"], -1)) + (c[f + "Suffix"] || "")) : f = f[h], a = a.replace(g,
            f));
            return a
        },
        update: function (a, b, c) {
            var d = this,
                e = d.series,
                f = d.graphic,
                g, h = e.data,
                i = h.length,
                j = e.chart,
                b = n(b, !0);
            d.firePointEvent("update", {
                options: a
            }, function () {
                d.applyOptions(a);
                Y(a) && (e.getAttribs(), f && f.attr(d.pointAttr[e.state]));
                for (g = 0; g < i; g++) if (h[g] === d) {
                    e.xData[g] = d.x;
                    e.yData[g] = d.toYData ? d.toYData() : d.y;
                    e.options.data[g] = a;
                    break
                }
                e.isDirty = !0;
                e.isDirtyData = !0;
                b && j.redraw(c)
            })
        },
        remove: function (a, b) {
            var c = this,
                d = c.series,
                e = d.chart,
                f, g = d.data,
                h = g.length;
            xa(b, e);
            a = n(a, !0);
            c.firePointEvent("remove",
            null, function () {
                for (f = 0; f < h; f++) if (g[f] === c) {
                    g.splice(f, 1);
                    d.options.data.splice(f, 1);
                    d.xData.splice(f, 1);
                    d.yData.splice(f, 1);
                    break
                }
                c.destroy();
                d.isDirty = !0;
                d.isDirtyData = !0;
                a && e.redraw()
            })
        },
        firePointEvent: function (a, b, c) {
            var d = this,
                e = this.series.options;
            (e.point.events[a] || d.options && d.options.events && d.options.events[a]) && this.importEvents();
            a === "click" && e.allowPointSelect && (c = function (a) {
                d.select(null, a.ctrlKey || a.metaKey || a.shiftKey)
            });
            F(this, a, b, c)
        },
        importEvents: function () {
            if (!this.hasImportedEvents) {
                var a = B(this.series.options.point, this.options).events,
                    b;
                this.events = a;
                for (b in a) J(this, b, a[b]);
                this.hasImportedEvents = !0
            }
        },
        setState: function (a) {
            var b = this.plotX,
                c = this.plotY,
                d = this.series,
                e = d.options.states,
                f = X[d.type].marker && d.options.marker,
                g = f && !f.enabled,
                h = f && f.states[a],
                i = h && h.enabled === !1,
                j = d.stateMarkerGraphic,
                k = d.chart,
                l = this.pointAttr,
                a = a || "";
            if (!(a === this.state || this.selected && a !== "select" || e[a] && e[a].enabled === !1 || a && (i || g && !h.enabled))) {
                if (this.graphic) e = f && this.graphic.symbolName && l[a].r,
                this.graphic.attr(B(l[a], e ? {
                    x: b - e,
                    y: c - e,
                    width: 2 * e,
                    height: 2 * e
                } : {}));
                else {
                    if (a && h) e = h.radius, j ? j.attr({
                        x: b - e,
                        y: c - e
                    }) : d.stateMarkerGraphic = j = k.renderer.symbol(d.symbol, b - e, c - e, 2 * e, 2 * e).attr(l[a]).add(d.markerGroup);
                    if (j) j[a && k.isInsidePlot(b, c) ? "show" : "hide"]()
                }
                this.state = a
            }
        }
    };
    var P = function () {};
    P.prototype = {
        isCartesian: !0,
        type: "line",
        pointClass: Ua,
        sorted: !0,
        requireSorting: !0,
        pointAttrToOptions: {
            stroke: "lineColor",
            "stroke-width": "lineWidth",
            fill: "fillColor",
            r: "radius"
        },
        init: function (a, b) {
            var c, d;
            this.chart = a;
            this.options = b = this.setOptions(b);
            this.bindAxes();
            x(this, {
                name: b.name,
                state: "",
                pointAttr: {},
                visible: b.visible !== !1,
                selected: b.selected === !0
            });
            if (V) b.animation = !1;
            d = b.events;
            for (c in d) J(this, c, d[c]);
            if (d && d.click || b.point && b.point.events && b.point.events.click || b.allowPointSelect) a.runTrackerClick = !0;
            this.getColor();
            this.getSymbol();
            this.setData(b.data, !1);
            if (this.isCartesian) a.hasCartesianSeries = !0;
            a.series.push(this);
            Ib(a.series, function (a, b) {
                return (a.options.index || 0) - (b.options.index || 0)
            });
            o(a.series,

            function (a, b) {
                a.index = b;
                a.name = a.name || "Series " + (b + 1)
            })
        },
        bindAxes: function () {
            var a = this,
                b = a.options,
                c = a.chart,
                d;
            a.isCartesian && o(["xAxis", "yAxis"], function (e) {
                o(c[e], function (c) {
                    d = c.options;
                    if (b[e] === d.index || b[e] === A && d.index === 0) c.series.push(a), a[e] = c, c.isDirty = !0
                })
            })
        },
        autoIncrement: function () {
            var a = this.options,
                b = this.xIncrement,
                b = n(b, a.pointStart, 0);
            this.pointInterval = n(this.pointInterval, a.pointInterval, 1);
            this.xIncrement = b + this.pointInterval;
            return b
        },
        getSegments: function () {
            var a = -1,
                b = [],
                c, d = this.points,
                e = d.length;
            if (e) if (this.options.connectNulls) {
                for (c = e; c--;) d[c].y === null && d.splice(c, 1);
                d.length && (b = [d])
            } else o(d, function (c, g) {
                c.y === null ? (g > a + 1 && b.push(d.slice(a + 1, g)), a = g) : g === e - 1 && b.push(d.slice(a + 1, g + 1))
            });
            this.segments = b
        },
        setOptions: function (a) {
            var b = this.chart.options,
                c = b.plotOptions,
                d = c[this.type],
                e = a.data;
            a.data = null;
            c = B(d, c.series, a);
            c.data = a.data = e;
            this.tooltipOptions = B(b.tooltip, c.tooltip);
            d.marker === null && delete c.marker;
            return c
        },
        getColor: function () {
            var a = this.options,
                b = this.chart.options.colors,
                c = this.chart.counters;
            this.color = a.color || !a.colorByPoint && b[c.color++] || "gray";
            c.wrapColor(b.length)
        },
        getSymbol: function () {
            var a = this.options.marker,
                b = this.chart,
                c = b.options.symbols,
                b = b.counters;
            this.symbol = a.symbol || c[b.symbol++];
            if (/^url/.test(this.symbol)) a.radius = 0;
            b.wrapSymbol(c.length)
        },
        drawLegendSymbol: function (a) {
            var b = this.options,
                c = b.marker,
                d = a.options.symbolWidth,
                e = this.chart.renderer,
                f = this.legendGroup,
                a = a.baseline,
                g;
            if (b.lineWidth) {
                g = {
                    "stroke-width": b.lineWidth
                };
                if (b.dashStyle) g.dashstyle = b.dashStyle;
                this.legendLine = e.path(["M", 0, a - 4, "L", d, a - 4]).attr(g).add(f)
            }
            if (c && c.enabled) b = c.radius, this.legendSymbol = e.symbol(this.symbol, d / 2 - b, a - 4 - b, 2 * b, 2 * b).add(f)
        },
        addPoint: function (a, b, c, d) {
            var e = this.options,
                f = this.data,
                g = this.graph,
                h = this.area,
                i = this.chart,
                j = this.xData,
                k = this.yData,
                l = g && g.shift || 0,
                m = e.data,
                q = this.pointClass.prototype;
            xa(d, i);
            if (g && c) g.shift = l + 1;
            if (h) {
                if (c) h.shift = l + 1;
                h.isArea = !0
            }
            b = n(b, !0);
            d = {
                series: this
            };
            q.applyOptions.apply(d, [a]);
            j.push(d.x);
            k.push(q.toYData ? q.toYData.call(d) : d.y);
            m.push(a);
            e.legendType === "point" && this.generatePoints();
            c && (f[0] && f[0].remove ? f[0].remove(!1) : (f.shift(), j.shift(), k.shift(), m.shift()));
            this.getAttribs();
            this.isDirtyData = this.isDirty = !0;
            b && i.redraw()
        },
        setData: function (a, b) {
            var c = this.points,
                d = this.options,
                e = this.initialColor,
                f = this.chart,
                g = null,
                h = this.xAxis,
                i, j = this.pointClass.prototype;
            this.xIncrement = null;
            this.pointRange = h && h.categories ? 1 : d.pointRange;
            if (r(e)) f.counters.color = e;
            var e = [],
                k = [],
                l = a ? a.length : [],
                m = (i = this.pointArrayMap) && i.length;
            if (l > (d.turboThreshold || 1E3)) {
                for (i = 0; g === null && i < l;) g = a[i], i++;
                if (Da(g)) {
                    j = n(d.pointStart, 0);
                    d = n(d.pointInterval, 1);
                    for (i = 0; i < l; i++) e[i] = j, k[i] = a[i], j += d;
                    this.xIncrement = j
                } else if (Ia(g)) if (m) for (i = 0; i < l; i++) d = a[i], e[i] = d[0], k[i] = d.slice(1, m + 1);
                else for (i = 0; i < l; i++) d = a[i], e[i] = d[0], k[i] = d[1]
            } else for (i = 0; i < l; i++) d = {
                series: this
            }, j.applyOptions.apply(d, [a[i]]), e[i] = d.x, k[i] = j.toYData ? j.toYData.call(d) : d.y;
            this.requireSorting && e.length > 1 && e[1] < e[0] && Oa(15);
            ja(k[0]) && Oa(14, !0);
            this.data = [];
            this.options.data = a;
            this.xData = e;
            this.yData = k;
            for (i = c && c.length || 0; i--;) c[i] && c[i].destroy && c[i].destroy();
            if (h) h.minRange = h.userMinRange;
            this.isDirty = this.isDirtyData = f.isDirtyBox = !0;
            n(b, !0) && f.redraw(!1)
        },
        remove: function (a, b) {
            var c = this,
                d = c.chart,
                a = n(a, !0);
            if (!c.isRemoving) c.isRemoving = !0, F(c, "remove", null, function () {
                c.destroy();
                d.isDirtyLegend = d.isDirtyBox = !0;
                a && d.redraw(b)
            });
            c.isRemoving = !1
        },
        processData: function (a) {
            var b = this.xData,
                c = this.yData,
                d = b.length,
                e = 0,
                f = d,
                g, h, i = this.xAxis,
                j = this.options,
                k = j.cropThreshold,
                l = this.isCartesian;
            if (l && !this.isDirty && !i.isDirty && !this.yAxis.isDirty && !a) return !1;
            if (l && this.sorted && (!k || d > k || this.forceCrop)) if (a = i.getExtremes(), i = a.min, k = a.max, b[d - 1] < i || b[0] > k) b = [], c = [];
            else if (b[0] < i || b[d - 1] > k) {
                for (a = 0; a < d; a++) if (b[a] >= i) {
                    e = s(0, a - 1);
                    break
                }
                for (; a < d; a++) if (b[a] > k) {
                    f = a + 1;
                    break
                }
                b = b.slice(e, f);
                c = c.slice(e, f);
                g = !0
            }
            for (a = b.length - 1; a > 0; a--) if (d = b[a] - b[a - 1], d > 0 && (h === A || d < h)) h = d;
            this.cropped = g;
            this.cropStart = e;
            this.processedXData = b;
            this.processedYData = c;
            if (j.pointRange === null) this.pointRange = h || 1;
            this.closestPointRange = h
        },
        generatePoints: function () {
            var a = this.options.data,
                b = this.data,
                c, d = this.processedXData,
                e = this.processedYData,
                f = this.pointClass,
                g = d.length,
                h = this.cropStart || 0,
                i, j = this.hasGroupedData,
                k, l = [],
                m;
            if (!b && !j) b = [], b.length = a.length, b = this.data = b;
            for (m = 0; m < g; m++) i = h + m, j ? l[m] = (new f).init(this, [d[m]].concat(la(e[m]))) : (b[i] ? k = b[i] : a[i] !== A && (b[i] = k = (new f).init(this, a[i], d[m])), l[m] = k);
            if (b && (g !== (c = b.length) || j)) for (m = 0; m < c; m++) if (m === h && !j && (m += g), b[m]) b[m].destroyElements(),
            b[m].plotX = A;
            this.data = b;
            this.points = l
        },
        translate: function () {
            this.processedXData || this.processData();
            this.generatePoints();
            for (var a = this.chart, b = this.options, c = b.stacking, d = this.xAxis, e = d.categories, f = this.yAxis, g = this.points, h = g.length, i = !! this.modifyValue, j, k = f.series, l = k.length, m = b.pointPlacement === "between"; l--;) if (k[l].visible) {
                k[l] === this && (j = !0);
                break
            }
            for (l = 0; l < h; l++) {
                var k = g[l],
                    q = k.x,
                    p = k.y,
                    o = k.low,
                    t = f.stacks[(p < b.threshold ? "-" : "") + this.stackKey];
                k.plotX = d.translate(q, 0, 0, 0, 1, m);
                if (c && this.visible && t && t[q]) o = t[q], q = o.total, o.cum = o = o.cum - p, p = o + p, j && (o = n(b.threshold, f.min)), f.isLog && o <= 0 && (o = null), c === "percent" && (o = q ? o * 100 / q : 0, p = q ? p * 100 / q : 0), k.percentage = q ? k.y * 100 / q : 0, k.total = k.stackTotal = q, k.stackY = p;
                k.yBottom = r(o) ? f.translate(o, 0, 1, 0, 1) : null;
                i && (p = this.modifyValue(p, k));
                k.plotY = typeof p === "number" ? u(f.translate(p, 0, 1, 0, 1) * 10) / 10 : A;
                k.clientX = a.inverted ? a.plotHeight - k.plotX : k.plotX;
                k.category = e && e[k.x] !== A ? e[k.x] : k.x
            }
            this.getSegments()
        },
        setTooltipPoints: function (a) {
            var b = [],
                c, d, e = (c = this.xAxis) ? c.tooltipLen || c.len : this.chart.plotSizeX,
                f = c && c.tooltipPosName || "plotX",
                g, h, i = [];
            if (this.options.enableMouseTracking !== !1) {
                if (a) this.tooltipPoints = null;
                o(this.segments || this.points, function (a) {
                    b = b.concat(a)
                });
                c && c.reversed && (b = b.reverse());
                a = b.length;
                for (h = 0; h < a; h++) {
                    g = b[h];
                    c = b[h - 1] ? d + 1 : 0;
                    for (d = b[h + 1] ? s(0, U((g[f] + (b[h + 1] ? b[h + 1][f] : e)) / 2)) : e; c >= 0 && c <= d;) i[c++] = g
                }
                this.tooltipPoints = i
            }
        },
        tooltipHeaderFormatter: function (a) {
            var b = this.tooltipOptions,
                c = b.xDateFormat,
                d = this.xAxis,
                e = d && d.options.type === "datetime",
                f;
            if (e && !c) for (f in D) if (D[f] >= d.closestPointRange) {
                c = b.dateTimeLabelFormats[f];
                break
            }
            return b.headerFormat.replace("{point.key}", e && Da(a) ? db(c, a) : a).replace("{series.name}", this.name).replace("{series.color}", this.color)
        },
        onMouseOver: function () {
            var a = this.chart,
                b = a.hoverSeries;
            if (b && b !== this) b.onMouseOut();
            this.options.events.mouseOver && F(this, "mouseOver");
            this.setState("hover");
            a.hoverSeries = this
        },
        onMouseOut: function () {
            var a = this.options,
                b = this.chart,
                c = b.tooltip,
                d = b.hoverPoint;
            if (d) d.onMouseOut();
            this && a.events.mouseOut && F(this, "mouseOut");
            c && !a.stickyTracking && !c.shared && c.hide();
            this.setState();
            b.hoverSeries = null
        },
        animate: function (a) {
            var b = this,
                c = b.chart,
                d = c.renderer,
                e;
            e = b.options.animation;
            var f = c.clipBox,
                g = c.inverted,
                h;
            if (e && !Y(e)) e = X[b.type].animation;
            h = "_sharedClip" + e.duration + e.easing;
            if (a) a = c[h], e = c[h + "m"], a || (c[h] = a = d.clipRect(x(f, {
                width: 0
            })), c[h + "m"] = e = d.clipRect(-99, g ? -c.plotLeft : -c.plotTop, 99, g ? c.chartWidth : c.chartHeight)), b.group.clip(a), b.markerGroup.clip(e), b.sharedClipKey = h;
            else {
                if (a = c[h]) a.animate({
                    width: c.plotSizeX
                }, e), c[h + "m"].animate({
                    width: c.plotSizeX + 99
                }, e);
                b.animate = null;
                b.animationTimeout = setTimeout(function () {
                    b.afterAnimate()
                }, e.duration)
            }
        },
        afterAnimate: function () {
            var a = this.chart,
                b = this.sharedClipKey,
                c = this.group,
                d = this.trackerGroup;
            c && this.options.clip !== !1 && (c.clip(a.clipRect), d && d.clip(a.clipRect), this.markerGroup.clip());
            setTimeout(function () {
                b && a[b] && (a[b] = a[b].destroy(), a[b + "m"] = a[b + "m"].destroy())
            }, 100)
        },
        drawPoints: function () {
            var a, b = this.points,
                c = this.chart,
                d, e, f, g, h, i, j, k, l = this.options.marker,
                m, o = this.markerGroup;
            if (l.enabled || this._hasPointMarkers) for (f = b.length; f--;) if (g = b[f], d = g.plotX, e = g.plotY, k = g.graphic, i = g.marker || {}, a = l.enabled && i.enabled === A || i.enabled, m = c.isInsidePlot(d, e, c.inverted), a && e !== A && !isNaN(e)) if (a = g.pointAttr[g.selected ? "select" : ""], h = a.r, i = n(i.symbol, this.symbol), j = i.indexOf("url") === 0, k) k.attr({
                visibility: m ? ca ? "inherit" : "visible" : "hidden"
            }).animate(x({
                x: d - h,
                y: e - h
            }, k.symbolName ? {
                width: 2 * h,
                height: 2 * h
            } : {}));
            else {
                if (m && (h > 0 || j)) g.graphic = c.renderer.symbol(i, d - h, e - h, 2 * h, 2 * h).attr(a).add(o)
            } else if (k) g.graphic = k.destroy()
        },
        convertAttribs: function (a, b, c, d) {
            var e = this.pointAttrToOptions,
                f, g, h = {}, a = a || {}, b = b || {}, c = c || {}, d = d || {};
            for (f in e) g = e[f], h[f] = n(a[g], b[f], c[f], d[f]);
            return h
        },
        getAttribs: function () {
            var a = this,
                b = X[a.type].marker ? a.options.marker : a.options,
                c = b.states,
                d = c.hover,
                e, f = a.color,
                g = {
                    stroke: f,
                    fill: f
                }, h = a.points || [],
                i = [],
                j, k = a.pointAttrToOptions,
                l;
            a.options.marker ? (d.radius = d.radius || b.radius + 2, d.lineWidth = d.lineWidth || b.lineWidth + 1) : d.color = d.color || qa(d.color || f).brighten(d.brightness).get();
            i[""] = a.convertAttribs(b, g);
            o(["hover", "select"], function (b) {
                i[b] = a.convertAttribs(c[b], i[""])
            });
            a.pointAttr = i;
            for (f = h.length; f--;) {
                g = h[f];
                if ((b = g.options && g.options.marker || g.options) && b.enabled === !1) b.radius = 0;
                e = a.options.colorByPoint;
                if (g.options) for (l in k) r(b[k[l]]) && (e = !0);
                if (e) {
                    b = b || {};
                    j = [];
                    c = b.states || {};
                    e = c.hover = c.hover || {};
                    if (!a.options.marker) e.color = qa(e.color || g.color).brighten(e.brightness || d.brightness).get();
                    j[""] = a.convertAttribs(x({
                        color: g.color
                    }, b), i[""]);
                    j.hover = a.convertAttribs(c.hover, i.hover, j[""]);
                    j.select = a.convertAttribs(c.select, i.select, j[""])
                } else j = i;
                g.pointAttr = j
            }
        },
        destroy: function () {
            var a = this,
                b = a.chart,
                c = /AppleWebKit\/533/.test(na),
                d, e, f = a.data || [],
                g, h, i;
            F(a, "destroy");
            R(a);
            o(["xAxis", "yAxis"], function (b) {
                if (i = a[b]) ta(i.series, a), i.isDirty = !0
            });
            a.legendItem && a.chart.legend.destroyItem(a);
            for (e = f.length; e--;)(g = f[e]) && g.destroy && g.destroy();
            a.points = null;
            clearTimeout(a.animationTimeout);
            o("area,graph,dataLabelsGroup,group,markerGroup,tracker,trackerGroup".split(","), function (b) {
                a[b] && (d = c && b === "group" ? "hide" : "destroy", a[b][d]())
            });
            if (b.hoverSeries === a) b.hoverSeries = null;
            ta(b.series, a);
            for (h in a) delete a[h]
        },
        drawDataLabels: function () {
            var a = this,
                b = a.options.dataLabels,
                c = a.points,
                d, e, f, g;
            if (b.enabled || a._hasPointLabels) a.dlProcessOptions && a.dlProcessOptions(b), g = a.plotGroup("dataLabelsGroup", "data-labels", a.visible ? "visible" : "hidden", b.zIndex || 6), e = b, o(c, function (c) {
                var i, j = c.dataLabel,
                    k, l = !0;
                d = c.options && c.options.dataLabels;
                i = e.enabled || d && d.enabled;
                if (j && !i) c.dataLabel = j.destroy();
                else if (i) {
                    i = b.rotation;
                    b = B(e, d);
                    f = b.formatter.call(c.getLabelConfig(), b);
                    b.style.color = n(b.color, b.style.color, a.color, "black");
                    if (j) j.attr({
                        text: f
                    }), l = !1;
                    else if (r(f)) {
                        j = {
                            fill: b.backgroundColor,
                            stroke: b.borderColor,
                            "stroke-width": b.borderWidth,
                            r: b.borderRadius || 0,
                            rotation: i,
                            padding: b.padding,
                            zIndex: 1
                        };
                        for (k in j) j[k] === A && delete j[k];
                        j = c.dataLabel = a.chart.renderer[i ? "text" : "label"](f, 0, -999, null,
                        null, null, b.useHTML).attr(j).css(b.style).add(g).shadow(b.shadow)
                    }
                    j && a.alignDataLabel(c, j, b, null, l)
                }
            })
        },
        alignDataLabel: function (a, b, c, d, e) {
            var f = this.chart,
                g = f.inverted,
                h = n(a.plotX, -999),
                a = n(a.plotY, -999),
                i = b.getBBox(),
                d = x({
                    x: g ? f.plotWidth - a : h,
                    y: u(g ? f.plotHeight - h : a),
                    width: 0,
                    height: 0
                }, d);
            x(c, {
                width: i.width,
                height: i.height
            });
            c.rotation ? (d = {
                align: c.align,
                x: d.x + c.x + d.width / 2,
                y: d.y + c.y + d.height / 2
            }, b[e ? "attr" : "animate"](d)) : (b.align(c, null, d), d = b.alignAttr);
            b.attr({
                visibility: c.crop === !1 || f.isInsidePlot(d.x,
                d.y) || f.isInsidePlot(h, a, g) ? f.renderer.isSVG ? "inherit" : "visible" : "hidden"
            })
        },
        getSegmentPath: function (a) {
            var b = this,
                c = [],
                d = b.options.step;
            o(a, function (e, f) {
                var g = e.plotX,
                    h = e.plotY,
                    i;
                b.getPointSpline ? c.push.apply(c, b.getPointSpline(a, e, f)) : (c.push(f ? "L" : "M"), d && f && (i = a[f - 1], d === "right" ? c.push(i.plotX, h) : d === "center" ? c.push((i.plotX + g) / 2, i.plotY, (i.plotX + g) / 2, h) : c.push(g, i.plotY)), c.push(e.plotX, e.plotY))
            });
            return c
        },
        getGraphPath: function () {
            var a = this,
                b = [],
                c, d = [];
            o(a.segments, function (e) {
                c = a.getSegmentPath(e);
                e.length > 1 ? b = b.concat(c) : d.push(e[0])
            });
            a.singlePoints = d;
            return a.graphPath = b
        },
        drawGraph: function () {
            var a = this.options,
                b = this.graph,
                c = this.group,
                d = a.lineColor || this.color,
                e = a.lineWidth,
                f = a.dashStyle,
                g = this.getGraphPath();
            if (b) fb(b), b.animate({
                d: g
            });
            else if (e) {
                b = {
                    stroke: d,
                    "stroke-width": e,
                    zIndex: 1
                };
                if (f) b.dashstyle = f;
                this.graph = this.chart.renderer.path(g).attr(b).add(c).shadow(a.shadow)
            }
        },
        invertGroups: function () {
            function a() {
                var a = {
                    width: b.yAxis.len,
                    height: b.xAxis.len
                };
                o(["group", "trackerGroup", "markerGroup"],

                function (c) {
                    b[c] && b[c].attr(a).invert()
                })
            }
            var b = this,
                c = b.chart;
            J(c, "resize", a);
            J(b, "destroy", function () {
                R(c, "resize", a)
            });
            a();
            b.invertGroups = a
        },
        plotGroup: function (a, b, c, d, e) {
            var f = this[a],
                g = this.chart,
                h = this.xAxis,
                i = this.yAxis;
            f || (this[a] = f = g.renderer.g(b).attr({
                visibility: c,
                zIndex: d || 0.1
            }).add(e));
            f.translate(h ? h.left : g.plotLeft, i ? i.top : g.plotTop);
            return f
        },
        render: function () {
            var a = this.chart,
                b, c = this.options,
                d = c.animation && !! this.animate,
                e = this.visible ? "visible" : "hidden",
                f = c.zIndex,
                g = this.hasRendered,
                h = a.seriesGroup;
            b = this.plotGroup("group", "series", e, f, h);
            this.markerGroup = this.plotGroup("markerGroup", "markers", e, f, h);
            d && this.animate(!0);
            this.getAttribs();
            b.inverted = a.inverted;
            this.drawGraph && this.drawGraph();
            this.drawPoints();
            this.drawDataLabels();
            this.options.enableMouseTracking !== !1 && this.drawTracker();
            a.inverted && this.invertGroups();
            c.clip !== !1 && !this.sharedClipKey && !g && (b.clip(a.clipRect), this.trackerGroup && this.trackerGroup.clip(a.clipRect));
            d ? this.animate() : g || this.afterAnimate();
            this.isDirty = this.isDirtyData = !1;
            this.hasRendered = !0
        },
        redraw: function () {
            var a = this.chart,
                b = this.isDirtyData,
                c = this.group;
            c && (a.inverted && c.attr({
                width: a.plotWidth,
                height: a.plotHeight
            }), c.animate({
                translateX: this.xAxis.left,
                translateY: this.yAxis.top
            }));
            this.translate();
            this.setTooltipPoints(!0);
            this.render();
            b && F(this, "updatedData")
        },
        setState: function (a) {
            var b = this.options,
                c = this.graph,
                d = b.states,
                b = b.lineWidth,
                a = a || "";
            if (this.state !== a) this.state = a, d[a] && d[a].enabled === !1 || (a && (b = d[a].lineWidth || b + 1), c && !c.dashstyle && c.attr({
                "stroke-width": b
            }, a ? 0 : 500))
        },
        setVisible: function (a, b) {
            var c = this.chart,
                d = this.legendItem,
                e = this.group,
                f = this.tracker,
                g = this.dataLabelsGroup,
                h = this.markerGroup,
                i, j = this.points,
                k = c.options.chart.ignoreHiddenSeries;
            i = this.visible;
            i = (this.visible = a = a === A ? !i : a) ? "show" : "hide";
            if (e) e[i]();
            if (h) h[i]();
            if (f) f[i]();
            else if (j) for (e = j.length; e--;) if (f = j[e], f.tracker) f.tracker[i]();
            if (c.hoverSeries === this) this.onMouseOut();
            if (g) g[i]();
            d && c.legend.colorizeItem(this, a);
            this.isDirty = !0;
            this.options.stacking && o(c.series, function (a) {
                if (a.options.stacking && a.visible) a.isDirty = !0
            });
            if (k) c.isDirtyBox = !0;
            b !== !1 && c.redraw();
            F(this, i)
        },
        show: function () {
            this.setVisible(!0)
        },
        hide: function () {
            this.setVisible(!1)
        },
        select: function (a) {
            this.selected = a = a === A ? !this.selected : a;
            if (this.checkbox) this.checkbox.checked = a;
            F(this, a ? "select" : "unselect")
        },
        drawTracker: function () {
            var a = this,
                b = a.options,
                c = b.trackByArea,
                d = [].concat(c ? a.areaPath : a.graphPath),
                e = d.length,
                f = a.chart,
                g = f.renderer,
                h = f.options.tooltip.snap,
                i = a.tracker,
                j = b.cursor,
                j = j && {
                    cursor: j
                }, k = a.singlePoints,
                l = this.isCartesian && this.plotGroup("trackerGroup", null, "visible", b.zIndex || 1, f.trackerGroup),
                m, n = function () {
                    if (f.hoverSeries !== a) a.onMouseOver()
                }, o = function () {
                    if (!b.stickyTracking) a.onMouseOut()
                };
            if (e && !c) for (m = e + 1; m--;) d[m] === "M" && d.splice(m + 1, 0, d[m + 1] - h, d[m + 2], "L"), (m && d[m] === "M" || m === e) && d.splice(m, 0, "L", d[m - 2] + h, d[m - 1]);
            for (m = 0; m < k.length; m++) e = k[m], d.push("M", e.plotX - h, e.plotY, "L", e.plotX + h, e.plotY);
            if (i) i.attr({
                d: d
            });
            else if (a.tracker = i = g.path(d).attr({
                isTracker: !0,
                "stroke-linejoin": "round",
                visibility: a.visible ? "visible" : "hidden",
                stroke: vb,
                fill: c ? vb : Q,
                "stroke-width": b.lineWidth + (c ? 0 : 2 * h)
            }).on("mouseover", n).on("mouseout", o).css(j).add(l), Ba) i.on("touchstart", n)
        }
    };
    G = ba(P);
    $.line = G;
    X.area = B(ea, {
        threshold: 0
    });
    G = ba(P, {
        type: "area",
        getSegmentPath: function (a) {
            var b = P.prototype.getSegmentPath.call(this, a),
                c = [].concat(b),
                d, e = this.options;
            b.length === 3 && c.push("L", b[1], b[2]);
            if (e.stacking && !this.closedStacks) for (d = a.length - 1; d >= 0; d--) d < a.length - 1 && e.step && c.push(a[d + 1].plotX,
            a[d].yBottom), c.push(a[d].plotX, a[d].yBottom);
            else this.closeSegment(c, a);
            this.areaPath = this.areaPath.concat(c);
            return b
        },
        closeSegment: function (a, b) {
            var c = this.yAxis.getThreshold(this.options.threshold);
            a.push("L", b[b.length - 1].plotX, c, "L", b[0].plotX, c)
        },
        drawGraph: function () {
            this.areaPath = [];
            P.prototype.drawGraph.apply(this);
            var a = this.areaPath,
                b = this.options,
                c = this.area;
            c ? c.animate({
                d: a
            }) : this.area = this.chart.renderer.path(a).attr({
                fill: n(b.fillColor, qa(this.color).setOpacity(b.fillOpacity || 0.75).get()),
                zIndex: 0
            }).add(this.group)
        },
        drawLegendSymbol: function (a, b) {
            b.legendSymbol = this.chart.renderer.rect(0, a.baseline - 11, a.options.symbolWidth, 12, 2).attr({
                zIndex: 3
            }).add(b.legendGroup)
        }
    });
    $.area = G;
    X.spline = B(ea);
    fa = ba(P, {
        type: "spline",
        getPointSpline: function (a, b, c) {
            var d = b.plotX,
                e = b.plotY,
                f = a[c - 1],
                g = a[c + 1],
                h, i, j, k;
            if (f && g) {
                a = f.plotY;
                j = g.plotX;
                var g = g.plotY,
                    l;
                h = (1.5 * d + f.plotX) / 2.5;
                i = (1.5 * e + a) / 2.5;
                j = (1.5 * d + j) / 2.5;
                k = (1.5 * e + g) / 2.5;
                l = (k - i) * (j - d) / (j - h) + e - k;
                i += l;
                k += l;
                i > a && i > e ? (i = s(a, e), k = 2 * e - i) : i < a && i < e && (i = O(a,
                e), k = 2 * e - i);
                k > g && k > e ? (k = s(g, e), i = 2 * e - k) : k < g && k < e && (k = O(g, e), i = 2 * e - k);
                b.rightContX = j;
                b.rightContY = k
            }
            c ? (b = ["C", f.rightContX || f.plotX, f.rightContY || f.plotY, h || d, i || e, d, e], f.rightContX = f.rightContY = null) : b = ["M", d, e];
            return b
        }
    });
    $.spline = fa;
    X.areaspline = B(X.area);
    var Ca = G.prototype,
        fa = ba(fa, {
            type: "areaspline",
            closedStacks: !0,
            getSegmentPath: Ca.getSegmentPath,
            closeSegment: Ca.closeSegment,
            drawGraph: Ca.drawGraph
        });
    $.areaspline = fa;
    X.column = B(ea, {
        borderColor: "#FFFFFF",
        borderWidth: 1,
        borderRadius: 0,
        groupPadding: 0.2,
        marker: null,
        pointPadding: 0.1,
        minPointLength: 0,
        cropThreshold: 50,
        pointRange: null,
        states: {
            hover: {
                brightness: 0.1,
                shadow: !1
            },
            select: {
                color: "#C0C0C0",
                borderColor: "#000000",
                shadow: !1
            }
        },
        dataLabels: {
            align: null,
            verticalAlign: null,
            y: null
        },
        threshold: 0
    });
    fa = ba(P, {
        type: "column",
        tooltipOutsidePlot: !0,
        pointAttrToOptions: {
            stroke: "borderColor",
            "stroke-width": "borderWidth",
            fill: "color",
            r: "borderRadius"
        },
        init: function () {
            P.prototype.init.apply(this, arguments);
            var a = this,
                b = a.chart;
            b.hasRendered && o(b.series, function (b) {
                if (b.type === a.type) b.isDirty = !0
            })
        },
        translate: function () {
            var a = this,
                b = a.chart,
                c = a.options,
                d = c.stacking,
                e = c.borderWidth,
                f = 0,
                g = a.xAxis,
                h = a.yAxis,
                i = g.reversed,
                j = {}, k, l;
            P.prototype.translate.apply(a);
            c.grouping === !1 ? f = 1 : o(b.series, function (b) {
                var c = b.options;
                if (b.type === a.type && b.visible && a.options.group === c.group) c.stacking ? (k = b.stackKey, j[k] === A && (j[k] = f++), l = j[k]) : c.grouping !== !1 && (l = f++), b.columnIndex = l
            });
            var m = a.points,
                g = M(g.transA) * (g.ordinalSlope || c.pointRange || g.closestPointRange || 1),
                q = g * c.groupPadding,
                p = (g - 2 * q) / f,
                y = c.pointWidth,
                t = r(y) ? (p - y) / 2 : p * c.pointPadding,
                u = n(y, p - 2 * t),
                x = za(s(u, 1 + 2 * e)),
                v = t + (q + ((i ? f - (a.columnIndex || 0) : a.columnIndex) || 0) * p - g / 2) * (i ? -1 : 1),
                z = a.translatedThreshold = h.getThreshold(c.threshold),
                w = n(c.minPointLength, 5);
            o(m, function (c) {
                var f = O(s(-999, c.plotY), h.len + 999),
                    g = n(c.yBottom, z),
                    i = c.plotX + v,
                    j = za(O(f, g)),
                    k = za(s(f, g) - j),
                    l = h.stacks[(c.y < 0 ? "-" : "") + a.stackKey];
                d && a.visible && l && l[c.x] && l[c.x].setOffset(v, x);
                M(k) < w && w && (k = w, j = M(j - z) > w ? g - w : z - (f <= z ? w : 0));
                c.barX = i;
                c.pointWidth = u;
                c.shapeType =
                    "rect";
                c.shapeArgs = f = b.renderer.Element.prototype.crisp.call(0, e, i, j, x, k);
                e % 2 && (f.y -= 1, f.height += 1);
                c.trackerArgs = M(k) < 3 && B(c.shapeArgs, {
                    height: 6,
                    y: j - 3
                })
            })
        },
        getSymbol: pa,
        drawLegendSymbol: G.prototype.drawLegendSymbol,
        drawGraph: pa,
        drawPoints: function () {
            var a = this,
                b = a.options,
                c = a.chart.renderer,
                d;
            o(a.points, function (e) {
                var f = e.plotY,
                    g = e.graphic;
                if (f !== A && !isNaN(f) && e.y !== null) d = e.shapeArgs, g ? (fb(g), g.animate(B(d))) : e.graphic = c[e.shapeType](d).attr(e.pointAttr[e.selected ? "select" : ""]).add(a.group).shadow(b.shadow,
                null, b.stacking && !b.borderRadius);
                else if (g) e.graphic = g.destroy()
            })
        },
        drawTracker: function () {
            for (var a = this, b = a.chart, c = b.renderer, d, e, f = +new Date, g = a.options, h = (d = g.cursor) && {
                cursor: d
            }, i = a.isCartesian && a.plotGroup("trackerGroup", null, "visible", g.zIndex || 1, b.trackerGroup), j, k, l = a.points, m, n = l.length, o = function (c) {
                j = c.relatedTarget || c.fromElement;
                if (b.hoverSeries !== a && w(j, "isTracker") !== f) a.onMouseOver();
                l[c.target._i].onMouseOver()
            }, r = function (b) {
                if (!g.stickyTracking && (j = b.relatedTarget || b.toElement,
                w(j, "isTracker") !== f)) a.onMouseOut()
            }; n--;) if (m = l[n], e = m.tracker, d = m.trackerArgs || m.shapeArgs, k = m.plotY, k = !a.isCartesian || k !== A && !isNaN(k), delete d.strokeWidth, m.y !== null && k) {
                if (e) e.attr(d);
                else if (m.tracker = e = c[m.shapeType](d).attr({
                    isTracker: f,
                    fill: vb,
                    visibility: a.visible ? "visible" : "hidden"
                }).on("mouseover", o).on("mouseout", r).css(h).add(m.group || i), Ba) e.on("touchstart", o);
                e.element._i = n
            }
        },
        alignDataLabel: function (a, b, c, d, e) {
            var f = this.chart,
                g = f.inverted,
                h = a.below || a.plotY > n(this.translatedThreshold,
                f.plotSizeY),
                i = this.options.stacking || c.inside;
            if (a.shapeArgs && (d = B(a.shapeArgs), g && (d = {
                x: f.plotWidth - d.y - d.height,
                y: f.plotHeight - d.x - d.width,
                width: d.height,
                height: d.width
            }), !i)) g ? (d.x += h ? 0 : d.width, d.width = 0) : (d.y += h ? d.height : 0, d.height = 0);
            c.align = n(c.align, !g || i ? "center" : h ? "right" : "left");
            c.verticalAlign = n(c.verticalAlign, g || i ? "middle" : h ? "top" : "bottom");
            P.prototype.alignDataLabel.call(this, a, b, c, d, e)
        },
        animate: function (a) {
            var b = this,
                c = b.points,
                d = b.options;
            if (!a) o(c, function (a) {
                var c = a.graphic,
                    a = a.shapeArgs,
                    g = b.yAxis,
                    h = d.threshold;
                c && (c.attr({
                    height: 0,
                    y: r(h) ? g.getThreshold(h) : g.translate(g.getExtremes().min, 0, 1, 0, 1)
                }), c.animate({
                    height: a.height,
                    y: a.y
                }, d.animation))
            }), b.animate = null
        },
        remove: function () {
            var a = this,
                b = a.chart;
            b.hasRendered && o(b.series, function (b) {
                if (b.type === a.type) b.isDirty = !0
            });
            P.prototype.remove.apply(a, arguments)
        }
    });
    $.column = fa;
    X.bar = B(X.column);
    Ca = ba(fa, {
        type: "bar",
        inverted: !0
    });
    $.bar = Ca;
    X.scatter = B(ea, {
        lineWidth: 0,
        states: {
            hover: {
                lineWidth: 0
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size: 10px; color:{series.color}">{series.name}</span><br/>',
            pointFormat: "x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>"
        }
    });
    Ca = ba(P, {
        type: "scatter",
        sorted: !1,
        requireSorting: !1,
        translate: function () {
            var a = this;
            P.prototype.translate.apply(a);
            o(a.points, function (b) {
                b.shapeType = "circle";
                b.shapeArgs = {
                    x: b.plotX,
                    y: b.plotY,
                    r: a.chart.options.tooltip.snap
                }
            })
        },
        drawTracker: function () {
            for (var a = this, b = a.options.cursor, b = b && {
                cursor: b
            }, c = a.points, d = c.length, e, f = a.markerGroup, g = function (b) {
                a.onMouseOver();
                if (b.target._i !== A) c[b.target._i].onMouseOver()
            }; d--;) if (e = c[d].graphic) e.element._i = d;
            if (a._hasTracking) a._hasTracking = !0;
            else if (f.attr({
                isTracker: !0
            }).on("mouseover", g).on("mouseout", function () {
                if (!a.options.stickyTracking) a.onMouseOut()
            }).css(b), Ba) f.on("touchstart", g)
        },
        setTooltipPoints: pa
    });
    $.scatter = Ca;
    X.pie = B(ea, {
        borderColor: "#FFFFFF",
        borderWidth: 1,
        center: ["50%", "50%"],
        colorByPoint: !0,
        dataLabels: {
            distance: 30,
            enabled: !0,
            formatter: function () {
                return this.point.name
            }
        },
        legendType: "point",
        marker: null,
        size: "75%",
        showInLegend: !1,
        slicedOffset: 10,
        states: {
            hover: {
                brightness: 0.1,
                shadow: !1
            }
        }
    });
    pa = {
        type: "pie",
        isCartesian: !1,
        pointClass: ba(Ua, {
            init: function () {
                Ua.prototype.init.apply(this, arguments);
                var a = this,
                    b;
                x(a, {
                    visible: a.visible !== !1,
                    name: n(a.name, "Slice")
                });
                b = function () {
                    a.slice()
                };
                J(a, "select", b);
                J(a, "unselect", b);
                return a
            },
            setVisible: function (a) {
                var b = this.series,
                    c = b.chart,
                    d = this.tracker,
                    e = this.dataLabel,
                    f = this.connector,
                    g = this.shadowGroup,
                    h;
                h = (this.visible = a = a === A ? !this.visible : a) ? "show" : "hide";
                this.group[h]();
                if (d) d[h]();
                if (e) e[h]();
                if (f) f[h]();
                if (g) g[h]();
                this.legendItem && c.legend.colorizeItem(this,
                a);
                if (!b.isDirty && b.options.ignoreHiddenPoint) b.isDirty = !0, c.redraw()
            },
            slice: function (a, b, c) {
                var d = this.series.chart,
                    e = this.slicedTranslation;
                xa(c, d);
                n(b, !0);
                a = this.sliced = r(a) ? a : !this.sliced;
                a = {
                    translateX: a ? e[0] : d.plotLeft,
                    translateY: a ? e[1] : d.plotTop
                };
                this.group.animate(a);
                this.shadowGroup && this.shadowGroup.animate(a)
            }
        }),
        requireSorting: !1,
        pointAttrToOptions: {
            stroke: "borderColor",
            "stroke-width": "borderWidth",
            fill: "color"
        },
        getColor: function () {
            this.initialColor = this.chart.counters.color
        },
        animate: function () {
            var a = this,
                b = a.startAngleRad;
            o(a.points, function (c) {
                var d = c.graphic,
                    c = c.shapeArgs;
                d && (d.attr({
                    r: a.center[3] / 2,
                    start: b,
                    end: b
                }), d.animate({
                    r: c.r,
                    start: c.start,
                    end: c.end
                }, a.options.animation))
            });
            a.animate = null
        },
        setData: function (a, b) {
            P.prototype.setData.call(this, a, !1);
            this.processData();
            this.generatePoints();
            n(b, !0) && this.chart.redraw()
        },
        getCenter: function () {
            var a = this.options,
                b = this.chart,
                c = b.plotWidth,
                d = b.plotHeight,
                a = a.center.concat([a.size, a.innerSize || 0]),
                e = O(c, d),
                f;
            return Ta(a, function (a, b) {
                return (f =
                    /%$/.test(a)) ? [c, d, e, e][b] * z(a) / 100 : a
            })
        },
        translate: function () {
            this.generatePoints();
            var a = 0,
                b = 0,
                c = this.options,
                d = c.slicedOffset,
                e = d + c.borderWidth,
                f, g = this.chart,
                h, i, j, k = this.startAngleRad = Aa / 180 * ((c.startAngle || 0) % 360 - 90),
                l = this.points,
                m = 2 * Aa,
                n = c.dataLabels.distance,
                o = c.ignoreHiddenPoint,
                r, t = l.length,
                s;
            this.center = f = this.getCenter();
            this.getX = function (a, b) {
                j = K.asin((a - f[1]) / (f[2] / 2 + n));
                return f[0] + (b ? -1 : 1) * W(j) * (f[2] / 2 + n)
            };
            for (r = 0; r < t; r++) s = l[r], a += o && !s.visible ? 0 : s.y;
            for (r = 0; r < t; r++) {
                s = l[r];
                c = a ? s.y / a : 0;
                h = u((k + b * m) * 1E3) / 1E3;
                if (!o || s.visible) b += c;
                i = u((k + b * m) * 1E3) / 1E3;
                s.shapeType = "arc";
                s.shapeArgs = {
                    x: f[0],
                    y: f[1],
                    r: f[2] / 2,
                    innerR: f[3] / 2,
                    start: h,
                    end: i
                };
                j = (i + h) / 2;
                j > 0.75 * m && (j -= 2 * Aa);
                s.slicedTranslation = Ta([W(j) * d + g.plotLeft, Z(j) * d + g.plotTop], u);
                h = W(j) * f[2] / 2;
                i = Z(j) * f[2] / 2;
                s.tooltipPos = [f[0] + h * 0.7, f[1] + i * 0.7];
                s.half = j < m / 4 ? 0 : 1;
                s.angle = j;
                s.labelPos = [f[0] + h + W(j) * n, f[1] + i + Z(j) * n, f[0] + h + W(j) * e, f[1] + i + Z(j) * e, f[0] + h, f[1] + i, n < 0 ? "center" : s.half ? "right" : "left", j];
                s.percentage = c * 100;
                s.total = a
            }
            this.setTooltipPoints()
        },
        render: function () {
            this.getAttribs();
            this.drawPoints();
            this.options.enableMouseTracking !== !1 && this.drawTracker();
            this.drawDataLabels();
            this.options.animation && this.animate && this.animate();
            this.isDirty = !1
        },
        drawPoints: function () {
            var a = this,
                b = a.chart,
                c = b.renderer,
                d, e, f, g = a.options.shadow,
                h, i;
            o(a.points, function (j) {
                e = j.graphic;
                i = j.shapeArgs;
                f = j.group;
                h = j.shadowGroup;
                if (g && !h) h = j.shadowGroup = c.g("shadow").attr({
                    zIndex: 4
                }).add();
                if (!f) f = j.group = c.g("point").attr({
                    zIndex: 5
                }).add();
                d = j.sliced ? j.slicedTranslation : [b.plotLeft, b.plotTop];
                f.translate(d[0], d[1]);
                h && h.translate(d[0], d[1]);
                e ? e.animate(i) : j.graphic = e = c.arc(i).setRadialReference(a.center).attr(x(j.pointAttr[""], {
                    "stroke-linejoin": "round"
                })).add(j.group).shadow(g, h);
                j.visible === !1 && j.setVisible(!1)
            })
        },
        drawDataLabels: function () {
            var a = this.data,
                b, c = this.chart,
                d = this.options.dataLabels,
                e = n(d.connectorPadding, 10),
                f = n(d.connectorWidth, 1),
                g, h, i = n(d.softConnector, !0),
                j = d.distance,
                k = this.center,
                l = k[2] / 2,
                m = k[1],
                q = j > 0,
                p = [
                    [],
                    []
                ],
                r, t, s, u = 2,
                v, x = function (a, b) {
                    return b.y - a.y
                }, z = function (a, b) {
                    a.sort(function (a, c) {
                        return (c.angle - a.angle) * b
                    })
                };
            if (d.enabled || this._hasPointLabels) {
                P.prototype.drawDataLabels.apply(this);
                o(a, function (a) {
                    a.dataLabel && p[a.half].push(a)
                });
                for (a = p[0][0] && p[0][0].dataLabel && (p[0][0].dataLabel.getBBox().height || 21); u--;) {
                    var w = [],
                        A = [],
                        B = p[u],
                        C = B.length,
                        D;
                    z(B, u - 0.5);
                    if (j > 0) {
                        for (v = m - l - j; v <= m + l + j; v += a) w.push(v);
                        s = w.length;
                        if (C > s) {
                            h = [].concat(B);
                            h.sort(x);
                            for (v = C; v--;) h[v].rank = v;
                            for (v = C; v--;) B[v].rank >= s && B.splice(v, 1);
                            C = B.length
                        }
                        for (v = 0; v < C; v++) {
                            b = B[v];
                            h = b.labelPos;
                            b = 9999;
                            for (t = 0; t < s; t++) g = M(w[t] - h[1]), g < b && (b = g, D = t);
                            if (D < v && w[v] !== null) D = v;
                            else for (s < C - v + D && w[v] !== null && (D = s - C + v); w[D] === null;) D++;
                            A.push({
                                i: D,
                                y: w[D]
                            });
                            w[D] = null
                        }
                        A.sort(x)
                    }
                    for (v = 0; v < C; v++) {
                        b = B[v];
                        h = b.labelPos;
                        g = b.dataLabel;
                        s = b.visible === !1 ? "hidden" : "visible";
                        r = h[1];
                        if (j > 0) {
                            if (t = A.pop(), D = t.i, t = t.y, r > t && w[D + 1] !== null || r < t && w[D - 1] !== null) t = r
                        } else t = r;
                        r = d.justify ? k[0] + (u ? -1 : 1) * (l + j) : this.getX(D === 0 || D === w.length - 1 ? r : t, u);
                        g.attr({
                            visibility: s,
                            align: h[6]
                        })[g.moved ? "animate" : "attr"]({
                            x: r + d.x + ({
                                left: e,
                                right: -e
                            }[h[6]] || 0),
                            y: t + d.y - 10
                        });
                        g.moved = !0;
                        if (q && f) g = b.connector, h = i ? ["M", r + (h[6] === "left" ? 5 : -5), t, "C", r, t, 2 * h[2] - h[4], 2 * h[3] - h[5], h[2], h[3], "L", h[4], h[5]] : ["M", r + (h[6] === "left" ? 5 : -5), t, "L", h[2], h[3], "L", h[4], h[5]], g ? (g.animate({
                            d: h
                        }), g.attr("visibility", s)) : b.connector = g = this.chart.renderer.path(h).attr({
                            "stroke-width": f,
                            stroke: d.connectorColor || b.color || "#606060",
                            visibility: s,
                            zIndex: 3
                        }).translate(c.plotLeft, c.plotTop).add()
                    }
                }
            }
        },
        alignDataLabel: pa,
        drawTracker: fa.prototype.drawTracker,
        drawLegendSymbol: G.prototype.drawLegendSymbol,
        getSymbol: function () {}
    };
    pa = ba(P, pa);
    $.pie = pa;
    x(Highcharts, {
        Axis: ob,
        CanVGRenderer: gb,
        Chart: sb,
        Color: qa,
        Legend: rb,
        MouseTracker: qb,
        Point: Ua,
        Tick: Qa,
        Tooltip: pb,
        Renderer: Sa,
        Series: P,
        SVGRenderer: sa,
        VMLRenderer: ha,
        arrayMin: Fa,
        arrayMax: wa,
        charts: Ha,
        dateFormat: db,
        pathAnim: ub,
        getOptions: function () {
            return N
        },
        hasBidiBug: Sb,
        isTouchDevice: Mb,
        numberFormat: Ja,
        seriesTypes: $,
        setOptions: function (a) {
            N = B(N, a);
            Jb();
            return N
        },
        addEvent: J,
        removeEvent: R,
        createElement: T,
        discardElement: Na,
        css: I,
        each: o,
        extend: x,
        map: Ta,
        merge: B,
        pick: n,
        splat: la,
        extendClass: ba,
        pInt: z,
        wrap: function (a, b, c) {
            var d = a[b];
            a[b] = function () {
                var a = Array.prototype.slice.call(arguments);
                a.unshift(d);
                return c.apply(this, a)
            }
        },
        svg: ca,
        canvas: V,
        vml: !ca && !V,
        product: "Highcharts",
        version: "2.3.5"
    })
})();