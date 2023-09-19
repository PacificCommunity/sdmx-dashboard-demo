import { NextPage } from 'next'
import UploadComponent from '@/app/components/upload'

const Upload: NextPage = () => {

  return (
    <div className="row justify-content-center my-4">
        <div className="col col-sm-auto">
            <h1>Upload</h1>
            <p>Click below to upload a new YAML file.</p>
            <UploadComponent />
        </div>
    </div>
  )

}

export default Upload;