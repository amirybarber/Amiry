const KEY='AMIRY_DB_V3';
const ADMIN_PIN='CHANGE_ME_BEFORE_DEPLOY';
const ADMIN_SESSION='AMIRY_OWNER_SESSION';
const PHONE1='0748603450', PHONE2='+93773269043';

const defaults=()=>({appearance:{heroTitle:'استایل خودت را انتخاب کن.',heroSub:'مدل مو، ریش و استایل دلخواهت را ببین و برای نوبت انتخاب کن.',brand:'AMIRY',accent:'#ffffff',heroImage:'',logoImage:''},styles:Array.from({length:100},(_,i)=>({id:i+1,name:`استایل ${i+1}`,price:[500,800,1100,1400,1700,2000,2300,2600][i%8],category:['classic','fade','beard','modern'][i%4],description:'استایل مو — AMIRY',image:'',active:true,likes:0,comments:[]})),bookings:[]});
let db=load(); let selectedStyleId=null;

function load(){try{const x=JSON.parse(localStorage.getItem(KEY));return x||defaults()}catch{return defaults()}}
function save(){localStorage.setItem(KEY,JSON.stringify(db))}
function toast(t){const e=document.getElementById('toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),2400)}
function money(n){return new Intl.NumberFormat('fa-AF').format(n)+' افغانی'}
function imgData(file){return new Promise((res,rej)=>{if(!file)return res('');const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file)})}
function isOwner(){return sessionStorage.getItem(ADMIN_SESSION)==='1'}

function render(){
 const q=document.getElementById('search').value.trim().toLowerCase(), cat=document.getElementById('category').value, sort=document.getElementById('sort').value;
 let arr=db.styles.filter(s=>s.active&&((s.name+' '+s.id).toLowerCase().includes(q))&&(cat==='all'||s.category===cat));
 if(sort==='low')arr.sort((a,b)=>a.price-b.price); if(sort==='high')arr.sort((a,b)=>b.price-a.price);
 document.getElementById('styleCount').textContent=db.styles.filter(s=>s.active).length;
 document.getElementById('stylesGrid').innerHTML=arr.map(s=>`
 <article class="style-card"><div class="style-image">${s.image?`<img src="${s.image}" alt="${esc(s.name)}">`:`<div class="placeholder">AMIRY<small>STYLE ${s.id}</small></div>`}<span class="style-badge">${s.category}</span></div>
 <div class="style-body"><h3>${esc(s.name)}</h3><div class="price">${money(s.price)}</div><p class="desc">${esc(s.description||'')}</p>
 <div class="style-actions"><button onclick="openStyle(${s.id})">مشاهده</button><button class="like ${s.likes&&s.likes>0?'liked':''}" onclick="likeStyle(${s.id})">♥ ${s.likes||0}</button></div></div></article>`).join('');
 document.getElementById('emptyState').classList.toggle('hidden',arr.length>0);
 renderBookingStyles(); applyAppearance();
}
function esc(x){return String(x??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function applyAppearance(){
 document.getElementById('heroTitle').textContent=db.appearance.heroTitle;
 document.getElementById('heroSub').textContent=db.appearance.heroSub;
 document.querySelectorAll('.brand').forEach(e=>e.innerHTML=esc(db.appearance.brand)+'<span>®</span>');
 const hero=document.getElementById('hero'); hero.style.backgroundImage=db.appearance.heroImage?`url("${db.appearance.heroImage}")`:'none';
 document.documentElement.style.setProperty('--accent',db.appearance.accent||'#fff');
}
function renderBookingStyles(){
 const sel=document.getElementById('bookingStyle'); const old=sel.value;
 sel.innerHTML=db.styles.filter(s=>s.active).map(s=>`<option value="${s.id}">${esc(s.name)} — ${money(s.price)}</option>`).join('');
 if(old)sel.value=old; updateBookingSummary();
}
function openStyle(id){
 selectedStyleId=id; const s=db.styles.find(x=>x.id===id); if(!s)return;
 document.getElementById('styleDialogBody').innerHTML=`<div class="style-image">${s.image?`<img src="${s.image}" alt="${esc(s.name)}">`:`<div class="placeholder">AMIRY</div>`}</div><p class="eyebrow">STYLE ${s.id}</p><h2>${esc(s.name)}</h2><h3>${money(s.price)}</h3><p>${esc(s.description||'')}</p><button class="primary-btn" onclick="openBooking(${s.id})">نوبت برای این استایل</button><div class="comments"><b>♥ ${s.likes||0} لایک</b><div class="comment-list">${(s.comments||[]).map(c=>`<div class="comment"><strong>${esc(c.name)}</strong>${esc(c.text)}</div>`).join('')||'<span class="muted">هنوز کامنتی ثبت نشده.</span>'}</div><form class="comment-form" onsubmit="commentStyle(event,${s.id})"><input name="name" placeholder="نام" required><input name="text" placeholder="نظر شما..." required><button class="primary-btn">ارسال</button></form></div>`;
 document.getElementById('styleDialog').showModal();
}
function likeStyle(id){const s=db.styles.find(x=>x.id===id);s.likes=(s.likes||0)+1;save();render();toast('لایک ثبت شد ❤️')}
function commentStyle(e,id){e.preventDefault();const s=db.styles.find(x=>x.id===id);const f=new FormData(e.target);s.comments=s.comments||[];s.comments.push({name:f.get('name'),text:f.get('text')});save();openStyle(id);toast('کامنت ثبت شد')}
function openBooking(id){document.getElementById('styleDialog').close();document.getElementById('bookingStyle').value=id;updateBookingSummary();document.getElementById('bookingDialog').showModal()}
function updateBookingSummary(){const id=Number(document.getElementById('bookingStyle').value);const s=db.styles.find(x=>x.id===id);document.getElementById('bookingSummary').textContent=s?`${s.name} — ${money(s.price)}`:''}
function openAdmin(){if(isOwner()){renderAdmin();document.getElementById('adminDialog').showModal()}else document.getElementById('loginDialog').showModal()}
function renderAdmin(){
 document.getElementById('mStyles').textContent=db.styles.length;document.getElementById('mBookings').textContent=db.bookings.length;
 document.getElementById('mLikes').textContent=db.styles.reduce((a,s)=>a+(s.likes||0),0);document.getElementById('mComments').textContent=db.styles.reduce((a,s)=>a+(s.comments?.length||0),0);
 const q=document.getElementById('adminSearch').value.toLowerCase();
 document.getElementById('adminStylesList').innerHTML=db.styles.filter(s=>(s.name+' '+s.id).toLowerCase().includes(q)).map(s=>`<div class="admin-row"><div>${s.image?`<img src="${s.image}">`:'📷'}</div><div><b>${esc(s.name)}</b><br>${money(s.price)} · ${s.active?'فعال':'غیرفعال'} · ♥${s.likes||0} · 💬${s.comments?.length||0}</div><div class="admin-row-actions"><button onclick="editStyle(${s.id})">✏️ ویرایش</button><button onclick="changeStyleImage(${s.id})">🔄 عکس</button><button class="danger" onclick="removeStyle(${s.id})">🗑️</button></div></div>`).join('');
 document.getElementById('bookingsList').innerHTML=db.bookings.length?db.bookings.slice().reverse().map((b,i)=>`<div class="booking-item"><b>${esc(b.firstName)} ${esc(b.lastName)}</b><div>${esc(b.date)} · ${esc(b.time)} · ${esc(b.styleName)} · ${money(b.price)}</div><div class="muted">${esc(b.note||'')}</div><div class="booking-actions"><a href="sms:${PHONE2}?body=${encodeURIComponent(smsText(b))}">SMS به 2</a><a href="sms:${PHONE1}?body=${encodeURIComponent(smsText(b))}">SMS به 1</a><button onclick="deleteBooking(${db.bookings.length-1-i})">حذف</button></div></div>`).join(''):'<p class="muted">هنوز نوبتی ثبت نشده.</p>';
 const a=document.getElementById('appearanceForm');a.heroTitle.value=db.appearance.heroTitle;a.heroSub.value=db.appearance.heroSub;a.brand.value=db.appearance.brand;a.accent.value=db.appearance.accent||'#ffffff';document.getElementById('bgPreview').style.backgroundImage=db.appearance.heroImage?`url("${db.appearance.heroImage}")`:'none';
}
function smsText(b){return `AMIRY: ${b.firstName} ${b.lastName} در تاریخ ${b.date} ساعت ${b.time} برای آرایش نوبت گرفته است. استایل: ${b.styleName}، قیمت: ${b.price} افغانی.`}
function editStyle(id){
 selectedStyleId=id;const s=db.styles.find(x=>x.id===id),f=document.getElementById('editForm');f.id.value=s.id;f.name.value=s.name;f.price.value=s.price;f.category.value=s.category;f.active.value=String(s.active);f.description.value=s.description||'';f.image.value='';document.getElementById('editDialog').showModal()
}
async function saveStyle(e){e.preventDefault();const f=new FormData(e.target),s=db.styles.find(x=>x.id===Number(f.get('id')));s.name=f.get('name');s.price=Number(f.get('price'));s.category=f.get('category');s.active=f.get('active')==='true';s.description=f.get('description');const im=await imgData(f.get('image'));if(im)s.image=im;save();document.getElementById('editDialog').close();render();renderAdmin();toast('استایل ذخیره شد')}
async function changeStyleImage(id){const inp=document.createElement('input');inp.type='file';inp.accept='image/*';inp.onchange=async()=>{const s=db.styles.find(x=>x.id===id);s.image=await imgData(inp.files[0]);save();render();renderAdmin();toast('عکس تغییر کرد')};inp.click()}
function removeStyle(id){if(!confirm('این استایل حذف شود؟'))return;db.styles=db.styles.filter(s=>s.id!==id);save();render();renderAdmin();toast('استایل حذف شد')}
function deleteBooking(i){db.bookings.splice(i,1);save();renderAdmin()}
function downloadSMS(){if(!db.bookings.length)return toast('نوبتی وجود ندارد');const body=db.bookings.map(smsText).join('\\n');navigator.clipboard?.writeText(body);toast('متن پیام‌ها کپی شد')}
function setup(){
 document.getElementById('year').textContent=new Date().getFullYear();render();
 ['search','category','sort'].forEach(id=>document.getElementById(id).addEventListener('input',render));
 document.getElementById('bookingStyle').addEventListener('change',updateBookingSummary);
 ['bookTop','heroBook','stylesBook'].forEach(id=>document.getElementById(id).onclick=()=>document.getElementById('bookingDialog').showModal());
 document.getElementById('adminTop').onclick=openAdmin;
 document.getElementById('loginForm').onsubmit=e=>{e.preventDefault();if(new FormData(e.target).get('pin')===ADMIN_PIN){sessionStorage.setItem(ADMIN_SESSION,'1');document.getElementById('loginDialog').close();document.getElementById('adminTop').classList.remove('hidden');openAdmin()}else toast('رمز مدیریت نادرست است')};
 if(isOwner())document.getElementById('adminTop').classList.remove('hidden');
 document.getElementById('logout').onclick=()=>{sessionStorage.removeItem(ADMIN_SESSION);document.getElementById('adminDialog').close();document.getElementById('adminTop').classList.add('hidden')};
 document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>document.getElementById(b.dataset.close).close());
 document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.admin-panel').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.getElementById('tab-'+b.dataset.tab).classList.add('active')});
 document.getElementById('editForm').onsubmit=saveStyle;document.getElementById('deleteStyle').onclick=()=>{removeStyle(selectedStyleId);document.getElementById('editDialog').close()};
 document.getElementById('adminSearch').oninput=renderAdmin;document.getElementById('addStyle').onclick=()=>{const n=db.styles.length?Math.max(...db.styles.map(s=>s.id))+1:1;db.styles.push({id:n,name:`استایل ${n}`,price:500,category:'classic',description:'استایل مو — AMIRY',image:'',active:true,likes:0,comments:[]});save();render();renderAdmin();editStyle(n)};
 document.getElementById('appearanceForm').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);db.appearance.heroTitle=f.get('heroTitle');db.appearance.heroSub=f.get('heroSub');db.appearance.brand=f.get('brand');db.appearance.accent=f.get('accent');const im=await imgData(f.get('heroImage'));if(im)db.appearance.heroImage=im;const logo=await imgData(f.get('logoImage'));if(logo)db.appearance.logoImage=logo;save();render();renderAdmin();toast('ظاهر سایت ذخیره شد')};
 document.getElementById('clearBookings').onclick=()=>{if(confirm('همه درخواست‌ها حذف شوند؟')){db.bookings=[];save();renderAdmin()}};
 document.getElementById('notifyAll').onclick=downloadSMS;
 document.getElementById('bookingForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),s=db.styles.find(x=>x.id===Number(f.get('style')));const b={firstName:f.get('firstName'),lastName:f.get('lastName'),date:f.get('date'),time:f.get('time'),styleId:s.id,styleName:s.name,price:s.price,note:f.get('note'),createdAt:new Date().toISOString()};db.bookings.push(b);save();e.target.reset();document.getElementById('bookingDialog').close();toast('درخواست نوبت ثبت شد.');if(isOwner())renderAdmin()};
}
setup();