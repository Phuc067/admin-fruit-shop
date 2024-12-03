import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { Modal } from 'antd';
import productApi from "../../apis/product.api";
import { Pagination } from 'antd';
import { useState } from "react";
import Loading from "../../components/Loading";
import { formatCurrency } from "../../utils/utils";
import ProductForm from "./components";

export default function ProductManagement() {

  const [keyword, setKeyword] = useState("");
  const numberItemInPage = 10;
  const [sortType, setSortType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const { data, isLoading } =
    useQuery({
      queryKey: ["products", currentPage, keyword, sortType],
      queryFn: () => productApi.getPageProducts(currentPage - 1, numberItemInPage, keyword, sortType),
      keepPreviousData: true,
    });

  console.log(data);

  const handleSearchChange = (e) => {
    setKeyword(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortType(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const showProductModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };
  const handleUpdateOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setModalOpen(false);
    }, 3000);
  };

  const handleModalCancel = () => {
    setSelectedProduct(null);
    setModalOpen(false);
  };


  return (
    <>
      <div className="mx-3 bg-white w-full rounded-md">
        <div className="w-full flex items-center mt-4 flex-col ">
          <div className="w-full xl:w-[80%] hidden md:flex justify-between pb-4 gap-2">
            <div className="flex gap-4 items-center">
              <div className="flex rounded-full border-2 border-primary w-[350px] bg-white p-1 flex-shrink-0 h-12 ">
                <input
                  type="text"
                  className="flex-grow rounded-full border-none bg-transparent px-3 py-1 text-black outline-none"
                  placeholder="Tìm kiếm sản phẩm"
                />
                <button
                  onClick={handleSearchChange}
                  type="submit"
                  className="flex-shrink-0 rounded-full bg-primary px-4 py-1 hover:opacity-90"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                  Sắp xếp theo:
                </label>
                <select
                  id="sort"
                  name="sort"
                  onChange={handleSortChange}
                  className="border border-gray-300 rounded-full px-4 py-1 text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value=""></option>
                  <option value="price_asc">Giá thấp đến cao</option>
                  <option value="price_desc">Giá cao đến thấp</option>
                  <option value="discount_asc">Giảm giá thấp đến cao</option>
                  <option value="discount_desc">Giảm giá cao đến thấp</option>
                </select>
              </div>
            </div>
            <button onClick={()=> showProductModal(null)}  className="bg-primary rounded-full text-white h-12 px-4 py-1">Thêm sản phẩm</button>
          </div>
          <div className="bg-background w-full">
            {isLoading ? (
              <Loading />
            ) : (
              <div className="mb-4">
                {data?.data?.data?.content?.map((item, index) => (
                  <div key={index} className=" flex bg-white mt-4 rounded-md items-center gap-3">
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
                      <span className="text-secondary mb-1">
                        {formatCurrency(
                          item.price -
                          item.price * item.discountPercentage
                        )}
                      </span>
                    </div>
                    <div className="flex gap-2 mr-4">
                      <button onClick={()=>showProductModal(item)} className="bg-primary rounded-full text-white h-8 px-4 py-1">Sửa thông tin</button>
                      <button className="bg-secondary rounded-full text-white h-8 px-4 py-1">Xóa</button>
                    </div>
                    
                  </div>
                ))}
                <ProductForm open={isModalOpen} product={selectedProduct} onSubmit={handleUpdateOk} onClose={handleModalCancel} />
              </div>
            )}
          </div>
          <div className="mt-4">
            <Pagination total={data?.data?.data?.totalPages} pageSize={numberItemInPage} onChange={handlePageChange} />
          </div>

        </div>
      </div>


    </>
  );
}
