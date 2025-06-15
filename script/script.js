document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("guest-form");
  const nameInput = document.getElementById("guest-name");
  const categorySelect = document.getElementById("guest-category");
  const list = document.getElementById("guest-list");

  let guests = JSON.parse(localStorage.getItem("guests")) || [];

  const saveGuests = () => {
    localStorage.setItem("guests", JSON.stringify(guests));
  };

  const renderGuests = () => {
    list.innerHTML = ""; /* Clear current list */
    guests.forEach(guest => {
      const li = document.createElement("li");

      const badge = document.createElement("span");
      badge.className = `badge ${guest.category}`;
      badge.textContent = guest.category;

      const nameSpan = document.createElement("span");
      nameSpan.textContent = guest.name;

      const timeSpan = document.createElement("span");
      timeSpan.className = "timestamp";
      timeSpan.textContent = `Added: ${guest.time}`;

      const rsvpBtn = document.createElement("button");
      rsvpBtn.textContent = guest.attending ? "Attending" : "Not Attending";
      rsvpBtn.className = "rsvp-btn";
      rsvpBtn.addEventListener("click", () => {
        guest.attending = !guest.attending;
        saveGuests();
        renderGuests(); 
      });

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.className = "edit-btn";
      editBtn.addEventListener("click", () => {
        const newName = prompt("Edit guest name:", guest.name);
        if (newName && newName.trim()) {
          guest.name = newName.trim();
          saveGuests();
          renderGuests();
        }
      });

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.className = "remove-btn";
      removeBtn.addEventListener("click", () => {
        guests = guests.filter(g => g !== guest);
        saveGuests();
        renderGuests();
      });

      li.appendChild(badge);
      li.appendChild(nameSpan);
      li.appendChild(timeSpan);
      li.appendChild(rsvpBtn);
      li.appendChild(editBtn);
      li.appendChild(removeBtn);
      list.appendChild(li);
    });
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const guestName = nameInput.value.trim();
    const category = categorySelect.value;

    if (!guestName || !category) return;

    if (guests.length >= 10) {
      alert("Guest list is full! Max 10 guests.");
      return;
    }

    const isDuplicate = guests.some(g => g.name.toLowerCase() === guestName.toLowerCase());
    if (isDuplicate) {
      alert("This guest is already on the list.");
      return;
    }

    const now = new Date();
    const newGuest = {
      name: guestName,
      category: category,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attending: true
    };

    guests.push(newGuest);
    saveGuests();
    renderGuests(); /* automatically shows the new guest */
    form.reset();
  });

  /* Initial list render on page load */
  renderGuests();
});
