// Shared "Choose an account" overlay. Any typed value is accepted.
// Next and an account choice call dsrLoginGo() when the page defines it,
// otherwise they continue with goConfigureEstimate().
// openDsrLogin(next) accepts "save" | "export" | "dsr" (default). After login:
// save → "Estimation saved"; export → report screen; dsr (and landing-page
// login) enter the Digital Sales Room.
var _dsrLoginNext="dsr";
function openDsrLogin(next){
  _dsrLoginNext=next||"dsr";
  var root=document.getElementById("dsr-login");
  if(!root){
    proceedDsrLogin();
    return;
  }
  root.hidden=false;
  document.body.classList.add("dsr-login-open");
  var input=document.getElementById("dsr-login-email");
  if(input) input.value="";
  syncDsrLogin();
  if(input) input.focus();
}
function closeDsrLogin(){
  var root=document.getElementById("dsr-login");
  if(root) root.hidden=true;
  document.body.classList.remove("dsr-login-open");
}
function syncDsrLogin(){
  var input=document.getElementById("dsr-login-email");
  var btn=document.getElementById("dsr-login-next");
  if(!input||!btn) return;
  var ok=input.value.length>0;
  btn.disabled=!ok;
  btn.classList.toggle("is-disabled",!ok);
  if(ok) btn.removeAttribute("aria-disabled");
  else btn.setAttribute("aria-disabled","true");
}
function proceedDsrLogin(){
  closeDsrLogin();
  var next=_dsrLoginNext||"dsr";
  _dsrLoginNext="dsr";
  if((next==="save"||next==="export")&&typeof showShareConfirm==="function"){
    showShareConfirm(next);
    return;
  }
  if(typeof dsrLoginGo==="function") dsrLoginGo();
  else if(typeof goConfigureEstimate==="function") goConfigureEstimate();
}
function submitDsrLogin(e){
  if(e) e.preventDefault();
  var input=document.getElementById("dsr-login-email");
  if(!input||!input.value.length) return false;
  proceedDsrLogin();
  return false;
}
function chooseDsrAccount(){
  proceedDsrLogin();
}
document.addEventListener("keydown",function(e){
  var root=document.getElementById("dsr-login");
  if(!root||root.hidden) return;
  if(e.key==="Escape"){ e.preventDefault(); closeDsrLogin(); }
});
