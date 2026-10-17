// ─── App insights: 좋은 포인트 · 임팩트 · 측정 근거 ────────────────────────────
// Shared by ada-archive.html and field-guide.html.
// Data lives in insights-data.js (window.INSIGHTS_DATA); this file renders a
// "Deep dive" button per card and a modal sheet with the full analysis.
(function(){
  const DATA = window.INSIGHTS_DATA || {apps:{}, alias:{}, fetched:""};
  const WOW = (window.WOW_DATA && window.WOW_DATA.apps) || {};
  const TRY = (window.TRY_DATA && window.TRY_DATA.apps) || {};
  const TRY_KEY = "ada-try-v1";

  const L = {
    en:{btn:"Deep dive", points:"What makes it good", impact:"Impact", evidence:"Evidence & metrics",
        store:"App Store (measured)", ratings:n=>`${n} ratings`, released:"Released", updated:"Last update",
        noMetrics:"No public quantitative metrics found — evidence below is qualitative.",
        fetched:d=>`App Store figures fetched ${d} via the iTunes Lookup API. Other figures link to their source; check the date on each.`,
        removed:"Not currently on the App Store", close:"Close", source:"Source",
        wow:"Wow point", legacy:"The mark it left",
        tryIt:"Try it yourself", tryMin:m=>`About ${m} min`, trySetup:"Before you start", tryDo:"Things to experience", tryMake:"Then try it in your own app", tryAsk:"Answer in one sentence", tryBtn:n=>`Try it · ${n}`, tryDone:(a,b)=>`${a}/${b} done`,
        story:"Tell it as a story", storyMsg:"Message", storyScript:"Script (about 1 min)", copy:"Copy script", copied:"Copied",
        tags:{tech:"Tech feat",design:"Design call",scale:"Scale",indie:"Tiny team",first:"First ever",copied:"Widely copied",realworld:"Real-world impact",business:"Business model",accessibility:"Accessibility"}},
    ko:{btn:"상세 분석", points:"왜 좋은 앱인가", impact:"임팩트", evidence:"측정 근거",
        store:"App Store 실측", ratings:n=>`평점 ${n}개`, released:"출시", updated:"최근 업데이트",
        noMetrics:"공개된 정량 지표를 찾지 못했습니다 — 아래 근거는 정성적 자료입니다.",
        fetched:d=>`App Store 수치는 ${d}에 iTunes Lookup API로 수집했습니다. 그 외 수치는 출처 링크와 기준 시점을 함께 확인하세요.`,
        removed:"현재 App Store에서 찾을 수 없음", close:"닫기", source:"출처",
        wow:"와우 포인트", legacy:"남긴 임팩트",
        tryIt:"직접 해보기", tryMin:m=>`약 ${m}분`, trySetup:"시작 전에", tryDo:"경험해 볼 것", tryMake:"그다음 내 앱에서 따라 해볼 것", tryAsk:"한 문장으로 답해 보기", tryBtn:n=>`해볼 것 ${n}개`, tryDone:(a,b)=>`${a}/${b} 완료`,
        story:"이야기로 전하기", storyMsg:"메시지", storyScript:"대본 (약 1분)", copy:"대본 복사", copied:"복사됨",
        tags:{tech:"기술력",design:"설계 결단",scale:"규모",indie:"작은 팀",first:"최초",copied:"업계가 따라함",realworld:"현실을 바꿈",business:"비즈니스 모델",accessibility:"접근성"}}
  };

  function esc(s){return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}
  function resolve(name){return DATA.apps[name] ? name : (DATA.alias[name] && DATA.apps[DATA.alias[name]] ? DATA.alias[name] : null);}
  function pickLang(obj, lang){if(!obj)return null;return obj[lang] || obj.ko || obj.en || null;}
  function fmt(n, lang){return Number(n).toLocaleString(lang==="ko"?"ko-KR":"en-US");}

  function storeRow(s, lang){
    const t=L[lang];
    if(!s || (!s.us && !s.kr)) return `<p class="ins-note">${t.removed}</p>`;
    const cell=(label, x)=> x ? `<div class="ins-stat"><div class="ins-stat-k">${label}</div>
      <div class="ins-stat-v">★ ${x.r!=null?x.r.toFixed(2):"–"}</div><div class="ins-stat-s">${t.ratings(fmt(x.c||0,lang))}</div></div>` : "";
    const meta=[s.released?`${t.released} ${s.released}`:"", s.updated?`${t.updated} ${s.updated}`:""].filter(Boolean).join(" · ");
    return `<div class="ins-stats">${cell("US",s.us)}${cell("KR",s.kr)}</div>${meta?`<p class="ins-meta">${meta}</p>`:""}`;
  }

  // "Wow point": the one jaw-dropping fact + the mark it left (wow-data.js).
  function wowFor(name){const k=resolve(name)||name;return WOW[k]||WOW[name]||null;}
  function wow(name, lang){
    const w=wowFor(name), txt=w&&pickLang(w.wow,lang); if(!txt) return "";
    return `<div class="wow"><span class="wow-label">${L[lang].wow}</span>${esc(txt)}</div>`;
  }
  function wowSection(key, lang){
    const w=wowFor(key); if(!w) return "";
    const t=L[lang], wt=pickLang(w.wow,lang), lg=pickLang(w.legacy,lang);
    const tags=(w.tags||[]).filter(x=>t.tags[x]).map(x=>`<span class="wow-tag">${t.tags[x]}</span>`).join("");
    const src=(w.src||[]).map(s=>`<a href="${esc(s.u)}" target="_blank" rel="noopener">${esc(s.t)}</a>`).join("");
    return `<section class="wow-sec">${tags?`<div class="wow-tags">${tags}</div>`:""}
      <h4>${t.wow}</h4><p class="wow-big">${esc(wt)}</p>
      ${lg?`<h4>${t.legacy}</h4><p class="wow-legacy">${esc(lg)}</p>`:""}
      ${src?`<div class="ins-src wow-src">${t.source} · ${src}</div>`:""}</section>${storySection(w,lang)}`;
  }
  function storySection(w, lang){
    const st=w.story; if(!st) return "";
    const t=L[lang], title=pickLang(st.title,lang), msg=pickLang(st.message,lang), sc=pickLang(st.script,lang)||"";
    if(!title||!sc) return "";
    const paras=sc.split(/\n\s*\n/).map(p=>`<p>${esc(p.trim())}</p>`).join("");
    const plain=`${title}\n\n${msg?msg+"\n\n":""}${sc}`;
    return `<section class="story-sec"><h4>${t.story}</h4>
      <p class="story-title">${esc(title)}</p>
      ${msg?`<div class="story-msg"><span>${t.storyMsg}</span>${esc(msg)}</div>`:""}
      <div class="story-head"><span>${t.storyScript}</span>
        <button type="button" class="story-copy" data-copy="${esc(plain)}" data-done="${t.copied}">${t.copy}</button></div>
      <div class="story-script">${paras}</div></section>`;
  }

  // "Try it yourself": hands-on missions + maker exercises (try-data.js).
  // Checked missions are a per-viewer convenience kept in localStorage.
  function tryFor(name){const k=resolve(name)||name;return TRY[k]||TRY[name]||null;}
  function tryLoad(){try{return JSON.parse(localStorage.getItem(TRY_KEY))||{};}catch(_){return {};}}
  function trySave(v){try{localStorage.setItem(TRY_KEY,JSON.stringify(v));}catch(_){}}
  function tryCount(key){const g=tryFor(key);return g?(g.missions||[]).length+(g.make||[]).length:0;}
  function tryProgress(key){const k=resolve(key)||key;return (tryLoad()[k]||[]).length;}
  function trySection(key, lang){
    const g=tryFor(key); if(!g) return "";
    const t=L[lang], k=resolve(key)||key, done=new Set(tryLoad()[k]||[]);
    const item=(x,id)=>`<li><label><input type="checkbox" class="try-ck" data-try="${esc(k)}" data-id="${id}"${done.has(id)?" checked":""}><span>${esc(pickLang(x,lang)||"")}</span></label></li>`;
    const mi=(g.missions||[]).map((x,i)=>item(x,"m"+i)).join(""), mk=(g.make||[]).map((x,i)=>item(x,"k"+i)).join("");
    const setup=pickLang(g.setup,lang), ask=pickLang(g.ask,lang), total=tryCount(key);
    return `<section class="try-sec" id="try-sec"><div class="try-top"><h4>${t.tryIt}</h4>
        <span class="try-meta">${g.time?t.tryMin(g.time)+" · ":""}<span class="try-prog" data-total="${total}">${t.tryDone(done.size,total)}</span></span></div>
      ${setup?`<p class="try-setup"><b>${t.trySetup}</b>${esc(setup)}</p>`:""}
      ${mi?`<div class="try-sub">${t.tryDo}</div><ol class="try-list">${mi}</ol>`:""}
      ${mk?`<div class="try-sub">${t.tryMake}</div><ol class="try-list">${mk}</ol>`:""}
      ${ask?`<div class="try-ask"><span>${t.tryAsk}</span>${esc(ask)}</div>`:""}</section>`;
  }

  function bodyHTML(key, lang){
    const a=DATA.apps[key], t=L[lang];
    const list=(arr)=>arr&&arr.length?`<ul class="ins-list">${arr.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:"";
    const ev=(a.evidence||[]).map(e=>{
      const txt=pickLang(e,lang)||"";
      let host="";try{host=new URL(e.url).hostname.replace(/^www\./,"");}catch(_){}
      return `<li><span>${esc(txt)}</span>
        <span class="ins-src">${e.date?`<span class="ins-date">${esc(e.date)}</span>`:""}${e.url?`<a href="${esc(e.url)}" target="_blank" rel="noopener">${esc(e.source||host)}</a>`:esc(e.source||"")}</span></li>`;
    }).join("");
    return `${wowSection(key,lang)}${trySection(key,lang)}
      <section><h4>${t.points}</h4>${list(pickLang(a.points,lang))}</section>
      <section><h4>${t.impact}</h4>${list(pickLang(a.impact,lang))}</section>
      <section><h4>${t.evidence}</h4>
        <div class="ins-sub">${t.store}</div>${storeRow(a.store,lang)}
        ${a.noPublicMetrics?`<p class="ins-note">${t.noMetrics}</p>`:""}
        ${ev?`<ul class="ins-list ins-ev">${ev}</ul>`:""}
        <p class="ins-foot">${t.fetched(esc(DATA.fetched))}</p>
      </section>`;
  }

  // Card button. Returns "" when there's no analysis for this app.
  function button(name, lang){
    const key=resolve(name); if(!key) return "";
    return `<button type="button" class="ins-btn" data-insight="${esc(key)}" data-lang="${lang}">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 19V5M4 19h16M8 15l4-4 3 3 5-6"/></svg>${L[lang].btn}</button>`;
  }

  // Opens the sheet straight at the "Try it yourself" section.
  function tryButton(name, lang){
    const key=resolve(name), n=key?tryCount(key):0; if(!n) return "";
    const d=tryProgress(key);
    return `<button type="button" class="ins-btn try-btn" data-insight="${esc(key)}" data-lang="${lang}" data-at="try-sec">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 11l3 3 8-8M20 12v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h11"/></svg>${L[lang].tryBtn(n)}${d?` · ${L[lang].tryDone(d,n)}`:""}</button>`;
  }

  let dlg;
  function ensureDialog(){
    if(dlg) return dlg;
    dlg=document.createElement("dialog");
    dlg.className="ins-dialog";
    dlg.innerHTML=`<div class="ins-sheet"><div class="ins-head"><div><div class="ins-eyebrow"></div><h3 class="ins-title"></h3></div>
      <button type="button" class="ins-close" aria-label="Close">✕</button></div><div class="ins-body"></div></div>`;
    document.body.appendChild(dlg);
    dlg.querySelector(".ins-close").addEventListener("click",()=>dlg.close());
    dlg.addEventListener("click",e=>{if(e.target===dlg)dlg.close();});
    dlg.addEventListener("close",()=>document.documentElement.classList.remove("ins-lock"));
    return dlg;
  }
  function open(key, lang, at){
    const d=ensureDialog(), t=L[lang];
    d.dataset.lang=lang;
    d.querySelector(".ins-eyebrow").textContent=t.btn;
    d.querySelector(".ins-title").textContent=key;
    d.querySelector(".ins-close").setAttribute("aria-label",t.close);
    d.querySelector(".ins-body").innerHTML=bodyHTML(key,lang);
    d.querySelector(".ins-body").scrollTop=0;
    document.documentElement.classList.add("ins-lock");
    if(!d.open) d.showModal();
    const tgt=at&&d.querySelector("#"+at), bd=d.querySelector(".ins-body");
    if(tgt) bd.scrollTop+=tgt.getBoundingClientRect().top-bd.getBoundingClientRect().top-8;
  }
  // Generic sheet for other pages (e.g. my-apps evaluation), same look as the deep dive.
  function openCustom(title, eyebrow, html){
    const d=ensureDialog();
    d.querySelector(".ins-eyebrow").textContent=eyebrow||"";
    d.querySelector(".ins-title").textContent=title;
    d.querySelector(".ins-close").setAttribute("aria-label","닫기");
    d.querySelector(".ins-body").innerHTML=html;
    d.querySelector(".ins-body").scrollTop=0;
    document.documentElement.classList.add("ins-lock");
    if(!d.open) d.showModal();
  }
  document.addEventListener("click",e=>{
    const c=e.target.closest(".story-copy"); if(!c) return;
    const label=c.textContent;
    const done=()=>{c.textContent=c.dataset.done;setTimeout(()=>c.textContent=label,1500);};
    if(navigator.clipboard) navigator.clipboard.writeText(c.dataset.copy).then(done,()=>{});
  });
  document.addEventListener("click",e=>{
    const b=e.target.closest("[data-insight]"); if(!b) return;
    e.preventDefault(); open(b.dataset.insight, b.dataset.lang==="en"?"en":"ko", b.dataset.at);
  });
  document.addEventListener("change",e=>{
    const c=e.target.closest(".try-ck"); if(!c) return;
    const v=tryLoad(), k=c.dataset.try, set=new Set(v[k]||[]);
    c.checked?set.add(c.dataset.id):set.delete(c.dataset.id);
    if(set.size) v[k]=[...set]; else delete v[k];
    trySave(v);
    const sec=c.closest(".try-sec"), p=sec&&sec.querySelector(".try-prog");
    if(p){const lang=dlg&&dlg.dataset.lang||"ko";p.textContent=L[lang].tryDone(set.size,+p.dataset.total);}
    document.querySelectorAll(".try-btn").forEach(b=>{
      if(b.dataset.insight!==k||b.closest(".ins-dialog")) return;
      const w=document.createElement("div");w.innerHTML=tryButton(k,b.dataset.lang==="en"?"en":"ko");
      if(w.firstElementChild) b.replaceWith(w.firstElementChild);
    });
  });

  const css=`
  .ins-btn{font-family:inherit;font-size:12px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:5px;
    color:var(--ac,var(--accent));background:color-mix(in srgb,var(--ac,var(--accent)) 7%,#fff);
    border:1px solid color-mix(in srgb,var(--ac,var(--accent)) 25%,#fff);border-radius:8px;padding:6px 11px;transition:all .14s}
  .ins-btn:hover{background:var(--ac,var(--accent));color:#fff;border-color:var(--ac,var(--accent))}
  html.ins-lock{overflow:hidden}
  .ins-dialog{border:0;padding:0;margin:auto;background:transparent;max-width:720px;width:calc(100% - 32px);max-height:calc(100dvh - 48px);color:var(--text)}
  .ins-dialog::backdrop{background:rgba(15,23,42,.45);backdrop-filter:blur(3px)}
  .ins-sheet{background:#fff;border-radius:18px;box-shadow:0 24px 64px rgba(15,23,42,.25);display:flex;flex-direction:column;max-height:calc(100dvh - 48px);overflow:hidden}
  .ins-head{max-width:none;margin:0;position:static;text-align:left;display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:20px 22px 14px;border-bottom:1px solid var(--line)}
  .ins-eyebrow{font-size:10px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:var(--muted)}
  .ins-title{margin-bottom:0;font-size:22px;font-weight:750;letter-spacing:-.02em;line-height:1.2;margin-top:3px}
  .ins-close{font:inherit;font-size:14px;cursor:pointer;width:32px;height:32px;flex-shrink:0;border-radius:50%;border:1px solid var(--line);background:#fff;color:var(--muted)}
  .ins-close:hover{color:var(--text);border-color:var(--muted-dim)}
  .ins-body{overflow-y:auto;padding:6px 22px 22px;-webkit-overflow-scrolling:touch}
  .ins-body section{padding-top:16px}
  .ins-body h4{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);margin-bottom:8px}
  .ins-list{list-style:none;display:flex;flex-direction:column;gap:7px}
  .ins-list li{position:relative;padding-left:16px;font-size:14px;line-height:1.65;color:#334155;overflow-wrap:anywhere}
  .ins-list li::before{content:"";position:absolute;left:3px;top:.62em;width:5px;height:5px;border-radius:50%;background:var(--muted-dim)}
  .ins-ev li{display:flex;flex-direction:column;gap:2px}
  .ins-src{font-size:12px;color:var(--muted);display:flex;gap:8px;flex-wrap:wrap}
  .ins-src a{color:var(--accent-dim,var(--accent));text-decoration:underline;text-underline-offset:2px}
  .ins-date{font-variant-numeric:tabular-nums}
  .ins-sub{font-size:12px;font-weight:600;color:var(--muted);margin:2px 0 8px}
  .ins-stats{display:flex;gap:8px;flex-wrap:wrap}
  .ins-stat{flex:1 1 140px;border:1px solid var(--line);border-radius:12px;padding:10px 12px;background:var(--surface-hi,#f8fafc)}
  .ins-stat-k{font-size:10px;font-weight:700;letter-spacing:.08em;color:var(--muted)}
  .ins-stat-v{font-size:18px;font-weight:700;font-variant-numeric:tabular-nums}
  .ins-stat-s{font-size:12px;color:var(--muted);font-variant-numeric:tabular-nums}
  .ins-meta{font-size:12px;color:var(--muted);margin:8px 0 12px}
  .ins-note{font-size:12.5px;color:#92400e;background:#fef3c7;border:1px solid #fde68a;border-radius:9px;padding:8px 10px;margin:8px 0 12px}
  .ins-foot{font-size:11px;color:var(--muted-dim);margin-top:16px;line-height:1.6}
  .wow{font-size:13px;line-height:1.6;color:var(--text);font-weight:500;margin:10px 0 4px;padding:11px 13px;
    background:linear-gradient(135deg,#fff7ed,#fdf2f8);border:1px solid #fed7aa;border-radius:11px}
  .wow-label{display:block;font-size:9.5px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:#c2410c;margin-bottom:5px}
  .wow-sec{margin-top:14px;padding:14px 16px 16px!important;border-radius:14px;background:linear-gradient(135deg,#fff7ed,#fdf2f8);border:1px solid #fed7aa}
  .wow-sec h4{color:#c2410c}
  .wow-sec h4+p{margin-bottom:12px}
  .wow-big{font-size:16px;line-height:1.6;font-weight:650;color:var(--text)}
  .wow-legacy{font-size:14px;line-height:1.65;color:#334155}
  .wow-tags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}
  .wow-tag{font-size:11px;font-weight:700;color:#9a3412;background:#fff;border:1px solid #fed7aa;border-radius:999px;padding:3px 9px}
  .wow-src{margin-top:4px}
  .story-sec{margin-top:14px;padding:14px 16px 16px!important;border-radius:14px;border:1px solid var(--line);background:var(--surface-hi,#f8fafc)}
  .story-title{font-size:18px;line-height:1.4;font-weight:750;letter-spacing:-.01em;color:var(--text);margin-bottom:10px}
  .story-msg{font-size:14px;line-height:1.6;color:var(--text);font-weight:600;padding:9px 12px;border-left:3px solid var(--accent);background:#fff;border-radius:0 9px 9px 0;margin-bottom:12px}
  .story-msg span,.story-head span{display:block;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-bottom:3px}
  .story-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px}
  .story-head span{margin:0}
  .story-copy{font:inherit;font-size:12px;font-weight:600;cursor:pointer;color:var(--text);background:#fff;border:1px solid var(--line);border-radius:8px;padding:5px 10px}
  .story-copy:hover{border-color:var(--muted-dim)}
  .story-script p{font-size:14.5px;line-height:1.75;color:#334155;margin-bottom:10px}
  .story-script p:last-child{margin-bottom:0}
  .try-sec{margin-top:14px;padding:14px 16px 16px!important;border-radius:14px;border:1px solid #bbf7d0;background:#f0fdf4}
  .try-top{display:flex;align-items:baseline;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:6px}
  .try-top h4{color:#15803d!important;margin:0!important}
  .try-meta{font-size:12px;font-weight:600;color:#166534}
  .try-setup{font-size:14px;line-height:1.6;color:var(--text);background:#fff;border:1px solid #dcfce7;border-radius:9px;padding:8px 11px;margin:6px 0 10px}
  .try-setup b{display:block;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#15803d;margin-bottom:2px}
  .try-sub{font-size:12px;font-weight:700;color:#166534;margin:12px 0 6px}
  .try-list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:6px}
  .try-list label{display:flex;gap:9px;align-items:flex-start;cursor:pointer;font-size:14.5px;line-height:1.6;color:#334155;background:#fff;border:1px solid #dcfce7;border-radius:9px;padding:8px 11px}
  .try-list input{margin-top:4px;width:16px;height:16px;flex-shrink:0;accent-color:#16a34a}
  .try-list input:checked+span{color:var(--muted);text-decoration:line-through;text-decoration-color:#86efac}
  .try-ask{margin-top:12px;font-size:14px;line-height:1.6;font-weight:600;color:var(--text);padding:9px 12px;border-left:3px solid #16a34a;background:#fff;border-radius:0 9px 9px 0}
  .try-ask span{display:block;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-bottom:3px}
  .try-btn{--ac:#16a34a}
  @media (max-width:600px){
    .ins-dialog{width:100%;max-width:none;margin:auto 0 0;max-height:92dvh}
    .ins-sheet{border-radius:18px 18px 0 0;max-height:92dvh}
    .ins-head{padding:16px 16px 12px}.ins-body{padding:4px 16px 28px}
    .ins-title{font-size:19px}
  }`;
  const st=document.createElement("style"); st.textContent=css; document.head.appendChild(st);

  window.Insights={button, tryButton, open, openCustom, wow, has:n=>!!resolve(n)};
})();
