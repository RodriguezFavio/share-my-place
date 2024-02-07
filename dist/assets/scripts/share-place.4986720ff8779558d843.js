(() => {
  'use strict';
  class e {
    constructor(e, t) {
      (this.fallbackText = t),
        (this.contentTemplateEl = document.getElementById(e)),
        (this.modalTemplateEl = document.getElementById('modal-template'));
    }
    show() {
      if ('content' in document.createElement('template')) {
        const e = document.importNode(this.modalTemplateEl.content, !0);
        (this.modalElement = e.querySelector('.modal')),
          (this.backdropElement = e.querySelector('.backdrop'));
        const t = document.importNode(this.contentTemplateEl.content, !0);
        this.modalElement.appendChild(t),
          document.body.insertAdjacentElement('afterbegin', this.modalElement),
          document.body.insertAdjacentElement(
            'afterbegin',
            this.backdropElement
          );
      } else alert(this.fallbackText);
    }
    hide() {
      this.modalElement &&
        (document.body.removeChild(this.modalElement),
        document.body.removeChild(this.backdropElement),
        (this.modalElement = null),
        (this.backdropElement = null));
    }
  }
  class t {
    constructor(e) {
      this.render(e);
    }
    render(e) {
      if (!google)
        return void alert(
          'Could not load maps library - please try again later'
        );
      const t = new google.maps.Map(document.getElementById('map'), {
        center: e,
        zoom: 16,
      });
      new google.maps.Marker({ position: e, map: t });
    }
  }
  const o = 'AIzaSyBDaeWicvigtP9xPv919E-RNoxfvC-Hqik';
  new (class {
    constructor() {
      const e = document.querySelector('form'),
        t = document.getElementById('locate-btn');
      (this.shareBtn = document.getElementById('share-btn')),
        t.addEventListener('click', this.locateUserHandler.bind(this)),
        this.shareBtn.addEventListener('click', this.sharePlaceHandler),
        e.addEventListener('submit', this.findAddressHandler.bind(this));
    }
    sharePlaceHandler() {
      const e = document.getElementById('share-link');
      navigator.clipboard
        ? navigator.clipboard
            .writeText(e.value)
            .then(() => {
              alert('Copied into clipboard!');
            })
            .catch((t) => {
              console.log(t), e.select();
            })
        : e.select();
    }
    selectPlace(e, o) {
      this.map ? this.map.render(e) : (this.map = new t(e)),
        fetch('http://localhost:3000/add-location', {
          method: 'POST',
          body: JSON.stringify({ address: o, lat: e.lat, lng: e.lng }),
          headers: { 'Content-Type': 'application/json' },
        })
          .then((e) => {
            e.json();
          })
          .then((e) => {
            const t = e.locId;
            (this.shareBtn.disable = !1),
              (document.getElementById('share-link').value = ''
                .concat(location.origin, '/my-place?location=')
                .concat(t));
          });
    }
    locateUserHandler() {
      if (!navigator.geolocation)
        return void alert(
          'Location feature is not available in your browser - please user a more mordern browser!'
        );
      const t = new e(
        'loading-modal-content',
        'Loading location - please wait'
      );
      t.show(),
        navigator.geolocation.getCurrentPosition(
          async (e) => {
            const a = { lat: e.coords.latitude, lng: e.coords.longitude },
              n = await (async (e) => {
                const t = await fetch(
                  'https://maps.googleapis.com/maps/api/geocode/json?latlng='
                    .concat(e.lat, ',')
                    .concat(e.lng, '&key=')
                    .concat(o)
                );
                if (!t.ok)
                  throw new Error('Failed to fetch address. Please try again!');
                const a = await t.json();
                if (a.error_message) throw new Error(a.error_message);
                return a.results[0].formatted_address;
              })(a);
            t.hide(), this.selectPlace(a, n);
          },
          (e) => {
            t.hide(),
              alert(
                'Could not locate you unfortunately. Please enter an address manually!'
              );
          }
        );
    }
    async findAddressHandler(t) {
      t.preventDefault();
      const a = t.target.querySelector('input').value;
      if (!a || 0 === a.trim().length)
        return void alert('Invalid address entered - please try again!');
      const n = new e(
        'loading-modal-content',
        'Loading location - please wait!'
      );
      n.show();
      try {
        const e = await (async (e) => {
          const t = encodeURI(e),
            a = await fetch(
              'https://maps.googleapis.com/maps/api/geocode/json?address='
                .concat(t, '&key=')
                .concat(o)
            );
          if (!a.ok)
            throw new Error('Failed to fetch coordinates. Please try again!');
          const n = await a.json();
          if (n.error_message) throw new Error(n.error_message);
          return n.results[0].geometry.location;
        })(a);
        this.selectPlace(e, a);
      } catch (e) {
        alert(e.message);
      }
      n.hide();
    }
  })();
})();
