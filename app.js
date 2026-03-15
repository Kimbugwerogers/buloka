//fetches data from localhost url /api/place and converts it from json
// and creates html elements for each item.

async function getPlaces(){
    try{
        //fetch data from api
        const response = await fetch('http://localhost:3000/api/place');
        const data = await response.json();

        //select the container
        const container = document.getElementById('places-container');
        container.innerHTML = ''; //Clear the  Loading text

        //loop throgh your data and create html for each entry
        data.forEach(place => {
            const placeElemet = document.createElement('div');
            placeElemet.classList.add('place-card');

            //adjust place.name based on your actual database column names
            placeElemet.innerHTML = `
                <h3>${place.placeName}</h3>
                <p>${place.managerName || 'No manager name provide'}</p>
                <p>${place.managerContact || 'No manager contact provide,'}</p>
                <p>${place.locationName || 'No location name provide,'}</p>
                <div class="stars">${'★'.repeat(place.ratingNumber)}${'☆'.repeat(5-place.ratingNumber)}</div>
            `;
            placeElemet.addEventListener('click', ()=> location.href = `addPlace.html?id=${encodeURIComponent(place.id)}`);
            container.appendChild(placeElemet);
        });
    } catch(error){
        console.error('Error fetching data:', error);
        document.getElementById('places-container').innerText = 'Failed to load data';
    }
    
}

//run the function when the page loads
getPlaces();

const placeForm = document.getElementById('place-form');
placeForm.addEventListener('submit', async(e)=>{
    e.preventDefault(); //stop page from refreshing

    //get data from inputs
    const newPlace ={
        managerName:document.getElementById('managerName').value,
        managerContact:document.getElementById('managerContact').value,
        placeName:document.getElementById('placeName').value,
        locationName:document.getElementById('locationName').value,
        ratingNumber:document.getElementById('ratingNumber').value
    };
    try{
        const response = await fetch('http://localhost:3000/api/place',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(newPlace)
        });
        if(response.ok){
            alert('Place added successfully');
            placeForm.reset(); // clear the form
            getPlaces(); //refresh the list automatically
        }
    }catch(error){
        console.error('error saving place:', error);
    }
});


 