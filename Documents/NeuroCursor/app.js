window.onload = function () {
    if (typeof clm === "undefined") {
        console.error("clmtrackr is not loaded properly.");
        return;
    }

    console.log("clmtrackr loaded successfully.");

    // Initialize clmtrackr
    const tracker = new clm.tracker();

    try {
        tracker.init(); // Ensure this runs only if tracker is defined
    } catch (error) {
        console.error("Error initializing tracker:", error);
        return;
    }

    // Create the video element for webcam feed
    const video = document.createElement("video");
    video.width = 640;
    video.height = 480;
    document.body.appendChild(video);

    // Set up webcam and start video stream
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    }).then(stream => {
        video.srcObject = stream;
        video.play();
        tracker.start(video);
    }).catch(err => {
        console.error("Error accessing webcam: ", err);
    });

    // Function to start calibration process
    function startCalibration() {
        if (!tracker) {
            console.error("Tracker not initialized properly.");
            return;
        }

        tracker.start(video);
        console.log("Calibration started...");

        document.getElementById("calibration-status").innerText = 
            "Calibration in progress... Follow the dots on the screen!";
    }

    // Function to update cursor based on eye coordinates
    function updateCursor() {
        const positions = tracker.getCurrentPosition();
        if (positions && positions.length > 0) {
            const eyeX = positions[27][0]; 
            const eyeY = positions[27][1]; 

            gsap.to("#custom-cursor", {
                x: eyeX - 10,
                y: eyeY - 10,
                duration: 0.2,
                ease: "power2.out"
            });

            document.getElementById("cursor-x").innerText = Math.round(eyeX);
            document.getElementById("cursor-y").innerText = Math.round(eyeY);
        }

        requestAnimationFrame(updateCursor);
    }

    // Start tracking loop
    updateCursor();

    // Blink Detection
    let lastBlinkTime = 0;
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            let now = new Date().getTime();
            if (now - lastBlinkTime > 300) {
                document.getElementById("blink-status").innerText = "Blinked!";
                lastBlinkTime = now;
            }
        }
    });

    // Attach event listener after DOM is loaded
    document.getElementById("start-calibration").addEventListener("click", startCalibration);
};
