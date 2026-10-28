// Lightweight one-shot canvas confetti. No dependencies. Honors
// prefers-reduced-motion. Colors resolve from DMS tokens at burst time.
function playConfetti(){
  if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var existing=document.getElementById("share-confetti");
  if(existing) existing.parentNode.removeChild(existing);
  var canvas=document.createElement("canvas");
  canvas.id="share-confetti";
  canvas.className="share-confetti";
  canvas.setAttribute("aria-hidden","true");
  document.body.appendChild(canvas);
  var ctx=canvas.getContext("2d");
  if(!ctx){ canvas.parentNode.removeChild(canvas); return; }
  function resize(){ canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
  resize();
  var cs=getComputedStyle(document.documentElement);
  function tok(name,fallback){ var v=cs.getPropertyValue(name).trim(); return v||fallback; }
  var colors=[
    tok("--color-fill-accent","#066AFE"),
    tok("--color-fill-accent-hover","#022AC0"),
    tok("--color-cloud-blue-80","#90D0FE"),
    tok("--color-on-surface-success","#2E844A"),
    tok("--color-on-surface-1","#001E5B")
  ];
  var pieces=[];
  var n=90;
  var cx=canvas.width/2;
  var cy=canvas.height*0.38;
  for(var i=0;i<n;i++){
    var angle=(Math.PI*2*i)/n+(Math.random()-0.5)*0.4;
    var speed=6+Math.random()*8;
    pieces.push({
      x:cx, y:cy,
      vx:Math.cos(angle)*speed,
      vy:Math.sin(angle)*speed-4,
      w:6+Math.random()*6,
      h:8+Math.random()*8,
      rot:Math.random()*Math.PI,
      vr:(Math.random()-0.5)*0.4,
      color:colors[i%colors.length],
      life:1
    });
  }
  var start=performance.now();
  function frame(now){
    var t=(now-start)/1400;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(function(p){
      p.vy+=0.22;
      p.x+=p.vx;
      p.y+=p.vy;
      p.rot+=p.vr;
      p.vx*=0.99;
      var alpha=Math.max(0,1-t);
      ctx.save();
      ctx.translate(p.x,p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha=alpha;
      ctx.fillStyle=p.color;
      ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
      ctx.restore();
    });
    if(t<1) requestAnimationFrame(frame);
    else if(canvas.parentNode) canvas.parentNode.removeChild(canvas);
  }
  requestAnimationFrame(frame);
}
