"use strict";(window.webpackJsonp_alltemplate=window.webpackJsonp_alltemplate||[]).push([[929],{86929:(e,t,n)=>{n.r(t),n.d(t,{default:()=>d});var a=n(34963),r=n(78995),l=n(44828),c=n.n(l),s=n(96540),i=n(47767),o=n(84976),u=n(41368);n(75999);const d=function(){var e=(0,i.Zp)(),t="https://api.github.com/users",n=(0,o.ok)(),l=(0,r.A)(n,1)[0],d=(0,s.useState)({1:{},2:{}}),p=(0,r.A)(d,2),b=p[0],f=p[1],m=(0,s.useState)(!0),g=(0,r.A)(m,2),x=g[0],h=g[1];function w(){return(w=(0,a.A)(c().mark((function e(){var n,a,r,s;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,n=l.get("personOne"),a=l.get("personTwo"),e.next=5,(0,u.A)(t,"/".concat(n));case 5:return r=e.sent,e.next=8,(0,u.A)(t,"/".concat(a));case 8:s=e.sent,console.log(s),r.followers>=s.followers?f({1:r,2:s}):f({1:s,2:r}),h(!1),e.next=18;break;case 14:e.prev=14,e.t0=e.catch(0),f({1:{},2:{}}),h(!1);case 18:case"end":return e.stop()}}),e,null,[[0,14]])})))).apply(this,arguments)}return(0,s.useEffect)((function(){!function(){w.apply(this,arguments)}()}),[]),s.createElement("div",{className:"battle-result-box"},!x&&s.createElement("div",null,s.createElement("h1",null,"Battle Result"),s.createElement("div",{className:"battle-user-box"},b&&s.createElement("div",{className:"battle-user-item"},s.createElement("div",null,"Winner"),s.createElement("img",{src:b[1].avatar_url,alt:""}),s.createElement("div",null,"Scores:"),s.createElement("div",null,"Name:",b[1].login),s.createElement("div",null,"followers:",b[1].followers),s.createElement("div",null,"123")),b&&s.createElement("div",{className:"battle-user-item"},s.createElement("div",null,"Loser"),s.createElement("img",{src:b[2].avatar_url,alt:""}),s.createElement("div",null,"Scores:"),s.createElement("div",null,"Name:",b[2].login),s.createElement("div",null,"followers:",b[2].followers),s.createElement("div",null,"123"))),s.createElement("div",{className:"battle-result-btn-box"},s.createElement("button",{onClick:function(){f({1:{},2:{}}),e("/battle")},type:"button"},"RESET"))),x&&s.createElement("h1",null,"Loading..."))}},41368:(e,t,n)=>{n.d(t,{A:()=>o});var a=n(34963),r=n(44828),l=n.n(r),c=n(58971),s=n.n(c);function i(){return i=(0,a.A)(l().mark((function e(t,n){var a,r,c,i,o=arguments;return l().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=o.length>2&&void 0!==o[2]?o[2]:{},e.prev=1,e.next=4,fetch(s()(r="".concat(t)).call(r,n),a);case 4:if((c=e.sent).ok){e.next=7;break}throw new Error("HTTP error! status: ".concat(c.status));case 7:return e.next=9,c.json();case 9:return i=e.sent,e.abrupt("return",i);case 13:throw e.prev=13,e.t0=e.catch(1),console.error("Fetch Error:",e.t0),e.t0;case 17:case"end":return e.stop()}}),e,null,[[1,13]])}))),i.apply(this,arguments)}const o=function(e,t){return i.apply(this,arguments)}},85440:(e,t,n)=>{n.d(t,{A:()=>s});var a=n(31601),r=n.n(a),l=n(76314),c=n.n(l)()(r());c.push([e.id,"/** @format */\n.battle-box {\n  text-align: center;\n}\n.battle-process {\n  display: flex;\n  padding: 40px 20%;\n  justify-content: space-around;\n}\n.battle-process div {\n  width: 150px;\n  height: 150px;\n  padding: 14px;\n  align-items: center;\n  background-image: linear-gradient(160deg, #ccfbfc, #c5eafe, #bdd3ff);\n}\n.battle-operate {\n  display: flex;\n  justify-content: space-around;\n  margin-top: 20px;\n}\n.battle-operate .battle-input-box {\n  width: 50%;\n  padding: 14px;\n}\n.battle-button {\n  width: 100px;\n  height: 30px;\n  line-height: 30px;\n}\n.show-user-box {\n  display: flex;\n  padding: 14px;\n  background: #f2f2f2;\n  justify-content: space-between;\n  font-size: 24px;\n}\n.show-user-box .show-user-box-left {\n  display: flex;\n}\n.show-user-box img {\n  width: 100px;\n  height: 100px;\n  margin-right: 24px;\n}\n.battle-button {\n  margin: 12px auto;\n  width: 100%;\n}\n.battle-button button {\n  width: 200px;\n  line-height: 40px;\n  background-image: linear-gradient(160deg, #ccfbfc, #c5eafe, #bdd3ff);\n}\n.battle-result-box {\n  text-align: center;\n}\n.battle-user-box {\n  display: flex;\n  justify-content: space-around;\n  width: 100%;\n}\n.battle-user-item {\n  width: 20%;\n  background-image: linear-gradient(160deg, #ccfbfc, #c5eafe, #bdd3ff);\n}\n.battle-user-item img {\n  width: 100px;\n  height: 100px;\n}\n.battle-result-btn-box button {\n  margin: 44px;\n  background-image: linear-gradient(160deg, #ccfbfc, #c5eafe, #bdd3ff);\n}\n",""]);const s=c},75999:(e,t,n)=>{var a=n(85072),r=n.n(a),l=n(97825),c=n.n(l),s=n(77659),i=n.n(s),o=n(55056),u=n.n(o),d=n(10540),p=n.n(d),b=n(41113),f=n.n(b),m=n(85440),g={};g.styleTagTransform=f(),g.setAttributes=u(),g.insert=i().bind(null,"head"),g.domAPI=c(),g.insertStyleElement=p();r()(m.A,g),m.A&&m.A.locals&&m.A.locals}}]);