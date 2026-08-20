import L from "leaflet";

export function numberedIcon(n: number, color = "#2563eb") {
  return L.divIcon({
    className: "",
    html: `<div style="
      background:${color};
      color:white;
      width:24px;
      height:24px;
      border-radius:50%;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:12px;
      font-weight:bold;
      border:2px solid white;
      box-shadow:0 1px 3px rgba(0,0,0,0.4);
    ">${n}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}
