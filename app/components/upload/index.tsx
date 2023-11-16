"use client"

import React, { useState } from "react";
import { useDropzone } from 'react-dropzone'

import Link from "next/link";
import styles from './styles.module.css'

const UploadDropzone = () => {

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [errorFiles, setErrorFiles] = useState<string[]>([]);

  const { acceptedFiles, fileRejections, getRootProps, getInputProps } = useDropzone({
    accept: {
      'text/plain': ['.yaml', '.yml', '.json'],
      'application/json': ['.json'],
      'application/x-yaml': ['.yaml', '.yml'],
      'text/yaml': ['.yaml', '.yml']
    },
    onDropAccepted: files => {
      files.forEach(async file => {
        try {
          // Upload file to server using upload API
          let formData = new FormData();
          formData.append("yamlfile", file);

          const res = await fetch("/api/config", {
            method: "POST",
            body: formData,
          });

          // parse message
          const data = await res.json();

          if (!data || !data.success) {
            // Error parsing file content: add erroneous file to list
            setErrorFiles(errorFiles => [...errorFiles, file.name]);
          } else {
            // Success: add to list of successfully uploaded files
            setUploadedFiles(uploadedFiles => [...uploadedFiles, file.name]);
          }

        } catch (error) {
          // Error uploading file: add erroneous file to list
          setErrorFiles(errorFiles => [...errorFiles, file.name]);
        }
      });
    }
  });

  return (
    <section>
      <div {...getRootProps({ className: `d-flex justify-content-center align-items-center ${styles.dropzone}` })}>
        <input {...getInputProps()} />
        <div>Drag &apos;n&apos; drop some files here, or click to select files</div>
      </div>
      {acceptedFiles.length > 0 || fileRejections.length > 0 ? (
        <div id={styles.acceptedfiles} className="mt-4">
          <h4>Upload status</h4>
          <ul>
            {acceptedFiles.map(file => (
              <li key={file.name} className={`${uploadedFiles.indexOf(file.name) !== -1 ? styles.uploaded : errorFiles.includes(file.name) ? styles.erroneous : styles.uploading}`}>
                {file.name}
                {errorFiles.includes(file.name) ? <small> - Invalid config file</small> : null}
              </li>
            ))}
            {fileRejections.map(item => (
              <li key={item.file.name} className={`${styles.erroneous}`}>
                {item.file.name} <small>- Wrong type of file</small>
              </li>
            ))}
          </ul>
          <Link
            href='/'
            className='btn btn-primary'
          >Go back to home page</Link>
        </div>
      ) : null}
    </section>
  )

}

export default UploadDropzone;