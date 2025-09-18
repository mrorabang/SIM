import React, { useState, useRef } from "react";
import { Stage, Layer, Text, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import JSZip from "jszip";
import { saveAs } from "file-saver";

function BackgroundImage({ src, width, height }) {
  const [image] = useImage(src);
  return <KonvaImage image={image} width={width} height={height} />;
}

export default function CreateImageList() {
  const [inputText, setInputText] = useState("");
  const [bgSrc, setBgSrc] = useState(null);
  const stageRefs = useRef([]);

  const parseList = () => {
    return inputText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        let [phone, price] = line.split("=");
        return { phone: phone.trim(), price: price?.trim() || "" };
      });
  };

  const handleDownloadAll = async () => {
    const items = parseList();
    const zip = new JSZip();

    for (let i = 0; i < items.length; i++) {
      const uri = stageRefs.current[i].toDataURL();
      const blob = await (await fetch(uri)).blob();
      zip.file(`${items[i].phone}.png`, blob);
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "sims.zip");
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setBgSrc(url);
    }
  };

  const items = parseList();

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      {/* LEFT: Input */}
      <div style={{ width: "40%" }}>
        <h2>Danh sách SIM</h2>
        <textarea
          rows="10"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          // placeholder="0909xxxxxx = 1.000.000"
          style={{ width: "100%" }}
        />
        <br />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <br />
        <button onClick={handleDownloadAll} style={{ marginTop: "10px" }}>
          Tải tất cả ảnh
        </button>
      </div>

      {/* RIGHT: Preview */}
      <div style={{ width: "60%", overflowY: "scroll", maxHeight: "500px" }}>
        {items.map((item, idx) => (
          <Stage
            key={idx}
            width={600}
            height={200}
            ref={(el) => (stageRefs.current[idx] = el)}
            style={{
              border: "1px solid #ccc",
              marginBottom: "10px",
              background: "#f9f9f9",
            }}
          >
            <Layer>
              {/* Ảnh nền */}
              {bgSrc && <BackgroundImage src={bgSrc} width={600} height={200} />}

              {/* Text số + giá */}
              <Text
                text={item.phone}
                x={50}
                y={50}
                fontSize={32}
                fontStyle="bold"
                fill="red"
              />
              <Text
                text={item.price}
                x={50}
                y={120}
                fontSize={28}
                fontStyle="italic"
                fill="blue"
              />
            </Layer>
          </Stage>
        ))}
      </div>
    </div>
  );
}
