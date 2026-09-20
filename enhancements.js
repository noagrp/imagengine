(() => {
  const d = document;
  if (d.getElementById('imagengine-v2-enhancements')) return;
  const marker = d.createElement('meta'); marker.id = 'imagengine-v2-enhancements'; d.head.appendChild(marker);

  const style = d.createElement('style');
  style.textContent = `.upload-card.dragging{border-color:#60a5fa!important;background:rgba(37,99,235,.08)}@media(max-width:720px){.top-actions{top:max(8px,env(safe-area-inset-top));left:8px;right:8px}.drawer{padding-left:10px;padding-right:10px;padding-bottom:max(16px,env(safe-area-inset-bottom))}.drawer-tabs{overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}.drawer-tabs::-webkit-scrollbar{display:none}.tab-trigger{flex:0 0 auto;min-width:92px;padding-left:8px;padding-right:8px}.options-grid{grid-template-columns:repeat(3,1fr)}.panel-block-row{flex-wrap:wrap}.canvas-space{padding:12px;padding-bottom:62px}}`;
  d.head.appendChild(style);

  const filters = [
    ['tealorange','🌅','Teal & Orange'],['cross','🎞️','Cross Process'],['acid','🧪','Acid Green'],['rose','🌹','Rose Chrome'],['neon','🔮','Cyber Neon'],['negative','🎞️','Negative Film'],['thermal','🔥','Thermal Vision'],['solarize','☀️','Solar Burst'],['noir','🌑','Film Noir'],['vibrant','🌈','Hyper Vibrant'],['bleach','🧊','Bleach Bypass'],['purple','🟣','Purple Haze'],['cool','❄️','Nordic Ice'],['infrared','🌿','False Infrared'],['gold','🪙','Midas Gold']
  ];
  d.querySelectorAll('#tab-filters .grid-card').forEach((card,i)=>{const x=filters[i]; if(x){card.dataset.filter=x[0];card.innerHTML=`<span>${x[1]}</span>${x[2]}`;}});

  const effects = [
    ['mosaic','🧩','Mosaic Glass'],['grain','🎞️','Film Grain'],['smear','💨','Motion Smear'],['vignette','📸','Vignette'],['leak','☀️','Color Leak'],['oil','🎨','Painted Dots'],['halftone','💥','Halftone'],['sketch','✏️','Sketch'],['scanlines','📼','Scanlines'],['rgbsplit','🫨','RGB Shift'],['duotone','🔵','Duotone'],['glitchbars','📊','Data Bars'],['prism','🌈','Prism Bands'],['edge','⚡','Neon Edges'],['bloom','🔆','Soft Glow']
  ];
  d.querySelectorAll('#tab-effects .grid-card').forEach((card,i)=>{const x=effects[i]; if(x){card.dataset.fx=x[0];card.innerHTML=`<span>${x[1]}</span>${x[2]}`;}});
  const tabs=d.querySelectorAll('.tab-trigger'); if(tabs[0])tabs[0].textContent='🎨 Looks (15)'; if(tabs[1])tabs[1].textContent='✨ FX (15)';

  const clamp=v=>Math.max(0,Math.min(255,v));
  const mix=(a,b,t)=>a+(b-a)*t;
  const heatColor=l=>{const t=l/255;if(t<.25){const q=t/.25;return[0,40+160*q,160+95*q]}if(t<.5){const q=(t-.25)/.25;return[40*q,200+55*q,255-210*q]}if(t<.75){const q=(t-.5)/.25;return[40+215*q,255,45-35*q]}const q=(t-.75)/.25;return[255,255-180*q,10+245*q]};
  const falseIR=l=>{const t=l/255;if(t<.35){const q=t/.35;return[20+80*q,10+20*q,80+120*q]}if(t<.7){const q=(t-.35)/.35;return[100+155*q,30+35*q,200-120*q]}const q=(t-.7)/.3;return[255,65+190*q,80+175*q]};

  applyLiveFilterCalculation = function(value){
    if(!filterLayerBackupSnapshot)return;
    backingCtx.putImageData(filterLayerBackupSnapshot,0,0);
    const img=backingCtx.getImageData(0,0,backingCanvas.width,backingCanvas.height),p=img.data,s=value/100;
    for(let i=0;i<p.length;i+=4){
      const r=p[i],g=p[i+1],b=p[i+2],l=.2126*r+.7152*g+.0722*b; let tr=r,tg=g,tb=b;
      switch(selectedFilterType){
        case'tealorange':{const q=l/255;tr=mix(10,255,q);tg=mix(105,145,q);tb=mix(130,55,q);break}
        case'cross':tr=clamp(r*1.18+18-b*.08);tg=clamp(g*1.04+8);tb=clamp(b*1.2-18+r*.04);break;
        case'acid':tr=clamp(r*.68+10);tg=clamp(g*1.5+28);tb=clamp(b*.55+8);break;
        case'rose':tr=clamp(r*1.25+28);tg=clamp(g*.72+8);tb=clamp(b*1.08+24);break;
        case'neon':{const mx=Math.max(r,g,b),mn=Math.min(r,g,b),m=(mx+mn)/2;tr=clamp(m+(r-m)*1.8+24);tg=clamp(m+(g-m)*1.25-18);tb=clamp(m+(b-m)*1.9+40);break}
        case'negative':tr=clamp(255-r*.92+12);tg=clamp(245-g*.9);tb=clamp(235-b*.82+18);break;
        case'thermal':[tr,tg,tb]=heatColor(l);break;
        case'solarize':{const th=190-value*.9;tr=r>th?255-r:r;tg=g>th?255-g:g;tb=b>th?255-b:b;break}
        case'noir':{const c=clamp((l-128)*1.55+118);tr=tg=tb=c;break}
        case'vibrant':{const a=(r+g+b)/3;tr=clamp(a+(r-a)*1.8+8);tg=clamp(a+(g-a)*1.8+8);tb=clamp(a+(b-a)*1.8+8);break}
        case'bleach':{const c=clamp((l-128)*1.45+135);tr=clamp(c*.8+r*.2);tg=clamp(c*.8+g*.2);tb=clamp(c*.8+b*.2);break}
        case'purple':tr=clamp(r*1.08+32);tg=clamp(g*.62);tb=clamp(b*1.32+48);break;
        case'cool':tr=clamp(r*.72-8);tg=clamp(g*1.02+12);tb=clamp(b*1.34+34);break;
        case'infrared':[tr,tg,tb]=falseIR(l);break;
        case'gold':{const c=clamp((l-128)*1.25+128);tr=clamp(c*1.18+28);tg=clamp(c*.88+12);tb=clamp(c*.28);break}
      }
      p[i]=clamp(mix(r,tr,s));p[i+1]=clamp(mix(g,tg,s));p[i+2]=clamp(mix(b,tb,s));
    }
    backingCtx.putImageData(img,0,0);synchronizeStudioView();
  };

  const baseFx=applyLiveFxDistortion;
  applyLiveFxDistortion=function(value){
    if(!filterLayerBackupSnapshot)return;
    if(!['mosaic','grain','smear','prism'].includes(selectedFxType))return baseFx(value);
    backingCtx.putImageData(filterLayerBackupSnapshot,0,0);
    const W=backingCanvas.width,H=backingCanvas.height;
    if(selectedFxType==='mosaic'){
      const size=Math.max(5,Math.floor(value*.35)),src=backingCtx.getImageData(0,0,W,H).data;backingCtx.clearRect(0,0,W,H);
      for(let y=0;y<H;y+=size)for(let x=0;x<W;x+=size){const sx=Math.min(W-1,x+Math.floor(size/2)),sy=Math.min(H-1,y+Math.floor(size/2)),i=(sy*W+sx)*4,lift=((x/size+y/size)%2===0)?12:-8;backingCtx.fillStyle=`rgba(${clamp(src[i]+lift)},${clamp(src[i+1]+lift)},${clamp(src[i+2]+lift)},${src[i+3]/255})`;backingCtx.fillRect(x,y,size-1,size-1)}
    }else if(selectedFxType==='grain'){
      const img=backingCtx.getImageData(0,0,W,H),p=img.data,amt=value*1.6;for(let i=0;i<p.length;i+=4){const n=(Math.random()-.5)*amt;p[i]=clamp(p[i]+n);p[i+1]=clamp(p[i+1]+n);p[i+2]=clamp(p[i+2]+n)}backingCtx.putImageData(img,0,0);
    }else if(selectedFxType==='smear'){
      const tmp=d.createElement('canvas');tmp.width=W;tmp.height=H;tmp.getContext('2d').drawImage(backingCanvas,0,0);const dist=Math.max(2,Math.floor(value*.18));backingCtx.clearRect(0,0,W,H);for(let k=-3;k<=3;k++){backingCtx.globalAlpha=1/7;backingCtx.drawImage(tmp,k*dist,Math.round(k*dist*.18))}backingCtx.globalAlpha=1;
    }else if(selectedFxType==='prism'){
      const img=backingCtx.getImageData(0,0,W,H),p=img.data,bands=Math.max(4,Math.floor(12-value*.07));for(let i=0;i<p.length;i+=4){const l=.2126*p[i]+.7152*p[i+1]+.0722*p[i+2],q=Math.floor((l/256)*bands)/Math.max(1,bands-1),a=q*Math.PI*2;p[i]=clamp(128+127*Math.sin(a));p[i+1]=clamp(128+127*Math.sin(a+2.094));p[i+2]=clamp(128+127*Math.sin(a+4.188))}backingCtx.putImageData(img,0,0);
    }
    synchronizeStudioView();
  };

  pushHistorySnapshot=function(){redoStack=[];const px=backingCanvas.width*backingCanvas.height,max=px>12000000?4:px>6000000?8:16;if(undoStack.length>=max)undoStack.shift();undoStack.push(backingCanvas.toDataURL('image/png'));updateHistoryInterfaceButtons();};

  function loadImageFile(file){if(!file||!file.type?.startsWith('image/'))return;const reader=new FileReader();reader.onload=e=>{originalSourceImage=new Image();originalSourceImage.onload=()=>{setupImageMatrixCore(originalSourceImage);uploadScreen.style.display='none';drawer.classList.add('expanded')};originalSourceImage.src=e.target.result};reader.readAsDataURL(file)}
  const card=d.querySelector('.upload-card');['dragenter','dragover'].forEach(t=>window.addEventListener(t,e=>{e.preventDefault();card?.classList.add('dragging')}));['dragleave','drop'].forEach(t=>window.addEventListener(t,e=>{e.preventDefault();card?.classList.remove('dragging')}));window.addEventListener('drop',e=>{const f=[...(e.dataTransfer?.files||[])].find(x=>x.type.startsWith('image/'));if(f)loadImageFile(f)});

  d.getElementById('tab-effects')?.addEventListener('click',e=>{const c=e.target.closest('[data-fx]');if(!c)return;const px=backingCanvas.width*backingCanvas.height;if(px>8000000&&['mosaic','sketch','edge','prism'].includes(c.dataset.fx)&&!confirm('This effect can be slow on a large photo. Continue?')){e.preventDefault();e.stopImmediatePropagation()}},true);
})();
