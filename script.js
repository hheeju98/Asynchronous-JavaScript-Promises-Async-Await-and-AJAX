'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

const renderCountry = function (data, className = '') {
  const html = `
  <article class="country ${className}">
        <img class="country__img" src="${data.flag}" />
        <div class="country__data">
          <h3 class="country__name">${data.name}</h3>
          <h4 class="country__region">${data.region}</h4>
          <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)} people</p>
          <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
          <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
        </div >
      </article >
      `;
  // ${(+data.population / 1000000).toFixed(1)} +는 숫자형이 아닐경우 숫자형으로 변환 (Number랑 동일 역할)
  countriesContainer.insertAdjacentHTML('beforeend', html);
  //countriesContainer.style.opacity = 1;
};
const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
}
/*
const getCountryAndNeighbour = function (country) {

  // Ajax call country 1
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v2/name/${country}`);
  request.send();

  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText); // = JSON.parse(this.responseText)[0];
    console.log(data);

    // Render country 1
    renderCountry(data);

    //Get neighbour country (2)
    const neighbour = data.borders?.[0];
    // const [neighbour] = data.borders;

    if (!neighbour) return;

    // Ajax call country 2
    const request2 = new XMLHttpRequest();
    request2.open('GET', `https://restcountries.com/v2/alpha/${neighbour}`);
    request2.send();

    request2.addEventListener('load', function () {
      const data2 = JSON.parse(this.responseText);
      console.log(data2);

      renderCountry(data2, 'neighbour');
    })
  });
};

getCountryAndNeighbour('usa');


setTimeout(() => {
  console.log('1 second passed');
  setTimeout(() => {
    console.log('2 second passed');
    setTimeout(() => {
      console.log('3 second passed');
      setTimeout(() => {
        console.log('4 second passed');
      }, 1000);
    }, 1000);
  }, 1000);
}, 1000); // callback hell
*/

// const request = new XMLHttpRequest();
// request.open('GET', `https://restcountries.com/v2/name/${country}`);
// request.send();

const request = fetch('https://restcountries.com/v2/name/portugal');
console.log(request);

/*
const getCountryData = function (country) {
  fetch(`https://restcountries.com/v2/name/${country}`).then(function (response) {
    console.log(response);
    return response.json(); // json()은 fetch를 통해 응답받은 모든 데이터에 사용가능하고 json function은 새로운 promise를 리턴한다
  }).then(function (data) {
    console.log(data); // .then은 새로운 promise이기 때문에 다시 then을 써줌
    renderCountry(data[0]);
  })
}; //모든 promise는 then을 쓸 수 있다
*/

const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok)
      throw new Error(`${errorMsg} (${response.status})`);
    return response.json();
  });
};
/*
const getCountryData = function (country) {
  // Country1
  fetch(`https://restcountries.com/v2/name/${country}`)
    .then(response => {
      console.log(response, "response");
      if (!response.ok)
        throw new Error(`Country not found (${response.status})`)
      return response.json();
    })
    .then(data => {
      renderCountry(data[0]);
      //const neighbour = data[0].borders[0];
      const neighbour = "DSfsf";

      if (!neighbour) return;

      // Country2
      return fetch(`https://restcountries.com/v2/name/${neighbour}`);

    }).then(response => {
      if (!response.ok) throw new Error(`Country not found (${response.status})`);
      return response.json();
      // err => alert(err)
    })
    .then(data => renderCountry(data[0], 'neighbour'))
    .catch(err => {
      console.error(`${err} err occur !`);
      renderError(`Something went wrong ${err.message}. Try again!`)
    }) // chain의 모든 에러를 catch함, catch도 promise리턴함
    .finally(() => {
      countriesContainer.style.opacity = 1;
    })
};*/
const getCountryData = function (country) {
  // Country1
  getJSON(`https://restcountries.com/v2/name/${country}`, 'Country not found')
    .then(data => {
      renderCountry(data[0]);
      let neighbour = data[0].borders;
      if (!neighbour || neighbour == 'undefined') throw new Error('No neighbour found!');
      // Country2
      return getJSON(`https://restcountries.com/v2/name/${neighbour[0]}`, 'Country not found');
    })
    .then(data => renderCountry(data[0], 'neighbour'))
    .catch(err => {
      console.log(err, "err")
      console.error(`${err} err occur !`);
      renderError(`Something went wrong ${err.message}. Try again!`)
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    })
};

btn.addEventListener('click', function () {
  getCountryData('portugal');
});
//getCountryData('australia');




const whereAmI = function (lat, lng) {
  fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
    .then(res => {
      console.log(res, "res")
      if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`)
      return res.json();
    })
    .then(data => {
      console.log(data, "data")
      return fetch(`https://restcountries.com/v2/name/${data.country}`);
    })
    .then(res => {
      if (!res.ok) throw new Error(`Country not found (${res.status})`);
      return res.json();
    })
    .then(data => renderCountry(data[0]))
    .catch(err => console.log(`${err.message} !!`))
};

whereAmI(552.508, 13.381);
whereAmI(19.037, 72.873);
whereAmI(-33.955, 18.474);