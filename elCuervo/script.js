// window.addEventListener('load', function () {
//     let raven = document.querySelector('.raven-container');
//     raven.classList.add('loaded');
// });
// window.addEventListener('load', function () {
//     // Delay adding the 'loaded' class for 2 seconds
//     setTimeout(function() {
//         let content = document.getElementsByClassName("content");
//         content[0].classList.add('loaded');
//     }, 1800); // 2000 milliseconds = 2 seconds
//   });



//prima pagina
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;

    let egypt_bg = document.getElementById("egypt-background");
    let home = document.getElementById("acasa");
    let about = document.getElementById("despre_noi");
    let servicii = document.getElementById('servicii');
    let blockudoku = document.getElementById('blockudoku');
    let contact = document.getElementById('contact');
    egypt_bg.style.width = `${screenWidth}px`;
    egypt_bg.style.height = `${screenHeight}px`;
    home.style.width = `${screenWidth}px`;
    home.style.height = `${screenHeight}px`;
    about.style.width = `${screenWidth}px`;
    about.style.height = `${screenHeight}px`;
    servicii.style.width = `${screenWidth}px`;
    servicii.style.height = `${screenHeight}px`;
    blockudoku.style.width = `${screenWidth}px`;
    blockudoku.style.height = `${screenHeight}px`;
    contact.style.width = `${screenWidth}px`;
    contact.style.height = `${screenHeight}px`;




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

  function moveCircle(circle) {
    const newPosition = getRandomPosition(circle);
    circle.style.left = newPosition.x + 'px';
    circle.style.top = newPosition.y + 'px';
  }

  [circle1, circle2, circle3, circle4].map(x=> moveCircle(x));


//pagina de servicii 

