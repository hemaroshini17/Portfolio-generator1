document.getElementById('generate-button').addEventListener('click', async function() {
    const name = document.getElementById('name').value;
    const bio = document.getElementById('bio').value;
    const skills = document.getElementById('skills').value.split(',');
    const projects = document.getElementById('projects').value.split(',');
    const contact = document.getElementById('contact').value;  // Get contact details

    const photoFile = document.getElementById('photo').files[0];
    const resumeFile = document.getElementById('resume').files[0];
    const backgroundFile = document.getElementById('background').files[0];

    if (!name || !bio || !skills.length || !projects.length || !photoFile || !resumeFile || !backgroundFile || !contact) {
        alert("Please complete all fields and upload necessary files.");
        return;
    }

    const [photoUrl, resumeUrl, backgroundUrl] = await Promise.all([
        readFileAsDataURL(photoFile),
        readFileAsDataURL(resumeFile),
        readFileAsDataURL(backgroundFile)
    ]);

    const portfolioContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${name}'s Portfolio</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            <link rel="stylesheet" href="styles.css">
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 0; box-sizing: border-box; }
                .full-screen-section { 
                    height: 100vh; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    background-image: url('${backgroundUrl}'); 
                    background-size: cover; 
                    color: white; 
                    text-align: center;
                    max-width: 100%; 
                    overflow-x: hidden; 
                }
                .container {
                    max-width: 100%; 
                    padding: 0 15px; 
                }
                img { width: 150px; border-radius: 50%; }
                .progress { background-color: #f1f1f1; }
                .progress-bar { background-color: #007bff; }
                @media print {
                    .navbar {
                        display: none;  /* Hide navbar in PDF */
                    }
                    body {
                        margin: 0;
                        padding: 0;
                    }
                    .full-screen-section {
                        height: auto;
                    }
                }
            </style>
        </head>
        <body>
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
                <div class="container mt-2">
                    <a class="navbar-brand" href="#">${name}'s Portfolio</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav ms-auto">
                            <li class="nav-item"><a class="nav-link" href="#home">Home</a></li>
                            <li class="nav-item"><a class="nav-link" href="#about">About</a></li>
                            <li class="nav-item"><a class="nav-link" href="#skills">Skills</a></li>
                            <li class="nav-item"><a class="nav-link" href="#projects">Projects</a></li>
                            <li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>
                            <button class="btn btn-light" onclick="downloadPortfolio()">Download Portfolio</button>
                        </ul>
                    </div>
                </div>
            </nav>

            <section id="home" class="full-screen-section mt-2">
                <div class="containermt-2">
                    <div class="row align-items-center">
                        <div class="col-md-4">
                            <img src="${photoUrl}" alt="Profile Photo">
                        </div>
                        <div class="col-md-8">
                            <h1>Hello, I'm ${name}</h1>
                        </div>
                    </div>
                </div>
            </section>

            <section id="about" class="full-screen-section mt-2">
                <div class="container">
                    <h2>About Me</h2>
                    <p>${bio}</p>
                    <a href="${resumeUrl}" download="${name}_resume.pdf" target="_blank" class="btn btn-primary">View Resume</a>
                </div>
            </section>

            <section id="skills" class="full-screen-section mt-2">
                <div class="container mt-2">
                    <h2>Skills</h2>
                    ${skills.map(skill => `
                        <div class="mb-2">
                            <label>${skill.trim()}</label>
                            <div class="progress">
                                <div class="progress-bar" role="progressbar" style="width: ${Math.floor(Math.random() * 100)}%">
                                    ${skill.trim()}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>

            <section id="projects" class="full-screen-section mt-2">
                <div class="container mt-2">
                    <h2>Projects</h2>
                    <ul class="list-unstyled">
                        ${projects.map(project => `<li><a href="${project.trim()}" target="_blank">${project.trim()}</a></li>`).join('')}
                    </ul>
                </div>
            </section>

            <section id="contact" class="full-screen-section mt-2">
                <div class="container mt-2">
                    <h2>Contact</h2>
                    <p>${contact}</p>
                </div>
            </section>

            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.min.js"></script>

            <script>
                function downloadPortfolio() {
                    const element = document.body;

                    const options = {
                        margin: [10, 10, 10, 10], // Set margin (top, right, bottom, left)
                        filename: '${name}_Portfolio.pdf',
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: { 
                            scale: 4,  
                            height: document.body.scrollHeight
                        },
                        jsPDF: { 
                            unit: 'mm', 
                            format: [508, 286], 
                            orientation: 'portrait'
                        }
                    };

                    html2pdf().from(element).set(options).save();
                }
            </script>

        </body>
        </html>
    `;

    const newTab = window.open();
    newTab.document.write(portfolioContent);
    newTab.document.close();
});

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
