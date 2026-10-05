const $=id=>document.getElementById(id);
const canvas=$("canvas"); let selected=null;
const defaultColors={primary:"#4f46e5",accent:"#7c3aed",bg:"#ffffff",text:"#111827"};
const defaults={
hero:{content:"Bouw iets bijzonders",button:"Bekijk meer",link:"#",bg:"#eef2ff",color:"#111827"},
text:{content:"Dit is een professioneel tekstblok. Pas deze tekst rechts aan.",bg:"#ffffff",color:"#111827"},
image:{content:"",image:"https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",bg:"#ffffff",color:"#111827"},
button:{content:"",button:"Neem contact op",link:"#",bg:"#ffffff",color:"#111827"},
cards:{content:"",bg:"#ffffff",color:"#111827"},
contact:{content:"Neem contact met ons op\\ninfo@voorbeeld.nl\\n+31 20 123 4567",bg:"#111827",color:"#ffffff"}};
let site={pages:[{name:"Home",blocks:[{type:"hero",...defaults.hero}]}],colors:{...defaultColors}}, current=0;

function esc(s=""){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function makeBlock(type,data={}){let d={...defaults[type],...data},e=document.createElement("section");e.className=`block ${type}`;e.dataset.type=type;
for(const k of ["content","button","link","image","bg","color"])e.dataset[k]=d[k]||""; render(e);return e}
function render(e){let t=e.dataset.type,c=esc(e.dataset.content),b=esc(e.dataset.button),l=esc(e.dataset.link||"#"),img=esc(e.dataset.image);
e.style.background=e.dataset.bg;e.style.color=e.dataset.color;let body="";
if(t=="hero")body=`<h1>${c}</h1><p>Een sterke eerste indruk voor jouw website.</p><a class="cta" href="${l}">${b}</a>`;
if(t=="text")body=`<div>${c.replace(/\n/g,"<br>")}</div>`;
if(t=="image")body=`<img src="${img}" alt="Afbeelding">`;
if(t=="button")body=`<a class="cta" href="${l}">${b}</a>`;
if(t=="cards")body=`<div class="card"><h3>Snelle start</h3><p>Voeg eenvoudig onderdelen toe.</p></div><div class="card"><h3>Professioneel</h3><p>Modern op elk scherm.</p></div><div class="card"><h3>Flexibel</h3><p>Pas alles zelf aan.</p></div>`;
if(t=="contact")body=`<h2>Contact</h2><p>${c.replace(/\n/g,"<br>")}</p>`;
e.innerHTML=`<div class="block-tools"><button data-action="up">↑</button><button data-action="down">↓</button><button data-action="delete">✕</button></div>${body}`}
function renderPage(){canvas.innerHTML="";site.pages[current].blocks.forEach(b=>canvas.appendChild(makeBlock(b.type,b)));updatePages();updateColors()}
function updatePages(){let s=$("pageSelect");s.innerHTML="";site.pages.forEach((p,i)=>{let o=document.createElement("option");o.value=i;o.textContent=p.name;s.appendChild(o)});s.value=current}
function updateColors(){for(const [k,id] of [["primary","primaryColor"],["accent","accentColor"],["bg","siteBg"],["text","siteText"]])$(id).value=site.colors[k];document.documentElement.style.setProperty("--primary",site.colors.primary);canvas.style.background=site.colors.bg}
function syncBlocks(){site.pages[current].blocks=[...canvas.children].map(e=>({type:e.dataset.type,content:e.dataset.content,button:e.dataset.button,link:e.dataset.link,image:e.dataset.image,bg:e.dataset.bg,color:e.dataset.color}))}
function select(e){document.querySelectorAll(".selected").forEach(x=>x.classList.remove("selected"));selected=e;if(!e){$("editor").hidden=true;$("emptyState").hidden=false;return}e.classList.add("selected");$("editor").hidden=false;$("emptyState").hidden=true;
$("contentInput").value=e.dataset.content||"";$("buttonTextInput").value=e.dataset.button||"";$("linkInput").value=e.dataset.link||"";$("imageInput").value=e.dataset.image||"";$("bgInput").value=e.dataset.bg||"#fff";$("colorInput").value=e.dataset.color||"#111827"}
canvas.addEventListener("click",e=>{let block=e.target.closest(".block");if(!block)return;let a=e.target.closest("[data-action]");if(a){let ac=a.dataset.action;if(ac=="delete")block.remove();if(ac=="up"&&block.previousElementSibling)canvas.insertBefore(block,block.previousElementSibling);if(ac=="down"&&block.nextElementSibling)canvas.insertBefore(block.nextElementSibling,block);syncBlocks();if(ac=="delete")select(null);else select(block);return}select(block)});
document.querySelectorAll(".add-block").forEach(b=>b.onclick=()=>{let e=makeBlock(b.dataset.type);canvas.appendChild(e);select(e);syncBlocks()});
["contentInput","buttonTextInput","linkInput","imageInput","bgInput","colorInput"].forEach(id=>$(id).oninput=()=>{if(!selected)return;let m={content:"contentInput",button:"buttonTextInput",link:"linkInput",image:"imageInput",bg:"bgInput",color:"colorInput"};for(const k in m)selected.dataset[k]=$(m[k]).value;render(selected);select(selected);syncBlocks()});
$("pageSelect").onchange=e=>{syncBlocks();current=+e.target.value;renderPage();select(null)};
$("newPageBtn").onclick=()=>{let n=prompt("Naam van de nieuwe pagina:","Nieuwe pagina");if(!n)return;syncBlocks();site.pages.push({name:n,blocks:[{type:"hero",...defaults.hero}]});current=site.pages.length-1;renderPage();save()};
$("renamePageBtn").onclick=()=>{let n=prompt("Nieuwe paginanaam:",site.pages[current].name);if(n){site.pages[current].name=n;updatePages();save()}};
$("deletePageBtn").onclick=()=>{if(site.pages.length<2)return alert("Je hebt minimaal één pagina nodig.");if(confirm("Deze pagina verwijderen?")){site.pages.splice(current,1);current=Math.max(0,current-1);renderPage();save()}};
["primaryColor","accentColor","siteBg","siteText"].forEach(id=>$(id).oninput=()=>{let m={primaryColor:"primary",accentColor:"accent",siteBg:"bg",siteText:"text"};site.colors[m[id]]=$(id).value;updateColors();save()});
$("resetColors").onclick=()=>{site.colors={...defaultColors};updateColors();save()};
$("deleteBtn").onclick=()=>{if(selected){selected.remove();syncBlocks();select(null)}};
function save(){syncBlocks();localStorage.setItem("webmakerPro",JSON.stringify(site));toast("Opgeslagen")}
$("saveBtn").onclick=save;
$("previewBtn").onclick=()=>document.body.classList.toggle("preview");
$("downloadBtn").onclick=()=>{syncBlocks();let files={};site.pages.forEach((p,i)=>files[p.name]=pageHtml(p));let html=files[site.pages[current].name];let blob=new Blob([html],{type:"text/html"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="website-"+site.pages[current].name.toLowerCase().replace(/[^a-z0-9]+/g,"-")+".html";a.click();URL.revokeObjectURL(a.href);toast("Pagina gedownload")};
function pageHtml(p){let body=p.blocks.map(b=>{let e=makeBlock(b.type,b);e.querySelector(".block-tools")?.remove();return e.outerHTML}).join("");return `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(p.name)}</title><style>${cssExport()}</style></head><body style="background:${site.colors.bg};color:${site.colors.text}">${body}</body></html>`}
function cssExport(){return `.hero{padding:90px 50px;text-align:center;background:linear-gradient(135deg,#eef2ff,#fff)}.hero h1{font:800 52px Arial;margin:0 auto 15px}.hero p{font:18px Arial;color:#4b5563}.cta{display:inline-block;background:${site.colors.primary};color:#fff;padding:12px 20px;border-radius:9px;text-decoration:none}.text-block{padding:45px 55px;line-height:1.75;font:17px Arial}.image-block{padding:35px 55px}.image-block img{width:100%;max-height:430px;object-fit:cover;border-radius:12px}.button-block{text-align:center;padding:35px}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;padding:45px 55px}.card{padding:25px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px}.contact{padding:45px 55px;background:#111827;color:#fff}@media(max-width:700px){.cards{grid-template-columns:1fr}.hero h1{font-size:38px}}`}
function toast(s){let t=$("toast");t.textContent=s;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1500)}
try{let x=JSON.parse(localStorage.getItem("webmakerPro"));if(x?.pages)site=x}catch{}renderPage();
