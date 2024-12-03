import http from "src/utils/http";
import { composeQueryUrl } from "../utils/utils";

const URL = "api/orders";

const orderApi = {
  getPageOrderByState : (page, amount, state)=>{
    console.log("Calling api :" );
    const url = composeQueryUrl(URL, {page,amount,state})
   
    return http.get(url);
  },
};

export default orderApi;