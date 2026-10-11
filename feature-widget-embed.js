(() => {
  const shell=document.querySelector('[data-widget-id]');
  if(!shell) return;
  const id=shell.dataset.widgetId;
  const host='https://sgtr-eks-widgets.genesiv.org';
  const allowed=['cattrader.returningai.io'];
  if(['NmFjNTE0NjkxODk5ODM2MGI3MTQ3M2E2','NmFjNDY0NzAwZjZkOTA3MGFmYjkwMDk1','NmFjNDkzODIzMjY2Y2YxN2MwMTI3ZGEy'].includes(id)) allowed.push('ruitong-portfolio26.vercel.app');
  // Keep the observed domain policy. Do not send an identity from localhost or preview origins.
  if(location.protocol!=='https:' || !allowed.includes(location.hostname)) return;
  const form=shell.querySelector('.embed-auth');
  const result=shell.querySelector('.embed-result');
  const capture=shell.querySelector('.embed-capture');
  const status=shell.querySelector('.embed-state');
  const disconnect=form.querySelector('[data-disconnect]');
  let loader,timer,observer;
  const stop=()=>{
    clearTimeout(timer); observer?.disconnect(); loader?.remove();
    result.replaceChildren(); result.hidden=true; capture.hidden=false;
    disconnect.hidden=true; form.reset(); status.textContent='Captured preview · disconnected';
  };
  form.hidden=false;
  disconnect.addEventListener('click',stop);
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const email=form.elements['widget-email'].value.trim();
    if(!email || !form.reportValidity()) return;
    stop();
    const container=document.createElement('div');
    container.id=`returning-ai-feature-${id}`;
    result.append(container); result.hidden=false; disconnect.hidden=false;
    status.textContent='Connecting the official widget…';
    observer=new MutationObserver(()=>{
      const iframe=container.querySelector('iframe');
      if(iframe) iframe.title=`CatTrader · ${shell.dataset.widgetName}`;
    });
    observer.observe(container,{childList:true,subtree:true});
    loader=document.createElement('script');
    loader.src=`${host}/widget-loader.js`;
    Object.assign(loader.dataset,{widgetId:id,widgetType:'custom',container:container.id,email,theme:'light',width:'100%',height:'800px',apiUrl:host,widgetUrl:`${host}/custom-widget`,autoRefresh:'true',debug:'false'});
    loader.addEventListener('error',()=>{stop();status.textContent='Widget unavailable · captured preview retained';});
    document.body.append(loader);
    // The runtime identity is neither saved in source nor persisted to browser storage.
    timer=setTimeout(()=>{if(!result.hidden){stop();status.textContent='Connection not confirmed · captured preview retained';}},20000);
  });
  window.addEventListener('message',event=>{
    const iframe=result.querySelector('iframe');
    if(event.origin!==host || !iframe || event.source!==iframe.contentWindow) return;
    const type=typeof event.data==='string'?event.data:event.data?.type;
    if(type==='WIDGET_READY') {clearTimeout(timer);capture.hidden=true;status.textContent='Connected · official CatTrader widget';}
    if(type==='WIDGET_ERROR') {stop();status.textContent='Widget authentication unavailable · captured preview retained';}
    if(type==='WIDGET_HEIGHT_UPDATE') {
      const height=Number(event.data?.payload?.height);
      if(Number.isFinite(height) && height>200 && height<5000) iframe.style.height=`${Math.ceil(height)}px`;
    }
  });
  window.addEventListener('pagehide',stop,{once:true});
})();
