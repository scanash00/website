document.addEventListener("DOMContentLoaded", function() {
    const userId = "827389583342698536";
    const apiUrl = `https://api.lanyard.rest/v1/users/${userId}`;
    const discordStatusDiv = document.getElementById("discord-status");

    async function fetchDiscordStatus() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (response.ok) {
                updateDiscordStatus(data);
            } else {
                throw new Error(data.error || "Failed to fetch status");
            }
        } catch (error) {
            console.error("Error fetching Discord status:", error);
            discordStatusDiv.innerHTML = "<p>Failed to load Discord status.</p>";
            setDotColor("red");
        }
    }

    function updateDiscordStatus(data) {
        const discordData = data.data;
        const isOnline = discordData.discord_status !== "offline";
        const activities = discordData.activities;
        
        let statusText = `<span id="status-dot" class="status-dot"></span> ${isOnline ? "Online" : "Offline"}`;
        
        if (activities && activities.length > 0) {
            const playingActivity = activities.find(activity => activity.type === 0); 
            if (playingActivity) {
                statusText += `<br>Currently Playing: ${playingActivity.name}`;
            }
            const spotifyActivity = activities.find(activity => activity.type === 2); 
            if (spotifyActivity && spotifyActivity.assets && spotifyActivity.assets.large_text) {
                statusText += `<br>Listening to: ${spotifyActivity.assets.large_text}`;
                if (spotifyActivity.assets.small_text) {
                    statusText += ` - ${spotifyActivity.assets.small_text}`; 
                }
            }
        }

        discordStatusDiv.innerHTML = statusText;
        setDotColor(isOnline ? "green" : "red");
    }

    function setDotColor(color) {
        const statusDot = document.getElementById("status-dot");
        if (statusDot) {
            statusDot.style.backgroundColor = color;
        }
    }

    fetchDiscordStatus();
    setInterval(fetchDiscordStatus, 5000);
});
