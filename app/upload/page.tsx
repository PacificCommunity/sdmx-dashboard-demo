import { NextPage } from 'next'
import UploadDropzone from '@/app/components/upload'
import Link from 'next/link';

const Upload: NextPage = () => {

  return (
    <div id="page-content-wrapper">
      <div className="container-fluid mt-5 mt-sm-0">
        <div className="row justify-content-center my-4">
          <div className="col col-sm-auto">
            <h1>Upload</h1>
            <p>Upload new config files below.<br />Accepting JSON files based on <Link href="/schema/dashboard.schema.json" target="_blank" prefetch={false}>JSON schema</Link></p>
            <UploadDropzone />
          </div>
        </div>
      </div>
    </div>
  )

}

export default Upload;