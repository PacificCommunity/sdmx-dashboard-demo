import { NextPage } from 'next'

import Homebar from './components/navigation/homebar'

const Home: NextPage = async () => {

  return (
    <div className="p-1 p-md-3">
      <h1>Welcome</h1>
      <p>Generate SDMX dashboards from YAML definition files.</p>
      <Homebar />
    </div>
  )

}

export default Home;