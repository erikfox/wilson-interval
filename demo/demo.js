// The Pages workflow copies src/index.js next to this file as wilson-interval.js,
// so the demo always runs the library code on master.
import wilson from './wilson-interval.js';

const form = document.getElementById('inputs');
const fields = ['observed', 'sample', 'confidence', 'population'];
const output = document.getElementById('output');
const error = document.getElementById('error');
const svg = document.getElementById('axis');
const axis = { left: 20, right: 580 };

// An empty field becomes NaN (not 0) so the library rejects it with its own message
function readNumber(name) {
  const value = form.elements[name].value.trim();
  return value === '' ? Number.NaN : Number(value);
}

function readOptions() {
  const options = { confidence: readNumber('confidence') };
  if (form.elements.population.value.trim() !== '') {
    options.population = readNumber('population');
  }
  if (form.elements.continuityCorrection.checked) {
    options.continuityCorrection = true;
  }
  return options;
}

function x(value) {
  return axis.left + value * (axis.right - axis.left);
}

// Match the SVG's coordinate width to its rendered width, so labels and marks stay
// the same size on a phone as on a desktop instead of scaling with the drawing
function fitAxis() {
  const width = Math.max(240, Math.round(svg.getBoundingClientRect().width));
  svg.setAttribute('viewBox', `0 0 ${width} 76`);
  axis.right = width - axis.left;
  svg.querySelector('.axis-line').setAttribute('x2', axis.right);
  drawTicks();
}

function drawTicks() {
  const ticks = document.getElementById('ticks');
  ticks.replaceChildren();
  const ns = 'http://www.w3.org/2000/svg';
  for (const value of [0, 0.25, 0.5, 0.75, 1]) {
    const tick = document.createElementNS(ns, 'line');
    tick.setAttribute('class', 'tick');
    tick.setAttribute('x1', x(value));
    tick.setAttribute('x2', x(value));
    tick.setAttribute('y1', 29);
    tick.setAttribute('y2', 39);
    const label = document.createElementNS(ns, 'text');
    label.setAttribute('class', 'tick-label');
    label.setAttribute('x', x(value));
    label.setAttribute('y', 66);
    label.textContent = String(value);
    ticks.append(tick, label);
  }
}

function setLine(id, from, to) {
  const line = document.getElementById(id);
  line.setAttribute('x1', x(from));
  line.setAttribute('x2', x(to));
}

function format(value) {
  return value.toFixed(4);
}

function snippet(observed, sample, options) {
  const parts = Object.entries(options).map(([key, value]) => `${key}: ${value}`);
  const args = [observed, sample];
  if (parts.length > 0) {
    args.push(`{ ${parts.join(', ')} }`);
  }
  return `import wilson from 'wilson-interval';\n\nwilson(${args.join(', ')});`;
}

function render() {
  const observed = readNumber('observed');
  const sample = readNumber('sample');
  const options = readOptions();
  const snippetOptions = { ...options };
  if (snippetOptions.confidence === 0.95) {
    delete snippetOptions.confidence;
  }
  document.getElementById('snippet').textContent = snippet(
    form.elements.observed.value.trim() || '?',
    form.elements.sample.value.trim() || '?',
    snippetOptions,
  );

  let result;
  try {
    result = wilson(observed, sample, options);
  } catch (err) {
    error.textContent = err.message;
    error.hidden = false;
    output.classList.add('stale');
    svg.classList.add('stale');
    return;
  }

  error.hidden = true;
  output.classList.remove('stale');
  svg.classList.remove('stale');

  const ratio = observed / sample;
  for (const key of ['low', 'center', 'high']) {
    const cell = document.getElementById(key);
    cell.textContent = format(result[key]);
    cell.title = String(result[key]);
  }
  document.getElementById('ratio').textContent = `${observed} / ${sample} = ${format(ratio)}`;

  setLine('band', result.low, result.high);
  setLine('center-mark', result.center, result.center);
  document.getElementById('ratio-mark').setAttribute('cx', x(ratio));
  document.getElementById('axis-title').textContent =
    `Interval from ${format(result.low)} to ${format(result.high)} on a scale from 0 to 1, ` +
    `centered at ${format(result.center)}, with the observed proportion at ${format(ratio)}`;
}

// Keep the inputs in the URL so a result can be shared as a link
function saveToUrl() {
  const params = new URLSearchParams();
  for (const name of fields) {
    const value = form.elements[name].value.trim();
    if (value !== '') params.set(name, value);
  }
  if (form.elements.continuityCorrection.checked) params.set('continuityCorrection', 'true');
  const query = params.toString();
  history.replaceState(null, '', query ? `?${query}` : location.pathname);
}

function loadFromUrl() {
  const params = new URLSearchParams(location.search);
  for (const name of fields) {
    if (params.has(name)) form.elements[name].value = params.get(name);
  }
  form.elements.continuityCorrection.checked = params.get('continuityCorrection') === 'true';
}

form.addEventListener('submit', (event) => event.preventDefault());
form.addEventListener('input', () => {
  render();
  saveToUrl();
});

loadFromUrl();
fitAxis();
render();
new ResizeObserver(() => {
  fitAxis();
  render();
}).observe(svg);
