import http from '../utils/http'
import { composeQueryUrl } from '../utils/utils'

const URL = 'api/discounts'

const discountApi = {
  getPageDiscount: (page, amount)=> http.get(composeQueryUrl(URL, {page, amount})),
  createDiscount:(body) =>http.post(URL, body),
  updateDiscount:(id, body)=> http.put(`${URL}/${id}`, body)
}

export default discountApi;