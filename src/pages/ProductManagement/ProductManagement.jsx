import { useMutation, useQuery } from "@tanstack/react-query";
import productApi from "../../apis/product.api";
import { Pagination } from 'antd';
import { useState, useRef } from "react";
import Loading from "../../components/Loading";
import { formatCurrency } from "../../utils/utils";
import ProductForm from "./components/ProductForm";
import { Popconfirm } from 'antd';
import { Link } from "react-router-dom";
import path from "../../constants/path";
import ImagePicker from "../../components/ImagePicker/ImagePicker";
import fruitApi from "../../apis/fruit.api";
import HttpStatusCode from "../../constants/httpStatusCode.enum";
import showToast from "../../components/ToastComponent";
export default function ProductManagement() {

  const [keyword, setKeyword] = useState("");
  const inputRef = useRef("");
  const numberItemInPage = 10;
  const [sortType, setSortType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isImagePickerOpen, setImagePickerOpen] = useState(false);
  const [imageSearch, setImageSearch] = useState("");


  const { data, isLoading, isError, refetch } =
    useQuery({
      queryKey: ["products", currentPage, keyword, imageSearch?.name || imageSearch, sortType],
      queryFn: () => {
        if (imageSearch) {
          return fruitApi.searchProduct(currentPage - 1, numberItemInPage, imageSearch, sortType);
        } else {
          return productApi.getPageProducts(currentPage - 1, numberItemInPage, keyword, sortType);
        }
      }
      ,
      keepPreviousData: true,
    });


  const handleSearchChange = () => {
    setKeyword(inputRef.current);
    setCurrentPage(1);
    setImageSearch("");
  };

  const handleClickSelectImage = () => {
    setImagePickerOpen(!isImagePickerOpen);
  }

  const handleImagePickerSubmit = (image) => {
    setCurrentPage(1);
    setImageSearch(image);
    setKeyword("");
  }
  const handleImagePickerCancel = () => {
    setImagePickerOpen(false);
  }

  const handleSortChange = (e) => {
    setSortType(e.target.value);
    setCurrentPage(1);
  };

  const deleteMutation = useMutation({
    mutationFn: (id) => productApi.deleteProduct(id),
  })

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const showProductModal = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedProduct(product);
    setModalOpen(true);
  };
  const handleModalSubmit = () => {
    setModalOpen(false);
    setSelectedProduct(null);
    refetch();
  };

  const handleModalCancel = () => {
    setSelectedProduct(null);
    setModalOpen(false);
  };
  const handleDeleteProduct = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  const confirmDelete = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    deleteMutation.mutate(id, {
      onSuccess: (response)=>{
        if (response.data.status === HttpStatusCode.Accepted) {
          showToast(response.data.message, "success");
          refetch();
        }
        else {
          showToast(response.data.message, "error");
        }
      }
    })
  };
  const cancelDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(e);
  };

  return (
    <>
      <div className="ml-3 bg-white w-full rounded-md">
        <div className="w-full flex items-center mt-4 flex-col ">
          <div className="w-full flex pt-4 pb-6 gap-2 lg:px-4 ">
            <div className="w-[70%] flex gap-4 items-center flex-wrap  justify-center">
              <div className="flex rounded-full border-2 border-primary w-[350px] bg-white p-1 h-12 items-center">
                <input
                  type="text"
                  className={`${imageSearch ? 'w-0' : 'w-full flex-grow '} rounded-full border-none bg-transparent px-3 py-1 text-black outline-none transition-all duration-300`}
                  placeholder="Tìm kiếm sản phẩm"
                  ref={inputRef}
                  onChange={(e) => {
                    inputRef.current = e.target.value;
                  }}
                />
                {imageSearch && (
                  <div className="flex flex-grow">
                    <span className="text-sm flex items-center text-gray-700">{imageSearch.name} <button
                      onClick={() => setImageSearch("")}
                      className="ml-2 items-center text-red-500  transition-all duration-300 ease-in-out transform hover:scale-105 text-sm"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button></span>

                  </div>
                )}
                <div className="mx-2 text-primary" onClick={handleClickSelectImage}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                  </svg>
                </div>

                <button
                  onClick={handleSearchChange}
                  type="submit"
                  className="flex-shrink-0 transition-all duration-300 ease-in-out transform hover:scale-105 rounded-full bg-primary px-4 py-1 hover:opacity-90"
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

              <div className="flex items-center space-x-3 flex-1 justify-center">
                <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                  Sắp xếp theo:
                </label>
                <select
                  id="sort"
                  name="sort"
                  onChange={handleSortChange}
                  className="border border-gray-300 transition-all duration-300 ease-in-out transform hover:scale-105 rounded-full px-4 py-1 text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value=""></option>
                  <option value="price_asc">Giá thấp đến cao</option>
                  <option value="price_desc">Giá cao đến thấp</option>
                  <option value="discount_asc">Giảm giá thấp đến cao</option>
                  <option value="discount_desc">Giảm giá cao đến thấp</option>
                </select>
              </div>
            </div>
            <div className="flex-grow relative items-center flex">
              <button onClick={(e) => showProductModal(e, null)} className="bg-primary hover:bg-primary-light transition-all duration-300 ease-in-out transform hover:scale-105 lg:absolute lg:right-16 rounded-full text-sm lg:text-base text-white h-8 px-4 py-1 mr-4 lg:mr-0 text-nowrap">Thêm sản phẩm</button>
            </div>
          </div>
          <ImagePicker open={isImagePickerOpen} onSubmit={handleImagePickerSubmit} onClose={handleImagePickerCancel} />
          <div className="bg-background w-full">
            <div className="mb-4">
              {isLoading && <Loading />}

              {isError && <div>Đã xảy ra lỗi khi tải danh sách sản phẩm:  Không thể kết nối đến server.</div>}

              {!isLoading && !isError && (!data?.data?.data?.content || data.data.data.content.length === 0) && (
                <div>Danh sách sản phẩm trống.</div>
              )}

              {data?.data?.data?.content?.map((item, index) => (
                <Link key={index} to={path.productDetail.replace(':id', item.id)
                }>
                  <div className=" flex bg-white mt-4 rounded-md items-center gap-3">
                    <div className="h-48 w-48 relative p-4 flex justify-center items-center">
                      <img src={item.image} alt="" className="object-cover h-full w-full rounded-lg" />
                      {item.discountPercentage >0 && 
                      <span className="absolute top-[0px] right-[0px] bg-secondary text-white p-2 rounded-full shadow-lg text-sm font-bold">- {item.discountPercentage}% </span>}
                    </div>
                    <div className="flex flex-col gap-2 flex-grow">
                      <span>Mã sản phẩm: {item.id}</span>
                      <span>Tên sản phẩm: {item.title}</span>
                      <span>Số lượng còn lại : {item.quantity}</span>
                      <span>Phân loại: {item.category.name}</span>
                    </div>
                    <div className="w-40 flex justify-end lg:pr-10">
                      {item.discountPercentage ? (
                        <span className="line-through">
                          {formatCurrency(item.price)}{" "}
                        </span>
                      ) : (
                        <></>
                      )}
                      <span className="text-secondary mb-1 ml-4">
                        {formatCurrency(
                          item.price - item.price * item.discountPercentage / 100
                        )}
                      </span>
                    </div>
                    <div className="flex gap-2 lg:gap-8 mr-4">
                      <button onClick={(e) => showProductModal(e, item)} className="bg-primary hover:bg-primary-light transition-all duration-300 ease-in-out transform hover:scale-105 rounded-full text-white h-8 px-4 py-1">Sửa thông tin</button>

                      <Popconfirm
                        title=""
                        description="Bạn có chắc muốn xóa sản phẩm này"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>
                        }
                        onConfirm={(e) => confirmDelete(e, item.id)}
                        onCancel={cancelDelete}
                        okText="Xóa"
                        cancelText="Hủy"
                      >
                        <button onClick={(e) => handleDeleteProduct(e)} className="bg-secondary hover:bg-secondary-light transition-all duration-300 ease-in-out transform hover:scale-105 rounded-full text-white h-8 px-4 py-1">Xóa</button>
                      </Popconfirm>

                    </div>

                  </div>
                </Link>
              ))}
              <ProductForm open={isModalOpen} product={selectedProduct} onSubmit={handleModalSubmit} onClose={handleModalCancel} />
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
