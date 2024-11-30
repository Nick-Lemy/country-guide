const country = document.getElementById('countrySearch');
const btn = document.getElementById('searchButton');
const countryDescription = document.getElementById('countryDescription');
const flag = document.getElementById('flag');
const capital = document.getElementById('capital');
const population = document.getElementById('population');
const currency = document.getElementById('currency');
const language = document.getElementById('languages');
const region = document.getElementById('region');

// add event listener to the  Search button
btn.addEventListener('click', () => {
    const countryName = country.value;

    // Fetch country data from the server
    fetch(`/api/country/${countryName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Country not found');
            }
            return response.json();
        })
        .then(data => {
            const cap = data.capital[0];
            const pop = data.population.toLocaleString();
            const currencies = Object.values(data.currencies)
                .map(currency => `${currency.name} (${currency.symbol})`)
                .join(", ");

            const reg = data.region;
            const languages = Object.values(data.languages).join(", ");

            // Update my DOM
            capital.innerHTML = cap;
            population.innerHTML = pop + " people";
            currency.innerHTML = currencies;
            language.innerHTML = languages;
            region.innerHTML = reg;
            flag.innerHTML = `<img src="${data.flag}" alt="Flag of ${countryName}" width="100%" height="100%">`;

            // Prepare data for the description request
            const descriptionText = `Describe ${countryName} (that has ${cap} as a capital (in case for Congo you can confuse Congo-Brazzaville and Kinshasa)) in maximum of 80 words. And your last sentence has to be something fun about the country.`;

            // Fetch AI-generated description
            return fetch('/api/describe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: descriptionText }),
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to generate description');
            }
            return response.json();
        })
        .then(result => {
            countryDescription.innerHTML = result["candidates"][0]["content"]["parts"][0]['text'];
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message || 'Something went wrong');
        });
});