function docAPI(el, one = true) {
  if (typeof el !== 'string' || typeof one !== 'boolean') {
    throw new Error('docAPI Error: Wrong arg type!')
  }

  if (one) return document.querySelector(el);
  else return document.querySelectorAll(el)
}

function showEle (ele, otherELe) {
  for (const e of ele) {
    e.inert = false;
  }
  for (const e of otherELe) {
    e.inert = true;
  }
}

function classToggle (elements) {
  for (const e of elements) {
    e.classList.toggle('active');
  }
}

function navMenuManagement() {
  const openBtn = docAPI('.open-nav-menu');
  const closeBtn = docAPI('.close-nav-menu');
  const navMenu = docAPI('.site-nav');
  const footer = docAPI('footer');
  const overlay = docAPI('.overlay');

  openBtn.addEventListener('click', () => {
    classToggle([openBtn, closeBtn, overlay, navMenu]);
    showEle([closeBtn, navMenu], [openBtn, footer])
    showEle([], [docAPI('main')]);
    window.onscroll = () => (window.scrollTo(0, 0))
  })

  closeBtn.addEventListener('click', () => {
    classToggle([openBtn, closeBtn, overlay, navMenu]);
    showEle([openBtn, footer], [closeBtn, navMenu])
    showEle([docAPI('main')], []);
    window.onscroll = null;
  })
}

navMenuManagement();

async function getAndJsonifyData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return(data);
}


async function displayData() {
  const data = await getAndJsonifyData('data.json');
  const statELe = [];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  for (const [key, val] of Object.entries(data)) {
    const id = '#' + key.toLowerCase().replace(' ', '-');
    const stat = docAPI(id);

    if (prefersReducedMotion) stat.innerText = val;
    else {
      statELe.push(stat);
      
      const sprites = [];
      const {result, sym} = parseVal(val);
      
      let extra = .1;
      if (result > 9) extra *= 10;
      if (result > 99) extra *= 5;
      if (result > 999) extra *= 5;
      for (let i = 0; i <= result; i += extra) {
        if (i % 1 !== 0) i = Number(Number(i).toFixed(1)); 
        if (i + extra > result) {
          sprites.push(result); 
          break;
        } else sprites.push(i);
      }
      const len = sprites.length;
  
      function animate (spr, time) {
        if (spr.length === 0) return;
        requestAnimationFrame(() => stat.innerText = new Intl.NumberFormat("en-IN").format(
            spr.shift()
          ) + sym);
        setTimeout(() => {
          return animate(spr, time);
        }, time);
      }
      animate(sprites, Math.round(2000 / len));
    }
  }
}

displayData();

function parseVal(val) {
  val = val.replace(/,/g, '').trim();
  const lastIndex = val.length - 1;
  let num = val;
  const lastChar = val[lastIndex];
  let sym = '';
  if (!Number(lastChar)) {
    num = num.slice(0, lastIndex);
    sym = lastChar;
  }
  return {result: Number(num), sym};
}
