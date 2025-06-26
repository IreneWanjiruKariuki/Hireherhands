const jobsData = [
  {
    id: 1,
    title: "Kitchen Faucet Repair",
    client: "Sarah Johnson",
    description: "Kitchen faucet is leaking and needs immediate repair. Located in downtown area.",
    status: "requests",
    payment: "$120",
    date: "2024-01-15",
  },
  {
    id: 2,
    title: "Bathroom Tile Installation",
    client: "Mike Chen",
    description: "Need to install new tiles in master bathroom. Materials provided.",
    status: "ongoing",
    payment: "$450",
    date: "2024-01-10",
  },
  {
    id: 3,
    title: "Electrical Outlet Installation",
    client: "Emma Davis",
    description: "Install 3 new electrical outlets in home office. Safety inspection required.",
    status: "completed",
    payment: "$180",
    date: "2024-01-05",
  },
  {
    id: 4,
    title: "Deck Staining",
    client: "Robert Wilson",
    description: "Large deck needs cleaning and staining. Weather-dependent work.",
    status: "requests",
    payment: "$300",
    date: "2024-01-12",
  },
  {
    id: 5,
    title: "Garage Door Repair",
    client: "Lisa Anderson",
    description: "Garage door opener not working properly. Spring replacement may be needed.",
    status: "completed",
    payment: "$220",
    date: "2023-12-28",
  },
]
let currentFilter = "all"
let originalBioText = ""
let originalRate = ""

document.addEventListener("DOMContentLoaded", () => {
  loadJobs()
  initializeBio()
  initializeRate()
})

function toggleBioEdit() {
  const bioText = document.getElementById("bioText")
  const bioEditor = document.getElementById("bioEditor")
  const bioActions = document.querySelector(".bio-actions")
  const editBtn = document.querySelector(".bio-card .edit-btn")

  originalBioText = bioText.textContent
  bioEditor.value = originalBioText

  bioText.style.display = "none"
  bioEditor.style.display = "block"
  bioActions.style.display = "flex"
  editBtn.style.display = "none"
}

function saveBio() {
  const bioText = document.getElementById("bioText")
  const bioEditor = document.getElementById("bioEditor")
  const bioActions = document.querySelector(".bio-actions")
  const editBtn = document.querySelector(".bio-card .edit-btn")

  bioText.textContent = bioEditor.value

  bioText.style.display = "block"
  bioEditor.style.display = "none"
  bioActions.style.display = "none"
  editBtn.style.display = "flex"

  // Here you would typically save to a backend
  console.log("Bio saved:", bioEditor.value)
}
function cancelBioEdit() {
  const bioText = document.getElementById("bioText")
  const bioEditor = document.getElementById("bioEditor")
  const bioActions = document.querySelector(".bio-actions")
  const editBtn = document.querySelector(".bio-card .edit-btn")

  bioText.style.display = "block"
  bioEditor.style.display = "none"
  bioActions.style.display = "none"
  editBtn.style.display = "flex"
}
function initializeBio() {
  const bioEditor = document.getElementById("bioEditor")
  const bioText = document.getElementById("bioText")
  bioEditor.value = bioText.textContent
}