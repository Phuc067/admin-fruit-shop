import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import orderApi from "../../apis/order.api";
import OrderNavigation from "./components/OrderNavigation";
import { formatCurrency } from "../../utils/utils";

export default function OrderManagement() {
  const [activeTab, setActiveTab] = useState("pending");
  const {
    data, 
    fetchNextPage, 
    hasNextPage, 
    isLoading,
    isFetchingNextPage, 
  } = useInfiniteQuery({
    queryKey: ["orders", activeTab], 
    queryFn: async ({ pageParam = 0 }) =>{
      const response = await orderApi.getPageOrderByState(pageParam, 5, activeTab);
      return response.data;
    },
    getNextPageParam: (lastPage) =>
      lastPage?.data?.last ? undefined : lastPage?.data?.number + 1,
  });
  
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  console.log(data)
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isFetchingNextPage, hasNextPage]);


  return (
    <>
     <div className="mx-3 bg-white w-full mb-4">
      <OrderNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="w-full bg-background ">
        {isLoading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          data?.pages?.map((page, pageIndex) =>
            page.data.content.map((order, orderIndex) => (
              <div key={`${pageIndex}-${orderIndex}`} className="w-full mt-4 pl-2 bg-white">
                {order.orderDetails.map((orderDetail, detailIndex) => (
                  <div key={detailIndex} className="flex">
                    <div className="object-cover w-24 h-24">
                      <img src={orderDetail.product.image} alt="" />
                    </div>
                    <div className="flex flex-col justify-between py-4 grow">
                      <span>{orderDetail.product.title}</span>
                      <span>x{orderDetail.quantity}</span>
                    </div>
                    <div className="flex items-center gap-2 mr-3 md:mr-10">
                      {orderDetail.price !== orderDetail.salePrice && (
                        <span className="line-through">
                          {formatCurrency(orderDetail.price)}
                        </span>
                      )}
                      <span>{formatCurrency(orderDetail.salePrice)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )
        )}
        {isFetchingNextPage && <p>Đang tải thêm...</p>}
        {!hasNextPage && <p>Không có thêm đơn hàng nào.</p>}
      </div>
    </div>
    </>
  );
}
