import { useMapEvents } from "react-leaflet";

export default function MapClickHandler({ onRightClick }) {
    useMapEvents({
        contextmenu(e) {
            onRightClick(e.latlng);
        },
    });
    return null;
}