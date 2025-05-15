import { useState } from "react";
import {
    MapContainer,
    TileLayer,
    Polyline,
    Tooltip,
    Marker,
} from "react-leaflet";
import L from "leaflet";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

import MapClickHandler from "./MapClickHandler";

export default function RouteMap({
                                     places,
                                     routes,
                                     collections,
                                     selectedPlaces,
                                     togglePlaceSelection,
                                     handleRightClick,
                                     setActiveRoute,
                                 }) {
    const [selectedPlaceId, setSelectedPlaceId] = useState(null);

    return (
        <MapContainer center={[55.75, 37.62]} zoom={5} style={{ height: "500px", width: "100%" }}>
            <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onRightClick={handleRightClick} />

            {routes.map((route) => {
                const coords = route.places?.map((p) => [p.latitude, p.longitude]).filter(Boolean);
                if (!coords || coords.length < 2) return null;
                return (
                    <Polyline
                        key={route.id}
                        positions={coords}
                        pathOptions={{ color: "purple", weight: 4 }}
                        eventHandlers={{ click: () => setActiveRoute(route) }}
                    >
                        <Tooltip sticky>{route.title}</Tooltip>
                    </Polyline>
                );
            })}

            {places.map((place) => {
                const isSelected = selectedPlaces.some((p) => p.id === place.id);
                return (
                    <Marker
                        key={place.id}
                        position={[place.latitude, place.longitude]}
                        icon={L.icon({
                            iconUrl: isSelected
                                ? "https://maps.google.com/mapfiles/ms/icons/orange-dot.png"
                                : "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            shadowUrl: iconShadow,
                            shadowSize: [41, 41],
                        })}
                        eventHandlers={{
                            click: () => {
                                togglePlaceSelection(place);
                            },
                        }}
                    />
                );
            })}
        </MapContainer>
    );
}