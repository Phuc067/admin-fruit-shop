import http from 'src/utils/http'
import { composeQueryUrl } from '../utils/utils'
const URL ="api/reports"

const reportApi = {
  getOrderReportByMonthAndYear: (month, year) => http.get(composeQueryUrl(`${URL}/order-by-month-and-year`,{month, year})),
}

export default reportApi;