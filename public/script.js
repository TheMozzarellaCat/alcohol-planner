document.addEventListener("DOMContentLoaded", function () {
  const peopleContainer = document.getElementById("people-container");
  const addPersonBtn = document.createElement("button");
  addPersonBtn.id = "add-person";
  addPersonBtn.textContent = "Add Another Person";

  function addPerson() {
    const personDiv = document.createElement("div");
    personDiv.classList.add("person");

    personDiv.innerHTML = `
            <label>Weight (kg):</label>
            <input type="number" class="weight" min="30" value="70">

            <label>Alcohol Absorption Rate:</label>
            <select class="absorption">
                <option value="fast">Fast</option>
                <option value="normal" selected>Normal</option>
                <option value="slow">Slow</option>
            </select>

            <label>Gender:</label>
            <div class="gender-buttons">
                <button class="gender male active">Male</button>
                <button class="gender female">Female</button>
            </div>
            <button class="delete-person" style="display: none;">❌</button>
        `;

    peopleContainer.appendChild(personDiv);
    peopleContainer.appendChild(addPersonBtn); // Always keep this button last

    updateDeleteButtons();
    setupGenderButtons(personDiv);
  }

  function updateDeleteButtons() {
    const people = document.querySelectorAll(".person");
    const deleteButtons = document.querySelectorAll(".delete-person");

    people.forEach((person, index) => {
      const deleteBtn = person.querySelector(".delete-person");
      if (index === 0) {
        deleteBtn.style.display = "none"; // Hide delete button for the first person
      } else {
        deleteBtn.style.display = "inline"; // Show for others
      }

      deleteBtn.onclick = () => {
        person.remove();
        updateDeleteButtons();
      };
    });
  }

  function setupGenderButtons(personDiv) {
    const maleBtn = personDiv.querySelector(".male");
    const femaleBtn = personDiv.querySelector(".female");

    maleBtn.addEventListener("click", () => {
      maleBtn.classList.add("active");
      femaleBtn.classList.remove("active");
    });

    femaleBtn.addEventListener("click", () => {
      femaleBtn.classList.add("active");
      maleBtn.classList.remove("active");
    });
  }

  addPersonBtn.addEventListener("click", () => addPerson());

  addPerson(); // Add the first person by default (undeletable)

  document
    .getElementById("generate-plan")
    .addEventListener("click", async function () {
      const days = document.getElementById("days").value;
      const people = Array.from(document.querySelectorAll(".person")).map(
        (person) => ({
          weight: person.querySelector(".weight").value,
          absorption: person.querySelector(".absorption").value,
          gender: person.querySelector(".male").classList.contains("active")
            ? "Male"
            : "Female",
        })
      );

      const response = await fetch("http://localhost:3000/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days, people }),
      });

      const result = await response.json();
      if (response.ok) {
        window.location.href = `plan.html?id=${result.id}`;
      } else {
        alert("Error creating plan.");
      }
    });
});
