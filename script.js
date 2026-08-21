const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const KEY='amiry_v3';
const defaultStyles=Array.from({length:20},(_,i)=>({id:i+1,name:`استایل ${i+1}`,category:i%3===0?'hair':i%3===1?'beard':'combo',price:50+Math.round(i*450/19),description:'مدل حرفه‌ای AMIRY — قابل انتخاب برای نوبت',image:''}));
let db=JSON.parse(localStorage.getItem(KEY)||'null')||{styles:defaultStyles,bookings:[],likes:{},comments:{},bg:''};
const save=()=>localStorage.setItem(KEY,JSON.stringify(db));
const tr={fa:{home:'خانه',styles:'استایل‌ها',booking:'نوبت‌گیری',about:'درباره AMIRY',admin:'⚙️ پنل مدیریت',menu:'منو',heroTitle:'استایل خودت را انتخاب کن.',heroText:'مدل مو، ریش و خدمات آرایش مردانه را ببین و برای زمان مناسب نوبت بگیر.',viewStyles:'مشاهده استایل‌ها',bookNow:'نوبت بگیر',styleCount:'استایل',bookingCount:'نوبت ثبت‌شده',priceRange:'افغانی · بازه قیمت',chooseStyle:'استایل مورد علاقه‌ات را پیدا کن',search:'جستجوی استایل...',bookingTitle:'نوبت خود را ثبت کن',firstName:'اسم',lastName:'تخلص',phone:'شماره تماس',date:'تاریخ',time:'ساعت',style:'استایل',price:'قیمت',submitBooking:'ثبت نوبت',bookingNote:'پس از ثبت، اطلاعات نوبت در پنل مالک ذخیره می‌شود. برای ارسال SMS واقعی به سرویس پیامک/سرور نیاز است.',aboutTitle:'آرایش مردانه با تمرکز روی استایل',aboutText:'این سایت برای معرفی استایل‌ها، مشاهده جزئیات و ثبت نوبت طراحی شده است. هیچ عدد یا آمار ساختگی درباره نوبت‌ها نمایش داده نمی‌شود.',language:'زبان',adminPanel:'پنل مدیریت',ownerOnly:'این بخش فقط برای مالک است.',login:'ورود'},
ps:{home:'کور',styles:'سټایلونه',booking:'نوبت',about:'د AMIRY په اړه',admin:'⚙️ مدیریت',menu:'مینو',heroTitle:'خپل سټایل وټاکئ.',heroText:'د وېښتانو او ږیرې سټایلونه وګورئ او د مناسب وخت لپاره نوبت واخلئ.',viewStyles:'سټایلونه وګورئ',bookNow:'نوبت واخلئ',styleCount:'سټایلونه',bookingCount:'ثبت شوي نوبتونه',priceRange:'افغانۍ · د قیمت حد',chooseStyle:'خپل خوښ سټایل پیدا کړئ',search:'سټایل ولټوئ...',bookingTitle:'خپل نوبت ثبت کړئ',firstName:'نوم',lastName:'تخلص',phone:'د اړیکې شمېره',date:'نېټه',time:'وخت',style:'سټایل',price:'قیمت',submitBooking:'نوبت ثبتول',bookingNote:'نوبت د مالک په پینل کې ساتل کېږي.',aboutTitle:'د نارینه وو مسلکي آرایش',aboutText:'دا سایټ د سټایلونو، قیمتونو او نوبت لپاره دی. جعلي احصائیه نه ښودل کېږي.',language:'ژبه',adminPanel:'مدیریت',ownerOnly:'یوازې د مالک لپاره.',login:'ننوتل'},
en:{home:'Home',styles:'Styles',booking:'Booking',about:'About AMIRY',admin:'⚙️ Admin',menu:'Menu',heroTitle:'Choose your style.',heroText:'Explore men’s hair and beard styles and book a suitable time.',viewStyles:'View styles',bookNow:'Book now',styleCount:'Styles',bookingCount:'Bookings',priceRange:'AFN · price range',chooseStyle:'Find your style',search:'Search styles...',bookingTitle:'Book an appointment',firstName:'First name',lastName:'Last name',phone:'Phone',date:'Date',time:'Time',style:'Style',price:'Price',submitBooking:'Submit booking',bookingNote:'The booking is stored in the owner dashboard. Real SMS requires a server/SMS provider.',aboutTitle:'Men’s grooming focused on style',aboutText:'This site shows real stored bookings only; no fake booking statistics are displayed.',language:'Language',adminPanel:'Admin panel',ownerOnly:'Owner only.',login:'Login'}};
let lang=localStorage.getItem('amiry_lang')||'fa';

function applyLang(){
 document.documentElement.lang=lang; document.documentElement.dir=lang==='en'?'ltr':'rtl';
 $$('[data-i18n]').forEach(e=>e.textContent=tr[lang][e.dataset.i18n]||e.textContent);
 $$('[data-i18n-placeholder]').forEach(e=>e.placeholder=tr[lang][e.dataset.i18nPlaceholder]||e.placeholder);
 $('#langBtn').textContent=lang==='fa'?'FA':lang==='ps'?'PS':'EN';
}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2500)}
function renderFilters(){
 const labels={all:{fa:'همه',ps:'ټول',en:'All'},hair:{fa:'مو',ps:'وېښتان',en:'Hair'},beard:{fa:'ریش',ps:'ږیره',en:'Beard'},combo:{fa:'مو + ریش',ps:'وېښتان + ږیره',en:'Hair + Beard'}};
 $('#filters').innerHTML=Object.keys(labels).map((k,i)=>`<button class="${i?'':'active'}" data-filter="${k}">${labels[k][lang]}</button>`).join('');
 $$('#filters button').forEach(b=>b.onclick=()=>{$$('#filters button').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderStyles(b.dataset.filter)});
}
let currentFilter='all';
function renderStyles(filter=currentFilter){
 currentFilter=filter; const q=$('#search').value.trim().toLowerCase();
 const arr=db.styles.filter(s=>(filter==='all'||s.category===filter)&&(!q||s.name.toLowerCase().includes(q)));
 $('#styleCount').textContent=db.styles.length;
 $('#bookingCount').textContent=db.bookings.length;
 $('#styleGrid').innerHTML=arr.map(s=>card(s)).join('')||'<p class="muted">موردی پیدا نشد.</p>';
 $$('#styleGrid [data-view]').forEach(b=>b.onclick=()=>openDetail(+b.dataset.view));
 $$('#styleGrid [data-like]').forEach(b=>b.onclick=()=>like(+b.dataset.like));
 $$('#styleGrid [data-book]').forEach(b=>b.onclick=()=>{location.hash='booking';$('#bookingStyle').value=b.dataset.book;updateBookingPrice()});
}
function imgStyle(s){return s.image?`style="background-image:url('${s.image.replaceAll("'","%27")}')"`:''}
function card(s){
 const likes=db.likes[s.id]||0;
 return `<article class="style-card"><div class="style-image" ${imgStyle(s)}><span class="tag">${s.category==='hair'?'hair':s.category==='beard'?'beard':'combo'}</span>${s.image?'':'AMIRY · STYLE '+s.id}</div><div class="style-body"><h3>${esc(s.name)}</h3><div class="price">${s.price} <small>AFN</small></div><p class="muted">${esc(s.description)}</p><div class="likes">♥ ${likes} · ${db.comments[s.id]?.length||0} comments</div><div class="card-actions"><button data-like="${s.id}">♥</button><button class="book" data-view="${s.id}">مشاهده</button></div></div></article>`
}
function esc(x){return String(x).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function openDetail(id){
 const s=db.styles.find(x=>x.id===id); if(!s)return;
 const comments=db.comments[id]||[];
 $('#styleDetail').innerHTML=`<img class="detail-image" ${s.image?`src="${esc(s.image)}"`:''} alt="${esc(s.name)}">${s.image?'': '<div class="muted">برای این استایل هنوز عکس ثبت نشده است.</div>'}<h2>${esc(s.name)}</h2><p>${esc(s.description)}</p><div class="detail-price">${s.price} AFN</div><button class="btn primary full" id="detailBook">نوبت این استایل</button><div class="comments"><h3>♥ ${db.likes[id]||0} · نظرات</h3><div>${comments.map(c=>`<p><b>${esc(c.name)}</b>: ${esc(c.text)}</p>`).join('')||'<span class="muted">هنوز نظری ثبت نشده.</span>'}</div><div class="comment-row"><input id="commentName" placeholder="نام"><input id="commentText" placeholder="نظر"><button class="btn primary" id="commentBtn">ارسال</button></div></div>`;
 $('#styleDialog').showModal();
 $('#detailBook').onclick=()=>{location.hash='booking';$('#bookingStyle').value=id;updateBookingPrice();$('#styleDialog').close()};
 $('#commentBtn').onclick=()=>{const n=$('#commentName').value.trim(),t=$('#commentText').value.trim();if(!n||!t)return toast('نام و نظر را وارد کنید');(db.comments[id]??=[]).push({name:n,text:t,date:new Date().toISOString()});save();openDetail(id);renderStyles(currentFilter)};
}
function like(id){db.likes[id]=(db.likes[id]||0)+1;save();renderStyles(currentFilter)}
function fillBooking(){
 $('#bookingStyle').innerHTML=db.styles.map(s=>`<option value="${s.id}">${esc(s.name)} — ${s.price} AFN</option>`).join('');
 updateBookingPrice();
}
function updateBookingPrice(){const s=db.styles.find(x=>x.id===+$('#bookingStyle').value);$('#bookingPrice').textContent=s?s.price:'—'}
$('#bookingStyle').onchange=updateBookingPrice;
$('#bookingForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);const s=db.styles.find(x=>x.id===+f.get('styleId'));const b={id:Date.now(),firstName:f.get('firstName'),lastName:f.get('lastName'),phone:f.get('phone'),date:f.get('date'),time:f.get('time'),styleId:s.id,styleName:s.name,price:s.price,createdAt:new Date().toISOString(),status:'new'};db.bookings.push(b);save();e.target.reset();fillBooking();toast('نوبت ثبت شد.');renderStyles();renderAppointments();};
function renderAppointments(){
 $('#appointmentList').innerHTML=db.bookings.length?db.bookings.slice().reverse().map(b=>`<div class="admin-item"><b>${esc(b.firstName)} ${esc(b.lastName)}</b><div>${b.date} · ${b.time} · ${esc(b.styleName)} · ${b.price} AFN</div><div>☎ ${esc(b.phone)}</div><div class="actions"><button class="btn ghost" data-sms="${b.id}">پیامک</button><button class="btn ghost" data-delbooking="${b.id}">حذف</button></div></div>`).join(''):'<p class="muted">هنوز هیچ نوبتی ثبت نشده است.</p>';
 $$('[data-delbooking]').forEach(x=>x.onclick=()=>{db.bookings=db.bookings.filter(b=>b.id!==+x.dataset.delbooking);save();renderAppointments();renderStyles()});
 $$('[data-sms]').forEach(x=>x.onclick=()=>{const b=db.bookings.find(z=>z.id===+x.dataset.sms);const msg=encodeURIComponent(`AMIRY: ${b.firstName} ${b.lastName} در تاریخ ${b.date} ساعت ${b.time} برای ${b.styleName} به قیمت ${b.price} افغانی نوبت گرفته است.`);location.href=`sms:+93773269043?body=${msg}`});
}
function renderAdminStyles(){
 $('#adminStyleList').innerHTML=db.styles.map(s=>`<div class="admin-item"><b>${esc(s.name)}</b> — ${s.price} AFN<div class="actions"><button class="btn ghost" data-edit="${s.id}">✏️ ویرایش</button><button class="btn ghost" data-del="${s.id}">🗑️ حذف</button></div></div>`).join('');
 $$('[data-edit]').forEach(x=>x.onclick=()=>{const s=db.styles.find(z=>z.id===+x.dataset.edit);const f=$('#styleForm');Object.keys(s).forEach(k=>{if(f.elements[k])f.elements[k].value=s[k]??''})});
 $$('[data-del]').forEach(x=>x.onclick=()=>{if(confirm('حذف شود؟')){db.styles=db.styles.filter(s=>s.id!==+x.dataset.del);save();renderStyles();fillBooking();renderAdminStyles()}});
}
$('#styleForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);let id=+f.get('id');const obj={id:id||Date.now(),name:f.get('name'),category:f.get('category'),price:Math.max(50,Math.min(500,+f.get('price'))),description:f.get('description'),image:f.get('image')};if(id){db.styles=db.styles.map(s=>s.id===id?obj:s)}else db.styles.push(obj);save();e.target.reset();renderStyles();fillBooking();renderAdminStyles();toast('ذخیره شد')};
$('#resetStyleForm').onclick=()=>$('#styleForm').reset();

function openMenu(){ $('#sideMenu').classList.add('open');$('#overlay').classList.add('open');$('#sideMenu').setAttribute('aria-hidden','false')}
function closeMenu(){ $('#sideMenu').classList.remove('open');$('#overlay').classList.remove('open');$('#sideMenu').setAttribute('aria-hidden','true')}
$('#menuBtn').onclick=openMenu;$('#closeMenu').onclick=closeMenu;$('#overlay').onclick=closeMenu;
$('#langBtn').onclick=()=>$('#langDialog').showModal();
$$('[data-lang]').forEach(b=>b.onclick=()=>{lang=b.dataset.lang;localStorage.setItem('amiry_lang',lang);applyLang();renderFilters();renderStyles();fillBooking();$('#langDialog').close();});
$$('[data-close]').forEach(b=>b.onclick=()=>document.getElementById(b.dataset.close).close());
$('#search').oninput=()=>renderStyles(currentFilter);

$('#adminOpen').onclick=()=>{closeMenu();$('#adminLogin').showModal()};
$('#adminLoginBtn').onclick=()=>{const pin=$('#adminPin').value;if(pin==='2468'){sessionStorage.setItem('amiry_admin','1');$('#adminLogin').close();$('#adminDialog').showModal();renderAppointments();renderAdminStyles()}else toast('PIN نادرست است')};
$$('.admin-tabs button').forEach(b=>b.onclick=()=>{$$('.admin-tabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');$$('.admin-tab').forEach(x=>x.classList.add('hidden'));$('#'+b.dataset.tab).classList.remove('hidden')});
$('#saveBg').onclick=()=>{const u=$('#bgUrl').value.trim();if(u){db.bg=u;save();applyBg();toast('پس‌زمینه اعمال شد')}};
$('#bgFile').onchange=e=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=()=>{db.bg=r.result;save();applyBg();toast('پس‌زمینه روی این دستگاه اعمال شد')};r.readAsDataURL(file)};
function applyBg(){document.documentElement.style.setProperty('--site-bg',db.bg?`url("${db.bg}")`:'none');document.documentElement.style.setProperty('--hero-bg',db.bg?`url("${db.bg}")`:'linear-gradient(135deg,#111,#252525)')}
applyLang();applyBg();renderFilters();renderStyles();fillBooking();renderAppointments();
