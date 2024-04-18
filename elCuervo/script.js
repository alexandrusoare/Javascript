window.addEventListener('load', function () {
    let raven = document.querySelector('.raven-container');
    raven.classList.add('loaded');
});
window.addEventListener('load', function () {
    // Delay adding the 'loaded' class for 2 seconds
    setTimeout(function() {
        let content = document.getElementsByClassName("content");
        content[0].classList.add('loaded');
        let loaded_wrapper = document.getElementsByClassName('loader-wrapper');
        loaded_wrapper[0].style.display = 'none';
    }, 1800); // 2000 milliseconds = 2 seconds
  });




//prima pagina

     // Get all the menu items
     const menuItems = document.querySelectorAll('nav ul li a');

     // Add event listener to each menu item
     menuItems.forEach(item => {
       item.addEventListener('click', scrollToSection);
     });
 
     // Function to scroll to the corresponding section
     function scrollToSection(event) {
       event.preventDefault();
       // Prevent default anchor behavior
 
       // Get the target section id from the href attribute
       const targetId = event.target.getAttribute('href').substring(1);
 
       // Get the target section element
       const targetSection = document.getElementById(targetId);
 
       // Scroll to the target section
       targetSection.scrollIntoView({ behavior: 'smooth' });
     }


    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;

    let svgPath = screenWidth > 500 ? './assets/svgs/egypt_bg_desktop.svg' :  './assets/svgs/egypt_bg_mobile.svg';

document.getElementById('burger-menu-icon').addEventListener('click', function() {
    // Toggle the class to switch between closed and opened menu states
    this.classList.toggle('menu-closed');
    this.classList.toggle('menu-opened');

    document.getElementById('menu-wrapper').classList.toggle('menu-opened');
  });

fetch(svgPath)
    .then(response => response.text())
    .then(svgContent => {
        // Store the SVG content in a variable
        var svgElement = document.createElement('div');
        svgElement.innerHTML = svgContent.trim();
        var svgCode = svgElement.querySelector('svg').outerHTML;
        var originalWidth = screenWidth > 500 ? 1920 : 500; // Original width of the SVG
        var originalHeight = screenWidth > 500 ? 1080 : 1000; // Original height of the SVG
        var scaleX = screenWidth / originalWidth;
        var scaleY = screenHeight / originalHeight;
        
        var adaptedSvgCode = adaptSvgToScreen(svgCode, scaleX, scaleY);
        
        let container = document.getElementById("egypt-background");
        let tempContainer = document.createElement("div");
        tempContainer.innerHTML = adaptedSvgCode;
        container.appendChild(tempContainer.firstChild);
    })
    .catch(error => {
        console.error('Error fetching SVG:', error);
    });


    // Function to adapt SVG dimensions based on screen size
function adaptSvgToScreen(svgCode, scaleX, scaleY) {
    // Create a parser for SVG content
    var parser = new DOMParser();
    var doc = parser.parseFromString(svgCode, "image/svg+xml");
    var svgElement = doc.documentElement;

    // Get the original width and height from the extracted attributes or viewBox
    var originalWidth = parseFloat(svgElement.getAttribute('width')) || svgElement.viewBox.baseVal.width;
    var originalHeight = parseFloat(svgElement.getAttribute('height')) || svgElement.viewBox.baseVal.height;

    // Ensure original width and height are valid numbers
    if (!isNaN(originalWidth) && !isNaN(originalHeight) && originalWidth !== 0 && originalHeight !== 0) {
        // Adjust SVG width and height attributes
        svgElement.setAttribute('width', originalWidth * scaleX);
        svgElement.setAttribute('height', originalHeight * scaleY);

        // Adjust all path elements' coordinates
        svgElement.querySelectorAll('path').forEach(function(path) {
            var pathData = path.getAttribute('d');
            path.setAttribute('d', adjustPathData(pathData, scaleX, scaleY));
        });

        // Return the adapted SVG code
        return svgElement.outerHTML;
    } else {
        console.error('Invalid original SVG dimensions.');
        return svgCode; // Return original SVG code without modifications
    }
}

function adjustPathData(pathData, scaleX, scaleY) {
    // Split the path data into individual commands
    var commands = pathData.match(/[a-df-zA-DF-Z][^a-df-zA-DF-Z]*/g);

    // Iterate through each command and scale its coordinates
    for (var i = 0; i < commands.length; i++) {
        // Split the command into command letter and coordinates
        var command = commands[i].trim();
        var commandLetter = command.charAt(0);
        var coordinates = command.substring(1).trim().split(/[ ,]+/);

        // Scale the coordinates based on the command type
        switch (commandLetter.toLowerCase()) {
            case 'm': // moveto command
            case 'l': // lineto command
            case 't': // shorthand/smooth quadratic Bézier curveto command
                coordinates[0] *= scaleX; // x-coordinate
                coordinates[1] *= scaleY; // y-coordinate
                break;
            case 'h': // horizontal lineto command
                coordinates[0] *= scaleX; // x-coordinate
                break;
            case 'v': // vertical lineto command
                coordinates[0] *= scaleY; // y-coordinate
                break;
            case 'c': // curveto command
            case 's': // shorthand/smooth curveto command
                // Scale all coordinates (x1, y1, x2, y2, x, y)
                for (var j = 0; j < coordinates.length; j += 2) {
                    coordinates[j] *= scaleX; // x-coordinate
                    coordinates[j + 1] *= scaleY; // y-coordinate
                }
                break;
            case 'q': // quadratic Bézier curveto command
                // Scale all coordinates (x1, y1, x, y)
                for (var j = 0; j < coordinates.length; j += 2) {
                    coordinates[j] *= scaleX; // x-coordinate
                    coordinates[j + 1] *= scaleY; // y-coordinate
                }
                break;
            case 'a': // elliptical arc command
                // Scale rx and ry (radii), x-axis-rotation, x and y
                coordinates[0] *= scaleX; // rx
                coordinates[1] *= scaleY; // ry
                coordinates[5] *= scaleX; // x-coordinate
                coordinates[6] *= scaleY; // y-coordinate
                break;
        }

        // Update the coordinates back into the command
        commands[i] = commandLetter + coordinates.join(' ');
    }

    // Join the commands back into a single path data string
    return commands.join(' ');
}


function lightUpRandomStar() {
    var randomIndex = Math.floor(Math.random() * 19) + 1; // Generate a random index between 1 and 21
    var starId = 'stea_' + randomIndex;
    document.getElementById(starId).style.transformOrigin = 'center center';
    document.getElementById(starId).style.transition = 'transform 0.5s, filter 0.5s'; // Add transition property
    document.getElementById(starId).style.filter = 'brightness(150%)'; // Increase brightness to simulate lighting
    document.getElementById(starId).style.transform = 'scale(1.1) '; // Scale up the star to 1.3 times its size and adjust position
    setTimeout(function() {
      document.getElementById(starId).style.filter = 'brightness(100%)'; // Reset brightness after 500ms
      document.getElementById(starId).style.transform = 'scale(1)'; // Reset the scale after 500ms
    }, 1000);
  }


  setInterval(lightUpRandomStar, 1500);

function lightUpMoon() {
    var moon = document.getElementById('moon')
    moon.style.transformOrigin = 'center center';
    moon.style.transition = 'transform 0.5s, filter 0.5s'; // Add transition property
    moon.style.filter = 'brightness(150%)'; // Increase brightness to simulate lighting
    setTimeout(function() {
        moon.style.filter = 'brightness(100%)'; // Reset brightness after 500ms
         // Reset the scale after 500ms
      }, 2500);
  }

  setInterval(lightUpMoon, 5000);


//a doua pagina


setTimeout(() => {
    const circle1 = document.getElementById('circle1');
const circle2 = document.getElementById('circle2');
const circle3 = document.getElementById('circle3');
const circle4 = document.getElementById('circle4');



function getRandomPosition(circle) {
    let x, y;
  
    if (['circle1', 'circle4'].includes(circle.id)) {
      // Spawn on the white side
      x = Math.random() * (window.innerWidth / 2 - circle.offsetWidth); // Adjusted for circle size
      y = Math.random() * (window.innerHeight - circle.offsetHeight); // Adjusted for circle size
    } else {
      // Spawn on the black side
      x = (Math.random() * (window.innerWidth / 2 - circle.offsetWidth)) + (window.innerWidth / 2); // Adjusted for circle size and position
      y = Math.random() * (window.innerHeight - circle.offsetHeight); // Adjusted for circle size
    }
  
    return { x, y };
  }

  const circles = [circle1, circle2, circle3, circle4];

circles.forEach(circle => {
    const newPosition = getRandomPosition(circle);
    circle.style.left = newPosition.x + 'px';
    circle.style.top = newPosition.y + 'px';
    moveCircleContinuously(circle);
});

function moveCircleContinuously(circle) {
    let direction = getRandomDirection();
    const speed = 1.5 ; // Adjust as needed

    function move() {
        const result = calculateNewPosition(circle, direction, speed);
        let newPosition = result.position;
        direction = result.direction;
        circle.style.left = newPosition.x + 'px';
        circle.style.top = newPosition.y + 'px';
        requestAnimationFrame(move);
    }

    move();
}

function getRandomDirection() {
    const directions = ['upleft', 'upright', 'downleft', 'downright'];
    return directions[Math.floor(Math.random() * directions.length)];
}

function calculateNewPosition(circle, direction, speed) {
    const currentPosition = {
        x: parseFloat(circle.style.left),
        y: parseFloat(circle.style.top)
    };

    switch (direction) {
        case 'up':
            currentPosition.y -= speed;
            break;
        case 'down':
            currentPosition.y += speed;
            break;
        case 'left':
            currentPosition.x -= speed;
            break;
        case 'right':
            currentPosition.x += speed;
            break;
        case 'upleft':
            currentPosition.x -= speed;
            currentPosition.y -= speed;
            break;
        case 'upright':
            currentPosition.x += speed;
            currentPosition.y -= speed;
            break;
        case 'downleft':
            currentPosition.x -= speed;
            currentPosition.y += speed;
            break;
        case 'downright':
            currentPosition.x += speed;
            currentPosition.y += speed;
            break;
    }

    const parent = circle.parentElement;
    const parentRect = parent.getBoundingClientRect();
    const circleRect = circle.getBoundingClientRect();

    if (currentPosition.x < parentRect.left) {
        currentPosition.x = parentRect.left;
        direction = reflectDirection(direction, 'left');
    }
    if (currentPosition.x + circleRect.width > parentRect.right) {
        currentPosition.x = parentRect.right - circleRect.width;
        direction = reflectDirection(direction, 'right');
    }
    if (currentPosition.y < parentRect.top) {
        currentPosition.y = parentRect.top;
        direction = reflectDirection(direction, 'up');
    }
    if (currentPosition.y + circleRect.height > parentRect.bottom) {
        currentPosition.y = parentRect.bottom - circleRect.height;
        direction = reflectDirection(direction, 'down');
    }

    return { position: currentPosition, direction: direction };
}

function reflectDirection(direction, boundary) {
    switch (boundary) {
        case 'up':
        case 'down':
            if (direction.includes('up')) {
                return direction.replace('up', 'down');
            } else if (direction.includes('down')) {
                return direction.replace('down', 'up');
            }
            break;
        case 'left':
        case 'right':
            if (direction.includes('left')) {
                return direction.replace('left', 'right');
            } else if (direction.includes('right')) {
                return direction.replace('right', 'left');
            }
            break;
    }
    return direction;
}
},2000)

const cardContainer = document.getElementById('servicii-card-container');
const cards = document.querySelectorAll('.servicii-card');
let currentCardIndex = 0;
const section = document.getElementById('servicii');
const nextSection = document.getElementById('blockudoku');
const previousSection = document.getElementById('despre_noi');

const hammer = new Hammer(section);
hammer.get('swipe').set({ direction: Hammer.DIRECTION_UP | Hammer.DIRECTION_DOWN });

hammer.on('swipe', function(ev) {
  if (ev.direction === Hammer.DIRECTION_UP) {
    handleSwipe('up');
  } else if (ev.direction === Hammer.DIRECTION_DOWN) {
    handleSwipe('down');
  }
});

const cardNumberElement = document.getElementById('card-number');

function updateCardNumber(index, total) {
  cardNumberElement.textContent = `${index + 1} / ${total}`;
}

function handleSwipe(direction) {
  if (direction === 'up' && currentCardIndex < cards.length) {
    // Swipe up logic
    updateCardNumber(currentCardIndex, cards.length);
    animateCard(currentCardIndex, 'up');
    currentCardIndex++;
  } else if (direction === 'down' && currentCardIndex > 0) {
    // Swipe down logic
    updateCardNumber(currentCardIndex-2, cards.length);
    animateCard(currentCardIndex-1, 'down');
    currentCardIndex--;
  } else if (direction === 'down' && currentCardIndex === 0) {
    // Scroll to the previous section if on the first card
    scrollToPreviousSection();
  } else {
    // Scroll to the next section if on the last card
    scrollToNextSection();
  }
}

function animateCard(index, direction) {
  const card = cards[index];
  if (direction == "up"){
  card.classList.add('swipe-animation');}
  else if (direction == "down"){
    card.classList.remove('swipe-animation')
    card.classList.add('swipe-down')
    setTimeout(()=>card.classList.remove('swipe-down'),300);
  }
}

function scrollToPreviousSection() {
    previousSection.scrollIntoView({ behavior: 'smooth' });
}

function scrollToNextSection() {
  nextSection.scrollIntoView({ behavior: 'smooth' });
}

