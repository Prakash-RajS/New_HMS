// // src/components/MapView.jsx
// import React, { useEffect, useState } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   Polyline,
// } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// // Fix icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
// });

// // Custom real-time ambulance icons with different statuses
// const createAmbulanceIcon = (status, isMoving = false) => {
//   const color =
//     status === "En Route"
//       ? "#0EFF7B"
//       : status === "Completed"
//       ? "#3B82F6"
//       : "#6B7280";

//   return L.divIcon({
//     className: `ambulance-marker ${isMoving ? "pulsating" : ""}`,
//     html: `
//       <div style="
//         background-color: ${color};
//         width: 32px;
//         height: 32px;
//         border-radius: 50%;
//         border: 3px solid white;
//         box-shadow: 0 4px 12px rgba(0,0,0,0.3);
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         position: relative;
//       ">
//         <div style="
//           color: white;
//           font-size: 14px;
//           font-weight: bold;
//         ">🚑</div>
//         ${
//           isMoving
//             ? `
//         <div style="
//           position: absolute;
//           top: -5px;
//           right: -5px;
//           width: 12px;
//           height: 12px;
//           background-color: #EF4444;
//           border-radius: 50%;
//           border: 2px solid white;
//         "></div>
//         `
//             : ""
//         }
//       </div>
//     `,
//     iconSize: [32, 32],
//     iconAnchor: [16, 16],
//   });
// };

// // Hospital icon
// const hospitalIcon = new L.Icon({
//   iconUrl: "https://img.icons8.com/fluency/48/hospital.png",
//   iconSize: [32, 32],
//   iconAnchor: [16, 32],
//   popupAnchor: [0, -32],
// });

// // Pickup location icon
// const pickupIcon = new L.Icon({
//   iconUrl: "https://img.icons8.com/fluency/48/place-marker.png",
//   iconSize: [28, 28],
//   iconAnchor: [14, 28],
//   popupAnchor: [0, -28],
// });

// // CSS for animations
// const mapStyles = `
//   @keyframes pulse {
//     0% { transform: scale(1); opacity: 1; }
//     50% { transform: scale(1.1); opacity: 0.8; }
//     100% { transform: scale(1); opacity: 1; }
//   }
//   @keyframes blink {
//     0%, 50% { opacity: 1; }
//     51%, 100% { opacity: 0; }
//   }
//   .pulsating {
//     animation: pulse 1.5s infinite;
//   }
//   .ambulance-marker.pulsating div:first-child {
//     animation: pulse 1.5s infinite;
//   }
//   .ambulance-marker.pulsating div:last-child {
//     animation: blink 1s infinite;
//   }
//   .pulsating-dot {
//     animation: pulse 1.5s infinite;
//   }
// `;

// const MapView = ({ units = [], trips = [], livePositions = {} }) => {
//   const [currentPositions, setCurrentPositions] = useState({});
//   const [routes, setRoutes] = useState({});
//   const [tripProgress, setTripProgress] = useState({});

//   // Vizag major locations with real coordinates
//   const [vizagLocations] = useState({
//     hospitals: [
//       {
//         id: 1,
//         name: "King George Hospital (KGH)",
//         position: [17.7062, 83.2977],
//         type: "Government Hospital",
//       },
//       {
//         id: 2,
//         name: "Care Hospital",
//         position: [17.7284, 83.3087],
//         type: "Multi-specialty Hospital",
//       },
//       {
//         id: 3,
//         name: "Apollo Hospital",
//         position: [17.7432, 83.2176],
//         type: "Super-specialty Hospital",
//       },
//       {
//         id: 4,
//         name: "Seven Hills Hospital",
//         position: [17.7538, 83.2264],
//         type: "Multi-specialty Hospital",
//       },
//       {
//         id: 5,
//         name: "Gitam Hospital",
//         position: [17.7654, 83.3398],
//         type: "Private Hospital",
//       },
//     ],
//     areas: [
//       {
//         id: 1,
//         name: "Gajuwaka",
//         position: [17.698, 83.2015],
//         type: "Industrial Area",
//       },
//       {
//         id: 2,
//         name: "NAD Kotha Road",
//         position: [17.73, 83.217],
//         type: "Junction Area",
//       },
//       {
//         id: 3,
//         name: "Dwaraka Nagar",
//         position: [17.735, 83.308],
//         type: "Residential Area",
//       },
//       {
//         id: 4,
//         name: "Seethammadhara",
//         position: [17.74, 83.25],
//         type: "Residential Area",
//       },
//       {
//         id: 5,
//         name: "Madhurawada",
//         position: [17.78, 83.35],
//         type: "Suburban Area",
//       },
//       {
//         id: 6,
//         name: "Simhachalam",
//         position: [17.766, 83.25],
//         type: "Temple Area",
//       },
//     ],
//   });

//   // Vizag center coordinates
//   const VIZAG_CENTER = [17.73, 83.25];

//   // Update positions when livePositions change
//   useEffect(() => {
//     setCurrentPositions((prev) => ({
//       ...prev,
//       ...livePositions,
//     }));
//   }, [livePositions]);

//   // Function to get coordinates for a location name
//   const getCoordinatesForLocation = (locationName) => {
//     if (!locationName) return null;

//     const name = locationName.toLowerCase();

//     // Check hospitals
//     const hospital = vizagLocations.hospitals.find(
//       (h) =>
//         h.name.toLowerCase().includes(name) ||
//         name.includes(h.name.toLowerCase().split(" ")[0])
//     );
//     if (hospital) return hospital.position;

//     // Check areas
//     const area = vizagLocations.areas.find(
//       (a) =>
//         a.name.toLowerCase().includes(name) ||
//         name.includes(a.name.toLowerCase().split(" ")[0])
//     );
//     if (area) return area.position;

//     // Default fallbacks based on common names
//     const defaultLocations = {
//       gajuwaka: [17.698, 83.2015],
//       nad: [17.73, 83.217],
//       kgh: [17.7062, 83.2977],
//       dwaraka: [17.735, 83.308],
//       seethammadhara: [17.74, 83.25],
//       madhurawada: [17.78, 83.35],
//       simhachalam: [17.766, 83.25],
//       apollo: [17.7432, 83.2176],
//       care: [17.7284, 83.3087],
//       seven: [17.7538, 83.2264],
//       gitam: [17.7654, 83.3398],
//     };

//     for (const [key, coords] of Object.entries(defaultLocations)) {
//       if (name.includes(key)) {
//         return coords;
//       }
//     }

//     return null;
//   };

//   // Generate routes for active trips
//   useEffect(() => {
//     const generateRoutesForActiveTrips = () => {
//       const newRoutes = {};
//       const newProgress = {};

//       console.log(
//         "🔍 Generating routes for active trips:",
//         trips.filter((trip) => trip.status === "En Route" && trip.unit)
//       );

//       trips
//         .filter((trip) => trip.status === "En Route" && trip.unit)
//         .forEach((trip) => {
//           const unitNumber = trip.unit.unit_number;

//           // Get pickup and destination coordinates
//           const pickupCoords = getCoordinatesForLocation(trip.pickup_location);
//           const destinationCoords = getCoordinatesForLocation(trip.destination);

//           console.log(`📍 Trip ${trip.trip_id}:`, {
//             pickup: trip.pickup_location,
//             pickupCoords,
//             destination: trip.destination,
//             destinationCoords,
//           });

//           if (pickupCoords && destinationCoords) {
//             // Create a realistic route with multiple points
//             const routePoints = generateRoutePoints(
//               pickupCoords,
//               destinationCoords
//             );

//             newRoutes[unitNumber] = {
//               path: routePoints,
//               pickup: pickupCoords,
//               destination: destinationCoords,
//               pickupName: trip.pickup_location,
//               destinationName: trip.destination,
//               tripId: trip.trip_id,
//               unitNumber: unitNumber,
//             };

//             // Initialize progress
//             newProgress[unitNumber] = {
//               currentPoint: 0,
//               totalPoints: routePoints.length,
//               progress: 0,
//             };

//             console.log(`✅ Route created for ${unitNumber}:`, {
//               from: trip.pickup_location,
//               to: trip.destination,
//               points: routePoints.length,
//             });
//           } else {
//             console.log(
//               `❌ Could not find coordinates for trip ${trip.trip_id}:`,
//               {
//                 pickup: trip.pickup_location,
//                 pickupFound: !!pickupCoords,
//                 destination: trip.destination,
//                 destinationFound: !!destinationCoords,
//               }
//             );
//           }
//         });

//       setRoutes(newRoutes);
//       setTripProgress(newProgress);
//       console.log("🗺️ Final routes:", newRoutes);
//     };

//     generateRoutesForActiveTrips();
//   }, [trips]); // Removed currentPositions from dependencies to avoid infinite loops

//   // Generate realistic route points between two locations
//   const generateRoutePoints = (start, end) => {
//     const points = [start];

//     // Add intermediate points for realistic routing
//     const numIntermediatePoints = 15; // More points for smoother route
//     for (let i = 1; i <= numIntermediatePoints; i++) {
//       const ratio = i / (numIntermediatePoints + 1);
//       const lat = start[0] + (end[0] - start[0]) * ratio;
//       const lng = start[1] + (end[1] - start[1]) * ratio;

//       // Add slight curve to make it look more natural
//       const curve = Math.sin(ratio * Math.PI) * 0.005;
//       points.push([lat + curve, lng + curve]);
//     }

//     points.push(end);
//     return points;
//   };

//   // Move ambulances along their routes
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setTripProgress((prev) => {
//         const updated = { ...prev };

//         Object.keys(updated).forEach((unitNumber) => {
//           const route = routes[unitNumber];
//           if (
//             route &&
//             updated[unitNumber].currentPoint < route.path.length - 1
//           ) {
//             updated[unitNumber].currentPoint += 0.5; // Adjust speed here
//             updated[unitNumber].progress =
//               (updated[unitNumber].currentPoint / route.path.length) * 100;
//           }
//         });

//         return updated;
//       });
//     }, 1000); // Update every 1 second for smoother movement

//     return () => clearInterval(interval);
//   }, [routes]);

//   // Get ambulance current position based on route progress
//   const getAmbulancePosition = (ambulance) => {
//     const unitNumber = ambulance.unit_number;
//     const currentPos = currentPositions[unitNumber];
//     const route = routes[unitNumber];
//     const progress = tripProgress[unitNumber];

//     // If we have live WebSocket position, use it (highest priority)
//     if (currentPos) {
//       return [currentPos.lat, currentPos.lng];
//     }

//     // If we have route progress, use it
//     if (route && progress) {
//       const pointIndex = Math.min(
//         Math.floor(progress.currentPoint),
//         route.path.length - 1
//       );
//       return route.path[pointIndex];
//     }

//     // If ambulance has a trip but no route yet, use pickup location
//     if (ambulance.trip) {
//       const pickupCoords = getCoordinatesForLocation(
//         ambulance.trip.pickup_location
//       );
//       if (pickupCoords) {
//         return pickupCoords;
//       }
//     }

//     // Final fallback - random position in Vizag
//     return [
//       VIZAG_CENTER[0] + (Math.random() - 0.5) * 0.03,
//       VIZAG_CENTER[1] + (Math.random() - 0.5) * 0.03,
//     ];
//   };

//   // Get all ambulances with their positions and status
//   const getAllAmbulances = () => {
//     return units.map((unit) => {
//       const currentTrip = trips.find(
//         (t) =>
//           t.unit?.unit_number === unit.unit_number && t.status === "En Route"
//       );

//       const position = getAmbulancePosition({
//         ...unit,
//         trip: currentTrip,
//       });

//       const route = routes[unit.unit_number];
//       const progress = tripProgress[unit.unit_number];
//       const isMoving = !!(
//         currentTrip &&
//         route &&
//         progress &&
//         progress.currentPoint < route.path.length - 1
//       );

//       return {
//         ...unit,
//         position,
//         trip: currentTrip,
//         isMoving,
//         status: currentTrip ? "En Route" : "Ready",
//         route,
//         progress,
//       };
//     });
//   };

//   const ambulances = getAllAmbulances();

//   console.log(
//     "🚑 Ambulances status:",
//     ambulances.map((a) => ({
//       unit: a.unit_number,
//       isMoving: a.isMoving,
//       hasRoute: !!a.route,
//       position: a.position,
//     }))
//   );

//   return (
//     <div style={{ height: "100%", width: "100%", position: "relative" }}>
//       {/* Inject CSS styles */}
//       <style>{mapStyles}</style>

//       <MapContainer
//         center={VIZAG_CENTER}
//         zoom={12}
//         style={{ height: "100%", width: "100%" }}
//         className="rounded-xl"
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution="&copy; OpenStreetMap"
//         />

//         {/* Vizag Hospitals */}
//         {vizagLocations.hospitals.map((hospital) => (
//           <Marker
//             key={`hospital-${hospital.id}`}
//             position={hospital.position}
//             icon={hospitalIcon}
//           >
//             <Popup>
//               <div className="text-sm font-medium">
//                 <div className="font-bold text-blue-600">
//                   🏥 {hospital.name}
//                 </div>
//                 <div className="text-xs text-gray-600">{hospital.type}</div>
//               </div>
//             </Popup>
//           </Marker>
//         ))}

//         {/* Area Markers */}
//         {vizagLocations.areas.map((area) => (
//           <Marker
//             key={`area-${area.id}`}
//             position={area.position}
//             icon={pickupIcon}
//           >
//             <Popup>
//               <div className="text-sm font-medium">
//                 <div className="font-bold text-green-600">📍 {area.name}</div>
//                 <div className="text-xs text-gray-600">{area.type}</div>
//               </div>
//             </Popup>
//           </Marker>
//         ))}

//         {/* Trip Routes - Render ALL routes */}
//         {Object.entries(routes).map(([unitNumber, route]) => {
//           console.log(`🔄 Rendering route for ${unitNumber}:`, route.path);
//           return (
//             <React.Fragment key={unitNumber}>
//               <Polyline
//                 positions={route.path}
//                 color="#0EFF7B"
//                 weight={4}
//                 opacity={0.7}
//               />
//               {/* Pickup Marker */}
//               <Marker position={route.pickup} icon={pickupIcon}>
//                 <Popup>
//                   <div className="text-sm font-medium">
//                     <div className="font-bold text-orange-600">
//                       🔄 Pickup Point
//                     </div>
//                     <div>{route.pickupName}</div>
//                     <div className="text-xs text-gray-600">
//                       Trip: {route.tripId}
//                     </div>
//                     <div className="text-xs text-green-600">
//                       Unit: {route.unitNumber}
//                     </div>
//                   </div>
//                 </Popup>
//               </Marker>
//               {/* Destination Marker */}
//               <Marker position={route.destination} icon={hospitalIcon}>
//                 <Popup>
//                   <div className="text-sm font-medium">
//                     <div className="font-bold text-blue-600">
//                       🏥 Destination
//                     </div>
//                     <div>{route.destinationName}</div>
//                     <div className="text-xs text-gray-600">
//                       Trip: {route.tripId}
//                     </div>
//                   </div>
//                 </Popup>
//               </Marker>
//             </React.Fragment>
//           );
//         })}

//         {/* Ambulances */}
//         {ambulances.map((ambulance) => (
//           <Marker
//             key={ambulance.id}
//             position={ambulance.position}
//             icon={createAmbulanceIcon(ambulance.status, ambulance.isMoving)}
//           >
//             <Popup>
//               <div className="text-sm font-medium min-w-[220px]">
//                 <div
//                   className={`font-bold ${
//                     ambulance.status === "En Route"
//                       ? "text-green-600"
//                       : "text-gray-600"
//                   }`}
//                 >
//                   🚑 {ambulance.unit_number}
//                   {ambulance.isMoving && " 🔴 LIVE"}
//                 </div>

//                 <div className="mt-1">
//                   <span className="font-semibold">Status:</span>
//                   <span
//                     className={`ml-1 ${
//                       ambulance.status === "En Route"
//                         ? "text-green-600 font-bold"
//                         : "text-gray-600"
//                     }`}
//                   >
//                     {ambulance.status}
//                   </span>
//                 </div>

//                 {ambulance.trip && (
//                   <>
//                     <div className="mt-2 border-t pt-2">
//                       <div className="font-semibold text-purple-600">
//                         ACTIVE TRIP
//                       </div>
//                       <div>
//                         <span className="font-semibold">Trip:</span>{" "}
//                         {ambulance.trip.trip_id}
//                       </div>
//                       <div>
//                         <span className="font-semibold">From:</span>{" "}
//                         {ambulance.trip.pickup_location}
//                       </div>
//                       <div>
//                         <span className="font-semibold">To:</span>{" "}
//                         {ambulance.trip.destination}
//                       </div>
//                       <div>
//                         <span className="font-semibold">Patient:</span>{" "}
//                         {ambulance.trip.patient_id || "—"}
//                       </div>

//                       {ambulance.route && ambulance.progress && (
//                         <div className="mt-1 text-xs">
//                           <div className="w-full bg-gray-200 rounded-full h-1.5">
//                             <div
//                               className="bg-green-600 h-1.5 rounded-full"
//                               style={{
//                                 width: `${ambulance.progress.progress || 0}%`,
//                               }}
//                             ></div>
//                           </div>
//                           <div className="text-green-600 font-semibold mt-1">
//                             {Math.round(ambulance.progress.progress || 0)}%
//                             Complete
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </>
//                 )}

//                 {ambulance.route && (
//                   <div className="mt-1 text-xs text-blue-600">
//                     📍 Route: {ambulance.route.pickupName} →{" "}
//                     {ambulance.route.destinationName}
//                   </div>
//                 )}

//                 <div className="mt-1 text-xs text-gray-500">
//                   📍 Visakhapatnam, AP
//                 </div>
//               </div>
//             </Popup>
//           </Marker>
//         ))}

//         {/* Legend */}
//         <div className="leaflet-bottom leaflet-left font-[Helvetica]">
//           <div className="leaflet-control bg-gray-100/95 p-3 rounded-lg shadow-lg m-2">
//             <h4 className="font-bold text-sm mb-2">🚑 Vizag Live Tracking</h4>
//             <div className="space-y-1 text-xs">
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-green-500 rounded-full pulsating-dot"></div>
//                 <span>Ambulance En Route</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
//                 <span>Hospital</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
//                 <span>Pickup Location</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
//                 <span>Area Landmark</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div
//                   className="w-3 h-3 bg-green-500 rounded-full"
//                   style={{ opacity: 0.7 }}
//                 ></div>
//                 <span>Route Path</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </MapContainer>
//     </div>
//   );
// };

// export default MapView;
// src/components/MapView.jsx
import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom real-time ambulance icons with different statuses
const createAmbulanceIcon = (status, isMoving = false) => {
  const color =
    status === "En Route"
      ? "#0EFF7B"
      : status === "Completed"
      ? "#3B82F6"
      : "#6B7280";

  return L.divIcon({
    className: `ambulance-marker ${isMoving ? "pulsating" : ""}`,
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      ">
        <div style="
          color: white;
          font-size: 14px;
          font-weight: bold;
        ">🚑</div>
        ${
          isMoving
            ? `
        <div style="
          position: absolute;
          top: -5px;
          right: -5px;
          width: 12px;
          height: 12px;
          background-color: #EF4444;
          border-radius: 50%;
          border: 2px solid white;
        "></div>
        `
            : ""
        }
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Hospital icon
const hospitalIcon = new L.Icon({
  iconUrl: "https://img.icons8.com/fluency/48/hospital.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Pickup location icon
const pickupIcon = new L.Icon({
  iconUrl: "https://img.icons8.com/fluency/48/place-marker.png",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});

// CSS for animations and dark mode
// CSS for animations and dark mode
const mapStyles = `
  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
  .pulsating {
    animation: pulse 1.5s infinite;
  }
  .ambulance-marker.pulsating div:first-child {
    animation: pulse 1.5s infinite;
  }
  .ambulance-marker.pulsating div:last-child {
    animation: blink 1s infinite;
  }
  .pulsating-dot {
    animation: pulse 1.5s infinite;
  }
  
  /* Dark mode styles for popup content */
  .dark .leaflet-popup-content-wrapper {
    background-color: #1f2937 !important;
    color: #f3f4f6 !important;
    border: 1px solid #374151;
  }
  
  .dark .leaflet-popup-tip {
    background-color: #1f2937 !important;
    border-top: 1px solid #374151;
    border-left: 1px solid #374151;
  }
  
  .dark .leaflet-popup-content {
    color: #f3f4f6;
  }
  
  .dark .leaflet-popup-content .text-gray-600 {
    color: #9ca3af !important;
  }
  
  .dark .leaflet-popup-content .text-gray-500 {
    color: #9ca3af !important;
  }
  
  .dark .leaflet-popup-content .font-bold.text-blue-600 {
    color: #60a5fa !important;
  }
  
  .dark .leaflet-popup-content .font-bold.text-green-600 {
    color: #4ade80 !important;
  }
  
  .dark .leaflet-popup-content .font-bold.text-orange-600 {
    color: #fb923c !important;
  }
  
  .dark .leaflet-popup-content .font-semibold.text-purple-600 {
    color: #c084fc !important;
  }
  
  .dark .leaflet-popup-content .text-green-600 {
    color: #4ade80 !important;
  }
  
  .dark .leaflet-popup-content .text-blue-600 {
    color: #60a5fa !important;
  }
  
  .dark .leaflet-popup-content .text-xs {
    color: #9ca3af;
  }
  
  /* Dark mode styles for legend */
  .dark .leaflet-control {
    background-color: #1f2937 !important;
    color: #f3f4f6 !important;
    border: 1px solid #374151 !important;
  }
  
  .dark .leaflet-control h4 {
    color: #f3f4f6 !important;
  }
  
  .dark .leaflet-control span {
    color: #f3f4f6 !important;
  }
  
  .dark .leaflet-control .text-xs {
    color: #f3f4f6 !important;
  }
  
  /* Progress bar in dark mode */
  .dark .bg-gray-200 {
    background-color: #374151 !important;
  }
  
  .dark .bg-green-600 {
    background-color: #0EFF7B !important;
  }
  
  /* Make sure all text in legend is visible in dark mode */
  .dark .leaflet-control div,
  .dark .leaflet-control span,
  .dark .leaflet-control .space-y-1 div {
    color: #f3f4f6;
  }

  /* Dark mode styles for zoom controls */
  .dark .leaflet-control-zoom a {
    background-color: #1f2937 !important;
    color: #f3f4f6 !important;
    border-color: #374151 !important;
  }
  
  .dark .leaflet-control-zoom a:hover {
    background-color: #374151 !important;
    color: #0EFF7B !important;
  }
  
  .dark .leaflet-control-zoom {
    border: 1px solid #374151 !important;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3) !important;
  }
  
  .dark .leaflet-control-zoom-in,
  .dark .leaflet-control-zoom-out {
    text-decoration: none !important;
    font-weight: bold !important;
  }
  
  /* Style for the attribution text in dark mode */
  .dark .leaflet-control-attribution {
    background-color: rgba(31, 41, 55, 0.8) !important;
    color: #9ca3af !important;
    border-top: 1px solid #374151 !important;
  }
  
  .dark .leaflet-control-attribution a {
    color: #60a5fa !important;
  }
  
  .dark .leaflet-control-attribution a:hover {
    color: #0EFF7B !important;
  }
  
  /* Scale control in dark mode */
  .dark .leaflet-control-scale-line {
    background-color: rgba(31, 41, 55, 0.8) !important;
    color: #f3f4f6 !important;
    border-color: #374151 !important;
  }
`;

const MapView = ({ units = [], trips = [], livePositions = {} }) => {
  const [currentPositions, setCurrentPositions] = useState({});
  const [routes, setRoutes] = useState({});
  const [tripProgress, setTripProgress] = useState({});

  // Check if dark mode is active
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial dark mode
    setIsDarkMode(document.documentElement.classList.contains('dark'));
    
    // Listen for dark mode changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);

  // Vizag major locations with real coordinates
  const [vizagLocations] = useState({
    hospitals: [
      {
        id: 1,
        name: "King George Hospital (KGH)",
        position: [17.7062, 83.2977],
        type: "Government Hospital",
      },
      {
        id: 2,
        name: "Care Hospital",
        position: [17.7284, 83.3087],
        type: "Multi-specialty Hospital",
      },
      {
        id: 3,
        name: "Apollo Hospital",
        position: [17.7432, 83.2176],
        type: "Super-specialty Hospital",
      },
      {
        id: 4,
        name: "Seven Hills Hospital",
        position: [17.7538, 83.2264],
        type: "Multi-specialty Hospital",
      },
      {
        id: 5,
        name: "Gitam Hospital",
        position: [17.7654, 83.3398],
        type: "Private Hospital",
      },
    ],
    areas: [
      {
        id: 1,
        name: "Gajuwaka",
        position: [17.698, 83.2015],
        type: "Industrial Area",
      },
      {
        id: 2,
        name: "NAD Kotha Road",
        position: [17.73, 83.217],
        type: "Junction Area",
      },
      {
        id: 3,
        name: "Dwaraka Nagar",
        position: [17.735, 83.308],
        type: "Residential Area",
      },
      {
        id: 4,
        name: "Seethammadhara",
        position: [17.74, 83.25],
        type: "Residential Area",
      },
      {
        id: 5,
        name: "Madhurawada",
        position: [17.78, 83.35],
        type: "Suburban Area",
      },
      {
        id: 6,
        name: "Simhachalam",
        position: [17.766, 83.25],
        type: "Temple Area",
      },
    ],
  });

  // Vizag center coordinates
  const VIZAG_CENTER = [17.73, 83.25];

  // Update positions when livePositions change
  useEffect(() => {
    setCurrentPositions((prev) => ({
      ...prev,
      ...livePositions,
    }));
  }, [livePositions]);

  // Function to get coordinates for a location name
  const getCoordinatesForLocation = (locationName) => {
    if (!locationName) return null;

    const name = locationName.toLowerCase();

    // Check hospitals
    const hospital = vizagLocations.hospitals.find(
      (h) =>
        h.name.toLowerCase().includes(name) ||
        name.includes(h.name.toLowerCase().split(" ")[0])
    );
    if (hospital) return hospital.position;

    // Check areas
    const area = vizagLocations.areas.find(
      (a) =>
        a.name.toLowerCase().includes(name) ||
        name.includes(a.name.toLowerCase().split(" ")[0])
    );
    if (area) return area.position;

    // Default fallbacks based on common names
    const defaultLocations = {
      gajuwaka: [17.698, 83.2015],
      nad: [17.73, 83.217],
      kgh: [17.7062, 83.2977],
      dwaraka: [17.735, 83.308],
      seethammadhara: [17.74, 83.25],
      madhurawada: [17.78, 83.35],
      simhachalam: [17.766, 83.25],
      apollo: [17.7432, 83.2176],
      care: [17.7284, 83.3087],
      seven: [17.7538, 83.2264],
      gitam: [17.7654, 83.3398],
    };

    for (const [key, coords] of Object.entries(defaultLocations)) {
      if (name.includes(key)) {
        return coords;
      }
    }

    return null;
  };

  // Generate routes for active trips
  useEffect(() => {
    const generateRoutesForActiveTrips = () => {
      const newRoutes = {};
      const newProgress = {};

      console.log(
        "🔍 Generating routes for active trips:",
        trips.filter((trip) => trip.status === "En Route" && trip.unit)
      );

      trips
        .filter((trip) => trip.status === "En Route" && trip.unit)
        .forEach((trip) => {
          const unitNumber = trip.unit.unit_number;

          // Get pickup and destination coordinates
          const pickupCoords = getCoordinatesForLocation(trip.pickup_location);
          const destinationCoords = getCoordinatesForLocation(trip.destination);

          console.log(`📍 Trip ${trip.trip_id}:`, {
            pickup: trip.pickup_location,
            pickupCoords,
            destination: trip.destination,
            destinationCoords,
          });

          if (pickupCoords && destinationCoords) {
            // Create a realistic route with multiple points
            const routePoints = generateRoutePoints(
              pickupCoords,
              destinationCoords
            );

            newRoutes[unitNumber] = {
              path: routePoints,
              pickup: pickupCoords,
              destination: destinationCoords,
              pickupName: trip.pickup_location,
              destinationName: trip.destination,
              tripId: trip.trip_id,
              unitNumber: unitNumber,
            };

            // Initialize progress
            newProgress[unitNumber] = {
              currentPoint: 0,
              totalPoints: routePoints.length,
              progress: 0,
            };

            console.log(`✅ Route created for ${unitNumber}:`, {
              from: trip.pickup_location,
              to: trip.destination,
              points: routePoints.length,
            });
          } else {
            console.log(
              `❌ Could not find coordinates for trip ${trip.trip_id}:`,
              {
                pickup: trip.pickup_location,
                pickupFound: !!pickupCoords,
                destination: trip.destination,
                destinationFound: !!destinationCoords,
              }
            );
          }
        });

      setRoutes(newRoutes);
      setTripProgress(newProgress);
      console.log("🗺️ Final routes:", newRoutes);
    };

    generateRoutesForActiveTrips();
  }, [trips]); // Removed currentPositions from dependencies to avoid infinite loops

  // Generate realistic route points between two locations
  const generateRoutePoints = (start, end) => {
    const points = [start];

    // Add intermediate points for realistic routing
    const numIntermediatePoints = 15; // More points for smoother route
    for (let i = 1; i <= numIntermediatePoints; i++) {
      const ratio = i / (numIntermediatePoints + 1);
      const lat = start[0] + (end[0] - start[0]) * ratio;
      const lng = start[1] + (end[1] - start[1]) * ratio;

      // Add slight curve to make it look more natural
      const curve = Math.sin(ratio * Math.PI) * 0.005;
      points.push([lat + curve, lng + curve]);
    }

    points.push(end);
    return points;
  };

  // Move ambulances along their routes
  useEffect(() => {
    const interval = setInterval(() => {
      setTripProgress((prev) => {
        const updated = { ...prev };

        Object.keys(updated).forEach((unitNumber) => {
          const route = routes[unitNumber];
          if (
            route &&
            updated[unitNumber].currentPoint < route.path.length - 1
          ) {
            updated[unitNumber].currentPoint += 0.5; // Adjust speed here
            updated[unitNumber].progress =
              (updated[unitNumber].currentPoint / route.path.length) * 100;
          }
        });

        return updated;
      });
    }, 1000); // Update every 1 second for smoother movement

    return () => clearInterval(interval);
  }, [routes]);

  // Get ambulance current position based on route progress
  const getAmbulancePosition = (ambulance) => {
    const unitNumber = ambulance.unit_number;
    const currentPos = currentPositions[unitNumber];
    const route = routes[unitNumber];
    const progress = tripProgress[unitNumber];

    // If we have live WebSocket position, use it (highest priority)
    if (currentPos) {
      return [currentPos.lat, currentPos.lng];
    }

    // If we have route progress, use it
    if (route && progress) {
      const pointIndex = Math.min(
        Math.floor(progress.currentPoint),
        route.path.length - 1
      );
      return route.path[pointIndex];
    }

    // If ambulance has a trip but no route yet, use pickup location
    if (ambulance.trip) {
      const pickupCoords = getCoordinatesForLocation(
        ambulance.trip.pickup_location
      );
      if (pickupCoords) {
        return pickupCoords;
      }
    }

    // Final fallback - random position in Vizag
    return [
      VIZAG_CENTER[0] + (Math.random() - 0.5) * 0.03,
      VIZAG_CENTER[1] + (Math.random() - 0.5) * 0.03,
    ];
  };

  // Get all ambulances with their positions and status
  const getAllAmbulances = () => {
    return units.map((unit) => {
      const currentTrip = trips.find(
        (t) =>
          t.unit?.unit_number === unit.unit_number && t.status === "En Route"
      );

      const position = getAmbulancePosition({
        ...unit,
        trip: currentTrip,
      });

      const route = routes[unit.unit_number];
      const progress = tripProgress[unit.unit_number];
      const isMoving = !!(
        currentTrip &&
        route &&
        progress &&
        progress.currentPoint < route.path.length - 1
      );

      return {
        ...unit,
        position,
        trip: currentTrip,
        isMoving,
        status: currentTrip ? "En Route" : "Ready",
        route,
        progress,
      };
    });
  };

  const ambulances = getAllAmbulances();

  console.log(
    "🚑 Ambulances status:",
    ambulances.map((a) => ({
      unit: a.unit_number,
      isMoving: a.isMoving,
      hasRoute: !!a.route,
      position: a.position,
    }))
  );

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      {/* Inject CSS styles */}
      <style>{mapStyles}</style>

      <MapContainer
        center={VIZAG_CENTER}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        className="rounded-xl"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />

        {/* Vizag Hospitals */}
        {vizagLocations.hospitals.map((hospital) => (
          <Marker
            key={`hospital-${hospital.id}`}
            position={hospital.position}
            icon={hospitalIcon}
          >
            <Popup>
              <div className="text-sm font-medium">
                <div className="font-bold text-blue-600 dark:text-blue-400">
                  🏥 {hospital.name}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{hospital.type}</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Area Markers */}
        {vizagLocations.areas.map((area) => (
          <Marker
            key={`area-${area.id}`}
            position={area.position}
            icon={pickupIcon}
          >
            <Popup>
              <div className="text-sm font-medium">
                <div className="font-bold text-green-600 dark:text-green-400">📍 {area.name}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{area.type}</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Trip Routes - Render ALL routes */}
        {Object.entries(routes).map(([unitNumber, route]) => {
          console.log(`🔄 Rendering route for ${unitNumber}:`, route.path);
          return (
            <React.Fragment key={unitNumber}>
              <Polyline
                positions={route.path}
                color="#0EFF7B"
                weight={4}
                opacity={0.7}
              />
              {/* Pickup Marker */}
              <Marker position={route.pickup} icon={pickupIcon}>
                <Popup>
                  <div className="text-sm font-medium">
                    <div className="font-bold text-orange-600 dark:text-orange-400">
                      🔄 Pickup Point
                    </div>
                    <div className="dark:text-white">{route.pickupName}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Trip: {route.tripId}
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400">
                      Unit: {route.unitNumber}
                    </div>
                  </div>
                </Popup>
              </Marker>
              {/* Destination Marker */}
              <Marker position={route.destination} icon={hospitalIcon}>
                <Popup>
                  <div className="text-sm font-medium">
                    <div className="font-bold text-blue-600 dark:text-blue-400">
                      🏥 Destination
                    </div>
                    <div className="dark:text-white">{route.destinationName}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Trip: {route.tripId}
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}

        {/* Ambulances */}
        {ambulances.map((ambulance) => (
          <Marker
            key={ambulance.id}
            position={ambulance.position}
            icon={createAmbulanceIcon(ambulance.status, ambulance.isMoving)}
          >
            <Popup>
              <div className="text-sm font-medium min-w-[220px] dark:text-white">
                <div
                  className={`font-bold ${
                    ambulance.status === "En Route"
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  🚑 {ambulance.unit_number}
                  {ambulance.isMoving && " 🔴 LIVE"}
                </div>

                <div className="mt-1">
                  <span className="font-semibold dark:text-white">Status:</span>
                  <span
                    className={`ml-1 ${
                      ambulance.status === "En Route"
                        ? "text-green-600 dark:text-green-400 font-bold"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {ambulance.status}
                  </span>
                </div>

                {ambulance.trip && (
                  <>
                    <div className="mt-2 border-t dark:border-gray-700 pt-2">
                      <div className="font-semibold text-purple-600 dark:text-purple-400">
                        ACTIVE TRIP
                      </div>
                      <div className="dark:text-white">
                        <span className="font-semibold dark:text-white">Trip:</span>{" "}
                        {ambulance.trip.trip_id}
                      </div>
                      <div className="dark:text-white">
                        <span className="font-semibold dark:text-white">From:</span>{" "}
                        {ambulance.trip.pickup_location}
                      </div>
                      <div className="dark:text-white">
                        <span className="font-semibold dark:text-white">To:</span>{" "}
                        {ambulance.trip.destination}
                      </div>
                      <div className="dark:text-white">
                        <span className="font-semibold dark:text-white">Patient:</span>{" "}
                        {ambulance.trip.patient_id || "—"}
                      </div>

                      {ambulance.route && ambulance.progress && (
                        <div className="mt-1 text-xs">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                            <div
                              className="bg-green-600 dark:bg-[#0EFF7B] h-1.5 rounded-full"
                              style={{
                                width: `${ambulance.progress.progress || 0}%`,
                              }}
                            ></div>
                          </div>
                          <div className="text-green-600 dark:text-[#0EFF7B] font-semibold mt-1">
                            {Math.round(ambulance.progress.progress || 0)}%
                            Complete
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {ambulance.route && (
                  <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                    📍 Route: {ambulance.route.pickupName} →{" "}
                    {ambulance.route.destinationName}
                  </div>
                )}

                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  📍 Visakhapatnam, AP
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Legend */}
        <div className="leaflet-bottom leaflet-left font-[Helvetica]">
          <div className="leaflet-control bg-gray-100 dark:bg-gray-800 p-3 rounded-lg shadow-lg m-2 border dark:border-gray-700">
            <h4 className="font-bold text-sm mb-2 dark:text-white">🚑 Vizag Live Tracking</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full pulsating-dot"></div>
                <span className="dark:text-white">Ambulance En Route</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="dark:text-white">Hospital</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="dark:text-white">Pickup Location</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="dark:text-white">Area Landmark</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 bg-green-500 rounded-full"
                  style={{ opacity: 0.7 }}
                ></div>
                <span className="dark:text-white">Route Path</span>
              </div>
            </div>
          </div>
        </div>
      </MapContainer>
    </div>
  );
};

export default MapView;