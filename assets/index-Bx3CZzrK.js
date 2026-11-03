(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`modulepreload`,t=function(e,t){return new URL(e,t).href},n={},r=function(e){return e.pathname.endsWith(`.css`)},i=function(e,t,n){if(t in e)return e[t];let r=n();if(!r){e[t]=void 0;return}let i=r.then(()=>{e[t]=void 0},n=>{throw e[t]=void 0,n});return e[t]=i,i},a=function(a,o,s){let c=Promise.resolve();if(o&&o.length>0){let a,l=document.querySelector(`meta[property=csp-nonce]`),u=l?.nonce||l?.getAttribute(`nonce`);function d(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function f(e){return import.meta.resolve?new URL(import.meta.resolve(e)):new URL(e,import.meta.url)}c=d(o.map(o=>{o=t(o,s);let c=f(o),l=r(c);return i(n,c.href,()=>{if(a===void 0){a={all:new Set,styles:new Set};let e=document.getElementsByTagName(`link`);for(let t=e.length-1;t>=0;t--){let n=e[t];a.all.add(n.href),n.rel===`stylesheet`&&a.styles.add(n.href)}}if((l?a.styles:a.all).has(c.href))return;let t=document.createElement(`link`);if(t.rel=l?`stylesheet`:e,l||(t.as=`script`),t.crossOrigin=``,t.href=c.href,u&&t.setAttribute(`nonce`,u),document.head.appendChild(t),l)return new Promise((e,n)=>{t.addEventListener(`load`,e),t.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${c}`)))})})}).filter(e=>e!==void 0))}function l(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return c.then(e=>{for(let t of e||[])t.status===`rejected`&&l(t.reason);return a().catch(l)})},o=`true`,s=`false`,c=o===`true`,l=s===`true`;function u(e={}){let{immediate:t=!1,onNeedReload:n,onNeedRefresh:r,onOfflineReady:i,onRegistered:o,onRegisteredSW:s,onRegisterError:u}=e,d,f,p,m=async(e=!0)=>{await f,c||p?.()};async function h(){if(`serviceWorker`in navigator){if(d=await a(async()=>{let{Workbox:e}=await import(`./workbox-window.prod.es5-Bd17z0YL.js`);return{Workbox:e}},[],import.meta.url).then(({Workbox:e})=>new e(`./sw.js`,{scope:`./`,type:`classic`})).catch(e=>{u?.(e)}),!d)return;if(p=()=>{d?.messageSkipWaiting()},!l){if(c)d.addEventListener(`activated`,e=>{(e.isUpdate||e.isExternal)&&(n?n():window.location.reload())}),d.addEventListener(`installed`,e=>{e.isUpdate||i?.()});else{let e=!1,t=()=>{e=!0,d?.addEventListener(`controlling`,e=>{e.isUpdate&&(n?n():window.location.reload())}),r?.()};d.addEventListener(`installed`,n=>{n.isUpdate===void 0?n.isExternal===void 0?!e&&i?.():n.isExternal?t():!e&&i?.():n.isUpdate||i?.()}),d.addEventListener(`waiting`,t)}}d.register({immediate:t}).then(e=>{s?s(`./sw.js`,e):o?.(e)}).catch(e=>{u?.(e)})}}return f=h(),m}var d=null;async function f(){return d||=await(await fetch(`./words.json`)).json(),d}function p(e){return Math.ceil(e.length/20)}function m(e,t){let n=(t-1)*20;return e.slice(n,n+20)}var h=`hoc3000.progress.v1`,g=`hoc3000.settings.v1`,_=2,v=b(h,{}),y={rate:.9,accent:`en-US`,...b(g,{})};function b(e,t){try{let n=localStorage.getItem(e);return n?JSON.parse(n):t}catch{return t}}function x(){localStorage.setItem(h,JSON.stringify(v))}function S(e){return v[e]}function C(e,t,n){let r=v[e]??{right:0,wrong:0,quizStreak:0,typeStreak:0,last:0},i=t===`quiz`?`quizStreak`:`typeStreak`;n?(r.right++,r[i]++):(r.wrong++,r[i]=0),r.last=Date.now(),v[e]=r,x()}function w(e){let t=v[e];return!!t&&t.quizStreak>=_&&t.typeStreak>=_}function T(e){let t=v[e];return!!t&&t.wrong>t.right}function E(){return y}function D(e){y={...y,...e},localStorage.setItem(g,JSON.stringify(y))}function O(){return JSON.stringify({version:1,exportedAt:new Date().toISOString(),progress:v,settings:y},null,1)}function k(e){let t=JSON.parse(e);if(!t||typeof t.progress!=`object`)throw Error(`File không đúng định dạng`);v=t.progress,x(),t.settings&&D(t.settings)}function A(){v={},x()}var j=typeof window<`u`?window.speechSynthesis:void 0,M=!!j;function N(e){let t=j?.getVoices()??[],n=t.filter(t=>t.lang.replace(`_`,`-`)===e);return n.find(e=>/enhanced|premium|google|natural/i.test(e.name))??n[0]??t.find(e=>e.lang.startsWith(`en`))}function P(e){if(!j)return;let{rate:t,accent:n}=E();j.cancel();let r=new SpeechSynthesisUtterance(e);r.lang=n,r.rate=t;let i=N(n);i&&(r.voice=i),j.speak(r)}j?.addEventListener?.(`voiceschanged`,()=>j.getVoices()),j&&typeof document<`u`&&document.addEventListener(`pointerdown`,()=>{let e=new SpeechSynthesisUtterance(` `);e.volume=0,j.speak(e)},{once:!0,capture:!0});function F(e){return e.replace(/\([^)]*\)/g,``).split(`,`).map(e=>L(e)).filter(Boolean)}function I(e){return e.replace(/\([^)]*\)/g,``).split(`,`)[0].trim()}function L(e){return e.toLowerCase().replace(/[’‘`´]/g,`'`).replace(/\s+/g,` `).trim()}function R(e,t){let n=Array.from({length:t.length+1},(e,t)=>t);for(let r=1;r<=e.length;r++){let i=n[0];n[0]=r;for(let a=1;a<=t.length;a++){let o=n[a];n[a]=Math.min(n[a]+1,n[a-1]+1,i+(e[r-1]===t[a-1]?0:1)),i=o}}return n[t.length]}function z(e,t){let n=L(e);if(!n)return`wrong`;let r=F(t);return r.includes(n)?`correct`:r.some(e=>e.length>=4&&R(n,e)===1)?`close`:`wrong`}function B(e,t=Math.random){let n=[...e];for(let e=n.length-1;e>0;e--){let r=Math.floor(t()*(e+1));[n[e],n[r]]=[n[r],n[e]]}return n}function V(e){return e.split(/[,\s]+/)[0]??``}function H(e,t,n,r=3,i=Math.random){let a=new Set([L(t[n])]),o=B(e.filter(e=>e.id!==t.id),i),s=V(t.type),c=o.filter(e=>s&&V(e.type)===s),l=o.filter(e=>!(s&&V(e.type)===s)),u=[];for(let e of[...c,...l]){let t=L(e[n]);if(!a.has(t)&&(a.add(t),u.push(e),u.length===r))break}return u}var U=document.getElementById(`app`);function W(e){return e.replace(/[&<>"']/g,e=>`&#${e.charCodeAt(0)};`)}function G(e,t,n=``){return`
    <header class="bar">
      ${t?`<a class="icon-btn" href="${t}" aria-label="Quay lại">‹</a>`:`<span></span>`}
      <h1>${W(e)}</h1>
      ${n||`<span></span>`}
    </header>`}function K(e,t=``){return M?`<button class="icon-btn speak ${t}" data-speak="${W(I(e.word))}" aria-label="Nghe">🔊</button>`:``}function q(e){return[e.type&&`<span class="tag">${W(e.type)}</span>`,e.ipa&&`<span class="ipa">/${W(e.ipa)}/</span>`].filter(Boolean).join(` `)}function J(e,t){let n=t?Math.round(e/t*100):0;return`<div class="progress" role="progressbar" aria-valuenow="${n}" aria-valuemin="0" aria-valuemax="100"><div style="width:${n}%"></div></div>`}function Y(e){let{title:t,correct:n,total:r,wrong:i,backHref:a}=e;return`
    ${G(t,a)}
    <main class="center">
      <div class="score">${n}/${r}</div>
      <p class="muted">${n===r?`Tuyệt vời, đúng hết!`:`Sai ${i.length} từ`}</p>
      ${i.length?`<ul class="word-list compact">${i.map(e=>`<li><div class="wl-main"><b>${W(e.word)}</b> ${q(e)}<div>${W(e.meaning)}</div></div>${K(e)}</li>`).join(``)}</ul>
             <button class="btn primary" data-action="retry-wrong">Làm lại các từ sai</button>`:``}
      <button class="btn" data-action="restart">Làm lại cả lượt</button>
      <a class="btn ghost" href="${a}">Quay lại</a>
    </main>`}function X(e){let t=e.filter(e=>w(e.id)).length,n=e.filter(e=>S(e.id)).length,r=e.filter(e=>T(e.id)).length,i=Array.from({length:p(e)},(t,n)=>{let r=n+1,i=m(e,r);return{n:r,ws:i,done:i.filter(e=>w(e.id)).length,started:i.some(e=>S(e.id))}});U.innerHTML=`
    ${G(`Học 3000 từ`,void 0,`<a class="icon-btn" href="#/settings" aria-label="Cài đặt">⚙︎</a>`)}
    <main>
      <section class="card stats">
        <div><b>${t}</b><span>đã thuộc</span></div>
        <div><b>${n}</b><span>đã học</span></div>
        <div><b>${e.length}</b><span>tổng số từ</span></div>
      </section>
      ${J(t,e.length)}
      ${r?`<div class="row">
               <a class="btn primary" href="#/quiz/review?dir=mix">Ôn ${Math.min(r,20)} từ sai: trắc nghiệm</a>
               <a class="btn" href="#/type/review?mode=listen">Ôn từ sai: gõ từ</a>
             </div>
             <p class="muted small">Có ${r} từ đang sai nhiều hơn đúng.</p>`:``}
      <input class="search" type="search" placeholder="Tìm từ tiếng Anh hoặc nghĩa…" autocomplete="off" />
      <div class="search-results"></div>
      <ol class="lessons">
        ${i.map(({n:e,ws:t,done:n,started:r})=>`
          <li><a class="lesson ${n===t.length?`done`:r?`started`:``}" href="#/lesson/${e}">
            <span class="ln">Bài ${e}</span>
            <span class="lr">${W(t[0].word)} – ${W(t[t.length-1].word)}</span>
            ${J(n,t.length)}
          </a></li>`).join(``)}
      </ol>
    </main>`;let a=U.querySelector(`.search`),o=U.querySelector(`.search-results`);a.addEventListener(`input`,()=>{let t=L(a.value);if(t.length<2){o.innerHTML=``;return}let n=e.map((e,t)=>({w:e,lesson:Math.floor(t/20)+1})).filter(({w:e})=>L(e.word).startsWith(t)||L(e.meaning).includes(t)).slice(0,12);o.innerHTML=n.length?`<ul class="word-list compact">${n.map(({w:e,lesson:t})=>`<li><a href="#/lesson/${t}" class="wl-main">
              <b>${W(e.word)}</b> <span class="muted">· Bài ${t}</span>
              <div>${W(e.meaning)}</div></a></li>`).join(``)}</ul>`:`<p class="muted">Không tìm thấy.</p>`})}function Z(e,t){let n=p(e),r=m(e,t);r.length?U.innerHTML=`
    ${G(`Bài ${t}`,`#/`)}
    <main>
      <div class="grid2">
        <a class="btn primary" href="#/quiz/${t}?dir=en">Trắc nghiệm Anh → Việt</a>
        <a class="btn primary" href="#/quiz/${t}?dir=vi">Trắc nghiệm Việt → Anh</a>
        <a class="btn" href="#/type/${t}?mode=listen">Nghe rồi gõ từ</a>
        <a class="btn" href="#/type/${t}?mode=meaning">Xem nghĩa rồi gõ từ</a>
      </div>
      <ul class="word-list">
        ${r.map(e=>`
          <li class="${w(e.id)?`mastered`:``}">
            <div class="wl-main">
              <b>${W(e.word)}</b> ${q(e)}
              <div>${W(e.meaning)}</div>
            </div>
            ${K(e)}
          </li>`).join(``)}
      </ul>
      <nav class="row">
        ${t>1?`<a class="btn ghost" href="#/lesson/${t-1}">‹ Bài ${t-1}</a>`:`<span></span>`}
        ${t<n?`<a class="btn ghost" href="#/lesson/${t+1}">Bài ${t+1} ›</a>`:`<span></span>`}
      </nav>
    </main>`:location.hash=`#/`}function Q(e){let{all:t,dir:n,title:r,backHref:i}=e,a=e=>B(e).map(e=>{let r=n===`mix`?Math.random()<.5?`en`:`vi`:n;return{word:e,dir:r,options:B([e,...H(t,e,r===`en`?`meaning`:`word`)])}}),o=a(e.items),s=0,c=!1,l=[];function u(){if(s>=o.length)return p();c=!1;let e=o[s],t=e.dir===`en`?`<div class="prompt-word">${W(e.word.word)} ${K(e.word)}</div><div>${q(e.word)}</div>`:`<div class="prompt-meaning">${W(e.word.meaning)}</div>${e.word.type?`<div><span class="tag">${W(e.word.type)}</span></div>`:``}`;U.innerHTML=`
      ${G(r,i,`<span class="counter">${s+1}/${o.length}</span>`)}
      ${J(s,o.length)}
      <main>
        <section class="card prompt">${t}</section>
        <div class="options">
          ${e.options.map((t,n)=>`<button class="option" data-option="${n}"><span class="key">${n+1}</span>${W(e.dir===`en`?t.meaning:t.word)}</button>`).join(``)}
        </div>
        <div class="feedback"></div>
      </main>`,e.dir===`en`&&P(I(e.word.word))}function d(e){if(c)return;c=!0;let t=o[s],n=t.options[e].id===t.word.id;C(t.word.id,`quiz`,n),n||l.push(t.word),U.querySelectorAll(`.option`).forEach((n,r)=>{n.disabled=!0,t.options[r].id===t.word.id?n.classList.add(`right`):r===e&&n.classList.add(`wrong`)}),U.querySelector(`.feedback`).innerHTML=`
      <div class="card ${n?`ok`:`bad`}">
        <b>${n?`Đúng rồi!`:`Chưa đúng`}</b>
        <div><b>${W(t.word.word)}</b> ${q(t.word)} ${K(t.word)}</div>
        <div>${W(t.word.meaning)}</div>
      </div>
      <button class="btn primary" data-action="next">Tiếp (Enter)</button>`,t.dir!==`vi`&&n||P(I(t.word.word))}function f(){s++,u()}function p(){U.innerHTML=Y({title:r,correct:o.length-l.length,total:o.length,wrong:l,backHref:i})}function m(e){o=a(e),s=0,l=[],u()}U.onclick=e=>{let t=e.target.closest(`[data-option],[data-action]`);t&&(t.dataset.option?d(Number(t.dataset.option)):t.dataset.action===`next`?f():t.dataset.action===`retry-wrong`?m(l):t.dataset.action===`restart`&&m(o.map(e=>e.word)))},document.onkeydown=e=>{s>=o.length||(!c&&/^[1-4]$/.test(e.key)?d(Number(e.key)-1):c&&e.key===`Enter`&&f())},u()}function ee(){let e=E();U.innerHTML=`
    ${G(`Cài đặt`,`#/`)}
    <main>
      <section class="card form">
        <h2>Giọng đọc</h2>
        ${M?``:`<p class="bad-text">Trình duyệt này không hỗ trợ đọc. Hãy dùng Chrome hoặc Safari.</p>`}
        <label>Giọng
          <select name="accent">
            <option value="en-US" ${e.accent===`en-US`?`selected`:``}>Anh - Mỹ</option>
            <option value="en-GB" ${e.accent===`en-GB`?`selected`:``}>Anh - Anh</option>
          </select>
        </label>
        <label>Tốc độ: <output>${e.rate.toFixed(1)}</output>
          <input type="range" name="rate" min="0.5" max="1.3" step="0.1" value="${e.rate}" />
        </label>
        <button class="btn" data-action="test">Nghe thử</button>
      </section>
      <section class="card form">
        <h2>Tiến độ</h2>
        <p class="muted small">Tiến độ chỉ lưu trên trình duyệt này. Nên sao lưu thỉnh thoảng, nhất là trước khi xóa dữ liệu trình duyệt.</p>
        <button class="btn" data-action="export">Sao lưu ra file</button>
        <label class="btn">Khôi phục từ file<input type="file" accept="application/json,.json" hidden /></label>
        <button class="btn danger" data-action="reset">Xóa toàn bộ tiến độ</button>
      </section>
    </main>`;let t=U.querySelector(`select[name=accent]`),n=U.querySelector(`input[name=rate]`);t.onchange=()=>D({accent:t.value}),n.oninput=()=>{D({rate:Number(n.value)}),U.querySelector(`output`).textContent=Number(n.value).toFixed(1)},U.querySelector(`input[type=file]`).onchange=async e=>{let t=e.target.files?.[0];if(t)try{k(await t.text()),alert(`Đã khôi phục tiến độ.`),location.hash=`#/`}catch(e){alert(`Không khôi phục được: ${e.message}`)}},U.onclick=e=>{let t=e.target.closest(`[data-action]`)?.dataset.action;if(t===`test`)P(`Practice makes perfect.`);else if(t===`export`){let e=new Blob([O()],{type:`application/json`}),t=document.createElement(`a`);t.href=URL.createObjectURL(e),t.download=`hoc3000-${new Date().toISOString().slice(0,10)}.json`,t.click(),setTimeout(()=>URL.revokeObjectURL(t.href),1e3)}else t===`reset`&&confirm(`Xóa toàn bộ tiến độ học? Không hoàn tác được.`)&&(A(),location.hash=`#/`)}}function te(e){let{title:t,backHref:n}=e,r=M?e.mode:`meaning`,i=B(e.items),a=0,o=[],s=`asking`;function c(e){let t=I(e.word);return t.replace(/[A-Za-z]/g,`_`).replace(/_/,t[0]).split(``).join(` `)}function l(){P(I(i[a].word))}function u(){if(a>=i.length)return p();s=`asking`;let e=i[a],o=r===`listen`?`<button class="big-speak" data-action="say" aria-label="Nghe lại">🔊</button>
           <div class="muted small">Bấm loa hoặc phím Ctrl để nghe lại</div>
           ${e.type?`<div><span class="tag">${W(e.type)}</span></div>`:``}`:`<div class="prompt-meaning">${W(e.meaning)}</div>
           ${e.type?`<div><span class="tag">${W(e.type)}</span></div>`:``}`;U.innerHTML=`
      ${G(t,n,`<span class="counter">${a+1}/${i.length}</span>`)}
      ${J(a,i.length)}
      <main>
        <section class="card prompt">
          ${o}
          <div class="hint">${W(c(e))}</div>
        </section>
        <form class="type-form" autocomplete="off">
          <input class="type-input" name="answer" autocapitalize="off" autocorrect="off" spellcheck="false"
                 placeholder="Gõ từ tiếng Anh…" enterkeyhint="done" />
          <div class="row">
            <button type="button" class="btn ghost" data-action="skip">Không biết</button>
            <button type="submit" class="btn primary">Kiểm tra</button>
          </div>
        </form>
        <div class="feedback"></div>
      </main>`,U.querySelector(`.type-input`).focus(),r===`listen`&&l()}function d(e,t){let n=i[a];s=`done`,C(n.id,`type`,e),e||o.push(n);let r=U.querySelector(`.type-input`);r.readOnly=!0,r.classList.add(e?`right`:`wrong`),U.querySelector(`.type-form .row`).innerHTML=`<button type="submit" class="btn primary">Tiếp (Enter)</button>`,U.querySelector(`.feedback`).innerHTML=`
      <div class="card ${e?`ok`:`bad`}">
        <b>${e?`Đúng rồi!`:t?`Bạn gõ: <s>${W(t)}</s>`:`Đáp án`}</b>
        <div class="prompt-word">${W(n.word)} ${K(n)}</div>
        <div>${q(n)}</div>
        <div>${W(n.meaning)}</div>
      </div>`,P(I(n.word)),r.focus()}function f(){let e=U.querySelector(`.type-input`);if(s===`done`)return a++,u();let t=e.value.trim();if(!t)return;let n=z(t,i[a].word);n===`close`&&s===`asking`?(s=`retry`,U.querySelector(`.feedback`).innerHTML=`<div class="card warn"><b>Gần đúng!</b> Sai 1 ký tự, thử lại nhé.</div>`,e.select()):d(n===`correct`,t)}function p(){U.innerHTML=Y({title:t,correct:i.length-o.length,total:i.length,wrong:o,backHref:n})}function m(e){i=B(e),a=0,o=[],u()}U.onsubmit=e=>{e.preventDefault(),f()},U.onclick=t=>{let n=t.target.closest(`[data-action]`);if(!n)return;let r=n.dataset.action;r===`say`?l():r===`skip`&&s!==`done`?d(!1,``):r===`retry-wrong`?m(o):r===`restart`&&m(e.items)},document.onkeydown=e=>{r===`listen`&&e.key===`Control`&&a<i.length&&l()},u()}u({immediate:!0}),document.addEventListener(`click`,e=>{let t=e.target.closest(`[data-speak]`);t&&(e.preventDefault(),P(t.dataset.speak))});function ne(e){let t=e=>{let t=S(e.id);return t.wrong-t.right};return e.filter(e=>T(e.id)).sort((e,n)=>t(n)-t(e)).slice(0,20)}async function $(){let e=await f();U.onclick=null,U.onsubmit=null,document.onkeydown=null,window.scrollTo(0,0);let[t,n=``]=location.hash.replace(/^#\/?/,``).split(`?`),r=new URLSearchParams(n),[i,a]=t.split(`/`);if(i===`lesson`)return Z(e,Number(a));if(i===`settings`)return ee();if(i===`quiz`||i===`type`){let t=a===`review`,n=t?ne(e):m(e,Number(a)),o=t?`#/`:`#/lesson/${a}`;if(!n.length){location.hash=o;return}let s=t?`Ôn từ sai`:`Bài ${a}`;return i===`quiz`?Q({all:e,items:n,dir:r.get(`dir`)??`en`,title:s,backHref:o}):te({items:n,mode:r.get(`mode`)??`listen`,title:s,backHref:o})}X(e)}window.addEventListener(`hashchange`,$),$().catch(e=>{U.innerHTML=`<main><p class="bad-text">Không tải được dữ liệu: ${String(e)}</p></main>`});