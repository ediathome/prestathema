class z {
  /**
  Get the line description around the given position.
  */
  lineAt(e) {
    if (e < 0 || e > this.length)
      throw new RangeError(`Invalid position ${e} in document of length ${this.length}`);
    return this.lineInner(e, !1, 1, 0);
  }
  /**
  Get the description for the given (1-based) line number.
  */
  line(e) {
    if (e < 1 || e > this.lines)
      throw new RangeError(`Invalid line number ${e} in ${this.lines}-line document`);
    return this.lineInner(e, !0, 1, 0);
  }
  /**
  Replace a range of the text with the given content.
  */
  replace(e, t, i) {
    [e, t] = Kt(this, e, t);
    let s = [];
    return this.decompose(
      0,
      e,
      s,
      2
      /* Open.To */
    ), i.length && i.decompose(
      0,
      i.length,
      s,
      3
      /* Open.To */
    ), this.decompose(
      t,
      this.length,
      s,
      1
      /* Open.From */
    ), je.from(s, this.length - (t - e) + i.length);
  }
  /**
  Append another document to this one.
  */
  append(e) {
    return this.replace(this.length, this.length, e);
  }
  /**
  Retrieve the text between the given points.
  */
  slice(e, t = this.length) {
    [e, t] = Kt(this, e, t);
    let i = [];
    return this.decompose(e, t, i, 0), je.from(i, t - e);
  }
  /**
  Test whether this text is equal to another instance.
  */
  eq(e) {
    if (e == this)
      return !0;
    if (e.length != this.length || e.lines != this.lines)
      return !1;
    let t = this.scanIdentical(e, 1), i = this.length - this.scanIdentical(e, -1), s = new gi(this), r = new gi(e);
    for (let o = t, l = t; ; ) {
      if (s.next(o), r.next(o), o = 0, s.lineBreak != r.lineBreak || s.done != r.done || s.value != r.value)
        return !1;
      if (l += s.value.length, s.done || l >= i)
        return !0;
    }
  }
  /**
  Iterate over the text. When `dir` is `-1`, iteration happens
  from end to start. This will return lines and the breaks between
  them as separate strings.
  */
  iter(e = 1) {
    return new gi(this, e);
  }
  /**
  Iterate over a range of the text. When `from` > `to`, the
  iterator will run in reverse.
  */
  iterRange(e, t = this.length) {
    return new na(this, e, t);
  }
  /**
  Return a cursor that iterates over the given range of lines,
  _without_ returning the line breaks between, and yielding empty
  strings for empty lines.
  
  When `from` and `to` are given, they should be 1-based line numbers.
  */
  iterLines(e, t) {
    let i;
    if (e == null)
      i = this.iter();
    else {
      t == null && (t = this.lines + 1);
      let s = this.line(e).from;
      i = this.iterRange(s, Math.max(s, t == this.lines + 1 ? this.length : t <= 1 ? 0 : this.line(t - 1).to));
    }
    return new sa(i);
  }
  /**
  Return the document as a string, using newline characters to
  separate lines.
  */
  toString() {
    return this.sliceString(0);
  }
  /**
  Convert the document to an array of lines (which can be
  deserialized again via [`Text.of`](https://codemirror.net/6/docs/ref/#state.Text^of)).
  */
  toJSON() {
    let e = [];
    return this.flatten(e), e;
  }
  /**
  @internal
  */
  constructor() {
  }
  /**
  Create a `Text` instance for the given array of lines.
  */
  static of(e) {
    if (e.length == 0)
      throw new RangeError("A document must have at least one line");
    return e.length == 1 && !e[0] ? z.empty : e.length <= 32 ? new _(e) : je.from(_.split(e, []));
  }
}
class _ extends z {
  constructor(e, t = nf(e)) {
    super(), this.text = e, this.length = t;
  }
  get lines() {
    return this.text.length;
  }
  get children() {
    return null;
  }
  lineInner(e, t, i, s) {
    for (let r = 0; ; r++) {
      let o = this.text[r], l = s + o.length;
      if ((t ? i : l) >= e)
        return new sf(s, l, i, o);
      s = l + 1, i++;
    }
  }
  decompose(e, t, i, s) {
    let r = e <= 0 && t >= this.length ? this : new _(ho(this.text, e, t), Math.min(t, this.length) - Math.max(0, e));
    if (s & 1) {
      let o = i.pop(), l = fn(r.text, o.text.slice(), 0, r.length);
      if (l.length <= 32)
        i.push(new _(l, o.length + r.length));
      else {
        let a = l.length >> 1;
        i.push(new _(l.slice(0, a)), new _(l.slice(a)));
      }
    } else
      i.push(r);
  }
  replace(e, t, i) {
    if (!(i instanceof _))
      return super.replace(e, t, i);
    [e, t] = Kt(this, e, t);
    let s = fn(this.text, fn(i.text, ho(this.text, 0, e)), t), r = this.length + i.length - (t - e);
    return s.length <= 32 ? new _(s, r) : je.from(_.split(s, []), r);
  }
  sliceString(e, t = this.length, i = `
`) {
    [e, t] = Kt(this, e, t);
    let s = "";
    for (let r = 0, o = 0; r <= t && o < this.text.length; o++) {
      let l = this.text[o], a = r + l.length;
      r > e && o && (s += i), e < a && t > r && (s += l.slice(Math.max(0, e - r), t - r)), r = a + 1;
    }
    return s;
  }
  flatten(e) {
    for (let t of this.text)
      e.push(t);
  }
  scanIdentical() {
    return 0;
  }
  static split(e, t) {
    let i = [], s = -1;
    for (let r of e)
      i.push(r), s += r.length + 1, i.length == 32 && (t.push(new _(i, s)), i = [], s = -1);
    return s > -1 && t.push(new _(i, s)), t;
  }
}
class je extends z {
  constructor(e, t) {
    super(), this.children = e, this.length = t, this.lines = 0;
    for (let i of e)
      this.lines += i.lines;
  }
  lineInner(e, t, i, s) {
    for (let r = 0; ; r++) {
      let o = this.children[r], l = s + o.length, a = i + o.lines - 1;
      if ((t ? a : l) >= e)
        return o.lineInner(e, t, i, s);
      s = l + 1, i = a + 1;
    }
  }
  decompose(e, t, i, s) {
    for (let r = 0, o = 0; o <= t && r < this.children.length; r++) {
      let l = this.children[r], a = o + l.length;
      if (e <= a && t >= o) {
        let h = s & ((o <= e ? 1 : 0) | (a >= t ? 2 : 0));
        o >= e && a <= t && !h ? i.push(l) : l.decompose(e - o, t - o, i, h);
      }
      o = a + 1;
    }
  }
  replace(e, t, i) {
    if ([e, t] = Kt(this, e, t), i.lines < this.lines)
      for (let s = 0, r = 0; s < this.children.length; s++) {
        let o = this.children[s], l = r + o.length;
        if (e >= r && t <= l) {
          let a = o.replace(e - r, t - r, i), h = this.lines - o.lines + a.lines;
          if (a.lines < h >> 4 && a.lines > h >> 6) {
            let c = this.children.slice();
            return c[s] = a, new je(c, this.length - (t - e) + i.length);
          }
          return super.replace(r, l, a);
        }
        r = l + 1;
      }
    return super.replace(e, t, i);
  }
  sliceString(e, t = this.length, i = `
`) {
    [e, t] = Kt(this, e, t);
    let s = "";
    for (let r = 0, o = 0; r < this.children.length && o <= t; r++) {
      let l = this.children[r], a = o + l.length;
      o > e && r && (s += i), e < a && t > o && (s += l.sliceString(e - o, t - o, i)), o = a + 1;
    }
    return s;
  }
  flatten(e) {
    for (let t of this.children)
      t.flatten(e);
  }
  scanIdentical(e, t) {
    if (!(e instanceof je))
      return 0;
    let i = 0, [s, r, o, l] = t > 0 ? [0, 0, this.children.length, e.children.length] : [this.children.length - 1, e.children.length - 1, -1, -1];
    for (; ; s += t, r += t) {
      if (s == o || r == l)
        return i;
      let a = this.children[s], h = e.children[r];
      if (a != h)
        return i + a.scanIdentical(h, t);
      i += a.length + 1;
    }
  }
  static from(e, t = e.reduce((i, s) => i + s.length + 1, -1)) {
    let i = 0;
    for (let d of e)
      i += d.lines;
    if (i < 32) {
      let d = [];
      for (let p of e)
        p.flatten(d);
      return new _(d, t);
    }
    let s = Math.max(
      32,
      i >> 5
      /* Tree.BranchShift */
    ), r = s << 1, o = s >> 1, l = [], a = 0, h = -1, c = [];
    function f(d) {
      let p;
      if (d.lines > r && d instanceof je)
        for (let g of d.children)
          f(g);
      else
        d.lines > o && (a > o || !a) ? (u(), l.push(d)) : d instanceof _ && a && (p = c[c.length - 1]) instanceof _ && d.lines + p.lines <= 32 ? (a += d.lines, h += d.length + 1, c[c.length - 1] = new _(p.text.concat(d.text), p.length + 1 + d.length)) : (a + d.lines > s && u(), a += d.lines, h += d.length + 1, c.push(d));
    }
    function u() {
      a != 0 && (l.push(c.length == 1 ? c[0] : je.from(c, h)), h = -1, a = c.length = 0);
    }
    for (let d of e)
      f(d);
    return u(), l.length == 1 ? l[0] : new je(l, t);
  }
}
z.empty = /* @__PURE__ */ new _([""], 0);
function nf(n) {
  let e = -1;
  for (let t of n)
    e += t.length + 1;
  return e;
}
function fn(n, e, t = 0, i = 1e9) {
  for (let s = 0, r = 0, o = !0; r < n.length && s <= i; r++) {
    let l = n[r], a = s + l.length;
    a >= t && (a > i && (l = l.slice(0, i - s)), s < t && (l = l.slice(t - s)), o ? (e[e.length - 1] += l, o = !1) : e.push(l)), s = a + 1;
  }
  return e;
}
function ho(n, e, t) {
  return fn(n, [""], e, t);
}
class gi {
  constructor(e, t = 1) {
    this.dir = t, this.done = !1, this.lineBreak = !1, this.value = "", this.nodes = [e], this.offsets = [t > 0 ? 1 : (e instanceof _ ? e.text.length : e.children.length) << 1];
  }
  nextInner(e, t) {
    for (this.done = this.lineBreak = !1; ; ) {
      let i = this.nodes.length - 1, s = this.nodes[i], r = this.offsets[i], o = r >> 1, l = s instanceof _ ? s.text.length : s.children.length;
      if (o == (t > 0 ? l : 0)) {
        if (i == 0)
          return this.done = !0, this.value = "", this;
        t > 0 && this.offsets[i - 1]++, this.nodes.pop(), this.offsets.pop();
      } else if ((r & 1) == (t > 0 ? 0 : 1)) {
        if (this.offsets[i] += t, e == 0)
          return this.lineBreak = !0, this.value = `
`, this;
        e--;
      } else if (s instanceof _) {
        let a = s.text[o + (t < 0 ? -1 : 0)];
        if (this.offsets[i] += t, a.length > Math.max(0, e))
          return this.value = e == 0 ? a : t > 0 ? a.slice(e) : a.slice(0, a.length - e), this;
        e -= a.length;
      } else {
        let a = s.children[o + (t < 0 ? -1 : 0)];
        e > a.length ? (e -= a.length, this.offsets[i] += t) : (t < 0 && this.offsets[i]--, this.nodes.push(a), this.offsets.push(t > 0 ? 1 : (a instanceof _ ? a.text.length : a.children.length) << 1));
      }
    }
  }
  next(e = 0) {
    return e < 0 && (this.nextInner(-e, -this.dir), e = this.value.length), this.nextInner(e, this.dir);
  }
}
class na {
  constructor(e, t, i) {
    this.value = "", this.done = !1, this.cursor = new gi(e, t > i ? -1 : 1), this.pos = t > i ? e.length : 0, this.from = Math.min(t, i), this.to = Math.max(t, i);
  }
  nextInner(e, t) {
    if (t < 0 ? this.pos <= this.from : this.pos >= this.to)
      return this.value = "", this.done = !0, this;
    e += Math.max(0, t < 0 ? this.pos - this.to : this.from - this.pos);
    let i = t < 0 ? this.pos - this.from : this.to - this.pos;
    e > i && (e = i), i -= e;
    let { value: s } = this.cursor.next(e);
    return this.pos += (s.length + e) * t, this.value = s.length <= i ? s : t < 0 ? s.slice(s.length - i) : s.slice(0, i), this.done = !this.value, this;
  }
  next(e = 0) {
    return e < 0 ? e = Math.max(e, this.from - this.pos) : e > 0 && (e = Math.min(e, this.to - this.pos)), this.nextInner(e, this.cursor.dir);
  }
  get lineBreak() {
    return this.cursor.lineBreak && this.value != "";
  }
}
class sa {
  constructor(e) {
    this.inner = e, this.afterBreak = !0, this.value = "", this.done = !1;
  }
  next(e = 0) {
    let { done: t, lineBreak: i, value: s } = this.inner.next(e);
    return t && this.afterBreak ? (this.value = "", this.afterBreak = !1) : t ? (this.done = !0, this.value = "") : i ? this.afterBreak ? this.value = "" : (this.afterBreak = !0, this.next()) : (this.value = s, this.afterBreak = !1), this;
  }
  get lineBreak() {
    return !1;
  }
}
typeof Symbol < "u" && (z.prototype[Symbol.iterator] = function() {
  return this.iter();
}, gi.prototype[Symbol.iterator] = na.prototype[Symbol.iterator] = sa.prototype[Symbol.iterator] = function() {
  return this;
});
class sf {
  /**
  @internal
  */
  constructor(e, t, i, s) {
    this.from = e, this.to = t, this.number = i, this.text = s;
  }
  /**
  The length of the line (not including any line break after it).
  */
  get length() {
    return this.to - this.from;
  }
}
function Kt(n, e, t) {
  return e = Math.max(0, Math.min(n.length, e)), [e, Math.max(e, Math.min(n.length, t))];
}
let Vt = /* @__PURE__ */ "lc,34,7n,7,7b,19,,,,2,,2,,,20,b,1c,l,g,,2t,7,2,6,2,2,,4,z,,u,r,2j,b,1m,9,9,,o,4,,9,,3,,5,17,3,3b,f,,w,1j,,,,4,8,4,,3,7,a,2,t,,1m,,,,2,4,8,,9,,a,2,q,,2,2,1l,,4,2,4,2,2,3,3,,u,2,3,,b,2,1l,,4,5,,2,4,,k,2,m,6,,,1m,,,2,,4,8,,7,3,a,2,u,,1n,,,,c,,9,,14,,3,,1l,3,5,3,,4,7,2,b,2,t,,1m,,2,,2,,3,,5,2,7,2,b,2,s,2,1l,2,,,2,4,8,,9,,a,2,t,,20,,4,,2,3,,,8,,29,,2,7,c,8,2q,,2,9,b,6,22,2,r,,,,,,1j,e,,5,,2,5,b,,10,9,,2u,4,,6,,2,2,2,p,2,4,3,g,4,d,,2,2,6,,f,,jj,3,qa,3,t,3,t,2,u,2,1s,2,,7,8,,2,b,9,,19,3,3b,2,y,,3a,3,4,2,9,,6,3,63,2,2,,1m,,,7,,,,,2,8,6,a,2,,1c,h,1r,4,1c,7,,,5,,14,9,c,2,w,4,2,2,,3,1k,,,2,3,,,3,1m,8,2,2,48,3,,d,,7,4,,6,,3,2,5i,1m,,5,ek,,5f,x,2da,3,3x,,2o,w,fe,6,2x,2,n9w,4,,a,w,2,28,2,7k,,3,,4,,p,2,5,,47,2,q,i,d,,12,8,p,b,1a,3,1c,,2,4,2,2,13,,1v,6,2,2,2,2,c,,8,,1b,,1f,,,3,2,2,5,2,,,16,2,8,,6m,,2,,4,,fn4,,kh,g,g,g,a6,2,gt,,6a,,45,5,1ae,3,,2,5,4,14,3,4,,4l,2,fx,4,ar,2,49,b,4w,,1i,f,1k,3,1d,4,2,2,1x,3,10,5,,8,1q,,c,2,1g,9,a,4,2,,2n,3,2,,,2,6,,4g,,3,8,l,2,1l,2,,,,,m,,e,7,3,5,5f,8,2,3,,,n,,29,,2,6,,,2,,,2,,2,6j,,2,4,6,2,,2,r,2,2d,8,2,,,2,2y,,,,2,6,,,2t,3,2,4,,5,77,9,,2,6t,,a,2,,,4,,40,4,2,2,4,,w,a,14,6,2,4,8,,9,6,2,3,1a,d,,2,ba,7,,6,,,2a,m,2,7,,2,,2,3e,6,3,,,2,,7,,,20,2,3,,,,9n,2,f0b,5,1n,7,t4,,1r,4,29,,f5k,2,43q,,,3,4,5,8,8,2,7,u,4,44,3,1iz,1j,4,1e,8,,e,,m,5,,f,11s,7,,h,2,7,,2,,5,79,7,c5,4,15s,7,31,7,240,5,gx7k,2o,3k,6o".split(",").map((n) => n ? parseInt(n, 36) : 1);
for (let n = 1; n < Vt.length; n++)
  Vt[n] += Vt[n - 1];
function rf(n) {
  for (let e = 1; e < Vt.length; e += 2)
    if (Vt[e] > n)
      return Vt[e - 1] <= n;
  return !1;
}
function co(n) {
  return n >= 127462 && n <= 127487;
}
const fo = 8205;
function le(n, e, t = !0, i = !0) {
  return (t ? ra : of)(n, e, i);
}
function ra(n, e, t) {
  if (e == n.length)
    return e;
  e && oa(n.charCodeAt(e)) && la(n.charCodeAt(e - 1)) && e--;
  let i = re(n, e);
  for (e += Be(i); e < n.length; ) {
    let s = re(n, e);
    if (i == fo || s == fo || t && rf(s))
      e += Be(s), i = s;
    else if (co(s)) {
      let r = 0, o = e - 2;
      for (; o >= 0 && co(re(n, o)); )
        r++, o -= 2;
      if (r % 2 == 0)
        break;
      e += 2;
    } else
      break;
  }
  return e;
}
function of(n, e, t) {
  for (; e > 0; ) {
    let i = ra(n, e - 2, t);
    if (i < e)
      return i;
    e--;
  }
  return 0;
}
function oa(n) {
  return n >= 56320 && n < 57344;
}
function la(n) {
  return n >= 55296 && n < 56320;
}
function re(n, e) {
  let t = n.charCodeAt(e);
  if (!la(t) || e + 1 == n.length)
    return t;
  let i = n.charCodeAt(e + 1);
  return oa(i) ? (t - 55296 << 10) + (i - 56320) + 65536 : t;
}
function Rr(n) {
  return n <= 65535 ? String.fromCharCode(n) : (n -= 65536, String.fromCharCode((n >> 10) + 55296, (n & 1023) + 56320));
}
function Be(n) {
  return n < 65536 ? 1 : 2;
}
const Is = /\r\n?|\n/;
var pe = /* @__PURE__ */ function(n) {
  return n[n.Simple = 0] = "Simple", n[n.TrackDel = 1] = "TrackDel", n[n.TrackBefore = 2] = "TrackBefore", n[n.TrackAfter = 3] = "TrackAfter", n;
}(pe || (pe = {}));
class Ze {
  // Sections are encoded as pairs of integers. The first is the
  // length in the current document, and the second is -1 for
  // unaffected sections, and the length of the replacement content
  // otherwise. So an insertion would be (0, n>0), a deletion (n>0,
  // 0), and a replacement two positive numbers.
  /**
  @internal
  */
  constructor(e) {
    this.sections = e;
  }
  /**
  The length of the document before the change.
  */
  get length() {
    let e = 0;
    for (let t = 0; t < this.sections.length; t += 2)
      e += this.sections[t];
    return e;
  }
  /**
  The length of the document after the change.
  */
  get newLength() {
    let e = 0;
    for (let t = 0; t < this.sections.length; t += 2) {
      let i = this.sections[t + 1];
      e += i < 0 ? this.sections[t] : i;
    }
    return e;
  }
  /**
  False when there are actual changes in this set.
  */
  get empty() {
    return this.sections.length == 0 || this.sections.length == 2 && this.sections[1] < 0;
  }
  /**
  Iterate over the unchanged parts left by these changes. `posA`
  provides the position of the range in the old document, `posB`
  the new position in the changed document.
  */
  iterGaps(e) {
    for (let t = 0, i = 0, s = 0; t < this.sections.length; ) {
      let r = this.sections[t++], o = this.sections[t++];
      o < 0 ? (e(i, s, r), s += r) : s += o, i += r;
    }
  }
  /**
  Iterate over the ranges changed by these changes. (See
  [`ChangeSet.iterChanges`](https://codemirror.net/6/docs/ref/#state.ChangeSet.iterChanges) for a
  variant that also provides you with the inserted text.)
  `fromA`/`toA` provides the extent of the change in the starting
  document, `fromB`/`toB` the extent of the replacement in the
  changed document.
  
  When `individual` is true, adjacent changes (which are kept
  separate for [position mapping](https://codemirror.net/6/docs/ref/#state.ChangeDesc.mapPos)) are
  reported separately.
  */
  iterChangedRanges(e, t = !1) {
    Ws(this, e, t);
  }
  /**
  Get a description of the inverted form of these changes.
  */
  get invertedDesc() {
    let e = [];
    for (let t = 0; t < this.sections.length; ) {
      let i = this.sections[t++], s = this.sections[t++];
      s < 0 ? e.push(i, s) : e.push(s, i);
    }
    return new Ze(e);
  }
  /**
  Compute the combined effect of applying another set of changes
  after this one. The length of the document after this set should
  match the length before `other`.
  */
  composeDesc(e) {
    return this.empty ? e : e.empty ? this : aa(this, e);
  }
  /**
  Map this description, which should start with the same document
  as `other`, over another set of changes, so that it can be
  applied after it. When `before` is true, map as if the changes
  in `other` happened before the ones in `this`.
  */
  mapDesc(e, t = !1) {
    return e.empty ? this : $s(this, e, t);
  }
  mapPos(e, t = -1, i = pe.Simple) {
    let s = 0, r = 0;
    for (let o = 0; o < this.sections.length; ) {
      let l = this.sections[o++], a = this.sections[o++], h = s + l;
      if (a < 0) {
        if (h > e)
          return r + (e - s);
        r += l;
      } else {
        if (i != pe.Simple && h >= e && (i == pe.TrackDel && s < e && h > e || i == pe.TrackBefore && s < e || i == pe.TrackAfter && h > e))
          return null;
        if (h > e || h == e && t < 0 && !l)
          return e == s || t < 0 ? r : r + a;
        r += a;
      }
      s = h;
    }
    if (e > s)
      throw new RangeError(`Position ${e} is out of range for changeset of length ${s}`);
    return r;
  }
  /**
  Check whether these changes touch a given range. When one of the
  changes entirely covers the range, the string `"cover"` is
  returned.
  */
  touchesRange(e, t = e) {
    for (let i = 0, s = 0; i < this.sections.length && s <= t; ) {
      let r = this.sections[i++], o = this.sections[i++], l = s + r;
      if (o >= 0 && s <= t && l >= e)
        return s < e && l > t ? "cover" : !0;
      s = l;
    }
    return !1;
  }
  /**
  @internal
  */
  toString() {
    let e = "";
    for (let t = 0; t < this.sections.length; ) {
      let i = this.sections[t++], s = this.sections[t++];
      e += (e ? " " : "") + i + (s >= 0 ? ":" + s : "");
    }
    return e;
  }
  /**
  Serialize this change desc to a JSON-representable value.
  */
  toJSON() {
    return this.sections;
  }
  /**
  Create a change desc from its JSON representation (as produced
  by [`toJSON`](https://codemirror.net/6/docs/ref/#state.ChangeDesc.toJSON).
  */
  static fromJSON(e) {
    if (!Array.isArray(e) || e.length % 2 || e.some((t) => typeof t != "number"))
      throw new RangeError("Invalid JSON representation of ChangeDesc");
    return new Ze(e);
  }
  /**
  @internal
  */
  static create(e) {
    return new Ze(e);
  }
}
class te extends Ze {
  constructor(e, t) {
    super(e), this.inserted = t;
  }
  /**
  Apply the changes to a document, returning the modified
  document.
  */
  apply(e) {
    if (this.length != e.length)
      throw new RangeError("Applying change set to a document with the wrong length");
    return Ws(this, (t, i, s, r, o) => e = e.replace(s, s + (i - t), o), !1), e;
  }
  mapDesc(e, t = !1) {
    return $s(this, e, t, !0);
  }
  /**
  Given the document as it existed _before_ the changes, return a
  change set that represents the inverse of this set, which could
  be used to go from the document created by the changes back to
  the document as it existed before the changes.
  */
  invert(e) {
    let t = this.sections.slice(), i = [];
    for (let s = 0, r = 0; s < t.length; s += 2) {
      let o = t[s], l = t[s + 1];
      if (l >= 0) {
        t[s] = l, t[s + 1] = o;
        let a = s >> 1;
        for (; i.length < a; )
          i.push(z.empty);
        i.push(o ? e.slice(r, r + o) : z.empty);
      }
      r += o;
    }
    return new te(t, i);
  }
  /**
  Combine two subsequent change sets into a single set. `other`
  must start in the document produced by `this`. If `this` goes
  `docA` → `docB` and `other` represents `docB` → `docC`, the
  returned value will represent the change `docA` → `docC`.
  */
  compose(e) {
    return this.empty ? e : e.empty ? this : aa(this, e, !0);
  }
  /**
  Given another change set starting in the same document, maps this
  change set over the other, producing a new change set that can be
  applied to the document produced by applying `other`. When
  `before` is `true`, order changes as if `this` comes before
  `other`, otherwise (the default) treat `other` as coming first.
  
  Given two changes `A` and `B`, `A.compose(B.map(A))` and
  `B.compose(A.map(B, true))` will produce the same document. This
  provides a basic form of [operational
  transformation](https://en.wikipedia.org/wiki/Operational_transformation),
  and can be used for collaborative editing.
  */
  map(e, t = !1) {
    return e.empty ? this : $s(this, e, t, !0);
  }
  /**
  Iterate over the changed ranges in the document, calling `f` for
  each, with the range in the original document (`fromA`-`toA`)
  and the range that replaces it in the new document
  (`fromB`-`toB`).
  
  When `individual` is true, adjacent changes are reported
  separately.
  */
  iterChanges(e, t = !1) {
    Ws(this, e, t);
  }
  /**
  Get a [change description](https://codemirror.net/6/docs/ref/#state.ChangeDesc) for this change
  set.
  */
  get desc() {
    return Ze.create(this.sections);
  }
  /**
  @internal
  */
  filter(e) {
    let t = [], i = [], s = [], r = new wi(this);
    e:
      for (let o = 0, l = 0; ; ) {
        let a = o == e.length ? 1e9 : e[o++];
        for (; l < a || l == a && r.len == 0; ) {
          if (r.done)
            break e;
          let c = Math.min(r.len, a - l);
          ce(s, c, -1);
          let f = r.ins == -1 ? -1 : r.off == 0 ? r.ins : 0;
          ce(t, c, f), f > 0 && ft(i, t, r.text), r.forward(c), l += c;
        }
        let h = e[o++];
        for (; l < h; ) {
          if (r.done)
            break e;
          let c = Math.min(r.len, h - l);
          ce(t, c, -1), ce(s, c, r.ins == -1 ? -1 : r.off == 0 ? r.ins : 0), r.forward(c), l += c;
        }
      }
    return {
      changes: new te(t, i),
      filtered: Ze.create(s)
    };
  }
  /**
  Serialize this change set to a JSON-representable value.
  */
  toJSON() {
    let e = [];
    for (let t = 0; t < this.sections.length; t += 2) {
      let i = this.sections[t], s = this.sections[t + 1];
      s < 0 ? e.push(i) : s == 0 ? e.push([i]) : e.push([i].concat(this.inserted[t >> 1].toJSON()));
    }
    return e;
  }
  /**
  Create a change set for the given changes, for a document of the
  given length, using `lineSep` as line separator.
  */
  static of(e, t, i) {
    let s = [], r = [], o = 0, l = null;
    function a(c = !1) {
      if (!c && !s.length)
        return;
      o < t && ce(s, t - o, -1);
      let f = new te(s, r);
      l = l ? l.compose(f.map(l)) : f, s = [], r = [], o = 0;
    }
    function h(c) {
      if (Array.isArray(c))
        for (let f of c)
          h(f);
      else if (c instanceof te) {
        if (c.length != t)
          throw new RangeError(`Mismatched change set length (got ${c.length}, expected ${t})`);
        a(), l = l ? l.compose(c.map(l)) : c;
      } else {
        let { from: f, to: u = f, insert: d } = c;
        if (f > u || f < 0 || u > t)
          throw new RangeError(`Invalid change range ${f} to ${u} (in doc of length ${t})`);
        let p = d ? typeof d == "string" ? z.of(d.split(i || Is)) : d : z.empty, g = p.length;
        if (f == u && g == 0)
          return;
        f < o && a(), f > o && ce(s, f - o, -1), ce(s, u - f, g), ft(r, s, p), o = u;
      }
    }
    return h(e), a(!l), l;
  }
  /**
  Create an empty changeset of the given length.
  */
  static empty(e) {
    return new te(e ? [e, -1] : [], []);
  }
  /**
  Create a changeset from its JSON representation (as produced by
  [`toJSON`](https://codemirror.net/6/docs/ref/#state.ChangeSet.toJSON).
  */
  static fromJSON(e) {
    if (!Array.isArray(e))
      throw new RangeError("Invalid JSON representation of ChangeSet");
    let t = [], i = [];
    for (let s = 0; s < e.length; s++) {
      let r = e[s];
      if (typeof r == "number")
        t.push(r, -1);
      else {
        if (!Array.isArray(r) || typeof r[0] != "number" || r.some((o, l) => l && typeof o != "string"))
          throw new RangeError("Invalid JSON representation of ChangeSet");
        if (r.length == 1)
          t.push(r[0], 0);
        else {
          for (; i.length < s; )
            i.push(z.empty);
          i[s] = z.of(r.slice(1)), t.push(r[0], i[s].length);
        }
      }
    }
    return new te(t, i);
  }
  /**
  @internal
  */
  static createSet(e, t) {
    return new te(e, t);
  }
}
function ce(n, e, t, i = !1) {
  if (e == 0 && t <= 0)
    return;
  let s = n.length - 2;
  s >= 0 && t <= 0 && t == n[s + 1] ? n[s] += e : e == 0 && n[s] == 0 ? n[s + 1] += t : i ? (n[s] += e, n[s + 1] += t) : n.push(e, t);
}
function ft(n, e, t) {
  if (t.length == 0)
    return;
  let i = e.length - 2 >> 1;
  if (i < n.length)
    n[n.length - 1] = n[n.length - 1].append(t);
  else {
    for (; n.length < i; )
      n.push(z.empty);
    n.push(t);
  }
}
function Ws(n, e, t) {
  let i = n.inserted;
  for (let s = 0, r = 0, o = 0; o < n.sections.length; ) {
    let l = n.sections[o++], a = n.sections[o++];
    if (a < 0)
      s += l, r += l;
    else {
      let h = s, c = r, f = z.empty;
      for (; h += l, c += a, a && i && (f = f.append(i[o - 2 >> 1])), !(t || o == n.sections.length || n.sections[o + 1] < 0); )
        l = n.sections[o++], a = n.sections[o++];
      e(s, h, r, c, f), s = h, r = c;
    }
  }
}
function $s(n, e, t, i = !1) {
  let s = [], r = i ? [] : null, o = new wi(n), l = new wi(e);
  for (let a = -1; ; )
    if (o.ins == -1 && l.ins == -1) {
      let h = Math.min(o.len, l.len);
      ce(s, h, -1), o.forward(h), l.forward(h);
    } else if (l.ins >= 0 && (o.ins < 0 || a == o.i || o.off == 0 && (l.len < o.len || l.len == o.len && !t))) {
      let h = l.len;
      for (ce(s, l.ins, -1); h; ) {
        let c = Math.min(o.len, h);
        o.ins >= 0 && a < o.i && o.len <= c && (ce(s, 0, o.ins), r && ft(r, s, o.text), a = o.i), o.forward(c), h -= c;
      }
      l.next();
    } else if (o.ins >= 0) {
      let h = 0, c = o.len;
      for (; c; )
        if (l.ins == -1) {
          let f = Math.min(c, l.len);
          h += f, c -= f, l.forward(f);
        } else if (l.ins == 0 && l.len < c)
          c -= l.len, l.next();
        else
          break;
      ce(s, h, a < o.i ? o.ins : 0), r && a < o.i && ft(r, s, o.text), a = o.i, o.forward(o.len - c);
    } else {
      if (o.done && l.done)
        return r ? te.createSet(s, r) : Ze.create(s);
      throw new Error("Mismatched change set lengths");
    }
}
function aa(n, e, t = !1) {
  let i = [], s = t ? [] : null, r = new wi(n), o = new wi(e);
  for (let l = !1; ; ) {
    if (r.done && o.done)
      return s ? te.createSet(i, s) : Ze.create(i);
    if (r.ins == 0)
      ce(i, r.len, 0, l), r.next();
    else if (o.len == 0 && !o.done)
      ce(i, 0, o.ins, l), s && ft(s, i, o.text), o.next();
    else {
      if (r.done || o.done)
        throw new Error("Mismatched change set lengths");
      {
        let a = Math.min(r.len2, o.len), h = i.length;
        if (r.ins == -1) {
          let c = o.ins == -1 ? -1 : o.off ? 0 : o.ins;
          ce(i, a, c, l), s && c && ft(s, i, o.text);
        } else
          o.ins == -1 ? (ce(i, r.off ? 0 : r.len, a, l), s && ft(s, i, r.textBit(a))) : (ce(i, r.off ? 0 : r.len, o.off ? 0 : o.ins, l), s && !o.off && ft(s, i, o.text));
        l = (r.ins > a || o.ins >= 0 && o.len > a) && (l || i.length > h), r.forward2(a), o.forward(a);
      }
    }
  }
}
class wi {
  constructor(e) {
    this.set = e, this.i = 0, this.next();
  }
  next() {
    let { sections: e } = this.set;
    this.i < e.length ? (this.len = e[this.i++], this.ins = e[this.i++]) : (this.len = 0, this.ins = -2), this.off = 0;
  }
  get done() {
    return this.ins == -2;
  }
  get len2() {
    return this.ins < 0 ? this.len : this.ins;
  }
  get text() {
    let { inserted: e } = this.set, t = this.i - 2 >> 1;
    return t >= e.length ? z.empty : e[t];
  }
  textBit(e) {
    let { inserted: t } = this.set, i = this.i - 2 >> 1;
    return i >= t.length && !e ? z.empty : t[i].slice(this.off, e == null ? void 0 : this.off + e);
  }
  forward(e) {
    e == this.len ? this.next() : (this.len -= e, this.off += e);
  }
  forward2(e) {
    this.ins == -1 ? this.forward(e) : e == this.ins ? this.next() : (this.ins -= e, this.off += e);
  }
}
class Pt {
  constructor(e, t, i) {
    this.from = e, this.to = t, this.flags = i;
  }
  /**
  The anchor of the range—the side that doesn't move when you
  extend it.
  */
  get anchor() {
    return this.flags & 32 ? this.to : this.from;
  }
  /**
  The head of the range, which is moved when the range is
  [extended](https://codemirror.net/6/docs/ref/#state.SelectionRange.extend).
  */
  get head() {
    return this.flags & 32 ? this.from : this.to;
  }
  /**
  True when `anchor` and `head` are at the same position.
  */
  get empty() {
    return this.from == this.to;
  }
  /**
  If this is a cursor that is explicitly associated with the
  character on one of its sides, this returns the side. -1 means
  the character before its position, 1 the character after, and 0
  means no association.
  */
  get assoc() {
    return this.flags & 8 ? -1 : this.flags & 16 ? 1 : 0;
  }
  /**
  The bidirectional text level associated with this cursor, if
  any.
  */
  get bidiLevel() {
    let e = this.flags & 7;
    return e == 7 ? null : e;
  }
  /**
  The goal column (stored vertical offset) associated with a
  cursor. This is used to preserve the vertical position when
  [moving](https://codemirror.net/6/docs/ref/#view.EditorView.moveVertically) across
  lines of different length.
  */
  get goalColumn() {
    let e = this.flags >> 6;
    return e == 16777215 ? void 0 : e;
  }
  /**
  Map this range through a change, producing a valid range in the
  updated document.
  */
  map(e, t = -1) {
    let i, s;
    return this.empty ? i = s = e.mapPos(this.from, t) : (i = e.mapPos(this.from, 1), s = e.mapPos(this.to, -1)), i == this.from && s == this.to ? this : new Pt(i, s, this.flags);
  }
  /**
  Extend this range to cover at least `from` to `to`.
  */
  extend(e, t = e) {
    if (e <= this.anchor && t >= this.anchor)
      return b.range(e, t);
    let i = Math.abs(e - this.anchor) > Math.abs(t - this.anchor) ? e : t;
    return b.range(this.anchor, i);
  }
  /**
  Compare this range to another range.
  */
  eq(e) {
    return this.anchor == e.anchor && this.head == e.head;
  }
  /**
  Return a JSON-serializable object representing the range.
  */
  toJSON() {
    return { anchor: this.anchor, head: this.head };
  }
  /**
  Convert a JSON representation of a range to a `SelectionRange`
  instance.
  */
  static fromJSON(e) {
    if (!e || typeof e.anchor != "number" || typeof e.head != "number")
      throw new RangeError("Invalid JSON representation for SelectionRange");
    return b.range(e.anchor, e.head);
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new Pt(e, t, i);
  }
}
class b {
  constructor(e, t) {
    this.ranges = e, this.mainIndex = t;
  }
  /**
  Map a selection through a change. Used to adjust the selection
  position for changes.
  */
  map(e, t = -1) {
    return e.empty ? this : b.create(this.ranges.map((i) => i.map(e, t)), this.mainIndex);
  }
  /**
  Compare this selection to another selection.
  */
  eq(e) {
    if (this.ranges.length != e.ranges.length || this.mainIndex != e.mainIndex)
      return !1;
    for (let t = 0; t < this.ranges.length; t++)
      if (!this.ranges[t].eq(e.ranges[t]))
        return !1;
    return !0;
  }
  /**
  Get the primary selection range. Usually, you should make sure
  your code applies to _all_ ranges, by using methods like
  [`changeByRange`](https://codemirror.net/6/docs/ref/#state.EditorState.changeByRange).
  */
  get main() {
    return this.ranges[this.mainIndex];
  }
  /**
  Make sure the selection only has one range. Returns a selection
  holding only the main range from this selection.
  */
  asSingle() {
    return this.ranges.length == 1 ? this : new b([this.main], 0);
  }
  /**
  Extend this selection with an extra range.
  */
  addRange(e, t = !0) {
    return b.create([e].concat(this.ranges), t ? 0 : this.mainIndex + 1);
  }
  /**
  Replace a given range with another range, and then normalize the
  selection to merge and sort ranges if necessary.
  */
  replaceRange(e, t = this.mainIndex) {
    let i = this.ranges.slice();
    return i[t] = e, b.create(i, this.mainIndex);
  }
  /**
  Convert this selection to an object that can be serialized to
  JSON.
  */
  toJSON() {
    return { ranges: this.ranges.map((e) => e.toJSON()), main: this.mainIndex };
  }
  /**
  Create a selection from a JSON representation.
  */
  static fromJSON(e) {
    if (!e || !Array.isArray(e.ranges) || typeof e.main != "number" || e.main >= e.ranges.length)
      throw new RangeError("Invalid JSON representation for EditorSelection");
    return new b(e.ranges.map((t) => Pt.fromJSON(t)), e.main);
  }
  /**
  Create a selection holding a single range.
  */
  static single(e, t = e) {
    return new b([b.range(e, t)], 0);
  }
  /**
  Sort and merge the given set of ranges, creating a valid
  selection.
  */
  static create(e, t = 0) {
    if (e.length == 0)
      throw new RangeError("A selection needs at least one range");
    for (let i = 0, s = 0; s < e.length; s++) {
      let r = e[s];
      if (r.empty ? r.from <= i : r.from < i)
        return b.normalized(e.slice(), t);
      i = r.to;
    }
    return new b(e, t);
  }
  /**
  Create a cursor selection range at the given position. You can
  safely ignore the optional arguments in most situations.
  */
  static cursor(e, t = 0, i, s) {
    return Pt.create(e, e, (t == 0 ? 0 : t < 0 ? 8 : 16) | (i == null ? 7 : Math.min(6, i)) | (s ?? 16777215) << 6);
  }
  /**
  Create a selection range.
  */
  static range(e, t, i, s) {
    let r = (i ?? 16777215) << 6 | (s == null ? 7 : Math.min(6, s));
    return t < e ? Pt.create(t, e, 48 | r) : Pt.create(e, t, (t > e ? 8 : 0) | r);
  }
  /**
  @internal
  */
  static normalized(e, t = 0) {
    let i = e[t];
    e.sort((s, r) => s.from - r.from), t = e.indexOf(i);
    for (let s = 1; s < e.length; s++) {
      let r = e[s], o = e[s - 1];
      if (r.empty ? r.from <= o.to : r.from < o.to) {
        let l = o.from, a = Math.max(r.to, o.to);
        s <= t && t--, e.splice(--s, 2, r.anchor > r.head ? b.range(a, l) : b.range(l, a));
      }
    }
    return new b(e, t);
  }
}
function ha(n, e) {
  for (let t of n.ranges)
    if (t.to > e)
      throw new RangeError("Selection points outside of document");
}
let Br = 0;
class M {
  constructor(e, t, i, s, r) {
    this.combine = e, this.compareInput = t, this.compare = i, this.isStatic = s, this.id = Br++, this.default = e([]), this.extensions = typeof r == "function" ? r(this) : r;
  }
  /**
  Returns a facet reader for this facet, which can be used to
  [read](https://codemirror.net/6/docs/ref/#state.EditorState.facet) it but not to define values for it.
  */
  get reader() {
    return this;
  }
  /**
  Define a new facet.
  */
  static define(e = {}) {
    return new M(e.combine || ((t) => t), e.compareInput || ((t, i) => t === i), e.compare || (e.combine ? (t, i) => t === i : Er), !!e.static, e.enables);
  }
  /**
  Returns an extension that adds the given value to this facet.
  */
  of(e) {
    return new un([], this, 0, e);
  }
  /**
  Create an extension that computes a value for the facet from a
  state. You must take care to declare the parts of the state that
  this value depends on, since your function is only called again
  for a new state when one of those parts changed.
  
  In cases where your value depends only on a single field, you'll
  want to use the [`from`](https://codemirror.net/6/docs/ref/#state.Facet.from) method instead.
  */
  compute(e, t) {
    if (this.isStatic)
      throw new Error("Can't compute a static facet");
    return new un(e, this, 1, t);
  }
  /**
  Create an extension that computes zero or more values for this
  facet from a state.
  */
  computeN(e, t) {
    if (this.isStatic)
      throw new Error("Can't compute a static facet");
    return new un(e, this, 2, t);
  }
  from(e, t) {
    return t || (t = (i) => i), this.compute([e], (i) => t(i.field(e)));
  }
}
function Er(n, e) {
  return n == e || n.length == e.length && n.every((t, i) => t === e[i]);
}
class un {
  constructor(e, t, i, s) {
    this.dependencies = e, this.facet = t, this.type = i, this.value = s, this.id = Br++;
  }
  dynamicSlot(e) {
    var t;
    let i = this.value, s = this.facet.compareInput, r = this.id, o = e[r] >> 1, l = this.type == 2, a = !1, h = !1, c = [];
    for (let f of this.dependencies)
      f == "doc" ? a = !0 : f == "selection" ? h = !0 : ((t = e[f.id]) !== null && t !== void 0 ? t : 1) & 1 || c.push(e[f.id]);
    return {
      create(f) {
        return f.values[o] = i(f), 1;
      },
      update(f, u) {
        if (a && u.docChanged || h && (u.docChanged || u.selection) || Qs(f, c)) {
          let d = i(f);
          if (l ? !uo(d, f.values[o], s) : !s(d, f.values[o]))
            return f.values[o] = d, 1;
        }
        return 0;
      },
      reconfigure: (f, u) => {
        let d, p = u.config.address[r];
        if (p != null) {
          let g = Sn(u, p);
          if (this.dependencies.every((m) => m instanceof M ? u.facet(m) === f.facet(m) : m instanceof he ? u.field(m, !1) == f.field(m, !1) : !0) || (l ? uo(d = i(f), g, s) : s(d = i(f), g)))
            return f.values[o] = g, 0;
        } else
          d = i(f);
        return f.values[o] = d, 1;
      }
    };
  }
}
function uo(n, e, t) {
  if (n.length != e.length)
    return !1;
  for (let i = 0; i < n.length; i++)
    if (!t(n[i], e[i]))
      return !1;
  return !0;
}
function Qs(n, e) {
  let t = !1;
  for (let i of e)
    yi(n, i) & 1 && (t = !0);
  return t;
}
function lf(n, e, t) {
  let i = t.map((a) => n[a.id]), s = t.map((a) => a.type), r = i.filter((a) => !(a & 1)), o = n[e.id] >> 1;
  function l(a) {
    let h = [];
    for (let c = 0; c < i.length; c++) {
      let f = Sn(a, i[c]);
      if (s[c] == 2)
        for (let u of f)
          h.push(u);
      else
        h.push(f);
    }
    return e.combine(h);
  }
  return {
    create(a) {
      for (let h of i)
        yi(a, h);
      return a.values[o] = l(a), 1;
    },
    update(a, h) {
      if (!Qs(a, r))
        return 0;
      let c = l(a);
      return e.compare(c, a.values[o]) ? 0 : (a.values[o] = c, 1);
    },
    reconfigure(a, h) {
      let c = Qs(a, i), f = h.config.facets[e.id], u = h.facet(e);
      if (f && !c && Er(t, f))
        return a.values[o] = u, 0;
      let d = l(a);
      return e.compare(d, u) ? (a.values[o] = u, 0) : (a.values[o] = d, 1);
    }
  };
}
const po = /* @__PURE__ */ M.define({ static: !0 });
class he {
  constructor(e, t, i, s, r) {
    this.id = e, this.createF = t, this.updateF = i, this.compareF = s, this.spec = r, this.provides = void 0;
  }
  /**
  Define a state field.
  */
  static define(e) {
    let t = new he(Br++, e.create, e.update, e.compare || ((i, s) => i === s), e);
    return e.provide && (t.provides = e.provide(t)), t;
  }
  create(e) {
    let t = e.facet(po).find((i) => i.field == this);
    return ((t == null ? void 0 : t.create) || this.createF)(e);
  }
  /**
  @internal
  */
  slot(e) {
    let t = e[this.id] >> 1;
    return {
      create: (i) => (i.values[t] = this.create(i), 1),
      update: (i, s) => {
        let r = i.values[t], o = this.updateF(r, s);
        return this.compareF(r, o) ? 0 : (i.values[t] = o, 1);
      },
      reconfigure: (i, s) => s.config.address[this.id] != null ? (i.values[t] = s.field(this), 0) : (i.values[t] = this.create(i), 1)
    };
  }
  /**
  Returns an extension that enables this field and overrides the
  way it is initialized. Can be useful when you need to provide a
  non-default starting value for the field.
  */
  init(e) {
    return [this, po.of({ field: this, create: e })];
  }
  /**
  State field instances can be used as
  [`Extension`](https://codemirror.net/6/docs/ref/#state.Extension) values to enable the field in a
  given state.
  */
  get extension() {
    return this;
  }
}
const Mt = { lowest: 4, low: 3, default: 2, high: 1, highest: 0 };
function si(n) {
  return (e) => new ca(e, n);
}
const ei = {
  /**
  The highest precedence level, for extensions that should end up
  near the start of the precedence ordering.
  */
  highest: /* @__PURE__ */ si(Mt.highest),
  /**
  A higher-than-default precedence, for extensions that should
  come before those with default precedence.
  */
  high: /* @__PURE__ */ si(Mt.high),
  /**
  The default precedence, which is also used for extensions
  without an explicit precedence.
  */
  default: /* @__PURE__ */ si(Mt.default),
  /**
  A lower-than-default precedence.
  */
  low: /* @__PURE__ */ si(Mt.low),
  /**
  The lowest precedence level. Meant for things that should end up
  near the end of the extension order.
  */
  lowest: /* @__PURE__ */ si(Mt.lowest)
};
class ca {
  constructor(e, t) {
    this.inner = e, this.prec = t;
  }
}
class Kn {
  /**
  Create an instance of this compartment to add to your [state
  configuration](https://codemirror.net/6/docs/ref/#state.EditorStateConfig.extensions).
  */
  of(e) {
    return new zs(this, e);
  }
  /**
  Create an [effect](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) that
  reconfigures this compartment.
  */
  reconfigure(e) {
    return Kn.reconfigure.of({ compartment: this, extension: e });
  }
  /**
  Get the current content of the compartment in the state, or
  `undefined` if it isn't present.
  */
  get(e) {
    return e.config.compartments.get(this);
  }
}
class zs {
  constructor(e, t) {
    this.compartment = e, this.inner = t;
  }
}
class On {
  constructor(e, t, i, s, r, o) {
    for (this.base = e, this.compartments = t, this.dynamicSlots = i, this.address = s, this.staticValues = r, this.facets = o, this.statusTemplate = []; this.statusTemplate.length < i.length; )
      this.statusTemplate.push(
        0
        /* SlotStatus.Unresolved */
      );
  }
  staticFacet(e) {
    let t = this.address[e.id];
    return t == null ? e.default : this.staticValues[t >> 1];
  }
  static resolve(e, t, i) {
    let s = [], r = /* @__PURE__ */ Object.create(null), o = /* @__PURE__ */ new Map();
    for (let u of af(e, t, o))
      u instanceof he ? s.push(u) : (r[u.facet.id] || (r[u.facet.id] = [])).push(u);
    let l = /* @__PURE__ */ Object.create(null), a = [], h = [];
    for (let u of s)
      l[u.id] = h.length << 1, h.push((d) => u.slot(d));
    let c = i == null ? void 0 : i.config.facets;
    for (let u in r) {
      let d = r[u], p = d[0].facet, g = c && c[u] || [];
      if (d.every(
        (m) => m.type == 0
        /* Provider.Static */
      ))
        if (l[p.id] = a.length << 1 | 1, Er(g, d))
          a.push(i.facet(p));
        else {
          let m = p.combine(d.map((y) => y.value));
          a.push(i && p.compare(m, i.facet(p)) ? i.facet(p) : m);
        }
      else {
        for (let m of d)
          m.type == 0 ? (l[m.id] = a.length << 1 | 1, a.push(m.value)) : (l[m.id] = h.length << 1, h.push((y) => m.dynamicSlot(y)));
        l[p.id] = h.length << 1, h.push((m) => lf(m, p, d));
      }
    }
    let f = h.map((u) => u(l));
    return new On(e, o, f, l, a, r);
  }
}
function af(n, e, t) {
  let i = [[], [], [], [], []], s = /* @__PURE__ */ new Map();
  function r(o, l) {
    let a = s.get(o);
    if (a != null) {
      if (a <= l)
        return;
      let h = i[a].indexOf(o);
      h > -1 && i[a].splice(h, 1), o instanceof zs && t.delete(o.compartment);
    }
    if (s.set(o, l), Array.isArray(o))
      for (let h of o)
        r(h, l);
    else if (o instanceof zs) {
      if (t.has(o.compartment))
        throw new RangeError("Duplicate use of compartment in extensions");
      let h = e.get(o.compartment) || o.inner;
      t.set(o.compartment, h), r(h, l);
    } else if (o instanceof ca)
      r(o.inner, o.prec);
    else if (o instanceof he)
      i[l].push(o), o.provides && r(o.provides, l);
    else if (o instanceof un)
      i[l].push(o), o.facet.extensions && r(o.facet.extensions, Mt.default);
    else {
      let h = o.extension;
      if (!h)
        throw new Error(`Unrecognized extension value in extension set (${o}). This sometimes happens because multiple instances of @codemirror/state are loaded, breaking instanceof checks.`);
      r(h, l);
    }
  }
  return r(n, Mt.default), i.reduce((o, l) => o.concat(l));
}
function yi(n, e) {
  if (e & 1)
    return 2;
  let t = e >> 1, i = n.status[t];
  if (i == 4)
    throw new Error("Cyclic dependency between fields and/or facets");
  if (i & 2)
    return i;
  n.status[t] = 4;
  let s = n.computeSlot(n, n.config.dynamicSlots[t]);
  return n.status[t] = 2 | s;
}
function Sn(n, e) {
  return e & 1 ? n.config.staticValues[e >> 1] : n.values[e >> 1];
}
const fa = /* @__PURE__ */ M.define(), Fs = /* @__PURE__ */ M.define({
  combine: (n) => n.some((e) => e),
  static: !0
}), ua = /* @__PURE__ */ M.define({
  combine: (n) => n.length ? n[0] : void 0,
  static: !0
}), da = /* @__PURE__ */ M.define(), pa = /* @__PURE__ */ M.define(), ma = /* @__PURE__ */ M.define(), ga = /* @__PURE__ */ M.define({
  combine: (n) => n.length ? n[0] : !1
});
class ot {
  /**
  @internal
  */
  constructor(e, t) {
    this.type = e, this.value = t;
  }
  /**
  Define a new type of annotation.
  */
  static define() {
    return new hf();
  }
}
class hf {
  /**
  Create an instance of this annotation.
  */
  of(e) {
    return new ot(this, e);
  }
}
class cf {
  /**
  @internal
  */
  constructor(e) {
    this.map = e;
  }
  /**
  Create a [state effect](https://codemirror.net/6/docs/ref/#state.StateEffect) instance of this
  type.
  */
  of(e) {
    return new E(this, e);
  }
}
class E {
  /**
  @internal
  */
  constructor(e, t) {
    this.type = e, this.value = t;
  }
  /**
  Map this effect through a position mapping. Will return
  `undefined` when that ends up deleting the effect.
  */
  map(e) {
    let t = this.type.map(this.value, e);
    return t === void 0 ? void 0 : t == this.value ? this : new E(this.type, t);
  }
  /**
  Tells you whether this effect object is of a given
  [type](https://codemirror.net/6/docs/ref/#state.StateEffectType).
  */
  is(e) {
    return this.type == e;
  }
  /**
  Define a new effect type. The type parameter indicates the type
  of values that his effect holds. It should be a type that
  doesn't include `undefined`, since that is used in
  [mapping](https://codemirror.net/6/docs/ref/#state.StateEffect.map) to indicate that an effect is
  removed.
  */
  static define(e = {}) {
    return new cf(e.map || ((t) => t));
  }
  /**
  Map an array of effects through a change set.
  */
  static mapEffects(e, t) {
    if (!e.length)
      return e;
    let i = [];
    for (let s of e) {
      let r = s.map(t);
      r && i.push(r);
    }
    return i;
  }
}
E.reconfigure = /* @__PURE__ */ E.define();
E.appendConfig = /* @__PURE__ */ E.define();
class ne {
  constructor(e, t, i, s, r, o) {
    this.startState = e, this.changes = t, this.selection = i, this.effects = s, this.annotations = r, this.scrollIntoView = o, this._doc = null, this._state = null, i && ha(i, t.newLength), r.some((l) => l.type == ne.time) || (this.annotations = r.concat(ne.time.of(Date.now())));
  }
  /**
  @internal
  */
  static create(e, t, i, s, r, o) {
    return new ne(e, t, i, s, r, o);
  }
  /**
  The new document produced by the transaction. Contrary to
  [`.state`](https://codemirror.net/6/docs/ref/#state.Transaction.state)`.doc`, accessing this won't
  force the entire new state to be computed right away, so it is
  recommended that [transaction
  filters](https://codemirror.net/6/docs/ref/#state.EditorState^transactionFilter) use this getter
  when they need to look at the new document.
  */
  get newDoc() {
    return this._doc || (this._doc = this.changes.apply(this.startState.doc));
  }
  /**
  The new selection produced by the transaction. If
  [`this.selection`](https://codemirror.net/6/docs/ref/#state.Transaction.selection) is undefined,
  this will [map](https://codemirror.net/6/docs/ref/#state.EditorSelection.map) the start state's
  current selection through the changes made by the transaction.
  */
  get newSelection() {
    return this.selection || this.startState.selection.map(this.changes);
  }
  /**
  The new state created by the transaction. Computed on demand
  (but retained for subsequent access), so it is recommended not to
  access it in [transaction
  filters](https://codemirror.net/6/docs/ref/#state.EditorState^transactionFilter) when possible.
  */
  get state() {
    return this._state || this.startState.applyTransaction(this), this._state;
  }
  /**
  Get the value of the given annotation type, if any.
  */
  annotation(e) {
    for (let t of this.annotations)
      if (t.type == e)
        return t.value;
  }
  /**
  Indicates whether the transaction changed the document.
  */
  get docChanged() {
    return !this.changes.empty;
  }
  /**
  Indicates whether this transaction reconfigures the state
  (through a [configuration compartment](https://codemirror.net/6/docs/ref/#state.Compartment) or
  with a top-level configuration
  [effect](https://codemirror.net/6/docs/ref/#state.StateEffect^reconfigure).
  */
  get reconfigured() {
    return this.startState.config != this.state.config;
  }
  /**
  Returns true if the transaction has a [user
  event](https://codemirror.net/6/docs/ref/#state.Transaction^userEvent) annotation that is equal to
  or more specific than `event`. For example, if the transaction
  has `"select.pointer"` as user event, `"select"` and
  `"select.pointer"` will match it.
  */
  isUserEvent(e) {
    let t = this.annotation(ne.userEvent);
    return !!(t && (t == e || t.length > e.length && t.slice(0, e.length) == e && t[e.length] == "."));
  }
}
ne.time = /* @__PURE__ */ ot.define();
ne.userEvent = /* @__PURE__ */ ot.define();
ne.addToHistory = /* @__PURE__ */ ot.define();
ne.remote = /* @__PURE__ */ ot.define();
function ff(n, e) {
  let t = [];
  for (let i = 0, s = 0; ; ) {
    let r, o;
    if (i < n.length && (s == e.length || e[s] >= n[i]))
      r = n[i++], o = n[i++];
    else if (s < e.length)
      r = e[s++], o = e[s++];
    else
      return t;
    !t.length || t[t.length - 1] < r ? t.push(r, o) : t[t.length - 1] < o && (t[t.length - 1] = o);
  }
}
function ya(n, e, t) {
  var i;
  let s, r, o;
  return t ? (s = e.changes, r = te.empty(e.changes.length), o = n.changes.compose(e.changes)) : (s = e.changes.map(n.changes), r = n.changes.mapDesc(e.changes, !0), o = n.changes.compose(s)), {
    changes: o,
    selection: e.selection ? e.selection.map(r) : (i = n.selection) === null || i === void 0 ? void 0 : i.map(s),
    effects: E.mapEffects(n.effects, s).concat(E.mapEffects(e.effects, r)),
    annotations: n.annotations.length ? n.annotations.concat(e.annotations) : e.annotations,
    scrollIntoView: n.scrollIntoView || e.scrollIntoView
  };
}
function Vs(n, e, t) {
  let i = e.selection, s = Ht(e.annotations);
  return e.userEvent && (s = s.concat(ne.userEvent.of(e.userEvent))), {
    changes: e.changes instanceof te ? e.changes : te.of(e.changes || [], t, n.facet(ua)),
    selection: i && (i instanceof b ? i : b.single(i.anchor, i.head)),
    effects: Ht(e.effects),
    annotations: s,
    scrollIntoView: !!e.scrollIntoView
  };
}
function ba(n, e, t) {
  let i = Vs(n, e.length ? e[0] : {}, n.doc.length);
  e.length && e[0].filter === !1 && (t = !1);
  for (let r = 1; r < e.length; r++) {
    e[r].filter === !1 && (t = !1);
    let o = !!e[r].sequential;
    i = ya(i, Vs(n, e[r], o ? i.changes.newLength : n.doc.length), o);
  }
  let s = ne.create(n, i.changes, i.selection, i.effects, i.annotations, i.scrollIntoView);
  return df(t ? uf(s) : s);
}
function uf(n) {
  let e = n.startState, t = !0;
  for (let s of e.facet(da)) {
    let r = s(n);
    if (r === !1) {
      t = !1;
      break;
    }
    Array.isArray(r) && (t = t === !0 ? r : ff(t, r));
  }
  if (t !== !0) {
    let s, r;
    if (t === !1)
      r = n.changes.invertedDesc, s = te.empty(e.doc.length);
    else {
      let o = n.changes.filter(t);
      s = o.changes, r = o.filtered.mapDesc(o.changes).invertedDesc;
    }
    n = ne.create(e, s, n.selection && n.selection.map(r), E.mapEffects(n.effects, r), n.annotations, n.scrollIntoView);
  }
  let i = e.facet(pa);
  for (let s = i.length - 1; s >= 0; s--) {
    let r = i[s](n);
    r instanceof ne ? n = r : Array.isArray(r) && r.length == 1 && r[0] instanceof ne ? n = r[0] : n = ba(e, Ht(r), !1);
  }
  return n;
}
function df(n) {
  let e = n.startState, t = e.facet(ma), i = n;
  for (let s = t.length - 1; s >= 0; s--) {
    let r = t[s](n);
    r && Object.keys(r).length && (i = ya(i, Vs(e, r, n.changes.newLength), !0));
  }
  return i == n ? n : ne.create(e, n.changes, n.selection, i.effects, i.annotations, i.scrollIntoView);
}
const pf = [];
function Ht(n) {
  return n == null ? pf : Array.isArray(n) ? n : [n];
}
var j = /* @__PURE__ */ function(n) {
  return n[n.Word = 0] = "Word", n[n.Space = 1] = "Space", n[n.Other = 2] = "Other", n;
}(j || (j = {}));
const mf = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
let Hs;
try {
  Hs = /* @__PURE__ */ new RegExp("[\\p{Alphabetic}\\p{Number}_]", "u");
} catch {
}
function gf(n) {
  if (Hs)
    return Hs.test(n);
  for (let e = 0; e < n.length; e++) {
    let t = n[e];
    if (/\w/.test(t) || t > "" && (t.toUpperCase() != t.toLowerCase() || mf.test(t)))
      return !0;
  }
  return !1;
}
function yf(n) {
  return (e) => {
    if (!/\S/.test(e))
      return j.Space;
    if (gf(e))
      return j.Word;
    for (let t = 0; t < n.length; t++)
      if (e.indexOf(n[t]) > -1)
        return j.Word;
    return j.Other;
  };
}
class $ {
  constructor(e, t, i, s, r, o) {
    this.config = e, this.doc = t, this.selection = i, this.values = s, this.status = e.statusTemplate.slice(), this.computeSlot = r, o && (o._state = this);
    for (let l = 0; l < this.config.dynamicSlots.length; l++)
      yi(this, l << 1);
    this.computeSlot = null;
  }
  field(e, t = !0) {
    let i = this.config.address[e.id];
    if (i == null) {
      if (t)
        throw new RangeError("Field is not present in this state");
      return;
    }
    return yi(this, i), Sn(this, i);
  }
  /**
  Create a [transaction](https://codemirror.net/6/docs/ref/#state.Transaction) that updates this
  state. Any number of [transaction specs](https://codemirror.net/6/docs/ref/#state.TransactionSpec)
  can be passed. Unless
  [`sequential`](https://codemirror.net/6/docs/ref/#state.TransactionSpec.sequential) is set, the
  [changes](https://codemirror.net/6/docs/ref/#state.TransactionSpec.changes) (if any) of each spec
  are assumed to start in the _current_ document (not the document
  produced by previous specs), and its
  [selection](https://codemirror.net/6/docs/ref/#state.TransactionSpec.selection) and
  [effects](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) are assumed to refer
  to the document created by its _own_ changes. The resulting
  transaction contains the combined effect of all the different
  specs. For [selection](https://codemirror.net/6/docs/ref/#state.TransactionSpec.selection), later
  specs take precedence over earlier ones.
  */
  update(...e) {
    return ba(this, e, !0);
  }
  /**
  @internal
  */
  applyTransaction(e) {
    let t = this.config, { base: i, compartments: s } = t;
    for (let l of e.effects)
      l.is(Kn.reconfigure) ? (t && (s = /* @__PURE__ */ new Map(), t.compartments.forEach((a, h) => s.set(h, a)), t = null), s.set(l.value.compartment, l.value.extension)) : l.is(E.reconfigure) ? (t = null, i = l.value) : l.is(E.appendConfig) && (t = null, i = Ht(i).concat(l.value));
    let r;
    t ? r = e.startState.values.slice() : (t = On.resolve(i, s, this), r = new $(t, this.doc, this.selection, t.dynamicSlots.map(() => null), (a, h) => h.reconfigure(a, this), null).values);
    let o = e.startState.facet(Fs) ? e.newSelection : e.newSelection.asSingle();
    new $(t, e.newDoc, o, r, (l, a) => a.update(l, e), e);
  }
  /**
  Create a [transaction spec](https://codemirror.net/6/docs/ref/#state.TransactionSpec) that
  replaces every selection range with the given content.
  */
  replaceSelection(e) {
    return typeof e == "string" && (e = this.toText(e)), this.changeByRange((t) => ({
      changes: { from: t.from, to: t.to, insert: e },
      range: b.cursor(t.from + e.length)
    }));
  }
  /**
  Create a set of changes and a new selection by running the given
  function for each range in the active selection. The function
  can return an optional set of changes (in the coordinate space
  of the start document), plus an updated range (in the coordinate
  space of the document produced by the call's own changes). This
  method will merge all the changes and ranges into a single
  changeset and selection, and return it as a [transaction
  spec](https://codemirror.net/6/docs/ref/#state.TransactionSpec), which can be passed to
  [`update`](https://codemirror.net/6/docs/ref/#state.EditorState.update).
  */
  changeByRange(e) {
    let t = this.selection, i = e(t.ranges[0]), s = this.changes(i.changes), r = [i.range], o = Ht(i.effects);
    for (let l = 1; l < t.ranges.length; l++) {
      let a = e(t.ranges[l]), h = this.changes(a.changes), c = h.map(s);
      for (let u = 0; u < l; u++)
        r[u] = r[u].map(c);
      let f = s.mapDesc(h, !0);
      r.push(a.range.map(f)), s = s.compose(c), o = E.mapEffects(o, c).concat(E.mapEffects(Ht(a.effects), f));
    }
    return {
      changes: s,
      selection: b.create(r, t.mainIndex),
      effects: o
    };
  }
  /**
  Create a [change set](https://codemirror.net/6/docs/ref/#state.ChangeSet) from the given change
  description, taking the state's document length and line
  separator into account.
  */
  changes(e = []) {
    return e instanceof te ? e : te.of(e, this.doc.length, this.facet($.lineSeparator));
  }
  /**
  Using the state's [line
  separator](https://codemirror.net/6/docs/ref/#state.EditorState^lineSeparator), create a
  [`Text`](https://codemirror.net/6/docs/ref/#state.Text) instance from the given string.
  */
  toText(e) {
    return z.of(e.split(this.facet($.lineSeparator) || Is));
  }
  /**
  Return the given range of the document as a string.
  */
  sliceDoc(e = 0, t = this.doc.length) {
    return this.doc.sliceString(e, t, this.lineBreak);
  }
  /**
  Get the value of a state [facet](https://codemirror.net/6/docs/ref/#state.Facet).
  */
  facet(e) {
    let t = this.config.address[e.id];
    return t == null ? e.default : (yi(this, t), Sn(this, t));
  }
  /**
  Convert this state to a JSON-serializable object. When custom
  fields should be serialized, you can pass them in as an object
  mapping property names (in the resulting object, which should
  not use `doc` or `selection`) to fields.
  */
  toJSON(e) {
    let t = {
      doc: this.sliceDoc(),
      selection: this.selection.toJSON()
    };
    if (e)
      for (let i in e) {
        let s = e[i];
        s instanceof he && this.config.address[s.id] != null && (t[i] = s.spec.toJSON(this.field(e[i]), this));
      }
    return t;
  }
  /**
  Deserialize a state from its JSON representation. When custom
  fields should be deserialized, pass the same object you passed
  to [`toJSON`](https://codemirror.net/6/docs/ref/#state.EditorState.toJSON) when serializing as
  third argument.
  */
  static fromJSON(e, t = {}, i) {
    if (!e || typeof e.doc != "string")
      throw new RangeError("Invalid JSON representation for EditorState");
    let s = [];
    if (i) {
      for (let r in i)
        if (Object.prototype.hasOwnProperty.call(e, r)) {
          let o = i[r], l = e[r];
          s.push(o.init((a) => o.spec.fromJSON(l, a)));
        }
    }
    return $.create({
      doc: e.doc,
      selection: b.fromJSON(e.selection),
      extensions: t.extensions ? s.concat([t.extensions]) : s
    });
  }
  /**
  Create a new state. You'll usually only need this when
  initializing an editor—updated states are created by applying
  transactions.
  */
  static create(e = {}) {
    let t = On.resolve(e.extensions || [], /* @__PURE__ */ new Map()), i = e.doc instanceof z ? e.doc : z.of((e.doc || "").split(t.staticFacet($.lineSeparator) || Is)), s = e.selection ? e.selection instanceof b ? e.selection : b.single(e.selection.anchor, e.selection.head) : b.single(0);
    return ha(s, i.length), t.staticFacet(Fs) || (s = s.asSingle()), new $(t, i, s, t.dynamicSlots.map(() => null), (r, o) => o.create(r), null);
  }
  /**
  The size (in columns) of a tab in the document, determined by
  the [`tabSize`](https://codemirror.net/6/docs/ref/#state.EditorState^tabSize) facet.
  */
  get tabSize() {
    return this.facet($.tabSize);
  }
  /**
  Get the proper [line-break](https://codemirror.net/6/docs/ref/#state.EditorState^lineSeparator)
  string for this state.
  */
  get lineBreak() {
    return this.facet($.lineSeparator) || `
`;
  }
  /**
  Returns true when the editor is
  [configured](https://codemirror.net/6/docs/ref/#state.EditorState^readOnly) to be read-only.
  */
  get readOnly() {
    return this.facet(ga);
  }
  /**
  Look up a translation for the given phrase (via the
  [`phrases`](https://codemirror.net/6/docs/ref/#state.EditorState^phrases) facet), or return the
  original string if no translation is found.
  
  If additional arguments are passed, they will be inserted in
  place of markers like `$1` (for the first value) and `$2`, etc.
  A single `$` is equivalent to `$1`, and `$$` will produce a
  literal dollar sign.
  */
  phrase(e, ...t) {
    for (let i of this.facet($.phrases))
      if (Object.prototype.hasOwnProperty.call(i, e)) {
        e = i[e];
        break;
      }
    return t.length && (e = e.replace(/\$(\$|\d*)/g, (i, s) => {
      if (s == "$")
        return "$";
      let r = +(s || 1);
      return !r || r > t.length ? i : t[r - 1];
    })), e;
  }
  /**
  Find the values for a given language data field, provided by the
  the [`languageData`](https://codemirror.net/6/docs/ref/#state.EditorState^languageData) facet.
  
  Examples of language data fields are...
  
  - [`"commentTokens"`](https://codemirror.net/6/docs/ref/#commands.CommentTokens) for specifying
    comment syntax.
  - [`"autocomplete"`](https://codemirror.net/6/docs/ref/#autocomplete.autocompletion^config.override)
    for providing language-specific completion sources.
  - [`"wordChars"`](https://codemirror.net/6/docs/ref/#state.EditorState.charCategorizer) for adding
    characters that should be considered part of words in this
    language.
  - [`"closeBrackets"`](https://codemirror.net/6/docs/ref/#autocomplete.CloseBracketConfig) controls
    bracket closing behavior.
  */
  languageDataAt(e, t, i = -1) {
    let s = [];
    for (let r of this.facet(fa))
      for (let o of r(this, t, i))
        Object.prototype.hasOwnProperty.call(o, e) && s.push(o[e]);
    return s;
  }
  /**
  Return a function that can categorize strings (expected to
  represent a single [grapheme cluster](https://codemirror.net/6/docs/ref/#state.findClusterBreak))
  into one of:
  
   - Word (contains an alphanumeric character or a character
     explicitly listed in the local language's `"wordChars"`
     language data, which should be a string)
   - Space (contains only whitespace)
   - Other (anything else)
  */
  charCategorizer(e) {
    return yf(this.languageDataAt("wordChars", e).join(""));
  }
  /**
  Find the word at the given position, meaning the range
  containing all [word](https://codemirror.net/6/docs/ref/#state.CharCategory.Word) characters
  around it. If no word characters are adjacent to the position,
  this returns null.
  */
  wordAt(e) {
    let { text: t, from: i, length: s } = this.doc.lineAt(e), r = this.charCategorizer(e), o = e - i, l = e - i;
    for (; o > 0; ) {
      let a = le(t, o, !1);
      if (r(t.slice(a, o)) != j.Word)
        break;
      o = a;
    }
    for (; l < s; ) {
      let a = le(t, l);
      if (r(t.slice(l, a)) != j.Word)
        break;
      l = a;
    }
    return o == l ? null : b.range(o + i, l + i);
  }
}
$.allowMultipleSelections = Fs;
$.tabSize = /* @__PURE__ */ M.define({
  combine: (n) => n.length ? n[0] : 4
});
$.lineSeparator = ua;
$.readOnly = ga;
$.phrases = /* @__PURE__ */ M.define({
  compare(n, e) {
    let t = Object.keys(n), i = Object.keys(e);
    return t.length == i.length && t.every((s) => n[s] == e[s]);
  }
});
$.languageData = fa;
$.changeFilter = da;
$.transactionFilter = pa;
$.transactionExtender = ma;
Kn.reconfigure = /* @__PURE__ */ E.define();
function Je(n, e, t = {}) {
  let i = {};
  for (let s of n)
    for (let r of Object.keys(s)) {
      let o = s[r], l = i[r];
      if (l === void 0)
        i[r] = o;
      else if (!(l === o || o === void 0))
        if (Object.hasOwnProperty.call(t, r))
          i[r] = t[r](l, o);
        else
          throw new Error("Config merge conflict for field " + r);
    }
  for (let s in e)
    i[s] === void 0 && (i[s] = e[s]);
  return i;
}
class Bt {
  /**
  Compare this value with another value. Used when comparing
  rangesets. The default implementation compares by identity.
  Unless you are only creating a fixed number of unique instances
  of your value type, it is a good idea to implement this
  properly.
  */
  eq(e) {
    return this == e;
  }
  /**
  Create a [range](https://codemirror.net/6/docs/ref/#state.Range) with this value.
  */
  range(e, t = e) {
    return qs.create(e, t, this);
  }
}
Bt.prototype.startSide = Bt.prototype.endSide = 0;
Bt.prototype.point = !1;
Bt.prototype.mapMode = pe.TrackDel;
let qs = class xa {
  constructor(e, t, i) {
    this.from = e, this.to = t, this.value = i;
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new xa(e, t, i);
  }
};
function Us(n, e) {
  return n.from - e.from || n.value.startSide - e.value.startSide;
}
class Lr {
  constructor(e, t, i, s) {
    this.from = e, this.to = t, this.value = i, this.maxPoint = s;
  }
  get length() {
    return this.to[this.to.length - 1];
  }
  // Find the index of the given position and side. Use the ranges'
  // `from` pos when `end == false`, `to` when `end == true`.
  findIndex(e, t, i, s = 0) {
    let r = i ? this.to : this.from;
    for (let o = s, l = r.length; ; ) {
      if (o == l)
        return o;
      let a = o + l >> 1, h = r[a] - e || (i ? this.value[a].endSide : this.value[a].startSide) - t;
      if (a == o)
        return h >= 0 ? o : l;
      h >= 0 ? l = a : o = a + 1;
    }
  }
  between(e, t, i, s) {
    for (let r = this.findIndex(t, -1e9, !0), o = this.findIndex(i, 1e9, !1, r); r < o; r++)
      if (s(this.from[r] + e, this.to[r] + e, this.value[r]) === !1)
        return !1;
  }
  map(e, t) {
    let i = [], s = [], r = [], o = -1, l = -1;
    for (let a = 0; a < this.value.length; a++) {
      let h = this.value[a], c = this.from[a] + e, f = this.to[a] + e, u, d;
      if (c == f) {
        let p = t.mapPos(c, h.startSide, h.mapMode);
        if (p == null || (u = d = p, h.startSide != h.endSide && (d = t.mapPos(c, h.endSide), d < u)))
          continue;
      } else if (u = t.mapPos(c, h.startSide), d = t.mapPos(f, h.endSide), u > d || u == d && h.startSide > 0 && h.endSide <= 0)
        continue;
      (d - u || h.endSide - h.startSide) < 0 || (o < 0 && (o = u), h.point && (l = Math.max(l, d - u)), i.push(h), s.push(u - o), r.push(d - o));
    }
    return { mapped: i.length ? new Lr(s, r, i, l) : null, pos: o };
  }
}
class F {
  constructor(e, t, i, s) {
    this.chunkPos = e, this.chunk = t, this.nextLayer = i, this.maxPoint = s;
  }
  /**
  @internal
  */
  static create(e, t, i, s) {
    return new F(e, t, i, s);
  }
  /**
  @internal
  */
  get length() {
    let e = this.chunk.length - 1;
    return e < 0 ? 0 : Math.max(this.chunkEnd(e), this.nextLayer.length);
  }
  /**
  The number of ranges in the set.
  */
  get size() {
    if (this.isEmpty)
      return 0;
    let e = this.nextLayer.size;
    for (let t of this.chunk)
      e += t.value.length;
    return e;
  }
  /**
  @internal
  */
  chunkEnd(e) {
    return this.chunkPos[e] + this.chunk[e].length;
  }
  /**
  Update the range set, optionally adding new ranges or filtering
  out existing ones.
  
  (Note: The type parameter is just there as a kludge to work
  around TypeScript variance issues that prevented `RangeSet<X>`
  from being a subtype of `RangeSet<Y>` when `X` is a subtype of
  `Y`.)
  */
  update(e) {
    let { add: t = [], sort: i = !1, filterFrom: s = 0, filterTo: r = this.length } = e, o = e.filter;
    if (t.length == 0 && !o)
      return this;
    if (i && (t = t.slice().sort(Us)), this.isEmpty)
      return t.length ? F.of(t) : this;
    let l = new wa(this, null, -1).goto(0), a = 0, h = [], c = new yt();
    for (; l.value || a < t.length; )
      if (a < t.length && (l.from - t[a].from || l.startSide - t[a].value.startSide) >= 0) {
        let f = t[a++];
        c.addInner(f.from, f.to, f.value) || h.push(f);
      } else
        l.rangeIndex == 1 && l.chunkIndex < this.chunk.length && (a == t.length || this.chunkEnd(l.chunkIndex) < t[a].from) && (!o || s > this.chunkEnd(l.chunkIndex) || r < this.chunkPos[l.chunkIndex]) && c.addChunk(this.chunkPos[l.chunkIndex], this.chunk[l.chunkIndex]) ? l.nextChunk() : ((!o || s > l.to || r < l.from || o(l.from, l.to, l.value)) && (c.addInner(l.from, l.to, l.value) || h.push(qs.create(l.from, l.to, l.value))), l.next());
    return c.finishInner(this.nextLayer.isEmpty && !h.length ? F.empty : this.nextLayer.update({ add: h, filter: o, filterFrom: s, filterTo: r }));
  }
  /**
  Map this range set through a set of changes, return the new set.
  */
  map(e) {
    if (e.empty || this.isEmpty)
      return this;
    let t = [], i = [], s = -1;
    for (let o = 0; o < this.chunk.length; o++) {
      let l = this.chunkPos[o], a = this.chunk[o], h = e.touchesRange(l, l + a.length);
      if (h === !1)
        s = Math.max(s, a.maxPoint), t.push(a), i.push(e.mapPos(l));
      else if (h === !0) {
        let { mapped: c, pos: f } = a.map(l, e);
        c && (s = Math.max(s, c.maxPoint), t.push(c), i.push(f));
      }
    }
    let r = this.nextLayer.map(e);
    return t.length == 0 ? r : new F(i, t, r || F.empty, s);
  }
  /**
  Iterate over the ranges that touch the region `from` to `to`,
  calling `f` for each. There is no guarantee that the ranges will
  be reported in any specific order. When the callback returns
  `false`, iteration stops.
  */
  between(e, t, i) {
    if (!this.isEmpty) {
      for (let s = 0; s < this.chunk.length; s++) {
        let r = this.chunkPos[s], o = this.chunk[s];
        if (t >= r && e <= r + o.length && o.between(r, e - r, t - r, i) === !1)
          return;
      }
      this.nextLayer.between(e, t, i);
    }
  }
  /**
  Iterate over the ranges in this set, in order, including all
  ranges that end at or after `from`.
  */
  iter(e = 0) {
    return ki.from([this]).goto(e);
  }
  /**
  @internal
  */
  get isEmpty() {
    return this.nextLayer == this;
  }
  /**
  Iterate over the ranges in a collection of sets, in order,
  starting from `from`.
  */
  static iter(e, t = 0) {
    return ki.from(e).goto(t);
  }
  /**
  Iterate over two groups of sets, calling methods on `comparator`
  to notify it of possible differences.
  */
  static compare(e, t, i, s, r = -1) {
    let o = e.filter((f) => f.maxPoint > 0 || !f.isEmpty && f.maxPoint >= r), l = t.filter((f) => f.maxPoint > 0 || !f.isEmpty && f.maxPoint >= r), a = mo(o, l, i), h = new ri(o, a, r), c = new ri(l, a, r);
    i.iterGaps((f, u, d) => go(h, f, c, u, d, s)), i.empty && i.length == 0 && go(h, 0, c, 0, 0, s);
  }
  /**
  Compare the contents of two groups of range sets, returning true
  if they are equivalent in the given range.
  */
  static eq(e, t, i = 0, s) {
    s == null && (s = 999999999);
    let r = e.filter((c) => !c.isEmpty && t.indexOf(c) < 0), o = t.filter((c) => !c.isEmpty && e.indexOf(c) < 0);
    if (r.length != o.length)
      return !1;
    if (!r.length)
      return !0;
    let l = mo(r, o), a = new ri(r, l, 0).goto(i), h = new ri(o, l, 0).goto(i);
    for (; ; ) {
      if (a.to != h.to || !Xs(a.active, h.active) || a.point && (!h.point || !a.point.eq(h.point)))
        return !1;
      if (a.to > s)
        return !0;
      a.next(), h.next();
    }
  }
  /**
  Iterate over a group of range sets at the same time, notifying
  the iterator about the ranges covering every given piece of
  content. Returns the open count (see
  [`SpanIterator.span`](https://codemirror.net/6/docs/ref/#state.SpanIterator.span)) at the end
  of the iteration.
  */
  static spans(e, t, i, s, r = -1) {
    let o = new ri(e, null, r).goto(t), l = t, a = o.openStart;
    for (; ; ) {
      let h = Math.min(o.to, i);
      if (o.point) {
        let c = o.activeForPoint(o.to), f = o.pointFrom < t ? c.length + 1 : Math.min(c.length, a);
        s.point(l, h, o.point, c, f, o.pointRank), a = Math.min(o.openEnd(h), c.length);
      } else
        h > l && (s.span(l, h, o.active, a), a = o.openEnd(h));
      if (o.to > i)
        return a + (o.point && o.to > i ? 1 : 0);
      l = o.to, o.next();
    }
  }
  /**
  Create a range set for the given range or array of ranges. By
  default, this expects the ranges to be _sorted_ (by start
  position and, if two start at the same position,
  `value.startSide`). You can pass `true` as second argument to
  cause the method to sort them.
  */
  static of(e, t = !1) {
    let i = new yt();
    for (let s of e instanceof qs ? [e] : t ? bf(e) : e)
      i.add(s.from, s.to, s.value);
    return i.finish();
  }
}
F.empty = /* @__PURE__ */ new F([], [], null, -1);
function bf(n) {
  if (n.length > 1)
    for (let e = n[0], t = 1; t < n.length; t++) {
      let i = n[t];
      if (Us(e, i) > 0)
        return n.slice().sort(Us);
      e = i;
    }
  return n;
}
F.empty.nextLayer = F.empty;
class yt {
  finishChunk(e) {
    this.chunks.push(new Lr(this.from, this.to, this.value, this.maxPoint)), this.chunkPos.push(this.chunkStart), this.chunkStart = -1, this.setMaxPoint = Math.max(this.setMaxPoint, this.maxPoint), this.maxPoint = -1, e && (this.from = [], this.to = [], this.value = []);
  }
  /**
  Create an empty builder.
  */
  constructor() {
    this.chunks = [], this.chunkPos = [], this.chunkStart = -1, this.last = null, this.lastFrom = -1e9, this.lastTo = -1e9, this.from = [], this.to = [], this.value = [], this.maxPoint = -1, this.setMaxPoint = -1, this.nextLayer = null;
  }
  /**
  Add a range. Ranges should be added in sorted (by `from` and
  `value.startSide`) order.
  */
  add(e, t, i) {
    this.addInner(e, t, i) || (this.nextLayer || (this.nextLayer = new yt())).add(e, t, i);
  }
  /**
  @internal
  */
  addInner(e, t, i) {
    let s = e - this.lastTo || i.startSide - this.last.endSide;
    if (s <= 0 && (e - this.lastFrom || i.startSide - this.last.startSide) < 0)
      throw new Error("Ranges must be added sorted by `from` position and `startSide`");
    return s < 0 ? !1 : (this.from.length == 250 && this.finishChunk(!0), this.chunkStart < 0 && (this.chunkStart = e), this.from.push(e - this.chunkStart), this.to.push(t - this.chunkStart), this.last = i, this.lastFrom = e, this.lastTo = t, this.value.push(i), i.point && (this.maxPoint = Math.max(this.maxPoint, t - e)), !0);
  }
  /**
  @internal
  */
  addChunk(e, t) {
    if ((e - this.lastTo || t.value[0].startSide - this.last.endSide) < 0)
      return !1;
    this.from.length && this.finishChunk(!0), this.setMaxPoint = Math.max(this.setMaxPoint, t.maxPoint), this.chunks.push(t), this.chunkPos.push(e);
    let i = t.value.length - 1;
    return this.last = t.value[i], this.lastFrom = t.from[i] + e, this.lastTo = t.to[i] + e, !0;
  }
  /**
  Finish the range set. Returns the new set. The builder can't be
  used anymore after this has been called.
  */
  finish() {
    return this.finishInner(F.empty);
  }
  /**
  @internal
  */
  finishInner(e) {
    if (this.from.length && this.finishChunk(!1), this.chunks.length == 0)
      return e;
    let t = F.create(this.chunkPos, this.chunks, this.nextLayer ? this.nextLayer.finishInner(e) : e, this.setMaxPoint);
    return this.from = null, t;
  }
}
function mo(n, e, t) {
  let i = /* @__PURE__ */ new Map();
  for (let r of n)
    for (let o = 0; o < r.chunk.length; o++)
      r.chunk[o].maxPoint <= 0 && i.set(r.chunk[o], r.chunkPos[o]);
  let s = /* @__PURE__ */ new Set();
  for (let r of e)
    for (let o = 0; o < r.chunk.length; o++) {
      let l = i.get(r.chunk[o]);
      l != null && (t ? t.mapPos(l) : l) == r.chunkPos[o] && !(t != null && t.touchesRange(l, l + r.chunk[o].length)) && s.add(r.chunk[o]);
    }
  return s;
}
class wa {
  constructor(e, t, i, s = 0) {
    this.layer = e, this.skip = t, this.minPoint = i, this.rank = s;
  }
  get startSide() {
    return this.value ? this.value.startSide : 0;
  }
  get endSide() {
    return this.value ? this.value.endSide : 0;
  }
  goto(e, t = -1e9) {
    return this.chunkIndex = this.rangeIndex = 0, this.gotoInner(e, t, !1), this;
  }
  gotoInner(e, t, i) {
    for (; this.chunkIndex < this.layer.chunk.length; ) {
      let s = this.layer.chunk[this.chunkIndex];
      if (!(this.skip && this.skip.has(s) || this.layer.chunkEnd(this.chunkIndex) < e || s.maxPoint < this.minPoint))
        break;
      this.chunkIndex++, i = !1;
    }
    if (this.chunkIndex < this.layer.chunk.length) {
      let s = this.layer.chunk[this.chunkIndex].findIndex(e - this.layer.chunkPos[this.chunkIndex], t, !0);
      (!i || this.rangeIndex < s) && this.setRangeIndex(s);
    }
    this.next();
  }
  forward(e, t) {
    (this.to - e || this.endSide - t) < 0 && this.gotoInner(e, t, !0);
  }
  next() {
    for (; ; )
      if (this.chunkIndex == this.layer.chunk.length) {
        this.from = this.to = 1e9, this.value = null;
        break;
      } else {
        let e = this.layer.chunkPos[this.chunkIndex], t = this.layer.chunk[this.chunkIndex], i = e + t.from[this.rangeIndex];
        if (this.from = i, this.to = e + t.to[this.rangeIndex], this.value = t.value[this.rangeIndex], this.setRangeIndex(this.rangeIndex + 1), this.minPoint < 0 || this.value.point && this.to - this.from >= this.minPoint)
          break;
      }
  }
  setRangeIndex(e) {
    if (e == this.layer.chunk[this.chunkIndex].value.length) {
      if (this.chunkIndex++, this.skip)
        for (; this.chunkIndex < this.layer.chunk.length && this.skip.has(this.layer.chunk[this.chunkIndex]); )
          this.chunkIndex++;
      this.rangeIndex = 0;
    } else
      this.rangeIndex = e;
  }
  nextChunk() {
    this.chunkIndex++, this.rangeIndex = 0, this.next();
  }
  compare(e) {
    return this.from - e.from || this.startSide - e.startSide || this.rank - e.rank || this.to - e.to || this.endSide - e.endSide;
  }
}
class ki {
  constructor(e) {
    this.heap = e;
  }
  static from(e, t = null, i = -1) {
    let s = [];
    for (let r = 0; r < e.length; r++)
      for (let o = e[r]; !o.isEmpty; o = o.nextLayer)
        o.maxPoint >= i && s.push(new wa(o, t, i, r));
    return s.length == 1 ? s[0] : new ki(s);
  }
  get startSide() {
    return this.value ? this.value.startSide : 0;
  }
  goto(e, t = -1e9) {
    for (let i of this.heap)
      i.goto(e, t);
    for (let i = this.heap.length >> 1; i >= 0; i--)
      hs(this.heap, i);
    return this.next(), this;
  }
  forward(e, t) {
    for (let i of this.heap)
      i.forward(e, t);
    for (let i = this.heap.length >> 1; i >= 0; i--)
      hs(this.heap, i);
    (this.to - e || this.value.endSide - t) < 0 && this.next();
  }
  next() {
    if (this.heap.length == 0)
      this.from = this.to = 1e9, this.value = null, this.rank = -1;
    else {
      let e = this.heap[0];
      this.from = e.from, this.to = e.to, this.value = e.value, this.rank = e.rank, e.value && e.next(), hs(this.heap, 0);
    }
  }
}
function hs(n, e) {
  for (let t = n[e]; ; ) {
    let i = (e << 1) + 1;
    if (i >= n.length)
      break;
    let s = n[i];
    if (i + 1 < n.length && s.compare(n[i + 1]) >= 0 && (s = n[i + 1], i++), t.compare(s) < 0)
      break;
    n[i] = t, n[e] = s, e = i;
  }
}
class ri {
  constructor(e, t, i) {
    this.minPoint = i, this.active = [], this.activeTo = [], this.activeRank = [], this.minActive = -1, this.point = null, this.pointFrom = 0, this.pointRank = 0, this.to = -1e9, this.endSide = 0, this.openStart = -1, this.cursor = ki.from(e, t, i);
  }
  goto(e, t = -1e9) {
    return this.cursor.goto(e, t), this.active.length = this.activeTo.length = this.activeRank.length = 0, this.minActive = -1, this.to = e, this.endSide = t, this.openStart = -1, this.next(), this;
  }
  forward(e, t) {
    for (; this.minActive > -1 && (this.activeTo[this.minActive] - e || this.active[this.minActive].endSide - t) < 0; )
      this.removeActive(this.minActive);
    this.cursor.forward(e, t);
  }
  removeActive(e) {
    Vi(this.active, e), Vi(this.activeTo, e), Vi(this.activeRank, e), this.minActive = yo(this.active, this.activeTo);
  }
  addActive(e) {
    let t = 0, { value: i, to: s, rank: r } = this.cursor;
    for (; t < this.activeRank.length && this.activeRank[t] <= r; )
      t++;
    Hi(this.active, t, i), Hi(this.activeTo, t, s), Hi(this.activeRank, t, r), e && Hi(e, t, this.cursor.from), this.minActive = yo(this.active, this.activeTo);
  }
  // After calling this, if `this.point` != null, the next range is a
  // point. Otherwise, it's a regular range, covered by `this.active`.
  next() {
    let e = this.to, t = this.point;
    this.point = null;
    let i = this.openStart < 0 ? [] : null;
    for (; ; ) {
      let s = this.minActive;
      if (s > -1 && (this.activeTo[s] - this.cursor.from || this.active[s].endSide - this.cursor.startSide) < 0) {
        if (this.activeTo[s] > e) {
          this.to = this.activeTo[s], this.endSide = this.active[s].endSide;
          break;
        }
        this.removeActive(s), i && Vi(i, s);
      } else if (this.cursor.value)
        if (this.cursor.from > e) {
          this.to = this.cursor.from, this.endSide = this.cursor.startSide;
          break;
        } else {
          let r = this.cursor.value;
          if (!r.point)
            this.addActive(i), this.cursor.next();
          else if (t && this.cursor.to == this.to && this.cursor.from < this.cursor.to)
            this.cursor.next();
          else {
            this.point = r, this.pointFrom = this.cursor.from, this.pointRank = this.cursor.rank, this.to = this.cursor.to, this.endSide = r.endSide, this.cursor.next(), this.forward(this.to, this.endSide);
            break;
          }
        }
      else {
        this.to = this.endSide = 1e9;
        break;
      }
    }
    if (i) {
      this.openStart = 0;
      for (let s = i.length - 1; s >= 0 && i[s] < e; s--)
        this.openStart++;
    }
  }
  activeForPoint(e) {
    if (!this.active.length)
      return this.active;
    let t = [];
    for (let i = this.active.length - 1; i >= 0 && !(this.activeRank[i] < this.pointRank); i--)
      (this.activeTo[i] > e || this.activeTo[i] == e && this.active[i].endSide >= this.point.endSide) && t.push(this.active[i]);
    return t.reverse();
  }
  openEnd(e) {
    let t = 0;
    for (let i = this.activeTo.length - 1; i >= 0 && this.activeTo[i] > e; i--)
      t++;
    return t;
  }
}
function go(n, e, t, i, s, r) {
  n.goto(e), t.goto(i);
  let o = i + s, l = i, a = i - e;
  for (; ; ) {
    let h = n.to + a - t.to || n.endSide - t.endSide, c = h < 0 ? n.to + a : t.to, f = Math.min(c, o);
    if (n.point || t.point ? n.point && t.point && (n.point == t.point || n.point.eq(t.point)) && Xs(n.activeForPoint(n.to), t.activeForPoint(t.to)) || r.comparePoint(l, f, n.point, t.point) : f > l && !Xs(n.active, t.active) && r.compareRange(l, f, n.active, t.active), c > o)
      break;
    l = c, h <= 0 && n.next(), h >= 0 && t.next();
  }
}
function Xs(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (n[t] != e[t] && !n[t].eq(e[t]))
      return !1;
  return !0;
}
function Vi(n, e) {
  for (let t = e, i = n.length - 1; t < i; t++)
    n[t] = n[t + 1];
  n.pop();
}
function Hi(n, e, t) {
  for (let i = n.length - 1; i >= e; i--)
    n[i + 1] = n[i];
  n[e] = t;
}
function yo(n, e) {
  let t = -1, i = 1e9;
  for (let s = 0; s < e.length; s++)
    (e[s] - i || n[s].endSide - n[t].endSide) < 0 && (t = s, i = e[s]);
  return t;
}
function ti(n, e, t = n.length) {
  let i = 0;
  for (let s = 0; s < t; )
    n.charCodeAt(s) == 9 ? (i += e - i % e, s++) : (i++, s = le(n, s));
  return i;
}
function js(n, e, t, i) {
  for (let s = 0, r = 0; ; ) {
    if (r >= e)
      return s;
    if (s == n.length)
      break;
    r += n.charCodeAt(s) == 9 ? t - r % t : 1, s = le(n, s);
  }
  return i === !0 ? -1 : n.length;
}
const Gs = "ͼ", bo = typeof Symbol > "u" ? "__" + Gs : Symbol.for(Gs), Ks = typeof Symbol > "u" ? "__styleSet" + Math.floor(Math.random() * 1e8) : Symbol("styleSet"), xo = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : {};
class bt {
  // :: (Object<Style>, ?{finish: ?(string) → string})
  // Create a style module from the given spec.
  //
  // When `finish` is given, it is called on regular (non-`@`)
  // selectors (after `&` expansion) to compute the final selector.
  constructor(e, t) {
    this.rules = [];
    let { finish: i } = t || {};
    function s(o) {
      return /^@/.test(o) ? [o] : o.split(/,\s*/);
    }
    function r(o, l, a, h) {
      let c = [], f = /^@(\w+)\b/.exec(o[0]), u = f && f[1] == "keyframes";
      if (f && l == null)
        return a.push(o[0] + ";");
      for (let d in l) {
        let p = l[d];
        if (/&/.test(d))
          r(
            d.split(/,\s*/).map((g) => o.map((m) => g.replace(/&/, m))).reduce((g, m) => g.concat(m)),
            p,
            a
          );
        else if (p && typeof p == "object") {
          if (!f)
            throw new RangeError("The value of a property (" + d + ") should be a primitive value.");
          r(s(d), p, c, u);
        } else
          p != null && c.push(d.replace(/_.*/, "").replace(/[A-Z]/g, (g) => "-" + g.toLowerCase()) + ": " + p + ";");
      }
      (c.length || u) && a.push((i && !f && !h ? o.map(i) : o).join(", ") + " {" + c.join(" ") + "}");
    }
    for (let o in e)
      r(s(o), e[o], this.rules);
  }
  // :: () → string
  // Returns a string containing the module's CSS rules.
  getRules() {
    return this.rules.join(`
`);
  }
  // :: () → string
  // Generate a new unique CSS class name.
  static newName() {
    let e = xo[bo] || 1;
    return xo[bo] = e + 1, Gs + e.toString(36);
  }
  // :: (union<Document, ShadowRoot>, union<[StyleModule], StyleModule>, ?{nonce: ?string})
  //
  // Mount the given set of modules in the given DOM root, which ensures
  // that the CSS rules defined by the module are available in that
  // context.
  //
  // Rules are only added to the document once per root.
  //
  // Rule order will follow the order of the modules, so that rules from
  // modules later in the array take precedence of those from earlier
  // modules. If you call this function multiple times for the same root
  // in a way that changes the order of already mounted modules, the old
  // order will be changed.
  //
  // If a Content Security Policy nonce is provided, it is added to
  // the `<style>` tag generated by the library.
  static mount(e, t, i) {
    let s = e[Ks], r = i && i.nonce;
    s ? r && s.setNonce(r) : s = new xf(e, r), s.mount(Array.isArray(t) ? t : [t]);
  }
}
let wo = /* @__PURE__ */ new Map();
class xf {
  constructor(e, t) {
    let i = e.ownerDocument || e, s = i.defaultView;
    if (!e.head && e.adoptedStyleSheets && s.CSSStyleSheet) {
      let r = wo.get(i);
      if (r)
        return e.adoptedStyleSheets = [r.sheet, ...e.adoptedStyleSheets], e[Ks] = r;
      this.sheet = new s.CSSStyleSheet(), e.adoptedStyleSheets = [this.sheet, ...e.adoptedStyleSheets], wo.set(i, this);
    } else {
      this.styleTag = i.createElement("style"), t && this.styleTag.setAttribute("nonce", t);
      let r = e.head || e;
      r.insertBefore(this.styleTag, r.firstChild);
    }
    this.modules = [], e[Ks] = this;
  }
  mount(e) {
    let t = this.sheet, i = 0, s = 0;
    for (let r = 0; r < e.length; r++) {
      let o = e[r], l = this.modules.indexOf(o);
      if (l < s && l > -1 && (this.modules.splice(l, 1), s--, l = -1), l == -1) {
        if (this.modules.splice(s++, 0, o), t)
          for (let a = 0; a < o.rules.length; a++)
            t.insertRule(o.rules[a], i++);
      } else {
        for (; s < l; )
          i += this.modules[s++].rules.length;
        i += o.rules.length, s++;
      }
    }
    if (!t) {
      let r = "";
      for (let o = 0; o < this.modules.length; o++)
        r += this.modules[o].getRules() + `
`;
      this.styleTag.textContent = r;
    }
  }
  setNonce(e) {
    this.styleTag && this.styleTag.getAttribute("nonce") != e && this.styleTag.setAttribute("nonce", e);
  }
}
var xt = {
  8: "Backspace",
  9: "Tab",
  10: "Enter",
  12: "NumLock",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  44: "PrintScreen",
  45: "Insert",
  46: "Delete",
  59: ";",
  61: "=",
  91: "Meta",
  92: "Meta",
  106: "*",
  107: "+",
  108: ",",
  109: "-",
  110: ".",
  111: "/",
  144: "NumLock",
  145: "ScrollLock",
  160: "Shift",
  161: "Shift",
  162: "Control",
  163: "Control",
  164: "Alt",
  165: "Alt",
  173: "-",
  186: ";",
  187: "=",
  188: ",",
  189: "-",
  190: ".",
  191: "/",
  192: "`",
  219: "[",
  220: "\\",
  221: "]",
  222: "'"
}, Oi = {
  48: ")",
  49: "!",
  50: "@",
  51: "#",
  52: "$",
  53: "%",
  54: "^",
  55: "&",
  56: "*",
  57: "(",
  59: ":",
  61: "+",
  173: "_",
  186: ":",
  187: "+",
  188: "<",
  189: "_",
  190: ">",
  191: "?",
  192: "~",
  219: "{",
  220: "|",
  221: "}",
  222: '"'
}, wf = typeof navigator < "u" && /Mac/.test(navigator.platform), kf = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var oe = 0; oe < 10; oe++)
  xt[48 + oe] = xt[96 + oe] = String(oe);
for (var oe = 1; oe <= 24; oe++)
  xt[oe + 111] = "F" + oe;
for (var oe = 65; oe <= 90; oe++)
  xt[oe] = String.fromCharCode(oe + 32), Oi[oe] = String.fromCharCode(oe);
for (var cs in xt)
  Oi.hasOwnProperty(cs) || (Oi[cs] = xt[cs]);
function Of(n) {
  var e = wf && n.metaKey && n.shiftKey && !n.ctrlKey && !n.altKey || kf && n.shiftKey && n.key && n.key.length == 1 || n.key == "Unidentified", t = !e && n.key || (n.shiftKey ? Oi : xt)[n.keyCode] || n.key || "Unidentified";
  return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
function vn(n) {
  let e;
  return n.nodeType == 11 ? e = n.getSelection ? n : n.ownerDocument : e = n, e.getSelection();
}
function _s(n, e) {
  return e ? n == e || n.contains(e.nodeType != 1 ? e.parentNode : e) : !1;
}
function Sf(n) {
  let e = n.activeElement;
  for (; e && e.shadowRoot; )
    e = e.shadowRoot.activeElement;
  return e;
}
function dn(n, e) {
  if (!e.anchorNode)
    return !1;
  try {
    return _s(n, e.anchorNode);
  } catch {
    return !1;
  }
}
function Si(n) {
  return n.nodeType == 3 ? Et(n, 0, n.nodeValue.length).getClientRects() : n.nodeType == 1 ? n.getClientRects() : [];
}
function Cn(n, e, t, i) {
  return t ? ko(n, e, t, i, -1) || ko(n, e, t, i, 1) : !1;
}
function vi(n) {
  for (var e = 0; ; e++)
    if (n = n.previousSibling, !n)
      return e;
}
function ko(n, e, t, i, s) {
  for (; ; ) {
    if (n == t && e == i)
      return !0;
    if (e == (s < 0 ? 0 : it(n))) {
      if (n.nodeName == "DIV")
        return !1;
      let r = n.parentNode;
      if (!r || r.nodeType != 1)
        return !1;
      e = vi(n) + (s < 0 ? 0 : 1), n = r;
    } else if (n.nodeType == 1) {
      if (n = n.childNodes[e + (s < 0 ? -1 : 0)], n.nodeType == 1 && n.contentEditable == "false")
        return !1;
      e = s < 0 ? it(n) : 0;
    } else
      return !1;
  }
}
function it(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function Nr(n, e) {
  let t = e ? n.left : n.right;
  return { left: t, right: t, top: n.top, bottom: n.bottom };
}
function vf(n) {
  return {
    left: 0,
    right: n.innerWidth,
    top: 0,
    bottom: n.innerHeight
  };
}
function ka(n, e) {
  let t = e.width / n.offsetWidth, i = e.height / n.offsetHeight;
  return (t > 0.995 && t < 1.005 || !isFinite(t) || Math.abs(e.width - n.offsetWidth) < 1) && (t = 1), (i > 0.995 && i < 1.005 || !isFinite(i) || Math.abs(e.height - n.offsetHeight) < 1) && (i = 1), { scaleX: t, scaleY: i };
}
function Cf(n, e, t, i, s, r, o, l) {
  let a = n.ownerDocument, h = a.defaultView || window;
  for (let c = n, f = !1; c && !f; )
    if (c.nodeType == 1) {
      let u, d = c == a.body, p = 1, g = 1;
      if (d)
        u = vf(h);
      else {
        if (/^(fixed|sticky)$/.test(getComputedStyle(c).position) && (f = !0), c.scrollHeight <= c.clientHeight && c.scrollWidth <= c.clientWidth) {
          c = c.assignedSlot || c.parentNode;
          continue;
        }
        let k = c.getBoundingClientRect();
        ({ scaleX: p, scaleY: g } = ka(c, k)), u = {
          left: k.left,
          right: k.left + c.clientWidth * p,
          top: k.top,
          bottom: k.top + c.clientHeight * g
        };
      }
      let m = 0, y = 0;
      if (s == "nearest")
        e.top < u.top ? (y = -(u.top - e.top + o), t > 0 && e.bottom > u.bottom + y && (y = e.bottom - u.bottom + y + o)) : e.bottom > u.bottom && (y = e.bottom - u.bottom + o, t < 0 && e.top - y < u.top && (y = -(u.top + y - e.top + o)));
      else {
        let k = e.bottom - e.top, v = u.bottom - u.top;
        y = (s == "center" && k <= v ? e.top + k / 2 - v / 2 : s == "start" || s == "center" && t < 0 ? e.top - o : e.bottom - v + o) - u.top;
      }
      if (i == "nearest" ? e.left < u.left ? (m = -(u.left - e.left + r), t > 0 && e.right > u.right + m && (m = e.right - u.right + m + r)) : e.right > u.right && (m = e.right - u.right + r, t < 0 && e.left < u.left + m && (m = -(u.left + m - e.left + r))) : m = (i == "center" ? e.left + (e.right - e.left) / 2 - (u.right - u.left) / 2 : i == "start" == l ? e.left - r : e.right - (u.right - u.left) + r) - u.left, m || y)
        if (d)
          h.scrollBy(m, y);
        else {
          let k = 0, v = 0;
          if (y) {
            let S = c.scrollTop;
            c.scrollTop += y / g, v = (c.scrollTop - S) * g;
          }
          if (m) {
            let S = c.scrollLeft;
            c.scrollLeft += m / p, k = (c.scrollLeft - S) * p;
          }
          e = {
            left: e.left - k,
            top: e.top - v,
            right: e.right - k,
            bottom: e.bottom - v
          }, k && Math.abs(k - m) < 1 && (i = "nearest"), v && Math.abs(v - y) < 1 && (s = "nearest");
        }
      if (d)
        break;
      c = c.assignedSlot || c.parentNode;
    } else if (c.nodeType == 11)
      c = c.host;
    else
      break;
}
function Af(n) {
  let e = n.ownerDocument;
  for (let t = n.parentNode; t && t != e.body; )
    if (t.nodeType == 1) {
      if (t.scrollHeight > t.clientHeight || t.scrollWidth > t.clientWidth)
        return t;
      t = t.assignedSlot || t.parentNode;
    } else if (t.nodeType == 11)
      t = t.host;
    else
      break;
  return null;
}
class Mf {
  constructor() {
    this.anchorNode = null, this.anchorOffset = 0, this.focusNode = null, this.focusOffset = 0;
  }
  eq(e) {
    return this.anchorNode == e.anchorNode && this.anchorOffset == e.anchorOffset && this.focusNode == e.focusNode && this.focusOffset == e.focusOffset;
  }
  setRange(e) {
    let { anchorNode: t, focusNode: i } = e;
    this.set(t, Math.min(e.anchorOffset, t ? it(t) : 0), i, Math.min(e.focusOffset, i ? it(i) : 0));
  }
  set(e, t, i, s) {
    this.anchorNode = e, this.anchorOffset = t, this.focusNode = i, this.focusOffset = s;
  }
}
let It = null;
function Oa(n) {
  if (n.setActive)
    return n.setActive();
  if (It)
    return n.focus(It);
  let e = [];
  for (let t = n; t && (e.push(t, t.scrollTop, t.scrollLeft), t != t.ownerDocument); t = t.parentNode)
    ;
  if (n.focus(It == null ? {
    get preventScroll() {
      return It = { preventScroll: !0 }, !0;
    }
  } : void 0), !It) {
    It = !1;
    for (let t = 0; t < e.length; ) {
      let i = e[t++], s = e[t++], r = e[t++];
      i.scrollTop != s && (i.scrollTop = s), i.scrollLeft != r && (i.scrollLeft = r);
    }
  }
}
let Oo;
function Et(n, e, t = e) {
  let i = Oo || (Oo = document.createRange());
  return i.setEnd(n, t), i.setStart(n, e), i;
}
function qt(n, e, t) {
  let i = { key: e, code: e, keyCode: t, which: t, cancelable: !0 }, s = new KeyboardEvent("keydown", i);
  s.synthetic = !0, n.dispatchEvent(s);
  let r = new KeyboardEvent("keyup", i);
  return r.synthetic = !0, n.dispatchEvent(r), s.defaultPrevented || r.defaultPrevented;
}
function Tf(n) {
  for (; n; ) {
    if (n && (n.nodeType == 9 || n.nodeType == 11 && n.host))
      return n;
    n = n.assignedSlot || n.parentNode;
  }
  return null;
}
function Sa(n) {
  for (; n.attributes.length; )
    n.removeAttributeNode(n.attributes[0]);
}
function Pf(n, e) {
  let t = e.focusNode, i = e.focusOffset;
  if (!t || e.anchorNode != t || e.anchorOffset != i)
    return !1;
  for (i = Math.min(i, it(t)); ; )
    if (i) {
      if (t.nodeType != 1)
        return !1;
      let s = t.childNodes[i - 1];
      s.contentEditable == "false" ? i-- : (t = s, i = it(t));
    } else {
      if (t == n)
        return !0;
      i = vi(t), t = t.parentNode;
    }
}
function va(n) {
  return n.scrollTop > Math.max(1, n.scrollHeight - n.clientHeight - 4);
}
class fe {
  constructor(e, t, i = !0) {
    this.node = e, this.offset = t, this.precise = i;
  }
  static before(e, t) {
    return new fe(e.parentNode, vi(e), t);
  }
  static after(e, t) {
    return new fe(e.parentNode, vi(e) + 1, t);
  }
}
const Ir = [];
class X {
  constructor() {
    this.parent = null, this.dom = null, this.flags = 2;
  }
  get overrideDOMText() {
    return null;
  }
  get posAtStart() {
    return this.parent ? this.parent.posBefore(this) : 0;
  }
  get posAtEnd() {
    return this.posAtStart + this.length;
  }
  posBefore(e) {
    let t = this.posAtStart;
    for (let i of this.children) {
      if (i == e)
        return t;
      t += i.length + i.breakAfter;
    }
    throw new RangeError("Invalid child in posBefore");
  }
  posAfter(e) {
    return this.posBefore(e) + e.length;
  }
  sync(e, t) {
    if (this.flags & 2) {
      let i = this.dom, s = null, r;
      for (let o of this.children) {
        if (o.flags & 7) {
          if (!o.dom && (r = s ? s.nextSibling : i.firstChild)) {
            let l = X.get(r);
            (!l || !l.parent && l.canReuseDOM(o)) && o.reuseDOM(r);
          }
          o.sync(e, t), o.flags &= -8;
        }
        if (r = s ? s.nextSibling : i.firstChild, t && !t.written && t.node == i && r != o.dom && (t.written = !0), o.dom.parentNode == i)
          for (; r && r != o.dom; )
            r = So(r);
        else
          i.insertBefore(o.dom, r);
        s = o.dom;
      }
      for (r = s ? s.nextSibling : i.firstChild, r && t && t.node == i && (t.written = !0); r; )
        r = So(r);
    } else if (this.flags & 1)
      for (let i of this.children)
        i.flags & 7 && (i.sync(e, t), i.flags &= -8);
  }
  reuseDOM(e) {
  }
  localPosFromDOM(e, t) {
    let i;
    if (e == this.dom)
      i = this.dom.childNodes[t];
    else {
      let s = it(e) == 0 ? 0 : t == 0 ? -1 : 1;
      for (; ; ) {
        let r = e.parentNode;
        if (r == this.dom)
          break;
        s == 0 && r.firstChild != r.lastChild && (e == r.firstChild ? s = -1 : s = 1), e = r;
      }
      s < 0 ? i = e : i = e.nextSibling;
    }
    if (i == this.dom.firstChild)
      return 0;
    for (; i && !X.get(i); )
      i = i.nextSibling;
    if (!i)
      return this.length;
    for (let s = 0, r = 0; ; s++) {
      let o = this.children[s];
      if (o.dom == i)
        return r;
      r += o.length + o.breakAfter;
    }
  }
  domBoundsAround(e, t, i = 0) {
    let s = -1, r = -1, o = -1, l = -1;
    for (let a = 0, h = i, c = i; a < this.children.length; a++) {
      let f = this.children[a], u = h + f.length;
      if (h < e && u > t)
        return f.domBoundsAround(e, t, h);
      if (u >= e && s == -1 && (s = a, r = h), h > t && f.dom.parentNode == this.dom) {
        o = a, l = c;
        break;
      }
      c = u, h = u + f.breakAfter;
    }
    return {
      from: r,
      to: l < 0 ? i + this.length : l,
      startDOM: (s ? this.children[s - 1].dom.nextSibling : null) || this.dom.firstChild,
      endDOM: o < this.children.length && o >= 0 ? this.children[o].dom : null
    };
  }
  markDirty(e = !1) {
    this.flags |= 2, this.markParentsDirty(e);
  }
  markParentsDirty(e) {
    for (let t = this.parent; t; t = t.parent) {
      if (e && (t.flags |= 2), t.flags & 1)
        return;
      t.flags |= 1, e = !1;
    }
  }
  setParent(e) {
    this.parent != e && (this.parent = e, this.flags & 7 && this.markParentsDirty(!0));
  }
  setDOM(e) {
    this.dom != e && (this.dom && (this.dom.cmView = null), this.dom = e, e.cmView = this);
  }
  get rootView() {
    for (let e = this; ; ) {
      let t = e.parent;
      if (!t)
        return e;
      e = t;
    }
  }
  replaceChildren(e, t, i = Ir) {
    this.markDirty();
    for (let s = e; s < t; s++) {
      let r = this.children[s];
      r.parent == this && i.indexOf(r) < 0 && r.destroy();
    }
    this.children.splice(e, t - e, ...i);
    for (let s = 0; s < i.length; s++)
      i[s].setParent(this);
  }
  ignoreMutation(e) {
    return !1;
  }
  ignoreEvent(e) {
    return !1;
  }
  childCursor(e = this.length) {
    return new Ca(this.children, e, this.children.length);
  }
  childPos(e, t = 1) {
    return this.childCursor().findPos(e, t);
  }
  toString() {
    let e = this.constructor.name.replace("View", "");
    return e + (this.children.length ? "(" + this.children.join() + ")" : this.length ? "[" + (e == "Text" ? this.text : this.length) + "]" : "") + (this.breakAfter ? "#" : "");
  }
  static get(e) {
    return e.cmView;
  }
  get isEditable() {
    return !0;
  }
  get isWidget() {
    return !1;
  }
  get isHidden() {
    return !1;
  }
  merge(e, t, i, s, r, o) {
    return !1;
  }
  become(e) {
    return !1;
  }
  canReuseDOM(e) {
    return e.constructor == this.constructor && !((this.flags | e.flags) & 8);
  }
  // When this is a zero-length view with a side, this should return a
  // number <= 0 to indicate it is before its position, or a
  // number > 0 when after its position.
  getSide() {
    return 0;
  }
  destroy() {
    for (let e of this.children)
      e.parent == this && e.destroy();
    this.parent = null;
  }
}
X.prototype.breakAfter = 0;
function So(n) {
  let e = n.nextSibling;
  return n.parentNode.removeChild(n), e;
}
class Ca {
  constructor(e, t, i) {
    this.children = e, this.pos = t, this.i = i, this.off = 0;
  }
  findPos(e, t = 1) {
    for (; ; ) {
      if (e > this.pos || e == this.pos && (t > 0 || this.i == 0 || this.children[this.i - 1].breakAfter))
        return this.off = e - this.pos, this;
      let i = this.children[--this.i];
      this.pos -= i.length + i.breakAfter;
    }
  }
}
function Aa(n, e, t, i, s, r, o, l, a) {
  let { children: h } = n, c = h.length ? h[e] : null, f = r.length ? r[r.length - 1] : null, u = f ? f.breakAfter : o;
  if (!(e == i && c && !o && !u && r.length < 2 && c.merge(t, s, r.length ? f : null, t == 0, l, a))) {
    if (i < h.length) {
      let d = h[i];
      d && (s < d.length || d.breakAfter && (f != null && f.breakAfter)) ? (e == i && (d = d.split(s), s = 0), !u && f && d.merge(0, s, f, !0, 0, a) ? r[r.length - 1] = d : ((s || d.children.length && !d.children[0].length) && d.merge(0, s, null, !1, 0, a), r.push(d))) : d != null && d.breakAfter && (f ? f.breakAfter = 1 : o = 1), i++;
    }
    for (c && (c.breakAfter = o, t > 0 && (!o && r.length && c.merge(t, c.length, r[0], !1, l, 0) ? c.breakAfter = r.shift().breakAfter : (t < c.length || c.children.length && c.children[c.children.length - 1].length == 0) && c.merge(t, c.length, null, !1, l, 0), e++)); e < i && r.length; )
      if (h[i - 1].become(r[r.length - 1]))
        i--, r.pop(), a = r.length ? 0 : l;
      else if (h[e].become(r[0]))
        e++, r.shift(), l = r.length ? 0 : a;
      else
        break;
    !r.length && e && i < h.length && !h[e - 1].breakAfter && h[i].merge(0, 0, h[e - 1], !1, l, a) && e--, (e < i || r.length) && n.replaceChildren(e, i, r);
  }
}
function Ma(n, e, t, i, s, r) {
  let o = n.childCursor(), { i: l, off: a } = o.findPos(t, 1), { i: h, off: c } = o.findPos(e, -1), f = e - t;
  for (let u of i)
    f += u.length;
  n.length += f, Aa(n, h, c, l, a, i, 0, s, r);
}
let Te = typeof navigator < "u" ? navigator : { userAgent: "", vendor: "", platform: "" }, Ys = typeof document < "u" ? document : { documentElement: { style: {} } };
const Zs = /* @__PURE__ */ /Edge\/(\d+)/.exec(Te.userAgent), Ta = /* @__PURE__ */ /MSIE \d/.test(Te.userAgent), Js = /* @__PURE__ */ /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(Te.userAgent), _n = !!(Ta || Js || Zs), vo = !_n && /* @__PURE__ */ /gecko\/(\d+)/i.test(Te.userAgent), fs = !_n && /* @__PURE__ */ /Chrome\/(\d+)/.exec(Te.userAgent), Co = "webkitFontSmoothing" in Ys.documentElement.style, Pa = !_n && /* @__PURE__ */ /Apple Computer/.test(Te.vendor), Ao = Pa && (/* @__PURE__ */ /Mobile\/\w+/.test(Te.userAgent) || Te.maxTouchPoints > 2);
var P = {
  mac: Ao || /* @__PURE__ */ /Mac/.test(Te.platform),
  windows: /* @__PURE__ */ /Win/.test(Te.platform),
  linux: /* @__PURE__ */ /Linux|X11/.test(Te.platform),
  ie: _n,
  ie_version: Ta ? Ys.documentMode || 6 : Js ? +Js[1] : Zs ? +Zs[1] : 0,
  gecko: vo,
  gecko_version: vo ? +(/* @__PURE__ */ /Firefox\/(\d+)/.exec(Te.userAgent) || [0, 0])[1] : 0,
  chrome: !!fs,
  chrome_version: fs ? +fs[1] : 0,
  ios: Ao,
  android: /* @__PURE__ */ /Android\b/.test(Te.userAgent),
  webkit: Co,
  safari: Pa,
  webkit_version: Co ? +(/* @__PURE__ */ /\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0,
  tabSize: Ys.documentElement.style.tabSize != null ? "tab-size" : "-moz-tab-size"
};
const Df = 256;
class nt extends X {
  constructor(e) {
    super(), this.text = e;
  }
  get length() {
    return this.text.length;
  }
  createDOM(e) {
    this.setDOM(e || document.createTextNode(this.text));
  }
  sync(e, t) {
    this.dom || this.createDOM(), this.dom.nodeValue != this.text && (t && t.node == this.dom && (t.written = !0), this.dom.nodeValue = this.text);
  }
  reuseDOM(e) {
    e.nodeType == 3 && this.createDOM(e);
  }
  merge(e, t, i) {
    return this.flags & 8 || i && (!(i instanceof nt) || this.length - (t - e) + i.length > Df || i.flags & 8) ? !1 : (this.text = this.text.slice(0, e) + (i ? i.text : "") + this.text.slice(t), this.markDirty(), !0);
  }
  split(e) {
    let t = new nt(this.text.slice(e));
    return this.text = this.text.slice(0, e), this.markDirty(), t.flags |= this.flags & 8, t;
  }
  localPosFromDOM(e, t) {
    return e == this.dom ? t : t ? this.text.length : 0;
  }
  domAtPos(e) {
    return new fe(this.dom, e);
  }
  domBoundsAround(e, t, i) {
    return { from: i, to: i + this.length, startDOM: this.dom, endDOM: this.dom.nextSibling };
  }
  coordsAt(e, t) {
    return Rf(this.dom, e, t);
  }
}
class st extends X {
  constructor(e, t = [], i = 0) {
    super(), this.mark = e, this.children = t, this.length = i;
    for (let s of t)
      s.setParent(this);
  }
  setAttrs(e) {
    if (Sa(e), this.mark.class && (e.className = this.mark.class), this.mark.attrs)
      for (let t in this.mark.attrs)
        e.setAttribute(t, this.mark.attrs[t]);
    return e;
  }
  canReuseDOM(e) {
    return super.canReuseDOM(e) && !((this.flags | e.flags) & 8);
  }
  reuseDOM(e) {
    e.nodeName == this.mark.tagName.toUpperCase() && (this.setDOM(e), this.flags |= 6);
  }
  sync(e, t) {
    this.dom ? this.flags & 4 && this.setAttrs(this.dom) : this.setDOM(this.setAttrs(document.createElement(this.mark.tagName))), super.sync(e, t);
  }
  merge(e, t, i, s, r, o) {
    return i && (!(i instanceof st && i.mark.eq(this.mark)) || e && r <= 0 || t < this.length && o <= 0) ? !1 : (Ma(this, e, t, i ? i.children.slice() : [], r - 1, o - 1), this.markDirty(), !0);
  }
  split(e) {
    let t = [], i = 0, s = -1, r = 0;
    for (let l of this.children) {
      let a = i + l.length;
      a > e && t.push(i < e ? l.split(e - i) : l), s < 0 && i >= e && (s = r), i = a, r++;
    }
    let o = this.length - e;
    return this.length = e, s > -1 && (this.children.length = s, this.markDirty()), new st(this.mark, t, o);
  }
  domAtPos(e) {
    return Da(this, e);
  }
  coordsAt(e, t) {
    return Ba(this, e, t);
  }
}
function Rf(n, e, t) {
  let i = n.nodeValue.length;
  e > i && (e = i);
  let s = e, r = e, o = 0;
  e == 0 && t < 0 || e == i && t >= 0 ? P.chrome || P.gecko || (e ? (s--, o = 1) : r < i && (r++, o = -1)) : t < 0 ? s-- : r < i && r++;
  let l = Et(n, s, r).getClientRects();
  if (!l.length)
    return null;
  let a = l[(o ? o < 0 : t >= 0) ? 0 : l.length - 1];
  return P.safari && !o && a.width == 0 && (a = Array.prototype.find.call(l, (h) => h.width) || a), o ? Nr(a, o < 0) : a || null;
}
class ut extends X {
  static create(e, t, i) {
    return new ut(e, t, i);
  }
  constructor(e, t, i) {
    super(), this.widget = e, this.length = t, this.side = i, this.prevWidget = null;
  }
  split(e) {
    let t = ut.create(this.widget, this.length - e, this.side);
    return this.length -= e, t;
  }
  sync(e) {
    (!this.dom || !this.widget.updateDOM(this.dom, e)) && (this.dom && this.prevWidget && this.prevWidget.destroy(this.dom), this.prevWidget = null, this.setDOM(this.widget.toDOM(e)), this.dom.contentEditable = "false");
  }
  getSide() {
    return this.side;
  }
  merge(e, t, i, s, r, o) {
    return i && (!(i instanceof ut) || !this.widget.compare(i.widget) || e > 0 && r <= 0 || t < this.length && o <= 0) ? !1 : (this.length = e + (i ? i.length : 0) + (this.length - t), !0);
  }
  become(e) {
    return e instanceof ut && e.side == this.side && this.widget.constructor == e.widget.constructor ? (this.widget.compare(e.widget) || this.markDirty(!0), this.dom && !this.prevWidget && (this.prevWidget = this.widget), this.widget = e.widget, this.length = e.length, !0) : !1;
  }
  ignoreMutation() {
    return !0;
  }
  ignoreEvent(e) {
    return this.widget.ignoreEvent(e);
  }
  get overrideDOMText() {
    if (this.length == 0)
      return z.empty;
    let e = this;
    for (; e.parent; )
      e = e.parent;
    let { view: t } = e, i = t && t.state.doc, s = this.posAtStart;
    return i ? i.slice(s, s + this.length) : z.empty;
  }
  domAtPos(e) {
    return (this.length ? e == 0 : this.side > 0) ? fe.before(this.dom) : fe.after(this.dom, e == this.length);
  }
  domBoundsAround() {
    return null;
  }
  coordsAt(e, t) {
    let i = this.widget.coordsAt(this.dom, e, t);
    if (i)
      return i;
    let s = this.dom.getClientRects(), r = null;
    if (!s.length)
      return null;
    let o = this.side ? this.side < 0 : e > 0;
    for (let l = o ? s.length - 1 : 0; r = s[l], !(e > 0 ? l == 0 : l == s.length - 1 || r.top < r.bottom); l += o ? -1 : 1)
      ;
    return Nr(r, !o);
  }
  get isEditable() {
    return !1;
  }
  get isWidget() {
    return !0;
  }
  get isHidden() {
    return this.widget.isHidden;
  }
  destroy() {
    super.destroy(), this.dom && this.widget.destroy(this.dom);
  }
}
class _t extends X {
  constructor(e) {
    super(), this.side = e;
  }
  get length() {
    return 0;
  }
  merge() {
    return !1;
  }
  become(e) {
    return e instanceof _t && e.side == this.side;
  }
  split() {
    return new _t(this.side);
  }
  sync() {
    if (!this.dom) {
      let e = document.createElement("img");
      e.className = "cm-widgetBuffer", e.setAttribute("aria-hidden", "true"), this.setDOM(e);
    }
  }
  getSide() {
    return this.side;
  }
  domAtPos(e) {
    return this.side > 0 ? fe.before(this.dom) : fe.after(this.dom);
  }
  localPosFromDOM() {
    return 0;
  }
  domBoundsAround() {
    return null;
  }
  coordsAt(e) {
    return this.dom.getBoundingClientRect();
  }
  get overrideDOMText() {
    return z.empty;
  }
  get isHidden() {
    return !0;
  }
}
nt.prototype.children = ut.prototype.children = _t.prototype.children = Ir;
function Da(n, e) {
  let t = n.dom, { children: i } = n, s = 0;
  for (let r = 0; s < i.length; s++) {
    let o = i[s], l = r + o.length;
    if (!(l == r && o.getSide() <= 0)) {
      if (e > r && e < l && o.dom.parentNode == t)
        return o.domAtPos(e - r);
      if (e <= r)
        break;
      r = l;
    }
  }
  for (let r = s; r > 0; r--) {
    let o = i[r - 1];
    if (o.dom.parentNode == t)
      return o.domAtPos(o.length);
  }
  for (let r = s; r < i.length; r++) {
    let o = i[r];
    if (o.dom.parentNode == t)
      return o.domAtPos(0);
  }
  return new fe(t, 0);
}
function Ra(n, e, t) {
  let i, { children: s } = n;
  t > 0 && e instanceof st && s.length && (i = s[s.length - 1]) instanceof st && i.mark.eq(e.mark) ? Ra(i, e.children[0], t - 1) : (s.push(e), e.setParent(n)), n.length += e.length;
}
function Ba(n, e, t) {
  let i = null, s = -1, r = null, o = -1;
  function l(h, c) {
    for (let f = 0, u = 0; f < h.children.length && u <= c; f++) {
      let d = h.children[f], p = u + d.length;
      p >= c && (d.children.length ? l(d, c - u) : (!r || r.isHidden && t > 0) && (p > c || u == p && d.getSide() > 0) ? (r = d, o = c - u) : (u < c || u == p && d.getSide() < 0 && !d.isHidden) && (i = d, s = c - u)), u = p;
    }
  }
  l(n, e);
  let a = (t < 0 ? i : r) || i || r;
  return a ? a.coordsAt(Math.max(0, a == i ? s : o), t) : Bf(n);
}
function Bf(n) {
  let e = n.dom.lastChild;
  if (!e)
    return n.dom.getBoundingClientRect();
  let t = Si(e);
  return t[t.length - 1] || null;
}
function er(n, e) {
  for (let t in n)
    t == "class" && e.class ? e.class += " " + n.class : t == "style" && e.style ? e.style += ";" + n.style : e[t] = n[t];
  return e;
}
const Mo = /* @__PURE__ */ Object.create(null);
function Wr(n, e, t) {
  if (n == e)
    return !0;
  n || (n = Mo), e || (e = Mo);
  let i = Object.keys(n), s = Object.keys(e);
  if (i.length - (t && i.indexOf(t) > -1 ? 1 : 0) != s.length - (t && s.indexOf(t) > -1 ? 1 : 0))
    return !1;
  for (let r of i)
    if (r != t && (s.indexOf(r) == -1 || n[r] !== e[r]))
      return !1;
  return !0;
}
function tr(n, e, t) {
  let i = !1;
  if (e)
    for (let s in e)
      t && s in t || (i = !0, s == "style" ? n.style.cssText = "" : n.removeAttribute(s));
  if (t)
    for (let s in t)
      e && e[s] == t[s] || (i = !0, s == "style" ? n.style.cssText = t[s] : n.setAttribute(s, t[s]));
  return i;
}
function Ef(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t = 0; t < n.attributes.length; t++) {
    let i = n.attributes[t];
    e[i.name] = i.value;
  }
  return e;
}
class ee extends X {
  constructor() {
    super(...arguments), this.children = [], this.length = 0, this.prevAttrs = void 0, this.attrs = null, this.breakAfter = 0;
  }
  // Consumes source
  merge(e, t, i, s, r, o) {
    if (i) {
      if (!(i instanceof ee))
        return !1;
      this.dom || i.transferDOM(this);
    }
    return s && this.setDeco(i ? i.attrs : null), Ma(this, e, t, i ? i.children.slice() : [], r, o), !0;
  }
  split(e) {
    let t = new ee();
    if (t.breakAfter = this.breakAfter, this.length == 0)
      return t;
    let { i, off: s } = this.childPos(e);
    s && (t.append(this.children[i].split(s), 0), this.children[i].merge(s, this.children[i].length, null, !1, 0, 0), i++);
    for (let r = i; r < this.children.length; r++)
      t.append(this.children[r], 0);
    for (; i > 0 && this.children[i - 1].length == 0; )
      this.children[--i].destroy();
    return this.children.length = i, this.markDirty(), this.length = e, t;
  }
  transferDOM(e) {
    this.dom && (this.markDirty(), e.setDOM(this.dom), e.prevAttrs = this.prevAttrs === void 0 ? this.attrs : this.prevAttrs, this.prevAttrs = void 0, this.dom = null);
  }
  setDeco(e) {
    Wr(this.attrs, e) || (this.dom && (this.prevAttrs = this.attrs, this.markDirty()), this.attrs = e);
  }
  append(e, t) {
    Ra(this, e, t);
  }
  // Only called when building a line view in ContentBuilder
  addLineDeco(e) {
    let t = e.spec.attributes, i = e.spec.class;
    t && (this.attrs = er(t, this.attrs || {})), i && (this.attrs = er({ class: i }, this.attrs || {}));
  }
  domAtPos(e) {
    return Da(this, e);
  }
  reuseDOM(e) {
    e.nodeName == "DIV" && (this.setDOM(e), this.flags |= 6);
  }
  sync(e, t) {
    var i;
    this.dom ? this.flags & 4 && (Sa(this.dom), this.dom.className = "cm-line", this.prevAttrs = this.attrs ? null : void 0) : (this.setDOM(document.createElement("div")), this.dom.className = "cm-line", this.prevAttrs = this.attrs ? null : void 0), this.prevAttrs !== void 0 && (tr(this.dom, this.prevAttrs, this.attrs), this.dom.classList.add("cm-line"), this.prevAttrs = void 0), super.sync(e, t);
    let s = this.dom.lastChild;
    for (; s && X.get(s) instanceof st; )
      s = s.lastChild;
    if (!s || !this.length || s.nodeName != "BR" && ((i = X.get(s)) === null || i === void 0 ? void 0 : i.isEditable) == !1 && (!P.ios || !this.children.some((r) => r instanceof nt))) {
      let r = document.createElement("BR");
      r.cmIgnore = !0, this.dom.appendChild(r);
    }
  }
  measureTextSize() {
    if (this.children.length == 0 || this.length > 20)
      return null;
    let e = 0, t;
    for (let i of this.children) {
      if (!(i instanceof nt) || /[^ -~]/.test(i.text))
        return null;
      let s = Si(i.dom);
      if (s.length != 1)
        return null;
      e += s[0].width, t = s[0].height;
    }
    return e ? {
      lineHeight: this.dom.getBoundingClientRect().height,
      charWidth: e / this.length,
      textHeight: t
    } : null;
  }
  coordsAt(e, t) {
    let i = Ba(this, e, t);
    if (!this.children.length && i && this.parent) {
      let { heightOracle: s } = this.parent.view.viewState, r = i.bottom - i.top;
      if (Math.abs(r - s.lineHeight) < 2 && s.textHeight < r) {
        let o = (r - s.textHeight) / 2;
        return { top: i.top + o, bottom: i.bottom - o, left: i.left, right: i.left };
      }
    }
    return i;
  }
  become(e) {
    return !1;
  }
  covers() {
    return !0;
  }
  static find(e, t) {
    for (let i = 0, s = 0; i < e.children.length; i++) {
      let r = e.children[i], o = s + r.length;
      if (o >= t) {
        if (r instanceof ee)
          return r;
        if (o > t)
          break;
      }
      s = o + r.breakAfter;
    }
    return null;
  }
}
class pt extends X {
  constructor(e, t, i) {
    super(), this.widget = e, this.length = t, this.deco = i, this.breakAfter = 0, this.prevWidget = null;
  }
  merge(e, t, i, s, r, o) {
    return i && (!(i instanceof pt) || !this.widget.compare(i.widget) || e > 0 && r <= 0 || t < this.length && o <= 0) ? !1 : (this.length = e + (i ? i.length : 0) + (this.length - t), !0);
  }
  domAtPos(e) {
    return e == 0 ? fe.before(this.dom) : fe.after(this.dom, e == this.length);
  }
  split(e) {
    let t = this.length - e;
    this.length = e;
    let i = new pt(this.widget, t, this.deco);
    return i.breakAfter = this.breakAfter, i;
  }
  get children() {
    return Ir;
  }
  sync(e) {
    (!this.dom || !this.widget.updateDOM(this.dom, e)) && (this.dom && this.prevWidget && this.prevWidget.destroy(this.dom), this.prevWidget = null, this.setDOM(this.widget.toDOM(e)), this.dom.contentEditable = "false");
  }
  get overrideDOMText() {
    return this.parent ? this.parent.view.state.doc.slice(this.posAtStart, this.posAtEnd) : z.empty;
  }
  domBoundsAround() {
    return null;
  }
  become(e) {
    return e instanceof pt && e.widget.constructor == this.widget.constructor ? (e.widget.compare(this.widget) || this.markDirty(!0), this.dom && !this.prevWidget && (this.prevWidget = this.widget), this.widget = e.widget, this.length = e.length, this.deco = e.deco, this.breakAfter = e.breakAfter, !0) : !1;
  }
  ignoreMutation() {
    return !0;
  }
  ignoreEvent(e) {
    return this.widget.ignoreEvent(e);
  }
  get isEditable() {
    return !1;
  }
  get isWidget() {
    return !0;
  }
  coordsAt(e, t) {
    return this.widget.coordsAt(this.dom, e, t);
  }
  destroy() {
    super.destroy(), this.dom && this.widget.destroy(this.dom);
  }
  covers(e) {
    let { startSide: t, endSide: i } = this.deco;
    return t == i ? !1 : e < 0 ? t < 0 : i > 0;
  }
}
class St {
  /**
  Compare this instance to another instance of the same type.
  (TypeScript can't express this, but only instances of the same
  specific class will be passed to this method.) This is used to
  avoid redrawing widgets when they are replaced by a new
  decoration of the same type. The default implementation just
  returns `false`, which will cause new instances of the widget to
  always be redrawn.
  */
  eq(e) {
    return !1;
  }
  /**
  Update a DOM element created by a widget of the same type (but
  different, non-`eq` content) to reflect this widget. May return
  true to indicate that it could update, false to indicate it
  couldn't (in which case the widget will be redrawn). The default
  implementation just returns false.
  */
  updateDOM(e, t) {
    return !1;
  }
  /**
  @internal
  */
  compare(e) {
    return this == e || this.constructor == e.constructor && this.eq(e);
  }
  /**
  The estimated height this widget will have, to be used when
  estimating the height of content that hasn't been drawn. May
  return -1 to indicate you don't know. The default implementation
  returns -1.
  */
  get estimatedHeight() {
    return -1;
  }
  /**
  For inline widgets that are displayed inline (as opposed to
  `inline-block`) and introduce line breaks (through `<br>` tags
  or textual newlines), this must indicate the amount of line
  breaks they introduce. Defaults to 0.
  */
  get lineBreaks() {
    return 0;
  }
  /**
  Can be used to configure which kinds of events inside the widget
  should be ignored by the editor. The default is to ignore all
  events.
  */
  ignoreEvent(e) {
    return !0;
  }
  /**
  Override the way screen coordinates for positions at/in the
  widget are found. `pos` will be the offset into the widget, and
  `side` the side of the position that is being queried—less than
  zero for before, greater than zero for after, and zero for
  directly at that position.
  */
  coordsAt(e, t, i) {
    return null;
  }
  /**
  @internal
  */
  get isHidden() {
    return !1;
  }
  /**
  This is called when the an instance of the widget is removed
  from the editor view.
  */
  destroy(e) {
  }
}
var me = /* @__PURE__ */ function(n) {
  return n[n.Text = 0] = "Text", n[n.WidgetBefore = 1] = "WidgetBefore", n[n.WidgetAfter = 2] = "WidgetAfter", n[n.WidgetRange = 3] = "WidgetRange", n;
}(me || (me = {}));
class D extends Bt {
  constructor(e, t, i, s) {
    super(), this.startSide = e, this.endSide = t, this.widget = i, this.spec = s;
  }
  /**
  @internal
  */
  get heightRelevant() {
    return !1;
  }
  /**
  Create a mark decoration, which influences the styling of the
  content in its range. Nested mark decorations will cause nested
  DOM elements to be created. Nesting order is determined by
  precedence of the [facet](https://codemirror.net/6/docs/ref/#view.EditorView^decorations), with
  the higher-precedence decorations creating the inner DOM nodes.
  Such elements are split on line boundaries and on the boundaries
  of lower-precedence decorations.
  */
  static mark(e) {
    return new Ni(e);
  }
  /**
  Create a widget decoration, which displays a DOM element at the
  given position.
  */
  static widget(e) {
    let t = Math.max(-1e4, Math.min(1e4, e.side || 0)), i = !!e.block;
    return t += i && !e.inlineOrder ? t > 0 ? 3e8 : -4e8 : t > 0 ? 1e8 : -1e8, new wt(e, t, t, i, e.widget || null, !1);
  }
  /**
  Create a replace decoration which replaces the given range with
  a widget, or simply hides it.
  */
  static replace(e) {
    let t = !!e.block, i, s;
    if (e.isBlockGap)
      i = -5e8, s = 4e8;
    else {
      let { start: r, end: o } = Ea(e, t);
      i = (r ? t ? -3e8 : -1 : 5e8) - 1, s = (o ? t ? 2e8 : 1 : -6e8) + 1;
    }
    return new wt(e, i, s, t, e.widget || null, !0);
  }
  /**
  Create a line decoration, which can add DOM attributes to the
  line starting at the given position.
  */
  static line(e) {
    return new Ii(e);
  }
  /**
  Build a [`DecorationSet`](https://codemirror.net/6/docs/ref/#view.DecorationSet) from the given
  decorated range or ranges. If the ranges aren't already sorted,
  pass `true` for `sort` to make the library sort them for you.
  */
  static set(e, t = !1) {
    return F.of(e, t);
  }
  /**
  @internal
  */
  hasHeight() {
    return this.widget ? this.widget.estimatedHeight > -1 : !1;
  }
}
D.none = F.empty;
class Ni extends D {
  constructor(e) {
    let { start: t, end: i } = Ea(e);
    super(t ? -1 : 5e8, i ? 1 : -6e8, null, e), this.tagName = e.tagName || "span", this.class = e.class || "", this.attrs = e.attributes || null;
  }
  eq(e) {
    var t, i;
    return this == e || e instanceof Ni && this.tagName == e.tagName && (this.class || ((t = this.attrs) === null || t === void 0 ? void 0 : t.class)) == (e.class || ((i = e.attrs) === null || i === void 0 ? void 0 : i.class)) && Wr(this.attrs, e.attrs, "class");
  }
  range(e, t = e) {
    if (e >= t)
      throw new RangeError("Mark decorations may not be empty");
    return super.range(e, t);
  }
}
Ni.prototype.point = !1;
class Ii extends D {
  constructor(e) {
    super(-2e8, -2e8, null, e);
  }
  eq(e) {
    return e instanceof Ii && this.spec.class == e.spec.class && Wr(this.spec.attributes, e.spec.attributes);
  }
  range(e, t = e) {
    if (t != e)
      throw new RangeError("Line decoration ranges must be zero-length");
    return super.range(e, t);
  }
}
Ii.prototype.mapMode = pe.TrackBefore;
Ii.prototype.point = !0;
class wt extends D {
  constructor(e, t, i, s, r, o) {
    super(t, i, r, e), this.block = s, this.isReplace = o, this.mapMode = s ? t <= 0 ? pe.TrackBefore : pe.TrackAfter : pe.TrackDel;
  }
  // Only relevant when this.block == true
  get type() {
    return this.startSide != this.endSide ? me.WidgetRange : this.startSide <= 0 ? me.WidgetBefore : me.WidgetAfter;
  }
  get heightRelevant() {
    return this.block || !!this.widget && (this.widget.estimatedHeight >= 5 || this.widget.lineBreaks > 0);
  }
  eq(e) {
    return e instanceof wt && Lf(this.widget, e.widget) && this.block == e.block && this.startSide == e.startSide && this.endSide == e.endSide;
  }
  range(e, t = e) {
    if (this.isReplace && (e > t || e == t && this.startSide > 0 && this.endSide <= 0))
      throw new RangeError("Invalid range for replacement decoration");
    if (!this.isReplace && t != e)
      throw new RangeError("Widget decorations can only have zero-length ranges");
    return super.range(e, t);
  }
}
wt.prototype.point = !0;
function Ea(n, e = !1) {
  let { inclusiveStart: t, inclusiveEnd: i } = n;
  return t == null && (t = n.inclusive), i == null && (i = n.inclusive), { start: t ?? e, end: i ?? e };
}
function Lf(n, e) {
  return n == e || !!(n && e && n.compare(e));
}
function ir(n, e, t, i = 0) {
  let s = t.length - 1;
  s >= 0 && t[s] + i >= n ? t[s] = Math.max(t[s], e) : t.push(n, e);
}
class bi {
  constructor(e, t, i, s) {
    this.doc = e, this.pos = t, this.end = i, this.disallowBlockEffectsFor = s, this.content = [], this.curLine = null, this.breakAtStart = 0, this.pendingBuffer = 0, this.bufferMarks = [], this.atCursorPos = !0, this.openStart = -1, this.openEnd = -1, this.text = "", this.textOff = 0, this.cursor = e.iter(), this.skip = t;
  }
  posCovered() {
    if (this.content.length == 0)
      return !this.breakAtStart && this.doc.lineAt(this.pos).from != this.pos;
    let e = this.content[this.content.length - 1];
    return !(e.breakAfter || e instanceof pt && e.deco.endSide < 0);
  }
  getLine() {
    return this.curLine || (this.content.push(this.curLine = new ee()), this.atCursorPos = !0), this.curLine;
  }
  flushBuffer(e = this.bufferMarks) {
    this.pendingBuffer && (this.curLine.append(qi(new _t(-1), e), e.length), this.pendingBuffer = 0);
  }
  addBlockWidget(e) {
    this.flushBuffer(), this.curLine = null, this.content.push(e);
  }
  finish(e) {
    this.pendingBuffer && e <= this.bufferMarks.length ? this.flushBuffer() : this.pendingBuffer = 0, !this.posCovered() && !(e && this.content.length && this.content[this.content.length - 1] instanceof pt) && this.getLine();
  }
  buildText(e, t, i) {
    for (; e > 0; ) {
      if (this.textOff == this.text.length) {
        let { value: r, lineBreak: o, done: l } = this.cursor.next(this.skip);
        if (this.skip = 0, l)
          throw new Error("Ran out of text content when drawing inline views");
        if (o) {
          this.posCovered() || this.getLine(), this.content.length ? this.content[this.content.length - 1].breakAfter = 1 : this.breakAtStart = 1, this.flushBuffer(), this.curLine = null, this.atCursorPos = !0, e--;
          continue;
        } else
          this.text = r, this.textOff = 0;
      }
      let s = Math.min(
        this.text.length - this.textOff,
        e,
        512
        /* T.Chunk */
      );
      this.flushBuffer(t.slice(t.length - i)), this.getLine().append(qi(new nt(this.text.slice(this.textOff, this.textOff + s)), t), i), this.atCursorPos = !0, this.textOff += s, e -= s, i = 0;
    }
  }
  span(e, t, i, s) {
    this.buildText(t - e, i, s), this.pos = t, this.openStart < 0 && (this.openStart = s);
  }
  point(e, t, i, s, r, o) {
    if (this.disallowBlockEffectsFor[o] && i instanceof wt) {
      if (i.block)
        throw new RangeError("Block decorations may not be specified via plugins");
      if (t > this.doc.lineAt(this.pos).to)
        throw new RangeError("Decorations that replace line breaks may not be specified via plugins");
    }
    let l = t - e;
    if (i instanceof wt)
      if (i.block)
        i.startSide > 0 && !this.posCovered() && this.getLine(), this.addBlockWidget(new pt(i.widget || new To("div"), l, i));
      else {
        let a = ut.create(i.widget || new To("span"), l, l ? 0 : i.startSide), h = this.atCursorPos && !a.isEditable && r <= s.length && (e < t || i.startSide > 0), c = !a.isEditable && (e < t || r > s.length || i.startSide <= 0), f = this.getLine();
        this.pendingBuffer == 2 && !h && !a.isEditable && (this.pendingBuffer = 0), this.flushBuffer(s), h && (f.append(qi(new _t(1), s), r), r = s.length + Math.max(0, r - s.length)), f.append(qi(a, s), r), this.atCursorPos = c, this.pendingBuffer = c ? e < t || r > s.length ? 1 : 2 : 0, this.pendingBuffer && (this.bufferMarks = s.slice());
      }
    else
      this.doc.lineAt(this.pos).from == this.pos && this.getLine().addLineDeco(i);
    l && (this.textOff + l <= this.text.length ? this.textOff += l : (this.skip += l - (this.text.length - this.textOff), this.text = "", this.textOff = 0), this.pos = t), this.openStart < 0 && (this.openStart = r);
  }
  static build(e, t, i, s, r) {
    let o = new bi(e, t, i, r);
    return o.openEnd = F.spans(s, t, i, o), o.openStart < 0 && (o.openStart = o.openEnd), o.finish(o.openEnd), o;
  }
}
function qi(n, e) {
  for (let t of e)
    n = new st(t, [n], n.length);
  return n;
}
class To extends St {
  constructor(e) {
    super(), this.tag = e;
  }
  eq(e) {
    return e.tag == this.tag;
  }
  toDOM() {
    return document.createElement(this.tag);
  }
  updateDOM(e) {
    return e.nodeName.toLowerCase() == this.tag;
  }
  get isHidden() {
    return !0;
  }
}
const La = /* @__PURE__ */ M.define(), Na = /* @__PURE__ */ M.define(), Ia = /* @__PURE__ */ M.define(), Wa = /* @__PURE__ */ M.define(), nr = /* @__PURE__ */ M.define(), $a = /* @__PURE__ */ M.define(), Qa = /* @__PURE__ */ M.define(), za = /* @__PURE__ */ M.define({
  combine: (n) => n.some((e) => e)
}), Fa = /* @__PURE__ */ M.define({
  combine: (n) => n.some((e) => e)
});
class Ut {
  constructor(e, t = "nearest", i = "nearest", s = 5, r = 5, o = !1) {
    this.range = e, this.y = t, this.x = i, this.yMargin = s, this.xMargin = r, this.isSnapshot = o;
  }
  map(e) {
    return e.empty ? this : new Ut(this.range.map(e), this.y, this.x, this.yMargin, this.xMargin, this.isSnapshot);
  }
  clip(e) {
    return this.range.to <= e.doc.length ? this : new Ut(b.cursor(e.doc.length), this.y, this.x, this.yMargin, this.xMargin, this.isSnapshot);
  }
}
const Ui = /* @__PURE__ */ E.define({ map: (n, e) => n.map(e) });
function Le(n, e, t) {
  let i = n.facet(Wa);
  i.length ? i[0](e) : window.onerror ? window.onerror(String(e), t, void 0, void 0, e) : t ? console.error(t + ":", e) : console.error(e);
}
const Yn = /* @__PURE__ */ M.define({ combine: (n) => n.length ? n[0] : !0 });
let Nf = 0;
const ci = /* @__PURE__ */ M.define();
class Z {
  constructor(e, t, i, s, r) {
    this.id = e, this.create = t, this.domEventHandlers = i, this.domEventObservers = s, this.extension = r(this);
  }
  /**
  Define a plugin from a constructor function that creates the
  plugin's value, given an editor view.
  */
  static define(e, t) {
    const { eventHandlers: i, eventObservers: s, provide: r, decorations: o } = t || {};
    return new Z(Nf++, e, i, s, (l) => {
      let a = [ci.of(l)];
      return o && a.push(Ci.of((h) => {
        let c = h.plugin(l);
        return c ? o(c) : D.none;
      })), r && a.push(r(l)), a;
    });
  }
  /**
  Create a plugin for a class whose constructor takes a single
  editor view as argument.
  */
  static fromClass(e, t) {
    return Z.define((i) => new e(i), t);
  }
}
class us {
  constructor(e) {
    this.spec = e, this.mustUpdate = null, this.value = null;
  }
  update(e) {
    if (this.value) {
      if (this.mustUpdate) {
        let t = this.mustUpdate;
        if (this.mustUpdate = null, this.value.update)
          try {
            this.value.update(t);
          } catch (i) {
            if (Le(t.state, i, "CodeMirror plugin crashed"), this.value.destroy)
              try {
                this.value.destroy();
              } catch {
              }
            this.deactivate();
          }
      }
    } else if (this.spec)
      try {
        this.value = this.spec.create(e);
      } catch (t) {
        Le(e.state, t, "CodeMirror plugin crashed"), this.deactivate();
      }
    return this;
  }
  destroy(e) {
    var t;
    if (!((t = this.value) === null || t === void 0) && t.destroy)
      try {
        this.value.destroy();
      } catch (i) {
        Le(e.state, i, "CodeMirror plugin crashed");
      }
  }
  deactivate() {
    this.spec = this.value = null;
  }
}
const Va = /* @__PURE__ */ M.define(), $r = /* @__PURE__ */ M.define(), Ci = /* @__PURE__ */ M.define(), Qr = /* @__PURE__ */ M.define(), Ha = /* @__PURE__ */ M.define();
function Po(n, e, t) {
  let i = n.state.facet(Ha);
  if (!i.length)
    return i;
  let s = i.map((o) => o instanceof Function ? o(n) : o), r = [];
  return F.spans(s, e, t, {
    point() {
    },
    span(o, l, a, h) {
      let c = r;
      for (let f = a.length - 1; f >= 0; f--, h--) {
        let u = a[f].spec.bidiIsolate, d;
        if (u != null)
          if (h > 0 && c.length && (d = c[c.length - 1]).to == o && d.direction == u)
            d.to = l, c = d.inner;
          else {
            let p = { from: o, to: l, direction: u, inner: [] };
            c.push(p), c = p.inner;
          }
      }
    }
  }), r;
}
const qa = /* @__PURE__ */ M.define();
function Ua(n) {
  let e = 0, t = 0, i = 0, s = 0;
  for (let r of n.state.facet(qa)) {
    let o = r(n);
    o && (o.left != null && (e = Math.max(e, o.left)), o.right != null && (t = Math.max(t, o.right)), o.top != null && (i = Math.max(i, o.top)), o.bottom != null && (s = Math.max(s, o.bottom)));
  }
  return { left: e, right: t, top: i, bottom: s };
}
const fi = /* @__PURE__ */ M.define();
class Ne {
  constructor(e, t, i, s) {
    this.fromA = e, this.toA = t, this.fromB = i, this.toB = s;
  }
  join(e) {
    return new Ne(Math.min(this.fromA, e.fromA), Math.max(this.toA, e.toA), Math.min(this.fromB, e.fromB), Math.max(this.toB, e.toB));
  }
  addToSet(e) {
    let t = e.length, i = this;
    for (; t > 0; t--) {
      let s = e[t - 1];
      if (!(s.fromA > i.toA)) {
        if (s.toA < i.fromA)
          break;
        i = i.join(s), e.splice(t - 1, 1);
      }
    }
    return e.splice(t, 0, i), e;
  }
  static extendWithRanges(e, t) {
    if (t.length == 0)
      return e;
    let i = [];
    for (let s = 0, r = 0, o = 0, l = 0; ; s++) {
      let a = s == e.length ? null : e[s], h = o - l, c = a ? a.fromB : 1e9;
      for (; r < t.length && t[r] < c; ) {
        let f = t[r], u = t[r + 1], d = Math.max(l, f), p = Math.min(c, u);
        if (d <= p && new Ne(d + h, p + h, d, p).addToSet(i), u > c)
          break;
        r += 2;
      }
      if (!a)
        return i;
      new Ne(a.fromA, a.toA, a.fromB, a.toB).addToSet(i), o = a.toA, l = a.toB;
    }
  }
}
class An {
  constructor(e, t, i) {
    this.view = e, this.state = t, this.transactions = i, this.flags = 0, this.startState = e.state, this.changes = te.empty(this.startState.doc.length);
    for (let r of i)
      this.changes = this.changes.compose(r.changes);
    let s = [];
    this.changes.iterChangedRanges((r, o, l, a) => s.push(new Ne(r, o, l, a))), this.changedRanges = s;
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new An(e, t, i);
  }
  /**
  Tells you whether the [viewport](https://codemirror.net/6/docs/ref/#view.EditorView.viewport) or
  [visible ranges](https://codemirror.net/6/docs/ref/#view.EditorView.visibleRanges) changed in this
  update.
  */
  get viewportChanged() {
    return (this.flags & 4) > 0;
  }
  /**
  Indicates whether the height of a block element in the editor
  changed in this update.
  */
  get heightChanged() {
    return (this.flags & 2) > 0;
  }
  /**
  Returns true when the document was modified or the size of the
  editor, or elements within the editor, changed.
  */
  get geometryChanged() {
    return this.docChanged || (this.flags & 10) > 0;
  }
  /**
  True when this update indicates a focus change.
  */
  get focusChanged() {
    return (this.flags & 1) > 0;
  }
  /**
  Whether the document changed in this update.
  */
  get docChanged() {
    return !this.changes.empty;
  }
  /**
  Whether the selection was explicitly set in this update.
  */
  get selectionSet() {
    return this.transactions.some((e) => e.selection);
  }
  /**
  @internal
  */
  get empty() {
    return this.flags == 0 && this.transactions.length == 0;
  }
}
var K = /* @__PURE__ */ function(n) {
  return n[n.LTR = 0] = "LTR", n[n.RTL = 1] = "RTL", n;
}(K || (K = {}));
const Ai = K.LTR, Xa = K.RTL;
function ja(n) {
  let e = [];
  for (let t = 0; t < n.length; t++)
    e.push(1 << +n[t]);
  return e;
}
const If = /* @__PURE__ */ ja("88888888888888888888888888888888888666888888787833333333337888888000000000000000000000000008888880000000000000000000000000088888888888888888888888888888888888887866668888088888663380888308888800000000000000000000000800000000000000000000000000000008"), Wf = /* @__PURE__ */ ja("4444448826627288999999999992222222222222222222222222222222222222222222222229999999999999999999994444444444644222822222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222999999949999999229989999223333333333"), sr = /* @__PURE__ */ Object.create(null), Ve = [];
for (let n of ["()", "[]", "{}"]) {
  let e = /* @__PURE__ */ n.charCodeAt(0), t = /* @__PURE__ */ n.charCodeAt(1);
  sr[e] = t, sr[t] = -e;
}
function $f(n) {
  return n <= 247 ? If[n] : 1424 <= n && n <= 1524 ? 2 : 1536 <= n && n <= 1785 ? Wf[n - 1536] : 1774 <= n && n <= 2220 ? 4 : 8192 <= n && n <= 8204 ? 256 : 64336 <= n && n <= 65023 ? 4 : 1;
}
const Qf = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac\ufb50-\ufdff]/;
class dt {
  /**
  The direction of this span.
  */
  get dir() {
    return this.level % 2 ? Xa : Ai;
  }
  /**
  @internal
  */
  constructor(e, t, i) {
    this.from = e, this.to = t, this.level = i;
  }
  /**
  @internal
  */
  side(e, t) {
    return this.dir == t == e ? this.to : this.from;
  }
  /**
  @internal
  */
  static find(e, t, i, s) {
    let r = -1;
    for (let o = 0; o < e.length; o++) {
      let l = e[o];
      if (l.from <= t && l.to >= t) {
        if (l.level == i)
          return o;
        (r < 0 || (s != 0 ? s < 0 ? l.from < t : l.to > t : e[r].level > l.level)) && (r = o);
      }
    }
    if (r < 0)
      throw new RangeError("Index out of range");
    return r;
  }
}
function Ga(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++) {
    let i = n[t], s = e[t];
    if (i.from != s.from || i.to != s.to || i.direction != s.direction || !Ga(i.inner, s.inner))
      return !1;
  }
  return !0;
}
const H = [];
function zf(n, e, t, i, s) {
  for (let r = 0; r <= i.length; r++) {
    let o = r ? i[r - 1].to : e, l = r < i.length ? i[r].from : t, a = r ? 256 : s;
    for (let h = o, c = a, f = a; h < l; h++) {
      let u = $f(n.charCodeAt(h));
      u == 512 ? u = c : u == 8 && f == 4 && (u = 16), H[h] = u == 4 ? 2 : u, u & 7 && (f = u), c = u;
    }
    for (let h = o, c = a, f = a; h < l; h++) {
      let u = H[h];
      if (u == 128)
        h < l - 1 && c == H[h + 1] && c & 24 ? u = H[h] = c : H[h] = 256;
      else if (u == 64) {
        let d = h + 1;
        for (; d < l && H[d] == 64; )
          d++;
        let p = h && c == 8 || d < t && H[d] == 8 ? f == 1 ? 1 : 8 : 256;
        for (let g = h; g < d; g++)
          H[g] = p;
        h = d - 1;
      } else
        u == 8 && f == 1 && (H[h] = 1);
      c = u, u & 7 && (f = u);
    }
  }
}
function Ff(n, e, t, i, s) {
  let r = s == 1 ? 2 : 1;
  for (let o = 0, l = 0, a = 0; o <= i.length; o++) {
    let h = o ? i[o - 1].to : e, c = o < i.length ? i[o].from : t;
    for (let f = h, u, d, p; f < c; f++)
      if (d = sr[u = n.charCodeAt(f)])
        if (d < 0) {
          for (let g = l - 3; g >= 0; g -= 3)
            if (Ve[g + 1] == -d) {
              let m = Ve[g + 2], y = m & 2 ? s : m & 4 ? m & 1 ? r : s : 0;
              y && (H[f] = H[Ve[g]] = y), l = g;
              break;
            }
        } else {
          if (Ve.length == 189)
            break;
          Ve[l++] = f, Ve[l++] = u, Ve[l++] = a;
        }
      else if ((p = H[f]) == 2 || p == 1) {
        let g = p == s;
        a = g ? 0 : 1;
        for (let m = l - 3; m >= 0; m -= 3) {
          let y = Ve[m + 2];
          if (y & 2)
            break;
          if (g)
            Ve[m + 2] |= 2;
          else {
            if (y & 4)
              break;
            Ve[m + 2] |= 4;
          }
        }
      }
  }
}
function Vf(n, e, t, i) {
  for (let s = 0, r = i; s <= t.length; s++) {
    let o = s ? t[s - 1].to : n, l = s < t.length ? t[s].from : e;
    for (let a = o; a < l; ) {
      let h = H[a];
      if (h == 256) {
        let c = a + 1;
        for (; ; )
          if (c == l) {
            if (s == t.length)
              break;
            c = t[s++].to, l = s < t.length ? t[s].from : e;
          } else if (H[c] == 256)
            c++;
          else
            break;
        let f = r == 1, u = (c < e ? H[c] : i) == 1, d = f == u ? f ? 1 : 2 : i;
        for (let p = c, g = s, m = g ? t[g - 1].to : n; p > a; )
          p == m && (p = t[--g].from, m = g ? t[g - 1].to : n), H[--p] = d;
        a = c;
      } else
        r = h, a++;
    }
  }
}
function rr(n, e, t, i, s, r, o) {
  let l = i % 2 ? 2 : 1;
  if (i % 2 == s % 2)
    for (let a = e, h = 0; a < t; ) {
      let c = !0, f = !1;
      if (h == r.length || a < r[h].from) {
        let g = H[a];
        g != l && (c = !1, f = g == 16);
      }
      let u = !c && l == 1 ? [] : null, d = c ? i : i + 1, p = a;
      e:
        for (; ; )
          if (h < r.length && p == r[h].from) {
            if (f)
              break e;
            let g = r[h];
            if (!c)
              for (let m = g.to, y = h + 1; ; ) {
                if (m == t)
                  break e;
                if (y < r.length && r[y].from == m)
                  m = r[y++].to;
                else {
                  if (H[m] == l)
                    break e;
                  break;
                }
              }
            if (h++, u)
              u.push(g);
            else {
              g.from > a && o.push(new dt(a, g.from, d));
              let m = g.direction == Ai != !(d % 2);
              or(n, m ? i + 1 : i, s, g.inner, g.from, g.to, o), a = g.to;
            }
            p = g.to;
          } else {
            if (p == t || (c ? H[p] != l : H[p] == l))
              break;
            p++;
          }
      u ? rr(n, a, p, i + 1, s, u, o) : a < p && o.push(new dt(a, p, d)), a = p;
    }
  else
    for (let a = t, h = r.length; a > e; ) {
      let c = !0, f = !1;
      if (!h || a > r[h - 1].to) {
        let g = H[a - 1];
        g != l && (c = !1, f = g == 16);
      }
      let u = !c && l == 1 ? [] : null, d = c ? i : i + 1, p = a;
      e:
        for (; ; )
          if (h && p == r[h - 1].to) {
            if (f)
              break e;
            let g = r[--h];
            if (!c)
              for (let m = g.from, y = h; ; ) {
                if (m == e)
                  break e;
                if (y && r[y - 1].to == m)
                  m = r[--y].from;
                else {
                  if (H[m - 1] == l)
                    break e;
                  break;
                }
              }
            if (u)
              u.push(g);
            else {
              g.to < a && o.push(new dt(g.to, a, d));
              let m = g.direction == Ai != !(d % 2);
              or(n, m ? i + 1 : i, s, g.inner, g.from, g.to, o), a = g.from;
            }
            p = g.from;
          } else {
            if (p == e || (c ? H[p - 1] != l : H[p - 1] == l))
              break;
            p--;
          }
      u ? rr(n, p, a, i + 1, s, u, o) : p < a && o.push(new dt(p, a, d)), a = p;
    }
}
function or(n, e, t, i, s, r, o) {
  let l = e % 2 ? 2 : 1;
  zf(n, s, r, i, l), Ff(n, s, r, i, l), Vf(s, r, i, l), rr(n, s, r, e, t, i, o);
}
function Hf(n, e, t) {
  if (!n)
    return [new dt(0, 0, e == Xa ? 1 : 0)];
  if (e == Ai && !t.length && !Qf.test(n))
    return Ka(n.length);
  if (t.length)
    for (; n.length > H.length; )
      H[H.length] = 256;
  let i = [], s = e == Ai ? 0 : 1;
  return or(n, s, s, t, 0, n.length, i), i;
}
function Ka(n) {
  return [new dt(0, n, 0)];
}
let _a = "";
function qf(n, e, t, i, s) {
  var r;
  let o = i.head - n.from, l = -1;
  if (o == 0) {
    if (!s || !n.length)
      return null;
    e[0].level != t && (o = e[0].side(!1, t), l = 0);
  } else if (o == n.length) {
    if (s)
      return null;
    let u = e[e.length - 1];
    u.level != t && (o = u.side(!0, t), l = e.length - 1);
  }
  l < 0 && (l = dt.find(e, o, (r = i.bidiLevel) !== null && r !== void 0 ? r : -1, i.assoc));
  let a = e[l];
  o == a.side(s, t) && (a = e[l += s ? 1 : -1], o = a.side(!s, t));
  let h = s == (a.dir == t), c = le(n.text, o, h);
  if (_a = n.text.slice(Math.min(o, c), Math.max(o, c)), c > a.from && c < a.to)
    return b.cursor(c + n.from, h ? -1 : 1, a.level);
  let f = l == (s ? e.length - 1 : 0) ? null : e[l + (s ? 1 : -1)];
  return !f && a.level != t ? b.cursor(s ? n.to : n.from, s ? -1 : 1, t) : f && f.level < a.level ? b.cursor(f.side(!s, t) + n.from, s ? 1 : -1, f.level) : b.cursor(c + n.from, s ? -1 : 1, a.level);
}
class Do extends X {
  get length() {
    return this.view.state.doc.length;
  }
  constructor(e) {
    super(), this.view = e, this.decorations = [], this.dynamicDecorationMap = [], this.domChanged = null, this.hasComposition = null, this.markedForComposition = /* @__PURE__ */ new Set(), this.minWidth = 0, this.minWidthFrom = 0, this.minWidthTo = 0, this.impreciseAnchor = null, this.impreciseHead = null, this.forceSelection = !1, this.lastUpdate = Date.now(), this.setDOM(e.contentDOM), this.children = [new ee()], this.children[0].setParent(this), this.updateDeco(), this.updateInner([new Ne(0, 0, 0, e.state.doc.length)], 0, null);
  }
  // Update the document view to a given state.
  update(e) {
    var t;
    let i = e.changedRanges;
    this.minWidth > 0 && i.length && (i.every(({ fromA: h, toA: c }) => c < this.minWidthFrom || h > this.minWidthTo) ? (this.minWidthFrom = e.changes.mapPos(this.minWidthFrom, 1), this.minWidthTo = e.changes.mapPos(this.minWidthTo, 1)) : this.minWidth = this.minWidthFrom = this.minWidthTo = 0);
    let s = -1;
    this.view.inputState.composing >= 0 && (!((t = this.domChanged) === null || t === void 0) && t.newSel ? s = this.domChanged.newSel.head : !Yf(e.changes, this.hasComposition) && !e.selectionSet && (s = e.state.selection.main.head));
    let r = s > -1 ? Xf(this.view, e.changes, s) : null;
    if (this.domChanged = null, this.hasComposition) {
      this.markedForComposition.clear();
      let { from: h, to: c } = this.hasComposition;
      i = new Ne(h, c, e.changes.mapPos(h, -1), e.changes.mapPos(c, 1)).addToSet(i.slice());
    }
    this.hasComposition = r ? { from: r.range.fromB, to: r.range.toB } : null, (P.ie || P.chrome) && !r && e && e.state.doc.lines != e.startState.doc.lines && (this.forceSelection = !0);
    let o = this.decorations, l = this.updateDeco(), a = Kf(o, l, e.changes);
    return i = Ne.extendWithRanges(i, a), !(this.flags & 7) && i.length == 0 ? !1 : (this.updateInner(i, e.startState.doc.length, r), e.transactions.length && (this.lastUpdate = Date.now()), !0);
  }
  // Used by update and the constructor do perform the actual DOM
  // update
  updateInner(e, t, i) {
    this.view.viewState.mustMeasureContent = !0, this.updateChildren(e, t, i);
    let { observer: s } = this.view;
    s.ignore(() => {
      this.dom.style.height = this.view.viewState.contentHeight / this.view.scaleY + "px", this.dom.style.flexBasis = this.minWidth ? this.minWidth + "px" : "";
      let o = P.chrome || P.ios ? { node: s.selectionRange.focusNode, written: !1 } : void 0;
      this.sync(this.view, o), this.flags &= -8, o && (o.written || s.selectionRange.focusNode != o.node) && (this.forceSelection = !0), this.dom.style.height = "";
    }), this.markedForComposition.forEach(
      (o) => o.flags &= -9
      /* ViewFlag.Composition */
    );
    let r = [];
    if (this.view.viewport.from || this.view.viewport.to < this.view.state.doc.length)
      for (let o of this.children)
        o instanceof pt && o.widget instanceof Ro && r.push(o.dom);
    s.updateGaps(r);
  }
  updateChildren(e, t, i) {
    let s = i ? i.range.addToSet(e.slice()) : e, r = this.childCursor(t);
    for (let o = s.length - 1; ; o--) {
      let l = o >= 0 ? s[o] : null;
      if (!l)
        break;
      let { fromA: a, toA: h, fromB: c, toB: f } = l, u, d, p, g;
      if (i && i.range.fromB < f && i.range.toB > c) {
        let S = bi.build(this.view.state.doc, c, i.range.fromB, this.decorations, this.dynamicDecorationMap), w = bi.build(this.view.state.doc, i.range.toB, f, this.decorations, this.dynamicDecorationMap);
        d = S.breakAtStart, p = S.openStart, g = w.openEnd;
        let A = this.compositionView(i);
        w.breakAtStart ? A.breakAfter = 1 : w.content.length && A.merge(A.length, A.length, w.content[0], !1, w.openStart, 0) && (A.breakAfter = w.content[0].breakAfter, w.content.shift()), S.content.length && A.merge(0, 0, S.content[S.content.length - 1], !0, 0, S.openEnd) && S.content.pop(), u = S.content.concat(A).concat(w.content);
      } else
        ({ content: u, breakAtStart: d, openStart: p, openEnd: g } = bi.build(this.view.state.doc, c, f, this.decorations, this.dynamicDecorationMap));
      let { i: m, off: y } = r.findPos(h, 1), { i: k, off: v } = r.findPos(a, -1);
      Aa(this, k, v, m, y, u, d, p, g);
    }
    i && this.fixCompositionDOM(i);
  }
  compositionView(e) {
    let t = new nt(e.text.nodeValue);
    t.flags |= 8;
    for (let { deco: s } of e.marks)
      t = new st(s, [t], t.length);
    let i = new ee();
    return i.append(t, 0), i;
  }
  fixCompositionDOM(e) {
    let t = (r, o) => {
      o.flags |= 8 | (o.children.some(
        (a) => a.flags & 7
        /* ViewFlag.Dirty */
      ) ? 1 : 0), this.markedForComposition.add(o);
      let l = X.get(r);
      l && l != o && (l.dom = null), o.setDOM(r);
    }, i = this.childPos(e.range.fromB, 1), s = this.children[i.i];
    t(e.line, s);
    for (let r = e.marks.length - 1; r >= -1; r--)
      i = s.childPos(i.off, 1), s = s.children[i.i], t(r >= 0 ? e.marks[r].node : e.text, s);
  }
  // Sync the DOM selection to this.state.selection
  updateSelection(e = !1, t = !1) {
    (e || !this.view.observer.selectionRange.focusNode) && this.view.observer.readSelectionRange();
    let i = this.view.root.activeElement, s = i == this.dom, r = !s && dn(this.dom, this.view.observer.selectionRange) && !(i && this.dom.contains(i));
    if (!(s || t || r))
      return;
    let o = this.forceSelection;
    this.forceSelection = !1;
    let l = this.view.state.selection.main, a = this.moveToLine(this.domAtPos(l.anchor)), h = l.empty ? a : this.moveToLine(this.domAtPos(l.head));
    if (P.gecko && l.empty && !this.hasComposition && Uf(a)) {
      let f = document.createTextNode("");
      this.view.observer.ignore(() => a.node.insertBefore(f, a.node.childNodes[a.offset] || null)), a = h = new fe(f, 0), o = !0;
    }
    let c = this.view.observer.selectionRange;
    (o || !c.focusNode || !Cn(a.node, a.offset, c.anchorNode, c.anchorOffset) || !Cn(h.node, h.offset, c.focusNode, c.focusOffset)) && (this.view.observer.ignore(() => {
      P.android && P.chrome && this.dom.contains(c.focusNode) && _f(c.focusNode, this.dom) && (this.dom.blur(), this.dom.focus({ preventScroll: !0 }));
      let f = vn(this.view.root);
      if (f)
        if (l.empty) {
          if (P.gecko) {
            let u = jf(a.node, a.offset);
            if (u && u != 3) {
              let d = Za(a.node, a.offset, u == 1 ? 1 : -1);
              d && (a = new fe(d.node, d.offset));
            }
          }
          f.collapse(a.node, a.offset), l.bidiLevel != null && f.caretBidiLevel !== void 0 && (f.caretBidiLevel = l.bidiLevel);
        } else if (f.extend) {
          f.collapse(a.node, a.offset);
          try {
            f.extend(h.node, h.offset);
          } catch {
          }
        } else {
          let u = document.createRange();
          l.anchor > l.head && ([a, h] = [h, a]), u.setEnd(h.node, h.offset), u.setStart(a.node, a.offset), f.removeAllRanges(), f.addRange(u);
        }
      r && this.view.root.activeElement == this.dom && (this.dom.blur(), i && i.focus());
    }), this.view.observer.setSelectionRange(a, h)), this.impreciseAnchor = a.precise ? null : new fe(c.anchorNode, c.anchorOffset), this.impreciseHead = h.precise ? null : new fe(c.focusNode, c.focusOffset);
  }
  enforceCursorAssoc() {
    if (this.hasComposition)
      return;
    let { view: e } = this, t = e.state.selection.main, i = vn(e.root), { anchorNode: s, anchorOffset: r } = e.observer.selectionRange;
    if (!i || !t.empty || !t.assoc || !i.modify)
      return;
    let o = ee.find(this, t.head);
    if (!o)
      return;
    let l = o.posAtStart;
    if (t.head == l || t.head == l + o.length)
      return;
    let a = this.coordsAt(t.head, -1), h = this.coordsAt(t.head, 1);
    if (!a || !h || a.bottom > h.top)
      return;
    let c = this.domAtPos(t.head + t.assoc);
    i.collapse(c.node, c.offset), i.modify("move", t.assoc < 0 ? "forward" : "backward", "lineboundary"), e.observer.readSelectionRange();
    let f = e.observer.selectionRange;
    e.docView.posFromDOM(f.anchorNode, f.anchorOffset) != t.from && i.collapse(s, r);
  }
  // If a position is in/near a block widget, move it to a nearby text
  // line, since we don't want the cursor inside a block widget.
  moveToLine(e) {
    let t = this.dom, i;
    if (e.node != t)
      return e;
    for (let s = e.offset; !i && s < t.childNodes.length; s++) {
      let r = X.get(t.childNodes[s]);
      r instanceof ee && (i = r.domAtPos(0));
    }
    for (let s = e.offset - 1; !i && s >= 0; s--) {
      let r = X.get(t.childNodes[s]);
      r instanceof ee && (i = r.domAtPos(r.length));
    }
    return i ? new fe(i.node, i.offset, !0) : e;
  }
  nearest(e) {
    for (let t = e; t; ) {
      let i = X.get(t);
      if (i && i.rootView == this)
        return i;
      t = t.parentNode;
    }
    return null;
  }
  posFromDOM(e, t) {
    let i = this.nearest(e);
    if (!i)
      throw new RangeError("Trying to find position for a DOM position outside of the document");
    return i.localPosFromDOM(e, t) + i.posAtStart;
  }
  domAtPos(e) {
    let { i: t, off: i } = this.childCursor().findPos(e, -1);
    for (; t < this.children.length - 1; ) {
      let s = this.children[t];
      if (i < s.length || s instanceof ee)
        break;
      t++, i = 0;
    }
    return this.children[t].domAtPos(i);
  }
  coordsAt(e, t) {
    let i = null, s = 0;
    for (let r = this.length, o = this.children.length - 1; o >= 0; o--) {
      let l = this.children[o], a = r - l.breakAfter, h = a - l.length;
      if (a < e)
        break;
      h <= e && (h < e || l.covers(-1)) && (a > e || l.covers(1)) && (!i || l instanceof ee && !(i instanceof ee && t >= 0)) && (i = l, s = h), r = h;
    }
    return i ? i.coordsAt(e - s, t) : null;
  }
  coordsForChar(e) {
    let { i: t, off: i } = this.childPos(e, 1), s = this.children[t];
    if (!(s instanceof ee))
      return null;
    for (; s.children.length; ) {
      let { i: l, off: a } = s.childPos(i, 1);
      for (; ; l++) {
        if (l == s.children.length)
          return null;
        if ((s = s.children[l]).length)
          break;
      }
      i = a;
    }
    if (!(s instanceof nt))
      return null;
    let r = le(s.text, i);
    if (r == i)
      return null;
    let o = Et(s.dom, i, r).getClientRects();
    for (let l = 0; l < o.length; l++) {
      let a = o[l];
      if (l == o.length - 1 || a.top < a.bottom && a.left < a.right)
        return a;
    }
    return null;
  }
  measureVisibleLineHeights(e) {
    let t = [], { from: i, to: s } = e, r = this.view.contentDOM.clientWidth, o = r > Math.max(this.view.scrollDOM.clientWidth, this.minWidth) + 1, l = -1, a = this.view.textDirection == K.LTR;
    for (let h = 0, c = 0; c < this.children.length; c++) {
      let f = this.children[c], u = h + f.length;
      if (u > s)
        break;
      if (h >= i) {
        let d = f.dom.getBoundingClientRect();
        if (t.push(d.height), o) {
          let p = f.dom.lastChild, g = p ? Si(p) : [];
          if (g.length) {
            let m = g[g.length - 1], y = a ? m.right - d.left : d.right - m.left;
            y > l && (l = y, this.minWidth = r, this.minWidthFrom = h, this.minWidthTo = u);
          }
        }
      }
      h = u + f.breakAfter;
    }
    return t;
  }
  textDirectionAt(e) {
    let { i: t } = this.childPos(e, 1);
    return getComputedStyle(this.children[t].dom).direction == "rtl" ? K.RTL : K.LTR;
  }
  measureTextSize() {
    for (let r of this.children)
      if (r instanceof ee) {
        let o = r.measureTextSize();
        if (o)
          return o;
      }
    let e = document.createElement("div"), t, i, s;
    return e.className = "cm-line", e.style.width = "99999px", e.style.position = "absolute", e.textContent = "abc def ghi jkl mno pqr stu", this.view.observer.ignore(() => {
      this.dom.appendChild(e);
      let r = Si(e.firstChild)[0];
      t = e.getBoundingClientRect().height, i = r ? r.width / 27 : 7, s = r ? r.height : t, e.remove();
    }), { lineHeight: t, charWidth: i, textHeight: s };
  }
  childCursor(e = this.length) {
    let t = this.children.length;
    return t && (e -= this.children[--t].length), new Ca(this.children, e, t);
  }
  computeBlockGapDeco() {
    let e = [], t = this.view.viewState;
    for (let i = 0, s = 0; ; s++) {
      let r = s == t.viewports.length ? null : t.viewports[s], o = r ? r.from - 1 : this.length;
      if (o > i) {
        let l = (t.lineBlockAt(o).bottom - t.lineBlockAt(i).top) / this.view.scaleY;
        e.push(D.replace({
          widget: new Ro(l),
          block: !0,
          inclusive: !0,
          isBlockGap: !0
        }).range(i, o));
      }
      if (!r)
        break;
      i = r.to + 1;
    }
    return D.set(e);
  }
  updateDeco() {
    let e = this.view.state.facet(Ci).map((t, i) => (this.dynamicDecorationMap[i] = typeof t == "function") ? t(this.view) : t);
    for (let t = e.length; t < e.length + 3; t++)
      this.dynamicDecorationMap[t] = !1;
    return this.decorations = [
      ...e,
      this.computeBlockGapDeco(),
      this.view.viewState.lineGapDeco
    ];
  }
  scrollIntoView(e) {
    if (e.isSnapshot) {
      let h = this.view.viewState.lineBlockAt(e.range.head);
      this.view.scrollDOM.scrollTop = h.top - e.yMargin, this.view.scrollDOM.scrollLeft = e.xMargin;
      return;
    }
    let { range: t } = e, i = this.coordsAt(t.head, t.empty ? t.assoc : t.head > t.anchor ? -1 : 1), s;
    if (!i)
      return;
    !t.empty && (s = this.coordsAt(t.anchor, t.anchor > t.head ? -1 : 1)) && (i = {
      left: Math.min(i.left, s.left),
      top: Math.min(i.top, s.top),
      right: Math.max(i.right, s.right),
      bottom: Math.max(i.bottom, s.bottom)
    });
    let r = Ua(this.view), o = {
      left: i.left - r.left,
      top: i.top - r.top,
      right: i.right + r.right,
      bottom: i.bottom + r.bottom
    }, { offsetWidth: l, offsetHeight: a } = this.view.scrollDOM;
    Cf(this.view.scrollDOM, o, t.head < t.anchor ? -1 : 1, e.x, e.y, Math.max(Math.min(e.xMargin, l), -l), Math.max(Math.min(e.yMargin, a), -a), this.view.textDirection == K.LTR);
  }
}
function Uf(n) {
  return n.node.nodeType == 1 && n.node.firstChild && (n.offset == 0 || n.node.childNodes[n.offset - 1].contentEditable == "false") && (n.offset == n.node.childNodes.length || n.node.childNodes[n.offset].contentEditable == "false");
}
class Ro extends St {
  constructor(e) {
    super(), this.height = e;
  }
  toDOM() {
    let e = document.createElement("div");
    return this.updateDOM(e), e;
  }
  eq(e) {
    return e.height == this.height;
  }
  updateDOM(e) {
    return e.style.height = this.height + "px", !0;
  }
  get estimatedHeight() {
    return this.height;
  }
}
function Ya(n, e) {
  let t = n.observer.selectionRange, i = t.focusNode && Za(t.focusNode, t.focusOffset, 0);
  if (!i)
    return null;
  let s = e - i.offset;
  return { from: s, to: s + i.node.nodeValue.length, node: i.node };
}
function Xf(n, e, t) {
  let i = Ya(n, t);
  if (!i)
    return null;
  let { node: s, from: r, to: o } = i, l = s.nodeValue;
  if (/[\n\r]/.test(l) || n.state.doc.sliceString(i.from, i.to) != l)
    return null;
  let a = e.invertedDesc, h = new Ne(a.mapPos(r), a.mapPos(o), r, o), c = [];
  for (let f = s.parentNode; ; f = f.parentNode) {
    let u = X.get(f);
    if (u instanceof st)
      c.push({ node: f, deco: u.mark });
    else {
      if (u instanceof ee || f.nodeName == "DIV" && f.parentNode == n.contentDOM)
        return { range: h, text: s, marks: c, line: f };
      if (f != n.contentDOM)
        c.push({ node: f, deco: new Ni({
          inclusive: !0,
          attributes: Ef(f),
          tagName: f.tagName.toLowerCase()
        }) });
      else
        return null;
    }
  }
}
function Za(n, e, t) {
  if (t <= 0)
    for (let i = n, s = e; ; ) {
      if (i.nodeType == 3)
        return { node: i, offset: s };
      if (i.nodeType == 1 && s > 0)
        i = i.childNodes[s - 1], s = it(i);
      else
        break;
    }
  if (t >= 0)
    for (let i = n, s = e; ; ) {
      if (i.nodeType == 3)
        return { node: i, offset: s };
      if (i.nodeType == 1 && s < i.childNodes.length && t >= 0)
        i = i.childNodes[s], s = 0;
      else
        break;
    }
  return null;
}
function jf(n, e) {
  return n.nodeType != 1 ? 0 : (e && n.childNodes[e - 1].contentEditable == "false" ? 1 : 0) | (e < n.childNodes.length && n.childNodes[e].contentEditable == "false" ? 2 : 0);
}
let Gf = class {
  constructor() {
    this.changes = [];
  }
  compareRange(e, t) {
    ir(e, t, this.changes);
  }
  comparePoint(e, t) {
    ir(e, t, this.changes);
  }
};
function Kf(n, e, t) {
  let i = new Gf();
  return F.compare(n, e, t, i), i.changes;
}
function _f(n, e) {
  for (let t = n; t && t != e; t = t.assignedSlot || t.parentNode)
    if (t.nodeType == 1 && t.contentEditable == "false")
      return !0;
  return !1;
}
function Yf(n, e) {
  let t = !1;
  return e && n.iterChangedRanges((i, s) => {
    i < e.to && s > e.from && (t = !0);
  }), t;
}
function Zf(n, e, t = 1) {
  let i = n.charCategorizer(e), s = n.doc.lineAt(e), r = e - s.from;
  if (s.length == 0)
    return b.cursor(e);
  r == 0 ? t = 1 : r == s.length && (t = -1);
  let o = r, l = r;
  t < 0 ? o = le(s.text, r, !1) : l = le(s.text, r);
  let a = i(s.text.slice(o, l));
  for (; o > 0; ) {
    let h = le(s.text, o, !1);
    if (i(s.text.slice(h, o)) != a)
      break;
    o = h;
  }
  for (; l < s.length; ) {
    let h = le(s.text, l);
    if (i(s.text.slice(l, h)) != a)
      break;
    l = h;
  }
  return b.range(o + s.from, l + s.from);
}
function Jf(n, e) {
  return e.left > n ? e.left - n : Math.max(0, n - e.right);
}
function eu(n, e) {
  return e.top > n ? e.top - n : Math.max(0, n - e.bottom);
}
function ds(n, e) {
  return n.top < e.bottom - 1 && n.bottom > e.top + 1;
}
function Bo(n, e) {
  return e < n.top ? { top: e, left: n.left, right: n.right, bottom: n.bottom } : n;
}
function Eo(n, e) {
  return e > n.bottom ? { top: n.top, left: n.left, right: n.right, bottom: e } : n;
}
function lr(n, e, t) {
  let i, s, r, o, l = !1, a, h, c, f;
  for (let p = n.firstChild; p; p = p.nextSibling) {
    let g = Si(p);
    for (let m = 0; m < g.length; m++) {
      let y = g[m];
      s && ds(s, y) && (y = Bo(Eo(y, s.bottom), s.top));
      let k = Jf(e, y), v = eu(t, y);
      if (k == 0 && v == 0)
        return p.nodeType == 3 ? Lo(p, e, t) : lr(p, e, t);
      if (!i || o > v || o == v && r > k) {
        i = p, s = y, r = k, o = v;
        let S = v ? t < y.top ? -1 : 1 : k ? e < y.left ? -1 : 1 : 0;
        l = !S || (S > 0 ? m < g.length - 1 : m > 0);
      }
      k == 0 ? t > y.bottom && (!c || c.bottom < y.bottom) ? (a = p, c = y) : t < y.top && (!f || f.top > y.top) && (h = p, f = y) : c && ds(c, y) ? c = Eo(c, y.bottom) : f && ds(f, y) && (f = Bo(f, y.top));
    }
  }
  if (c && c.bottom >= t ? (i = a, s = c) : f && f.top <= t && (i = h, s = f), !i)
    return { node: n, offset: 0 };
  let u = Math.max(s.left, Math.min(s.right, e));
  if (i.nodeType == 3)
    return Lo(i, u, t);
  if (l && i.contentEditable != "false")
    return lr(i, u, t);
  let d = Array.prototype.indexOf.call(n.childNodes, i) + (e >= (s.left + s.right) / 2 ? 1 : 0);
  return { node: n, offset: d };
}
function Lo(n, e, t) {
  let i = n.nodeValue.length, s = -1, r = 1e9, o = 0;
  for (let l = 0; l < i; l++) {
    let a = Et(n, l, l + 1).getClientRects();
    for (let h = 0; h < a.length; h++) {
      let c = a[h];
      if (c.top == c.bottom)
        continue;
      o || (o = e - c.left);
      let f = (c.top > t ? c.top - t : t - c.bottom) - 1;
      if (c.left - 1 <= e && c.right + 1 >= e && f < r) {
        let u = e >= (c.left + c.right) / 2, d = u;
        if ((P.chrome || P.gecko) && Et(n, l).getBoundingClientRect().left == c.right && (d = !u), f <= 0)
          return { node: n, offset: l + (d ? 1 : 0) };
        s = l + (d ? 1 : 0), r = f;
      }
    }
  }
  return { node: n, offset: s > -1 ? s : o > 0 ? n.nodeValue.length : 0 };
}
function Ja(n, e, t, i = -1) {
  var s, r;
  let o = n.contentDOM.getBoundingClientRect(), l = o.top + n.viewState.paddingTop, a, { docHeight: h } = n.viewState, { x: c, y: f } = e, u = f - l;
  if (u < 0)
    return 0;
  if (u > h)
    return n.state.doc.length;
  for (let S = n.viewState.heightOracle.textHeight / 2, w = !1; a = n.elementAtHeight(u), a.type != me.Text; )
    for (; u = i > 0 ? a.bottom + S : a.top - S, !(u >= 0 && u <= h); ) {
      if (w)
        return t ? null : 0;
      w = !0, i = -i;
    }
  f = l + u;
  let d = a.from;
  if (d < n.viewport.from)
    return n.viewport.from == 0 ? 0 : t ? null : No(n, o, a, c, f);
  if (d > n.viewport.to)
    return n.viewport.to == n.state.doc.length ? n.state.doc.length : t ? null : No(n, o, a, c, f);
  let p = n.dom.ownerDocument, g = n.root.elementFromPoint ? n.root : p, m = g.elementFromPoint(c, f);
  m && !n.contentDOM.contains(m) && (m = null), m || (c = Math.max(o.left + 1, Math.min(o.right - 1, c)), m = g.elementFromPoint(c, f), m && !n.contentDOM.contains(m) && (m = null));
  let y, k = -1;
  if (m && ((s = n.docView.nearest(m)) === null || s === void 0 ? void 0 : s.isEditable) != !1) {
    if (p.caretPositionFromPoint) {
      let S = p.caretPositionFromPoint(c, f);
      S && ({ offsetNode: y, offset: k } = S);
    } else if (p.caretRangeFromPoint) {
      let S = p.caretRangeFromPoint(c, f);
      S && ({ startContainer: y, startOffset: k } = S, (!n.contentDOM.contains(y) || P.safari && tu(y, k, c) || P.chrome && iu(y, k, c)) && (y = void 0));
    }
  }
  if (!y || !n.docView.dom.contains(y)) {
    let S = ee.find(n.docView, d);
    if (!S)
      return u > a.top + a.height / 2 ? a.to : a.from;
    ({ node: y, offset: k } = lr(S.dom, c, f));
  }
  let v = n.docView.nearest(y);
  if (!v)
    return null;
  if (v.isWidget && ((r = v.dom) === null || r === void 0 ? void 0 : r.nodeType) == 1) {
    let S = v.dom.getBoundingClientRect();
    return e.y < S.top || e.y <= S.bottom && e.x <= (S.left + S.right) / 2 ? v.posAtStart : v.posAtEnd;
  } else
    return v.localPosFromDOM(y, k) + v.posAtStart;
}
function No(n, e, t, i, s) {
  let r = Math.round((i - e.left) * n.defaultCharacterWidth);
  if (n.lineWrapping && t.height > n.defaultLineHeight * 1.5) {
    let l = n.viewState.heightOracle.textHeight, a = Math.floor((s - t.top - (n.defaultLineHeight - l) * 0.5) / l);
    r += a * n.viewState.heightOracle.lineLength;
  }
  let o = n.state.sliceDoc(t.from, t.to);
  return t.from + js(o, r, n.state.tabSize);
}
function tu(n, e, t) {
  let i;
  if (n.nodeType != 3 || e != (i = n.nodeValue.length))
    return !1;
  for (let s = n.nextSibling; s; s = s.nextSibling)
    if (s.nodeType != 1 || s.nodeName != "BR")
      return !1;
  return Et(n, i - 1, i).getBoundingClientRect().left > t;
}
function iu(n, e, t) {
  if (e != 0)
    return !1;
  for (let s = n; ; ) {
    let r = s.parentNode;
    if (!r || r.nodeType != 1 || r.firstChild != s)
      return !1;
    if (r.classList.contains("cm-line"))
      break;
    s = r;
  }
  let i = n.nodeType == 1 ? n.getBoundingClientRect() : Et(n, 0, Math.max(n.nodeValue.length, 1)).getBoundingClientRect();
  return t - i.left > 5;
}
function ar(n, e) {
  let t = n.lineBlockAt(e);
  if (Array.isArray(t.type)) {
    for (let i of t.type)
      if (i.to > e || i.to == e && (i.to == t.to || i.type == me.Text))
        return i;
  }
  return t;
}
function nu(n, e, t, i) {
  let s = ar(n, e.head), r = !i || s.type != me.Text || !(n.lineWrapping || s.widgetLineBreaks) ? null : n.coordsAtPos(e.assoc < 0 && e.head > s.from ? e.head - 1 : e.head);
  if (r) {
    let o = n.dom.getBoundingClientRect(), l = n.textDirectionAt(s.from), a = n.posAtCoords({
      x: t == (l == K.LTR) ? o.right - 1 : o.left + 1,
      y: (r.top + r.bottom) / 2
    });
    if (a != null)
      return b.cursor(a, t ? -1 : 1);
  }
  return b.cursor(t ? s.to : s.from, t ? -1 : 1);
}
function Io(n, e, t, i) {
  let s = n.state.doc.lineAt(e.head), r = n.bidiSpans(s), o = n.textDirectionAt(s.from);
  for (let l = e, a = null; ; ) {
    let h = qf(s, r, o, l, t), c = _a;
    if (!h) {
      if (s.number == (t ? n.state.doc.lines : 1))
        return l;
      c = `
`, s = n.state.doc.line(s.number + (t ? 1 : -1)), r = n.bidiSpans(s), h = b.cursor(t ? s.from : s.to);
    }
    if (a) {
      if (!a(c))
        return l;
    } else {
      if (!i)
        return h;
      a = i(c);
    }
    l = h;
  }
}
function su(n, e, t) {
  let i = n.state.charCategorizer(e), s = i(t);
  return (r) => {
    let o = i(r);
    return s == j.Space && (s = o), s == o;
  };
}
function ru(n, e, t, i) {
  let s = e.head, r = t ? 1 : -1;
  if (s == (t ? n.state.doc.length : 0))
    return b.cursor(s, e.assoc);
  let o = e.goalColumn, l, a = n.contentDOM.getBoundingClientRect(), h = n.coordsAtPos(s, e.assoc || -1), c = n.documentTop;
  if (h)
    o == null && (o = h.left - a.left), l = r < 0 ? h.top : h.bottom;
  else {
    let d = n.viewState.lineBlockAt(s);
    o == null && (o = Math.min(a.right - a.left, n.defaultCharacterWidth * (s - d.from))), l = (r < 0 ? d.top : d.bottom) + c;
  }
  let f = a.left + o, u = i ?? n.viewState.heightOracle.textHeight >> 1;
  for (let d = 0; ; d += 10) {
    let p = l + (u + d) * r, g = Ja(n, { x: f, y: p }, !1, r);
    if (p < a.top || p > a.bottom || (r < 0 ? g < s : g > s)) {
      let m = n.docView.coordsForChar(g), y = !m || p < m.top ? -1 : 1;
      return b.cursor(g, y, void 0, o);
    }
  }
}
function pn(n, e, t) {
  for (; ; ) {
    let i = 0;
    for (let s of n)
      s.between(e - 1, e + 1, (r, o, l) => {
        if (e > r && e < o) {
          let a = i || t || (e - r < o - e ? -1 : 1);
          e = a < 0 ? r : o, i = a;
        }
      });
    if (!i)
      return e;
  }
}
function ps(n, e, t) {
  let i = pn(n.state.facet(Qr).map((s) => s(n)), t.from, e.head > t.from ? -1 : 1);
  return i == t.from ? t : b.cursor(i, i < t.from ? 1 : -1);
}
class ou {
  setSelectionOrigin(e) {
    this.lastSelectionOrigin = e, this.lastSelectionTime = Date.now();
  }
  constructor(e) {
    this.view = e, this.lastKeyCode = 0, this.lastKeyTime = 0, this.lastTouchTime = 0, this.lastFocusTime = 0, this.lastScrollTop = 0, this.lastScrollLeft = 0, this.pendingIOSKey = void 0, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastEscPress = 0, this.lastContextMenu = 0, this.scrollHandlers = [], this.handlers = /* @__PURE__ */ Object.create(null), this.composing = -1, this.compositionFirstChange = null, this.compositionEndedAt = 0, this.compositionPendingKey = !1, this.compositionPendingChange = !1, this.mouseSelection = null, this.draggedContent = null, this.handleEvent = this.handleEvent.bind(this), this.notifiedFocused = e.hasFocus, P.safari && e.contentDOM.addEventListener("input", () => null), P.gecko && Ou(e.contentDOM.ownerDocument);
  }
  handleEvent(e) {
    !pu(this.view, e) || this.ignoreDuringComposition(e) || e.type == "keydown" && this.keydown(e) || this.runHandlers(e.type, e);
  }
  runHandlers(e, t) {
    let i = this.handlers[e];
    if (i) {
      for (let s of i.observers)
        s(this.view, t);
      for (let s of i.handlers) {
        if (t.defaultPrevented)
          break;
        if (s(this.view, t)) {
          t.preventDefault();
          break;
        }
      }
    }
  }
  ensureHandlers(e) {
    let t = lu(e), i = this.handlers, s = this.view.contentDOM;
    for (let r in t)
      if (r != "scroll") {
        let o = !t[r].handlers.length, l = i[r];
        l && o != !l.handlers.length && (s.removeEventListener(r, this.handleEvent), l = null), l || s.addEventListener(r, this.handleEvent, { passive: o });
      }
    for (let r in i)
      r != "scroll" && !t[r] && s.removeEventListener(r, this.handleEvent);
    this.handlers = t;
  }
  keydown(e) {
    if (this.lastKeyCode = e.keyCode, this.lastKeyTime = Date.now(), e.keyCode == 9 && Date.now() < this.lastEscPress + 2e3)
      return !0;
    if (e.keyCode != 27 && th.indexOf(e.keyCode) < 0 && (this.view.inputState.lastEscPress = 0), P.android && P.chrome && !e.synthetic && (e.keyCode == 13 || e.keyCode == 8))
      return this.view.observer.delayAndroidKey(e.key, e.keyCode), !0;
    let t;
    return P.ios && !e.synthetic && !e.altKey && !e.metaKey && ((t = eh.find((i) => i.keyCode == e.keyCode)) && !e.ctrlKey || au.indexOf(e.key) > -1 && e.ctrlKey && !e.shiftKey) ? (this.pendingIOSKey = t || e, setTimeout(() => this.flushIOSKey(), 250), !0) : (e.keyCode != 229 && this.view.observer.forceFlush(), !1);
  }
  flushIOSKey() {
    let e = this.pendingIOSKey;
    return e ? (this.pendingIOSKey = void 0, qt(this.view.contentDOM, e.key, e.keyCode)) : !1;
  }
  ignoreDuringComposition(e) {
    return /^key/.test(e.type) ? this.composing > 0 ? !0 : P.safari && !P.ios && this.compositionPendingKey && Date.now() - this.compositionEndedAt < 100 ? (this.compositionPendingKey = !1, !0) : !1 : !1;
  }
  startMouseSelection(e) {
    this.mouseSelection && this.mouseSelection.destroy(), this.mouseSelection = e;
  }
  update(e) {
    this.mouseSelection && this.mouseSelection.update(e), this.draggedContent && e.docChanged && (this.draggedContent = this.draggedContent.map(e.changes)), e.transactions.length && (this.lastKeyCode = this.lastSelectionTime = 0);
  }
  destroy() {
    this.mouseSelection && this.mouseSelection.destroy();
  }
}
function Wo(n, e) {
  return (t, i) => {
    try {
      return e.call(n, i, t);
    } catch (s) {
      Le(t.state, s);
    }
  };
}
function lu(n) {
  let e = /* @__PURE__ */ Object.create(null);
  function t(i) {
    return e[i] || (e[i] = { observers: [], handlers: [] });
  }
  for (let i of n) {
    let s = i.spec;
    if (s && s.domEventHandlers)
      for (let r in s.domEventHandlers) {
        let o = s.domEventHandlers[r];
        o && t(r).handlers.push(Wo(i.value, o));
      }
    if (s && s.domEventObservers)
      for (let r in s.domEventObservers) {
        let o = s.domEventObservers[r];
        o && t(r).observers.push(Wo(i.value, o));
      }
  }
  for (let i in $e)
    t(i).handlers.push($e[i]);
  for (let i in Qe)
    t(i).observers.push(Qe[i]);
  return e;
}
const eh = [
  { key: "Backspace", keyCode: 8, inputType: "deleteContentBackward" },
  { key: "Enter", keyCode: 13, inputType: "insertParagraph" },
  { key: "Enter", keyCode: 13, inputType: "insertLineBreak" },
  { key: "Delete", keyCode: 46, inputType: "deleteContentForward" }
], au = "dthko", th = [16, 17, 18, 20, 91, 92, 224, 225], Xi = 6;
function ji(n) {
  return Math.max(0, n) * 0.7 + 8;
}
function hu(n, e) {
  return Math.max(Math.abs(n.clientX - e.clientX), Math.abs(n.clientY - e.clientY));
}
class cu {
  constructor(e, t, i, s) {
    this.view = e, this.startEvent = t, this.style = i, this.mustSelect = s, this.scrollSpeed = { x: 0, y: 0 }, this.scrolling = -1, this.lastEvent = t, this.scrollParent = Af(e.contentDOM), this.atoms = e.state.facet(Qr).map((o) => o(e));
    let r = e.contentDOM.ownerDocument;
    r.addEventListener("mousemove", this.move = this.move.bind(this)), r.addEventListener("mouseup", this.up = this.up.bind(this)), this.extend = t.shiftKey, this.multiple = e.state.facet($.allowMultipleSelections) && fu(e, t), this.dragging = du(e, t) && rh(t) == 1 ? null : !1;
  }
  start(e) {
    this.dragging === !1 && this.select(e);
  }
  move(e) {
    var t;
    if (e.buttons == 0)
      return this.destroy();
    if (this.dragging || this.dragging == null && hu(this.startEvent, e) < 10)
      return;
    this.select(this.lastEvent = e);
    let i = 0, s = 0, r = ((t = this.scrollParent) === null || t === void 0 ? void 0 : t.getBoundingClientRect()) || { left: 0, top: 0, right: this.view.win.innerWidth, bottom: this.view.win.innerHeight }, o = Ua(this.view);
    e.clientX - o.left <= r.left + Xi ? i = -ji(r.left - e.clientX) : e.clientX + o.right >= r.right - Xi && (i = ji(e.clientX - r.right)), e.clientY - o.top <= r.top + Xi ? s = -ji(r.top - e.clientY) : e.clientY + o.bottom >= r.bottom - Xi && (s = ji(e.clientY - r.bottom)), this.setScrollSpeed(i, s);
  }
  up(e) {
    this.dragging == null && this.select(this.lastEvent), this.dragging || e.preventDefault(), this.destroy();
  }
  destroy() {
    this.setScrollSpeed(0, 0);
    let e = this.view.contentDOM.ownerDocument;
    e.removeEventListener("mousemove", this.move), e.removeEventListener("mouseup", this.up), this.view.inputState.mouseSelection = this.view.inputState.draggedContent = null;
  }
  setScrollSpeed(e, t) {
    this.scrollSpeed = { x: e, y: t }, e || t ? this.scrolling < 0 && (this.scrolling = setInterval(() => this.scroll(), 50)) : this.scrolling > -1 && (clearInterval(this.scrolling), this.scrolling = -1);
  }
  scroll() {
    this.scrollParent ? (this.scrollParent.scrollLeft += this.scrollSpeed.x, this.scrollParent.scrollTop += this.scrollSpeed.y) : this.view.win.scrollBy(this.scrollSpeed.x, this.scrollSpeed.y), this.dragging === !1 && this.select(this.lastEvent);
  }
  skipAtoms(e) {
    let t = null;
    for (let i = 0; i < e.ranges.length; i++) {
      let s = e.ranges[i], r = null;
      if (s.empty) {
        let o = pn(this.atoms, s.from, 0);
        o != s.from && (r = b.cursor(o, -1));
      } else {
        let o = pn(this.atoms, s.from, -1), l = pn(this.atoms, s.to, 1);
        (o != s.from || l != s.to) && (r = b.range(s.from == s.anchor ? o : l, s.from == s.head ? o : l));
      }
      r && (t || (t = e.ranges.slice()), t[i] = r);
    }
    return t ? b.create(t, e.mainIndex) : e;
  }
  select(e) {
    let { view: t } = this, i = this.skipAtoms(this.style.get(e, this.extend, this.multiple));
    (this.mustSelect || !i.eq(t.state.selection) || i.main.assoc != t.state.selection.main.assoc && this.dragging === !1) && this.view.dispatch({
      selection: i,
      userEvent: "select.pointer"
    }), this.mustSelect = !1;
  }
  update(e) {
    this.style.update(e) && setTimeout(() => this.select(this.lastEvent), 20);
  }
}
function fu(n, e) {
  let t = n.state.facet(La);
  return t.length ? t[0](e) : P.mac ? e.metaKey : e.ctrlKey;
}
function uu(n, e) {
  let t = n.state.facet(Na);
  return t.length ? t[0](e) : P.mac ? !e.altKey : !e.ctrlKey;
}
function du(n, e) {
  let { main: t } = n.state.selection;
  if (t.empty)
    return !1;
  let i = vn(n.root);
  if (!i || i.rangeCount == 0)
    return !0;
  let s = i.getRangeAt(0).getClientRects();
  for (let r = 0; r < s.length; r++) {
    let o = s[r];
    if (o.left <= e.clientX && o.right >= e.clientX && o.top <= e.clientY && o.bottom >= e.clientY)
      return !0;
  }
  return !1;
}
function pu(n, e) {
  if (!e.bubbles)
    return !0;
  if (e.defaultPrevented)
    return !1;
  for (let t = e.target, i; t != n.contentDOM; t = t.parentNode)
    if (!t || t.nodeType == 11 || (i = X.get(t)) && i.ignoreEvent(e))
      return !1;
  return !0;
}
const $e = /* @__PURE__ */ Object.create(null), Qe = /* @__PURE__ */ Object.create(null), ih = P.ie && P.ie_version < 15 || P.ios && P.webkit_version < 604;
function mu(n) {
  let e = n.dom.parentNode;
  if (!e)
    return;
  let t = e.appendChild(document.createElement("textarea"));
  t.style.cssText = "position: fixed; left: -10000px; top: 10px", t.focus(), setTimeout(() => {
    n.focus(), t.remove(), nh(n, t.value);
  }, 50);
}
function nh(n, e) {
  let { state: t } = n, i, s = 1, r = t.toText(e), o = r.lines == t.selection.ranges.length;
  if (hr != null && t.selection.ranges.every((a) => a.empty) && hr == r.toString()) {
    let a = -1;
    i = t.changeByRange((h) => {
      let c = t.doc.lineAt(h.from);
      if (c.from == a)
        return { range: h };
      a = c.from;
      let f = t.toText((o ? r.line(s++).text : e) + t.lineBreak);
      return {
        changes: { from: c.from, insert: f },
        range: b.cursor(h.from + f.length)
      };
    });
  } else
    o ? i = t.changeByRange((a) => {
      let h = r.line(s++);
      return {
        changes: { from: a.from, to: a.to, insert: h.text },
        range: b.cursor(a.from + h.length)
      };
    }) : i = t.replaceSelection(r);
  n.dispatch(i, {
    userEvent: "input.paste",
    scrollIntoView: !0
  });
}
Qe.scroll = (n) => {
  n.inputState.lastScrollTop = n.scrollDOM.scrollTop, n.inputState.lastScrollLeft = n.scrollDOM.scrollLeft;
};
$e.keydown = (n, e) => (n.inputState.setSelectionOrigin("select"), e.keyCode == 27 && (n.inputState.lastEscPress = Date.now()), !1);
Qe.touchstart = (n, e) => {
  n.inputState.lastTouchTime = Date.now(), n.inputState.setSelectionOrigin("select.pointer");
};
Qe.touchmove = (n) => {
  n.inputState.setSelectionOrigin("select.pointer");
};
$e.mousedown = (n, e) => {
  if (n.observer.flush(), n.inputState.lastTouchTime > Date.now() - 2e3)
    return !1;
  let t = null;
  for (let i of n.state.facet(Ia))
    if (t = i(n, e), t)
      break;
  if (!t && e.button == 0 && (t = bu(n, e)), t) {
    let i = !n.hasFocus;
    n.inputState.startMouseSelection(new cu(n, e, t, i)), i && n.observer.ignore(() => Oa(n.contentDOM));
    let s = n.inputState.mouseSelection;
    if (s)
      return s.start(e), s.dragging === !1;
  }
  return !1;
};
function $o(n, e, t, i) {
  if (i == 1)
    return b.cursor(e, t);
  if (i == 2)
    return Zf(n.state, e, t);
  {
    let s = ee.find(n.docView, e), r = n.state.doc.lineAt(s ? s.posAtEnd : e), o = s ? s.posAtStart : r.from, l = s ? s.posAtEnd : r.to;
    return l < n.state.doc.length && l == r.to && l++, b.range(o, l);
  }
}
let sh = (n, e) => n >= e.top && n <= e.bottom, Qo = (n, e, t) => sh(e, t) && n >= t.left && n <= t.right;
function gu(n, e, t, i) {
  let s = ee.find(n.docView, e);
  if (!s)
    return 1;
  let r = e - s.posAtStart;
  if (r == 0)
    return 1;
  if (r == s.length)
    return -1;
  let o = s.coordsAt(r, -1);
  if (o && Qo(t, i, o))
    return -1;
  let l = s.coordsAt(r, 1);
  return l && Qo(t, i, l) ? 1 : o && sh(i, o) ? -1 : 1;
}
function zo(n, e) {
  let t = n.posAtCoords({ x: e.clientX, y: e.clientY }, !1);
  return { pos: t, bias: gu(n, t, e.clientX, e.clientY) };
}
const yu = P.ie && P.ie_version <= 11;
let Fo = null, Vo = 0, Ho = 0;
function rh(n) {
  if (!yu)
    return n.detail;
  let e = Fo, t = Ho;
  return Fo = n, Ho = Date.now(), Vo = !e || t > Date.now() - 400 && Math.abs(e.clientX - n.clientX) < 2 && Math.abs(e.clientY - n.clientY) < 2 ? (Vo + 1) % 3 : 1;
}
function bu(n, e) {
  let t = zo(n, e), i = rh(e), s = n.state.selection;
  return {
    update(r) {
      r.docChanged && (t.pos = r.changes.mapPos(t.pos), s = s.map(r.changes));
    },
    get(r, o, l) {
      let a = zo(n, r), h, c = $o(n, a.pos, a.bias, i);
      if (t.pos != a.pos && !o) {
        let f = $o(n, t.pos, t.bias, i), u = Math.min(f.from, c.from), d = Math.max(f.to, c.to);
        c = u < c.from ? b.range(u, d) : b.range(d, u);
      }
      return o ? s.replaceRange(s.main.extend(c.from, c.to)) : l && i == 1 && s.ranges.length > 1 && (h = xu(s, a.pos)) ? h : l ? s.addRange(c) : b.create([c]);
    }
  };
}
function xu(n, e) {
  for (let t = 0; t < n.ranges.length; t++) {
    let { from: i, to: s } = n.ranges[t];
    if (i <= e && s >= e)
      return b.create(n.ranges.slice(0, t).concat(n.ranges.slice(t + 1)), n.mainIndex == t ? 0 : n.mainIndex - (n.mainIndex > t ? 1 : 0));
  }
  return null;
}
$e.dragstart = (n, e) => {
  let { selection: { main: t } } = n.state;
  if (e.target.draggable) {
    let s = n.docView.nearest(e.target);
    if (s && s.isWidget) {
      let r = s.posAtStart, o = r + s.length;
      (r >= t.to || o <= t.from) && (t = b.range(r, o));
    }
  }
  let { inputState: i } = n;
  return i.mouseSelection && (i.mouseSelection.dragging = !0), i.draggedContent = t, e.dataTransfer && (e.dataTransfer.setData("Text", n.state.sliceDoc(t.from, t.to)), e.dataTransfer.effectAllowed = "copyMove"), !1;
};
$e.dragend = (n) => (n.inputState.draggedContent = null, !1);
function qo(n, e, t, i) {
  if (!t)
    return;
  let s = n.posAtCoords({ x: e.clientX, y: e.clientY }, !1), { draggedContent: r } = n.inputState, o = i && r && uu(n, e) ? { from: r.from, to: r.to } : null, l = { from: s, insert: t }, a = n.state.changes(o ? [o, l] : l);
  n.focus(), n.dispatch({
    changes: a,
    selection: { anchor: a.mapPos(s, -1), head: a.mapPos(s, 1) },
    userEvent: o ? "move.drop" : "input.drop"
  }), n.inputState.draggedContent = null;
}
$e.drop = (n, e) => {
  if (!e.dataTransfer)
    return !1;
  if (n.state.readOnly)
    return !0;
  let t = e.dataTransfer.files;
  if (t && t.length) {
    let i = Array(t.length), s = 0, r = () => {
      ++s == t.length && qo(n, e, i.filter((o) => o != null).join(n.state.lineBreak), !1);
    };
    for (let o = 0; o < t.length; o++) {
      let l = new FileReader();
      l.onerror = r, l.onload = () => {
        /[\x00-\x08\x0e-\x1f]{2}/.test(l.result) || (i[o] = l.result), r();
      }, l.readAsText(t[o]);
    }
    return !0;
  } else {
    let i = e.dataTransfer.getData("Text");
    if (i)
      return qo(n, e, i, !0), !0;
  }
  return !1;
};
$e.paste = (n, e) => {
  if (n.state.readOnly)
    return !0;
  n.observer.flush();
  let t = ih ? null : e.clipboardData;
  return t ? (nh(n, t.getData("text/plain") || t.getData("text/uri-text")), !0) : (mu(n), !1);
};
function wu(n, e) {
  let t = n.dom.parentNode;
  if (!t)
    return;
  let i = t.appendChild(document.createElement("textarea"));
  i.style.cssText = "position: fixed; left: -10000px; top: 10px", i.value = e, i.focus(), i.selectionEnd = e.length, i.selectionStart = 0, setTimeout(() => {
    i.remove(), n.focus();
  }, 50);
}
function ku(n) {
  let e = [], t = [], i = !1;
  for (let s of n.selection.ranges)
    s.empty || (e.push(n.sliceDoc(s.from, s.to)), t.push(s));
  if (!e.length) {
    let s = -1;
    for (let { from: r } of n.selection.ranges) {
      let o = n.doc.lineAt(r);
      o.number > s && (e.push(o.text), t.push({ from: o.from, to: Math.min(n.doc.length, o.to + 1) })), s = o.number;
    }
    i = !0;
  }
  return { text: e.join(n.lineBreak), ranges: t, linewise: i };
}
let hr = null;
$e.copy = $e.cut = (n, e) => {
  let { text: t, ranges: i, linewise: s } = ku(n.state);
  if (!t && !s)
    return !1;
  hr = s ? t : null, e.type == "cut" && !n.state.readOnly && n.dispatch({
    changes: i,
    scrollIntoView: !0,
    userEvent: "delete.cut"
  });
  let r = ih ? null : e.clipboardData;
  return r ? (r.clearData(), r.setData("text/plain", t), !0) : (wu(n, t), !1);
};
const oh = /* @__PURE__ */ ot.define();
function lh(n, e) {
  let t = [];
  for (let i of n.facet(Qa)) {
    let s = i(n, e);
    s && t.push(s);
  }
  return t ? n.update({ effects: t, annotations: oh.of(!0) }) : null;
}
function ah(n) {
  setTimeout(() => {
    let e = n.hasFocus;
    if (e != n.inputState.notifiedFocused) {
      let t = lh(n.state, e);
      t ? n.dispatch(t) : n.update([]);
    }
  }, 10);
}
Qe.focus = (n) => {
  n.inputState.lastFocusTime = Date.now(), !n.scrollDOM.scrollTop && (n.inputState.lastScrollTop || n.inputState.lastScrollLeft) && (n.scrollDOM.scrollTop = n.inputState.lastScrollTop, n.scrollDOM.scrollLeft = n.inputState.lastScrollLeft), ah(n);
};
Qe.blur = (n) => {
  n.observer.clearSelectionRange(), ah(n);
};
Qe.compositionstart = Qe.compositionupdate = (n) => {
  n.inputState.compositionFirstChange == null && (n.inputState.compositionFirstChange = !0), n.inputState.composing < 0 && (n.inputState.composing = 0);
};
Qe.compositionend = (n) => {
  n.inputState.composing = -1, n.inputState.compositionEndedAt = Date.now(), n.inputState.compositionPendingKey = !0, n.inputState.compositionPendingChange = n.observer.pendingRecords().length > 0, n.inputState.compositionFirstChange = null, P.chrome && P.android ? n.observer.flushSoon() : n.inputState.compositionPendingChange ? Promise.resolve().then(() => n.observer.flush()) : setTimeout(() => {
    n.inputState.composing < 0 && n.docView.hasComposition && n.update([]);
  }, 50);
};
Qe.contextmenu = (n) => {
  n.inputState.lastContextMenu = Date.now();
};
$e.beforeinput = (n, e) => {
  var t;
  let i;
  if (P.chrome && P.android && (i = eh.find((s) => s.inputType == e.inputType)) && (n.observer.delayAndroidKey(i.key, i.keyCode), i.key == "Backspace" || i.key == "Delete")) {
    let s = ((t = window.visualViewport) === null || t === void 0 ? void 0 : t.height) || 0;
    setTimeout(() => {
      var r;
      (((r = window.visualViewport) === null || r === void 0 ? void 0 : r.height) || 0) > s + 10 && n.hasFocus && (n.contentDOM.blur(), n.focus());
    }, 100);
  }
  return !1;
};
const Uo = /* @__PURE__ */ new Set();
function Ou(n) {
  Uo.has(n) || (Uo.add(n), n.addEventListener("copy", () => {
  }), n.addEventListener("cut", () => {
  }));
}
const Xo = ["pre-wrap", "normal", "pre-line", "break-spaces"];
class Su {
  constructor(e) {
    this.lineWrapping = e, this.doc = z.empty, this.heightSamples = {}, this.lineHeight = 14, this.charWidth = 7, this.textHeight = 14, this.lineLength = 30, this.heightChanged = !1;
  }
  heightForGap(e, t) {
    let i = this.doc.lineAt(t).number - this.doc.lineAt(e).number + 1;
    return this.lineWrapping && (i += Math.max(0, Math.ceil((t - e - i * this.lineLength * 0.5) / this.lineLength))), this.lineHeight * i;
  }
  heightForLine(e) {
    return this.lineWrapping ? (1 + Math.max(0, Math.ceil((e - this.lineLength) / (this.lineLength - 5)))) * this.lineHeight : this.lineHeight;
  }
  setDoc(e) {
    return this.doc = e, this;
  }
  mustRefreshForWrapping(e) {
    return Xo.indexOf(e) > -1 != this.lineWrapping;
  }
  mustRefreshForHeights(e) {
    let t = !1;
    for (let i = 0; i < e.length; i++) {
      let s = e[i];
      s < 0 ? i++ : this.heightSamples[Math.floor(s * 10)] || (t = !0, this.heightSamples[Math.floor(s * 10)] = !0);
    }
    return t;
  }
  refresh(e, t, i, s, r, o) {
    let l = Xo.indexOf(e) > -1, a = Math.round(t) != Math.round(this.lineHeight) || this.lineWrapping != l;
    if (this.lineWrapping = l, this.lineHeight = t, this.charWidth = i, this.textHeight = s, this.lineLength = r, a) {
      this.heightSamples = {};
      for (let h = 0; h < o.length; h++) {
        let c = o[h];
        c < 0 ? h++ : this.heightSamples[Math.floor(c * 10)] = !0;
      }
    }
    return a;
  }
}
class vu {
  constructor(e, t) {
    this.from = e, this.heights = t, this.index = 0;
  }
  get more() {
    return this.index < this.heights.length;
  }
}
class Ge {
  /**
  @internal
  */
  constructor(e, t, i, s, r) {
    this.from = e, this.length = t, this.top = i, this.height = s, this._content = r;
  }
  /**
  The type of element this is. When querying lines, this may be
  an array of all the blocks that make up the line.
  */
  get type() {
    return typeof this._content == "number" ? me.Text : Array.isArray(this._content) ? this._content : this._content.type;
  }
  /**
  The end of the element as a document position.
  */
  get to() {
    return this.from + this.length;
  }
  /**
  The bottom position of the element.
  */
  get bottom() {
    return this.top + this.height;
  }
  /**
  If this is a widget block, this will return the widget
  associated with it.
  */
  get widget() {
    return this._content instanceof wt ? this._content.widget : null;
  }
  /**
  If this is a textblock, this holds the number of line breaks
  that appear in widgets inside the block.
  */
  get widgetLineBreaks() {
    return typeof this._content == "number" ? this._content : 0;
  }
  /**
  @internal
  */
  join(e) {
    let t = (Array.isArray(this._content) ? this._content : [this]).concat(Array.isArray(e._content) ? e._content : [e]);
    return new Ge(this.from, this.length + e.length, this.top, this.height + e.height, t);
  }
}
var U = /* @__PURE__ */ function(n) {
  return n[n.ByPos = 0] = "ByPos", n[n.ByHeight = 1] = "ByHeight", n[n.ByPosNoHeight = 2] = "ByPosNoHeight", n;
}(U || (U = {}));
const mn = 1e-3;
class ge {
  constructor(e, t, i = 2) {
    this.length = e, this.height = t, this.flags = i;
  }
  get outdated() {
    return (this.flags & 2) > 0;
  }
  set outdated(e) {
    this.flags = (e ? 2 : 0) | this.flags & -3;
  }
  setHeight(e, t) {
    this.height != t && (Math.abs(this.height - t) > mn && (e.heightChanged = !0), this.height = t);
  }
  // Base case is to replace a leaf node, which simply builds a tree
  // from the new nodes and returns that (HeightMapBranch and
  // HeightMapGap override this to actually use from/to)
  replace(e, t, i) {
    return ge.of(i);
  }
  // Again, these are base cases, and are overridden for branch and gap nodes.
  decomposeLeft(e, t) {
    t.push(this);
  }
  decomposeRight(e, t) {
    t.push(this);
  }
  applyChanges(e, t, i, s) {
    let r = this, o = i.doc;
    for (let l = s.length - 1; l >= 0; l--) {
      let { fromA: a, toA: h, fromB: c, toB: f } = s[l], u = r.lineAt(a, U.ByPosNoHeight, i.setDoc(t), 0, 0), d = u.to >= h ? u : r.lineAt(h, U.ByPosNoHeight, i, 0, 0);
      for (f += d.to - h, h = d.to; l > 0 && u.from <= s[l - 1].toA; )
        a = s[l - 1].fromA, c = s[l - 1].fromB, l--, a < u.from && (u = r.lineAt(a, U.ByPosNoHeight, i, 0, 0));
      c += u.from - a, a = u.from;
      let p = zr.build(i.setDoc(o), e, c, f);
      r = r.replace(a, h, p);
    }
    return r.updateHeight(i, 0);
  }
  static empty() {
    return new Ae(0, 0);
  }
  // nodes uses null values to indicate the position of line breaks.
  // There are never line breaks at the start or end of the array, or
  // two line breaks next to each other, and the array isn't allowed
  // to be empty (same restrictions as return value from the builder).
  static of(e) {
    if (e.length == 1)
      return e[0];
    let t = 0, i = e.length, s = 0, r = 0;
    for (; ; )
      if (t == i)
        if (s > r * 2) {
          let l = e[t - 1];
          l.break ? e.splice(--t, 1, l.left, null, l.right) : e.splice(--t, 1, l.left, l.right), i += 1 + l.break, s -= l.size;
        } else if (r > s * 2) {
          let l = e[i];
          l.break ? e.splice(i, 1, l.left, null, l.right) : e.splice(i, 1, l.left, l.right), i += 2 + l.break, r -= l.size;
        } else
          break;
      else if (s < r) {
        let l = e[t++];
        l && (s += l.size);
      } else {
        let l = e[--i];
        l && (r += l.size);
      }
    let o = 0;
    return e[t - 1] == null ? (o = 1, t--) : e[t] == null && (o = 1, i++), new Cu(ge.of(e.slice(0, t)), o, ge.of(e.slice(i)));
  }
}
ge.prototype.size = 1;
class hh extends ge {
  constructor(e, t, i) {
    super(e, t), this.deco = i;
  }
  blockAt(e, t, i, s) {
    return new Ge(s, this.length, i, this.height, this.deco || 0);
  }
  lineAt(e, t, i, s, r) {
    return this.blockAt(0, i, s, r);
  }
  forEachLine(e, t, i, s, r, o) {
    e <= r + this.length && t >= r && o(this.blockAt(0, i, s, r));
  }
  updateHeight(e, t = 0, i = !1, s) {
    return s && s.from <= t && s.more && this.setHeight(e, s.heights[s.index++]), this.outdated = !1, this;
  }
  toString() {
    return `block(${this.length})`;
  }
}
class Ae extends hh {
  constructor(e, t) {
    super(e, t, null), this.collapsed = 0, this.widgetHeight = 0, this.breaks = 0;
  }
  blockAt(e, t, i, s) {
    return new Ge(s, this.length, i, this.height, this.breaks);
  }
  replace(e, t, i) {
    let s = i[0];
    return i.length == 1 && (s instanceof Ae || s instanceof se && s.flags & 4) && Math.abs(this.length - s.length) < 10 ? (s instanceof se ? s = new Ae(s.length, this.height) : s.height = this.height, this.outdated || (s.outdated = !1), s) : ge.of(i);
  }
  updateHeight(e, t = 0, i = !1, s) {
    return s && s.from <= t && s.more ? this.setHeight(e, s.heights[s.index++]) : (i || this.outdated) && this.setHeight(e, Math.max(this.widgetHeight, e.heightForLine(this.length - this.collapsed)) + this.breaks * e.lineHeight), this.outdated = !1, this;
  }
  toString() {
    return `line(${this.length}${this.collapsed ? -this.collapsed : ""}${this.widgetHeight ? ":" + this.widgetHeight : ""})`;
  }
}
class se extends ge {
  constructor(e) {
    super(e, 0);
  }
  heightMetrics(e, t) {
    let i = e.doc.lineAt(t).number, s = e.doc.lineAt(t + this.length).number, r = s - i + 1, o, l = 0;
    if (e.lineWrapping) {
      let a = Math.min(this.height, e.lineHeight * r);
      o = a / r, this.length > r + 1 && (l = (this.height - a) / (this.length - r - 1));
    } else
      o = this.height / r;
    return { firstLine: i, lastLine: s, perLine: o, perChar: l };
  }
  blockAt(e, t, i, s) {
    let { firstLine: r, lastLine: o, perLine: l, perChar: a } = this.heightMetrics(t, s);
    if (t.lineWrapping) {
      let h = s + Math.round(Math.max(0, Math.min(1, (e - i) / this.height)) * this.length), c = t.doc.lineAt(h), f = l + c.length * a, u = Math.max(i, e - f / 2);
      return new Ge(c.from, c.length, u, f, 0);
    } else {
      let h = Math.max(0, Math.min(o - r, Math.floor((e - i) / l))), { from: c, length: f } = t.doc.line(r + h);
      return new Ge(c, f, i + l * h, l, 0);
    }
  }
  lineAt(e, t, i, s, r) {
    if (t == U.ByHeight)
      return this.blockAt(e, i, s, r);
    if (t == U.ByPosNoHeight) {
      let { from: d, to: p } = i.doc.lineAt(e);
      return new Ge(d, p - d, 0, 0, 0);
    }
    let { firstLine: o, perLine: l, perChar: a } = this.heightMetrics(i, r), h = i.doc.lineAt(e), c = l + h.length * a, f = h.number - o, u = s + l * f + a * (h.from - r - f);
    return new Ge(h.from, h.length, Math.max(s, Math.min(u, s + this.height - c)), c, 0);
  }
  forEachLine(e, t, i, s, r, o) {
    e = Math.max(e, r), t = Math.min(t, r + this.length);
    let { firstLine: l, perLine: a, perChar: h } = this.heightMetrics(i, r);
    for (let c = e, f = s; c <= t; ) {
      let u = i.doc.lineAt(c);
      if (c == e) {
        let p = u.number - l;
        f += a * p + h * (e - r - p);
      }
      let d = a + h * u.length;
      o(new Ge(u.from, u.length, f, d, 0)), f += d, c = u.to + 1;
    }
  }
  replace(e, t, i) {
    let s = this.length - t;
    if (s > 0) {
      let r = i[i.length - 1];
      r instanceof se ? i[i.length - 1] = new se(r.length + s) : i.push(null, new se(s - 1));
    }
    if (e > 0) {
      let r = i[0];
      r instanceof se ? i[0] = new se(e + r.length) : i.unshift(new se(e - 1), null);
    }
    return ge.of(i);
  }
  decomposeLeft(e, t) {
    t.push(new se(e - 1), null);
  }
  decomposeRight(e, t) {
    t.push(null, new se(this.length - e - 1));
  }
  updateHeight(e, t = 0, i = !1, s) {
    let r = t + this.length;
    if (s && s.from <= t + this.length && s.more) {
      let o = [], l = Math.max(t, s.from), a = -1;
      for (s.from > t && o.push(new se(s.from - t - 1).updateHeight(e, t)); l <= r && s.more; ) {
        let c = e.doc.lineAt(l).length;
        o.length && o.push(null);
        let f = s.heights[s.index++];
        a == -1 ? a = f : Math.abs(f - a) >= mn && (a = -2);
        let u = new Ae(c, f);
        u.outdated = !1, o.push(u), l += c + 1;
      }
      l <= r && o.push(null, new se(r - l).updateHeight(e, l));
      let h = ge.of(o);
      return (a < 0 || Math.abs(h.height - this.height) >= mn || Math.abs(a - this.heightMetrics(e, t).perLine) >= mn) && (e.heightChanged = !0), h;
    } else
      (i || this.outdated) && (this.setHeight(e, e.heightForGap(t, t + this.length)), this.outdated = !1);
    return this;
  }
  toString() {
    return `gap(${this.length})`;
  }
}
class Cu extends ge {
  constructor(e, t, i) {
    super(e.length + t + i.length, e.height + i.height, t | (e.outdated || i.outdated ? 2 : 0)), this.left = e, this.right = i, this.size = e.size + i.size;
  }
  get break() {
    return this.flags & 1;
  }
  blockAt(e, t, i, s) {
    let r = i + this.left.height;
    return e < r ? this.left.blockAt(e, t, i, s) : this.right.blockAt(e, t, r, s + this.left.length + this.break);
  }
  lineAt(e, t, i, s, r) {
    let o = s + this.left.height, l = r + this.left.length + this.break, a = t == U.ByHeight ? e < o : e < l, h = a ? this.left.lineAt(e, t, i, s, r) : this.right.lineAt(e, t, i, o, l);
    if (this.break || (a ? h.to < l : h.from > l))
      return h;
    let c = t == U.ByPosNoHeight ? U.ByPosNoHeight : U.ByPos;
    return a ? h.join(this.right.lineAt(l, c, i, o, l)) : this.left.lineAt(l, c, i, s, r).join(h);
  }
  forEachLine(e, t, i, s, r, o) {
    let l = s + this.left.height, a = r + this.left.length + this.break;
    if (this.break)
      e < a && this.left.forEachLine(e, t, i, s, r, o), t >= a && this.right.forEachLine(e, t, i, l, a, o);
    else {
      let h = this.lineAt(a, U.ByPos, i, s, r);
      e < h.from && this.left.forEachLine(e, h.from - 1, i, s, r, o), h.to >= e && h.from <= t && o(h), t > h.to && this.right.forEachLine(h.to + 1, t, i, l, a, o);
    }
  }
  replace(e, t, i) {
    let s = this.left.length + this.break;
    if (t < s)
      return this.balanced(this.left.replace(e, t, i), this.right);
    if (e > this.left.length)
      return this.balanced(this.left, this.right.replace(e - s, t - s, i));
    let r = [];
    e > 0 && this.decomposeLeft(e, r);
    let o = r.length;
    for (let l of i)
      r.push(l);
    if (e > 0 && jo(r, o - 1), t < this.length) {
      let l = r.length;
      this.decomposeRight(t, r), jo(r, l);
    }
    return ge.of(r);
  }
  decomposeLeft(e, t) {
    let i = this.left.length;
    if (e <= i)
      return this.left.decomposeLeft(e, t);
    t.push(this.left), this.break && (i++, e >= i && t.push(null)), e > i && this.right.decomposeLeft(e - i, t);
  }
  decomposeRight(e, t) {
    let i = this.left.length, s = i + this.break;
    if (e >= s)
      return this.right.decomposeRight(e - s, t);
    e < i && this.left.decomposeRight(e, t), this.break && e < s && t.push(null), t.push(this.right);
  }
  balanced(e, t) {
    return e.size > 2 * t.size || t.size > 2 * e.size ? ge.of(this.break ? [e, null, t] : [e, t]) : (this.left = e, this.right = t, this.height = e.height + t.height, this.outdated = e.outdated || t.outdated, this.size = e.size + t.size, this.length = e.length + this.break + t.length, this);
  }
  updateHeight(e, t = 0, i = !1, s) {
    let { left: r, right: o } = this, l = t + r.length + this.break, a = null;
    return s && s.from <= t + r.length && s.more ? a = r = r.updateHeight(e, t, i, s) : r.updateHeight(e, t, i), s && s.from <= l + o.length && s.more ? a = o = o.updateHeight(e, l, i, s) : o.updateHeight(e, l, i), a ? this.balanced(r, o) : (this.height = this.left.height + this.right.height, this.outdated = !1, this);
  }
  toString() {
    return this.left + (this.break ? " " : "-") + this.right;
  }
}
function jo(n, e) {
  let t, i;
  n[e] == null && (t = n[e - 1]) instanceof se && (i = n[e + 1]) instanceof se && n.splice(e - 1, 3, new se(t.length + 1 + i.length));
}
const Au = 5;
class zr {
  constructor(e, t) {
    this.pos = e, this.oracle = t, this.nodes = [], this.lineStart = -1, this.lineEnd = -1, this.covering = null, this.writtenTo = e;
  }
  get isCovered() {
    return this.covering && this.nodes[this.nodes.length - 1] == this.covering;
  }
  span(e, t) {
    if (this.lineStart > -1) {
      let i = Math.min(t, this.lineEnd), s = this.nodes[this.nodes.length - 1];
      s instanceof Ae ? s.length += i - this.pos : (i > this.pos || !this.isCovered) && this.nodes.push(new Ae(i - this.pos, -1)), this.writtenTo = i, t > i && (this.nodes.push(null), this.writtenTo++, this.lineStart = -1);
    }
    this.pos = t;
  }
  point(e, t, i) {
    if (e < t || i.heightRelevant) {
      let s = i.widget ? i.widget.estimatedHeight : 0, r = i.widget ? i.widget.lineBreaks : 0;
      s < 0 && (s = this.oracle.lineHeight);
      let o = t - e;
      i.block ? this.addBlock(new hh(o, s, i)) : (o || r || s >= Au) && this.addLineDeco(s, r, o);
    } else
      t > e && this.span(e, t);
    this.lineEnd > -1 && this.lineEnd < this.pos && (this.lineEnd = this.oracle.doc.lineAt(this.pos).to);
  }
  enterLine() {
    if (this.lineStart > -1)
      return;
    let { from: e, to: t } = this.oracle.doc.lineAt(this.pos);
    this.lineStart = e, this.lineEnd = t, this.writtenTo < e && ((this.writtenTo < e - 1 || this.nodes[this.nodes.length - 1] == null) && this.nodes.push(this.blankContent(this.writtenTo, e - 1)), this.nodes.push(null)), this.pos > e && this.nodes.push(new Ae(this.pos - e, -1)), this.writtenTo = this.pos;
  }
  blankContent(e, t) {
    let i = new se(t - e);
    return this.oracle.doc.lineAt(e).to == t && (i.flags |= 4), i;
  }
  ensureLine() {
    this.enterLine();
    let e = this.nodes.length ? this.nodes[this.nodes.length - 1] : null;
    if (e instanceof Ae)
      return e;
    let t = new Ae(0, -1);
    return this.nodes.push(t), t;
  }
  addBlock(e) {
    this.enterLine();
    let t = e.deco;
    t && t.startSide > 0 && !this.isCovered && this.ensureLine(), this.nodes.push(e), this.writtenTo = this.pos = this.pos + e.length, t && t.endSide > 0 && (this.covering = e);
  }
  addLineDeco(e, t, i) {
    let s = this.ensureLine();
    s.length += i, s.collapsed += i, s.widgetHeight = Math.max(s.widgetHeight, e), s.breaks += t, this.writtenTo = this.pos = this.pos + i;
  }
  finish(e) {
    let t = this.nodes.length == 0 ? null : this.nodes[this.nodes.length - 1];
    this.lineStart > -1 && !(t instanceof Ae) && !this.isCovered ? this.nodes.push(new Ae(0, -1)) : (this.writtenTo < this.pos || t == null) && this.nodes.push(this.blankContent(this.writtenTo, this.pos));
    let i = e;
    for (let s of this.nodes)
      s instanceof Ae && s.updateHeight(this.oracle, i), i += s ? s.length : 1;
    return this.nodes;
  }
  // Always called with a region that on both sides either stretches
  // to a line break or the end of the document.
  // The returned array uses null to indicate line breaks, but never
  // starts or ends in a line break, or has multiple line breaks next
  // to each other.
  static build(e, t, i, s) {
    let r = new zr(i, e);
    return F.spans(t, i, s, r, 0), r.finish(i);
  }
}
function Mu(n, e, t) {
  let i = new Tu();
  return F.compare(n, e, t, i, 0), i.changes;
}
class Tu {
  constructor() {
    this.changes = [];
  }
  compareRange() {
  }
  comparePoint(e, t, i, s) {
    (e < t || i && i.heightRelevant || s && s.heightRelevant) && ir(e, t, this.changes, 5);
  }
}
function Pu(n, e) {
  let t = n.getBoundingClientRect(), i = n.ownerDocument, s = i.defaultView || window, r = Math.max(0, t.left), o = Math.min(s.innerWidth, t.right), l = Math.max(0, t.top), a = Math.min(s.innerHeight, t.bottom);
  for (let h = n.parentNode; h && h != i.body; )
    if (h.nodeType == 1) {
      let c = h, f = window.getComputedStyle(c);
      if ((c.scrollHeight > c.clientHeight || c.scrollWidth > c.clientWidth) && f.overflow != "visible") {
        let u = c.getBoundingClientRect();
        r = Math.max(r, u.left), o = Math.min(o, u.right), l = Math.max(l, u.top), a = h == n.parentNode ? u.bottom : Math.min(a, u.bottom);
      }
      h = f.position == "absolute" || f.position == "fixed" ? c.offsetParent : c.parentNode;
    } else if (h.nodeType == 11)
      h = h.host;
    else
      break;
  return {
    left: r - t.left,
    right: Math.max(r, o) - t.left,
    top: l - (t.top + e),
    bottom: Math.max(l, a) - (t.top + e)
  };
}
function Du(n, e) {
  let t = n.getBoundingClientRect();
  return {
    left: 0,
    right: t.right - t.left,
    top: e,
    bottom: t.bottom - (t.top + e)
  };
}
class ms {
  constructor(e, t, i) {
    this.from = e, this.to = t, this.size = i;
  }
  static same(e, t) {
    if (e.length != t.length)
      return !1;
    for (let i = 0; i < e.length; i++) {
      let s = e[i], r = t[i];
      if (s.from != r.from || s.to != r.to || s.size != r.size)
        return !1;
    }
    return !0;
  }
  draw(e, t) {
    return D.replace({
      widget: new Ru(this.size * (t ? e.scaleY : e.scaleX), t)
    }).range(this.from, this.to);
  }
}
class Ru extends St {
  constructor(e, t) {
    super(), this.size = e, this.vertical = t;
  }
  eq(e) {
    return e.size == this.size && e.vertical == this.vertical;
  }
  toDOM() {
    let e = document.createElement("div");
    return this.vertical ? e.style.height = this.size + "px" : (e.style.width = this.size + "px", e.style.height = "2px", e.style.display = "inline-block"), e;
  }
  get estimatedHeight() {
    return this.vertical ? this.size : -1;
  }
}
class Go {
  constructor(e) {
    this.state = e, this.pixelViewport = { left: 0, right: window.innerWidth, top: 0, bottom: 0 }, this.inView = !0, this.paddingTop = 0, this.paddingBottom = 0, this.contentDOMWidth = 0, this.contentDOMHeight = 0, this.editorHeight = 0, this.editorWidth = 0, this.scrollTop = 0, this.scrolledToBottom = !0, this.scaleX = 1, this.scaleY = 1, this.scrollAnchorPos = 0, this.scrollAnchorHeight = -1, this.scaler = Ko, this.scrollTarget = null, this.printing = !1, this.mustMeasureContent = !0, this.defaultTextDirection = K.LTR, this.visibleRanges = [], this.mustEnforceCursorAssoc = !1;
    let t = e.facet($r).some((i) => typeof i != "function" && i.class == "cm-lineWrapping");
    this.heightOracle = new Su(t), this.stateDeco = e.facet(Ci).filter((i) => typeof i != "function"), this.heightMap = ge.empty().applyChanges(this.stateDeco, z.empty, this.heightOracle.setDoc(e.doc), [new Ne(0, 0, 0, e.doc.length)]), this.viewport = this.getViewport(0, null), this.updateViewportLines(), this.updateForViewport(), this.lineGaps = this.ensureLineGaps([]), this.lineGapDeco = D.set(this.lineGaps.map((i) => i.draw(this, !1))), this.computeVisibleRanges();
  }
  updateForViewport() {
    let e = [this.viewport], { main: t } = this.state.selection;
    for (let i = 0; i <= 1; i++) {
      let s = i ? t.head : t.anchor;
      if (!e.some(({ from: r, to: o }) => s >= r && s <= o)) {
        let { from: r, to: o } = this.lineBlockAt(s);
        e.push(new Gi(r, o));
      }
    }
    this.viewports = e.sort((i, s) => i.from - s.from), this.scaler = this.heightMap.height <= 7e6 ? Ko : new Lu(this.heightOracle, this.heightMap, this.viewports);
  }
  updateViewportLines() {
    this.viewportLines = [], this.heightMap.forEachLine(this.viewport.from, this.viewport.to, this.heightOracle.setDoc(this.state.doc), 0, 0, (e) => {
      this.viewportLines.push(this.scaler.scale == 1 ? e : ui(e, this.scaler));
    });
  }
  update(e, t = null) {
    this.state = e.state;
    let i = this.stateDeco;
    this.stateDeco = this.state.facet(Ci).filter((c) => typeof c != "function");
    let s = e.changedRanges, r = Ne.extendWithRanges(s, Mu(i, this.stateDeco, e ? e.changes : te.empty(this.state.doc.length))), o = this.heightMap.height, l = this.scrolledToBottom ? null : this.scrollAnchorAt(this.scrollTop);
    this.heightMap = this.heightMap.applyChanges(this.stateDeco, e.startState.doc, this.heightOracle.setDoc(this.state.doc), r), this.heightMap.height != o && (e.flags |= 2), l ? (this.scrollAnchorPos = e.changes.mapPos(l.from, -1), this.scrollAnchorHeight = l.top) : (this.scrollAnchorPos = -1, this.scrollAnchorHeight = this.heightMap.height);
    let a = r.length ? this.mapViewport(this.viewport, e.changes) : this.viewport;
    (t && (t.range.head < a.from || t.range.head > a.to) || !this.viewportIsAppropriate(a)) && (a = this.getViewport(0, t));
    let h = !e.changes.empty || e.flags & 2 || a.from != this.viewport.from || a.to != this.viewport.to;
    this.viewport = a, this.updateForViewport(), h && this.updateViewportLines(), (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3) && this.updateLineGaps(this.ensureLineGaps(this.mapLineGaps(this.lineGaps, e.changes))), e.flags |= this.computeVisibleRanges(), t && (this.scrollTarget = t), !this.mustEnforceCursorAssoc && e.selectionSet && e.view.lineWrapping && e.state.selection.main.empty && e.state.selection.main.assoc && !e.state.facet(Fa) && (this.mustEnforceCursorAssoc = !0);
  }
  measure(e) {
    let t = e.contentDOM, i = window.getComputedStyle(t), s = this.heightOracle, r = i.whiteSpace;
    this.defaultTextDirection = i.direction == "rtl" ? K.RTL : K.LTR;
    let o = this.heightOracle.mustRefreshForWrapping(r), l = t.getBoundingClientRect(), a = o || this.mustMeasureContent || this.contentDOMHeight != l.height;
    this.contentDOMHeight = l.height, this.mustMeasureContent = !1;
    let h = 0, c = 0;
    if (l.width && l.height) {
      let { scaleX: S, scaleY: w } = ka(t, l);
      (this.scaleX != S || this.scaleY != w) && (this.scaleX = S, this.scaleY = w, h |= 8, o = a = !0);
    }
    let f = (parseInt(i.paddingTop) || 0) * this.scaleY, u = (parseInt(i.paddingBottom) || 0) * this.scaleY;
    (this.paddingTop != f || this.paddingBottom != u) && (this.paddingTop = f, this.paddingBottom = u, h |= 10), this.editorWidth != e.scrollDOM.clientWidth && (s.lineWrapping && (a = !0), this.editorWidth = e.scrollDOM.clientWidth, h |= 8);
    let d = e.scrollDOM.scrollTop * this.scaleY;
    this.scrollTop != d && (this.scrollAnchorHeight = -1, this.scrollTop = d), this.scrolledToBottom = va(e.scrollDOM);
    let p = (this.printing ? Du : Pu)(t, this.paddingTop), g = p.top - this.pixelViewport.top, m = p.bottom - this.pixelViewport.bottom;
    this.pixelViewport = p;
    let y = this.pixelViewport.bottom > this.pixelViewport.top && this.pixelViewport.right > this.pixelViewport.left;
    if (y != this.inView && (this.inView = y, y && (a = !0)), !this.inView && !this.scrollTarget)
      return 0;
    let k = l.width;
    if ((this.contentDOMWidth != k || this.editorHeight != e.scrollDOM.clientHeight) && (this.contentDOMWidth = l.width, this.editorHeight = e.scrollDOM.clientHeight, h |= 8), a) {
      let S = e.docView.measureVisibleLineHeights(this.viewport);
      if (s.mustRefreshForHeights(S) && (o = !0), o || s.lineWrapping && Math.abs(k - this.contentDOMWidth) > s.charWidth) {
        let { lineHeight: w, charWidth: A, textHeight: C } = e.docView.measureTextSize();
        o = w > 0 && s.refresh(r, w, A, C, k / A, S), o && (e.docView.minWidth = 0, h |= 8);
      }
      g > 0 && m > 0 ? c = Math.max(g, m) : g < 0 && m < 0 && (c = Math.min(g, m)), s.heightChanged = !1;
      for (let w of this.viewports) {
        let A = w.from == this.viewport.from ? S : e.docView.measureVisibleLineHeights(w);
        this.heightMap = (o ? ge.empty().applyChanges(this.stateDeco, z.empty, this.heightOracle, [new Ne(0, 0, 0, e.state.doc.length)]) : this.heightMap).updateHeight(s, 0, o, new vu(w.from, A));
      }
      s.heightChanged && (h |= 2);
    }
    let v = !this.viewportIsAppropriate(this.viewport, c) || this.scrollTarget && (this.scrollTarget.range.head < this.viewport.from || this.scrollTarget.range.head > this.viewport.to);
    return v && (this.viewport = this.getViewport(c, this.scrollTarget)), this.updateForViewport(), (h & 2 || v) && this.updateViewportLines(), (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3) && this.updateLineGaps(this.ensureLineGaps(o ? [] : this.lineGaps, e)), h |= this.computeVisibleRanges(), this.mustEnforceCursorAssoc && (this.mustEnforceCursorAssoc = !1, e.docView.enforceCursorAssoc()), h;
  }
  get visibleTop() {
    return this.scaler.fromDOM(this.pixelViewport.top);
  }
  get visibleBottom() {
    return this.scaler.fromDOM(this.pixelViewport.bottom);
  }
  getViewport(e, t) {
    let i = 0.5 - Math.max(-0.5, Math.min(0.5, e / 1e3 / 2)), s = this.heightMap, r = this.heightOracle, { visibleTop: o, visibleBottom: l } = this, a = new Gi(s.lineAt(o - i * 1e3, U.ByHeight, r, 0, 0).from, s.lineAt(l + (1 - i) * 1e3, U.ByHeight, r, 0, 0).to);
    if (t) {
      let { head: h } = t.range;
      if (h < a.from || h > a.to) {
        let c = Math.min(this.editorHeight, this.pixelViewport.bottom - this.pixelViewport.top), f = s.lineAt(h, U.ByPos, r, 0, 0), u;
        t.y == "center" ? u = (f.top + f.bottom) / 2 - c / 2 : t.y == "start" || t.y == "nearest" && h < a.from ? u = f.top : u = f.bottom - c, a = new Gi(s.lineAt(u - 1e3 / 2, U.ByHeight, r, 0, 0).from, s.lineAt(u + c + 1e3 / 2, U.ByHeight, r, 0, 0).to);
      }
    }
    return a;
  }
  mapViewport(e, t) {
    let i = t.mapPos(e.from, -1), s = t.mapPos(e.to, 1);
    return new Gi(this.heightMap.lineAt(i, U.ByPos, this.heightOracle, 0, 0).from, this.heightMap.lineAt(s, U.ByPos, this.heightOracle, 0, 0).to);
  }
  // Checks if a given viewport covers the visible part of the
  // document and not too much beyond that.
  viewportIsAppropriate({ from: e, to: t }, i = 0) {
    if (!this.inView)
      return !0;
    let { top: s } = this.heightMap.lineAt(e, U.ByPos, this.heightOracle, 0, 0), { bottom: r } = this.heightMap.lineAt(t, U.ByPos, this.heightOracle, 0, 0), { visibleTop: o, visibleBottom: l } = this;
    return (e == 0 || s <= o - Math.max(10, Math.min(
      -i,
      250
      /* VP.MaxCoverMargin */
    ))) && (t == this.state.doc.length || r >= l + Math.max(10, Math.min(
      i,
      250
      /* VP.MaxCoverMargin */
    ))) && s > o - 2 * 1e3 && r < l + 2 * 1e3;
  }
  mapLineGaps(e, t) {
    if (!e.length || t.empty)
      return e;
    let i = [];
    for (let s of e)
      t.touchesRange(s.from, s.to) || i.push(new ms(t.mapPos(s.from), t.mapPos(s.to), s.size));
    return i;
  }
  // Computes positions in the viewport where the start or end of a
  // line should be hidden, trying to reuse existing line gaps when
  // appropriate to avoid unneccesary redraws.
  // Uses crude character-counting for the positioning and sizing,
  // since actual DOM coordinates aren't always available and
  // predictable. Relies on generous margins (see LG.Margin) to hide
  // the artifacts this might produce from the user.
  ensureLineGaps(e, t) {
    let i = this.heightOracle.lineWrapping, s = i ? 1e4 : 2e3, r = s >> 1, o = s << 1;
    if (this.defaultTextDirection != K.LTR && !i)
      return [];
    let l = [], a = (h, c, f, u) => {
      if (c - h < r)
        return;
      let d = this.state.selection.main, p = [d.from];
      d.empty || p.push(d.to);
      for (let m of p)
        if (m > h && m < c) {
          a(h, m - 10, f, u), a(m + 10, c, f, u);
          return;
        }
      let g = Eu(e, (m) => m.from >= f.from && m.to <= f.to && Math.abs(m.from - h) < r && Math.abs(m.to - c) < r && !p.some((y) => m.from < y && m.to > y));
      if (!g) {
        if (c < f.to && t && i && t.visibleRanges.some((m) => m.from <= c && m.to >= c)) {
          let m = t.moveToLineBoundary(b.cursor(c), !1, !0).head;
          m > h && (c = m);
        }
        g = new ms(h, c, this.gapSize(f, h, c, u));
      }
      l.push(g);
    };
    for (let h of this.viewportLines) {
      if (h.length < o)
        continue;
      let c = Bu(h.from, h.to, this.stateDeco);
      if (c.total < o)
        continue;
      let f = this.scrollTarget ? this.scrollTarget.range.head : null, u, d;
      if (i) {
        let p = s / this.heightOracle.lineLength * this.heightOracle.lineHeight, g, m;
        if (f != null) {
          let y = _i(c, f), k = ((this.visibleBottom - this.visibleTop) / 2 + p) / h.height;
          g = y - k, m = y + k;
        } else
          g = (this.visibleTop - h.top - p) / h.height, m = (this.visibleBottom - h.top + p) / h.height;
        u = Ki(c, g), d = Ki(c, m);
      } else {
        let p = c.total * this.heightOracle.charWidth, g = s * this.heightOracle.charWidth, m, y;
        if (f != null) {
          let k = _i(c, f), v = ((this.pixelViewport.right - this.pixelViewport.left) / 2 + g) / p;
          m = k - v, y = k + v;
        } else
          m = (this.pixelViewport.left - g) / p, y = (this.pixelViewport.right + g) / p;
        u = Ki(c, m), d = Ki(c, y);
      }
      u > h.from && a(h.from, u, h, c), d < h.to && a(d, h.to, h, c);
    }
    return l;
  }
  gapSize(e, t, i, s) {
    let r = _i(s, i) - _i(s, t);
    return this.heightOracle.lineWrapping ? e.height * r : s.total * this.heightOracle.charWidth * r;
  }
  updateLineGaps(e) {
    ms.same(e, this.lineGaps) || (this.lineGaps = e, this.lineGapDeco = D.set(e.map((t) => t.draw(this, this.heightOracle.lineWrapping))));
  }
  computeVisibleRanges() {
    let e = this.stateDeco;
    this.lineGaps.length && (e = e.concat(this.lineGapDeco));
    let t = [];
    F.spans(e, this.viewport.from, this.viewport.to, {
      span(s, r) {
        t.push({ from: s, to: r });
      },
      point() {
      }
    }, 20);
    let i = t.length != this.visibleRanges.length || this.visibleRanges.some((s, r) => s.from != t[r].from || s.to != t[r].to);
    return this.visibleRanges = t, i ? 4 : 0;
  }
  lineBlockAt(e) {
    return e >= this.viewport.from && e <= this.viewport.to && this.viewportLines.find((t) => t.from <= e && t.to >= e) || ui(this.heightMap.lineAt(e, U.ByPos, this.heightOracle, 0, 0), this.scaler);
  }
  lineBlockAtHeight(e) {
    return ui(this.heightMap.lineAt(this.scaler.fromDOM(e), U.ByHeight, this.heightOracle, 0, 0), this.scaler);
  }
  scrollAnchorAt(e) {
    let t = this.lineBlockAtHeight(e + 8);
    return t.from >= this.viewport.from || this.viewportLines[0].top - e > 200 ? t : this.viewportLines[0];
  }
  elementAtHeight(e) {
    return ui(this.heightMap.blockAt(this.scaler.fromDOM(e), this.heightOracle, 0, 0), this.scaler);
  }
  get docHeight() {
    return this.scaler.toDOM(this.heightMap.height);
  }
  get contentHeight() {
    return this.docHeight + this.paddingTop + this.paddingBottom;
  }
}
class Gi {
  constructor(e, t) {
    this.from = e, this.to = t;
  }
}
function Bu(n, e, t) {
  let i = [], s = n, r = 0;
  return F.spans(t, n, e, {
    span() {
    },
    point(o, l) {
      o > s && (i.push({ from: s, to: o }), r += o - s), s = l;
    }
  }, 20), s < e && (i.push({ from: s, to: e }), r += e - s), { total: r, ranges: i };
}
function Ki({ total: n, ranges: e }, t) {
  if (t <= 0)
    return e[0].from;
  if (t >= 1)
    return e[e.length - 1].to;
  let i = Math.floor(n * t);
  for (let s = 0; ; s++) {
    let { from: r, to: o } = e[s], l = o - r;
    if (i <= l)
      return r + i;
    i -= l;
  }
}
function _i(n, e) {
  let t = 0;
  for (let { from: i, to: s } of n.ranges) {
    if (e <= s) {
      t += e - i;
      break;
    }
    t += s - i;
  }
  return t / n.total;
}
function Eu(n, e) {
  for (let t of n)
    if (e(t))
      return t;
}
const Ko = {
  toDOM(n) {
    return n;
  },
  fromDOM(n) {
    return n;
  },
  scale: 1
};
class Lu {
  constructor(e, t, i) {
    let s = 0, r = 0, o = 0;
    this.viewports = i.map(({ from: l, to: a }) => {
      let h = t.lineAt(l, U.ByPos, e, 0, 0).top, c = t.lineAt(a, U.ByPos, e, 0, 0).bottom;
      return s += c - h, { from: l, to: a, top: h, bottom: c, domTop: 0, domBottom: 0 };
    }), this.scale = (7e6 - s) / (t.height - s);
    for (let l of this.viewports)
      l.domTop = o + (l.top - r) * this.scale, o = l.domBottom = l.domTop + (l.bottom - l.top), r = l.bottom;
  }
  toDOM(e) {
    for (let t = 0, i = 0, s = 0; ; t++) {
      let r = t < this.viewports.length ? this.viewports[t] : null;
      if (!r || e < r.top)
        return s + (e - i) * this.scale;
      if (e <= r.bottom)
        return r.domTop + (e - r.top);
      i = r.bottom, s = r.domBottom;
    }
  }
  fromDOM(e) {
    for (let t = 0, i = 0, s = 0; ; t++) {
      let r = t < this.viewports.length ? this.viewports[t] : null;
      if (!r || e < r.domTop)
        return i + (e - s) / this.scale;
      if (e <= r.domBottom)
        return r.top + (e - r.domTop);
      i = r.bottom, s = r.domBottom;
    }
  }
}
function ui(n, e) {
  if (e.scale == 1)
    return n;
  let t = e.toDOM(n.top), i = e.toDOM(n.bottom);
  return new Ge(n.from, n.length, t, i - t, Array.isArray(n._content) ? n._content.map((s) => ui(s, e)) : n._content);
}
const Yi = /* @__PURE__ */ M.define({ combine: (n) => n.join(" ") }), cr = /* @__PURE__ */ M.define({ combine: (n) => n.indexOf(!0) > -1 }), fr = /* @__PURE__ */ bt.newName(), ch = /* @__PURE__ */ bt.newName(), fh = /* @__PURE__ */ bt.newName(), uh = { "&light": "." + ch, "&dark": "." + fh };
function ur(n, e, t) {
  return new bt(e, {
    finish(i) {
      return /&/.test(i) ? i.replace(/&\w*/, (s) => {
        if (s == "&")
          return n;
        if (!t || !t[s])
          throw new RangeError(`Unsupported selector: ${s}`);
        return t[s];
      }) : n + " " + i;
    }
  });
}
const Nu = /* @__PURE__ */ ur("." + fr, {
  "&": {
    position: "relative !important",
    boxSizing: "border-box",
    "&.cm-focused": {
      // Provide a simple default outline to make sure a focused
      // editor is visually distinct. Can't leave the default behavior
      // because that will apply to the content element, which is
      // inside the scrollable container and doesn't include the
      // gutters. We also can't use an 'auto' outline, since those
      // are, for some reason, drawn behind the element content, which
      // will cause things like the active line background to cover
      // the outline (#297).
      outline: "1px dotted #212121"
    },
    display: "flex !important",
    flexDirection: "column"
  },
  ".cm-scroller": {
    display: "flex !important",
    alignItems: "flex-start !important",
    fontFamily: "monospace",
    lineHeight: 1.4,
    height: "100%",
    overflowX: "auto",
    position: "relative",
    zIndex: 0
  },
  ".cm-content": {
    margin: 0,
    flexGrow: 2,
    flexShrink: 0,
    display: "block",
    whiteSpace: "pre",
    wordWrap: "normal",
    // https://github.com/codemirror/dev/issues/456
    boxSizing: "border-box",
    minHeight: "100%",
    padding: "4px 0",
    outline: "none",
    "&[contenteditable=true]": {
      WebkitUserModify: "read-write-plaintext-only"
    }
  },
  ".cm-lineWrapping": {
    whiteSpace_fallback: "pre-wrap",
    // For IE
    whiteSpace: "break-spaces",
    wordBreak: "break-word",
    // For Safari, which doesn't support overflow-wrap: anywhere
    overflowWrap: "anywhere",
    flexShrink: 1
  },
  "&light .cm-content": { caretColor: "black" },
  "&dark .cm-content": { caretColor: "white" },
  ".cm-line": {
    display: "block",
    padding: "0 2px 0 6px"
  },
  ".cm-layer": {
    position: "absolute",
    left: 0,
    top: 0,
    contain: "size style",
    "& > *": {
      position: "absolute"
    }
  },
  "&light .cm-selectionBackground": {
    background: "#d9d9d9"
  },
  "&dark .cm-selectionBackground": {
    background: "#222"
  },
  "&light.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": {
    background: "#d7d4f0"
  },
  "&dark.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": {
    background: "#233"
  },
  ".cm-cursorLayer": {
    pointerEvents: "none"
  },
  "&.cm-focused > .cm-scroller > .cm-cursorLayer": {
    animation: "steps(1) cm-blink 1.2s infinite"
  },
  // Two animations defined so that we can switch between them to
  // restart the animation without forcing another style
  // recomputation.
  "@keyframes cm-blink": { "0%": {}, "50%": { opacity: 0 }, "100%": {} },
  "@keyframes cm-blink2": { "0%": {}, "50%": { opacity: 0 }, "100%": {} },
  ".cm-cursor, .cm-dropCursor": {
    borderLeft: "1.2px solid black",
    marginLeft: "-0.6px",
    pointerEvents: "none"
  },
  ".cm-cursor": {
    display: "none"
  },
  "&dark .cm-cursor": {
    borderLeftColor: "#444"
  },
  ".cm-dropCursor": {
    position: "absolute"
  },
  "&.cm-focused > .cm-scroller > .cm-cursorLayer .cm-cursor": {
    display: "block"
  },
  ".cm-announced": {
    position: "fixed",
    top: "-10000px"
  },
  "@media print": {
    ".cm-announced": { display: "none" }
  },
  "&light .cm-activeLine": { backgroundColor: "#cceeff44" },
  "&dark .cm-activeLine": { backgroundColor: "#99eeff33" },
  "&light .cm-specialChar": { color: "red" },
  "&dark .cm-specialChar": { color: "#f78" },
  ".cm-gutters": {
    flexShrink: 0,
    display: "flex",
    height: "100%",
    boxSizing: "border-box",
    insetInlineStart: 0,
    zIndex: 200
  },
  "&light .cm-gutters": {
    backgroundColor: "#f5f5f5",
    color: "#6c6c6c",
    borderRight: "1px solid #ddd"
  },
  "&dark .cm-gutters": {
    backgroundColor: "#333338",
    color: "#ccc"
  },
  ".cm-gutter": {
    display: "flex !important",
    // Necessary -- prevents margin collapsing
    flexDirection: "column",
    flexShrink: 0,
    boxSizing: "border-box",
    minHeight: "100%",
    overflow: "hidden"
  },
  ".cm-gutterElement": {
    boxSizing: "border-box"
  },
  ".cm-lineNumbers .cm-gutterElement": {
    padding: "0 3px 0 5px",
    minWidth: "20px",
    textAlign: "right",
    whiteSpace: "nowrap"
  },
  "&light .cm-activeLineGutter": {
    backgroundColor: "#e2f2ff"
  },
  "&dark .cm-activeLineGutter": {
    backgroundColor: "#222227"
  },
  ".cm-panels": {
    boxSizing: "border-box",
    position: "sticky",
    left: 0,
    right: 0
  },
  "&light .cm-panels": {
    backgroundColor: "#f5f5f5",
    color: "black"
  },
  "&light .cm-panels-top": {
    borderBottom: "1px solid #ddd"
  },
  "&light .cm-panels-bottom": {
    borderTop: "1px solid #ddd"
  },
  "&dark .cm-panels": {
    backgroundColor: "#333338",
    color: "white"
  },
  ".cm-tab": {
    display: "inline-block",
    overflow: "hidden",
    verticalAlign: "bottom"
  },
  ".cm-widgetBuffer": {
    verticalAlign: "text-top",
    height: "1em",
    width: 0,
    display: "inline"
  },
  ".cm-placeholder": {
    color: "#888",
    display: "inline-block",
    verticalAlign: "top"
  },
  ".cm-highlightSpace:before": {
    content: "attr(data-display)",
    position: "absolute",
    pointerEvents: "none",
    color: "#888"
  },
  ".cm-highlightTab": {
    backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="20"><path stroke="%23888" stroke-width="1" fill="none" d="M1 10H196L190 5M190 15L196 10M197 4L197 16"/></svg>')`,
    backgroundSize: "auto 100%",
    backgroundPosition: "right 90%",
    backgroundRepeat: "no-repeat"
  },
  ".cm-trailingSpace": {
    backgroundColor: "#ff332255"
  },
  ".cm-button": {
    verticalAlign: "middle",
    color: "inherit",
    fontSize: "70%",
    padding: ".2em 1em",
    borderRadius: "1px"
  },
  "&light .cm-button": {
    backgroundImage: "linear-gradient(#eff1f5, #d9d9df)",
    border: "1px solid #888",
    "&:active": {
      backgroundImage: "linear-gradient(#b4b4b4, #d0d3d6)"
    }
  },
  "&dark .cm-button": {
    backgroundImage: "linear-gradient(#393939, #111)",
    border: "1px solid #888",
    "&:active": {
      backgroundImage: "linear-gradient(#111, #333)"
    }
  },
  ".cm-textfield": {
    verticalAlign: "middle",
    color: "inherit",
    fontSize: "70%",
    border: "1px solid silver",
    padding: ".2em .5em"
  },
  "&light .cm-textfield": {
    backgroundColor: "white"
  },
  "&dark .cm-textfield": {
    border: "1px solid #555",
    backgroundColor: "inherit"
  }
}, uh), di = "￿";
class Iu {
  constructor(e, t) {
    this.points = e, this.text = "", this.lineSeparator = t.facet($.lineSeparator);
  }
  append(e) {
    this.text += e;
  }
  lineBreak() {
    this.text += di;
  }
  readRange(e, t) {
    if (!e)
      return this;
    let i = e.parentNode;
    for (let s = e; ; ) {
      this.findPointBefore(i, s);
      let r = this.text.length;
      this.readNode(s);
      let o = s.nextSibling;
      if (o == t)
        break;
      let l = X.get(s), a = X.get(o);
      (l && a ? l.breakAfter : (l ? l.breakAfter : _o(s)) || _o(o) && (s.nodeName != "BR" || s.cmIgnore) && this.text.length > r) && this.lineBreak(), s = o;
    }
    return this.findPointBefore(i, t), this;
  }
  readTextNode(e) {
    let t = e.nodeValue;
    for (let i of this.points)
      i.node == e && (i.pos = this.text.length + Math.min(i.offset, t.length));
    for (let i = 0, s = this.lineSeparator ? null : /\r\n?|\n/g; ; ) {
      let r = -1, o = 1, l;
      if (this.lineSeparator ? (r = t.indexOf(this.lineSeparator, i), o = this.lineSeparator.length) : (l = s.exec(t)) && (r = l.index, o = l[0].length), this.append(t.slice(i, r < 0 ? t.length : r)), r < 0)
        break;
      if (this.lineBreak(), o > 1)
        for (let a of this.points)
          a.node == e && a.pos > this.text.length && (a.pos -= o - 1);
      i = r + o;
    }
  }
  readNode(e) {
    if (e.cmIgnore)
      return;
    let t = X.get(e), i = t && t.overrideDOMText;
    if (i != null) {
      this.findPointInside(e, i.length);
      for (let s = i.iter(); !s.next().done; )
        s.lineBreak ? this.lineBreak() : this.append(s.value);
    } else
      e.nodeType == 3 ? this.readTextNode(e) : e.nodeName == "BR" ? e.nextSibling && this.lineBreak() : e.nodeType == 1 && this.readRange(e.firstChild, null);
  }
  findPointBefore(e, t) {
    for (let i of this.points)
      i.node == e && e.childNodes[i.offset] == t && (i.pos = this.text.length);
  }
  findPointInside(e, t) {
    for (let i of this.points)
      (e.nodeType == 3 ? i.node == e : e.contains(i.node)) && (i.pos = this.text.length + (Wu(e, i.node, i.offset) ? t : 0));
  }
}
function Wu(n, e, t) {
  for (; ; ) {
    if (!e || t < it(e))
      return !1;
    if (e == n)
      return !0;
    t = vi(e) + 1, e = e.parentNode;
  }
}
function _o(n) {
  return n.nodeType == 1 && /^(DIV|P|LI|UL|OL|BLOCKQUOTE|DD|DT|H\d|SECTION|PRE)$/.test(n.nodeName);
}
class Yo {
  constructor(e, t) {
    this.node = e, this.offset = t, this.pos = -1;
  }
}
class $u {
  constructor(e, t, i, s) {
    this.typeOver = s, this.bounds = null, this.text = "";
    let { impreciseHead: r, impreciseAnchor: o } = e.docView;
    if (e.state.readOnly && t > -1)
      this.newSel = null;
    else if (t > -1 && (this.bounds = e.docView.domBoundsAround(t, i, 0))) {
      let l = r || o ? [] : Fu(e), a = new Iu(l, e.state);
      a.readRange(this.bounds.startDOM, this.bounds.endDOM), this.text = a.text, this.newSel = Vu(l, this.bounds.from);
    } else {
      let l = e.observer.selectionRange, a = r && r.node == l.focusNode && r.offset == l.focusOffset || !_s(e.contentDOM, l.focusNode) ? e.state.selection.main.head : e.docView.posFromDOM(l.focusNode, l.focusOffset), h = o && o.node == l.anchorNode && o.offset == l.anchorOffset || !_s(e.contentDOM, l.anchorNode) ? e.state.selection.main.anchor : e.docView.posFromDOM(l.anchorNode, l.anchorOffset);
      this.newSel = b.single(h, a);
    }
  }
}
function dh(n, e) {
  let t, { newSel: i } = e, s = n.state.selection.main, r = n.inputState.lastKeyTime > Date.now() - 100 ? n.inputState.lastKeyCode : -1;
  if (e.bounds) {
    let { from: o, to: l } = e.bounds, a = s.from, h = null;
    (r === 8 || P.android && e.text.length < l - o) && (a = s.to, h = "end");
    let c = zu(n.state.doc.sliceString(o, l, di), e.text, a - o, h);
    c && (P.chrome && r == 13 && c.toB == c.from + 2 && e.text.slice(c.from, c.toB) == di + di && c.toB--, t = {
      from: o + c.from,
      to: o + c.toA,
      insert: z.of(e.text.slice(c.from, c.toB).split(di))
    });
  } else
    i && (!n.hasFocus && n.state.facet(Yn) || i.main.eq(s)) && (i = null);
  if (!t && !i)
    return !1;
  if (!t && e.typeOver && !s.empty && i && i.main.empty ? t = { from: s.from, to: s.to, insert: n.state.doc.slice(s.from, s.to) } : t && t.from >= s.from && t.to <= s.to && (t.from != s.from || t.to != s.to) && s.to - s.from - (t.to - t.from) <= 4 ? t = {
    from: s.from,
    to: s.to,
    insert: n.state.doc.slice(s.from, t.from).append(t.insert).append(n.state.doc.slice(t.to, s.to))
  } : (P.mac || P.android) && t && t.from == t.to && t.from == s.head - 1 && /^\. ?$/.test(t.insert.toString()) && n.contentDOM.getAttribute("autocorrect") == "off" ? (i && t.insert.length == 2 && (i = b.single(i.main.anchor - 1, i.main.head - 1)), t = { from: s.from, to: s.to, insert: z.of([" "]) }) : P.chrome && t && t.from == t.to && t.from == s.head && t.insert.toString() == `
 ` && n.lineWrapping && (i && (i = b.single(i.main.anchor - 1, i.main.head - 1)), t = { from: s.from, to: s.to, insert: z.of([" "]) }), t) {
    if (P.ios && n.inputState.flushIOSKey() || P.android && (t.from == s.from && t.to == s.to && t.insert.length == 1 && t.insert.lines == 2 && qt(n.contentDOM, "Enter", 13) || (t.from == s.from - 1 && t.to == s.to && t.insert.length == 0 || r == 8 && t.insert.length < t.to - t.from && t.to > s.head) && qt(n.contentDOM, "Backspace", 8) || t.from == s.from && t.to == s.to + 1 && t.insert.length == 0 && qt(n.contentDOM, "Delete", 46)))
      return !0;
    let o = t.insert.toString();
    n.inputState.composing >= 0 && n.inputState.composing++;
    let l, a = () => l || (l = Qu(n, t, i));
    return n.state.facet($a).some((h) => h(n, t.from, t.to, o, a)) || n.dispatch(a()), !0;
  } else if (i && !i.main.eq(s)) {
    let o = !1, l = "select";
    return n.inputState.lastSelectionTime > Date.now() - 50 && (n.inputState.lastSelectionOrigin == "select" && (o = !0), l = n.inputState.lastSelectionOrigin), n.dispatch({ selection: i, scrollIntoView: o, userEvent: l }), !0;
  } else
    return !1;
}
function Qu(n, e, t) {
  let i, s = n.state, r = s.selection.main;
  if (e.from >= r.from && e.to <= r.to && e.to - e.from >= (r.to - r.from) / 3 && (!t || t.main.empty && t.main.from == e.from + e.insert.length) && n.inputState.composing < 0) {
    let l = r.from < e.from ? s.sliceDoc(r.from, e.from) : "", a = r.to > e.to ? s.sliceDoc(e.to, r.to) : "";
    i = s.replaceSelection(n.state.toText(l + e.insert.sliceString(0, void 0, n.state.lineBreak) + a));
  } else {
    let l = s.changes(e), a = t && t.main.to <= l.newLength ? t.main : void 0;
    if (s.selection.ranges.length > 1 && n.inputState.composing >= 0 && e.to <= r.to && e.to >= r.to - 10) {
      let h = n.state.sliceDoc(e.from, e.to), c, f = t && Ya(n, t.main.head);
      if (f) {
        let p = e.insert.length - (e.to - e.from);
        c = { from: f.from, to: f.to - p };
      } else
        c = n.state.doc.lineAt(r.head);
      let u = r.to - e.to, d = r.to - r.from;
      i = s.changeByRange((p) => {
        if (p.from == r.from && p.to == r.to)
          return { changes: l, range: a || p.map(l) };
        let g = p.to - u, m = g - h.length;
        if (p.to - p.from != d || n.state.sliceDoc(m, g) != h || // Unfortunately, there's no way to make multiple
        // changes in the same node work without aborting
        // composition, so cursors in the composition range are
        // ignored.
        p.to >= c.from && p.from <= c.to)
          return { range: p };
        let y = s.changes({ from: m, to: g, insert: e.insert }), k = p.to - r.to;
        return {
          changes: y,
          range: a ? b.range(Math.max(0, a.anchor + k), Math.max(0, a.head + k)) : p.map(y)
        };
      });
    } else
      i = {
        changes: l,
        selection: a && s.selection.replaceRange(a)
      };
  }
  let o = "input.type";
  return (n.composing || n.inputState.compositionPendingChange && n.inputState.compositionEndedAt > Date.now() - 50) && (n.inputState.compositionPendingChange = !1, o += ".compose", n.inputState.compositionFirstChange && (o += ".start", n.inputState.compositionFirstChange = !1)), s.update(i, { userEvent: o, scrollIntoView: !0 });
}
function zu(n, e, t, i) {
  let s = Math.min(n.length, e.length), r = 0;
  for (; r < s && n.charCodeAt(r) == e.charCodeAt(r); )
    r++;
  if (r == s && n.length == e.length)
    return null;
  let o = n.length, l = e.length;
  for (; o > 0 && l > 0 && n.charCodeAt(o - 1) == e.charCodeAt(l - 1); )
    o--, l--;
  if (i == "end") {
    let a = Math.max(0, r - Math.min(o, l));
    t -= o + a - r;
  }
  if (o < r && n.length < e.length) {
    let a = t <= r && t >= o ? r - t : 0;
    r -= a, l = r + (l - o), o = r;
  } else if (l < r) {
    let a = t <= r && t >= l ? r - t : 0;
    r -= a, o = r + (o - l), l = r;
  }
  return { from: r, toA: o, toB: l };
}
function Fu(n) {
  let e = [];
  if (n.root.activeElement != n.contentDOM)
    return e;
  let { anchorNode: t, anchorOffset: i, focusNode: s, focusOffset: r } = n.observer.selectionRange;
  return t && (e.push(new Yo(t, i)), (s != t || r != i) && e.push(new Yo(s, r))), e;
}
function Vu(n, e) {
  if (n.length == 0)
    return null;
  let t = n[0].pos, i = n.length == 2 ? n[1].pos : t;
  return t > -1 && i > -1 ? b.single(t + e, i + e) : null;
}
const Hu = {
  childList: !0,
  characterData: !0,
  subtree: !0,
  attributes: !0,
  characterDataOldValue: !0
}, gs = P.ie && P.ie_version <= 11;
class qu {
  constructor(e) {
    this.view = e, this.active = !1, this.selectionRange = new Mf(), this.selectionChanged = !1, this.delayedFlush = -1, this.resizeTimeout = -1, this.queue = [], this.delayedAndroidKey = null, this.flushingAndroidKey = -1, this.lastChange = 0, this.scrollTargets = [], this.intersection = null, this.resizeScroll = null, this.intersecting = !1, this.gapIntersection = null, this.gaps = [], this.parentCheck = -1, this.dom = e.contentDOM, this.observer = new MutationObserver((t) => {
      for (let i of t)
        this.queue.push(i);
      (P.ie && P.ie_version <= 11 || P.ios && e.composing) && t.some((i) => i.type == "childList" && i.removedNodes.length || i.type == "characterData" && i.oldValue.length > i.target.nodeValue.length) ? this.flushSoon() : this.flush();
    }), gs && (this.onCharData = (t) => {
      this.queue.push({
        target: t.target,
        type: "characterData",
        oldValue: t.prevValue
      }), this.flushSoon();
    }), this.onSelectionChange = this.onSelectionChange.bind(this), this.onResize = this.onResize.bind(this), this.onPrint = this.onPrint.bind(this), this.onScroll = this.onScroll.bind(this), typeof ResizeObserver == "function" && (this.resizeScroll = new ResizeObserver(() => {
      var t;
      ((t = this.view.docView) === null || t === void 0 ? void 0 : t.lastUpdate) < Date.now() - 75 && this.onResize();
    }), this.resizeScroll.observe(e.scrollDOM)), this.addWindowListeners(this.win = e.win), this.start(), typeof IntersectionObserver == "function" && (this.intersection = new IntersectionObserver((t) => {
      this.parentCheck < 0 && (this.parentCheck = setTimeout(this.listenForScroll.bind(this), 1e3)), t.length > 0 && t[t.length - 1].intersectionRatio > 0 != this.intersecting && (this.intersecting = !this.intersecting, this.intersecting != this.view.inView && this.onScrollChanged(document.createEvent("Event")));
    }, { threshold: [0, 1e-3] }), this.intersection.observe(this.dom), this.gapIntersection = new IntersectionObserver((t) => {
      t.length > 0 && t[t.length - 1].intersectionRatio > 0 && this.onScrollChanged(document.createEvent("Event"));
    }, {})), this.listenForScroll(), this.readSelectionRange();
  }
  onScrollChanged(e) {
    this.view.inputState.runHandlers("scroll", e), this.intersecting && this.view.measure();
  }
  onScroll(e) {
    this.intersecting && this.flush(!1), this.onScrollChanged(e);
  }
  onResize() {
    this.resizeTimeout < 0 && (this.resizeTimeout = setTimeout(() => {
      this.resizeTimeout = -1, this.view.requestMeasure();
    }, 50));
  }
  onPrint() {
    this.view.viewState.printing = !0, this.view.measure(), setTimeout(() => {
      this.view.viewState.printing = !1, this.view.requestMeasure();
    }, 500);
  }
  updateGaps(e) {
    if (this.gapIntersection && (e.length != this.gaps.length || this.gaps.some((t, i) => t != e[i]))) {
      this.gapIntersection.disconnect();
      for (let t of e)
        this.gapIntersection.observe(t);
      this.gaps = e;
    }
  }
  onSelectionChange(e) {
    let t = this.selectionChanged;
    if (!this.readSelectionRange() || this.delayedAndroidKey)
      return;
    let { view: i } = this, s = this.selectionRange;
    if (i.state.facet(Yn) ? i.root.activeElement != this.dom : !dn(i.dom, s))
      return;
    let r = s.anchorNode && i.docView.nearest(s.anchorNode);
    if (r && r.ignoreEvent(e)) {
      t || (this.selectionChanged = !1);
      return;
    }
    (P.ie && P.ie_version <= 11 || P.android && P.chrome) && !i.state.selection.main.empty && // (Selection.isCollapsed isn't reliable on IE)
    s.focusNode && Cn(s.focusNode, s.focusOffset, s.anchorNode, s.anchorOffset) ? this.flushSoon() : this.flush(!1);
  }
  readSelectionRange() {
    let { view: e } = this, t = P.safari && e.root.nodeType == 11 && Sf(this.dom.ownerDocument) == this.dom && Uu(this.view) || vn(e.root);
    if (!t || this.selectionRange.eq(t))
      return !1;
    let i = dn(this.dom, t);
    return i && !this.selectionChanged && e.inputState.lastFocusTime > Date.now() - 200 && e.inputState.lastTouchTime < Date.now() - 300 && Pf(this.dom, t) ? (this.view.inputState.lastFocusTime = 0, e.docView.updateSelection(), !1) : (this.selectionRange.setRange(t), i && (this.selectionChanged = !0), !0);
  }
  setSelectionRange(e, t) {
    this.selectionRange.set(e.node, e.offset, t.node, t.offset), this.selectionChanged = !1;
  }
  clearSelectionRange() {
    this.selectionRange.set(null, 0, null, 0);
  }
  listenForScroll() {
    this.parentCheck = -1;
    let e = 0, t = null;
    for (let i = this.dom; i; )
      if (i.nodeType == 1)
        !t && e < this.scrollTargets.length && this.scrollTargets[e] == i ? e++ : t || (t = this.scrollTargets.slice(0, e)), t && t.push(i), i = i.assignedSlot || i.parentNode;
      else if (i.nodeType == 11)
        i = i.host;
      else
        break;
    if (e < this.scrollTargets.length && !t && (t = this.scrollTargets.slice(0, e)), t) {
      for (let i of this.scrollTargets)
        i.removeEventListener("scroll", this.onScroll);
      for (let i of this.scrollTargets = t)
        i.addEventListener("scroll", this.onScroll);
    }
  }
  ignore(e) {
    if (!this.active)
      return e();
    try {
      return this.stop(), e();
    } finally {
      this.start(), this.clear();
    }
  }
  start() {
    this.active || (this.observer.observe(this.dom, Hu), gs && this.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.active = !0);
  }
  stop() {
    this.active && (this.active = !1, this.observer.disconnect(), gs && this.dom.removeEventListener("DOMCharacterDataModified", this.onCharData));
  }
  // Throw away any pending changes
  clear() {
    this.processRecords(), this.queue.length = 0, this.selectionChanged = !1;
  }
  // Chrome Android, especially in combination with GBoard, not only
  // doesn't reliably fire regular key events, but also often
  // surrounds the effect of enter or backspace with a bunch of
  // composition events that, when interrupted, cause text duplication
  // or other kinds of corruption. This hack makes the editor back off
  // from handling DOM changes for a moment when such a key is
  // detected (via beforeinput or keydown), and then tries to flush
  // them or, if that has no effect, dispatches the given key.
  delayAndroidKey(e, t) {
    var i;
    if (!this.delayedAndroidKey) {
      let s = () => {
        let r = this.delayedAndroidKey;
        r && (this.clearDelayedAndroidKey(), this.view.inputState.lastKeyCode = r.keyCode, this.view.inputState.lastKeyTime = Date.now(), !this.flush() && r.force && qt(this.dom, r.key, r.keyCode));
      };
      this.flushingAndroidKey = this.view.win.requestAnimationFrame(s);
    }
    (!this.delayedAndroidKey || e == "Enter") && (this.delayedAndroidKey = {
      key: e,
      keyCode: t,
      // Only run the key handler when no changes are detected if
      // this isn't coming right after another change, in which case
      // it is probably part of a weird chain of updates, and should
      // be ignored if it returns the DOM to its previous state.
      force: this.lastChange < Date.now() - 50 || !!(!((i = this.delayedAndroidKey) === null || i === void 0) && i.force)
    });
  }
  clearDelayedAndroidKey() {
    this.win.cancelAnimationFrame(this.flushingAndroidKey), this.delayedAndroidKey = null, this.flushingAndroidKey = -1;
  }
  flushSoon() {
    this.delayedFlush < 0 && (this.delayedFlush = this.view.win.requestAnimationFrame(() => {
      this.delayedFlush = -1, this.flush();
    }));
  }
  forceFlush() {
    this.delayedFlush >= 0 && (this.view.win.cancelAnimationFrame(this.delayedFlush), this.delayedFlush = -1), this.flush();
  }
  pendingRecords() {
    for (let e of this.observer.takeRecords())
      this.queue.push(e);
    return this.queue;
  }
  processRecords() {
    let e = this.pendingRecords();
    e.length && (this.queue = []);
    let t = -1, i = -1, s = !1;
    for (let r of e) {
      let o = this.readMutation(r);
      o && (o.typeOver && (s = !0), t == -1 ? { from: t, to: i } = o : (t = Math.min(o.from, t), i = Math.max(o.to, i)));
    }
    return { from: t, to: i, typeOver: s };
  }
  readChange() {
    let { from: e, to: t, typeOver: i } = this.processRecords(), s = this.selectionChanged && dn(this.dom, this.selectionRange);
    if (e < 0 && !s)
      return null;
    e > -1 && (this.lastChange = Date.now()), this.view.inputState.lastFocusTime = 0, this.selectionChanged = !1;
    let r = new $u(this.view, e, t, i);
    return this.view.docView.domChanged = { newSel: r.newSel ? r.newSel.main : null }, r;
  }
  // Apply pending changes, if any
  flush(e = !0) {
    if (this.delayedFlush >= 0 || this.delayedAndroidKey)
      return !1;
    e && this.readSelectionRange();
    let t = this.readChange();
    if (!t)
      return this.view.requestMeasure(), !1;
    let i = this.view.state, s = dh(this.view, t);
    return this.view.state == i && this.view.update([]), s;
  }
  readMutation(e) {
    let t = this.view.docView.nearest(e.target);
    if (!t || t.ignoreMutation(e))
      return null;
    if (t.markDirty(e.type == "attributes"), e.type == "attributes" && (t.flags |= 4), e.type == "childList") {
      let i = Zo(t, e.previousSibling || e.target.previousSibling, -1), s = Zo(t, e.nextSibling || e.target.nextSibling, 1);
      return {
        from: i ? t.posAfter(i) : t.posAtStart,
        to: s ? t.posBefore(s) : t.posAtEnd,
        typeOver: !1
      };
    } else
      return e.type == "characterData" ? { from: t.posAtStart, to: t.posAtEnd, typeOver: e.target.nodeValue == e.oldValue } : null;
  }
  setWindow(e) {
    e != this.win && (this.removeWindowListeners(this.win), this.win = e, this.addWindowListeners(this.win));
  }
  addWindowListeners(e) {
    e.addEventListener("resize", this.onResize), e.addEventListener("beforeprint", this.onPrint), e.addEventListener("scroll", this.onScroll), e.document.addEventListener("selectionchange", this.onSelectionChange);
  }
  removeWindowListeners(e) {
    e.removeEventListener("scroll", this.onScroll), e.removeEventListener("resize", this.onResize), e.removeEventListener("beforeprint", this.onPrint), e.document.removeEventListener("selectionchange", this.onSelectionChange);
  }
  destroy() {
    var e, t, i;
    this.stop(), (e = this.intersection) === null || e === void 0 || e.disconnect(), (t = this.gapIntersection) === null || t === void 0 || t.disconnect(), (i = this.resizeScroll) === null || i === void 0 || i.disconnect();
    for (let s of this.scrollTargets)
      s.removeEventListener("scroll", this.onScroll);
    this.removeWindowListeners(this.win), clearTimeout(this.parentCheck), clearTimeout(this.resizeTimeout), this.win.cancelAnimationFrame(this.delayedFlush), this.win.cancelAnimationFrame(this.flushingAndroidKey);
  }
}
function Zo(n, e, t) {
  for (; e; ) {
    let i = X.get(e);
    if (i && i.parent == n)
      return i;
    let s = e.parentNode;
    e = s != n.dom ? s : t > 0 ? e.nextSibling : e.previousSibling;
  }
  return null;
}
function Uu(n) {
  let e = null;
  function t(a) {
    a.preventDefault(), a.stopImmediatePropagation(), e = a.getTargetRanges()[0];
  }
  if (n.contentDOM.addEventListener("beforeinput", t, !0), n.dom.ownerDocument.execCommand("indent"), n.contentDOM.removeEventListener("beforeinput", t, !0), !e)
    return null;
  let i = e.startContainer, s = e.startOffset, r = e.endContainer, o = e.endOffset, l = n.docView.domAtPos(n.state.selection.main.anchor);
  return Cn(l.node, l.offset, r, o) && ([i, s, r, o] = [r, o, i, s]), { anchorNode: i, anchorOffset: s, focusNode: r, focusOffset: o };
}
class T {
  /**
  The current editor state.
  */
  get state() {
    return this.viewState.state;
  }
  /**
  To be able to display large documents without consuming too much
  memory or overloading the browser, CodeMirror only draws the
  code that is visible (plus a margin around it) to the DOM. This
  property tells you the extent of the current drawn viewport, in
  document positions.
  */
  get viewport() {
    return this.viewState.viewport;
  }
  /**
  When there are, for example, large collapsed ranges in the
  viewport, its size can be a lot bigger than the actual visible
  content. Thus, if you are doing something like styling the
  content in the viewport, it is preferable to only do so for
  these ranges, which are the subset of the viewport that is
  actually drawn.
  */
  get visibleRanges() {
    return this.viewState.visibleRanges;
  }
  /**
  Returns false when the editor is entirely scrolled out of view
  or otherwise hidden.
  */
  get inView() {
    return this.viewState.inView;
  }
  /**
  Indicates whether the user is currently composing text via
  [IME](https://en.wikipedia.org/wiki/Input_method), and at least
  one change has been made in the current composition.
  */
  get composing() {
    return this.inputState.composing > 0;
  }
  /**
  Indicates whether the user is currently in composing state. Note
  that on some platforms, like Android, this will be the case a
  lot, since just putting the cursor on a word starts a
  composition there.
  */
  get compositionStarted() {
    return this.inputState.composing >= 0;
  }
  /**
  The document or shadow root that the view lives in.
  */
  get root() {
    return this._root;
  }
  /**
  @internal
  */
  get win() {
    return this.dom.ownerDocument.defaultView || window;
  }
  /**
  Construct a new view. You'll want to either provide a `parent`
  option, or put `view.dom` into your document after creating a
  view, so that the user can see the editor.
  */
  constructor(e = {}) {
    this.plugins = [], this.pluginMap = /* @__PURE__ */ new Map(), this.editorAttrs = {}, this.contentAttrs = {}, this.bidiCache = [], this.destroyed = !1, this.updateState = 2, this.measureScheduled = -1, this.measureRequests = [], this.contentDOM = document.createElement("div"), this.scrollDOM = document.createElement("div"), this.scrollDOM.tabIndex = -1, this.scrollDOM.className = "cm-scroller", this.scrollDOM.appendChild(this.contentDOM), this.announceDOM = document.createElement("div"), this.announceDOM.className = "cm-announced", this.announceDOM.setAttribute("aria-live", "polite"), this.dom = document.createElement("div"), this.dom.appendChild(this.announceDOM), this.dom.appendChild(this.scrollDOM), e.parent && e.parent.appendChild(this.dom);
    let { dispatch: t } = e;
    this.dispatchTransactions = e.dispatchTransactions || t && ((i) => i.forEach((s) => t(s, this))) || ((i) => this.update(i)), this.dispatch = this.dispatch.bind(this), this._root = e.root || Tf(e.parent) || document, this.viewState = new Go(e.state || $.create(e)), e.scrollTo && e.scrollTo.is(Ui) && (this.viewState.scrollTarget = e.scrollTo.value.clip(this.viewState.state)), this.plugins = this.state.facet(ci).map((i) => new us(i));
    for (let i of this.plugins)
      i.update(this);
    this.observer = new qu(this), this.inputState = new ou(this), this.inputState.ensureHandlers(this.plugins), this.docView = new Do(this), this.mountStyles(), this.updateAttrs(), this.updateState = 0, this.requestMeasure();
  }
  dispatch(...e) {
    let t = e.length == 1 && e[0] instanceof ne ? e : e.length == 1 && Array.isArray(e[0]) ? e[0] : [this.state.update(...e)];
    this.dispatchTransactions(t, this);
  }
  /**
  Update the view for the given array of transactions. This will
  update the visible document and selection to match the state
  produced by the transactions, and notify view plugins of the
  change. You should usually call
  [`dispatch`](https://codemirror.net/6/docs/ref/#view.EditorView.dispatch) instead, which uses this
  as a primitive.
  */
  update(e) {
    if (this.updateState != 0)
      throw new Error("Calls to EditorView.update are not allowed while an update is in progress");
    let t = !1, i = !1, s, r = this.state;
    for (let u of e) {
      if (u.startState != r)
        throw new RangeError("Trying to update state with a transaction that doesn't start from the previous state.");
      r = u.state;
    }
    if (this.destroyed) {
      this.viewState.state = r;
      return;
    }
    let o = this.hasFocus, l = 0, a = null;
    e.some((u) => u.annotation(oh)) ? (this.inputState.notifiedFocused = o, l = 1) : o != this.inputState.notifiedFocused && (this.inputState.notifiedFocused = o, a = lh(r, o), a || (l = 1));
    let h = this.observer.delayedAndroidKey, c = null;
    if (h ? (this.observer.clearDelayedAndroidKey(), c = this.observer.readChange(), (c && !this.state.doc.eq(r.doc) || !this.state.selection.eq(r.selection)) && (c = null)) : this.observer.clear(), r.facet($.phrases) != this.state.facet($.phrases))
      return this.setState(r);
    s = An.create(this, r, e), s.flags |= l;
    let f = this.viewState.scrollTarget;
    try {
      this.updateState = 2;
      for (let u of e) {
        if (f && (f = f.map(u.changes)), u.scrollIntoView) {
          let { main: d } = u.state.selection;
          f = new Ut(d.empty ? d : b.cursor(d.head, d.head > d.anchor ? -1 : 1));
        }
        for (let d of u.effects)
          d.is(Ui) && (f = d.value.clip(this.state));
      }
      this.viewState.update(s, f), this.bidiCache = Mn.update(this.bidiCache, s.changes), s.empty || (this.updatePlugins(s), this.inputState.update(s)), t = this.docView.update(s), this.state.facet(fi) != this.styleModules && this.mountStyles(), i = this.updateAttrs(), this.showAnnouncements(e), this.docView.updateSelection(t, e.some((u) => u.isUserEvent("select.pointer")));
    } finally {
      this.updateState = 0;
    }
    if (s.startState.facet(Yi) != s.state.facet(Yi) && (this.viewState.mustMeasureContent = !0), (t || i || f || this.viewState.mustEnforceCursorAssoc || this.viewState.mustMeasureContent) && this.requestMeasure(), !s.empty)
      for (let u of this.state.facet(nr))
        try {
          u(s);
        } catch (d) {
          Le(this.state, d, "update listener");
        }
    (a || c) && Promise.resolve().then(() => {
      a && this.state == a.startState && this.dispatch(a), c && !dh(this, c) && h.force && qt(this.contentDOM, h.key, h.keyCode);
    });
  }
  /**
  Reset the view to the given state. (This will cause the entire
  document to be redrawn and all view plugins to be reinitialized,
  so you should probably only use it when the new state isn't
  derived from the old state. Otherwise, use
  [`dispatch`](https://codemirror.net/6/docs/ref/#view.EditorView.dispatch) instead.)
  */
  setState(e) {
    if (this.updateState != 0)
      throw new Error("Calls to EditorView.setState are not allowed while an update is in progress");
    if (this.destroyed) {
      this.viewState.state = e;
      return;
    }
    this.updateState = 2;
    let t = this.hasFocus;
    try {
      for (let i of this.plugins)
        i.destroy(this);
      this.viewState = new Go(e), this.plugins = e.facet(ci).map((i) => new us(i)), this.pluginMap.clear();
      for (let i of this.plugins)
        i.update(this);
      this.docView.destroy(), this.docView = new Do(this), this.inputState.ensureHandlers(this.plugins), this.mountStyles(), this.updateAttrs(), this.bidiCache = [];
    } finally {
      this.updateState = 0;
    }
    t && this.focus(), this.requestMeasure();
  }
  updatePlugins(e) {
    let t = e.startState.facet(ci), i = e.state.facet(ci);
    if (t != i) {
      let s = [];
      for (let r of i) {
        let o = t.indexOf(r);
        if (o < 0)
          s.push(new us(r));
        else {
          let l = this.plugins[o];
          l.mustUpdate = e, s.push(l);
        }
      }
      for (let r of this.plugins)
        r.mustUpdate != e && r.destroy(this);
      this.plugins = s, this.pluginMap.clear();
    } else
      for (let s of this.plugins)
        s.mustUpdate = e;
    for (let s = 0; s < this.plugins.length; s++)
      this.plugins[s].update(this);
    t != i && this.inputState.ensureHandlers(this.plugins);
  }
  /**
  @internal
  */
  measure(e = !0) {
    if (this.destroyed)
      return;
    if (this.measureScheduled > -1 && this.win.cancelAnimationFrame(this.measureScheduled), this.observer.delayedAndroidKey) {
      this.measureScheduled = -1, this.requestMeasure();
      return;
    }
    this.measureScheduled = 0, e && this.observer.forceFlush();
    let t = null, i = this.scrollDOM, s = i.scrollTop * this.scaleY, { scrollAnchorPos: r, scrollAnchorHeight: o } = this.viewState;
    Math.abs(s - this.viewState.scrollTop) > 1 && (o = -1), this.viewState.scrollAnchorHeight = -1;
    try {
      for (let l = 0; ; l++) {
        if (o < 0)
          if (va(i))
            r = -1, o = this.viewState.heightMap.height;
          else {
            let d = this.viewState.scrollAnchorAt(s);
            r = d.from, o = d.top;
          }
        this.updateState = 1;
        let a = this.viewState.measure(this);
        if (!a && !this.measureRequests.length && this.viewState.scrollTarget == null)
          break;
        if (l > 5) {
          console.warn(this.measureRequests.length ? "Measure loop restarted more than 5 times" : "Viewport failed to stabilize");
          break;
        }
        let h = [];
        a & 4 || ([this.measureRequests, h] = [h, this.measureRequests]);
        let c = h.map((d) => {
          try {
            return d.read(this);
          } catch (p) {
            return Le(this.state, p), Jo;
          }
        }), f = An.create(this, this.state, []), u = !1;
        f.flags |= a, t ? t.flags |= a : t = f, this.updateState = 2, f.empty || (this.updatePlugins(f), this.inputState.update(f), this.updateAttrs(), u = this.docView.update(f));
        for (let d = 0; d < h.length; d++)
          if (c[d] != Jo)
            try {
              let p = h[d];
              p.write && p.write(c[d], this);
            } catch (p) {
              Le(this.state, p);
            }
        if (u && this.docView.updateSelection(!0), !f.viewportChanged && this.measureRequests.length == 0) {
          if (this.viewState.editorHeight)
            if (this.viewState.scrollTarget) {
              this.docView.scrollIntoView(this.viewState.scrollTarget), this.viewState.scrollTarget = null, o = -1;
              continue;
            } else {
              let p = (r < 0 ? this.viewState.heightMap.height : this.viewState.lineBlockAt(r).top) - o;
              if (p > 1 || p < -1) {
                s = s + p, i.scrollTop = s / this.scaleY, o = -1;
                continue;
              }
            }
          break;
        }
      }
    } finally {
      this.updateState = 0, this.measureScheduled = -1;
    }
    if (t && !t.empty)
      for (let l of this.state.facet(nr))
        l(t);
  }
  /**
  Get the CSS classes for the currently active editor themes.
  */
  get themeClasses() {
    return fr + " " + (this.state.facet(cr) ? fh : ch) + " " + this.state.facet(Yi);
  }
  updateAttrs() {
    let e = el(this, Va, {
      class: "cm-editor" + (this.hasFocus ? " cm-focused " : " ") + this.themeClasses
    }), t = {
      spellcheck: "false",
      autocorrect: "off",
      autocapitalize: "off",
      translate: "no",
      contenteditable: this.state.facet(Yn) ? "true" : "false",
      class: "cm-content",
      style: `${P.tabSize}: ${this.state.tabSize}`,
      role: "textbox",
      "aria-multiline": "true"
    };
    this.state.readOnly && (t["aria-readonly"] = "true"), el(this, $r, t);
    let i = this.observer.ignore(() => {
      let s = tr(this.contentDOM, this.contentAttrs, t), r = tr(this.dom, this.editorAttrs, e);
      return s || r;
    });
    return this.editorAttrs = e, this.contentAttrs = t, i;
  }
  showAnnouncements(e) {
    let t = !0;
    for (let i of e)
      for (let s of i.effects)
        if (s.is(T.announce)) {
          t && (this.announceDOM.textContent = ""), t = !1;
          let r = this.announceDOM.appendChild(document.createElement("div"));
          r.textContent = s.value;
        }
  }
  mountStyles() {
    this.styleModules = this.state.facet(fi);
    let e = this.state.facet(T.cspNonce);
    bt.mount(this.root, this.styleModules.concat(Nu).reverse(), e ? { nonce: e } : void 0);
  }
  readMeasured() {
    if (this.updateState == 2)
      throw new Error("Reading the editor layout isn't allowed during an update");
    this.updateState == 0 && this.measureScheduled > -1 && this.measure(!1);
  }
  /**
  Schedule a layout measurement, optionally providing callbacks to
  do custom DOM measuring followed by a DOM write phase. Using
  this is preferable reading DOM layout directly from, for
  example, an event handler, because it'll make sure measuring and
  drawing done by other components is synchronized, avoiding
  unnecessary DOM layout computations.
  */
  requestMeasure(e) {
    if (this.measureScheduled < 0 && (this.measureScheduled = this.win.requestAnimationFrame(() => this.measure())), e) {
      if (this.measureRequests.indexOf(e) > -1)
        return;
      if (e.key != null) {
        for (let t = 0; t < this.measureRequests.length; t++)
          if (this.measureRequests[t].key === e.key) {
            this.measureRequests[t] = e;
            return;
          }
      }
      this.measureRequests.push(e);
    }
  }
  /**
  Get the value of a specific plugin, if present. Note that
  plugins that crash can be dropped from a view, so even when you
  know you registered a given plugin, it is recommended to check
  the return value of this method.
  */
  plugin(e) {
    let t = this.pluginMap.get(e);
    return (t === void 0 || t && t.spec != e) && this.pluginMap.set(e, t = this.plugins.find((i) => i.spec == e) || null), t && t.update(this).value;
  }
  /**
  The top position of the document, in screen coordinates. This
  may be negative when the editor is scrolled down. Points
  directly to the top of the first line, not above the padding.
  */
  get documentTop() {
    return this.contentDOM.getBoundingClientRect().top + this.viewState.paddingTop;
  }
  /**
  Reports the padding above and below the document.
  */
  get documentPadding() {
    return { top: this.viewState.paddingTop, bottom: this.viewState.paddingBottom };
  }
  /**
  If the editor is transformed with CSS, this provides the scale
  along the X axis. Otherwise, it will just be 1. Note that
  transforms other than translation and scaling are not supported.
  */
  get scaleX() {
    return this.viewState.scaleX;
  }
  /**
  Provide the CSS transformed scale along the Y axis.
  */
  get scaleY() {
    return this.viewState.scaleY;
  }
  /**
  Find the text line or block widget at the given vertical
  position (which is interpreted as relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop)).
  */
  elementAtHeight(e) {
    return this.readMeasured(), this.viewState.elementAtHeight(e);
  }
  /**
  Find the line block (see
  [`lineBlockAt`](https://codemirror.net/6/docs/ref/#view.EditorView.lineBlockAt) at the given
  height, again interpreted relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop).
  */
  lineBlockAtHeight(e) {
    return this.readMeasured(), this.viewState.lineBlockAtHeight(e);
  }
  /**
  Get the extent and vertical position of all [line
  blocks](https://codemirror.net/6/docs/ref/#view.EditorView.lineBlockAt) in the viewport. Positions
  are relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop);
  */
  get viewportLineBlocks() {
    return this.viewState.viewportLines;
  }
  /**
  Find the line block around the given document position. A line
  block is a range delimited on both sides by either a
  non-[hidden](https://codemirror.net/6/docs/ref/#view.Decoration^replace) line breaks, or the
  start/end of the document. It will usually just hold a line of
  text, but may be broken into multiple textblocks by block
  widgets.
  */
  lineBlockAt(e) {
    return this.viewState.lineBlockAt(e);
  }
  /**
  The editor's total content height.
  */
  get contentHeight() {
    return this.viewState.contentHeight;
  }
  /**
  Move a cursor position by [grapheme
  cluster](https://codemirror.net/6/docs/ref/#state.findClusterBreak). `forward` determines whether
  the motion is away from the line start, or towards it. In
  bidirectional text, the line is traversed in visual order, using
  the editor's [text direction](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection).
  When the start position was the last one on the line, the
  returned position will be across the line break. If there is no
  further line, the original position is returned.
  
  By default, this method moves over a single cluster. The
  optional `by` argument can be used to move across more. It will
  be called with the first cluster as argument, and should return
  a predicate that determines, for each subsequent cluster,
  whether it should also be moved over.
  */
  moveByChar(e, t, i) {
    return ps(this, e, Io(this, e, t, i));
  }
  /**
  Move a cursor position across the next group of either
  [letters](https://codemirror.net/6/docs/ref/#state.EditorState.charCategorizer) or non-letter
  non-whitespace characters.
  */
  moveByGroup(e, t) {
    return ps(this, e, Io(this, e, t, (i) => su(this, e.head, i)));
  }
  /**
  Move to the next line boundary in the given direction. If
  `includeWrap` is true, line wrapping is on, and there is a
  further wrap point on the current line, the wrap point will be
  returned. Otherwise this function will return the start or end
  of the line.
  */
  moveToLineBoundary(e, t, i = !0) {
    return nu(this, e, t, i);
  }
  /**
  Move a cursor position vertically. When `distance` isn't given,
  it defaults to moving to the next line (including wrapped
  lines). Otherwise, `distance` should provide a positive distance
  in pixels.
  
  When `start` has a
  [`goalColumn`](https://codemirror.net/6/docs/ref/#state.SelectionRange.goalColumn), the vertical
  motion will use that as a target horizontal position. Otherwise,
  the cursor's own horizontal position is used. The returned
  cursor will have its goal column set to whichever column was
  used.
  */
  moveVertically(e, t, i) {
    return ps(this, e, ru(this, e, t, i));
  }
  /**
  Find the DOM parent node and offset (child offset if `node` is
  an element, character offset when it is a text node) at the
  given document position.
  
  Note that for positions that aren't currently in
  `visibleRanges`, the resulting DOM position isn't necessarily
  meaningful (it may just point before or after a placeholder
  element).
  */
  domAtPos(e) {
    return this.docView.domAtPos(e);
  }
  /**
  Find the document position at the given DOM node. Can be useful
  for associating positions with DOM events. Will raise an error
  when `node` isn't part of the editor content.
  */
  posAtDOM(e, t = 0) {
    return this.docView.posFromDOM(e, t);
  }
  posAtCoords(e, t = !0) {
    return this.readMeasured(), Ja(this, e, t);
  }
  /**
  Get the screen coordinates at the given document position.
  `side` determines whether the coordinates are based on the
  element before (-1) or after (1) the position (if no element is
  available on the given side, the method will transparently use
  another strategy to get reasonable coordinates).
  */
  coordsAtPos(e, t = 1) {
    this.readMeasured();
    let i = this.docView.coordsAt(e, t);
    if (!i || i.left == i.right)
      return i;
    let s = this.state.doc.lineAt(e), r = this.bidiSpans(s), o = r[dt.find(r, e - s.from, -1, t)];
    return Nr(i, o.dir == K.LTR == t > 0);
  }
  /**
  Return the rectangle around a given character. If `pos` does not
  point in front of a character that is in the viewport and
  rendered (i.e. not replaced, not a line break), this will return
  null. For space characters that are a line wrap point, this will
  return the position before the line break.
  */
  coordsForChar(e) {
    return this.readMeasured(), this.docView.coordsForChar(e);
  }
  /**
  The default width of a character in the editor. May not
  accurately reflect the width of all characters (given variable
  width fonts or styling of invididual ranges).
  */
  get defaultCharacterWidth() {
    return this.viewState.heightOracle.charWidth;
  }
  /**
  The default height of a line in the editor. May not be accurate
  for all lines.
  */
  get defaultLineHeight() {
    return this.viewState.heightOracle.lineHeight;
  }
  /**
  The text direction
  ([`direction`](https://developer.mozilla.org/en-US/docs/Web/CSS/direction)
  CSS property) of the editor's content element.
  */
  get textDirection() {
    return this.viewState.defaultTextDirection;
  }
  /**
  Find the text direction of the block at the given position, as
  assigned by CSS. If
  [`perLineTextDirection`](https://codemirror.net/6/docs/ref/#view.EditorView^perLineTextDirection)
  isn't enabled, or the given position is outside of the viewport,
  this will always return the same as
  [`textDirection`](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection). Note that
  this may trigger a DOM layout.
  */
  textDirectionAt(e) {
    return !this.state.facet(za) || e < this.viewport.from || e > this.viewport.to ? this.textDirection : (this.readMeasured(), this.docView.textDirectionAt(e));
  }
  /**
  Whether this editor [wraps lines](https://codemirror.net/6/docs/ref/#view.EditorView.lineWrapping)
  (as determined by the
  [`white-space`](https://developer.mozilla.org/en-US/docs/Web/CSS/white-space)
  CSS property of its content element).
  */
  get lineWrapping() {
    return this.viewState.heightOracle.lineWrapping;
  }
  /**
  Returns the bidirectional text structure of the given line
  (which should be in the current document) as an array of span
  objects. The order of these spans matches the [text
  direction](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection)—if that is
  left-to-right, the leftmost spans come first, otherwise the
  rightmost spans come first.
  */
  bidiSpans(e) {
    if (e.length > Xu)
      return Ka(e.length);
    let t = this.textDirectionAt(e.from), i;
    for (let r of this.bidiCache)
      if (r.from == e.from && r.dir == t && (r.fresh || Ga(r.isolates, i = Po(this, e.from, e.to))))
        return r.order;
    i || (i = Po(this, e.from, e.to));
    let s = Hf(e.text, t, i);
    return this.bidiCache.push(new Mn(e.from, e.to, t, i, !0, s)), s;
  }
  /**
  Check whether the editor has focus.
  */
  get hasFocus() {
    var e;
    return (this.dom.ownerDocument.hasFocus() || P.safari && ((e = this.inputState) === null || e === void 0 ? void 0 : e.lastContextMenu) > Date.now() - 3e4) && this.root.activeElement == this.contentDOM;
  }
  /**
  Put focus on the editor.
  */
  focus() {
    this.observer.ignore(() => {
      Oa(this.contentDOM), this.docView.updateSelection();
    });
  }
  /**
  Update the [root](https://codemirror.net/6/docs/ref/##view.EditorViewConfig.root) in which the editor lives. This is only
  necessary when moving the editor's existing DOM to a new window or shadow root.
  */
  setRoot(e) {
    this._root != e && (this._root = e, this.observer.setWindow((e.nodeType == 9 ? e : e.ownerDocument).defaultView || window), this.mountStyles());
  }
  /**
  Clean up this editor view, removing its element from the
  document, unregistering event handlers, and notifying
  plugins. The view instance can no longer be used after
  calling this.
  */
  destroy() {
    for (let e of this.plugins)
      e.destroy(this);
    this.plugins = [], this.inputState.destroy(), this.docView.destroy(), this.dom.remove(), this.observer.destroy(), this.measureScheduled > -1 && this.win.cancelAnimationFrame(this.measureScheduled), this.destroyed = !0;
  }
  /**
  Returns an effect that can be
  [added](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) to a transaction to
  cause it to scroll the given position or range into view.
  */
  static scrollIntoView(e, t = {}) {
    return Ui.of(new Ut(typeof e == "number" ? b.cursor(e) : e, t.y, t.x, t.yMargin, t.xMargin));
  }
  /**
  Return an effect that resets the editor to its current (at the
  time this method was called) scroll position. Note that this
  only affects the editor's own scrollable element, not parents.
  See also
  [`EditorViewConfig.scrollTo`](https://codemirror.net/6/docs/ref/#view.EditorViewConfig.scrollTo).
  
  The effect should be used with a document identical to the one
  it was created for. Failing to do so is not an error, but may
  not scroll to the expected position. You can
  [map](https://codemirror.net/6/docs/ref/#state.StateEffect.map) the effect to account for changes.
  */
  scrollSnapshot() {
    let { scrollTop: e, scrollLeft: t } = this.scrollDOM, i = this.viewState.scrollAnchorAt(e);
    return Ui.of(new Ut(b.cursor(i.from), "start", "start", i.top - e, t, !0));
  }
  /**
  Returns an extension that can be used to add DOM event handlers.
  The value should be an object mapping event names to handler
  functions. For any given event, such functions are ordered by
  extension precedence, and the first handler to return true will
  be assumed to have handled that event, and no other handlers or
  built-in behavior will be activated for it. These are registered
  on the [content element](https://codemirror.net/6/docs/ref/#view.EditorView.contentDOM), except
  for `scroll` handlers, which will be called any time the
  editor's [scroll element](https://codemirror.net/6/docs/ref/#view.EditorView.scrollDOM) or one of
  its parent nodes is scrolled.
  */
  static domEventHandlers(e) {
    return Z.define(() => ({}), { eventHandlers: e });
  }
  /**
  Create an extension that registers DOM event observers. Contrary
  to event [handlers](https://codemirror.net/6/docs/ref/#view.EditorView^domEventHandlers),
  observers can't be prevented from running by a higher-precedence
  handler returning true. They also don't prevent other handlers
  and observers from running when they return true, and should not
  call `preventDefault`.
  */
  static domEventObservers(e) {
    return Z.define(() => ({}), { eventObservers: e });
  }
  /**
  Create a theme extension. The first argument can be a
  [`style-mod`](https://github.com/marijnh/style-mod#documentation)
  style spec providing the styles for the theme. These will be
  prefixed with a generated class for the style.
  
  Because the selectors will be prefixed with a scope class, rule
  that directly match the editor's [wrapper
  element](https://codemirror.net/6/docs/ref/#view.EditorView.dom)—to which the scope class will be
  added—need to be explicitly differentiated by adding an `&` to
  the selector for that element—for example
  `&.cm-focused`.
  
  When `dark` is set to true, the theme will be marked as dark,
  which will cause the `&dark` rules from [base
  themes](https://codemirror.net/6/docs/ref/#view.EditorView^baseTheme) to be used (as opposed to
  `&light` when a light theme is active).
  */
  static theme(e, t) {
    let i = bt.newName(), s = [Yi.of(i), fi.of(ur(`.${i}`, e))];
    return t && t.dark && s.push(cr.of(!0)), s;
  }
  /**
  Create an extension that adds styles to the base theme. Like
  with [`theme`](https://codemirror.net/6/docs/ref/#view.EditorView^theme), use `&` to indicate the
  place of the editor wrapper element when directly targeting
  that. You can also use `&dark` or `&light` instead to only
  target editors with a dark or light theme.
  */
  static baseTheme(e) {
    return ei.lowest(fi.of(ur("." + fr, e, uh)));
  }
  /**
  Retrieve an editor view instance from the view's DOM
  representation.
  */
  static findFromDOM(e) {
    var t;
    let i = e.querySelector(".cm-content"), s = i && X.get(i) || X.get(e);
    return ((t = s == null ? void 0 : s.rootView) === null || t === void 0 ? void 0 : t.view) || null;
  }
}
T.styleModule = fi;
T.inputHandler = $a;
T.focusChangeEffect = Qa;
T.perLineTextDirection = za;
T.exceptionSink = Wa;
T.updateListener = nr;
T.editable = Yn;
T.mouseSelectionStyle = Ia;
T.dragMovesSelection = Na;
T.clickAddsSelectionRange = La;
T.decorations = Ci;
T.atomicRanges = Qr;
T.bidiIsolatedRanges = Ha;
T.scrollMargins = qa;
T.darkTheme = cr;
T.cspNonce = /* @__PURE__ */ M.define({ combine: (n) => n.length ? n[0] : "" });
T.contentAttributes = $r;
T.editorAttributes = Va;
T.lineWrapping = /* @__PURE__ */ T.contentAttributes.of({ class: "cm-lineWrapping" });
T.announce = /* @__PURE__ */ E.define();
const Xu = 4096, Jo = {};
class Mn {
  constructor(e, t, i, s, r, o) {
    this.from = e, this.to = t, this.dir = i, this.isolates = s, this.fresh = r, this.order = o;
  }
  static update(e, t) {
    if (t.empty && !e.some((r) => r.fresh))
      return e;
    let i = [], s = e.length ? e[e.length - 1].dir : K.LTR;
    for (let r = Math.max(0, e.length - 10); r < e.length; r++) {
      let o = e[r];
      o.dir == s && !t.touchesRange(o.from, o.to) && i.push(new Mn(t.mapPos(o.from, 1), t.mapPos(o.to, -1), o.dir, o.isolates, !1, o.order));
    }
    return i;
  }
}
function el(n, e, t) {
  for (let i = n.state.facet(e), s = i.length - 1; s >= 0; s--) {
    let r = i[s], o = typeof r == "function" ? r(n) : r;
    o && er(o, t);
  }
  return t;
}
const ju = P.mac ? "mac" : P.windows ? "win" : P.linux ? "linux" : "key";
function Gu(n, e) {
  const t = n.split(/-(?!$)/);
  let i = t[t.length - 1];
  i == "Space" && (i = " ");
  let s, r, o, l;
  for (let a = 0; a < t.length - 1; ++a) {
    const h = t[a];
    if (/^(cmd|meta|m)$/i.test(h))
      l = !0;
    else if (/^a(lt)?$/i.test(h))
      s = !0;
    else if (/^(c|ctrl|control)$/i.test(h))
      r = !0;
    else if (/^s(hift)?$/i.test(h))
      o = !0;
    else if (/^mod$/i.test(h))
      e == "mac" ? l = !0 : r = !0;
    else
      throw new Error("Unrecognized modifier name: " + h);
  }
  return s && (i = "Alt-" + i), r && (i = "Ctrl-" + i), l && (i = "Meta-" + i), o && (i = "Shift-" + i), i;
}
function Zi(n, e, t) {
  return e.altKey && (n = "Alt-" + n), e.ctrlKey && (n = "Ctrl-" + n), e.metaKey && (n = "Meta-" + n), t !== !1 && e.shiftKey && (n = "Shift-" + n), n;
}
const Ku = /* @__PURE__ */ ei.default(/* @__PURE__ */ T.domEventHandlers({
  keydown(n, e) {
    return mh(ph(e.state), n, e, "editor");
  }
})), Zn = /* @__PURE__ */ M.define({ enables: Ku }), tl = /* @__PURE__ */ new WeakMap();
function ph(n) {
  let e = n.facet(Zn), t = tl.get(e);
  return t || tl.set(e, t = Zu(e.reduce((i, s) => i.concat(s), []))), t;
}
function _u(n, e, t) {
  return mh(ph(n.state), e, n, t);
}
let ct = null;
const Yu = 4e3;
function Zu(n, e = ju) {
  let t = /* @__PURE__ */ Object.create(null), i = /* @__PURE__ */ Object.create(null), s = (o, l) => {
    let a = i[o];
    if (a == null)
      i[o] = l;
    else if (a != l)
      throw new Error("Key binding " + o + " is used both as a regular binding and as a multi-stroke prefix");
  }, r = (o, l, a, h, c) => {
    var f, u;
    let d = t[o] || (t[o] = /* @__PURE__ */ Object.create(null)), p = l.split(/ (?!$)/).map((y) => Gu(y, e));
    for (let y = 1; y < p.length; y++) {
      let k = p.slice(0, y).join(" ");
      s(k, !0), d[k] || (d[k] = {
        preventDefault: !0,
        stopPropagation: !1,
        run: [(v) => {
          let S = ct = { view: v, prefix: k, scope: o };
          return setTimeout(() => {
            ct == S && (ct = null);
          }, Yu), !0;
        }]
      });
    }
    let g = p.join(" ");
    s(g, !1);
    let m = d[g] || (d[g] = {
      preventDefault: !1,
      stopPropagation: !1,
      run: ((u = (f = d._any) === null || f === void 0 ? void 0 : f.run) === null || u === void 0 ? void 0 : u.slice()) || []
    });
    a && m.run.push(a), h && (m.preventDefault = !0), c && (m.stopPropagation = !0);
  };
  for (let o of n) {
    let l = o.scope ? o.scope.split(" ") : ["editor"];
    if (o.any)
      for (let h of l) {
        let c = t[h] || (t[h] = /* @__PURE__ */ Object.create(null));
        c._any || (c._any = { preventDefault: !1, stopPropagation: !1, run: [] });
        for (let f in c)
          c[f].run.push(o.any);
      }
    let a = o[e] || o.key;
    if (a)
      for (let h of l)
        r(h, a, o.run, o.preventDefault, o.stopPropagation), o.shift && r(h, "Shift-" + a, o.shift, o.preventDefault, o.stopPropagation);
  }
  return t;
}
function mh(n, e, t, i) {
  let s = Of(e), r = re(s, 0), o = Be(r) == s.length && s != " ", l = "", a = !1, h = !1, c = !1;
  ct && ct.view == t && ct.scope == i && (l = ct.prefix + " ", th.indexOf(e.keyCode) < 0 && (h = !0, ct = null));
  let f = /* @__PURE__ */ new Set(), u = (m) => {
    if (m) {
      for (let y of m.run)
        if (!f.has(y) && (f.add(y), y(t, e)))
          return m.stopPropagation && (c = !0), !0;
      m.preventDefault && (m.stopPropagation && (c = !0), h = !0);
    }
    return !1;
  }, d = n[i], p, g;
  return d && (u(d[l + Zi(s, e, !o)]) ? a = !0 : o && (e.altKey || e.metaKey || e.ctrlKey) && // Ctrl-Alt may be used for AltGr on Windows
  !(P.windows && e.ctrlKey && e.altKey) && (p = xt[e.keyCode]) && p != s ? (u(d[l + Zi(p, e, !0)]) || e.shiftKey && (g = Oi[e.keyCode]) != s && g != p && u(d[l + Zi(g, e, !1)])) && (a = !0) : o && e.shiftKey && u(d[l + Zi(s, e, !0)]) && (a = !0), !a && u(d._any) && (a = !0)), h && (a = !0), a && c && e.stopPropagation(), a;
}
class Wi {
  /**
  Create a marker with the given class and dimensions. If `width`
  is null, the DOM element will get no width style.
  */
  constructor(e, t, i, s, r) {
    this.className = e, this.left = t, this.top = i, this.width = s, this.height = r;
  }
  draw() {
    let e = document.createElement("div");
    return e.className = this.className, this.adjust(e), e;
  }
  update(e, t) {
    return t.className != this.className ? !1 : (this.adjust(e), !0);
  }
  adjust(e) {
    e.style.left = this.left + "px", e.style.top = this.top + "px", this.width != null && (e.style.width = this.width + "px"), e.style.height = this.height + "px";
  }
  eq(e) {
    return this.left == e.left && this.top == e.top && this.width == e.width && this.height == e.height && this.className == e.className;
  }
  /**
  Create a set of rectangles for the given selection range,
  assigning them theclass`className`. Will create a single
  rectangle for empty ranges, and a set of selection-style
  rectangles covering the range's content (in a bidi-aware
  way) for non-empty ones.
  */
  static forRange(e, t, i) {
    if (i.empty) {
      let s = e.coordsAtPos(i.head, i.assoc || 1);
      if (!s)
        return [];
      let r = gh(e);
      return [new Wi(t, s.left - r.left, s.top - r.top, null, s.bottom - s.top)];
    } else
      return Ju(e, t, i);
  }
}
function gh(n) {
  let e = n.scrollDOM.getBoundingClientRect();
  return { left: (n.textDirection == K.LTR ? e.left : e.right - n.scrollDOM.clientWidth * n.scaleX) - n.scrollDOM.scrollLeft * n.scaleX, top: e.top - n.scrollDOM.scrollTop * n.scaleY };
}
function il(n, e, t) {
  let i = b.cursor(e);
  return {
    from: Math.max(t.from, n.moveToLineBoundary(i, !1, !0).from),
    to: Math.min(t.to, n.moveToLineBoundary(i, !0, !0).from),
    type: me.Text
  };
}
function Ju(n, e, t) {
  if (t.to <= n.viewport.from || t.from >= n.viewport.to)
    return [];
  let i = Math.max(t.from, n.viewport.from), s = Math.min(t.to, n.viewport.to), r = n.textDirection == K.LTR, o = n.contentDOM, l = o.getBoundingClientRect(), a = gh(n), h = o.querySelector(".cm-line"), c = h && window.getComputedStyle(h), f = l.left + (c ? parseInt(c.paddingLeft) + Math.min(0, parseInt(c.textIndent)) : 0), u = l.right - (c ? parseInt(c.paddingRight) : 0), d = ar(n, i), p = ar(n, s), g = d.type == me.Text ? d : null, m = p.type == me.Text ? p : null;
  if (g && (n.lineWrapping || d.widgetLineBreaks) && (g = il(n, i, g)), m && (n.lineWrapping || p.widgetLineBreaks) && (m = il(n, s, m)), g && m && g.from == m.from)
    return k(v(t.from, t.to, g));
  {
    let w = g ? v(t.from, null, g) : S(d, !1), A = m ? v(null, t.to, m) : S(p, !0), C = [];
    return (g || d).to < (m || p).from - (g && m ? 1 : 0) || d.widgetLineBreaks > 1 && w.bottom + n.defaultLineHeight / 2 < A.top ? C.push(y(f, w.bottom, u, A.top)) : w.bottom < A.top && n.elementAtHeight((w.bottom + A.top) / 2).type == me.Text && (w.bottom = A.top = (w.bottom + A.top) / 2), k(w).concat(C).concat(k(A));
  }
  function y(w, A, C, R) {
    return new Wi(
      e,
      w - a.left,
      A - a.top - 0.01,
      C - w,
      R - A + 0.01
      /* C.Epsilon */
    );
  }
  function k({ top: w, bottom: A, horizontal: C }) {
    let R = [];
    for (let I = 0; I < C.length; I += 2)
      R.push(y(C[I], w, C[I + 1], A));
    return R;
  }
  function v(w, A, C) {
    let R = 1e9, I = -1e9, W = [];
    function L(Q, G, ye, be, Se) {
      let De = n.coordsAtPos(Q, Q == C.to ? -2 : 2), J = n.coordsAtPos(ye, ye == C.from ? 2 : -2);
      !De || !J || (R = Math.min(De.top, J.top, R), I = Math.max(De.bottom, J.bottom, I), Se == K.LTR ? W.push(r && G ? f : De.left, r && be ? u : J.right) : W.push(!r && be ? f : J.left, !r && G ? u : De.right));
    }
    let B = w ?? C.from, V = A ?? C.to;
    for (let Q of n.visibleRanges)
      if (Q.to > B && Q.from < V)
        for (let G = Math.max(Q.from, B), ye = Math.min(Q.to, V); ; ) {
          let be = n.state.doc.lineAt(G);
          for (let Se of n.bidiSpans(be)) {
            let De = Se.from + be.from, J = Se.to + be.from;
            if (De >= ye)
              break;
            J > G && L(Math.max(De, G), w == null && De <= B, Math.min(J, ye), A == null && J >= V, Se.dir);
          }
          if (G = be.to + 1, G >= ye)
            break;
        }
    return W.length == 0 && L(B, w == null, V, A == null, n.textDirection), { top: R, bottom: I, horizontal: W };
  }
  function S(w, A) {
    let C = l.top + (A ? w.top : w.bottom);
    return { top: C, bottom: C, horizontal: [] };
  }
}
function ed(n, e) {
  return n.constructor == e.constructor && n.eq(e);
}
class td {
  constructor(e, t) {
    this.view = e, this.layer = t, this.drawn = [], this.scaleX = 1, this.scaleY = 1, this.measureReq = { read: this.measure.bind(this), write: this.draw.bind(this) }, this.dom = e.scrollDOM.appendChild(document.createElement("div")), this.dom.classList.add("cm-layer"), t.above && this.dom.classList.add("cm-layer-above"), t.class && this.dom.classList.add(t.class), this.scale(), this.dom.setAttribute("aria-hidden", "true"), this.setOrder(e.state), e.requestMeasure(this.measureReq), t.mount && t.mount(this.dom, e);
  }
  update(e) {
    e.startState.facet(gn) != e.state.facet(gn) && this.setOrder(e.state), (this.layer.update(e, this.dom) || e.geometryChanged) && (this.scale(), e.view.requestMeasure(this.measureReq));
  }
  setOrder(e) {
    let t = 0, i = e.facet(gn);
    for (; t < i.length && i[t] != this.layer; )
      t++;
    this.dom.style.zIndex = String((this.layer.above ? 150 : -1) - t);
  }
  measure() {
    return this.layer.markers(this.view);
  }
  scale() {
    let { scaleX: e, scaleY: t } = this.view;
    (e != this.scaleX || t != this.scaleY) && (this.scaleX = e, this.scaleY = t, this.dom.style.transform = `scale(${1 / e}, ${1 / t})`);
  }
  draw(e) {
    if (e.length != this.drawn.length || e.some((t, i) => !ed(t, this.drawn[i]))) {
      let t = this.dom.firstChild, i = 0;
      for (let s of e)
        s.update && t && s.constructor && this.drawn[i].constructor && s.update(t, this.drawn[i]) ? (t = t.nextSibling, i++) : this.dom.insertBefore(s.draw(), t);
      for (; t; ) {
        let s = t.nextSibling;
        t.remove(), t = s;
      }
      this.drawn = e;
    }
  }
  destroy() {
    this.layer.destroy && this.layer.destroy(this.dom, this.view), this.dom.remove();
  }
}
const gn = /* @__PURE__ */ M.define();
function yh(n) {
  return [
    Z.define((e) => new td(e, n)),
    gn.of(n)
  ];
}
const bh = !P.ios, Mi = /* @__PURE__ */ M.define({
  combine(n) {
    return Je(n, {
      cursorBlinkRate: 1200,
      drawRangeCursor: !0
    }, {
      cursorBlinkRate: (e, t) => Math.min(e, t),
      drawRangeCursor: (e, t) => e || t
    });
  }
});
function id(n = {}) {
  return [
    Mi.of(n),
    nd,
    sd,
    rd,
    Fa.of(!0)
  ];
}
function xh(n) {
  return n.startState.facet(Mi) != n.state.facet(Mi);
}
const nd = /* @__PURE__ */ yh({
  above: !0,
  markers(n) {
    let { state: e } = n, t = e.facet(Mi), i = [];
    for (let s of e.selection.ranges) {
      let r = s == e.selection.main;
      if (s.empty ? !r || bh : t.drawRangeCursor) {
        let o = r ? "cm-cursor cm-cursor-primary" : "cm-cursor cm-cursor-secondary", l = s.empty ? s : b.cursor(s.head, s.head > s.anchor ? -1 : 1);
        for (let a of Wi.forRange(n, o, l))
          i.push(a);
      }
    }
    return i;
  },
  update(n, e) {
    n.transactions.some((i) => i.selection) && (e.style.animationName = e.style.animationName == "cm-blink" ? "cm-blink2" : "cm-blink");
    let t = xh(n);
    return t && nl(n.state, e), n.docChanged || n.selectionSet || t;
  },
  mount(n, e) {
    nl(e.state, n);
  },
  class: "cm-cursorLayer"
});
function nl(n, e) {
  e.style.animationDuration = n.facet(Mi).cursorBlinkRate + "ms";
}
const sd = /* @__PURE__ */ yh({
  above: !1,
  markers(n) {
    return n.state.selection.ranges.map((e) => e.empty ? [] : Wi.forRange(n, "cm-selectionBackground", e)).reduce((e, t) => e.concat(t));
  },
  update(n, e) {
    return n.docChanged || n.selectionSet || n.viewportChanged || xh(n);
  },
  class: "cm-selectionLayer"
}), dr = {
  ".cm-line": {
    "& ::selection": { backgroundColor: "transparent !important" },
    "&::selection": { backgroundColor: "transparent !important" }
  }
};
bh && (dr[".cm-line"].caretColor = "transparent !important", dr[".cm-content"] = { caretColor: "transparent !important" });
const rd = /* @__PURE__ */ ei.highest(/* @__PURE__ */ T.theme(dr)), wh = /* @__PURE__ */ E.define({
  map(n, e) {
    return n == null ? null : e.mapPos(n);
  }
}), pi = /* @__PURE__ */ he.define({
  create() {
    return null;
  },
  update(n, e) {
    return n != null && (n = e.changes.mapPos(n)), e.effects.reduce((t, i) => i.is(wh) ? i.value : t, n);
  }
}), od = /* @__PURE__ */ Z.fromClass(class {
  constructor(n) {
    this.view = n, this.cursor = null, this.measureReq = { read: this.readPos.bind(this), write: this.drawCursor.bind(this) };
  }
  update(n) {
    var e;
    let t = n.state.field(pi);
    t == null ? this.cursor != null && ((e = this.cursor) === null || e === void 0 || e.remove(), this.cursor = null) : (this.cursor || (this.cursor = this.view.scrollDOM.appendChild(document.createElement("div")), this.cursor.className = "cm-dropCursor"), (n.startState.field(pi) != t || n.docChanged || n.geometryChanged) && this.view.requestMeasure(this.measureReq));
  }
  readPos() {
    let { view: n } = this, e = n.state.field(pi), t = e != null && n.coordsAtPos(e);
    if (!t)
      return null;
    let i = n.scrollDOM.getBoundingClientRect();
    return {
      left: t.left - i.left + n.scrollDOM.scrollLeft * n.scaleX,
      top: t.top - i.top + n.scrollDOM.scrollTop * n.scaleY,
      height: t.bottom - t.top
    };
  }
  drawCursor(n) {
    if (this.cursor) {
      let { scaleX: e, scaleY: t } = this.view;
      n ? (this.cursor.style.left = n.left / e + "px", this.cursor.style.top = n.top / t + "px", this.cursor.style.height = n.height / t + "px") : this.cursor.style.left = "-100000px";
    }
  }
  destroy() {
    this.cursor && this.cursor.remove();
  }
  setDropPos(n) {
    this.view.state.field(pi) != n && this.view.dispatch({ effects: wh.of(n) });
  }
}, {
  eventObservers: {
    dragover(n) {
      this.setDropPos(this.view.posAtCoords({ x: n.clientX, y: n.clientY }));
    },
    dragleave(n) {
      (n.target == this.view.contentDOM || !this.view.contentDOM.contains(n.relatedTarget)) && this.setDropPos(null);
    },
    dragend() {
      this.setDropPos(null);
    },
    drop() {
      this.setDropPos(null);
    }
  }
});
function ld() {
  return [pi, od];
}
function sl(n, e, t, i, s) {
  e.lastIndex = 0;
  for (let r = n.iterRange(t, i), o = t, l; !r.next().done; o += r.value.length)
    if (!r.lineBreak)
      for (; l = e.exec(r.value); )
        s(o + l.index, l);
}
function ad(n, e) {
  let t = n.visibleRanges;
  if (t.length == 1 && t[0].from == n.viewport.from && t[0].to == n.viewport.to)
    return t;
  let i = [];
  for (let { from: s, to: r } of t)
    s = Math.max(n.state.doc.lineAt(s).from, s - e), r = Math.min(n.state.doc.lineAt(r).to, r + e), i.length && i[i.length - 1].to >= s ? i[i.length - 1].to = r : i.push({ from: s, to: r });
  return i;
}
class hd {
  /**
  Create a decorator.
  */
  constructor(e) {
    const { regexp: t, decoration: i, decorate: s, boundary: r, maxLength: o = 1e3 } = e;
    if (!t.global)
      throw new RangeError("The regular expression given to MatchDecorator should have its 'g' flag set");
    if (this.regexp = t, s)
      this.addMatch = (l, a, h, c) => s(c, h, h + l[0].length, l, a);
    else if (typeof i == "function")
      this.addMatch = (l, a, h, c) => {
        let f = i(l, a, h);
        f && c(h, h + l[0].length, f);
      };
    else if (i)
      this.addMatch = (l, a, h, c) => c(h, h + l[0].length, i);
    else
      throw new RangeError("Either 'decorate' or 'decoration' should be provided to MatchDecorator");
    this.boundary = r, this.maxLength = o;
  }
  /**
  Compute the full set of decorations for matches in the given
  view's viewport. You'll want to call this when initializing your
  plugin.
  */
  createDeco(e) {
    let t = new yt(), i = t.add.bind(t);
    for (let { from: s, to: r } of ad(e, this.maxLength))
      sl(e.state.doc, this.regexp, s, r, (o, l) => this.addMatch(l, e, o, i));
    return t.finish();
  }
  /**
  Update a set of decorations for a view update. `deco` _must_ be
  the set of decorations produced by _this_ `MatchDecorator` for
  the view state before the update.
  */
  updateDeco(e, t) {
    let i = 1e9, s = -1;
    return e.docChanged && e.changes.iterChanges((r, o, l, a) => {
      a > e.view.viewport.from && l < e.view.viewport.to && (i = Math.min(l, i), s = Math.max(a, s));
    }), e.viewportChanged || s - i > 1e3 ? this.createDeco(e.view) : s > -1 ? this.updateRange(e.view, t.map(e.changes), i, s) : t;
  }
  updateRange(e, t, i, s) {
    for (let r of e.visibleRanges) {
      let o = Math.max(r.from, i), l = Math.min(r.to, s);
      if (l > o) {
        let a = e.state.doc.lineAt(o), h = a.to < l ? e.state.doc.lineAt(l) : a, c = Math.max(r.from, a.from), f = Math.min(r.to, h.to);
        if (this.boundary) {
          for (; o > a.from; o--)
            if (this.boundary.test(a.text[o - 1 - a.from])) {
              c = o;
              break;
            }
          for (; l < h.to; l++)
            if (this.boundary.test(h.text[l - h.from])) {
              f = l;
              break;
            }
        }
        let u = [], d, p = (g, m, y) => u.push(y.range(g, m));
        if (a == h)
          for (this.regexp.lastIndex = c - a.from; (d = this.regexp.exec(a.text)) && d.index < f - a.from; )
            this.addMatch(d, e, d.index + a.from, p);
        else
          sl(e.state.doc, this.regexp, c, f, (g, m) => this.addMatch(m, e, g, p));
        t = t.update({ filterFrom: c, filterTo: f, filter: (g, m) => g < c || m > f, add: u });
      }
    }
    return t;
  }
}
const pr = /x/.unicode != null ? "gu" : "g", cd = /* @__PURE__ */ new RegExp(`[\0-\b
--­؜​‎‏\u2028\u2029‭‮⁦⁧⁩\uFEFF￹-￼]`, pr), fd = {
  0: "null",
  7: "bell",
  8: "backspace",
  10: "newline",
  11: "vertical tab",
  13: "carriage return",
  27: "escape",
  8203: "zero width space",
  8204: "zero width non-joiner",
  8205: "zero width joiner",
  8206: "left-to-right mark",
  8207: "right-to-left mark",
  8232: "line separator",
  8237: "left-to-right override",
  8238: "right-to-left override",
  8294: "left-to-right isolate",
  8295: "right-to-left isolate",
  8297: "pop directional isolate",
  8233: "paragraph separator",
  65279: "zero width no-break space",
  65532: "object replacement"
};
let ys = null;
function ud() {
  var n;
  if (ys == null && typeof document < "u" && document.body) {
    let e = document.body.style;
    ys = ((n = e.tabSize) !== null && n !== void 0 ? n : e.MozTabSize) != null;
  }
  return ys || !1;
}
const yn = /* @__PURE__ */ M.define({
  combine(n) {
    let e = Je(n, {
      render: null,
      specialChars: cd,
      addSpecialChars: null
    });
    return (e.replaceTabs = !ud()) && (e.specialChars = new RegExp("	|" + e.specialChars.source, pr)), e.addSpecialChars && (e.specialChars = new RegExp(e.specialChars.source + "|" + e.addSpecialChars.source, pr)), e;
  }
});
function dd(n = {}) {
  return [yn.of(n), pd()];
}
let rl = null;
function pd() {
  return rl || (rl = Z.fromClass(class {
    constructor(n) {
      this.view = n, this.decorations = D.none, this.decorationCache = /* @__PURE__ */ Object.create(null), this.decorator = this.makeDecorator(n.state.facet(yn)), this.decorations = this.decorator.createDeco(n);
    }
    makeDecorator(n) {
      return new hd({
        regexp: n.specialChars,
        decoration: (e, t, i) => {
          let { doc: s } = t.state, r = re(e[0], 0);
          if (r == 9) {
            let o = s.lineAt(i), l = t.state.tabSize, a = ti(o.text, l, i - o.from);
            return D.replace({
              widget: new bd((l - a % l) * this.view.defaultCharacterWidth / this.view.scaleX)
            });
          }
          return this.decorationCache[r] || (this.decorationCache[r] = D.replace({ widget: new yd(n, r) }));
        },
        boundary: n.replaceTabs ? void 0 : /[^]/
      });
    }
    update(n) {
      let e = n.state.facet(yn);
      n.startState.facet(yn) != e ? (this.decorator = this.makeDecorator(e), this.decorations = this.decorator.createDeco(n.view)) : this.decorations = this.decorator.updateDeco(n, this.decorations);
    }
  }, {
    decorations: (n) => n.decorations
  }));
}
const md = "•";
function gd(n) {
  return n >= 32 ? md : n == 10 ? "␤" : String.fromCharCode(9216 + n);
}
class yd extends St {
  constructor(e, t) {
    super(), this.options = e, this.code = t;
  }
  eq(e) {
    return e.code == this.code;
  }
  toDOM(e) {
    let t = gd(this.code), i = e.state.phrase("Control character") + " " + (fd[this.code] || "0x" + this.code.toString(16)), s = this.options.render && this.options.render(this.code, i, t);
    if (s)
      return s;
    let r = document.createElement("span");
    return r.textContent = t, r.title = i, r.setAttribute("aria-label", i), r.className = "cm-specialChar", r;
  }
  ignoreEvent() {
    return !1;
  }
}
class bd extends St {
  constructor(e) {
    super(), this.width = e;
  }
  eq(e) {
    return e.width == this.width;
  }
  toDOM() {
    let e = document.createElement("span");
    return e.textContent = "	", e.className = "cm-tab", e.style.width = this.width + "px", e;
  }
  ignoreEvent() {
    return !1;
  }
}
function xd() {
  return kd;
}
const wd = /* @__PURE__ */ D.line({ class: "cm-activeLine" }), kd = /* @__PURE__ */ Z.fromClass(class {
  constructor(n) {
    this.decorations = this.getDeco(n);
  }
  update(n) {
    (n.docChanged || n.selectionSet) && (this.decorations = this.getDeco(n.view));
  }
  getDeco(n) {
    let e = -1, t = [];
    for (let i of n.state.selection.ranges) {
      let s = n.lineBlockAt(i.head);
      s.from > e && (t.push(wd.range(s.from)), e = s.from);
    }
    return D.set(t);
  }
}, {
  decorations: (n) => n.decorations
}), mr = 2e3;
function Od(n, e, t) {
  let i = Math.min(e.line, t.line), s = Math.max(e.line, t.line), r = [];
  if (e.off > mr || t.off > mr || e.col < 0 || t.col < 0) {
    let o = Math.min(e.off, t.off), l = Math.max(e.off, t.off);
    for (let a = i; a <= s; a++) {
      let h = n.doc.line(a);
      h.length <= l && r.push(b.range(h.from + o, h.to + l));
    }
  } else {
    let o = Math.min(e.col, t.col), l = Math.max(e.col, t.col);
    for (let a = i; a <= s; a++) {
      let h = n.doc.line(a), c = js(h.text, o, n.tabSize, !0);
      if (c < 0)
        r.push(b.cursor(h.to));
      else {
        let f = js(h.text, l, n.tabSize);
        r.push(b.range(h.from + c, h.from + f));
      }
    }
  }
  return r;
}
function Sd(n, e) {
  let t = n.coordsAtPos(n.viewport.from);
  return t ? Math.round(Math.abs((t.left - e) / n.defaultCharacterWidth)) : -1;
}
function ol(n, e) {
  let t = n.posAtCoords({ x: e.clientX, y: e.clientY }, !1), i = n.state.doc.lineAt(t), s = t - i.from, r = s > mr ? -1 : s == i.length ? Sd(n, e.clientX) : ti(i.text, n.state.tabSize, t - i.from);
  return { line: i.number, col: r, off: s };
}
function vd(n, e) {
  let t = ol(n, e), i = n.state.selection;
  return t ? {
    update(s) {
      if (s.docChanged) {
        let r = s.changes.mapPos(s.startState.doc.line(t.line).from), o = s.state.doc.lineAt(r);
        t = { line: o.number, col: t.col, off: Math.min(t.off, o.length) }, i = i.map(s.changes);
      }
    },
    get(s, r, o) {
      let l = ol(n, s);
      if (!l)
        return i;
      let a = Od(n.state, t, l);
      return a.length ? o ? b.create(a.concat(i.ranges)) : b.create(a) : i;
    }
  } : null;
}
function Cd(n) {
  let e = (n == null ? void 0 : n.eventFilter) || ((t) => t.altKey && t.button == 0);
  return T.mouseSelectionStyle.of((t, i) => e(i) ? vd(t, i) : null);
}
const Ad = {
  Alt: [18, (n) => !!n.altKey],
  Control: [17, (n) => !!n.ctrlKey],
  Shift: [16, (n) => !!n.shiftKey],
  Meta: [91, (n) => !!n.metaKey]
}, Md = { style: "cursor: crosshair" };
function Td(n = {}) {
  let [e, t] = Ad[n.key || "Alt"], i = Z.fromClass(class {
    constructor(s) {
      this.view = s, this.isDown = !1;
    }
    set(s) {
      this.isDown != s && (this.isDown = s, this.view.update([]));
    }
  }, {
    eventObservers: {
      keydown(s) {
        this.set(s.keyCode == e || t(s));
      },
      keyup(s) {
        (s.keyCode == e || !t(s)) && this.set(!1);
      },
      mousemove(s) {
        this.set(t(s));
      }
    }
  });
  return [
    i,
    T.contentAttributes.of((s) => {
      var r;
      return !((r = s.plugin(i)) === null || r === void 0) && r.isDown ? Md : null;
    })
  ];
}
const oi = "-10000px";
class kh {
  constructor(e, t, i) {
    this.facet = t, this.createTooltipView = i, this.input = e.state.facet(t), this.tooltips = this.input.filter((s) => s), this.tooltipViews = this.tooltips.map(i);
  }
  update(e, t) {
    var i;
    let s = e.state.facet(this.facet), r = s.filter((a) => a);
    if (s === this.input) {
      for (let a of this.tooltipViews)
        a.update && a.update(e);
      return !1;
    }
    let o = [], l = t ? [] : null;
    for (let a = 0; a < r.length; a++) {
      let h = r[a], c = -1;
      if (h) {
        for (let f = 0; f < this.tooltips.length; f++) {
          let u = this.tooltips[f];
          u && u.create == h.create && (c = f);
        }
        if (c < 0)
          o[a] = this.createTooltipView(h), l && (l[a] = !!h.above);
        else {
          let f = o[a] = this.tooltipViews[c];
          l && (l[a] = t[c]), f.update && f.update(e);
        }
      }
    }
    for (let a of this.tooltipViews)
      o.indexOf(a) < 0 && (a.dom.remove(), (i = a.destroy) === null || i === void 0 || i.call(a));
    return t && (l.forEach((a, h) => t[h] = a), t.length = l.length), this.input = s, this.tooltips = r, this.tooltipViews = o, !0;
  }
}
function Pd(n) {
  let { win: e } = n;
  return { top: 0, left: 0, bottom: e.innerHeight, right: e.innerWidth };
}
const bs = /* @__PURE__ */ M.define({
  combine: (n) => {
    var e, t, i;
    return {
      position: P.ios ? "absolute" : ((e = n.find((s) => s.position)) === null || e === void 0 ? void 0 : e.position) || "fixed",
      parent: ((t = n.find((s) => s.parent)) === null || t === void 0 ? void 0 : t.parent) || null,
      tooltipSpace: ((i = n.find((s) => s.tooltipSpace)) === null || i === void 0 ? void 0 : i.tooltipSpace) || Pd
    };
  }
}), ll = /* @__PURE__ */ new WeakMap(), Fr = /* @__PURE__ */ Z.fromClass(class {
  constructor(n) {
    this.view = n, this.above = [], this.inView = !0, this.madeAbsolute = !1, this.lastTransaction = 0, this.measureTimeout = -1;
    let e = n.state.facet(bs);
    this.position = e.position, this.parent = e.parent, this.classes = n.themeClasses, this.createContainer(), this.measureReq = { read: this.readMeasure.bind(this), write: this.writeMeasure.bind(this), key: this }, this.manager = new kh(n, Vr, (t) => this.createTooltip(t)), this.intersectionObserver = typeof IntersectionObserver == "function" ? new IntersectionObserver((t) => {
      Date.now() > this.lastTransaction - 50 && t.length > 0 && t[t.length - 1].intersectionRatio < 1 && this.measureSoon();
    }, { threshold: [1] }) : null, this.observeIntersection(), n.win.addEventListener("resize", this.measureSoon = this.measureSoon.bind(this)), this.maybeMeasure();
  }
  createContainer() {
    this.parent ? (this.container = document.createElement("div"), this.container.style.position = "relative", this.container.className = this.view.themeClasses, this.parent.appendChild(this.container)) : this.container = this.view.dom;
  }
  observeIntersection() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      for (let n of this.manager.tooltipViews)
        this.intersectionObserver.observe(n.dom);
    }
  }
  measureSoon() {
    this.measureTimeout < 0 && (this.measureTimeout = setTimeout(() => {
      this.measureTimeout = -1, this.maybeMeasure();
    }, 50));
  }
  update(n) {
    n.transactions.length && (this.lastTransaction = Date.now());
    let e = this.manager.update(n, this.above);
    e && this.observeIntersection();
    let t = e || n.geometryChanged, i = n.state.facet(bs);
    if (i.position != this.position && !this.madeAbsolute) {
      this.position = i.position;
      for (let s of this.manager.tooltipViews)
        s.dom.style.position = this.position;
      t = !0;
    }
    if (i.parent != this.parent) {
      this.parent && this.container.remove(), this.parent = i.parent, this.createContainer();
      for (let s of this.manager.tooltipViews)
        this.container.appendChild(s.dom);
      t = !0;
    } else
      this.parent && this.view.themeClasses != this.classes && (this.classes = this.container.className = this.view.themeClasses);
    t && this.maybeMeasure();
  }
  createTooltip(n) {
    let e = n.create(this.view);
    if (e.dom.classList.add("cm-tooltip"), n.arrow && !e.dom.querySelector(".cm-tooltip > .cm-tooltip-arrow")) {
      let t = document.createElement("div");
      t.className = "cm-tooltip-arrow", e.dom.appendChild(t);
    }
    return e.dom.style.position = this.position, e.dom.style.top = oi, e.dom.style.left = "0px", this.container.appendChild(e.dom), e.mount && e.mount(this.view), e;
  }
  destroy() {
    var n, e;
    this.view.win.removeEventListener("resize", this.measureSoon);
    for (let t of this.manager.tooltipViews)
      t.dom.remove(), (n = t.destroy) === null || n === void 0 || n.call(t);
    this.parent && this.container.remove(), (e = this.intersectionObserver) === null || e === void 0 || e.disconnect(), clearTimeout(this.measureTimeout);
  }
  readMeasure() {
    let n = this.view.dom.getBoundingClientRect(), e = 1, t = 1, i = !1;
    if (this.position == "fixed" && this.manager.tooltipViews.length) {
      let { dom: s } = this.manager.tooltipViews[0];
      if (P.gecko)
        i = s.offsetParent != this.container.ownerDocument.body;
      else if (s.style.top == oi && s.style.left == "0px") {
        let r = s.getBoundingClientRect();
        i = Math.abs(r.top + 1e4) > 1 || Math.abs(r.left) > 1;
      }
    }
    if (i || this.position == "absolute")
      if (this.parent) {
        let s = this.parent.getBoundingClientRect();
        s.width && s.height && (e = s.width / this.parent.offsetWidth, t = s.height / this.parent.offsetHeight);
      } else
        ({ scaleX: e, scaleY: t } = this.view.viewState);
    return {
      editor: n,
      parent: this.parent ? this.container.getBoundingClientRect() : n,
      pos: this.manager.tooltips.map((s, r) => {
        let o = this.manager.tooltipViews[r];
        return o.getCoords ? o.getCoords(s.pos) : this.view.coordsAtPos(s.pos);
      }),
      size: this.manager.tooltipViews.map(({ dom: s }) => s.getBoundingClientRect()),
      space: this.view.state.facet(bs).tooltipSpace(this.view),
      scaleX: e,
      scaleY: t,
      makeAbsolute: i
    };
  }
  writeMeasure(n) {
    var e;
    if (n.makeAbsolute) {
      this.madeAbsolute = !0, this.position = "absolute";
      for (let l of this.manager.tooltipViews)
        l.dom.style.position = "absolute";
    }
    let { editor: t, space: i, scaleX: s, scaleY: r } = n, o = [];
    for (let l = 0; l < this.manager.tooltips.length; l++) {
      let a = this.manager.tooltips[l], h = this.manager.tooltipViews[l], { dom: c } = h, f = n.pos[l], u = n.size[l];
      if (!f || f.bottom <= Math.max(t.top, i.top) || f.top >= Math.min(t.bottom, i.bottom) || f.right < Math.max(t.left, i.left) - 0.1 || f.left > Math.min(t.right, i.right) + 0.1) {
        c.style.top = oi;
        continue;
      }
      let d = a.arrow ? h.dom.querySelector(".cm-tooltip-arrow") : null, p = d ? 7 : 0, g = u.right - u.left, m = (e = ll.get(h)) !== null && e !== void 0 ? e : u.bottom - u.top, y = h.offset || Rd, k = this.view.textDirection == K.LTR, v = u.width > i.right - i.left ? k ? i.left : i.right - u.width : k ? Math.min(f.left - (d ? 14 : 0) + y.x, i.right - g) : Math.max(i.left, f.left - g + (d ? 14 : 0) - y.x), S = this.above[l];
      !a.strictSide && (S ? f.top - (u.bottom - u.top) - y.y < i.top : f.bottom + (u.bottom - u.top) + y.y > i.bottom) && S == i.bottom - f.bottom > f.top - i.top && (S = this.above[l] = !S);
      let w = (S ? f.top - i.top : i.bottom - f.bottom) - p;
      if (w < m && h.resize !== !1) {
        if (w < this.view.defaultLineHeight) {
          c.style.top = oi;
          continue;
        }
        ll.set(h, m), c.style.height = (m = w) / r + "px";
      } else
        c.style.height && (c.style.height = "");
      let A = S ? f.top - m - p - y.y : f.bottom + p + y.y, C = v + g;
      if (h.overlap !== !0)
        for (let R of o)
          R.left < C && R.right > v && R.top < A + m && R.bottom > A && (A = S ? R.top - m - 2 - p : R.bottom + p + 2);
      if (this.position == "absolute" ? (c.style.top = (A - n.parent.top) / r + "px", c.style.left = (v - n.parent.left) / s + "px") : (c.style.top = A / r + "px", c.style.left = v / s + "px"), d) {
        let R = f.left + (k ? y.x : -y.x) - (v + 14 - 7);
        d.style.left = R / s + "px";
      }
      h.overlap !== !0 && o.push({ left: v, top: A, right: C, bottom: A + m }), c.classList.toggle("cm-tooltip-above", S), c.classList.toggle("cm-tooltip-below", !S), h.positioned && h.positioned(n.space);
    }
  }
  maybeMeasure() {
    if (this.manager.tooltips.length && (this.view.inView && this.view.requestMeasure(this.measureReq), this.inView != this.view.inView && (this.inView = this.view.inView, !this.inView)))
      for (let n of this.manager.tooltipViews)
        n.dom.style.top = oi;
  }
}, {
  eventObservers: {
    scroll() {
      this.maybeMeasure();
    }
  }
}), Dd = /* @__PURE__ */ T.baseTheme({
  ".cm-tooltip": {
    zIndex: 100,
    boxSizing: "border-box"
  },
  "&light .cm-tooltip": {
    border: "1px solid #bbb",
    backgroundColor: "#f5f5f5"
  },
  "&light .cm-tooltip-section:not(:first-child)": {
    borderTop: "1px solid #bbb"
  },
  "&dark .cm-tooltip": {
    backgroundColor: "#333338",
    color: "white"
  },
  ".cm-tooltip-arrow": {
    height: "7px",
    width: `${7 * 2}px`,
    position: "absolute",
    zIndex: -1,
    overflow: "hidden",
    "&:before, &:after": {
      content: "''",
      position: "absolute",
      width: 0,
      height: 0,
      borderLeft: "7px solid transparent",
      borderRight: "7px solid transparent"
    },
    ".cm-tooltip-above &": {
      bottom: "-7px",
      "&:before": {
        borderTop: "7px solid #bbb"
      },
      "&:after": {
        borderTop: "7px solid #f5f5f5",
        bottom: "1px"
      }
    },
    ".cm-tooltip-below &": {
      top: "-7px",
      "&:before": {
        borderBottom: "7px solid #bbb"
      },
      "&:after": {
        borderBottom: "7px solid #f5f5f5",
        top: "1px"
      }
    }
  },
  "&dark .cm-tooltip .cm-tooltip-arrow": {
    "&:before": {
      borderTopColor: "#333338",
      borderBottomColor: "#333338"
    },
    "&:after": {
      borderTopColor: "transparent",
      borderBottomColor: "transparent"
    }
  }
}), Rd = { x: 0, y: 0 }, Vr = /* @__PURE__ */ M.define({
  enables: [Fr, Dd]
}), Tn = /* @__PURE__ */ M.define();
class Jn {
  // Needs to be static so that host tooltip instances always match
  static create(e) {
    return new Jn(e);
  }
  constructor(e) {
    this.view = e, this.mounted = !1, this.dom = document.createElement("div"), this.dom.classList.add("cm-tooltip-hover"), this.manager = new kh(e, Tn, (t) => this.createHostedView(t));
  }
  createHostedView(e) {
    let t = e.create(this.view);
    return t.dom.classList.add("cm-tooltip-section"), this.dom.appendChild(t.dom), this.mounted && t.mount && t.mount(this.view), t;
  }
  mount(e) {
    for (let t of this.manager.tooltipViews)
      t.mount && t.mount(e);
    this.mounted = !0;
  }
  positioned(e) {
    for (let t of this.manager.tooltipViews)
      t.positioned && t.positioned(e);
  }
  update(e) {
    this.manager.update(e);
  }
  destroy() {
    var e;
    for (let t of this.manager.tooltipViews)
      (e = t.destroy) === null || e === void 0 || e.call(t);
  }
  passProp(e) {
    let t;
    for (let i of this.manager.tooltipViews) {
      let s = i[e];
      if (s !== void 0) {
        if (t === void 0)
          t = s;
        else if (t !== s)
          return;
      }
    }
    return t;
  }
  get offset() {
    return this.passProp("offset");
  }
  get getCoords() {
    return this.passProp("getCoords");
  }
  get overlap() {
    return this.passProp("overlap");
  }
  get resize() {
    return this.passProp("resize");
  }
}
const Bd = /* @__PURE__ */ Vr.compute([Tn], (n) => {
  let e = n.facet(Tn).filter((t) => t);
  return e.length === 0 ? null : {
    pos: Math.min(...e.map((t) => t.pos)),
    end: Math.max(...e.map((t) => {
      var i;
      return (i = t.end) !== null && i !== void 0 ? i : t.pos;
    })),
    create: Jn.create,
    above: e[0].above,
    arrow: e.some((t) => t.arrow)
  };
});
class Ed {
  constructor(e, t, i, s, r) {
    this.view = e, this.source = t, this.field = i, this.setHover = s, this.hoverTime = r, this.hoverTimeout = -1, this.restartTimeout = -1, this.pending = null, this.lastMove = { x: 0, y: 0, target: e.dom, time: 0 }, this.checkHover = this.checkHover.bind(this), e.dom.addEventListener("mouseleave", this.mouseleave = this.mouseleave.bind(this)), e.dom.addEventListener("mousemove", this.mousemove = this.mousemove.bind(this));
  }
  update() {
    this.pending && (this.pending = null, clearTimeout(this.restartTimeout), this.restartTimeout = setTimeout(() => this.startHover(), 20));
  }
  get active() {
    return this.view.state.field(this.field);
  }
  checkHover() {
    if (this.hoverTimeout = -1, this.active)
      return;
    let e = Date.now() - this.lastMove.time;
    e < this.hoverTime ? this.hoverTimeout = setTimeout(this.checkHover, this.hoverTime - e) : this.startHover();
  }
  startHover() {
    clearTimeout(this.restartTimeout);
    let { view: e, lastMove: t } = this, i = e.docView.nearest(t.target);
    if (!i)
      return;
    let s, r = 1;
    if (i instanceof ut)
      s = i.posAtStart;
    else {
      if (s = e.posAtCoords(t), s == null)
        return;
      let l = e.coordsAtPos(s);
      if (!l || t.y < l.top || t.y > l.bottom || t.x < l.left - e.defaultCharacterWidth || t.x > l.right + e.defaultCharacterWidth)
        return;
      let a = e.bidiSpans(e.state.doc.lineAt(s)).find((c) => c.from <= s && c.to >= s), h = a && a.dir == K.RTL ? -1 : 1;
      r = t.x < l.left ? -h : h;
    }
    let o = this.source(e, s, r);
    if (o != null && o.then) {
      let l = this.pending = { pos: s };
      o.then((a) => {
        this.pending == l && (this.pending = null, a && e.dispatch({ effects: this.setHover.of(a) }));
      }, (a) => Le(e.state, a, "hover tooltip"));
    } else
      o && e.dispatch({ effects: this.setHover.of(o) });
  }
  get tooltip() {
    let e = this.view.plugin(Fr), t = e ? e.manager.tooltips.findIndex((i) => i.create == Jn.create) : -1;
    return t > -1 ? e.manager.tooltipViews[t] : null;
  }
  mousemove(e) {
    var t;
    this.lastMove = { x: e.clientX, y: e.clientY, target: e.target, time: Date.now() }, this.hoverTimeout < 0 && (this.hoverTimeout = setTimeout(this.checkHover, this.hoverTime));
    let { active: i, tooltip: s } = this;
    if (i && s && !Ld(s.dom, e) || this.pending) {
      let { pos: r } = i || this.pending, o = (t = i == null ? void 0 : i.end) !== null && t !== void 0 ? t : r;
      (r == o ? this.view.posAtCoords(this.lastMove) != r : !Nd(this.view, r, o, e.clientX, e.clientY)) && (this.view.dispatch({ effects: this.setHover.of(null) }), this.pending = null);
    }
  }
  mouseleave(e) {
    clearTimeout(this.hoverTimeout), this.hoverTimeout = -1;
    let { active: t } = this;
    if (t) {
      let { tooltip: i } = this;
      i && i.dom.contains(e.relatedTarget) ? this.watchTooltipLeave(i.dom) : this.view.dispatch({ effects: this.setHover.of(null) });
    }
  }
  watchTooltipLeave(e) {
    let t = (i) => {
      e.removeEventListener("mouseleave", t), this.active && !this.view.dom.contains(i.relatedTarget) && this.view.dispatch({ effects: this.setHover.of(null) });
    };
    e.addEventListener("mouseleave", t);
  }
  destroy() {
    clearTimeout(this.hoverTimeout), this.view.dom.removeEventListener("mouseleave", this.mouseleave), this.view.dom.removeEventListener("mousemove", this.mousemove);
  }
}
const Ji = 4;
function Ld(n, e) {
  let t = n.getBoundingClientRect();
  return e.clientX >= t.left - Ji && e.clientX <= t.right + Ji && e.clientY >= t.top - Ji && e.clientY <= t.bottom + Ji;
}
function Nd(n, e, t, i, s, r) {
  let o = n.scrollDOM.getBoundingClientRect(), l = n.documentTop + n.documentPadding.top + n.contentHeight;
  if (o.left > i || o.right < i || o.top > s || Math.min(o.bottom, l) < s)
    return !1;
  let a = n.posAtCoords({ x: i, y: s }, !1);
  return a >= e && a <= t;
}
function Id(n, e = {}) {
  let t = E.define(), i = he.define({
    create() {
      return null;
    },
    update(s, r) {
      if (s && (e.hideOnChange && (r.docChanged || r.selection) || e.hideOn && e.hideOn(r, s)))
        return null;
      if (s && r.docChanged) {
        let o = r.changes.mapPos(s.pos, -1, pe.TrackDel);
        if (o == null)
          return null;
        let l = Object.assign(/* @__PURE__ */ Object.create(null), s);
        l.pos = o, s.end != null && (l.end = r.changes.mapPos(s.end)), s = l;
      }
      for (let o of r.effects)
        o.is(t) && (s = o.value), o.is(Wd) && (s = null);
      return s;
    },
    provide: (s) => Tn.from(s)
  });
  return [
    i,
    Z.define((s) => new Ed(
      s,
      n,
      i,
      t,
      e.hoverTime || 300
      /* Hover.Time */
    )),
    Bd
  ];
}
function Oh(n, e) {
  let t = n.plugin(Fr);
  if (!t)
    return null;
  let i = t.manager.tooltips.indexOf(e);
  return i < 0 ? null : t.manager.tooltipViews[i];
}
const Wd = /* @__PURE__ */ E.define(), al = /* @__PURE__ */ M.define({
  combine(n) {
    let e, t;
    for (let i of n)
      e = e || i.topContainer, t = t || i.bottomContainer;
    return { topContainer: e, bottomContainer: t };
  }
});
function Ti(n, e) {
  let t = n.plugin(Sh), i = t ? t.specs.indexOf(e) : -1;
  return i > -1 ? t.panels[i] : null;
}
const Sh = /* @__PURE__ */ Z.fromClass(class {
  constructor(n) {
    this.input = n.state.facet(Pi), this.specs = this.input.filter((t) => t), this.panels = this.specs.map((t) => t(n));
    let e = n.state.facet(al);
    this.top = new en(n, !0, e.topContainer), this.bottom = new en(n, !1, e.bottomContainer), this.top.sync(this.panels.filter((t) => t.top)), this.bottom.sync(this.panels.filter((t) => !t.top));
    for (let t of this.panels)
      t.dom.classList.add("cm-panel"), t.mount && t.mount();
  }
  update(n) {
    let e = n.state.facet(al);
    this.top.container != e.topContainer && (this.top.sync([]), this.top = new en(n.view, !0, e.topContainer)), this.bottom.container != e.bottomContainer && (this.bottom.sync([]), this.bottom = new en(n.view, !1, e.bottomContainer)), this.top.syncClasses(), this.bottom.syncClasses();
    let t = n.state.facet(Pi);
    if (t != this.input) {
      let i = t.filter((a) => a), s = [], r = [], o = [], l = [];
      for (let a of i) {
        let h = this.specs.indexOf(a), c;
        h < 0 ? (c = a(n.view), l.push(c)) : (c = this.panels[h], c.update && c.update(n)), s.push(c), (c.top ? r : o).push(c);
      }
      this.specs = i, this.panels = s, this.top.sync(r), this.bottom.sync(o);
      for (let a of l)
        a.dom.classList.add("cm-panel"), a.mount && a.mount();
    } else
      for (let i of this.panels)
        i.update && i.update(n);
  }
  destroy() {
    this.top.sync([]), this.bottom.sync([]);
  }
}, {
  provide: (n) => T.scrollMargins.of((e) => {
    let t = e.plugin(n);
    return t && { top: t.top.scrollMargin(), bottom: t.bottom.scrollMargin() };
  })
});
class en {
  constructor(e, t, i) {
    this.view = e, this.top = t, this.container = i, this.dom = void 0, this.classes = "", this.panels = [], this.syncClasses();
  }
  sync(e) {
    for (let t of this.panels)
      t.destroy && e.indexOf(t) < 0 && t.destroy();
    this.panels = e, this.syncDOM();
  }
  syncDOM() {
    if (this.panels.length == 0) {
      this.dom && (this.dom.remove(), this.dom = void 0);
      return;
    }
    if (!this.dom) {
      this.dom = document.createElement("div"), this.dom.className = this.top ? "cm-panels cm-panels-top" : "cm-panels cm-panels-bottom", this.dom.style[this.top ? "top" : "bottom"] = "0";
      let t = this.container || this.view.dom;
      t.insertBefore(this.dom, this.top ? t.firstChild : null);
    }
    let e = this.dom.firstChild;
    for (let t of this.panels)
      if (t.dom.parentNode == this.dom) {
        for (; e != t.dom; )
          e = hl(e);
        e = e.nextSibling;
      } else
        this.dom.insertBefore(t.dom, e);
    for (; e; )
      e = hl(e);
  }
  scrollMargin() {
    return !this.dom || this.container ? 0 : Math.max(0, this.top ? this.dom.getBoundingClientRect().bottom - Math.max(0, this.view.scrollDOM.getBoundingClientRect().top) : Math.min(innerHeight, this.view.scrollDOM.getBoundingClientRect().bottom) - this.dom.getBoundingClientRect().top);
  }
  syncClasses() {
    if (!(!this.container || this.classes == this.view.themeClasses)) {
      for (let e of this.classes.split(" "))
        e && this.container.classList.remove(e);
      for (let e of (this.classes = this.view.themeClasses).split(" "))
        e && this.container.classList.add(e);
    }
  }
}
function hl(n) {
  let e = n.nextSibling;
  return n.remove(), e;
}
const Pi = /* @__PURE__ */ M.define({
  enables: Sh
});
class rt extends Bt {
  /**
  @internal
  */
  compare(e) {
    return this == e || this.constructor == e.constructor && this.eq(e);
  }
  /**
  Compare this marker to another marker of the same type.
  */
  eq(e) {
    return !1;
  }
  /**
  Called if the marker has a `toDOM` method and its representation
  was removed from a gutter.
  */
  destroy(e) {
  }
}
rt.prototype.elementClass = "";
rt.prototype.toDOM = void 0;
rt.prototype.mapMode = pe.TrackBefore;
rt.prototype.startSide = rt.prototype.endSide = -1;
rt.prototype.point = !0;
const bn = /* @__PURE__ */ M.define(), $d = {
  class: "",
  renderEmptyElements: !1,
  elementStyle: "",
  markers: () => F.empty,
  lineMarker: () => null,
  widgetMarker: () => null,
  lineMarkerChange: null,
  initialSpacer: null,
  updateSpacer: null,
  domEventHandlers: {}
}, xi = /* @__PURE__ */ M.define();
function Qd(n) {
  return [vh(), xi.of(Object.assign(Object.assign({}, $d), n))];
}
const gr = /* @__PURE__ */ M.define({
  combine: (n) => n.some((e) => e)
});
function vh(n) {
  let e = [
    zd
  ];
  return n && n.fixed === !1 && e.push(gr.of(!0)), e;
}
const zd = /* @__PURE__ */ Z.fromClass(class {
  constructor(n) {
    this.view = n, this.prevViewport = n.viewport, this.dom = document.createElement("div"), this.dom.className = "cm-gutters", this.dom.setAttribute("aria-hidden", "true"), this.dom.style.minHeight = this.view.contentHeight / this.view.scaleY + "px", this.gutters = n.state.facet(xi).map((e) => new fl(n, e));
    for (let e of this.gutters)
      this.dom.appendChild(e.dom);
    this.fixed = !n.state.facet(gr), this.fixed && (this.dom.style.position = "sticky"), this.syncGutters(!1), n.scrollDOM.insertBefore(this.dom, n.contentDOM);
  }
  update(n) {
    if (this.updateGutters(n)) {
      let e = this.prevViewport, t = n.view.viewport, i = Math.min(e.to, t.to) - Math.max(e.from, t.from);
      this.syncGutters(i < (t.to - t.from) * 0.8);
    }
    n.geometryChanged && (this.dom.style.minHeight = this.view.contentHeight + "px"), this.view.state.facet(gr) != !this.fixed && (this.fixed = !this.fixed, this.dom.style.position = this.fixed ? "sticky" : ""), this.prevViewport = n.view.viewport;
  }
  syncGutters(n) {
    let e = this.dom.nextSibling;
    n && this.dom.remove();
    let t = F.iter(this.view.state.facet(bn), this.view.viewport.from), i = [], s = this.gutters.map((r) => new Fd(r, this.view.viewport, -this.view.documentPadding.top));
    for (let r of this.view.viewportLineBlocks)
      if (i.length && (i = []), Array.isArray(r.type)) {
        let o = !0;
        for (let l of r.type)
          if (l.type == me.Text && o) {
            yr(t, i, l.from);
            for (let a of s)
              a.line(this.view, l, i);
            o = !1;
          } else if (l.widget)
            for (let a of s)
              a.widget(this.view, l);
      } else if (r.type == me.Text) {
        yr(t, i, r.from);
        for (let o of s)
          o.line(this.view, r, i);
      } else if (r.widget)
        for (let o of s)
          o.widget(this.view, r);
    for (let r of s)
      r.finish();
    n && this.view.scrollDOM.insertBefore(this.dom, e);
  }
  updateGutters(n) {
    let e = n.startState.facet(xi), t = n.state.facet(xi), i = n.docChanged || n.heightChanged || n.viewportChanged || !F.eq(n.startState.facet(bn), n.state.facet(bn), n.view.viewport.from, n.view.viewport.to);
    if (e == t)
      for (let s of this.gutters)
        s.update(n) && (i = !0);
    else {
      i = !0;
      let s = [];
      for (let r of t) {
        let o = e.indexOf(r);
        o < 0 ? s.push(new fl(this.view, r)) : (this.gutters[o].update(n), s.push(this.gutters[o]));
      }
      for (let r of this.gutters)
        r.dom.remove(), s.indexOf(r) < 0 && r.destroy();
      for (let r of s)
        this.dom.appendChild(r.dom);
      this.gutters = s;
    }
    return i;
  }
  destroy() {
    for (let n of this.gutters)
      n.destroy();
    this.dom.remove();
  }
}, {
  provide: (n) => T.scrollMargins.of((e) => {
    let t = e.plugin(n);
    return !t || t.gutters.length == 0 || !t.fixed ? null : e.textDirection == K.LTR ? { left: t.dom.offsetWidth * e.scaleX } : { right: t.dom.offsetWidth * e.scaleX };
  })
});
function cl(n) {
  return Array.isArray(n) ? n : [n];
}
function yr(n, e, t) {
  for (; n.value && n.from <= t; )
    n.from == t && e.push(n.value), n.next();
}
class Fd {
  constructor(e, t, i) {
    this.gutter = e, this.height = i, this.i = 0, this.cursor = F.iter(e.markers, t.from);
  }
  addElement(e, t, i) {
    let { gutter: s } = this, r = (t.top - this.height) / e.scaleY, o = t.height / e.scaleY;
    if (this.i == s.elements.length) {
      let l = new Ch(e, o, r, i);
      s.elements.push(l), s.dom.appendChild(l.dom);
    } else
      s.elements[this.i].update(e, o, r, i);
    this.height = t.bottom, this.i++;
  }
  line(e, t, i) {
    let s = [];
    yr(this.cursor, s, t.from), i.length && (s = s.concat(i));
    let r = this.gutter.config.lineMarker(e, t, s);
    r && s.unshift(r);
    let o = this.gutter;
    s.length == 0 && !o.config.renderEmptyElements || this.addElement(e, t, s);
  }
  widget(e, t) {
    let i = this.gutter.config.widgetMarker(e, t.widget, t);
    i && this.addElement(e, t, [i]);
  }
  finish() {
    let e = this.gutter;
    for (; e.elements.length > this.i; ) {
      let t = e.elements.pop();
      e.dom.removeChild(t.dom), t.destroy();
    }
  }
}
class fl {
  constructor(e, t) {
    this.view = e, this.config = t, this.elements = [], this.spacer = null, this.dom = document.createElement("div"), this.dom.className = "cm-gutter" + (this.config.class ? " " + this.config.class : "");
    for (let i in t.domEventHandlers)
      this.dom.addEventListener(i, (s) => {
        let r = s.target, o;
        if (r != this.dom && this.dom.contains(r)) {
          for (; r.parentNode != this.dom; )
            r = r.parentNode;
          let a = r.getBoundingClientRect();
          o = (a.top + a.bottom) / 2;
        } else
          o = s.clientY;
        let l = e.lineBlockAtHeight(o - e.documentTop);
        t.domEventHandlers[i](e, l, s) && s.preventDefault();
      });
    this.markers = cl(t.markers(e)), t.initialSpacer && (this.spacer = new Ch(e, 0, 0, [t.initialSpacer(e)]), this.dom.appendChild(this.spacer.dom), this.spacer.dom.style.cssText += "visibility: hidden; pointer-events: none");
  }
  update(e) {
    let t = this.markers;
    if (this.markers = cl(this.config.markers(e.view)), this.spacer && this.config.updateSpacer) {
      let s = this.config.updateSpacer(this.spacer.markers[0], e);
      s != this.spacer.markers[0] && this.spacer.update(e.view, 0, 0, [s]);
    }
    let i = e.view.viewport;
    return !F.eq(this.markers, t, i.from, i.to) || (this.config.lineMarkerChange ? this.config.lineMarkerChange(e) : !1);
  }
  destroy() {
    for (let e of this.elements)
      e.destroy();
  }
}
class Ch {
  constructor(e, t, i, s) {
    this.height = -1, this.above = 0, this.markers = [], this.dom = document.createElement("div"), this.dom.className = "cm-gutterElement", this.update(e, t, i, s);
  }
  update(e, t, i, s) {
    this.height != t && (this.height = t, this.dom.style.height = t + "px"), this.above != i && (this.dom.style.marginTop = (this.above = i) ? i + "px" : ""), Vd(this.markers, s) || this.setMarkers(e, s);
  }
  setMarkers(e, t) {
    let i = "cm-gutterElement", s = this.dom.firstChild;
    for (let r = 0, o = 0; ; ) {
      let l = o, a = r < t.length ? t[r++] : null, h = !1;
      if (a) {
        let c = a.elementClass;
        c && (i += " " + c);
        for (let f = o; f < this.markers.length; f++)
          if (this.markers[f].compare(a)) {
            l = f, h = !0;
            break;
          }
      } else
        l = this.markers.length;
      for (; o < l; ) {
        let c = this.markers[o++];
        if (c.toDOM) {
          c.destroy(s);
          let f = s.nextSibling;
          s.remove(), s = f;
        }
      }
      if (!a)
        break;
      a.toDOM && (h ? s = s.nextSibling : this.dom.insertBefore(a.toDOM(e), s)), h && o++;
    }
    this.dom.className = i, this.markers = t;
  }
  destroy() {
    this.setMarkers(null, []);
  }
}
function Vd(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (!n[t].compare(e[t]))
      return !1;
  return !0;
}
const Hd = /* @__PURE__ */ M.define(), Qt = /* @__PURE__ */ M.define({
  combine(n) {
    return Je(n, { formatNumber: String, domEventHandlers: {} }, {
      domEventHandlers(e, t) {
        let i = Object.assign({}, e);
        for (let s in t) {
          let r = i[s], o = t[s];
          i[s] = r ? (l, a, h) => r(l, a, h) || o(l, a, h) : o;
        }
        return i;
      }
    });
  }
});
class xs extends rt {
  constructor(e) {
    super(), this.number = e;
  }
  eq(e) {
    return this.number == e.number;
  }
  toDOM() {
    return document.createTextNode(this.number);
  }
}
function ws(n, e) {
  return n.state.facet(Qt).formatNumber(e, n.state);
}
const qd = /* @__PURE__ */ xi.compute([Qt], (n) => ({
  class: "cm-lineNumbers",
  renderEmptyElements: !1,
  markers(e) {
    return e.state.facet(Hd);
  },
  lineMarker(e, t, i) {
    return i.some((s) => s.toDOM) ? null : new xs(ws(e, e.state.doc.lineAt(t.from).number));
  },
  widgetMarker: () => null,
  lineMarkerChange: (e) => e.startState.facet(Qt) != e.state.facet(Qt),
  initialSpacer(e) {
    return new xs(ws(e, ul(e.state.doc.lines)));
  },
  updateSpacer(e, t) {
    let i = ws(t.view, ul(t.view.state.doc.lines));
    return i == e.number ? e : new xs(i);
  },
  domEventHandlers: n.facet(Qt).domEventHandlers
}));
function Ud(n = {}) {
  return [
    Qt.of(n),
    vh(),
    qd
  ];
}
function ul(n) {
  let e = 9;
  for (; e < n; )
    e = e * 10 + 9;
  return e;
}
const Xd = /* @__PURE__ */ new class extends rt {
  constructor() {
    super(...arguments), this.elementClass = "cm-activeLineGutter";
  }
}(), jd = /* @__PURE__ */ bn.compute(["selection"], (n) => {
  let e = [], t = -1;
  for (let i of n.selection.ranges) {
    let s = n.doc.lineAt(i.head).from;
    s > t && (t = s, e.push(Xd.range(s)));
  }
  return F.of(e);
});
function Gd() {
  return jd;
}
const Ah = 1024;
let Kd = 0;
class ks {
  constructor(e, t) {
    this.from = e, this.to = t;
  }
}
class N {
  /**
  Create a new node prop type.
  */
  constructor(e = {}) {
    this.id = Kd++, this.perNode = !!e.perNode, this.deserialize = e.deserialize || (() => {
      throw new Error("This node type doesn't define a deserialize function");
    });
  }
  /**
  This is meant to be used with
  [`NodeSet.extend`](#common.NodeSet.extend) or
  [`LRParser.configure`](#lr.ParserConfig.props) to compute
  prop values for each node type in the set. Takes a [match
  object](#common.NodeType^match) or function that returns undefined
  if the node type doesn't get this prop, and the prop's value if
  it does.
  */
  add(e) {
    if (this.perNode)
      throw new RangeError("Can't add per-node props to node types");
    return typeof e != "function" && (e = Oe.match(e)), (t) => {
      let i = e(t);
      return i === void 0 ? null : [this, i];
    };
  }
}
N.closedBy = new N({ deserialize: (n) => n.split(" ") });
N.openedBy = new N({ deserialize: (n) => n.split(" ") });
N.group = new N({ deserialize: (n) => n.split(" ") });
N.contextHash = new N({ perNode: !0 });
N.lookAhead = new N({ perNode: !0 });
N.mounted = new N({ perNode: !0 });
class Pn {
  constructor(e, t, i) {
    this.tree = e, this.overlay = t, this.parser = i;
  }
  /**
  @internal
  */
  static get(e) {
    return e && e.props && e.props[N.mounted.id];
  }
}
const _d = /* @__PURE__ */ Object.create(null);
class Oe {
  /**
  @internal
  */
  constructor(e, t, i, s = 0) {
    this.name = e, this.props = t, this.id = i, this.flags = s;
  }
  /**
  Define a node type.
  */
  static define(e) {
    let t = e.props && e.props.length ? /* @__PURE__ */ Object.create(null) : _d, i = (e.top ? 1 : 0) | (e.skipped ? 2 : 0) | (e.error ? 4 : 0) | (e.name == null ? 8 : 0), s = new Oe(e.name || "", t, e.id, i);
    if (e.props) {
      for (let r of e.props)
        if (Array.isArray(r) || (r = r(s)), r) {
          if (r[0].perNode)
            throw new RangeError("Can't store a per-node prop on a node type");
          t[r[0].id] = r[1];
        }
    }
    return s;
  }
  /**
  Retrieves a node prop for this type. Will return `undefined` if
  the prop isn't present on this node.
  */
  prop(e) {
    return this.props[e.id];
  }
  /**
  True when this is the top node of a grammar.
  */
  get isTop() {
    return (this.flags & 1) > 0;
  }
  /**
  True when this node is produced by a skip rule.
  */
  get isSkipped() {
    return (this.flags & 2) > 0;
  }
  /**
  Indicates whether this is an error node.
  */
  get isError() {
    return (this.flags & 4) > 0;
  }
  /**
  When true, this node type doesn't correspond to a user-declared
  named node, for example because it is used to cache repetition.
  */
  get isAnonymous() {
    return (this.flags & 8) > 0;
  }
  /**
  Returns true when this node's name or one of its
  [groups](#common.NodeProp^group) matches the given string.
  */
  is(e) {
    if (typeof e == "string") {
      if (this.name == e)
        return !0;
      let t = this.prop(N.group);
      return t ? t.indexOf(e) > -1 : !1;
    }
    return this.id == e;
  }
  /**
  Create a function from node types to arbitrary values by
  specifying an object whose property names are node or
  [group](#common.NodeProp^group) names. Often useful with
  [`NodeProp.add`](#common.NodeProp.add). You can put multiple
  names, separated by spaces, in a single property name to map
  multiple node names to a single value.
  */
  static match(e) {
    let t = /* @__PURE__ */ Object.create(null);
    for (let i in e)
      for (let s of i.split(" "))
        t[s] = e[i];
    return (i) => {
      for (let s = i.prop(N.group), r = -1; r < (s ? s.length : 0); r++) {
        let o = t[r < 0 ? i.name : s[r]];
        if (o)
          return o;
      }
    };
  }
}
Oe.none = new Oe(
  "",
  /* @__PURE__ */ Object.create(null),
  0,
  8
  /* NodeFlag.Anonymous */
);
class Hr {
  /**
  Create a set with the given types. The `id` property of each
  type should correspond to its position within the array.
  */
  constructor(e) {
    this.types = e;
    for (let t = 0; t < e.length; t++)
      if (e[t].id != t)
        throw new RangeError("Node type ids should correspond to array positions when creating a node set");
  }
  /**
  Create a copy of this set with some node properties added. The
  arguments to this method can be created with
  [`NodeProp.add`](#common.NodeProp.add).
  */
  extend(...e) {
    let t = [];
    for (let i of this.types) {
      let s = null;
      for (let r of e) {
        let o = r(i);
        o && (s || (s = Object.assign({}, i.props)), s[o[0].id] = o[1]);
      }
      t.push(s ? new Oe(i.name, s, i.id, i.flags) : i);
    }
    return new Hr(t);
  }
}
const tn = /* @__PURE__ */ new WeakMap(), dl = /* @__PURE__ */ new WeakMap();
var ie;
(function(n) {
  n[n.ExcludeBuffers = 1] = "ExcludeBuffers", n[n.IncludeAnonymous = 2] = "IncludeAnonymous", n[n.IgnoreMounts = 4] = "IgnoreMounts", n[n.IgnoreOverlays = 8] = "IgnoreOverlays";
})(ie || (ie = {}));
class Y {
  /**
  Construct a new tree. See also [`Tree.build`](#common.Tree^build).
  */
  constructor(e, t, i, s, r) {
    if (this.type = e, this.children = t, this.positions = i, this.length = s, this.props = null, r && r.length) {
      this.props = /* @__PURE__ */ Object.create(null);
      for (let [o, l] of r)
        this.props[typeof o == "number" ? o : o.id] = l;
    }
  }
  /**
  @internal
  */
  toString() {
    let e = Pn.get(this);
    if (e && !e.overlay)
      return e.tree.toString();
    let t = "";
    for (let i of this.children) {
      let s = i.toString();
      s && (t && (t += ","), t += s);
    }
    return this.type.name ? (/\W/.test(this.type.name) && !this.type.isError ? JSON.stringify(this.type.name) : this.type.name) + (t.length ? "(" + t + ")" : "") : t;
  }
  /**
  Get a [tree cursor](#common.TreeCursor) positioned at the top of
  the tree. Mode can be used to [control](#common.IterMode) which
  nodes the cursor visits.
  */
  cursor(e = 0) {
    return new xr(this.topNode, e);
  }
  /**
  Get a [tree cursor](#common.TreeCursor) pointing into this tree
  at the given position and side (see
  [`moveTo`](#common.TreeCursor.moveTo).
  */
  cursorAt(e, t = 0, i = 0) {
    let s = tn.get(this) || this.topNode, r = new xr(s);
    return r.moveTo(e, t), tn.set(this, r._tree), r;
  }
  /**
  Get a [syntax node](#common.SyntaxNode) object for the top of the
  tree.
  */
  get topNode() {
    return new ke(this, 0, 0, null);
  }
  /**
  Get the [syntax node](#common.SyntaxNode) at the given position.
  If `side` is -1, this will move into nodes that end at the
  position. If 1, it'll move into nodes that start at the
  position. With 0, it'll only enter nodes that cover the position
  from both sides.
  
  Note that this will not enter
  [overlays](#common.MountedTree.overlay), and you often want
  [`resolveInner`](#common.Tree.resolveInner) instead.
  */
  resolve(e, t = 0) {
    let i = Di(tn.get(this) || this.topNode, e, t, !1);
    return tn.set(this, i), i;
  }
  /**
  Like [`resolve`](#common.Tree.resolve), but will enter
  [overlaid](#common.MountedTree.overlay) nodes, producing a syntax node
  pointing into the innermost overlaid tree at the given position
  (with parent links going through all parent structure, including
  the host trees).
  */
  resolveInner(e, t = 0) {
    let i = Di(dl.get(this) || this.topNode, e, t, !0);
    return dl.set(this, i), i;
  }
  /**
  In some situations, it can be useful to iterate through all
  nodes around a position, including those in overlays that don't
  directly cover the position. This method gives you an iterator
  that will produce all nodes, from small to big, around the given
  position.
  */
  resolveStack(e, t = 0) {
    return Jd(this, e, t);
  }
  /**
  Iterate over the tree and its children, calling `enter` for any
  node that touches the `from`/`to` region (if given) before
  running over such a node's children, and `leave` (if given) when
  leaving the node. When `enter` returns `false`, that node will
  not have its children iterated over (or `leave` called).
  */
  iterate(e) {
    let { enter: t, leave: i, from: s = 0, to: r = this.length } = e, o = e.mode || 0, l = (o & ie.IncludeAnonymous) > 0;
    for (let a = this.cursor(o | ie.IncludeAnonymous); ; ) {
      let h = !1;
      if (a.from <= r && a.to >= s && (!l && a.type.isAnonymous || t(a) !== !1)) {
        if (a.firstChild())
          continue;
        h = !0;
      }
      for (; h && i && (l || !a.type.isAnonymous) && i(a), !a.nextSibling(); ) {
        if (!a.parent())
          return;
        h = !0;
      }
    }
  }
  /**
  Get the value of the given [node prop](#common.NodeProp) for this
  node. Works with both per-node and per-type props.
  */
  prop(e) {
    return e.perNode ? this.props ? this.props[e.id] : void 0 : this.type.prop(e);
  }
  /**
  Returns the node's [per-node props](#common.NodeProp.perNode) in a
  format that can be passed to the [`Tree`](#common.Tree)
  constructor.
  */
  get propValues() {
    let e = [];
    if (this.props)
      for (let t in this.props)
        e.push([+t, this.props[t]]);
    return e;
  }
  /**
  Balance the direct children of this tree, producing a copy of
  which may have children grouped into subtrees with type
  [`NodeType.none`](#common.NodeType^none).
  */
  balance(e = {}) {
    return this.children.length <= 8 ? this : Xr(Oe.none, this.children, this.positions, 0, this.children.length, 0, this.length, (t, i, s) => new Y(this.type, t, i, s, this.propValues), e.makeTree || ((t, i, s) => new Y(Oe.none, t, i, s)));
  }
  /**
  Build a tree from a postfix-ordered buffer of node information,
  or a cursor over such a buffer.
  */
  static build(e) {
    return ep(e);
  }
}
Y.empty = new Y(Oe.none, [], [], 0);
class qr {
  constructor(e, t) {
    this.buffer = e, this.index = t;
  }
  get id() {
    return this.buffer[this.index - 4];
  }
  get start() {
    return this.buffer[this.index - 3];
  }
  get end() {
    return this.buffer[this.index - 2];
  }
  get size() {
    return this.buffer[this.index - 1];
  }
  get pos() {
    return this.index;
  }
  next() {
    this.index -= 4;
  }
  fork() {
    return new qr(this.buffer, this.index);
  }
}
class kt {
  /**
  Create a tree buffer.
  */
  constructor(e, t, i) {
    this.buffer = e, this.length = t, this.set = i;
  }
  /**
  @internal
  */
  get type() {
    return Oe.none;
  }
  /**
  @internal
  */
  toString() {
    let e = [];
    for (let t = 0; t < this.buffer.length; )
      e.push(this.childString(t)), t = this.buffer[t + 3];
    return e.join(",");
  }
  /**
  @internal
  */
  childString(e) {
    let t = this.buffer[e], i = this.buffer[e + 3], s = this.set.types[t], r = s.name;
    if (/\W/.test(r) && !s.isError && (r = JSON.stringify(r)), e += 4, i == e)
      return r;
    let o = [];
    for (; e < i; )
      o.push(this.childString(e)), e = this.buffer[e + 3];
    return r + "(" + o.join(",") + ")";
  }
  /**
  @internal
  */
  findChild(e, t, i, s, r) {
    let { buffer: o } = this, l = -1;
    for (let a = e; a != t && !(Mh(r, s, o[a + 1], o[a + 2]) && (l = a, i > 0)); a = o[a + 3])
      ;
    return l;
  }
  /**
  @internal
  */
  slice(e, t, i) {
    let s = this.buffer, r = new Uint16Array(t - e), o = 0;
    for (let l = e, a = 0; l < t; ) {
      r[a++] = s[l++], r[a++] = s[l++] - i;
      let h = r[a++] = s[l++] - i;
      r[a++] = s[l++] - e, o = Math.max(o, h);
    }
    return new kt(r, o, this.set);
  }
}
function Mh(n, e, t, i) {
  switch (n) {
    case -2:
      return t < e;
    case -1:
      return i >= e && t < e;
    case 0:
      return t < e && i > e;
    case 1:
      return t <= e && i > e;
    case 2:
      return i > e;
    case 4:
      return !0;
  }
}
function Di(n, e, t, i) {
  for (var s; n.from == n.to || (t < 1 ? n.from >= e : n.from > e) || (t > -1 ? n.to <= e : n.to < e); ) {
    let o = !i && n instanceof ke && n.index < 0 ? null : n.parent;
    if (!o)
      return n;
    n = o;
  }
  let r = i ? 0 : ie.IgnoreOverlays;
  if (i)
    for (let o = n, l = o.parent; l; o = l, l = o.parent)
      o instanceof ke && o.index < 0 && ((s = l.enter(e, t, r)) === null || s === void 0 ? void 0 : s.from) != o.from && (n = l);
  for (; ; ) {
    let o = n.enter(e, t, r);
    if (!o)
      return n;
    n = o;
  }
}
class Th {
  cursor(e = 0) {
    return new xr(this, e);
  }
  getChild(e, t = null, i = null) {
    let s = pl(this, e, t, i);
    return s.length ? s[0] : null;
  }
  getChildren(e, t = null, i = null) {
    return pl(this, e, t, i);
  }
  resolve(e, t = 0) {
    return Di(this, e, t, !1);
  }
  resolveInner(e, t = 0) {
    return Di(this, e, t, !0);
  }
  matchContext(e) {
    return br(this, e);
  }
  enterUnfinishedNodesBefore(e) {
    let t = this.childBefore(e), i = this;
    for (; t; ) {
      let s = t.lastChild;
      if (!s || s.to != t.to)
        break;
      s.type.isError && s.from == s.to ? (i = t, t = s.prevSibling) : t = s;
    }
    return i;
  }
  get node() {
    return this;
  }
  get next() {
    return this.parent;
  }
}
class ke extends Th {
  constructor(e, t, i, s) {
    super(), this._tree = e, this.from = t, this.index = i, this._parent = s;
  }
  get type() {
    return this._tree.type;
  }
  get name() {
    return this._tree.type.name;
  }
  get to() {
    return this.from + this._tree.length;
  }
  nextChild(e, t, i, s, r = 0) {
    for (let o = this; ; ) {
      for (let { children: l, positions: a } = o._tree, h = t > 0 ? l.length : -1; e != h; e += t) {
        let c = l[e], f = a[e] + o.from;
        if (Mh(s, i, f, f + c.length)) {
          if (c instanceof kt) {
            if (r & ie.ExcludeBuffers)
              continue;
            let u = c.findChild(0, c.buffer.length, t, i - f, s);
            if (u > -1)
              return new Ke(new Yd(o, c, e, f), null, u);
          } else if (r & ie.IncludeAnonymous || !c.type.isAnonymous || Ur(c)) {
            let u;
            if (!(r & ie.IgnoreMounts) && (u = Pn.get(c)) && !u.overlay)
              return new ke(u.tree, f, e, o);
            let d = new ke(c, f, e, o);
            return r & ie.IncludeAnonymous || !d.type.isAnonymous ? d : d.nextChild(t < 0 ? c.children.length - 1 : 0, t, i, s);
          }
        }
      }
      if (r & ie.IncludeAnonymous || !o.type.isAnonymous || (o.index >= 0 ? e = o.index + t : e = t < 0 ? -1 : o._parent._tree.children.length, o = o._parent, !o))
        return null;
    }
  }
  get firstChild() {
    return this.nextChild(
      0,
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  get lastChild() {
    return this.nextChild(
      this._tree.children.length - 1,
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  childAfter(e) {
    return this.nextChild(
      0,
      1,
      e,
      2
      /* Side.After */
    );
  }
  childBefore(e) {
    return this.nextChild(
      this._tree.children.length - 1,
      -1,
      e,
      -2
      /* Side.Before */
    );
  }
  enter(e, t, i = 0) {
    let s;
    if (!(i & ie.IgnoreOverlays) && (s = Pn.get(this._tree)) && s.overlay) {
      let r = e - this.from;
      for (let { from: o, to: l } of s.overlay)
        if ((t > 0 ? o <= r : o < r) && (t < 0 ? l >= r : l > r))
          return new ke(s.tree, s.overlay[0].from + this.from, -1, this);
    }
    return this.nextChild(0, 1, e, t, i);
  }
  nextSignificantParent() {
    let e = this;
    for (; e.type.isAnonymous && e._parent; )
      e = e._parent;
    return e;
  }
  get parent() {
    return this._parent ? this._parent.nextSignificantParent() : null;
  }
  get nextSibling() {
    return this._parent && this.index >= 0 ? this._parent.nextChild(
      this.index + 1,
      1,
      0,
      4
      /* Side.DontCare */
    ) : null;
  }
  get prevSibling() {
    return this._parent && this.index >= 0 ? this._parent.nextChild(
      this.index - 1,
      -1,
      0,
      4
      /* Side.DontCare */
    ) : null;
  }
  get tree() {
    return this._tree;
  }
  toTree() {
    return this._tree;
  }
  /**
  @internal
  */
  toString() {
    return this._tree.toString();
  }
}
function pl(n, e, t, i) {
  let s = n.cursor(), r = [];
  if (!s.firstChild())
    return r;
  if (t != null) {
    for (; !s.type.is(t); )
      if (!s.nextSibling())
        return r;
  }
  for (; ; ) {
    if (i != null && s.type.is(i))
      return r;
    if (s.type.is(e) && r.push(s.node), !s.nextSibling())
      return i == null ? r : [];
  }
}
function br(n, e, t = e.length - 1) {
  for (let i = n.parent; t >= 0; i = i.parent) {
    if (!i)
      return !1;
    if (!i.type.isAnonymous) {
      if (e[t] && e[t] != i.name)
        return !1;
      t--;
    }
  }
  return !0;
}
class Yd {
  constructor(e, t, i, s) {
    this.parent = e, this.buffer = t, this.index = i, this.start = s;
  }
}
class Ke extends Th {
  get name() {
    return this.type.name;
  }
  get from() {
    return this.context.start + this.context.buffer.buffer[this.index + 1];
  }
  get to() {
    return this.context.start + this.context.buffer.buffer[this.index + 2];
  }
  constructor(e, t, i) {
    super(), this.context = e, this._parent = t, this.index = i, this.type = e.buffer.set.types[e.buffer.buffer[i]];
  }
  child(e, t, i) {
    let { buffer: s } = this.context, r = s.findChild(this.index + 4, s.buffer[this.index + 3], e, t - this.context.start, i);
    return r < 0 ? null : new Ke(this.context, this, r);
  }
  get firstChild() {
    return this.child(
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  get lastChild() {
    return this.child(
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  childAfter(e) {
    return this.child(
      1,
      e,
      2
      /* Side.After */
    );
  }
  childBefore(e) {
    return this.child(
      -1,
      e,
      -2
      /* Side.Before */
    );
  }
  enter(e, t, i = 0) {
    if (i & ie.ExcludeBuffers)
      return null;
    let { buffer: s } = this.context, r = s.findChild(this.index + 4, s.buffer[this.index + 3], t > 0 ? 1 : -1, e - this.context.start, t);
    return r < 0 ? null : new Ke(this.context, this, r);
  }
  get parent() {
    return this._parent || this.context.parent.nextSignificantParent();
  }
  externalSibling(e) {
    return this._parent ? null : this.context.parent.nextChild(
      this.context.index + e,
      e,
      0,
      4
      /* Side.DontCare */
    );
  }
  get nextSibling() {
    let { buffer: e } = this.context, t = e.buffer[this.index + 3];
    return t < (this._parent ? e.buffer[this._parent.index + 3] : e.buffer.length) ? new Ke(this.context, this._parent, t) : this.externalSibling(1);
  }
  get prevSibling() {
    let { buffer: e } = this.context, t = this._parent ? this._parent.index + 4 : 0;
    return this.index == t ? this.externalSibling(-1) : new Ke(this.context, this._parent, e.findChild(
      t,
      this.index,
      -1,
      0,
      4
      /* Side.DontCare */
    ));
  }
  get tree() {
    return null;
  }
  toTree() {
    let e = [], t = [], { buffer: i } = this.context, s = this.index + 4, r = i.buffer[this.index + 3];
    if (r > s) {
      let o = i.buffer[this.index + 1];
      e.push(i.slice(s, r, o)), t.push(0);
    }
    return new Y(this.type, e, t, this.to - this.from);
  }
  /**
  @internal
  */
  toString() {
    return this.context.buffer.childString(this.index);
  }
}
function Ph(n) {
  if (!n.length)
    return null;
  let e = 0, t = n[0];
  for (let r = 1; r < n.length; r++) {
    let o = n[r];
    (o.from > t.from || o.to < t.to) && (t = o, e = r);
  }
  let i = t instanceof ke && t.index < 0 ? null : t.parent, s = n.slice();
  return i ? s[e] = i : s.splice(e, 1), new Zd(s, t);
}
class Zd {
  constructor(e, t) {
    this.heads = e, this.node = t;
  }
  get next() {
    return Ph(this.heads);
  }
}
function Jd(n, e, t) {
  let i = n.resolveInner(e, t), s = null;
  for (let r = i instanceof ke ? i : i.context.parent; r; r = r.parent)
    if (r.index < 0) {
      let o = r.parent;
      (s || (s = [i])).push(o.resolve(e, t)), r = o;
    } else {
      let o = Pn.get(r.tree);
      if (o && o.overlay && o.overlay[0].from <= e && o.overlay[o.overlay.length - 1].to >= e) {
        let l = new ke(o.tree, o.overlay[0].from + r.from, -1, r);
        (s || (s = [i])).push(Di(l, e, t, !1));
      }
    }
  return s ? Ph(s) : i;
}
class xr {
  /**
  Shorthand for `.type.name`.
  */
  get name() {
    return this.type.name;
  }
  /**
  @internal
  */
  constructor(e, t = 0) {
    if (this.mode = t, this.buffer = null, this.stack = [], this.index = 0, this.bufferNode = null, e instanceof ke)
      this.yieldNode(e);
    else {
      this._tree = e.context.parent, this.buffer = e.context;
      for (let i = e._parent; i; i = i._parent)
        this.stack.unshift(i.index);
      this.bufferNode = e, this.yieldBuf(e.index);
    }
  }
  yieldNode(e) {
    return e ? (this._tree = e, this.type = e.type, this.from = e.from, this.to = e.to, !0) : !1;
  }
  yieldBuf(e, t) {
    this.index = e;
    let { start: i, buffer: s } = this.buffer;
    return this.type = t || s.set.types[s.buffer[e]], this.from = i + s.buffer[e + 1], this.to = i + s.buffer[e + 2], !0;
  }
  /**
  @internal
  */
  yield(e) {
    return e ? e instanceof ke ? (this.buffer = null, this.yieldNode(e)) : (this.buffer = e.context, this.yieldBuf(e.index, e.type)) : !1;
  }
  /**
  @internal
  */
  toString() {
    return this.buffer ? this.buffer.buffer.childString(this.index) : this._tree.toString();
  }
  /**
  @internal
  */
  enterChild(e, t, i) {
    if (!this.buffer)
      return this.yield(this._tree.nextChild(e < 0 ? this._tree._tree.children.length - 1 : 0, e, t, i, this.mode));
    let { buffer: s } = this.buffer, r = s.findChild(this.index + 4, s.buffer[this.index + 3], e, t - this.buffer.start, i);
    return r < 0 ? !1 : (this.stack.push(this.index), this.yieldBuf(r));
  }
  /**
  Move the cursor to this node's first child. When this returns
  false, the node has no child, and the cursor has not been moved.
  */
  firstChild() {
    return this.enterChild(
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  /**
  Move the cursor to this node's last child.
  */
  lastChild() {
    return this.enterChild(
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  /**
  Move the cursor to the first child that ends after `pos`.
  */
  childAfter(e) {
    return this.enterChild(
      1,
      e,
      2
      /* Side.After */
    );
  }
  /**
  Move to the last child that starts before `pos`.
  */
  childBefore(e) {
    return this.enterChild(
      -1,
      e,
      -2
      /* Side.Before */
    );
  }
  /**
  Move the cursor to the child around `pos`. If side is -1 the
  child may end at that position, when 1 it may start there. This
  will also enter [overlaid](#common.MountedTree.overlay)
  [mounted](#common.NodeProp^mounted) trees unless `overlays` is
  set to false.
  */
  enter(e, t, i = this.mode) {
    return this.buffer ? i & ie.ExcludeBuffers ? !1 : this.enterChild(1, e, t) : this.yield(this._tree.enter(e, t, i));
  }
  /**
  Move to the node's parent node, if this isn't the top node.
  */
  parent() {
    if (!this.buffer)
      return this.yieldNode(this.mode & ie.IncludeAnonymous ? this._tree._parent : this._tree.parent);
    if (this.stack.length)
      return this.yieldBuf(this.stack.pop());
    let e = this.mode & ie.IncludeAnonymous ? this.buffer.parent : this.buffer.parent.nextSignificantParent();
    return this.buffer = null, this.yieldNode(e);
  }
  /**
  @internal
  */
  sibling(e) {
    if (!this.buffer)
      return this._tree._parent ? this.yield(this._tree.index < 0 ? null : this._tree._parent.nextChild(this._tree.index + e, e, 0, 4, this.mode)) : !1;
    let { buffer: t } = this.buffer, i = this.stack.length - 1;
    if (e < 0) {
      let s = i < 0 ? 0 : this.stack[i] + 4;
      if (this.index != s)
        return this.yieldBuf(t.findChild(
          s,
          this.index,
          -1,
          0,
          4
          /* Side.DontCare */
        ));
    } else {
      let s = t.buffer[this.index + 3];
      if (s < (i < 0 ? t.buffer.length : t.buffer[this.stack[i] + 3]))
        return this.yieldBuf(s);
    }
    return i < 0 ? this.yield(this.buffer.parent.nextChild(this.buffer.index + e, e, 0, 4, this.mode)) : !1;
  }
  /**
  Move to this node's next sibling, if any.
  */
  nextSibling() {
    return this.sibling(1);
  }
  /**
  Move to this node's previous sibling, if any.
  */
  prevSibling() {
    return this.sibling(-1);
  }
  atLastNode(e) {
    let t, i, { buffer: s } = this;
    if (s) {
      if (e > 0) {
        if (this.index < s.buffer.buffer.length)
          return !1;
      } else
        for (let r = 0; r < this.index; r++)
          if (s.buffer.buffer[r + 3] < this.index)
            return !1;
      ({ index: t, parent: i } = s);
    } else
      ({ index: t, _parent: i } = this._tree);
    for (; i; { index: t, _parent: i } = i)
      if (t > -1)
        for (let r = t + e, o = e < 0 ? -1 : i._tree.children.length; r != o; r += e) {
          let l = i._tree.children[r];
          if (this.mode & ie.IncludeAnonymous || l instanceof kt || !l.type.isAnonymous || Ur(l))
            return !1;
        }
    return !0;
  }
  move(e, t) {
    if (t && this.enterChild(
      e,
      0,
      4
      /* Side.DontCare */
    ))
      return !0;
    for (; ; ) {
      if (this.sibling(e))
        return !0;
      if (this.atLastNode(e) || !this.parent())
        return !1;
    }
  }
  /**
  Move to the next node in a
  [pre-order](https://en.wikipedia.org/wiki/Tree_traversal#Pre-order,_NLR)
  traversal, going from a node to its first child or, if the
  current node is empty or `enter` is false, its next sibling or
  the next sibling of the first parent node that has one.
  */
  next(e = !0) {
    return this.move(1, e);
  }
  /**
  Move to the next node in a last-to-first pre-order traveral. A
  node is followed by its last child or, if it has none, its
  previous sibling or the previous sibling of the first parent
  node that has one.
  */
  prev(e = !0) {
    return this.move(-1, e);
  }
  /**
  Move the cursor to the innermost node that covers `pos`. If
  `side` is -1, it will enter nodes that end at `pos`. If it is 1,
  it will enter nodes that start at `pos`.
  */
  moveTo(e, t = 0) {
    for (; (this.from == this.to || (t < 1 ? this.from >= e : this.from > e) || (t > -1 ? this.to <= e : this.to < e)) && this.parent(); )
      ;
    for (; this.enterChild(1, e, t); )
      ;
    return this;
  }
  /**
  Get a [syntax node](#common.SyntaxNode) at the cursor's current
  position.
  */
  get node() {
    if (!this.buffer)
      return this._tree;
    let e = this.bufferNode, t = null, i = 0;
    if (e && e.context == this.buffer)
      e:
        for (let s = this.index, r = this.stack.length; r >= 0; ) {
          for (let o = e; o; o = o._parent)
            if (o.index == s) {
              if (s == this.index)
                return o;
              t = o, i = r + 1;
              break e;
            }
          s = this.stack[--r];
        }
    for (let s = i; s < this.stack.length; s++)
      t = new Ke(this.buffer, t, this.stack[s]);
    return this.bufferNode = new Ke(this.buffer, t, this.index);
  }
  /**
  Get the [tree](#common.Tree) that represents the current node, if
  any. Will return null when the node is in a [tree
  buffer](#common.TreeBuffer).
  */
  get tree() {
    return this.buffer ? null : this._tree._tree;
  }
  /**
  Iterate over the current node and all its descendants, calling
  `enter` when entering a node and `leave`, if given, when leaving
  one. When `enter` returns `false`, any children of that node are
  skipped, and `leave` isn't called for it.
  */
  iterate(e, t) {
    for (let i = 0; ; ) {
      let s = !1;
      if (this.type.isAnonymous || e(this) !== !1) {
        if (this.firstChild()) {
          i++;
          continue;
        }
        this.type.isAnonymous || (s = !0);
      }
      for (; s && t && t(this), s = this.type.isAnonymous, !this.nextSibling(); ) {
        if (!i)
          return;
        this.parent(), i--, s = !0;
      }
    }
  }
  /**
  Test whether the current node matches a given context—a sequence
  of direct parent node names. Empty strings in the context array
  are treated as wildcards.
  */
  matchContext(e) {
    if (!this.buffer)
      return br(this.node, e);
    let { buffer: t } = this.buffer, { types: i } = t.set;
    for (let s = e.length - 1, r = this.stack.length - 1; s >= 0; r--) {
      if (r < 0)
        return br(this.node, e, s);
      let o = i[t.buffer[this.stack[r]]];
      if (!o.isAnonymous) {
        if (e[s] && e[s] != o.name)
          return !1;
        s--;
      }
    }
    return !0;
  }
}
function Ur(n) {
  return n.children.some((e) => e instanceof kt || !e.type.isAnonymous || Ur(e));
}
function ep(n) {
  var e;
  let { buffer: t, nodeSet: i, maxBufferLength: s = Ah, reused: r = [], minRepeatType: o = i.types.length } = n, l = Array.isArray(t) ? new qr(t, t.length) : t, a = i.types, h = 0, c = 0;
  function f(w, A, C, R, I, W) {
    let { id: L, start: B, end: V, size: Q } = l, G = c;
    for (; Q < 0; )
      if (l.next(), Q == -1) {
        let J = r[L];
        C.push(J), R.push(B - w);
        return;
      } else if (Q == -3) {
        h = L;
        return;
      } else if (Q == -4) {
        c = L;
        return;
      } else
        throw new RangeError(`Unrecognized record size: ${Q}`);
    let ye = a[L], be, Se, De = B - w;
    if (V - B <= s && (Se = m(l.pos - A, I))) {
      let J = new Uint16Array(Se.size - Se.skip), Re = l.pos - Se.size, Fe = J.length;
      for (; l.pos > Re; )
        Fe = y(Se.start, J, Fe);
      be = new kt(J, V - Se.start, i), De = Se.start - w;
    } else {
      let J = l.pos - Q;
      l.next();
      let Re = [], Fe = [], Ct = L >= o ? L : -1, Nt = 0, Fi = V;
      for (; l.pos > J; )
        Ct >= 0 && l.id == Ct && l.size >= 0 ? (l.end <= Fi - s && (p(Re, Fe, B, Nt, l.end, Fi, Ct, G), Nt = Re.length, Fi = l.end), l.next()) : W > 2500 ? u(B, J, Re, Fe) : f(B, J, Re, Fe, Ct, W + 1);
      if (Ct >= 0 && Nt > 0 && Nt < Re.length && p(Re, Fe, B, Nt, B, Fi, Ct, G), Re.reverse(), Fe.reverse(), Ct > -1 && Nt > 0) {
        let ao = d(ye);
        be = Xr(ye, Re, Fe, 0, Re.length, 0, V - B, ao, ao);
      } else
        be = g(ye, Re, Fe, V - B, G - V);
    }
    C.push(be), R.push(De);
  }
  function u(w, A, C, R) {
    let I = [], W = 0, L = -1;
    for (; l.pos > A; ) {
      let { id: B, start: V, end: Q, size: G } = l;
      if (G > 4)
        l.next();
      else {
        if (L > -1 && V < L)
          break;
        L < 0 && (L = Q - s), I.push(B, V, Q), W++, l.next();
      }
    }
    if (W) {
      let B = new Uint16Array(W * 4), V = I[I.length - 2];
      for (let Q = I.length - 3, G = 0; Q >= 0; Q -= 3)
        B[G++] = I[Q], B[G++] = I[Q + 1] - V, B[G++] = I[Q + 2] - V, B[G++] = G;
      C.push(new kt(B, I[2] - V, i)), R.push(V - w);
    }
  }
  function d(w) {
    return (A, C, R) => {
      let I = 0, W = A.length - 1, L, B;
      if (W >= 0 && (L = A[W]) instanceof Y) {
        if (!W && L.type == w && L.length == R)
          return L;
        (B = L.prop(N.lookAhead)) && (I = C[W] + L.length + B);
      }
      return g(w, A, C, R, I);
    };
  }
  function p(w, A, C, R, I, W, L, B) {
    let V = [], Q = [];
    for (; w.length > R; )
      V.push(w.pop()), Q.push(A.pop() + C - I);
    w.push(g(i.types[L], V, Q, W - I, B - W)), A.push(I - C);
  }
  function g(w, A, C, R, I = 0, W) {
    if (h) {
      let L = [N.contextHash, h];
      W = W ? [L].concat(W) : [L];
    }
    if (I > 25) {
      let L = [N.lookAhead, I];
      W = W ? [L].concat(W) : [L];
    }
    return new Y(w, A, C, R, W);
  }
  function m(w, A) {
    let C = l.fork(), R = 0, I = 0, W = 0, L = C.end - s, B = { size: 0, start: 0, skip: 0 };
    e:
      for (let V = C.pos - w; C.pos > V; ) {
        let Q = C.size;
        if (C.id == A && Q >= 0) {
          B.size = R, B.start = I, B.skip = W, W += 4, R += 4, C.next();
          continue;
        }
        let G = C.pos - Q;
        if (Q < 0 || G < V || C.start < L)
          break;
        let ye = C.id >= o ? 4 : 0, be = C.start;
        for (C.next(); C.pos > G; ) {
          if (C.size < 0)
            if (C.size == -3)
              ye += 4;
            else
              break e;
          else
            C.id >= o && (ye += 4);
          C.next();
        }
        I = be, R += Q, W += ye;
      }
    return (A < 0 || R == w) && (B.size = R, B.start = I, B.skip = W), B.size > 4 ? B : void 0;
  }
  function y(w, A, C) {
    let { id: R, start: I, end: W, size: L } = l;
    if (l.next(), L >= 0 && R < o) {
      let B = C;
      if (L > 4) {
        let V = l.pos - (L - 4);
        for (; l.pos > V; )
          C = y(w, A, C);
      }
      A[--C] = B, A[--C] = W - w, A[--C] = I - w, A[--C] = R;
    } else
      L == -3 ? h = R : L == -4 && (c = R);
    return C;
  }
  let k = [], v = [];
  for (; l.pos > 0; )
    f(n.start || 0, n.bufferStart || 0, k, v, -1, 0);
  let S = (e = n.length) !== null && e !== void 0 ? e : k.length ? v[0] + k[0].length : 0;
  return new Y(a[n.topID], k.reverse(), v.reverse(), S);
}
const ml = /* @__PURE__ */ new WeakMap();
function xn(n, e) {
  if (!n.isAnonymous || e instanceof kt || e.type != n)
    return 1;
  let t = ml.get(e);
  if (t == null) {
    t = 1;
    for (let i of e.children) {
      if (i.type != n || !(i instanceof Y)) {
        t = 1;
        break;
      }
      t += xn(n, i);
    }
    ml.set(e, t);
  }
  return t;
}
function Xr(n, e, t, i, s, r, o, l, a) {
  let h = 0;
  for (let p = i; p < s; p++)
    h += xn(n, e[p]);
  let c = Math.ceil(
    h * 1.5 / 8
    /* Balance.BranchFactor */
  ), f = [], u = [];
  function d(p, g, m, y, k) {
    for (let v = m; v < y; ) {
      let S = v, w = g[v], A = xn(n, p[v]);
      for (v++; v < y; v++) {
        let C = xn(n, p[v]);
        if (A + C >= c)
          break;
        A += C;
      }
      if (v == S + 1) {
        if (A > c) {
          let C = p[S];
          d(C.children, C.positions, 0, C.children.length, g[S] + k);
          continue;
        }
        f.push(p[S]);
      } else {
        let C = g[v - 1] + p[v - 1].length - w;
        f.push(Xr(n, p, g, S, v, w, C, null, a));
      }
      u.push(w + k - r);
    }
  }
  return d(e, t, i, s, 0), (l || a)(f, u, o);
}
class tp {
  constructor() {
    this.map = /* @__PURE__ */ new WeakMap();
  }
  setBuffer(e, t, i) {
    let s = this.map.get(e);
    s || this.map.set(e, s = /* @__PURE__ */ new Map()), s.set(t, i);
  }
  getBuffer(e, t) {
    let i = this.map.get(e);
    return i && i.get(t);
  }
  /**
  Set the value for this syntax node.
  */
  set(e, t) {
    e instanceof Ke ? this.setBuffer(e.context.buffer, e.index, t) : e instanceof ke && this.map.set(e.tree, t);
  }
  /**
  Retrieve value for this syntax node, if it exists in the map.
  */
  get(e) {
    return e instanceof Ke ? this.getBuffer(e.context.buffer, e.index) : e instanceof ke ? this.map.get(e.tree) : void 0;
  }
  /**
  Set the value for the node that a cursor currently points to.
  */
  cursorSet(e, t) {
    e.buffer ? this.setBuffer(e.buffer.buffer, e.index, t) : this.map.set(e.tree, t);
  }
  /**
  Retrieve the value for the node that a cursor currently points
  to.
  */
  cursorGet(e) {
    return e.buffer ? this.getBuffer(e.buffer.buffer, e.index) : this.map.get(e.tree);
  }
}
class Rt {
  /**
  Construct a tree fragment. You'll usually want to use
  [`addTree`](#common.TreeFragment^addTree) and
  [`applyChanges`](#common.TreeFragment^applyChanges) instead of
  calling this directly.
  */
  constructor(e, t, i, s, r = !1, o = !1) {
    this.from = e, this.to = t, this.tree = i, this.offset = s, this.open = (r ? 1 : 0) | (o ? 2 : 0);
  }
  /**
  Whether the start of the fragment represents the start of a
  parse, or the end of a change. (In the second case, it may not
  be safe to reuse some nodes at the start, depending on the
  parsing algorithm.)
  */
  get openStart() {
    return (this.open & 1) > 0;
  }
  /**
  Whether the end of the fragment represents the end of a
  full-document parse, or the start of a change.
  */
  get openEnd() {
    return (this.open & 2) > 0;
  }
  /**
  Create a set of fragments from a freshly parsed tree, or update
  an existing set of fragments by replacing the ones that overlap
  with a tree with content from the new tree. When `partial` is
  true, the parse is treated as incomplete, and the resulting
  fragment has [`openEnd`](#common.TreeFragment.openEnd) set to
  true.
  */
  static addTree(e, t = [], i = !1) {
    let s = [new Rt(0, e.length, e, 0, !1, i)];
    for (let r of t)
      r.to > e.length && s.push(r);
    return s;
  }
  /**
  Apply a set of edits to an array of fragments, removing or
  splitting fragments as necessary to remove edited ranges, and
  adjusting offsets for fragments that moved.
  */
  static applyChanges(e, t, i = 128) {
    if (!t.length)
      return e;
    let s = [], r = 1, o = e.length ? e[0] : null;
    for (let l = 0, a = 0, h = 0; ; l++) {
      let c = l < t.length ? t[l] : null, f = c ? c.fromA : 1e9;
      if (f - a >= i)
        for (; o && o.from < f; ) {
          let u = o;
          if (a >= u.from || f <= u.to || h) {
            let d = Math.max(u.from, a) - h, p = Math.min(u.to, f) - h;
            u = d >= p ? null : new Rt(d, p, u.tree, u.offset + h, l > 0, !!c);
          }
          if (u && s.push(u), o.to > f)
            break;
          o = r < e.length ? e[r++] : null;
        }
      if (!c)
        break;
      a = c.toA, h = c.toA - c.toB;
    }
    return s;
  }
}
class Dh {
  /**
  Start a parse, returning a [partial parse](#common.PartialParse)
  object. [`fragments`](#common.TreeFragment) can be passed in to
  make the parse incremental.
  
  By default, the entire input is parsed. You can pass `ranges`,
  which should be a sorted array of non-empty, non-overlapping
  ranges, to parse only those ranges. The tree returned in that
  case will start at `ranges[0].from`.
  */
  startParse(e, t, i) {
    return typeof e == "string" && (e = new ip(e)), i = i ? i.length ? i.map((s) => new ks(s.from, s.to)) : [new ks(0, 0)] : [new ks(0, e.length)], this.createParse(e, t || [], i);
  }
  /**
  Run a full parse, returning the resulting tree.
  */
  parse(e, t, i) {
    let s = this.startParse(e, t, i);
    for (; ; ) {
      let r = s.advance();
      if (r)
        return r;
    }
  }
}
class ip {
  constructor(e) {
    this.string = e;
  }
  get length() {
    return this.string.length;
  }
  chunk(e) {
    return this.string.slice(e);
  }
  get lineChunks() {
    return !1;
  }
  read(e, t) {
    return this.string.slice(e, t);
  }
}
new N({ perNode: !0 });
let np = 0;
class Xe {
  /**
  @internal
  */
  constructor(e, t, i) {
    this.set = e, this.base = t, this.modified = i, this.id = np++;
  }
  /**
  Define a new tag. If `parent` is given, the tag is treated as a
  sub-tag of that parent, and
  [highlighters](#highlight.tagHighlighter) that don't mention
  this tag will try to fall back to the parent tag (or grandparent
  tag, etc).
  */
  static define(e) {
    if (e != null && e.base)
      throw new Error("Can not derive from a modified tag");
    let t = new Xe([], null, []);
    if (t.set.push(t), e)
      for (let i of e.set)
        t.set.push(i);
    return t;
  }
  /**
  Define a tag _modifier_, which is a function that, given a tag,
  will return a tag that is a subtag of the original. Applying the
  same modifier to a twice tag will return the same value (`m1(t1)
  == m1(t1)`) and applying multiple modifiers will, regardless or
  order, produce the same tag (`m1(m2(t1)) == m2(m1(t1))`).
  
  When multiple modifiers are applied to a given base tag, each
  smaller set of modifiers is registered as a parent, so that for
  example `m1(m2(m3(t1)))` is a subtype of `m1(m2(t1))`,
  `m1(m3(t1)`, and so on.
  */
  static defineModifier() {
    let e = new Dn();
    return (t) => t.modified.indexOf(e) > -1 ? t : Dn.get(t.base || t, t.modified.concat(e).sort((i, s) => i.id - s.id));
  }
}
let sp = 0;
class Dn {
  constructor() {
    this.instances = [], this.id = sp++;
  }
  static get(e, t) {
    if (!t.length)
      return e;
    let i = t[0].instances.find((l) => l.base == e && rp(t, l.modified));
    if (i)
      return i;
    let s = [], r = new Xe(s, e, t);
    for (let l of t)
      l.instances.push(r);
    let o = op(t);
    for (let l of e.set)
      if (!l.modified.length)
        for (let a of o)
          s.push(Dn.get(l, a));
    return r;
  }
}
function rp(n, e) {
  return n.length == e.length && n.every((t, i) => t == e[i]);
}
function op(n) {
  let e = [[]];
  for (let t = 0; t < n.length; t++)
    for (let i = 0, s = e.length; i < s; i++)
      e.push(e[i].concat(n[t]));
  return e.sort((t, i) => i.length - t.length);
}
function Rh(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n) {
    let i = n[t];
    Array.isArray(i) || (i = [i]);
    for (let s of t.split(" "))
      if (s) {
        let r = [], o = 2, l = s;
        for (let f = 0; ; ) {
          if (l == "..." && f > 0 && f + 3 == s.length) {
            o = 1;
            break;
          }
          let u = /^"(?:[^"\\]|\\.)*?"|[^\/!]+/.exec(l);
          if (!u)
            throw new RangeError("Invalid path: " + s);
          if (r.push(u[0] == "*" ? "" : u[0][0] == '"' ? JSON.parse(u[0]) : u[0]), f += u[0].length, f == s.length)
            break;
          let d = s[f++];
          if (f == s.length && d == "!") {
            o = 0;
            break;
          }
          if (d != "/")
            throw new RangeError("Invalid path: " + s);
          l = s.slice(f);
        }
        let a = r.length - 1, h = r[a];
        if (!h)
          throw new RangeError("Invalid path: " + s);
        let c = new Rn(i, o, a > 0 ? r.slice(0, a) : null);
        e[h] = c.sort(e[h]);
      }
  }
  return Bh.add(e);
}
const Bh = new N();
class Rn {
  constructor(e, t, i, s) {
    this.tags = e, this.mode = t, this.context = i, this.next = s;
  }
  get opaque() {
    return this.mode == 0;
  }
  get inherit() {
    return this.mode == 1;
  }
  sort(e) {
    return !e || e.depth < this.depth ? (this.next = e, this) : (e.next = this.sort(e.next), e);
  }
  get depth() {
    return this.context ? this.context.length : 0;
  }
}
Rn.empty = new Rn([], 2, null);
function Eh(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let r of n)
    if (!Array.isArray(r.tag))
      t[r.tag.id] = r.class;
    else
      for (let o of r.tag)
        t[o.id] = r.class;
  let { scope: i, all: s = null } = e || {};
  return {
    style: (r) => {
      let o = s;
      for (let l of r)
        for (let a of l.set) {
          let h = t[a.id];
          if (h) {
            o = o ? o + " " + h : h;
            break;
          }
        }
      return o;
    },
    scope: i
  };
}
function lp(n, e) {
  let t = null;
  for (let i of n) {
    let s = i.style(e);
    s && (t = t ? t + " " + s : s);
  }
  return t;
}
function ap(n, e, t, i = 0, s = n.length) {
  let r = new hp(i, Array.isArray(e) ? e : [e], t);
  r.highlightRange(n.cursor(), i, s, "", r.highlighters), r.flush(s);
}
class hp {
  constructor(e, t, i) {
    this.at = e, this.highlighters = t, this.span = i, this.class = "";
  }
  startSpan(e, t) {
    t != this.class && (this.flush(e), e > this.at && (this.at = e), this.class = t);
  }
  flush(e) {
    e > this.at && this.class && this.span(this.at, e, this.class);
  }
  highlightRange(e, t, i, s, r) {
    let { type: o, from: l, to: a } = e;
    if (l >= i || a <= t)
      return;
    o.isTop && (r = this.highlighters.filter((d) => !d.scope || d.scope(o)));
    let h = s, c = cp(e) || Rn.empty, f = lp(r, c.tags);
    if (f && (h && (h += " "), h += f, c.mode == 1 && (s += (s ? " " : "") + f)), this.startSpan(Math.max(t, l), h), c.opaque)
      return;
    let u = e.tree && e.tree.prop(N.mounted);
    if (u && u.overlay) {
      let d = e.node.enter(u.overlay[0].from + l, 1), p = this.highlighters.filter((m) => !m.scope || m.scope(u.tree.type)), g = e.firstChild();
      for (let m = 0, y = l; ; m++) {
        let k = m < u.overlay.length ? u.overlay[m] : null, v = k ? k.from + l : a, S = Math.max(t, y), w = Math.min(i, v);
        if (S < w && g)
          for (; e.from < w && (this.highlightRange(e, S, w, s, r), this.startSpan(Math.min(w, e.to), h), !(e.to >= v || !e.nextSibling())); )
            ;
        if (!k || v > i)
          break;
        y = k.to + l, y > t && (this.highlightRange(d.cursor(), Math.max(t, k.from + l), Math.min(i, y), "", p), this.startSpan(Math.min(i, y), h));
      }
      g && e.parent();
    } else if (e.firstChild()) {
      u && (s = "");
      do
        if (!(e.to <= t)) {
          if (e.from >= i)
            break;
          this.highlightRange(e, t, i, s, r), this.startSpan(Math.min(i, e.to), h);
        }
      while (e.nextSibling());
      e.parent();
    }
  }
}
function cp(n) {
  let e = n.type.prop(Bh);
  for (; e && e.context && !n.matchContext(e.context); )
    e = e.next;
  return e || null;
}
const O = Xe.define, nn = O(), at = O(), gl = O(at), yl = O(at), ht = O(), sn = O(ht), Os = O(ht), Ue = O(), At = O(Ue), He = O(), qe = O(), wr = O(), li = O(wr), rn = O(), x = {
  /**
  A comment.
  */
  comment: nn,
  /**
  A line [comment](#highlight.tags.comment).
  */
  lineComment: O(nn),
  /**
  A block [comment](#highlight.tags.comment).
  */
  blockComment: O(nn),
  /**
  A documentation [comment](#highlight.tags.comment).
  */
  docComment: O(nn),
  /**
  Any kind of identifier.
  */
  name: at,
  /**
  The [name](#highlight.tags.name) of a variable.
  */
  variableName: O(at),
  /**
  A type [name](#highlight.tags.name).
  */
  typeName: gl,
  /**
  A tag name (subtag of [`typeName`](#highlight.tags.typeName)).
  */
  tagName: O(gl),
  /**
  A property or field [name](#highlight.tags.name).
  */
  propertyName: yl,
  /**
  An attribute name (subtag of [`propertyName`](#highlight.tags.propertyName)).
  */
  attributeName: O(yl),
  /**
  The [name](#highlight.tags.name) of a class.
  */
  className: O(at),
  /**
  A label [name](#highlight.tags.name).
  */
  labelName: O(at),
  /**
  A namespace [name](#highlight.tags.name).
  */
  namespace: O(at),
  /**
  The [name](#highlight.tags.name) of a macro.
  */
  macroName: O(at),
  /**
  A literal value.
  */
  literal: ht,
  /**
  A string [literal](#highlight.tags.literal).
  */
  string: sn,
  /**
  A documentation [string](#highlight.tags.string).
  */
  docString: O(sn),
  /**
  A character literal (subtag of [string](#highlight.tags.string)).
  */
  character: O(sn),
  /**
  An attribute value (subtag of [string](#highlight.tags.string)).
  */
  attributeValue: O(sn),
  /**
  A number [literal](#highlight.tags.literal).
  */
  number: Os,
  /**
  An integer [number](#highlight.tags.number) literal.
  */
  integer: O(Os),
  /**
  A floating-point [number](#highlight.tags.number) literal.
  */
  float: O(Os),
  /**
  A boolean [literal](#highlight.tags.literal).
  */
  bool: O(ht),
  /**
  Regular expression [literal](#highlight.tags.literal).
  */
  regexp: O(ht),
  /**
  An escape [literal](#highlight.tags.literal), for example a
  backslash escape in a string.
  */
  escape: O(ht),
  /**
  A color [literal](#highlight.tags.literal).
  */
  color: O(ht),
  /**
  A URL [literal](#highlight.tags.literal).
  */
  url: O(ht),
  /**
  A language keyword.
  */
  keyword: He,
  /**
  The [keyword](#highlight.tags.keyword) for the self or this
  object.
  */
  self: O(He),
  /**
  The [keyword](#highlight.tags.keyword) for null.
  */
  null: O(He),
  /**
  A [keyword](#highlight.tags.keyword) denoting some atomic value.
  */
  atom: O(He),
  /**
  A [keyword](#highlight.tags.keyword) that represents a unit.
  */
  unit: O(He),
  /**
  A modifier [keyword](#highlight.tags.keyword).
  */
  modifier: O(He),
  /**
  A [keyword](#highlight.tags.keyword) that acts as an operator.
  */
  operatorKeyword: O(He),
  /**
  A control-flow related [keyword](#highlight.tags.keyword).
  */
  controlKeyword: O(He),
  /**
  A [keyword](#highlight.tags.keyword) that defines something.
  */
  definitionKeyword: O(He),
  /**
  A [keyword](#highlight.tags.keyword) related to defining or
  interfacing with modules.
  */
  moduleKeyword: O(He),
  /**
  An operator.
  */
  operator: qe,
  /**
  An [operator](#highlight.tags.operator) that dereferences something.
  */
  derefOperator: O(qe),
  /**
  Arithmetic-related [operator](#highlight.tags.operator).
  */
  arithmeticOperator: O(qe),
  /**
  Logical [operator](#highlight.tags.operator).
  */
  logicOperator: O(qe),
  /**
  Bit [operator](#highlight.tags.operator).
  */
  bitwiseOperator: O(qe),
  /**
  Comparison [operator](#highlight.tags.operator).
  */
  compareOperator: O(qe),
  /**
  [Operator](#highlight.tags.operator) that updates its operand.
  */
  updateOperator: O(qe),
  /**
  [Operator](#highlight.tags.operator) that defines something.
  */
  definitionOperator: O(qe),
  /**
  Type-related [operator](#highlight.tags.operator).
  */
  typeOperator: O(qe),
  /**
  Control-flow [operator](#highlight.tags.operator).
  */
  controlOperator: O(qe),
  /**
  Program or markup punctuation.
  */
  punctuation: wr,
  /**
  [Punctuation](#highlight.tags.punctuation) that separates
  things.
  */
  separator: O(wr),
  /**
  Bracket-style [punctuation](#highlight.tags.punctuation).
  */
  bracket: li,
  /**
  Angle [brackets](#highlight.tags.bracket) (usually `<` and `>`
  tokens).
  */
  angleBracket: O(li),
  /**
  Square [brackets](#highlight.tags.bracket) (usually `[` and `]`
  tokens).
  */
  squareBracket: O(li),
  /**
  Parentheses (usually `(` and `)` tokens). Subtag of
  [bracket](#highlight.tags.bracket).
  */
  paren: O(li),
  /**
  Braces (usually `{` and `}` tokens). Subtag of
  [bracket](#highlight.tags.bracket).
  */
  brace: O(li),
  /**
  Content, for example plain text in XML or markup documents.
  */
  content: Ue,
  /**
  [Content](#highlight.tags.content) that represents a heading.
  */
  heading: At,
  /**
  A level 1 [heading](#highlight.tags.heading).
  */
  heading1: O(At),
  /**
  A level 2 [heading](#highlight.tags.heading).
  */
  heading2: O(At),
  /**
  A level 3 [heading](#highlight.tags.heading).
  */
  heading3: O(At),
  /**
  A level 4 [heading](#highlight.tags.heading).
  */
  heading4: O(At),
  /**
  A level 5 [heading](#highlight.tags.heading).
  */
  heading5: O(At),
  /**
  A level 6 [heading](#highlight.tags.heading).
  */
  heading6: O(At),
  /**
  A prose separator (such as a horizontal rule).
  */
  contentSeparator: O(Ue),
  /**
  [Content](#highlight.tags.content) that represents a list.
  */
  list: O(Ue),
  /**
  [Content](#highlight.tags.content) that represents a quote.
  */
  quote: O(Ue),
  /**
  [Content](#highlight.tags.content) that is emphasized.
  */
  emphasis: O(Ue),
  /**
  [Content](#highlight.tags.content) that is styled strong.
  */
  strong: O(Ue),
  /**
  [Content](#highlight.tags.content) that is part of a link.
  */
  link: O(Ue),
  /**
  [Content](#highlight.tags.content) that is styled as code or
  monospace.
  */
  monospace: O(Ue),
  /**
  [Content](#highlight.tags.content) that has a strike-through
  style.
  */
  strikethrough: O(Ue),
  /**
  Inserted text in a change-tracking format.
  */
  inserted: O(),
  /**
  Deleted text.
  */
  deleted: O(),
  /**
  Changed text.
  */
  changed: O(),
  /**
  An invalid or unsyntactic element.
  */
  invalid: O(),
  /**
  Metadata or meta-instruction.
  */
  meta: rn,
  /**
  [Metadata](#highlight.tags.meta) that applies to the entire
  document.
  */
  documentMeta: O(rn),
  /**
  [Metadata](#highlight.tags.meta) that annotates or adds
  attributes to a given syntactic element.
  */
  annotation: O(rn),
  /**
  Processing instruction or preprocessor directive. Subtag of
  [meta](#highlight.tags.meta).
  */
  processingInstruction: O(rn),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates that a
  given element is being defined. Expected to be used with the
  various [name](#highlight.tags.name) tags.
  */
  definition: Xe.defineModifier(),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates that
  something is constant. Mostly expected to be used with
  [variable names](#highlight.tags.variableName).
  */
  constant: Xe.defineModifier(),
  /**
  [Modifier](#highlight.Tag^defineModifier) used to indicate that
  a [variable](#highlight.tags.variableName) or [property
  name](#highlight.tags.propertyName) is being called or defined
  as a function.
  */
  function: Xe.defineModifier(),
  /**
  [Modifier](#highlight.Tag^defineModifier) that can be applied to
  [names](#highlight.tags.name) to indicate that they belong to
  the language's standard environment.
  */
  standard: Xe.defineModifier(),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates a given
  [names](#highlight.tags.name) is local to some scope.
  */
  local: Xe.defineModifier(),
  /**
  A generic variant [modifier](#highlight.Tag^defineModifier) that
  can be used to tag language-specific alternative variants of
  some common tag. It is recommended for themes to define special
  forms of at least the [string](#highlight.tags.string) and
  [variable name](#highlight.tags.variableName) tags, since those
  come up a lot.
  */
  special: Xe.defineModifier()
};
Eh([
  { tag: x.link, class: "tok-link" },
  { tag: x.heading, class: "tok-heading" },
  { tag: x.emphasis, class: "tok-emphasis" },
  { tag: x.strong, class: "tok-strong" },
  { tag: x.keyword, class: "tok-keyword" },
  { tag: x.atom, class: "tok-atom" },
  { tag: x.bool, class: "tok-bool" },
  { tag: x.url, class: "tok-url" },
  { tag: x.labelName, class: "tok-labelName" },
  { tag: x.inserted, class: "tok-inserted" },
  { tag: x.deleted, class: "tok-deleted" },
  { tag: x.literal, class: "tok-literal" },
  { tag: x.string, class: "tok-string" },
  { tag: x.number, class: "tok-number" },
  { tag: [x.regexp, x.escape, x.special(x.string)], class: "tok-string2" },
  { tag: x.variableName, class: "tok-variableName" },
  { tag: x.local(x.variableName), class: "tok-variableName tok-local" },
  { tag: x.definition(x.variableName), class: "tok-variableName tok-definition" },
  { tag: x.special(x.variableName), class: "tok-variableName2" },
  { tag: x.definition(x.propertyName), class: "tok-propertyName tok-definition" },
  { tag: x.typeName, class: "tok-typeName" },
  { tag: x.namespace, class: "tok-namespace" },
  { tag: x.className, class: "tok-className" },
  { tag: x.macroName, class: "tok-macroName" },
  { tag: x.propertyName, class: "tok-propertyName" },
  { tag: x.operator, class: "tok-operator" },
  { tag: x.comment, class: "tok-comment" },
  { tag: x.meta, class: "tok-meta" },
  { tag: x.invalid, class: "tok-invalid" },
  { tag: x.punctuation, class: "tok-punctuation" }
]);
var Ss;
const zt = /* @__PURE__ */ new N();
function fp(n) {
  return M.define({
    combine: n ? (e) => e.concat(n) : void 0
  });
}
const up = /* @__PURE__ */ new N();
class We {
  /**
  Construct a language object. If you need to invoke this
  directly, first define a data facet with
  [`defineLanguageFacet`](https://codemirror.net/6/docs/ref/#language.defineLanguageFacet), and then
  configure your parser to [attach](https://codemirror.net/6/docs/ref/#language.languageDataProp) it
  to the language's outer syntax node.
  */
  constructor(e, t, i = [], s = "") {
    this.data = e, this.name = s, $.prototype.hasOwnProperty("tree") || Object.defineProperty($.prototype, "tree", { get() {
      return ae(this);
    } }), this.parser = t, this.extension = [
      Ot.of(this),
      $.languageData.of((r, o, l) => {
        let a = bl(r, o, l), h = a.type.prop(zt);
        if (!h)
          return [];
        let c = r.facet(h), f = a.type.prop(up);
        if (f) {
          let u = a.resolve(o - a.from, l);
          for (let d of f)
            if (d.test(u, r)) {
              let p = r.facet(d.facet);
              return d.type == "replace" ? p : p.concat(c);
            }
        }
        return c;
      })
    ].concat(i);
  }
  /**
  Query whether this language is active at the given position.
  */
  isActiveAt(e, t, i = -1) {
    return bl(e, t, i).type.prop(zt) == this.data;
  }
  /**
  Find the document regions that were parsed using this language.
  The returned regions will _include_ any nested languages rooted
  in this language, when those exist.
  */
  findRegions(e) {
    let t = e.facet(Ot);
    if ((t == null ? void 0 : t.data) == this.data)
      return [{ from: 0, to: e.doc.length }];
    if (!t || !t.allowsNesting)
      return [];
    let i = [], s = (r, o) => {
      if (r.prop(zt) == this.data) {
        i.push({ from: o, to: o + r.length });
        return;
      }
      let l = r.prop(N.mounted);
      if (l) {
        if (l.tree.prop(zt) == this.data) {
          if (l.overlay)
            for (let a of l.overlay)
              i.push({ from: a.from + o, to: a.to + o });
          else
            i.push({ from: o, to: o + r.length });
          return;
        } else if (l.overlay) {
          let a = i.length;
          if (s(l.tree, l.overlay[0].from + o), i.length > a)
            return;
        }
      }
      for (let a = 0; a < r.children.length; a++) {
        let h = r.children[a];
        h instanceof Y && s(h, r.positions[a] + o);
      }
    };
    return s(ae(e), 0), i;
  }
  /**
  Indicates whether this language allows nested languages. The
  default implementation returns true.
  */
  get allowsNesting() {
    return !0;
  }
}
We.setState = /* @__PURE__ */ E.define();
function bl(n, e, t) {
  let i = n.facet(Ot), s = ae(n).topNode;
  if (!i || i.allowsNesting)
    for (let r = s; r; r = r.enter(e, t, ie.ExcludeBuffers))
      r.type.isTop && (s = r);
  return s;
}
class Bn extends We {
  constructor(e, t, i) {
    super(e, t, [], i), this.parser = t;
  }
  /**
  Define a language from a parser.
  */
  static define(e) {
    let t = fp(e.languageData);
    return new Bn(t, e.parser.configure({
      props: [zt.add((i) => i.isTop ? t : void 0)]
    }), e.name);
  }
  /**
  Create a new instance of this language with a reconfigured
  version of its parser and optionally a new name.
  */
  configure(e, t) {
    return new Bn(this.data, this.parser.configure(e), t || this.name);
  }
  get allowsNesting() {
    return this.parser.hasWrappers();
  }
}
function ae(n) {
  let e = n.field(We.state, !1);
  return e ? e.tree : Y.empty;
}
class dp {
  /**
  Create an input object for the given document.
  */
  constructor(e) {
    this.doc = e, this.cursorPos = 0, this.string = "", this.cursor = e.iter();
  }
  get length() {
    return this.doc.length;
  }
  syncTo(e) {
    return this.string = this.cursor.next(e - this.cursorPos).value, this.cursorPos = e + this.string.length, this.cursorPos - this.string.length;
  }
  chunk(e) {
    return this.syncTo(e), this.string;
  }
  get lineChunks() {
    return !0;
  }
  read(e, t) {
    let i = this.cursorPos - this.string.length;
    return e < i || t >= this.cursorPos ? this.doc.sliceString(e, t) : this.string.slice(e - i, t - i);
  }
}
let ai = null;
class En {
  constructor(e, t, i = [], s, r, o, l, a) {
    this.parser = e, this.state = t, this.fragments = i, this.tree = s, this.treeLen = r, this.viewport = o, this.skipped = l, this.scheduleOn = a, this.parse = null, this.tempSkipped = [];
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new En(e, t, [], Y.empty, 0, i, [], null);
  }
  startParse() {
    return this.parser.startParse(new dp(this.state.doc), this.fragments);
  }
  /**
  @internal
  */
  work(e, t) {
    return t != null && t >= this.state.doc.length && (t = void 0), this.tree != Y.empty && this.isDone(t ?? this.state.doc.length) ? (this.takeTree(), !0) : this.withContext(() => {
      var i;
      if (typeof e == "number") {
        let s = Date.now() + e;
        e = () => Date.now() > s;
      }
      for (this.parse || (this.parse = this.startParse()), t != null && (this.parse.stoppedAt == null || this.parse.stoppedAt > t) && t < this.state.doc.length && this.parse.stopAt(t); ; ) {
        let s = this.parse.advance();
        if (s)
          if (this.fragments = this.withoutTempSkipped(Rt.addTree(s, this.fragments, this.parse.stoppedAt != null)), this.treeLen = (i = this.parse.stoppedAt) !== null && i !== void 0 ? i : this.state.doc.length, this.tree = s, this.parse = null, this.treeLen < (t ?? this.state.doc.length))
            this.parse = this.startParse();
          else
            return !0;
        if (e())
          return !1;
      }
    });
  }
  /**
  @internal
  */
  takeTree() {
    let e, t;
    this.parse && (e = this.parse.parsedPos) >= this.treeLen && ((this.parse.stoppedAt == null || this.parse.stoppedAt > e) && this.parse.stopAt(e), this.withContext(() => {
      for (; !(t = this.parse.advance()); )
        ;
    }), this.treeLen = e, this.tree = t, this.fragments = this.withoutTempSkipped(Rt.addTree(this.tree, this.fragments, !0)), this.parse = null);
  }
  withContext(e) {
    let t = ai;
    ai = this;
    try {
      return e();
    } finally {
      ai = t;
    }
  }
  withoutTempSkipped(e) {
    for (let t; t = this.tempSkipped.pop(); )
      e = xl(e, t.from, t.to);
    return e;
  }
  /**
  @internal
  */
  changes(e, t) {
    let { fragments: i, tree: s, treeLen: r, viewport: o, skipped: l } = this;
    if (this.takeTree(), !e.empty) {
      let a = [];
      if (e.iterChangedRanges((h, c, f, u) => a.push({ fromA: h, toA: c, fromB: f, toB: u })), i = Rt.applyChanges(i, a), s = Y.empty, r = 0, o = { from: e.mapPos(o.from, -1), to: e.mapPos(o.to, 1) }, this.skipped.length) {
        l = [];
        for (let h of this.skipped) {
          let c = e.mapPos(h.from, 1), f = e.mapPos(h.to, -1);
          c < f && l.push({ from: c, to: f });
        }
      }
    }
    return new En(this.parser, t, i, s, r, o, l, this.scheduleOn);
  }
  /**
  @internal
  */
  updateViewport(e) {
    if (this.viewport.from == e.from && this.viewport.to == e.to)
      return !1;
    this.viewport = e;
    let t = this.skipped.length;
    for (let i = 0; i < this.skipped.length; i++) {
      let { from: s, to: r } = this.skipped[i];
      s < e.to && r > e.from && (this.fragments = xl(this.fragments, s, r), this.skipped.splice(i--, 1));
    }
    return this.skipped.length >= t ? !1 : (this.reset(), !0);
  }
  /**
  @internal
  */
  reset() {
    this.parse && (this.takeTree(), this.parse = null);
  }
  /**
  Notify the parse scheduler that the given region was skipped
  because it wasn't in view, and the parse should be restarted
  when it comes into view.
  */
  skipUntilInView(e, t) {
    this.skipped.push({ from: e, to: t });
  }
  /**
  Returns a parser intended to be used as placeholder when
  asynchronously loading a nested parser. It'll skip its input and
  mark it as not-really-parsed, so that the next update will parse
  it again.
  
  When `until` is given, a reparse will be scheduled when that
  promise resolves.
  */
  static getSkippingParser(e) {
    return new class extends Dh {
      createParse(t, i, s) {
        let r = s[0].from, o = s[s.length - 1].to;
        return {
          parsedPos: r,
          advance() {
            let a = ai;
            if (a) {
              for (let h of s)
                a.tempSkipped.push(h);
              e && (a.scheduleOn = a.scheduleOn ? Promise.all([a.scheduleOn, e]) : e);
            }
            return this.parsedPos = o, new Y(Oe.none, [], [], o - r);
          },
          stoppedAt: null,
          stopAt() {
          }
        };
      }
    }();
  }
  /**
  @internal
  */
  isDone(e) {
    e = Math.min(e, this.state.doc.length);
    let t = this.fragments;
    return this.treeLen >= e && t.length && t[0].from == 0 && t[0].to >= e;
  }
  /**
  Get the context for the current parse, or `null` if no editor
  parse is in progress.
  */
  static get() {
    return ai;
  }
}
function xl(n, e, t) {
  return Rt.applyChanges(n, [{ fromA: e, toA: t, fromB: e, toB: t }]);
}
class Yt {
  constructor(e) {
    this.context = e, this.tree = e.tree;
  }
  apply(e) {
    if (!e.docChanged && this.tree == this.context.tree)
      return this;
    let t = this.context.changes(e.changes, e.state), i = this.context.treeLen == e.startState.doc.length ? void 0 : Math.max(e.changes.mapPos(this.context.treeLen), t.viewport.to);
    return t.work(20, i) || t.takeTree(), new Yt(t);
  }
  static init(e) {
    let t = Math.min(3e3, e.doc.length), i = En.create(e.facet(Ot).parser, e, { from: 0, to: t });
    return i.work(20, t) || i.takeTree(), new Yt(i);
  }
}
We.state = /* @__PURE__ */ he.define({
  create: Yt.init,
  update(n, e) {
    for (let t of e.effects)
      if (t.is(We.setState))
        return t.value;
    return e.startState.facet(Ot) != e.state.facet(Ot) ? Yt.init(e.state) : n.apply(e);
  }
});
let Lh = (n) => {
  let e = setTimeout(
    () => n(),
    500
    /* Work.MaxPause */
  );
  return () => clearTimeout(e);
};
typeof requestIdleCallback < "u" && (Lh = (n) => {
  let e = -1, t = setTimeout(
    () => {
      e = requestIdleCallback(n, {
        timeout: 400
        /* Work.MinPause */
      });
    },
    100
    /* Work.MinPause */
  );
  return () => e < 0 ? clearTimeout(t) : cancelIdleCallback(e);
});
const vs = typeof navigator < "u" && (!((Ss = navigator.scheduling) === null || Ss === void 0) && Ss.isInputPending) ? () => navigator.scheduling.isInputPending() : null, pp = /* @__PURE__ */ Z.fromClass(class {
  constructor(e) {
    this.view = e, this.working = null, this.workScheduled = 0, this.chunkEnd = -1, this.chunkBudget = -1, this.work = this.work.bind(this), this.scheduleWork();
  }
  update(e) {
    let t = this.view.state.field(We.state).context;
    (t.updateViewport(e.view.viewport) || this.view.viewport.to > t.treeLen) && this.scheduleWork(), (e.docChanged || e.selectionSet) && (this.view.hasFocus && (this.chunkBudget += 50), this.scheduleWork()), this.checkAsyncSchedule(t);
  }
  scheduleWork() {
    if (this.working)
      return;
    let { state: e } = this.view, t = e.field(We.state);
    (t.tree != t.context.tree || !t.context.isDone(e.doc.length)) && (this.working = Lh(this.work));
  }
  work(e) {
    this.working = null;
    let t = Date.now();
    if (this.chunkEnd < t && (this.chunkEnd < 0 || this.view.hasFocus) && (this.chunkEnd = t + 3e4, this.chunkBudget = 3e3), this.chunkBudget <= 0)
      return;
    let { state: i, viewport: { to: s } } = this.view, r = i.field(We.state);
    if (r.tree == r.context.tree && r.context.isDone(
      s + 1e5
      /* Work.MaxParseAhead */
    ))
      return;
    let o = Date.now() + Math.min(this.chunkBudget, 100, e && !vs ? Math.max(25, e.timeRemaining() - 5) : 1e9), l = r.context.treeLen < s && i.doc.length > s + 1e3, a = r.context.work(() => vs && vs() || Date.now() > o, s + (l ? 0 : 1e5));
    this.chunkBudget -= Date.now() - t, (a || this.chunkBudget <= 0) && (r.context.takeTree(), this.view.dispatch({ effects: We.setState.of(new Yt(r.context)) })), this.chunkBudget > 0 && !(a && !l) && this.scheduleWork(), this.checkAsyncSchedule(r.context);
  }
  checkAsyncSchedule(e) {
    e.scheduleOn && (this.workScheduled++, e.scheduleOn.then(() => this.scheduleWork()).catch((t) => Le(this.view.state, t)).then(() => this.workScheduled--), e.scheduleOn = null);
  }
  destroy() {
    this.working && this.working();
  }
  isWorking() {
    return !!(this.working || this.workScheduled > 0);
  }
}, {
  eventHandlers: { focus() {
    this.scheduleWork();
  } }
}), Ot = /* @__PURE__ */ M.define({
  combine(n) {
    return n.length ? n[0] : null;
  },
  enables: (n) => [
    We.state,
    pp,
    T.contentAttributes.compute([n], (e) => {
      let t = e.facet(n);
      return t && t.name ? { "data-language": t.name } : {};
    })
  ]
});
class mp {
  /**
  Create a language support object.
  */
  constructor(e, t = []) {
    this.language = e, this.support = t, this.extension = [e, t];
  }
}
const gp = /* @__PURE__ */ M.define(), jr = /* @__PURE__ */ M.define({
  combine: (n) => {
    if (!n.length)
      return "  ";
    let e = n[0];
    if (!e || /\S/.test(e) || Array.from(e).some((t) => t != e[0]))
      throw new Error("Invalid indent unit: " + JSON.stringify(n[0]));
    return e;
  }
});
function Ln(n) {
  let e = n.facet(jr);
  return e.charCodeAt(0) == 9 ? n.tabSize * e.length : e.length;
}
function Ri(n, e) {
  let t = "", i = n.tabSize, s = n.facet(jr)[0];
  if (s == "	") {
    for (; e >= i; )
      t += "	", e -= i;
    s = " ";
  }
  for (let r = 0; r < e; r++)
    t += s;
  return t;
}
function Gr(n, e) {
  n instanceof $ && (n = new es(n));
  for (let i of n.state.facet(gp)) {
    let s = i(n, e);
    if (s !== void 0)
      return s;
  }
  let t = ae(n.state);
  return t.length >= e ? yp(n, t, e) : null;
}
class es {
  /**
  Create an indent context.
  */
  constructor(e, t = {}) {
    this.state = e, this.options = t, this.unit = Ln(e);
  }
  /**
  Get a description of the line at the given position, taking
  [simulated line
  breaks](https://codemirror.net/6/docs/ref/#language.IndentContext.constructor^options.simulateBreak)
  into account. If there is such a break at `pos`, the `bias`
  argument determines whether the part of the line line before or
  after the break is used.
  */
  lineAt(e, t = 1) {
    let i = this.state.doc.lineAt(e), { simulateBreak: s, simulateDoubleBreak: r } = this.options;
    return s != null && s >= i.from && s <= i.to ? r && s == e ? { text: "", from: e } : (t < 0 ? s < e : s <= e) ? { text: i.text.slice(s - i.from), from: s } : { text: i.text.slice(0, s - i.from), from: i.from } : i;
  }
  /**
  Get the text directly after `pos`, either the entire line
  or the next 100 characters, whichever is shorter.
  */
  textAfterPos(e, t = 1) {
    if (this.options.simulateDoubleBreak && e == this.options.simulateBreak)
      return "";
    let { text: i, from: s } = this.lineAt(e, t);
    return i.slice(e - s, Math.min(i.length, e + 100 - s));
  }
  /**
  Find the column for the given position.
  */
  column(e, t = 1) {
    let { text: i, from: s } = this.lineAt(e, t), r = this.countColumn(i, e - s), o = this.options.overrideIndentation ? this.options.overrideIndentation(s) : -1;
    return o > -1 && (r += o - this.countColumn(i, i.search(/\S|$/))), r;
  }
  /**
  Find the column position (taking tabs into account) of the given
  position in the given string.
  */
  countColumn(e, t = e.length) {
    return ti(e, this.state.tabSize, t);
  }
  /**
  Find the indentation column of the line at the given point.
  */
  lineIndent(e, t = 1) {
    let { text: i, from: s } = this.lineAt(e, t), r = this.options.overrideIndentation;
    if (r) {
      let o = r(s);
      if (o > -1)
        return o;
    }
    return this.countColumn(i, i.search(/\S|$/));
  }
  /**
  Returns the [simulated line
  break](https://codemirror.net/6/docs/ref/#language.IndentContext.constructor^options.simulateBreak)
  for this context, if any.
  */
  get simulatedBreak() {
    return this.options.simulateBreak || null;
  }
}
const Nh = /* @__PURE__ */ new N();
function yp(n, e, t) {
  let i = e.resolveStack(t), s = i.node.enterUnfinishedNodesBefore(t);
  if (s != i.node) {
    let r = [];
    for (let o = s; o != i.node; o = o.parent)
      r.push(o);
    for (let o = r.length - 1; o >= 0; o--)
      i = { node: r[o], next: i };
  }
  return Ih(i, n, t);
}
function Ih(n, e, t) {
  for (let i = n; i; i = i.next) {
    let s = xp(i.node);
    if (s)
      return s(Kr.create(e, t, i));
  }
  return 0;
}
function bp(n) {
  return n.pos == n.options.simulateBreak && n.options.simulateDoubleBreak;
}
function xp(n) {
  let e = n.type.prop(Nh);
  if (e)
    return e;
  let t = n.firstChild, i;
  if (t && (i = t.type.prop(N.closedBy))) {
    let s = n.lastChild, r = s && i.indexOf(s.name) > -1;
    return (o) => Sp(o, !0, 1, void 0, r && !bp(o) ? s.from : void 0);
  }
  return n.parent == null ? wp : null;
}
function wp() {
  return 0;
}
class Kr extends es {
  constructor(e, t, i) {
    super(e.state, e.options), this.base = e, this.pos = t, this.context = i;
  }
  /**
  The syntax tree node to which the indentation strategy
  applies.
  */
  get node() {
    return this.context.node;
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new Kr(e, t, i);
  }
  /**
  Get the text directly after `this.pos`, either the entire line
  or the next 100 characters, whichever is shorter.
  */
  get textAfter() {
    return this.textAfterPos(this.pos);
  }
  /**
  Get the indentation at the reference line for `this.node`, which
  is the line on which it starts, unless there is a node that is
  _not_ a parent of this node covering the start of that line. If
  so, the line at the start of that node is tried, again skipping
  on if it is covered by another such node.
  */
  get baseIndent() {
    return this.baseIndentFor(this.node);
  }
  /**
  Get the indentation for the reference line of the given node
  (see [`baseIndent`](https://codemirror.net/6/docs/ref/#language.TreeIndentContext.baseIndent)).
  */
  baseIndentFor(e) {
    let t = this.state.doc.lineAt(e.from);
    for (; ; ) {
      let i = e.resolve(t.from);
      for (; i.parent && i.parent.from == i.from; )
        i = i.parent;
      if (kp(i, e))
        break;
      t = this.state.doc.lineAt(i.from);
    }
    return this.lineIndent(t.from);
  }
  /**
  Continue looking for indentations in the node's parent nodes,
  and return the result of that.
  */
  continue() {
    return Ih(this.context.next, this.base, this.pos);
  }
}
function kp(n, e) {
  for (let t = e; t; t = t.parent)
    if (n == t)
      return !0;
  return !1;
}
function Op(n) {
  let e = n.node, t = e.childAfter(e.from), i = e.lastChild;
  if (!t)
    return null;
  let s = n.options.simulateBreak, r = n.state.doc.lineAt(t.from), o = s == null || s <= r.from ? r.to : Math.min(r.to, s);
  for (let l = t.to; ; ) {
    let a = e.childAfter(l);
    if (!a || a == i)
      return null;
    if (!a.type.isSkipped)
      return a.from < o ? t : null;
    l = a.to;
  }
}
function Sp(n, e, t, i, s) {
  let r = n.textAfter, o = r.match(/^\s*/)[0].length, l = i && r.slice(o, o + i.length) == i || s == n.pos + o, a = e ? Op(n) : null;
  return a ? l ? n.column(a.from) : n.column(a.to) : n.baseIndent + (l ? 0 : n.unit * t);
}
function vp({ except: n, units: e = 1 } = {}) {
  return (t) => {
    let i = n && n.test(t.textAfter);
    return t.baseIndent + (i ? 0 : e * t.unit);
  };
}
const Cp = 200;
function Ap() {
  return $.transactionFilter.of((n) => {
    if (!n.docChanged || !n.isUserEvent("input.type") && !n.isUserEvent("input.complete"))
      return n;
    let e = n.startState.languageDataAt("indentOnInput", n.startState.selection.main.head);
    if (!e.length)
      return n;
    let t = n.newDoc, { head: i } = n.newSelection.main, s = t.lineAt(i);
    if (i > s.from + Cp)
      return n;
    let r = t.sliceString(s.from, i);
    if (!e.some((h) => h.test(r)))
      return n;
    let { state: o } = n, l = -1, a = [];
    for (let { head: h } of o.selection.ranges) {
      let c = o.doc.lineAt(h);
      if (c.from == l)
        continue;
      l = c.from;
      let f = Gr(o, c.from);
      if (f == null)
        continue;
      let u = /^\s*/.exec(c.text)[0], d = Ri(o, f);
      u != d && a.push({ from: c.from, to: c.from + u.length, insert: d });
    }
    return a.length ? [n, { changes: a, sequential: !0 }] : n;
  });
}
const Mp = /* @__PURE__ */ M.define(), Wh = /* @__PURE__ */ new N();
function Tp(n) {
  let e = n.firstChild, t = n.lastChild;
  return e && e.to < t.from ? { from: e.to, to: t.type.isError ? n.to : t.from } : null;
}
function Pp(n, e, t) {
  let i = ae(n);
  if (i.length < t)
    return null;
  let s = i.resolveStack(t, 1), r = null;
  for (let o = s; o; o = o.next) {
    let l = o.node;
    if (l.to <= t || l.from > t)
      continue;
    if (r && l.from < e)
      break;
    let a = l.type.prop(Wh);
    if (a && (l.to < i.length - 50 || i.length == n.doc.length || !Dp(l))) {
      let h = a(l, n);
      h && h.from <= t && h.from >= e && h.to > t && (r = h);
    }
  }
  return r;
}
function Dp(n) {
  let e = n.lastChild;
  return e && e.to == n.to && e.type.isError;
}
function Nn(n, e, t) {
  for (let i of n.facet(Mp)) {
    let s = i(n, e, t);
    if (s)
      return s;
  }
  return Pp(n, e, t);
}
function $h(n, e) {
  let t = e.mapPos(n.from, 1), i = e.mapPos(n.to, -1);
  return t >= i ? void 0 : { from: t, to: i };
}
const ts = /* @__PURE__ */ E.define({ map: $h }), $i = /* @__PURE__ */ E.define({ map: $h });
function Qh(n) {
  let e = [];
  for (let { head: t } of n.state.selection.ranges)
    e.some((i) => i.from <= t && i.to >= t) || e.push(n.lineBlockAt(t));
  return e;
}
const Lt = /* @__PURE__ */ he.define({
  create() {
    return D.none;
  },
  update(n, e) {
    n = n.map(e.changes);
    for (let t of e.effects)
      if (t.is(ts) && !Rp(n, t.value.from, t.value.to)) {
        let { preparePlaceholder: i } = e.state.facet(_r), s = i ? D.replace({ widget: new $p(i(e.state, t.value)) }) : wl;
        n = n.update({ add: [s.range(t.value.from, t.value.to)] });
      } else
        t.is($i) && (n = n.update({
          filter: (i, s) => t.value.from != i || t.value.to != s,
          filterFrom: t.value.from,
          filterTo: t.value.to
        }));
    if (e.selection) {
      let t = !1, { head: i } = e.selection.main;
      n.between(i, i, (s, r) => {
        s < i && r > i && (t = !0);
      }), t && (n = n.update({
        filterFrom: i,
        filterTo: i,
        filter: (s, r) => r <= i || s >= i
      }));
    }
    return n;
  },
  provide: (n) => T.decorations.from(n),
  toJSON(n, e) {
    let t = [];
    return n.between(0, e.doc.length, (i, s) => {
      t.push(i, s);
    }), t;
  },
  fromJSON(n) {
    if (!Array.isArray(n) || n.length % 2)
      throw new RangeError("Invalid JSON for fold state");
    let e = [];
    for (let t = 0; t < n.length; ) {
      let i = n[t++], s = n[t++];
      if (typeof i != "number" || typeof s != "number")
        throw new RangeError("Invalid JSON for fold state");
      e.push(wl.range(i, s));
    }
    return D.set(e, !0);
  }
});
function In(n, e, t) {
  var i;
  let s = null;
  return (i = n.field(Lt, !1)) === null || i === void 0 || i.between(e, t, (r, o) => {
    (!s || s.from > r) && (s = { from: r, to: o });
  }), s;
}
function Rp(n, e, t) {
  let i = !1;
  return n.between(e, e, (s, r) => {
    s == e && r == t && (i = !0);
  }), i;
}
function zh(n, e) {
  return n.field(Lt, !1) ? e : e.concat(E.appendConfig.of(Vh()));
}
const Bp = (n) => {
  for (let e of Qh(n)) {
    let t = Nn(n.state, e.from, e.to);
    if (t)
      return n.dispatch({ effects: zh(n.state, [ts.of(t), Fh(n, t)]) }), !0;
  }
  return !1;
}, Ep = (n) => {
  if (!n.state.field(Lt, !1))
    return !1;
  let e = [];
  for (let t of Qh(n)) {
    let i = In(n.state, t.from, t.to);
    i && e.push($i.of(i), Fh(n, i, !1));
  }
  return e.length && n.dispatch({ effects: e }), e.length > 0;
};
function Fh(n, e, t = !0) {
  let i = n.state.doc.lineAt(e.from).number, s = n.state.doc.lineAt(e.to).number;
  return T.announce.of(`${n.state.phrase(t ? "Folded lines" : "Unfolded lines")} ${i} ${n.state.phrase("to")} ${s}.`);
}
const Lp = (n) => {
  let { state: e } = n, t = [];
  for (let i = 0; i < e.doc.length; ) {
    let s = n.lineBlockAt(i), r = Nn(e, s.from, s.to);
    r && t.push(ts.of(r)), i = (r ? n.lineBlockAt(r.to) : s).to + 1;
  }
  return t.length && n.dispatch({ effects: zh(n.state, t) }), !!t.length;
}, Np = (n) => {
  let e = n.state.field(Lt, !1);
  if (!e || !e.size)
    return !1;
  let t = [];
  return e.between(0, n.state.doc.length, (i, s) => {
    t.push($i.of({ from: i, to: s }));
  }), n.dispatch({ effects: t }), !0;
}, Ip = [
  { key: "Ctrl-Shift-[", mac: "Cmd-Alt-[", run: Bp },
  { key: "Ctrl-Shift-]", mac: "Cmd-Alt-]", run: Ep },
  { key: "Ctrl-Alt-[", run: Lp },
  { key: "Ctrl-Alt-]", run: Np }
], Wp = {
  placeholderDOM: null,
  preparePlaceholder: null,
  placeholderText: "…"
}, _r = /* @__PURE__ */ M.define({
  combine(n) {
    return Je(n, Wp);
  }
});
function Vh(n) {
  let e = [Lt, Fp];
  return n && e.push(_r.of(n)), e;
}
function Hh(n, e) {
  let { state: t } = n, i = t.facet(_r), s = (o) => {
    let l = n.lineBlockAt(n.posAtDOM(o.target)), a = In(n.state, l.from, l.to);
    a && n.dispatch({ effects: $i.of(a) }), o.preventDefault();
  };
  if (i.placeholderDOM)
    return i.placeholderDOM(n, s, e);
  let r = document.createElement("span");
  return r.textContent = i.placeholderText, r.setAttribute("aria-label", t.phrase("folded code")), r.title = t.phrase("unfold"), r.className = "cm-foldPlaceholder", r.onclick = s, r;
}
const wl = /* @__PURE__ */ D.replace({ widget: /* @__PURE__ */ new class extends St {
  toDOM(n) {
    return Hh(n, null);
  }
}() });
class $p extends St {
  constructor(e) {
    super(), this.value = e;
  }
  eq(e) {
    return this.value == e.value;
  }
  toDOM(e) {
    return Hh(e, this.value);
  }
}
const Qp = {
  openText: "⌄",
  closedText: "›",
  markerDOM: null,
  domEventHandlers: {},
  foldingChanged: () => !1
};
class Cs extends rt {
  constructor(e, t) {
    super(), this.config = e, this.open = t;
  }
  eq(e) {
    return this.config == e.config && this.open == e.open;
  }
  toDOM(e) {
    if (this.config.markerDOM)
      return this.config.markerDOM(this.open);
    let t = document.createElement("span");
    return t.textContent = this.open ? this.config.openText : this.config.closedText, t.title = e.state.phrase(this.open ? "Fold line" : "Unfold line"), t;
  }
}
function zp(n = {}) {
  let e = Object.assign(Object.assign({}, Qp), n), t = new Cs(e, !0), i = new Cs(e, !1), s = Z.fromClass(class {
    constructor(o) {
      this.from = o.viewport.from, this.markers = this.buildMarkers(o);
    }
    update(o) {
      (o.docChanged || o.viewportChanged || o.startState.facet(Ot) != o.state.facet(Ot) || o.startState.field(Lt, !1) != o.state.field(Lt, !1) || ae(o.startState) != ae(o.state) || e.foldingChanged(o)) && (this.markers = this.buildMarkers(o.view));
    }
    buildMarkers(o) {
      let l = new yt();
      for (let a of o.viewportLineBlocks) {
        let h = In(o.state, a.from, a.to) ? i : Nn(o.state, a.from, a.to) ? t : null;
        h && l.add(a.from, a.from, h);
      }
      return l.finish();
    }
  }), { domEventHandlers: r } = e;
  return [
    s,
    Qd({
      class: "cm-foldGutter",
      markers(o) {
        var l;
        return ((l = o.plugin(s)) === null || l === void 0 ? void 0 : l.markers) || F.empty;
      },
      initialSpacer() {
        return new Cs(e, !1);
      },
      domEventHandlers: Object.assign(Object.assign({}, r), { click: (o, l, a) => {
        if (r.click && r.click(o, l, a))
          return !0;
        let h = In(o.state, l.from, l.to);
        if (h)
          return o.dispatch({ effects: $i.of(h) }), !0;
        let c = Nn(o.state, l.from, l.to);
        return c ? (o.dispatch({ effects: ts.of(c) }), !0) : !1;
      } })
    }),
    Vh()
  ];
}
const Fp = /* @__PURE__ */ T.baseTheme({
  ".cm-foldPlaceholder": {
    backgroundColor: "#eee",
    border: "1px solid #ddd",
    color: "#888",
    borderRadius: ".2em",
    margin: "0 1px",
    padding: "0 1px",
    cursor: "pointer"
  },
  ".cm-foldGutter span": {
    padding: "0 1px",
    cursor: "pointer"
  }
});
class is {
  constructor(e, t) {
    this.specs = e;
    let i;
    function s(l) {
      let a = bt.newName();
      return (i || (i = /* @__PURE__ */ Object.create(null)))["." + a] = l, a;
    }
    const r = typeof t.all == "string" ? t.all : t.all ? s(t.all) : void 0, o = t.scope;
    this.scope = o instanceof We ? (l) => l.prop(zt) == o.data : o ? (l) => l == o : void 0, this.style = Eh(e.map((l) => ({
      tag: l.tag,
      class: l.class || s(Object.assign({}, l, { tag: null }))
    })), {
      all: r
    }).style, this.module = i ? new bt(i) : null, this.themeType = t.themeType;
  }
  /**
  Create a highlighter style that associates the given styles to
  the given tags. The specs must be objects that hold a style tag
  or array of tags in their `tag` property, and either a single
  `class` property providing a static CSS class (for highlighter
  that rely on external styling), or a
  [`style-mod`](https://github.com/marijnh/style-mod#documentation)-style
  set of CSS properties (which define the styling for those tags).
  
  The CSS rules created for a highlighter will be emitted in the
  order of the spec's properties. That means that for elements that
  have multiple tags associated with them, styles defined further
  down in the list will have a higher CSS precedence than styles
  defined earlier.
  */
  static define(e, t) {
    return new is(e, t || {});
  }
}
const kr = /* @__PURE__ */ M.define(), qh = /* @__PURE__ */ M.define({
  combine(n) {
    return n.length ? [n[0]] : null;
  }
});
function As(n) {
  let e = n.facet(kr);
  return e.length ? e : n.facet(qh);
}
function Vp(n, e) {
  let t = [qp], i;
  return n instanceof is && (n.module && t.push(T.styleModule.of(n.module)), i = n.themeType), e != null && e.fallback ? t.push(qh.of(n)) : i ? t.push(kr.computeN([T.darkTheme], (s) => s.facet(T.darkTheme) == (i == "dark") ? [n] : [])) : t.push(kr.of(n)), t;
}
class Hp {
  constructor(e) {
    this.markCache = /* @__PURE__ */ Object.create(null), this.tree = ae(e.state), this.decorations = this.buildDeco(e, As(e.state));
  }
  update(e) {
    let t = ae(e.state), i = As(e.state), s = i != As(e.startState);
    t.length < e.view.viewport.to && !s && t.type == this.tree.type ? this.decorations = this.decorations.map(e.changes) : (t != this.tree || e.viewportChanged || s) && (this.tree = t, this.decorations = this.buildDeco(e.view, i));
  }
  buildDeco(e, t) {
    if (!t || !this.tree.length)
      return D.none;
    let i = new yt();
    for (let { from: s, to: r } of e.visibleRanges)
      ap(this.tree, t, (o, l, a) => {
        i.add(o, l, this.markCache[a] || (this.markCache[a] = D.mark({ class: a })));
      }, s, r);
    return i.finish();
  }
}
const qp = /* @__PURE__ */ ei.high(/* @__PURE__ */ Z.fromClass(Hp, {
  decorations: (n) => n.decorations
})), Up = /* @__PURE__ */ is.define([
  {
    tag: x.meta,
    color: "#404740"
  },
  {
    tag: x.link,
    textDecoration: "underline"
  },
  {
    tag: x.heading,
    textDecoration: "underline",
    fontWeight: "bold"
  },
  {
    tag: x.emphasis,
    fontStyle: "italic"
  },
  {
    tag: x.strong,
    fontWeight: "bold"
  },
  {
    tag: x.strikethrough,
    textDecoration: "line-through"
  },
  {
    tag: x.keyword,
    color: "#708"
  },
  {
    tag: [x.atom, x.bool, x.url, x.contentSeparator, x.labelName],
    color: "#219"
  },
  {
    tag: [x.literal, x.inserted],
    color: "#164"
  },
  {
    tag: [x.string, x.deleted],
    color: "#a11"
  },
  {
    tag: [x.regexp, x.escape, /* @__PURE__ */ x.special(x.string)],
    color: "#e40"
  },
  {
    tag: /* @__PURE__ */ x.definition(x.variableName),
    color: "#00f"
  },
  {
    tag: /* @__PURE__ */ x.local(x.variableName),
    color: "#30a"
  },
  {
    tag: [x.typeName, x.namespace],
    color: "#085"
  },
  {
    tag: x.className,
    color: "#167"
  },
  {
    tag: [/* @__PURE__ */ x.special(x.variableName), x.macroName],
    color: "#256"
  },
  {
    tag: /* @__PURE__ */ x.definition(x.propertyName),
    color: "#00c"
  },
  {
    tag: x.comment,
    color: "#940"
  },
  {
    tag: x.invalid,
    color: "#f00"
  }
]), Xp = /* @__PURE__ */ T.baseTheme({
  "&.cm-focused .cm-matchingBracket": { backgroundColor: "#328c8252" },
  "&.cm-focused .cm-nonmatchingBracket": { backgroundColor: "#bb555544" }
}), Uh = 1e4, Xh = "()[]{}", jh = /* @__PURE__ */ M.define({
  combine(n) {
    return Je(n, {
      afterCursor: !0,
      brackets: Xh,
      maxScanDistance: Uh,
      renderMatch: Kp
    });
  }
}), jp = /* @__PURE__ */ D.mark({ class: "cm-matchingBracket" }), Gp = /* @__PURE__ */ D.mark({ class: "cm-nonmatchingBracket" });
function Kp(n) {
  let e = [], t = n.matched ? jp : Gp;
  return e.push(t.range(n.start.from, n.start.to)), n.end && e.push(t.range(n.end.from, n.end.to)), e;
}
const _p = /* @__PURE__ */ he.define({
  create() {
    return D.none;
  },
  update(n, e) {
    if (!e.docChanged && !e.selection)
      return n;
    let t = [], i = e.state.facet(jh);
    for (let s of e.state.selection.ranges) {
      if (!s.empty)
        continue;
      let r = _e(e.state, s.head, -1, i) || s.head > 0 && _e(e.state, s.head - 1, 1, i) || i.afterCursor && (_e(e.state, s.head, 1, i) || s.head < e.state.doc.length && _e(e.state, s.head + 1, -1, i));
      r && (t = t.concat(i.renderMatch(r, e.state)));
    }
    return D.set(t, !0);
  },
  provide: (n) => T.decorations.from(n)
}), Yp = [
  _p,
  Xp
];
function Zp(n = {}) {
  return [jh.of(n), Yp];
}
const Jp = /* @__PURE__ */ new N();
function Or(n, e, t) {
  let i = n.prop(e < 0 ? N.openedBy : N.closedBy);
  if (i)
    return i;
  if (n.name.length == 1) {
    let s = t.indexOf(n.name);
    if (s > -1 && s % 2 == (e < 0 ? 1 : 0))
      return [t[s + e]];
  }
  return null;
}
function Sr(n) {
  let e = n.type.prop(Jp);
  return e ? e(n.node) : n;
}
function _e(n, e, t, i = {}) {
  let s = i.maxScanDistance || Uh, r = i.brackets || Xh, o = ae(n), l = o.resolveInner(e, t);
  for (let a = l; a; a = a.parent) {
    let h = Or(a.type, t, r);
    if (h && a.from < a.to) {
      let c = Sr(a);
      if (c && (t > 0 ? e >= c.from && e < c.to : e > c.from && e <= c.to))
        return em(n, e, t, a, c, h, r);
    }
  }
  return tm(n, e, t, o, l.type, s, r);
}
function em(n, e, t, i, s, r, o) {
  let l = i.parent, a = { from: s.from, to: s.to }, h = 0, c = l == null ? void 0 : l.cursor();
  if (c && (t < 0 ? c.childBefore(i.from) : c.childAfter(i.to)))
    do
      if (t < 0 ? c.to <= i.from : c.from >= i.to) {
        if (h == 0 && r.indexOf(c.type.name) > -1 && c.from < c.to) {
          let f = Sr(c);
          return { start: a, end: f ? { from: f.from, to: f.to } : void 0, matched: !0 };
        } else if (Or(c.type, t, o))
          h++;
        else if (Or(c.type, -t, o)) {
          if (h == 0) {
            let f = Sr(c);
            return {
              start: a,
              end: f && f.from < f.to ? { from: f.from, to: f.to } : void 0,
              matched: !1
            };
          }
          h--;
        }
      }
    while (t < 0 ? c.prevSibling() : c.nextSibling());
  return { start: a, matched: !1 };
}
function tm(n, e, t, i, s, r, o) {
  let l = t < 0 ? n.sliceDoc(e - 1, e) : n.sliceDoc(e, e + 1), a = o.indexOf(l);
  if (a < 0 || a % 2 == 0 != t > 0)
    return null;
  let h = { from: t < 0 ? e - 1 : e, to: t > 0 ? e + 1 : e }, c = n.doc.iterRange(e, t > 0 ? n.doc.length : 0), f = 0;
  for (let u = 0; !c.next().done && u <= r; ) {
    let d = c.value;
    t < 0 && (u += d.length);
    let p = e + u * t;
    for (let g = t > 0 ? 0 : d.length - 1, m = t > 0 ? d.length : -1; g != m; g += t) {
      let y = o.indexOf(d[g]);
      if (!(y < 0 || i.resolveInner(p + g, 1).type != s))
        if (y % 2 == 0 == t > 0)
          f++;
        else {
          if (f == 1)
            return { start: h, end: { from: p + g, to: p + g + 1 }, matched: y >> 1 == a >> 1 };
          f--;
        }
    }
    t > 0 && (u += d.length);
  }
  return c.done ? { start: h, matched: !1 } : null;
}
const im = /* @__PURE__ */ Object.create(null), kl = [Oe.none], Ol = [], Sl = /* @__PURE__ */ Object.create(null), nm = /* @__PURE__ */ Object.create(null);
for (let [n, e] of [
  ["variable", "variableName"],
  ["variable-2", "variableName.special"],
  ["string-2", "string.special"],
  ["def", "variableName.definition"],
  ["tag", "tagName"],
  ["attribute", "attributeName"],
  ["type", "typeName"],
  ["builtin", "variableName.standard"],
  ["qualifier", "modifier"],
  ["error", "invalid"],
  ["header", "heading"],
  ["property", "propertyName"]
])
  nm[n] = /* @__PURE__ */ sm(im, e);
function Ms(n, e) {
  Ol.indexOf(n) > -1 || (Ol.push(n), console.warn(e));
}
function sm(n, e) {
  let t = [];
  for (let l of e.split(" ")) {
    let a = [];
    for (let h of l.split(".")) {
      let c = n[h] || x[h];
      c ? typeof c == "function" ? a.length ? a = a.map(c) : Ms(h, `Modifier ${h} used at start of tag`) : a.length ? Ms(h, `Tag ${h} used as modifier`) : a = Array.isArray(c) ? c : [c] : Ms(h, `Unknown highlighting tag ${h}`);
    }
    for (let h of a)
      t.push(h);
  }
  if (!t.length)
    return 0;
  let i = e.replace(/ /g, "_"), s = i + " " + t.map((l) => l.id), r = Sl[s];
  if (r)
    return r.id;
  let o = Sl[s] = Oe.define({
    id: kl.length,
    name: i,
    props: [Rh({ [i]: t })]
  });
  return kl.push(o), o.id;
}
const rm = (n) => {
  let { state: e } = n, t = e.doc.lineAt(e.selection.main.from), i = Zr(n.state, t.from);
  return i.line ? om(n) : i.block ? am(n) : !1;
};
function Yr(n, e) {
  return ({ state: t, dispatch: i }) => {
    if (t.readOnly)
      return !1;
    let s = n(e, t);
    return s ? (i(t.update(s)), !0) : !1;
  };
}
const om = /* @__PURE__ */ Yr(
  fm,
  0
  /* CommentOption.Toggle */
), lm = /* @__PURE__ */ Yr(
  Gh,
  0
  /* CommentOption.Toggle */
), am = /* @__PURE__ */ Yr(
  (n, e) => Gh(n, e, cm(e)),
  0
  /* CommentOption.Toggle */
);
function Zr(n, e) {
  let t = n.languageDataAt("commentTokens", e);
  return t.length ? t[0] : {};
}
const hi = 50;
function hm(n, { open: e, close: t }, i, s) {
  let r = n.sliceDoc(i - hi, i), o = n.sliceDoc(s, s + hi), l = /\s*$/.exec(r)[0].length, a = /^\s*/.exec(o)[0].length, h = r.length - l;
  if (r.slice(h - e.length, h) == e && o.slice(a, a + t.length) == t)
    return {
      open: { pos: i - l, margin: l && 1 },
      close: { pos: s + a, margin: a && 1 }
    };
  let c, f;
  s - i <= 2 * hi ? c = f = n.sliceDoc(i, s) : (c = n.sliceDoc(i, i + hi), f = n.sliceDoc(s - hi, s));
  let u = /^\s*/.exec(c)[0].length, d = /\s*$/.exec(f)[0].length, p = f.length - d - t.length;
  return c.slice(u, u + e.length) == e && f.slice(p, p + t.length) == t ? {
    open: {
      pos: i + u + e.length,
      margin: /\s/.test(c.charAt(u + e.length)) ? 1 : 0
    },
    close: {
      pos: s - d - t.length,
      margin: /\s/.test(f.charAt(p - 1)) ? 1 : 0
    }
  } : null;
}
function cm(n) {
  let e = [];
  for (let t of n.selection.ranges) {
    let i = n.doc.lineAt(t.from), s = t.to <= i.to ? i : n.doc.lineAt(t.to), r = e.length - 1;
    r >= 0 && e[r].to > i.from ? e[r].to = s.to : e.push({ from: i.from + /^\s*/.exec(i.text)[0].length, to: s.to });
  }
  return e;
}
function Gh(n, e, t = e.selection.ranges) {
  let i = t.map((r) => Zr(e, r.from).block);
  if (!i.every((r) => r))
    return null;
  let s = t.map((r, o) => hm(e, i[o], r.from, r.to));
  if (n != 2 && !s.every((r) => r))
    return { changes: e.changes(t.map((r, o) => s[o] ? [] : [{ from: r.from, insert: i[o].open + " " }, { from: r.to, insert: " " + i[o].close }])) };
  if (n != 1 && s.some((r) => r)) {
    let r = [];
    for (let o = 0, l; o < s.length; o++)
      if (l = s[o]) {
        let a = i[o], { open: h, close: c } = l;
        r.push({ from: h.pos - a.open.length, to: h.pos + h.margin }, { from: c.pos - c.margin, to: c.pos + a.close.length });
      }
    return { changes: r };
  }
  return null;
}
function fm(n, e, t = e.selection.ranges) {
  let i = [], s = -1;
  for (let { from: r, to: o } of t) {
    let l = i.length, a = 1e9, h = Zr(e, r).line;
    if (h) {
      for (let c = r; c <= o; ) {
        let f = e.doc.lineAt(c);
        if (f.from > s && (r == o || o > f.from)) {
          s = f.from;
          let u = /^\s*/.exec(f.text)[0].length, d = u == f.length, p = f.text.slice(u, u + h.length) == h ? u : -1;
          u < f.text.length && u < a && (a = u), i.push({ line: f, comment: p, token: h, indent: u, empty: d, single: !1 });
        }
        c = f.to + 1;
      }
      if (a < 1e9)
        for (let c = l; c < i.length; c++)
          i[c].indent < i[c].line.text.length && (i[c].indent = a);
      i.length == l + 1 && (i[l].single = !0);
    }
  }
  if (n != 2 && i.some((r) => r.comment < 0 && (!r.empty || r.single))) {
    let r = [];
    for (let { line: l, token: a, indent: h, empty: c, single: f } of i)
      (f || !c) && r.push({ from: l.from + h, insert: a + " " });
    let o = e.changes(r);
    return { changes: o, selection: e.selection.map(o, 1) };
  } else if (n != 1 && i.some((r) => r.comment >= 0)) {
    let r = [];
    for (let { line: o, comment: l, token: a } of i)
      if (l >= 0) {
        let h = o.from + l, c = h + a.length;
        o.text[c - o.from] == " " && c++, r.push({ from: h, to: c });
      }
    return { changes: r };
  }
  return null;
}
const vr = /* @__PURE__ */ ot.define(), um = /* @__PURE__ */ ot.define(), dm = /* @__PURE__ */ M.define(), Kh = /* @__PURE__ */ M.define({
  combine(n) {
    return Je(n, {
      minDepth: 100,
      newGroupDelay: 500,
      joinToEvent: (e, t) => t
    }, {
      minDepth: Math.max,
      newGroupDelay: Math.min,
      joinToEvent: (e, t) => (i, s) => e(i, s) || t(i, s)
    });
  }
}), _h = /* @__PURE__ */ he.define({
  create() {
    return Ye.empty;
  },
  update(n, e) {
    let t = e.state.facet(Kh), i = e.annotation(vr);
    if (i) {
      let a = we.fromTransaction(e, i.selection), h = i.side, c = h == 0 ? n.undone : n.done;
      return a ? c = Wn(c, c.length, t.minDepth, a) : c = Jh(c, e.startState.selection), new Ye(h == 0 ? i.rest : c, h == 0 ? c : i.rest);
    }
    let s = e.annotation(um);
    if ((s == "full" || s == "before") && (n = n.isolate()), e.annotation(ne.addToHistory) === !1)
      return e.changes.empty ? n : n.addMapping(e.changes.desc);
    let r = we.fromTransaction(e), o = e.annotation(ne.time), l = e.annotation(ne.userEvent);
    return r ? n = n.addChanges(r, o, l, t, e) : e.selection && (n = n.addSelection(e.startState.selection, o, l, t.newGroupDelay)), (s == "full" || s == "after") && (n = n.isolate()), n;
  },
  toJSON(n) {
    return { done: n.done.map((e) => e.toJSON()), undone: n.undone.map((e) => e.toJSON()) };
  },
  fromJSON(n) {
    return new Ye(n.done.map(we.fromJSON), n.undone.map(we.fromJSON));
  }
});
function pm(n = {}) {
  return [
    _h,
    Kh.of(n),
    T.domEventHandlers({
      beforeinput(e, t) {
        let i = e.inputType == "historyUndo" ? Yh : e.inputType == "historyRedo" ? Cr : null;
        return i ? (e.preventDefault(), i(t)) : !1;
      }
    })
  ];
}
function ns(n, e) {
  return function({ state: t, dispatch: i }) {
    if (!e && t.readOnly)
      return !1;
    let s = t.field(_h, !1);
    if (!s)
      return !1;
    let r = s.pop(n, t, e);
    return r ? (i(r), !0) : !1;
  };
}
const Yh = /* @__PURE__ */ ns(0, !1), Cr = /* @__PURE__ */ ns(1, !1), mm = /* @__PURE__ */ ns(0, !0), gm = /* @__PURE__ */ ns(1, !0);
class we {
  constructor(e, t, i, s, r) {
    this.changes = e, this.effects = t, this.mapped = i, this.startSelection = s, this.selectionsAfter = r;
  }
  setSelAfter(e) {
    return new we(this.changes, this.effects, this.mapped, this.startSelection, e);
  }
  toJSON() {
    var e, t, i;
    return {
      changes: (e = this.changes) === null || e === void 0 ? void 0 : e.toJSON(),
      mapped: (t = this.mapped) === null || t === void 0 ? void 0 : t.toJSON(),
      startSelection: (i = this.startSelection) === null || i === void 0 ? void 0 : i.toJSON(),
      selectionsAfter: this.selectionsAfter.map((s) => s.toJSON())
    };
  }
  static fromJSON(e) {
    return new we(e.changes && te.fromJSON(e.changes), [], e.mapped && Ze.fromJSON(e.mapped), e.startSelection && b.fromJSON(e.startSelection), e.selectionsAfter.map(b.fromJSON));
  }
  // This does not check `addToHistory` and such, it assumes the
  // transaction needs to be converted to an item. Returns null when
  // there are no changes or effects in the transaction.
  static fromTransaction(e, t) {
    let i = Ee;
    for (let s of e.startState.facet(dm)) {
      let r = s(e);
      r.length && (i = i.concat(r));
    }
    return !i.length && e.changes.empty ? null : new we(e.changes.invert(e.startState.doc), i, void 0, t || e.startState.selection, Ee);
  }
  static selection(e) {
    return new we(void 0, Ee, void 0, void 0, e);
  }
}
function Wn(n, e, t, i) {
  let s = e + 1 > t + 20 ? e - t - 1 : 0, r = n.slice(s, e);
  return r.push(i), r;
}
function ym(n, e) {
  let t = [], i = !1;
  return n.iterChangedRanges((s, r) => t.push(s, r)), e.iterChangedRanges((s, r, o, l) => {
    for (let a = 0; a < t.length; ) {
      let h = t[a++], c = t[a++];
      l >= h && o <= c && (i = !0);
    }
  }), i;
}
function bm(n, e) {
  return n.ranges.length == e.ranges.length && n.ranges.filter((t, i) => t.empty != e.ranges[i].empty).length === 0;
}
function Zh(n, e) {
  return n.length ? e.length ? n.concat(e) : n : e;
}
const Ee = [], xm = 200;
function Jh(n, e) {
  if (n.length) {
    let t = n[n.length - 1], i = t.selectionsAfter.slice(Math.max(0, t.selectionsAfter.length - xm));
    return i.length && i[i.length - 1].eq(e) ? n : (i.push(e), Wn(n, n.length - 1, 1e9, t.setSelAfter(i)));
  } else
    return [we.selection([e])];
}
function wm(n) {
  let e = n[n.length - 1], t = n.slice();
  return t[n.length - 1] = e.setSelAfter(e.selectionsAfter.slice(0, e.selectionsAfter.length - 1)), t;
}
function Ts(n, e) {
  if (!n.length)
    return n;
  let t = n.length, i = Ee;
  for (; t; ) {
    let s = km(n[t - 1], e, i);
    if (s.changes && !s.changes.empty || s.effects.length) {
      let r = n.slice(0, t);
      return r[t - 1] = s, r;
    } else
      e = s.mapped, t--, i = s.selectionsAfter;
  }
  return i.length ? [we.selection(i)] : Ee;
}
function km(n, e, t) {
  let i = Zh(n.selectionsAfter.length ? n.selectionsAfter.map((l) => l.map(e)) : Ee, t);
  if (!n.changes)
    return we.selection(i);
  let s = n.changes.map(e), r = e.mapDesc(n.changes, !0), o = n.mapped ? n.mapped.composeDesc(r) : r;
  return new we(s, E.mapEffects(n.effects, e), o, n.startSelection.map(r), i);
}
const Om = /^(input\.type|delete)($|\.)/;
class Ye {
  constructor(e, t, i = 0, s = void 0) {
    this.done = e, this.undone = t, this.prevTime = i, this.prevUserEvent = s;
  }
  isolate() {
    return this.prevTime ? new Ye(this.done, this.undone) : this;
  }
  addChanges(e, t, i, s, r) {
    let o = this.done, l = o[o.length - 1];
    return l && l.changes && !l.changes.empty && e.changes && (!i || Om.test(i)) && (!l.selectionsAfter.length && t - this.prevTime < s.newGroupDelay && s.joinToEvent(r, ym(l.changes, e.changes)) || // For compose (but not compose.start) events, always join with previous event
    i == "input.type.compose") ? o = Wn(o, o.length - 1, s.minDepth, new we(e.changes.compose(l.changes), Zh(e.effects, l.effects), l.mapped, l.startSelection, Ee)) : o = Wn(o, o.length, s.minDepth, e), new Ye(o, Ee, t, i);
  }
  addSelection(e, t, i, s) {
    let r = this.done.length ? this.done[this.done.length - 1].selectionsAfter : Ee;
    return r.length > 0 && t - this.prevTime < s && i == this.prevUserEvent && i && /^select($|\.)/.test(i) && bm(r[r.length - 1], e) ? this : new Ye(Jh(this.done, e), this.undone, t, i);
  }
  addMapping(e) {
    return new Ye(Ts(this.done, e), Ts(this.undone, e), this.prevTime, this.prevUserEvent);
  }
  pop(e, t, i) {
    let s = e == 0 ? this.done : this.undone;
    if (s.length == 0)
      return null;
    let r = s[s.length - 1], o = r.selectionsAfter[0] || t.selection;
    if (i && r.selectionsAfter.length)
      return t.update({
        selection: r.selectionsAfter[r.selectionsAfter.length - 1],
        annotations: vr.of({ side: e, rest: wm(s), selection: o }),
        userEvent: e == 0 ? "select.undo" : "select.redo",
        scrollIntoView: !0
      });
    if (r.changes) {
      let l = s.length == 1 ? Ee : s.slice(0, s.length - 1);
      return r.mapped && (l = Ts(l, r.mapped)), t.update({
        changes: r.changes,
        selection: r.startSelection,
        effects: r.effects,
        annotations: vr.of({ side: e, rest: l, selection: o }),
        filter: !1,
        userEvent: e == 0 ? "undo" : "redo",
        scrollIntoView: !0
      });
    } else
      return null;
  }
}
Ye.empty = /* @__PURE__ */ new Ye(Ee, Ee);
const Sm = [
  { key: "Mod-z", run: Yh, preventDefault: !0 },
  { key: "Mod-y", mac: "Mod-Shift-z", run: Cr, preventDefault: !0 },
  { linux: "Ctrl-Shift-z", run: Cr, preventDefault: !0 },
  { key: "Mod-u", run: mm, preventDefault: !0 },
  { key: "Alt-u", mac: "Mod-Shift-u", run: gm, preventDefault: !0 }
];
function ii(n, e) {
  return b.create(n.ranges.map(e), n.mainIndex);
}
function et(n, e) {
  return n.update({ selection: e, scrollIntoView: !0, userEvent: "select" });
}
function ze({ state: n, dispatch: e }, t) {
  let i = ii(n.selection, t);
  return i.eq(n.selection) ? !1 : (e(et(n, i)), !0);
}
function ss(n, e) {
  return b.cursor(e ? n.to : n.from);
}
function ec(n, e) {
  return ze(n, (t) => t.empty ? n.moveByChar(t, e) : ss(t, e));
}
function de(n) {
  return n.textDirectionAt(n.state.selection.main.head) == K.LTR;
}
const tc = (n) => ec(n, !de(n)), ic = (n) => ec(n, de(n));
function nc(n, e) {
  return ze(n, (t) => t.empty ? n.moveByGroup(t, e) : ss(t, e));
}
const vm = (n) => nc(n, !de(n)), Cm = (n) => nc(n, de(n));
function Am(n, e, t) {
  if (e.type.prop(t))
    return !0;
  let i = e.to - e.from;
  return i && (i > 2 || /[^\s,.;:]/.test(n.sliceDoc(e.from, e.to))) || e.firstChild;
}
function rs(n, e, t) {
  let i = ae(n).resolveInner(e.head), s = t ? N.closedBy : N.openedBy;
  for (let a = e.head; ; ) {
    let h = t ? i.childAfter(a) : i.childBefore(a);
    if (!h)
      break;
    Am(n, h, s) ? i = h : a = t ? h.to : h.from;
  }
  let r = i.type.prop(s), o, l;
  return r && (o = t ? _e(n, i.from, 1) : _e(n, i.to, -1)) && o.matched ? l = t ? o.end.to : o.end.from : l = t ? i.to : i.from, b.cursor(l, t ? -1 : 1);
}
const Mm = (n) => ze(n, (e) => rs(n.state, e, !de(n))), Tm = (n) => ze(n, (e) => rs(n.state, e, de(n)));
function sc(n, e) {
  return ze(n, (t) => {
    if (!t.empty)
      return ss(t, e);
    let i = n.moveVertically(t, e);
    return i.head != t.head ? i : n.moveToLineBoundary(t, e);
  });
}
const rc = (n) => sc(n, !1), oc = (n) => sc(n, !0);
function lc(n) {
  let e = n.scrollDOM.clientHeight < n.scrollDOM.scrollHeight - 2, t = 0, i = 0, s;
  if (e) {
    for (let r of n.state.facet(T.scrollMargins)) {
      let o = r(n);
      o != null && o.top && (t = Math.max(o == null ? void 0 : o.top, t)), o != null && o.bottom && (i = Math.max(o == null ? void 0 : o.bottom, i));
    }
    s = n.scrollDOM.clientHeight - t - i;
  } else
    s = (n.dom.ownerDocument.defaultView || window).innerHeight;
  return {
    marginTop: t,
    marginBottom: i,
    selfScroll: e,
    height: Math.max(n.defaultLineHeight, s - 5)
  };
}
function ac(n, e) {
  let t = lc(n), { state: i } = n, s = ii(i.selection, (o) => o.empty ? n.moveVertically(o, e, t.height) : ss(o, e));
  if (s.eq(i.selection))
    return !1;
  let r;
  if (t.selfScroll) {
    let o = n.coordsAtPos(i.selection.main.head), l = n.scrollDOM.getBoundingClientRect(), a = l.top + t.marginTop, h = l.bottom - t.marginBottom;
    o && o.top > a && o.bottom < h && (r = T.scrollIntoView(s.main.head, { y: "start", yMargin: o.top - a }));
  }
  return n.dispatch(et(i, s), { effects: r }), !0;
}
const vl = (n) => ac(n, !1), Ar = (n) => ac(n, !0);
function vt(n, e, t) {
  let i = n.lineBlockAt(e.head), s = n.moveToLineBoundary(e, t);
  if (s.head == e.head && s.head != (t ? i.to : i.from) && (s = n.moveToLineBoundary(e, t, !1)), !t && s.head == i.from && i.length) {
    let r = /^\s*/.exec(n.state.sliceDoc(i.from, Math.min(i.from + 100, i.to)))[0].length;
    r && e.head != i.from + r && (s = b.cursor(i.from + r));
  }
  return s;
}
const Pm = (n) => ze(n, (e) => vt(n, e, !0)), Dm = (n) => ze(n, (e) => vt(n, e, !1)), Rm = (n) => ze(n, (e) => vt(n, e, !de(n))), Bm = (n) => ze(n, (e) => vt(n, e, de(n))), Em = (n) => ze(n, (e) => b.cursor(n.lineBlockAt(e.head).from, 1)), Lm = (n) => ze(n, (e) => b.cursor(n.lineBlockAt(e.head).to, -1));
function Nm(n, e, t) {
  let i = !1, s = ii(n.selection, (r) => {
    let o = _e(n, r.head, -1) || _e(n, r.head, 1) || r.head > 0 && _e(n, r.head - 1, 1) || r.head < n.doc.length && _e(n, r.head + 1, -1);
    if (!o || !o.end)
      return r;
    i = !0;
    let l = o.start.from == r.head ? o.end.to : o.end.from;
    return t ? b.range(r.anchor, l) : b.cursor(l);
  });
  return i ? (e(et(n, s)), !0) : !1;
}
const Im = ({ state: n, dispatch: e }) => Nm(n, e, !1);
function Ie(n, e) {
  let t = ii(n.state.selection, (i) => {
    let s = e(i);
    return b.range(i.anchor, s.head, s.goalColumn, s.bidiLevel || void 0);
  });
  return t.eq(n.state.selection) ? !1 : (n.dispatch(et(n.state, t)), !0);
}
function hc(n, e) {
  return Ie(n, (t) => n.moveByChar(t, e));
}
const cc = (n) => hc(n, !de(n)), fc = (n) => hc(n, de(n));
function uc(n, e) {
  return Ie(n, (t) => n.moveByGroup(t, e));
}
const Wm = (n) => uc(n, !de(n)), $m = (n) => uc(n, de(n)), Qm = (n) => Ie(n, (e) => rs(n.state, e, !de(n))), zm = (n) => Ie(n, (e) => rs(n.state, e, de(n)));
function dc(n, e) {
  return Ie(n, (t) => n.moveVertically(t, e));
}
const pc = (n) => dc(n, !1), mc = (n) => dc(n, !0);
function gc(n, e) {
  return Ie(n, (t) => n.moveVertically(t, e, lc(n).height));
}
const Cl = (n) => gc(n, !1), Al = (n) => gc(n, !0), Fm = (n) => Ie(n, (e) => vt(n, e, !0)), Vm = (n) => Ie(n, (e) => vt(n, e, !1)), Hm = (n) => Ie(n, (e) => vt(n, e, !de(n))), qm = (n) => Ie(n, (e) => vt(n, e, de(n))), Um = (n) => Ie(n, (e) => b.cursor(n.lineBlockAt(e.head).from)), Xm = (n) => Ie(n, (e) => b.cursor(n.lineBlockAt(e.head).to)), Ml = ({ state: n, dispatch: e }) => (e(et(n, { anchor: 0 })), !0), Tl = ({ state: n, dispatch: e }) => (e(et(n, { anchor: n.doc.length })), !0), Pl = ({ state: n, dispatch: e }) => (e(et(n, { anchor: n.selection.main.anchor, head: 0 })), !0), Dl = ({ state: n, dispatch: e }) => (e(et(n, { anchor: n.selection.main.anchor, head: n.doc.length })), !0), jm = ({ state: n, dispatch: e }) => (e(n.update({ selection: { anchor: 0, head: n.doc.length }, userEvent: "select" })), !0), Gm = ({ state: n, dispatch: e }) => {
  let t = os(n).map(({ from: i, to: s }) => b.range(i, Math.min(s + 1, n.doc.length)));
  return e(n.update({ selection: b.create(t), userEvent: "select" })), !0;
}, Km = ({ state: n, dispatch: e }) => {
  let t = ii(n.selection, (i) => {
    var s;
    let r = ae(n).resolveStack(i.from, 1);
    for (let o = r; o; o = o.next) {
      let { node: l } = o;
      if ((l.from < i.from && l.to >= i.to || l.to > i.to && l.from <= i.from) && (!((s = l.parent) === null || s === void 0) && s.parent))
        return b.range(l.to, l.from);
    }
    return i;
  });
  return e(et(n, t)), !0;
}, _m = ({ state: n, dispatch: e }) => {
  let t = n.selection, i = null;
  return t.ranges.length > 1 ? i = b.create([t.main]) : t.main.empty || (i = b.create([b.cursor(t.main.head)])), i ? (e(et(n, i)), !0) : !1;
};
function Qi(n, e) {
  if (n.state.readOnly)
    return !1;
  let t = "delete.selection", { state: i } = n, s = i.changeByRange((r) => {
    let { from: o, to: l } = r;
    if (o == l) {
      let a = e(r);
      a < o ? (t = "delete.backward", a = on(n, a, !1)) : a > o && (t = "delete.forward", a = on(n, a, !0)), o = Math.min(o, a), l = Math.max(l, a);
    } else
      o = on(n, o, !1), l = on(n, l, !0);
    return o == l ? { range: r } : { changes: { from: o, to: l }, range: b.cursor(o, o < r.head ? -1 : 1) };
  });
  return s.changes.empty ? !1 : (n.dispatch(i.update(s, {
    scrollIntoView: !0,
    userEvent: t,
    effects: t == "delete.selection" ? T.announce.of(i.phrase("Selection deleted")) : void 0
  })), !0);
}
function on(n, e, t) {
  if (n instanceof T)
    for (let i of n.state.facet(T.atomicRanges).map((s) => s(n)))
      i.between(e, e, (s, r) => {
        s < e && r > e && (e = t ? r : s);
      });
  return e;
}
const yc = (n, e) => Qi(n, (t) => {
  let i = t.from, { state: s } = n, r = s.doc.lineAt(i), o, l;
  if (!e && i > r.from && i < r.from + 200 && !/[^ \t]/.test(o = r.text.slice(0, i - r.from))) {
    if (o[o.length - 1] == "	")
      return i - 1;
    let a = ti(o, s.tabSize), h = a % Ln(s) || Ln(s);
    for (let c = 0; c < h && o[o.length - 1 - c] == " "; c++)
      i--;
    l = i;
  } else
    l = le(r.text, i - r.from, e, e) + r.from, l == i && r.number != (e ? s.doc.lines : 1) ? l += e ? 1 : -1 : !e && /[\ufe00-\ufe0f]/.test(r.text.slice(l - r.from, i - r.from)) && (l = le(r.text, l - r.from, !1, !1) + r.from);
  return l;
}), Mr = (n) => yc(n, !1), bc = (n) => yc(n, !0), xc = (n, e) => Qi(n, (t) => {
  let i = t.head, { state: s } = n, r = s.doc.lineAt(i), o = s.charCategorizer(i);
  for (let l = null; ; ) {
    if (i == (e ? r.to : r.from)) {
      i == t.head && r.number != (e ? s.doc.lines : 1) && (i += e ? 1 : -1);
      break;
    }
    let a = le(r.text, i - r.from, e) + r.from, h = r.text.slice(Math.min(i, a) - r.from, Math.max(i, a) - r.from), c = o(h);
    if (l != null && c != l)
      break;
    (h != " " || i != t.head) && (l = c), i = a;
  }
  return i;
}), wc = (n) => xc(n, !1), Ym = (n) => xc(n, !0), Zm = (n) => Qi(n, (e) => {
  let t = n.lineBlockAt(e.head).to;
  return e.head < t ? t : Math.min(n.state.doc.length, e.head + 1);
}), Jm = (n) => Qi(n, (e) => {
  let t = n.moveToLineBoundary(e, !1).head;
  return e.head > t ? t : Math.max(0, e.head - 1);
}), eg = (n) => Qi(n, (e) => {
  let t = n.moveToLineBoundary(e, !0).head;
  return e.head < t ? t : Math.min(n.state.doc.length, e.head + 1);
}), tg = ({ state: n, dispatch: e }) => {
  if (n.readOnly)
    return !1;
  let t = n.changeByRange((i) => ({
    changes: { from: i.from, to: i.to, insert: z.of(["", ""]) },
    range: b.cursor(i.from)
  }));
  return e(n.update(t, { scrollIntoView: !0, userEvent: "input" })), !0;
}, ig = ({ state: n, dispatch: e }) => {
  if (n.readOnly)
    return !1;
  let t = n.changeByRange((i) => {
    if (!i.empty || i.from == 0 || i.from == n.doc.length)
      return { range: i };
    let s = i.from, r = n.doc.lineAt(s), o = s == r.from ? s - 1 : le(r.text, s - r.from, !1) + r.from, l = s == r.to ? s + 1 : le(r.text, s - r.from, !0) + r.from;
    return {
      changes: { from: o, to: l, insert: n.doc.slice(s, l).append(n.doc.slice(o, s)) },
      range: b.cursor(l)
    };
  });
  return t.changes.empty ? !1 : (e(n.update(t, { scrollIntoView: !0, userEvent: "move.character" })), !0);
};
function os(n) {
  let e = [], t = -1;
  for (let i of n.selection.ranges) {
    let s = n.doc.lineAt(i.from), r = n.doc.lineAt(i.to);
    if (!i.empty && i.to == r.from && (r = n.doc.lineAt(i.to - 1)), t >= s.number) {
      let o = e[e.length - 1];
      o.to = r.to, o.ranges.push(i);
    } else
      e.push({ from: s.from, to: r.to, ranges: [i] });
    t = r.number + 1;
  }
  return e;
}
function kc(n, e, t) {
  if (n.readOnly)
    return !1;
  let i = [], s = [];
  for (let r of os(n)) {
    if (t ? r.to == n.doc.length : r.from == 0)
      continue;
    let o = n.doc.lineAt(t ? r.to + 1 : r.from - 1), l = o.length + 1;
    if (t) {
      i.push({ from: r.to, to: o.to }, { from: r.from, insert: o.text + n.lineBreak });
      for (let a of r.ranges)
        s.push(b.range(Math.min(n.doc.length, a.anchor + l), Math.min(n.doc.length, a.head + l)));
    } else {
      i.push({ from: o.from, to: r.from }, { from: r.to, insert: n.lineBreak + o.text });
      for (let a of r.ranges)
        s.push(b.range(a.anchor - l, a.head - l));
    }
  }
  return i.length ? (e(n.update({
    changes: i,
    scrollIntoView: !0,
    selection: b.create(s, n.selection.mainIndex),
    userEvent: "move.line"
  })), !0) : !1;
}
const ng = ({ state: n, dispatch: e }) => kc(n, e, !1), sg = ({ state: n, dispatch: e }) => kc(n, e, !0);
function Oc(n, e, t) {
  if (n.readOnly)
    return !1;
  let i = [];
  for (let s of os(n))
    t ? i.push({ from: s.from, insert: n.doc.slice(s.from, s.to) + n.lineBreak }) : i.push({ from: s.to, insert: n.lineBreak + n.doc.slice(s.from, s.to) });
  return e(n.update({ changes: i, scrollIntoView: !0, userEvent: "input.copyline" })), !0;
}
const rg = ({ state: n, dispatch: e }) => Oc(n, e, !1), og = ({ state: n, dispatch: e }) => Oc(n, e, !0), lg = (n) => {
  if (n.state.readOnly)
    return !1;
  let { state: e } = n, t = e.changes(os(e).map(({ from: s, to: r }) => (s > 0 ? s-- : r < e.doc.length && r++, { from: s, to: r }))), i = ii(e.selection, (s) => n.moveVertically(s, !0)).map(t);
  return n.dispatch({ changes: t, selection: i, scrollIntoView: !0, userEvent: "delete.line" }), !0;
};
function ag(n, e) {
  if (/\(\)|\[\]|\{\}/.test(n.sliceDoc(e - 1, e + 1)))
    return { from: e, to: e };
  let t = ae(n).resolveInner(e), i = t.childBefore(e), s = t.childAfter(e), r;
  return i && s && i.to <= e && s.from >= e && (r = i.type.prop(N.closedBy)) && r.indexOf(s.name) > -1 && n.doc.lineAt(i.to).from == n.doc.lineAt(s.from).from && !/\S/.test(n.sliceDoc(i.to, s.from)) ? { from: i.to, to: s.from } : null;
}
const hg = /* @__PURE__ */ Sc(!1), cg = /* @__PURE__ */ Sc(!0);
function Sc(n) {
  return ({ state: e, dispatch: t }) => {
    if (e.readOnly)
      return !1;
    let i = e.changeByRange((s) => {
      let { from: r, to: o } = s, l = e.doc.lineAt(r), a = !n && r == o && ag(e, r);
      n && (r = o = (o <= l.to ? l : e.doc.lineAt(o)).to);
      let h = new es(e, { simulateBreak: r, simulateDoubleBreak: !!a }), c = Gr(h, r);
      for (c == null && (c = ti(/^\s*/.exec(e.doc.lineAt(r).text)[0], e.tabSize)); o < l.to && /\s/.test(l.text[o - l.from]); )
        o++;
      a ? { from: r, to: o } = a : r > l.from && r < l.from + 100 && !/\S/.test(l.text.slice(0, r)) && (r = l.from);
      let f = ["", Ri(e, c)];
      return a && f.push(Ri(e, h.lineIndent(l.from, -1))), {
        changes: { from: r, to: o, insert: z.of(f) },
        range: b.cursor(r + 1 + f[1].length)
      };
    });
    return t(e.update(i, { scrollIntoView: !0, userEvent: "input" })), !0;
  };
}
function Jr(n, e) {
  let t = -1;
  return n.changeByRange((i) => {
    let s = [];
    for (let o = i.from; o <= i.to; ) {
      let l = n.doc.lineAt(o);
      l.number > t && (i.empty || i.to > l.from) && (e(l, s, i), t = l.number), o = l.to + 1;
    }
    let r = n.changes(s);
    return {
      changes: s,
      range: b.range(r.mapPos(i.anchor, 1), r.mapPos(i.head, 1))
    };
  });
}
const fg = ({ state: n, dispatch: e }) => {
  if (n.readOnly)
    return !1;
  let t = /* @__PURE__ */ Object.create(null), i = new es(n, { overrideIndentation: (r) => {
    let o = t[r];
    return o ?? -1;
  } }), s = Jr(n, (r, o, l) => {
    let a = Gr(i, r.from);
    if (a == null)
      return;
    /\S/.test(r.text) || (a = 0);
    let h = /^\s*/.exec(r.text)[0], c = Ri(n, a);
    (h != c || l.from < r.from + h.length) && (t[r.from] = a, o.push({ from: r.from, to: r.from + h.length, insert: c }));
  });
  return s.changes.empty || e(n.update(s, { userEvent: "indent" })), !0;
}, ug = ({ state: n, dispatch: e }) => n.readOnly ? !1 : (e(n.update(Jr(n, (t, i) => {
  i.push({ from: t.from, insert: n.facet(jr) });
}), { userEvent: "input.indent" })), !0), dg = ({ state: n, dispatch: e }) => n.readOnly ? !1 : (e(n.update(Jr(n, (t, i) => {
  let s = /^\s*/.exec(t.text)[0];
  if (!s)
    return;
  let r = ti(s, n.tabSize), o = 0, l = Ri(n, Math.max(0, r - Ln(n)));
  for (; o < s.length && o < l.length && s.charCodeAt(o) == l.charCodeAt(o); )
    o++;
  i.push({ from: t.from + o, to: t.from + s.length, insert: l.slice(o) });
}), { userEvent: "delete.dedent" })), !0), pg = [
  { key: "Ctrl-b", run: tc, shift: cc, preventDefault: !0 },
  { key: "Ctrl-f", run: ic, shift: fc },
  { key: "Ctrl-p", run: rc, shift: pc },
  { key: "Ctrl-n", run: oc, shift: mc },
  { key: "Ctrl-a", run: Em, shift: Um },
  { key: "Ctrl-e", run: Lm, shift: Xm },
  { key: "Ctrl-d", run: bc },
  { key: "Ctrl-h", run: Mr },
  { key: "Ctrl-k", run: Zm },
  { key: "Ctrl-Alt-h", run: wc },
  { key: "Ctrl-o", run: tg },
  { key: "Ctrl-t", run: ig },
  { key: "Ctrl-v", run: Ar }
], mg = /* @__PURE__ */ [
  { key: "ArrowLeft", run: tc, shift: cc, preventDefault: !0 },
  { key: "Mod-ArrowLeft", mac: "Alt-ArrowLeft", run: vm, shift: Wm, preventDefault: !0 },
  { mac: "Cmd-ArrowLeft", run: Rm, shift: Hm, preventDefault: !0 },
  { key: "ArrowRight", run: ic, shift: fc, preventDefault: !0 },
  { key: "Mod-ArrowRight", mac: "Alt-ArrowRight", run: Cm, shift: $m, preventDefault: !0 },
  { mac: "Cmd-ArrowRight", run: Bm, shift: qm, preventDefault: !0 },
  { key: "ArrowUp", run: rc, shift: pc, preventDefault: !0 },
  { mac: "Cmd-ArrowUp", run: Ml, shift: Pl },
  { mac: "Ctrl-ArrowUp", run: vl, shift: Cl },
  { key: "ArrowDown", run: oc, shift: mc, preventDefault: !0 },
  { mac: "Cmd-ArrowDown", run: Tl, shift: Dl },
  { mac: "Ctrl-ArrowDown", run: Ar, shift: Al },
  { key: "PageUp", run: vl, shift: Cl },
  { key: "PageDown", run: Ar, shift: Al },
  { key: "Home", run: Dm, shift: Vm, preventDefault: !0 },
  { key: "Mod-Home", run: Ml, shift: Pl },
  { key: "End", run: Pm, shift: Fm, preventDefault: !0 },
  { key: "Mod-End", run: Tl, shift: Dl },
  { key: "Enter", run: hg },
  { key: "Mod-a", run: jm },
  { key: "Backspace", run: Mr, shift: Mr },
  { key: "Delete", run: bc },
  { key: "Mod-Backspace", mac: "Alt-Backspace", run: wc },
  { key: "Mod-Delete", mac: "Alt-Delete", run: Ym },
  { mac: "Mod-Backspace", run: Jm },
  { mac: "Mod-Delete", run: eg }
].concat(/* @__PURE__ */ pg.map((n) => ({ mac: n.key, run: n.run, shift: n.shift }))), vc = /* @__PURE__ */ [
  { key: "Alt-ArrowLeft", mac: "Ctrl-ArrowLeft", run: Mm, shift: Qm },
  { key: "Alt-ArrowRight", mac: "Ctrl-ArrowRight", run: Tm, shift: zm },
  { key: "Alt-ArrowUp", run: ng },
  { key: "Shift-Alt-ArrowUp", run: rg },
  { key: "Alt-ArrowDown", run: sg },
  { key: "Shift-Alt-ArrowDown", run: og },
  { key: "Escape", run: _m },
  { key: "Mod-Enter", run: cg },
  { key: "Alt-l", mac: "Ctrl-l", run: Gm },
  { key: "Mod-i", run: Km, preventDefault: !0 },
  { key: "Mod-[", run: dg },
  { key: "Mod-]", run: ug },
  { key: "Mod-Alt-\\", run: fg },
  { key: "Shift-Mod-k", run: lg },
  { key: "Shift-Mod-\\", run: Im },
  { key: "Mod-/", run: rm },
  { key: "Alt-A", run: lm }
].concat(mg);
function q() {
  var n = arguments[0];
  typeof n == "string" && (n = document.createElement(n));
  var e = 1, t = arguments[1];
  if (t && typeof t == "object" && t.nodeType == null && !Array.isArray(t)) {
    for (var i in t)
      if (Object.prototype.hasOwnProperty.call(t, i)) {
        var s = t[i];
        typeof s == "string" ? n.setAttribute(i, s) : s != null && (n[i] = s);
      }
    e++;
  }
  for (; e < arguments.length; e++)
    Cc(n, arguments[e]);
  return n;
}
function Cc(n, e) {
  if (typeof e == "string")
    n.appendChild(document.createTextNode(e));
  else if (e != null)
    if (e.nodeType != null)
      n.appendChild(e);
    else if (Array.isArray(e))
      for (var t = 0; t < e.length; t++)
        Cc(n, e[t]);
    else
      throw new RangeError("Unsupported child node: " + e);
}
const Rl = typeof String.prototype.normalize == "function" ? (n) => n.normalize("NFKD") : (n) => n;
class Zt {
  /**
  Create a text cursor. The query is the search string, `from` to
  `to` provides the region to search.
  
  When `normalize` is given, it will be called, on both the query
  string and the content it is matched against, before comparing.
  You can, for example, create a case-insensitive search by
  passing `s => s.toLowerCase()`.
  
  Text is always normalized with
  [`.normalize("NFKD")`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
  (when supported).
  */
  constructor(e, t, i = 0, s = e.length, r, o) {
    this.test = o, this.value = { from: 0, to: 0 }, this.done = !1, this.matches = [], this.buffer = "", this.bufferPos = 0, this.iter = e.iterRange(i, s), this.bufferStart = i, this.normalize = r ? (l) => r(Rl(l)) : Rl, this.query = this.normalize(t);
  }
  peek() {
    if (this.bufferPos == this.buffer.length) {
      if (this.bufferStart += this.buffer.length, this.iter.next(), this.iter.done)
        return -1;
      this.bufferPos = 0, this.buffer = this.iter.value;
    }
    return re(this.buffer, this.bufferPos);
  }
  /**
  Look for the next match. Updates the iterator's
  [`value`](https://codemirror.net/6/docs/ref/#search.SearchCursor.value) and
  [`done`](https://codemirror.net/6/docs/ref/#search.SearchCursor.done) properties. Should be called
  at least once before using the cursor.
  */
  next() {
    for (; this.matches.length; )
      this.matches.pop();
    return this.nextOverlapping();
  }
  /**
  The `next` method will ignore matches that partially overlap a
  previous match. This method behaves like `next`, but includes
  such matches.
  */
  nextOverlapping() {
    for (; ; ) {
      let e = this.peek();
      if (e < 0)
        return this.done = !0, this;
      let t = Rr(e), i = this.bufferStart + this.bufferPos;
      this.bufferPos += Be(e);
      let s = this.normalize(t);
      for (let r = 0, o = i; ; r++) {
        let l = s.charCodeAt(r), a = this.match(l, o);
        if (r == s.length - 1) {
          if (a)
            return this.value = a, this;
          break;
        }
        o == i && r < t.length && t.charCodeAt(r) == l && o++;
      }
    }
  }
  match(e, t) {
    let i = null;
    for (let s = 0; s < this.matches.length; s += 2) {
      let r = this.matches[s], o = !1;
      this.query.charCodeAt(r) == e && (r == this.query.length - 1 ? i = { from: this.matches[s + 1], to: t + 1 } : (this.matches[s]++, o = !0)), o || (this.matches.splice(s, 2), s -= 2);
    }
    return this.query.charCodeAt(0) == e && (this.query.length == 1 ? i = { from: t, to: t + 1 } : this.matches.push(1, t)), i && this.test && !this.test(i.from, i.to, this.buffer, this.bufferStart) && (i = null), i;
  }
}
typeof Symbol < "u" && (Zt.prototype[Symbol.iterator] = function() {
  return this;
});
const Ac = { from: -1, to: -1, match: /* @__PURE__ */ /.*/.exec("") }, eo = "gm" + (/x/.unicode == null ? "" : "u");
class Mc {
  /**
  Create a cursor that will search the given range in the given
  document. `query` should be the raw pattern (as you'd pass it to
  `new RegExp`).
  */
  constructor(e, t, i, s = 0, r = e.length) {
    if (this.text = e, this.to = r, this.curLine = "", this.done = !1, this.value = Ac, /\\[sWDnr]|\n|\r|\[\^/.test(t))
      return new Tc(e, t, i, s, r);
    this.re = new RegExp(t, eo + (i != null && i.ignoreCase ? "i" : "")), this.test = i == null ? void 0 : i.test, this.iter = e.iter();
    let o = e.lineAt(s);
    this.curLineStart = o.from, this.matchPos = $n(e, s), this.getLine(this.curLineStart);
  }
  getLine(e) {
    this.iter.next(e), this.iter.lineBreak ? this.curLine = "" : (this.curLine = this.iter.value, this.curLineStart + this.curLine.length > this.to && (this.curLine = this.curLine.slice(0, this.to - this.curLineStart)), this.iter.next());
  }
  nextLine() {
    this.curLineStart = this.curLineStart + this.curLine.length + 1, this.curLineStart > this.to ? this.curLine = "" : this.getLine(0);
  }
  /**
  Move to the next match, if there is one.
  */
  next() {
    for (let e = this.matchPos - this.curLineStart; ; ) {
      this.re.lastIndex = e;
      let t = this.matchPos <= this.to && this.re.exec(this.curLine);
      if (t) {
        let i = this.curLineStart + t.index, s = i + t[0].length;
        if (this.matchPos = $n(this.text, s + (i == s ? 1 : 0)), i == this.curLineStart + this.curLine.length && this.nextLine(), (i < s || i > this.value.to) && (!this.test || this.test(i, s, t)))
          return this.value = { from: i, to: s, match: t }, this;
        e = this.matchPos - this.curLineStart;
      } else if (this.curLineStart + this.curLine.length < this.to)
        this.nextLine(), e = 0;
      else
        return this.done = !0, this;
    }
  }
}
const Ps = /* @__PURE__ */ new WeakMap();
class Xt {
  constructor(e, t) {
    this.from = e, this.text = t;
  }
  get to() {
    return this.from + this.text.length;
  }
  static get(e, t, i) {
    let s = Ps.get(e);
    if (!s || s.from >= i || s.to <= t) {
      let l = new Xt(t, e.sliceString(t, i));
      return Ps.set(e, l), l;
    }
    if (s.from == t && s.to == i)
      return s;
    let { text: r, from: o } = s;
    return o > t && (r = e.sliceString(t, o) + r, o = t), s.to < i && (r += e.sliceString(s.to, i)), Ps.set(e, new Xt(o, r)), new Xt(t, r.slice(t - o, i - o));
  }
}
class Tc {
  constructor(e, t, i, s, r) {
    this.text = e, this.to = r, this.done = !1, this.value = Ac, this.matchPos = $n(e, s), this.re = new RegExp(t, eo + (i != null && i.ignoreCase ? "i" : "")), this.test = i == null ? void 0 : i.test, this.flat = Xt.get(e, s, this.chunkEnd(
      s + 5e3
      /* Chunk.Base */
    ));
  }
  chunkEnd(e) {
    return e >= this.to ? this.to : this.text.lineAt(e).to;
  }
  next() {
    for (; ; ) {
      let e = this.re.lastIndex = this.matchPos - this.flat.from, t = this.re.exec(this.flat.text);
      if (t && !t[0] && t.index == e && (this.re.lastIndex = e + 1, t = this.re.exec(this.flat.text)), t) {
        let i = this.flat.from + t.index, s = i + t[0].length;
        if ((this.flat.to >= this.to || t.index + t[0].length <= this.flat.text.length - 10) && (!this.test || this.test(i, s, t)))
          return this.value = { from: i, to: s, match: t }, this.matchPos = $n(this.text, s + (i == s ? 1 : 0)), this;
      }
      if (this.flat.to == this.to)
        return this.done = !0, this;
      this.flat = Xt.get(this.text, this.flat.from, this.chunkEnd(this.flat.from + this.flat.text.length * 2));
    }
  }
}
typeof Symbol < "u" && (Mc.prototype[Symbol.iterator] = Tc.prototype[Symbol.iterator] = function() {
  return this;
});
function gg(n) {
  try {
    return new RegExp(n, eo), !0;
  } catch {
    return !1;
  }
}
function $n(n, e) {
  if (e >= n.length)
    return e;
  let t = n.lineAt(e), i;
  for (; e < t.to && (i = t.text.charCodeAt(e - t.from)) >= 56320 && i < 57344; )
    e++;
  return e;
}
function Tr(n) {
  let e = String(n.state.doc.lineAt(n.state.selection.main.head).number), t = q("input", { class: "cm-textfield", name: "line", value: e }), i = q("form", {
    class: "cm-gotoLine",
    onkeydown: (r) => {
      r.keyCode == 27 ? (r.preventDefault(), n.dispatch({ effects: Qn.of(!1) }), n.focus()) : r.keyCode == 13 && (r.preventDefault(), s());
    },
    onsubmit: (r) => {
      r.preventDefault(), s();
    }
  }, q("label", n.state.phrase("Go to line"), ": ", t), " ", q("button", { class: "cm-button", type: "submit" }, n.state.phrase("go")));
  function s() {
    let r = /^([+-])?(\d+)?(:\d+)?(%)?$/.exec(t.value);
    if (!r)
      return;
    let { state: o } = n, l = o.doc.lineAt(o.selection.main.head), [, a, h, c, f] = r, u = c ? +c.slice(1) : 0, d = h ? +h : l.number;
    if (h && f) {
      let m = d / 100;
      a && (m = m * (a == "-" ? -1 : 1) + l.number / o.doc.lines), d = Math.round(o.doc.lines * m);
    } else
      h && a && (d = d * (a == "-" ? -1 : 1) + l.number);
    let p = o.doc.line(Math.max(1, Math.min(o.doc.lines, d))), g = b.cursor(p.from + Math.max(0, Math.min(u, p.length)));
    n.dispatch({
      effects: [Qn.of(!1), T.scrollIntoView(g.from, { y: "center" })],
      selection: g
    }), n.focus();
  }
  return { dom: i };
}
const Qn = /* @__PURE__ */ E.define(), Bl = /* @__PURE__ */ he.define({
  create() {
    return !0;
  },
  update(n, e) {
    for (let t of e.effects)
      t.is(Qn) && (n = t.value);
    return n;
  },
  provide: (n) => Pi.from(n, (e) => e ? Tr : null)
}), yg = (n) => {
  let e = Ti(n, Tr);
  if (!e) {
    let t = [Qn.of(!0)];
    n.state.field(Bl, !1) == null && t.push(E.appendConfig.of([Bl, bg])), n.dispatch({ effects: t }), e = Ti(n, Tr);
  }
  return e && e.dom.querySelector("input").select(), !0;
}, bg = /* @__PURE__ */ T.baseTheme({
  ".cm-panel.cm-gotoLine": {
    padding: "2px 6px 4px",
    "& label": { fontSize: "80%" }
  }
}), xg = {
  highlightWordAroundCursor: !1,
  minSelectionLength: 1,
  maxMatches: 100,
  wholeWords: !1
}, Pc = /* @__PURE__ */ M.define({
  combine(n) {
    return Je(n, xg, {
      highlightWordAroundCursor: (e, t) => e || t,
      minSelectionLength: Math.min,
      maxMatches: Math.min
    });
  }
});
function wg(n) {
  let e = [Cg, vg];
  return n && e.push(Pc.of(n)), e;
}
const kg = /* @__PURE__ */ D.mark({ class: "cm-selectionMatch" }), Og = /* @__PURE__ */ D.mark({ class: "cm-selectionMatch cm-selectionMatch-main" });
function El(n, e, t, i) {
  return (t == 0 || n(e.sliceDoc(t - 1, t)) != j.Word) && (i == e.doc.length || n(e.sliceDoc(i, i + 1)) != j.Word);
}
function Sg(n, e, t, i) {
  return n(e.sliceDoc(t, t + 1)) == j.Word && n(e.sliceDoc(i - 1, i)) == j.Word;
}
const vg = /* @__PURE__ */ Z.fromClass(class {
  constructor(n) {
    this.decorations = this.getDeco(n);
  }
  update(n) {
    (n.selectionSet || n.docChanged || n.viewportChanged) && (this.decorations = this.getDeco(n.view));
  }
  getDeco(n) {
    let e = n.state.facet(Pc), { state: t } = n, i = t.selection;
    if (i.ranges.length > 1)
      return D.none;
    let s = i.main, r, o = null;
    if (s.empty) {
      if (!e.highlightWordAroundCursor)
        return D.none;
      let a = t.wordAt(s.head);
      if (!a)
        return D.none;
      o = t.charCategorizer(s.head), r = t.sliceDoc(a.from, a.to);
    } else {
      let a = s.to - s.from;
      if (a < e.minSelectionLength || a > 200)
        return D.none;
      if (e.wholeWords) {
        if (r = t.sliceDoc(s.from, s.to), o = t.charCategorizer(s.head), !(El(o, t, s.from, s.to) && Sg(o, t, s.from, s.to)))
          return D.none;
      } else if (r = t.sliceDoc(s.from, s.to).trim(), !r)
        return D.none;
    }
    let l = [];
    for (let a of n.visibleRanges) {
      let h = new Zt(t.doc, r, a.from, a.to);
      for (; !h.next().done; ) {
        let { from: c, to: f } = h.value;
        if ((!o || El(o, t, c, f)) && (s.empty && c <= s.from && f >= s.to ? l.push(Og.range(c, f)) : (c >= s.to || f <= s.from) && l.push(kg.range(c, f)), l.length > e.maxMatches))
          return D.none;
      }
    }
    return D.set(l);
  }
}, {
  decorations: (n) => n.decorations
}), Cg = /* @__PURE__ */ T.baseTheme({
  ".cm-selectionMatch": { backgroundColor: "#99ff7780" },
  ".cm-searchMatch .cm-selectionMatch": { backgroundColor: "transparent" }
}), Ag = ({ state: n, dispatch: e }) => {
  let { selection: t } = n, i = b.create(t.ranges.map((s) => n.wordAt(s.head) || b.cursor(s.head)), t.mainIndex);
  return i.eq(t) ? !1 : (e(n.update({ selection: i })), !0);
};
function Mg(n, e) {
  let { main: t, ranges: i } = n.selection, s = n.wordAt(t.head), r = s && s.from == t.from && s.to == t.to;
  for (let o = !1, l = new Zt(n.doc, e, i[i.length - 1].to); ; )
    if (l.next(), l.done) {
      if (o)
        return null;
      l = new Zt(n.doc, e, 0, Math.max(0, i[i.length - 1].from - 1)), o = !0;
    } else {
      if (o && i.some((a) => a.from == l.value.from))
        continue;
      if (r) {
        let a = n.wordAt(l.value.from);
        if (!a || a.from != l.value.from || a.to != l.value.to)
          continue;
      }
      return l.value;
    }
}
const Tg = ({ state: n, dispatch: e }) => {
  let { ranges: t } = n.selection;
  if (t.some((r) => r.from === r.to))
    return Ag({ state: n, dispatch: e });
  let i = n.sliceDoc(t[0].from, t[0].to);
  if (n.selection.ranges.some((r) => n.sliceDoc(r.from, r.to) != i))
    return !1;
  let s = Mg(n, i);
  return s ? (e(n.update({
    selection: n.selection.addRange(b.range(s.from, s.to), !1),
    effects: T.scrollIntoView(s.to)
  })), !0) : !1;
}, ni = /* @__PURE__ */ M.define({
  combine(n) {
    return Je(n, {
      top: !1,
      caseSensitive: !1,
      literal: !1,
      regexp: !1,
      wholeWord: !1,
      createPanel: (e) => new zg(e),
      scrollToMatch: (e) => T.scrollIntoView(e)
    });
  }
});
class Dc {
  /**
  Create a query object.
  */
  constructor(e) {
    this.search = e.search, this.caseSensitive = !!e.caseSensitive, this.literal = !!e.literal, this.regexp = !!e.regexp, this.replace = e.replace || "", this.valid = !!this.search && (!this.regexp || gg(this.search)), this.unquoted = this.unquote(this.search), this.wholeWord = !!e.wholeWord;
  }
  /**
  @internal
  */
  unquote(e) {
    return this.literal ? e : e.replace(/\\([nrt\\])/g, (t, i) => i == "n" ? `
` : i == "r" ? "\r" : i == "t" ? "	" : "\\");
  }
  /**
  Compare this query to another query.
  */
  eq(e) {
    return this.search == e.search && this.replace == e.replace && this.caseSensitive == e.caseSensitive && this.regexp == e.regexp && this.wholeWord == e.wholeWord;
  }
  /**
  @internal
  */
  create() {
    return this.regexp ? new Bg(this) : new Dg(this);
  }
  /**
  Get a search cursor for this query, searching through the given
  range in the given state.
  */
  getCursor(e, t = 0, i) {
    let s = e.doc ? e : $.create({ doc: e });
    return i == null && (i = s.doc.length), this.regexp ? $t(this, s, t, i) : Wt(this, s, t, i);
  }
}
class Rc {
  constructor(e) {
    this.spec = e;
  }
}
function Wt(n, e, t, i) {
  return new Zt(e.doc, n.unquoted, t, i, n.caseSensitive ? void 0 : (s) => s.toLowerCase(), n.wholeWord ? Pg(e.doc, e.charCategorizer(e.selection.main.head)) : void 0);
}
function Pg(n, e) {
  return (t, i, s, r) => ((r > t || r + s.length < i) && (r = Math.max(0, t - 2), s = n.sliceString(r, Math.min(n.length, i + 2))), (e(zn(s, t - r)) != j.Word || e(Fn(s, t - r)) != j.Word) && (e(Fn(s, i - r)) != j.Word || e(zn(s, i - r)) != j.Word));
}
class Dg extends Rc {
  constructor(e) {
    super(e);
  }
  nextMatch(e, t, i) {
    let s = Wt(this.spec, e, i, e.doc.length).nextOverlapping();
    return s.done && (s = Wt(this.spec, e, 0, t).nextOverlapping()), s.done ? null : s.value;
  }
  // Searching in reverse is, rather than implementing an inverted search
  // cursor, done by scanning chunk after chunk forward.
  prevMatchInRange(e, t, i) {
    for (let s = i; ; ) {
      let r = Math.max(t, s - 1e4 - this.spec.unquoted.length), o = Wt(this.spec, e, r, s), l = null;
      for (; !o.nextOverlapping().done; )
        l = o.value;
      if (l)
        return l;
      if (r == t)
        return null;
      s -= 1e4;
    }
  }
  prevMatch(e, t, i) {
    return this.prevMatchInRange(e, 0, t) || this.prevMatchInRange(e, i, e.doc.length);
  }
  getReplacement(e) {
    return this.spec.unquote(this.spec.replace);
  }
  matchAll(e, t) {
    let i = Wt(this.spec, e, 0, e.doc.length), s = [];
    for (; !i.next().done; ) {
      if (s.length >= t)
        return null;
      s.push(i.value);
    }
    return s;
  }
  highlight(e, t, i, s) {
    let r = Wt(this.spec, e, Math.max(0, t - this.spec.unquoted.length), Math.min(i + this.spec.unquoted.length, e.doc.length));
    for (; !r.next().done; )
      s(r.value.from, r.value.to);
  }
}
function $t(n, e, t, i) {
  return new Mc(e.doc, n.search, {
    ignoreCase: !n.caseSensitive,
    test: n.wholeWord ? Rg(e.charCategorizer(e.selection.main.head)) : void 0
  }, t, i);
}
function zn(n, e) {
  return n.slice(le(n, e, !1), e);
}
function Fn(n, e) {
  return n.slice(e, le(n, e));
}
function Rg(n) {
  return (e, t, i) => !i[0].length || (n(zn(i.input, i.index)) != j.Word || n(Fn(i.input, i.index)) != j.Word) && (n(Fn(i.input, i.index + i[0].length)) != j.Word || n(zn(i.input, i.index + i[0].length)) != j.Word);
}
class Bg extends Rc {
  nextMatch(e, t, i) {
    let s = $t(this.spec, e, i, e.doc.length).next();
    return s.done && (s = $t(this.spec, e, 0, t).next()), s.done ? null : s.value;
  }
  prevMatchInRange(e, t, i) {
    for (let s = 1; ; s++) {
      let r = Math.max(
        t,
        i - s * 1e4
        /* FindPrev.ChunkSize */
      ), o = $t(this.spec, e, r, i), l = null;
      for (; !o.next().done; )
        l = o.value;
      if (l && (r == t || l.from > r + 10))
        return l;
      if (r == t)
        return null;
    }
  }
  prevMatch(e, t, i) {
    return this.prevMatchInRange(e, 0, t) || this.prevMatchInRange(e, i, e.doc.length);
  }
  getReplacement(e) {
    return this.spec.unquote(this.spec.replace).replace(/\$([$&\d+])/g, (t, i) => i == "$" ? "$" : i == "&" ? e.match[0] : i != "0" && +i < e.match.length ? e.match[i] : t);
  }
  matchAll(e, t) {
    let i = $t(this.spec, e, 0, e.doc.length), s = [];
    for (; !i.next().done; ) {
      if (s.length >= t)
        return null;
      s.push(i.value);
    }
    return s;
  }
  highlight(e, t, i, s) {
    let r = $t(this.spec, e, Math.max(
      0,
      t - 250
      /* RegExp.HighlightMargin */
    ), Math.min(i + 250, e.doc.length));
    for (; !r.next().done; )
      s(r.value.from, r.value.to);
  }
}
const Bi = /* @__PURE__ */ E.define(), to = /* @__PURE__ */ E.define(), mt = /* @__PURE__ */ he.define({
  create(n) {
    return new Ds(Pr(n).create(), null);
  },
  update(n, e) {
    for (let t of e.effects)
      t.is(Bi) ? n = new Ds(t.value.create(), n.panel) : t.is(to) && (n = new Ds(n.query, t.value ? io : null));
    return n;
  },
  provide: (n) => Pi.from(n, (e) => e.panel)
});
class Ds {
  constructor(e, t) {
    this.query = e, this.panel = t;
  }
}
const Eg = /* @__PURE__ */ D.mark({ class: "cm-searchMatch" }), Lg = /* @__PURE__ */ D.mark({ class: "cm-searchMatch cm-searchMatch-selected" }), Ng = /* @__PURE__ */ Z.fromClass(class {
  constructor(n) {
    this.view = n, this.decorations = this.highlight(n.state.field(mt));
  }
  update(n) {
    let e = n.state.field(mt);
    (e != n.startState.field(mt) || n.docChanged || n.selectionSet || n.viewportChanged) && (this.decorations = this.highlight(e));
  }
  highlight({ query: n, panel: e }) {
    if (!e || !n.spec.valid)
      return D.none;
    let { view: t } = this, i = new yt();
    for (let s = 0, r = t.visibleRanges, o = r.length; s < o; s++) {
      let { from: l, to: a } = r[s];
      for (; s < o - 1 && a > r[s + 1].from - 2 * 250; )
        a = r[++s].to;
      n.highlight(t.state, l, a, (h, c) => {
        let f = t.state.selection.ranges.some((u) => u.from == h && u.to == c);
        i.add(h, c, f ? Lg : Eg);
      });
    }
    return i.finish();
  }
}, {
  decorations: (n) => n.decorations
});
function zi(n) {
  return (e) => {
    let t = e.state.field(mt, !1);
    return t && t.query.spec.valid ? n(e, t) : Lc(e);
  };
}
const Vn = /* @__PURE__ */ zi((n, { query: e }) => {
  let { to: t } = n.state.selection.main, i = e.nextMatch(n.state, t, t);
  if (!i)
    return !1;
  let s = b.single(i.from, i.to), r = n.state.facet(ni);
  return n.dispatch({
    selection: s,
    effects: [no(n, i), r.scrollToMatch(s.main, n)],
    userEvent: "select.search"
  }), Ec(n), !0;
}), Hn = /* @__PURE__ */ zi((n, { query: e }) => {
  let { state: t } = n, { from: i } = t.selection.main, s = e.prevMatch(t, i, i);
  if (!s)
    return !1;
  let r = b.single(s.from, s.to), o = n.state.facet(ni);
  return n.dispatch({
    selection: r,
    effects: [no(n, s), o.scrollToMatch(r.main, n)],
    userEvent: "select.search"
  }), Ec(n), !0;
}), Ig = /* @__PURE__ */ zi((n, { query: e }) => {
  let t = e.matchAll(n.state, 1e3);
  return !t || !t.length ? !1 : (n.dispatch({
    selection: b.create(t.map((i) => b.range(i.from, i.to))),
    userEvent: "select.search.matches"
  }), !0);
}), Wg = ({ state: n, dispatch: e }) => {
  let t = n.selection;
  if (t.ranges.length > 1 || t.main.empty)
    return !1;
  let { from: i, to: s } = t.main, r = [], o = 0;
  for (let l = new Zt(n.doc, n.sliceDoc(i, s)); !l.next().done; ) {
    if (r.length > 1e3)
      return !1;
    l.value.from == i && (o = r.length), r.push(b.range(l.value.from, l.value.to));
  }
  return e(n.update({
    selection: b.create(r, o),
    userEvent: "select.search.matches"
  })), !0;
}, Ll = /* @__PURE__ */ zi((n, { query: e }) => {
  let { state: t } = n, { from: i, to: s } = t.selection.main;
  if (t.readOnly)
    return !1;
  let r = e.nextMatch(t, i, i);
  if (!r)
    return !1;
  let o = [], l, a, h = [];
  if (r.from == i && r.to == s && (a = t.toText(e.getReplacement(r)), o.push({ from: r.from, to: r.to, insert: a }), r = e.nextMatch(t, r.from, r.to), h.push(T.announce.of(t.phrase("replaced match on line $", t.doc.lineAt(i).number) + "."))), r) {
    let c = o.length == 0 || o[0].from >= r.to ? 0 : r.to - r.from - a.length;
    l = b.single(r.from - c, r.to - c), h.push(no(n, r)), h.push(t.facet(ni).scrollToMatch(l.main, n));
  }
  return n.dispatch({
    changes: o,
    selection: l,
    effects: h,
    userEvent: "input.replace"
  }), !0;
}), $g = /* @__PURE__ */ zi((n, { query: e }) => {
  if (n.state.readOnly)
    return !1;
  let t = e.matchAll(n.state, 1e9).map((s) => {
    let { from: r, to: o } = s;
    return { from: r, to: o, insert: e.getReplacement(s) };
  });
  if (!t.length)
    return !1;
  let i = n.state.phrase("replaced $ matches", t.length) + ".";
  return n.dispatch({
    changes: t,
    effects: T.announce.of(i),
    userEvent: "input.replace.all"
  }), !0;
});
function io(n) {
  return n.state.facet(ni).createPanel(n);
}
function Pr(n, e) {
  var t, i, s, r, o;
  let l = n.selection.main, a = l.empty || l.to > l.from + 100 ? "" : n.sliceDoc(l.from, l.to);
  if (e && !a)
    return e;
  let h = n.facet(ni);
  return new Dc({
    search: ((t = e == null ? void 0 : e.literal) !== null && t !== void 0 ? t : h.literal) ? a : a.replace(/\n/g, "\\n"),
    caseSensitive: (i = e == null ? void 0 : e.caseSensitive) !== null && i !== void 0 ? i : h.caseSensitive,
    literal: (s = e == null ? void 0 : e.literal) !== null && s !== void 0 ? s : h.literal,
    regexp: (r = e == null ? void 0 : e.regexp) !== null && r !== void 0 ? r : h.regexp,
    wholeWord: (o = e == null ? void 0 : e.wholeWord) !== null && o !== void 0 ? o : h.wholeWord
  });
}
function Bc(n) {
  let e = Ti(n, io);
  return e && e.dom.querySelector("[main-field]");
}
function Ec(n) {
  let e = Bc(n);
  e && e == n.root.activeElement && e.select();
}
const Lc = (n) => {
  let e = n.state.field(mt, !1);
  if (e && e.panel) {
    let t = Bc(n);
    if (t && t != n.root.activeElement) {
      let i = Pr(n.state, e.query.spec);
      i.valid && n.dispatch({ effects: Bi.of(i) }), t.focus(), t.select();
    }
  } else
    n.dispatch({ effects: [
      to.of(!0),
      e ? Bi.of(Pr(n.state, e.query.spec)) : E.appendConfig.of(Vg)
    ] });
  return !0;
}, Nc = (n) => {
  let e = n.state.field(mt, !1);
  if (!e || !e.panel)
    return !1;
  let t = Ti(n, io);
  return t && t.dom.contains(n.root.activeElement) && n.focus(), n.dispatch({ effects: to.of(!1) }), !0;
}, Qg = [
  { key: "Mod-f", run: Lc, scope: "editor search-panel" },
  { key: "F3", run: Vn, shift: Hn, scope: "editor search-panel", preventDefault: !0 },
  { key: "Mod-g", run: Vn, shift: Hn, scope: "editor search-panel", preventDefault: !0 },
  { key: "Escape", run: Nc, scope: "editor search-panel" },
  { key: "Mod-Shift-l", run: Wg },
  { key: "Mod-Alt-g", run: yg },
  { key: "Mod-d", run: Tg, preventDefault: !0 }
];
class zg {
  constructor(e) {
    this.view = e;
    let t = this.query = e.state.field(mt).query.spec;
    this.commit = this.commit.bind(this), this.searchField = q("input", {
      value: t.search,
      placeholder: ve(e, "Find"),
      "aria-label": ve(e, "Find"),
      class: "cm-textfield",
      name: "search",
      form: "",
      "main-field": "true",
      onchange: this.commit,
      onkeyup: this.commit
    }), this.replaceField = q("input", {
      value: t.replace,
      placeholder: ve(e, "Replace"),
      "aria-label": ve(e, "Replace"),
      class: "cm-textfield",
      name: "replace",
      form: "",
      onchange: this.commit,
      onkeyup: this.commit
    }), this.caseField = q("input", {
      type: "checkbox",
      name: "case",
      form: "",
      checked: t.caseSensitive,
      onchange: this.commit
    }), this.reField = q("input", {
      type: "checkbox",
      name: "re",
      form: "",
      checked: t.regexp,
      onchange: this.commit
    }), this.wordField = q("input", {
      type: "checkbox",
      name: "word",
      form: "",
      checked: t.wholeWord,
      onchange: this.commit
    });
    function i(s, r, o) {
      return q("button", { class: "cm-button", name: s, onclick: r, type: "button" }, o);
    }
    this.dom = q("div", { onkeydown: (s) => this.keydown(s), class: "cm-search" }, [
      this.searchField,
      i("next", () => Vn(e), [ve(e, "next")]),
      i("prev", () => Hn(e), [ve(e, "previous")]),
      i("select", () => Ig(e), [ve(e, "all")]),
      q("label", null, [this.caseField, ve(e, "match case")]),
      q("label", null, [this.reField, ve(e, "regexp")]),
      q("label", null, [this.wordField, ve(e, "by word")]),
      ...e.state.readOnly ? [] : [
        q("br"),
        this.replaceField,
        i("replace", () => Ll(e), [ve(e, "replace")]),
        i("replaceAll", () => $g(e), [ve(e, "replace all")])
      ],
      q("button", {
        name: "close",
        onclick: () => Nc(e),
        "aria-label": ve(e, "close"),
        type: "button"
      }, ["×"])
    ]);
  }
  commit() {
    let e = new Dc({
      search: this.searchField.value,
      caseSensitive: this.caseField.checked,
      regexp: this.reField.checked,
      wholeWord: this.wordField.checked,
      replace: this.replaceField.value
    });
    e.eq(this.query) || (this.query = e, this.view.dispatch({ effects: Bi.of(e) }));
  }
  keydown(e) {
    _u(this.view, e, "search-panel") ? e.preventDefault() : e.keyCode == 13 && e.target == this.searchField ? (e.preventDefault(), (e.shiftKey ? Hn : Vn)(this.view)) : e.keyCode == 13 && e.target == this.replaceField && (e.preventDefault(), Ll(this.view));
  }
  update(e) {
    for (let t of e.transactions)
      for (let i of t.effects)
        i.is(Bi) && !i.value.eq(this.query) && this.setQuery(i.value);
  }
  setQuery(e) {
    this.query = e, this.searchField.value = e.search, this.replaceField.value = e.replace, this.caseField.checked = e.caseSensitive, this.reField.checked = e.regexp, this.wordField.checked = e.wholeWord;
  }
  mount() {
    this.searchField.select();
  }
  get pos() {
    return 80;
  }
  get top() {
    return this.view.state.facet(ni).top;
  }
}
function ve(n, e) {
  return n.state.phrase(e);
}
const ln = 30, an = /[\s\.,:;?!]/;
function no(n, { from: e, to: t }) {
  let i = n.state.doc.lineAt(e), s = n.state.doc.lineAt(t).to, r = Math.max(i.from, e - ln), o = Math.min(s, t + ln), l = n.state.sliceDoc(r, o);
  if (r != i.from) {
    for (let a = 0; a < ln; a++)
      if (!an.test(l[a + 1]) && an.test(l[a])) {
        l = l.slice(a);
        break;
      }
  }
  if (o != s) {
    for (let a = l.length - 1; a > l.length - ln; a--)
      if (!an.test(l[a - 1]) && an.test(l[a])) {
        l = l.slice(0, a);
        break;
      }
  }
  return T.announce.of(`${n.state.phrase("current match")}. ${l} ${n.state.phrase("on line")} ${i.number}.`);
}
const Fg = /* @__PURE__ */ T.baseTheme({
  ".cm-panel.cm-search": {
    padding: "2px 6px 4px",
    position: "relative",
    "& [name=close]": {
      position: "absolute",
      top: "0",
      right: "4px",
      backgroundColor: "inherit",
      border: "none",
      font: "inherit",
      padding: 0,
      margin: 0
    },
    "& input, & button, & label": {
      margin: ".2em .6em .2em 0"
    },
    "& input[type=checkbox]": {
      marginRight: ".2em"
    },
    "& label": {
      fontSize: "80%",
      whiteSpace: "pre"
    }
  },
  "&light .cm-searchMatch": { backgroundColor: "#ffff0054" },
  "&dark .cm-searchMatch": { backgroundColor: "#00ffff8a" },
  "&light .cm-searchMatch-selected": { backgroundColor: "#ff6a0054" },
  "&dark .cm-searchMatch-selected": { backgroundColor: "#ff00ff8a" }
}), Vg = [
  mt,
  /* @__PURE__ */ ei.low(Ng),
  Fg
];
class Ic {
  /**
  Create a new completion context. (Mostly useful for testing
  completion sources—in the editor, the extension will create
  these for you.)
  */
  constructor(e, t, i) {
    this.state = e, this.pos = t, this.explicit = i, this.abortListeners = [];
  }
  /**
  Get the extent, content, and (if there is a token) type of the
  token before `this.pos`.
  */
  tokenBefore(e) {
    let t = ae(this.state).resolveInner(this.pos, -1);
    for (; t && e.indexOf(t.name) < 0; )
      t = t.parent;
    return t ? {
      from: t.from,
      to: this.pos,
      text: this.state.sliceDoc(t.from, this.pos),
      type: t.type
    } : null;
  }
  /**
  Get the match of the given expression directly before the
  cursor.
  */
  matchBefore(e) {
    let t = this.state.doc.lineAt(this.pos), i = Math.max(t.from, this.pos - 250), s = t.text.slice(i - t.from, this.pos - t.from), r = s.search(Wc(e, !1));
    return r < 0 ? null : { from: i + r, to: this.pos, text: s.slice(r) };
  }
  /**
  Yields true when the query has been aborted. Can be useful in
  asynchronous queries to avoid doing work that will be ignored.
  */
  get aborted() {
    return this.abortListeners == null;
  }
  /**
  Allows you to register abort handlers, which will be called when
  the query is
  [aborted](https://codemirror.net/6/docs/ref/#autocomplete.CompletionContext.aborted).
  */
  addEventListener(e, t) {
    e == "abort" && this.abortListeners && this.abortListeners.push(t);
  }
}
function Nl(n) {
  let e = Object.keys(n).join(""), t = /\w/.test(e);
  return t && (e = e.replace(/\w/g, "")), `[${t ? "\\w" : ""}${e.replace(/[^\w\s]/g, "\\$&")}]`;
}
function Hg(n) {
  let e = /* @__PURE__ */ Object.create(null), t = /* @__PURE__ */ Object.create(null);
  for (let { label: s } of n) {
    e[s[0]] = !0;
    for (let r = 1; r < s.length; r++)
      t[s[r]] = !0;
  }
  let i = Nl(e) + Nl(t) + "*$";
  return [new RegExp("^" + i), new RegExp(i)];
}
function qg(n) {
  let e = n.map((s) => typeof s == "string" ? { label: s } : s), [t, i] = e.every((s) => /^\w+$/.test(s.label)) ? [/\w*$/, /\w+$/] : Hg(e);
  return (s) => {
    let r = s.matchBefore(i);
    return r || s.explicit ? { from: r ? r.from : s.pos, options: e, validFor: t } : null;
  };
}
class Il {
  constructor(e, t, i, s) {
    this.completion = e, this.source = t, this.match = i, this.score = s;
  }
}
function gt(n) {
  return n.selection.main.from;
}
function Wc(n, e) {
  var t;
  let { source: i } = n, s = e && i[0] != "^", r = i[i.length - 1] != "$";
  return !s && !r ? n : new RegExp(`${s ? "^" : ""}(?:${i})${r ? "$" : ""}`, (t = n.flags) !== null && t !== void 0 ? t : n.ignoreCase ? "i" : "");
}
const Ug = /* @__PURE__ */ ot.define();
function Xg(n, e, t, i) {
  let { main: s } = n.selection, r = t - s.from, o = i - s.from;
  return Object.assign(Object.assign({}, n.changeByRange((l) => l != s && t != i && n.sliceDoc(l.from + r, l.from + o) != n.sliceDoc(t, i) ? { range: l } : {
    changes: { from: l.from + r, to: i == s.from ? l.to : l.from + o, insert: e },
    range: b.cursor(l.from + r + e.length)
  })), { scrollIntoView: !0, userEvent: "input.complete" });
}
const Wl = /* @__PURE__ */ new WeakMap();
function jg(n) {
  if (!Array.isArray(n))
    return n;
  let e = Wl.get(n);
  return e || Wl.set(n, e = qg(n)), e;
}
const so = /* @__PURE__ */ E.define(), Ei = /* @__PURE__ */ E.define();
class Gg {
  constructor(e) {
    this.pattern = e, this.chars = [], this.folded = [], this.any = [], this.precise = [], this.byWord = [], this.score = 0, this.matched = [];
    for (let t = 0; t < e.length; ) {
      let i = re(e, t), s = Be(i);
      this.chars.push(i);
      let r = e.slice(t, t + s), o = r.toUpperCase();
      this.folded.push(re(o == r ? r.toLowerCase() : o, 0)), t += s;
    }
    this.astral = e.length != this.chars.length;
  }
  ret(e, t) {
    return this.score = e, this.matched = t, !0;
  }
  // Matches a given word (completion) against the pattern (input).
  // Will return a boolean indicating whether there was a match and,
  // on success, set `this.score` to the score, `this.matched` to an
  // array of `from, to` pairs indicating the matched parts of `word`.
  //
  // The score is a number that is more negative the worse the match
  // is. See `Penalty` above.
  match(e) {
    if (this.pattern.length == 0)
      return this.ret(-100, []);
    if (e.length < this.pattern.length)
      return !1;
    let { chars: t, folded: i, any: s, precise: r, byWord: o } = this;
    if (t.length == 1) {
      let k = re(e, 0), v = Be(k), S = v == e.length ? 0 : -100;
      if (k != t[0])
        if (k == i[0])
          S += -200;
        else
          return !1;
      return this.ret(S, [0, v]);
    }
    let l = e.indexOf(this.pattern);
    if (l == 0)
      return this.ret(e.length == this.pattern.length ? 0 : -100, [0, this.pattern.length]);
    let a = t.length, h = 0;
    if (l < 0) {
      for (let k = 0, v = Math.min(e.length, 200); k < v && h < a; ) {
        let S = re(e, k);
        (S == t[h] || S == i[h]) && (s[h++] = k), k += Be(S);
      }
      if (h < a)
        return !1;
    }
    let c = 0, f = 0, u = !1, d = 0, p = -1, g = -1, m = /[a-z]/.test(e), y = !0;
    for (let k = 0, v = Math.min(e.length, 200), S = 0; k < v && f < a; ) {
      let w = re(e, k);
      l < 0 && (c < a && w == t[c] && (r[c++] = k), d < a && (w == t[d] || w == i[d] ? (d == 0 && (p = k), g = k + 1, d++) : d = 0));
      let A, C = w < 255 ? w >= 48 && w <= 57 || w >= 97 && w <= 122 ? 2 : w >= 65 && w <= 90 ? 1 : 0 : (A = Rr(w)) != A.toLowerCase() ? 1 : A != A.toUpperCase() ? 2 : 0;
      (!k || C == 1 && m || S == 0 && C != 0) && (t[f] == w || i[f] == w && (u = !0) ? o[f++] = k : o.length && (y = !1)), S = C, k += Be(w);
    }
    return f == a && o[0] == 0 && y ? this.result(-100 + (u ? -200 : 0), o, e) : d == a && p == 0 ? this.ret(-200 - e.length + (g == e.length ? 0 : -100), [0, g]) : l > -1 ? this.ret(-700 - e.length, [l, l + this.pattern.length]) : d == a ? this.ret(-900 - e.length, [p, g]) : f == a ? this.result(-100 + (u ? -200 : 0) + -700 + (y ? 0 : -1100), o, e) : t.length == 2 ? !1 : this.result((s[0] ? -700 : 0) + -200 + -1100, s, e);
  }
  result(e, t, i) {
    let s = [], r = 0;
    for (let o of t) {
      let l = o + (this.astral ? Be(re(i, o)) : 1);
      r && s[r - 1] == o ? s[r - 1] = l : (s[r++] = o, s[r++] = l);
    }
    return this.ret(e - i.length, s);
  }
}
const ue = /* @__PURE__ */ M.define({
  combine(n) {
    return Je(n, {
      activateOnTyping: !0,
      selectOnOpen: !0,
      override: null,
      closeOnBlur: !0,
      maxRenderedOptions: 100,
      defaultKeymap: !0,
      tooltipClass: () => "",
      optionClass: () => "",
      aboveCursor: !1,
      icons: !0,
      addToOptions: [],
      positionInfo: Kg,
      compareCompletions: (e, t) => e.label.localeCompare(t.label),
      interactionDelay: 75,
      updateSyncTime: 100
    }, {
      defaultKeymap: (e, t) => e && t,
      closeOnBlur: (e, t) => e && t,
      icons: (e, t) => e && t,
      tooltipClass: (e, t) => (i) => $l(e(i), t(i)),
      optionClass: (e, t) => (i) => $l(e(i), t(i)),
      addToOptions: (e, t) => e.concat(t)
    });
  }
});
function $l(n, e) {
  return n ? e ? n + " " + e : n : e;
}
function Kg(n, e, t, i, s, r) {
  let o = n.textDirection == K.RTL, l = o, a = !1, h = "top", c, f, u = e.left - s.left, d = s.right - e.right, p = i.right - i.left, g = i.bottom - i.top;
  if (l && u < Math.min(p, d) ? l = !1 : !l && d < Math.min(p, u) && (l = !0), p <= (l ? u : d))
    c = Math.max(s.top, Math.min(t.top, s.bottom - g)) - e.top, f = Math.min(400, l ? u : d);
  else {
    a = !0, f = Math.min(
      400,
      (o ? e.right : s.right - e.left) - 30
      /* Info.Margin */
    );
    let k = s.bottom - e.bottom;
    k >= g || k > e.top ? c = t.bottom - e.top : (h = "bottom", c = e.bottom - t.top);
  }
  let m = (e.bottom - e.top) / r.offsetHeight, y = (e.right - e.left) / r.offsetWidth;
  return {
    style: `${h}: ${c / m}px; max-width: ${f / y}px`,
    class: "cm-completionInfo-" + (a ? o ? "left-narrow" : "right-narrow" : l ? "left" : "right")
  };
}
function _g(n) {
  let e = n.addToOptions.slice();
  return n.icons && e.push({
    render(t) {
      let i = document.createElement("div");
      return i.classList.add("cm-completionIcon"), t.type && i.classList.add(...t.type.split(/\s+/g).map((s) => "cm-completionIcon-" + s)), i.setAttribute("aria-hidden", "true"), i;
    },
    position: 20
  }), e.push({
    render(t, i, s, r) {
      let o = document.createElement("span");
      o.className = "cm-completionLabel";
      let l = t.displayLabel || t.label, a = 0;
      for (let h = 0; h < r.length; ) {
        let c = r[h++], f = r[h++];
        c > a && o.appendChild(document.createTextNode(l.slice(a, c)));
        let u = o.appendChild(document.createElement("span"));
        u.appendChild(document.createTextNode(l.slice(c, f))), u.className = "cm-completionMatchedText", a = f;
      }
      return a < l.length && o.appendChild(document.createTextNode(l.slice(a))), o;
    },
    position: 50
  }, {
    render(t) {
      if (!t.detail)
        return null;
      let i = document.createElement("span");
      return i.className = "cm-completionDetail", i.textContent = t.detail, i;
    },
    position: 80
  }), e.sort((t, i) => t.position - i.position).map((t) => t.render);
}
function Rs(n, e, t) {
  if (n <= t)
    return { from: 0, to: n };
  if (e < 0 && (e = 0), e <= n >> 1) {
    let s = Math.floor(e / t);
    return { from: s * t, to: (s + 1) * t };
  }
  let i = Math.floor((n - e) / t);
  return { from: n - (i + 1) * t, to: n - i * t };
}
class Yg {
  constructor(e, t, i) {
    this.view = e, this.stateField = t, this.applyCompletion = i, this.info = null, this.infoDestroy = null, this.placeInfoReq = {
      read: () => this.measureInfo(),
      write: (a) => this.placeInfo(a),
      key: this
    }, this.space = null, this.currentClass = "";
    let s = e.state.field(t), { options: r, selected: o } = s.open, l = e.state.facet(ue);
    this.optionContent = _g(l), this.optionClass = l.optionClass, this.tooltipClass = l.tooltipClass, this.range = Rs(r.length, o, l.maxRenderedOptions), this.dom = document.createElement("div"), this.dom.className = "cm-tooltip-autocomplete", this.updateTooltipClass(e.state), this.dom.addEventListener("mousedown", (a) => {
      let { options: h } = e.state.field(t).open;
      for (let c = a.target, f; c && c != this.dom; c = c.parentNode)
        if (c.nodeName == "LI" && (f = /-(\d+)$/.exec(c.id)) && +f[1] < h.length) {
          this.applyCompletion(e, h[+f[1]]), a.preventDefault();
          return;
        }
    }), this.dom.addEventListener("focusout", (a) => {
      let h = e.state.field(this.stateField, !1);
      h && h.tooltip && e.state.facet(ue).closeOnBlur && a.relatedTarget != e.contentDOM && e.dispatch({ effects: Ei.of(null) });
    }), this.showOptions(r, s.id);
  }
  mount() {
    this.updateSel();
  }
  showOptions(e, t) {
    this.list && this.list.remove(), this.list = this.dom.appendChild(this.createListBox(e, t, this.range)), this.list.addEventListener("scroll", () => {
      this.info && this.view.requestMeasure(this.placeInfoReq);
    });
  }
  update(e) {
    var t;
    let i = e.state.field(this.stateField), s = e.startState.field(this.stateField);
    if (this.updateTooltipClass(e.state), i != s) {
      let { options: r, selected: o, disabled: l } = i.open;
      (!s.open || s.open.options != r) && (this.range = Rs(r.length, o, e.state.facet(ue).maxRenderedOptions), this.showOptions(r, i.id)), this.updateSel(), l != ((t = s.open) === null || t === void 0 ? void 0 : t.disabled) && this.dom.classList.toggle("cm-tooltip-autocomplete-disabled", !!l);
    }
  }
  updateTooltipClass(e) {
    let t = this.tooltipClass(e);
    if (t != this.currentClass) {
      for (let i of this.currentClass.split(" "))
        i && this.dom.classList.remove(i);
      for (let i of t.split(" "))
        i && this.dom.classList.add(i);
      this.currentClass = t;
    }
  }
  positioned(e) {
    this.space = e, this.info && this.view.requestMeasure(this.placeInfoReq);
  }
  updateSel() {
    let e = this.view.state.field(this.stateField), t = e.open;
    if ((t.selected > -1 && t.selected < this.range.from || t.selected >= this.range.to) && (this.range = Rs(t.options.length, t.selected, this.view.state.facet(ue).maxRenderedOptions), this.showOptions(t.options, e.id)), this.updateSelectedOption(t.selected)) {
      this.destroyInfo();
      let { completion: i } = t.options[t.selected], { info: s } = i;
      if (!s)
        return;
      let r = typeof s == "string" ? document.createTextNode(s) : s(i);
      if (!r)
        return;
      "then" in r ? r.then((o) => {
        o && this.view.state.field(this.stateField, !1) == e && this.addInfoPane(o, i);
      }).catch((o) => Le(this.view.state, o, "completion info")) : this.addInfoPane(r, i);
    }
  }
  addInfoPane(e, t) {
    this.destroyInfo();
    let i = this.info = document.createElement("div");
    if (i.className = "cm-tooltip cm-completionInfo", e.nodeType != null)
      i.appendChild(e), this.infoDestroy = null;
    else {
      let { dom: s, destroy: r } = e;
      i.appendChild(s), this.infoDestroy = r || null;
    }
    this.dom.appendChild(i), this.view.requestMeasure(this.placeInfoReq);
  }
  updateSelectedOption(e) {
    let t = null;
    for (let i = this.list.firstChild, s = this.range.from; i; i = i.nextSibling, s++)
      i.nodeName != "LI" || !i.id ? s-- : s == e ? i.hasAttribute("aria-selected") || (i.setAttribute("aria-selected", "true"), t = i) : i.hasAttribute("aria-selected") && i.removeAttribute("aria-selected");
    return t && Jg(this.list, t), t;
  }
  measureInfo() {
    let e = this.dom.querySelector("[aria-selected]");
    if (!e || !this.info)
      return null;
    let t = this.dom.getBoundingClientRect(), i = this.info.getBoundingClientRect(), s = e.getBoundingClientRect(), r = this.space;
    if (!r) {
      let o = this.dom.ownerDocument.defaultView || window;
      r = { left: 0, top: 0, right: o.innerWidth, bottom: o.innerHeight };
    }
    return s.top > Math.min(r.bottom, t.bottom) - 10 || s.bottom < Math.max(r.top, t.top) + 10 ? null : this.view.state.facet(ue).positionInfo(this.view, t, s, i, r, this.dom);
  }
  placeInfo(e) {
    this.info && (e ? (e.style && (this.info.style.cssText = e.style), this.info.className = "cm-tooltip cm-completionInfo " + (e.class || "")) : this.info.style.cssText = "top: -1e6px");
  }
  createListBox(e, t, i) {
    const s = document.createElement("ul");
    s.id = t, s.setAttribute("role", "listbox"), s.setAttribute("aria-expanded", "true"), s.setAttribute("aria-label", this.view.state.phrase("Completions"));
    let r = null;
    for (let o = i.from; o < i.to; o++) {
      let { completion: l, match: a } = e[o], { section: h } = l;
      if (h) {
        let u = typeof h == "string" ? h : h.name;
        if (u != r && (o > i.from || i.from == 0))
          if (r = u, typeof h != "string" && h.header)
            s.appendChild(h.header(h));
          else {
            let d = s.appendChild(document.createElement("completion-section"));
            d.textContent = u;
          }
      }
      const c = s.appendChild(document.createElement("li"));
      c.id = t + "-" + o, c.setAttribute("role", "option");
      let f = this.optionClass(l);
      f && (c.className = f);
      for (let u of this.optionContent) {
        let d = u(l, this.view.state, this.view, a);
        d && c.appendChild(d);
      }
    }
    return i.from && s.classList.add("cm-completionListIncompleteTop"), i.to < e.length && s.classList.add("cm-completionListIncompleteBottom"), s;
  }
  destroyInfo() {
    this.info && (this.infoDestroy && this.infoDestroy(), this.info.remove(), this.info = null);
  }
  destroy() {
    this.destroyInfo();
  }
}
function Zg(n, e) {
  return (t) => new Yg(t, n, e);
}
function Jg(n, e) {
  let t = n.getBoundingClientRect(), i = e.getBoundingClientRect(), s = t.height / n.offsetHeight;
  i.top < t.top ? n.scrollTop -= (t.top - i.top) / s : i.bottom > t.bottom && (n.scrollTop += (i.bottom - t.bottom) / s);
}
function Ql(n) {
  return (n.boost || 0) * 100 + (n.apply ? 10 : 0) + (n.info ? 5 : 0) + (n.type ? 1 : 0);
}
function e0(n, e) {
  let t = [], i = null, s = (a) => {
    t.push(a);
    let { section: h } = a.completion;
    if (h) {
      i || (i = []);
      let c = typeof h == "string" ? h : h.name;
      i.some((f) => f.name == c) || i.push(typeof h == "string" ? { name: c } : h);
    }
  };
  for (let a of n)
    if (a.hasResult()) {
      let h = a.result.getMatch;
      if (a.result.filter === !1)
        for (let c of a.result.options)
          s(new Il(c, a.source, h ? h(c) : [], 1e9 - t.length));
      else {
        let c = new Gg(e.sliceDoc(a.from, a.to));
        for (let f of a.result.options)
          if (c.match(f.label)) {
            let u = f.displayLabel ? h ? h(f, c.matched) : [] : c.matched;
            s(new Il(f, a.source, u, c.score + (f.boost || 0)));
          }
      }
    }
  if (i) {
    let a = /* @__PURE__ */ Object.create(null), h = 0, c = (f, u) => {
      var d, p;
      return ((d = f.rank) !== null && d !== void 0 ? d : 1e9) - ((p = u.rank) !== null && p !== void 0 ? p : 1e9) || (f.name < u.name ? -1 : 1);
    };
    for (let f of i.sort(c))
      h -= 1e5, a[f.name] = h;
    for (let f of t) {
      let { section: u } = f.completion;
      u && (f.score += a[typeof u == "string" ? u : u.name]);
    }
  }
  let r = [], o = null, l = e.facet(ue).compareCompletions;
  for (let a of t.sort((h, c) => c.score - h.score || l(h.completion, c.completion))) {
    let h = a.completion;
    !o || o.label != h.label || o.detail != h.detail || o.type != null && h.type != null && o.type != h.type || o.apply != h.apply || o.boost != h.boost ? r.push(a) : Ql(a.completion) > Ql(o) && (r[r.length - 1] = a), o = a.completion;
  }
  return r;
}
class Ft {
  constructor(e, t, i, s, r, o) {
    this.options = e, this.attrs = t, this.tooltip = i, this.timestamp = s, this.selected = r, this.disabled = o;
  }
  setSelected(e, t) {
    return e == this.selected || e >= this.options.length ? this : new Ft(this.options, zl(t, e), this.tooltip, this.timestamp, e, this.disabled);
  }
  static build(e, t, i, s, r) {
    let o = e0(e, t);
    if (!o.length)
      return s && e.some(
        (a) => a.state == 1
        /* State.Pending */
      ) ? new Ft(s.options, s.attrs, s.tooltip, s.timestamp, s.selected, !0) : null;
    let l = t.facet(ue).selectOnOpen ? 0 : -1;
    if (s && s.selected != l && s.selected != -1) {
      let a = s.options[s.selected].completion;
      for (let h = 0; h < o.length; h++)
        if (o[h].completion == a) {
          l = h;
          break;
        }
    }
    return new Ft(o, zl(i, l), {
      pos: e.reduce((a, h) => h.hasResult() ? Math.min(a, h.from) : a, 1e8),
      create: r0,
      above: r.aboveCursor
    }, s ? s.timestamp : Date.now(), l, !1);
  }
  map(e) {
    return new Ft(this.options, this.attrs, Object.assign(Object.assign({}, this.tooltip), { pos: e.mapPos(this.tooltip.pos) }), this.timestamp, this.selected, this.disabled);
  }
}
class qn {
  constructor(e, t, i) {
    this.active = e, this.id = t, this.open = i;
  }
  static start() {
    return new qn(n0, "cm-ac-" + Math.floor(Math.random() * 2e6).toString(36), null);
  }
  update(e) {
    let { state: t } = e, i = t.facet(ue), r = (i.override || t.languageDataAt("autocomplete", gt(t)).map(jg)).map((l) => (this.active.find((h) => h.source == l) || new xe(
      l,
      this.active.some(
        (h) => h.state != 0
        /* State.Inactive */
      ) ? 1 : 0
      /* State.Inactive */
    )).update(e, i));
    r.length == this.active.length && r.every((l, a) => l == this.active[a]) && (r = this.active);
    let o = this.open;
    o && e.docChanged && (o = o.map(e.changes)), e.selection || r.some((l) => l.hasResult() && e.changes.touchesRange(l.from, l.to)) || !t0(r, this.active) ? o = Ft.build(r, t, this.id, o, i) : o && o.disabled && !r.some(
      (l) => l.state == 1
      /* State.Pending */
    ) && (o = null), !o && r.every(
      (l) => l.state != 1
      /* State.Pending */
    ) && r.some((l) => l.hasResult()) && (r = r.map((l) => l.hasResult() ? new xe(
      l.source,
      0
      /* State.Inactive */
    ) : l));
    for (let l of e.effects)
      l.is(Qc) && (o = o && o.setSelected(l.value, this.id));
    return r == this.active && o == this.open ? this : new qn(r, this.id, o);
  }
  get tooltip() {
    return this.open ? this.open.tooltip : null;
  }
  get attrs() {
    return this.open ? this.open.attrs : i0;
  }
}
function t0(n, e) {
  if (n == e)
    return !0;
  for (let t = 0, i = 0; ; ) {
    for (; t < n.length && !n[t].hasResult; )
      t++;
    for (; i < e.length && !e[i].hasResult; )
      i++;
    let s = t == n.length, r = i == e.length;
    if (s || r)
      return s == r;
    if (n[t++].result != e[i++].result)
      return !1;
  }
}
const i0 = {
  "aria-autocomplete": "list"
};
function zl(n, e) {
  let t = {
    "aria-autocomplete": "list",
    "aria-haspopup": "listbox",
    "aria-controls": n
  };
  return e > -1 && (t["aria-activedescendant"] = n + "-" + e), t;
}
const n0 = [];
function Dr(n) {
  return n.isUserEvent("input.type") ? "input" : n.isUserEvent("delete.backward") ? "delete" : null;
}
class xe {
  constructor(e, t, i = -1) {
    this.source = e, this.state = t, this.explicitPos = i;
  }
  hasResult() {
    return !1;
  }
  update(e, t) {
    let i = Dr(e), s = this;
    i ? s = s.handleUserEvent(e, i, t) : e.docChanged ? s = s.handleChange(e) : e.selection && s.state != 0 && (s = new xe(
      s.source,
      0
      /* State.Inactive */
    ));
    for (let r of e.effects)
      if (r.is(so))
        s = new xe(s.source, 1, r.value ? gt(e.state) : -1);
      else if (r.is(Ei))
        s = new xe(
          s.source,
          0
          /* State.Inactive */
        );
      else if (r.is($c))
        for (let o of r.value)
          o.source == s.source && (s = o);
    return s;
  }
  handleUserEvent(e, t, i) {
    return t == "delete" || !i.activateOnTyping ? this.map(e.changes) : new xe(
      this.source,
      1
      /* State.Pending */
    );
  }
  handleChange(e) {
    return e.changes.touchesRange(gt(e.startState)) ? new xe(
      this.source,
      0
      /* State.Inactive */
    ) : this.map(e.changes);
  }
  map(e) {
    return e.empty || this.explicitPos < 0 ? this : new xe(this.source, this.state, e.mapPos(this.explicitPos));
  }
}
class jt extends xe {
  constructor(e, t, i, s, r) {
    super(e, 2, t), this.result = i, this.from = s, this.to = r;
  }
  hasResult() {
    return !0;
  }
  handleUserEvent(e, t, i) {
    var s;
    let r = e.changes.mapPos(this.from), o = e.changes.mapPos(this.to, 1), l = gt(e.state);
    if ((this.explicitPos < 0 ? l <= r : l < this.from) || l > o || t == "delete" && gt(e.startState) == this.from)
      return new xe(
        this.source,
        t == "input" && i.activateOnTyping ? 1 : 0
        /* State.Inactive */
      );
    let a = this.explicitPos < 0 ? -1 : e.changes.mapPos(this.explicitPos), h;
    return s0(this.result.validFor, e.state, r, o) ? new jt(this.source, a, this.result, r, o) : this.result.update && (h = this.result.update(this.result, r, o, new Ic(e.state, l, a >= 0))) ? new jt(this.source, a, h, h.from, (s = h.to) !== null && s !== void 0 ? s : gt(e.state)) : new xe(this.source, 1, a);
  }
  handleChange(e) {
    return e.changes.touchesRange(this.from, this.to) ? new xe(
      this.source,
      0
      /* State.Inactive */
    ) : this.map(e.changes);
  }
  map(e) {
    return e.empty ? this : new jt(this.source, this.explicitPos < 0 ? -1 : e.mapPos(this.explicitPos), this.result, e.mapPos(this.from), e.mapPos(this.to, 1));
  }
}
function s0(n, e, t, i) {
  if (!n)
    return !1;
  let s = e.sliceDoc(t, i);
  return typeof n == "function" ? n(s, t, i, e) : Wc(n, !0).test(s);
}
const $c = /* @__PURE__ */ E.define({
  map(n, e) {
    return n.map((t) => t.map(e));
  }
}), Qc = /* @__PURE__ */ E.define(), Me = /* @__PURE__ */ he.define({
  create() {
    return qn.start();
  },
  update(n, e) {
    return n.update(e);
  },
  provide: (n) => [
    Vr.from(n, (e) => e.tooltip),
    T.contentAttributes.from(n, (e) => e.attrs)
  ]
});
function zc(n, e) {
  const t = e.completion.apply || e.completion.label;
  let i = n.state.field(Me).active.find((s) => s.source == e.source);
  return i instanceof jt ? (typeof t == "string" ? n.dispatch(Object.assign(Object.assign({}, Xg(n.state, t, i.from, i.to)), { annotations: Ug.of(e.completion) })) : t(n, e.completion, i.from, i.to), !0) : !1;
}
const r0 = /* @__PURE__ */ Zg(Me, zc);
function hn(n, e = "option") {
  return (t) => {
    let i = t.state.field(Me, !1);
    if (!i || !i.open || i.open.disabled || Date.now() - i.open.timestamp < t.state.facet(ue).interactionDelay)
      return !1;
    let s = 1, r;
    e == "page" && (r = Oh(t, i.open.tooltip)) && (s = Math.max(2, Math.floor(r.dom.offsetHeight / r.dom.querySelector("li").offsetHeight) - 1));
    let { length: o } = i.open.options, l = i.open.selected > -1 ? i.open.selected + s * (n ? 1 : -1) : n ? 0 : o - 1;
    return l < 0 ? l = e == "page" ? 0 : o - 1 : l >= o && (l = e == "page" ? o - 1 : 0), t.dispatch({ effects: Qc.of(l) }), !0;
  };
}
const o0 = (n) => {
  let e = n.state.field(Me, !1);
  return n.state.readOnly || !e || !e.open || e.open.selected < 0 || e.open.disabled || Date.now() - e.open.timestamp < n.state.facet(ue).interactionDelay ? !1 : zc(n, e.open.options[e.open.selected]);
}, l0 = (n) => n.state.field(Me, !1) ? (n.dispatch({ effects: so.of(!0) }), !0) : !1, a0 = (n) => {
  let e = n.state.field(Me, !1);
  return !e || !e.active.some(
    (t) => t.state != 0
    /* State.Inactive */
  ) ? !1 : (n.dispatch({ effects: Ei.of(null) }), !0);
};
class h0 {
  constructor(e, t) {
    this.active = e, this.context = t, this.time = Date.now(), this.updates = [], this.done = void 0;
  }
}
const c0 = 50, f0 = 1e3, u0 = /* @__PURE__ */ Z.fromClass(class {
  constructor(n) {
    this.view = n, this.debounceUpdate = -1, this.running = [], this.debounceAccept = -1, this.composing = 0;
    for (let e of n.state.field(Me).active)
      e.state == 1 && this.startQuery(e);
  }
  update(n) {
    let e = n.state.field(Me);
    if (!n.selectionSet && !n.docChanged && n.startState.field(Me) == e)
      return;
    let t = n.transactions.some((i) => (i.selection || i.docChanged) && !Dr(i));
    for (let i = 0; i < this.running.length; i++) {
      let s = this.running[i];
      if (t || s.updates.length + n.transactions.length > c0 && Date.now() - s.time > f0) {
        for (let r of s.context.abortListeners)
          try {
            r();
          } catch (o) {
            Le(this.view.state, o);
          }
        s.context.abortListeners = null, this.running.splice(i--, 1);
      } else
        s.updates.push(...n.transactions);
    }
    if (this.debounceUpdate > -1 && clearTimeout(this.debounceUpdate), this.debounceUpdate = e.active.some((i) => i.state == 1 && !this.running.some((s) => s.active.source == i.source)) ? setTimeout(() => this.startUpdate(), 50) : -1, this.composing != 0)
      for (let i of n.transactions)
        Dr(i) == "input" ? this.composing = 2 : this.composing == 2 && i.selection && (this.composing = 3);
  }
  startUpdate() {
    this.debounceUpdate = -1;
    let { state: n } = this.view, e = n.field(Me);
    for (let t of e.active)
      t.state == 1 && !this.running.some((i) => i.active.source == t.source) && this.startQuery(t);
  }
  startQuery(n) {
    let { state: e } = this.view, t = gt(e), i = new Ic(e, t, n.explicitPos == t), s = new h0(n, i);
    this.running.push(s), Promise.resolve(n.source(i)).then((r) => {
      s.context.aborted || (s.done = r || null, this.scheduleAccept());
    }, (r) => {
      this.view.dispatch({ effects: Ei.of(null) }), Le(this.view.state, r);
    });
  }
  scheduleAccept() {
    this.running.every((n) => n.done !== void 0) ? this.accept() : this.debounceAccept < 0 && (this.debounceAccept = setTimeout(() => this.accept(), this.view.state.facet(ue).updateSyncTime));
  }
  // For each finished query in this.running, try to create a result
  // or, if appropriate, restart the query.
  accept() {
    var n;
    this.debounceAccept > -1 && clearTimeout(this.debounceAccept), this.debounceAccept = -1;
    let e = [], t = this.view.state.facet(ue);
    for (let i = 0; i < this.running.length; i++) {
      let s = this.running[i];
      if (s.done === void 0)
        continue;
      if (this.running.splice(i--, 1), s.done) {
        let o = new jt(s.active.source, s.active.explicitPos, s.done, s.done.from, (n = s.done.to) !== null && n !== void 0 ? n : gt(s.updates.length ? s.updates[0].startState : this.view.state));
        for (let l of s.updates)
          o = o.update(l, t);
        if (o.hasResult()) {
          e.push(o);
          continue;
        }
      }
      let r = this.view.state.field(Me).active.find((o) => o.source == s.active.source);
      if (r && r.state == 1)
        if (s.done == null) {
          let o = new xe(
            s.active.source,
            0
            /* State.Inactive */
          );
          for (let l of s.updates)
            o = o.update(l, t);
          o.state != 1 && e.push(o);
        } else
          this.startQuery(r);
    }
    e.length && this.view.dispatch({ effects: $c.of(e) });
  }
}, {
  eventHandlers: {
    blur(n) {
      let e = this.view.state.field(Me, !1);
      if (e && e.tooltip && this.view.state.facet(ue).closeOnBlur) {
        let t = e.open && Oh(this.view, e.open.tooltip);
        (!t || !t.dom.contains(n.relatedTarget)) && this.view.dispatch({ effects: Ei.of(null) });
      }
    },
    compositionstart() {
      this.composing = 1;
    },
    compositionend() {
      this.composing == 3 && setTimeout(() => this.view.dispatch({ effects: so.of(!1) }), 20), this.composing = 0;
    }
  }
}), d0 = /* @__PURE__ */ T.baseTheme({
  ".cm-tooltip.cm-tooltip-autocomplete": {
    "& > ul": {
      fontFamily: "monospace",
      whiteSpace: "nowrap",
      overflow: "hidden auto",
      maxWidth_fallback: "700px",
      maxWidth: "min(700px, 95vw)",
      minWidth: "250px",
      maxHeight: "10em",
      height: "100%",
      listStyle: "none",
      margin: 0,
      padding: 0,
      "& > li, & > completion-section": {
        padding: "1px 3px",
        lineHeight: 1.2
      },
      "& > li": {
        overflowX: "hidden",
        textOverflow: "ellipsis",
        cursor: "pointer"
      },
      "& > completion-section": {
        display: "list-item",
        borderBottom: "1px solid silver",
        paddingLeft: "0.5em",
        opacity: 0.7
      }
    }
  },
  "&light .cm-tooltip-autocomplete ul li[aria-selected]": {
    background: "#17c",
    color: "white"
  },
  "&light .cm-tooltip-autocomplete-disabled ul li[aria-selected]": {
    background: "#777"
  },
  "&dark .cm-tooltip-autocomplete ul li[aria-selected]": {
    background: "#347",
    color: "white"
  },
  "&dark .cm-tooltip-autocomplete-disabled ul li[aria-selected]": {
    background: "#444"
  },
  ".cm-completionListIncompleteTop:before, .cm-completionListIncompleteBottom:after": {
    content: '"···"',
    opacity: 0.5,
    display: "block",
    textAlign: "center"
  },
  ".cm-tooltip.cm-completionInfo": {
    position: "absolute",
    padding: "3px 9px",
    width: "max-content",
    maxWidth: "400px",
    boxSizing: "border-box"
  },
  ".cm-completionInfo.cm-completionInfo-left": { right: "100%" },
  ".cm-completionInfo.cm-completionInfo-right": { left: "100%" },
  ".cm-completionInfo.cm-completionInfo-left-narrow": { right: "30px" },
  ".cm-completionInfo.cm-completionInfo-right-narrow": { left: "30px" },
  "&light .cm-snippetField": { backgroundColor: "#00000022" },
  "&dark .cm-snippetField": { backgroundColor: "#ffffff22" },
  ".cm-snippetFieldPosition": {
    verticalAlign: "text-top",
    width: 0,
    height: "1.15em",
    display: "inline-block",
    margin: "0 -0.7px -.7em",
    borderLeft: "1.4px dotted #888"
  },
  ".cm-completionMatchedText": {
    textDecoration: "underline"
  },
  ".cm-completionDetail": {
    marginLeft: "0.5em",
    fontStyle: "italic"
  },
  ".cm-completionIcon": {
    fontSize: "90%",
    width: ".8em",
    display: "inline-block",
    textAlign: "center",
    paddingRight: ".6em",
    opacity: "0.6",
    boxSizing: "content-box"
  },
  ".cm-completionIcon-function, .cm-completionIcon-method": {
    "&:after": { content: "'ƒ'" }
  },
  ".cm-completionIcon-class": {
    "&:after": { content: "'○'" }
  },
  ".cm-completionIcon-interface": {
    "&:after": { content: "'◌'" }
  },
  ".cm-completionIcon-variable": {
    "&:after": { content: "'𝑥'" }
  },
  ".cm-completionIcon-constant": {
    "&:after": { content: "'𝐶'" }
  },
  ".cm-completionIcon-type": {
    "&:after": { content: "'𝑡'" }
  },
  ".cm-completionIcon-enum": {
    "&:after": { content: "'∪'" }
  },
  ".cm-completionIcon-property": {
    "&:after": { content: "'□'" }
  },
  ".cm-completionIcon-keyword": {
    "&:after": { content: "'🔑︎'" }
    // Disable emoji rendering
  },
  ".cm-completionIcon-namespace": {
    "&:after": { content: "'▢'" }
  },
  ".cm-completionIcon-text": {
    "&:after": { content: "'abc'", fontSize: "50%", verticalAlign: "middle" }
  }
}), Li = {
  brackets: ["(", "[", "{", "'", '"'],
  before: ")]}:;>",
  stringPrefixes: []
}, Dt = /* @__PURE__ */ E.define({
  map(n, e) {
    let t = e.mapPos(n, -1, pe.TrackAfter);
    return t ?? void 0;
  }
}), ro = /* @__PURE__ */ new class extends Bt {
}();
ro.startSide = 1;
ro.endSide = -1;
const Fc = /* @__PURE__ */ he.define({
  create() {
    return F.empty;
  },
  update(n, e) {
    if (n = n.map(e.changes), e.selection) {
      let t = e.state.doc.lineAt(e.selection.main.head);
      n = n.update({ filter: (i) => i >= t.from && i <= t.to });
    }
    for (let t of e.effects)
      t.is(Dt) && (n = n.update({ add: [ro.range(t.value, t.value + 1)] }));
    return n;
  }
});
function p0() {
  return [g0, Fc];
}
const Bs = "()[]{}<>";
function Vc(n) {
  for (let e = 0; e < Bs.length; e += 2)
    if (Bs.charCodeAt(e) == n)
      return Bs.charAt(e + 1);
  return Rr(n < 128 ? n : n + 1);
}
function Hc(n, e) {
  return n.languageDataAt("closeBrackets", e)[0] || Li;
}
const m0 = typeof navigator == "object" && /* @__PURE__ */ /Android\b/.test(navigator.userAgent), g0 = /* @__PURE__ */ T.inputHandler.of((n, e, t, i) => {
  if ((m0 ? n.composing : n.compositionStarted) || n.state.readOnly)
    return !1;
  let s = n.state.selection.main;
  if (i.length > 2 || i.length == 2 && Be(re(i, 0)) == 1 || e != s.from || t != s.to)
    return !1;
  let r = x0(n.state, i);
  return r ? (n.dispatch(r), !0) : !1;
}), y0 = ({ state: n, dispatch: e }) => {
  if (n.readOnly)
    return !1;
  let i = Hc(n, n.selection.main.head).brackets || Li.brackets, s = null, r = n.changeByRange((o) => {
    if (o.empty) {
      let l = w0(n.doc, o.head);
      for (let a of i)
        if (a == l && ls(n.doc, o.head) == Vc(re(a, 0)))
          return {
            changes: { from: o.head - a.length, to: o.head + a.length },
            range: b.cursor(o.head - a.length)
          };
    }
    return { range: s = o };
  });
  return s || e(n.update(r, { scrollIntoView: !0, userEvent: "delete.backward" })), !s;
}, b0 = [
  { key: "Backspace", run: y0 }
];
function x0(n, e) {
  let t = Hc(n, n.selection.main.head), i = t.brackets || Li.brackets;
  for (let s of i) {
    let r = Vc(re(s, 0));
    if (e == s)
      return r == s ? S0(n, s, i.indexOf(s + s + s) > -1, t) : k0(n, s, r, t.before || Li.before);
    if (e == r && qc(n, n.selection.main.from))
      return O0(n, s, r);
  }
  return null;
}
function qc(n, e) {
  let t = !1;
  return n.field(Fc).between(0, n.doc.length, (i) => {
    i == e && (t = !0);
  }), t;
}
function ls(n, e) {
  let t = n.sliceString(e, e + 2);
  return t.slice(0, Be(re(t, 0)));
}
function w0(n, e) {
  let t = n.sliceString(e - 2, e);
  return Be(re(t, 0)) == t.length ? t : t.slice(1);
}
function k0(n, e, t, i) {
  let s = null, r = n.changeByRange((o) => {
    if (!o.empty)
      return {
        changes: [{ insert: e, from: o.from }, { insert: t, from: o.to }],
        effects: Dt.of(o.to + e.length),
        range: b.range(o.anchor + e.length, o.head + e.length)
      };
    let l = ls(n.doc, o.head);
    return !l || /\s/.test(l) || i.indexOf(l) > -1 ? {
      changes: { insert: e + t, from: o.head },
      effects: Dt.of(o.head + e.length),
      range: b.cursor(o.head + e.length)
    } : { range: s = o };
  });
  return s ? null : n.update(r, {
    scrollIntoView: !0,
    userEvent: "input.type"
  });
}
function O0(n, e, t) {
  let i = null, s = n.changeByRange((r) => r.empty && ls(n.doc, r.head) == t ? {
    changes: { from: r.head, to: r.head + t.length, insert: t },
    range: b.cursor(r.head + t.length)
  } : i = { range: r });
  return i ? null : n.update(s, {
    scrollIntoView: !0,
    userEvent: "input.type"
  });
}
function S0(n, e, t, i) {
  let s = i.stringPrefixes || Li.stringPrefixes, r = null, o = n.changeByRange((l) => {
    if (!l.empty)
      return {
        changes: [{ insert: e, from: l.from }, { insert: e, from: l.to }],
        effects: Dt.of(l.to + e.length),
        range: b.range(l.anchor + e.length, l.head + e.length)
      };
    let a = l.head, h = ls(n.doc, a), c;
    if (h == e) {
      if (Fl(n, a))
        return {
          changes: { insert: e + e, from: a },
          effects: Dt.of(a + e.length),
          range: b.cursor(a + e.length)
        };
      if (qc(n, a)) {
        let u = t && n.sliceDoc(a, a + e.length * 3) == e + e + e ? e + e + e : e;
        return {
          changes: { from: a, to: a + u.length, insert: u },
          range: b.cursor(a + u.length)
        };
      }
    } else {
      if (t && n.sliceDoc(a - 2 * e.length, a) == e + e && (c = Vl(n, a - 2 * e.length, s)) > -1 && Fl(n, c))
        return {
          changes: { insert: e + e + e + e, from: a },
          effects: Dt.of(a + e.length),
          range: b.cursor(a + e.length)
        };
      if (n.charCategorizer(a)(h) != j.Word && Vl(n, a, s) > -1 && !v0(n, a, e, s))
        return {
          changes: { insert: e + e, from: a },
          effects: Dt.of(a + e.length),
          range: b.cursor(a + e.length)
        };
    }
    return { range: r = l };
  });
  return r ? null : n.update(o, {
    scrollIntoView: !0,
    userEvent: "input.type"
  });
}
function Fl(n, e) {
  let t = ae(n).resolveInner(e + 1);
  return t.parent && t.from == e;
}
function v0(n, e, t, i) {
  let s = ae(n).resolveInner(e, -1), r = i.reduce((o, l) => Math.max(o, l.length), 0);
  for (let o = 0; o < 5; o++) {
    let l = n.sliceDoc(s.from, Math.min(s.to, s.from + t.length + r)), a = l.indexOf(t);
    if (!a || a > -1 && i.indexOf(l.slice(0, a)) > -1) {
      let c = s.firstChild;
      for (; c && c.from == s.from && c.to - c.from > t.length + a; ) {
        if (n.sliceDoc(c.to - t.length, c.to) == t)
          return !1;
        c = c.firstChild;
      }
      return !0;
    }
    let h = s.to == e && s.parent;
    if (!h)
      break;
    s = h;
  }
  return !1;
}
function Vl(n, e, t) {
  let i = n.charCategorizer(e);
  if (i(n.sliceDoc(e - 1, e)) != j.Word)
    return e;
  for (let s of t) {
    let r = e - s.length;
    if (n.sliceDoc(r, e) == s && i(n.sliceDoc(r - 1, r)) != j.Word)
      return r;
  }
  return -1;
}
function C0(n = {}) {
  return [
    Me,
    ue.of(n),
    u0,
    A0,
    d0
  ];
}
const Uc = [
  { key: "Ctrl-Space", run: l0 },
  { key: "Escape", run: a0 },
  { key: "ArrowDown", run: /* @__PURE__ */ hn(!0) },
  { key: "ArrowUp", run: /* @__PURE__ */ hn(!1) },
  { key: "PageDown", run: /* @__PURE__ */ hn(!0, "page") },
  { key: "PageUp", run: /* @__PURE__ */ hn(!1, "page") },
  { key: "Enter", run: o0 }
], A0 = /* @__PURE__ */ ei.highest(/* @__PURE__ */ Zn.computeN([ue], (n) => n.facet(ue).defaultKeymap ? [Uc] : []));
class M0 {
  constructor(e, t, i) {
    this.from = e, this.to = t, this.diagnostic = i;
  }
}
class Tt {
  constructor(e, t, i) {
    this.diagnostics = e, this.panel = t, this.selected = i;
  }
  static init(e, t, i) {
    let s = e, r = i.facet(Gc).markerFilter;
    r && (s = r(s));
    let o = D.set(s.map((l) => l.from == l.to || l.from == l.to - 1 && i.doc.lineAt(l.from).to == l.from ? D.widget({
      widget: new I0(l),
      diagnostic: l
    }).range(l.from) : D.mark({
      attributes: { class: "cm-lintRange cm-lintRange-" + l.severity + (l.markClass ? " " + l.markClass : "") },
      diagnostic: l
    }).range(l.from, l.to)), !0);
    return new Tt(o, t, Jt(o));
  }
}
function Jt(n, e = null, t = 0) {
  let i = null;
  return n.between(t, 1e9, (s, r, { spec: o }) => {
    if (!(e && o.diagnostic != e))
      return i = new M0(s, r, o.diagnostic), !1;
  }), i;
}
function T0(n, e) {
  let t = n.startState.doc.lineAt(e.pos);
  return !!(n.effects.some((i) => i.is(Xc)) || n.changes.touchesRange(t.from, t.to));
}
function P0(n, e) {
  return n.field(Pe, !1) ? e : e.concat(E.appendConfig.of(Q0));
}
const Xc = /* @__PURE__ */ E.define(), oo = /* @__PURE__ */ E.define(), jc = /* @__PURE__ */ E.define(), Pe = /* @__PURE__ */ he.define({
  create() {
    return new Tt(D.none, null, null);
  },
  update(n, e) {
    if (e.docChanged) {
      let t = n.diagnostics.map(e.changes), i = null;
      if (n.selected) {
        let s = e.changes.mapPos(n.selected.from, 1);
        i = Jt(t, n.selected.diagnostic, s) || Jt(t, null, s);
      }
      n = new Tt(t, n.panel, i);
    }
    for (let t of e.effects)
      t.is(Xc) ? n = Tt.init(t.value, n.panel, e.state) : t.is(oo) ? n = new Tt(n.diagnostics, t.value ? as.open : null, n.selected) : t.is(jc) && (n = new Tt(n.diagnostics, n.panel, t.value));
    return n;
  },
  provide: (n) => [
    Pi.from(n, (e) => e.panel),
    T.decorations.from(n, (e) => e.diagnostics)
  ]
}), D0 = /* @__PURE__ */ D.mark({ class: "cm-lintRange cm-lintRange-active" });
function R0(n, e, t) {
  let { diagnostics: i } = n.state.field(Pe), s = [], r = 2e8, o = 0;
  i.between(e - (t < 0 ? 1 : 0), e + (t > 0 ? 1 : 0), (a, h, { spec: c }) => {
    e >= a && e <= h && (a == h || (e > a || t > 0) && (e < h || t < 0)) && (s.push(c.diagnostic), r = Math.min(a, r), o = Math.max(h, o));
  });
  let l = n.state.facet(Gc).tooltipFilter;
  return l && (s = l(s)), s.length ? {
    pos: r,
    end: o,
    above: n.state.doc.lineAt(r).to < o,
    create() {
      return { dom: B0(n, s) };
    }
  } : null;
}
function B0(n, e) {
  return q("ul", { class: "cm-tooltip-lint" }, e.map((t) => _c(n, t, !1)));
}
const E0 = (n) => {
  let e = n.state.field(Pe, !1);
  (!e || !e.panel) && n.dispatch({ effects: P0(n.state, [oo.of(!0)]) });
  let t = Ti(n, as.open);
  return t && t.dom.querySelector(".cm-panel-lint ul").focus(), !0;
}, Hl = (n) => {
  let e = n.state.field(Pe, !1);
  return !e || !e.panel ? !1 : (n.dispatch({ effects: oo.of(!1) }), !0);
}, L0 = (n) => {
  let e = n.state.field(Pe, !1);
  if (!e)
    return !1;
  let t = n.state.selection.main, i = e.diagnostics.iter(t.to + 1);
  return !i.value && (i = e.diagnostics.iter(0), !i.value || i.from == t.from && i.to == t.to) ? !1 : (n.dispatch({ selection: { anchor: i.from, head: i.to }, scrollIntoView: !0 }), !0);
}, N0 = [
  { key: "Mod-Shift-m", run: E0, preventDefault: !0 },
  { key: "F8", run: L0 }
], Gc = /* @__PURE__ */ M.define({
  combine(n) {
    return Object.assign({ sources: n.map((e) => e.source) }, Je(n.map((e) => e.config), {
      delay: 750,
      markerFilter: null,
      tooltipFilter: null,
      needsRefresh: null
    }, {
      needsRefresh: (e, t) => e ? t ? (i) => e(i) || t(i) : e : t
    }));
  }
});
function Kc(n) {
  let e = [];
  if (n)
    e:
      for (let { name: t } of n) {
        for (let i = 0; i < t.length; i++) {
          let s = t[i];
          if (/[a-zA-Z]/.test(s) && !e.some((r) => r.toLowerCase() == s.toLowerCase())) {
            e.push(s);
            continue e;
          }
        }
        e.push("");
      }
  return e;
}
function _c(n, e, t) {
  var i;
  let s = t ? Kc(e.actions) : [];
  return q("li", { class: "cm-diagnostic cm-diagnostic-" + e.severity }, q("span", { class: "cm-diagnosticText" }, e.renderMessage ? e.renderMessage() : e.message), (i = e.actions) === null || i === void 0 ? void 0 : i.map((r, o) => {
    let l = !1, a = (u) => {
      if (u.preventDefault(), l)
        return;
      l = !0;
      let d = Jt(n.state.field(Pe).diagnostics, e);
      d && r.apply(n, d.from, d.to);
    }, { name: h } = r, c = s[o] ? h.indexOf(s[o]) : -1, f = c < 0 ? h : [
      h.slice(0, c),
      q("u", h.slice(c, c + 1)),
      h.slice(c + 1)
    ];
    return q("button", {
      type: "button",
      class: "cm-diagnosticAction",
      onclick: a,
      onmousedown: a,
      "aria-label": ` Action: ${h}${c < 0 ? "" : ` (access key "${s[o]})"`}.`
    }, f);
  }), e.source && q("div", { class: "cm-diagnosticSource" }, e.source));
}
class I0 extends St {
  constructor(e) {
    super(), this.diagnostic = e;
  }
  eq(e) {
    return e.diagnostic == this.diagnostic;
  }
  toDOM() {
    return q("span", { class: "cm-lintPoint cm-lintPoint-" + this.diagnostic.severity });
  }
}
class ql {
  constructor(e, t) {
    this.diagnostic = t, this.id = "item_" + Math.floor(Math.random() * 4294967295).toString(16), this.dom = _c(e, t, !0), this.dom.id = this.id, this.dom.setAttribute("role", "option");
  }
}
class as {
  constructor(e) {
    this.view = e, this.items = [];
    let t = (s) => {
      if (s.keyCode == 27)
        Hl(this.view), this.view.focus();
      else if (s.keyCode == 38 || s.keyCode == 33)
        this.moveSelection((this.selectedIndex - 1 + this.items.length) % this.items.length);
      else if (s.keyCode == 40 || s.keyCode == 34)
        this.moveSelection((this.selectedIndex + 1) % this.items.length);
      else if (s.keyCode == 36)
        this.moveSelection(0);
      else if (s.keyCode == 35)
        this.moveSelection(this.items.length - 1);
      else if (s.keyCode == 13)
        this.view.focus();
      else if (s.keyCode >= 65 && s.keyCode <= 90 && this.selectedIndex >= 0) {
        let { diagnostic: r } = this.items[this.selectedIndex], o = Kc(r.actions);
        for (let l = 0; l < o.length; l++)
          if (o[l].toUpperCase().charCodeAt(0) == s.keyCode) {
            let a = Jt(this.view.state.field(Pe).diagnostics, r);
            a && r.actions[l].apply(e, a.from, a.to);
          }
      } else
        return;
      s.preventDefault();
    }, i = (s) => {
      for (let r = 0; r < this.items.length; r++)
        this.items[r].dom.contains(s.target) && this.moveSelection(r);
    };
    this.list = q("ul", {
      tabIndex: 0,
      role: "listbox",
      "aria-label": this.view.state.phrase("Diagnostics"),
      onkeydown: t,
      onclick: i
    }), this.dom = q("div", { class: "cm-panel-lint" }, this.list, q("button", {
      type: "button",
      name: "close",
      "aria-label": this.view.state.phrase("close"),
      onclick: () => Hl(this.view)
    }, "×")), this.update();
  }
  get selectedIndex() {
    let e = this.view.state.field(Pe).selected;
    if (!e)
      return -1;
    for (let t = 0; t < this.items.length; t++)
      if (this.items[t].diagnostic == e.diagnostic)
        return t;
    return -1;
  }
  update() {
    let { diagnostics: e, selected: t } = this.view.state.field(Pe), i = 0, s = !1, r = null;
    for (e.between(0, this.view.state.doc.length, (o, l, { spec: a }) => {
      let h = -1, c;
      for (let f = i; f < this.items.length; f++)
        if (this.items[f].diagnostic == a.diagnostic) {
          h = f;
          break;
        }
      h < 0 ? (c = new ql(this.view, a.diagnostic), this.items.splice(i, 0, c), s = !0) : (c = this.items[h], h > i && (this.items.splice(i, h - i), s = !0)), t && c.diagnostic == t.diagnostic ? c.dom.hasAttribute("aria-selected") || (c.dom.setAttribute("aria-selected", "true"), r = c) : c.dom.hasAttribute("aria-selected") && c.dom.removeAttribute("aria-selected"), i++;
    }); i < this.items.length && !(this.items.length == 1 && this.items[0].diagnostic.from < 0); )
      s = !0, this.items.pop();
    this.items.length == 0 && (this.items.push(new ql(this.view, {
      from: -1,
      to: -1,
      severity: "info",
      message: this.view.state.phrase("No diagnostics")
    })), s = !0), r ? (this.list.setAttribute("aria-activedescendant", r.id), this.view.requestMeasure({
      key: this,
      read: () => ({ sel: r.dom.getBoundingClientRect(), panel: this.list.getBoundingClientRect() }),
      write: ({ sel: o, panel: l }) => {
        let a = l.height / this.list.offsetHeight;
        o.top < l.top ? this.list.scrollTop -= (l.top - o.top) / a : o.bottom > l.bottom && (this.list.scrollTop += (o.bottom - l.bottom) / a);
      }
    })) : this.selectedIndex < 0 && this.list.removeAttribute("aria-activedescendant"), s && this.sync();
  }
  sync() {
    let e = this.list.firstChild;
    function t() {
      let i = e;
      e = i.nextSibling, i.remove();
    }
    for (let i of this.items)
      if (i.dom.parentNode == this.list) {
        for (; e != i.dom; )
          t();
        e = i.dom.nextSibling;
      } else
        this.list.insertBefore(i.dom, e);
    for (; e; )
      t();
  }
  moveSelection(e) {
    if (this.selectedIndex < 0)
      return;
    let t = this.view.state.field(Pe), i = Jt(t.diagnostics, this.items[e].diagnostic);
    i && this.view.dispatch({
      selection: { anchor: i.from, head: i.to },
      scrollIntoView: !0,
      effects: jc.of(i)
    });
  }
  static open(e) {
    return new as(e);
  }
}
function W0(n, e = 'viewBox="0 0 40 40"') {
  return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" ${e}>${encodeURIComponent(n)}</svg>')`;
}
function cn(n) {
  return W0(`<path d="m0 2.5 l2 -1.5 l1 0 l2 1.5 l1 0" stroke="${n}" fill="none" stroke-width=".7"/>`, 'width="6" height="3"');
}
const $0 = /* @__PURE__ */ T.baseTheme({
  ".cm-diagnostic": {
    padding: "3px 6px 3px 8px",
    marginLeft: "-1px",
    display: "block",
    whiteSpace: "pre-wrap"
  },
  ".cm-diagnostic-error": { borderLeft: "5px solid #d11" },
  ".cm-diagnostic-warning": { borderLeft: "5px solid orange" },
  ".cm-diagnostic-info": { borderLeft: "5px solid #999" },
  ".cm-diagnostic-hint": { borderLeft: "5px solid #66d" },
  ".cm-diagnosticAction": {
    font: "inherit",
    border: "none",
    padding: "2px 4px",
    backgroundColor: "#444",
    color: "white",
    borderRadius: "3px",
    marginLeft: "8px",
    cursor: "pointer"
  },
  ".cm-diagnosticSource": {
    fontSize: "70%",
    opacity: 0.7
  },
  ".cm-lintRange": {
    backgroundPosition: "left bottom",
    backgroundRepeat: "repeat-x",
    paddingBottom: "0.7px"
  },
  ".cm-lintRange-error": { backgroundImage: /* @__PURE__ */ cn("#d11") },
  ".cm-lintRange-warning": { backgroundImage: /* @__PURE__ */ cn("orange") },
  ".cm-lintRange-info": { backgroundImage: /* @__PURE__ */ cn("#999") },
  ".cm-lintRange-hint": { backgroundImage: /* @__PURE__ */ cn("#66d") },
  ".cm-lintRange-active": { backgroundColor: "#ffdd9980" },
  ".cm-tooltip-lint": {
    padding: 0,
    margin: 0
  },
  ".cm-lintPoint": {
    position: "relative",
    "&:after": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: "-2px",
      borderLeft: "3px solid transparent",
      borderRight: "3px solid transparent",
      borderBottom: "4px solid #d11"
    }
  },
  ".cm-lintPoint-warning": {
    "&:after": { borderBottomColor: "orange" }
  },
  ".cm-lintPoint-info": {
    "&:after": { borderBottomColor: "#999" }
  },
  ".cm-lintPoint-hint": {
    "&:after": { borderBottomColor: "#66d" }
  },
  ".cm-panel.cm-panel-lint": {
    position: "relative",
    "& ul": {
      maxHeight: "100px",
      overflowY: "auto",
      "& [aria-selected]": {
        backgroundColor: "#ddd",
        "& u": { textDecoration: "underline" }
      },
      "&:focus [aria-selected]": {
        background_fallback: "#bdf",
        backgroundColor: "Highlight",
        color_fallback: "white",
        color: "HighlightText"
      },
      "& u": { textDecoration: "none" },
      padding: 0,
      margin: 0
    },
    "& [name=close]": {
      position: "absolute",
      top: "0",
      right: "2px",
      background: "inherit",
      border: "none",
      font: "inherit",
      padding: 0,
      margin: 0
    }
  }
}), Q0 = [
  Pe,
  /* @__PURE__ */ T.decorations.compute([Pe], (n) => {
    let { selected: e, panel: t } = n.field(Pe);
    return !e || !t || e.from == e.to ? D.none : D.set([
      D0.range(e.from, e.to)
    ]);
  }),
  /* @__PURE__ */ Id(R0, { hideOn: T0 }),
  $0
], z0 = [
  Ud(),
  Gd(),
  dd(),
  pm(),
  zp(),
  id(),
  ld(),
  $.allowMultipleSelections.of(!0),
  Ap(),
  Vp(Up, { fallback: !0 }),
  Zp(),
  p0(),
  C0(),
  Cd(),
  Td(),
  xd(),
  wg(),
  Zn.of([
    ...b0,
    ...vc,
    ...Qg,
    ...Sm,
    ...Ip,
    ...Uc,
    ...N0
  ])
];
class Un {
  /**
  @internal
  */
  constructor(e, t, i, s, r, o, l, a, h, c = 0, f) {
    this.p = e, this.stack = t, this.state = i, this.reducePos = s, this.pos = r, this.score = o, this.buffer = l, this.bufferBase = a, this.curContext = h, this.lookAhead = c, this.parent = f;
  }
  /**
  @internal
  */
  toString() {
    return `[${this.stack.filter((e, t) => t % 3 == 0).concat(this.state)}]@${this.pos}${this.score ? "!" + this.score : ""}`;
  }
  // Start an empty stack
  /**
  @internal
  */
  static start(e, t, i = 0) {
    let s = e.parser.context;
    return new Un(e, [], t, i, i, 0, [], 0, s ? new Ul(s, s.start) : null, 0, null);
  }
  /**
  The stack's current [context](#lr.ContextTracker) value, if
  any. Its type will depend on the context tracker's type
  parameter, or it will be `null` if there is no context
  tracker.
  */
  get context() {
    return this.curContext ? this.curContext.context : null;
  }
  // Push a state onto the stack, tracking its start position as well
  // as the buffer base at that point.
  /**
  @internal
  */
  pushState(e, t) {
    this.stack.push(this.state, t, this.bufferBase + this.buffer.length), this.state = e;
  }
  // Apply a reduce action
  /**
  @internal
  */
  reduce(e) {
    var t;
    let i = e >> 19, s = e & 65535, { parser: r } = this.p, o = r.dynamicPrecedence(s);
    if (o && (this.score += o), i == 0) {
      this.pushState(r.getGoto(this.state, s, !0), this.reducePos), s < r.minRepeatTerm && this.storeNode(s, this.reducePos, this.reducePos, 4, !0), this.reduceContext(s, this.reducePos);
      return;
    }
    let l = this.stack.length - (i - 1) * 3 - (e & 262144 ? 6 : 0), a = l ? this.stack[l - 2] : this.p.ranges[0].from, h = this.reducePos - a;
    h >= 2e3 && !(!((t = this.p.parser.nodeSet.types[s]) === null || t === void 0) && t.isAnonymous) && (a == this.p.lastBigReductionStart ? (this.p.bigReductionCount++, this.p.lastBigReductionSize = h) : this.p.lastBigReductionSize < h && (this.p.bigReductionCount = 1, this.p.lastBigReductionStart = a, this.p.lastBigReductionSize = h));
    let c = l ? this.stack[l - 1] : 0, f = this.bufferBase + this.buffer.length - c;
    if (s < r.minRepeatTerm || e & 131072) {
      let u = r.stateFlag(
        this.state,
        1
        /* StateFlag.Skipped */
      ) ? this.pos : this.reducePos;
      this.storeNode(s, a, u, f + 4, !0);
    }
    if (e & 262144)
      this.state = this.stack[l];
    else {
      let u = this.stack[l - 3];
      this.state = r.getGoto(u, s, !0);
    }
    for (; this.stack.length > l; )
      this.stack.pop();
    this.reduceContext(s, a);
  }
  // Shift a value into the buffer
  /**
  @internal
  */
  storeNode(e, t, i, s = 4, r = !1) {
    if (e == 0 && (!this.stack.length || this.stack[this.stack.length - 1] < this.buffer.length + this.bufferBase)) {
      let o = this, l = this.buffer.length;
      if (l == 0 && o.parent && (l = o.bufferBase - o.parent.bufferBase, o = o.parent), l > 0 && o.buffer[l - 4] == 0 && o.buffer[l - 1] > -1) {
        if (t == i)
          return;
        if (o.buffer[l - 2] >= t) {
          o.buffer[l - 2] = i;
          return;
        }
      }
    }
    if (!r || this.pos == i)
      this.buffer.push(e, t, i, s);
    else {
      let o = this.buffer.length;
      if (o > 0 && this.buffer[o - 4] != 0)
        for (; o > 0 && this.buffer[o - 2] > i; )
          this.buffer[o] = this.buffer[o - 4], this.buffer[o + 1] = this.buffer[o - 3], this.buffer[o + 2] = this.buffer[o - 2], this.buffer[o + 3] = this.buffer[o - 1], o -= 4, s > 4 && (s -= 4);
      this.buffer[o] = e, this.buffer[o + 1] = t, this.buffer[o + 2] = i, this.buffer[o + 3] = s;
    }
  }
  // Apply a shift action
  /**
  @internal
  */
  shift(e, t, i, s) {
    if (e & 131072)
      this.pushState(e & 65535, this.pos);
    else if (e & 262144)
      this.pos = s, this.shiftContext(t, i), t <= this.p.parser.maxNode && this.buffer.push(t, i, s, 4);
    else {
      let r = e, { parser: o } = this.p;
      (s > this.pos || t <= o.maxNode) && (this.pos = s, o.stateFlag(
        r,
        1
        /* StateFlag.Skipped */
      ) || (this.reducePos = s)), this.pushState(r, i), this.shiftContext(t, i), t <= o.maxNode && this.buffer.push(t, i, s, 4);
    }
  }
  // Apply an action
  /**
  @internal
  */
  apply(e, t, i, s) {
    e & 65536 ? this.reduce(e) : this.shift(e, t, i, s);
  }
  // Add a prebuilt (reused) node into the buffer.
  /**
  @internal
  */
  useNode(e, t) {
    let i = this.p.reused.length - 1;
    (i < 0 || this.p.reused[i] != e) && (this.p.reused.push(e), i++);
    let s = this.pos;
    this.reducePos = this.pos = s + e.length, this.pushState(t, s), this.buffer.push(
      i,
      s,
      this.reducePos,
      -1
      /* size == -1 means this is a reused value */
    ), this.curContext && this.updateContext(this.curContext.tracker.reuse(this.curContext.context, e, this, this.p.stream.reset(this.pos - e.length)));
  }
  // Split the stack. Due to the buffer sharing and the fact
  // that `this.stack` tends to stay quite shallow, this isn't very
  // expensive.
  /**
  @internal
  */
  split() {
    let e = this, t = e.buffer.length;
    for (; t > 0 && e.buffer[t - 2] > e.reducePos; )
      t -= 4;
    let i = e.buffer.slice(t), s = e.bufferBase + t;
    for (; e && s == e.bufferBase; )
      e = e.parent;
    return new Un(this.p, this.stack.slice(), this.state, this.reducePos, this.pos, this.score, i, s, this.curContext, this.lookAhead, e);
  }
  // Try to recover from an error by 'deleting' (ignoring) one token.
  /**
  @internal
  */
  recoverByDelete(e, t) {
    let i = e <= this.p.parser.maxNode;
    i && this.storeNode(e, this.pos, t, 4), this.storeNode(0, this.pos, t, i ? 8 : 4), this.pos = this.reducePos = t, this.score -= 190;
  }
  /**
  Check if the given term would be able to be shifted (optionally
  after some reductions) on this stack. This can be useful for
  external tokenizers that want to make sure they only provide a
  given token when it applies.
  */
  canShift(e) {
    for (let t = new F0(this); ; ) {
      let i = this.p.parser.stateSlot(
        t.state,
        4
        /* ParseState.DefaultReduce */
      ) || this.p.parser.hasAction(t.state, e);
      if (i == 0)
        return !1;
      if (!(i & 65536))
        return !0;
      t.reduce(i);
    }
  }
  // Apply up to Recover.MaxNext recovery actions that conceptually
  // inserts some missing token or rule.
  /**
  @internal
  */
  recoverByInsert(e) {
    if (this.stack.length >= 300)
      return [];
    let t = this.p.parser.nextStates(this.state);
    if (t.length > 8 || this.stack.length >= 120) {
      let s = [];
      for (let r = 0, o; r < t.length; r += 2)
        (o = t[r + 1]) != this.state && this.p.parser.hasAction(o, e) && s.push(t[r], o);
      if (this.stack.length < 120)
        for (let r = 0; s.length < 8 && r < t.length; r += 2) {
          let o = t[r + 1];
          s.some((l, a) => a & 1 && l == o) || s.push(t[r], o);
        }
      t = s;
    }
    let i = [];
    for (let s = 0; s < t.length && i.length < 4; s += 2) {
      let r = t[s + 1];
      if (r == this.state)
        continue;
      let o = this.split();
      o.pushState(r, this.pos), o.storeNode(0, o.pos, o.pos, 4, !0), o.shiftContext(t[s], this.pos), o.reducePos = this.pos, o.score -= 200, i.push(o);
    }
    return i;
  }
  // Force a reduce, if possible. Return false if that can't
  // be done.
  /**
  @internal
  */
  forceReduce() {
    let { parser: e } = this.p, t = e.stateSlot(
      this.state,
      5
      /* ParseState.ForcedReduce */
    );
    if (!(t & 65536))
      return !1;
    if (!e.validAction(this.state, t)) {
      let i = t >> 19, s = t & 65535, r = this.stack.length - i * 3;
      if (r < 0 || e.getGoto(this.stack[r], s, !1) < 0) {
        let o = this.findForcedReduction();
        if (o == null)
          return !1;
        t = o;
      }
      this.storeNode(0, this.pos, this.pos, 4, !0), this.score -= 100;
    }
    return this.reducePos = this.pos, this.reduce(t), !0;
  }
  /**
  Try to scan through the automaton to find some kind of reduction
  that can be applied. Used when the regular ForcedReduce field
  isn't a valid action. @internal
  */
  findForcedReduction() {
    let { parser: e } = this.p, t = [], i = (s, r) => {
      if (!t.includes(s))
        return t.push(s), e.allActions(s, (o) => {
          if (!(o & 393216))
            if (o & 65536) {
              let l = (o >> 19) - r;
              if (l > 1) {
                let a = o & 65535, h = this.stack.length - l * 3;
                if (h >= 0 && e.getGoto(this.stack[h], a, !1) >= 0)
                  return l << 19 | 65536 | a;
              }
            } else {
              let l = i(o, r + 1);
              if (l != null)
                return l;
            }
        });
    };
    return i(this.state, 0);
  }
  /**
  @internal
  */
  forceAll() {
    for (; !this.p.parser.stateFlag(
      this.state,
      2
      /* StateFlag.Accepting */
    ); )
      if (!this.forceReduce()) {
        this.storeNode(0, this.pos, this.pos, 4, !0);
        break;
      }
    return this;
  }
  /**
  Check whether this state has no further actions (assumed to be a direct descendant of the
  top state, since any other states must be able to continue
  somehow). @internal
  */
  get deadEnd() {
    if (this.stack.length != 3)
      return !1;
    let { parser: e } = this.p;
    return e.data[e.stateSlot(
      this.state,
      1
      /* ParseState.Actions */
    )] == 65535 && !e.stateSlot(
      this.state,
      4
      /* ParseState.DefaultReduce */
    );
  }
  /**
  Restart the stack (put it back in its start state). Only safe
  when this.stack.length == 3 (state is directly below the top
  state). @internal
  */
  restart() {
    this.storeNode(0, this.pos, this.pos, 4, !0), this.state = this.stack[0], this.stack.length = 0;
  }
  /**
  @internal
  */
  sameState(e) {
    if (this.state != e.state || this.stack.length != e.stack.length)
      return !1;
    for (let t = 0; t < this.stack.length; t += 3)
      if (this.stack[t] != e.stack[t])
        return !1;
    return !0;
  }
  /**
  Get the parser used by this stack.
  */
  get parser() {
    return this.p.parser;
  }
  /**
  Test whether a given dialect (by numeric ID, as exported from
  the terms file) is enabled.
  */
  dialectEnabled(e) {
    return this.p.parser.dialect.flags[e];
  }
  shiftContext(e, t) {
    this.curContext && this.updateContext(this.curContext.tracker.shift(this.curContext.context, e, this, this.p.stream.reset(t)));
  }
  reduceContext(e, t) {
    this.curContext && this.updateContext(this.curContext.tracker.reduce(this.curContext.context, e, this, this.p.stream.reset(t)));
  }
  /**
  @internal
  */
  emitContext() {
    let e = this.buffer.length - 1;
    (e < 0 || this.buffer[e] != -3) && this.buffer.push(this.curContext.hash, this.pos, this.pos, -3);
  }
  /**
  @internal
  */
  emitLookAhead() {
    let e = this.buffer.length - 1;
    (e < 0 || this.buffer[e] != -4) && this.buffer.push(this.lookAhead, this.pos, this.pos, -4);
  }
  updateContext(e) {
    if (e != this.curContext.context) {
      let t = new Ul(this.curContext.tracker, e);
      t.hash != this.curContext.hash && this.emitContext(), this.curContext = t;
    }
  }
  /**
  @internal
  */
  setLookAhead(e) {
    e > this.lookAhead && (this.emitLookAhead(), this.lookAhead = e);
  }
  /**
  @internal
  */
  close() {
    this.curContext && this.curContext.tracker.strict && this.emitContext(), this.lookAhead > 0 && this.emitLookAhead();
  }
}
class Ul {
  constructor(e, t) {
    this.tracker = e, this.context = t, this.hash = e.strict ? e.hash(t) : 0;
  }
}
class F0 {
  constructor(e) {
    this.start = e, this.state = e.state, this.stack = e.stack, this.base = this.stack.length;
  }
  reduce(e) {
    let t = e & 65535, i = e >> 19;
    i == 0 ? (this.stack == this.start.stack && (this.stack = this.stack.slice()), this.stack.push(this.state, 0, 0), this.base += 3) : this.base -= (i - 1) * 3;
    let s = this.start.p.parser.getGoto(this.stack[this.base - 3], t, !0);
    this.state = s;
  }
}
class Xn {
  constructor(e, t, i) {
    this.stack = e, this.pos = t, this.index = i, this.buffer = e.buffer, this.index == 0 && this.maybeNext();
  }
  static create(e, t = e.bufferBase + e.buffer.length) {
    return new Xn(e, t, t - e.bufferBase);
  }
  maybeNext() {
    let e = this.stack.parent;
    e != null && (this.index = this.stack.bufferBase - e.bufferBase, this.stack = e, this.buffer = e.buffer);
  }
  get id() {
    return this.buffer[this.index - 4];
  }
  get start() {
    return this.buffer[this.index - 3];
  }
  get end() {
    return this.buffer[this.index - 2];
  }
  get size() {
    return this.buffer[this.index - 1];
  }
  next() {
    this.index -= 4, this.pos -= 4, this.index == 0 && this.maybeNext();
  }
  fork() {
    return new Xn(this.stack, this.pos, this.index);
  }
}
function mi(n, e = Uint16Array) {
  if (typeof n != "string")
    return n;
  let t = null;
  for (let i = 0, s = 0; i < n.length; ) {
    let r = 0;
    for (; ; ) {
      let o = n.charCodeAt(i++), l = !1;
      if (o == 126) {
        r = 65535;
        break;
      }
      o >= 92 && o--, o >= 34 && o--;
      let a = o - 32;
      if (a >= 46 && (a -= 46, l = !0), r += a, l)
        break;
      r *= 46;
    }
    t ? t[s++] = r : t = new e(r);
  }
  return t;
}
class wn {
  constructor() {
    this.start = -1, this.value = -1, this.end = -1, this.extended = -1, this.lookAhead = 0, this.mask = 0, this.context = 0;
  }
}
const Xl = new wn();
class V0 {
  /**
  @internal
  */
  constructor(e, t) {
    this.input = e, this.ranges = t, this.chunk = "", this.chunkOff = 0, this.chunk2 = "", this.chunk2Pos = 0, this.next = -1, this.token = Xl, this.rangeIndex = 0, this.pos = this.chunkPos = t[0].from, this.range = t[0], this.end = t[t.length - 1].to, this.readNext();
  }
  /**
  @internal
  */
  resolveOffset(e, t) {
    let i = this.range, s = this.rangeIndex, r = this.pos + e;
    for (; r < i.from; ) {
      if (!s)
        return null;
      let o = this.ranges[--s];
      r -= i.from - o.to, i = o;
    }
    for (; t < 0 ? r > i.to : r >= i.to; ) {
      if (s == this.ranges.length - 1)
        return null;
      let o = this.ranges[++s];
      r += o.from - i.to, i = o;
    }
    return r;
  }
  /**
  @internal
  */
  clipPos(e) {
    if (e >= this.range.from && e < this.range.to)
      return e;
    for (let t of this.ranges)
      if (t.to > e)
        return Math.max(e, t.from);
    return this.end;
  }
  /**
  Look at a code unit near the stream position. `.peek(0)` equals
  `.next`, `.peek(-1)` gives you the previous character, and so
  on.
  
  Note that looking around during tokenizing creates dependencies
  on potentially far-away content, which may reduce the
  effectiveness incremental parsing—when looking forward—or even
  cause invalid reparses when looking backward more than 25 code
  units, since the library does not track lookbehind.
  */
  peek(e) {
    let t = this.chunkOff + e, i, s;
    if (t >= 0 && t < this.chunk.length)
      i = this.pos + e, s = this.chunk.charCodeAt(t);
    else {
      let r = this.resolveOffset(e, 1);
      if (r == null)
        return -1;
      if (i = r, i >= this.chunk2Pos && i < this.chunk2Pos + this.chunk2.length)
        s = this.chunk2.charCodeAt(i - this.chunk2Pos);
      else {
        let o = this.rangeIndex, l = this.range;
        for (; l.to <= i; )
          l = this.ranges[++o];
        this.chunk2 = this.input.chunk(this.chunk2Pos = i), i + this.chunk2.length > l.to && (this.chunk2 = this.chunk2.slice(0, l.to - i)), s = this.chunk2.charCodeAt(0);
      }
    }
    return i >= this.token.lookAhead && (this.token.lookAhead = i + 1), s;
  }
  /**
  Accept a token. By default, the end of the token is set to the
  current stream position, but you can pass an offset (relative to
  the stream position) to change that.
  */
  acceptToken(e, t = 0) {
    let i = t ? this.resolveOffset(t, -1) : this.pos;
    if (i == null || i < this.token.start)
      throw new RangeError("Token end out of bounds");
    this.token.value = e, this.token.end = i;
  }
  getChunk() {
    if (this.pos >= this.chunk2Pos && this.pos < this.chunk2Pos + this.chunk2.length) {
      let { chunk: e, chunkPos: t } = this;
      this.chunk = this.chunk2, this.chunkPos = this.chunk2Pos, this.chunk2 = e, this.chunk2Pos = t, this.chunkOff = this.pos - this.chunkPos;
    } else {
      this.chunk2 = this.chunk, this.chunk2Pos = this.chunkPos;
      let e = this.input.chunk(this.pos), t = this.pos + e.length;
      this.chunk = t > this.range.to ? e.slice(0, this.range.to - this.pos) : e, this.chunkPos = this.pos, this.chunkOff = 0;
    }
  }
  readNext() {
    return this.chunkOff >= this.chunk.length && (this.getChunk(), this.chunkOff == this.chunk.length) ? this.next = -1 : this.next = this.chunk.charCodeAt(this.chunkOff);
  }
  /**
  Move the stream forward N (defaults to 1) code units. Returns
  the new value of [`next`](#lr.InputStream.next).
  */
  advance(e = 1) {
    for (this.chunkOff += e; this.pos + e >= this.range.to; ) {
      if (this.rangeIndex == this.ranges.length - 1)
        return this.setDone();
      e -= this.range.to - this.pos, this.range = this.ranges[++this.rangeIndex], this.pos = this.range.from;
    }
    return this.pos += e, this.pos >= this.token.lookAhead && (this.token.lookAhead = this.pos + 1), this.readNext();
  }
  setDone() {
    return this.pos = this.chunkPos = this.end, this.range = this.ranges[this.rangeIndex = this.ranges.length - 1], this.chunk = "", this.next = -1;
  }
  /**
  @internal
  */
  reset(e, t) {
    if (t ? (this.token = t, t.start = e, t.lookAhead = e + 1, t.value = t.extended = -1) : this.token = Xl, this.pos != e) {
      if (this.pos = e, e == this.end)
        return this.setDone(), this;
      for (; e < this.range.from; )
        this.range = this.ranges[--this.rangeIndex];
      for (; e >= this.range.to; )
        this.range = this.ranges[++this.rangeIndex];
      e >= this.chunkPos && e < this.chunkPos + this.chunk.length ? this.chunkOff = e - this.chunkPos : (this.chunk = "", this.chunkOff = 0), this.readNext();
    }
    return this;
  }
  /**
  @internal
  */
  read(e, t) {
    if (e >= this.chunkPos && t <= this.chunkPos + this.chunk.length)
      return this.chunk.slice(e - this.chunkPos, t - this.chunkPos);
    if (e >= this.chunk2Pos && t <= this.chunk2Pos + this.chunk2.length)
      return this.chunk2.slice(e - this.chunk2Pos, t - this.chunk2Pos);
    if (e >= this.range.from && t <= this.range.to)
      return this.input.read(e, t);
    let i = "";
    for (let s of this.ranges) {
      if (s.from >= t)
        break;
      s.to > e && (i += this.input.read(Math.max(s.from, e), Math.min(s.to, t)));
    }
    return i;
  }
}
class Gt {
  constructor(e, t) {
    this.data = e, this.id = t;
  }
  token(e, t) {
    let { parser: i } = t.p;
    Zc(this.data, e, t, this.id, i.data, i.tokenPrecTable);
  }
}
Gt.prototype.contextual = Gt.prototype.fallback = Gt.prototype.extend = !1;
class Yc {
  constructor(e, t, i) {
    this.precTable = t, this.elseToken = i, this.data = typeof e == "string" ? mi(e) : e;
  }
  token(e, t) {
    let i = e.pos, s = 0;
    for (; ; ) {
      let r = e.next < 0, o = e.resolveOffset(1, 1);
      if (Zc(this.data, e, t, 0, this.data, this.precTable), e.token.value > -1)
        break;
      if (this.elseToken == null)
        return;
      if (r || s++, o == null)
        break;
      e.reset(o, e.token);
    }
    s && (e.reset(i, e.token), e.acceptToken(this.elseToken, s));
  }
}
Yc.prototype.contextual = Gt.prototype.fallback = Gt.prototype.extend = !1;
class lo {
  /**
  Create a tokenizer. The first argument is the function that,
  given an input stream, scans for the types of tokens it
  recognizes at the stream's position, and calls
  [`acceptToken`](#lr.InputStream.acceptToken) when it finds
  one.
  */
  constructor(e, t = {}) {
    this.token = e, this.contextual = !!t.contextual, this.fallback = !!t.fallback, this.extend = !!t.extend;
  }
}
function Zc(n, e, t, i, s, r) {
  let o = 0, l = 1 << i, { dialect: a } = t.p.parser;
  e:
    for (; l & n[o]; ) {
      let h = n[o + 1];
      for (let d = o + 3; d < h; d += 2)
        if ((n[d + 1] & l) > 0) {
          let p = n[d];
          if (a.allows(p) && (e.token.value == -1 || e.token.value == p || H0(p, e.token.value, s, r))) {
            e.acceptToken(p);
            break;
          }
        }
      let c = e.next, f = 0, u = n[o + 2];
      if (e.next < 0 && u > f && n[h + u * 3 - 3] == 65535) {
        o = n[h + u * 3 - 1];
        continue e;
      }
      for (; f < u; ) {
        let d = f + u >> 1, p = h + d + (d << 1), g = n[p], m = n[p + 1] || 65536;
        if (c < g)
          u = d;
        else if (c >= m)
          f = d + 1;
        else {
          o = n[p + 2], e.advance();
          continue e;
        }
      }
      break;
    }
}
function jl(n, e, t) {
  for (let i = e, s; (s = n[i]) != 65535; i++)
    if (s == t)
      return i - e;
  return -1;
}
function H0(n, e, t, i) {
  let s = jl(t, i, e);
  return s < 0 || jl(t, i, n) < s;
}
const Ce = typeof process < "u" && process.env && /\bparse\b/.test(process.env.LOG);
let Es = null;
function Gl(n, e, t) {
  let i = n.cursor(ie.IncludeAnonymous);
  for (i.moveTo(e); ; )
    if (!(t < 0 ? i.childBefore(e) : i.childAfter(e)))
      for (; ; ) {
        if ((t < 0 ? i.to < e : i.from > e) && !i.type.isError)
          return t < 0 ? Math.max(0, Math.min(
            i.to - 1,
            e - 25
            /* Safety.Margin */
          )) : Math.min(n.length, Math.max(
            i.from + 1,
            e + 25
            /* Safety.Margin */
          ));
        if (t < 0 ? i.prevSibling() : i.nextSibling())
          break;
        if (!i.parent())
          return t < 0 ? 0 : n.length;
      }
}
class q0 {
  constructor(e, t) {
    this.fragments = e, this.nodeSet = t, this.i = 0, this.fragment = null, this.safeFrom = -1, this.safeTo = -1, this.trees = [], this.start = [], this.index = [], this.nextFragment();
  }
  nextFragment() {
    let e = this.fragment = this.i == this.fragments.length ? null : this.fragments[this.i++];
    if (e) {
      for (this.safeFrom = e.openStart ? Gl(e.tree, e.from + e.offset, 1) - e.offset : e.from, this.safeTo = e.openEnd ? Gl(e.tree, e.to + e.offset, -1) - e.offset : e.to; this.trees.length; )
        this.trees.pop(), this.start.pop(), this.index.pop();
      this.trees.push(e.tree), this.start.push(-e.offset), this.index.push(0), this.nextStart = this.safeFrom;
    } else
      this.nextStart = 1e9;
  }
  // `pos` must be >= any previously given `pos` for this cursor
  nodeAt(e) {
    if (e < this.nextStart)
      return null;
    for (; this.fragment && this.safeTo <= e; )
      this.nextFragment();
    if (!this.fragment)
      return null;
    for (; ; ) {
      let t = this.trees.length - 1;
      if (t < 0)
        return this.nextFragment(), null;
      let i = this.trees[t], s = this.index[t];
      if (s == i.children.length) {
        this.trees.pop(), this.start.pop(), this.index.pop();
        continue;
      }
      let r = i.children[s], o = this.start[t] + i.positions[s];
      if (o > e)
        return this.nextStart = o, null;
      if (r instanceof Y) {
        if (o == e) {
          if (o < this.safeFrom)
            return null;
          let l = o + r.length;
          if (l <= this.safeTo) {
            let a = r.prop(N.lookAhead);
            if (!a || l + a < this.fragment.to)
              return r;
          }
        }
        this.index[t]++, o + r.length >= Math.max(this.safeFrom, e) && (this.trees.push(r), this.start.push(o), this.index.push(0));
      } else
        this.index[t]++, this.nextStart = o + r.length;
    }
  }
}
class U0 {
  constructor(e, t) {
    this.stream = t, this.tokens = [], this.mainToken = null, this.actions = [], this.tokens = e.tokenizers.map((i) => new wn());
  }
  getActions(e) {
    let t = 0, i = null, { parser: s } = e.p, { tokenizers: r } = s, o = s.stateSlot(
      e.state,
      3
      /* ParseState.TokenizerMask */
    ), l = e.curContext ? e.curContext.hash : 0, a = 0;
    for (let h = 0; h < r.length; h++) {
      if (!(1 << h & o))
        continue;
      let c = r[h], f = this.tokens[h];
      if (!(i && !c.fallback) && ((c.contextual || f.start != e.pos || f.mask != o || f.context != l) && (this.updateCachedToken(f, c, e), f.mask = o, f.context = l), f.lookAhead > f.end + 25 && (a = Math.max(f.lookAhead, a)), f.value != 0)) {
        let u = t;
        if (f.extended > -1 && (t = this.addActions(e, f.extended, f.end, t)), t = this.addActions(e, f.value, f.end, t), !c.extend && (i = f, t > u))
          break;
      }
    }
    for (; this.actions.length > t; )
      this.actions.pop();
    return a && e.setLookAhead(a), !i && e.pos == this.stream.end && (i = new wn(), i.value = e.p.parser.eofTerm, i.start = i.end = e.pos, t = this.addActions(e, i.value, i.end, t)), this.mainToken = i, this.actions;
  }
  getMainToken(e) {
    if (this.mainToken)
      return this.mainToken;
    let t = new wn(), { pos: i, p: s } = e;
    return t.start = i, t.end = Math.min(i + 1, s.stream.end), t.value = i == s.stream.end ? s.parser.eofTerm : 0, t;
  }
  updateCachedToken(e, t, i) {
    let s = this.stream.clipPos(i.pos);
    if (t.token(this.stream.reset(s, e), i), e.value > -1) {
      let { parser: r } = i.p;
      for (let o = 0; o < r.specialized.length; o++)
        if (r.specialized[o] == e.value) {
          let l = r.specializers[o](this.stream.read(e.start, e.end), i);
          if (l >= 0 && i.p.parser.dialect.allows(l >> 1)) {
            l & 1 ? e.extended = l >> 1 : e.value = l >> 1;
            break;
          }
        }
    } else
      e.value = 0, e.end = this.stream.clipPos(s + 1);
  }
  putAction(e, t, i, s) {
    for (let r = 0; r < s; r += 3)
      if (this.actions[r] == e)
        return s;
    return this.actions[s++] = e, this.actions[s++] = t, this.actions[s++] = i, s;
  }
  addActions(e, t, i, s) {
    let { state: r } = e, { parser: o } = e.p, { data: l } = o;
    for (let a = 0; a < 2; a++)
      for (let h = o.stateSlot(
        r,
        a ? 2 : 1
        /* ParseState.Actions */
      ); ; h += 3) {
        if (l[h] == 65535)
          if (l[h + 1] == 1)
            h = tt(l, h + 2);
          else {
            s == 0 && l[h + 1] == 2 && (s = this.putAction(tt(l, h + 2), t, i, s));
            break;
          }
        l[h] == t && (s = this.putAction(tt(l, h + 1), t, i, s));
      }
    return s;
  }
}
class X0 {
  constructor(e, t, i, s) {
    this.parser = e, this.input = t, this.ranges = s, this.recovering = 0, this.nextStackID = 9812, this.minStackPos = 0, this.reused = [], this.stoppedAt = null, this.lastBigReductionStart = -1, this.lastBigReductionSize = 0, this.bigReductionCount = 0, this.stream = new V0(t, s), this.tokens = new U0(e, this.stream), this.topTerm = e.top[1];
    let { from: r } = s[0];
    this.stacks = [Un.start(this, e.top[0], r)], this.fragments = i.length && this.stream.end - r > e.bufferLength * 4 ? new q0(i, e.nodeSet) : null;
  }
  get parsedPos() {
    return this.minStackPos;
  }
  // Move the parser forward. This will process all parse stacks at
  // `this.pos` and try to advance them to a further position. If no
  // stack for such a position is found, it'll start error-recovery.
  //
  // When the parse is finished, this will return a syntax tree. When
  // not, it returns `null`.
  advance() {
    let e = this.stacks, t = this.minStackPos, i = this.stacks = [], s, r;
    if (this.bigReductionCount > 300 && e.length == 1) {
      let [o] = e;
      for (; o.forceReduce() && o.stack.length && o.stack[o.stack.length - 2] >= this.lastBigReductionStart; )
        ;
      this.bigReductionCount = this.lastBigReductionSize = 0;
    }
    for (let o = 0; o < e.length; o++) {
      let l = e[o];
      for (; ; ) {
        if (this.tokens.mainToken = null, l.pos > t)
          i.push(l);
        else {
          if (this.advanceStack(l, i, e))
            continue;
          {
            s || (s = [], r = []), s.push(l);
            let a = this.tokens.getMainToken(l);
            r.push(a.value, a.end);
          }
        }
        break;
      }
    }
    if (!i.length) {
      let o = s && G0(s);
      if (o)
        return Ce && console.log("Finish with " + this.stackID(o)), this.stackToTree(o);
      if (this.parser.strict)
        throw Ce && s && console.log("Stuck with token " + (this.tokens.mainToken ? this.parser.getName(this.tokens.mainToken.value) : "none")), new SyntaxError("No parse at " + t);
      this.recovering || (this.recovering = 5);
    }
    if (this.recovering && s) {
      let o = this.stoppedAt != null && s[0].pos > this.stoppedAt ? s[0] : this.runRecovery(s, r, i);
      if (o)
        return Ce && console.log("Force-finish " + this.stackID(o)), this.stackToTree(o.forceAll());
    }
    if (this.recovering) {
      let o = this.recovering == 1 ? 1 : this.recovering * 3;
      if (i.length > o)
        for (i.sort((l, a) => a.score - l.score); i.length > o; )
          i.pop();
      i.some((l) => l.reducePos > t) && this.recovering--;
    } else if (i.length > 1) {
      e:
        for (let o = 0; o < i.length - 1; o++) {
          let l = i[o];
          for (let a = o + 1; a < i.length; a++) {
            let h = i[a];
            if (l.sameState(h) || l.buffer.length > 500 && h.buffer.length > 500)
              if ((l.score - h.score || l.buffer.length - h.buffer.length) > 0)
                i.splice(a--, 1);
              else {
                i.splice(o--, 1);
                continue e;
              }
          }
        }
      i.length > 12 && i.splice(
        12,
        i.length - 12
        /* Rec.MaxStackCount */
      );
    }
    this.minStackPos = i[0].pos;
    for (let o = 1; o < i.length; o++)
      i[o].pos < this.minStackPos && (this.minStackPos = i[o].pos);
    return null;
  }
  stopAt(e) {
    if (this.stoppedAt != null && this.stoppedAt < e)
      throw new RangeError("Can't move stoppedAt forward");
    this.stoppedAt = e;
  }
  // Returns an updated version of the given stack, or null if the
  // stack can't advance normally. When `split` and `stacks` are
  // given, stacks split off by ambiguous operations will be pushed to
  // `split`, or added to `stacks` if they move `pos` forward.
  advanceStack(e, t, i) {
    let s = e.pos, { parser: r } = this, o = Ce ? this.stackID(e) + " -> " : "";
    if (this.stoppedAt != null && s > this.stoppedAt)
      return e.forceReduce() ? e : null;
    if (this.fragments) {
      let h = e.curContext && e.curContext.tracker.strict, c = h ? e.curContext.hash : 0;
      for (let f = this.fragments.nodeAt(s); f; ) {
        let u = this.parser.nodeSet.types[f.type.id] == f.type ? r.getGoto(e.state, f.type.id) : -1;
        if (u > -1 && f.length && (!h || (f.prop(N.contextHash) || 0) == c))
          return e.useNode(f, u), Ce && console.log(o + this.stackID(e) + ` (via reuse of ${r.getName(f.type.id)})`), !0;
        if (!(f instanceof Y) || f.children.length == 0 || f.positions[0] > 0)
          break;
        let d = f.children[0];
        if (d instanceof Y && f.positions[0] == 0)
          f = d;
        else
          break;
      }
    }
    let l = r.stateSlot(
      e.state,
      4
      /* ParseState.DefaultReduce */
    );
    if (l > 0)
      return e.reduce(l), Ce && console.log(o + this.stackID(e) + ` (via always-reduce ${r.getName(
        l & 65535
        /* Action.ValueMask */
      )})`), !0;
    if (e.stack.length >= 8400)
      for (; e.stack.length > 6e3 && e.forceReduce(); )
        ;
    let a = this.tokens.getActions(e);
    for (let h = 0; h < a.length; ) {
      let c = a[h++], f = a[h++], u = a[h++], d = h == a.length || !i, p = d ? e : e.split(), g = this.tokens.mainToken;
      if (p.apply(c, f, g ? g.start : p.pos, u), Ce && console.log(o + this.stackID(p) + ` (via ${c & 65536 ? `reduce of ${r.getName(
        c & 65535
        /* Action.ValueMask */
      )}` : "shift"} for ${r.getName(f)} @ ${s}${p == e ? "" : ", split"})`), d)
        return !0;
      p.pos > s ? t.push(p) : i.push(p);
    }
    return !1;
  }
  // Advance a given stack forward as far as it will go. Returns the
  // (possibly updated) stack if it got stuck, or null if it moved
  // forward and was given to `pushStackDedup`.
  advanceFully(e, t) {
    let i = e.pos;
    for (; ; ) {
      if (!this.advanceStack(e, null, null))
        return !1;
      if (e.pos > i)
        return Kl(e, t), !0;
    }
  }
  runRecovery(e, t, i) {
    let s = null, r = !1;
    for (let o = 0; o < e.length; o++) {
      let l = e[o], a = t[o << 1], h = t[(o << 1) + 1], c = Ce ? this.stackID(l) + " -> " : "";
      if (l.deadEnd && (r || (r = !0, l.restart(), Ce && console.log(c + this.stackID(l) + " (restarted)"), this.advanceFully(l, i))))
        continue;
      let f = l.split(), u = c;
      for (let d = 0; f.forceReduce() && d < 10 && (Ce && console.log(u + this.stackID(f) + " (via force-reduce)"), !this.advanceFully(f, i)); d++)
        Ce && (u = this.stackID(f) + " -> ");
      for (let d of l.recoverByInsert(a))
        Ce && console.log(c + this.stackID(d) + " (via recover-insert)"), this.advanceFully(d, i);
      this.stream.end > l.pos ? (h == l.pos && (h++, a = 0), l.recoverByDelete(a, h), Ce && console.log(c + this.stackID(l) + ` (via recover-delete ${this.parser.getName(a)})`), Kl(l, i)) : (!s || s.score < l.score) && (s = l);
    }
    return s;
  }
  // Convert the stack's buffer to a syntax tree.
  stackToTree(e) {
    return e.close(), Y.build({
      buffer: Xn.create(e),
      nodeSet: this.parser.nodeSet,
      topID: this.topTerm,
      maxBufferLength: this.parser.bufferLength,
      reused: this.reused,
      start: this.ranges[0].from,
      length: e.pos - this.ranges[0].from,
      minRepeatType: this.parser.minRepeatTerm
    });
  }
  stackID(e) {
    let t = (Es || (Es = /* @__PURE__ */ new WeakMap())).get(e);
    return t || Es.set(e, t = String.fromCodePoint(this.nextStackID++)), t + e;
  }
}
function Kl(n, e) {
  for (let t = 0; t < e.length; t++) {
    let i = e[t];
    if (i.pos == n.pos && i.sameState(n)) {
      e[t].score < n.score && (e[t] = n);
      return;
    }
  }
  e.push(n);
}
class j0 {
  constructor(e, t, i) {
    this.source = e, this.flags = t, this.disabled = i;
  }
  allows(e) {
    return !this.disabled || this.disabled[e] == 0;
  }
}
class jn extends Dh {
  /**
  @internal
  */
  constructor(e) {
    if (super(), this.wrappers = [], e.version != 14)
      throw new RangeError(`Parser version (${e.version}) doesn't match runtime version (14)`);
    let t = e.nodeNames.split(" ");
    this.minRepeatTerm = t.length;
    for (let l = 0; l < e.repeatNodeCount; l++)
      t.push("");
    let i = Object.keys(e.topRules).map((l) => e.topRules[l][1]), s = [];
    for (let l = 0; l < t.length; l++)
      s.push([]);
    function r(l, a, h) {
      s[l].push([a, a.deserialize(String(h))]);
    }
    if (e.nodeProps)
      for (let l of e.nodeProps) {
        let a = l[0];
        typeof a == "string" && (a = N[a]);
        for (let h = 1; h < l.length; ) {
          let c = l[h++];
          if (c >= 0)
            r(c, a, l[h++]);
          else {
            let f = l[h + -c];
            for (let u = -c; u > 0; u--)
              r(l[h++], a, f);
            h++;
          }
        }
      }
    this.nodeSet = new Hr(t.map((l, a) => Oe.define({
      name: a >= this.minRepeatTerm ? void 0 : l,
      id: a,
      props: s[a],
      top: i.indexOf(a) > -1,
      error: a == 0,
      skipped: e.skippedNodes && e.skippedNodes.indexOf(a) > -1
    }))), e.propSources && (this.nodeSet = this.nodeSet.extend(...e.propSources)), this.strict = !1, this.bufferLength = Ah;
    let o = mi(e.tokenData);
    this.context = e.context, this.specializerSpecs = e.specialized || [], this.specialized = new Uint16Array(this.specializerSpecs.length);
    for (let l = 0; l < this.specializerSpecs.length; l++)
      this.specialized[l] = this.specializerSpecs[l].term;
    this.specializers = this.specializerSpecs.map(_l), this.states = mi(e.states, Uint32Array), this.data = mi(e.stateData), this.goto = mi(e.goto), this.maxTerm = e.maxTerm, this.tokenizers = e.tokenizers.map((l) => typeof l == "number" ? new Gt(o, l) : l), this.topRules = e.topRules, this.dialects = e.dialects || {}, this.dynamicPrecedences = e.dynamicPrecedences || null, this.tokenPrecTable = e.tokenPrec, this.termNames = e.termNames || null, this.maxNode = this.nodeSet.types.length - 1, this.dialect = this.parseDialect(), this.top = this.topRules[Object.keys(this.topRules)[0]];
  }
  createParse(e, t, i) {
    let s = new X0(this, e, t, i);
    for (let r of this.wrappers)
      s = r(s, e, t, i);
    return s;
  }
  /**
  Get a goto table entry @internal
  */
  getGoto(e, t, i = !1) {
    let s = this.goto;
    if (t >= s[0])
      return -1;
    for (let r = s[t + 1]; ; ) {
      let o = s[r++], l = o & 1, a = s[r++];
      if (l && i)
        return a;
      for (let h = r + (o >> 1); r < h; r++)
        if (s[r] == e)
          return a;
      if (l)
        return -1;
    }
  }
  /**
  Check if this state has an action for a given terminal @internal
  */
  hasAction(e, t) {
    let i = this.data;
    for (let s = 0; s < 2; s++)
      for (let r = this.stateSlot(
        e,
        s ? 2 : 1
        /* ParseState.Actions */
      ), o; ; r += 3) {
        if ((o = i[r]) == 65535)
          if (i[r + 1] == 1)
            o = i[r = tt(i, r + 2)];
          else {
            if (i[r + 1] == 2)
              return tt(i, r + 2);
            break;
          }
        if (o == t || o == 0)
          return tt(i, r + 1);
      }
    return 0;
  }
  /**
  @internal
  */
  stateSlot(e, t) {
    return this.states[e * 6 + t];
  }
  /**
  @internal
  */
  stateFlag(e, t) {
    return (this.stateSlot(
      e,
      0
      /* ParseState.Flags */
    ) & t) > 0;
  }
  /**
  @internal
  */
  validAction(e, t) {
    return !!this.allActions(e, (i) => i == t ? !0 : null);
  }
  /**
  @internal
  */
  allActions(e, t) {
    let i = this.stateSlot(
      e,
      4
      /* ParseState.DefaultReduce */
    ), s = i ? t(i) : void 0;
    for (let r = this.stateSlot(
      e,
      1
      /* ParseState.Actions */
    ); s == null; r += 3) {
      if (this.data[r] == 65535)
        if (this.data[r + 1] == 1)
          r = tt(this.data, r + 2);
        else
          break;
      s = t(tt(this.data, r + 1));
    }
    return s;
  }
  /**
  Get the states that can follow this one through shift actions or
  goto jumps. @internal
  */
  nextStates(e) {
    let t = [];
    for (let i = this.stateSlot(
      e,
      1
      /* ParseState.Actions */
    ); ; i += 3) {
      if (this.data[i] == 65535)
        if (this.data[i + 1] == 1)
          i = tt(this.data, i + 2);
        else
          break;
      if (!(this.data[i + 2] & 1)) {
        let s = this.data[i + 1];
        t.some((r, o) => o & 1 && r == s) || t.push(this.data[i], s);
      }
    }
    return t;
  }
  /**
  Configure the parser. Returns a new parser instance that has the
  given settings modified. Settings not provided in `config` are
  kept from the original parser.
  */
  configure(e) {
    let t = Object.assign(Object.create(jn.prototype), this);
    if (e.props && (t.nodeSet = this.nodeSet.extend(...e.props)), e.top) {
      let i = this.topRules[e.top];
      if (!i)
        throw new RangeError(`Invalid top rule name ${e.top}`);
      t.top = i;
    }
    return e.tokenizers && (t.tokenizers = this.tokenizers.map((i) => {
      let s = e.tokenizers.find((r) => r.from == i);
      return s ? s.to : i;
    })), e.specializers && (t.specializers = this.specializers.slice(), t.specializerSpecs = this.specializerSpecs.map((i, s) => {
      let r = e.specializers.find((l) => l.from == i.external);
      if (!r)
        return i;
      let o = Object.assign(Object.assign({}, i), { external: r.to });
      return t.specializers[s] = _l(o), o;
    })), e.contextTracker && (t.context = e.contextTracker), e.dialect && (t.dialect = this.parseDialect(e.dialect)), e.strict != null && (t.strict = e.strict), e.wrap && (t.wrappers = t.wrappers.concat(e.wrap)), e.bufferLength != null && (t.bufferLength = e.bufferLength), t;
  }
  /**
  Tells you whether any [parse wrappers](#lr.ParserConfig.wrap)
  are registered for this parser.
  */
  hasWrappers() {
    return this.wrappers.length > 0;
  }
  /**
  Returns the name associated with a given term. This will only
  work for all terms when the parser was generated with the
  `--names` option. By default, only the names of tagged terms are
  stored.
  */
  getName(e) {
    return this.termNames ? this.termNames[e] : String(e <= this.maxNode && this.nodeSet.types[e].name || e);
  }
  /**
  The eof term id is always allocated directly after the node
  types. @internal
  */
  get eofTerm() {
    return this.maxNode + 1;
  }
  /**
  The type of top node produced by the parser.
  */
  get topNode() {
    return this.nodeSet.types[this.top[1]];
  }
  /**
  @internal
  */
  dynamicPrecedence(e) {
    let t = this.dynamicPrecedences;
    return t == null ? 0 : t[e] || 0;
  }
  /**
  @internal
  */
  parseDialect(e) {
    let t = Object.keys(this.dialects), i = t.map(() => !1);
    if (e)
      for (let r of e.split(" ")) {
        let o = t.indexOf(r);
        o >= 0 && (i[o] = !0);
      }
    let s = null;
    for (let r = 0; r < t.length; r++)
      if (!i[r])
        for (let o = this.dialects[t[r]], l; (l = this.data[o++]) != 65535; )
          (s || (s = new Uint8Array(this.maxTerm + 1)))[l] = 1;
    return new j0(e, i, s);
  }
  /**
  Used by the output of the parser generator. Not available to
  user code. @hide
  */
  static deserialize(e) {
    return new jn(e);
  }
}
function tt(n, e) {
  return n[e] | n[e + 1] << 16;
}
function G0(n) {
  let e = null;
  for (let t of n) {
    let i = t.p.stoppedAt;
    (t.pos == t.p.stream.end || i != null && t.pos > i) && t.p.parser.stateFlag(
      t.state,
      2
      /* StateFlag.Accepting */
    ) && (!e || e.score < t.score) && (e = t);
  }
  return e;
}
function _l(n) {
  if (n.external) {
    let e = n.extend ? 1 : 0;
    return (t, i) => n.external(t, i) << 1 | e;
  }
  return n.get;
}
const K0 = 96, Yl = 1, _0 = 97, Y0 = 98, Zl = 2, Jc = [
  9,
  10,
  11,
  12,
  13,
  32,
  133,
  160,
  5760,
  8192,
  8193,
  8194,
  8195,
  8196,
  8197,
  8198,
  8199,
  8200,
  8201,
  8202,
  8232,
  8233,
  8239,
  8287,
  12288
], Z0 = 58, J0 = 40, ef = 95, ey = 91, kn = 45, ty = 46, iy = 35, ny = 37, sy = 38, ry = 92, oy = 10;
function Gn(n) {
  return n >= 65 && n <= 90 || n >= 97 && n <= 122 || n >= 161;
}
function ly(n) {
  return n >= 48 && n <= 57;
}
const ay = new lo((n, e) => {
  for (let t = !1, i = 0, s = 0; ; s++) {
    let { next: r } = n;
    if (Gn(r) || r == kn || r == ef || t && ly(r))
      !t && (r != kn || s > 0) && (t = !0), i === s && r == kn && i++, n.advance();
    else if (r == ry && n.peek(1) != oy)
      n.advance(), n.next > -1 && n.advance(), t = !0;
    else {
      t && n.acceptToken(r == J0 ? _0 : i == 2 && e.canShift(Zl) ? Zl : Y0);
      break;
    }
  }
}), hy = new lo((n) => {
  if (Jc.includes(n.peek(-1))) {
    let { next: e } = n;
    (Gn(e) || e == ef || e == iy || e == ty || e == ey || e == Z0 || e == kn || e == sy) && n.acceptToken(K0);
  }
}), cy = new lo((n) => {
  if (!Jc.includes(n.peek(-1))) {
    let { next: e } = n;
    if (e == ny && (n.advance(), n.acceptToken(Yl)), Gn(e)) {
      do
        n.advance();
      while (Gn(n.next));
      n.acceptToken(Yl);
    }
  }
}), fy = Rh({
  "AtKeyword import charset namespace keyframes media supports": x.definitionKeyword,
  "from to selector": x.keyword,
  NamespaceName: x.namespace,
  KeyframeName: x.labelName,
  KeyframeRangeName: x.operatorKeyword,
  TagName: x.tagName,
  ClassName: x.className,
  PseudoClassName: x.constant(x.className),
  IdName: x.labelName,
  "FeatureName PropertyName": x.propertyName,
  AttributeName: x.attributeName,
  NumberLiteral: x.number,
  KeywordQuery: x.keyword,
  UnaryQueryOp: x.operatorKeyword,
  "CallTag ValueName": x.atom,
  VariableName: x.variableName,
  Callee: x.operatorKeyword,
  Unit: x.unit,
  "UniversalSelector NestingSelector": x.definitionOperator,
  MatchOp: x.compareOperator,
  "ChildOp SiblingOp, LogicOp": x.logicOperator,
  BinOp: x.arithmeticOperator,
  Important: x.modifier,
  Comment: x.blockComment,
  ColorLiteral: x.color,
  "ParenthesizedContent StringLiteral": x.string,
  ":": x.punctuation,
  "PseudoOp #": x.derefOperator,
  "; ,": x.separator,
  "( )": x.paren,
  "[ ]": x.squareBracket,
  "{ }": x.brace
}), uy = { __proto__: null, lang: 32, "nth-child": 32, "nth-last-child": 32, "nth-of-type": 32, "nth-last-of-type": 32, dir: 32, "host-context": 32, url: 60, "url-prefix": 60, domain: 60, regexp: 60, selector: 134 }, dy = { __proto__: null, "@import": 114, "@media": 138, "@charset": 142, "@namespace": 146, "@keyframes": 152, "@supports": 164 }, py = { __proto__: null, not: 128, only: 128 }, my = jn.deserialize({
  version: 14,
  states: "9bQYQ[OOO#_Q[OOP#fOWOOOOQP'#Cd'#CdOOQP'#Cc'#CcO#kQ[O'#CfO$_QXO'#CaO$fQ[O'#ChO$qQ[O'#DPO$vQ[O'#DTOOQP'#Ej'#EjO${QdO'#DeO%gQ[O'#DrO${QdO'#DtO%xQ[O'#DvO&TQ[O'#DyO&]Q[O'#EPO&kQ[O'#EROOQS'#Ei'#EiOOQS'#EU'#EUQYQ[OOO&rQXO'#CdO'gQWO'#DaO'lQWO'#EpO'wQ[O'#EpQOQWOOP(RO#tO'#C_POOO)C@X)C@XOOQP'#Cg'#CgOOQP,59Q,59QO#kQ[O,59QO(^Q[O'#EXO(xQWO,58{O)QQ[O,59SO$qQ[O,59kO$vQ[O,59oO(^Q[O,59sO(^Q[O,59uO(^Q[O,59vO)]Q[O'#D`OOQS,58{,58{OOQP'#Ck'#CkOOQO'#C}'#C}OOQP,59S,59SO)dQWO,59SO)iQWO,59SOOQP'#DR'#DROOQP,59k,59kOOQO'#DV'#DVO)nQ`O,59oOOQS'#Cp'#CpO${QdO'#CqO)vQvO'#CsO+TQtO,5:POOQO'#Cx'#CxO)iQWO'#CwO+iQWO'#CyOOQS'#Em'#EmOOQO'#Dh'#DhO+nQ[O'#DoO+|QWO'#EqO&]Q[O'#DmO,[QWO'#DpOOQO'#Er'#ErO({QWO,5:^O,aQpO,5:`OOQS'#Dx'#DxO,iQWO,5:bO,nQ[O,5:bOOQO'#D{'#D{O,vQWO,5:eO,{QWO,5:kO-TQWO,5:mOOQS-E8S-E8SO${QdO,59{O-]Q[O'#EZO-jQWO,5;[O-jQWO,5;[POOO'#ET'#ETP-uO#tO,58yPOOO,58y,58yOOQP1G.l1G.lO.lQXO,5:sOOQO-E8V-E8VOOQS1G.g1G.gOOQP1G.n1G.nO)dQWO1G.nO)iQWO1G.nOOQP1G/V1G/VO.yQ`O1G/ZO/dQXO1G/_O/zQXO1G/aO0bQXO1G/bO0xQWO,59zO0}Q[O'#DOO1UQdO'#CoOOQP1G/Z1G/ZO${QdO1G/ZO1]QpO,59]OOQS,59_,59_O${QdO,59aO1eQWO1G/kOOQS,59c,59cO1jQ!bO,59eO1rQWO'#DhO1}QWO,5:TO2SQWO,5:ZO&]Q[O,5:VO&]Q[O'#E[O2[QWO,5;]O2gQWO,5:XO(^Q[O,5:[OOQS1G/x1G/xOOQS1G/z1G/zOOQS1G/|1G/|O2xQWO1G/|O2}QdO'#D|OOQS1G0P1G0POOQS1G0V1G0VOOQS1G0X1G0XO3YQtO1G/gOOQO,5:u,5:uO3pQ[O,5:uOOQO-E8X-E8XO3}QWO1G0vPOOO-E8R-E8RPOOO1G.e1G.eOOQP7+$Y7+$YOOQP7+$u7+$uO${QdO7+$uOOQS1G/f1G/fO4YQXO'#EoO4aQWO,59jO4fQtO'#EVO5ZQdO'#ElO5eQWO,59ZO5jQpO7+$uOOQS1G.w1G.wOOQS1G.{1G.{OOQS7+%V7+%VO5rQWO1G/PO${QdO1G/oOOQO1G/u1G/uOOQO1G/q1G/qO5wQWO,5:vOOQO-E8Y-E8YO6VQXO1G/vOOQS7+%h7+%hO6^QYO'#CsOOQO'#EO'#EOO6iQ`O'#D}OOQO'#D}'#D}O6tQWO'#E]O6|QdO,5:hOOQS,5:h,5:hO7XQtO'#EYO${QdO'#EYO8VQdO7+%ROOQO7+%R7+%ROOQO1G0a1G0aO8jQpO<<HaO8rQWO,5;ZOOQP1G/U1G/UOOQS-E8T-E8TO${QdO'#EWO8zQWO,5;WOOQT1G.u1G.uOOQP<<Ha<<HaOOQS7+$k7+$kO9SQdO7+%ZOOQO7+%b7+%bOOQO,5:i,5:iO3QQdO'#E^O6tQWO,5:wOOQS,5:w,5:wOOQS-E8Z-E8ZOOQS1G0S1G0SO9ZQtO,5:tOOQS-E8W-E8WOOQO<<Hm<<HmOOQPAN={AN={O:XQdO,5:rOOQO-E8U-E8UOOQO<<Hu<<HuOOQO,5:x,5:xOOQO-E8[-E8[OOQS1G0c1G0c",
  stateData: ":k~O#WOS#XQQ~OUYOXYO]VO^VOtWOxXO!YaO!ZZO!g[O!i]O!k^O!n_O!t`O#URO#_TO~OQfOUYOXYO]VO^VOtWOxXO!YaO!ZZO!g[O!i]O!k^O!n_O!t`O#UeO#_TO~O#R#dP~P!ZO#XjO~O#UlO~O]qO^qOpoOtrOxsO|tO!PvO#SuO#_nO~O!RwO~P#pO`}O#TzO#UyO~O#U!OO~O#U!QO~OQ!ZOb!TOf!ZOh!ZOn!YO#T!WO#U!SO#b!UO~Ob!]O!b!_O!e!`O#U![O!R#eP~Oh!eOn!YO#U!dO~Oh!gO#U!gO~Ob!]O!b!_O!e!`O#U![O~O!W#eP~P%gO]WX]!UX^WXpWXtWXxWX|WX!PWX!RWX#SWX#_WX~O]!lO~O!W!mO#R#dX!Q#dX~O#R#dX!Q#dX~P!ZO#Y!pO#Z!pO#[!rO~OUYOXYO]VO^VOtWOxXO#URO#_TO~OpoO!RwO~O`!yO#TzO#UyO~O!Q#dP~P!ZOb#QO~Ob#RO~Ov#SOz#TO~OP#VObgXjgX!WgX!bgX!egX#UgXagXQgXfgXhgXngXpgX!VgX#RgX#TgX#bgXvgX!QgX~Ob!]Oj#WO!b!_O!e!`O#U![O!W#eP~Ob#ZO~Ob!]O!b!_O!e!`O#U#[O~Op#`O!`#_O!R#eX!W#eX~Ob#cO~Oj#WO!W#eO~O!W#fO~Oh#gOn!YO~O!R#hO~O!RwO!`#_O~O!RwO!W#kO~O!W!}X#R!}X!Q!}X~P!ZO!W!mO#R#da!Q#da~O#Y!pO#Z!pO#[#rO~O]qO^qOtrOxsO|tO!PvO#SuO#_nO~Op!{a!R!{aa!{a~P.QOv#tOz#uO~O]qO^qOtrOxsO#_nO~Op{i|{i!P{i!R{i#S{ia{i~P/ROp}i|}i!P}i!R}i#S}ia}i~P/ROp!Oi|!Oi!P!Oi!R!Oi#S!Oia!Oi~P/RO!Q#vO~Oa#cP~P(^Oa#`P~P${Oa#}Oj#WO~O!W$PO~Oh$QOo$QO~O]!^Xa![X!`![X~O]$RO~Oa$SO!`#_O~Op#`O!R#ea!W#ea~O!`#_Op!aa!R!aa!W!aaa!aa~O!W$XO~O!Q$`O#U$ZO#b$YO~Oj#WOp$bO!V$dO!W!Ti#R!Ti!Q!Ti~P${O!W!}a#R!}a!Q!}a~P!ZO!W!mO#R#di!Q#di~Oa#cX~P#pOa$hO~Oj#WOQ!yXa!yXb!yXf!yXh!yXn!yXp!yX#T!yX#U!yX#b!yX~Op$jOa#`X~P${Oa$lO~Oj#WOv$mO~Oa$nO~O!`#_Op#Oa!R#Oa!W#Oa~Oa$pO~P.QOP#VOpgX!RgX~O#b$YOp!qX!R!qX~Op$rO!RwO~O!Q$vO#U$ZO#b$YO~Oj#WOQ!|Xb!|Xf!|Xh!|Xn!|Xp!|X!V!|X!W!|X#R!|X#T!|X#U!|X#b!|X!Q!|X~Op$bO!V$yO!W!Tq#R!Tq!Q!Tq~P${Oj#WOv$zO~OpoOa#ca~Op$jOa#`a~Oa$}O~P${Oj#WOQ!|ab!|af!|ah!|an!|ap!|a!V!|a!W!|a#R!|a#T!|a#U!|a#b!|a!Q!|a~Oa!zap!za~P${O#Wo#X#bj!P#b~",
  goto: "-Y#gPPP#hP#kP#t$TP#t$d#tPP$jPPP$p$y$yP%]P$yP$y%w&ZPPP&s&y#tP'PP#tP'VP#tP#t#tPPP']'r(PPP#kPP(W(W(b(WP(WP(W(WP#kP#kP#kP(e#kP(h(k(n(u#kP#kP(z)Q)a)o)u*P*V*a*g*mPPPPPPPPPP*s*|P+i+lP,b,e,k,tRkQ_bOPdhw!m#nkYOPdhotuvw!m#Q#c#nkSOPdhotuvw!m#Q#c#nQmTR!snQ{VR!wqQ!w}Q#Y!XR#s!yq!ZZ]!T!l#R#T#W#l#u#z$R$b$c$j$o${p!ZZ]!T!l#R#T#W#l#u#z$R$b$c$j$o${U$]#h$_$rR$q$[q!XZ]!T!l#R#T#W#l#u#z$R$b$c$j$o${p!ZZ]!T!l#R#T#W#l#u#z$R$b$c$j$o${Q!e^R#g!fQ|VR!xqQ!w|R#s!xQ!PWR!zrQ!RXR!{sQxUQ!vpQ#d!bQ#j!iQ#k!jQ$t$^R%Q$sSgPwQ!ohQ#m!mR$e#nZfPhw!m#na!a[`a!V!]!_#_#`R#]!]R!f^R!h_R#i!hS$^#h$_R%O$rV$[#h$_$rQ!qjR#q!qQdOShPwU!kdh#nR#n!mQ#z#RU$i#z$o${Q$o$RR${$jQ$k#zR$|$kQpUS!up$gR$g#wQ$c#lR$x$cQ!ngS#o!n#pR#p!oQ#a!^R$V#aQ$_#hR$u$_Q$s$^R%P$s_cOPdhw!m#n^UOPdhw!m#nQ!toQ!|tQ!}uQ#OvQ#w#QR$W#cR#{#RQ!VZQ!c]Q#U!TQ#l!l[#y#R#z$R$j$o${Q#|#TQ$O#WS$a#l$cQ$f#uR$w$bR#x#QQiPR#PwQ!b[Q!jaR#X!VU!^[a!VQ!i`Q#^!]Q#b!_Q$T#_R$U#`",
  nodeNames: "⚠ Unit VariableName Comment StyleSheet RuleSet UniversalSelector TagSelector TagName NestingSelector ClassSelector ClassName PseudoClassSelector : :: PseudoClassName PseudoClassName ) ( ArgList ValueName ParenthesizedValue ColorLiteral NumberLiteral StringLiteral BinaryExpression BinOp CallExpression Callee CallLiteral CallTag ParenthesizedContent , PseudoClassName ArgList IdSelector # IdName ] AttributeSelector [ AttributeName MatchOp ChildSelector ChildOp DescendantSelector SiblingSelector SiblingOp } { Block Declaration PropertyName Important ; ImportStatement AtKeyword import KeywordQuery FeatureQuery FeatureName BinaryQuery LogicOp UnaryQuery UnaryQueryOp ParenthesizedQuery SelectorQuery selector MediaStatement media CharsetStatement charset NamespaceStatement namespace NamespaceName KeyframesStatement keyframes KeyframeName KeyframeList KeyframeSelector KeyframeRangeName SupportsStatement supports AtRule Styles",
  maxTerm: 114,
  nodeProps: [
    ["openedBy", 17, "(", 48, "{"],
    ["closedBy", 18, ")", 49, "}"]
  ],
  propSources: [fy],
  skippedNodes: [0, 3, 85],
  repeatNodeCount: 10,
  tokenData: "J^~R!^OX$}X^%u^p$}pq%uqr)Xrs.Rst/utu6duv$}vw7^wx7oxy9^yz9oz{9t{|:_|}?Q}!O?c!O!P@Q!P!Q@i!Q![Ab![!]B]!]!^CX!^!_$}!_!`Cj!`!aC{!a!b$}!b!cDw!c!}$}!}#OFa#O#P$}#P#QFr#Q#R6d#R#T$}#T#UGT#U#c$}#c#dHf#d#o$}#o#pH{#p#q6d#q#rI^#r#sIo#s#y$}#y#z%u#z$f$}$f$g%u$g#BY$}#BY#BZ%u#BZ$IS$}$IS$I_%u$I_$I|$}$I|$JO%u$JO$JT$}$JT$JU%u$JU$KV$}$KV$KW%u$KW&FU$}&FU&FV%u&FV;'S$};'S;=`JW<%lO$}`%QSOy%^z;'S%^;'S;=`%o<%lO%^`%cSo`Oy%^z;'S%^;'S;=`%o<%lO%^`%rP;=`<%l%^~%zh#W~OX%^X^'f^p%^pq'fqy%^z#y%^#y#z'f#z$f%^$f$g'f$g#BY%^#BY#BZ'f#BZ$IS%^$IS$I_'f$I_$I|%^$I|$JO'f$JO$JT%^$JT$JU'f$JU$KV%^$KV$KW'f$KW&FU%^&FU&FV'f&FV;'S%^;'S;=`%o<%lO%^~'mh#W~o`OX%^X^'f^p%^pq'fqy%^z#y%^#y#z'f#z$f%^$f$g'f$g#BY%^#BY#BZ'f#BZ$IS%^$IS$I_'f$I_$I|%^$I|$JO'f$JO$JT%^$JT$JU'f$JU$KV%^$KV$KW'f$KW&FU%^&FU&FV'f&FV;'S%^;'S;=`%o<%lO%^l)[UOy%^z#]%^#]#^)n#^;'S%^;'S;=`%o<%lO%^l)sUo`Oy%^z#a%^#a#b*V#b;'S%^;'S;=`%o<%lO%^l*[Uo`Oy%^z#d%^#d#e*n#e;'S%^;'S;=`%o<%lO%^l*sUo`Oy%^z#c%^#c#d+V#d;'S%^;'S;=`%o<%lO%^l+[Uo`Oy%^z#f%^#f#g+n#g;'S%^;'S;=`%o<%lO%^l+sUo`Oy%^z#h%^#h#i,V#i;'S%^;'S;=`%o<%lO%^l,[Uo`Oy%^z#T%^#T#U,n#U;'S%^;'S;=`%o<%lO%^l,sUo`Oy%^z#b%^#b#c-V#c;'S%^;'S;=`%o<%lO%^l-[Uo`Oy%^z#h%^#h#i-n#i;'S%^;'S;=`%o<%lO%^l-uS!V[o`Oy%^z;'S%^;'S;=`%o<%lO%^~.UWOY.RZr.Rrs.ns#O.R#O#P.s#P;'S.R;'S;=`/o<%lO.R~.sOh~~.vRO;'S.R;'S;=`/P;=`O.R~/SXOY.RZr.Rrs.ns#O.R#O#P.s#P;'S.R;'S;=`/o;=`<%l.R<%lO.R~/rP;=`<%l.Rn/zYtQOy%^z!Q%^!Q![0j![!c%^!c!i0j!i#T%^#T#Z0j#Z;'S%^;'S;=`%o<%lO%^l0oYo`Oy%^z!Q%^!Q![1_![!c%^!c!i1_!i#T%^#T#Z1_#Z;'S%^;'S;=`%o<%lO%^l1dYo`Oy%^z!Q%^!Q![2S![!c%^!c!i2S!i#T%^#T#Z2S#Z;'S%^;'S;=`%o<%lO%^l2ZYf[o`Oy%^z!Q%^!Q![2y![!c%^!c!i2y!i#T%^#T#Z2y#Z;'S%^;'S;=`%o<%lO%^l3QYf[o`Oy%^z!Q%^!Q![3p![!c%^!c!i3p!i#T%^#T#Z3p#Z;'S%^;'S;=`%o<%lO%^l3uYo`Oy%^z!Q%^!Q![4e![!c%^!c!i4e!i#T%^#T#Z4e#Z;'S%^;'S;=`%o<%lO%^l4lYf[o`Oy%^z!Q%^!Q![5[![!c%^!c!i5[!i#T%^#T#Z5[#Z;'S%^;'S;=`%o<%lO%^l5aYo`Oy%^z!Q%^!Q![6P![!c%^!c!i6P!i#T%^#T#Z6P#Z;'S%^;'S;=`%o<%lO%^l6WSf[o`Oy%^z;'S%^;'S;=`%o<%lO%^d6gUOy%^z!_%^!_!`6y!`;'S%^;'S;=`%o<%lO%^d7QSzSo`Oy%^z;'S%^;'S;=`%o<%lO%^b7cSXQOy%^z;'S%^;'S;=`%o<%lO%^~7rWOY7oZw7owx.nx#O7o#O#P8[#P;'S7o;'S;=`9W<%lO7o~8_RO;'S7o;'S;=`8h;=`O7o~8kXOY7oZw7owx.nx#O7o#O#P8[#P;'S7o;'S;=`9W;=`<%l7o<%lO7o~9ZP;=`<%l7on9cSb^Oy%^z;'S%^;'S;=`%o<%lO%^~9tOa~n9{UUQjWOy%^z!_%^!_!`6y!`;'S%^;'S;=`%o<%lO%^n:fWjW!PQOy%^z!O%^!O!P;O!P!Q%^!Q![>T![;'S%^;'S;=`%o<%lO%^l;TUo`Oy%^z!Q%^!Q![;g![;'S%^;'S;=`%o<%lO%^l;nYo`#b[Oy%^z!Q%^!Q![;g![!g%^!g!h<^!h#X%^#X#Y<^#Y;'S%^;'S;=`%o<%lO%^l<cYo`Oy%^z{%^{|=R|}%^}!O=R!O!Q%^!Q![=j![;'S%^;'S;=`%o<%lO%^l=WUo`Oy%^z!Q%^!Q![=j![;'S%^;'S;=`%o<%lO%^l=qUo`#b[Oy%^z!Q%^!Q![=j![;'S%^;'S;=`%o<%lO%^l>[[o`#b[Oy%^z!O%^!O!P;g!P!Q%^!Q![>T![!g%^!g!h<^!h#X%^#X#Y<^#Y;'S%^;'S;=`%o<%lO%^n?VSp^Oy%^z;'S%^;'S;=`%o<%lO%^l?hWjWOy%^z!O%^!O!P;O!P!Q%^!Q![>T![;'S%^;'S;=`%o<%lO%^n@VU#_QOy%^z!Q%^!Q![;g![;'S%^;'S;=`%o<%lO%^~@nTjWOy%^z{@}{;'S%^;'S;=`%o<%lO%^~AUSo`#X~Oy%^z;'S%^;'S;=`%o<%lO%^lAg[#b[Oy%^z!O%^!O!P;g!P!Q%^!Q![>T![!g%^!g!h<^!h#X%^#X#Y<^#Y;'S%^;'S;=`%o<%lO%^bBbU]QOy%^z![%^![!]Bt!];'S%^;'S;=`%o<%lO%^bB{S^Qo`Oy%^z;'S%^;'S;=`%o<%lO%^nC^S!W^Oy%^z;'S%^;'S;=`%o<%lO%^dCoSzSOy%^z;'S%^;'S;=`%o<%lO%^bDQU|QOy%^z!`%^!`!aDd!a;'S%^;'S;=`%o<%lO%^bDkS|Qo`Oy%^z;'S%^;'S;=`%o<%lO%^bDzWOy%^z!c%^!c!}Ed!}#T%^#T#oEd#o;'S%^;'S;=`%o<%lO%^bEk[!YQo`Oy%^z}%^}!OEd!O!Q%^!Q![Ed![!c%^!c!}Ed!}#T%^#T#oEd#o;'S%^;'S;=`%o<%lO%^bFfSxQOy%^z;'S%^;'S;=`%o<%lO%^lFwSv[Oy%^z;'S%^;'S;=`%o<%lO%^bGWUOy%^z#b%^#b#cGj#c;'S%^;'S;=`%o<%lO%^bGoUo`Oy%^z#W%^#W#XHR#X;'S%^;'S;=`%o<%lO%^bHYS!`Qo`Oy%^z;'S%^;'S;=`%o<%lO%^bHiUOy%^z#f%^#f#gHR#g;'S%^;'S;=`%o<%lO%^fIQS!RUOy%^z;'S%^;'S;=`%o<%lO%^nIcS!Q^Oy%^z;'S%^;'S;=`%o<%lO%^fItU!PQOy%^z!_%^!_!`6y!`;'S%^;'S;=`%o<%lO%^`JZP;=`<%l$}",
  tokenizers: [hy, cy, ay, 1, 2, 3, 4, new Yc("m~RRYZ[z{a~~g~aO#Z~~dP!P!Qg~lO#[~~", 28, 102)],
  topRules: { StyleSheet: [0, 4], Styles: [1, 84] },
  specialized: [{ term: 97, get: (n) => uy[n] || -1 }, { term: 56, get: (n) => dy[n] || -1 }, { term: 98, get: (n) => py[n] || -1 }],
  tokenPrec: 1169
});
let Ls = null;
function Ns() {
  if (!Ls && typeof document == "object" && document.body) {
    let { style: n } = document.body, e = [], t = /* @__PURE__ */ new Set();
    for (let i in n)
      i != "cssText" && i != "cssFloat" && typeof n[i] == "string" && (/[A-Z]/.test(i) && (i = i.replace(/[A-Z]/g, (s) => "-" + s.toLowerCase())), t.has(i) || (e.push(i), t.add(i)));
    Ls = e.sort().map((i) => ({ type: "property", label: i }));
  }
  return Ls || [];
}
const Jl = /* @__PURE__ */ [
  "active",
  "after",
  "any-link",
  "autofill",
  "backdrop",
  "before",
  "checked",
  "cue",
  "default",
  "defined",
  "disabled",
  "empty",
  "enabled",
  "file-selector-button",
  "first",
  "first-child",
  "first-letter",
  "first-line",
  "first-of-type",
  "focus",
  "focus-visible",
  "focus-within",
  "fullscreen",
  "has",
  "host",
  "host-context",
  "hover",
  "in-range",
  "indeterminate",
  "invalid",
  "is",
  "lang",
  "last-child",
  "last-of-type",
  "left",
  "link",
  "marker",
  "modal",
  "not",
  "nth-child",
  "nth-last-child",
  "nth-last-of-type",
  "nth-of-type",
  "only-child",
  "only-of-type",
  "optional",
  "out-of-range",
  "part",
  "placeholder",
  "placeholder-shown",
  "read-only",
  "read-write",
  "required",
  "right",
  "root",
  "scope",
  "selection",
  "slotted",
  "target",
  "target-text",
  "valid",
  "visited",
  "where"
].map((n) => ({ type: "class", label: n })), ea = /* @__PURE__ */ [
  "above",
  "absolute",
  "activeborder",
  "additive",
  "activecaption",
  "after-white-space",
  "ahead",
  "alias",
  "all",
  "all-scroll",
  "alphabetic",
  "alternate",
  "always",
  "antialiased",
  "appworkspace",
  "asterisks",
  "attr",
  "auto",
  "auto-flow",
  "avoid",
  "avoid-column",
  "avoid-page",
  "avoid-region",
  "axis-pan",
  "background",
  "backwards",
  "baseline",
  "below",
  "bidi-override",
  "blink",
  "block",
  "block-axis",
  "bold",
  "bolder",
  "border",
  "border-box",
  "both",
  "bottom",
  "break",
  "break-all",
  "break-word",
  "bullets",
  "button",
  "button-bevel",
  "buttonface",
  "buttonhighlight",
  "buttonshadow",
  "buttontext",
  "calc",
  "capitalize",
  "caps-lock-indicator",
  "caption",
  "captiontext",
  "caret",
  "cell",
  "center",
  "checkbox",
  "circle",
  "cjk-decimal",
  "clear",
  "clip",
  "close-quote",
  "col-resize",
  "collapse",
  "color",
  "color-burn",
  "color-dodge",
  "column",
  "column-reverse",
  "compact",
  "condensed",
  "contain",
  "content",
  "contents",
  "content-box",
  "context-menu",
  "continuous",
  "copy",
  "counter",
  "counters",
  "cover",
  "crop",
  "cross",
  "crosshair",
  "currentcolor",
  "cursive",
  "cyclic",
  "darken",
  "dashed",
  "decimal",
  "decimal-leading-zero",
  "default",
  "default-button",
  "dense",
  "destination-atop",
  "destination-in",
  "destination-out",
  "destination-over",
  "difference",
  "disc",
  "discard",
  "disclosure-closed",
  "disclosure-open",
  "document",
  "dot-dash",
  "dot-dot-dash",
  "dotted",
  "double",
  "down",
  "e-resize",
  "ease",
  "ease-in",
  "ease-in-out",
  "ease-out",
  "element",
  "ellipse",
  "ellipsis",
  "embed",
  "end",
  "ethiopic-abegede-gez",
  "ethiopic-halehame-aa-er",
  "ethiopic-halehame-gez",
  "ew-resize",
  "exclusion",
  "expanded",
  "extends",
  "extra-condensed",
  "extra-expanded",
  "fantasy",
  "fast",
  "fill",
  "fill-box",
  "fixed",
  "flat",
  "flex",
  "flex-end",
  "flex-start",
  "footnotes",
  "forwards",
  "from",
  "geometricPrecision",
  "graytext",
  "grid",
  "groove",
  "hand",
  "hard-light",
  "help",
  "hidden",
  "hide",
  "higher",
  "highlight",
  "highlighttext",
  "horizontal",
  "hsl",
  "hsla",
  "hue",
  "icon",
  "ignore",
  "inactiveborder",
  "inactivecaption",
  "inactivecaptiontext",
  "infinite",
  "infobackground",
  "infotext",
  "inherit",
  "initial",
  "inline",
  "inline-axis",
  "inline-block",
  "inline-flex",
  "inline-grid",
  "inline-table",
  "inset",
  "inside",
  "intrinsic",
  "invert",
  "italic",
  "justify",
  "keep-all",
  "landscape",
  "large",
  "larger",
  "left",
  "level",
  "lighter",
  "lighten",
  "line-through",
  "linear",
  "linear-gradient",
  "lines",
  "list-item",
  "listbox",
  "listitem",
  "local",
  "logical",
  "loud",
  "lower",
  "lower-hexadecimal",
  "lower-latin",
  "lower-norwegian",
  "lowercase",
  "ltr",
  "luminosity",
  "manipulation",
  "match",
  "matrix",
  "matrix3d",
  "medium",
  "menu",
  "menutext",
  "message-box",
  "middle",
  "min-intrinsic",
  "mix",
  "monospace",
  "move",
  "multiple",
  "multiple_mask_images",
  "multiply",
  "n-resize",
  "narrower",
  "ne-resize",
  "nesw-resize",
  "no-close-quote",
  "no-drop",
  "no-open-quote",
  "no-repeat",
  "none",
  "normal",
  "not-allowed",
  "nowrap",
  "ns-resize",
  "numbers",
  "numeric",
  "nw-resize",
  "nwse-resize",
  "oblique",
  "opacity",
  "open-quote",
  "optimizeLegibility",
  "optimizeSpeed",
  "outset",
  "outside",
  "outside-shape",
  "overlay",
  "overline",
  "padding",
  "padding-box",
  "painted",
  "page",
  "paused",
  "perspective",
  "pinch-zoom",
  "plus-darker",
  "plus-lighter",
  "pointer",
  "polygon",
  "portrait",
  "pre",
  "pre-line",
  "pre-wrap",
  "preserve-3d",
  "progress",
  "push-button",
  "radial-gradient",
  "radio",
  "read-only",
  "read-write",
  "read-write-plaintext-only",
  "rectangle",
  "region",
  "relative",
  "repeat",
  "repeating-linear-gradient",
  "repeating-radial-gradient",
  "repeat-x",
  "repeat-y",
  "reset",
  "reverse",
  "rgb",
  "rgba",
  "ridge",
  "right",
  "rotate",
  "rotate3d",
  "rotateX",
  "rotateY",
  "rotateZ",
  "round",
  "row",
  "row-resize",
  "row-reverse",
  "rtl",
  "run-in",
  "running",
  "s-resize",
  "sans-serif",
  "saturation",
  "scale",
  "scale3d",
  "scaleX",
  "scaleY",
  "scaleZ",
  "screen",
  "scroll",
  "scrollbar",
  "scroll-position",
  "se-resize",
  "self-start",
  "self-end",
  "semi-condensed",
  "semi-expanded",
  "separate",
  "serif",
  "show",
  "single",
  "skew",
  "skewX",
  "skewY",
  "skip-white-space",
  "slide",
  "slider-horizontal",
  "slider-vertical",
  "sliderthumb-horizontal",
  "sliderthumb-vertical",
  "slow",
  "small",
  "small-caps",
  "small-caption",
  "smaller",
  "soft-light",
  "solid",
  "source-atop",
  "source-in",
  "source-out",
  "source-over",
  "space",
  "space-around",
  "space-between",
  "space-evenly",
  "spell-out",
  "square",
  "start",
  "static",
  "status-bar",
  "stretch",
  "stroke",
  "stroke-box",
  "sub",
  "subpixel-antialiased",
  "svg_masks",
  "super",
  "sw-resize",
  "symbolic",
  "symbols",
  "system-ui",
  "table",
  "table-caption",
  "table-cell",
  "table-column",
  "table-column-group",
  "table-footer-group",
  "table-header-group",
  "table-row",
  "table-row-group",
  "text",
  "text-bottom",
  "text-top",
  "textarea",
  "textfield",
  "thick",
  "thin",
  "threeddarkshadow",
  "threedface",
  "threedhighlight",
  "threedlightshadow",
  "threedshadow",
  "to",
  "top",
  "transform",
  "translate",
  "translate3d",
  "translateX",
  "translateY",
  "translateZ",
  "transparent",
  "ultra-condensed",
  "ultra-expanded",
  "underline",
  "unidirectional-pan",
  "unset",
  "up",
  "upper-latin",
  "uppercase",
  "url",
  "var",
  "vertical",
  "vertical-text",
  "view-box",
  "visible",
  "visibleFill",
  "visiblePainted",
  "visibleStroke",
  "visual",
  "w-resize",
  "wait",
  "wave",
  "wider",
  "window",
  "windowframe",
  "windowtext",
  "words",
  "wrap",
  "wrap-reverse",
  "x-large",
  "x-small",
  "xor",
  "xx-large",
  "xx-small"
].map((n) => ({ type: "keyword", label: n })).concat(/* @__PURE__ */ [
  "aliceblue",
  "antiquewhite",
  "aqua",
  "aquamarine",
  "azure",
  "beige",
  "bisque",
  "black",
  "blanchedalmond",
  "blue",
  "blueviolet",
  "brown",
  "burlywood",
  "cadetblue",
  "chartreuse",
  "chocolate",
  "coral",
  "cornflowerblue",
  "cornsilk",
  "crimson",
  "cyan",
  "darkblue",
  "darkcyan",
  "darkgoldenrod",
  "darkgray",
  "darkgreen",
  "darkkhaki",
  "darkmagenta",
  "darkolivegreen",
  "darkorange",
  "darkorchid",
  "darkred",
  "darksalmon",
  "darkseagreen",
  "darkslateblue",
  "darkslategray",
  "darkturquoise",
  "darkviolet",
  "deeppink",
  "deepskyblue",
  "dimgray",
  "dodgerblue",
  "firebrick",
  "floralwhite",
  "forestgreen",
  "fuchsia",
  "gainsboro",
  "ghostwhite",
  "gold",
  "goldenrod",
  "gray",
  "grey",
  "green",
  "greenyellow",
  "honeydew",
  "hotpink",
  "indianred",
  "indigo",
  "ivory",
  "khaki",
  "lavender",
  "lavenderblush",
  "lawngreen",
  "lemonchiffon",
  "lightblue",
  "lightcoral",
  "lightcyan",
  "lightgoldenrodyellow",
  "lightgray",
  "lightgreen",
  "lightpink",
  "lightsalmon",
  "lightseagreen",
  "lightskyblue",
  "lightslategray",
  "lightsteelblue",
  "lightyellow",
  "lime",
  "limegreen",
  "linen",
  "magenta",
  "maroon",
  "mediumaquamarine",
  "mediumblue",
  "mediumorchid",
  "mediumpurple",
  "mediumseagreen",
  "mediumslateblue",
  "mediumspringgreen",
  "mediumturquoise",
  "mediumvioletred",
  "midnightblue",
  "mintcream",
  "mistyrose",
  "moccasin",
  "navajowhite",
  "navy",
  "oldlace",
  "olive",
  "olivedrab",
  "orange",
  "orangered",
  "orchid",
  "palegoldenrod",
  "palegreen",
  "paleturquoise",
  "palevioletred",
  "papayawhip",
  "peachpuff",
  "peru",
  "pink",
  "plum",
  "powderblue",
  "purple",
  "rebeccapurple",
  "red",
  "rosybrown",
  "royalblue",
  "saddlebrown",
  "salmon",
  "sandybrown",
  "seagreen",
  "seashell",
  "sienna",
  "silver",
  "skyblue",
  "slateblue",
  "slategray",
  "snow",
  "springgreen",
  "steelblue",
  "tan",
  "teal",
  "thistle",
  "tomato",
  "turquoise",
  "violet",
  "wheat",
  "white",
  "whitesmoke",
  "yellow",
  "yellowgreen"
].map((n) => ({ type: "constant", label: n }))), gy = /* @__PURE__ */ [
  "a",
  "abbr",
  "address",
  "article",
  "aside",
  "b",
  "bdi",
  "bdo",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "div",
  "dl",
  "dt",
  "em",
  "figcaption",
  "figure",
  "footer",
  "form",
  "header",
  "hgroup",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "main",
  "meter",
  "nav",
  "ol",
  "output",
  "p",
  "pre",
  "ruby",
  "section",
  "select",
  "small",
  "source",
  "span",
  "strong",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "tr",
  "u",
  "ul"
].map((n) => ({ type: "type", label: n })), lt = /^(\w[\w-]*|-\w[\w-]*|)$/, yy = /^-(-[\w-]*)?$/;
function by(n, e) {
  var t;
  if ((n.name == "(" || n.type.isError) && (n = n.parent || n), n.name != "ArgList")
    return !1;
  let i = (t = n.parent) === null || t === void 0 ? void 0 : t.firstChild;
  return (i == null ? void 0 : i.name) != "Callee" ? !1 : e.sliceString(i.from, i.to) == "var";
}
const ta = /* @__PURE__ */ new tp(), xy = ["Declaration"];
function wy(n) {
  for (let e = n; ; ) {
    if (e.type.isTop)
      return e;
    if (!(e = e.parent))
      return n;
  }
}
function tf(n, e, t) {
  if (e.to - e.from > 4096) {
    let i = ta.get(e);
    if (i)
      return i;
    let s = [], r = /* @__PURE__ */ new Set(), o = e.cursor(ie.IncludeAnonymous);
    if (o.firstChild())
      do
        for (let l of tf(n, o.node, t))
          r.has(l.label) || (r.add(l.label), s.push(l));
      while (o.nextSibling());
    return ta.set(e, s), s;
  } else {
    let i = [], s = /* @__PURE__ */ new Set();
    return e.cursor().iterate((r) => {
      var o;
      if (t(r) && r.matchContext(xy) && ((o = r.node.nextSibling) === null || o === void 0 ? void 0 : o.name) == ":") {
        let l = n.sliceString(r.from, r.to);
        s.has(l) || (s.add(l), i.push({ label: l, type: "variable" }));
      }
    }), i;
  }
}
const ky = (n) => (e) => {
  let { state: t, pos: i } = e, s = ae(t).resolveInner(i, -1), r = s.type.isError && s.from == s.to - 1 && t.doc.sliceString(s.from, s.to) == "-";
  if (s.name == "PropertyName" || (r || s.name == "TagName") && /^(Block|Styles)$/.test(s.resolve(s.to).name))
    return { from: s.from, options: Ns(), validFor: lt };
  if (s.name == "ValueName")
    return { from: s.from, options: ea, validFor: lt };
  if (s.name == "PseudoClassName")
    return { from: s.from, options: Jl, validFor: lt };
  if (n(s) || (e.explicit || r) && by(s, t.doc))
    return {
      from: n(s) || r ? s.from : i,
      options: tf(t.doc, wy(s), n),
      validFor: yy
    };
  if (s.name == "TagName") {
    for (let { parent: a } = s; a; a = a.parent)
      if (a.name == "Block")
        return { from: s.from, options: Ns(), validFor: lt };
    return { from: s.from, options: gy, validFor: lt };
  }
  if (!e.explicit)
    return null;
  let o = s.resolve(i), l = o.childBefore(i);
  return l && l.name == ":" && o.name == "PseudoClassSelector" ? { from: i, options: Jl, validFor: lt } : l && l.name == ":" && o.name == "Declaration" || o.name == "ArgList" ? { from: i, options: ea, validFor: lt } : o.name == "Block" || o.name == "Styles" ? { from: i, options: Ns(), validFor: lt } : null;
}, Oy = /* @__PURE__ */ ky((n) => n.name == "VariableName"), ia = /* @__PURE__ */ Bn.define({
  name: "css",
  parser: /* @__PURE__ */ my.configure({
    props: [
      /* @__PURE__ */ Nh.add({
        Declaration: /* @__PURE__ */ vp()
      }),
      /* @__PURE__ */ Wh.add({
        "Block KeyframeList": Tp
      })
    ]
  }),
  languageData: {
    commentTokens: { block: { open: "/*", close: "*/" } },
    indentOnInput: /^\s*\}$/,
    wordChars: "-"
  }
});
function Sy() {
  return new mp(ia, ia.data.of({ autocomplete: Oy }));
}
class vy {
  constructor(e, t) {
    this.container = e, this.container.classList.add("bootstrap"), this.editorPane = document.createElement("div"), this.editorPane.classList = "panel panel-default", this.editorPane.id = "prestathema-editor-pane", this.editor = new T({
      doc: t,
      extensions: [
        z0,
        Zn.of(vc),
        Sy()
      ],
      parent: this.editorPane
    }), this.saveButton = document.createElement("button"), this.saveButton.classList = "btn btn-primary", this.saveButton.innerText = "Speichern", this.saveButton.addEventListener("click", (async function(i) {
      let s = window.location, r = {
        content: this.editor.state.doc.toString()
      };
      const o = await this.doFetch(
        s,
        "POST",
        JSON.stringify(r)
      );
      o.ok ? i.target.insertAdjacentHTML("afterend", "<span>👍</span>") : (i.target.insertAdjacentHTML("afterend", "<span>⚠️</span>"), alert("Es ist ein Fehler aufgetreten! Status: " + o.status));
    }).bind(this)), this.toolbar = document.createElement("div"), this.toolbar.setAttribute("id", "prestathema-toolbar"), this.toolbar.classList = "m-4 btn-toolbar panel panel-default", this.toolbar.appendChild(this.saveButton), this.container.appendChild(this.editorPane), this.container.appendChild(this.toolbar);
  }
  async doFetch(e, t, i, s = !1) {
    if (!s) {
      s = {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest"
      };
      let o = document.querySelector('meta[name="csrf-token"]');
      o != null && o.content != null && (s.authenticity_token = o.content);
    }
    return await fetch(e, {
      method: t,
      headers: s,
      body: i
    });
  }
}
document.addEventListener("DOMContentLoaded", function() {
  let n = document.getElementById("prestathema-source").innerText, e = document.getElementById("prestathema-editor");
  n != null && e.dataset.displayEditor == 1 && new vy(
    e,
    n
  );
}, !1);
console.log("hi from vite and prestathema v1");
