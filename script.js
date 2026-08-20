const KEY="AMIRY_100_FINAL";
const SITEKEY="AMIRY_SITE_FINAL";

function makeProducts(){
 const p=[];
 for(let i=1;i<=100;i++){
   let category,price;
   if(i<=80){category=i<=40?"مو":"ریش";price=500+((i-1)%6)*300;}
   else {category="داماد";price=3000;}
   p.push({id:i,name:`استایل ${i}`,price,category,description:`استایل ${category} AMIRY — قابل ویرایش`,image:""});
 }
 return p;
}
function load(){
 try{let x=JSON.parse(localStorage.getItem(KEY));return Array.isArray(x)&&x.length===100?x:makeProducts()}catch(e){return makeProducts()}
}
function siteLoad(){
 try{return JSON.parse(localStorage.getItem(SITEKEY))||{title:"AMIRY",description:"۱۰۰ استایل با قیمت‌های ۵۰۰ تا ۳۰۰۰ افغانی"}}catch(e){return {title:"AMIRY",description:"۱۰۰ استایل با قیمت‌های ۵۰۰ تا ۳۰۰۰ افغانی"}}
}
let products=load(),site=siteLoad(),pendingImage="";

const $=x=>document.querySelector(x);
function save(){localStorage.setItem(KEY,JSON.stringify(products))}
function placeholder(id){
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="700" height="700"><rect width="100%" height="100%" fill="#e7e9ec"/><text x="50%" y="47%" text-anchor="middle" font-family="Arial" font-size="72" font-weight="bold" fill="#555">AMIRY</text><text x="50%" y="58%" text-anchor="middle" font-family="Arial" font-size="30" fill="#777">STYLE ${id}</text></svg>`;
 return "data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(svg);
}
function esc(s=""){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function render(){
 $("#siteTitle").textContent=site.title;
 $("#siteDescription").textContent=site.description;
 const cats=[...new Set(products.map(p=>p.category))];
 const old=$("#categoryFilter").value;
 $("#categoryFilter").innerHTML='<option value="all">همه استایل‌ها</option>'+cats.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join("");
 if(cats.includes(old))$("#categoryFilter").value=old;
 const q=$("#search").value.toLowerCase().trim(),cat=$("#categoryFilter").value;
 const list=products.filter(p=>(cat==="all"||p.category===cat)&&(`${p.name} ${p.id} ${p.category}`).toLowerCase().includes(q));
 $("#products").innerHTML=list.map(p=>`
 <article class="product">
  <img class="product-img" src="${p.image||placeholder(p.id)}" alt="${esc(p.name)}">
  <div class="product-body">
   <div class="category">${esc(p.category)}</div>
   <h3>${esc(p.name)}</h3>
   <div class="price">${Number(p.price).toLocaleString("fa-AF")} افغانی</div>
   <div class="desc">${esc(p.description)}</div>
   <button class="edit-btn" onclick="openEditor(${p.id})">✏️ ویرایش متن / آپلود عکس</button>
  </div>
 </article>`).join("");
}
window.openEditor=id=>{
 const p=products.find(x=>x.id===id);if(!p)return;
 $("#productId").value=id;$("#editName").value=p.name;$("#editPrice").value=p.price;$("#editCategory").value=p.category;$("#editDescription").value=p.description;
 pendingImage=p.image||"";$("#preview").src=pendingImage||placeholder(id);$("#preview").style.display="block";$("#editor").classList.remove("hidden");
};
$("#editImage").onchange=e=>{
 const f=e.target.files[0];if(!f)return;
 if(f.size>5*1024*1024){alert("عکس باید کمتر از ۵ مگابایت باشد.");return}
 const r=new FileReader();r.onload=()=>{pendingImage=r.result;$("#preview").src=pendingImage;$("#preview").style.display="block"};r.readAsDataURL(f);
};
$("#saveProduct").onclick=()=>{
 const p=products.find(x=>x.id===Number($("#productId").value));if(!p)return;
 p.name=$("#editName").value||"استایل";p.price=Math.max(0,Number($("#editPrice").value)||0);p.category=$("#editCategory").value||"سایر";p.description=$("#editDescription").value||"";p.image=pendingImage;
 save();$("#editor").classList.add("hidden");render();
};
$("#closeEditor").onclick=()=>$("#editor").classList.add("hidden");
$("#adminBtn").onclick=()=>{$("#siteTitleInput").value=site.title;$("#siteDescriptionInput").value=site.description;$("#siteEditor").classList.remove("hidden")};
$("#closeSiteEditor").onclick=()=>$("#siteEditor").classList.add("hidden");
$("#saveSite").onclick=()=>{site={title:$("#siteTitleInput").value||"AMIRY",description:$("#siteDescriptionInput").value||""};localStorage.setItem(SITEKEY,JSON.stringify(site));$("#siteEditor").classList.add("hidden");render()};
$("#search").oninput=render;$("#categoryFilter").onchange=render;render();