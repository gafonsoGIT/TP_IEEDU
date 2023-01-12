const loadPlaces = function() {
    const places = [{
        name: 'Hall entrada',
        lat: '41.694207',
        lng: '-8.8474122',
    }]
    return places;
  }
  
  window.onload = () => {
      const scene = document.querySelector('a-scene');
  
      // first get current user location
      return navigator.geolocation.getCurrentPosition(function () {
  
          // than use it to load from remote APIs some places nearby
          loadPlaces()
              .then((places) => {
                  places.forEach((place) => {
                      const latitude = place.lat;
                      const longitude = place.lng;
  
                      // add place icon
                      const icon = document.createElement('a-image');
                      icon.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
                      icon.setAttribute('name', place.name);
                      icon.setAttribute('src', '../assets/map-marker.png');
  
                      // for debug purposes, just show in a bigger scale, otherwise I have to personally go on places...
                      icon.setAttribute('scale', '20, 20');
  
                      icon.addEventListener('loaded', () => window.dispatchEvent(new CustomEvent('gps-entity-place-loaded')));
  
                      const clickListener = function(ev) {
                          ev.stopPropagation();
                          ev.preventDefault();
              
                          const name = ev.target.getAttribute('name');
              
                          const el = ev.detail.intersection && ev.detail.intersection.object.el;
              
                          if (el && el === ev.target) {
                              const label = document.createElement('span');
                              const container = document.createElement('div');
                              container.setAttribute('id', 'place-label');
                              label.innerText = name;
                              container.appendChild(label);
                              document.body.appendChild(container);
              
                              setTimeout(() => {
                                  container.parentElement.removeChild(container);
                              }, 1500);
                          }
                      };
              
                      icon.addEventListener('click', clickListener);
  
                      scene.appendChild(icon);
                  });
              })
      },
          (err) => console.error('Error in retrieving position', err),
          {
              enableHighAccuracy: true,
              maximumAge: 0,
              timeout: 27000,
          }
      );
  };