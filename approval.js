/* approval code */
        async function loadPending() {
            const response = await fetch('http://localhost:3000/api/admin/pending');
            const data = await response.json();
            const container = document.getElementById('pending-container');
            container.innerHTML ='';

            data.forEach(place =>{
                const div = document.createElement('div');
                const cardColor = place.is_approved === 1 ? 'lightgreen' : 'lightcoral';

                div.className = 'place-card';
                div.style.backgroundColor = cardColor;
                div.innerHTML = `
                    <h3>${place.placeName}</h3>
                    <p>${place.managerName || 'No manager name provide'}</p>
                    <p>${place.managerContact || 'No manager contact provide,'}</p>
                    <p>${place.locationName || 'No location name provide,'}</p>
                    <div class="stars">${'★'.repeat(place.ratingNumber)}${'☆'.repeat(5-place.ratingNumber)}</div>

                    <div class="admin-actions">
                        <button onclick="toggleStatus(${place.id}, ${place.is_approved})">${place.is_approved === 0 ? 'Approve':'Unapprove'}</button>
                        <button onclick="openEditModal(${place.id})">Edit</button>
                    </div>
                `;
                container.appendChild(div);
            });
        }

                //function to toggle status
        async function toggleStatus(event,id, currentStatus) {
            if(event)event.preventDefault(); //stop the refresh
            const newStatus = currentStatus === 0 ? 1:0;
            
            await fetch(`http://localhost:3000/api/place/status/${id}`,{
                method: 'PUT',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({is_approved:newStatus})
            });

           loadPending();  //refresh list
        }


        //open modal and populate data
        //function openEditModal(id,Manger_Name,Manger_Contact,Place_Name,Location_Name,Rating_Number){
        function openEditModal(id){
            document.getElementById('edit-id').value = id;
            document.getElementById('managerName').value = Manger_Name;
            document.getElementById('managerContact').value =Manger_Contact;
            document.getElementById('placename').value = Place_Name;
            document.getElementById('locationName').value = Location_Name;
            document.getElementById('ratingNumber').value = Rating_Number;
            document.getElementById('editModal').style.display = 'block';
        }
        function closeModal(){
            document.getElementById('editModal').style.display = 'none';
        }
        //save the edited data
        async function saveEdit() {
            const id = document.getElementById('edit-id').value;
            const updateData = {
            Manger_Name:document.getElementById('managerName').value,
            Manger_Contact:document.getElementById('managerContact').value,
            Place_Name:document.getElementById('placename').value,
            Location_Name:document.getElementById('locationName').value,
            Rating_Number:document.getElementById('ratingNumber').value
            };

             await fetch(`http://localhost:3000/api/place/edit/${id}`,{
                    method:'PUT',
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify(updateData)
                });
            closeModal();
            loadPending(); //refresh list without page reload
        }
    

/*
        async function approvePlace(id){
            try{
                const response = await fetch(`http://localhost:3000/api/place/approve/${id}`,{
                    method: 'PUT'
                });

                if(response.ok){
                    alert("Place Approved!");
                    //call list-loading function again
                    //to remove the now-approved item from the pending list
                   // loadPending();
                }else{
                    alert("failed to approve");
                }
            }catch(error){
                console.error("Error:", error);
            }
        } 
*/
        loadPending();


