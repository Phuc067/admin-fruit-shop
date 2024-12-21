import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import discountApi from "../../apis/discount.api";
import Loading from "../../components/Loading";
import { Pagination } from "antd";
import DiscountForm from "./components/DiscountForm";
import { formatTime } from "../../utils/utils";
export default function DiscountManagement() {

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] =useState(null);
  const numberItemInPage = 10;
  const { data, isLoading, isError , refetch} =
    useQuery({
      queryKey: ["discounts", currentPage],
      queryFn: () => discountApi.getPageDiscount(currentPage - 1, numberItemInPage)
      ,
      keepPreviousData: true,
    });


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const showDiscountModal = (discount) => {
    setSelectedDiscount(discount);
    setModalOpen(true);
  };
 
  const handleModalOk = () =>{
    setModalOpen(false);
    setSelectedDiscount(null);
    refetch();
  };

  const handleModalCancel = () => {
    setModalOpen(false);
  };


  return (
    <> 
    <div className="mx-3 bg-white w-full rounded-md shadow-lg p-4">
      <div className="w-full flex items-center mt-4 flex-col">
        <div className="w-full flex pt-4 pb-6 gap-2 justify-between items-center">
          <h2 className="pl-4 text-lg lg:text-xl font-bold text-primary">Danh sách khuyến mãi</h2>
          <div className="flex-grow relative flex justify-end mr-8">
            <button
              onClick={() => showDiscountModal(null)}
              className="bg-primary hover:bg-primary-light transition-all duration-300 ease-in-out transform hover:scale-105 text-sm lg:text-base text-white rounded-full h-10 px-5 py-2 shadow-md"
            >
              Thêm khuyến mãi
            </button>
          </div>
        </div>
    
        <div className="bg-white w-full rounded-md shadow-lg p-4">
          <div className="mb-4">
            {isLoading && <Loading />}
            {isError && (
              <div className="text-red-500 font-medium">
                Đã xảy ra lỗi khi tải danh sách khuyến mãi: Không thể kết nối đến server.
              </div>
            )}
            {!isLoading && !isError && (!data?.data?.data?.content || data.data.data.content.length === 0) && (
              <div className="my-3 bg-gray-100 w-full rounded-md h-40 text-center flex justify-center items-center text-gray-500">
                Hiện không có khuyến mãi nào đang được áp dụng.
              </div>
            )}
    
            {data?.data?.data?.content?.map((item, index) => (
              <div key={index}>
                <div className="flex bg-gray-50 hover:shadow-xl transition-all duration-300 mt-4 justify-between rounded-md gap-3 py-4 px-4 border border-gray-200">
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold text-gray-700">Mã khuyến mãi: {item.id}</span>
                    <span>{item.title}</span>
                    <span className="text-gray-500">Thời gian bắt đầu: {formatTime(item.effectiveDate)}</span>
                    <span className="text-gray-500">Thời gian kết thúc: {formatTime(item.expiryDate)}</span>
                    <span className="text-green-600 font-semibold">Giá trị giảm: {item.value}%</span>
                  </div>
                  
                  <div className="flex-grow md:ml-4 xl:ml-10">
                    <span className="font-semibold text-gray-700">Danh sách sản phẩm áp dụng</span>
                    <div className="h-40 overflow-y-auto bg-gray-100 rounded-md p-2 shadow-inner">
                      <ul className="list-disc list-inside">
                        {item.products?.map((product, index) => (
                          <li key={index} className="py-1 text-gray-600">
                            {product.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
    
                  <div className="w-40 flex justify-end items-center">
                    <button
                      onClick={() => showDiscountModal(item)}
                      className="bg-secondary hover:bg-secondary-light transition-all duration-300 ease-in-out transform hover:scale-105 text-sm lg:text-base text-white rounded-full h-10 px-5 py-2 shadow-md"
                    >
                      Sửa khuyến mãi
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <DiscountForm open={isModalOpen} onClose={handleModalCancel} onSubmit={handleModalOk} discount={selectedDiscount} />
          </div>
        </div>
    
        <div className="mt-4">
          <Pagination
            total={data?.data?.data?.totalPages}
            pageSize={numberItemInPage}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </div>
    </>
    
  );
}
