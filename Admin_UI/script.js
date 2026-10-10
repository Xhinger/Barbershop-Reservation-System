/* ===== Settings ===== */
// Demo login. Change these. This is NOT real security: anyone can read this file.

// Services and their default prices
const SERVICES = { "Haircut": 250, "Haircut + beard": 400, "Shave": 200, "Hair color": 900 };
const STORAGE_KEY = "barber-data";

const page = document.body.dataset.page;

const API = "http://localhost:5000/api";


async function apiFetch(url, options = {}) {

    const token = sessionStorage.getItem("adminToken");

    const response = await fetch(
        API + url,
        {
            ...options,
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer " + token
            }
        }
    );


    if(response.status === 401){

        sessionStorage.clear();
        window.location.href="login.html";
        return;

    }


    return await response.json();

}

/* ===== Data (saved in this browser with localStorage) ===== */
function localStr(d) {
  const p = n => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + "T" + p(d.getHours()) + ":" + p(d.getMinutes());
}
function at(days, h, m = 0) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(h, m, 0, 0);
  return localStr(d);
}
function seed() {
  const N = "No preference";
  return {
    staffs: [
      { id: 1, name: "Jun Santos", role: "Senior barber", phone: "0917 000 0001", schedule: "Mon-Sat" },
      { id: 2, name: "Ben Lopez", role: "Barber", phone: "0917 000 0002", schedule: "Tue-Sun" },
      { id: 3, name: "Ella Ramos", role: "Receptionist", phone: "0917 000 0003", schedule: "Mon-Fri" }
    ],
    clients: [
      { id: 1, name: "Mark Reyes", phone: "0918 000 1111", staff: "Jun Santos" },
      { id: 2, name: "Paolo Cruz", phone: "0918 000 2222", staff: "Ben Lopez" },
      { id: 3, name: "Ian Dizon", phone: "0918 000 3333", staff: N },
      { id: 4, name: "Carlo Mendoza", phone: "0918 000 4444", staff: "Jun Santos" }
    ],
    appointments: [
      { id: 1, client: "Mark Reyes", service: "Haircut", staff: "Jun Santos", price: 250, date: at(0, 14), status: "Pending" },
      { id: 2, client: "Paolo Cruz", service: "Haircut + beard", staff: "Ben Lopez", price: 400, date: at(0, 15, 30), status: "Pending" },
      { id: 3, client: "Ian Dizon", service: "Shave", staff: N, price: 200, date: at(1, 10), status: "Confirmed" },
      { id: 4, client: "Carlo Mendoza", service: "Hair color", staff: "Jun Santos", price: 900, date: at(1, 13), status: "Confirmed" },
      { id: 5, client: "Mark Reyes", service: "Haircut", staff: "Jun Santos", price: 250, date: at(0, 8), status: "Completed" },
      { id: 6, client: "Ian Dizon", service: "Haircut + beard", staff: "Ben Lopez", price: 400, date: at(0, 9), status: "Completed" },
      { id: 7, client: "Paolo Cruz", service: "Haircut", staff: "Ben Lopez", price: 250, date: at(0, 10), status: "Completed" },
      { id: 8, client: "Carlo Mendoza", service: "Haircut", staff: "Jun Santos", price: 250, date: at(-2, 16), status: "Completed" },
      { id: 9, client: "Mark Reyes", service: "Haircut + beard", staff: "Jun Santos", price: 400, date: at(-9, 11), status: "Completed" },
      { id: 10, client: "Paolo Cruz", service: "Hair color", staff: "Ben Lopez", price: 900, date: at(-20, 15), status: "Completed" }
    ]
  };
}
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
function load() {
  let d = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  if (!d) { d = seed(); localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); }
  return d;
}
let data = load();

async function loadAppointments(){

    const appointments = await apiFetch("/appointments");

    if(appointments){

        data.appointments = appointments;

        render();

    }

}

const nextId = list => Math.max(0, ...list.map(x => x.id)) + 1;
const staffOptions = () => ["No preference", ...data.staffs.map(s => s.name)];

/* ===== Small helpers ===== */
const money = n => "₱" + Number(n).toLocaleString("en-PH");
const when = s => new Date(s).toLocaleString("en-PH", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
const byDate = (a, b) => a.date.localeCompare(b.date);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const btn = (act, id, label, cls = "") => `<button class="${cls}" data-action="${act}" data-id="${id}">${label}</button>`;
const emptyRow = (cols, msg) => `<tr><td colspan="${cols}" class="empty">${msg}</td></tr>`;

/* ===== Pop-up form used for add / edit ===== */
function openForm(title, fields, values, onSave) {
  // Plain <div> modal (works in every browser, no <dialog> needed)
  const dlg = document.createElement("div");
  dlg.className = "modal";
  dlg.innerHTML = `<div class="card modal-box"><h3 style="margin-top:0">${title}</h3><form>` +
    fields.map(f => {
      const v = values[f.name] ?? "";
      const input = f.options
        ? `<select name="${f.name}">${f.options.map(o => `<option${o == v ? " selected" : ""}>${esc(o)}</option>`).join("")}</select>`
        : `<input name="${f.name}" type="${f.type || "text"}" value="${esc(v)}" required>`;
      return `<label>${f.label}${input}</label>`;
    }).join("") +
    `<div class="dialog-buttons"><button type="button" class="light">Cancel</button><button type="submit">Save</button></div></form></div>`;
  const close = () => { document.removeEventListener("keydown", onKey); dlg.remove(); };
  const onKey = e => { if (e.key === "Escape") close(); };
  const form = dlg.querySelector("form");
  dlg.querySelector("button.light").onclick = close;
  dlg.addEventListener("mousedown", e => { if (e.target === dlg) close(); });
  form.onsubmit = e => {
    e.preventDefault();
    const v = Object.fromEntries([...new FormData(form)].map(([k, x]) => [k, String(x).trim()]));
    if (onSave(v) === false) return; // validation failed: keep the pop-up open
    close();
  };
  document.addEventListener("keydown", onKey);
  document.body.append(dlg);
  const first = dlg.querySelector("input, select");
  if (first) first.focus();
  return dlg;
}

function staffForm(s) {
  const fields = [
    { name: "name", label: "Name" }, { name: "role", label: "Role" },
    { name: "phone", label: "Phone" }, { name: "schedule", label: "Schedule" }
  ];
  openForm(s ? "Edit staff" : "Add staff", fields, s || {}, v => {
    if (data.staffs.some(x => x !== s && x.name.toLowerCase() === v.name.toLowerCase())) {
      alert("A staff member with that name already exists.");
      return false;
    }
    if (s) {
      // keep clients and appointments in sync when a staff member is renamed
      if (s.name !== v.name) {
        data.clients.forEach(c => { if (c.staff === s.name) c.staff = v.name; });
        data.appointments.forEach(a => { if (a.staff === s.name) a.staff = v.name; });
      }
      Object.assign(s, v);
    } else data.staffs.push({ id: nextId(data.staffs), ...v });
    commit();
  });
}

function clientForm(c) {
  const fields = [
    { name: "name", label: "Name" }, { name: "phone", label: "Phone" },
    { name: "staff", label: "Preferred staff", options: staffOptions() }
  ];
  openForm(c ? "Edit client" : "Add client", fields, c || {}, v => {
    if (data.clients.some(x => x !== c && x.name.toLowerCase() === v.name.toLowerCase())) {
      alert("A client with that name already exists.");
      return false;
    }
    if (c) {
      if (c.name !== v.name) data.appointments.forEach(a => { if (a.client === c.name) a.client = v.name; });
      Object.assign(c, v);
    } else data.clients.push({ id: nextId(data.clients), ...v });
    commit();
  });
}

/* ===== Drawing the tables ===== */
function apptRow(a) {

  const actions = {
    Pending: [
      btn("accept", a._id || a.id, "Accept"),
      btn("decline", a._id || a.id, "Decline", "light")
    ],

    Confirmed: [
      btn("complete", a._id || a.id, "Mark done"),
      btn("cancel", a._id || a.id, "Cancel", "light")
    ]

  }[a.status] || [];


  return `
  <tr>

  <td>${when(a.date + "T" + a.time)}</td>

  <td>${esc(a.customerName || a.client)}</td>

  <td>${esc(a.service)}</td>

  <td>${esc(a.barber || "No preference")}</td>

  <td>${money(a.price || 0)}</td>

  <td>
    <span class="tag ${a.status.toLowerCase()}">
      ${a.status}
    </span>
  </td>

  <td>
    ${actions.join(" ")}
  </td>

  </tr>`;
}

function earnings() {
  const done = data.appointments.filter(a => a.status === "Completed");
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const week = new Date(today); week.setDate(today.getDate() - ((today.getDay() + 6) % 7)); // week starts Monday
  const month = new Date(now.getFullYear(), now.getMonth(), 1);
  const sum = from => done.filter(a => new Date(a.date) >= from).reduce((t, a) => t + Number(a.price), 0);
  document.getElementById("earn-today").textContent = money(sum(today));
  document.getElementById("earn-week").textContent = money(sum(week));
  document.getElementById("earn-month").textContent = money(sum(month));
}

function render() {
  const rows = document.getElementById("rows");
  if (page === "dashboard") {
    earnings();
    const list = data.appointments.filter(a => a.status === "Pending" || a.status === "Confirmed").sort(byDate);
    rows.innerHTML = list.map(apptRow).join("") || emptyRow(7, "No appointment requests yet.");
  }
  if (page === "appointments") {
    const list = [...data.appointments].sort(byDate).reverse();
    rows.innerHTML = list.map(apptRow).join("") || emptyRow(7, "No appointments yet. Bookings from the client site will show up here.");
  }
  if (page === "staffs") {
    rows.innerHTML = data.staffs.map(s =>
      `<tr><td>${esc(s.name)}</td><td>${esc(s.role)}</td><td>${esc(s.phone)}</td><td>${esc(s.schedule)}</td>` +
      `<td>${btn("edit-staff", s.id, "Edit", "light")} ${btn("remove-staff", s.id, "Remove", "light")}</td></tr>`
    ).join("") || emptyRow(5, "No staff yet. Click Add staff.");
  }
  if (page === "clients") {
    rows.innerHTML = data.clients.map(c => {
      const visits = data.appointments.filter(a => a.client === c.name && a.status === "Completed").sort(byDate);
      const last = visits.length ? new Date(visits[visits.length - 1].date).toLocaleDateString("en-PH", { month: "short", day: "numeric" }) : "-";
      return `<tr><td>${esc(c.name)}</td><td>${esc(c.phone)}</td><td>${esc(c.staff)}</td><td>${last}</td><td>${visits.length}</td>` +
        `<td>${btn("edit-client", c.id, "Edit", "light")} ${btn("remove-client", c.id, "Remove", "light")}</td></tr>`;
    }).join("") || emptyRow(6, "No clients yet. Click Add client.");
  }
}

function commit() { save(); render(); }

/* ===== Button clicks ===== */
function start() {
  document.querySelector(".logout").onclick = () => {

    sessionStorage.removeItem("admin");
    sessionStorage.removeItem("adminToken");

    window.location.href = "login.html";

};

  const add = document.getElementById("add-btn");
  if (add) add.onclick = () => ({ staffs: staffForm, clients: clientForm })[page]?.();

  document.addEventListener("click", e => {
    const b = e.target.closest("[data-action]");
    if (!b) return;
    const id = Number(b.dataset.id), act = b.dataset.action;
    const a = data.appointments.find(x => x.id === id);
    if (["accept", "decline", "cancel", "complete"].includes(act) && !a) return;
    if (act === "accept") a.status = "Confirmed";
    else if (act === "decline" || act === "cancel") a.status = "Cancelled";
    else if (act === "complete") a.status = "Completed";
    else if (act === "edit-staff") return staffForm(data.staffs.find(s => s.id === id));
    else if (act === "edit-client") return clientForm(data.clients.find(c => c.id === id));
    else if (act === "remove-staff") {
      if (!confirm("Remove this staff member?")) return;
      const gone = data.staffs.find(s => s.id === id);
      data.staffs = data.staffs.filter(s => s.id !== id);
      // anyone who preferred this staff member goes back to "No preference"
      data.clients.forEach(c => { if (gone && c.staff === gone.name) c.staff = "No preference"; });
    } else if (act === "remove-client") {
      if (!confirm("Remove this client?")) return;
      data.clients = data.clients.filter(c => c.id !== id);
    }
    commit();
  });

  render();
}

/* ===== Login check (runs last) ===== */

if (page === "login") {
    document.getElementById("login-form").onsubmit = async (e) => {
        e.preventDefault();

        const username = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const errorMessage = document.getElementById("login-error");

        errorMessage.textContent = "";

        try {
            const response = await fetch(
                "http://localhost:5000/api/admin/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username, password })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                errorMessage.textContent = result.message;
                return;
            }

            sessionStorage.setItem("adminToken", result.token);
            sessionStorage.setItem("admin", "yes");

            window.location.href = "dashboard.html";

        } catch (error) {
            errorMessage.textContent =
                "Cannot connect to server. Please try again.";
        }
    };
} else if (sessionStorage.getItem("admin") !== "yes") {
    window.location.href = "login.html";
} else {
    start();

    loadAppointments();
}

