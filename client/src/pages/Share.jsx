import { useEffect, useState } from "react";
import { FaLink } from "react-icons/fa";
import { socket } from "../utils/connectSocket";
import { ClientURL } from "../utils/constants";

function Share() {
  const [locationLink, setLocationLink] = useState("---");
  const [sharing, setSharing] = useState(false);
  const [watchId, setWatchId] = useState(null);

 
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
      
    };
  }, [watchId]);

  function startShare() {
    socket.connect();

    socket.once("connect", () => {
      setLocationLink(`${ClientURL}/view/${socket.id}`);
      setSharing(true);

      if ("geolocation" in navigator) {
        const id = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("update-location", {
              id: socket.id,
              coords: { latitude, longitude },
            });
            console.log(" sent location:", latitude, longitude);
          },
          (error) => {
            console.error("Geolocation error:", error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );

        setWatchId(id);
      } else {
        alert("Geolocation is not supported in this browser");
      }
    });
  }

  function stopShare() {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }

   
    socket.disconnect(); 
    setSharing(false);
    setLocationLink("---");
  }

  function copyText() {
    navigator.clipboard.writeText(locationLink).then(() => {
      alert("Share link copied to clipboard!");
    });
  }

  return (
    <div className="w-full h-full flex flex-col gap-16 justify-center mt-16">
      <button
        onClick={startShare}
        className={`mx-auto px-8 py-4 rounded-lg ${
          sharing ? "bg-green-100" : "bg-green-500"
        }`}
        disabled={sharing}
      >
        {sharing ? "Sharing..." : "Share your Location"}
      </button>

      <div className="flex flex-col text-center">
        <label>Your location link:</label>
        <div className="flex flex-row gap-2 mx-auto">
          <input
            value={locationLink}
            type="text"
            className="rounded-md py-2 px-4 border-none bg-slate-400 text-center"
            disabled
          />
          <button
            onClick={copyText}
            className="bg-blue-400 p-2 rounded-xl"
            disabled={!sharing}
          >
            <FaLink />
          </button>
        </div>
      </div>

      <button
        onClick={stopShare}
        className={`mx-auto px-8 py-4 rounded-lg ${
          sharing ? "bg-red-500" : "bg-red-100"
        }`}
        disabled={!sharing}
      >
        Stop Sharing
      </button>
    </div>
  );
}

export default Share;
