🌦️ Async Weather Tracker

A simple web-based weather application that allows users to search for real-time weather information by city name and view their search history.

🚀 Features
🔍 Search weather by city name
🌡️ Displays:
Temperature (°C)
Humidity (%)
Wind Speed (m/s)
🕘 Search history with quick access buttons
⚡ Asynchronous API calls using fetch and async/await
❌ Error handling for invalid city names
🛠️ Technologies Used
HTML5
CSS3
JavaScript (ES6)
OpenWeatherMap API
📂 Project Structure
index.html   # Main application file (HTML + CSS + JS)
⚙️ How It Works
User enters a city name in the input field
On form submission:
A request is sent to the OpenWeatherMap API
If successful:
Weather data is displayed in a card format
City is added to search history
Clicking a history button reloads saved weather data
🔑 API Configuration

This project uses the OpenWeatherMap API.

In the script section:

let API_KEY = "YOUR_API_KEY";
