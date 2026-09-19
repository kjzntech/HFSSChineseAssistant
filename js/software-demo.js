(function(){
  var $=function(s){return document.querySelector(s)};
  var root=document.documentElement;

  /* ===== 主题切换（主窗口标题栏） ===== */
  var themeIcon=$('#themeIcon');
  var SUN='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>';
  var MOON='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  function applyTheme(t){
    if(t==='light'){root.setAttribute('data-theme','light');themeIcon.innerHTML=SUN;$('#btnTheme').setAttribute('aria-label','切换到深色主题')}
    else{root.removeAttribute('data-theme');themeIcon.innerHTML=MOON;$('#btnTheme').setAttribute('aria-label','切换到浅色主题')}
  }
  var savedTheme=null;
  try{savedTheme=localStorage.getItem('hfss-theme')}catch(e){}
  applyTheme(savedTheme==='light'?'light':'dark');
  $('#btnTheme').addEventListener('click',function(){
    var next=root.getAttribute('data-theme')==='light'?'dark':'light';
    applyTheme(next);
    try{localStorage.setItem('hfss-theme',next)}catch(e){}
  });

  /* ===== Toast ===== */
  var toastEl=$('#toast'), toastTimer=null;
  function toast(msg){
    toastEl.textContent=msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(function(){toastEl.classList.remove('show')},2200);
  }

  /* ===== 翻译状态（主窗口按钮 / 悬浮开关 / 设置 三处联动） ===== */
  var logBody=$('#logBody'), btnPause=$('#btnPause'), pauseText=$('#pauseText'), pauseIcon=$('#pauseIcon');
  var qbSwitch=$('#qbSwitch'), statusCard=$('#statusCard'), statusB=$('#statusB'), statusHint=$('#statusHint'), logLive=$('#logLive');
  var translating=true;
  var ICON_PAUSE='<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>';
  var ICON_RESUME='<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5l11 7-11 7z"/></svg>';
  function now(){
    var d=new Date();
    function p(n){return (n<10?'0':'')+n}
    return p(d.getHours())+':'+p(d.getMinutes())+':'+p(d.getSeconds());
  }
  function addLog(msg){
    var line=document.createElement('div');
    line.className='log-line';
    line.innerHTML='<span class="dot"></span><span class="t">['+now()+']</span><span>'+msg+'</span>';
    logBody.appendChild(line);
    logBody.scrollTop=logBody.scrollHeight;
  }
  function syncTranslatingUI(){
    btnPause.classList.toggle('paused',!translating);
    pauseText.textContent=translating?'暂停翻译':'恢复翻译';
    pauseIcon.innerHTML=translating?ICON_PAUSE:ICON_RESUME;
    qbSwitch.classList.toggle('on',translating);
    qbSwitch.classList.toggle('off',!translating);
    qbSwitch.setAttribute('aria-checked',translating?'true':'false');
    statusCard.classList.toggle('paused',!translating);
    statusB.textContent=translating?'状态：已发现 AEDT':'状态：已暂停翻译';
    statusHint.textContent=translating?'请把鼠标移到 AEDT 界面，即可查看中文翻译。':'悬停翻译已关闭，点击「恢复翻译」重新开启。';
    logLive.textContent=translating?'● 监听中':'● 已暂停';
    logLive.classList.toggle('paused',!translating);
    if(!translating) hideTip();
  }
  function setTranslating(v,source){
    if(v===translating) return;
    translating=v;
    syncTranslatingUI();
    if(source!=='init') addLog(translating?'已恢复翻译，悬停提示已开启。':'已暂停翻译，悬停提示已关闭。');
  }
  btnPause.addEventListener('click',function(){setTranslating(!translating,'main')});
  qbSwitch.addEventListener('click',function(){setTranslating(!translating,'widget')});

  $('#btnMin').addEventListener('click',function(){toast('演示效果：最小化到系统托盘')});
  $('#btnMin2').addEventListener('click',function(){toast('演示效果：最小化到系统托盘')});
  $('#btnClose').addEventListener('click',function(){toast('演示效果：退出程序')});
  $('#btnExit').addEventListener('click',function(){toast('演示效果：退出程序')});
  $('#btnClear').addEventListener('click',function(){
    logBody.innerHTML='<div class="log-line log-empty"><span>日志已清空。</span><span class="cursor"></span></div>';
    toast('运行日志已清空');
  });

  /* ===== 关于弹窗 ===== */
  var overlay=$('#aboutOverlay');
  function openAbout(){overlay.classList.add('show')}
  function closeAbout(){overlay.classList.remove('show')}
  $('#btnAbout').addEventListener('click',openAbout);
  $('#aboutClose').addEventListener('click',closeAbout);
  overlay.addEventListener('click',function(e){if(e.target===overlay)closeAbout()});

  $('#btnCopy').addEventListener('click',function(){
    var text='antenna_stack';
    function done(){toast('已复制公众号 ID：antenna_stack')}
    function fallbackCopy(t){
      var ta=document.createElement('textarea');
      ta.value=t;ta.style.position='fixed';ta.style.opacity='0';
      document.body.appendChild(ta);ta.select();
      try{document.execCommand('copy')}catch(e){}
      document.body.removeChild(ta);
    }
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(done,function(){fallbackCopy(text);done()});
    }else{fallbackCopy(text);done()}
  });

  /* ===== 设置弹窗 ===== */
  var settingsOverlay=$('#settingsOverlay');
  var setMain=$('#setMain'), setOrig=$('#setOrig'), setBoot=$('#setBoot'), delaySeg=$('#delaySeg');
  var hoverDelay=200, showOrig=true;
  function syncSwitch(btn,v){
    btn.classList.toggle('on',v);
    btn.classList.toggle('off',!v);
    btn.setAttribute('aria-checked',v?'true':'false');
  }
  function openSettings(){
    syncSwitch(setMain,translating);
    syncSwitch(setOrig,showOrig);
    delaySeg.querySelectorAll('button').forEach(function(b){
      b.classList.toggle('active',parseFloat(b.dataset.delay)*1000===hoverDelay);
    });
    settingsOverlay.classList.add('show');
  }
  function closeSettings(){settingsOverlay.classList.remove('show')}
  $('#qbGear').addEventListener('click',openSettings);
  $('#settingsClose').addEventListener('click',closeSettings);
  settingsOverlay.addEventListener('click',function(e){if(e.target===settingsOverlay)closeSettings()});
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){closeAbout();closeSettings()}
  });

  setMain.addEventListener('click',function(){
    setTranslating(!translating,'settings');
    syncSwitch(setMain,translating);
  });
  setOrig.addEventListener('click',function(){
    showOrig=!showOrig;
    syncSwitch(setOrig,showOrig);
    $('#aedtTip').classList.toggle('hide-en',!showOrig);
  });
  setBoot.addEventListener('click',function(){
    var v=setBoot.classList.contains('on');
    syncSwitch(setBoot,!v);
    toast('演示效果：开机自启动已'+(v?'关闭':'开启'));
  });
  delaySeg.addEventListener('click',function(e){
    var b=e.target.closest('button');
    if(!b) return;
    delaySeg.querySelectorAll('button').forEach(function(x){x.classList.remove('active')});
    b.classList.add('active');
    hoverDelay=parseFloat(b.dataset.delay)*1000;
  });
  $('#setReset').addEventListener('click',function(){
    translating=true;hoverDelay=200;showOrig=true;
    syncTranslatingUI();
    syncSwitch(setMain,true);syncSwitch(setOrig,true);syncSwitch(setBoot,false);
    delaySeg.querySelectorAll('button').forEach(function(b){
      b.classList.toggle('active',parseFloat(b.dataset.delay)*1000===200);
    });
    $('#aedtTip').classList.remove('hide-en');
    toast('已恢复默认设置');
  });
  $('#setDone').addEventListener('click',closeSettings);

  /* ===== AEDT 悬浮翻译 ===== */
  var treeData=[
    {en:'3D Components',zh:'3D 组件'},
    {en:'Model',zh:'模型'},
    {en:'Boundaries',zh:'边界条件'},
    {en:'Excitations',zh:'激励'},
    {en:'Hybrid Regions',zh:'混合区域'},
    {en:'Mesh Operations',zh:'网格操作'},
    {en:'Analysis',zh:'分析'},
    {en:'Optimetrics',zh:'优化设计'},
    {en:'Results',zh:'结果'},
    {en:'Port Field Display',zh:'端口场显示'},
    {en:'Field Overlays',zh:'场覆盖图'},
    {en:'Radiation',zh:'辐射'},
    {en:'Definitions',zh:'定义'},
    {en:'Components',zh:'组件'},
    {en:'Symbols',zh:'符号'},
    {en:'Footprints',zh:'封装外形'},
    {en:'Padstacks',zh:'焊盘栈'}
  ];
  var tree=$('#aedtTree'), body=$('#aedtBody'), tip=$('#aedtTip');
  var tipZh=$('#tipZh'), tipEn=$('#tipEn');
  var items=[], tipTimer=null;

  var CHEVRON='<svg class="node" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>';
  var SQUARE='<svg class="node" width="8" height="8" viewBox="0 0 8 8" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1.2" opacity=".85"/></svg>';

  treeData.forEach(function(d,i){
    var el=document.createElement('div');
    el.className='tree-item'+(i>=13?' indent':'');
    el.innerHTML=(i>=13?SQUARE:CHEVRON)+'<span class="tw">'+d.en+'</span>';
    el.addEventListener('mouseenter',function(){
      if(!translating) return;
      clearTimeout(tipTimer);
      tipTimer=setTimeout(function(){showTip(d,el)},hoverDelay);
    });
    tree.appendChild(el);
    items.push(el);
  });

  function showTip(d,el){
    if(!translating) return;
    tipZh.textContent=d.zh;
    tipEn.textContent=d.en;
    tip.classList.toggle('hide-en',!showOrig);
    tip.classList.remove('flip');
    tip.classList.add('show');
    var px=el.offsetLeft+el.offsetWidth+12;
    var py=el.offsetTop+el.offsetHeight/2;
    var tw=tip.offsetWidth, th=tip.offsetHeight;
    var cw=body.clientWidth, ch=body.clientHeight;
    if(px+tw>cw-6){px=el.offsetLeft-tw-12;tip.classList.add('flip')}
    py=Math.max(th/2+6,Math.min(py,ch-th/2-6));
    tip.style.left=px+'px';
    tip.style.top=py+'px';
    items.forEach(function(it){it.classList.remove('active')});
    el.classList.add('active');
  }
  function hideTip(){
    clearTimeout(tipTimer);
    tip.classList.remove('show');
    items.forEach(function(it){it.classList.remove('active')});
  }
  body.addEventListener('mouseleave',function(){hideTip()});
  /* 页面加载后默认演示“Mesh Operations” */
  setTimeout(function(){if(translating)showTip(treeData[5],items[5])},500);

  /* ===== 悬浮快捷条拖动 ===== */
  var qb=$('#quickBar'), aedt=$('#aedtWin');
  var dragging=false,dx=0,dy=0;
  function clampQB(){
    var maxX=aedt.clientWidth-qb.offsetWidth-6;
    var maxY=aedt.clientHeight-qb.offsetHeight-6;
    var x,y;
    if(!qb.style.left){
      x=aedt.clientWidth-qb.offsetWidth-14;
      y=aedt.clientHeight-qb.offsetHeight-14;
    }else{
      x=parseFloat(qb.style.left);y=parseFloat(qb.style.top);
    }
    x=Math.max(6,Math.min(x,maxX));
    y=Math.max(6,Math.min(y,maxY));
    qb.style.left=x+'px';
    qb.style.top=y+'px';
  }
  try{
    var sp=localStorage.getItem('hfss-qb-pos');
    if(sp&&sp.indexOf('|')>-1){
      qb.style.left=sp.split('|')[0]+'px';
      qb.style.top=sp.split('|')[1]+'px';
    }
  }catch(e){}
  clampQB();

  qb.addEventListener('pointerdown',function(e){
    if(e.target.closest('button')) return;
    dragging=true;
    dx=e.clientX-qb.offsetLeft;
    dy=e.clientY-qb.offsetTop;
    qb.classList.add('dragging');
    try{qb.setPointerCapture(e.pointerId)}catch(err){}
  });
  qb.addEventListener('pointermove',function(e){
    if(!dragging) return;
    var x=e.clientX-dx, y=e.clientY-dy;
    x=Math.max(6,Math.min(x,aedt.clientWidth-qb.offsetWidth-6));
    y=Math.max(6,Math.min(y,aedt.clientHeight-qb.offsetHeight-6));
    qb.style.left=x+'px';
    qb.style.top=y+'px';
  });
  function endDrag(){
    if(!dragging) return;
    dragging=false;
    qb.classList.remove('dragging');
    try{localStorage.setItem('hfss-qb-pos',qb.style.left+'|'+qb.style.top)}catch(e){}
  }
  qb.addEventListener('pointerup',endDrag);
  qb.addEventListener('pointercancel',endDrag);
  window.addEventListener('resize',clampQB);

  syncTranslatingUI();
})();
