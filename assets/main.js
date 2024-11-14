let titleContent = document.querySelector("#title");
let loader = document.querySelector(".loader");
let loaderBackground = document.querySelector(".loaderBackground");
let returnedContent = document.querySelector("#root");
let body = document.body;
let menu = document.querySelector(".content1");
let exitBtn = document.querySelector(".exit");
exitBtn.addEventListener("click", (e) => {
  loaderBackground.style.display = "none";
  menu.style.animation =
    "hideElement 0.2s linear 1 forwards, moveBackground1 15s linear infinite";
  menu.style.animationFillMode = "forwards";
  setTimeout(() => {
    menu.style.display = "none";
  }, 200);
});

function showLoader() {
  loaderBackground.style.display = "flex";
}
function showContent(title, message) {
  titleContent.innerHTML = title;
  returnedContent.innerHTML = message;
  menu.style.animation =
    "showElement 0.2s linear 1 reverse, moveBackground1 15s linear infinite";
  menu.style.animationFillMode = "forwards";
  setTimeout(() => {
    menu.style.display = "block";
  }, 200);
}

let test_email = "testsubject105@gmail.com";
let test_password = "password";
let test_id = "52839799-0bad-4786-879b-8d5d9924d5cb";
let BASE_URL = `https://rbrapi.onrender.com`; // Personal server
let BASE_URL2 = `https://rbrapi.sebastian-105.com`;
const NetlifyURL = `https://rbrapi-105.netlify.app/.netlify/functions/rbr`;

// Shared function to process user input and return list of IDs
function getIdList() {
  let List1st = document.getElementById("userID").value;
  return List1st.split(/[, ]+/).map((id) => id.trim());
}

// Generic function to handle API calls
async function mainFunction(type, idList) {
  const url = `${NetlifyURL}?type=${type}&info=${idList.join(",")}`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });
  const data = await response.json();
  alert(data); // Directly log the data
  return data;
}

// Fetch profile details for the user(s)
async function getProfile() {
  try {
    let idList = getIdList();
    let main = await mainFunction("profile", idList);
    if (user && user[0]) {
      let data = user[0];
      alert(data.create_time); // This will alert the create_time if present
    } else {
      alert("User data not found");
    }
    alert("a");
  } catch (error) {
    console.error("Error fetching profile:", error);
    alert(error);
  }
}
// Fetch full profile data for the user(s)
async function getFullProfile() {
  let idList = getIdList();
  let main = await mainFunction("profile", idList);
  // Handle main response here
  console.log(main); // Example log, you can replace it with more specific handling
}

// Fetch leaderboard data for the user(s)
async function getLeaderboards() {
  let idList = getIdList();
  let main = await mainFunction("leaderboard", idList);
  // Handle leaderboard data here
  console.log(main); // Example log
}

// Fetch full leaderboard data
async function getFullLeaderboards() {
  let idList = getIdList();
  let main = await mainFunction("leaderboard", idList);
  // Handle full leaderboard data here
  console.log(main); // Example log
}

// Search for a user and fetch leaderboard info
async function SearchUser() {
  let idList = getIdList();
  let main = await mainFunction("leaderboard", idList);
  // Handle search results here
  console.log(main); // Example log
}

// Get all placements for users
async function getAllPlacements() {
  let idList = getIdList();
  let main = await mainFunction("leaderboard", idList);
  // Handle placements data here
  console.log(main); // Example log
}

// Check skill level for the user(s)
async function CheckSkill() {
  let idList = getIdList();
  let main = await mainFunction("profile", idList);
  // Handle skill data here
  console.log(main); // Example log
}

// Get user details by ID (another profile fetch example)
async function FcToID() {
  let idList = getIdList();
  let List = JSON.stringify(idList).slice(1, -1); // Clean list for the API
  let main = await mainFunction("getUserID", List);
  // Handle the returned data here
  console.log(main); // Example log
}

getProfile();
