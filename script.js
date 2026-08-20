function selectStyle(name, price, category){
  const el=document.getElementById("selected");
  el.textContent=`انتخاب شما: ${name} — ${category} — ${price.toLocaleString()} ؋`;
  document.querySelector(".booking").scrollIntoView({behavior:"smooth"});
}
function filterStyles(){
  const q=document.getElementById("search").value.trim().toLowerCase();
  const cat=document.getElementById("category").value;
  document.querySelectorAll(".card").forEach(card=>{
    const name=card.dataset.name.toLowerCase();
    const okQ=!q || name.includes(q);
    const okC=cat==="all" || card.dataset.category===cat;
    card.style.display=(okQ&&okC)?"block":"none";
  });
}
function setLanguage(lang){
  if(lang!=="fa") alert("نسخه زبان "+lang+" در مرحله بعد اضافه می‌شود.");
}
