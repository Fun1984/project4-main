import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());

// 이미지 파일 정적 서빙
app.use("/images", express.static(path.join(__dirname, "public/images")));

app.post("/api/image", async (req, res) => {
  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    // b64_json을 파일로 저장
    const b64Json = data?.data?.[0]?.b64_json;
    if (!b64Json) return res.status(500).json({ error: "이미지 데이터 없음" });

    const filename = `cover_${Date.now()}.png`;
    const savePath = path.join(__dirname, "public/images", filename);

    // public/images 폴더 없으면 생성
    fs.mkdirSync(path.join(__dirname, "public/images"), { recursive: true });
    fs.writeFileSync(savePath, Buffer.from(b64Json, "base64"));

    // URL만 반환
    res.json({ imageUrl: `http://localhost:3001/images/${filename}` });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/image/:filename", (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "public/images", filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "파일이 존재하지 않습니다." });
    }

    fs.unlinkSync(filePath);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});