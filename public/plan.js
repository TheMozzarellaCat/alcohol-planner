document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const planId = urlParams.get("id");

  if (!planId) {
    document.getElementById("plan-details").innerHTML = "<p>No plan found.</p>";
    return;
  }

try {
  const response = await fetch(`http://localhost:3000/plans/${planId}`);
  console.log("Response status:", response.status);

  const plan = await response.json();
  if (!plan || !plan.alcohols) {
    throw new Error("Plan or alcohols array is missing");
  }

  document.getElementById("plan-details").innerHTML = `
    <h2>Plan for ${plan.people} people over ${plan.days} days</h2>
    <p><strong>Drinking Intensity:</strong> ${plan.intensity}</p>
    <h3>Alcohol List:</h3>
    <ul>
      ${plan.alcohols
        .map(
          (alcohol) => `
        <li>
          <strong>${alcohol.name}</strong> - ${alcohol.percentage}% alcohol (${alcohol.price} PLN)
        </li>`
        )
        .join("")}
    </ul>
    <button class="delete-btn" onclick="deletePlan('${
      plan.id
    }')">Delete Plan</button>
  `;
} catch (error) {
  console.error("Error:", error);
  document.getElementById("plan-details").innerHTML =
    "<p>Error loading plan.</p>";
}

});

// 🗑️ Function to Delete Plan
async function deletePlan(planId) {
  try {
    await fetch(`http://localhost:3000/plans/${planId}`, { method: "DELETE" });
    alert("Plan deleted!");
    window.location.href = "/index.html"; // Redirect to home
  } catch (error) {
    alert("Error deleting plan");
  }
}
