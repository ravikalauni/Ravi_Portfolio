// Heart counter system
const heartIcon = document.getElementById("heartIcon");
const heartText = document.getElementById("heartText");

let liked = localStorage.getItem("liked") === "true";

if (liked) {
  heartIcon.classList.add("liked");
  heartText.textContent = "Thanks for visiting 💖";
}

heartIcon.addEventListener("click", () => {
  liked = !liked;
  localStorage.setItem("liked", liked);
  heartIcon.classList.toggle("liked");
  heartText.textContent = liked
    ? "Thanks for visiting 💖"
    : "Let me know someone visited 💜";
});

// Google Apps Script URL - Replace with your deployed web app URL
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwgEj8ROMjWASHC91upU8P9TlihrDezDCfVPWrqm8ZqcZ0v8hBrAa6zc-Hi8p9KasfA/exec';

// Function to fetch data from Google Apps Script
// Updated fetch function for script.js
// Function to fetch data from Google Apps Script
async function fetchDocuments() {
  try {
    const response = await fetch(APPS_SCRIPT_URL);
    const result = await response.json();
    
    console.log('API Response:', result); // For debugging
    
    if (result.success && result.data) {
      return result.data;
    } else {
      console.error('Error from Apps Script:', result.error);
      // Return fallback data if API fails
      return getFallbackDocuments();
    }
  } catch (error) {
    console.error('Error fetching documents:', error);
    // Return fallback data if fetch fails
    return getFallbackDocuments();
  }
}

// Fallback data in case API fails
function getFallbackDocuments() {
  return [
    { date: '2 Jan', title: 'I participated in AWS Cloud Innovation Day, Farwest' },
    { date: '1 Jan', title: 'Why it is being too much' },
    { date: '11 Dec', title: 'What I feel in this protest' },
    { date: '8 Dec', title: 'My latest project finished' },
    { date: '7 Dec', title: 'They said NO.' }
  ];
}
// Function to update documents snapshot on main page
async function updateDocumentsSnapshot() {
  const documents = await fetchDocuments();
  const docList = document.getElementById('docList');
  
  if (!docList) return;
  
  // Clear existing content
  docList.innerHTML = '';
  
  if (documents.length === 0) {
    docList.innerHTML = '<p>No documents found.</p>';
    return;
  }
  
  // Add documents from Google Sheets (max 5 for snapshot)
  const maxSnapshotItems = 5;
  documents.slice(0, maxSnapshotItems).forEach(doc => {
    const p = document.createElement('p');
    p.textContent = `${doc.date}: ${doc.title}`;
    docList.appendChild(p);
  });
}

// View More button - Redirect to documents page
const viewMoreBtn = document.getElementById("viewMoreBtn");

viewMoreBtn.addEventListener("click", () => {
  window.location.href = 'documents.html';
});

// For Typing
const text = "“कर्मण्येवाधिकारस्ते मा फलेषु कदाचन”";
let j = 0;
let currentText = "";
let isDeleting = false;

function type() {
    if (isDeleting) {
        currentText = text.substring(0, j--);
    } else {
        currentText = text.substring(0, j++);
    }

    document.getElementById("typing").textContent = currentText;

    let speed = 60;

    if (!isDeleting && j === text.length + 1) {
        speed = 1000;
        isDeleting = true;
    } else if (isDeleting && j === 0) {
        isDeleting = false;
        speed = 500;
    }

    setTimeout(type, speed);
}

type();

// Modal functionality
const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const modalContinue = document.getElementById("modalContinue");
const closeModal = document.querySelector(".close-modal");

// Modal content for each tab
const modalContents = {
  home: {
    title: "Home",
    text: "Welcome to my portfolio! This is the home section where you can learn more about me and my work.",
    continueAction: () => {
      window.open('home.html', '_blank');
    }
  },
  documents: {
    title: "Documents",
    text: "Here you can find my Personal thoughts, achievements, and memories",
    continueAction: () => {
      window.open('documents.html', '_blank');
    }
  },
  projects: {
    title: "Projects",
    text: "Explore my latest projects in web development, software engineering, and other technical domains I'm passionate about.",
    continueAction: () => {
      window.open('projects.html', '_blank');
    }
  },
  profile: {
    title: "Profile",
    text: "Learn more about my background, skills, education, and professional experience in the tech industry.",
    continueAction: () => {
      window.open('profile.html', '_blank');
    }
  },
  gudiya: {
    title: "Gudiya",
    text: "A special section dedicated to something very close to my heart. This is my personal space for cherished memories.",
    continueAction: () => {
      window.open('gudiya.html', '_blank');
    }
  },
  message: {
    title: "Message",
    text: "Feel free to reach out to me! I'm always open to discussing new opportunities, collaborations, or just having a friendly chat.",
    continueAction: () => {
      window.open('contact.html', '_blank');
    }
  }
};

let currentTab = '';

// Add click event listeners to all nav links
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const tabName = this.getAttribute('data-tab');
    currentTab = tabName;
    
    if (modalContents[tabName]) {
      modalTitle.textContent = modalContents[tabName].title;
      modalText.textContent = modalContents[tabName].text;
      modalOverlay.classList.add('active');
    }
  });
});

// Continue button functionality
modalContinue.addEventListener('click', () => {
  if (currentTab && modalContents[currentTab]) {
    modalOverlay.classList.remove('active');
    modalContents[currentTab].continueAction();
  }
});

// Close modal when clicking the X button
closeModal.addEventListener('click', () => {
  modalOverlay.classList.remove('active');
});

// Close modal when clicking outside the modal content
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.remove('active');
  }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
    modalOverlay.classList.remove('active');
  }
});

// for Mouse Pointer
document.addEventListener('mousemove', (e) => {
  const trail = document.createElement('div');
  trail.classList.add('trail');
  document.body.appendChild(trail);

  trail.style.left = e.pageX + 'px';
  trail.style.top = e.pageY + 'px';

  setTimeout(() => {
    trail.remove();
  }, 600);
});

// For mobile experience
window.addEventListener('resize', function() {
  if (window.innerWidth <= 768 && modalOverlay.classList.contains('active')) {
    modalOverlay.classList.remove('active');
  }
});

document.addEventListener('touchstart', function() {}, { passive: true });

let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
  const now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);

// Initialize documents when page loads
document.addEventListener('DOMContentLoaded', function() {
  updateDocumentsSnapshot();
});


// test connection
// Test function to check API connection
async function testConnection() {
  try {
    const response = await fetch(APPS_SCRIPT_URL);
    const result = await response.json();
    console.log('Connection test:', result);
    return result;
  } catch (error) {
    console.error('Connection test failed:', error);
    return null;
  }
}

// Call this in your DOMContentLoaded to test
document.addEventListener('DOMContentLoaded', function() {
  console.log('Testing connection...');
  testConnection().then(() => {
    updateDocumentsSnapshot();
  });
});