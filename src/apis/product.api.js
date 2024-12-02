import http from 'src/utils/http'
import { composeQueryUrl } from '../utils/utils'

const URL = 'api/public/products'

const productApi = {
  getProducts({keyword, sortType}) {
    return http.get(composeQueryUrl(URL, {keyword, sortType}), {})
  },
  getProductDetail(id) {
    return http.get(`${URL}/${id}`)
  },

}

export default productApi
