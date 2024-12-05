import http from 'src/utils/http'
import { composeQueryUrl } from '../utils/utils'

const URL = 'api/public/categories'

const categoryAPi = {
  getAllCategory: () => http.get(URL),

}

export default categoryAPi
