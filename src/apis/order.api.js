import http from "src/utils/http";

const URL = "api/orders";

const orderApi = {
  getPageOrderByState : (pageNumber, amount, state)=>{
    const params = new URLSearchParams();

    if (pageNumber !== undefined) params.append('page', pageNumber);
    if (amount !== undefined) params.append('amount', amount);
    if (state !== undefined) params.append('state', state);

    const url = `${URL}/all?${params.toString()}`;

    return http.get(url);
  },
};

export default orderApi;