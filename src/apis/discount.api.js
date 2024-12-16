import http from '../utils/http'
import { composeQueryUrl } from '../utils/utils'

const URL = 'api/discounts'

const discountApi = {
  getPageDiscount: (page, amount)=> http.get(composeQueryUrl(URL, {page, amount})),
}

export default discountApi;