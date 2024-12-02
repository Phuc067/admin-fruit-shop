import http from "src/utils/http";
import { composeQueryUrl } from "../utils/utils";

const URL = "api/orders";

const orderApi = {
  getPageOrderByState : (page, amount, state)=>{

    // if (page !== undefined) params.append('page', page);
    // if (amount !== undefined) params.append('amount', amount);
    // if (state !== undefined) params.append('state', state);

    console.log("Calling api :" );
    const url = composeQueryUrl(`${URL}/all`, {page,amount,state})
   
    return http.get(url);
  },
};

export default orderApi;