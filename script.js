const T={
fa:{styles:"استایل‌ها",booking:"نوبت‌گیری",contact:"تماس",heroTitle:"استایل خودت را انتخاب کن.",heroText:"مدل‌های مو، ریش و استایل داماد را ببین و قیمت را انتخاب کن.",explore:"مشاهده استایل‌ها",choose:"انتخاب استایل",search:"جستجوی استایل...",bookTitle:"نوبت خود را ثبت کنید",bookText:"استایل را انتخاب کنید و زمان مناسب خود را درخواست کنید.",send:"ارسال درخواست نوبت",all:"همه",hair:"مو",beard:"ریش",face:"صورت",groom:"داماد",name:"نام شما",phone:"شماره تماس"},
ps:{styles:"سټایلونه",booking:"د نوبت اخیستل",contact:"اړیکه",heroTitle:"خپل سټایل وټاکئ.",heroText:"د ویښتانو، ږیرې او زوم سټایلونه وګورئ او بیه وټاکئ.",explore:"سټایلونه وګورئ",choose:"سټایل وټاکئ",search:"سټایل ولټوئ...",bookTitle:"خپل نوبت ثبت کړئ",bookText:"سټایل وټاکئ او مناسب وخت وغواړئ.",send:"د نوبت غوښتنه واستوئ",all:"ټول",hair:"ویښتان",beard:"ږیره",face:"مخ",groom:"زوم",name:"ستاسو نوم",phone:"د اړیکې شمېره"},
en:{styles:"Styles",booking:"Booking",contact:"Contact",heroTitle:"Choose your style.",heroText:"Explore hair, beard and groom styles with their prices.",explore:"View Styles",choose:"Choose a Style",search:"Search styles...",bookTitle:"Book Your Appointment",bookText:"Choose a style and request a convenient time.",send:"Request Appointment",all:"All",hair:"Hair",beard:"Beard",face:"Face",groom:"Groom",name:"Your name",phone:"Phone number"}};
const N={en:["Classic","Mid Fade","Low Fade","High Fade","Modern Taper","French Crop","Pompadour","Undercut","Quiff","Mohawk"],fa:["کلاسیک","فید متوسط","فید پایین","فید بالا","تیپر مدرن","کراپ فرانسوی","پومپادور","آندرکات","کویف","موهاک"],ps:["کلاسیک","منځنی فید","ټیټ فید","لوړ فید","عصري ټیپر","فرانسوي کراپ","پومپادور","انډرکټ","کویف","موهاک"]};
const cats=["hair","beard","face","groom"],styles=[];
for(let i=1;i<=100;i++){let c=cats[(i-1)%4],n=(i-1)%10,group=Math.ceil(i/10);styles.push({id:i,category:c,name:{en:`${N.en[n]} ${group}`,fa:`${N.fa[n]} ${group}`,ps:`${N.ps[n]} ${group}`},price:100+((i-1)%10)*20});}
let lang=localStorage.getItem("amiry_lang")||"fa",cat="all";
const $=s=>document.querySelector(s);

function filters(){
 const t=T[lang],labels={all:t.all,hair:t.hair,beard:t.beard,face:t.face,groom:t.groom};
 $("#filters").innerHTML=Object.entries(labels).map(([k,v])=>`<button class="filter ${k===cat?"active":""}" data-category="${k}">${v}</button>`).join("");
 document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{cat=b.dataset.category;filters();render();});
}
function render(){
 const q=($("#search")?.value||"").toLowerCase();
 const list=styles.filter(s=>(cat==="all"||s.category===cat)&&(`${s.name.fa} ${s.name.ps} ${s.name.en}`.toLowerCase().includes(q)));
 $("#styleGrid").innerHTML=list.map(s=>`<article class="card"><div class="photo"><span>STYLE ${String(s.id).padStart(3,"0")}</span></div><div class="card-body"><strong>${s.name[lang]}</strong><div class="price">${s.price.toLocaleString()} AFN</div><a href="#booking" class="book-small" data-id="${s.id}">${T[lang].booking}</a></div></article>`).join("");
 document.querySelectorAll("[data-id]").forEach(a=>a.onclick=()=>{$("#service").value=a.dataset.id;});
}
function services(){
 $("#service").innerHTML=styles.map(s=>`<option value="${s.id}">${s.name[lang]} — ${s.price.toLocaleString()} AFN</option>`).join("");
}
function setLang(l){
 lang=l;localStorage.setItem("amiry_lang",l);document.documentElement.lang=l;document.documentElement.dir=l==="en"?"ltr":"rtl";
 document.querySelectorAll("[data-i18n]").forEach(e=>{let k=e.dataset.i18n;if(T[l][k])e.textContent=T[l][k];});
 document.querySelectorAll("[data-i18n-placeholder]").forEach(e=>{let k=e.dataset.i18nPlaceholder;if(T[l][k])e.placeholder=T[l][k];});
 $("#name").placeholder=T[l].name;$("#phone").placeholder=T[l].phone;filters();render();services();
}
document.addEventListener("DOMContentLoaded",()=>{
 $("#search")?.addEventListener("input",render);
 document.querySelectorAll("[data-lang]").forEach(b=>b.onclick=()=>setLang(b.dataset.lang));
 $("#bookingForm")?.addEventListener("submit",e=>{
  e.preventDefault();let s=styles.find(x=>x.id===Number($("#service").value));
  let msg=`AMIRY BARBER%0AStyle: ${encodeURIComponent(s?.name[lang]||"")}%0AName: ${encodeURIComponent($("#name").value)}%0APhone: ${encodeURIComponent($("#phone").value)}%0ADate: ${$("#date").value}%0ATime: ${$("#time").value}`;
  let number="YOUR_WHATSAPP_NUMBER";
  if(number!=="YOUR_WHATSAPP_NUMBER") window.open(`https://wa.me/${number}?text=${msg}`,"_blank");
  else alert(T[lang].send+" آماده است. شماره WhatsApp را در script.js وارد کنید.");
 });
 setLang(lang);
});
