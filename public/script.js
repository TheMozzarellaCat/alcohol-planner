document
  .getElementById("planner-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const days = document.getElementById("days").value;
    const people = document.getElementById("people").value;

    const plan = { days, people, drinks: [], intensity: "moderate" };

    const response = await fetch("http://localhost:3000/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(plan),
    });

    const data = await response.json();
    if (response.ok) {
      window.location.href = `/alcohol-planner/public/plan.html?id=${data.id}`;


    } else {
      alert("Error saving plan.");
    }
  });


  async function loadPlanFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const planId = urlParams.get("id");

    if (!planId) return;

    const response = await fetch(`http://localhost:3000/plans/${planId}`);
    const plan = await response.json();

    if (response.ok) {
      document.getElementById("plan-details").innerHTML = `
            <p><strong>Days:</strong> ${plan.days}</p>
            <p><strong>People:</strong> ${plan.people}</p>
            <p><strong>Intensity:</strong> ${plan.intensity}</p>
            <button onclick="deletePlan('${plan.id}')">Delete Plan</button>
        `;
    } else {
      document.getElementById(
        "plan-details"
      ).innerHTML = `<p>Plan not found.</p>`;
    }
  }

  document.addEventListener("DOMContentLoaded", loadPlanFromURL);


