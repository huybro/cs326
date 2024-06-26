import { getUser } from "./db.js";
import { Available } from "../utils/available.js";
import { User } from "../utils/user.js";

//const user = JSON.parse(localStorage.getItem('user'));
//console.log("index dep trai",user);

const user = await getUser();
console.log(user);

const res = await fetch("http://127.0.0.1:3000/index/data", {
  method: 'GET',
  headers: {
      'Content-Type': 'application/json'
  },
});

const availableProfiles = await res.json(); 
console.log(availableProfiles);

function renderProfileInfo(profileDataObject) {
  const profileData = new Available(
    profileDataObject._id, 
    profileDataObject.name, 
    profileDataObject.breed, 
    profileDataObject.age,
    profileDataObject.gender, 
    profileDataObject.image
  );

  const profileContainer = document.getElementById('profile-container');
  profileContainer.innerHTML = '';

  const profileInfo = document.createElement('div');
  profileInfo.className = 'profile-info';

  const name = document.createElement('h1');
  name.textContent = profileData.getAttr('name');

  const breed = document.createElement('p');
  breed.textContent = profileData.getAttr('breed');

  const age = document.createElement('p');
  age.textContent = `${profileData.getAttr('age')} years`;

  const gender = document.createElement('p');
  gender.textContent = profileData.getAttr('gender');

  profileInfo.appendChild(name);
  profileInfo.appendChild(breed);
  profileInfo.appendChild(age);
  profileInfo.appendChild(gender);

  profileContainer.appendChild(profileInfo);
}

function renderProfileImage(profileData, imageIndex = 0) {
  const imgContainer = document.getElementById('image-container');
  imgContainer.innerHTML = ''; 

  const img = document.createElement('img');
  img.src = profileData.image[imageIndex];
  img.className = 'profile-image';
  imgContainer.appendChild(img);
}

let currentIndex = 0;
let currentImageIndex = 0;

function newProfile() {
  currentIndex = (currentIndex + 1) % availableProfiles.length;
  currentImageIndex = 0; 
  renderProfileInfo(availableProfiles[currentIndex]);
  renderProfileImage(availableProfiles[currentIndex], currentImageIndex);
}

function checkMatch() {
  const currentProfileLikes = availableProfiles[currentIndex].matches;
  console.log("current likes", currentProfileLikes);
  console.log("user", user._id)
  return currentProfileLikes.includes(user._id);
  }

const dislike = document.getElementById('dislike');
const like = document.getElementById('like');

// Task: Implement event to update match pet to database.
dislike.addEventListener('click', newProfile);
like.addEventListener('click', ()=>{
  if (checkMatch()) {
    alert(`You guys are a match! Here is contact information ${availableProfiles[currentIndex].email}`);
  }
  newProfile()
});

function swipe(direction) {
  if (direction === 'left') {
    currentImageIndex = (currentImageIndex - 1 + availableProfiles[currentIndex].image.length) % availableProfiles[currentIndex].image.length;
  } else if (direction === 'right') {
    currentImageIndex = (currentImageIndex + 1) % availableProfiles[currentIndex].image.length;
  }

  renderProfileImage(availableProfiles[currentIndex], currentImageIndex);
}

const swipeLeft = document.getElementById('left');
const swipeRight = document.getElementById('right');

swipeLeft.addEventListener('click', () => swipe('left'));
swipeRight.addEventListener('click', () => {swipe('right')});

renderProfileInfo(availableProfiles[currentIndex]);
renderProfileImage(availableProfiles[currentIndex], currentImageIndex);
