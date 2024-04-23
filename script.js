// As soon as possible load the json file with language data into language object
var language = {};
fetch('assets/language.json')
  .then(response => response.json())
  .then(data => {
    language = data;
  });

var languageHTML = {};
fetch('assets/languageHTML.json')
  .then(response => response.json())
  .then(data => {
    languageHTML = data;
  });


// As soon as the user is offset by more than 0px from the top of the page, show the scroll-to-top button (use class back-to-top--is-visible)
window.addEventListener('scroll', function() {
    if (window.scrollY > 0) {
        document.querySelector('.back-to-top').classList.add('back-to-top--is-visible');
    } else {
        document.querySelector('.back-to-top').classList.remove('back-to-top--is-visible');
    }
});

document.querySelector('.cta').addEventListener('click', function() {
    window.scroll({
        top: document.querySelector('.core-principles-section').offsetTop - 0.15 * window.innerHeight,
        behavior: 'smooth'
    });
});

function scrollToBottom() {
  const scrollHeight = document.documentElement.scrollHeight;
  const viewportHeight = window.innerHeight;
  const scrollTo = scrollHeight - viewportHeight;
  
  window.scrollTo({
      top: scrollTo,
      behavior: 'smooth'
  });
}

// Create a function scrollToTop that scrolls the page to the top after the DOMContentLoaded event. 
// Use the scrollTo method on the window object with the top property set to 0.
function scrollToTop() {
  // Cancel any pending scroll animations
  var scrollAnimation = null;
  function cancelScrollAnimation() {
      if (scrollAnimation) {
          window.cancelAnimationFrame(scrollAnimation);
          scrollAnimation = null;
      }
  }
  
  // Scroll to the top of the page
  function animateScroll() {
      var currentPosition = window.scrollY;
      if (currentPosition > 0) {
          scrollAnimation = window.requestAnimationFrame(animateScroll);
          window.scrollTo(0, currentPosition - 40);
      } else {
          cancelScrollAnimation();
      }
  }
  
  cancelScrollAnimation(); // Cancel any existing animations
  animateScroll(); // Start the scroll animation
}

// Using the same principle as the scrollToTop function create a function that will scroll to the appropriate section based on the mapping:
const mapping = {
  '#academy': '.core-principles-section',
  '#services': '.services-section',
  '#faq-nav': '.faq-section',
  '#contact': '.contact-section',
  '#programs': '.programs-section'
};

var buttonClicked = false;
document.querySelectorAll('.nav-link').forEach(function(button) {
  button.addEventListener('click', function() {
      buttonClicked = true;
  });

  button.addEventListener('click', function() {
      var btnid = button.getAttribute('id');
      // Add # to the beginning of the id
      btnid = '#' + btnid;
      scrollToSection(mapping[btnid]);
  });
});

function scrollToSection(section) {
  // Get all buttons on the page
  var buttons = document.querySelectorAll('button');

  function disableButtons() {
      buttons.forEach(function(button) {
          button.style.pointerEvents = 'none';
      });
  }

  function enableButtons() {
    buttons.forEach(function(button) {
        button.style.pointerEvents = 'auto';
    });
}

  var scrollAnimation = null;
  function cancelScrollAnimation() {
      if (scrollAnimation) {
          window.cancelAnimationFrame(scrollAnimation);
          scrollAnimation = null;
      }
  }

  function animateScroll() {
      var currentPosition = window.scrollY;
      var targetPosition = document.querySelector(section).offsetTop - 0.15 * window.innerHeight;
      var distance = targetPosition - currentPosition;

      var isAtBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
      
      if (isAtBottom) {
          if (buttonClicked) {
            // Scroll normally to the section
            scrollAnimation = window.requestAnimationFrame(animateScroll);
            window.scrollTo(0, currentPosition + direction * Math.max(10, Math.abs(distance) / 30));
            buttonClicked = false;
            enableButtons();
          } else {
            cancelScrollAnimation();
            enableButtons(); // Re-enable clickable elements when animation is finished
            return;
          }
      }

      var direction = distance > 0 ? 1 : -1;

      if (Math.abs(distance) > 10) {
          scrollAnimation = window.requestAnimationFrame(animateScroll);
          window.scrollTo(0, currentPosition + direction * Math.max(10, Math.abs(distance) / 30));
      } else {
          cancelScrollAnimation();
          enableButtons();
      }
  }
  disableButtons();
  cancelScrollAnimation();
  animateScroll();
}
// activate function on checked property change on id language-selector
document.querySelector('#language-select').addEventListener('input', function() {
  const lang = document.querySelector('#language-select').checked ? 'en' : 'hr';
  // Change the html lang attribute
  document.querySelector('html').setAttribute('lang', lang);

  // go through language object and change textContent of each element
  for (let key in language[lang]) {
    document.querySelector(`#${key}`).textContent = language[lang][key];
  }

  for (let key2 in languageHTML[lang]) {
    let sanitizedDescription = languageHTML[lang][key2].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    document.querySelector(`#${key2}`).innerHTML = sanitizedDescription;
  }

  // Change language-indicator textContent current language in uppercase
  document.querySelector('#language-indicator').textContent = lang.toUpperCase();
});



