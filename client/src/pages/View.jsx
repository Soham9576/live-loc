import { useParams } from "react-router-dom";
import { socket } from "../utils/connectSocket";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });


function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

function View() {
  const { id: pathId } = useParams(); 
  const [location, setLocation] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
  
    socket.connect();

    
    socket.on("connect", () => {
      console.log(" Viewer socket connected:", socket.id);
      setIsConnected(true);
      
     
      socket.emit("req-location", { id: pathId });

     
      socket.on("get-location", (data) => {
        console.log("📥 Received location update:", data);
        if (data?.coords) {
          setLocation({
            latitude: data.coords.latitude,
            longitude: data.coords.longitude,
          });
        }
      });
    });

    
    socket.on("disconnect", () => {
      console.log("Viewer socket disconnected.");
      setIsConnected(false);
      setLocation(null); 
    });


    
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("get-location");
      socket.disconnect();
    };
  }, [pathId]); 

  return (
    <div className="h-full w-full text-center p-4">
      <h1 className="text-2xl font-bold mb-2">Live Location Viewer</h1>
      <h2 className="mb-4">Tracking Sharer ID: <strong>{pathId}</strong></h2>

      {!isConnected && <p className="text-red-500 mb-2">Connecting to server...</p>}
      {isConnected && !location && <p className="text-red-500 mb-2">Waiting for location...</p>}
      {isConnected && location && <p className="mb-2 text-green-600 font-semibold">Live Location Active!</p>}

     
      <div className="mb-4 p-2 bg-gray-100 rounded text-left text-sm">
        <p className="font-semibold">Debug Info:</p>
        <pre>
          Latitude: {location ? location.latitude.toFixed(15) : "N/A"}{"\n"}
          Longitude: {location ? location.longitude.toFixed(15) : "N/A"}
        </pre>
      </div>

      {/* Map and "Current Location" paragraph only show when location data is available */}
      {location && (
        <>
          <p className="mb-2 text-green-600 font-semibold">
            Current Location: Lat {location.latitude.toFixed(15)}, Lng {location.longitude.toFixed(15)}
          </p>

          <MapContainer
            center={[location.latitude, location.longitude]}
            zoom={16}
            scrollWheelZoom={true}
            style={{ height: "80vh", width: "80vw", margin: "auto" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={[location.latitude, location.longitude]} />
            <RecenterMap lat={location.latitude} lng={location.longitude} />
          </MapContainer>
        </>
      )}
    </div>
  );
}

export default View;