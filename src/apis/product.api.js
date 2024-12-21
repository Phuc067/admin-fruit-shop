import http from 'src/utils/http'
import { composeQueryUrl } from '../utils/utils'

const publicURL = 'api/public/products'

const URL = 'api/products'

const productApi = {
  getPageProducts: (page, amount, keyword, sortType)=> http.get(composeQueryUrl(publicURL, {page, amount, keyword, sortType})),
  
  getProductDetail: (id) => http.get(`${publicURL}/${id}`),
  
  createProduct: (body) => http.post(URL, body),

  updateProduct: (id, body) => http.put(`${URL}/${id}`, body),

  deleteProduct:(id) => http.delete(`${URL}/${id}`),

  getIdAndTitle: () => http.get(URL),

}

export default productApi
