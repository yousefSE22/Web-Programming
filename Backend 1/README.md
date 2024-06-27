# B1 Scraper
When it comes to my code, it contains three main js files; a scraper.mjs which is a module class including all the logic for the scraping methods such as calendars, movies, bar reservations, etc. The reservations.js class is in charge of collecting all the data we got in the scraping process and then displaying it to the user. Finally, index.js imports both these classes and runs them using their main methods, while taking the argument(url) from the user.

# How to run the app:
After cloning the repository, you have to install the dependencies and then you can run the app.
1. **Install Dependencies:**
   ```bash
   npm install


# Running the Applicaiton:
Use npm start with your desired url:
npm start <URL>

An example could be:
npm start https://courselab.lnu.se/scraper-site-1/
