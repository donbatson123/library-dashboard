import { useState } from "react";
import axios from "axios";

function BarcodeScanner() {
  const [barcode, setBarcode] = useState("");
  const [isbn, setIsbn] = useState("");
  const [status, setStatus] = useState(null);

  const handleScan = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/inventory/scan`, { barcode });

      setStatus(res.data);

      if (res.data.status === "not found") {
        // Prompt for ISBN input
        const userIsbn = prompt("Book not found. Please enter ISBN:");
        if (userIsbn) {
          const attachRes = await axios.post(`${import.meta.env.VITE_API_URL}/inventory/isbn`, {
            barcode,
            isbn: userIsbn,
          });
          alert(`ISBN attached: ${attachRes.data.title}`);
        }
      } else {
        alert(`Found: ${res.data.title}`);
      }

    } catch (err) {
      console.error("Scan error:", err.response?.data || err.message || err);
      alert("Scan failed.");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Scan barcode"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleScan()}
      />
    </div>
  );
}

export default BarcodeScanner;
