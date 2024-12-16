import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import discountApi from "../../apis/discount.api";
import Loading from "../../components/Loading";
import { Link } from "react-router-dom";
import path from "../../constants/path";
import { Pagination } from "antd";
export default function DiscountManagement() {

  const [currentPage, setCurrentPage] = useState(1);
  const numberItemInPage = 10;
  const { data, isLoading, isError } =
    useQuery({
      queryKey: ["discounts", currentPage],
      queryFn: () => discountApi.getPageDiscount(currentPage, numberItemInPage)
      ,
      keepPreviousData: true,
    });

  console.log(data);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  return (
    <>
      <div className="mx-3 bg-white w-full rounded-md">
        <div className="w-full flex items-center mt-4 flex-col ">
          <div className="w-full flex pt-4 pb-6 gap-2 lg:px-4 justify-between">
            <h2>Danh sách khuyến mãi</h2>
            <div className="flex-grow relative items-center flex justify-end">
              <button className="bg-primary lg:absolute lg:right-16 rounded-full text-sm lg:text-base text-white h-8 px-4 py-1 mr-4 lg:mr-0 text-nowrap">Thêm khuyến mãi</button>
            </div>
          </div>
          <div className="bg-background w-full">
            <div className="mb-4">
              {isLoading && <Loading />}

              {isError && <div>Đã xảy ra lỗi khi tải danh sách khuyến mãimãi:  Không thể kết nối đến server.</div>}

              {!isLoading && !isError && (!data?.data?.data?.content || data.data.data.content.length === 0) && (
                <div>Danh sách sản phẩm trống.</div>
              )}

              {data?.data?.data?.content?.map((item, index) => (
                <Link key={index} to={path.productDetail.replace(':id', item.id)
                }>
                  <div className=" flex bg-white mt-4 rounded-md items-center gap-3">
                    <div className="object-cover h-48 w-48 relative p-4 rounded-md overflow-hidden">
                      <img src={item.image} alt="" />
                      <span className="absolute top-[0px] right-[0px] bg-secondary text-white p-2 rounded-full shadow-lg text-sm font-bold">- {item.discountPercentage}% </span>
                    </div>
                    <div className="flex flex-col gap-2 flex-grow">
                      <span>Mã sản phẩm: {item.id}</span>
                      <span>{item.title}</span>
                      <span>Số lượng còn lại : {item.quantity}</span>
                    </div>
                    <div className="w-40 flex justify-end">
                      {item.discountPercentage ? (
                        <span className="text-decoration-line-through">
                          {item.price}{" "}
                        </span>
                      ) : (
                        <></>
                      )}

                    </div>
                    <div className="flex gap-2 mr-4">


                    </div>

                  </div>
                </Link>
              ))}

            </div>

          </div>
          <div className="mt-4">
            <Pagination total={data?.data?.data?.totalPages} pageSize={numberItemInPage} onChange={handlePageChange} />
          </div>

        </div>
      </div>


    </>
  );
}
