// PHANTOM GUARD - Main JavaScript

// Show a message to the user
function showMessage(message) {
    alert(message);
}

// Activate Lost Mode (Prototype simulation)
function activateLostMode() {
    const confirmAction = confirm(
        "Are you sure you want to activate Lost Mode?"
    );

    if (confirmAction) {
        document.getElementById("lostStatus").textContent = "ACTIVE";

        document.getElementById("lostStatus").style.color = "#ef4444";

        alert(
            "Lost Mode activated successfully!\n\n" +
            "Demo status: Your device has been marked as LOST.\n" +
            "This prototype does not remotely lock or track another phone."
        );
    }
}

// Get location with the user's permission
function getLocation() {

    const result = document.getElementById("locationResult");

    if (!navigator.geolocation) {
        result.textContent =
            "Location is not supported by this browser.";
        return;
    }

    result.textContent = "Requesting location permission...";

    navigator.geolocation.getCurrentPosition(

        function (position) {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const accuracy = position.coords.accuracy;

            const mapURL =
                "https://www.google.com/maps?q=" +
                latitude + "," + longitude;

            const time = new Date().toLocaleString();

            result.innerHTML = `
                <div>
                    <p><strong>Location Report Received</strong></p>
                    <br>
                    <p>Latitude: ${latitude.toFixed(6)}</p>
                    <p>Longitude: ${longitude.toFixed(6)}</p>
                    <p>Accuracy: Approximately ${Math.round(accuracy)} metres</p>
                    <p>Reported: ${time}</p>
                    <br>
                    <a href="${mapURL}" target="_blank" rel="noopener noreferrer"
                       style="color:#22d3ee;">
                       Open Location in Google Maps →
                    </a>
                </div>
            `;
        },

        function (error) {

            let message = "Unable to get location.";

            if (error.code === 1) {
                message = "Location permission was denied.";
            } else if (error.code === 2) {
                message = "Location information is unavailable.";
            } else if (error.code === 3) {
                message = "Location request timed out.";
            }

            result.textContent = message;
        },

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }
    );
}
// PHANTOM GUARD - Device Registration
// PHANTOM GUARD - Persistent Device Registration

const deviceForm = document.getElementById("deviceForm");
const deviceContainer = document.querySelector(".device-section");

let savedDevices = JSON.parse(
    localStorage.getItem("phantomDevices") || "[]"
);

function updateDeviceCount() {
    const count = 1 + savedDevices.length;

    document.getElementById("deviceCount").textContent =
        String(count).padStart(2, "0");

    document.querySelector(".device-badge").textContent =
        "● " + count + (count === 1 ? " Device" : " Devices");
}

function displayDevice(device) {

    const card = document.createElement("div");
    card.className = "device-card";

    const icon = document.createElement("div");
    icon.className = "phone-icon";
    icon.textContent = "📱";

    const info = document.createElement("div");
    info.className = "device-info";

    const heading = document.createElement("h3");
    heading.textContent = device.name;

    const description = document.createElement("p");
    description.textContent = device.model + " • Demo Record";

    const id = document.createElement("span");
    id.className = "device-id";
    id.textContent = "ID: " + device.id;

    info.append(heading, description, id);

    const status = document.createElement("div");
    status.className = "device-status";

    const dot = document.createElement("span");
    dot.className = "online-dot";

    const statusText = document.createElement("span");
    statusText.textContent = "Registered";

    status.append(dot, statusText);
    card.append(icon, info, status);

    deviceContainer.appendChild(card);
}

// Restore previously registered devices
savedDevices.forEach(displayDevice);
updateDeviceCount();

// Register new device
if (deviceForm) {

    deviceForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document.getElementById("deviceName").value.trim();
        const model = document.getElementById("deviceModel").value.trim();

        if (!name || !model) return;

        const newDevice = {
            name: name,
            model: model,
            id: "PG-" + Date.now()
        };

        savedDevices.push(newDevice);

        localStorage.setItem(
            "phantomDevices",
            JSON.stringify(savedDevices)
        );

        displayDevice(newDevice);
        updateDeviceCount();

        document.getElementById("registrationResult").textContent =
            "✓ Device registered and saved successfully!";

        deviceForm.reset();
    });
}

// PHANTOM GUARD - LOST DEVICE INCIDENT MANAGEMENT

/* PHANTOM GUARD - INCIDENT MANAGEMENT FIX */

const incidentDeviceSelect = document.getElementById("lostDevice");
const incidentDescriptionInput =
    document.getElementById("incidentDescription");
const incidentResultBox =
    document.getElementById("incidentResult");
const incidentSubmitButton =
    document.getElementById("submitIncidentBtn");

let phantomIncidents = JSON.parse(
    localStorage.getItem("phantomIncidents") || "[]"
);

function initializeIncidentModule() {

    if (!incidentDeviceSelect) return;

    // Load devices saved in Local Storage
    const devices = JSON.parse(
        localStorage.getItem("phantomDevices") || "[]"
    );

    const allDevices = [
        {
            name: "My Android Phone",
            model: "Android Device",
            id: "PG-2026-001"
        },
        ...devices
    ];

    incidentDeviceSelect.replaceChildren();

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select your device";
    incidentDeviceSelect.appendChild(placeholder);

    allDevices.forEach(function(device) {

        const option = document.createElement("option");
        option.value = device.id;
        option.textContent = device.name + " (" + device.model + ")";

        incidentDeviceSelect.appendChild(option);
    });

    displayPhantomIncidents();
}

function displayPhantomIncidents() {

    incidentResultBox.replaceChildren();

    phantomIncidents.forEach(function(incident) {

        const card = document.createElement("div");
        card.className = "incident-record";

        const heading = document.createElement("h3");
        heading.textContent = "Incident: " + incident.id;

        const device = document.createElement("p");
        device.textContent = "Device: " + incident.deviceName;

        const description = document.createElement("p");
        description.textContent = "Description: " + incident.description;

        const date = document.createElement("p");
        date.textContent = "Reported: " + incident.date;

        const label = document.createElement("label");
        label.textContent = "Incident Status: ";

        const select = document.createElement("select");

        ["Reported", "Under Review", "Resolved"].forEach(function(value) {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = value;
            option.selected = incident.status === value;
            select.appendChild(option);
        });

        select.addEventListener("change", function() {

            incident.status = select.value;

            localStorage.setItem(
                "phantomIncidents",
                JSON.stringify(phantomIncidents)
            );
        });

        label.appendChild(select);

        card.append(heading, device, description, date, label);
        incidentResultBox.appendChild(card);
    });
}

function submitPhantomIncident() {

    const deviceId = incidentDeviceSelect.value;
    const description = incidentDescriptionInput.value.trim();

    if (!deviceId) {
        alert("Please select a registered device.");
        return;
    }

    if (!description) {
        alert("Please enter an incident description.");
        return;
    }

    const devices = JSON.parse(
        localStorage.getItem("phantomDevices") || "[]"
    );

    const allDevices = [
        {
            name: "My Android Phone",
            model: "Android Device",
            id: "PG-2026-001"
        },
        ...devices
    ];

    const selectedDevice = allDevices.find(
        device => device.id === deviceId
    );

    if (!selectedDevice) {
        alert("Device not found.");
        return;
    }

    const incident = {
        id: "INC-" + Date.now(),
        deviceName: selectedDevice.name,
        description: description,
        status: "Reported",
        date: new Date().toLocaleString()
    };

    phantomIncidents.push(incident);

    localStorage.setItem(
        "phantomIncidents",
        JSON.stringify(phantomIncidents)
    );

    incidentDescriptionInput.value = "";

    displayPhantomIncidents();

    alert("Incident report saved successfully!");
}

if (incidentSubmitButton) {
    incidentSubmitButton.addEventListener(
        "click",
        submitPhantomIncident
    );
}

initializeIncidentModule();

// PHANTOM GUARD - CURRENT LOCATION CENTER
// PHANTOM GUARD - LOCATION BUTTONS FIX

function requestDeviceLocation(resultBox) {

    if (!navigator.geolocation) {
        resultBox.textContent =
            "Location is not supported by this browser.";
        return;
    }

    resultBox.textContent = "Getting your location...";

    navigator.geolocation.getCurrentPosition(

        function(position) {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const accuracy = position.coords.accuracy;

            const mapURL =
                "https://www.google.com/maps?q=" + lat + "," + lon;

            resultBox.replaceChildren();

            const heading = document.createElement("h3");
            heading.textContent = "✓ Location Report Received";

            const latitude = document.createElement("p");
            latitude.textContent = "Latitude: " + lat.toFixed(6);

            const longitude = document.createElement("p");
            longitude.textContent = "Longitude: " + lon.toFixed(6);

            const accuracyText = document.createElement("p");
            accuracyText.textContent =
                "Accuracy: Approximately " +
                Math.round(accuracy) + " metres";

            const time = document.createElement("p");
            time.textContent =
                "Last Updated: " + new Date().toLocaleString();

            const link = document.createElement("a");
            link.href = mapURL;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = "Open in Google Maps";

            resultBox.append(
                heading,
                latitude,
                longitude,
                accuracyText,
                time,
                link
            );
        },

        function(error) {

            const messages = {
                1: "Location permission denied. Allow location access.",
                2: "Location information unavailable.",
                3: "Location request timed out."
            };

            resultBox.textContent =
                messages[error.code] || "Unable to get location.";
        },

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }
    );
}


// First Location Button
const currentButton =
    document.getElementById("getCurrentLocationBtn");

const currentResult =
    document.getElementById("currentLocationResult");

if (currentButton && currentResult) {
    currentButton.addEventListener("click", function() {
        requestDeviceLocation(currentResult);
    });
}


// Second Location Button
const quickButton =
    document.getElementById("getQuickLocationBtn");

const quickResult =
    document.getElementById("locationResult");

if (quickButton && quickResult) {
    quickButton.addEventListener("click", function() {
        requestDeviceLocation(quickResult);
    });
}