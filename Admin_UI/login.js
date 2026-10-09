const card = document.getElementById('card');

const signinPanel  = card.querySelector('.panel-signin');
const signupPanel  = card.querySelector('.panel-signup');
const overlayLeft  = card.querySelector('.overlay-left');
const overlayRight = card.querySelector('.overlay-right');

// Adding/removing `is-signup` triggers every CSS animation.
// `inert` keeps hidden forms and buttons out of keyboard reach.
function setMode(mode) {
  const signup = mode === 'signup';

  card.classList.toggle('is-signup', signup);

  signinPanel.inert  = signup;
  signupPanel.inert  = !signup;
  overlayRight.inert = signup;
  overlayLeft.inert  = !signup;
}

document.querySelectorAll('.pw-check input[type="checkbox"]').forEach(box => {
  box.addEventListener('change', () => {
    const input = document.getElementById(box.dataset.target);
    input.type = box.checked ? 'text' : 'password';
  });
});

document.querySelectorAll('[data-switch]').forEach(btn => {
  btn.addEventListener('click', () => setMode(btn.dataset.switch));
});

// Browser handles validation (required, email format, min 8 chars).
// Replace this with your real request.
document.querySelectorAll('form[data-demo]').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    // fetch('/api/...', { method: 'POST', body: new FormData(form) });
  });
});

// Google / Facebook / Guest buttons.
// Replace the body with your real auth logic.
document.querySelectorAll('[data-auth]').forEach(btn => {
  btn.addEventListener('click', () => {
    const provider = btn.dataset.auth; // "google" | "facebook" | "guest"
    console.log('Continue with:', provider);
  });
});