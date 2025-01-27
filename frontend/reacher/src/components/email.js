import React, { useState } from "react";
import * as XLSX from "xlsx";
import "../styles/email.css";

const Email = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [excelContent, setExcelContent] = useState([]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFileType(droppedFile)) {
      processFile(droppedFile);
    } else {
      alert("Invalid file type. Please upload an Excel, or TXT file.");
    }
  };

  const validateFileType = (file) => {
    const allowedTypes = [
      "text/plain",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    return allowedTypes.includes(file.type);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && validateFileType(selectedFile)) {
      processFile(selectedFile);
    } else {
      alert("Invalid file type. Please upload an Excel or TXT file.");
    }
  };

  const processFile = (file) => {
    setFile(file);
    setFileContent("");
    setExcelContent([]);

    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => setFileContent(e.target.result);
      reader.readAsText(file);
    } else if (
      file.type === "application/vnd.ms-excel" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        setExcelContent(parsedData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleUpload = () => {
    if (file) {
      console.log(`Uploading file: ${file.name}`);
    } else {
      alert("No file selected!");
    }
  };

  return (
    <div className="form-container">
      <div
        className={`upload-files-container ${dragActive ? "drag-active" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="drag-file-area">
          <span className="material-icons-outlined upload-icon">
            file_upload
          </span>
          <h3 className="dynamic-message">
            {file ? `Selected file: ${file.name}` : "Drag & drop any file here"}
          </h3>
          <label className="label">
            <div>
              <input
                type="file"
                className="default-file-input"
                accept=".xlsx, .xls, .txt"
                onChange={handleFileSelect}
              />
            </div>
            or <span className="browse-files-text">browse file</span>
            <span> from device</span>
          </label>
        </div>

        <button type="button" className="upload-button" onClick={handleUpload}>
          Upload
        </button>
      </div>

      {file && (
        <div className="file-content">
          <h3>File Preview:</h3>
          {file.type === "text/plain" && <pre>{fileContent}</pre>}

          {(file.type === "application/vnd.ms-excel" ||
            file.type ===
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") && (
            <div>
              <table>
                <tbody>
                  {excelContent.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Email;
