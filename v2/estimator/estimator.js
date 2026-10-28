/* ══════════════════════════════════════════════════════════════════
   SOLUTION ESTIMATOR — step machine
   ────────────────────────────────────────────────────────────────
   Ported from the reference POC (Salesforce_Solution_Estimator_v2),
   adapted for the solution-based-pricing prototype:

   • The upstream "What are you trying to solve?" screen hands off the
     selected goals via URL params (?g=0,3,4&q=…). We seed S.prbs from
     them on boot, so the Products step opens pre-filtered instead of
     blank — and we surface the carried goals as chips (visible
     carry-forward).
   • The POC's in-flow "problems" step (r2) is DROPPED — goals were
     already captured upstream.
   • Steps re-indexed to 7: 0 Industry · 1 Size+Region · 2 Products ·
     3 Flex (conditional) · 4 Buying Model · 5 Agreement · 6 Estimate.
   • Progress bar collapsed to 5 coherent stages
     (Solutions · Discover · Configure · Buying Models · Estimate).
     "Solutions" is the upstream solve screen — always completed,
     links back there with the goals preserved.
   • Competitive Insights (browser → Anthropic API) REMOVED — it can't
     run on file://. Free Trial + Connect-with-a-Specialist CTAs stay.
   • Back/Continue re-skinned to the project's .sf-cta components.

   NOTE: functions are intentionally global (no IIFE) because the
   rendered markup wires interactions via inline onclick handlers,
   matching the POC's dispatch model.
   ══════════════════════════════════════════════════════════════════ */

// ─── Data ────────────────────────────────────────────────────────
var INDS=[["Financial Services","Banking, insurance, wealth"],["Healthcare & Life Sciences","Hospitals, pharma, biotech"],["Retail & Consumer Goods","Omnichannel, ecommerce"],["Manufacturing","Supply chain, operations"],["Technology & SaaS","Software, cloud, platforms"],["Communications & Media","Telco, streaming, publishing"],["Energy & Utilities","Power, oil & gas, renewables"],["Government & Public Sector","Federal, state, local"],["Education","Higher ed, K-12, edtech"],["Nonprofit","NGOs, foundations, charities"],["Automotive","OEM, dealers, aftermarket"],["Travel & Hospitality","Airlines, hotels, tourism"],["Professional Services","Consulting, legal, accounting"],["Real Estate","Commercial, residential, PropTech"],["Transportation & Logistics","Freight, supply chain, last mile"],["Chemicals & Agriculture","Agritech, specialty chemicals"],["High Tech & Semiconductor","Hardware, chips, IoT"],["Consumer Electronics","Devices, gaming, smart home"],["Construction & Engineering","Projects, infrastructure, EPC"]];
// Industry SVG icons (assets/industry-icons/), matched to each INDS card.
// Where the icon library has no dedicated asset, the closest Salesforce
// industry icon is reused: Real Estate + Construction → Eng-Con-RE; Travel +
// Transportation → travel-transportation; Technology + High Tech → technology;
// Chemicals & Agriculture → manufacturing (specialty chemicals; no chem/agri icon).
var ICS=[
  "<img class='ind-ico' src='../assets/industry-icons/financial-services.svg' alt='' aria-hidden='true'>",   // Financial Services
  "<img class='ind-ico' src='../assets/industry-icons/healthcare.svg' alt='' aria-hidden='true'>",            // Healthcare & Life Sciences
  "<img class='ind-ico' src='../assets/industry-icons/retail.svg' alt='' aria-hidden='true'>",                // Retail & Consumer Goods
  "<img class='ind-ico' src='../assets/industry-icons/manufacturing.svg' alt='' aria-hidden='true'>",         // Manufacturing
  "<img class='ind-ico' src='../assets/industry-icons/technology.svg' alt='' aria-hidden='true'>",            // Technology & SaaS
  "<img class='ind-ico' src='../assets/industry-icons/communications.svg' alt='' aria-hidden='true'>",        // Communications & Media
  "<img class='ind-ico' src='../assets/industry-icons/energy-utilities.svg' alt='' aria-hidden='true'>",      // Energy & Utilities
  "<img class='ind-ico' src='../assets/industry-icons/public-sector.svg' alt='' aria-hidden='true'>",         // Government & Public Sector
  "<img class='ind-ico' src='../assets/industry-icons/education.svg' alt='' aria-hidden='true'>",             // Education
  "<img class='ind-ico' src='../assets/industry-icons/nonprofit.svg' alt='' aria-hidden='true'>",             // Nonprofit
  "<img class='ind-ico' src='../assets/industry-icons/automotive.svg' alt='' aria-hidden='true'>",            // Automotive
  "<img class='ind-ico' src='../assets/industry-icons/travel-transportation.svg' alt='' aria-hidden='true'>", // Travel & Hospitality
  "<img class='ind-ico' src='../assets/industry-icons/professional-services.svg' alt='' aria-hidden='true'>", // Professional Services
  "<img class='ind-ico' src='../assets/industry-icons/eng-con-re.svg' alt='' aria-hidden='true'>",            // Real Estate
  "<img class='ind-ico' src='../assets/industry-icons/travel-transportation.svg' alt='' aria-hidden='true'>", // Transportation & Logistics (shared)
  "<img class='ind-ico' src='../assets/industry-icons/manufacturing.svg' alt='' aria-hidden='true'>",         // Chemicals & Agriculture (closest)
  "<img class='ind-ico' src='../assets/industry-icons/technology.svg' alt='' aria-hidden='true'>",            // High Tech & Semiconductor (shared)
  "<img class='ind-ico' src='../assets/industry-icons/consumer-goods.svg' alt='' aria-hidden='true'>",        // Consumer Electronics
  "<img class='ind-ico' src='../assets/industry-icons/eng-con-re.svg' alt='' aria-hidden='true'>"             // Construction & Engineering (shared)
];
var SIZES=[["1–50","Small Business",10],["51–200","Growing Business",50],["201–1,000","Mid-Market",150],["1,001–5,000","Upper Mid-Market",500],["5,001–10,000","Large Enterprise",1000],["10,000+","Global Enterprise",2000]];

// Geography regions — based on standard enterprise SaaS segmentation
var GEOS=[
  ["North America","United States & Canada"],
  ["Latin America","Mexico, Brazil, LATAM"],
  ["Europe","UK, EU27, DACH, Nordics"],
  ["Middle East & Africa","UAE, KSA, Turkey, SSA"],
  ["Asia Pacific","India, Japan, SEA, China"],
  ["ANZ","Australia & New Zealand"]
];

// PROBS — retained so we can LABEL the goals carried from the solve
// screen. Order is canonical and matches solution/index.html exactly.
// The rc arrays on PRODS reference these indices to drive "Recommended
// For You". (The in-flow problems STEP is removed; the data stays.)
var PROBS=[["Grow sales & pipeline","CRM, forecasting, deal management","&#128188;"],["Improve customer service","Case management, omnichannel support","&#127911;"],["Automate marketing","Campaigns, journeys, personalisation","&#128227;"],["Deploy AI agents","Automate tasks 24/7 with Agentforce","&#129302;"],["Unify customer data","Single view, identity resolution, AI grounding","&#128202;"],["Launch or scale ecommerce","B2C & B2B digital commerce","&#128705;"],["Integrate systems","APIs, data flows, legacy integration","&#128279;"],["Analytics & dashboards","BI, reporting, embedded analytics","&#128200;"],["Collaboration & productivity","Team messaging & workflows","&#128172;"],["Industry-specific platform","Financial Services Cloud, Health Cloud","&#127970;"]];
var BMS=[["Pay-As-You-Go (PAYG)","","","No upfront commitment. Pay monthly based on actual usage at list price. Maximum flexibility for net-new customers or experimentation.","Monthly at consumption","None (list price)","","Signing PAYG forfeits Foundations Flex Credits. Pre-purchased credits go dormant if PAYG is active on the same org."],["Pre-Purchase","","","Buy Flex Credits upfront at the highest available discount. Credits paid at signature, consumed over the contract term.","At signature","Maximum available","","Cannot co-exist with PAYG as the active model. Credits go dormant if PAYG is activated."],["Pre-Commit","","","Commit to a minimum monthly spend; billed monthly against that commitment. Shortfall invoiced at end of term.","Monthly","Standardised tiers","$1M+ ACV","Customer pays shortfall at end of term. Only recommend when customer has confidence in usage volume."],["Bonus Credits","","","Strategic incentive credits tied to higher upfront commitments. Seller lever to preserve pricing tiers.","At signature","Included in deal","Deal-specific",""]];
var BMIC=["&#128081;","&#128179;","&#128197;","&#127873;"];
// Buying-model card illustrations (3D icons) — one per rendered card (first 3 of BMS):
// PAYG → stopwatch, Pre-Purchase → rocket, Pre-Commit → bar chart. Files live in
// assets/buying-model-icons/. BMIC (emoji) is retained as data but no longer rendered.
var BMICON=["payg.png","pre-purchase.png","pre-commit.png"];
// AGR badge-colour keys ("blue"/"purple") map to DMS tokens in rAgreement.
var AGR=[["Order Form","&#128203;","","","Standard agreement. Best for Pre-Commit deals under $5M ACV."],["SELA — Salesforce Enterprise License Agreement","&#128194;","Capped","blue","Capped enterprise agreement. Enables rollover and transfers. Supports all buying models from Spring 2027."],["AELA — Agentic Enterprise License Agreement","&#127760;","Uncapped","purple","Uncapped unlimited usage. Strategic accounts $5M+ ACV. Velocity AELA available from $500K+."]];
// Product icons are the vendored Salesforce SVGs in assets/product-icons/
// (110×110, decorative — aria-hidden, product name provides the label).
// Icon file per product is a UI choice only; it does not affect pricing.
var PRODS=[
  {id:"sc",  ic:"<img class='prod-ico' src='../assets/product-icons/sales.svg' alt='' aria-hidden='true'>",nm:"Sales Cloud",   ds:"CRM, pipeline & forecasting",   tp:"seat",rc:[0,3,9,8],eds:["Starter — $25/u/mo","Pro Suite — $100/u/mo","Enterprise — $165/u/mo","Unlimited — $330/u/mo"],pr:[25,100,165,330]},
  {id:"svc", ic:"<img class='prod-ico' src='../assets/product-icons/service.svg' alt='' aria-hidden='true'>",nm:"Service Cloud",  ds:"Case management & omnichannel",  tp:"seat",rc:[1,9],eds:["Starter — $25/u/mo","Pro Suite — $100/u/mo","Enterprise — $165/u/mo","Unlimited — $330/u/mo"],pr:[25,100,165,330]},
  {id:"af",  ic:"<img class='prod-ico' src='../assets/product-icons/agentforce.svg' alt='' aria-hidden='true'>",nm:"Agentforce",     ds:"AI agents — Flex Credits",  tp:"flex",rc:[3,0,1,2,5,9]},
  {id:"d360",ic:"<img class='prod-ico' src='../assets/product-icons/data-cloud.svg' alt='' aria-hidden='true'>",nm:"Data 360",       ds:"Unified data — Flex Credits",tp:"flex",rc:[4,3,2,1,9]},
  {id:"mce", ic:"<img class='prod-ico' src='../assets/product-icons/marketing.svg' alt='' aria-hidden='true'>",nm:"Marketing Cloud Engagement",ds:"Email, SMS & journeys (B2C)",tp:"org",rc:[2,5],eds:["Basic — $1,250/org/mo","Pro — $3,750/org/mo","Corporate — $12,000/org/mo","Enterprise — $15,000/org/mo"],pr:[1250,3750,12000,15000]},
  {id:"mcae",ic:"<img class='prod-ico' src='../assets/product-icons/marketing.svg' alt='' aria-hidden='true'>",nm:"Mktg Cloud Account Engagement",ds:"B2B marketing automation (Pardot)",tp:"org",rc:[2],eds:["Growth — $1,250/org/mo","Plus — $2,500/org/mo","Advanced — $4,000/org/mo","Premium — $15,000/org/mo"],pr:[1250,2500,4000,15000]},
  {id:"cc",  ic:"<img class='prod-ico' src='../assets/product-icons/commerce.svg' alt='' aria-hidden='true'>",nm:"Commerce Cloud",ds:"B2C & B2B digital storefronts",  tp:"custom",rc:[5],note:"Revenue share model — contact sales."},
  {id:"ms",  ic:"<img class='prod-ico' src='../assets/product-icons/mulesoft.svg' alt='' aria-hidden='true'>",nm:"MuleSoft Anypoint",ds:"Integration & API management",tp:"org",rc:[6,4],eds:["Gold — $2,000/org/mo","Platinum — custom pricing"],pr:[2000,0]},
  {id:"tab", ic:"<img class='prod-ico' src='../assets/product-icons/tableau.svg' alt='' aria-hidden='true'>",nm:"Tableau",        ds:"BI & data visualisation",        tp:"seat",rc:[7],eds:["Viewer — $15/u/mo","Explorer — $42/u/mo","Creator — $70/u/mo"],pr:[15,42,70]},
  {id:"slack",ic:"<img class='prod-ico' src='../assets/product-icons/slack.svg' alt='' aria-hidden='true'>",nm:"Slack",         ds:"Team messaging & workflows",     tp:"seat",rc:[8,0],eds:["Pro — $7.25/u/mo","Business+ — $12.50/u/mo"],pr:[7.25,12.50]},
  {id:"fsc", ic:"<img class='prod-ico' src='../assets/product-icons/industries.svg' alt='' aria-hidden='true'>",nm:"Financial Services Cloud",ds:"Purpose-built for banking & insurance",tp:"seat",rc:[9],eds:["Enterprise — $225/u/mo","Unlimited — $375/u/mo"],pr:[225,375]},
  {id:"hc",  ic:"<img class='prod-ico' src='../assets/product-icons/industries.svg' alt='' aria-hidden='true'>",nm:"Health Cloud",   ds:"Patient & member relationship",  tp:"seat",rc:[9],eds:["Enterprise — $300/u/mo","Unlimited — $450/u/mo"],pr:[300,450]}
];

// Mock "why recommended" copy, keyed by product id then PROBS index.
// Hydrated onto each product as recommendationReasons so the Configure
// card reads the field instead of inline strings. A missing benefit is
// omitted; if nothing remains, the indicator stays hidden.
var REC_BENEFITS={
  sc:{
    "0":"Sales Cloud keeps pipeline, forecasts, and deal activity in one place so the team can see what will close and where to spend selling time.",
    "3":"Sales Cloud gives agents the account and opportunity context they need before they draft outreach or update a deal.",
    "8":"Sales Cloud puts the same account record in front of the people working the deal, so updates do not live in side conversations.",
    "9":"Sales Cloud is the system of record the industry solution builds on, so sellers work from the same customer record as the rest of the business."
  },
  svc:{
    "1":"Service Cloud brings cases, channels, and customer history together so agents resolve issues without asking the customer to repeat themselves.",
    "9":"Service Cloud is the case layer the industry solution uses, so service teams work from the same customer record as sales."
  },
  af:{
    "3":"Agentforce handles repetitive conversations and tasks so people step in only when a customer needs a person.",
    "0":"Agentforce follows up on leads and open opportunities so sellers spend their time on deals that need a person.",
    "1":"Agentforce answers common service questions and files the case when a person needs to take over.",
    "2":"Agentforce runs campaign and journey tasks that used to wait on a marketer, and hands off when a person should decide.",
    "5":"Agentforce helps shoppers find products and complete an order, and brings in a person when the purchase needs one.",
    "9":"Agentforce applies the industry solution's processes to routine requests so specialists handle the exceptions."
  },
  d360:{
    "4":"Data 360 connects customer records from across the business so every team works from one profile instead of separate lists.",
    "3":"Data 360 supplies the customer profile agents use, so their answers reflect the latest activity across the business.",
    "2":"Data 360 gives marketing a single view of who to reach and how they have already engaged.",
    "1":"Data 360 shows service the purchases, cases, and activity behind a customer before the conversation starts.",
    "9":"Data 360 is the shared customer profile the industry solution reads, so each team sees the same person."
  },
  mce:{
    "2":"Marketing Cloud Engagement sends the email, SMS, and journey messages that move a customer from interest to the next step.",
    "5":"Marketing Cloud Engagement brings shoppers back with messages tied to what they browsed or bought."
  },
  mcae:{
    "2":"Marketing Cloud Account Engagement tracks which accounts are engaging so marketing and sales follow up with the same story."
  },
  cc:{
    "5":"Commerce Cloud is the storefront where customers browse, build an order, and check out."
  },
  ms:{
    "6":"MuleSoft connects the systems that need to share an order, a customer, or a case, so people are not re-entering the same data.",
    "4":"MuleSoft brings records from other systems into the customer profile so the unified view stays current."
  },
  tab:{
    "7":"Tableau turns the activity in your Salesforce products into dashboards the team can check without waiting on a report."
  },
  slack:{
    "8":"Slack is where the team discusses a customer and kicks off the next step without leaving the conversation.",
    "0":"Slack alerts sellers when a deal changes so the right people can act before the opportunity goes quiet."
  },
  fsc:{
    "9":"Financial Services Cloud organizes client, household, and policy relationships the way a bank or insurer works."
  },
  hc:{
    "9":"Health Cloud organizes patient and member relationships so care teams see the person, not a stack of separate records."
  }
};
(function hydrateRecommendationReasons(){
  PRODS.forEach(function(p){
    var by=REC_BENEFITS[p.id]||{};
    p.recommendationReasons=(p.rc||[]).reduce(function(out,idx){
      var benefit=by[String(idx)];
      if(!benefit||!PROBS[idx]) return out;
      out.push({solutionId:String(idx), solutionName:PROBS[idx][0], businessBenefit:benefit});
      return out;
    },[]);
  });
})();

function escWhy(s){
  return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
// Reasons for the goals the user actually selected. Empty when this card
// is not in the recommended set, or when the product has no matching copy.
function activeReasons(p){
  var all=(p&&p.recommendationReasons)||[];
  if(!all.length||!S.prbs||!S.prbs.length) return [];
  var sel={};
  for(var i=0;i<S.prbs.length;i++) sel[String(S.prbs[i])]=true;
  var out=[];
  for(var j=0;j<all.length;j++){
    var r=all[j];
    if(!r||!sel[String(r.solutionId)]||!r.solutionName||!r.businessBenefit) continue;
    out.push(r);
  }
  return out;
}
function infoIconHtml(name,dataAttr){
  return "<button type='button' class='why-eye has-state-layer' "+dataAttr+" aria-expanded='false' aria-haspopup='dialog' aria-controls='why-pop' aria-label='More information about "+name+"'>"
    +"<i class='icon icon--info' aria-hidden='true'></i></button>";
}
function whyRecHtml(p,isRec){
  if(!isRec) return "";
  var reasons=activeReasons(p);
  if(!reasons.length) return "";
  var shown=reasons.slice(0,2);
  var rest=reasons.length-shown.length;
  var chips="";
  for(var i=0;i<shown.length;i++){
    chips+="<li><span class='why-chip'>"+escWhy(shown[i].solutionName)+"</span></li>";
  }
  if(rest){
    chips+="<li><button type='button' class='why-chip why-chip--more has-state-layer' data-why-more='"+p.id+"' aria-expanded='false' aria-haspopup='dialog' aria-controls='why-more-pop' aria-label='"+rest+" more solutions'>+"+rest+"</button></li>";
  }
  return "<div class='why-rec'>"
    +"<span class='why-rec__lbl'>Recommended for:</span>"
    +"<ul class='why-rec__chips'>"+chips+"</ul>"
    +infoIconHtml(escWhy(p.nm),"data-why-eye='"+p.id+"'")
    +"</div>";
}

// ─── "Learn about <product>" popover ──────────────────────────────
// One helper builds the trigger used on Configure product cards AND
// Estimate line items. Clicking opens a centered dialog. Description /
// features / CTA are shared dummy copy; the title and icon come from
// PRODS. `stopProp` is set when the trigger sits inside the clickable
// product-card header (.pc-h).
function prodById(id){
  for(var i=0;i<PRODS.length;i++){ if(PRODS[i].id===id) return PRODS[i]; }
  return {id:id,nm:"this product",ic:""};
}
function learnMore(id,nm,stopProp){
  return "<button type='button' class='learn-link' aria-haspopup='dialog' aria-expanded='false'"
    +" onclick='"+(stopProp?"event.stopPropagation();":"")+"openLearnPop(this,\""+id+"\")'>"
    +"Learn about "+nm+"</button>";
}
var _learn={open:false,trigger:null,scrollY:0};
function ensureLearnPop(){
  if(document.getElementById("learn-pop-root")) return;
  var root=document.createElement("div");
  root.id="learn-pop-root";
  root.hidden=true;
  root.innerHTML=""
    +"<div class='learn-pop-scrim' id='learn-pop-scrim'></div>"
    +"<div class='learn-pop' id='learn-pop' role='dialog' aria-modal='true' aria-labelledby='learn-pop-title'>"
    +"<button type='button' class='learn-pop__close' id='learn-pop-close' aria-label='Close'>"
    +"<svg width='14' height='14' viewBox='0 0 14 14' aria-hidden='true' focusable='false'>"
    +"<path d='M2 2l10 10M12 2L2 12' fill='none' stroke='currentColor' stroke-width='1.5' stroke-linecap='round'/>"
    +"</svg></button>"
    +"<div class='learn-pop__icon' id='learn-pop-icon'></div>"
    +"<h2 class='learn-pop__title' id='learn-pop-title'></h2>"
    +"<p class='learn-pop__ds'>A placeholder overview of what this product does and how teams typically use it as part of a Salesforce solution.</p>"
    +"<ul class='learn-pop__feats'>"
    +"<li>Key capability for this product (placeholder)</li>"
    +"<li>Another core feature teams rely on (placeholder)</li>"
    +"<li>Integration and workflow support (placeholder)</li>"
    +"</ul>"
    +"<a class='sf-cta sf-cta--primary sf-cta--medium learn-pop__cta' href='#' id='learn-pop-cta' target='_blank' rel='noopener noreferrer' aria-label='Explore Further (opens a new page)'>"
    +"Explore Further"
    +"<svg class='learn-pop__cta-arrow' width='12' height='12' viewBox='0 0 12 12' aria-hidden='true' focusable='false'>"
    +"<path d='M3.5 2.5h6v6M9.5 2.5L2.5 9.5' fill='none' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/>"
    +"</svg></a>"
    +"</div>";
  document.body.appendChild(root);
  document.getElementById("learn-pop-scrim").addEventListener("click",closeLearnPop);
  document.getElementById("learn-pop-close").addEventListener("click",closeLearnPop);
  document.getElementById("learn-pop-cta").addEventListener("click",function(e){ e.preventDefault(); });
}
function learnKey(e){
  if(!_learn.open) return;
  if(e.key==="Escape"){ e.preventDefault(); closeLearnPop(); return; }
  if(e.key!=="Tab") return;
  var pop=document.getElementById("learn-pop");
  var f=pop.querySelectorAll("button, a[href]");
  if(!f.length) return;
  var first=f[0], last=f[f.length-1];
  if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
  else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
}
function openLearnPop(btn,id){
  ensureLearnPop();
  if(_learn.open) closeLearnPop(true);
  var p=prodById(id);
  document.getElementById("learn-pop-title").textContent="Learn about "+p.nm;
  document.getElementById("learn-pop-icon").innerHTML=p.ic||"";
  _learn.trigger=btn;
  _learn.scrollY=window.scrollY||window.pageYOffset||0;
  _learn.open=true;
  btn.setAttribute("aria-expanded","true");
  document.getElementById("learn-pop-root").hidden=false;
  document.body.style.overflow="hidden";
  document.addEventListener("keydown",learnKey);
  document.getElementById("learn-pop-close").focus();
}
function closeLearnPop(silent){
  if(!_learn.open) return;
  var root=document.getElementById("learn-pop-root");
  var trigger=_learn.trigger;
  var y=_learn.scrollY;
  _learn.open=false;
  _learn.trigger=null;
  if(root) root.hidden=true;
  document.body.style.overflow="";
  document.removeEventListener("keydown",learnKey);
  window.scrollTo(0,y);
  if(trigger){
    trigger.setAttribute("aria-expanded","false");
    if(!silent) trigger.focus();
  }
}
var D3T=[{mC:500000,rK:500,d:"List price",lb:"0–500K/yr"},{mC:2000000,rK:450,d:"~10% off",lb:"500K–2M/yr"},{mC:5000000,rK:400,d:"~20% off",lb:"2M–5M/yr"},{mC:10000000,rK:350,d:"~30% off",lb:"5M–10M/yr"},{mC:1e18,rK:300,d:"~40% off",lb:"10M+/yr"}];
function gD3T(c){for(var i=0;i<D3T.length;i++){if(c<=D3T[i].mC)return D3T[i];}return D3T[D3T.length-1];}

// ─── State ────────────────────────────────────────────────────────
var S={
  step:0,
  ind:null,
  szi:null,
  geo:null,
  prbs:[],         // seeded from the upstream ?g= carry-forward
  _q:"",           // upstream free-text query (display / round-trip only)
  bm:null,
  ag:null,
  cfg:{},
  _allOpen:false,  // "All Salesforce products" disclosure — collapsed by default
  period:"mo",     // Configure + Estimate price period ("mo" | "ann")
  // Agentforce inline inputs. Complexity defaults to Standard and pricing model
  // to Flex Credit (pre-filled, not gated). Standard (6 actions) and the Flex
  // path are exactly calcAF's existing fallbacks, so the defaults change no math.
  afI:50,afC:"standard",afM:"flex",
  // Data 360 keeps its existing defaults (pre-selected, not gated).
  d3P:10,d3S:"few",d3U:"segmentation",
  afEst:null,d3Est:null
};

// ─── Helpers ──────────────────────────────────────────────────────
function fmt(n){return Math.round(n).toLocaleString();}
function fmtK(n){return n>=1e6?(n/1e6).toFixed(1)+"M":n>=1000?Math.round(n/1000)+"K":String(n);}
function ds(){return S.szi!==null?SIZES[S.szi][2]:10;}
function hasFlexSelected(){
  return PRODS.some(function(p){return p.tp==="flex"&&S.cfg[p.id]&&S.cfg[p.id].on;});
}

// Back / Continue buttons — rendered with the shared .sf-cta component.
// A disabled Continue gets BOTH the native `disabled` attribute and the
// `.is-disabled` class (which the component styles as grey + pointer-
// events:none), so it can't be clicked or tabbed into.
function btnBack(onclick,label){
  return "<button type='button' class='sf-cta-back' onclick='"+onclick+"'>"+(label||"Back")+"</button>";
}
function btnNext(onclick,label,enabled){
  return "<button type='button' class='sf-cta sf-cta--primary sf-cta--medium"+(enabled?"":" is-disabled")+"'"
    +" onclick='"+onclick+"'"+(enabled?"":" disabled")+">"+label+"</button>";
}
function btnSecondary(onclick,label,enabled){
  return "<button type='button' class='sf-cta sf-cta--secondary sf-cta--medium"+(enabled?"":" is-disabled")+"'"
    +" onclick='"+onclick+"'"+(enabled?"":" disabled")+">"+label+"</button>";
}
function contactSalesCta(){
  return "<a href='https://www.salesforce.com/company/contact-us/' target='_blank' rel='noopener' class='sf-cta sf-cta--secondary sf-cta--medium'>Contact Sales</a>";
}
function flexSelected(){
  return !!(S.cfg["af"]&&S.cfg["af"].on)||!!(S.cfg["d360"]&&S.cfg["d360"].on);
}
function flexCreditsFootCta(){
  if(!flexSelected()) return "";
  return "<button type='button' class='sf-cta sf-cta--primary sf-cta--medium' onclick='openFlexCalculator()'>Configure your Flex Credits</button>";
}
function footPrimary(primaryHtml,withFlex,withContact){
  return "<div class='foot-end'>"+(withContact?contactSalesCta():"")+(withFlex?flexCreditsFootCta():"")+primaryHtml+"</div>";
}
function isAnnual(){ return S.period==="ann"; }
function periodLabel(){ return isAnnual()?"Annual":"Monthly"; }
function periodAmt(pp){ return isAnnual()?pp.ann:pp.mo; }
function setPeriod(p){
  var next=p==="ann"?"ann":"mo";
  if(S.period===next) return;
  S.period=next;
  render(S.step);
  setTimeout(function(){
    var on=document.querySelector(".period-toggle__btn.is-on");
    if(on) on.focus();
  },0);
}
function periodToggleKey(e){
  if(e.key==="ArrowRight"||e.key==="ArrowDown"){ e.preventDefault(); setPeriod("ann"); }
  else if(e.key==="ArrowLeft"||e.key==="ArrowUp"){ e.preventDefault(); setPeriod("mo"); }
}
function periodToggleHtml(center){
  var ann=isAnnual();
  return "<div class='period-toggle-row"+(center?" period-toggle-row--center":"")+"'><div class='period-toggle' role='radiogroup' aria-label='Price period' onkeydown='periodToggleKey(event)'>"
    +"<button type='button' class='period-toggle__btn"+(ann?"":" is-on")+"' role='radio' aria-checked='"+(ann?"false":"true")+"' onclick='setPeriod(\"mo\")'>Monthly</button>"
    +"<button type='button' class='period-toggle__btn"+(ann?" is-on":"")+"' role='radio' aria-checked='"+(ann?"true":"false")+"' onclick='setPeriod(\"ann\")'>Annual</button>"
    +"</div></div>";
}
function priceStack(amount,id,approx){
  return "<div class='st'>"
    +"<div class='stk-start'>Starting at</div>"
    +"<div class='stv'"+(id?" id='"+id+"'":"")+">"+(approx?"~$":"$")+fmt(amount)+"</div>"
    +"<div class='stk'>"+periodLabel()+"</div>"
    +"</div>";
}
function shareCtaHtml(enabled){
  return "<div class='share-wrap'>"
    +"<button type='button' class='sf-cta sf-cta--primary sf-cta--medium share-cta"+(enabled?"":" is-disabled")+"' id='share-cta' aria-haspopup='menu' aria-expanded='false' aria-controls='share-menu' onclick='toggleShareMenu(event)'"+(enabled?"":" disabled")+">Share <i class='icon icon--chevrondown' aria-hidden='true'></i></button>"
    +"<ul id='share-menu' class='share-menu' role='menu' hidden>"
    +"<li role='none'><button type='button' class='share-menu__item' role='menuitem' onclick='shareAction(\"save\")'>Save estimation</button></li>"
    +"<li role='none'><button type='button' class='share-menu__item' role='menuitem' onclick='shareAction(\"export\")'>Export full report</button></li>"
    +"<li role='none'><button type='button' class='share-menu__item' role='menuitem' onclick='shareAction(\"dsr\")'>Bring estimation to digital sales room</button></li>"
    +"</ul></div>";
}

// ─── Breadcrumb navigation (5 stages) ─────────────────────────────
// Step 1 Your business (estimator industry) → Step 2 Solutions (solve
// screen) → Select products → Purchase options → Estimate.
// CRUMB_NAV[stage] = the action each completed breadcrumb triggers —
// Solutions leaves the estimator (goToSolve, state preserved via URL);
// the rest jump back to their canonical in-flow render step.
var CRUMBS=["Your business","Solutions","Select products","Purchase options","Estimate"];
var CRUMB_NAV=["goCrumb(0)","goToSolve()","goCrumb(2)","goCrumb(4)","goCrumb(6)"];
var BIZ_SUB="Tell us a little about your company so we can guide you toward the solutions that best fit your business needs.";
var FLOW_SUB="Tailored to the goals you selected · indicative list pricing";
function setWizardSub(){
  var el=document.querySelector(".est-wizard__sub");
  if(el) el.textContent=S.step===0?BIZ_SUB:FLOW_SUB;
}
// Rebuild the breadcrumb on every render: stages already completed become
// <button>s that navigate back, the current stage is highlighted (and carries
// aria-current), and future stages are inert (a plain span — not focusable,
// not clickable). Numbers persist in every state.
function setBar(){
  // Industry (0,1) → crumb 0; Products (2,3) → crumb 2; Buy (4,5) → 3; Estimate (6) → 4.
  // Solutions (crumb 1) lives on the solve page, not an in-flow render step.
  var map=[0,0,2,2,3,3,4];
  var stg=map[Math.min(S.step,6)];
  var ol=document.getElementById("est-crumbs");if(!ol)return;
  var h="";
  for(var i=0;i<CRUMBS.length;i++){
    var inner="<span class='crumb-n'>"+(i+1)+"</span><span class='crumb-l'>"+CRUMBS[i]+"</span>";
    var crumb;
    var done=i<stg||(i===1&&stg===0&&S.prbs.length);
    if(i===stg){
      crumb="<span class='crumb crumb--current' aria-current='step'>"+inner+"</span>";
    }else if(done){
      crumb="<button type='button' class='crumb crumb--done' onclick='"+CRUMB_NAV[i]+"'>"+inner+"</button>";
    }else{
      crumb="<span class='crumb crumb--future' aria-disabled='true'>"+inner+"</span>";
    }
    h+="<li class='crumb-item'>"+crumb
      +(i<CRUMBS.length-1?"<i class='icon icon--chevronright crumb-sep' aria-hidden='true'></i>":"")
      +"</li>";
  }
  ol.innerHTML=h;
}
// Breadcrumb click — jump back to a completed step. setBar only wires this
// onto stages already completed, so it can never skip the user forward.
function goCrumb(step){render(step);}

// ─── Navigation ───────────────────────────────────────────────────
function go(n){render(S.step+n);}

// From Products straight to Buying Model. The standalone Flex Credits step
// is retired — Flex inputs (Agentforce / Data 360) are now inline in the
// product cards, so Configure hands off directly to the commercial stage.
function goFromProds(){
  render(4);
}
// Back from Buying Model returns to the Configure (Products) step.
function goBackFromBuyModel(){
  render(2);
}
// Region chosen on Discover → currency the Sales Room inherits.
// Order matches GEOS: North America, Latin America, Europe, Middle East & Africa, Asia Pacific, ANZ.
var GEO_CURRENCY=["USD","MXN","EUR","USD","JPY","AUD"];
function selectedProductParam(){
  var parts=[];
  PRODS.forEach(function(p){
    var cfg=S.cfg[p.id];
    if(!cfg||!cfg.on) return;
    var seats=cfg.seats||1;
    var ei=(cfg.ei==null?1:cfg.ei);
    parts.push(p.id+":"+seats+":"+ei);
  });
  return parts.join(",");
}
// Same-window handoff into the Digital Sales Room. Skips naming the room
// and the Discovery prompt; the Sales Room reads products + currency from
// the query string.
function goConfigureEstimate(){
  var products=selectedProductParam();
  if(!products) return;
  var currency=(S.geo!==null&&GEO_CURRENCY[S.geo])||"USD";
  var problem=S._q||S.prbs.map(function(i){return PROBS[i][0];}).join(", ");
  var q="entry=pricing&t="+Date.now()
    +"&products="+encodeURIComponent(products)
    +"&currency="+encodeURIComponent(currency);
  if(problem) q+="&q="+encodeURIComponent(problem);
  var pages="/pages/alizee-thomas/Solution-pricing";
  var dest=location.pathname.indexOf(pages)===0
    ? pages+"/sales-room/index.html?"+q+"#/journey/from-pricing"
    : "/journey/from-pricing?"+q;
  window.location.assign(dest);
}
// Carry industry / size / region / goals across the solve ↔ estimator pages
// via the URL (no localStorage). Used by Continue, Back, and crumb clicks.
function flowQs(){
  var parts=[];
  if(S.prbs.length) parts.push("g="+S.prbs.join(","));
  if(S._q) parts.push("q="+encodeURIComponent(S._q));
  if(S.ind!==null) parts.push("ind="+S.ind);
  if(S.szi!==null) parts.push("szi="+S.szi);
  if(S.geo!==null) parts.push("geo="+S.geo);
  return parts.join("&");
}
function goToSolve(){
  var qs=flowQs();
  window.location.href="../solution/index.html"+(qs?"?"+qs:"");
}
function goBackToSolve(){ goToSolve(); }

var _booted=false;
function render(step){
  S.step=step;setBar();setWizardSub();
  // Step 1 was "Company Size + Geography"; it is now merged into the step-0
  // Discover screen (rIndustry). fns[1] aliases rIndustry as a safety net —
  // nothing navigates to step 1 anymore (Discover Continue jumps to step 2).
  var fns=[rIndustry,rIndustry,rProds,rFlex,rBuyModel,rAgreement,rEstimate];
  closeWhyPops();
  closeShareMenu();
  document.getElementById("sb").innerHTML=(fns[step]||rEstimate)();
  bindWhyUi();
  bindShareUi();
  if(step===3)setTimeout(calcBoth,50);   // Flex panel is step 3
  // On navigation (not initial load) bring the wizard card — including
  // its progress bar — back into view if the user had scrolled away.
  if(_booted){
    var card=document.querySelector(".est-wizard");
    if(card)card.scrollIntoView({behavior:"smooth",block:"nearest"});
  }
  _booted=true;
}

// ─── STEP 0: Discover — industry + company size + region (one step)─────────────────────────────────────────────
function pickInd(i){S.ind=i;render(0);}
function rIndustry(){
  var h="<div class='q'>What industry are you in?</div>"
    +"<div class='sub'>We tailor product recommendations and value drivers to your sector.</div>"
    +"<div class='g3'>";
  for(var i=0;i<INDS.length;i++){
    h+="<div class='tile tile--ind"+(S.ind===i?" on":"")+"' onclick='pickInd("+i+")'>"
      +"<span class='tic'>"+ICS[i]+"</span>"
      +"<div class='tnm'>"+INDS[i][0]+"</div>"
      +"</div>";
  }
  h+="</div>";

  // Q2 — Company size. Same divider + sub-heading (.q--sub) layout used
  // between Q2 and Q3 below, so all three questions stack identically.
  h+="<div class='sdiv'></div>"
    +"<div class='q q--sub'>How large is your company?</div>"
    +"<div class='sub'>Company size helps us recommend the right editions and pre-fill seat counts.</div>"
    +"<div class='g2'>";
  for(var k=0;k<SIZES.length;k++){
    h+="<div class='tile"+(S.szi===k?" on":"")+"' onclick='pickSz("+k+")'>"
      +"<div class='sz-r'>"+SIZES[k][0]+"</div>"
      +"<div class='sz-e'>employees</div>"
      +"<div class='sz-l'>"+SIZES[k][1]+"</div>"
      +"</div>";
  }
  h+="</div>";

  // Q3 — Primary business region.
  h+="<div class='sdiv'></div>"
    +"<div class='q q--sub'>Where is your primary business region?</div>"
    +"<div class='sub'>Geography informs data residency, local compliance requirements, and regional Salesforce availability.</div>"
    +"<div class='ggrid'>";
  for(var j=0;j<GEOS.length;j++){
    h+="<div class='gtile"+(S.geo===j?" on":"")+"' onclick='pickGeo("+j+")'>"
      +"<div class='gtile-body'>"
      +"<div class='gtile-nm'>"+GEOS[j][0]+"</div>"
      +"<div class='gtile-ds'>"+GEOS[j][1]+"</div>"
      +"</div>"
      +"</div>";
  }
  h+="</div>";

  // Single Continue for Your business — enabled once all three questions
  // are answered. Advances to the Solutions page (step 2 of the flow).
  h+="<div class='foot'>"
    +footPrimary(btnNext("goToSolve()","Continue",S.ind!==null&&S.szi!==null&&S.geo!==null))
    +"</div>";
  return h;
}

// ─── STEP 0 (cont.) — size + region pickers, re-render step 0 ─────────────────────────────
function pickSz(i){S.szi=i;render(0);}
function pickGeo(i){S.geo=i;render(0);}

// ─── STEP 2: Product Selection ────────────────────────────────────
function tgP(pi){
  var pid=PRODS[pi].id;
  if(!S.cfg[pid])S.cfg[pid]={on:false,ei:1,seats:ds()};
  S.cfg[pid].on=!S.cfg[pid].on;
  render(2);
}
// "All Salesforce products" disclosure toggle (collapsed by default).
// When COLLAPSING the list, also deselect any selected products that live in
// the (now hidden) All-products set — otherwise a hidden product would remain
// in the estimate while invisible. Deselecting also collapses that product's
// panel, since the panel only renders while the product is selected. Products
// in the always-visible Recommended list are never touched.
function tgAll(){
  if(S._allOpen){
    var recSet=recProdSet();
    PRODS.forEach(function(p,idx){
      if(!recSet[idx]&&S.cfg[p.id]&&S.cfg[p.id].on)S.cfg[p.id].on=false;
    });
  }
  S._allOpen=!S._allOpen;
  render(2);
}
function chE(pi,v){
  var pid=PRODS[pi].id;
  if(!S.cfg[pid])S.cfg[pid]={on:true,ei:1,seats:ds()};
  S.cfg[pid].ei=parseInt(v);render(2);
}
function chS(pi,v){
  var pid=PRODS[pi].id;
  if(!S.cfg[pid])S.cfg[pid]={on:true,ei:1,seats:ds()};
  S.cfg[pid].seats=Math.max(1,parseInt(v)||1);
  liveSum(pi);                       // update the card-header Monthly/Annual live
}
function chSC(pi,v){chS(pi,v);render(2);}

// ── Inline flex inputs (Agentforce + Data 360) ───────────────────
// The standalone Flex step is retired; its inputs now render inline inside
// the flex product cards. Numeric fields update the header summary live on
// `input` (keeps focus while typing) and normalise on `change`; dropdowns
// re-render on `change`. Everything still feeds the unchanged calcAF/calcD3
// pricing engine — only the input surface changed.
function setAfI(pi,v){var n=parseInt(v,10);if(isNaN(n))return;S.afI=Math.max(1,Math.min(500,n));liveSum(pi);}
function afINorm(pi){render(2);}                     // redraw clamped value in the field
function setAfC(v){S.afC=v||null;render(2);}
function setAfM(v){S.afM=v||null;render(2);}
function setD3P(pi,v){var n=parseInt(v,10);if(isNaN(n))return;n=Math.max(10000,Math.min(1000000,n));S.d3P=Math.max(1,Math.round(n/10000));liveSum(pi);}
function d3PNorm(pi){render(2);}
function setD3S(v){S.d3S=v;render(2);}
function setD3U(v){S.d3U=v;render(2);}
// Live-update ONE card's Monthly/Annual figures without a full re-render
// (preserves the numeric input's focus). render() runs on `change` after.
function liveSum(pi){
  var p=PRODS[pi];var cfg=S.cfg[p.id];if(!cfg)return;
  var pp=prodPrice(p,cfg);if(!pp)return;
  var el=document.getElementById("pp"+pi);
  if(el)el.textContent="$"+fmt(periodAmt(pp));
}
// Per-card Monthly/Annual price. Flex uses the unchanged engine (calcAF /
// calcD3); seat/org use list math. Returns null for "contact sales".
function prodPrice(p,cfg){
  if(p.tp==="seat"){var pr=(p.pr||[])[cfg.ei]||0;var mo=pr*(cfg.seats||ds());return{mo:mo,ann:mo*12};}
  if(p.tp==="org"){var pr2=(p.pr||[])[cfg.ei]||0;return pr2>0?{mo:pr2,ann:pr2*12}:null;}
  if(p.tp==="flex"){var e=p.id==="af"?calcAF():calcD3();return{mo:e.mo,ann:e.yr};}
  return null; // custom / contact-sales
}

// ── Product card (Configure step) ────────────────────────────────
// Header: icon · name + pricing-type badge · description; a Monthly/Annual
// summary joins the header once selected. Clicking the header selects the
// card and expands its own input panel — one product open at a time.
function opt(v,label,cur){return "<option value='"+v+"'"+(cur===v?" selected":"")+">"+label+"</option>";}
function pcRow(label,control){return "<div class='pc-row'><div class='pc-row-l'>"+label+"</div><div class='pc-row-c'>"+control+"</div></div>";}
function pcSum(pi,p,cfg){
  var pp=prodPrice(p,cfg);
  if(!pp)return "<div class='pc-sum pc-sum--cs'>Contact sales</div>";
  return "<div class='pc-sum'>"+priceStack(periodAmt(pp),"pp"+pi)+"</div>";
}
function flexCalcNote(){
  return "<div class='pc-flex-note'><p>The numbers are based on industry benchmarks. Please use <a class='learn-link' href='../calculator/index.html' target='_blank' rel='noopener'>FlexCreditCalculator</a> to personalize your estimation.</p></div>";
}
function openFlexCalculator(){
  window.location.href="../calculator/index.html";
}
function flexCalcCta(pid){
  var kind=pid==="d360"?"d360":"af";
  return "<div class='pc-flex-cta'><button type='button' class='sf-cta sf-cta--primary sf-cta--medium' onclick='event.stopPropagation();openFlexModal(\""+kind+"\",this)'>Calculate your Flex Credit</button></div>";
}
function pcPanel(pi,p,cfg){
  if(p.tp==="custom")return "<div class='pc-cfg'><div class='cfg-cs'>"+(p.note||"")+"</div></div>";
  var r="";
  if(p.tp==="seat"){
    r+=pcRow("Seats","<input class='si' type='number' min='1' value='"+(cfg.seats||ds())+"' oninput='chS("+pi+",this.value)' onchange='chSC("+pi+",this.value)'>");
    var eo="";for(var i=0;i<p.eds.length;i++)eo+=opt(i,p.eds[i],cfg.ei);
    r+=pcRow("Edition","<select class='ss' onchange='chE("+pi+",this.value)'>"+eo+"</select>");
  } else if(p.tp==="org"){
    var oo="";for(var j=0;j<p.eds.length;j++)oo+=opt(j,p.eds[j],cfg.ei);
    r+=pcRow("Plan","<select class='ss' onchange='chE("+pi+",this.value)'>"+oo+"</select>");
  } else if(p.id==="af"||p.id==="d360"){
    r+=flexCalcCta(p.id);
  }
  return "<div class='pc-cfg'>"+r+"</div>";
}
function pCard(pi,isRec){
  var p=PRODS[pi];var pid=p.id;
  var cfg=S.cfg[pid]||(S.cfg[pid]={on:false,ei:1,seats:ds()});
  var on=cfg.on;
  var h="<div class='pc"+(on?" on":"")+"'>";
  h+="<div class='pc-h' onclick='tgP("+pi+")'>"
    +"<div class='pc-i'>"+p.ic+"</div>"
    +"<div class='pc-hb'><div class='pc-nm'>"+p.nm+"</div><div class='pc-ds'>"+p.ds+"</div>"+whyRecHtml(p,isRec)+learnMore(pid,p.nm,true)
    +"</div>"
    +(on?pcSum(pi,p,cfg):"")
    +"<label class='pc-check' onclick='event.stopPropagation()'>"
    +"<input type='checkbox'"+(on?" checked":"")+" aria-label='Select "+escWhy(p.nm)+"' onclick='event.stopPropagation()' onchange='tgP("+pi+")'>"
    +"</label>"
    +"</div>";
  if(on)h+=pcPanel(pi,p,cfg);
  h+="</div>";
  return h;
}

// Which PRODS indices are "recommended" (always visible) vs. "other" (inside
// the collapsible All-products list). Shared by rProds and tgAll so the two
// can't disagree about which products make up the hidden set.
function recProdSet(){
  var recSet={};
  S.prbs.forEach(function(pi){
    PRODS.forEach(function(p,idx){if(p.rc&&p.rc.indexOf(pi)>=0)recSet[idx]=true;});
  });
  return recSet;
}
function rProds(){
  var recSet=recProdSet();
  var rec=[],other=[];
  PRODS.forEach(function(p,idx){if(recSet[idx])rec.push(idx);else other.push(idx);});
  var anySelected=PRODS.some(function(p){return S.cfg[p.id]&&S.cfg[p.id].on;});
  var ready=anySelected;

  // Visible carry-forward: chips echoing the goals chosen upstream.
  var goalHtml="";
  if(S.prbs.length){
    goalHtml="<div class='goalbar'><span class='goalbar-lbl'>Based on your goals</span>"
      +S.prbs.map(function(i){return "<span class='goalchip'>"+PROBS[i][0]+"</span>";}).join("")
      +"</div>";
  }

  return "<div class='cfg-wrap'>"
    +"<div class='q'>Select your products</div>"
    +"<div class='sub'>Recommended products are highlighted from the goals you selected. Add any additional products. Seat counts are pre-filled from your company size &mdash; adjust as needed.</div>"
    +goalHtml
    +periodToggleHtml()
    +(rec.length?"<div class='slbl'>Recommended Products</div><div class='prod-list'>"+rec.map(function(pi){return pCard(pi,true);}).join("")+"</div>":"")
    +"<div class='prod-acc"+(S._allOpen?" open":"")+"'>"
    +"<button type='button' class='prod-acc-hd' aria-expanded='"+(S._allOpen?"true":"false")+"' aria-controls='all-prod-list' onclick='tgAll()'>"
    +"<span class='prod-acc-lbl'>"+(S._allOpen?"Hide all products":"Show all products")+"</span>"
    +"<i class='icon icon--chevrondown prod-acc-ch' aria-hidden='true'></i>"
    +"</button>"
    +(S._allOpen?"<div class='slbl slbl--all'>All Products</div>":"")
    +"<div class='prod-list' id='all-prod-list'"+(S._allOpen?"":" hidden")+">"+other.map(function(pi){return pCard(pi,false);}).join("")+"</div>"
    +"</div>"
    +"</div>"
    +"<div class='foot'>"
    +btnBack("goToSolve()","Back to Solutions")
    +footPrimary(btnNext("goFromProds()","Continue",ready))
    +"</div>";
}

// ─── STEP 3 (RETIRED): Flex Credits estimator ────────────────────
// The standalone Flex step was folded into the product cards — its inputs
// now render inline via pcPanel(). swTab / pickOpt / afSlide / d3Slide /
// rFlex / calcBoth are no longer reached (kept for reference; prunable).
// calcAF / calcD3 REMAIN LIVE: the inline card inputs (prodPrice) and the
// final rEstimate() still call them, so the pricing engine is unchanged.
function swTab(t){
  ["af","d3"].forEach(function(x){
    var tb=document.getElementById("et-"+x);if(tb)tb.className="etab"+(x===t?" on":"");
    var ep=document.getElementById("ep-"+x);if(ep)ep.className="ep"+(x===t?" on":"");
  });
}
function pickOpt(g,v){
  document.querySelectorAll(".eopt[data-g='"+g+"']").forEach(function(e){e.className="eopt"+(e.dataset.v===v?" on":"");});
  if(g==="afc")S.afC=v;
  else if(g==="afm")S.afM=v;
  else if(g==="d3s")S.d3S=v;
  else if(g==="d3u")S.d3U=v;
  calcBoth();
}
function afSlide(v){S.afI=+v;document.getElementById("af-iv").textContent=v;calcBoth();}
function d3Slide(v){
  S.d3P=+v;
  var n=v*10000;
  document.getElementById("d3-pv").textContent=n>=1e6?(n/1e6).toFixed(1)+"M":Math.round(n/1000)+"K";
  calcBoth();
}
function calcAF(){
  var mo=S.afI*22;
  if(S.afM==="conv"){return{mo:mo*2,yr:mo*24,det:fmt(mo)+" convs/mo",note:"Per-conversation model. Best for external customer-facing bots."};}
  var mult={simple:3,standard:6,complex:14};
  var acts=mo*(mult[S.afC]||6);
  var cr=acts*20;var mc=Math.ceil(cr/100000)*500;
  return{mo:mc,yr:mc*12,det:fmt(cr)+" credits/mo",note:"Pre-purchase saves 20–30%. Free 100K credits available via Salesforce Foundations."};
}
function calcD3(){
  var p=S.d3P*10000;
  var sm={few:1.2,medium:2,many:3.5}[S.d3S]||1.5;
  var um={segmentation:1.2,identity:1.8,ai:2.5}[S.d3U]||1.5;
  var cr=Math.ceil(p*sm*um);var t=gD3T(cr);
  var cc=Math.ceil(cr/100000)*t.rK;var ann=Math.max(60000,60000+cc);
  var sav=cr>500000?Math.ceil(cr/100000)*(500-t.rK):0;
  return{mo:Math.round(ann/12),yr:ann,det:fmt(cr)+" credits/yr",t:t,cr:cr,sav:sav,note:"Starter base $60K/yr. Volume discounts apply above 500K credits. Credits fungible with Agentforce."};
}
function calcBoth(){
  S.afEst=calcAF();S.d3Est=calcD3();
  var se=function(id,v){var e=document.getElementById(id);if(e)e.textContent=v;};
  var hAF=S.cfg["af"]&&S.cfg["af"].on;
  var hD3=S.cfg["d360"]&&S.cfg["d360"].on;
  if(hAF){se("af-mo","$"+fmt(S.afEst.mo));se("af-yr","$"+fmt(S.afEst.yr));se("af-det",S.afEst.det);se("af-note",S.afEst.note);}
  if(hD3){
    se("d3-mo","$"+fmt(S.d3Est.mo));se("d3-yr","$"+fmt(S.d3Est.yr));se("d3-det",S.d3Est.det);se("d3-note",S.d3Est.note);
    se("d3-sv",S.d3Est.sav>0?"Saving ~$"+fmt(S.d3Est.sav)+"/yr":"At list price");
    var tb=document.getElementById("d3-tb");
    if(tb){var rows="";D3T.forEach(function(row){var cur=row===S.d3Est.t;rows+="<tr"+(cur?" class='cur'":"")+">"+"<td>"+(cur?"&#9654; ":"")+row.lb+"</td><td>$"+row.rK+"/100K</td><td>"+row.d+"</td></tr>";});tb.innerHTML=rows;}
  }
}

function rFlex(){
  var hAF=S.cfg["af"]&&S.cfg["af"].on;
  var hD3=S.cfg["d360"]&&S.cfg["d360"].on;
  var aOn={simple:S.afC==="simple",standard:S.afC==="standard",complex:S.afC==="complex"};
  var mOn={flex:S.afM==="flex",conv:S.afM==="conv"};
  var sOn={few:S.d3S==="few",medium:S.d3S==="medium",many:S.d3S==="many"};
  var uOn={segmentation:S.d3U==="segmentation",identity:S.d3U==="identity",ai:S.d3U==="ai"};

  var h="<div class='q'>Estimate your Flex Credits</div>"
    +"<div class='sub'>Flex Credits are fungible across Agentforce and Data 360 &mdash; one shared pool. Volume discounts apply on Data 360.</div>"
    +"<div class='flex-bridge'>"
    +"<div class='flex-bridge-ico'>&#9889;</div>"
    +"<div class='flex-bridge-txt'><div class='flex-bridge-ttl'>Configure your usage &mdash; then choose how to buy</div>"
    +"Use the sliders below to estimate your annual Flex Credits spend. Once done, you'll select your commercial structure and agreement type.</div>"
    +"</div>"
    +"<div class='est'>"
    +"<div class='est-t'>&#9889; Flex Credits Estimator</div>"
    +"<div class='est-s'>$500 per 100,000 credits &middot; $0.10 per Agentforce action &middot; Volume discounts on Data 360</div>"
    +"<div class='etabs'>";

  // Show tabs only for selected products
  if(hAF)h+="<div class='etab "+(hAF&&!hD3||S._ftab==="af"?"on":"")+"' id='et-af' onclick='swTab(\"af\")'>&#129302; Agentforce</div>";
  if(hD3)h+="<div class='etab "+(hD3&&!hAF||S._ftab==="d3"?"on":"")+"' id='et-d3' onclick='swTab(\"d3\")'>&#128202; Data 360</div>";
  h+="</div>";

  // Agentforce panel
  h+="<div class='ep "+(hAF?"on":"")+"' id='ep-af'>"
    +"<div class='er'><div class='el'>Daily interactions <span class='el-v' id='af-iv'>"+S.afI+"</span></div>"
    +"<input type='range' class='esl' min='1' max='500' value='"+S.afI+"' oninput='afSlide(this.value)'></div>"
    +"<div class='er'><div class='el'>Agent complexity</div><div class='eopts'>"
    +"<div class='eopt"+(aOn.simple?" on":"")+"' data-g='afc' data-v='simple' onclick='pickOpt(\"afc\",\"simple\")'>Simple (3 actions)</div>"
    +"<div class='eopt"+(aOn.standard?" on":"")+"' data-g='afc' data-v='standard' onclick='pickOpt(\"afc\",\"standard\")'>Standard (6)</div>"
    +"<div class='eopt"+(aOn.complex?" on":"")+"' data-g='afc' data-v='complex' onclick='pickOpt(\"afc\",\"complex\")'>Complex (14)</div>"
    +"</div></div>"
    +"<div class='er'><div class='el'>Pricing model</div><div class='eopts'>"
    +"<div class='eopt"+(mOn.flex?" on":"")+"' data-g='afm' data-v='flex' onclick='pickOpt(\"afm\",\"flex\")'>Flex Credits ($0.10/action)</div>"
    +"<div class='eopt"+(mOn.conv?" on":"")+"' data-g='afm' data-v='conv' onclick='pickOpt(\"afm\",\"conv\")'>Per Conversation ($2.00)</div>"
    +"</div></div>"
    +"<div class='eres'><div class='rg4'>"
    +"<div><div class='rk'>Monthly est.</div><div class='rv' id='af-mo'>&mdash;</div><div class='rs' id='af-det'>&mdash;</div></div>"
    +"<div><div class='rk'>Annual est.</div><div class='rv' id='af-yr'>&mdash;</div></div>"
    +"<div><div class='rk'>Model</div><div class='rv' style='font-size:var(--font-size-12, .75rem);margin-top:2px'>Flex Credits</div></div>"
    +"<div><div class='rk'>Free tier</div><div class='rv' style='font-size:var(--font-size-12, .75rem);margin-top:2px'>100K via Foundations</div></div>"
    +"</div><div class='rnote' id='af-note'>&mdash;</div></div>"
    +"</div>";

  // Data 360 panel
  h+="<div class='ep "+(hD3&&!hAF?"on":"")+"' id='ep-d3'>"
    +"<div class='er'><div class='el'>Customer profiles <span class='el-v' id='d3-pv'>"+fmtK(S.d3P*10000)+"</span></div>"
    +"<input type='range' class='esl' min='1' max='100' value='"+S.d3P+"' oninput='d3Slide(this.value)'></div>"
    +"<div class='er'><div class='el'>Data sources</div><div class='eopts'>"
    +"<div class='eopt"+(sOn.few?" on":"")+"' data-g='d3s' data-v='few' onclick='pickOpt(\"d3s\",\"few\")'>1–5 sources</div>"
    +"<div class='eopt"+(sOn.medium?" on":"")+"' data-g='d3s' data-v='medium' onclick='pickOpt(\"d3s\",\"medium\")'>5–20 sources</div>"
    +"<div class='eopt"+(sOn.many?" on":"")+"' data-g='d3s' data-v='many' onclick='pickOpt(\"d3s\",\"many\")'>20+ sources</div>"
    +"</div></div>"
    +"<div class='er'><div class='el'>Primary use case</div><div class='eopts'>"
    +"<div class='eopt"+(uOn.segmentation?" on":"")+"' data-g='d3u' data-v='segmentation' onclick='pickOpt(\"d3u\",\"segmentation\")'>Segmentation</div>"
    +"<div class='eopt"+(uOn.identity?" on":"")+"' data-g='d3u' data-v='identity' onclick='pickOpt(\"d3u\",\"identity\")'>Identity Resolution</div>"
    +"<div class='eopt"+(uOn.ai?" on":"")+"' data-g='d3u' data-v='ai' onclick='pickOpt(\"d3u\",\"ai\")'>AI Grounding</div>"
    +"</div></div>"
    +"<div class='eres'><div class='rg4'>"
    +"<div><div class='rk'>Monthly est.</div><div class='rv' id='d3-mo'>&mdash;</div><div class='rs' id='d3-det'>&mdash;</div></div>"
    +"<div><div class='rk'>Annual est.</div><div class='rv' id='d3-yr'>&mdash;</div></div>"
    +"<div><div class='rk'>Starter base</div><div class='rv' style='font-size:var(--font-size-12, .75rem);margin-top:2px'>$60K/yr</div></div>"
    +"<div><div class='rk'>Vol saving</div><div class='rv' style='font-size:var(--font-size-12, .75rem);margin-top:2px;color:var(--color-teal-80,#04E1CB)' id='d3-sv'>&mdash;</div></div>"
    +"</div><div class='rnote' id='d3-note'>&mdash;</div>"
    +"<div style='margin-top:10px'>"
    +"<div style='font-size:9px;color:rgba(255,255,255,.3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px'>Data 360 Volume Discount Tiers (Indicative)</div>"
    +"<table class='vt'><thead><tr><th>Credits/yr</th><th>Rate</th><th>Discount</th></tr></thead><tbody id='d3-tb'></tbody></table>"
    +"</div></div></div>"
    +"</div>";

  h+="<div class='hint'>&#128216; <strong>Credit drawdown priority:</strong> PRE_COMMIT &rarr; PAYGO &rarr; PRE_PAID. One shared pool for Agentforce + Data 360.</div>"
    +"<div class='foot'>"
    +btnBack("render(2)","Back to Select products")
    +footPrimary(btnNext("render(4)","How would you like to buy?",true))
    +"</div>";
  return h;
}

// ─── STEP 4: How Would You Like To Buy ────────────────────────────
function pickBm(i){S.bm=i;render(4);}
function rBuyModel(){
  // The former "Your Flex Credits buying model…" intro card is removed; its two
  // sentences of context are relocated here as the description beneath the subhead
  // (copy preserved verbatim — not rewritten).
  var h="<div class='q'>How would you like to buy?</div>"
    +"<div class='sub'>Choose the commercial structure that fits your commitment level and budget.</div>"
    +"<div class='sub'>Select the structure that matches your confidence in usage volume. Pre-Purchase locks in the highest discount; PAYG offers maximum flexibility.</div>"
    +"<div class='bm-list'>";
  // Show only the first three buying models as a row of cards. BMS[3] (Bonus
  // Credits) stays in the data + pricing logic but is intentionally not rendered.
  for(var i=0;i<3;i++){
    var m=BMS[i];
    // Details (payment timing, discount, minimum commitment, and any caveat) open
    // in the shared why-eye / why-pop used on product cards. The info button
    // stops click propagation so opening it doesn't select the card.
    h+="<div class='bm"+(S.bm===i?" on":"")+"' onclick='pickBm("+i+")'>"
      +(m[1]?"<span class='tag "+m[1]+"'>"+m[2]+"</span>":"")
      +"<img class='bm-ico' src='../assets/buying-model-icons/"+BMICON[i]+"' alt='' aria-hidden='true'>"
      +"<div class='bm-nm'>"+m[0]
        +infoIconHtml(escWhy(m[0]),"data-bm-info='"+i+"'")
      +"</div>"
      +"<div class='bm-ds'>"+m[3]+"</div>"
      +"</div>";
  }
  h+="</div><div class='foot'>"
    +btnBack("goBackFromBuyModel()","Back to Select products")
    +footPrimary(btnNext("render(6)","See Estimates",S.bm!==null))
    +"</div>";
  return h;
}

// ─── STEP 5: Agreement Type ───────────────────────────────────────
function pickAg(i){S.ag=i;render(5);}
function rAgreement(){
  var h="<div class='q'>Select your agreement type</div>"
    +"<div class='sub'>The agreement type defines the legal and commercial structure of your Salesforce contract.</div>"
    +"<div class='hint'>&#128161; Transfers available on SELA only. SELA supports all buying models from Spring 2027. AELA contracted directly &mdash; reseller SKUs cannot be mixed in post-hoc.</div>"
    +"<div class='g2c'>";
  for(var i=0;i<AGR.length;i++){
    var a=AGR[i];
    // Badge colour keys → DMS tokens.
    var badgeBg=a[3]==="blue"?"var(--color-fill-info,#EAF5FE)":a[3]==="purple"?"var(--color-purple-95,#F6F2FB)":"";
    var badgeFg=a[3]==="blue"?"var(--color-fill-accent,#066AFE)":a[3]==="purple"?"var(--color-purple-40,#7526E3)":"";
    h+="<div class='ag"+(S.ag===i?" on":"")+"' onclick='pickAg("+i+")'>"
      +(a[2]?"<div class='ag-b' style='background:"+badgeBg+";color:"+badgeFg+";border:.5px solid "+badgeFg+"'>"+a[2]+"</div>":"<div style='height:20px'></div>")
      +"<div class='ag-nm'>"+a[1]+" "+a[0]+"</div>"
      +"<div class='ag-ds' style='margin-top:5px'>"+a[4]+"</div>"
      +"</div>";
  }
  h+="</div><div class='foot'>"
    +btnBack("go(-1)","Back to Purchase options")
    +footPrimary(btnNext("go(1)","View full estimate",S.ag!==null))
    +"</div>";
  return h;
}

// ─── STEP 6: Full Estimate ────────────────────────────────────────
function rEstimate(){
  var af=S.afEst||calcAF();var d3=S.d3Est||calcD3();S.afEst=af;S.d3Est=d3;
  var sAnn=0;var sMo=0;var sl=[];
  PRODS.forEach(function(p){
    var cfg=S.cfg[p.id];if(!cfg||!cfg.on)return;
    if(p.tp==="seat"){
      var pr=(p.pr||[])[cfg.ei]||0;var seats=cfg.seats||ds();
      var mo=pr*seats;var ann=mo*12;sAnn+=ann;sMo+=mo;
      sl.push({id:p.id,nm:p.nm,ic:p.ic,ed:p.eds[cfg.ei]||"",seats:seats,prps:pr,mo:mo,ann:ann,k:"seat"});
    } else if(p.tp==="org"){
      var pr2=(p.pr||[])[cfg.ei]||0;var ann2=pr2*12;sAnn+=ann2;sMo+=pr2;
      sl.push({id:p.id,nm:p.nm,ic:p.ic,ed:p.eds[cfg.ei]||"",seats:null,prps:pr2,mo:pr2,ann:ann2,k:pr2>0?"org":"cs"});
    } else if(p.tp==="custom"){
      sl.push({id:p.id,nm:p.nm,ic:p.ic,ed:"Revenue share model",seats:null,prps:0,mo:0,ann:0,k:"cs"});
    }
  });
  var hAF=S.cfg["af"]&&S.cfg["af"].on;var hD3=S.cfg["d360"]&&S.cfg["d360"].on;
  var afA=hAF?af.yr:0;var d3A=hD3?d3.yr:0;
  var afMo=hAF?af.mo:0;var d3Mo=hD3?d3.mo:0;
  var fAnn=afA+d3A;var totAnn=sAnn+fAnn;var totMo=sMo+afMo+d3Mo;
  var totShow=isAnnual()?totAnn:totMo;
  var d3sv=hD3&&d3.sav>0?d3.sav:0;
  var bmNm=S.bm!==null?BMS[S.bm][0]:"";var agNm=S.ag!==null?AGR[S.ag][0]:"";
  var iNm=S.ind!==null?INDS[S.ind][0]:"";var sNm=S.szi!==null?SIZES[S.szi][0]+" employees":"";
  var gNm=S.geo!==null?GEOS[S.geo][0]:"";

  function sr(l){
    // Product entry restyled to mirror the Configure product card: 48px icon
    // on the left, 20px product name, 12px summary line below. Icon pulled out
    // of .srow-n into the .srow-l group so it can size to 48px (was 18px inline).
    var det=(l.k==="seat")?(l.seats+" seats &times; $"+l.prps+"/u/mo &middot; "+l.ed):l.ed;
    var left="<div class='srow-l'>"+l.ic+"<div><div class='srow-n'>"+l.nm+"</div><div class='srow-d'>"+det+"</div>"+learnMore(l.id,l.nm,false)+"</div></div>";
    if(l.k==="cs"||!(l.ann>0||l.mo>0))return "<div class='srow'>"+left+"<div class='srow-p' style='color:var(--color-on-surface-4,#747474);font-weight:var(--font-weight-regular, 400)'>Contact sales</div></div>";
    return "<div class='srow'>"+left+priceStack(isAnnual()?l.ann:l.mo,null,false)+"</div>";
  }

  // Selected solution(s) from the start of the flow — the goals carried from the
  // solve screen (S.prbs → PROBS) — shown as no-background pill(s) under the title.
  var solHtml="";
  if(S.prbs.length){
    solHtml="<div class='est-sol'>"
      +S.prbs.map(function(gi){return "<span class='est-sol-pill'>"+PROBS[gi][0]+"</span>";}).join("")
      +"</div>";
  }
  // Meta line normalised: every segment (industry · region · size · buying model ·
  // agreement) renders in the plain .sub style — matching the company-size field —
  // with no bold or accent-colour emphasis on any single item.
  var h="<div class='q'>Your Salesforce estimate</div>"
    +solHtml
    +"<div class='sub'>"
    +iNm
    +(gNm?" &middot; "+gNm:"")
    +(sNm?" &middot; "+sNm:"")
    +(bmNm?" &middot; "+bmNm:"")
    +(agNm?" &middot; "+agNm.split("—")[0].trim():"")
    +"</div>"
    +periodToggleHtml(true);

  // One product list. Seat, license, and Flex Credit rows share the same
  // two columns already used by .srow: product on the left, annual price
  // with monthly underneath on the right. Quantity and credit usage stay
  // in each row's detail line, so the table does not grow a third column.
  var rows=sl.map(sr);
  if(hAF)rows.push("<div class='srow'><div class='srow-l'><img class='prod-ico' src='../assets/product-icons/agentforce.svg' alt='' aria-hidden='true'><div><div class='srow-n'>Agentforce</div><div class='srow-d'>"+af.det+" &middot; "+S.afI+" daily interactions</div>"+learnMore("af","Agentforce",false)+"</div></div>"+priceStack(isAnnual()?afA:afMo,null,true)+"</div>");
  if(hD3)rows.push("<div class='srow'><div class='srow-l'><img class='prod-ico' src='../assets/product-icons/data-cloud.svg' alt='' aria-hidden='true'><div><div class='srow-n'>Data 360</div><div class='srow-d'>"+d3.det+" &middot; "+fmtK(S.d3P*10000)+" profiles &middot; "+d3.t.lb+(d3sv>0?" <span style='color:var(--color-on-surface-success,#2E844A);font-weight:var(--font-weight-bold, 700)'>&#8595; Saving ~$"+fmt(d3sv)+"/yr vs list</span>":"")+"</div>"+learnMore("d360","Data 360",false)+"</div></div>"+priceStack(isAnnual()?d3A:d3Mo,null,true)+"</div>");
  if(!rows.length){
    h+="<div class='warn'>No products selected yet. Go back to configure your bundle.</div>";
  } else {
    h+="<div class='sbox'>"
      +"<div class='shdr'><div><div class='shdr-nm'>Your Salesforce products</div><div class='shdr-sub'>Salesforce List Pricing</div></div></div>";
    if(totShow>0){
      h+="<div class='gt'><div><div class='gt-l'>Total estimated "+(isAnnual()?"annual":"monthly")+" investment</div><div class='gt-s'>List pricing &middot; "+bmNm+" &middot; Discounts not yet applied"+(d3sv>0?" &middot; incl. ~$"+fmt(d3sv)+" D360 volume saving":"")+"</div></div>"
        +"<div class='gt-figs'>"+priceStack(totShow,null,true)+"</div></div>";
    }
    h+=rows.join("")+"</div>";
  }
  var anyOn=PRODS.some(function(p){return S.cfg[p.id]&&S.cfg[p.id].on;});
  h+="<div class='foot'>"
    +btnBack("render(4)","Back to Purchase options")
    +footPrimary(shareCtaHtml(anyOn),true,true)
    +"</div>"
    +"<div class='legal'>Powered by Agentforce &middot; research-informed indicative pricing<br>Indicative estimate at list pricing. Actual cost will vary based on negotiated discounts. Validate with your Salesforce Account Executive before budgeting.</div>";
  return h;
}

// ─── "Why recommended" popovers ───────────────────────────────────
// Mounted on the estimator region so they inherit that region's theme,
// and so the product card's overflow:hidden does not clip them.
var whyUi={eye:null,more:null,pinEye:false,pinMore:false,bound:false};

function whyClosest(node,sel){
  return node&&node.closest?node.closest(sel):null;
}
function whyInside(el,node){
  if(!el||!node) return false;
  return el===node||el.contains(node);
}
function setWhyExp(btn,open){
  if(!btn) return;
  btn.setAttribute("aria-expanded",open?"true":"false");
  btn.classList.toggle("is-active",!!open);
}
function whyGap(){
  var raw=getComputedStyle(document.documentElement).getPropertyValue("--space-interactive-xs");
  var n=parseFloat(raw);
  return isNaN(n)?0:n;
}
function ensureWhyPops(){
  if(document.getElementById("why-pop")) return;
  var pop=document.createElement("div");
  pop.id="why-pop";
  pop.className="why-pop";
  pop.setAttribute("role","dialog");
  pop.setAttribute("aria-labelledby","why-pop-title");
  pop.tabIndex=-1;
  pop.hidden=true;
  pop.innerHTML="<p class='why-pop__title' id='why-pop-title'>Why we recommended this</p>"
    +"<p class='why-pop__kicker'>What it does for your business</p>"
    +"<div id='why-pop-body'></div>";
  var more=document.createElement("div");
  more.id="why-more-pop";
  more.className="why-pop why-pop--more";
  more.setAttribute("role","dialog");
  more.setAttribute("aria-label","More solutions");
  more.tabIndex=-1;
  more.hidden=true;
  more.innerHTML="<div id='why-more-body'></div>";
  var host=document.querySelector(".sf-blade-region")||document.body;
  host.appendChild(pop);
  host.appendChild(more);
}
function bmInfoBody(m){
  var rows="<li class='why-pop__row'><span class='why-pop__name'>Payment</span><span class='why-pop__benefit'>"+escWhy(m[4])+"</span></li>"
    +"<li class='why-pop__row'><span class='why-pop__name'>Discount</span><span class='why-pop__benefit'>"+escWhy(m[5])+"</span></li>";
  if(m[6]) rows+="<li class='why-pop__row'><span class='why-pop__name'>Minimum commitment</span><span class='why-pop__benefit'>"+escWhy(m[6])+"</span></li>";
  if(m[7]) rows+="<li class='why-pop__row'><span class='why-pop__benefit'>"+escWhy(m[7])+"</span></li>";
  return "<ul class='why-pop__rows'>"+rows+"</ul>";
}
function whyBody(reasons){
  if(reasons.length===1){
    return "<p class='why-pop__copy'>"+escWhy(reasons[0].businessBenefit)+"</p>";
  }
  var rows="";
  for(var i=0;i<reasons.length;i++){
    rows+="<li class='why-pop__row'><span class='why-pop__name'>"+escWhy(reasons[i].solutionName)+"</span><span class='why-pop__benefit'>"+escWhy(reasons[i].businessBenefit)+"</span></li>";
  }
  return "<ul class='why-pop__rows'>"+rows+"</ul>";
}
function moreBody(reasons){
  var rest=reasons.slice(2);
  var items="";
  for(var i=0;i<rest.length;i++) items+="<li>"+escWhy(rest[i].solutionName)+"</li>";
  return "<ul class='why-more__list'>"+items+"</ul>";
}
function placeWhy(pop,anchor){
  pop.hidden=false;
  pop.classList.remove("why-pop--above","why-pop--below");
  pop.style.top="0px";
  pop.style.left="0px";
  var gap=whyGap();
  var a=anchor.getBoundingClientRect();
  var w=pop.offsetWidth;
  var h=pop.offsetHeight;
  var left=a.left;
  var maxLeft=window.innerWidth-w-gap;
  if(left>maxLeft) left=Math.max(gap,maxLeft);
  if(left<gap) left=gap;
  var top=a.bottom+gap;
  var above=false;
  if(top+h>window.innerHeight-gap){
    above=true;
    top=Math.max(gap,a.top-gap-h);
  }
  pop.classList.add(above?"why-pop--above":"why-pop--below");
  pop.style.left=left+"px";
  pop.style.top=top+"px";
}
function closeWhy(){
  var pop=document.getElementById("why-pop");
  if(pop) pop.hidden=true;
  if(whyUi.eye){
    setWhyExp(whyUi.eye,false);
    whyUi.eye.removeAttribute("aria-describedby");
  }
  whyUi.eye=null;
  whyUi.pinEye=false;
}
function closeMore(){
  var pop=document.getElementById("why-more-pop");
  if(pop) pop.hidden=true;
  if(whyUi.more) setWhyExp(whyUi.more,false);
  whyUi.more=null;
  whyUi.pinMore=false;
}
function closeWhyPops(){ closeWhy(); closeMore(); }
function showWhy(btn){
  closeMore();
  var bmIdx=btn.getAttribute("data-bm-info");
  var bodyHtml;
  var titleText="Why we recommended this";
  var hideKicker=false;
  if(bmIdx!==null&&bmIdx!==""){
    var m=BMS[+bmIdx];
    if(!m){ closeWhy(); return; }
    titleText=m[0];
    hideKicker=true;
    bodyHtml=bmInfoBody(m);
  } else {
    var p=prodById(btn.getAttribute("data-why-eye"));
    var reasons=activeReasons(p);
    if(!reasons.length){ closeWhy(); return; }
    bodyHtml=whyBody(reasons);
  }
  ensureWhyPops();
  if(whyUi.eye&&whyUi.eye!==btn){
    setWhyExp(whyUi.eye,false);
    whyUi.eye.removeAttribute("aria-describedby");
    whyUi.pinEye=false;
  }
  whyUi.eye=btn;
  var title=document.getElementById("why-pop-title");
  var kicker=document.querySelector("#why-pop .why-pop__kicker");
  if(title) title.textContent=titleText;
  if(kicker) kicker.hidden=hideKicker;
  document.getElementById("why-pop-body").innerHTML=bodyHtml;
  btn.setAttribute("aria-describedby","why-pop-body");
  setWhyExp(btn,true);
  placeWhy(document.getElementById("why-pop"),btn);
}
function showMore(btn){
  closeWhy();
  var p=prodById(btn.getAttribute("data-why-more"));
  var reasons=activeReasons(p);
  if(reasons.length<=2){ closeMore(); return; }
  ensureWhyPops();
  if(whyUi.more&&whyUi.more!==btn){
    setWhyExp(whyUi.more,false);
    whyUi.pinMore=false;
  }
  whyUi.more=btn;
  document.getElementById("why-more-body").innerHTML=moreBody(reasons);
  setWhyExp(btn,true);
  placeWhy(document.getElementById("why-more-pop"),btn);
}
function focusWhyBtn(btn){
  if(!btn) return;
  whyUi.suppress=true;
  btn.focus();
  whyUi.suppress=false;
}
function onEyeClick(btn){
  if(whyUi.pinEye&&whyUi.eye===btn){
    closeWhy();
    focusWhyBtn(btn);
    return;
  }
  closeMore();
  showWhy(btn);
  whyUi.pinEye=true;
  var pop=document.getElementById("why-pop");
  if(pop) pop.focus();
}
function onMoreClick(btn){
  if(whyUi.pinMore&&whyUi.more===btn){
    closeMore();
    focusWhyBtn(btn);
    return;
  }
  closeWhy();
  showMore(btn);
  whyUi.pinMore=true;
  var pop=document.getElementById("why-more-pop");
  if(pop) pop.focus();
}
function whyStillOpen(pop,btn,pinned){
  if(pinned) return;
  if(pop&&!pop.hidden&&pop.matches(":hover")) return;
  if(btn&&btn.matches(":hover")) return;
  if(pop&&document.activeElement&&pop.contains(document.activeElement)) return;
  if(btn&&document.activeElement===btn) return;
  if(pop&&pop.id==="why-pop") closeWhy();
  else closeMore();
}
function passWhyClick(e, pop){
  e.preventDefault();
  e.stopPropagation();
  var x=e.clientX, y=e.clientY;
  pop.style.pointerEvents="none";
  var under=document.elementFromPoint(x, y);
  pop.style.pointerEvents="";
  closeWhyPops();
  if(under) under.click();
}
function bindWhyUi(){
  if(whyUi.bound) return;
  whyUi.bound=true;
  ensureWhyPops();
  document.addEventListener("click",function(e){
    var eye=whyClosest(e.target,".why-eye");
    var more=whyClosest(e.target,".why-chip--more");
    var inPop=whyClosest(e.target,"#why-pop");
    var inMore=whyClosest(e.target,"#why-more-pop");
    if(eye){ e.preventDefault(); e.stopPropagation(); onEyeClick(eye); return; }
    if(more){ e.preventDefault(); e.stopPropagation(); onMoreClick(more); return; }
    if(inPop&&!whyUi.pinEye){ passWhyClick(e, inPop); return; }
    if(inMore&&!whyUi.pinMore){ passWhyClick(e, inMore); return; }
    if(inPop||inMore) return;
    closeWhyPops();
  },true);
  document.addEventListener("mouseover",function(e){
    var eye=whyClosest(e.target,".why-eye");
    if(eye&&!eye.contains(e.relatedTarget)) showWhy(eye);
    var more=whyClosest(e.target,".why-chip--more");
    if(more&&!more.contains(e.relatedTarget)) showMore(more);
  },true);
  document.addEventListener("mouseout",function(e){
    var eye=whyClosest(e.target,".why-eye");
    if(eye&&eye===whyUi.eye&&!whyInside(eye,e.relatedTarget)){
      var pop=document.getElementById("why-pop");
      if(!whyInside(pop,e.relatedTarget)) whyStillOpen(pop,eye,whyUi.pinEye);
    }
    var more=whyClosest(e.target,".why-chip--more");
    if(more&&more===whyUi.more&&!whyInside(more,e.relatedTarget)){
      var mp=document.getElementById("why-more-pop");
      if(!whyInside(mp,e.relatedTarget)) whyStillOpen(mp,more,whyUi.pinMore);
    }
    var popEl=whyClosest(e.target,"#why-pop");
    if(popEl&&!whyInside(popEl,e.relatedTarget)) whyStillOpen(popEl,whyUi.eye,whyUi.pinEye);
    var moreEl=whyClosest(e.target,"#why-more-pop");
    if(moreEl&&!whyInside(moreEl,e.relatedTarget)) whyStillOpen(moreEl,whyUi.more,whyUi.pinMore);
  },true);
  document.addEventListener("focusin",function(e){
    if(whyUi.suppress) return;
    var eye=whyClosest(e.target,".why-eye");
    if(eye){ showWhy(eye); return; }
    var more=whyClosest(e.target,".why-chip--more");
    if(more){ showMore(more); return; }
    if(whyClosest(e.target,"#why-pop")||whyClosest(e.target,"#why-more-pop")) return;
    if(!whyUi.pinEye) closeWhy();
    if(!whyUi.pinMore) closeMore();
  });
  document.addEventListener("keydown",function(e){
    var pop=document.getElementById("why-pop");
    var morePop=document.getElementById("why-more-pop");
    if(e.key==="Escape"){
      if(morePop&&!morePop.hidden){
        var mb=whyUi.more; closeMore(); focusWhyBtn(mb); e.preventDefault(); return;
      }
      if(pop&&!pop.hidden){
        var eb=whyUi.eye; closeWhy(); focusWhyBtn(eb); e.preventDefault();
      }
      return;
    }
    if(e.key!=="Tab") return;
    if(!e.shiftKey&&whyUi.eye&&document.activeElement===whyUi.eye&&pop&&!pop.hidden){
      pop.focus(); e.preventDefault(); return;
    }
    if(!e.shiftKey&&whyUi.more&&document.activeElement===whyUi.more&&morePop&&!morePop.hidden){
      morePop.focus(); e.preventDefault(); return;
    }
    if(e.shiftKey&&pop&&document.activeElement===pop&&whyUi.eye){
      whyUi.eye.focus(); e.preventDefault(); return;
    }
    if(e.shiftKey&&morePop&&document.activeElement===morePop&&whyUi.more){
      whyUi.more.focus(); e.preventDefault();
    }
  });
  window.addEventListener("resize",syncWhyPos);
  window.addEventListener("scroll",syncWhyPos,true);
}
function syncWhyPos(){
  var pop=document.getElementById("why-pop");
  if(pop&&!pop.hidden){
    if(whyUi.eye&&document.body.contains(whyUi.eye)) placeWhy(pop,whyUi.eye);
    else closeWhy();
  }
  var more=document.getElementById("why-more-pop");
  if(more&&!more.hidden){
    if(whyUi.more&&document.body.contains(whyUi.more)) placeWhy(more,whyUi.more);
    else closeMore();
  }
}

// ─── Share menu + confirmation overlays ───────────────────────────
var shareUi={bound:false,open:false};
function closeShareMenu(){
  var btn=document.getElementById("share-cta");
  var menu=document.getElementById("share-menu");
  if(btn) btn.setAttribute("aria-expanded","false");
  if(menu) menu.hidden=true;
  shareUi.open=false;
}
function toggleShareMenu(e){
  if(e){ e.preventDefault(); e.stopPropagation(); }
  var btn=document.getElementById("share-cta");
  var menu=document.getElementById("share-menu");
  if(!btn||!menu||btn.disabled) return;
  if(!menu.hidden){ closeShareMenu(); return; }
  menu.hidden=false;
  btn.setAttribute("aria-expanded","true");
  shareUi.open=true;
  var first=menu.querySelector("[role='menuitem']");
  if(first) first.focus();
}
function shareAction(kind){
  closeShareMenu();
  openDsrLogin(kind);
}
function downloadShareReport(btn){
  var already=btn&&btn.classList.contains("is-downloaded");
  console.log("TODO: download full report");
  if(btn){
    btn.classList.add("is-downloaded");
    btn.setAttribute("aria-label","Report downloaded");
  }
  if(!already&&typeof playConfetti==="function") playConfetti();
}
function closeShareConfirm(){
  var el=document.getElementById("share-confirm");
  if(el) el.hidden=true;
  document.body.classList.remove("share-confirm-open");
  var c=document.getElementById("share-confetti");
  if(c&&c.parentNode) c.parentNode.removeChild(c);
}
function showShareConfirm(kind){
  var el=document.getElementById("share-confirm");
  if(!el){
    el=document.createElement("div");
    el.id="share-confirm";
    el.className="share-confirm";
    el.hidden=true;
    document.body.appendChild(el);
  }
  var closeBtn="<button type='button' class='share-confirm__close' aria-label='Close' onclick='closeShareConfirm()'><i class='icon icon--close' aria-hidden='true'></i></button>";
  var success="<div class='share-confirm__success' aria-hidden='true'><i class='icon icon--check'></i></div>";
  var body;
  var title;
  var lead="";
  if(kind==="export"){
    title="Export full report";
    body="<p class='share-confirm__msg'>Your full report is ready to download.</p>"
      +"<button type='button' class='sf-cta sf-cta--primary sf-cta--medium share-download' onclick='downloadShareReport(this)'>"
      +"<span class='share-download__icon' aria-hidden='true'>"
      +"<i class='icon icon--download share-download__dl'></i>"
      +"<i class='icon icon--check share-download__ok'></i>"
      +"</span>Download report</button>";
  } else {
    title="Estimation saved";
    lead=success;
    body="<p class='share-confirm__msg'>Your estimation has been saved to your profile.</p>";
  }
  el.innerHTML="<div class='share-confirm__scrim' onclick='closeShareConfirm()'></div>"
    +"<div class='share-confirm__card' role='dialog' aria-modal='true' aria-labelledby='share-confirm-title'>"
    +closeBtn
    +lead
    +"<h2 class='share-confirm__title' id='share-confirm-title'>"+title+"</h2>"
    +body
    +"</div>";
  el.hidden=false;
  document.body.classList.add("share-confirm-open");
  var focusEl=el.querySelector(".share-confirm__close");
  if(focusEl) focusEl.focus();
  if(kind!=="export"&&typeof playConfetti==="function") playConfetti();
}
function bindShareUi(){
  if(shareUi.bound) return;
  shareUi.bound=true;
  document.addEventListener("click",function(e){
    if(!shareUi.open) return;
    if(e.target.closest&&e.target.closest(".share-wrap")) return;
    closeShareMenu();
  });
  document.addEventListener("keydown",function(e){
    var confirm=document.getElementById("share-confirm");
    if(e.key==="Escape"&&confirm&&!confirm.hidden){
      e.preventDefault(); closeShareConfirm(); return;
    }
    var menu=document.getElementById("share-menu");
    if(!menu||menu.hidden){
      if(e.key==="Escape"&&shareUi.open){ e.preventDefault(); closeShareMenu(); var b=document.getElementById("share-cta"); if(b) b.focus(); }
      return;
    }
    var items=[].slice.call(menu.querySelectorAll("[role='menuitem']"));
    if(!items.length) return;
    var i=items.indexOf(document.activeElement);
    if(e.key==="Escape"){ e.preventDefault(); closeShareMenu(); var btn=document.getElementById("share-cta"); if(btn) btn.focus(); }
    else if(e.key==="ArrowDown"){ e.preventDefault(); items[(i<0?0:(i+1)%items.length)].focus(); }
    else if(e.key==="ArrowUp"){ e.preventDefault(); items[(i<0?items.length-1:(i-1+items.length)%items.length)].focus(); }
    else if(e.key==="Home"){ e.preventDefault(); items[0].focus(); }
    else if(e.key==="End"){ e.preventDefault(); items[items.length-1].focus(); }
    else if(e.key==="Tab"){ closeShareMenu(); }
  });
}

// ─── Boot ─────────────────────────────────────────────────────────
// Restore company + goals from the URL. Default landing is Your business
// (step 0). Arriving from Solutions Continue (?g= without step=0) opens
// Products. ?step=0 forces Your business even when goals are present.
(function boot(){
  var start=0;
  try{
    var params=new URLSearchParams(location.search);
    var g=params.get("g");
    if(g){
      g.split(",").forEach(function(s){
        var i=parseInt(s,10);
        if(!isNaN(i)&&i>=0&&i<PROBS.length&&S.prbs.indexOf(i)<0)S.prbs.push(i);
      });
    }
    S._q=params.get("q")||"";
    function parseIdx(v,max){
      var n=parseInt(v,10);
      return (!isNaN(n)&&n>=0&&n<max)?n:null;
    }
    var ind=parseIdx(params.get("ind"),INDS.length); if(ind!==null) S.ind=ind;
    var szi=parseIdx(params.get("szi"),SIZES.length); if(szi!==null) S.szi=szi;
    var geo=parseIdx(params.get("geo"),GEOS.length); if(geo!==null) S.geo=geo;
    if(params.get("step")!=="0" && g) start=2;
  }catch(e){S._q="";}
  render(start);
})();
