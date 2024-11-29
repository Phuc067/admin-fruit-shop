import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import orderApi from "../../apis/order.api";
import OrderNavigation from "./components/OrderNavigation";
import { ORDER_TABS } from "../../constants/orderTab";
import { formatCurrency } from "../../utils/utils";

const initializeTabState = (tabs) => {
  return tabs.reduce((state, tab) => {
    state[tab.key] = { page: 0, hasMore: true };
    return state;
  }, {});
};

export default function OrderManagement() {
  const [activeTab, setActiveTab] = useState("pending");
  const [tabState, setTabState] = useState(() => initializeTabState(ORDER_TABS));
  const [orders, setOrders] = useState({});

  const { isLoading } = useQuery({
    queryKey: ["orders", activeTab, tabState[activeTab].page],
    queryFn: async () => {
      const response = await orderApi.getPageOrderByState(
        tabState[activeTab].page,
        5,
        activeTab
      );
      console.log("API response:", response.data);
      if (response?.data?.data?.content) {
        setOrders((prevOrders) => ({
          ...prevOrders,
          [activeTab]: [
            ...(prevOrders[activeTab] || []),
            ...(response?.data?.data?.content || []),
          ],
        }));
      }
      if (response?.data?.data?.last)
        setTabState((prev) => ({
          ...prev,
          [activeTab]: {
            ...prev[activeTab],
            hasMore: false,
          },
        }));
      return response.data;
    },
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000,
    select: (result) => result?.data?.content ?? {},
  });

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight &&
      !isLoading &&
      tabState[activeTab].hasMore
    )
      setTabState((prev) => ({
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          page: prev[activeTab].page + 1,
        },
      }));
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading, tabState[activeTab].hasMore]);


  console.log(orders);
  return (
    <>
      <div className="mx-3 bg-white w-full mb-4 ">
        <OrderNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="w-full bg-background ">
          {isLoading ? (
            <p>Đang tải dữ liệu...</p>
          ) : orders[activeTab]?.length > 0 ? (
            orders[activeTab].map((order, orderIndex) => (
              <div key={orderIndex} className="w-full mt-4  pl-2 bg-white">
                {order.orderDetails.map((orderDetail, detialIndex) => (
                  <div key={detialIndex} className="flex">
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
          ) : (
            <p>Không có đơn hàng nào.</p>
          )}
        </div>
        {/* {!tabState[activeTab].hasMore && <p>No more orders to load.</p>} */}
      </div>
    </>
  );
}
