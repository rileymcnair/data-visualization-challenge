# Data Visualization: Weather

Pulls weather data from the Los Angeles's 2 week forecast and 1 week history from Visual Crossing API and displays on dashboard. Requests to fetch the data from the API will be limited to once every npm run start (if you use my api key) to avoid fees.

Coming soon: Soundcloud song recommendations based on the weather for the day

Technologies used: Node, Express, EJS templates, Jest, JavaScript, HTML, CSS

  
## Get it running

 1. Clone this repository on your machine: ```git clone https://github.com/rileymcnair/data-visualization-challenge.git```
 2. Open terminal with working directory: ```data-visualization-challenge```
 3. Install dependencies ```npm install``` (must have node installed on machine for npm)
 4. Add API Key in .env file
 5. Start the server ```npm run start```
 6. Check it out at ```http://localhost:3030```
        - there is a slight chance port 3030 may already be in use on your machine, if so change the ```PORT``` variable in ```app.js```

