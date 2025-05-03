function getRecommendations() {
    const skill = document.getElementById('skills').value.trim();

    if (!skill) {
        alert("Please enter or select a skill.");
        return;
    }

    const skillsArray = [skill];  // ✅ wrap it as array

    console.log("Skills entered:", skillsArray);

    fetch('http://localhost:5000/recommend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ skills: skillsArray })  // ✅ send as array
    })
    .then(response => response.json())
    .then(data => {
        console.log("Response data:", data);
        displayRecommendations(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function displayRecommendations(data) {
    const recommendationsDiv = document.getElementById('recommendations');
    recommendationsDiv.innerHTML = '';

    if (data.error || data.message) {
        recommendationsDiv.innerHTML = `<p>${data.error || data.message}</p>`;
        return;
    }

    data.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <h3>${product.name}</h3>
            <p><strong>Category:</strong> ${product.category}</p>
            <p><strong>Skills:</strong> ${product.skills.join(', ')}</p>
            <p><strong>Difficulty:</strong> ${product.difficulty}</p>
            <p><strong>Duration:</strong> ${product.duration}</p>
        `;
        recommendationsDiv.appendChild(productDiv);
    });
}

