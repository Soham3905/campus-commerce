import React, { useEffect, useState } from "react";
import jsonData from "./landingSchema.json";

export default function SDUIRenderer() {
  return (
    <div style={{ padding: "20px", backgroundColor: "#f3f3f3", minHeight: "100vh" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(100, 1fr)",
        gap: "10px"
      }}>
        <Renderer schema={jsonData} />
      </div>
    </div>
  );
}

const ProductCard = ({ children, style }) => (
  <div style={{ border: "1px solid #ddd", padding: "16px", borderRadius: "8px", backgroundColor: "#fff", ...style }}>
    {children}
  </div>
);

const ProductImage = ({ data, style }) => (
  <img src={data.imageUrl} alt={data.altText} style={{ width: "100%", height: "200px", objectFit: "contain", ...style }} />
);

const Label = ({ data, style }) => (
  <p style={{ color: "#888", fontSize: "12px", margin: "4px 0", ...style }}>{data.text} ⓘ</p>
);

const Title = ({ data, style }) => (
  <h3 style={{ fontSize: "18px", margin: "4px 0", ...style }}>{data.text}</h3>
);

const Description = ({ data, style }) => (
  <p style={{
    fontSize: "14px",
    margin: "4px 0",
    display: "-webkit-box",
    WebkitLineClamp: data.maxLines ?? 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    ...style,
  }}>
    {data.text}
  </p>
);

const Rating = ({ data, style }) => (
  <p style={{ fontSize: "14px", margin: "4px 0", color: "#e77600", ...style }}>
    ⭐ {data.score}
    <span style={{ color: "#007185" }}> ({data.reviewCount})</span>
  </p>
);

const Badge = ({ data, style }) => (
  <span style={{ backgroundColor: "#cc0c39", color: "white", padding: "4px 8px", fontSize: "12px", borderRadius: "4px", ...style }}>
    {data.text}
  </span>
);

const PriceBlock = ({ data, style }) => (
  <div style={{ margin: "8px 0", ...style }}>
    <span style={{ fontSize: "20px", fontWeight: "bold" }}>{data.sellingPrice}</span>
    {" "}
    <span style={{ fontSize: "14px", color: "#888", textDecoration: "line-through" }}>M.R.P: {data.mrp}</span>
    {" "}
    <span style={{ fontSize: "14px", color: "#cc0c39" }}>({data.discount} off)</span>
  </div>
);

const OfferText = ({ data, style }) => (
  <p style={{ fontSize: "13px", color: "#007185", margin: "4px 0", ...style }}>{data.text}</p>
);

const DeliveryInfo = ({ data, style }) => {
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + (data.daysOffset ?? 7));
  const formatted = deliveryDate.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  return (
    <p style={{ fontSize: "13px", margin: "4px 0", ...style }}>
      <span style={{ fontWeight: "bold" }}>🚚 {data.prefix ?? "FREE delivery"} {formatted}</span>
    </p>
  );
};

const Button = ({ data, style }) => (
  <button style={{
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    backgroundColor: "#ffa41c",
    border: "1px solid #ff8f00",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    ...style,
  }}>
    {data.label}
  </button>
);

const ComponentMap = {
  "ProductCard": ProductCard,
  "Image": ProductImage,
  "Label": Label,
  "Title": Title,
  "Description": Description,
  "Rating": Rating,
  "Badge": Badge,
  "PriceBlock": PriceBlock,
  "OfferText": OfferText,
  "DeliveryInfo": DeliveryInfo,
  "Button": Button,
};

const Renderer = ({ schema }) => {
  const [deviceType, setDeviceType] = useState("desktop");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 600) setDeviceType("mobile");
      else if (width < 1024) setDeviceType("tablet");
      else setDeviceType("desktop");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!schema) return null;

  const TargetComponent = ComponentMap[schema.type];
  if (!TargetComponent) return <div>Unknown Component: {schema.type}</div>;

  let placementStyle = {};
  if (schema.placement) {
    const coordinates = schema.placement[deviceType];
    placementStyle = {
      gridColumn: `${coordinates.colStart} / ${coordinates.colEnd}`,
      gridRow: `${coordinates.rowStart} / ${coordinates.rowEnd}`,
    };
  }

  return (
    <div style={placementStyle}>
      <TargetComponent data={schema.data} style={schema.containerStyle}>
        {schema.children && schema.children.map((child, idx) => (
          <Renderer key={idx} schema={child} />
        ))}
      </TargetComponent>
    </div>
  );
};
