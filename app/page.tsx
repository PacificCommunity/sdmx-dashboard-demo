'use client'

import { NextPage } from 'next'
import Upload from './components/upload'

const Home: NextPage = () => {

  return (
    <div className="p-1 p-md-3">
      <h1>Welcome</h1>
      <p>Would you like to upload a new dashboard defintion YAML file?</p>
      <Upload />
    </div>
  )

}

export default Home;