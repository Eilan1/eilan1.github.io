function qs(selector) {
  return document.querySelector(selector)
}

function qsa(selector) {
  return document.querySelectorAll(selector)
}

function updateStat(id, value) {
  const el = document.getElementById(id)
  if(el) el.textContent = value
}

function createElement(tag, className='') {
  const el = document.createElement(tag)
  if(className) el.className = className
  return el
}
