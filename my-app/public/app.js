// signup
document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("token", data.token);
    alert("Signup successful!");
  } else {
    alert("Error: " + (data.message || res.statusText));
  }
});

// login
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("token", data.token);
    alert("Login successful!");
  } else {
    alert("Error: " + (data.message || res.statusText));
  }
});

// protected route
async function getProfile() {
  const token = localStorage.getItem("token");
  const res = await fetch("/profile", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const data = await res.json();
  document.getElementById("profileOutput").innerText = JSON.stringify(data, null, 2);
}
