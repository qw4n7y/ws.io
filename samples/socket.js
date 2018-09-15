!function(e){var t={};function n(s){if(t[s])return t[s].exports;var i=t[s]={i:s,l:!1,exports:{}};return e[s].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,s){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(n.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(s,i,function(t){return e[t]}.bind(null,i));return s},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=9)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});class s{constructor(e,t,n,s){this.type=e,this.payload=t,this.id=n,this.subscriptionId=s}with(e){const t=e.id?e.id:this.id,n=e.subscriptionId?e.subscriptionId:this.subscriptionId;return new s(this.type,this.payload,t,n)}static fromJSON(e){const t=JSON.parse(e);return new s(t.type,t.payload,t.id,t.subscriptionId)}}t.default=s},function(e,t){function n(){this._events=this._events||{},this._maxListeners=this._maxListeners||void 0}function s(e){return"function"==typeof e}function i(e){return"object"==typeof e&&null!==e}function r(e){return void 0===e}e.exports=n,n.EventEmitter=n,n.prototype._events=void 0,n.prototype._maxListeners=void 0,n.defaultMaxListeners=10,n.prototype.setMaxListeners=function(e){if(!function(e){return"number"==typeof e}(e)||e<0||isNaN(e))throw TypeError("n must be a positive number");return this._maxListeners=e,this},n.prototype.emit=function(e){var t,n,o,c,u,a;if(this._events||(this._events={}),"error"===e&&(!this._events.error||i(this._events.error)&&!this._events.error.length)){if((t=arguments[1])instanceof Error)throw t;var l=new Error('Uncaught, unspecified "error" event. ('+t+")");throw l.context=t,l}if(r(n=this._events[e]))return!1;if(s(n))switch(arguments.length){case 1:n.call(this);break;case 2:n.call(this,arguments[1]);break;case 3:n.call(this,arguments[1],arguments[2]);break;default:c=Array.prototype.slice.call(arguments,1),n.apply(this,c)}else if(i(n))for(c=Array.prototype.slice.call(arguments,1),o=(a=n.slice()).length,u=0;u<o;u++)a[u].apply(this,c);return!0},n.prototype.addListener=function(e,t){var o;if(!s(t))throw TypeError("listener must be a function");return this._events||(this._events={}),this._events.newListener&&this.emit("newListener",e,s(t.listener)?t.listener:t),this._events[e]?i(this._events[e])?this._events[e].push(t):this._events[e]=[this._events[e],t]:this._events[e]=t,i(this._events[e])&&!this._events[e].warned&&(o=r(this._maxListeners)?n.defaultMaxListeners:this._maxListeners)&&o>0&&this._events[e].length>o&&(this._events[e].warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[e].length),"function"==typeof console.trace&&console.trace()),this},n.prototype.on=n.prototype.addListener,n.prototype.once=function(e,t){if(!s(t))throw TypeError("listener must be a function");var n=!1;function i(){this.removeListener(e,i),n||(n=!0,t.apply(this,arguments))}return i.listener=t,this.on(e,i),this},n.prototype.removeListener=function(e,t){var n,r,o,c;if(!s(t))throw TypeError("listener must be a function");if(!this._events||!this._events[e])return this;if(o=(n=this._events[e]).length,r=-1,n===t||s(n.listener)&&n.listener===t)delete this._events[e],this._events.removeListener&&this.emit("removeListener",e,t);else if(i(n)){for(c=o;c-- >0;)if(n[c]===t||n[c].listener&&n[c].listener===t){r=c;break}if(r<0)return this;1===n.length?(n.length=0,delete this._events[e]):n.splice(r,1),this._events.removeListener&&this.emit("removeListener",e,t)}return this},n.prototype.removeAllListeners=function(e){var t,n;if(!this._events)return this;if(!this._events.removeListener)return 0===arguments.length?this._events={}:this._events[e]&&delete this._events[e],this;if(0===arguments.length){for(t in this._events)"removeListener"!==t&&this.removeAllListeners(t);return this.removeAllListeners("removeListener"),this._events={},this}if(s(n=this._events[e]))this.removeListener(e,n);else if(n)for(;n.length;)this.removeListener(e,n[n.length-1]);return delete this._events[e],this},n.prototype.listeners=function(e){return this._events&&this._events[e]?s(this._events[e])?[this._events[e]]:this._events[e].slice():[]},n.prototype.listenerCount=function(e){if(this._events){var t=this._events[e];if(s(t))return 1;if(t)return t.length}return 0},n.listenerCount=function(e,t){return e.listenerCount(t)}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=n(1);class i extends s.EventEmitter{constructor(e,t,n){super(),this.id=e,this.channel=t,this.socket=n}toJSON(){return{id:this.id,channel:this.channel}}static fromJSON(e,t){return new i(e.id,e.channel,t)}}t.default=i},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=n(4),i=n(1),r=n(5),o=n(0);class c extends i.EventEmitter{constructor(e){super(),this.TIMEOUT_MS=5e3,this.ws=e,this.bindEventHandlers()}static connect(e,t){const n=new s(e,t);return new c(n)}isActive(){return this.ws.readyState===s.OPEN}bindEventHandlers(){this.ws.onopen=(e=>{this.emit("open")}),this.ws.onerror=(e=>{this.emit("error",e.error)}),this.ws.onclose=(e=>{this.emit("close",e.code,e.reason)}),this.ws.onmessage=(e=>{try{const t=this.receiveRaw(e.data);this.emit("message",t)}catch(e){this.emit("error",e)}})}send(e,t="PUSH"){if(!this.isActive())throw new Error("Socket is inactive");switch(t){case"CLIENT_SERVER":e=e.with({id:r.v4()})}return new Promise((n,s)=>{switch(this.sendRaw(e,s),t){case"PUSH":return n(void 0);case"CLIENT_SERVER":{const t=setTimeout(()=>{const e=Error(`Response timeout (${this.TIMEOUT_MS}ms)`);s(e)},this.TIMEOUT_MS),i=s=>{e.id===s.id&&(clearTimeout(t),n(s))};this.on("message",i)}}})}receiveRaw(e){return console.log("<<< receiveRaw",e),o.default.fromJSON(e)}sendRaw(e,t){const n=JSON.stringify(e);console.log(">>> sendRaw",n),this.ws.send(n,{},e=>{e&&t(e)})}}t.default=c},function(e,t,n){(function(t){var n=null;"undefined"!=typeof WebSocket?n=WebSocket:"undefined"!=typeof MozWebSocket?n=MozWebSocket:void 0!==t?n=t.WebSocket||t.MozWebSocket:"undefined"!=typeof window?n=window.WebSocket||window.MozWebSocket:"undefined"!=typeof self&&(n=self.WebSocket||self.MozWebSocket),e.exports=n}).call(this,n(11))},function(e,t,n){var s=n(12),i=n(13),r=i;r.v1=s,r.v4=i,e.exports=r},function(e,t){var n="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof window.msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto);if(n){var s=new Uint8Array(16);e.exports=function(){return n(s),s}}else{var i=new Array(16);e.exports=function(){for(var e,t=0;t<16;t++)0==(3&t)&&(e=4294967296*Math.random()),i[t]=e>>>((3&t)<<3)&255;return i}}},function(e,t){for(var n=[],s=0;s<256;++s)n[s]=(s+256).toString(16).substr(1);e.exports=function(e,t){var s=t||0,i=n;return[i[e[s++]],i[e[s++]],i[e[s++]],i[e[s++]],"-",i[e[s++]],i[e[s++]],"-",i[e[s++]],i[e[s++]],"-",i[e[s++]],i[e[s++]],"-",i[e[s++]],i[e[s++]],i[e[s++]],i[e[s++]],i[e[s++]],i[e[s++]]].join("")}},function(e,t,n){"use strict";var s=this&&this.__awaiter||function(e,t,n,s){return new(n||(n=Promise))(function(i,r){function o(e){try{u(s.next(e))}catch(e){r(e)}}function c(e){try{u(s.throw(e))}catch(e){r(e)}}function u(e){e.done?i(e.value):new n(function(t){t(e.value)}).then(o,c)}u((s=s.apply(e,t||[])).next())})};Object.defineProperty(t,"__esModule",{value:!0});t.default=class{constructor(e){this.subscriptions=[],this.name=e}getSubscriptions(){return this.subscriptions}add(e){this.subscriptions.indexOf(e)>-1||this.subscriptions.push(e)}remove(e){this.subscriptions=this.subscriptions.filter(t=>t!==e)}broadcast(e){return s(this,void 0,void 0,function*(){for(let t of this.subscriptions){if(!t.socket.isActive())continue;const n=e.with({subscriptionId:t.id});yield t.socket.send(n,"PUSH")}})}}},function(e,t,n){e.exports=n(10)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=n(3);t.Socket=s.default;const i=n(0),r=n(14);t.Server=r.default;const o=n(8);t.Channel=o.default;const c=n(15);t.ChannelManager=c.default;const u=n(2);t.Subscription=u.default;const a=n(16);t.SubscriptionManager=a.default,"undefined"!=typeof window&&(window.Socket=s.default,window.Message=i.default,window.Server=r.default,window.Channel=o.default,window.ChannelManager=c.default,window.Subscription=u.default,window.SubscriptionManager=a.default)},function(e,t){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t,n){var s,i,r=n(6),o=n(7),c=0,u=0;e.exports=function(e,t,n){var a=t&&n||0,l=t||[],h=(e=e||{}).node||s,d=void 0!==e.clockseq?e.clockseq:i;if(null==h||null==d){var f=r();null==h&&(h=s=[1|f[0],f[1],f[2],f[3],f[4],f[5]]),null==d&&(d=i=16383&(f[6]<<8|f[7]))}var p=void 0!==e.msecs?e.msecs:(new Date).getTime(),v=void 0!==e.nsecs?e.nsecs:u+1,b=p-c+(v-u)/1e4;if(b<0&&void 0===e.clockseq&&(d=d+1&16383),(b<0||p>c)&&void 0===e.nsecs&&(v=0),v>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");c=p,u=v,i=d;var y=(1e4*(268435455&(p+=122192928e5))+v)%4294967296;l[a++]=y>>>24&255,l[a++]=y>>>16&255,l[a++]=y>>>8&255,l[a++]=255&y;var w=p/4294967296*1e4&268435455;l[a++]=w>>>8&255,l[a++]=255&w,l[a++]=w>>>24&15|16,l[a++]=w>>>16&255,l[a++]=d>>>8|128,l[a++]=255&d;for(var m=0;m<6;++m)l[a+m]=h[m];return t||o(l)}},function(e,t,n){var s=n(6),i=n(7);e.exports=function(e,t,n){var r=t&&n||0;"string"==typeof e&&(t="binary"===e?new Array(16):null,e=null);var o=(e=e||{}).random||(e.rng||s)();if(o[6]=15&o[6]|64,o[8]=63&o[8]|128,t)for(var c=0;c<16;++c)t[r+c]=o[c];return t||i(o)}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=n(4),i=n(1),r=n(3);t.default=class extends i.EventEmitter{listen(e){this.wss=new s.Server({host:e.host||"0.0.0.0",port:e.port||8e3}),this.wss.on("connection",this.onConnection.bind(this)),this.wss.on("error",this.onError.bind(this))}onConnection(e){const t=new r.default(e);this.emit("connection",t)}onError(e,t){console.error(`Socket ${e} error: ${JSON.stringify(t)}`),this.emit("error",t)}}},function(e,t,n){"use strict";var s=this&&this.__awaiter||function(e,t,n,s){return new(n||(n=Promise))(function(i,r){function o(e){try{u(s.next(e))}catch(e){r(e)}}function c(e){try{u(s.throw(e))}catch(e){r(e)}}function u(e){e.done?i(e.value):new n(function(t){t(e.value)}).then(o,c)}u((s=s.apply(e,t||[])).next())})};Object.defineProperty(t,"__esModule",{value:!0});const i=n(5),r=n(8),o=n(2),c=n(0);t.default=class{constructor(){this.channels={}}listen(e){e.on("message",this.onMessage.bind(this,e))}getOrCreateChannel(e){let t=this.channels[e];return t||(t=new r.default(e),this.channels[e]=t),t}onMessage(e,t){this.reducer(e,t).catch(e=>{console.error(`Reducer: error ${e} handling ${t}`)})}reducer(e,t){return s(this,void 0,void 0,function*(){"subscribe"!==t.type?"unsubscribe"!==t.type||(yield this.onUnsubscribe(e,t)):yield this.onSubscribe(e,t)})}onSubscribe(e,t){return s(this,void 0,void 0,function*(){if(!t.payload||!t.payload.channel)throw new Error(`Got bizzare subscribe request: ${JSON.stringify(t)}`);const n=t.payload.channel;let s=this.channels[n];s||(s=new r.default(n),this.channels[n]=s);let u=s.getSubscriptions().find(t=>t.socket===e);if(!u){const t=i.v4();u=new o.default(t,n,e)}s.add(u);const a=new c.default("subscribed",{subscription:u.toJSON()},t.id);yield e.send(a)})}onUnsubscribe(e,t){return s(this,void 0,void 0,function*(){if(!t.payload||!t.payload.subscription)throw new Error(`Got bizzare unsubscribe request: ${JSON.stringify(t)}`);const n=o.default.fromJSON(t.payload.subscription,e);let s=this.channels[n.channel];if(!s)return;let i=s.getSubscriptions().find(e=>e.id===n.id);if(!i)return;s.remove(i);const r=new c.default("unsubscribed",{subscription:i.toJSON()},t.id);yield e.send(r)})}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=n(2),i=n(0);t.default=class{constructor(e){this.subscriptions=[],this.socket=e,e.on("message",this.onMessage.bind(this))}getSubscriptions(){return this.subscriptions}onMessage(e){const t=e.subscriptionId;if(!t)return;const n=this.subscriptions.find(e=>e.id===t);n&&n.emit("message",e)}subscribe(e){const t=new i.default("subscribe",{channel:e}),n=this.subscriptions.find(t=>t.channel===e);return n?Promise.resolve(n):this.socket.send(t,"CLIENT_SERVER").then(e=>{if("subscribed"!==e.type||!e.payload||!e.payload.subscription)throw new Error(`Got bizzare subscribe response: ${JSON.stringify(e)}`);const t=s.default.fromJSON(e.payload.subscription,this.socket);return this.subscriptions.push(t),t})}unsubscribe(e){const t=new i.default("unsubscribe",{subscription:e.toJSON()});return this.socket.send(t,"CLIENT_SERVER").then(t=>{if("unsubscribed"!==t.type||!t.payload||!t.payload.subscription)throw new Error(`Got bizzare unsubscribe response: ${JSON.stringify(t)}`);const n=s.default.fromJSON(t.payload.subscription,this.socket);if(n.id!==e.id)throw new Error(`Desync: ${JSON.stringify(n)} on server, ${JSON.stringify(e)} on client`);return this.subscriptions=this.subscriptions.filter(t=>t.id!==e.id),!0})}}}]);
//# sourceMappingURL=socket.js.map