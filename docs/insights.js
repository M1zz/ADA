// ─── App insights: 좋은 포인트 · 임팩트 · 측정 근거 ────────────────────────────
// Shared by ada-archive.html and field-guide.html.
// Data lives in insights-data.js (window.INSIGHTS_DATA); this file renders a
// "Deep dive" button per card and a modal sheet with the full analysis.
(function(){
  const DATA = window.INSIGHTS_DATA || {apps:{}, alias:{}, fetched:""};

  const L = {
    en:{btn:"Deep dive", points:"What makes it good", impact:"Impact", evidence:"Evidence & metrics",
        store:"App Store (measured)", ratings:n=>`${n} ratings`, released:"Released", updated:"Last update",
        noMetrics:"No public quantitative metrics found — evidence below is qualitative.",
        fetched:d=>`App Store figures fetched ${d} via the iTunes Lookup API. Other figures link to their source; check the date on each.`,
        removed:"Not currently on the App Store", close:"Close", source:"Source"},
    ko:{btn:"상세 분석", points:"왜 좋은 앱인가", impact:"임팩트", evidence:"측정 근거",
        store:"App Store 실측", ratings:n=>`평점 ${n}개`, released:"출시", updated:"최근 업데이트",
        noMetrics:"공개된 정량 지표를 찾지 못했습니다 — 아래 근거는 정성적 자료입니다.",
        fetched:d=>`App Store 수치는 ${d}에 iTunes Lookup API로 수집했습니다. 그 외 수치는 출처 링크와 기준 시점을 함께 확인하세요.`,
        removed:"현재 App Store에서 찾을 수 없음", close:"닫기", source:"출처"}
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

  function bodyHTML(key, lang){
    const a=DATA.apps[key], t=L[lang];
    const list=(arr)=>arr&&arr.length?`<ul class="ins-list">${arr.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:"";
    const ev=(a.evidence||[]).map(e=>{
      const txt=pickLang(e,lang)||"";
      let host="";try{host=new URL(e.url).hostname.replace(/^www\./,"");}catch(_){}
      return `<li><span>${esc(txt)}</span>
        <span class="ins-src">${e.date?`<span class="ins-date">${esc(e.date)}</span>`:""}${e.url?`<a href="${esc(e.url)}" target="_blank" rel="noopener">${esc(e.source||host)}</a>`:esc(e.source||"")}</span></li>`;
    }).join("");
    return `
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
  function open(key, lang){
    const d=ensureDialog(), t=L[lang];
    d.querySelector(".ins-eyebrow").textContent=t.btn;
    d.querySelector(".ins-title").textContent=key;
    d.querySelector(".ins-close").setAttribute("aria-label",t.close);
    d.querySelector(".ins-body").innerHTML=bodyHTML(key,lang);
    d.querySelector(".ins-body").scrollTop=0;
    document.documentElement.classList.add("ins-lock");
    if(!d.open) d.showModal();
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
    const b=e.target.closest("[data-insight]"); if(!b) return;
    e.preventDefault(); open(b.dataset.insight, b.dataset.lang==="en"?"en":"ko");
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
  @media (max-width:600px){
    .ins-dialog{width:100%;max-width:none;margin:auto 0 0;max-height:92dvh}
    .ins-sheet{border-radius:18px 18px 0 0;max-height:92dvh}
    .ins-head{padding:16px 16px 12px}.ins-body{padding:4px 16px 28px}
    .ins-title{font-size:19px}
  }`;
  const st=document.createElement("style"); st.textContent=css; document.head.appendChild(st);

  window.Insights={button, open, openCustom, has:n=>!!resolve(n)};
})();
