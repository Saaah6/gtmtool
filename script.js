const $ = id => document.getElementById(id);
const leadsEl = $('leads'), replyEl = $('reply'), meetingEl = $('meeting'), closeEl = $('close'), acvEl = $('acv');

function animateNumber(el, from, to, fmt, duration = 450) {
    const start = performance.now();
    function tick(now) {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = from + (to - from) * eased;
        el.textContent = fmt(val);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = fmt(to);
    }
    requestAnimationFrame(tick);
}

const prev = { meetings: 12, deals: 2.4, arr: 172800 };

function fmtInt(n) { return Math.round(n).toLocaleString('en-US'); }
function fmtOne(n) { return n.toFixed(1); }
function fmtUSD(n) { return '$' + Math.round(n).toLocaleString('en-US'); }

function recalc() {
    const leads = +leadsEl.value;
    const replyRate = +replyEl.value / 100;
    const meetingRate = +meetingEl.value / 100;
    const closeRate = +closeEl.value / 100;
    const acv = +acvEl.value || 0;

    const replies = leads * replyRate;
    const meetings = replies * meetingRate;
    const deals = meetings * closeRate;
    const monthlyACV = deals * acv;
    const arr12 = monthlyACV * 12;

    $('v-leads').textContent = fmtInt(leads);
    $('v-reply').textContent = (+replyEl.value) + '%';
    $('v-meeting').textContent = (+meetingEl.value) + '%';
    $('v-close').textContent = (+closeEl.value) + '%';

    $('n-leads').textContent = fmtInt(leads);
    $('n-replies').textContent = fmtInt(replies);
    $('n-meetings').textContent = fmtInt(meetings);
    $('n-deals').textContent = fmtOne(deals);

    $('bar-replies').style.width = Math.min(100, (replies / leads) * 100) + '%';
    $('bar-meetings').style.width = Math.min(100, (meetings / leads) * 100) + '%';
    $('bar-deals').style.width = Math.min(100, (deals / leads) * 100) + '%';

    animateNumber($('m-meetings'), prev.meetings, meetings, fmtInt);
    animateNumber($('m-deals'), prev.deals, deals, fmtOne);
    animateNumber($('m-arr'), prev.arr, arr12, fmtUSD, 600);

    prev.meetings = meetings;
    prev.deals = deals;
    prev.arr = arr12;
}

[leadsEl, replyEl, meetingEl, closeEl, acvEl].forEach(el => {
    el.addEventListener('input', recalc);
});

recalc();