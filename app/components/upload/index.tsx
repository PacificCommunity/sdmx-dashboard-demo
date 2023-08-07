"use client"

import React from "react";
import { ChangeEvent, useState } from "react"

import styles from './styles.module.css'

const Upload = () => {

    const [file, setFile] = useState<File | null>(null);


    const onFileUploadChange = (e: ChangeEvent<HTMLInputElement>) => {
      const fileInput = e.target;
  
      if (!fileInput.files) {
        alert("No file was chosen");
        return;
      }
  
      if (!fileInput.files || fileInput.files.length === 0) {
        alert("Files list is empty");
        return;
      }
  
      const file = fileInput.files[0];
  
      /** File validation */
      // if file.type not in a list of allowed types how to write it?
      if (!["application/x-yaml", "application/x-yml"].includes(file.type)) {
        alert("Please select a yaml file");
        return;
      }
  
      /** Setting file state */
      setFile(file); // we will use the file state, to send it later to the server
  
      /** Reset file input */
      e.currentTarget.type = "text";
      e.currentTarget.type = "file";
  
    };
  
    const onCancelFile = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!file) {
        return;
      }
      setFile(null);
    };
  
    const onUploadFile = async (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!file) {
        return;
      }
  
      try {
        let formData = new FormData();
        formData.append("media", file);
  
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
  
        const {
          data,
          error,
        }: {
          data: {
            url: string | string[];
          } | null;
          error: string | null;
        } = await res.json();
  
        if (error || !data) {
          alert(error || "Sorry! something went wrong.");
          return;
        }
  
        console.log("File was uploaded successfylly:", data);
      } catch (error) {
        console.error(error);
        alert("Sorry! something went wrong.");
      }
    };

    return (<form
        id={styles.uploadform}
        className="p-3 border bg-light rounded"
        action=""
    >
        <div className="d-flex flex-column">
            <label className="d-flex flex-column justify-content-center text-center text-muted">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`${styles.icon} mx-auto`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                </svg>
                <strong>Select an yml file</strong>
                <input
                    className="d-none"
                    name="file"
                    type="file"
                    onChange={onFileUploadChange}
                />
            </label>
            <div className="d-flex flex-row justify-content-evenly mt-4">
                <button
                    disabled={true}
                    onClick={onCancelFile}
                    className="btn btn-outline-secondary rounded"
                >
                    Cancel file
                </button>
                <button
                    disabled={!file}
                    onClick={onUploadFile}
                    className="btn btn-outline-secondary rounded"
                >
                    Upload file
                </button>
            </div>
        </div>
    </form>)


}
export default Upload