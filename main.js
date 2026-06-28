import {
  getAllCards,
  addCard,
  deleteCard,
  updateCards,
  getCard,
} from "./api.js";

async function getCards(filter) {
  const cards = await getAllCards();
  const toDo = cards.filter((c) => c.status == "todo");
  const inprogress = cards.filter((c) => c.status == "inprogress");
  const done = cards.filter((c) => c.status == "done");
  const cardsGroups = document.getElementsByClassName("cardsGroup");

  let filteredArray = [toDo, inprogress, done];

  if (filter !== "all") {
    filteredArray = filteredArray.map((col) => {
      return col.filter((card) => card.priority === filter);
    });
    Array.from(cardsGroups).forEach((group, index) => {
      group.innerHTML = "";
    });
  }
  Array.from(cardsGroups).forEach((group, index) => {
    group.innerHTML = "";
    if (filteredArray[index].length != 0) {
      console.log(filteredArray[index].length);
      filteredArray[index].forEach((card) => {
        const domCard = createCard(index, card);
        group.appendChild(domCard);
      });
    } else {
      if (document.getElementsByClassName("empty")[index] !== null) {
        const domEmpty = createEmptyState();
        group.appendChild(domEmpty);
      }
    }
  });
}
async function getOneCard(id) {
  const card = await getCard(id);
  const form = openAddTaskPopup(getIndexByStaus(card.status));
  console.log(card);
  console.log(form);
  form.title.value = card.title;
  form.data.value = card.date;
  form.desc.value = card.description;
  form.options.value = card.priority;
  form.querySelector("#btn").innerText = "update";
  form.onsubmit = async (e) => {
    e.preventDefault();
    await updateCards(card.id, {
      title: form.title.value,
      description: form.desc.value,
      priority: form.options.value,
      date: form.data.value,
    });
  };
}

function createEmptyState() {
  const emptyDiv = document.createElement("div");
  emptyDiv.classList =
    "empty h-[100%] w-[100%] bg-[#000220] rounded-lg flex justify-center items-center";

  const span = document.createElement("span");
  span.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
    </svg>
    Empty Tasks
  `;
  span.classList =
    "text-[#D6E2FF] text-[23px] text-center flex items-center gap-3";

  emptyDiv.appendChild(span);
  return emptyDiv;
}

function createCard(index, { title, description, priority, date, id }) {
  const priorityColors = {
    high: "#C10007",
    moderate: "#D97706",
    low: "#22C55E",
  };

  const card = document.createElement("article");
  card.id = id;
  card.classList = "bg-[#000220] text-white p-3 rounded-lg mb-4";
  card.dataset.id = card.id;
  card.draggable = true;

  // Title row
  const divTitle = document.createElement("div");
  divTitle.classList = "title flex justify-between";

  const h3 = document.createElement("h3");
  h3.classList = "text-white text-xl";
  h3.innerText = title;

  const iconsDiv = document.createElement("div");
  iconsDiv.classList = "icons flex justify-between w-25";

  const editButton = document.createElement("button");
  editButton.setAttribute("aria-label", "edit");
  editButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
      stroke-linejoin="round" class="lucide lucide-pencil-icon lucide-pencil text-[#4F8CFF]">
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
      <path d="m15 5 4 4" />
    </svg>`;

  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("aria-label", "delete button");
  deleteButton.className = "deletebutton";
  deleteButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
      stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2 text-[#4F8CFF]">
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>`;

  deleteButton.addEventListener("click", (e) => {
    deleteCard(card.id);
  });
  editButton.addEventListener("click", () => {
    getOneCard(card.id);
  });

  iconsDiv.appendChild(editButton);
  iconsDiv.appendChild(deleteButton);
  divTitle.appendChild(h3);
  divTitle.appendChild(iconsDiv);

  // Description
  const descDiv = document.createElement("div");
  descDiv.classList = "desc text-lg m-4";

  const descParagraph = document.createElement("p");
  descParagraph.innerText = description;
  descParagraph.className = "break-words w-full";
  descParagraph.style.wordBreak = "break-all";
  descDiv.appendChild(descParagraph);

  // Info row (priority + date)
  const divInfo = document.createElement("div");
  divInfo.classList = "info flex justify-between text-white items-center";

  const spanPriority = document.createElement("span");
  spanPriority.className = "lg:w-1/4 md:w-1/3 h-1/4 rounded-lg text-center";
  spanPriority.innerText = priority;
  spanPriority.style.color = priorityColors[priority];
  spanPriority.style.outline = `1px solid ${priorityColors[priority]}`;

  const dateSpan = document.createElement("span");
  dateSpan.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
      stroke-linejoin="round" aria-hidden="true"
      class="lucide lucide-calendar-clock-icon lucide-calendar-clock text-white">
      <path d="M16 14v2.2l1.6 1" />
      <path d="M16 2v4" />
      <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" />
      <path d="M3 10h5" />
      <path d="M8 2v4" />
      <circle cx="16" cy="16" r="6" />
    </svg>
    ${new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

  divInfo.appendChild(spanPriority);
  divInfo.appendChild(dateSpan);

  card.appendChild(divTitle);
  card.appendChild(descDiv);
  card.appendChild(divInfo);

  return card;
}

function addCardToGroup(index, formData) {
  const group = document.getElementsByClassName("cardsGroup")[index];
  const emptyEl = group.getElementsByClassName("empty")[0];
  if (emptyEl) emptyEl.remove();

  const card = createCard(index, formData);
  group.appendChild(card);
  updateTaskCounter(index);
}

function getPopupTitle(index) {
  if (index === 0) return "Add New To-Do Task";
  if (index === 1) return "Add New In-Progress Task";
  return "Add New Done Task";
}

function createPopupHeader(title, onClose) {
  const header = document.createElement("header");
  header.classList =
    "p-4 flex justify-between border-b border-[#4F8CFF] items-center";

  const h2 = document.createElement("h2");
  h2.innerText = title;
  h2.classList = "text-[25px] text-[#F8FAFC]";

  const closeIcon = document.createElement("button");
  closeIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 text-[#F27474]">
      <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
    </svg>`;
  closeIcon.className = "close";
  closeIcon.addEventListener("click", onClose);

  header.appendChild(h2);
  header.appendChild(closeIcon);
  return header;
}

function createPopupForm(index, onSubmit) {
  const form = document.createElement("form");
  form.classList = "flex flex-col h-[80%] justify-between p-3";

  const inputTitle = document.createElement("input");
  inputTitle.setAttribute("type", "text");
  inputTitle.setAttribute("name", "title");
  inputTitle.setAttribute("aria-label", "title input");
  inputTitle.classList =
    "outline-1 outline-[#4F8CFF] w-60 bg-[#001330] mt-3 h-[45px] rounded-lg p-3 text-[#F8EFCF]";
  inputTitle.placeholder = "type your task title";

  const textArea = document.createElement("textarea");
  textArea.setAttribute("name", "desc");
  textArea.setAttribute("aria-label", "description area");
  textArea.setAttribute("value", "");
  textArea.placeholder = "type ypur description";
  textArea.classList =
    "bg-[#001330] h-[100px] w-100 outline-1 outline-[#4F8CFF] rounded-lg text-[#F8EFCF] p-3 scroll-clean";

  const inputDate = document.createElement("input");
  inputDate.setAttribute("name", "data");
  inputDate.setAttribute("value", "");
  inputDate.setAttribute("type", "date");
  inputDate.classList =
    "outline-1 outline-[#4F8CFF] rounded-lg text-[#F8EFCF] p-3 w-60 [&::-webkit-calendar-picker-indicator]:invert";

  const selectPriority = document.createElement("select");
  selectPriority.setAttribute("name", "options");
  selectPriority.setAttribute("aria-label", "select priority");
  selectPriority.classList =
    "bg-[#001330] outline-1 outline-[#4F8CFF] p-3 text-[#F8EFCF] rounded-lg w-60";

  [
    { value: "high", label: "high" },
    { value: "moderate", label: "Moderate" },
    { value: "low", label: "Low" },
  ].forEach(({ value, label }) => {
    const option = document.createElement("option");
    option.setAttribute("value", value);
    option.innerText = label;
    selectPriority.appendChild(option);
  });

  const submit = document.createElement("button");
  submit.setAttribute("type", "submit");
  submit.setAttribute("aria-label", "submit button");
  submit.id = "btn";
  submit.innerText = "add task";
  submit.classList =
    "w-30 outline-1 outline-[#4F8CFF] rounded-lg text-[#F8EFCF]";

  form.onsubmit = (e) => {
    e.preventDefault();
    const allFilled =
      inputTitle.value &&
      selectPriority.value &&
      textArea.value &&
      inputDate.value;

    if (!allFilled) {
      Swal.fire({
        icon: "error",
        title: "please Fill All The Fields",
        background: "#001330",
        color: "white",
        confirmButtonColor: "#4F8CFF",
      });
      return;
    }

    onSubmit({
      title: inputTitle.value,
      description: textArea.value,
      priority: selectPriority.value,
      date: inputDate.value,
      status: getStatusByIndex(index),
    });
  };

  form.appendChild(inputTitle);
  form.appendChild(selectPriority);
  form.appendChild(inputDate);
  form.appendChild(textArea);
  form.appendChild(submit);

  return form;
}
function getStatusByIndex(index) {
  const statusArr = ["todo", "inprogress", "done"];
  return statusArr[index];
}
function getIndexByStaus(status) {
  const statusArr = ["todo", "inprogress", "done"];
  return statusArr.indexOf(status);
}

function openAddTaskPopup(index) {
  const divFullScreen = document.createElement("div");
  divFullScreen.classList =
    "z-1000 w-[100%] h-[100vh] absolute top-0 flex items-center justify-center backdrop-blur-sm";

  const popupWindow = document.createElement("div");
  popupWindow.classList =
    "w-[40%] h-[70vh] bg-[#001330] border rounded-lg border-[#4F8CFF]";

  const close = () => divFullScreen.remove();

  const header = createPopupHeader(getPopupTitle(index), close);
  const form = createPopupForm(index, async (formData) => {
    const newCard = await addCard({
      ...formData,
      status: getStatusByIndex(index),
    });

    addCardToGroup(index, newCard);
    close();
  });

  divFullScreen.addEventListener("click", close);
  popupWindow.addEventListener("click", (e) => e.stopPropagation());

  popupWindow.appendChild(header);
  popupWindow.appendChild(form);
  divFullScreen.appendChild(popupWindow);
  document.body.appendChild(divFullScreen);
  return form;
}
async function Search(value) {
  const allCards = await getAllCards();
  const Searched = allCards.filter((card) =>
  card.title.toLowerCase().includes(value.toLowerCase()) ||
  card.description.toLowerCase().includes(value.toLowerCase())
);

  const toDo = Searched.filter((c) => c.status == "todo");
  const inprogress = Searched.filter((c) => c.status == "inprogress");
  const done = Searched.filter((c) => c.status == "done");
  const cardsGroups = document.getElementsByClassName("cardsGroup");
  if (value != "") {
    let filteredArray = [toDo, inprogress, done];
    Array.from(cardsGroups).forEach((group, index) => {
      group.innerHTML = "";
      if (filteredArray[index].length != 0) {
        console.log(filteredArray[index].length);
        filteredArray[index].forEach((card) => {
          const domCard = createCard(index, card);
          group.appendChild(domCard);
        });
      } else {
        if (document.getElementsByClassName("empty")[index] !== null) {
          const domEmpty = createEmptyState();
          group.appendChild(domEmpty);
        }
      }
    });
  } else {
    getAllCards("all")
  }
  console.log(Searched);
}
window.onload = () => {
  getCards("all");
  const addButtons = document.getElementsByClassName("add");
  Array.from(addButtons).forEach((button, index) => {
    button.addEventListener("click", () => openAddTaskPopup(index));
  });
};
const filterButtons = document
  .getElementsByClassName("filters")[0]
  .getElementsByTagName("button");
Array.from(filterButtons).forEach((e) => {
  e.addEventListener("click", () => {
    getCards(e.innerText.toLowerCase());
  });
});

document.getElementsByClassName("search")[0].addEventListener("change", (e) => {
  Search(e.target.value);
});

let selected = null;

document.addEventListener("dragstart", (e) => {
  if (e.target.closest("article")) {
    selected = e.target.closest("article");
  }
});

document.querySelectorAll(".cardsGroup").forEach((col) => {
  col.addEventListener("dragover", (e) => e.preventDefault());

  col.addEventListener("drop", () => {
    if (selected) {
      console.log(selected)
      col.appendChild(selected);
      selected = null;
    }
  });
});

// let selected = null;

// document.addEventListener("dragstart", (e) => {
//   if (e.target.closest("article")) {
//     selected = e.target.closest("article");
//   }
// });

// document.querySelectorAll(".cardsGroup").forEach((col, index) => {
//   col.addEventListener("dragover", (e) => e.preventDefault());

//   col.addEventListener("drop", async () => {
//     if (!selected) return;

//     const cardElement = selected;
//     const cardId = selected.id;
//     selected = null;

//     col.appendChild(cardElement);

//     try {
//       const allCards = await getAllCards();
//       console.log(allCards);

//       const c = allCards.find((card) => card.id == cardId);
//       console.log(c , cardId ,getStatusByIndex(index))
//       await updateCards((cardId), {
//         ...c,
//         status: getStatusByIndex(index),
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   });
// });
