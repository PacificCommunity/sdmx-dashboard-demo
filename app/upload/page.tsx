import { NextPage } from 'next'
import UploadComponent from '@/app/components/upload'

const Upload: NextPage = () => {

  return (
    <div className="row justify-content-center my-4">
        <div className="col col-sm-auto">
            <h1>Upload</h1>
            <p>Upload new config files below.<br />JSON and YAML formats accepted.</p>
            <UploadComponent />
        </div>
    </div>
  )

}

export default Upload;