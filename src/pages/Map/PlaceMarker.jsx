import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

export default function PlaceMarker({ place, isSelected, onClick }) {
    return (
        <Marker
            position={[place.latitude, place.longitude]}
            eventHandlers={{ click: onClick }}
            icon={
                isSelected
                    ? L.icon({
                        iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                        ...defaultIcon.options,
                    })
                    : defaultIcon
            }
        >
            <Popup>
                <strong>{place.name}</strong>
                <br />
                {place.description}
            </Popup>
        </Marker>
    );
}