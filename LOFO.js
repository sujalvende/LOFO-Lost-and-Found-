// Data storage using localStorage
    let foundItems = JSON.parse(localStorage.getItem('foundItems')) || [];
    let lostItems = JSON.parse(localStorage.getItem('lostItems')) || [];

    // DOM elements
    const reportForm = document.getElementById('reportForm');
    const foundContainer = document.getElementById('foundItemsContainer');
    const lostContainer = document.getElementById('lostItemsContainer');
    const claimModal = document.getElementById('claimModal');
    const confirmClaimBtn = document.getElementById('confirmClaim');
    const cancelClaimBtn = document.getElementById('cancelClaim');
    
    let itemToRemove = null;

    // Load items on page load
    window.addEventListener('load', function() {
      renderItems(foundContainer, foundItems);
      renderItems(lostContainer, lostItems);
    });

    // Handle form submission
    reportForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const itemType = document.getElementById('itemType').value;
      const itemName = document.getElementById('itemName').value;
      const itemTypeDetail = document.getElementById('itemTypeDetail').value;
      const itemLocation = document.getElementById('itemLocation').value;
      const itemDate = document.getElementById('itemDate').value;
      const itemImage = document.getElementById('itemImage').files[0];
      
      if (!itemImage) {
        alert('Please select an image!');
        return;
      }
      
      // Convert image to base64 for localStorage
      const reader = new FileReader();
      reader.onload = function(e) {
        const imageData = e.target.result;
        
        const item = {
          id: Date.now(),
          name: itemName,
          type: itemTypeDetail,
          location: itemLocation,
          date: itemDate,
          image: imageData // base64 string
        };
        
        // Add to appropriate array and save to localStorage
        if (itemType === 'found') {
          foundItems.unshift(item);
          localStorage.setItem('foundItems', JSON.stringify(foundItems));
          renderItems(foundContainer, foundItems);
        } else if (itemType === 'lost') {
          lostItems.unshift(item);
          localStorage.setItem('lostItems', JSON.stringify(lostItems));
          renderItems(lostContainer, lostItems);
        }
        
        reportForm.reset();
        alert('Item reported successfully!');
      };
      reader.readAsDataURL(itemImage);
    });

    // Render items function
    function renderItems(container, items) {
      container.innerHTML = '';
      
      items.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'found-lost-box';
        itemCard.innerHTML = `
          <div class="found-lost-info">
            <div class="found-lost-image" style="background-image: url(${item.image})"></div>
            <p><strong>Name:</strong> ${item.name}</p>
            <p><strong>Type:</strong> ${item.type}</p>
            <p><strong>Location:</strong> ${item.location}</p>
            <p><strong>Date:</strong> ${item.date}</p>
            <button class="claim-btn" onclick="openClaimModal(${item.id})">Claim Item</button>
          </div>
        `;
        container.appendChild(itemCard);
      });
    }

    // Claim functionality
    function openClaimModal(itemId) {
      itemToRemove = itemId;
      claimModal.style.display = 'flex';
    }

    confirmClaimBtn.addEventListener('click', function() {
      if (itemToRemove) {
        // Remove from found items
        foundItems = foundItems.filter(item => item.id !== itemToRemove);
        localStorage.setItem('foundItems', JSON.stringify(foundItems));
        renderItems(foundContainer, foundItems);
        
        // Remove from lost items
        lostItems = lostItems.filter(item => item.id !== itemToRemove);
        localStorage.setItem('lostItems', JSON.stringify(lostItems));
        renderItems(lostContainer, lostItems);
        
        closeClaimModal();
        alert('Item claimed successfully!');
      }
    });

    cancelClaimBtn.addEventListener('click', closeClaimModal);
    
    function closeClaimModal() {
      claimModal.style.display = 'none';
      itemToRemove = null;
    }

    // Close modal when clicking outside
    claimModal.addEventListener('click', function(e) {
      if (e.target === claimModal) {
        closeClaimModal();
      }
    });